import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adminStats } from '../api/client';
import { NavBar } from '../components/shared/NavBar';
import { UsersPanel } from '../components/admin/UsersPanel';
import { BusesPanel } from '../components/admin/BusesPanel';
import { RoutesPanel } from '../components/admin/RoutesPanel';
import type { AdminStats } from '../types';

type Tab = 'users' | 'buses' | 'routes';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('users');

<<<<<<< HEAD
  useEffect(() => { adminStats().then(setStats).catch(() => {}); }, []);
=======
  useEffect(() => {
    adminStats().then(setStats).catch(() => {});
  }, []);
>>>>>>> a4055be (V2.1.1 : Fronted changes)

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'users', label: 'Users' },
    { id: 'buses', label: 'Buses' },
    { id: 'routes', label: 'Routes' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#01161E' }}>
      <NavBar user={user} onLogout={handleLogout} />

<<<<<<< HEAD
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 20px 40px' }}>
=======
      <div style={{ paddingTop: 72, maxWidth: 900, margin: '0 auto', padding: '72px 20px 40px' }}>

        {/* Header */}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#CAD2C5', marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: '#52796F' }}>Manage users, buses and routes</p>
        </div>

<<<<<<< HEAD
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
            <div className="stat-card"><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Users</div></div>
            <div className="stat-card"><div className="stat-value">{stats.passengers}</div><div className="stat-label">Passengers</div></div>
            <div className="stat-card"><div className="stat-value">{stats.drivers}</div><div className="stat-label">Drivers</div></div>
=======
        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
            <div className="stat-card">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.passengers}</div>
              <div className="stat-label">Passengers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.drivers}</div>
              <div className="stat-label">Drivers</div>
            </div>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
            <div className="stat-card">
              <div className="stat-value">{stats.activeBuses}<span style={{ fontSize: 14, color: '#52796F' }}>/{stats.buses}</span></div>
              <div className="stat-label">Active Buses</div>
            </div>
<<<<<<< HEAD
            <div className="stat-card"><div className="stat-value">{stats.totalBookings}</div><div className="stat-label">Total Bookings</div></div>
            <div className="stat-card"><div className="stat-value" style={{ fontSize: 20 }}>₹{stats.totalRevenue}</div><div className="stat-label">Revenue</div></div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(132,169,140,0.15)' }}>
=======
            <div className="stat-card">
              <div className="stat-value">{stats.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: 20 }}>₹{stats.totalRevenue}</div>
              <div className="stat-label">Revenue</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(132,169,140,0.15)', paddingBottom: 0 }}>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn btn-ghost"
<<<<<<< HEAD
              style={{ borderRadius: '8px 8px 0 0', padding: '10px 20px', fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 400, color: activeTab === tab.id ? '#84A98C' : '#52796F', borderBottom: activeTab === tab.id ? '2px solid #84A98C' : '2px solid transparent', marginBottom: -1 }}
=======
              style={{
                borderRadius: '8px 8px 0 0',
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 700 : 400,
                color: activeTab === tab.id ? '#84A98C' : '#52796F',
                borderBottom: activeTab === tab.id ? '2px solid #84A98C' : '2px solid transparent',
                marginBottom: -1,
              }}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
            >
              {tab.label}
            </button>
          ))}
        </div>

<<<<<<< HEAD
=======
        {/* Tab content */}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        <div className="fade-in">
          {activeTab === 'users' && <UsersPanel />}
          {activeTab === 'buses' && <BusesPanel />}
          {activeTab === 'routes' && <RoutesPanel />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
