import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Pill, Bell, AlertTriangle, Sun, Moon, Home, HeartPulse, FileText, User, Globe } from 'lucide-react';

const NAV = [
  { path: '/home', icon: <Home size={18} />, label: 'Home' },
  { path: '/medicines', icon: <Pill size={18} />, label: 'Medicines' },
  { path: '/health', icon: <HeartPulse size={18} />, label: 'Health' },
  { path: '/prescriptions', icon: <FileText size={18} />, label: 'Rx' },
  { path: '/profile', icon: <User size={18} />, label: 'Profile' },
];

export default function GlobalHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggleTheme, unreadCount, language, setLanguage } = useApp();

  return (
    <header className="global-header">
      <div className="header-container">
        {/* Brand */}
        <div className="header-brand" onClick={() => navigate('/home')}>
          <div className="header-logo">
            <Pill size={18} color="white" />
          </div>
          <div className="header-title-stack">
            <span className="header-title-main">MediDose</span>
            <span className="header-title-sub">Care</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="header-nav">
          {NAV.map(({ path, icon, label }) => {
            const isActive = pathname.startsWith(path);
            return (
              <button 
                key={path} 
                className={`header-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(path)}
              >
                {icon}
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="header-actions">

          <button className="header-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="header-btn" onClick={() => navigate('/notifications')} style={{ position: 'relative' }}>
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="header-badge">{unreadCount}</span>
            )}
          </button>
          <button className="header-btn sos-mini" onClick={() => navigate('/sos')}>
            <AlertTriangle size={18} color="var(--red)" />
          </button>
        </div>
      </div>
    </header>
  );
}
