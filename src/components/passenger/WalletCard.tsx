import React, { useState } from 'react';
import { topupWallet } from '../../api/client';

<<<<<<< HEAD
interface Props { balance: number; onUpdate: (balance: number) => void; }
=======
interface Props {
  balance: number;
  onUpdate: (balance: number) => void;
}
>>>>>>> a4055be (V2.1.1 : Fronted changes)

export const WalletCard: React.FC<Props> = ({ balance, onUpdate }) => {
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0 || amt > 10000) { setError('Enter amount between 1 and 10000'); return; }
    setLoading(true); setError('');
    try {
      const res = await topupWallet(amt);
      onUpdate(res.balance);
<<<<<<< HEAD
      setAdding(false); setAmount('');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Topup failed');
    } finally { setLoading(false); }
=======
      setAdding(false);
      setAmount('');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Topup failed');
    } finally {
      setLoading(false);
    }
>>>>>>> a4055be (V2.1.1 : Fronted changes)
  };

  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
<<<<<<< HEAD
          <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Wallet Balance</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#CAD2C5' }}>₹{balance.toFixed(2)}</div>
        </div>
        {!adding && <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={() => setAdding(true)}>Add Money</button>}
=======
          <div style={{ fontSize: 11, color: '#52796F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Wallet Balance
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#CAD2C5' }}>
            ₹{balance.toFixed(2)}
          </div>
        </div>
        {!adding && (
          <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={() => setAdding(true)}>
            Add Money
          </button>
        )}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
      </div>

      {adding && (
        <form onSubmit={handleTopup} style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 10 }}>
<<<<<<< HEAD
            <input className="input" type="number" min={1} max={10000} placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} autoFocus style={{ flex: 1 }} />
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ flexShrink: 0 }}>
              {loading ? <span className="spinner" /> : 'Add'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { setAdding(false); setAmount(''); setError(''); }} style={{ flexShrink: 0 }}>Cancel</button>
=======
            <input
              className="input"
              type="number"
              min={1}
              max={10000}
              placeholder="Amount (₹)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              autoFocus
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ flexShrink: 0 }}>
              {loading ? <span className="spinner" /> : 'Add'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => { setAdding(false); setAmount(''); setError(''); }}
              style={{ flexShrink: 0 }}
            >
              Cancel
            </button>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
          </div>
          {error && <div className="error-text">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default WalletCard;
