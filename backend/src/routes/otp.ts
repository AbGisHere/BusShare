import express from 'express';
import { getDatabase } from '../models/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bus-share-secret';

// Store OTPs in memory (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP (in production, use SMS service like Twilio)
const sendOTP = async (phoneNumber: string, otp: string) => {
  console.log(`OTP for ${phoneNumber}: ${otp}`);
  // In production, integrate with SMS service
  // Example with Twilio:
  // await twilioClient.messages.create({
  //   body: `Your Bus Share OTP is: ${otp}`,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phoneNumber
  // });
  return true;
};

router.post('/send', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Validate phone number format (basic validation)
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const db = getDatabase();
    
    // Check if user exists with this phone number
    const user = await db.get('SELECT * FROM users WHERE phone_number = ?', [phoneNumber]);
    
    if (!user) {
      return res.status(404).json({ error: 'No account found with this phone number' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    
    // Store OTP
    otpStore.set(phoneNumber, { otp, expiresAt, attempts: 0 });
    
    // Send OTP
    await sendOTP(phoneNumber, otp);
    
    res.json({ 
      message: 'OTP sent successfully',
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const storedData = otpStore.get(phoneNumber);
    
    if (!storedData) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Check attempts (max 3 attempts)
    if (storedData.attempts >= 3) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ error: 'Too many attempts. Please request a new OTP' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts++;
      return res.status(400).json({ 
        error: 'Invalid OTP',
        attemptsRemaining: 3 - storedData.attempts
      });
    }

    // OTP is correct, get user and generate token
    const db = getDatabase();
    const user = await db.get('SELECT * FROM users WHERE phone_number = ?', [phoneNumber]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Clear OTP
    otpStore.delete(phoneNumber);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/resend', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Clear existing OTP if any
    otpStore.delete(phoneNumber);
    
    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    
    // Store OTP
    otpStore.set(phoneNumber, { otp, expiresAt, attempts: 0 });
    
    // Send OTP
    await sendOTP(phoneNumber, otp);
    
    res.json({ 
      message: 'OTP resent successfully',
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
