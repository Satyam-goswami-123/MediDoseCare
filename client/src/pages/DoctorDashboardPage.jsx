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
                onChange={(e) => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})}
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
                      setPrescriptionForm({...prescriptionForm, medicines: newMeds});
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
                        setPrescriptionForm({...prescriptionForm, medicines: newMeds});
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
                        setPrescriptionForm({...prescriptionForm, medicines: newMeds});
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
                onChange={(e) => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
              <img src={profileData.image} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--blue)' }} />
              <button style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: '50%', background: 'var(--blue)', color: 'white', border: '2px solid var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>Full Name</label>
                <input className="input" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>Specialization</label>
                <input className="input" value={profileData.specialty} onChange={(e) => setProfileData({...profileData, specialty: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>Hospital/Clinic</label>
                <input className="input" value={profileData.hospital} onChange={(e) => setProfileData({...profileData, hospital: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>Profile Image URL</label>
                <input className="input" value={profileData.image} onChange={(e) => setProfileData({...profileData, image: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>Experience</label>
                <input className="input" value={profileData.experience} onChange={(e) => setProfileData({...profileData, experience: e.target.value})} />
              </div>

              <button className="btn btn-blue btn-full" style={{ marginTop: 10, gap: 8 }} onClick={handleProfileSave}>
                <Save size={18} /> Save Profile Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
