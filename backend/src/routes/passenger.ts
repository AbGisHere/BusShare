import { Router, Request, Response } from 'express';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/passenger/buses — public, no auth required
router.get('/buses', async (req: Request, res: Response): Promise<void> => {
  const db = getDB();

  const buses = await db.all(`
    SELECT
      b.id,
      b.number,
      u.name AS driverName,
      r.name AS routeName,
      r.stops,
      b.current_lat AS currentLat,
      b.current_lng AS currentLng,
      b.last_updated AS lastUpdated,
      b.is_active AS isActive
    FROM buses b
    LEFT JOIN users u ON b.driver_id = u.id
    LEFT JOIN routes r ON b.active_route_id = r.id
    WHERE b.is_active = 1
  `);

  const inactiveRow = await db.get('SELECT COUNT(*) AS count FROM buses WHERE is_active = 0');
  const inactiveCount = inactiveRow ? inactiveRow.count : 0;

  const result = buses.map((b) => ({
    ...b,
    stops: b.stops ? JSON.parse(b.stops) : [],
    isActive: b.isActive === 1,
  }));

  res.json({ buses: result, inactiveCount });
});

// GET /api/passenger/wallet
router.get('/wallet', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const db = getDB();
  const wallet = await db.get('SELECT balance FROM wallets WHERE user_id = ?', [req.user.id]);
  if (!wallet) {
    res.status(404).json({ error: 'Wallet not found' });
    return;
  }
  res.json({ balance: wallet.balance });
});

// POST /api/passenger/wallet/topup
router.post('/wallet/topup', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { amount } = req.body;
  if (typeof amount !== 'number' || amount <= 0 || amount > 10000) {
    res.status(400).json({ error: 'Amount must be a number between 1 and 10000' });
    return;
  }

  const db = getDB();
  const wallet = await db.get('SELECT * FROM wallets WHERE user_id = ?', [req.user.id]);
  if (!wallet) {
    res.status(404).json({ error: 'Wallet not found' });
    return;
  }

  const newBalance = wallet.balance + amount;
  await db.run('UPDATE wallets SET balance = ? WHERE user_id = ?', [newBalance, req.user.id]);
  await db.run(
    "INSERT INTO wallet_tx (user_id, amount, type, description) VALUES (?, ?, 'topup', ?)",
    [req.user.id, amount, `Top-up of ₹${amount}`]
  );

  res.json({ balance: newBalance });
});

// POST /api/passenger/booking/pay
router.post('/booking/pay', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { busId } = req.body;
  if (!busId) {
    res.status(400).json({ error: 'busId is required' });
    return;
  }

  const db = getDB();

  // Check wallet balance
  const wallet = await db.get('SELECT * FROM wallets WHERE user_id = ?', [req.user.id]);
  if (!wallet || wallet.balance < 20) {
    res.status(400).json({ error: 'Insufficient wallet balance. Minimum ₹20 required.' });
    return;
  }

  // Check bus is active
  const bus = await db.get(
    `SELECT b.*, r.name AS routeName
     FROM buses b
     LEFT JOIN routes r ON b.active_route_id = r.id
     WHERE b.id = ? AND b.is_active = 1`,
    [busId]
  );
  if (!bus) {
    res.status(404).json({ error: 'Bus not found or not active' });
    return;
  }

  // Generate unique token and QR code
  const qrToken = uuidv4();
  const qrImage = await QRCode.toDataURL(qrToken);

  // Deduct ₹20 from wallet
  const newBalance = wallet.balance - 20;
  await db.run('UPDATE wallets SET balance = ? WHERE user_id = ?', [newBalance, req.user.id]);

  // Insert booking
  const result = await db.run(
    'INSERT INTO bookings (user_id, bus_id, amount, qr_token, qr_image) VALUES (?, ?, 20, ?, ?)',
    [req.user.id, busId, qrToken, qrImage]
  );

  // Record wallet transaction
  await db.run(
    "INSERT INTO wallet_tx (user_id, amount, type, description) VALUES (?, ?, 'payment', ?)",
    [req.user.id, -20, `Bus ticket - Bus #${bus.number}`]
  );

  res.status(201).json({
    bookingId: result.lastID,
    qrToken,
    qrImage,
    busNumber: bus.number,
    routeName: bus.routeName,
    balance: newBalance,
  });
});

// GET /api/passenger/booking/active
router.get('/booking/active', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const db = getDB();

  const booking = await db.get(
    `SELECT
       bk.id,
       bk.qr_token AS qrToken,
       bk.qr_image AS qrImage,
       bk.amount,
       bk.created_at AS createdAt,
       b.number AS busNumber,
       r.name AS routeName,
       r.stops
     FROM bookings bk
     JOIN buses b ON bk.bus_id = b.id
     LEFT JOIN routes r ON b.active_route_id = r.id
     WHERE bk.user_id = ? AND bk.scanned_at IS NULL
     ORDER BY bk.id DESC
     LIMIT 1`,
    [req.user.id]
  );

  if (!booking) {
    res.json({ booking: null });
    return;
  }

  res.json({
    booking: {
      ...booking,
      stops: booking.stops ? JSON.parse(booking.stops) : [],
    },
  });
});

export default router;
