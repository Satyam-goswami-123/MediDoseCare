import { useNavigate } from 'react-router-dom';

export default function Onboarding2Page() {
  const navigate = useNavigate();
  return (
    <div className="page-enter" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: 24, background: 'var(--bg-primary)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
        <img
          src="/assets/health_monitor.png"
          alt="Health Tracking"
          style={{ width: '100%', height: 320, borderRadius: 'var(--radius-lg)', objectFit: 'cover', boxShadow: 'var(--shadow-card)' }}
        />
        <div>
          <div className="badge badge-blue" style={{ marginBottom: 16 }}>Health Tracking</div>
          <h1 style={{ marginBottom: 12 }}>Monitor Your Vitals Daily</h1>
          <p>Track blood pressure, sugar levels, heart rate, and SpO₂ in one place. Visualize trends with beautiful interactive charts.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="dot-indicators">
            <div className="dot" />
            <div className="dot active" />
            <div className="dot" />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-ghost" onClick={() => navigate('/onboarding/1')}>← Back</button>
            <button className="btn btn-primary" onClick={() => navigate('/onboarding/3')}>Next →</button>
          </div>
        </div>
      </div>
      <button className="btn btn-ghost btn-full" style={{ marginTop: 16 }} onClick={() => navigate('/login')}>Skip</button>
    </div>
  );
}
