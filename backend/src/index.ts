import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import { initDB, getDB } from './db';
import { setIO, getIO } from './socket';
import authRoutes from './routes/auth';
import passengerRoutes from './routes/passenger';
import driverRoutes from './routes/driver';
import adminRoutes from './routes/admin';

// Re-export getIO so any module can import it from here if needed
export { getIO };

const app = express();
const server = http.createServer(app);

// ---------- Express middleware ----------
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// ---------- Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/passenger', passengerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------- Seed admin ----------
const seedAdmin = async () => {
  const db = getDB();
  const adminPhone = '+919999999999';

  const existing = await db.get('SELECT id FROM users WHERE phone = ?', [adminPhone]);
  if (!existing) {
    const result = await db.run(
      "INSERT INTO users (name, phone, role) VALUES ('Admin', ?, 'admin')",
      [adminPhone]
    );
    await db.run('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [result.lastID]);
    console.log(`🔑  Admin seeded — phone: ${adminPhone}`);
  } else {
    console.log(`ℹ️   Admin already exists — phone: ${adminPhone}`);
  }
};

// ---------- Start server ----------
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await initDB();
  await seedAdmin();

  // Initialise Socket.io after DB is ready
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  setIO(io);

  io.on('connection', (socket) => {
    console.log(`[Socket] connected: ${socket.id}`);

    // Driver joins their personal room so HTTP routes can target them
    socket.on('driver:join', ({ driverId }: { driverId: number }) => {
      const room = `driver:${driverId}`;
      socket.join(room);
      console.log(`[Socket] ${socket.id} joined room ${room}`);
    });

    // Driver broadcasts their current location; relay to all clients
    socket.on(
      'driver:location',
      (payload: { busId: number; lat: number; lng: number; routeId: number }) => {
        io.emit('bus:moved', payload);
      }
    );

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
