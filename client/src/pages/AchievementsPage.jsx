import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AchievementsPage() {
  const navigate = useNavigate();
  const { achievements, streak, medicines } = useApp();
  const taken = medicines.filter((m) => m.status === 'taken').length;
  const adherencePct = medicines.length ? Math.round((taken / medicines.length) * 100) : 0;

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>Achievements</h2>
        </div>
        <div style={{ padding: '8px 20px 20px' }}>
          {/* Streak hero */}
          <div className="card card-lg" style={{ marginBottom: 20, textAlign: 'center', background: 'linear-gradient(135deg,rgba(234,179,8,0.15),rgba(245,158,11,0.06))', borderColor: 'rgba(234,179,8,0.3)' }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>🔥</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--gold)' }}>{streak}</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 18 }}>Day Streak!</div>
            <p style={{ fontSize: 13, marginTop: 6 }}>You've been taking medicines consistently. Keep it up!</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
              {[
                { label: 'Best Streak', value: `${streak + 3}d`, icon: '🏆' },
                { label: 'Adherence', value: `${adherencePct}%`, icon: '💊' },
                { label: 'Badges', value: achievements.filter(a => a.earned).length, icon: '🎖️' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ padding: '12px 8px', background: 'rgba(234,179,8,0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: 22 }}>{icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--gold)' }}>{value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Heatmap */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h4 style={{ marginBottom: 12 }}>This Week</h4>
            <div style={{ display: 'flex', gap: 6 }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const levels = [1, 1, 1, 0.5, 1, 1, 0];
                const opacity = levels[i];
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', aspectRatio: '1', borderRadius: 8, background: opacity > 0.7 ? 'var(--green)' : opacity > 0 ? 'rgba(34,197,94,0.4)' : 'var(--border)' }} />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{day}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--green)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>All taken</span>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(34,197,94,0.4)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Partial</span>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--border)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Missed</span>
            </div>
          </div>

          {/* Badges */}
          <div className="section-label">Badges</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {achievements.map((a) => (
              <div key={a.id} className={`achievement-badge${a.earned ? ' earned' : ''}`}>
                <span className="badge-icon">{a.icon}</span>
                <span className="badge-name">{a.name}</span>
                {a.earned && <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 600 }}>Earned ✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
