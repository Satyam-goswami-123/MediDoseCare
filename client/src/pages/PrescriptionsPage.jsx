import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
<<<<<<< HEAD
import { FileText, Plus, Eye, Download, Calendar } from 'lucide-react';
=======

>>>>>>> 3e7d6325a401b89e1cf340e3f93175762db53863

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const { prescriptions, addPrescription } = useApp();

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>Prescriptions</h2>
<<<<<<< HEAD
          <button className="btn btn-green btn-sm" style={{ marginLeft: 'auto' }}
            onClick={() => {
              addPrescription({ 
                id: Date.now(), 
                doctor: 'Dr. Priya Sharma', 
                title: 'General Health Exam', 
                date: new Date().toLocaleDateString(), 
                type: 'PDF' 
              });
            }}>+ New Upload</button>
        </div>

        <div style={{ padding: '12px 20px 20px' }}>
          <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg,rgba(168,85,247,0.1),var(--bg-card))', borderColor: 'rgba(168,85,247,0.2)', padding: 24 }}>
            <h4 style={{ color: 'var(--purple-light)', marginBottom: 8 }}>Secure Digital Storage</h4>
            <p>All your medical records are encrypted and securely stored. Easily share or download them for your doctor visits.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {prescriptions.map((rx) => (
              <div key={rx.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={24} color="var(--purple)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{rx.title || 'Medical Record'}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{rx.doctor || 'Dr. Arjun Mehta'} · {rx.date}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="back-btn" style={{ width: 38, height: 38 }} onClick={() => navigate(`/prescriptions/${rx.id || 1}`)}>
                      <Eye size={18} />
                    </button>
                    <button className="back-btn" style={{ width: 38, height: 38 }}>
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {prescriptions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 64, opacity: 0.2 }}>📋</div>
              <h3 style={{ marginTop: 16 }}>No Records Found</h3>
              <p style={{ marginTop: 8 }}>Digitize your prescriptions to never lose a paper record again.</p>
              <button className="btn btn-green" style={{ marginTop: 24 }} onClick={() => navigate('/prescriptions/add')}>Upload My First Record</button>
            </div>
          )}
        </div>
      </div>
=======
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

>>>>>>> 3e7d6325a401b89e1cf340e3f93175762db53863
    </div>
  );
}
