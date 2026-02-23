import express from 'express';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../models/database';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { userId, busId, seatNumber } = req.body;
    
    if (!userId || !busId || !seatNumber) {
      return res.status(400).json({ error: 'User ID, bus ID, and seat number are required' });
    }

    const db = getDatabase();
    
    const existingBooking = await db.get(
      'SELECT id FROM bookings WHERE bus_id = ? AND seat_number = ? AND is_scanned = FALSE',
      [busId, seatNumber]
    );

    if (existingBooking) {
      return res.status(400).json({ error: 'Seat already booked' });
    }

    const qrId = uuidv4();
    const qrExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    const qrData = JSON.stringify({
      bookingId: qrId,
      userId,
      busId,
      seatNumber,
      expiresAt: qrExpiresAt.toISOString()
    });

    const qrCode = await QRCode.toDataURL(qrData);

    const result = await db.run(
      'INSERT INTO bookings (user_id, bus_id, seat_number, qr_code, qr_expires_at) VALUES (?, ?, ?, ?, ?)',
      [userId, busId, seatNumber, qrData, qrExpiresAt.toISOString()]
    );

    res.json({
      message: 'Booking created successfully',
      bookingId: result.lastID,
      qrCode,
      expiresAt: qrExpiresAt
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ error: 'QR data is required' });
    }

    const parsedData = JSON.parse(qrData);
    const { bookingId, userId, busId, seatNumber, expiresAt } = parsedData;

    const db = getDatabase();
    
    const booking = await db.get(
      'SELECT * FROM bookings WHERE user_id = ? AND bus_id = ? AND seat_number = ? AND is_scanned = FALSE',
      [userId, busId, seatNumber]
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or already scanned' });
    }

    const expirationTime = new Date(expiresAt);
    if (new Date() > expirationTime) {
      return res.status(400).json({ error: 'QR code has expired' });
    }

    await db.run(
      'UPDATE bookings SET is_scanned = TRUE WHERE id = ?',
      [booking.id]
    );

    await db.run(
      'INSERT INTO trips (bus_id, driver_id, revenue, passengers_boarded) VALUES (?, ?, 1, 1)',
      [busId, null]
    );

    res.json({
      message: 'APPROVED',
      bookingId: booking.id,
      userId,
      seatNumber
    });
  } catch (error) {
    console.error('Error validating QR code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDatabase();
    
    const bookings = await db.all(`
      SELECT b.*, bus.bus_number
      FROM bookings b
      JOIN buses bus ON b.bus_id = bus.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/driver/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    const db = getDatabase();
    
    const bus = await db.get(
      'SELECT id FROM buses WHERE driver_id = ?',
      [driverId]
    );

    if (!bus) {
      return res.status(404).json({ error: 'No bus assigned to driver' });
    }

    const passengers = await db.all(`
      SELECT b.*, u.name as passenger_name, u.email
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.bus_id = ? AND b.is_scanned = TRUE
      ORDER BY b.created_at DESC
    `, [bus.id]);

    const stats = await db.get(`
      SELECT 
        COUNT(*) as total_passengers,
        SUM(CASE WHEN is_scanned = TRUE THEN 1 ELSE 0 END) as boarded_passengers,
        COUNT(*) * 10 as total_revenue
      FROM bookings
      WHERE bus_id = ?
    `, [bus.id]);

    res.json({
      passengers,
      stats: {
        total_bookings: stats.total_passengers,
        boarded_passengers: stats.boarded_passengers,
        revenue: stats.total_revenue || 0
      }
    });
  } catch (error) {
    console.error('Error fetching driver data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
