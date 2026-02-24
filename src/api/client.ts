import axios from 'axios';
import type { Bus, Route, Booking, DriverStats, AdminStats, ScanResult, User } from '../types';

const BASE = 'http://localhost:5001';

export const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } });

<<<<<<< HEAD
=======
// Attach JWT from localStorage on every request
>>>>>>> a4055be (V2.1.1 : Fronted changes)
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ── Auth ──────────────────────────────────────────────────────────────────
export const sendOtp = (phone: string) =>
  api.post<{ message: string; otp?: string }>('/api/auth/send-otp', { phone }).then(r => r.data);

export const verifyOtp = (phone: string, code: string) =>
  api.post<{ token?: string; user?: User; exists?: boolean }>('/api/auth/verify-otp', { phone, code }).then(r => r.data);

export const register = (name: string, phone: string) =>
  api.post<{ message: string; otp?: string }>('/api/auth/register', { name, phone }).then(r => r.data);

// ── Passenger ─────────────────────────────────────────────────────────────
export const fetchBuses = () =>
  api.get<{ buses: Bus[]; inactiveCount: number }>('/api/passenger/buses').then(r => r.data);

export const fetchWallet = () =>
  api.get<{ balance: number }>('/api/passenger/wallet').then(r => r.data);

export const topupWallet = (amount: number) =>
  api.post<{ balance: number }>('/api/passenger/wallet/topup', { amount }).then(r => r.data);

export const payForRide = (busId: number) =>
  api.post<{ bookingId: number; qrToken: string; qrImage: string; busNumber: string; routeName: string; balance: number }>(
    '/api/passenger/booking/pay', { busId }
  ).then(r => r.data);

export const fetchActiveBooking = () =>
  api.get<{ booking: Booking | null }>('/api/passenger/booking/active').then(r => r.data);

// ── Driver ────────────────────────────────────────────────────────────────
export const fetchDriverBus = () =>
  api.get<Bus>('/api/driver/bus').then(r => r.data);

export const fetchRoutes = () =>
  api.get<Route[]>('/api/driver/routes').then(r => r.data);

export const startRide = (routeId: number) =>
  api.post<Bus>('/api/driver/start', { routeId }).then(r => r.data);

export const endRide = () =>
  api.post<{ success: boolean }>('/api/driver/end').then(r => r.data);

export const updateLocation = (lat: number, lng: number) =>
  api.post<{ ok: boolean }>('/api/driver/location', { lat, lng }).then(r => r.data);

export const scanQR = (token: string) =>
  api.post<ScanResult>('/api/driver/scan', { token }).then(r => r.data);

export const fetchDriverStats = () =>
  api.get<DriverStats>('/api/driver/stats').then(r => r.data);

// ── Admin ─────────────────────────────────────────────────────────────────
export const adminStats = () => api.get<AdminStats>('/api/admin/stats').then(r => r.data);
export const adminUsers = () => api.get<(User & { walletBalance: number })[]>('/api/admin/users').then(r => r.data);
export const adminBuses = () => api.get<Bus[]>('/api/admin/buses').then(r => r.data);
export const adminRoutes = () => api.get<Route[]>('/api/admin/routes').then(r => r.data);

export const adminCreateUser = (name: string, phone: string, role: string) =>
  api.post<User>('/api/admin/users', { name, phone, role }).then(r => r.data);

export const adminCreateBus = (number: string) =>
  api.post<Bus>('/api/admin/buses', { number }).then(r => r.data);

export const adminAssignBus = (busId: number, driverId: number) =>
  api.post(`/api/admin/buses/${busId}/assign`, { driverId }).then(r => r.data);

export const adminUnassignBus = (busId: number) =>
  api.post(`/api/admin/buses/${busId}/unassign`).then(r => r.data);

export const adminCreateRoute = (name: string, stops: string[], description: string) =>
  api.post<Route>('/api/admin/routes', { name, stops, description }).then(r => r.data);

export const adminDeleteRoute = (id: number) =>
  api.delete(`/api/admin/routes/${id}`).then(r => r.data);
