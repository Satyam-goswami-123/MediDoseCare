import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FileText, Plus, Eye, Download, Calendar } from 'lucide-react';

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const { prescriptions, addPrescription } = useApp();

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>Prescriptions</h2>
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
    </div>
  );
}
