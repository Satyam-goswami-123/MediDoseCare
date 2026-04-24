import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MedicineListPage() {
  const navigate = useNavigate();
  const { medicines } = useApp();

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>My Medicines</h2>
          <button className="btn btn-green btn-sm" style={{ marginLeft: 'auto' }} onClick={() => navigate('/medicines/add')}>+ Add</button>
        </div>

        <div style={{ padding: '12px 20px 0' }}>
          {medicines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>💊</div>
              <h3>No Medicines Added</h3>
              <p style={{ margin: '8px 0 20px' }}>Add your first medicine to start getting smart reminders</p>
              <button className="btn btn-green" onClick={() => navigate('/medicines/add')}>+ Add Medicine</button>
            </div>
          ) : (
            <>
              {['upcoming', 'taken', 'missed', 'other'].map((status) => {
                const group = medicines.filter((m) => {
                  if (status === 'other') return !['upcoming', 'taken', 'missed'].includes(m.status);
                  return m.status === status;
                });
                if (!group.length) return null;

                const label = { upcoming: '⏰ Upcoming', taken: '✅ Taken', missed: '❌ Missed', other: '📝 Active' }[status];
                const color = { upcoming: 'var(--amber)', taken: 'var(--green)', missed: 'var(--red)', other: 'var(--blue)' }[status];
                
                return (
                  <div key={status} style={{ marginBottom: 20 }}>
                    <div className="section-label" style={{ color }}>{label}</div>
                    {group.map((med) => (
                      <div key={med.id} className="med-card" onClick={() => navigate(`/medicines/${med.id}`)}>
                        <div className="med-dot" style={{ background: med.color || 'var(--blue)' }} />
                        <div className="med-info">
                          <div className="med-name">{med.name}</div>
                          <div className="med-dose">{med.dosage} · {Array.isArray(med.times) ? med.times.join(', ') : (med.times || 'Time not set')}</div>
                        </div>
                        <span className={`badge ${status === 'taken' ? 'badge-green' : status === 'missed' ? 'badge-red' : 'badge-blue'}`}>
                          {status === 'taken' ? 'Taken' : status === 'missed' ? 'Missed' : 'Active'}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
