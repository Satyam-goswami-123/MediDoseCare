import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

import { Pill, Bell, AlertTriangle, Flame, Plus, BarChart2, ClipboardList, Bot, Users, Award, Activity, HeartPulse, Heart, Wind, Sun, Moon } from 'lucide-react';

function VitalCard({ icon, label, value, unit, color, onClick }) {
  return (
    <div className="card" onClick={onClick}
      style={{ cursor: 'pointer', borderColor: `${color}30`, background: `linear-gradient(135deg,${color}18,var(--bg-card))` }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>{unit}</span></div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

const VIBE_IMAGES = [
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800'
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, medicines, healthLogs, streak, unreadCount, theme, toggleTheme } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % VIBE_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  const latest = healthLogs[0] || {};
  const todayMeds = medicines.slice(0, 4);
  const taken = medicines.filter((m) => m.status === 'taken').length;

  return (
    <div className="page-enter">
      <div className="page-content">
        {/* Header */}
        <div style={{ padding: '20px 20px 0', background: 'linear-gradient(180deg,rgba(59,130,246,0.06) 0%,transparent 100%)' }}>
          <div className="flex justify-between items-center">
            <div>
              <div className="mobile-brand" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, background: 'linear-gradient(135deg, var(--blue), var(--green))', borderRadius: '50%' }}>
                  <Pill size={12} color="white" />
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg, var(--blue-light), var(--green-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  MediDoseCare
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Good Morning,</p>
              <h2 style={{ marginTop: 2 }}>{user?.name?.split(' ')[0] || 'User'}</h2>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="back-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="back-btn" onClick={() => navigate('/notifications')} style={{ position: 'relative' }}>
                <Bell size={18} />
                {unreadCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--red)', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unreadCount}</span>}
              </button>
              <button className="back-btn" onClick={() => navigate('/sos')} style={{ background: 'var(--red-dim)', borderColor: 'rgba(239,68,68,0.3)' }}>
                <AlertTriangle size={18} color="var(--red)" />
              </button>
            </div>
          </div>
          {/* Positive Vibes Auto Slider */}
          <div style={{ marginTop: 16, marginBottom: 0, position: 'relative', width: '100%', height: 180, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            {VIBE_IMAGES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Positive Vibe"
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                  opacity: i === currentSlide ? 1 : 0, transition: 'opacity 1s ease-in-out'
                }}
              />
            ))}
            <div style={{ position: 'absolute', bottom: 12, width: '100%', display: 'flex', justifyContent: 'center', gap: 6 }}>
              {VIBE_IMAGES.map((_, i) => (
                <div key={i} style={{ width: i === currentSlide ? 20 : 6, height: 6, borderRadius: 3, background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.4s ease' }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Quick Actions */}
          <div>
            <div className="section-label">Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { icon: <Plus size={24} />, label: 'Add Med', path: '/medicines/add', color: 'var(--green)' },
                { icon: <BarChart2 size={24} />, label: 'Reports', path: '/history', color: 'var(--blue)' },
                { icon: <ClipboardList size={24} />, label: 'Prescriptions', path: '/prescriptions', color: 'var(--purple)' },
                { icon: <Bot size={24} />, label: 'AI Coach', path: '/ai-coach', color: 'var(--indigo)' },
                { icon: <Users size={24} />, label: 'Care Team', path: '/care-network', color: 'var(--teal)' },
                { icon: <Award size={24} />, label: 'Achievements', path: '/achievements', color: 'var(--gold)' },
              ].map(({ icon, label, path, color }) => (
                <button key={path} onClick={() => navigate(path)} style={{
                  background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)',
                  padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  cursor: 'pointer', transition: 'var(--transition)', color,
                  boxShadow: 'var(--shadow-glass)'
                }}>
                  <span style={{ fontSize: 24 }}>{icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Today's Medicines */}
          <div>
            <div className="flex justify-between items-center mb-16">
              <div className="section-label" style={{ marginBottom: 0 }}>Today's Medicines</div>
              <button style={{ fontSize: 13, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/medicines')}>View All</button>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'linear-gradient(135deg,rgba(34,197,94,0.08),var(--bg-glass))' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{taken}/{medicines.length} taken today</span>
                <div style={{ background: 'var(--green-dim)', height: 8, borderRadius: 99, width: 100, overflow: 'hidden' }}>
                  <div style={{ background: 'var(--green)', height: '100%', width: `${(taken / Math.max(medicines.length, 1)) * 100}%`, borderRadius: 99, transition: 'var(--transition)' }} />
                </div>
              </div>
              {todayMeds.map((med) => (
                <div key={med.id} onClick={() => navigate(`/medicines/${med.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: med.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{med.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{med.dosage} • {med.times?.[0] || '08:00'}</div>
                  </div>
                  <span className={`badge ${med.status === 'taken' ? 'badge-green' : med.status === 'missed' ? 'badge-red' : 'badge-amber'}`}>
                    {med.status === 'taken' ? '✓ Taken' : med.status === 'missed' ? '✗ Missed' : '⏰ Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Health Summary */}
          <div>
            <div className="flex justify-between items-center mb-16">
              <div className="section-label" style={{ marginBottom: 0 }}>Health Summary</div>
              <button style={{ fontSize: 13, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/health')}>View All</button>
            </div>
            <div className="vitals-row">
              <VitalCard icon={<Activity size={24} />} label="Blood Pressure" value={`${latest.systolic || 128}/${latest.diastolic || 82}`} unit="mmHg" color="var(--red)" onClick={() => navigate('/health/bp')} />
              <VitalCard icon={<HeartPulse size={24} />} label="Blood Sugar" value={latest.blood_sugar || 118} unit="mg/dL" color="var(--amber)" onClick={() => navigate('/health/sugar')} />
            </div>
            <div className="vitals-row" style={{ marginTop: 12 }}>
              <VitalCard icon={<Heart size={24} />} label="Heart Rate" value={latest.heart_rate || 74} unit="bpm" color="var(--red)" onClick={() => navigate('/health/heartrate')} />
              <VitalCard icon={<Wind size={24} />} label="SpO₂" value={latest.spo2 || 98} unit="%" color="var(--blue)" onClick={() => navigate('/health/spo2')} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
