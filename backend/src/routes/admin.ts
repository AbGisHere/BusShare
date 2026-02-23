import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../models/database';

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const db = getDatabase();
    
    const users = await db.all(`
      SELECT id, email, name, role, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/buses', async (req, res) => {
  try {
    const db = getDatabase();
    
    const buses = await db.all(`
      SELECT b.id, b.bus_number, b.driver_id, b.driver_name, b.current_lat, b.current_lng, b.last_updated, b.route_id,
             u.name as driver_name, u.phone_number as driver_phone,
             r.route_name, r.start_point, r.end_point
      FROM buses b
      LEFT JOIN users u ON b.driver_id = u.id
      LEFT JOIN bus_routes r ON b.route_id = r.id
      ORDER BY b.bus_number
    `);

    res.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const db = getDatabase();
    
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
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create-user', async (req, res) => {
  try {
    const { name, phoneNumber, role } = req.body;
    
    if (!name || !phoneNumber || !role) {
      return res.status(400).json({ error: 'Name, phone number, and role are required' });
    }

    if (!['driver', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Admin can only create driver or admin accounts' });
    }

    const db = getDatabase();
    
    // Check if phone number exists
    const existingPhone = await db.get('SELECT id FROM users WHERE phone_number = ?', [phoneNumber]);
    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    // Generate a random email for internal use (required by database)
    const email = `user-${phoneNumber.replace(/[^\d]/g, '')}@busshare.internal`;
    const password = Math.random().toString(36).slice(-8); // Random password

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.run(
      'INSERT INTO users (email, password, name, role, phone_number) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, role, phoneNumber]
    );

    await db.run('INSERT INTO wallets (user_id, balance) VALUES (?, ?)', [result.lastID, 0]);

    res.status(201).json({
      message: `${role} account created successfully`,
      user: { id: result.lastID, email, name, role, phoneNumber }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create-bus', async (req, res) => {
  try {
    const { busNumber, routeId } = req.body;
    
    if (!busNumber) {
      return res.status(400).json({ error: 'Bus number is required' });
    }

    const db = getDatabase();
    
    // Check if bus number already exists
    const existingBus = await db.get('SELECT id FROM buses WHERE bus_number = ?', [busNumber]);
    if (existingBus) {
      return res.status(400).json({ error: 'Bus number already exists' });
    }

    // Check if route exists (if provided)
    if (routeId) {
      const route = await db.get('SELECT id FROM bus_routes WHERE id = ?', [routeId]);
      if (!route) {
        return res.status(400).json({ error: 'Route not found' });
      }
    }

    const result = await db.run(
      'INSERT INTO buses (bus_number, route_id) VALUES (?, ?)',
      [busNumber, routeId || null]
    );

    res.status(201).json({
      message: 'Bus created successfully',
      bus: { id: result.lastID, bus_number: busNumber, route_id: routeId }
    });
  } catch (error) {
    console.error('Create bus error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create-route', async (req, res) => {
  try {
    const { routeName, routeDescription, startPoint, endPoint, stops, totalDistance, estimatedTime } = req.body;
    
    if (!routeName || !startPoint || !endPoint) {
      return res.status(400).json({ error: 'Route name, start point, and end point are required' });
    }

    const db = getDatabase();
    
    // Check if route name already exists
    const existingRoute = await db.get('SELECT id FROM bus_routes WHERE route_name = ?', [routeName]);
    if (existingRoute) {
      return res.status(400).json({ error: 'Route name already exists' });
    }

    const stopsJson = JSON.stringify(stops || []);
    
    const result = await db.run(
      'INSERT INTO bus_routes (route_name, route_description, start_point, end_point, stops, total_distance, estimated_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [routeName, routeDescription || null, startPoint, endPoint, stopsJson, totalDistance || null, estimatedTime || null]
    );

    res.status(201).json({
      message: 'Route created successfully',
      route: { 
        id: result.lastID, 
        route_name: routeName, 
        route_description: routeDescription,
        start_point: startPoint,
        end_point: endPoint,
        stops: stops,
        total_distance: totalDistance,
        estimated_time: estimatedTime
      }
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/assign-route-to-bus', async (req, res) => {
  try {
    const { busId, routeId } = req.body;
    
    if (!busId || !routeId) {
      return res.status(400).json({ error: 'Bus ID and Route ID are required' });
    }

    const db = getDatabase();
    
    // Check if bus exists
    const bus = await db.get('SELECT id FROM buses WHERE id = ?', [busId]);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    // Check if route exists
    const route = await db.get('SELECT id FROM bus_routes WHERE id = ?', [routeId]);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    await db.run('UPDATE buses SET route_id = ? WHERE id = ?', [routeId, busId]);

    res.json({ message: 'Route assigned to bus successfully' });
  } catch (error) {
    console.error('Assign route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/routes', async (req, res) => {
  try {
    const db = getDatabase();
    
    const routes = await db.all(`
      SELECT id, route_name, route_description, start_point, end_point, stops, total_distance, estimated_time, created_at
      FROM bus_routes
      ORDER BY created_at DESC
    `);

    // Parse stops from JSON
    const routesWithParsedStops = routes.map(route => ({
      ...route,
      stops: route.stops ? JSON.parse(route.stops) : []
    }));

    res.json(routesWithParsedStops);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/assign-bus', async (req, res) => {
  try {
    const { busId, driverId } = req.body;
    
    if (!busId || !driverId) {
      return res.status(400).json({ error: 'Bus ID and Driver ID are required' });
    }

    const db = getDatabase();
    
    // Check if driver exists and is actually a driver
    const driver = await db.get(
      'SELECT id FROM users WHERE id = ? AND role = ?',
      [driverId, 'driver']
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found or not a driver role' });
    }

    // Check if bus exists
    const bus = await db.get(
      'SELECT id FROM buses WHERE id = ?',
      [busId]
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    // Check if driver is already assigned to another bus
    const existingAssignment = await db.get(
      'SELECT id FROM buses WHERE driver_id = ?',
      [driverId]
    );

    if (existingAssignment) {
      return res.status(400).json({ error: 'Driver is already assigned to another bus' });
    }

    // Assign bus to driver
    await db.run(
      'UPDATE buses SET driver_id = ? WHERE id = ?',
      [driverId, busId]
    );

    res.json({ message: 'Bus assigned successfully' });
  } catch (error) {
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

    const db = getDatabase();
    
    // Check if bus exists
    const bus = await db.get(
      'SELECT id FROM buses WHERE id = ?',
      [busId]
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    // Remove driver assignment
    await db.run(
      'UPDATE buses SET driver_id = NULL WHERE id = ?',
      [busId]
    );

    res.json({ message: 'Bus assignment removed successfully' });
  } catch (error) {
    console.error('Error removing bus assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
