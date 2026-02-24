import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { register } from '../api/client';
import { HeroScene } from '../scene/HeroScene';

export const RegisterPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState(params.get('phone') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) { setError('Name and phone are required'); return; }
    setError(''); setLoading(true);
    try {
      const res = await register(name.trim(), phone.trim());
      setSuccess(res.otp ? `Registered! Dev OTP: ${res.otp} — redirecting...` : 'Registered! Redirecting to login...');
      setTimeout(() => navigate('/login?role=passenger'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <HeroScene />
      <div className="modal-box slide-up" style={{ position: 'relative', zIndex: 10, maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#84A98C', marginBottom: 8 }}>Bus-Share</div>
          <span className="badge badge-sage">New Passenger</span>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
            <div className="success-text" style={{ fontSize: 14 }}>{success}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Full Name</label>
              <input className="input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
              <label className="label">Phone Number</label>
              <input className="input" type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            {error && <div className="error-text">{error}</div>}
            <button className="btn btn-primary w-full mt-16" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#52796F' }}>
              Already have an account? <Link to="/login?role=passenger" style={{ color: '#84A98C', textDecoration: 'none' }}>Login</Link>
            </p>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ fontSize: 12, color: '#52796F', textDecoration: 'none' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
