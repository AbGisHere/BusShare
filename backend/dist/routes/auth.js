"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'busshare_secret_2024';
// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        res.status(400).json({ error: 'Phone is required' });
        return;
    }
    const db = (0, db_1.getDB)();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    await db.run('INSERT INTO otps (phone, code, expires_at, used) VALUES (?, ?, ?, 0)', [phone, code, expiresAt]);
    const response = {
        message: 'OTP sent successfully',
    };
    if (process.env.NODE_ENV !== 'production') {
        response.otp = code;
    }
    res.json(response);
});
// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { phone, code } = req.body;
    if (!phone || !code) {
        res.status(400).json({ error: 'Phone and code are required' });
        return;
    }
    const db = (0, db_1.getDB)();
    const now = new Date().toISOString();
    const otp = await db.get('SELECT * FROM otps WHERE phone = ? AND code = ? AND used = 0 AND expires_at > ? ORDER BY id DESC LIMIT 1', [phone, code, now]);
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
    const token = jsonwebtoken_1.default.sign({ id: user.id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
        token,
        user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
    });
});
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone) {
        res.status(400).json({ error: 'Name and phone are required' });
        return;
    }
    const db = (0, db_1.getDB)();
    const existing = await db.get('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existing) {
        res.status(409).json({ error: 'User with this phone already exists' });
        return;
    }
    const result = await db.run("INSERT INTO users (name, phone, role) VALUES (?, ?, 'passenger')", [name, phone]);
    const userId = result.lastID;
    await db.run('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [userId]);
    // Send OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    await db.run('INSERT INTO otps (phone, code, expires_at, used) VALUES (?, ?, ?, 0)', [phone, code, expiresAt]);
    const response = {
        message: 'Registration successful. OTP sent.',
    };
    if (process.env.NODE_ENV !== 'production') {
        response.otp = code;
    }
    res.status(201).json(response);
});
exports.default = router;
