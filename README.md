# Bus Share - Bus Tracking and Booking System

A comprehensive bus tracking and booking system with real-time location updates, QR code-based ticketing, and wallet management.

## Features

### For Passengers
- **User Authentication**: Secure login and registration system
- **Real-time Bus Tracking**: View nearest bus arrival times
- **Digital Wallet**: Add money and manage balance
- **Seat Booking**: Book seats on available buses
- **QR Code Tickets**: Generate QR codes valid for 15 minutes
- **Bus Information**: View bus numbers and current status

### For Drivers
- **Driver Dashboard**: Comprehensive management interface
- **Location Updates**: Update bus location in real-time
- **QR Code Scanning**: Validate passenger tickets
- **Passenger Management**: View boarded passengers and details
- **Revenue Tracking**: Monitor trip revenue and statistics

## Technology Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** for REST API
- **SQLite** for database
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **QRCode** for ticket generation

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io-client** for real-time updates
- **QRCode.js** for QR code display

## Color Scheme
- **Primary**: #01161E (Blue/Black)
- **Secondary**: #84A98C (Green)

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Quick Start
From the root directory, you can install all dependencies and start both servers:
```bash
npm run install-deps
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Bus Management
- `GET /api/bus/all` - Get all buses
- `GET /api/bus/location/:busId` - Get bus location
- `POST /api/bus/location/update` - Update bus location
- `GET /api/bus/driver/:driverId` - Get driver's assigned bus

### Wallet Management
- `GET /api/wallet/balance/:userId` - Get wallet balance
- `POST /api/wallet/add` - Add money to wallet
- `POST /api/wallet/deduct` - Deduct money from wallet

### Booking Management
- `POST /api/booking/create` - Create new booking
- `POST /api/booking/validate` - Validate QR code
- `GET /api/booking/user/:userId` - Get user bookings
- `GET /api/booking/driver/:driverId` - Get driver passenger data

## Database Schema

### Users Table
- id, email, password, name, role, created_at

### Wallets Table
- id, user_id, balance

### Buses Table
- id, bus_number, driver_id, current_lat, current_lng, last_updated

### Bookings Table
- id, user_id, bus_id, seat_number, qr_code, qr_expires_at, is_scanned, created_at

### Trips Table
- id, bus_id, driver_id, revenue, passengers_boarded, started_at, ended_at

## Usage

### For Passengers
1. Register as a passenger
2. Login to view dashboard
3. Add money to wallet
4. View available buses and nearest arrival times
5. Book a seat on your preferred bus
6. Receive QR code valid for 15 minutes
7. Show QR code to driver for validation

### For Drivers
1. Register as a driver
2. Login to driver dashboard
3. Update bus location periodically
4. Scan passenger QR codes for validation
5. View passenger statistics and revenue

## Real-time Features
- Bus location updates via Socket.io
- QR code validation notifications
- Live passenger count updates

## Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- QR code expiration (15 minutes)
- Input validation and sanitization

## Future Enhancements
- Real-time GPS integration
- Payment gateway integration
- Mobile app development
- Advanced analytics dashboard
- Multi-route support
- Rating system for drivers and passengers
