import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Pill, Bell, AlertTriangle, Plus, BarChart2, ClipboardList, Bot, Users, Award, Activity, HeartPulse, Heart, Wind, Sun, Moon, CheckCircle, Info, Lightbulb, Droplets, Footprints } from 'lucide-react';
import Footer from '../components/Footer';

function VitalCard({ icon, label, value, unit, color, status, statusColor, onClick }) {
  return (
    <div className="card" onClick={onClick}
      style={{
        cursor: 'pointer',
        borderColor: `${color}30`,
        background: `linear-gradient(135deg,${color}12,var(--bg-card))`,
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'var(--transition)'
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: statusColor || color, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: `${statusColor || color}15`, padding: '4px 8px', borderRadius: 6 }}>
          {status || 'Checked'}
        </div>
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
          {value} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>{unit}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, fontWeight: 500 }}>{label}</div>
      </div>
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
  const insightRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  // Smooth continuous auto-scroll for AI Insights
  useEffect(() => {
    const slider = insightRef.current;
    if (!slider) return;

    let animationId;
    let isPaused = false;
    const speed = 0.5; // Pixels per frame (adjust for speed)

    const scroll = () => {
      if (!isPaused) {
        slider.scrollLeft += speed;

        // Loop back to start (we have 3 sets of insights)
        // Insights array length is 5. Single set width is 5 * (260 + 16) = 1380
        const setWidth = 1380;
        if (slider.scrollLeft >= setWidth * 2) {
          slider.scrollLeft -= setWidth;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    const handleMouseEnter = () => isPaused = true;
    const handleMouseLeave = () => isPaused = false;
    const handleTouchStart = () => isPaused = true;
    const handleTouchEnd = () => isPaused = false;

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchend', handleTouchEnd);

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % VIBE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const insights = [
    {
      icon: <AlertTriangle size={18} />,
      title: 'Blood Sugar Up',
      level: 'HIGH',
      color: '#EF4444',
      desc: 'Glucose rose 8%. Cut evening carbs.',
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=400'
    },
    {
      icon: <CheckCircle size={18} />,
      title: 'BP is Stable',
      level: 'GOOD',
      color: '#22C55E',
      desc: 'Stable BP this week. Great progress!',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400'
    },
    {
      icon: <Pill size={18} />,
      title: 'Missed Doses',
      level: 'MED',
      color: '#F59E0B',
      desc: 'Missed 2 doses. Set 9 AM alarm.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
    },
    {
      icon: <Footprints size={18} />,
      title: 'Morning Walk',
      level: 'TIP',
      color: '#3B82F6',
      desc: '20-min walk lowers BP by 8 mmHg.',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=400'
    },
    {
      icon: <Droplets size={18} />,
      title: 'Stay Hydrated',
      level: 'TIP',
      color: '#14B8A6',
      desc: 'Drink 8 glasses of water daily.',
      image: 'https://th.bing.com/th/id/OIP.hE4B4Uoh2ilC--IAMsnnggHaEK?w=310&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
    }
  ];

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) setCurrentSlide((prev) => (prev + 1) % VIBE_IMAGES.length);
    if (touchStart - touchEnd < -50) setCurrentSlide((prev) => (prev === 0 ? VIBE_IMAGES.length - 1 : prev - 1));
  };

  const latest = healthLogs[0] || {};
  const todayMeds = medicines.slice(0, 4);
  const taken = medicines.filter((m) => m.status === 'taken').length;

  return (
    <div className="page-enter">
      <div className="page-content">
        {/* Header */}
        <div style={{ padding: '20px 20px 0', background: 'linear-gradient(180deg,rgba(59,130,246,0.08) 0%,transparent 100%)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Good Morning,</p>
              <h2 style={{ marginTop: 2 }}>{user?.name?.split(' ')[0] || 'User'}</h2>
            </div>
          </div>
          {/* Positive Vibes Auto Slider */}
          <div className="vibe-slider" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ cursor: 'grab' }}>
            {VIBE_IMAGES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Positive Vibe"
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                  opacity: i === currentSlide ? 1 : 0, transition: 'opacity 0.8s ease-in-out'
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
            <div className="actions-grid">
              {[
                { icon: <Plus size={24} />, label: 'Add Med', path: '/medicines/add', color: 'var(--green)' },
                { icon: <BarChart2 size={24} />, label: 'Reports', path: '/history', color: 'var(--blue)' },
                { icon: <ClipboardList size={24} />, label: 'Prescriptions', path: '/prescriptions', color: 'var(--purple)' },
                { icon: <Bot size={24} />, label: 'AI Coach', path: '/ai-coach', color: 'var(--indigo)' },
                { icon: <Users size={24} />, label: 'Care Team', path: '/care-network', color: 'var(--teal)' },
                { icon: <Award size={24} />, label: 'Achievements', path: '/achievements', color: 'var(--gold)' },
              ].map(({ icon, label, path, color }) => (
                <button key={path} onClick={() => navigate(path)} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                  padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  cursor: 'pointer', transition: 'var(--transition)', color
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
            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'linear-gradient(135deg,rgba(34,197,94,0.06),var(--bg-card))' }}>
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

          {/* AI Insights Ticker Section */}
          <div>
            <div className="section-label">AI Insights</div>
            <style>{`
              .insights-slider::-webkit-scrollbar { display: none; }
              .insights-slider {
                display: flex;
                gap: 16px;
                overflow-x: auto;
                padding: 10px 20px 20px;
                margin: 0 -20px;
                scrollbar-width: none;
                -ms-overflow-style: none;
                -webkit-overflow-scrolling: touch;
              }
            `}</style>
            <div
              className="insights-slider"
              ref={insightRef}
              onMouseEnter={() => { }} // We'll handle pause in useEffect
              onMouseLeave={() => { }}
            >
              {[...insights, ...insights, ...insights].map((insight, i) => (
                <div key={i} style={{
                  flex: '0 0 260px',
                  height: '180px',
                  borderRadius: 'var(--radius-lg)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 12px 20px -8px rgba(0, 0, 0, 0.3)',
                  cursor: 'grab'
                }}>
                  {/* Background Image with Overlay */}
                  <img src={insight.image} alt={insight.title} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)`,
                    zIndex: 1
                  }} />

                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 2, padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 900, color: '#fff',
                        background: insight.color, padding: '4px 10px',
                        borderRadius: 20, letterSpacing: '0.05em',
                        boxShadow: `0 4px 12px ${insight.color}40`
                      }}>
                        {insight.level}
                      </span>
                      <div style={{ color: 'rgba(255,255,255,0.8)' }}>{insight.icon}</div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>{insight.title}</h4>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4, fontWeight: 500 }}>{insight.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Metrics Section */}
          <div>
            <div className="flex justify-between items-center mb-16">
              <div className="section-label" style={{ marginBottom: 0 }}>Health Metrics</div>
              <button
                className="btn btn-blue btn-sm"
                style={{ padding: '6px 14px', borderRadius: 10 }}
                onClick={() => navigate('/health')}
              >
                Log Vitals
              </button>
            </div>

            <div className="vitals-row">
              <VitalCard
                icon={<Activity size={20} />}
                label="Blood Pressure"
                value={latest.systolic ? `${latest.systolic}/${latest.diastolic}` : '--/--'}
                unit="mmHg"
                color="var(--red)"
                status={latest.systolic > 140 ? 'High' : latest.systolic < 90 ? 'Low' : 'Normal'}
                statusColor={latest.systolic > 140 ? 'var(--red)' : latest.systolic < 90 ? 'var(--amber)' : 'var(--green)'}
                onClick={() => navigate('/health/bp')}
              />
              <VitalCard
                icon={<HeartPulse size={20} />}
                label="Blood Sugar"
                value={latest.blood_sugar || '--'}
                unit="mg/dL"
                color="var(--amber)"
                status={latest.blood_sugar > 140 ? 'High' : latest.blood_sugar < 70 ? 'Low' : 'Normal'}
                statusColor={latest.blood_sugar > 140 ? 'var(--red)' : latest.blood_sugar < 70 ? 'var(--amber)' : 'var(--green)'}
                onClick={() => navigate('/health/sugar')}
              />
            </div>
            <div className="vitals-row" style={{ marginTop: 12 }}>
              <VitalCard
                icon={<Heart size={20} />}
                label="Heart Rate"
                value={latest.heart_rate || '--'}
                unit="bpm"
                color="var(--red)"
                status={latest.heart_rate > 100 ? 'Fast' : latest.heart_rate < 60 ? 'Slow' : 'Normal'}
                statusColor={latest.heart_rate > 100 ? 'var(--red)' : latest.heart_rate < 60 ? 'var(--amber)' : 'var(--green)'}
                onClick={() => navigate('/health/heartrate')}
              />
              <VitalCard
                icon={<Wind size={20} />}
                label="SpO₂ Level"
                value={latest.spo2 || '--'}
                unit="%"
                color="var(--blue)"
                status={latest.spo2 < 95 ? 'Low' : 'Healthy'}
                statusColor={latest.spo2 < 95 ? 'var(--red)' : 'var(--green)'}
                onClick={() => navigate('/health/spo2')}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>

    </div>
  );
}
