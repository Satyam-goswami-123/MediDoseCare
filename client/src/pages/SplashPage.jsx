import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Pill } from 'lucide-react';

export default function SplashPage() {
  const navigate = useNavigate();
  const { user, loading } = useApp();

  useEffect(() => {
    if (loading) return;

    const t = setTimeout(() => {
      if (user) {
        // Logged-in: go to role-specific dashboard
        navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/home');
      } else {
        // Guest: show onboarding once, then always go to /home
        const hasSeenOnboarding = localStorage.getItem('mdc_has_seen_onboarding');
        if (!hasSeenOnboarding) {
          navigate('/onboarding/1');
        } else {
          navigate('/home'); // Guest lands on dashboard directly
        }
      }
    }, 1500);

    return () => clearTimeout(t);
  }, [loading, user, navigate]);

  return (
    <div className="splash-bg page-enter">
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
