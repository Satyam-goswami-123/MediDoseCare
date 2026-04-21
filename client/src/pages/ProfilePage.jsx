import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';


export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, logout, settings } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', age: user?.age || '', blood_group: user?.blood_group || '', emergency_contact: user?.emergency_contact || '' });

  useEffect(() => {
    setForm({
      name: user?.name || '',
      age: user?.age || '',
      blood_group: user?.blood_group || '',
      emergency_contact: user?.emergency_contact || ''
    });
  }, [user?.name, user?.age, user?.blood_group, user?.emergency_contact]);

  const save = async () => {
    const normalizedForm = {
      name: (form.name || '').trim() || user?.name || 'User',
      age: form.age || null,
      blood_group: (form.blood_group || '').trim() || null,
      emergency_contact: (form.emergency_contact || '').trim() || null
    };

    setUser((u) => ({ ...u, ...normalizedForm }));

    if (user?.id) {
      let profiles = {};
      try {
        profiles = JSON.parse(localStorage.getItem('mdc_user_profiles') || '{}');
      } catch (err) {
        console.error('Failed to parse stored profile data', err);
        profiles = {};
      }
      profiles[user.id] = {
        ...(profiles[user.id] || {}),
        name: normalizedForm.name,
        age: normalizedForm.age,
        blood_group: normalizedForm.blood_group,
      };
      localStorage.setItem('mdc_user_profiles', JSON.stringify(profiles));
    }

    if (auth.currentUser?.uid === user?.id && normalizedForm.name) {
      try {
        await updateProfile(auth.currentUser, { displayName: normalizedForm.name });
      } catch {
        // ignore profile sync failures and keep locally saved data
      }
    }

    setEditing(false);
  };

  const sections = [
    { label: 'Medical Info', items: [
      { icon: '🩸', label: 'Blood Group', value: user?.blood_group || null },
      { icon: '🎂', label: 'Age', value: user?.age ? `${user.age} years` : null },
      { icon: '📞', label: 'Emergency Contact', value: user?.emergency_contact || null },
      { icon: '💊', label: 'Active Role', value: user?.role || 'Patient' },
    ]},
    { label: 'Preferences', items: [
      { 
        icon: '🔔', 
        label: 'Notification Special', 
        value: settings.selectedVibrationPattern && settings.selectedReminderSound ? 'On' : 'Manage',
        action: () => navigate('/settings') 
      },
      { icon: '⚙️', label: 'App Settings', action: () => navigate('/settings') },
    ]},
  ];

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>Profile</h2>
          <button className="btn btn-sm btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : '✏️ Edit'}</button>
        </div>
        <div style={{ padding: '8px 20px 20px' }}>
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: 24, padding: '20px 0', background: 'linear-gradient(180deg,rgba(59,130,246,0.08) 0%,transparent 100%)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 12px', overflow: 'hidden' }}>
              {user?.photo ? <img src={user.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
            </div>
            <h3>{user?.name || 'User'}</h3>
            <p style={{ fontSize: 13, marginTop: 4, color: 'var(--text-secondary)' }}>{user?.email || user?.phone || 'No contact linked'}</p>
            <span className="badge badge-blue" style={{ marginTop: 8 }}>{user?.role || 'Patient'}</span>
          </div>

          {editing ? (
            <div className="card slide-up" style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 16 }}>Edit Profile</h4>
              {[['name', 'Full Name', 'text'], ['age', 'Age', 'number'], ['blood_group', 'Blood Group', 'text'], ['emergency_contact', 'Emergency Contact', 'tel']].map(([k, label, type]) => (
                <div key={k} className="input-group">
                  <label className="input-label">{label}</label>
                  <input className="input" type={type} value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
                </div>
              ))}
              <button className="btn btn-primary btn-full" onClick={save}>Save Changes</button>
            </div>
          ) : (
            sections.map(({ label, items }) => (
              <div key={label} style={{ marginBottom: 20 }}>
                <div className="section-label">{label}</div>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  {items.map(({ icon, label: itemLabel, value, action }, i) => (
                    <div key={itemLabel} onClick={action}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none', cursor: action ? 'pointer' : 'default' }}>
                      <span style={{ fontSize: 20 }}>{icon}</span>
                      <span style={{ flex: 1, color: 'var(--text-secondary)', fontSize: 14 }}>{itemLabel}</span>
                      <span style={{ color: value ? 'var(--text-primary)' : 'var(--blue)', fontWeight: 600, fontSize: 14 }}>{value || '→'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          <button className="btn" style={{ width: '100%', background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)' }} onClick={() => { logout(); navigate('/login'); }}>🚪 Sign Out</button>
        </div>
      </div>
    </div>
  );
}
