import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Users, Calendar, Clock, FileText, CheckCircle, Bell, Search, Plus,
  ChevronRight, Stethoscope, Activity, Phone, Video, MessageSquare,
  User, Save, Camera, ArrowLeft, Clipboard, HeartPulse, UserPlus, FileHeart,
  X, Shield, Eye, Upload, Send, Check, AlertCircle
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const { 
    user, appointments, registeredDoctors, updateDoctorProfile, addPrescription, logout,
    notifications, unreadCount, markNotificationRead, markAllNotificationsRead
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, requests, patients, profile
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [consultationStep, setConsultationStep] = useState('call'); // call, prescription
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

  // Call options
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callTab, setCallTab] = useState('emr'); // emr, documents, chat, consent
  const [chatMessages, setChatMessages] = useState([
    { sender: 'patient', text: 'Hi Doctor, I have joined the call.', time: '10:01 AM' },
    { sender: 'doctor', text: 'Hello! I can see you clearly. How can I help you today?', time: '10:02 AM' },
    { sender: 'patient', text: 'I have had a severe throat infection and a fever for 3 days. I also uploaded my recent CBC blood test report.', time: '10:02 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isCallActive, setIsCallActive] = useState(true);
  const [digitallySigned, setDigitallySigned] = useState(false);

  // Mock Patient Requests
  const [patientRequests, setPatientRequests] = useState([
    { id: 1, patientName: 'Rahul Verma', symptoms: 'Severe Headache, Nausea', date: 'Today', urgency: 'High', status: 'pending' },
    { id: 2, patientName: 'Anita Sharma', symptoms: 'Mild fever and cough', date: 'Today', urgency: 'Medium', status: 'pending' },
    { id: 3, patientName: 'Vikas Kumar', symptoms: 'Routine checkup for diabetes', date: 'Tomorrow', urgency: 'Low', status: 'pending' }
  ]);

  // Profile Edit State
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'success', 'error'
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    specialty: user?.specialty || user?.specialization || '',
    hospital: user?.hospital || user?.hospital_name || '',
    image: user?.image || user?.avatar_url || '',
    experience: user?.experience || user?.experience_years || '',
    qualification: user?.qualification || '',
    fee: user?.fee || user?.consultation_fee || 850,
    bio: user?.bio || '',
    requirePaymentUpfront: user?.requirePaymentUpfront !== undefined ? user?.requirePaymentUpfront : true
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: '',
    diagnosis: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [window.location.search]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        specialty: user.specialty || user.specialization || '',
        hospital: user.hospital || user.hospital_name || '',
        image: user.image || user.avatar_url || '',
        experience: user.experience || user.experience_years || '10',
        qualification: user.qualification || 'MBBS, MD',
        fee: user.fee || user.consultation_fee || 850,
        bio: user.bio || '',
        requirePaymentUpfront: user.requirePaymentUpfront !== undefined ? user.requirePaymentUpfront : true
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    setSaveStatus('saving');
    try {
      await updateDoctorProfile(user.id, profileData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (e) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const startConsultation = (appt) => {
    setActiveConsultation(appt);
    setConsultationStep('call');
    setIsCallActive(true);
    setIsMuted(false);
    setIsCameraOff(false);
    setDigitallySigned(false);
  };

  const finishConsultation = () => {
    setIsCallActive(false);
    setConsultationStep('prescription');
  };

  const handlePrescriptionSubmit = () => {
    addPrescription({
      id: Date.now(),
      patientId: activeConsultation.patientId || 'P123',
      patientName: activeConsultation.patientName || 'Patient',
      doctorId: user?.id,
      doctor: `Dr. ${user?.name || 'Doctor'}`,
      title: `Prescription: ${prescriptionForm.diagnosis || 'Consultation'}`,
      date: new Date().toLocaleDateString(),
      type: 'Digital',
      digitallySigned: digitallySigned,
      signatureName: `Dr. ${user?.name || 'Doctor'} (Digitally Signed)`,
      ...prescriptionForm
    });
    alert('Digital Prescription issued and signed successfully!');
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

  const handleRequestAction = (id, action) => {
    setPatientRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
  };

  // Detailed mock appointments containing patient clinical reports, histories, documents, and vitals.
  const myAppointments = appointments.length > 0 
    ? appointments.filter(a => a.doctorId === user?.id || a.doctorName === user?.name)
    : [
        { 
          id: 'appt-1', 
          patientId: 'P101',
          patientName: 'Rahul Verma', 
          slot: '10:00 AM - 10:30 AM', 
          date: 'Today', 
          symptoms: 'Severe throat pain, difficulty swallowing, dry cough, and mild fever (100.2 °F) since 3 days.', 
          type: 'Video', 
          paymentMethod: 'UPI / Online', 
          paymentStatus: 'Paid', 
          fee: 850,
          emr: {
            bloodGroup: 'O Positive',
            allergies: 'Penicillin, Sulfonamides',
            chronicConditions: 'Mild Seasonal Asthma',
            height: '174 cm',
            weight: '72 kg',
            vitals: { bp: '124/82 mmHg', sugar: '104 mg/dL', hr: '78 bpm', spo2: '98%' },
            pastPrescriptions: [
              { date: '12 Jan 2026', diagnosis: 'Acute Bronchitis', meds: 'Amoxicillin 500mg, Levocetirizine 5mg', doc: 'Dr. Priya Sharma' }
            ]
          },
          documents: [
            { id: 'doc-1', name: 'Complete Blood Count (CBC) Report.pdf', date: '01 Jun 2026', type: 'pdf', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', status: 'Normal' },
            { id: 'doc-2', name: 'Throat Swelling Photo.jpg', date: '02 Jun 2026', type: 'image', url: 'https://images.unsplash.com/photo-1612538498456-e861df91d4d0?w=800&q=80', status: 'Needs Review' }
          ]
        },
        { 
          id: 'appt-2', 
          patientId: 'P102',
          patientName: 'Anita Sharma', 
          slot: '11:30 AM - 12:00 PM', 
          date: 'Today', 
          symptoms: 'Red rashes on forearm, itching and swelling, started after gardening.', 
          type: 'Video', 
          paymentMethod: 'NetBanking', 
          paymentStatus: 'Paid', 
          fee: 850,
          emr: {
            bloodGroup: 'A Negative',
            allergies: 'Peanuts, Dust Mites',
            chronicConditions: 'None',
            height: '162 cm',
            weight: '58 kg',
            vitals: { bp: '118/76 mmHg', sugar: '96 mg/dL', hr: '72 bpm', spo2: '99%' },
            pastPrescriptions: [
              { date: '05 Mar 2026', diagnosis: 'Contact Dermatitis', meds: 'Hydrocortisone cream 1%, Loratadine 10mg', doc: 'Dr. Priya Sharma' }
            ]
          },
          documents: [
            { id: 'doc-3', name: 'Forearm Rash Image.jpg', date: 'Today', type: 'image', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80', status: 'Active Check' }
          ]
        }
      ];

  return (
    <div className="page-enter" style={{ background: 'var(--bg-app)', minHeight: '100vh', paddingBottom: 80 }}>
      {activeConsultation && (
        <div style={{ position: 'fixed', inset: 0, background: '#0F172A', zIndex: 1000, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* Main Call View */}
          <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
            
            {/* Left Screen: Video Feed & Call Controls */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: 'radial-gradient(circle at center, #1E293B, #0F172A)' }}>
              
              {/* Call Status Header */}
              <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.8), transparent)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ background: isCallActive ? 'var(--red)' : 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 20, fontSize: 12, display: 'flex', gap: 6, alignItems: 'center', fontWeight: 700 }}>
                    <div className={isCallActive ? "pulse-dot pulse-red" : ""} style={{ width: 8, height: 8, borderRadius: '50%', background: isCallActive ? 'white' : 'gray' }}></div>
                    {isCallActive ? "LIVE CALL" : "DISCONNECTED"}
                  </div>
                  <div style={{ background: 'rgba(34,197,94,0.2)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.3)', padding: '6px 12px', borderRadius: 20, fontSize: 12, display: 'flex', gap: 6, alignItems: 'center', fontWeight: 600 }}>
                    <Shield size={14} /> HIPAA Secure
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontSize: 18, color: 'white', fontWeight: 700, fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: 8 }}>04:12</div>
                  <button className="btn btn-sm btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 10 }} onClick={() => setActiveConsultation(null)}>Exit</button>
                </div>
              </div>

              {/* Feed Display Area */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {isCallActive ? (
                  <>
                    {/* Patient Video (Mock Image) */}
                    <img 
                      src={activeConsultation.patientId === 'P101' 
                        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop'
                        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop'
                      } 
                      alt="Patient Feed" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                    />
                    
                    {/* Doctor Floating Pip */}
                    <div style={{ position: 'absolute', bottom: 20, right: 20, width: 120, height: 160, borderRadius: 16, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', background: '#1E293B', zIndex: 5 }}>
                      {!isCameraOff ? (
                        <img src={profileData.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop'} alt="Doctor Feed" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👨‍⚕️</div>
                      )}
                      <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 10, background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>You</div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, background: 'rgba(15,23,42,0.9)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 400, zIndex: 10 }}>
                    <div style={{ fontSize: 50, marginBottom: 16 }}>⚠️</div>
                    <h3 style={{ fontSize: 20, fontWeight: 800 }}>Call Terminated</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 8, marginBottom: 24 }}>The patient has disconnected or the connection was lost.</p>
                    <button 
                      className="btn btn-green btn-full animate-pulse" 
                      style={{ padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 700, gap: 8 }}
                      onClick={() => setIsCallActive(true)}
                    >
                      <Phone size={18} /> Call Patient Back
                    </button>
                  </div>
                )}
                
                {/* HIPAA Info Overlay Banner */}
                {isCallActive && (
                  <div style={{ position: 'absolute', bottom: 100, left: 20, background: 'rgba(0,0,0,0.6)', padding: '10px 16px', borderRadius: 12, backdropFilter: 'blur(8px)', zIndex: 5, border: '1px solid rgba(255,255,255,0.1)', maxWidth: '80%' }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{activeConsultation.patientName}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{activeConsultation.symptoms}</div>
                  </div>
                )}
              </div>

              {/* Call Controls Bar */}
              <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'center', gap: 20, background: 'linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.7))', zIndex: 10 }}>
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  style={{ width: 56, height: 56, borderRadius: '50%', background: isMuted ? 'var(--red)' : 'rgba(255,255,255,0.15)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
                >
                  <Activity size={22} style={{ opacity: isMuted ? 0.5 : 1 }} />
                </button>
                <button 
                  onClick={() => setIsCameraOff(!isCameraOff)} 
                  style={{ width: 56, height: 56, borderRadius: '50%', background: isCameraOff ? 'var(--red)' : 'rgba(255,255,255,0.15)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
                >
                  <Video size={22} />
                </button>
                <button 
                  onClick={finishConsultation}
                  style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--red)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(239,68,68,0.4)', cursor: 'pointer', transition: '0.2s' }}
                >
                  <Phone size={24} style={{ transform: 'rotate(135deg)' }} />
                </button>
              </div>
            </div>

            {/* Right Screen: EMR, Documents, Chats, & Digital Prescriptions */}
            <div style={{ width: 400, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)' }}>
              
              {/* Tabs list inside call panel */}
              <div style={{ display: 'flex', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
                {[
                  { id: 'emr', label: 'EMR' },
                  { id: 'documents', label: 'Docs' },
                  { id: 'chat', label: 'Chat' },
                  { id: 'consent', label: 'Consent' }
                ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setCallTab(t.id)}
                    style={{ flex: 1, padding: '14px 0', border: 'none', background: 'none', fontSize: 13, fontWeight: 700, color: callTab === t.id ? 'var(--blue)' : 'var(--text-muted)', borderBottom: `3px solid ${callTab === t.id ? 'var(--blue)' : 'transparent'}`, cursor: 'pointer' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                
                {/* ── EMR TAB ── */}
                {callTab === 'emr' && (
                  <div className="slide-up">
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: 16, fontSize: 15, fontWeight: 800 }}>Electronic Medical Records</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {/* Vitals summary */}
                      <div className="card" style={{ padding: 16, borderRadius: 16, background: 'var(--bg-secondary)', border: 'none' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Today's Vitals (Reported)</div>
                        {activeConsultation.emr ? (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>BP:</span> <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{activeConsultation.emr.vitals.bp}</strong></div>
                            <div><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Pulse:</span> <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{activeConsultation.emr.vitals.hr}</strong></div>
                            <div><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>SpO₂:</span> <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{activeConsultation.emr.vitals.spo2}</strong></div>
                            <div><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sugar:</span> <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{activeConsultation.emr.vitals.sugar}</strong></div>
                          </div>
                        ) : (
                          <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--text-muted)' }}>No vitals uploaded.</div>
                        )}
                      </div>

                      {/* General Patient Stats */}
                      <div className="card" style={{ padding: 16, borderRadius: 16, border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Blood Group</span><span style={{ fontWeight: 700, color: 'var(--red-light)' }}>{activeConsultation.emr?.bloodGroup || 'A+'}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Allergies</span><span style={{ fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>{activeConsultation.emr?.allergies || 'None'}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Chronic Issues</span><span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{activeConsultation.emr?.chronicConditions || 'None'}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Height/Weight</span><span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{activeConsultation.emr?.height || '170 cm'} / {activeConsultation.emr?.weight || '70 kg'}</span></div>
                        </div>
                      </div>

                      {/* Medical History */}
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>Past Consultation Prescriptions</div>
                        {activeConsultation.emr?.pastPrescriptions.map((rx, idx) => (
                          <div key={idx} className="card" style={{ padding: 12, borderRadius: 12, marginBottom: 8, background: 'var(--bg-secondary)', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{rx.diagnosis}</span>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rx.date}</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Meds: {rx.meds}</div>
                            <div style={{ fontSize: 11, color: 'var(--blue)', marginTop: 4 }}>Dr: {rx.doc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── DOCUMENTS TAB ── */}
                {callTab === 'documents' && (
                  <div className="slide-up">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h4 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 800 }}>Shared Documents</h4>
                      <button className="btn-icon" style={{ width: 32, height: 32, borderRadius: 8 }} onClick={() => alert('Feature to request new report is triggered!')} title="Request Document"><Upload size={14} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {activeConsultation.documents ? (
                        activeConsultation.documents.map(doc => (
                          <div 
                            key={doc.id} 
                            onClick={() => setSelectedDoc(doc)}
                            className="card" 
                            style={{ padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: '1px solid var(--border)', transition: '0.2s' }}
                          >
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
                              <FileText size={20} />
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{doc.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{doc.date} · {doc.type.toUpperCase()}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                              <span className="badge badge-blue" style={{ fontSize: 10 }}>View <Eye size={8} style={{ marginLeft: 2 }} /></span>
                              <span style={{ fontSize: 9, color: 'var(--green-light)', fontWeight: 700 }}>{doc.status}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--text-muted)' }}>No shared reports.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── CHAT TAB ── */}
                {callTab === 'chat' && (
                  <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: 12, fontSize: 15, fontWeight: 800 }}>Encrypted Chat</h4>
                    
                    {/* Chat Logs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-secondary)', padding: 12, borderRadius: 14, minHeight: 280, maxHeight: 320, overflowY: 'auto', marginBottom: 12 }}>
                      {chatMessages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignSelf: msg.sender === 'doctor' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                          <div style={{ 
                            background: msg.sender === 'doctor' ? 'var(--blue)' : 'var(--border)', 
                            color: msg.sender === 'doctor' ? 'white' : 'var(--text-primary)', 
                            padding: '10px 14px', 
                            borderRadius: 14, 
                            fontSize: 13, 
                            lineHeight: 1.4,
                            borderBottomRightRadius: msg.sender === 'doctor' ? 2 : 14,
                            borderBottomLeftRadius: msg.sender === 'patient' ? 2 : 14
                          }}>
                            {msg.text}
                          </div>
                          <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, alignSelf: msg.sender === 'doctor' ? 'flex-end' : 'flex-start' }}>{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input 
                        className="input" 
                        placeholder="Type secure message..." 
                        style={{ borderRadius: 10, height: 40, padding: '0 12px', fontSize: 13 }} 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && chatInput.trim()) {
                            const newMsg = { sender: 'doctor', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
                            setChatMessages([...chatMessages, newMsg]);
                            setChatInput('');
                          }
                        }}
                      />
                      <button 
                        className="btn btn-primary" 
                        style={{ width: 40, height: 40, borderRadius: 10, padding: 0, minWidth: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => {
                          if (chatInput.trim()) {
                            const newMsg = { sender: 'doctor', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
                            setChatMessages([...chatMessages, newMsg]);
                            setChatInput('');
                          }
                        }}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── E-CONSENT TAB ── */}
                {callTab === 'consent' && (
                  <div className="slide-up">
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: 16, fontSize: 15, fontWeight: 800 }}>E-Consent Status</h4>
                    
                    <div className="card" style={{ padding: 20, borderRadius: 16, border: 'none', background: 'rgba(34, 197, 94, 0.1)', borderLeft: '4px solid #22C55E' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#22C55E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={14} /></div>
                        <strong style={{ color: '#22C55E', fontSize: 14 }}>Consent Signed</strong>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        The patient has reviewed and signed the electronic medical consultation consent form. All privacy protocols comply with health standards.
                      </p>
                      <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                        Signed on: {activeConsultation.date || 'Today'} · Verified via OTP
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Document Viewer Modal */}
          {selectedDoc && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelectedDoc(null)}>
              <div style={{ width: '100%', maxWidth: 500, background: 'var(--bg-card)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '80%' }}>{selectedDoc.name}</div>
                  <button className="btn-icon" onClick={() => setSelectedDoc(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <div style={{ padding: 20, maxHeight: '60vh', overflowY: 'auto', display: 'flex', justifyContent: 'center', background: '#0F172A' }}>
                  <img src={selectedDoc.url} alt={selectedDoc.name} style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
                </div>
                <div style={{ padding: 16, background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Uploaded on {selectedDoc.date}</span>
                  <a href={selectedDoc.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary" style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12 }}>Open Original</a>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Prescription Writing Screen (Shown when step is 'prescription') */}
      {activeConsultation && consultationStep === 'prescription' && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', zIndex: 1000, overflowY: 'auto', padding: '24px 20px' }}>
          <div className="page-header" style={{ padding: '10px 0 20px 0', background: 'transparent' }}>
            <button className="back-btn" onClick={() => setActiveConsultation(null)}><ArrowLeft size={20} /></button>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>Write Prescription</h2>
          </div>

          <div className="card" style={{ marginBottom: 24, padding: 20, background: 'linear-gradient(135deg, var(--blue-dim), transparent)', border: '1px solid var(--blue)', borderRadius: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileHeart size={24} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Consulting Patient</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>{activeConsultation.patientName || 'Patient'}</div>
                <div style={{ fontSize: 13, color: 'var(--blue)' }}>Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="section-label" style={{ fontWeight: 700, marginBottom: 12 }}>Primary Diagnosis</div>
          <textarea
            className="input"
            placeholder="Enter clinical diagnosis based on consultation..."
            style={{ height: 100, marginBottom: 24, fontSize: 15, borderRadius: 16, padding: 16 }}
            value={prescriptionForm.diagnosis}
            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })}
          />

          <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 700 }}>Prescribed Medicines</span>
            <button onClick={addMedRow} style={{ color: 'var(--blue)', background: 'var(--blue-dim)', border: 'none', fontWeight: 700, fontSize: 12, padding: '6px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <Plus size={14} /> Add Med
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {prescriptionForm.medicines.map((med, i) => (
              <div key={i} className="card" style={{ padding: 16, borderRadius: 16, borderLeft: '4px solid var(--blue)' }}>
                <input
                  className="input"
                  placeholder="Medicine Name (e.g. Paracetamol 500mg)"
                  style={{ marginBottom: 12, background: 'var(--bg-secondary)', border: 'none' }}
                  value={med.name}
                  onChange={(e) => {
                    const newMeds = [...prescriptionForm.medicines];
                    newMeds[i].name = e.target.value;
                    setPrescriptionForm({ ...prescriptionForm, medicines: newMeds });
                  }}
                />
                <div style={{ display: 'flex', gap: 12 }}>
                  <input
                    className="input"
                    placeholder="Dosage (e.g. 1 Tablet)"
                    style={{ flex: 1, background: 'var(--bg-secondary)', border: 'none' }}
                    value={med.dosage}
                    onChange={(e) => {
                      const newMeds = [...prescriptionForm.medicines];
                      newMeds[i].dosage = e.target.value;
                      setPrescriptionForm({ ...prescriptionForm, medicines: newMeds });
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Freq (e.g. 1-0-1)"
                    style={{ flex: 1, background: 'var(--bg-secondary)', border: 'none' }}
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
          </div>

          <div className="section-label" style={{ fontWeight: 700, marginBottom: 12 }}>Doctor's Advice / Diet Instructions</div>
          <textarea
            className="input"
            placeholder="Any special dietary advice, rest, or follow-up notes..."
            style={{ height: 100, marginBottom: 20, fontSize: 15, borderRadius: 16, padding: 16 }}
            value={prescriptionForm.instructions}
            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
          />

          {/* Digital Signature section */}
          <div className="card" style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)', marginBottom: 30 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input 
                type="checkbox" 
                id="digital-sign-checkbox"
                checked={digitallySigned} 
                onChange={(e) => setDigitallySigned(e.target.checked)} 
                style={{ width: 20, height: 20, cursor: 'pointer' }} 
              />
              <label htmlFor="digital-sign-checkbox" style={{ cursor: 'pointer' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>Digitally Sign Prescription</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Attach secure electronic signature: Dr. {profileData.name}</div>
              </label>
            </div>
            {digitallySigned && (
              <div style={{ marginTop: 12, borderTop: '1px dashed var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontFamily: 'cursive', color: 'var(--blue)', fontWeight: 'bold' }}>Dr. {profileData.name}</span>
                <span style={{ fontSize: 10, color: '#4ADE80', background: 'rgba(34,197,94,0.15)', padding: '4px 10px', borderRadius: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Shield size={10} /> HIPAA SIGNED
                </span>
              </div>
            )}
          </div>

          <button className="btn btn-blue btn-full" style={{ padding: '18px', fontSize: 16, borderRadius: 16, fontWeight: 700, boxShadow: 'var(--shadow-glow-blue)' }} onClick={handlePrescriptionSubmit}>
            Issue E-Prescription securely
          </button>
        </div>
      )}


      {/* Modern Dashboard Header */}
      <div style={{
        padding: '24px 20px',
        background: 'var(--bg-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div 
            onClick={() => setActiveTab('profile')}
            style={{ 
              display: 'flex', 
              gap: 14, 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 14,
              transition: 'background 0.2s ease',
              background: activeTab === 'profile' ? 'var(--bg-secondary)' : 'transparent',
              border: activeTab === 'profile' ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent'
            }}
            title="View Profile Settings"
          >
            <div style={{ position: 'relative' }}>
              <img src={profileData.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop'} alt={profileData.name} style={{ width: 50, height: 50, borderRadius: 16, objectFit: 'cover', border: '2px solid var(--border)' }} />
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, background: 'var(--green)', borderRadius: '50%', border: '2px solid var(--bg-primary)' }}></div>
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Dr. {profileData.name.replace('Dr. ', '') || 'Doctor'}</h2>
              <p style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600, letterSpacing: '0.5px', marginTop: 2 }}>{profileData.specialty || 'General Physician'}</p>
            </div>
          </div>
          <button 
            className="btn-icon" 
            onClick={() => setShowNotificationsDrawer(true)}
            style={{ 
              position: 'relative', 
              background: 'var(--bg-secondary)', 
              borderRadius: 12, 
              width: 44, 
              height: 44, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Bell size={22} color="var(--text-primary)" />
            {unreadCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: -2, 
                right: -2, 
                background: 'var(--red)', 
                color: 'white', 
                fontSize: 9, 
                fontWeight: 800, 
                minWidth: 16, 
                height: 16, 
                borderRadius: 8, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '2px solid var(--bg-primary)',
                padding: '0 2px'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Beautiful Scrollable Tabs */}
      <div style={{ overflowX: 'auto', padding: '0 20px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 24, minWidth: 'max-content' }}>
          {[
            { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
            { id: 'requests', label: 'Patient Requests', icon: <UserPlus size={16} />, badge: patientRequests.filter(r => r.status === 'pending').length },
            { id: 'appointments', label: 'Appointments', icon: <Calendar size={16} /> },
            { id: 'patients', label: 'My Patients', icon: <Users size={16} /> },
            { id: 'profile', label: 'Profile Settings', icon: <User size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 0',
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? 'var(--blue)' : 'var(--text-muted)',
                fontSize: 15,
                fontWeight: activeTab === tab.id ? 700 : 600,
                borderBottom: `3px solid ${activeTab === tab.id ? 'var(--blue)' : 'transparent'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {tab.icon} {tab.label}
              {tab.badge > 0 && (
                <span style={{ background: 'var(--red)', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 10, fontWeight: 800 }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '24px 20px' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="page-enter">
            <h3 style={{ marginBottom: 16, fontSize: 18, color: 'var(--text-primary)' }}>Dashboard Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 30 }}>
              {[
                { label: 'Total Patients', value: '1,248', icon: <Users size={24} />, color: 'var(--blue)', bg: 'linear-gradient(135deg, var(--blue-dim), transparent)' },
                { label: 'Consultations', value: myAppointments.length, icon: <Stethoscope size={24} />, color: 'var(--purple)', bg: 'linear-gradient(135deg, var(--purple-dim), transparent)' },
                { label: 'Pending Requests', value: patientRequests.filter(r => r.status === 'pending').length, icon: <HeartPulse size={24} />, color: 'var(--red)', bg: 'linear-gradient(135deg, var(--red-dim), transparent)' },
                { label: 'Monthly Earnings', value: `₹${(myAppointments.length * (profileData.fee || 850)).toLocaleString()}`, icon: <Clipboard size={24} />, color: 'var(--green)', bg: 'linear-gradient(135deg, var(--green-dim), transparent)' },
              ].map((stat, i) => (
                <div key={i} className="card" style={{ padding: 20, background: stat.bg, border: `1px solid ${stat.color}40`, borderRadius: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{stat.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, color: 'var(--text-primary)' }}>Today's Schedule</h3>
              <button style={{ color: 'var(--blue)', background: 'none', border: 'none', fontSize: 14, fontWeight: 700 }}>View All</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {myAppointments.length === 0 ? (
                <div className="card" style={{ padding: 40, textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px dashed var(--border)' }}>
                  <Calendar size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>No appointments today.</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Take a well-deserved rest, Doctor!</div>
                </div>
              ) : (
                myAppointments.map(appt => (
                  <div key={appt.id} className="card" style={{ padding: 20, borderRadius: 20, background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--green)' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>{appt.patientName || 'Patient'}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={14} color="var(--blue)" /> Slot: {appt.slot} · {appt.type || 'Video'} Consult
                          </div>
                        </div>
                      </div>
                      <div className="badge badge-green" style={{ fontSize: 11, padding: '4px 10px' }}>Confirmed</div>
                    </div>

                    <div style={{ background: 'var(--bg-primary)', padding: 12, borderRadius: 12, marginBottom: 16, border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Patient Notes:</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>"{appt.symptoms || 'No additional notes provided.'}"</div>
                    </div>

                    <button className="btn btn-primary btn-full" style={{ padding: 14, borderRadius: 12, fontSize: 15 }} onClick={() => startConsultation(appt)}>
                      <Video size={18} /> Join Consultation Room
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div className="page-enter">
            <h3 style={{ marginBottom: 8, fontSize: 18, color: 'var(--text-primary)' }}>Patient Requests</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>Patients who requested a consultation with you.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {patientRequests.length === 0 || patientRequests.every(r => r.status !== 'pending') ? (
                <div className="card" style={{ padding: 40, textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px dashed var(--border)' }}>
                  <CheckCircle size={40} color="var(--green)" style={{ margin: '0 auto 16px' }} />
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>All caught up!</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>No pending patient requests.</div>
                </div>
              ) : (
                patientRequests.map(req => {
                  if (req.status !== 'pending') return null;
                  return (
                    <div key={req.id} className="card" style={{ padding: 20, borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={24} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>{req.patientName}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Requested for: <span style={{ color: 'var(--text-primary)' }}>{req.date}</span></div>
                          </div>
                        </div>
                        <div className={`badge badge-${req.urgency === 'High' ? 'red' : req.urgency === 'Medium' ? 'amber' : 'green'}`}>
                          {req.urgency} Urgency
                        </div>
                      </div>

                      <div style={{ margin: '16px 0', padding: 14, background: 'var(--bg-secondary)', borderRadius: 12 }}>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Reported Symptoms</div>
                        <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{req.symptoms}</div>
                      </div>

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-green" style={{ flex: 1, borderRadius: 12, padding: 12, gap: 6 }} onClick={() => handleRequestAction(req.id, 'accepted')}>
                          <CheckCircle size={18} /> Accept
                        </button>
                        <button className="btn btn-ghost" style={{ flex: 1, borderRadius: 12, padding: 12, color: 'var(--red)', borderColor: 'var(--red-dim)', background: 'var(--red-dim)' }} onClick={() => handleRequestAction(req.id, 'declined')}>
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="page-enter">
            <h3 style={{ marginBottom: 16, fontSize: 18, color: 'var(--text-primary)' }}>All Appointments</h3>
            {myAppointments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No appointments found.</p>
            ) : (
              myAppointments.map(appt => (
                <div key={appt.id} className="card" style={{ padding: 16, marginBottom: 12, borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{appt.patientName || 'Patient'}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{appt.date} · {appt.slot}</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--blue-dim)', color: 'var(--blue)', padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{appt.type || 'Video'}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PATIENTS TAB */}
        {activeTab === 'patients' && (
          <div className="page-enter">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, color: 'var(--text-primary)' }}>My Patients</h3>
              <button className="btn-icon" style={{ background: 'var(--bg-card)' }}><Search size={18} /></button>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {/* Mocking a list of patients */}
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="card" style={{ padding: 16, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img src={`https://i.pravatar.cc/100?img=${num + 10}`} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} alt="Patient" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Patient Name {num}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Last visit: 2 days ago</div>
                  </div>
                  <button className="btn-icon" style={{ color: 'var(--blue)', background: 'var(--blue-dim)' }}><ChevronRight size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>

            {saveStatus === 'success' && (
              <div className="slide-up" style={{
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid var(--green)',
                color: 'var(--green)',
                padding: '16px 20px',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontWeight: 600,
                fontSize: 14,
                backdropFilter: 'blur(10px)'
              }}>
                <span>✨</span> Professional Profile updated and synced with database successfully!
              </div>
            )}
            {saveStatus === 'saving' && (
              <div className="slide-up" style={{
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid var(--blue)',
                color: 'var(--blue-light)',
                padding: '16px 20px',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontWeight: 600,
                fontSize: 14,
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ width: 14, height: 14, border: '2px solid var(--blue)', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                Saving profile changes to secure database...
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="slide-up" style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid var(--red)',
                color: 'var(--red)',
                padding: '16px 20px',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontWeight: 600,
                fontSize: 14,
                backdropFilter: 'blur(10px)'
              }}>
                <span>❌</span> Failed to sync changes. Please check server database connection.
              </div>
            )}

            <div style={{
              background: 'linear-gradient(135deg, var(--blue-dim), var(--purple-dim))',
              borderRadius: 24,
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px solid rgba(59,130,246,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 150, height: 150, borderRadius: '50%', background: 'var(--blue)', opacity: 0.1, filter: 'blur(30px)' }}></div>
              <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'var(--purple)', opacity: 0.1, filter: 'blur(30px)' }}></div>

              <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 20px' }}>
                <img
                  src={profileData.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg-card)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
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
                  style={{ position: 'absolute', bottom: 0, right: 0, width: 38, height: 38, borderRadius: '50%', background: 'var(--blue)', color: 'white', border: '3px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.5)' }}
                >
                  <Camera size={18} />
                </button>
              </div>

              <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Dr. {profileData.name.replace('Dr. ', '')}</h2>
              <p style={{ color: 'var(--blue-light)', fontWeight: 700, fontSize: 14, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1.5 }}>{profileData.qualification || 'MBBS, MD'}</p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                <span className="badge" style={{ padding: '8px 16px', fontSize: 12, borderRadius: 20, background: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>⭐ 4.9 Top Rated</span>
                <span className="badge badge-purple" style={{ padding: '8px 16px', fontSize: 12, borderRadius: 20 }}>🏆 Verified Expert</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { label: 'Experience', val: `${profileData.experience}Y+`, color: 'var(--blue)' },
                { label: 'Consulted', val: '1.2K+', color: 'var(--purple)' },
                { label: 'Fee', val: `₹${profileData.fee}`, color: 'var(--green)' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ textAlign: 'center', padding: '20px 8px', borderRadius: 20, borderBottom: `4px solid ${s.color}60` }}>
                  <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--text-primary)' }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="section-label" style={{ marginBottom: -8, marginTop: 10 }}>Professional Setup</div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, borderRadius: 24 }}>
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <User size={16} color="var(--blue)" /> Display Name
                </label>
                <input className="input" style={{ borderRadius: 12 }} value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">Qualification</label>
                  <input className="input" style={{ borderRadius: 12 }} value={profileData.qualification} onChange={(e) => setProfileData({ ...profileData, qualification: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Specialization</label>
                  <input className="input" style={{ borderRadius: 12 }} value={profileData.specialty} onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Activity size={16} color="var(--purple)" /> Hospital / Clinic
                </label>
                <input className="input" style={{ borderRadius: 12 }} value={profileData.hospital} onChange={(e) => setProfileData({ ...profileData, hospital: e.target.value })} />
              </div>

              <div className="input-group">
                <label className="input-label">About / Biography</label>
                <textarea
                  className="input"
                  style={{ height: 120, lineHeight: 1.6, padding: '16px', borderRadius: 12 }}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Share your expertise and medical journey with your patients..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">Experience (Years)</label>
                  <input className="input" style={{ borderRadius: 12 }} type="number" value={profileData.experience} onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Consultation Fee (₹)</label>
                  <input className="input" style={{ borderRadius: 12 }} type="number" value={profileData.fee} onChange={(e) => setProfileData({ ...profileData, fee: e.target.value })} />
                </div>
              </div>

              <div className="card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: 16, border: 'none' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Require Payment Upfront</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Patients must pay before booking</div>
                </div>
                <div
                  onClick={() => setProfileData({ ...profileData, requirePaymentUpfront: !profileData.requirePaymentUpfront })}
                  style={{ width: 50, height: 28, borderRadius: 14, background: profileData.requirePaymentUpfront ? 'var(--blue)' : 'var(--border)', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: profileData.requirePaymentUpfront ? 25 : 3, transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                </div>
              </div>

              <button className="btn btn-primary btn-full" style={{ padding: '18px', gap: 12, fontSize: 16, fontWeight: 700, borderRadius: 16, marginTop: 10 }} onClick={handleProfileSave}>
                <Save size={22} /> Save Professional Profile
              </button>
            </div>

            <button
              className="btn btn-ghost btn-full"
              style={{ color: 'var(--red)', background: 'var(--red-dim)', padding: 18, borderRadius: 16, fontSize: 16, fontWeight: 600, border: 'none' }}
              onClick={() => { logout(); navigate('/login'); }}
            >
              Sign Out from Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Notifications Drawer Overlay */}
      {showNotificationsDrawer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(9,11,16,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end',
          animation: 'fadeIn 0.3s ease'
        }} onClick={() => setShowNotificationsDrawer(false)}>
          <div 
            style={{
              width: '100%',
              maxWidth: 420,
              background: 'var(--bg-secondary)',
              height: '100%',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid var(--border)',
              animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '24px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Clinical Alerts</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>You have {unreadCount} unread notifications</p>
              </div>
              <button 
                onClick={() => setShowNotificationsDrawer(false)}
                style={{
                  background: 'var(--bg-card)',
                  border: 'none',
                  color: 'var(--text-muted)',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Actions */}
            {notifications.length > 0 && (
              <div style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button 
                  onClick={markAllNotificationsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--blue-light)',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <CheckCircle size={14} /> Mark all read
                </button>
              </div>
            )}

            {/* Notification List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {notifications.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  opacity: 0.6,
                  padding: 24
                }}>
                  <Bell size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 16 }}>All Caught Up!</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>No clinical notifications are pending.</div>
                </div>
              ) : (
                notifications.map((notif) => {
                  const isUnread = !notif.is_read;
                  return (
                    <div 
                      key={notif.id}
                      onClick={() => isUnread && markNotificationRead(notif.id)}
                      style={{
                        padding: 16,
                        borderRadius: 16,
                        background: isUnread ? 'var(--bg-card)' : 'rgba(22,27,37,0.3)',
                        border: isUnread ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                        position: 'relative',
                        cursor: isUnread ? 'pointer' : 'default',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      {isUnread && (
                        <div style={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'var(--blue)'
                        }} />
                      )}
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: isUnread ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)',
                          color: isUnread ? 'var(--blue)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {notif.type === 'sos' ? <AlertCircle size={18} color="var(--red)" /> :
                           notif.type === 'appointment' ? <Calendar size={18} /> :
                           <Bell size={18} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: 700, 
                            fontSize: 14, 
                            color: isUnread ? 'var(--text-primary)' : 'var(--text-secondary)'
                          }}>
                            {notif.title}
                          </div>
                          <div style={{ 
                            fontSize: 13, 
                            color: 'var(--text-muted)', 
                            marginTop: 4,
                            lineHeight: 1.4
                          }}>
                            {notif.message}
                          </div>
                          <div style={{ 
                            fontSize: 11, 
                            color: 'var(--text-muted)', 
                            marginTop: 8 
                          }}>
                            {new Date(notif.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
