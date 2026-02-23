import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import authRoutes from './routes/auth';
import busRoutes from './routes/bus';
import walletRoutes from './routes/wallet';
import bookingRoutes from './routes/booking';
import adminRoutes from './routes/admin';
import otpRoutes from './routes/otp';
import { initializeDatabase } from './models/database';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/otp', otpRoutes);

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
    await initializeDatabase();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
