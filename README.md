# Bus-Share v3.0

A real-time campus bus booking platform. Passengers book ₹20 rides and get a QR ticket. Drivers broadcast GPS, scan tickets via camera, and get verbal confirmation. Admins manage users, buses, and routes.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue) ![Three.js](https://img.shields.io/badge/Three.js-decorative-orange) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

**Passenger**
- Live bus cards — see all active buses, their routes and stops
- Pay ₹20 via mock Razorpay checkout → get QR ticket instantly
- Active ticket always visible on dashboard

**Driver**
- Pick route when starting shift
- GPS auto-broadcasts to all connected clients via Socket.io
- Camera QR scanner (html5-qrcode) with instant valid/invalid overlay
- Optional verbal TTS confirmation on scan
- Today's scan count and revenue at a glance

**Admin**
- System stats (users, buses, bookings, revenue)
- Create/manage users (drivers & admins)
- Create buses and assign drivers
- Create/delete routes with custom stops

**General**
- OTP phone login — no passwords
- Passengers self-register; drivers/admins created by admin
- Decorative 3D hero scene (React Three Fiber) on landing/login pages

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript 4.9, React Router v7 |
| 3D | React Three Fiber, @react-three/drei, Three.js 0.183 |
| QR scanning | html5-qrcode (camera), qrcode (server-side generation) |
| Real-time | Socket.io v4 |
| Backend | Node.js, Express 5, TypeScript 5 |
| Database | SQLite (sqlite3) |
| Auth | JWT (jsonwebtoken), OTP via in-memory |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone

```bash
git clone <repo-url>
cd Bus-Share
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:5001**

On first start, an admin account is seeded automatically:
- Phone: `+919999999999`

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

---

## Usage

### First-time setup (Admin)
1. Login at `http://localhost:3000/login?role=admin` with phone `+919999999999`
2. Go to **Admin Dashboard → Users** → create driver accounts
3. Go to **Buses** → create buses and assign drivers
4. Go to **Routes** → create routes with comma-separated stops

### Driver workflow
1. Login at `/login?role=driver`
2. Select route → Start Shift
3. GPS auto-broadcasts from your browser
4. Tap "Scan QR Ticket" to validate passengers boarding

### Passenger workflow
1. Register at `/register` or login at `/login?role=passenger`
2. See live bus cards on dashboard
3. Click "Book — ₹20" on any bus → complete mock Razorpay payment
4. Show QR code to driver when boarding

---

## Project Structure

```
Bus-Share/
├── backend/
│   └── src/
│       ├── db/index.ts          — SQLite schema & init
│       ├── middleware/auth.ts   — JWT Bearer middleware
│       ├── routes/
│       │   ├── auth.ts          — OTP send/verify, register
│       │   ├── passenger.ts     — Buses, wallet, bookings
│       │   ├── driver.ts        — Bus control, GPS, QR scan
│       │   └── admin.ts         — User/bus/route CRUD
│       ├── socket.ts            — Socket.io instance
│       └── index.ts             — Express + Socket.io server
└── frontend/
    └── src/
        ├── api/client.ts        — Axios + all API functions
        ├── hooks/               — useAuth, useSocket
        ├── scene/HeroScene.tsx  — Decorative 3D landing scene
        ├── components/
        │   ├── passenger/       — BusCard, WalletCard, PaymentModal, QRTicket
        │   ├── driver/          — RouteSelector, GPSBroadcaster, QRScanner, ActiveRide
        │   ├── admin/           — UsersPanel, BusesPanel, RoutesPanel
        │   └── shared/          — NavBar, ProtectedRoute
        └── pages/               — LandingPage, LoginPage, RegisterPage,
                                   PassengerDashboard, DriverDashboard, AdminDashboard
```

---

## License

MIT — see [LICENSE](./LICENSE)
