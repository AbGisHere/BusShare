import React, { useEffect, useState } from 'react';
import { adminUsers, adminCreateUser } from '../../api/client';
import type { User } from '../../types';

type UserWithBalance = User & { walletBalance: number };

export const UsersPanel: React.FC = () => {
  const [users, setUsers] = useState<UserWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', role: 'driver' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const load = () => {
    setLoading(true);
    adminUsers().then(setUsers).catch(() => setError('Failed to load users')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setCreateError('All fields required'); return; }
    setCreating(true); setCreateError('');
    try {
      await adminCreateUser(form.name, form.phone, form.role);
      setShowForm(false); setForm({ name: '', phone: '', role: 'driver' }); load();
    } catch (err: any) {
      setCreateError(err?.response?.data?.error || 'Failed to create user');
    } finally { setCreating(false); }
  };

  const roleBadge: Record<string, string> = { passenger: 'badge-sage', driver: 'badge-green', admin: 'badge-warn' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#CAD2C5' }}>Users ({users.length})</h3>
        <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="label">Name</label>
              <input className="input" type="text" placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" type="tel" placeholder="+91..." value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {createError && <div className="error-text">{createError}</div>}
          <button className="btn btn-primary" type="submit" disabled={creating} style={{ marginTop: 8 }}>
            {creating ? <span className="spinner" /> : 'Create User'}
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}><span className="spinner" /></div>
      ) : error ? (
        <div className="error-text">{error}</div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Role</th><th>Balance</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#52796F', padding: 32 }}>No users found</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{u.phone}</td>
                    <td><span className={`badge ${roleBadge[u.role] || 'badge-sage'}`}>{u.role}</span></td>
                    <td>₹{u.walletBalance?.toFixed(2) ?? '0.00'}</td>
                    <td style={{ color: '#52796F', fontSize: 12 }}>{u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPanel;
