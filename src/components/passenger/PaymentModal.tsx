import React, { useState } from 'react';
import { topupWallet, payForRide } from '../../api/client';
import type { Bus } from '../../types';

type Step = 'review' | 'paying';

interface Props {
  bus: Bus;
  onSuccess: (data: { qrImage: string; busNumber: string; routeName: string; balance: number }) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<Props> = ({ bus, onSuccess, onClose }) => {
  const [step, setStep] = useState<Step>('review');
  const [error, setError] = useState('');

  const handlePay = async () => {
    setStep('paying'); setError('');
    try {
      await topupWallet(20);
      const result = await payForRide(bus.id);
      onSuccess({ qrImage: result.qrImage, busNumber: result.busNumber, routeName: result.routeName, balance: result.balance });
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Payment failed');
      setStep('review');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(132,169,140,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#528FF0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff' }}>R</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f4f0' }}>Razorpay</div>
              <div style={{ fontSize: 11, color: '#52796F' }}>Secure Payments</div>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 18 }} onClick={onClose}>×</button>
        </div>

        <div style={{ background: 'rgba(132,169,140,0.06)', border: '1px solid rgba(132,169,140,0.15)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#52796F', marginBottom: 4 }}>Paying to</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Bus-Share Transit</div>
          <div style={{ fontSize: 12, color: '#84A98C', marginTop: 2 }}>Bus {bus.number}{bus.routeName ? ` · ${bus.routeName}` : ''}</div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#52796F', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount Due</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: '#CAD2C5', letterSpacing: '-0.02em' }}>₹20</div>
          <div style={{ fontSize: 12, color: '#52796F', marginTop: 4 }}>Single ride — flat fare</div>
        </div>

        {step === 'review' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#52796F', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Payment Method</div>
              <div style={{ border: '2px solid rgba(132,169,140,0.4)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 24, background: 'linear-gradient(135deg, #f4a261, #e76f51)', borderRadius: 4 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>UPI / Wallet (Demo)</div>
                  <div style={{ fontSize: 11, color: '#52796F' }}>busshare@demo</div>
                </div>
                <div style={{ marginLeft: 'auto' }}><span className="badge badge-green">Selected</span></div>
              </div>
            </div>
            {error && <div className="error-text" style={{ marginBottom: 12 }}>{error}</div>}
            <button className="btn btn-primary w-full" style={{ fontSize: 15, padding: '13px' }} onClick={handlePay}>Pay ₹20 →</button>
          </>
        )}

        {step === 'paying' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
            <div style={{ marginTop: 12, color: '#84A98C', fontSize: 13 }}>Processing payment...</div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#52796F' }}>
          🔒 Secured by Razorpay (Demo Mode)
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
