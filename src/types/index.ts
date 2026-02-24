export interface User {
  id: number;
  name: string;
  phone: string;
  role: 'passenger' | 'driver' | 'admin';
  created_at?: string;
}

export interface Route {
  id: number;
  name: string;
  stops: string[];
  description?: string;
}

export interface Bus {
  id: number;
  number: string;
  driverName?: string;
  routeName?: string;
  stops?: string[];
  currentLat?: number;
  currentLng?: number;
  lastUpdated?: string;
  isActive: boolean;
  activeRouteId?: number;
  driverId?: number;
}

export interface Booking {
  id: number;
  busId: number;
  busNumber?: string;
  routeName?: string;
  stops?: string[];
  amount: number;
  qrToken: string;
  qrImage: string;
  scannedAt?: string;
  createdAt: string;
}

export interface WalletTx {
  id: number;
  amount: number;
  type: 'topup' | 'payment';
  description?: string;
  createdAt: string;
}

export interface DriverStats {
  scanCount: number;
  totalRevenue: number;
}

export interface AdminStats {
  totalUsers: number;
  passengers: number;
  drivers: number;
  buses: number;
  activeBuses: number;
  totalBookings: number;
  totalRevenue: number;
  walletBalanceSum: number;
}

export interface ScanResult {
  valid: boolean;
  passengerName?: string;
  busNumber?: string;
  reason?: string;
}
