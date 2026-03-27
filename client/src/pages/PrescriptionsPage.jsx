import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';


export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const { prescriptions, addPrescription } = useApp();

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>Prescriptions</h2>
          <button className="btn btn-sm" style={{ marginLeft: 'auto', background: 'var(--purple-dim)', color: 'var(--purple)', border: '1px solid rgba(168,85,247,0.3)' }}
            onClick={() => {
              addPrescription({ doctor_name: 'Dr. New Doctor', hospital: 'City Hospital', prescribed_date: new Date().toISOString().split('T')[0], diagnosis: 'New Diagnosis', notes: 'New prescription added.' });
            }}>+ Add</button>
        </div>

        <div style={{ padding: '12px 20px 20px' }}>
          <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg,rgba(168,85,247,0.12),var(--bg-card))', borderColor: 'rgba(168,85,247,0.3)' }}>
            <div className="flex items-center gap-12">
              <span style={{ fontSize: 32 }}>📋</span>
              <div>
                <h4 style={{ color: 'var(--purple-light)' }}>{prescriptions.length} Prescriptions</h4>
                <p style={{ fontSize: 13 }}>All your medical records in one place</p>
              </div>
            </div>
          </div>

          {prescriptions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 64 }}>📋</div>
              <h3 style={{ marginTop: 16 }}>No Prescriptions</h3>
              <p style={{ marginTop: 8 }}>Store your prescriptions digitally for easy access</p>
            </div>
          ) : (
            prescriptions.map((rx) => (
              <div key={rx.id} onClick={() => navigate(`/prescriptions/${rx.id}`)}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 12, cursor: 'pointer', transition: 'var(--transition)' }}>
                <div className="flex justify-between items-center">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏥</div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{rx.doctor_name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{rx.hospital}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="badge badge-purple">{new Date(rx.prescribed_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(168,85,247,0.06)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--purple-light)' }}>{rx.diagnosis}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{rx.notes?.slice(0, 80)}...</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
