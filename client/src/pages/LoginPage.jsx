import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const sendOtp = () => {
    if (phone.length < 10) return alert('Enter a valid 10-digit phone number');
    setLoading(true);
    // Demo mode: auto-generate OTP
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setTimeout(() => {
      setDevOtp(generated);
      setStep('otp');
      setLoading(false);
    }, 800);
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered.length < 4) return alert('Enter the 4-digit OTP');
    setLoading(true);
    setTimeout(() => {
      // Demo: accept any OTP
      const demoUser = { id: 1, name: name || 'Ramesh Kumar', phone, role: 'patient', age: 72, blood_group: 'B+', emergency_contact: '9876543211' };
      login(demoUser, 'demo_token_' + Date.now());
      navigate('/home');
    }, 800);
  };

  const handleOtpChange = (val, idx) => {
    const updated = [...otp];
    updated[idx] = val.slice(-1);
    setOtp(updated);
    if (val && idx < 3) refs[idx + 1].current?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs[idx - 1].current?.focus();
  };

  return (
    <div className="page-enter" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: 24, background: 'var(--bg-primary)', justifyContent: 'center', gap: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>💊</div>
        <h2>Welcome Back</h2>
        <p style={{ marginTop: 8 }}>Sign in to manage your health</p>
      </div>

      {step === 'phone' ? (
        <div className="slide-up">
          <div className="input-group">
            <label className="input-label">Your Name</label>
            <input className="input" placeholder="Ramesh Kumar" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Mobile Number</label>
            <input className="input" type="tel" maxLength={10} placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))} />
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={sendOtp} disabled={loading}>
            {loading ? '⏳ Sending...' : '📱 Send OTP'}
          </button>
        </div>
      ) : (
        <div className="slide-up">
          <p style={{ textAlign: 'center', marginBottom: 24 }}>Enter the OTP sent to <strong style={{ color: 'var(--blue-light)' }}>+91 {phone}</strong></p>
          {devOtp && (
            <div className="card" style={{ marginBottom: 16, textAlign: 'center', borderColor: 'rgba(245,158,11,0.3)', background: 'var(--amber-dim)' }}>
              <small style={{ color: 'var(--amber)' }}>🔐 Demo OTP: <strong style={{ fontSize: 18, color: 'var(--amber)' }}>{devOtp}</strong></small>
            </div>
          )}
          <div className="otp-row" style={{ marginBottom: 24 }}>
            {otp.map((digit, i) => (
              <input key={i} ref={refs[i]} className="otp-box" type="tel" maxLength={1} value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleOtpKey(e, i)} />
            ))}
          </div>
          <button className="btn btn-primary btn-full" onClick={verifyOtp} disabled={loading}>
            {loading ? '⏳ Verifying...' : '✅ Verify & Login'}
          </button>
          <button className="btn btn-ghost btn-full" style={{ marginTop: 12 }} onClick={() => setStep('phone')}>← Change Number</button>
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: 13 }}>By continuing, you agree to our <span style={{ color: 'var(--blue)' }}>Terms</span> & <span style={{ color: 'var(--blue)' }}>Privacy Policy</span></p>
    </div>
  );
}
