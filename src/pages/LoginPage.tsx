import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { HeroScene } from '../scene/HeroScene';
import type { User } from '../types';

<<<<<<< HEAD
const roleDest = (role: string) =>
  role === 'driver' ? '/driver' : role === 'admin' ? '/admin' : '/passenger';

type Phase = 'phone' | 'otp';

const roleLabel: Record<string, string> = { passenger: 'Passenger Login', driver: 'Driver Login', admin: 'Admin Login' };
const roleBadge: Record<string, string> = { passenger: 'badge-sage', driver: 'badge-green', admin: 'badge-warn' };
=======
type Phase = 'phone' | 'otp';

const roleLabel: Record<string, string> = {
  passenger: 'Passenger Login',
  driver: 'Driver Login',
  admin: 'Admin Login',
};

const roleBadge: Record<string, string> = {
  passenger: 'badge-sage',
  driver: 'badge-green',
  admin: 'badge-warn',
};
>>>>>>> a4055be (V2.1.1 : Fronted changes)

export const LoginPage: React.FC = () => {
  const [params] = useSearchParams();
  const role = params.get('role') || 'passenger';
  const navigate = useNavigate();
<<<<<<< HEAD
  const { login } = useAuth();
=======
  const { login, user } = useAuth();
>>>>>>> a4055be (V2.1.1 : Fronted changes)

  const [phase, setPhase] = useState<Phase>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

<<<<<<< HEAD
=======
  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate(user.role === 'passenger' ? '/passenger' : user.role === 'driver' ? '/driver' : '/admin', { replace: true });
    }
  }, [user, navigate]);

  // Countdown timer
>>>>>>> a4055be (V2.1.1 : Fronted changes)
  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { setError('Enter your phone number'); return; }
    setError(''); setLoading(true);
    try {
      const res = await sendOtp(phone.trim());
      setHint(res.otp ? `Dev OTP: ${res.otp}` : '');
      setPhase('otp');
      setTimer(60);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to send OTP');
<<<<<<< HEAD
    } finally { setLoading(false); }
=======
    } finally {
      setLoading(false);
    }
>>>>>>> a4055be (V2.1.1 : Fronted changes)
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    setError(''); setLoading(true);
    try {
      const res = await verifyOtp(phone.trim(), code.trim());
<<<<<<< HEAD
      if (res.token && res.user) {
        login(res.token, res.user as User);
        navigate(roleDest((res.user as User).role), { replace: true });
      } else if (res.exists === false) {
=======

      if (res.token && res.user) {
        login(res.token, res.user as User);
        const dest = (res.user as User).role === 'driver' ? '/driver' : (res.user as User).role === 'admin' ? '/admin' : '/passenger';
        navigate(dest, { replace: true });
      } else if (res.exists === false) {
        // New user — only passengers can self-register
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        if (role === 'passenger') {
          navigate(`/register?phone=${encodeURIComponent(phone.trim())}`, { replace: true });
        } else {
          setError('No account found. Contact your administrator.');
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid OTP');
<<<<<<< HEAD
    } finally { setLoading(false); }
=======
    } finally {
      setLoading(false);
    }
>>>>>>> a4055be (V2.1.1 : Fronted changes)
  };

  return (
    <div className="page-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <HeroScene />
<<<<<<< HEAD
      <div className="modal-box slide-up" style={{ position: 'relative', zIndex: 10, maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#84A98C', marginBottom: 8 }}>Bus-Share</div>
          <span className={`badge ${roleBadge[role] || 'badge-sage'}`}>{roleLabel[role] || 'Login'}</span>
=======

      <div className="modal-box slide-up" style={{ position: 'relative', zIndex: 10, maxWidth: 380 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#84A98C', marginBottom: 8 }}>Bus-Share</div>
          <span className={`badge ${roleBadge[role] || 'badge-sage'}`}>
            {roleLabel[role] || 'Login'}
          </span>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        </div>

        {phase === 'phone' ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label className="label">Phone Number</label>
<<<<<<< HEAD
              <input className="input" type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} autoFocus />
=======
              <input
                className="input"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                autoFocus
              />
>>>>>>> a4055be (V2.1.1 : Fronted changes)
            </div>
            {error && <div className="error-text">{error}</div>}
            <button className="btn btn-primary w-full mt-16" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Send OTP'}
            </button>
<<<<<<< HEAD
            {role === 'passenger' && (
              <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#52796F' }}>
                New user? <Link to="/register" style={{ color: '#84A98C', textDecoration: 'none' }}>Create account</Link>
=======

            {role === 'passenger' && (
              <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#52796F' }}>
                New user?{' '}
                <Link to="/register" style={{ color: '#84A98C', textDecoration: 'none' }}>Create account</Link>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
              </p>
            )}
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: '#84A98C', marginBottom: 4 }}>OTP sent to</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{phone}</div>
              {hint && (
<<<<<<< HEAD
                <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(132,169,140,0.1)', borderRadius: 6, fontSize: 12, color: '#84A98C', fontFamily: 'monospace' }}>
=======
                <div style={{
                  marginTop: 8,
                  padding: '6px 10px',
                  background: 'rgba(132,169,140,0.1)',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#84A98C',
                  fontFamily: 'monospace',
                }}>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
                  {hint}
                </div>
              )}
            </div>
<<<<<<< HEAD
            <div className="form-group">
              <label className="label">6-Digit OTP</label>
              <input
                className="input" type="text" inputMode="numeric" maxLength={6}
                placeholder="• • • • • •" value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                autoFocus style={{ letterSpacing: '0.4em', textAlign: 'center', fontSize: 20 }}
              />
            </div>
            {error && <div className="error-text">{error}</div>}
            <button className="btn btn-primary w-full mt-16" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Verify & Login'}
            </button>
=======

            <div className="form-group">
              <label className="label">6-Digit OTP</label>
              <input
                className="input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="• • • • • •"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                autoFocus
                style={{ letterSpacing: '0.4em', textAlign: 'center', fontSize: 20 }}
              />
            </div>

            {error && <div className="error-text">{error}</div>}

            <button className="btn btn-primary w-full mt-16" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Verify & Login'}
            </button>

>>>>>>> a4055be (V2.1.1 : Fronted changes)
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              {timer > 0 ? (
                <span style={{ fontSize: 12, color: '#52796F' }}>Resend in {timer}s</span>
              ) : (
<<<<<<< HEAD
                <button type="button" className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => { setPhase('phone'); setCode(''); setError(''); }}>
=======
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: 12 }}
                  onClick={() => { setPhase('phone'); setCode(''); setError(''); }}
                >
>>>>>>> a4055be (V2.1.1 : Fronted changes)
                  Change number / resend
                </button>
              )}
            </div>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 20 }}>
<<<<<<< HEAD
          <Link to="/" style={{ fontSize: 12, color: '#52796F', textDecoration: 'none' }}>← Back to home</Link>
=======
          <Link to="/" style={{ fontSize: 12, color: '#52796F', textDecoration: 'none' }}>
            ← Back to home
          </Link>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
