import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database;

export const initializeDatabase = async () => {
  db = await open({
    filename: './bus_share.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone_number TEXT UNIQUE,
      role TEXT NOT NULL CHECK (role IN ('passenger', 'driver', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      balance REAL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS bus_routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_name TEXT UNIQUE NOT NULL,
      route_description TEXT,
      start_point TEXT,
      end_point TEXT,
      stops TEXT, 
      total_distance REAL,
      estimated_time INTEGER, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS buses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bus_number TEXT UNIQUE NOT NULL,
      driver_id INTEGER,
      driver_name TEXT,
      current_lat REAL,
      current_lng REAL,
      last_updated TEXT,
      route_id INTEGER,
      FOREIGN KEY (driver_id) REFERENCES users (id),
      FOREIGN KEY (route_id) REFERENCES bus_routes (id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      bus_id INTEGER NOT NULL,
      seat_number INTEGER NOT NULL,
      qr_code TEXT NOT NULL,
      qr_expires_at DATETIME NOT NULL,
      is_scanned BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (bus_id) REFERENCES buses (id)
    );

    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bus_id INTEGER NOT NULL,
      driver_id INTEGER NOT NULL,
      revenue REAL DEFAULT 0,
      passengers_boarded INTEGER DEFAULT 0,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      FOREIGN KEY (bus_id) REFERENCES buses (id),
      FOREIGN KEY (driver_id) REFERENCES users (id)
    );
  `);

  console.log('Database initialized successfully');
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};
