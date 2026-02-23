import { Router, Request, Response } from 'express';
import { getDB } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// All admin routes require auth + admin role
router.use(requireAuth, requireRole('admin'));

// GET /api/admin/stats
router.get('/stats', async (req: Request, res: Response): Promise<void> => {
  const db = getDB();

  const totalUsers = await db.get('SELECT COUNT(*) AS count FROM users');
  const passengers = await db.get("SELECT COUNT(*) AS count FROM users WHERE role = 'passenger'");
  const drivers = await db.get("SELECT COUNT(*) AS count FROM users WHERE role = 'driver'");
  const buses = await db.get('SELECT COUNT(*) AS count FROM buses');
  const activeBuses = await db.get('SELECT COUNT(*) AS count FROM buses WHERE is_active = 1');
  const totalBookings = await db.get('SELECT COUNT(*) AS count FROM bookings');
  const totalRevenue = await db.get('SELECT COALESCE(SUM(amount), 0) AS total FROM bookings');
  const walletSum = await db.get('SELECT COALESCE(SUM(balance), 0) AS total FROM wallets');

  res.json({
    totalUsers: totalUsers?.count ?? 0,
    passengers: passengers?.count ?? 0,
    drivers: drivers?.count ?? 0,
    buses: buses?.count ?? 0,
    activeBuses: activeBuses?.count ?? 0,
    totalBookings: totalBookings?.count ?? 0,
    totalRevenue: totalRevenue?.total ?? 0,
    walletBalanceSum: walletSum?.total ?? 0,
  });
});

// GET /api/admin/users
router.get('/users', async (req: Request, res: Response): Promise<void> => {
  const db = getDB();
  const users = await db.all(
    `SELECT u.id, u.name, u.phone, u.role, u.created_at, COALESCE(w.balance, 0) AS walletBalance
     FROM users u
     LEFT JOIN wallets w ON u.id = w.user_id
     ORDER BY u.id`
  );
  res.json(users);
});

// POST /api/admin/users
router.post('/users', async (req: Request, res: Response): Promise<void> => {
  const { name, phone, role } = req.body;
  if (!name || !phone || !role) {
    res.status(400).json({ error: 'name, phone, and role are required' });
    return;
  }
  if (!['driver', 'admin'].includes(role)) {
    res.status(400).json({ error: "role must be 'driver' or 'admin'" });
    return;
  }

  const db = getDB();

  const existing = await db.get('SELECT id FROM users WHERE phone = ?', [phone]);
  if (existing) {
    res.status(409).json({ error: 'User with this phone already exists' });
    return;
  }

  const result = await db.run(
    'INSERT INTO users (name, phone, role) VALUES (?, ?, ?)',
    [name, phone, role]
  );
  const userId = result.lastID;
  await db.run('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [userId]);

  const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
  res.status(201).json(user);
});

// GET /api/admin/buses
router.get('/buses', async (req: Request, res: Response): Promise<void> => {
  const db = getDB();
  const buses = await db.all(
    `SELECT b.id, b.number, b.is_active, b.current_lat, b.current_lng, b.last_updated,
            u.name AS driverName, r.name AS routeName
     FROM buses b
     LEFT JOIN users u ON b.driver_id = u.id
     LEFT JOIN routes r ON b.active_route_id = r.id
     ORDER BY b.id`
  );
  res.json(buses.map((b) => ({ ...b, isActive: b.is_active === 1 })));
});

// POST /api/admin/buses
router.post('/buses', async (req: Request, res: Response): Promise<void> => {
  const { number } = req.body;
  if (!number) {
    res.status(400).json({ error: 'Bus number is required' });
    return;
  }

  const db = getDB();
  const existing = await db.get('SELECT id FROM buses WHERE number = ?', [number]);
  if (existing) {
    res.status(409).json({ error: 'Bus with this number already exists' });
    return;
  }

  const result = await db.run('INSERT INTO buses (number) VALUES (?)', [number]);
  const bus = await db.get('SELECT * FROM buses WHERE id = ?', [result.lastID]);
  res.status(201).json(bus);
});

// POST /api/admin/buses/:id/assign
router.post('/buses/:id/assign', async (req: Request, res: Response): Promise<void> => {
  const busId = parseInt(req.params.id, 10);
  const { driverId } = req.body;
  if (!driverId) {
    res.status(400).json({ error: 'driverId is required' });
    return;
  }

  const db = getDB();

  // Unassign the driver from any existing bus
  await db.run('UPDATE buses SET driver_id = NULL WHERE driver_id = ?', [driverId]);

  // Assign to the target bus
  await db.run('UPDATE buses SET driver_id = ? WHERE id = ?', [driverId, busId]);

  const bus = await db.get(
    `SELECT b.*, u.name AS driverName, r.name AS routeName
     FROM buses b
     LEFT JOIN users u ON b.driver_id = u.id
     LEFT JOIN routes r ON b.active_route_id = r.id
     WHERE b.id = ?`,
    [busId]
  );

  if (!bus) {
    res.status(404).json({ error: 'Bus not found' });
    return;
  }

  res.json({ ...bus, isActive: bus.is_active === 1 });
});

// POST /api/admin/buses/:id/unassign
router.post('/buses/:id/unassign', async (req: Request, res: Response): Promise<void> => {
  const busId = parseInt(req.params.id, 10);
  const db = getDB();

  await db.run('UPDATE buses SET driver_id = NULL WHERE id = ?', [busId]);

  const bus = await db.get('SELECT * FROM buses WHERE id = ?', [busId]);
  if (!bus) {
    res.status(404).json({ error: 'Bus not found' });
    return;
  }

  res.json({ ...bus, isActive: bus.is_active === 1 });
});

// GET /api/admin/routes
router.get('/routes', async (req: Request, res: Response): Promise<void> => {
  const db = getDB();
  const routes = await db.all('SELECT * FROM routes ORDER BY name');
  res.json(
    routes.map((r) => ({
      ...r,
      stops: r.stops ? JSON.parse(r.stops) : [],
    }))
  );
});

// POST /api/admin/routes
router.post('/routes', async (req: Request, res: Response): Promise<void> => {
  const { name, stops, description } = req.body;
  if (!name || !Array.isArray(stops) || stops.length === 0) {
    res.status(400).json({ error: 'name and stops (array) are required' });
    return;
  }

  const db = getDB();
  const stopsJson = JSON.stringify(stops);

  const result = await db.run(
    'INSERT INTO routes (name, stops, description) VALUES (?, ?, ?)',
    [name, stopsJson, description || null]
  );

  const route = await db.get('SELECT * FROM routes WHERE id = ?', [result.lastID]);
  res.status(201).json({
    ...route,
    stops: JSON.parse(route.stops),
  });
});

// DELETE /api/admin/routes/:id
router.delete('/routes/:id', async (req: Request, res: Response): Promise<void> => {
  const routeId = parseInt(req.params.id, 10);
  const db = getDB();

  await db.run('DELETE FROM routes WHERE id = ?', [routeId]);
  res.json({ success: true });
});

export default router;
