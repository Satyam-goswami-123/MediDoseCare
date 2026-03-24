import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, Pill, HeartPulse, FileText, User } from 'lucide-react';

const NAV = [
  { path: '/home', icon: <Home size={22} />, label: 'Home' },
  { path: '/medicines', icon: <Pill size={22} />, label: 'Medicines' },
  { path: '/health', icon: <HeartPulse size={22} />, label: 'Health' },
  { path: '/prescriptions', icon: <FileText size={22} />, label: 'Rx' },
  { path: '/profile', icon: <User size={22} />, label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { unreadCount } = useApp();

  return (
    <nav className="bottom-nav">
      <div className="nav-brand">
        <div className="nav-logo"><Pill size={20} color="white" /></div>
        <span className="nav-title">MediDoseCare</span>
      </div>
      <div className="nav-links-container">
        {NAV.map(({ path, icon, label }) => {
          const isActive = pathname.startsWith(path);
          const showBadge = path === '/home' && unreadCount > 0;
          return (
            <button key={path} className={`nav-item${isActive ? ' active' : ''}`} onClick={() => navigate(path)}>
              <span style={{ position: 'relative', display: 'flex' }}>
                {icon}
                {showBadge && (
                  <span style={{
                    position: 'absolute', top: -4, right: -6,
                    background: 'var(--red)', color: '#fff',
                    borderRadius: '50%', width: 16, height: 16,
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{unreadCount}</span>
                )}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
