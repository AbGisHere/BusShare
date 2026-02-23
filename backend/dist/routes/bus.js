"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../models/database");
const router = express_1.default.Router();
router.get('/location/:busId', async (req, res) => {
    try {
        const { busId } = req.params;
        const db = (0, database_1.getDatabase)();
        const bus = await db.get('SELECT bus_number, current_lat, current_lng, last_updated FROM buses WHERE id = ?', [busId]);
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.json(bus);
    }
    catch (error) {
        console.error('Error fetching bus location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/location/update', async (req, res) => {
    try {
        const { busId, lat, lng } = req.body;
        if (!busId || lat === undefined || lng === undefined) {
            return res.status(400).json({ error: 'Bus ID and coordinates are required' });
        }
        const db = (0, database_1.getDatabase)();
        await db.run('UPDATE buses SET current_lat = ?, current_lng = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?', [lat, lng, busId]);
        res.json({ message: 'Location updated successfully' });
    }
    catch (error) {
        console.error('Error updating bus location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/all', async (req, res) => {
    try {
        const db = (0, database_1.getDatabase)();
        const buses = await db.all(`
      SELECT b.id, b.bus_number, b.current_lat, b.current_lng, b.last_updated,
             u.name as driver_name
      FROM buses b
      LEFT JOIN users u ON b.driver_id = u.id
    `);
        res.json(buses);
    }
    catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/driver/:driverId', async (req, res) => {
    try {
        const { driverId } = req.params;
        const db = (0, database_1.getDatabase)();
        const bus = await db.get('SELECT * FROM buses WHERE driver_id = ?', [driverId]);
        if (!bus) {
            return res.status(404).json({ error: 'No bus assigned to driver' });
        }
        res.json(bus);
    }
    catch (error) {
        console.error('Error fetching driver bus:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
