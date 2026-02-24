import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { scanQR } from '../../api/client';
import type { ScanResult } from '../../types';

interface Props { ttsEnabled: boolean; onClose: () => void; }
type ScanState = 'scanning' | 'processing' | 'result';

function speak(text: string) {
  if ('speechSynthesis' in window) {
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.1; utt.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  }
}

export const QRScanner: React.FC<Props> = ({ ttsEnabled, onClose }) => {
  const [state, setState] = useState<ScanState>('scanning');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const containerId = 'qr-scanner-container';

  const startScanner = (onDecoded: (text: string) => void) => {
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      onDecoded,
      () => {}
    ).catch(err => setError(`Camera error: ${err?.message || 'Cannot access camera'}`));
    return scanner;
  };

  const handleDecoded = async (decodedText: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    try { await scannerRef.current?.stop(); } catch { /* ignore */ }
    setState('processing');
    try {
      const res = await scanQR(decodedText);
      setResult(res);
      setState('result');
      if (ttsEnabled) {
        speak(res.valid ? `Valid ticket. Welcome aboard, ${res.passengerName || 'passenger'}.` : `Invalid ticket. ${res.reason || ''}`);
      }
    } catch {
      setResult({ valid: false, reason: 'Network error. Please try again.' });
      setState('result');
    }
  };

  useEffect(() => {
    startScanner(handleDecoded);
    return () => { scannerRef.current?.stop().catch(() => {}); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScanAnother = () => {
    processingRef.current = false;
    setResult(null);
    setState('scanning');
    startScanner(handleDecoded);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: '#CAD2C5' }}>Scan QR Ticket</div>
          <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 20 }} onClick={onClose}>×</button>
        </div>

        {error ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📵</div>
            <div className="error-text">{error}</div>
            <p style={{ fontSize: 12, color: '#52796F', marginTop: 8 }}>Allow camera access and try again.</p>
            <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '2px solid rgba(132,169,140,0.3)', marginBottom: 16, position: 'relative', minHeight: 260, background: '#000' }}>
              <div id={containerId} style={{ width: '100%' }} />

              {state === 'processing' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(1,22,30,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
                  <span style={{ fontSize: 13, color: '#84A98C' }}>Validating...</span>
                </div>
              )}

              {state === 'result' && result && (
                <div style={{ position: 'absolute', inset: 0, background: result.valid ? 'rgba(82,183,136,0.92)' : 'rgba(231,111,81,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 20 }}>
                  <div style={{ fontSize: 52 }}>{result.valid ? '✓' : '✗'}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{result.valid ? 'VALID' : 'INVALID'}</div>
                  {result.valid && result.passengerName && <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{result.passengerName}</div>}
                  {!result.valid && result.reason && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>{result.reason}</div>}
                </div>
              )}
            </div>

            {state === 'scanning' && <p style={{ fontSize: 12, color: '#52796F', textAlign: 'center', marginBottom: 16 }}>Point camera at passenger's QR code</p>}

            {state === 'result' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleScanAnother}>Scan Another</button>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Close</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
