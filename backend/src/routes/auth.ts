import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getDB } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'busshare_secret_2024';

// POST /api/auth/send-otp
router.post('/send-otp', async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: 'Phone is required' });
    return;
  }

  const db = getDB();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  await db.run(
    'INSERT INTO otps (phone, code, expires_at, used) VALUES (?, ?, ?, 0)',
    [phone, code, expiresAt]
  );

  const response: { message: string; otp?: string } = {
    message: 'OTP sent successfully',
  };

  if (process.env.NODE_ENV !== 'production') {
    response.otp = code;
  }

  res.json(response);
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req: Request, res: Response): Promise<void> => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    res.status(400).json({ error: 'Phone and code are required' });
    return;
  }

  const db = getDB();
  const now = new Date().toISOString();

  const otp = await db.get(
    'SELECT * FROM otps WHERE phone = ? AND code = ? AND used = 0 AND expires_at > ? ORDER BY id DESC LIMIT 1',
    [phone, code, now]
  );

  if (!otp) {
    res.status(400).json({ error: 'Invalid or expired OTP' });
    return;
  }

  await db.run('UPDATE otps SET used = 1 WHERE id = ?', [otp.id]);

  const user = await db.get('SELECT * FROM users WHERE phone = ?', [phone]);
  if (!user) {
    res.json({ exists: false });
    return;
  }

  const token = jwt.sign(
    { id: user.id, phone: user.phone, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
  });
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    res.status(400).json({ error: 'Name and phone are required' });
    return;
  }

  const db = getDB();

  const existing = await db.get('SELECT id FROM users WHERE phone = ?', [phone]);
  if (existing) {
    res.status(409).json({ error: 'User with this phone already exists' });
    return;
  }

  const result = await db.run(
    "INSERT INTO users (name, phone, role) VALUES (?, ?, 'passenger')",
    [name, phone]
  );
  const userId = result.lastID;

  await db.run('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [userId]);

  // Send OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  await db.run(
    'INSERT INTO otps (phone, code, expires_at, used) VALUES (?, ?, ?, 0)',
    [phone, code, expiresAt]
  );

  const response: { message: string; otp?: string } = {
    message: 'Registration successful. OTP sent.',
  };

  if (process.env.NODE_ENV !== 'production') {
    response.otp = code;
  }

  res.status(201).json(response);
});

export default router;
