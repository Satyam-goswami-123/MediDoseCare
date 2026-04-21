import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, Vibrate, Volume2, Globe, Cloud, Moon, ArrowLeft, ChevronRight, ToggleLeft, ToggleRight, AlertTriangle, Zap } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings, theme, toggleTheme, triggerReminder } = useApp();

  const handleToggle = (key) => {
    updateSettings({ [key]: !settings[key] });
    
    // Simulate soft tactile feedback
    if (key === 'vibration' && !settings.vibration && "vibrate" in navigator) {
      window.navigator.vibrate(50);
    }
  };

  const menuGroups = [
    {
      title: 'Alerts & Reminders',
      items: [
        { 
          id: 'vibration', 
          label: 'Vibration feedback', 
          desc: 'Gentle pulses for reminders',
          icon: <Vibrate size={20} className="text-blue" />, 
          type: 'toggle',
          value: settings.vibration
        },
        { 
          id: 'softNotifications', 
          label: 'Soft notifications', 
          desc: 'Subtle popups and banners',
          icon: <Bell size={20} className="text-purple" />, 
          type: 'toggle',
          value: settings.softNotifications
        },
        { 
          id: 'soundEnabled', 
          label: 'Reminder sounds', 
          desc: 'Play audio alert when due',
          icon: <Volume2 size={20} className="text-pink" />, 
          type: 'toggle',
          value: settings.soundEnabled
        },
        { 
          id: 'skipAlerts', 
          label: 'Missed dose alerts', 
          desc: 'Remind me if I miss a scheduled dose',
          icon: <AlertTriangle size={20} style={{ color: 'var(--red)' }} />, 
          type: 'toggle',
          value: settings.skipAlerts ?? true,
          action: () => handleToggle('skipAlerts')
        }
      ]
    },
    {
      title: 'Appearance',
      items: [
        { 
          id: 'darkMode', 
          label: 'Dark Mode', 
          desc: 'Reduce eye strain at night',
          icon: <Moon size={20} className="text-indigo" />, 
          type: 'toggle',
          value: theme === 'dark',
          customAction: toggleTheme
        }
      ]
    },
    {
      title: 'System',
      items: [
        { 
          id: 'language', 
          label: 'Display Language', 
          desc: 'English (US)',
          icon: <Globe size={20} className="text-orange" />, 
          type: 'link'
        },
        { 
          id: 'sync', 
          label: 'Health Data Sync', 
          desc: 'Backup your reports automtically',
          icon: <Cloud size={20} className="text-teal" />, 
          type: 'toggle',
          value: settings.autoSync,
          action: () => handleToggle('autoSync')
        },
        { 
          id: 'healthTips', 
          label: 'Daily Health Tips', 
          desc: 'Get personalized wellness advice',
          icon: <Zap size={20} className="text-yellow" />, 
          type: 'toggle',
          value: settings.healthTips ?? true,
          action: () => handleToggle('healthTips')
        }
      ]
    }
  ];

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header" style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10, 
          background: 'var(--bg-nav)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)',
          margin: '0 -20px 0',
          padding: '20px'
        }}>
          <button className="back-btn" onClick={() => navigate('/profile')}>
            <ArrowLeft size={20} />
          </button>
          <h2>Settings</h2>
        </div>

        <div style={{ padding: '0 20px 40px' }}>
          {menuGroups.map((group) => (
            <div key={group.title} style={{ marginTop: 24 }}>
              <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-secondary)', marginLeft: 8, marginBottom: 8, letterSpacing: '0.05em' }}>
                {group.title}
              </h4>
              <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {group.items.map((item, i) => (
                  <div 
                    key={item.id} 
                    className="settings-item"
                    onClick={() => {
                      if (item.type !== 'toggle') return;
                      if (item.customAction) item.customAction();
                      else if (item.action) item.action();
                      else handleToggle(item.id);
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 16, 
                      padding: '16px', 
                      borderBottom: i < group.items.length - 1 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 12, 
                      background: 'rgba(var(--blue-rgb), 0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 15 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <div>
                      {item.type === 'toggle' ? (
                        item.value ? (
                          <ToggleRight size={32} className="text-blue" style={{ opacity: 1 }} />
                        ) : (
                          <ToggleLeft size={32} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                        )
                      ) : (
                        <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24 }}>
            <button 
              className="btn btn-full" 
              style={{ background: 'rgba(var(--blue-rgb), 0.1)', color: 'var(--blue)', border: '1px solid rgba(var(--blue-rgb), 0.2)' }}
              onClick={() => triggerReminder('Test Reminder', 'This is how your medicine reminders will appear.')}
            >
              🔔 Test Current Settings
            </button>
          </div>

          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>MediDoseCare v2.4.0</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Proudly keeping you healthy ❤️</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-blue { color: var(--blue); }
        .text-purple { color: var(--purple); }
        .text-pink { color: #ec4899; }
        .text-orange { color: #f97316; }
        .text-teal { color: #14b8a6; }
        .text-indigo { color: #6366f1; }
        .text-yellow { color: #eab308; }
        .settings-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: var(--transition);
        }
        .settings-item:last-child {
          border-bottom: none;
        }
        .settings-item:hover {
          background: var(--bg-card-hover);
        }
        .settings-item:active {
          transform: scale(0.98);
        }
      `}} />
    </div>
  );
}
