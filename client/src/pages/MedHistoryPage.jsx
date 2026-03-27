import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MedHistoryPage() {
  const navigate = useNavigate();
  const { medicines } = useApp();

  // Generate simulated history from medicines
  const history = [];
  const statuses = ['taken', 'taken', 'taken', 'missed', 'taken', 'taken', 'skipped'];
  medicines.forEach((med) => {
    for (let d = 0; d < 7; d++) {
      const date = new Date(Date.now() - d * 86400000);
      const status = d === 0 ? med.status : statuses[d % statuses.length];
      (med.times || ['08:00']).forEach((time) => {
        history.push({ med: med.name, dose: med.dosage, color: med.color, status, time, date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) });
      });
    }
  });
  history.sort((a, b) => b.date - a.date);

  const taken = history.filter((h) => h.status === 'taken').length;
  const total = history.length;
  const pct = total ? Math.round((taken / total) * 100) : 0;

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>Medication History</h2>
        </div>

        <div style={{ padding: '8px 20px 20px' }}>
          {/* Adherence score */}
          <div className="card card-lg" style={{ marginBottom: 20, textAlign: 'center', background: 'linear-gradient(135deg,rgba(34,197,94,0.1),var(--bg-card))', borderColor: 'rgba(34,197,94,0.25)' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Adherence Score (Last 7 Days)</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--amber)' : 'var(--red)' }}>{pct}%</div>
            <div style={{ background: 'var(--border)', height: 8, borderRadius: 99, marginTop: 12, overflow: 'hidden' }}>
              <div style={{ background: pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--amber)' : 'var(--red)', height: '100%', width: `${pct}%`, borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--green)' }}>✓ {taken} Taken</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{total} Total Due</span>
              <span style={{ fontSize: 12, color: 'var(--red)' }}>✗ {total - taken} Missed</span>
            </div>
          </div>

          {/* Log by day */}
          {[...new Set(history.map((h) => h.date))].slice(0, 7).map((date) => {
            const dayHistory = history.filter((h) => h.date === date);
            return (
              <div key={date} style={{ marginBottom: 20 }}>
                <div className="section-label">{date}</div>
                {dayHistory.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: h.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{h.med}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{h.dose} · {h.time}</div>
                    </div>
                    <span className={`badge ${h.status === 'taken' ? 'badge-green' : h.status === 'missed' ? 'badge-red' : 'badge-amber'}`}>
                      {h.status === 'taken' ? '✓ Taken' : h.status === 'missed' ? '✗ Missed' : '~ Skipped'}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
