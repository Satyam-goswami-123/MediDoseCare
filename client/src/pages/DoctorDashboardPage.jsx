import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Users, Calendar, Clock, FileText, CheckCircle, Bell, Search, Plus,
  ChevronRight, Stethoscope, Activity, Phone, Video, MessageSquare,
  User, Save, Camera, ArrowLeft, Clipboard
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const { user, appointments, registeredDoctors, updateDoctorProfile, addPrescription } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, profile
  const [activeConsultation, setActiveConsultation] = useState(null); // The patient being consulted
  const [consultationStep, setConsultationStep] = useState('call'); // call, prescription

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    specialty: user?.specialty || '',
    hospital: user?.hospital || '',
    image: user?.image || '',
    experience: user?.experience || ''
  });

  // Prescription Form State
  const [prescriptionForm, setPrescriptionForm] = useState({
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: '',
    diagnosis: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        specialty: user.specialty,
        hospital: user.hospital,
        image: user.image,
        experience: user.experience || '10 Years'
      });
    }
  }, [user]);

  const handleProfileSave = () => {
    updateDoctorProfile(user.id, profileData);
    alert('Profile updated successfully!');
  };

  const startConsultation = (appt) => {
    setActiveConsultation(appt);
    setConsultationStep('call');
  };

  const finishConsultation = () => {
    setConsultationStep('prescription');
  };

  const handlePrescriptionSubmit = () => {
    addPrescription({
      patientId: activeConsultation.patientId,
      patientName: activeConsultation.patientName,
      doctorId: user.id,
      doctorName: user.name,
      date: new Date().toLocaleDateString(),
      ...prescriptionForm
    });
    alert('Prescription sent to patient!');
    setActiveConsultation(null);
    setPrescriptionForm({
      medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
      instructions: '',
      diagnosis: ''
    });
  };

  const addMedRow = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
    }));
  };

  // Filter appointments for this doctor
  const myAppointments = appointments.filter(a => a.doctorId === user?.id || a.doctorName === user?.name);

  return (
    <div className="page-enter" style={{ background: 'var(--bg-app)', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Consultation Overlay */}
      {activeConsultation && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-app)', zIndex: 1000, overflowY: 'auto' }}>
          {consultationStep === 'call' ? (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0F172A', color: 'white' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--blue-dim)', border: '4px solid var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                  👤
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: 24, fontWeight: 800 }}>{activeConsultation.patientName}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)' }}>Consulting via {activeConsultation.type}</p>
                </div>
                <div style={{ fontSize: 18, color: 'var(--green)', fontWeight: 700 }}>04:12</div>
              </div>

              <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', gap: 30 }}>
                <button style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}><MessageSquare size={24} /></button>
                <button
                  onClick={finishConsultation}
                  style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--red)', border: 'none', color: 'white' }}
                >
                  <Phone size={24} style={{ transform: 'rotate(135deg)' }} />
                </button>
                <button style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}><Video size={24} /></button>
              </div>
            </div>
          ) : (
            <div className="page-enter" style={{ padding: '24px 20px' }}>
              <div className="page-header">
                <button className="back-btn" onClick={() => setActiveConsultation(null)}><ArrowLeft size={20} /></button>
                <h2>New Prescription</h2>
              </div>

              <div className="card" style={{ marginBottom: 20, padding: 16, background: 'var(--blue-dim)', border: '1px solid var(--blue-border)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Patient Details</div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{activeConsultation.patientName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Date: {new Date().toLocaleDateString()} · Slot: {activeConsultation.slot}</div>
              </div>

              <div className="section-label">Diagnosis</div>
              <textarea
                className="input"
                placeholder="Enter diagnosis..."
                style={{ height: 80, marginBottom: 20 }}
                value={prescriptionForm.diagnosis}
                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })}
              />

              <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Medicines
                <button onClick={addMedRow} style={{ color: 'var(--blue)', background: 'none', border: 'none', fontWeight: 700, fontSize: 12 }}>+ Add Med</button>
              </div>
              {prescriptionForm.medicines.map((med, i) => (
                <div key={i} className="card" style={{ marginBottom: 12, padding: 12 }}>
                  <input
                    className="input"
                    placeholder="Medicine Name"
                    style={{ marginBottom: 8 }}
                    value={med.name}
                    onChange={(e) => {
                      const newMeds = [...prescriptionForm.medicines];
                      newMeds[i].name = e.target.value;
                      setPrescriptionForm({ ...prescriptionForm, medicines: newMeds });
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      className="input"
                      placeholder="Dosage"
                      style={{ flex: 1 }}
                      value={med.dosage}
                      onChange={(e) => {
                        const newMeds = [...prescriptionForm.medicines];
                        newMeds[i].dosage = e.target.value;
                        setPrescriptionForm({ ...prescriptionForm, medicines: newMeds });
                      }}
                    />
                    <input
                      className="input"
                      placeholder="Frequency"
                      style={{ flex: 1 }}
                      value={med.frequency}
                      onChange={(e) => {
                        const newMeds = [...prescriptionForm.medicines];
                        newMeds[i].frequency = e.target.value;
                        setPrescriptionForm({ ...prescriptionForm, medicines: newMeds });
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="section-label">Additional Instructions</div>
              <textarea
                className="input"
                placeholder="Any dietary advice or follow-up notes..."
                style={{ height: 80, marginBottom: 30 }}
                value={prescriptionForm.instructions}
                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
              />

              <button className="btn btn-blue btn-full" onClick={handlePrescriptionSubmit}>Send Prescription to Patient</button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: '24px 20px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img src={profileData.image} alt={profileData.name} style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} />
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>{profileData.name}</h2>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{profileData.specialty} · {profileData.hospital}</p>
          </div>
        </div>
        <button className="btn-icon" style={{ background: 'var(--bg-secondary)' }}>
          <Bell size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 20px', borderBottom: '1px solid var(--border)' }}>
        {['overview', 'appointments', 'profile'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '16px 0', background: 'none', border: 'none', color: activeTab === tab ? 'var(--blue)' : 'var(--text-muted)',
              fontSize: 14, fontWeight: 700, borderBottom: `3px solid ${activeTab === tab ? 'var(--blue)' : 'transparent'}`,
              textTransform: 'capitalize', transition: '0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px' }}>
        {activeTab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Total Patients', value: '12', icon: <Users size={20} />, color: 'var(--blue)' },
                { label: 'Appointments', value: myAppointments.length, icon: <Clock size={20} />, color: 'var(--orange)' },
                { label: 'Today Work', value: '4h', icon: <Activity size={20} />, color: 'var(--green)' },
                { label: 'Earnings', value: `₹${myAppointments.length * 850}`, icon: <Clipboard size={20} />, color: 'var(--purple)' },
              ].map((stat, i) => (
                <div key={i} className="card" style={{ padding: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>{stat.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="section-label">Ongoing Schedule</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myAppointments.length === 0 ? (
                <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>
                  No appointments scheduled yet.
                </div>
              ) : (
                myAppointments.map(appt => (
                  <div key={appt.id} className="card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{appt.patientName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Slot: {appt.slot} · {appt.type}</div>
                      </div>
                    </div>
                    <button className="btn btn-blue btn-full" onClick={() => startConsultation(appt)}>Start Consultation</button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'appointments' && (
          <div>
            <div className="section-label">All Appointments</div>
            {myAppointments.map(appt => (
              <div key={appt.id} className="card" style={{ padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{appt.patientName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{appt.date} · {appt.slot}</div>
                  </div>
                </div>
                <div style={{ background: 'var(--blue-dim)', color: 'var(--blue)', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{appt.type}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
            
            {/* Premium Profile Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, var(--blue-dim), var(--purple-dim))',
              borderRadius: 24,
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px solid rgba(59,130,246,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'var(--blue)', opacity: 0.1, filter: 'blur(20px)' }}></div>
              <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'var(--purple)', opacity: 0.1, filter: 'blur(20px)' }}></div>

              <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
                <img 
                  src={profileData.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} 
                />
                <input 
                  type="file" 
                  id="doctor-img-upload" 
                  hidden 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setProfileData({ ...profileData, image: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button 
                  onClick={() => document.getElementById('doctor-img-upload').click()}
                  style={{ position: 'absolute', bottom: 6, right: 6, width: 36, height: 36, borderRadius: '50%', background: 'var(--blue)', color: 'white', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}
                >
                  <Camera size={18} />
                </button>
              </div>

              <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{profileData.name}</h2>
              <p style={{ color: 'var(--blue)', fontWeight: 700, fontSize: 15, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1.5 }}>{profileData.qualification || 'MBBS, MD'}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18 }}>
                <span className="badge badge-blue" style={{ padding: '8px 14px', fontSize: 11, borderRadius: 10 }}>⭐ 4.9 Rating</span>
                <span className="badge badge-purple" style={{ padding: '8px 14px', fontSize: 11, borderRadius: 10 }}>🏆 Verified</span>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { label: 'Experience', val: `${profileData.experience}Y+`, color: 'var(--blue)' },
                { label: 'Consulted', val: '500+', color: 'var(--purple)' },
                { label: 'Fee', val: `₹${profileData.fee}`, color: 'var(--green)' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ textAlign: 'center', padding: '16px 8px', borderBottom: `3px solid ${s.color}40` }}>
                  <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Professional Background Card */}
            <div className="section-label" style={{ marginBottom: -8 }}>Professional Details</div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Users size={18} color="var(--blue)" /> Display Name
                </label>
                <input className="input" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">Qualification</label>
                  <input className="input" value={profileData.qualification} onChange={(e) => setProfileData({...profileData, qualification: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Specialization</label>
                  <input className="input" value={profileData.specialty} onChange={(e) => setProfileData({...profileData, specialty: e.target.value})} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Activity size={18} color="var(--purple)" /> Hospital / Clinic
                </label>
                <input className="input" value={profileData.hospital} onChange={(e) => setProfileData({...profileData, hospital: e.target.value})} />
              </div>

              <div className="input-group">
                <label className="input-label">About / Biography</label>
                <textarea 
                  className="input" 
                  style={{ height: 120, lineHeight: 1.6, padding: '12px 16px' }} 
                  value={profileData.bio} 
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})} 
                  placeholder="Share your expertise and medical journey with your patients..." 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">Experience (Years)</label>
                  <input className="input" type="number" value={profileData.experience} onChange={(e) => setProfileData({...profileData, experience: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Consultation Fee (₹)</label>
                  <input className="input" type="number" value={profileData.fee} onChange={(e) => setProfileData({...profileData, fee: e.target.value})} />
                </div>
              </div>

              <button className="btn btn-blue btn-full" style={{ padding: '18px', gap: 12, fontSize: 16, fontWeight: 700, borderRadius: 16 }} onClick={handleProfileSave}>
                <Save size={22} /> Save Professional Profile
              </button>
            </div>

            <button 
              className="btn btn-ghost btn-full" 
              style={{ color: 'var(--red)', background: 'var(--red-dim)', padding: 16, borderRadius: 16 }}
              onClick={() => { logout(); navigate('/login'); }}
            >
              Sign Out from Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
