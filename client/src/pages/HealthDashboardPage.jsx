import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';


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
  );
}

export default function HealthDashboardPage() {
  const navigate = useNavigate();
  const { healthLogs, addHealthLog } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ systolic: '', diastolic: '', heart_rate: '', blood_sugar: '', spo2: '' });
  const latest = healthLogs[0] || {};

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
    });
    setShowAdd(false);
    setForm({ systolic: '', diastolic: '', heart_rate: '', blood_sugar: '', spo2: '' });
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>Health Monitor</h2>
          <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(!showAdd)}>+ Log</button>
        </div>

        <div style={{ padding: '12px 20px 20px' }}>
          {showAdd && (
            <div className="card card-lg slide-up" style={{ marginBottom: 20, borderColor: 'rgba(59,130,246,0.25)' }}>
              <h4 style={{ marginBottom: 16 }}>📝 Log Today's Vitals</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[['systolic', 'BP Systolic'], ['diastolic', 'BP Diastolic'], ['heart_rate', 'Heart Rate'], ['blood_sugar', 'Blood Sugar'], ['spo2', 'SpO₂ %']].map(([k, label]) => (
                  <div key={k}>
                    <label className="input-label">{label}</label>
                    <input className="input" type="number" placeholder="--" value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
              </div>
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

    </div>
  );
}
