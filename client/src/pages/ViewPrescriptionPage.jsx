import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ViewPrescriptionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { prescriptions } = useApp();
  const rx = prescriptions.find((p) => String(p.id) === id) || prescriptions[0];

  if (!rx) return <div style={{ padding: 24 }}><p>Prescription not found.</p><button className="btn btn-ghost" onClick={() => navigate('/prescriptions')}>← Back</button></div>;

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/prescriptions')}>←</button>
          <h2>Prescription</h2>
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>🔗</button>
        </div>

        <div style={{ padding: '8px 20px 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg,#ffffff 0%,#f0f4ff 100%)',
            borderRadius: 'var(--radius-lg)', padding: 24, color: '#1a1a2e',
            boxShadow: '0 8px 48px rgba(0,0,0,0.5)', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1e40af' }}>💊 MediDose Care</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Digital Health Record</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{new Date(rx.prescribed_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Prescribed Date</div>
              </div>
            </div>
            {[
              { label: 'Doctor', value: rx.doctor_name },
              { label: 'Hospital / Clinic', value: rx.hospital },
              { label: 'Diagnosis', value: rx.diagnosis },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginTop: 4 }}>{value}</div>
              </div>
            ))}
            <div style={{ background: '#f1f5f9', borderRadius: 10, padding: 14, marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Notes & Instructions</div>
              <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{rx.notes}</div>
            </div>
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '2px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Prescription ID: #{rx.id}</div>
              <div style={{ fontSize: 11, color: '#1e40af', fontWeight: 700 }}>VERIFIED ✓</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button className="btn btn-ghost btn-full">📤 Share</button>
            <button className="btn btn-ghost btn-full">⬇️ Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}
