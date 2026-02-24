import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroScene } from '../scene/HeroScene';

const RoleCard: React.FC<{ title: string; subtitle: string; icon: string; onClick: () => void }> = ({ title, subtitle, icon, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: 'rgba(1,22,30,0.75)',
      border: '1px solid rgba(132,169,140,0.3)',
      borderRadius: 16,
      padding: '32px 40px',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.25s ease',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      width: 220,
      color: '#e8f4f0',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(132,169,140,0.7)';
      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(132,169,140,0.12)';
      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(132,169,140,0.3)';
      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(1,22,30,0.75)';
      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
    }}
  >
    <div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div>
    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13, color: '#84A98C', lineHeight: 1.5 }}>{subtitle}</div>
  </button>
);

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <HeroScene />
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px' }}>
        <div className="slide-up" style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-0.04em', color: '#84A98C', lineHeight: 1, marginBottom: 12 }}>
            Bus-Share
          </div>
          <div style={{ fontSize: 16, color: 'rgba(132,169,140,0.7)', fontWeight: 400 }}>
            Smart campus transit — pay, scan, ride
          </div>
        </div>

        <div className="fade-in" style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32, animationDelay: '0.15s', opacity: 0, animationFillMode: 'forwards' }}>
          <RoleCard title="Passenger" subtitle="Find buses, book rides, scan QR to board" icon="🚌" onClick={() => navigate('/login?role=passenger')} />
          <RoleCard title="Driver" subtitle="Start route, broadcast GPS, validate tickets" icon="🧑‍✈️" onClick={() => navigate('/login?role=driver')} />
        </div>

        <button className="btn btn-ghost" style={{ fontSize: 12, opacity: 0.55 }} onClick={() => navigate('/login?role=admin')}>
          Admin Portal
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
