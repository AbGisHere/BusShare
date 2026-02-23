import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../models/database';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bus-share-secret';

router.post('/register', async (req, res) => {
  try {
    const { name, role, phoneNumber } = req.body;
    
    if (!name || !role || !phoneNumber) {
      return res.status(400).json({ error: 'Name, role, and phone number are required' });
    }

    // Only allow passenger registration via public API
    if (role !== 'passenger') {
      return res.status(403).json({ error: 'Only passenger accounts can be created via public registration' });
    }

    const db = getDatabase();
    
    // Check if phone number exists
    const existingPhone = await db.get('SELECT id FROM users WHERE phone_number = ?', [phoneNumber]);
    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    // Generate a random email for internal use (required by database)
    const email = `user-${phoneNumber.replace(/[^\d]/g, '')}@busshare.internal`;
    const password = Math.random().toString(36).slice(-8); // Random password

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.run(
      'INSERT INTO users (email, password, name, role, phone_number) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, role, phoneNumber]
    );

    await db.run('INSERT INTO wallets (user_id, balance) VALUES (?, ?)', [result.lastID, 0]);

    const token = jwt.sign(
      { userId: result.lastID, email, role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.lastID, email, name, role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
