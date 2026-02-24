import React from 'react';
import type { Bus } from '../../types';

<<<<<<< HEAD
interface Props { bus: Bus; onBook: (bus: Bus) => void; }
=======
interface Props {
  bus: Bus;
  onBook: (bus: Bus) => void;
}
>>>>>>> a4055be (V2.1.1 : Fronted changes)

function timeAgo(iso: string | undefined): string {
  if (!iso) return 'unknown';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export const BusCard: React.FC<Props> = ({ bus, onBook }) => (
  <div
    className="card fade-in"
<<<<<<< HEAD
    style={{ padding: '20px 24px', transition: 'border-color 0.2s, transform 0.2s' }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(132,169,140,0.55)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(132,169,140,0.28)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
=======
    style={{
      padding: '20px 24px',
      transition: 'border-color 0.2s, transform 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(132,169,140,0.55)';
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(132,169,140,0.28)';
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
    }}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span className="pulse-dot" />
<<<<<<< HEAD
          <span style={{ fontSize: 20, fontWeight: 800, color: '#CAD2C5', letterSpacing: '-0.02em' }}>Bus {bus.number}</span>
        </div>
        {bus.routeName && <div style={{ fontSize: 13, color: '#84A98C', fontWeight: 500 }}>{bus.routeName}</div>}
      </div>
      <button className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => onBook(bus)}>
=======
          <span style={{ fontSize: 20, fontWeight: 800, color: '#CAD2C5', letterSpacing: '-0.02em' }}>
            Bus {bus.number}
          </span>
        </div>
        {bus.routeName && (
          <div style={{ fontSize: 13, color: '#84A98C', fontWeight: 500 }}>{bus.routeName}</div>
        )}
      </div>
      <button
        className="btn btn-primary"
        style={{ fontSize: 13, padding: '8px 16px' }}
        onClick={() => onBook(bus)}
      >
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        Book — ₹20
      </button>
    </div>

<<<<<<< HEAD
    {bus.stops && bus.stops.length > 0 && (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Route stops</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {bus.stops.map((stop, i) => (
            <span key={i} style={{ padding: '3px 10px', background: 'rgba(132,169,140,0.08)', border: '1px solid rgba(132,169,140,0.18)', borderRadius: 20, fontSize: 12, color: '#CAD2C5' }}>
=======
    {/* Stops */}
    {bus.stops && bus.stops.length > 0 && (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
          Route stops
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {bus.stops.map((stop, i) => (
            <span
              key={i}
              style={{
                padding: '3px 10px',
                background: 'rgba(132,169,140,0.08)',
                border: '1px solid rgba(132,169,140,0.18)',
                borderRadius: 20,
                fontSize: 12,
                color: '#CAD2C5',
              }}
            >
>>>>>>> a4055be (V2.1.1 : Fronted changes)
              {i + 1}. {stop}
            </span>
          ))}
        </div>
      </div>
    )}

    <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#52796F' }}>
      {bus.driverName && <span>Driver: <span style={{ color: '#84A98C' }}>{bus.driverName}</span></span>}
      {bus.lastUpdated && <span>Updated: <span style={{ color: '#84A98C' }}>{timeAgo(bus.lastUpdated)}</span></span>}
    </div>
  </div>
);

export default BusCard;
