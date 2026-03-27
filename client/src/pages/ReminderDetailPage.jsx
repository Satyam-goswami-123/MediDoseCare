import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ReminderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { medicines, markDose } = useApp();
  const med = medicines.find((m) => String(m.id) === id);

  if (!med) return (
    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
      <p>Medicine not found.</p>
      <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => navigate('/medicines')}>← Back</button>
    </div>
  );

  const handleMark = (status) => {
    markDose(med.id, status);
    navigate('/medicines');
  };

  const statusColor = med.status === 'taken' ? 'var(--green)' : med.status === 'missed' ? 'var(--red)' : 'var(--amber)';

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/medicines')}>←</button>
          <h2>Reminder Detail</h2>
        </div>

        <div style={{ padding: '8px 20px 20px' }}>
          {/* Medicine Card */}
          <div className="card card-lg" style={{ borderColor: `${med.color}40`, background: `linear-gradient(135deg,${med.color}18,var(--bg-card))`, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: med.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>💊</div>
              <div>
                <h3 style={{ color: 'var(--text-primary)' }}>{med.name}</h3>
                <p style={{ fontSize: 14, marginTop: 4 }}>{med.dosage}</p>
              </div>
            </div>
            <div className="divider" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Frequency', value: med.frequency?.replace('_', ' ') || 'Daily' },
                { label: 'Times', value: Array.isArray(med.times) ? med.times.join(', ') : (med.times || '08:00') },
                { label: 'Start Date', value: med.start_date || 'Today' },
                { label: 'Status', value: med.status?.charAt(0).toUpperCase() + med.status?.slice(1), color: statusColor },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontWeight: 600, color: color || 'var(--text-primary)' }}>{value}</div>
                </div>
              ))}
            </div>
            {med.instructions && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: 13 }}>📝 {med.instructions}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {med.status !== 'taken' && (
            <button className="btn btn-green btn-full" style={{ marginBottom: 12 }} onClick={() => handleMark('taken')}>
              ✅ Mark as Taken
            </button>
          )}
          {med.status !== 'missed' && (
            <button className="btn" style={{ width: '100%', background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: 12 }} onClick={() => handleMark('missed')}>
              ❌ Mark as Missed
            </button>
          )}
          {med.status !== 'upcoming' && (
            <button className="btn btn-ghost btn-full" onClick={() => handleMark('upcoming')}>↩ Reset to Upcoming</button>
          )}
          <div className="divider" />
          <button className="btn btn-ghost btn-full" onClick={() => navigate('/history')}>📊 View Full History</button>
        </div>
      </div>
    </div>
  );
}
