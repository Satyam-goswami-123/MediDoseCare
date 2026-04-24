import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const COLORS = ['#22C55E', '#3B82F6', '#A855F7', '#EF4444', '#F59E0B', '#14B8A6', '#6366F1', '#EC4899'];

export default function EditMedicinePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { medicines, updateMedicine } = useApp();
  
  const [form, setForm] = useState({
    name: '', dosage: '', frequency: 'daily', times: ['08:00'], instructions: '', start_date: new Date().toISOString().split('T')[0], color: '#22C55E',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const med = medicines.find(m => String(m.id) === id);
    if (med) {
      setForm({
        name: med.name || '',
        dosage: med.dosage || '',
        frequency: med.frequency || 'daily',
        times: Array.isArray(med.times) ? med.times : [med.times || '08:00'],
        instructions: med.instructions || '',
        start_date: med.start_date ? med.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
        color: med.color || '#22C55E',
      });
      setLoading(false);
    } else if (medicines.length > 0) {
      // Medicine not found after medicines loaded
      navigate('/medicines');
    }
  }, [id, medicines, navigate]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.name || !form.dosage) return alert('Please fill medicine name and dosage');
    setSaving(true);
    const success = await updateMedicine(id, form);
    if (success) {
      navigate(`/medicines/${id}`, { replace: true });
    } else {
      alert('Failed to update medicine');
      setSaving(false);
    }
  };

  const freqTimes = { daily: ['08:00'], twice_daily: ['08:00', '20:00'], thrice_daily: ['08:00', '14:00', '20:00'], weekly: ['08:00'], custom: form.times };

  if (loading) return <div className="page-enter"><div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}><h3>Loading...</h3></div></div>;

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(`/medicines/${id}`)}>←</button>
          <h2>Edit Medicine</h2>
        </div>

        <div style={{ padding: '8px 20px 20px' }}>
          <div className="input-group">
            <label className="input-label">Medicine Name *</label>
            <input className="input" placeholder="e.g. Metformin" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Dosage *</label>
            <input className="input" placeholder="e.g. 500mg, 1 tablet" value={form.dosage} onChange={(e) => set('dosage', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Frequency</label>
            <select className="input" value={form.frequency}
              onChange={(e) => { set('frequency', e.target.value); set('times', freqTimes[e.target.value] || ['08:00']); }}>
              <option value="daily">Once Daily</option>
              <option value="twice_daily">Twice Daily</option>
              <option value="thrice_daily">Thrice Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Reminder Times</label>
            {form.times.map((t, i) => (
              <input key={i} className="input" type="time" value={t} style={{ marginBottom: 8 }}
                onChange={(e) => { const ts = [...form.times]; ts[i] = e.target.value; set('times', ts); }} />
            ))}
          </div>
          <div className="input-group">
            <label className="input-label">Start Date</label>
            <input className="input" type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Special Instructions</label>
            <input className="input" placeholder="e.g. Take after meals" value={form.instructions} onChange={(e) => set('instructions', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Color Tag</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLORS.map((c) => (
                <button key={c} onClick={() => set('color', c)}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: c, border: form.color === c ? `3px solid #fff` : '3px solid transparent', cursor: 'pointer', transition: 'var(--transition)' }} />
              ))}
            </div>
          </div>

          <button className="btn btn-green btn-full" style={{ marginTop: 20 }} onClick={handleSubmit} disabled={saving}>
            {saving ? '⏳ Saving...' : 'Save Changes'}
          </button>
          <button className="btn btn-ghost btn-full" style={{ marginTop: 10 }} onClick={() => navigate(`/medicines/${id}`)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
