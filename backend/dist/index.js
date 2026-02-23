"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const auth_1 = __importDefault(require("./routes/auth"));
const bus_1 = __importDefault(require("./routes/bus"));
const wallet_1 = __importDefault(require("./routes/wallet"));
const booking_1 = __importDefault(require("./routes/booking"));
const admin_1 = __importDefault(require("./routes/admin"));
const otp_1 = __importDefault(require("./routes/otp"));
const database_1 = require("./models/database");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/bus', bus_1.default);
app.use('/api/wallet', wallet_1.default);
app.use('/api/booking', booking_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/otp', otp_1.default);
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('driver-location-update', (data) => {
        socket.broadcast.emit('bus-location-update', data);
    });
    socket.on('qr-scan', (data) => {
        socket.broadcast.emit('qr-validated', data);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
const startServer = async () => {
    try {
        await (0, database_1.initializeDatabase)();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
    }
};
startServer();
