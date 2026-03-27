import { useNavigate } from 'react-router-dom';

export default function Onboarding3Page() {
  const navigate = useNavigate();
  return (
    <div className="page-enter" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: 24, background: 'var(--bg-primary)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
        <img
          src="/assets/emergency_sos.png"
          alt="Emergency SOS"
          style={{ width: '100%', height: 320, borderRadius: 'var(--radius-lg)', objectFit: 'cover', boxShadow: 'var(--shadow-card)' }}
        />
        <div>
          <div className="badge badge-red" style={{ marginBottom: 16 }}>Emergency SOS</div>
          <h1 style={{ marginBottom: 12 }}>One Tap to Safety</h1>
          <p>Instantly alert your caregivers and doctors in an emergency. Share your live location with a single tap — day or night.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="dot-indicators">
            <div className="dot" />
            <div className="dot" />
            <div className="dot active" />
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/onboarding/2')}>← Back</button>
        </div>
      </div>
      <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={() => navigate('/login')}>Get Started</button>
    </div>
  );
}
