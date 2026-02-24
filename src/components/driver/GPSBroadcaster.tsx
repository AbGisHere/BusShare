import React, { useEffect, useRef, useState } from 'react';
import { updateLocation } from '../../api/client';
import { emitLocation } from '../../hooks/useSocket';

interface Props { busId: number; routeId: number; }

export const GPSBroadcaster: React.FC<Props> = ({ busId, routeId }) => {
  const [status, setStatus] = useState<'waiting' | 'active' | 'error'>('waiting');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const watchRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg('Geolocation not supported by this browser');
      return;
    }

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setStatus('active');
        emitLocation(busId, lat, lng, routeId);
      },
      (err) => { setStatus('error'); setErrorMsg(err.message || 'Location access denied'); },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => { if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current); };
  }, [busId, routeId]);

  useEffect(() => {
    if (!coords) return;
    updateLocation(coords.lat, coords.lng).catch(() => {});
  }, [coords]);

  return (
    <div style={{
      padding: '12px 16px',
      background: status === 'active' ? 'rgba(82,183,136,0.08)' : status === 'error' ? 'rgba(231,111,81,0.08)' : 'rgba(132,169,140,0.05)',
      border: `1px solid ${status === 'active' ? 'rgba(82,183,136,0.25)' : status === 'error' ? 'rgba(231,111,81,0.25)' : 'rgba(132,169,140,0.15)'}`,
      borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ fontSize: 20 }}>{status === 'active' ? '📡' : status === 'error' ? '⚠️' : '⏳'}</span>
      <div style={{ flex: 1 }}>
        {status === 'active' && coords && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#52B788' }}>GPS Broadcasting</div>
            <div style={{ fontSize: 11, color: '#52796F', fontFamily: 'monospace', marginTop: 2 }}>{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</div>
          </>
        )}
        {status === 'waiting' && <div style={{ fontSize: 13, color: '#84A98C' }}>Acquiring GPS signal...</div>}
        {status === 'error' && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e76f51' }}>GPS Unavailable</div>
            <div style={{ fontSize: 11, color: '#52796F', marginTop: 2 }}>{errorMsg}</div>
          </>
        )}
      </div>
      {status === 'active' && <span className="pulse-dot" />}
    </div>
  );
};

export default GPSBroadcaster;
