# Bus-Share

A real-time campus bus booking platform. Passengers book ₹20 rides and get a QR ticket. Drivers broadcast GPS, scan tickets via camera, and get verbal confirmation. Admins manage users, buses, and routes.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.177-orange) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

**Passenger**
- Live bus cards — see all active buses, routes, and stops
- Pay ₹20 via mock Razorpay checkout → get a QR ticket instantly
- Active ticket always visible on dashboard

**Driver**
- Pick route when starting shift
- GPS auto-broadcasts to all connected clients via Socket.io
- Camera QR scanner with instant valid/invalid overlay
- Optional verbal TTS confirmation on scan
- Today's scan count and revenue at a glance

**Admin**
- System stats (users, buses, bookings, revenue)
- Create/manage driver and admin accounts
- Create buses and assign drivers
- Create/delete routes with custom stops

**General**
- OTP phone login — no passwords
- Passengers self-register; drivers/admins created by admin
- Decorative 3D hero scene (React Three Fiber) on landing/login/register pages

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript 4.9, React Router v7 |
| 3D | React Three Fiber v9, @react-three/drei, Three.js 0.177 |
| QR scanning | html5-qrcode (camera), qrcode (server-side generation) |
| Real-time | Socket.io v4 |
| Backend | Node.js, Express 5, TypeScript 5 |
| Database | SQLite (sqlite3) |
| Auth | JWT (jsonwebtoken), OTP via in-memory store |

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

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:5001**

On first start, a single admin account is seeded automatically:

| Role | Phone | Name |
|------|-------|------|
| Admin | `+919999999999` | Admin |

> **OTP in dev mode:** The backend returns the generated OTP directly in the API response (visible in the login form as "Dev OTP: ######"). No SMS is sent.

### 3. Start the frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

---

## Test Accounts & First-time Setup

The database ships with only the admin account seeded. Follow these steps to get a working test environment:

### Step 1 — Log in as admin

1. Open `http://localhost:3000/login?role=admin`
2. Enter phone `+919999999999`
3. Click **Send OTP** — the OTP code appears on screen (dev mode)
4. Enter the OTP and click **Verify & Login**

### Step 2 — Create a driver account

1. In the Admin dashboard, go to the **Users** tab
2. Click **Create User**, fill in:
   - Name: `Test Driver`
   - Phone: `+911234567890`
   - Role: `driver`
3. Click **Create**

### Step 3 — Create a route

1. Go to the **Routes** tab
2. Click **Create Route**, fill in:
   - Name: `Campus Loop`
   - Stops: `Gate 1, Main Block, Hostel, Library, Gate 1`
3. Click **Create**

### Step 4 — Create a bus and assign the driver

1. Go to the **Buses** tab
2. Click **Create Bus**, fill in:
   - Bus Number: `VIT-01`
   - Driver Phone: `+911234567890`
3. Click **Create**

### Step 5 — Register a passenger

1. Open `http://localhost:3000/register`
2. Enter any phone number (e.g. `+910000000001`), name, and an email
3. An OTP is sent — the code appears on screen
4. Complete registration

---

## Role Workflows

### Passenger (`/passenger`)

1. Register at `/register` or login at `/login` (default role)
2. See live bus cards on the dashboard
3. Click **Book — ₹20** on any active bus
4. Complete the mock Razorpay payment (click Confirm)
5. Your QR ticket appears — show it to the driver when boarding

### Driver (`/driver`)

1. Login at `/login?role=driver` with the driver phone created in admin setup
2. Select a route from the dropdown → click **Start Shift** — GPS broadcasting begins automatically
3. Click **Scan QR Ticket** to open the camera scanner
4. Point it at a passenger's QR code — a green VALID or red INVALID overlay confirms the result
5. Toggle **TTS** to enable/disable verbal confirmation

### Admin (`/admin`)

Login at `/login?role=admin`. Four tabs are available:

| Tab | What you can do |
|-----|----------------|
| **Overview** | See total users, bookings, revenue, active buses |
| **Users** | List all users with wallet balance; create new drivers/admins |
| **Buses** | List all buses with assigned driver; create new buses |
| **Routes** | List all routes with stops; create or delete routes |

---

## URL Reference

| URL | Purpose |
|-----|---------|
| `http://localhost:3000/` | Landing page |
| `http://localhost:3000/login` | Passenger login (default) |
| `http://localhost:3000/login?role=driver` | Driver login |
| `http://localhost:3000/login?role=admin` | Admin login |
| `http://localhost:3000/register` | Passenger self-registration |
| `http://localhost:3000/passenger` | Passenger dashboard (protected) |
| `http://localhost:3000/driver` | Driver dashboard (protected) |
| `http://localhost:3000/admin` | Admin dashboard (protected) |

---

## Project Structure

```
Bus-Share/
├── backend/
│   └── src/
│       ├── db/index.ts          — SQLite schema & init (seeds admin on first run)
│       ├── middleware/auth.ts   — JWT Bearer middleware
│       ├── routes/
│       │   ├── auth.ts          — OTP send/verify, register
│       │   ├── passenger.ts     — Buses, wallet, bookings, QR ticket
│       │   ├── driver.ts        — Bus control, GPS update, QR scan
│       │   └── admin.ts         — User/bus/route CRUD, system stats
│       ├── socket.ts            — Socket.io instance & GPS event handling
│       └── index.ts             — Express + Socket.io server entry point
└── frontend/
    └── src/
        ├── api/client.ts            — Axios instance + all API functions
        ├── hooks/
        │   ├── useAuth.ts           — Auth context, state hook
        │   ├── AuthProvider.tsx     — React context provider (wraps whole app)
        │   └── useSocket.ts         — Socket.io connection hook
        ├── scene/HeroScene.tsx      — Decorative 3D landing/login scene
        ├── components/
        │   ├── passenger/           — BusCard, WalletCard, PaymentModal, QRTicket
        │   ├── driver/              — RouteSelector, GPSBroadcaster, QRScanner, ActiveRide
        │   ├── admin/               — UsersPanel, BusesPanel, RoutesPanel
        │   └── shared/              — NavBar, ProtectedRoute
        └── pages/                   — LandingPage, LoginPage, RegisterPage,
                                       PassengerDashboard, DriverDashboard, AdminDashboard
```

---

## Environment Variables

Backend (optional — defaults shown):

```env
PORT=5001
JWT_SECRET=busshare_secret_2024
NODE_ENV=development
```

> In `NODE_ENV=production`, OTPs are **not** returned in the API response (SMS integration required).

Frontend (optional — in `frontend/.env`):

```env
REACT_APP_API_URL=http://localhost:5001
GENERATE_SOURCEMAP=false
```

---

## License

MIT — see [LICENSE](./LICENSE)
