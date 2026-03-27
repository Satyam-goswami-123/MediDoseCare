import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function SosPage() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [triggered, setTriggered] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!triggered) return;
    if (countdown <= 0) { setSending(true); setTimeout(() => setSent(true), 1500); return; }
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [triggered, countdown]);

  const handleSos = () => setTriggered(true);
  const handleCancel = () => { setTriggered(false); setCountdown(5); setSending(false); setSent(false); };

  return (
    <div className="page-enter" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: sent ? 'linear-gradient(135deg,#14532d,#0f3320)' : 'linear-gradient(135deg,#7f1d1d 0%,#0d0f14 60%)' }}>
      <div className="page-header" style={{ background: 'transparent' }}>
        <button className="back-btn" onClick={() => navigate('/home')}>←</button>
        <h2>Emergency SOS</h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 32 }}>
        {sent ? (
          <div className="slide-up" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>✅</div>
            <h2 style={{ color: 'var(--green-light)', marginBottom: 12 }}>Help is on the way!</h2>
            <p>Your emergency contacts have been notified. Stay calm.</p>
            <div className="card" style={{ marginTop: 24 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Contacted:</p>
              <p style={{ fontWeight: 700, marginTop: 4 }}>📞 {user?.emergency_contact || '9876543211'}</p>
            </div>
            <button className="btn btn-ghost btn-full" style={{ marginTop: 24 }} onClick={handleCancel}>← Back to Safety</button>
          </div>
        ) : triggered ? (
          <div className="slide-up" style={{ textAlign: 'center' }}>
            {sending ? (
              <>
                <div style={{ fontSize: 64, marginBottom: 16, animation: 'pulse 1s infinite' }}>📡</div>
                <h2 style={{ color: 'var(--amber)' }}>Sending Alert...</h2>
                <p style={{ marginTop: 8 }}>Notifying your emergency contacts</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 100, fontWeight: 900, color: 'var(--red)', lineHeight: 1, textShadow: '0 0 40px rgba(239,68,68,0.7)' }}>{countdown}</div>
                <h3 style={{ marginTop: 16 }}>SOS sending in {countdown}s</h3>
                <p style={{ marginTop: 8 }}>Tap cancel to stop the alert</p>
                <button className="btn btn-ghost btn-full" style={{ marginTop: 32 }} onClick={handleCancel}>✖ Cancel SOS</button>
              </>
            )}
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--red-light)', marginBottom: 8 }}>Emergency?</h3>
              <p>Press the button below to immediately alert your caregivers and family</p>
            </div>
            <button className="sos-btn" onClick={handleSos}>
              <span style={{ fontSize: 36 }}>🆘</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>SOS</span>
            </button>
            <div style={{ width: '100%' }}>
              <div className="section-label" style={{ textAlign: 'center' }}>Emergency Contacts</div>
              {[
                { name: 'Suresh Kumar (Son)', phone: user?.emergency_contact || '9876543211', relation: 'Family' },
                { name: 'Dr. Priya Sharma', phone: '9988776655', relation: 'Doctor' },
                { name: 'Ambulance', phone: '108', relation: 'Emergency' },
              ].map(({ name, phone, relation }) => (
                <div key={phone} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {relation === 'Family' ? '👨' : relation === 'Doctor' ? '👩‍⚕️' : '🚑'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{phone}</div>
                  </div>
                  <span className="badge badge-red">{relation}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
