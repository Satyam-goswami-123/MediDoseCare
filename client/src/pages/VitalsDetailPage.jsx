import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const VITALS_CONFIG = {
  bp: { icon: '🩸', label: 'Blood Pressure', unit: 'mmHg', color: 'var(--red)', key: 'systolic', key2: 'diastolic', normal: '< 130/85 mmHg', tip: 'Reduce salt intake, exercise 30 min/day.' },
  sugar: { icon: '🩺', label: 'Blood Sugar', unit: 'mg/dL', color: 'var(--amber)', key: 'blood_sugar', normal: '70–140 mg/dL', tip: 'Avoid sugary drinks, walk after meals.' },
  heartrate: { icon: '💓', label: 'Heart Rate', unit: 'bpm', color: 'var(--red-light)', key: 'heart_rate', normal: '60–100 bpm', tip: 'Deep breathing lowers resting heart rate.' },
  spo2: { icon: '🫁', label: 'SpO₂', unit: '%', color: 'var(--blue)', key: 'spo2', normal: '> 95%', tip: 'Breathe fresh air and stay hydrated.' },
};

function BarChart({ data, color }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', background: i === data.length - 1 ? color : `${color}55`, borderRadius: 6, height: `${(v / max) * 80}px`, minHeight: 4, transition: 'var(--transition)' }} />
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>D{data.length - i}</span>
        </div>
      ))}
    </div>
  );
}

export default function VitalsDetailPage() {
  const navigate = useNavigate();
  const { type } = useParams();
  const { healthLogs } = useApp();
  const cfg = VITALS_CONFIG[type] || VITALS_CONFIG.bp;
  const vals = healthLogs.map((l) => l[cfg.key]).filter(Boolean).reverse();
  const latest = vals[vals.length - 1] || '--';
  const prev = vals[vals.length - 2];
  const trend = prev ? (latest > prev ? '↑ Higher' : latest < prev ? '↓ Lower' : '→ Stable') : '—';
  const trendColor = trend.startsWith('↑') ? 'var(--red)' : trend.startsWith('↓') ? 'var(--green)' : 'var(--text-muted)';

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/health')}>←</button>
          <h2>{cfg.label}</h2>
        </div>

        <div style={{ padding: '8px 20px 20px' }}>
          {/* Current value */}
          <div className="card card-lg" style={{ marginBottom: 16, textAlign: 'center', borderColor: `${cfg.color}40`, background: `linear-gradient(135deg,${cfg.color}15,var(--bg-card))` }}>
            <div style={{ fontSize: 18 }}>{cfg.icon}</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: cfg.color, lineHeight: 1.1, marginTop: 8 }}>{latest}</div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>{cfg.unit}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Normal Range</div>
                <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: 13 }}>{cfg.normal}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Trend</div>
                <div style={{ fontWeight: 600, color: trendColor, fontSize: 13 }}>{trend}</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h4 style={{ marginBottom: 16 }}>Last {vals.length} Readings</h4>
            <BarChart data={vals} color={cfg.color} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Min: {Math.min(...vals) || '--'}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Avg: {vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : '--'}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Max: {Math.max(...vals) || '--'}</span>
            </div>
          </div>

          {/* History list */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h4 style={{ marginBottom: 12 }}>Reading History</h4>
            {healthLogs.slice(0, 5).map((log, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{new Date(log.recorded_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                <span style={{ fontWeight: 700, color: cfg.color }}>{log[cfg.key] || '--'} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 12 }}>{cfg.unit}</span></span>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div className="ai-card">
            <div style={{ fontSize: 20, marginBottom: 8 }}>💡 Health Tip</div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{cfg.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
