import React from 'react';

interface Props {
  booking: { qrImage: string; busNumber: string; routeName?: string; createdAt?: string; amount?: number };
  onClose?: () => void;
  title?: string;
}

export const QRTicket: React.FC<Props> = ({ booking, onClose, title = 'Your Ticket' }) => {
  const issuedAt = booking.createdAt
    ? new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ background: 'rgba(1,22,30,0.95)', border: '1px solid rgba(132,169,140,0.35)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#CAD2C5' }}>Bus {booking.busNumber}</div>
        {booking.routeName && <div style={{ fontSize: 13, color: '#84A98C', marginTop: 2 }}>{booking.routeName}</div>}
      </div>

      <div style={{ display: 'inline-block', padding: 12, background: '#fff', borderRadius: 12, marginBottom: 16 }}>
        <img src={booking.qrImage} alt="QR Ticket" style={{ width: 180, height: 180, display: 'block' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontSize: 13, color: '#52796F', marginBottom: 16 }}>
        <span>Fare: <span style={{ color: '#84A98C', fontWeight: 600 }}>₹{booking.amount ?? 20}</span></span>
        <span>Issued: <span style={{ color: '#84A98C', fontWeight: 600 }}>{issuedAt}</span></span>
      </div>

      <div style={{ padding: '8px 14px', background: 'rgba(82,183,136,0.1)', border: '1px solid rgba(82,183,136,0.25)', borderRadius: 8, fontSize: 12, color: '#52B788', marginBottom: 16 }}>
        Show this QR to the driver when boarding · Valid for single use
      </div>

      {onClose && <button className="btn btn-outline w-full" onClick={onClose}>Done</button>}
    </div>
  );
};

export default QRTicket;
