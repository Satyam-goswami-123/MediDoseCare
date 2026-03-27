import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';


export default function MedicineListPage() {
  const navigate = useNavigate();
  const { medicines } = useApp();
  const taken = medicines.filter((m) => m.status === 'taken').length;
  const missed = medicines.filter((m) => m.status === 'missed').length;

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>My Medicines</h2>
          <button className="btn btn-green btn-sm" style={{ marginLeft: 'auto' }} onClick={() => navigate('/medicines/add')}>+ Add</button>
        </div>

        <div style={{ padding: '12px 20px 0' }}>
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Total', value: medicines.length, color: 'var(--blue)' },
              { label: 'Taken', value: taken, color: 'var(--green)' },
              { label: 'Missed', value: missed, color: 'var(--red)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card" style={{ textAlign: 'center', borderColor: `${color}30` }}>
                <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {medicines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>💊</div>
              <h3>No Medicines Added</h3>
              <p style={{ margin: '8px 0 20px' }}>Add your first medicine to start getting smart reminders</p>
              <button className="btn btn-green" onClick={() => navigate('/medicines/add')}>+ Add Medicine</button>
            </div>
          ) : (
            <>
              {['upcoming', 'taken', 'missed'].map((status) => {
                const group = medicines.filter((m) => m.status === status);
                if (!group.length) return null;
                const label = { upcoming: '⏰ Upcoming', taken: '✅ Taken', missed: '❌ Missed' }[status];
                const color = { upcoming: 'var(--amber)', taken: 'var(--green)', missed: 'var(--red)' }[status];
                return (
                  <div key={status} style={{ marginBottom: 20 }}>
                    <div className="section-label" style={{ color }}>{label}</div>
                    {group.map((med) => (
                      <div key={med.id} className="med-card" onClick={() => navigate(`/medicines/${med.id}`)}>
                        <div className="med-dot" style={{ background: med.color }} />
                        <div className="med-info">
                          <div className="med-name">{med.name}</div>
                          <div className="med-dose">{med.dosage} · {Array.isArray(med.times) ? med.times.join(', ') : med.times}</div>
                        </div>
                        <span className={`badge ${status === 'taken' ? 'badge-green' : status === 'missed' ? 'badge-red' : 'badge-amber'}`}>
                          {status === 'taken' ? 'Taken' : status === 'missed' ? 'Missed' : 'Soon'}
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
