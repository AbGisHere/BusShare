import React, { useEffect, useState } from 'react';
import { fetchRoutes, startRide } from '../../api/client';
import type { Route, Bus } from '../../types';

<<<<<<< HEAD
interface Props { busNumber: string; onStarted: (bus: Bus) => void; }
=======
interface Props {
  busNumber: string;
  onStarted: (bus: Bus) => void;
}
>>>>>>> a4055be (V2.1.1 : Fronted changes)

export const RouteSelector: React.FC<Props> = ({ busNumber, onStarted }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selected, setSelected] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
<<<<<<< HEAD
    fetchRoutes().then(setRoutes).catch(() => setError('Failed to load routes')).finally(() => setFetching(false));
=======
    fetchRoutes()
      .then(setRoutes)
      .catch(() => setError('Failed to load routes'))
      .finally(() => setFetching(false));
>>>>>>> a4055be (V2.1.1 : Fronted changes)
  }, []);

  const handleStart = async () => {
    if (!selected) { setError('Please select a route'); return; }
    setError(''); setLoading(true);
    try {
      const bus = await startRide(Number(selected));
      onStarted(bus);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to start ride');
<<<<<<< HEAD
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚌</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#CAD2C5', marginBottom: 6 }}>Bus {busNumber}</h2>
      <p style={{ fontSize: 13, color: '#52796F', marginBottom: 32 }}>Select a route to begin your shift</p>

      <div className="card" style={{ padding: '24px', textAlign: 'left' }}>
        {fetching ? (
          <div style={{ textAlign: 'center', padding: 20 }}><span className="spinner" /></div>
=======
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚌</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#CAD2C5', marginBottom: 6 }}>
        Bus {busNumber}
      </h2>
      <p style={{ fontSize: 13, color: '#52796F', marginBottom: 32 }}>
        Select a route to begin your shift
      </p>

      <div className="card" style={{ padding: '24px', textAlign: 'left' }}>
        {fetching ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <span className="spinner" />
          </div>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        ) : (
          <>
            <div className="form-group">
              <label className="label">Route</label>
<<<<<<< HEAD
              <select className="input" value={selected} onChange={e => setSelected(e.target.value === '' ? '' : Number(e.target.value))}>
                <option value="">Select a route...</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.name}{r.description ? ` — ${r.description}` : ''}</option>)}
              </select>
            </div>

=======
              <select
                className="input"
                value={selected}
                onChange={e => setSelected(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <option value="">Select a route...</option>
                {routes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}{r.description ? ` — ${r.description}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Route preview */}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
            {selected && (() => {
              const route = routes.find(r => r.id === Number(selected));
              return route ? (
                <div style={{ marginBottom: 16 }}>
<<<<<<< HEAD
                  <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Stops</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {route.stops.map((stop, i) => (
                      <span key={i} style={{ padding: '3px 10px', background: 'rgba(132,169,140,0.08)', border: '1px solid rgba(132,169,140,0.2)', borderRadius: 20, fontSize: 12, color: '#CAD2C5' }}>
=======
                  <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                    Stops
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {route.stops.map((stop, i) => (
                      <span key={i} style={{
                        padding: '3px 10px',
                        background: 'rgba(132,169,140,0.08)',
                        border: '1px solid rgba(132,169,140,0.2)',
                        borderRadius: 20,
                        fontSize: 12,
                        color: '#CAD2C5',
                      }}>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
                        {i + 1}. {stop}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {error && <div className="error-text">{error}</div>}
<<<<<<< HEAD
            <button className="btn btn-primary w-full" style={{ marginTop: 8, fontSize: 15, padding: '12px' }} onClick={handleStart} disabled={loading || !selected}>
=======

            <button
              className="btn btn-primary w-full"
              style={{ marginTop: 8, fontSize: 15, padding: '12px' }}
              onClick={handleStart}
              disabled={loading || !selected}
            >
>>>>>>> a4055be (V2.1.1 : Fronted changes)
              {loading ? <span className="spinner" /> : 'Start Shift'}
            </button>
          </>
        )}
      </div>

      {routes.length === 0 && !fetching && (
<<<<<<< HEAD
        <p style={{ marginTop: 16, fontSize: 13, color: '#52796F' }}>No routes configured. Ask your admin to create routes.</p>
=======
        <p style={{ marginTop: 16, fontSize: 13, color: '#52796F' }}>
          No routes configured. Ask your admin to create routes.
        </p>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
      )}
    </div>
  );
};

export default RouteSelector;
