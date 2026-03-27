import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
  );
}

export default function HealthDashboardPage() {
  const navigate = useNavigate();
  const { healthLogs, addHealthLog } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ systolic: '', diastolic: '', heart_rate: '', blood_sugar: '', spo2: '' });
  const latest = healthLogs[0] || {};

  const handleAddLog = () => {
    addHealthLog({
      systolic: +form.systolic || 128,
      diastolic: +form.diastolic || 82,
      heart_rate: +form.heart_rate || 74,
      blood_sugar: +form.blood_sugar || 118,
      spo2: +form.spo2 || 98,
    });
    setShowAdd(false);
    setForm({ systolic: '', diastolic: '', heart_rate: '', blood_sugar: '', spo2: '' });
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>Health Metrics</h2>
          <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(!showAdd)}>
            <Plus size={18} /> Log Vitals
          </button>
        </div>

        <div style={{ padding: '12px 20px 20px' }}>
          {showAdd && (
            <div className="card card-lg slide-up" style={{ marginBottom: 24, borderColor: 'var(--blue)' }}>
              <h4 style={{ marginBottom: 16 }}>📝 Log Today's Vitals</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                {[
                  ['systolic', 'Systolic BP'], ['diastolic', 'Diastolic BP'],
                  ['heart_rate', 'Heart Rate'], ['blood_sugar', 'Blood Sugar'],
                  ['spo2', 'SpO₂ %']
                ].map(([k, label]) => (
                  <div key={k} className="input-group">
                    <label className="input-label">{label}</label>
                    <input className="input" type="number" placeholder="--" value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
              </div>
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
    </div>
  );
}
