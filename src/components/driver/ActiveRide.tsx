import React, { useEffect, useState, useCallback } from 'react';
import { endRide, fetchDriverStats } from '../../api/client';
import { useSocketEvent, joinDriverRoom } from '../../hooks/useSocket';
import { GPSBroadcaster } from './GPSBroadcaster';
import { QRScanner } from './QRScanner';
import type { Bus, DriverStats, ScanResult } from '../../types';

<<<<<<< HEAD
interface Props { bus: Bus; driverId: number; onEnded: () => void; }
=======
interface Props {
  bus: Bus;
  driverId: number;
  onEnded: () => void;
}
>>>>>>> a4055be (V2.1.1 : Fronted changes)

export const ActiveRide: React.FC<Props> = ({ bus, driverId, onEnded }) => {
  const [stats, setStats] = useState<DriverStats>({ scanCount: 0, totalRevenue: 0 });
  const [showScanner, setShowScanner] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [ending, setEnding] = useState(false);
  const [notification, setNotification] = useState<ScanResult | null>(null);

<<<<<<< HEAD
  const loadStats = useCallback(() => { fetchDriverStats().then(setStats).catch(() => {}); }, []);
=======
  const loadStats = useCallback(() => {
    fetchDriverStats().then(setStats).catch(() => {});
  }, []);
>>>>>>> a4055be (V2.1.1 : Fronted changes)

  useEffect(() => {
    joinDriverRoom(driverId);
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [driverId, loadStats]);

<<<<<<< HEAD
  useSocketEvent<ScanResult>('qr:result', (result) => {
    setStats(prev => ({ scanCount: prev.scanCount + (result.valid ? 1 : 0), totalRevenue: prev.totalRevenue + (result.valid ? 20 : 0) }));
=======
  // Listen for real-time QR scan results (from socket)
  useSocketEvent<ScanResult>('qr:result', (result) => {
    setStats(prev => ({
      scanCount: prev.scanCount + (result.valid ? 1 : 0),
      totalRevenue: prev.totalRevenue + (result.valid ? 20 : 0),
    }));
>>>>>>> a4055be (V2.1.1 : Fronted changes)
    setNotification(result);
    setTimeout(() => setNotification(null), 4000);
  });

  const handleEnd = async () => {
    if (!window.confirm('End current shift? Your bus will go offline.')) return;
    setEnding(true);
<<<<<<< HEAD
    try { await endRide(); onEnded(); } catch { setEnding(false); }
=======
    try {
      await endRide();
      onEnded();
    } catch { setEnding(false); }
>>>>>>> a4055be (V2.1.1 : Fronted changes)
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px 40px' }}>
<<<<<<< HEAD
      {notification && (
        <div className="slide-up" style={{ position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)', zIndex: 600, padding: '12px 24px', background: notification.valid ? 'rgba(82,183,136,0.95)' : 'rgba(231,111,81,0.95)', border: `1px solid ${notification.valid ? 'rgba(82,183,136,0.4)' : 'rgba(231,111,81,0.4)'}`, borderRadius: 30, color: '#fff', fontWeight: 700, fontSize: 14, backdropFilter: 'blur(8px)', whiteSpace: 'nowrap' }}>
          {notification.valid ? `✓ Valid — ${notification.passengerName || 'Passenger'} boarded` : `✗ Invalid — ${notification.reason}`}
        </div>
      )}

=======

      {/* Inline notification */}
      {notification && (
        <div
          className="slide-up"
          style={{
            position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)',
            zIndex: 600,
            padding: '12px 24px',
            background: notification.valid ? 'rgba(82,183,136,0.95)' : 'rgba(231,111,81,0.95)',
            border: `1px solid ${notification.valid ? 'rgba(82,183,136,0.4)' : 'rgba(231,111,81,0.4)'}`,
            borderRadius: 30,
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
          }}
        >
          {notification.valid
            ? `✓ Valid — ${notification.passengerName || 'Passenger'} boarded`
            : `✗ Invalid — ${notification.reason}`}
        </div>
      )}

      {/* Bus header */}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
      <div style={{ marginBottom: 24, paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span className="pulse-dot" />
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#CAD2C5' }}>Bus {bus.number}</h2>
          <span className="badge badge-green">ACTIVE</span>
        </div>
        {bus.routeName && <p style={{ fontSize: 14, color: '#84A98C', marginLeft: 18 }}>{bus.routeName}</p>}
      </div>

<<<<<<< HEAD
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{stats.scanCount}</div><div className="stat-label">Scans Today</div></div>
        <div className="stat-card"><div className="stat-value">₹{stats.totalRevenue}</div><div className="stat-label">Revenue Today</div></div>
      </div>

=======
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-value">{stats.scanCount}</div>
          <div className="stat-label">Scans Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹{stats.totalRevenue}</div>
          <div className="stat-label">Revenue Today</div>
        </div>
      </div>

      {/* GPS */}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
      <div style={{ marginBottom: 16 }}>
        <GPSBroadcaster busId={bus.id} routeId={bus.activeRouteId || 0} />
      </div>

<<<<<<< HEAD
      {bus.stops && bus.stops.length > 0 && (
        <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Route Stops</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {bus.stops.map((stop, i) => (
              <span key={i} style={{ padding: '4px 12px', background: 'rgba(132,169,140,0.08)', border: '1px solid rgba(132,169,140,0.18)', borderRadius: 20, fontSize: 12, color: '#CAD2C5' }}>
=======
      {/* Route stops */}
      {bus.stops && bus.stops.length > 0 && (
        <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Route Stops
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {bus.stops.map((stop, i) => (
              <span key={i} style={{
                padding: '4px 12px',
                background: 'rgba(132,169,140,0.08)',
                border: '1px solid rgba(132,169,140,0.18)',
                borderRadius: 20,
                fontSize: 12, color: '#CAD2C5',
              }}>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
                {i + 1}. {stop}
              </span>
            ))}
          </div>
        </div>
      )}

<<<<<<< HEAD
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn btn-primary" style={{ fontSize: 15, padding: '13px', borderRadius: 10 }} onClick={() => setShowScanner(true)}>
          📷 Scan QR Ticket
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(132,169,140,0.05)', border: '1px solid rgba(132,169,140,0.15)', borderRadius: 10 }}>
=======
      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          className="btn btn-primary"
          style={{ fontSize: 15, padding: '13px', borderRadius: 10 }}
          onClick={() => setShowScanner(true)}
        >
          📷 Scan QR Ticket
        </button>

        {/* TTS toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(132,169,140,0.05)',
          border: '1px solid rgba(132,169,140,0.15)',
          borderRadius: 10,
        }}>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#CAD2C5' }}>Verbal Confirmation</div>
            <div style={{ fontSize: 11, color: '#52796F', marginTop: 2 }}>Speak scan result aloud</div>
          </div>
<<<<<<< HEAD
          <button onClick={() => setTtsEnabled(!ttsEnabled)} style={{ width: 44, height: 24, background: ttsEnabled ? '#84A98C' : 'rgba(132,169,140,0.2)', border: '1px solid rgba(132,169,140,0.3)', borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ position: 'absolute', top: 2, left: ttsEnabled ? 22 : 2, width: 18, height: 18, background: '#fff', borderRadius: 9, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
          </button>
        </div>

        <button className="btn btn-danger" style={{ fontSize: 14, padding: '12px' }} onClick={handleEnd} disabled={ending}>
=======
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            style={{
              width: 44, height: 24,
              background: ttsEnabled ? '#84A98C' : 'rgba(132,169,140,0.2)',
              border: '1px solid rgba(132,169,140,0.3)',
              borderRadius: 12,
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div style={{
              position: 'absolute',
              top: 2, left: ttsEnabled ? 22 : 2,
              width: 18, height: 18,
              background: '#fff',
              borderRadius: 9,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </button>
        </div>

        <button
          className="btn btn-danger"
          style={{ fontSize: 14, padding: '12px' }}
          onClick={handleEnd}
          disabled={ending}
        >
>>>>>>> a4055be (V2.1.1 : Fronted changes)
          {ending ? <span className="spinner" /> : 'End Shift'}
        </button>
      </div>

<<<<<<< HEAD
      {showScanner && <QRScanner ttsEnabled={ttsEnabled} onClose={() => { setShowScanner(false); loadStats(); }} />}
=======
      {showScanner && (
        <QRScanner
          ttsEnabled={ttsEnabled}
          onClose={() => { setShowScanner(false); loadStats(); }}
        />
      )}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
    </div>
  );
};

export default ActiveRide;
