import React, { useEffect, useState } from 'react';
import { adminBuses, adminUsers, adminCreateBus, adminAssignBus, adminUnassignBus } from '../../api/client';
import type { Bus, User } from '../../types';

export const BusesPanel: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [assigning, setAssigning] = useState<number | null>(null);
  const [assignDriverId, setAssignDriverId] = useState<number | ''>('');
  const [assignError, setAssignError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([adminBuses(), adminUsers()])
      .then(([b, u]) => { setBuses(b); setDrivers(u.filter(user => user.role === 'driver')); })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber.trim()) { setCreateError('Bus number required'); return; }
    setCreating(true); setCreateError('');
    try { await adminCreateBus(newNumber.trim()); setShowForm(false); setNewNumber(''); load(); }
    catch (err: any) { setCreateError(err?.response?.data?.error || 'Failed to create bus'); }
    finally { setCreating(false); }
  };

  const handleAssign = async (busId: number) => {
    if (!assignDriverId) { setAssignError('Select a driver'); return; }
    setAssignError('');
    try { await adminAssignBus(busId, Number(assignDriverId)); setAssigning(null); setAssignDriverId(''); load(); }
    catch (err: any) { setAssignError(err?.response?.data?.error || 'Failed to assign'); }
  };

  const handleUnassign = async (busId: number) => {
    try { await adminUnassignBus(busId); load(); } catch { /* ignore */ }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#CAD2C5' }}>Buses ({buses.length})</h3>
        <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Bus'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ padding: 20, marginBottom: 20, display: 'flex', gap: 12 }}>
          <input className="input" type="text" placeholder="Bus number (e.g. MH-12-AB-1234)" value={newNumber} onChange={e => setNewNumber(e.target.value)} style={{ flex: 1 }} />
          {createError && <div className="error-text">{createError}</div>}
          <button className="btn btn-primary" type="submit" disabled={creating}>{creating ? <span className="spinner" /> : 'Create'}</button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}><span className="spinner" /></div>
      ) : error ? (
        <div className="error-text">{error}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {buses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#52796F', border: '1px dashed rgba(132,169,140,0.2)', borderRadius: 10 }}>No buses created yet</div>
          ) : buses.map(bus => (
            <div key={bus.id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#CAD2C5' }}>Bus {bus.number}</span>
                    <span className={`badge ${bus.isActive ? 'badge-green' : 'badge-sage'}`}>{bus.isActive ? 'Active' : 'Idle'}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#52796F' }}>
                    {bus.driverName ? <>Driver: <span style={{ color: '#84A98C' }}>{bus.driverName}</span>{bus.routeName ? ` · ${bus.routeName}` : ''}</> : 'Unassigned'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {bus.driverId ? (
                    <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => handleUnassign(bus.id)}>Unassign</button>
                  ) : (
                    <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setAssigning(assigning === bus.id ? null : bus.id)}>Assign Driver</button>
                  )}
                </div>
              </div>
              {assigning === bus.id && (
                <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                  <select className="input" value={assignDriverId} onChange={e => setAssignDriverId(e.target.value === '' ? '' : Number(e.target.value))} style={{ flex: 1 }}>
                    <option value="">Select driver...</option>
                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>)}
                  </select>
                  <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => handleAssign(bus.id)}>Assign</button>
                </div>
              )}
              {assigning === bus.id && assignError && <div className="error-text">{assignError}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusesPanel;
