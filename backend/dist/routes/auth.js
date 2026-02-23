"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../models/database");
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bus-share-secret';
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role, phoneNumber } = req.body;
        if (!email || !password || !name || !role) {
            return res.status(400).json({ error: 'Email, password, name, and role are required' });
        }
        if (!['passenger', 'driver', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        const db = (0, database_1.getDatabase)();
        // Check if email exists
        const existingEmail = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        // Check if phone number exists (if provided)
        if (phoneNumber) {
            const existingPhone = await db.get('SELECT id FROM users WHERE phone_number = ?', [phoneNumber]);
            if (existingPhone) {
                return res.status(400).json({ error: 'Phone number already exists' });
            }
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const result = await db.run('INSERT INTO users (email, password, name, role, phone_number) VALUES (?, ?, ?, ?, ?)', [email, hashedPassword, name, role, phoneNumber || null]);
        await db.run('INSERT INTO wallets (user_id, balance) VALUES (?, ?)', [result.lastID, 0]);
        const token = jsonwebtoken_1.default.sign({ userId: result.lastID, email, role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: result.lastID, email, name, role }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const db = (0, database_1.getDatabase)();
        const user = await db.get('SELECT id, email, password, name, role FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
