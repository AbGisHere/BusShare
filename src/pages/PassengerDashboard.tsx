import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSocketEvent } from '../hooks/useSocket';
import { fetchBuses, fetchWallet, fetchActiveBooking } from '../api/client';
import { NavBar } from '../components/shared/NavBar';
import { BusCard } from '../components/passenger/BusCard';
import { WalletCard } from '../components/passenger/WalletCard';
import { PaymentModal } from '../components/passenger/PaymentModal';
import { QRTicket } from '../components/passenger/QRTicket';
import type { Bus, Booking } from '../types';

export const PassengerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [buses, setBuses] = useState<Bus[]>([]);
  const [balance, setBalance] = useState(0);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
<<<<<<< HEAD
  const [showQR, setShowQR] = useState<null | { qrImage: string; busNumber: string; routeName: string; balance: number }>(null);
=======
  const [showQR, setShowQR] = useState<null | {
    qrImage: string; busNumber: string; routeName: string; balance: number;
  }>(null);
>>>>>>> a4055be (V2.1.1 : Fronted changes)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
<<<<<<< HEAD
      const [busRes, walletRes, bookingRes] = await Promise.all([fetchBuses(), fetchWallet(), fetchActiveBooking()]);
      setBuses(busRes.buses);
      setBalance(walletRes.balance);
      setActiveBooking(bookingRes.booking);
    } catch {
=======
      const [busRes, walletRes, bookingRes] = await Promise.all([
        fetchBuses(),
        fetchWallet(),
        fetchActiveBooking(),
      ]);
      setBuses(busRes.buses);
      setBalance(walletRes.balance);
      setActiveBooking(bookingRes.booking);
    } catch (err: any) {
>>>>>>> a4055be (V2.1.1 : Fronted changes)
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

<<<<<<< HEAD
  useSocketEvent<{ busId: number; lat: number; lng: number; routeId: number }>('bus:moved', ({ busId, lat, lng }) => {
    setBuses(prev => prev.map(b => b.id === busId ? { ...b, currentLat: lat, currentLng: lng, lastUpdated: new Date().toISOString() } : b));
=======
  // Listen for live bus position updates
  useSocketEvent<{ busId: number; lat: number; lng: number; routeId: number }>('bus:moved', ({ busId, lat, lng }) => {
    setBuses(prev => prev.map(b =>
      b.id === busId ? { ...b, currentLat: lat, currentLng: lng, lastUpdated: new Date().toISOString() } : b
    ));
>>>>>>> a4055be (V2.1.1 : Fronted changes)
  });

  const handleLogout = () => { logout(); navigate('/'); };

  const handlePaymentSuccess = (data: { qrImage: string; busNumber: string; routeName: string; balance: number }) => {
    setSelectedBus(null);
    setBalance(data.balance);
    setShowQR(data);
<<<<<<< HEAD
=======
    // Refresh active booking
>>>>>>> a4055be (V2.1.1 : Fronted changes)
    fetchActiveBooking().then(res => setActiveBooking(res.booking)).catch(() => {});
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#01161E' }}>
      <NavBar user={user} onLogout={handleLogout} />

<<<<<<< HEAD
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '72px 20px 40px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}><span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} /></div>
=======
      <div style={{ paddingTop: 72, maxWidth: 860, margin: '0 auto', padding: '72px 20px 40px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
          </div>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        ) : error ? (
          <div className="error-text" style={{ textAlign: 'center', paddingTop: 60, fontSize: 15 }}>{error}</div>
        ) : (
          <>
<<<<<<< HEAD
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#CAD2C5', marginBottom: 2 }}>Welcome, {user.name}</h1>
=======
            {/* Welcome + Wallet */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#CAD2C5', marginBottom: 2 }}>
                  Welcome, {user.name}
                </h1>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
                <p style={{ fontSize: 13, color: '#52796F' }}>
                  {buses.length > 0 ? `${buses.length} bus${buses.length !== 1 ? 'es' : ''} active on campus` : 'No buses currently active'}
                </p>
              </div>
              <WalletCard balance={balance} onUpdate={setBalance} />
            </div>

<<<<<<< HEAD
            {activeBooking && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Active Ticket</div>
                <QRTicket booking={{ qrImage: activeBooking.qrImage, busNumber: activeBooking.busNumber || '—', routeName: activeBooking.routeName, createdAt: activeBooking.createdAt, amount: activeBooking.amount }} title="Active Ticket" />
              </div>
            )}

            <div>
              <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Live Buses</div>
              {buses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: '#52796F', border: '1px dashed rgba(132,169,140,0.2)', borderRadius: 12 }}>
=======
            {/* Active ticket */}
            {activeBooking && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                  Active Ticket
                </div>
                <QRTicket
                  booking={{
                    qrImage: activeBooking.qrImage,
                    busNumber: activeBooking.busNumber || '—',
                    routeName: activeBooking.routeName,
                    createdAt: activeBooking.createdAt,
                    amount: activeBooking.amount,
                  }}
                  title="Active Ticket"
                />
              </div>
            )}

            {/* Live buses */}
            <div>
              <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Live Buses
              </div>
              {buses.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 20px',
                  color: '#52796F',
                  border: '1px dashed rgba(132,169,140,0.2)',
                  borderRadius: 12,
                }}>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
                  No buses are currently active. Check back soon.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
<<<<<<< HEAD
                  {buses.map(bus => <BusCard key={bus.id} bus={bus} onBook={setSelectedBus} />)}
=======
                  {buses.map(bus => (
                    <BusCard key={bus.id} bus={bus} onBook={setSelectedBus} />
                  ))}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
                </div>
              )}
            </div>
          </>
        )}
      </div>

<<<<<<< HEAD
      {selectedBus && <PaymentModal bus={selectedBus} onSuccess={handlePaymentSuccess} onClose={() => setSelectedBus(null)} />}

      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 340 }}>
            <QRTicket booking={{ ...showQR, createdAt: new Date().toISOString(), amount: 20 }} onClose={() => setShowQR(null)} title="Payment Successful" />
=======
      {/* Payment modal */}
      {selectedBus && (
        <PaymentModal
          bus={selectedBus}
          onSuccess={handlePaymentSuccess}
          onClose={() => setSelectedBus(null)}
        />
      )}

      {/* QR result modal */}
      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 340 }}>
            <QRTicket
              booking={{ ...showQR, createdAt: new Date().toISOString(), amount: 20 }}
              onClose={() => setShowQR(null)}
              title="Payment Successful"
            />
>>>>>>> a4055be (V2.1.1 : Fronted changes)
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;
