"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const db_1 = require("./db");
const socket_1 = require("./socket");
Object.defineProperty(exports, "getIO", { enumerable: true, get: function () { return socket_1.getIO; } });
const auth_1 = __importDefault(require("./routes/auth"));
const passenger_1 = __importDefault(require("./routes/passenger"));
const driver_1 = __importDefault(require("./routes/driver"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// ---------- Express middleware ----------
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
// ---------- Routes ----------
app.use('/api/auth', auth_1.default);
app.use('/api/passenger', passenger_1.default);
app.use('/api/driver', driver_1.default);
app.use('/api/admin', admin_1.default);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ---------- Seed admin ----------
const seedAdmin = async () => {
    const db = (0, db_1.getDB)();
    const adminPhone = '+919999999999';
    const existing = await db.get('SELECT id FROM users WHERE phone = ?', [adminPhone]);
    if (!existing) {
        const result = await db.run("INSERT INTO users (name, phone, role) VALUES ('Admin', ?, 'admin')", [adminPhone]);
        await db.run('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [result.lastID]);
        console.log(`🔑  Admin seeded — phone: ${adminPhone}`);
    }
    else {
        console.log(`ℹ️   Admin already exists — phone: ${adminPhone}`);
    }
};
// ---------- Start server ----------
const PORT = process.env.PORT || 5001;
const startServer = async () => {
    await (0, db_1.initDB)();
    await seedAdmin();
    // Initialise Socket.io after DB is ready
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });
    (0, socket_1.setIO)(io);
    io.on('connection', (socket) => {
        console.log(`[Socket] connected: ${socket.id}`);
        // Driver joins their personal room so HTTP routes can target them
        socket.on('driver:join', ({ driverId }) => {
            const room = `driver:${driverId}`;
            socket.join(room);
            console.log(`[Socket] ${socket.id} joined room ${room}`);
        });
        // Driver broadcasts their current location; relay to all clients
        socket.on('driver:location', (payload) => {
            io.emit('bus:moved', payload);
        });
        socket.on('disconnect', () => {
            console.log(`[Socket] disconnected: ${socket.id}`);
        });
    });
    server.listen(PORT, () => {
        console.log(`🚌  Bus-Share backend running on http://localhost:${PORT}`);
    });
};
startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
