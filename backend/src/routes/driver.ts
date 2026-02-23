import { Router, Request, Response } from 'express';
import { getDB } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { getIO } from '../socket';

const router = Router();

// All driver routes require auth + driver role
router.use(requireAuth, requireRole('driver'));

// GET /api/driver/bus
router.get('/bus', async (req: Request, res: Response): Promise<void> => {
  const db = getDB();
  const bus = await db.get(
    `SELECT b.*, r.name AS routeName, r.stops
     FROM buses b
     LEFT JOIN routes r ON b.active_route_id = r.id
     WHERE b.driver_id = ?`,
    [req.user.id]
  );

  if (!bus) {
    res.status(404).json({ error: 'No bus assigned to this driver' });
    return;
  }

  res.json({
    ...bus,
    stops: bus.stops ? JSON.parse(bus.stops) : [],
    isActive: bus.is_active === 1,
  });
});

// GET /api/driver/routes
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

// POST /api/driver/start
router.post('/start', async (req: Request, res: Response): Promise<void> => {
  const { routeId } = req.body;
  if (!routeId) {
    res.status(400).json({ error: 'routeId is required' });
    return;
  }

  const db = getDB();
  const now = new Date().toISOString();

  await db.run(
    'UPDATE buses SET active_route_id = ?, is_active = 1, last_updated = ? WHERE driver_id = ?',
    [routeId, now, req.user.id]
  );

  const bus = await db.get(
    `SELECT b.*, r.name AS routeName, r.stops
     FROM buses b
     LEFT JOIN routes r ON b.active_route_id = r.id
     WHERE b.driver_id = ?`,
    [req.user.id]
  );

  if (!bus) {
    res.status(404).json({ error: 'No bus assigned to this driver' });
    return;
  }

  res.json({
    ...bus,
    stops: bus.stops ? JSON.parse(bus.stops) : [],
    isActive: bus.is_active === 1,
  });
});

// POST /api/driver/end
router.post('/end', async (req: Request, res: Response): Promise<void> => {
  const db = getDB();

  await db.run(
    'UPDATE buses SET is_active = 0, active_route_id = NULL, current_lat = NULL, current_lng = NULL WHERE driver_id = ?',
    [req.user.id]
  );

  res.json({ success: true });
});

// POST /api/driver/location
router.post('/location', async (req: Request, res: Response): Promise<void> => {
  const { lat, lng } = req.body;
  if (lat === undefined || lng === undefined) {
    res.status(400).json({ error: 'lat and lng are required' });
    return;
  }

  const db = getDB();
  const now = new Date().toISOString();

  await db.run(
    'UPDATE buses SET current_lat = ?, current_lng = ?, last_updated = ? WHERE driver_id = ?',
    [lat, lng, now, req.user.id]
  );

  res.json({ ok: true });
});

// POST /api/driver/scan
router.post('/scan', async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;
  if (!token) {
    res.json({ valid: false, reason: 'Token is required' });
    return;
  }

  const db = getDB();

  const booking = await db.get(
    `SELECT bk.*, u.name AS passengerName, b.number AS busNumber, b.driver_id
     FROM bookings bk
     JOIN users u ON bk.user_id = u.id
     JOIN buses b ON bk.bus_id = b.id
     WHERE bk.qr_token = ?`,
    [token]
  );

  if (!booking) {
    res.json({ valid: false, reason: 'Booking not found' });
    return;
  }

  if (booking.scanned_at) {
    res.json({ valid: false, reason: 'QR code already scanned' });
    return;
  }

  if (booking.driver_id !== req.user.id) {
    res.json({ valid: false, reason: 'This ticket does not belong to your bus' });
    return;
  }

  const now = new Date().toISOString();
  await db.run('UPDATE bookings SET scanned_at = ? WHERE qr_token = ?', [now, token]);

  // Emit QR scan result via Socket.io to the driver's room
  try {
    const io = getIO();
    io.to(`driver:${req.user.id}`).emit('qr:result', {
      valid: true,
      passengerName: booking.passengerName,
      busNumber: booking.busNumber,
    });
  } catch {
    // io may not be available in tests; ignore
  }

  res.json({
    valid: true,
    passengerName: booking.passengerName,
    busNumber: booking.busNumber,
  });
});

// GET /api/driver/stats
router.get('/stats', async (req: Request, res: Response): Promise<void> => {
  const db = getDB();

  const bus = await db.get('SELECT id FROM buses WHERE driver_id = ?', [req.user.id]);
  if (!bus) {
    res.json({ scanCount: 0, totalRevenue: 0 });
    return;
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const statsRow = await db.get(
    `SELECT COUNT(*) AS scanCount, SUM(amount) AS totalRevenue
     FROM bookings
     WHERE bus_id = ? AND scanned_at IS NOT NULL AND DATE(scanned_at) = ?`,
    [bus.id, today]
  );

  res.json({
    scanCount: statsRow ? statsRow.scanCount || 0 : 0,
    totalRevenue: statsRow ? statsRow.totalRevenue || 0 : 0,
  });
});

export default router;
