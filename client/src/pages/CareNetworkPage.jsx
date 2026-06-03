import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Phone, Video, MessageSquare, Clock, Calendar, ShieldCheck, Star, CreditCard, CheckCircle } from 'lucide-react';

export default function CareNetworkPage() {
  const navigate = useNavigate();
  const { registeredDoctors, bookAppointment, appointments, user } = useApp();

  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingStep, setBookingStep] = useState('options'); // 'options', 'slots', 'payment', 'success'
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Google Pay / UPI');
  const [patientSymptoms, setPatientSymptoms] = useState('');

  // Group booked slots by doctor name for visibility logic
  const bookedSlotsByDoc = appointments.reduce((acc, app) => {
    if (!acc[app.doctorName]) acc[app.doctorName] = [];
    acc[app.doctorName].push(app.slot);
    return acc;
  }, {});

  const caregivers = [
    { name: 'Suresh Kumar', specialty: 'Son', emoji: '👨' },
    { name: 'Meena Devi', specialty: 'Daughter', emoji: '👩' },
  ];

  const handleBooking = (doctor) => {
    setBookingDoctor(doctor);
    setBookingStep('options');
  };

  const confirmBooking = () => {
    bookAppointment({
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      patientName: user?.name || 'Satyam Goswami',
      patientId: user?.id || 999,
      type: selectedType,
      slot: selectedSlot,
      date: '24 April 2026',
      fee: bookingDoctor.fee,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: 'Paid',
      symptoms: patientSymptoms
    });
    setBookingStep('success');
  };

  const closeBooking = () => {
    setBookingDoctor(null);
    setBookingStep('options');
    setSelectedType(null);
    setSelectedSlot(null);
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        {!bookingDoctor ? (
          <>
            <div className="page-header">
              <button className="back-btn" onClick={() => navigate('/home')}>←</button>
              <h2>Care Network</h2>
              <button className="btn btn-sm" style={{ marginLeft: 'auto', background: 'var(--teal-dim)', color: 'var(--teal)', border: '1px solid rgba(20,184,166,0.3)' }}>+ Invite</button>
            </div>

            <div style={{ padding: '12px 20px 20px' }}>
              {/* Summary Card */}
              <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg,rgba(20,184,166,0.1),var(--bg-card))', borderColor: 'rgba(20,184,166,0.25)' }}>
                <div className="flex items-center gap-16">
                  <div style={{ width: 50, height: 50, borderRadius: 16, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--teal)', marginBottom: 2 }}>{registeredDoctors.length + caregivers.length} Active Guardians</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your healthcare team is monitoring you</p>
                  </div>
                </div>
              </div>

              {/* Doctors Section */}
              <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🩺 Specialist Doctors</span>
                <span style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 700 }}>VIEW ALL</span>
              </div>
              {registeredDoctors.map((doc) => (
                <div key={doc.id} className="card" style={{
                  marginBottom: 16,
                  padding: 20,
                  background: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  border: '1px solid var(--border)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ position: 'relative' }}>
                      <img src={doc.image} alt={doc.name} style={{ width: 85, height: 85, borderRadius: 24, objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: -5, right: -5, width: 22, height: 22, background: 'var(--green)', borderRadius: '50%', border: '3px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ color: 'var(--text-primary)', marginBottom: 2, fontSize: 17, fontWeight: 800 }}>{doc.name}</h4>
                          <span style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{doc.specialty || 'General Physician'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--amber-dim)', padding: '4px 8px', borderRadius: 10, color: '#D97706', fontSize: 12, fontWeight: 800 }}>
                          <Star size={13} fill="#D97706" /> {doc.rating || '4.9'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                        <span style={{ fontSize: 11, padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: 6, color: 'var(--text-muted)' }}>🎓 {doc.qualification || 'MBBS'}</span>
                        <span style={{ fontSize: 11, padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: 6, color: 'var(--text-muted)' }}>🕒 {doc.experience} Exp</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Clock size={16} color="var(--blue)" />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Next available: <strong style={{ color: 'var(--text-primary)' }}>Today, 04:30 PM</strong></span>
                  </div>

                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>CONSULTATION FEE</span>
                      <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>₹{doc.fee}</div>
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '12px 28px', borderRadius: 14, fontWeight: 700, background: 'var(--blue)', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}
                      onClick={() => handleBooking(doc)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}

              {/* Caregivers Section */}
              <div className="section-label" style={{ marginTop: 24 }}>🤝 Family Caregivers</div>
              {caregivers.map((cg) => (
                <div key={cg.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, padding: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{cg.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cg.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cg.specialty}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--blue-dim)', border: 'none', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={18} /></button>
                    <button style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--green-dim)', border: 'none', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="page-enter">
            <div className="page-header" style={{ marginBottom: 20 }}>
              <button className="back-btn" onClick={closeBooking}>←</button>
              <h2>
                {bookingStep === 'options' && 'Consultation Type'}
                {bookingStep === 'slots' && 'Schedule Slot'}
                {bookingStep === 'payment' && 'Confirm & Pay'}
                {bookingStep === 'success' && 'Booking Success'}
              </h2>
            </div>

            <div style={{ padding: '0 20px 40px' }}>
              {/* Doctor Mini Profile */}
              {bookingStep !== 'success' && (
                <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 12, padding: 12, background: 'var(--bg-card)' }}>
                  <img src={bookingDoctor.image} alt={bookingDoctor.name} style={{ width: 50, height: 50, borderRadius: 12, objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{bookingDoctor.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--blue)' }}>{bookingDoctor.specialty}</div>
                  </div>
                </div>
              )}

              {/* Step 1: Consultation Options */}
              {bookingStep === 'options' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { type: 'video', label: 'Video Consultation', icon: <Video size={24} />, desc: 'Face-to-face HD call' },
                    { type: 'audio', label: 'Voice Call', icon: <Phone size={24} />, desc: 'Standard audio consultation' },
                    { type: 'chat', label: 'Chat Consultation', icon: <MessageSquare size={24} />, desc: 'Message & file sharing' },
                  ].map((opt) => (
                    <div
                      key={opt.type}
                      onClick={() => setSelectedType(opt.type)}
                      style={{
                        padding: 16, borderRadius: 16, border: `2px solid ${selectedType === opt.type ? 'var(--blue)' : 'var(--border)'}`,
                        background: selectedType === opt.type ? 'var(--blue-dim)' : 'var(--bg-card)',
                        display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer', transition: '0.2s'
                      }}
                    >
                      <div style={{ color: selectedType === opt.type ? 'var(--blue)' : 'var(--text-muted)' }}>{opt.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn btn-blue"
                    style={{ marginTop: 20, padding: 16, borderRadius: 16, width: '100%' }}
                    disabled={!selectedType}
                    onClick={() => setBookingStep('slots')}
                  >
                    Select Time Slot
                  </button>
                </div>
              )}

              {/* Step 2: Slot Selection */}
              {bookingStep === 'slots' && (
                <div>
                  <div className="section-label">Select Date</div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
                    {['Today', 'Tomorrow', '26 Apr', '27 Apr'].map((day, i) => (
                      <div key={day} style={{ padding: '10px 20px', borderRadius: 14, background: i === 0 ? 'var(--blue)' : 'var(--bg-card)', color: i === 0 ? 'white' : 'var(--text-primary)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 700 }}>{day}</div>
                    ))}
                  </div>

                  <div className="section-label">Select Time</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    {bookingDoctor.slots.map((slot) => {
                      const isBooked = bookedSlotsByDoc[bookingDoctor.name]?.includes(slot);
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            padding: '14px 4px', borderRadius: 12,
                            border: isBooked ? '1px solid var(--border)' : `2px solid ${selectedSlot === slot ? 'var(--blue)' : 'transparent'}`,
                            background: isBooked ? 'var(--bg-page)' : selectedSlot === slot ? 'var(--blue-dim)' : 'var(--bg-card)',
                            color: isBooked ? 'var(--text-muted)' : selectedSlot === slot ? 'var(--blue)' : 'var(--text-primary)',
                            fontSize: 13, fontWeight: 700, cursor: isBooked ? 'not-allowed' : 'pointer',
                            opacity: isBooked ? 0.5 : 1,
                            position: 'relative'
                          }}
                        >
                          {slot}
                          {isBooked && (
                            <div style={{ fontSize: 9, fontWeight: 400, marginTop: 2, textDecoration: 'none' }}>Unavailable</div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="section-label" style={{ marginTop: 24 }}>Any symptoms or notes for the doctor?</div>
                  <textarea
                    className="input"
                    placeholder="E.g., I have a mild fever and headache since yesterday..."
                    style={{ height: 80 }}
                    value={patientSymptoms}
                    onChange={(e) => setPatientSymptoms(e.target.value)}
                  />

                  <button
                    className="btn btn-blue"
                    style={{ marginTop: 32, padding: 16, borderRadius: 16, width: '100%' }}
                    disabled={!selectedSlot}
                    onClick={() => setBookingStep('payment')}
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}

              {/* Step 3: Payment */}
              {bookingStep === 'payment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="card" style={{ padding: 16, background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Consultation Fee</span>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>₹{bookingDoctor.fee}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                      <span style={{ fontSize: 16, fontWeight: 700 }}>Total Payable</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--blue)' }}>₹{bookingDoctor.fee}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>CHOOSE PAYMENT METHOD</p>
                    {[
                      { name: 'Google Pay / UPI', icon: '📱' },
                      { name: 'Debit / Credit Card', icon: '💳' },
                      { name: 'Net Banking', icon: '🏦' }
                    ].map((method) => (
                      <div key={method.name} onClick={() => setSelectedPaymentMethod(method.name)} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: selectedPaymentMethod === method.name ? '2px solid var(--blue)' : '2px solid transparent' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span style={{ fontSize: 20 }}>{method.icon}</span>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{method.name}</span>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: selectedPaymentMethod === method.name ? '5px solid var(--blue)' : '2px solid var(--border)' }} />
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-blue"
                    style={{ padding: 16, borderRadius: 16, width: '100%', marginTop: 10 }}
                    onClick={confirmBooking}
                  >
                    Confirm & Pay ₹{bookingDoctor.fee}
                  </button>
                </div>
              )}

              {/* Step 4: Success */}
              {bookingStep === 'success' && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--green-dim)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <CheckCircle size={60} />
                  </div>
                  <h3 style={{ fontSize: 28, marginBottom: 8, fontWeight: 800 }}>Success!</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, lineHeight: 1.6 }}>
                    Your appointment with <strong>{bookingDoctor.name}</strong> has been scheduled successfully.
                  </p>

                  <div className="card" style={{ padding: 24, background: 'var(--bg-card)', textAlign: 'left', marginBottom: 32, borderLeft: '4px solid var(--blue)' }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      <Calendar size={20} color="var(--blue)" />
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Date</div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>Today, 24 April 2026</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      <Clock size={20} color="var(--blue)" />
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Time Slot</div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{selectedSlot}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <Video size={20} color="var(--blue)" />
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Consultation</div>
                        <div style={{ fontSize: 15, fontWeight: 700, textTransform: 'capitalize' }}>{selectedType} Call</div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-blue"
                    style={{ width: '100%', padding: 18, borderRadius: 16, fontSize: 16, fontWeight: 700 }}
                    onClick={closeBooking}
                  >
                    Back to Home
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
