import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchDriverBus } from '../api/client';
import { NavBar } from '../components/shared/NavBar';
import { RouteSelector } from '../components/driver/RouteSelector';
import { ActiveRide } from '../components/driver/ActiveRide';
import type { Bus } from '../types';

export const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDriverBus()
      .then(setBus)
      .catch((err: any) => {
        setError(err?.response?.status === 404 ? 'No bus assigned. Ask your admin to assign you a bus.' : 'Failed to load bus info');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#01161E' }}>
      <NavBar user={user} onLogout={handleLogout} />
      <div style={{ paddingTop: 72, maxWidth: 640, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}><span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} /></div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
            <p style={{ fontSize: 15, color: '#84A98C' }}>{error}</p>
          </div>
        ) : bus && !bus.isActive ? (
          <RouteSelector busNumber={bus.number} onStarted={setBus} />
        ) : bus && bus.isActive ? (
          <ActiveRide bus={bus} driverId={user.id} onEnded={() => setBus(prev => prev ? { ...prev, isActive: false, activeRouteId: undefined } : null)} />
        ) : null}
      </div>
    </div>
  );
};

export default DriverDashboard;
