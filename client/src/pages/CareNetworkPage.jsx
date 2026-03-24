import { useNavigate } from 'react-router-dom';

export default function CareNetworkPage() {
  const navigate = useNavigate();
  const team = [
    { name: 'Dr. Priya Sharma', role: 'doctor', specialty: 'Diabetologist', hospital: 'Apollo Hospitals', emoji: '👩‍⚕️', status: 'active' },
    { name: 'Dr. Arjun Mehta', role: 'doctor', specialty: 'Cardiologist', hospital: 'Fortis Healthcare', emoji: '👨‍⚕️', status: 'active' },
    { name: 'Suresh Kumar', role: 'caregiver', specialty: 'Son', hospital: 'Family', emoji: '👨', status: 'active' },
    { name: 'Meena Devi', role: 'caregiver', specialty: 'Daughter', hospital: 'Family', emoji: '👩', status: 'active' },
  ];
  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>Care Network</h2>
          <button className="btn btn-sm" style={{ marginLeft: 'auto', background: 'var(--teal-dim)', color: 'var(--teal)', border: '1px solid rgba(20,184,166,0.3)' }}>+ Invite</button>
        </div>
        <div style={{ padding: '12px 20px 20px' }}>
          <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg,rgba(20,184,166,0.1),var(--bg-card))', borderColor: 'rgba(20,184,166,0.25)' }}>
            <div className="flex items-center gap-12">
              <span style={{ fontSize: 32 }}>👥</span>
              <div>
                <h4 style={{ color: 'var(--teal)' }}>{team.length} People Looking After You</h4>
                <p style={{ fontSize: 13 }}>Doctors and caregivers monitoring your health</p>
              </div>
            </div>
          </div>
          {['doctor', 'caregiver'].map((role) => (
            <div key={role} style={{ marginBottom: 20 }}>
              <div className="section-label">{role === 'doctor' ? '🩺 Doctors' : '🤝 Caregivers'}</div>
              {team.filter((m) => m.role === role).map((m) => (
                <div key={m.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: role === 'doctor' ? 'var(--blue-dim)' : 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{m.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.specialty} · {m.hospital}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--green-dim)', border: 'none', cursor: 'pointer', fontSize: 16 }}>💬</button>
                    <button style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--blue-dim)', border: 'none', cursor: 'pointer', fontSize: 16 }}>📞</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
