import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';


const TYPE_ICONS = { reminder: '💊', alert: '⚠️', info: 'ℹ️', sos: '🆘' };
const TYPE_COLORS = { reminder: 'var(--green)', alert: 'var(--red)', info: 'var(--blue)', sos: 'var(--red)' };

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, unreadCount } = useApp();

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>Notifications {unreadCount > 0 && <span style={{ background: 'var(--red)', color: '#fff', borderRadius: '50%', padding: '2px 8px', fontSize: 14, marginLeft: 8 }}>{unreadCount}</span>}</h2>
        </div>
        <div style={{ padding: '8px 20px 20px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 56 }}>🔔</div>
              <h3 style={{ marginTop: 16 }}>All caught up!</h3>
              <p style={{ marginTop: 8 }}>No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} onClick={() => markNotificationRead(n.id)}
                style={{ display: 'flex', gap: 12, padding: '14px 16px', background: n.is_read ? 'var(--bg-card)' : 'rgba(59,130,246,0.06)', border: `1px solid ${n.is_read ? 'var(--border)' : 'rgba(59,130,246,0.2)'}`, borderRadius: 'var(--radius-md)', marginBottom: 10, cursor: 'pointer', transition: 'var(--transition)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: `${TYPE_COLORS[n.type]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{TYPE_ICONS[n.type]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: n.is_read ? 500 : 700, color: 'var(--text-primary)', fontSize: 14 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{new Date(n.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0, marginTop: 4 }} />}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
