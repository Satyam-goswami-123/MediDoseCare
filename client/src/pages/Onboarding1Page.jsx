import { useNavigate } from 'react-router-dom';

export default function Onboarding1Page() {
  const navigate = useNavigate();
  return (
    <div className="page-enter" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: 24, background: 'var(--bg-primary)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
        <img
          src="/assets/medication_reminder.png"
          alt="Medicine Reminders"
          style={{ width: '100%', height: 320, borderRadius: 'var(--radius-lg)', objectFit: 'cover', boxShadow: 'var(--shadow-card)' }}
        />
        <div>
          <div className="badge badge-green" style={{ marginBottom: 16 }}>Medicine Reminders</div>
          <h1 style={{ marginBottom: 12 }}>Never Miss a Dose Again</h1>
          <p>Smart reminders that adapt to your schedule. Get notified at the right time, every time — even when offline.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="dot-indicators">
            <div className="dot active" />
            <div className="dot" />
            <div className="dot" />
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/onboarding/2')}>Next →</button>
        </div>
      </div>
      <button className="btn btn-ghost btn-full" style={{ marginTop: 16 }} onClick={() => navigate('/login')}>Skip</button>
    </div>
  );
}
