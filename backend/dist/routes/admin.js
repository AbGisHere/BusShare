"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../models/database");
const router = express_1.default.Router();
router.get('/users', async (req, res) => {
    try {
        const db = (0, database_1.getDatabase)();
        const users = await db.all(`
      SELECT id, email, name, role, created_at
      FROM users
      ORDER BY created_at DESC
    `);
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/buses', async (req, res) => {
    try {
        const db = (0, database_1.getDatabase)();
        const buses = await db.all(`
      SELECT b.id, b.bus_number, b.driver_id, b.current_lat, b.current_lng, b.last_updated,
             u.name as driver_name
      FROM buses b
      LEFT JOIN users u ON b.driver_id = u.id
      ORDER BY b.bus_number
    `);
        res.json(buses);
    }
    catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/stats', async (req, res) => {
    try {
        const db = (0, database_1.getDatabase)();
        const userStats = await db.get(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'passenger' THEN 1 END) as total_passengers,
        COUNT(CASE WHEN role = 'driver' THEN 1 END) as total_drivers
      FROM users
    `);
        const busStats = await db.get(`
      SELECT 
        COUNT(*) as total_buses,
        COUNT(CASE WHEN current_lat IS NOT NULL THEN 1 END) as active_buses
      FROM buses
    `);
        const bookingStats = await db.get(`
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN is_scanned = TRUE THEN 10 ELSE 0 END) as total_revenue
      FROM bookings
    `);
        const walletStats = await db.get(`
      SELECT 
        COALESCE(SUM(balance), 0) as wallet_balance_sum
      FROM wallets
    `);
        const stats = {
            total_users: userStats.total_users,
            total_passengers: userStats.total_passengers,
            total_drivers: userStats.total_drivers,
            total_buses: busStats.total_buses,
            active_buses: busStats.active_buses,
            total_bookings: bookingStats.total_bookings,
            total_revenue: bookingStats.total_revenue || 0,
            wallet_balance_sum: walletStats.wallet_balance_sum
        };
        res.json(stats);
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/assign-bus', async (req, res) => {
    try {
        const { busId, driverId } = req.body;
        if (!busId || !driverId) {
            return res.status(400).json({ error: 'Bus ID and Driver ID are required' });
        }
        const db = (0, database_1.getDatabase)();
        // Check if driver exists and is actually a driver
        const driver = await db.get('SELECT id FROM users WHERE id = ? AND role = ?', [driverId, 'driver']);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found or not a driver role' });
        }
        // Check if bus exists
        const bus = await db.get('SELECT id FROM buses WHERE id = ?', [busId]);
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        // Check if driver is already assigned to another bus
        const existingAssignment = await db.get('SELECT id FROM buses WHERE driver_id = ?', [driverId]);
        if (existingAssignment) {
            return res.status(400).json({ error: 'Driver is already assigned to another bus' });
        }
        // Assign bus to driver
        await db.run('UPDATE buses SET driver_id = ? WHERE id = ?', [driverId, busId]);
        res.json({ message: 'Bus assigned successfully' });
    }
    catch (error) {
        console.error('Error assigning bus:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/remove-bus-assignment', async (req, res) => {
    try {
        const { busId } = req.body;
        if (!busId) {
            return res.status(400).json({ error: 'Bus ID is required' });
        }
        const db = (0, database_1.getDatabase)();
        // Check if bus exists
        const bus = await db.get('SELECT id FROM buses WHERE id = ?', [busId]);
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        // Remove driver assignment
        await db.run('UPDATE buses SET driver_id = NULL WHERE id = ?', [busId]);
        res.json({ message: 'Bus assignment removed successfully' });
    }
    catch (error) {
        console.error('Error removing bus assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
