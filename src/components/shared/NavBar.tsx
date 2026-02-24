import React from 'react';
import type { User } from '../../types';

interface NavBarProps {
  user: User;
  onLogout: () => void;
}

const roleColor: Record<string, string> = {
  passenger: 'badge-sage',
  driver: 'badge-green',
  admin: 'badge-warn',
};

export const NavBar: React.FC<NavBarProps> = ({ user, onLogout }) => (
  <nav style={{
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: 56,
    background: 'rgba(1,22,30,0.92)',
    borderBottom: '1px solid rgba(132,169,140,0.2)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    zIndex: 500,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 20, fontWeight: 800, color: '#84A98C', letterSpacing: '-0.02em' }}>
        Bus-Share
      </span>
      <span className={`badge ${roleColor[user.role] || 'badge-sage'}`}>{user.role}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e8f4f0' }}>{user.name}</div>
        <div style={{ fontSize: 12, color: '#52796F' }}>{user.phone}</div>
      </div>
      <button className="btn btn-outline" style={{ padding: '7px 14px', fontSize: 13 }} onClick={onLogout}>
        Logout
      </button>
    </div>
  </nav>
);

export default NavBar;
