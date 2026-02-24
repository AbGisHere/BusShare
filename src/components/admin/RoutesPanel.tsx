import React, { useEffect, useState } from 'react';
import { adminRoutes, adminCreateRoute, adminDeleteRoute } from '../../api/client';
import type { Route } from '../../types';

export const RoutesPanel: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', stops: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const load = () => {
    setLoading(true);
    adminRoutes().then(setRoutes).catch(() => setError('Failed to load routes')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.stops.trim()) { setCreateError('Name and stops are required'); return; }
    const stopsList = form.stops.split(',').map(s => s.trim()).filter(Boolean);
    if (stopsList.length < 2) { setCreateError('At least 2 stops required (comma-separated)'); return; }
    setCreating(true); setCreateError('');
    try {
      await adminCreateRoute(form.name.trim(), stopsList, form.description.trim());
      setShowForm(false); setForm({ name: '', stops: '', description: '' }); load();
    } catch (err: any) {
      setCreateError(err?.response?.data?.error || 'Failed to create route');
    } finally { setCreating(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete route "${name}"? This cannot be undone.`)) return;
    try { await adminDeleteRoute(id); load(); } catch { /* ignore */ }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#CAD2C5' }}>Routes ({routes.length})</h3>
        <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Route'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div className="form-group">
            <label className="label">Route Name</label>
            <input className="input" type="text" placeholder="e.g. Main Gate → Library" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="label">Stops (comma-separated)</label>
            <input className="input" type="text" placeholder="Main Gate, Hostel A, Library, Sports Complex" value={form.stops} onChange={e => setForm(f => ({ ...f, stops: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="label">Description (optional)</label>
            <input className="input" type="text" placeholder="Short description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          {createError && <div className="error-text">{createError}</div>}
          <button className="btn btn-primary" type="submit" disabled={creating} style={{ marginTop: 4 }}>
            {creating ? <span className="spinner" /> : 'Create Route'}
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}><span className="spinner" /></div>
      ) : error ? (
        <div className="error-text">{error}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {routes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#52796F', border: '1px dashed rgba(132,169,140,0.2)', borderRadius: 10 }}>No routes created yet</div>
          ) : routes.map(route => (
            <div key={route.id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#CAD2C5', marginBottom: 4 }}>{route.name}</div>
                  {route.description && <div style={{ fontSize: 12, color: '#52796F', marginBottom: 8 }}>{route.description}</div>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {route.stops.map((stop, i) => (
                      <span key={i} style={{ padding: '3px 10px', background: 'rgba(132,169,140,0.08)', border: '1px solid rgba(132,169,140,0.18)', borderRadius: 20, fontSize: 11, color: '#CAD2C5' }}>
                        {i + 1}. {stop}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 12px', flexShrink: 0 }} onClick={() => handleDelete(route.id, route.name)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutesPanel;
