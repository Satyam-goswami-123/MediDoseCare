import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const INSIGHTS = [
  { icon: '⚠️', title: 'Blood Sugar Trending Up', desc: 'Your fasting glucose rose 8% over 3 days. Consider reducing evening carbs.', color: 'var(--amber)', priority: 'high' },
  { icon: '✅', title: 'BP Within Healthy Range', desc: 'Your blood pressure readings have been stable this week. Great progress!', color: 'var(--green)', priority: 'good' },
  { icon: '💊', title: 'Adherence at 80%', desc: 'You missed 2 Amlodipine doses. Set a louder alarm for 9 AM to stay on track.', color: 'var(--blue)', priority: 'med' },
  { icon: '🚶', title: 'Activity Recommendation', desc: 'A 20-minute morning walk can lower your blood pressure by up to 8 mmHg.', color: 'var(--teal)', priority: 'tip' },
  { icon: '💧', title: 'Hydration Reminder', desc: 'Seniors need 8 glasses of water daily. Staying hydrated helps all your vitals.', color: 'var(--indigo)', priority: 'tip' },
];

export default function AiCoachPage() {
  const navigate = useNavigate();
  const { medicines, healthLogs } = useApp();
  const latest = healthLogs[0] || {};

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>AI Health Coach</h2>
        </div>
        <div style={{ padding: '8px 20px 20px' }}>
          {/* Hero */}
          <div className="ai-card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 36 }}>🤖</span>
              <div>
                <h3 style={{ color: 'var(--indigo)' }}>Hello, I'm your AI Coach</h3>
                <p style={{ fontSize: 13 }}>Personalized health insights just for you</p>
              </div>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Based on your recent vitals and medication history, I've found <strong style={{ color: 'var(--purple-light)' }}>5 insights</strong> to help improve your health this week.
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Medicines', value: medicines.length, icon: '💊' },
              { label: 'Avg BP', value: `${latest.systolic || 128}/${latest.diastolic || 82}`, icon: '🩸' },
              { label: 'Glucose', value: `${latest.blood_sugar || 118}`, icon: '🩺' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', marginTop: 4 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="section-label">AI Insights</div>
          {INSIGHTS.map((ins, i) => (
            <div key={i} className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${ins.color}`, paddingLeft: 14 }}>
              <div className="flex items-center gap-12" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{ins.icon}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{ins.title}</span>
                <span className="badge" style={{ marginLeft: 'auto', background: `${ins.color}20`, color: ins.color, fontSize: 10 }}>{ins.priority.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6 }}>{ins.desc}</p>
            </div>
          ))}

          {/* Voice tip */}
          <div className="card" style={{ marginTop: 8, textAlign: 'center', borderColor: 'rgba(168,85,247,0.3)', background: 'var(--purple-dim)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎙️</div>
            <h4 style={{ color: 'var(--purple-light)' }}>Voice Assistant</h4>
            <p style={{ fontSize: 13, marginTop: 4 }}>Say "Hey MediDose, what medicines do I need today?"</p>
            <button className="btn btn-sm" style={{ marginTop: 12, background: 'var(--purple)', color: '#fff' }}>🎤 Activate Voice</button>
          </div>
        </div>
      </div>
    </div>
  );
}
