import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
<<<<<<< HEAD
import { Activity, Heart, Wind, Droplets, Thermometer, Weight, Calendar, Plus } from 'lucide-react';

function HealthCard({ icon, label, value, unit, color, status, onClick }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer', borderColor: `${color}20`, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="flex justify-between items-start">
        <div style={{ color, background: `${color}15`, padding: 8, borderRadius: 12 }}>{icon}</div>
        <span className={`badge ${status === 'Normal' || status === 'Optimal' || status === 'Healthy' ? 'badge-green' : 'badge-amber'}`}>{status}</span>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{value} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>{unit}</span></div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
=======


function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const w = 200, h = 60;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 10) - 5}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sparkline" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <circle cx={pts.split(' ').pop().split(',')[0]} cy={pts.split(' ').pop().split(',')[1]} r="4" fill={color} />
    </svg>
>>>>>>> 3e7d6325a401b89e1cf340e3f93175762db53863
  );
}

export default function HealthDashboardPage() {
  const navigate = useNavigate();
  const { healthLogs, addHealthLog } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ systolic: '', diastolic: '', heart_rate: '', blood_sugar: '', spo2: '' });
  const latest = healthLogs[0] || {};

<<<<<<< HEAD
  const handleAddLog = () => {
    addHealthLog({
      systolic: +form.systolic || 128,
      diastolic: +form.diastolic || 82,
      heart_rate: +form.heart_rate || 74,
      blood_sugar: +form.blood_sugar || 118,
      spo2: +form.spo2 || 98,
=======
  const vitals = [
    { type: 'bp', icon: '🩸', label: 'Blood Pressure', value: `${latest.systolic || 128}/${latest.diastolic || 82}`, unit: 'mmHg', color: 'var(--red)', data: healthLogs.map((l) => l.systolic).reverse(), normal: '< 130/85' },
    { type: 'sugar', icon: '🩺', label: 'Blood Sugar', value: latest.blood_sugar || 118, unit: 'mg/dL', color: 'var(--amber)', data: healthLogs.map((l) => l.blood_sugar).reverse(), normal: '70–140' },
    { type: 'heartrate', icon: '💓', label: 'Heart Rate', value: latest.heart_rate || 74, unit: 'bpm', color: 'var(--red-light)', data: healthLogs.map((l) => l.heart_rate).reverse(), normal: '60–100' },
    { type: 'spo2', icon: '🫁', label: 'SpO₂', value: latest.spo2 || 98, unit: '%', color: 'var(--blue)', data: healthLogs.map((l) => l.spo2).reverse(), normal: '> 95%' },
  ];

  const handleAddLog = () => {
    addHealthLog({
      systolic: +form.systolic || 128, diastolic: +form.diastolic || 82,
      heart_rate: +form.heart_rate || 74, blood_sugar: +form.blood_sugar || 118, spo2: +form.spo2 || 98,
>>>>>>> 3e7d6325a401b89e1cf340e3f93175762db53863
    });
    setShowAdd(false);
    setForm({ systolic: '', diastolic: '', heart_rate: '', blood_sugar: '', spo2: '' });
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
<<<<<<< HEAD
          <h2>Health Metrics</h2>
          <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(!showAdd)}>
            <Plus size={18} /> Log Vitals
          </button>
=======
          <h2>Health Monitor</h2>
          <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(!showAdd)}>+ Log</button>
>>>>>>> 3e7d6325a401b89e1cf340e3f93175762db53863
        </div>

        <div style={{ padding: '12px 20px 20px' }}>
          {showAdd && (
<<<<<<< HEAD
            <div className="card card-lg slide-up" style={{ marginBottom: 24, borderColor: 'var(--blue)' }}>
              <h4 style={{ marginBottom: 16 }}>📝 Log Today's Vitals</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                {[
                  ['systolic', 'Systolic BP'], ['diastolic', 'Diastolic BP'],
                  ['heart_rate', 'Heart Rate'], ['blood_sugar', 'Blood Sugar'],
                  ['spo2', 'SpO₂ %']
                ].map(([k, label]) => (
                  <div key={k} className="input-group">
=======
            <div className="card card-lg slide-up" style={{ marginBottom: 20, borderColor: 'rgba(59,130,246,0.25)' }}>
              <h4 style={{ marginBottom: 16 }}>📝 Log Today's Vitals</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[['systolic', 'BP Systolic'], ['diastolic', 'BP Diastolic'], ['heart_rate', 'Heart Rate'], ['blood_sugar', 'Blood Sugar'], ['spo2', 'SpO₂ %']].map(([k, label]) => (
                  <div key={k}>
>>>>>>> 3e7d6325a401b89e1cf340e3f93175762db53863
                    <label className="input-label">{label}</label>
                    <input className="input" type="number" placeholder="--" value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
              </div>
<<<<<<< HEAD
              <button className="btn btn-primary btn-full" style={{ marginTop: 12 }} onClick={handleAddLog}>Save Records</button>
            </div>
          )}

          <div className="vitals-row">
            <HealthCard icon={<Activity size={20} />} label="Blood Pressure" value={`${latest.systolic || 128}/${latest.diastolic || 82}`} unit="mmHg" color="var(--red)" status="Normal" onClick={() => navigate('/health/bp')} />
            <HealthCard icon={<Droplets size={20} />} label="Blood Sugar" value={latest.blood_sugar || 118} unit="mg/dL" color="var(--amber)" status="Optimal" onClick={() => navigate('/health/sugar')} />
            <HealthCard icon={<Heart size={20} />} label="Heart Rate" value={latest.heart_rate || 74} unit="bpm" color="var(--red)" status="Normal" onClick={() => navigate('/health/heartrate')} />
            <HealthCard icon={<Wind size={20} />} label="SpO₂ Level" value={latest.spo2 || 98} unit="%" color="var(--blue)" status="Healthy" onClick={() => navigate('/health/spo2')} />
          </div>

          <div style={{ marginTop: 32 }}>
            <div className="section-label">Additional Statistics</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}>
                <div style={{ background: 'var(--purple-dim)', padding: 10, borderRadius: 12 }}><Weight size={24} color="var(--purple)" /></div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Body Weight</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{latest.weight || 68} <small>kg</small></div>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}>
                <div style={{ background: 'var(--amber-dim)', padding: 10, borderRadius: 12 }}><Thermometer size={24} color="var(--amber)" /></div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Temperature</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>98.6 <small>°F</small></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 32, background: 'linear-gradient(135deg,rgba(59,130,246,0.1),var(--bg-card))', borderColor: 'rgba(59,130,246,0.2)', padding: 24 }}>
            <div className="flex items-center gap-16">
              <Calendar size={40} color="var(--blue)" />
              <div>
                <h3 style={{ color: 'var(--blue-light)' }}>Health Insights</h3>
                <p style={{ marginTop: 4 }}>Your wellness data indicates stable patterns. Keep maintaining your medication schedule!</p>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 20 }}>View Detailed Reports</button>
          </div>
        </div>
      </div>
=======
              <button className="btn btn-primary btn-full" style={{ marginTop: 12 }} onClick={handleAddLog}>Save Log</button>
            </div>
          )}

          {vitals.map(({ type, icon, label, value, unit, color, data, normal }) => (
            <div key={type} className="card" onClick={() => navigate(`/health/${type}`)}
              style={{ marginBottom: 12, cursor: 'pointer', borderColor: `${color}30`, transition: 'var(--transition)' }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-12">
                  <span style={{ fontSize: 28 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1.2 }}>{value} <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>{unit}</span></div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Normal: {normal}</div>
                  </div>
                </div>
                <div style={{ width: 80 }}>
                  <Sparkline data={data} color={color} />
                </div>
              </div>
            </div>
          ))}

          <div className="card" style={{ marginTop: 8, borderColor: 'rgba(99,102,241,0.25)' }} onClick={() => navigate('/ai-coach')}>
            <div className="flex items-center gap-12">
              <span style={{ fontSize: 28 }}>🤖</span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--indigo)' }}>AI Health Coach</div>
                <p style={{ fontSize: 13, margin: 0 }}>Get personalized insights based on your readings</p>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
            </div>
          </div>
        </div>
      </div>

>>>>>>> 3e7d6325a401b89e1cf340e3f93175762db53863
    </div>
  );
}
