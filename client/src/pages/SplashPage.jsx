import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill } from 'lucide-react';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding/1'), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="splash-bg page-enter" style={{ minHeight: '100dvh', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div className="logo-ring"><Pill size={48} color="white" /></div>
        <div style={{ textAlign: 'center' }}>
          <div className="logo-text">MediDose</div>
          <div className="logo-text" style={{ fontSize: 22, marginTop: -4 }}>Care</div>
          <p className="tagline" style={{ marginTop: 8 }}>Your Health, Simplified</p>
        </div>
      </div>
      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
      <p className="tagline" style={{ marginTop: 24, fontSize: 13 }}>Trusted by 50,000+ seniors</p>
    </div>
  );
}
