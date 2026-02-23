# Bus Share v2.0 — 3D City UI

A real-time bus tracking and booking platform with a **3D city map** rendered by React Three Fiber. Animated buses drive across a procedurally generated city grid; all dashboards float as HTML panels on top of the canvas.

![Bus Share 3D City UI](https://img.shields.io/badge/React-19-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.183-orange) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## What's New in v2.0

- **3D City Scene** — procedural 10×10 road grid, ~300 emissive buildings, city fog
- **Animated Bus Models** — BoxGeometry buses smoothly lerp to their GPS positions each frame
- **React Three Fiber** (`@react-three/fiber` + `@react-three/drei`) for all 3D rendering
- **Socket.io live sync** — location updates merge in real-time without polling lag
- **Landing particle field** — 800 rotating star points
- **Driver bus highlight** — pulsing torus ring around your own bus
- **Admin 3D bar chart** — live stats visualized in the city scene
- HTML panels use `position: absolute` with `backdrop-filter: blur(12px)` for a glassmorphism look

---

## Tech Stack

### Frontend (v2.0)
| Layer | Library |
|---|---|
| UI framework | React 19 + TypeScript |
| 3D engine | Three.js 0.183 |
| React 3D reconciler | @react-three/fiber 9 |
| 3D helpers | @react-three/drei (OrbitControls, Html, Float) |
| Routing | React Router v7 |
| HTTP client | Axios |
| Real-time | Socket.io-client |

### Backend (unchanged)
| Layer | Library |
|---|---|
| Runtime | Node.js + TypeScript |
| HTTP server | Express.js (port **5001**) |
| Database | SQLite (via better-sqlite3) |
| Real-time | Socket.io |
| Auth | OTP via phone number |
| Tickets | QRCode |

---

## Color Scheme

| Token | Value | Usage |
|---|---|---|
| Primary | `#01161E` | Background, panels, fog |
| Secondary | `#84A98C` | Accents, bus bodies, labels |

---

## Project Structure

```
Bus-Share/
├── backend/               Node.js/Express API server
│   └── src/
│       ├── routes/        Auth, bus, wallet, booking, admin
│       └── db/            SQLite setup
└── frontend/              React 19 + R3F app
    └── src/
        ├── types/         Shared TS interfaces
        ├── constants/     Color tokens, city grid bounds
        ├── utils/         GPS → 3D coord transform
        ├── api/           Axios client + all API calls
        ├── hooks/         useSocket, useBuses, useWallet
        ├── scene/         3D scene primitives (Building, BusModel, etc.)
        ├── components/
        │   ├── Landing/         Auth overlay + modals
        │   ├── PassengerDashboard/
        │   ├── DriverDashboard/
        │   ├── AdminDashboard/
        │   └── shared/          NavBar, LoadingScene, ErrorBoundary
        └── pages/         LandingPage, PassengerPage, DriverPage, AdminPage
```

---

## Quick Start

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Install all dependencies
```bash
npm run install-deps
```

### 2. Start backend + frontend simultaneously
```bash
npm run dev
```

- Backend: `http://localhost:5001`
- Frontend: `http://localhost:3000`

### Manual startup

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm start
```

---

## User Roles

### Passenger
1. Open `http://localhost:3000` → Try Demo or Sign Up
2. Verify phone OTP to log in
3. The 3D city map loads with live buses
4. **Click any bus** to open the booking panel
5. Enter a seat number (1–30) → receive a QR code ticket valid 15 minutes
6. Tap **Wallet** in the nav bar to add money

### Driver
1. Admin creates a driver account and assigns a bus
2. Driver logs in → assigned bus is highlighted with a pulsing ring
3. Tap **Location** → Update Location (simulates GPS)
4. Tap **Scan QR** → paste passenger QR data → Validate
5. Tap **Passengers** to see boarded passengers; **Stats** for revenue

### Admin
1. Log in with admin credentials
2. Stat bar at top shows live system totals; 3D bar chart in the city
3. Nav tabs: **Users**, **Drivers** (assign buses), **Buses**, **Routes**
4. Create tabs: **+ User**, **+ Bus**, **+ Route**

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user (name, phoneNumber, role) |
| POST | `/api/otp/send` | Send OTP to phone number |
| POST | `/api/otp/verify` | Verify OTP → returns JWT + user |

### Buses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bus/all` | All buses with GPS |
| GET | `/api/bus/driver/:driverId` | Driver's assigned bus |
| POST | `/api/bus/location/update` | Update bus GPS |

### Wallet
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/wallet/balance/:userId` | Get balance |
| POST | `/api/wallet/add` | Add money |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/booking/create` | Create booking → returns QR code |
| POST | `/api/booking/validate` | Validate QR (driver scan) |
| GET | `/api/booking/driver/:driverId` | Driver's passengers + stats |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/buses` | All buses |
| GET | `/api/admin/stats` | System statistics |
| GET | `/api/admin/routes` | All routes |
| POST | `/api/admin/create-user` | Create driver/admin |
| POST | `/api/admin/create-bus` | Create bus |
| POST | `/api/admin/create-route` | Create route |
| POST | `/api/admin/assign-bus` | Assign bus to driver |
| POST | `/api/admin/remove-bus-assignment` | Unassign bus |

---

## Database Schema

| Table | Key Columns |
|---|---|
| `users` | id, name, phone_number, role, created_at |
| `wallets` | id, user_id, balance |
| `buses` | id, bus_number, driver_id, current_lat, current_lng, last_updated |
| `bookings` | id, user_id, bus_id, seat_number, qr_code, qr_expires_at, is_scanned |
| `routes` | id, route_name, start_point, end_point, stops (JSON), total_distance, estimated_time |

---

## Architecture Notes

- `useFrame` / `useThree` are used only inside Canvas children — never in plain hooks
- Canvas gets `pointerEvents: none` when any panel is open (prevents OrbitControls conflict)
- All interactive forms use `position: absolute` DOM divs — not `<Html>` (which has input focus issues)
- `@types/three` is pinned to `0.155.x` for TypeScript 4.9 compatibility
- GPS coords cluster near 40.71/–74.00 (NYC); `latLngToXZ()` maps this ±0.045° range to ±45 world units

---

## License

MIT © 2024 Bus Share Contributors
