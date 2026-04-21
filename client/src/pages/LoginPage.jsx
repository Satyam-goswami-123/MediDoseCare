import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPhoneNumber, 
  RecaptchaVerifier 
} from 'firebase/auth';
import { Mail, Phone, Chrome, ChevronLeft, Eye, EyeOff } from 'lucide-react';

const DEFAULT_COUNTRY_CODE = '+91';
const DEFAULT_PHONE_DIGITS = 10;
const MIN_PASSWORD_LENGTH = 6;

const toFirebaseMessage = (err) => {
  const code = err?.code;
  if (code === 'auth/invalid-credential') return 'Invalid email or password. Please check your credentials and try again.';
  if (code === 'auth/user-not-found') return 'No account found with this email.';
  if (code === 'auth/wrong-password') return 'Incorrect password. Please try again.';
  if (code === 'auth/email-already-in-use') return 'This email is already registered. Please sign in instead.';
  if (code === 'auth/weak-password') return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
  return err?.message || 'Something went wrong. Please try again.';
};

const saveSignupProfile = ({ uid, firstName, lastName, email, contactNumber }) => {
  if (!uid) return;
  const fullName = `${firstName} ${lastName}`.trim();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const phone = `${DEFAULT_COUNTRY_CODE}${contactNumber}`;

  let profiles = {};
  try {
    profiles = JSON.parse(localStorage.getItem('mdc_user_profiles') || '{}');
  } catch {
    profiles = {};
  }

  profiles[uid] = {
    name: fullName || 'User',
    email: normalizedEmail || null,
    phone
  };
  localStorage.setItem('mdc_user_profiles', JSON.stringify(profiles));
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('choice'); // choice, email, phone, signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Firebase uses 6 digits
  const [step, setStep] = useState('input'); // input, verify
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Email Login/Signup
  const handleEmailAction = async (isSignup) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password;

    if (isSignup) {
      if (!firstName || !lastName || !contactNumber || !normalizedEmail || !normalizedPassword) return setError('Please fill all fields');
      if (!new RegExp(`^\\d{${DEFAULT_PHONE_DIGITS}}$`).test(contactNumber)) return setError('Contact number must be exactly 10 digits');
      if (normalizedPassword.length < MIN_PASSWORD_LENGTH) return setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    } else if (!normalizedEmail || !normalizedPassword) {
      return setError('Please fill all fields');
    }

    setLoading(true);
    setError('');
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, normalizedPassword);
        await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}`.trim() });
        localStorage.setItem('mdc_signup_phone', `${DEFAULT_COUNTRY_CODE}${contactNumber}`);
        saveSignupProfile({ uid: userCredential.user.uid, firstName, lastName, email: normalizedEmail, contactNumber });
      } else {
        await signInWithEmailAndPassword(auth, normalizedEmail, normalizedPassword);
      }
      navigate('/home');
    } catch (err) {
      setError(toFirebaseMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Phone Login
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const handlePhoneSubmit = async () => {
    if (phone.length < DEFAULT_PHONE_DIGITS) return setError('Invalid phone number');
    setLoading(true);
    setError('');
    try {
      setupRecaptcha();
      const phoneNumber = `${DEFAULT_COUNTRY_CODE}${phone}`; // Default to India, adjust as needed
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep('verify');
    } catch (err) {
      setError(err.message);
      if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) return setError('Enter 6-digit OTP');
    setLoading(true);
    setError('');
    try {
      await confirmationResult.confirm(code);
      navigate('/home');
    } catch (err) {
      setError('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    const updated = [...otp];
    updated[idx] = val.slice(-1);
    setOtp(updated);
    if (val && idx < 5) otpRefs[idx + 1].current?.focus();
  };

  return (
    <div className="page-enter" style={{ padding: 24, justifyContent: 'center' }}>
      <div id="recaptcha-container"></div>
      
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>💊</div>
        <h2 style={{ fontSize: 28, fontWeight: 800 }}>MediDose Care</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Your health companion on every step</p>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--red)', background: 'var(--red-dim)', color: 'var(--red)', fontSize: 13, padding: 12 }}>
          {error}
        </div>
      )}

      <div className="slide-up">
        {mode === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button className="btn btn-primary btn-full" onClick={handleGoogleLogin} disabled={loading} style={{ background: '#fff', color: '#111', gap: 12 }}>
              <Chrome size={20} /> Continue with Google
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => setMode('phone')} style={{ gap: 12 }}>
              <Phone size={20} /> Login with Phone
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => setMode('email')} style={{ gap: 12 }}>
              <Mail size={20} /> Login with Email
            </button>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>New here? </span>
              <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, cursor: 'pointer' }}>Create Account</button>
            </div>
          </div>
        )}

        {(mode === 'email' || mode === 'signup') && (
          <div>
            <button className="btn-back" onClick={() => { setMode('choice'); setError(''); }} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--text-muted)', marginBottom: 24, cursor: 'pointer' }}>
              <ChevronLeft size={16} /> Back
            </button>
            <h3 style={{ marginBottom: 20 }}>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h3>
            {mode === 'signup' && (
              <>
                <div className="input-group">
                  <label className="input-label">First Name</label>
                  <input className="input" type="text" placeholder="Enter first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Last Name</label>
                  <input className="input" type="text" placeholder="Enter last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Contact Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div className="input" style={{ width: 60, textAlign: 'center', background: 'var(--bg-secondary)' }}>{DEFAULT_COUNTRY_CODE}</div>
                    <input className="input" type="tel" maxLength={DEFAULT_PHONE_DIGITS} placeholder="9876543210" value={contactNumber} onChange={e => setContactNumber(e.target.value.replace(/\D/g, ''))} />
                  </div>
                </div>
              </>
            )}
            <div className="input-group">
              <label className="input-label">{mode === 'signup' ? 'Mail ID' : 'Email Address'}</label>
              <input className="input" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={() => handleEmailAction(mode === 'signup')} disabled={loading}>
              {loading ? 'Processing...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        )}

        {mode === 'phone' && (
          <div>
            <button className="btn-back" onClick={() => { setMode('choice'); setStep('input'); setError(''); }} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--text-muted)', marginBottom: 24, cursor: 'pointer' }}>
              <ChevronLeft size={16} /> Back
            </button>
            <h3 style={{ marginBottom: 20 }}>Login with Phone</h3>
            
            {step === 'input' ? (
              <>
                <div className="input-group">
                  <label className="input-label">Mobile Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div className="input" style={{ width: 60, textAlign: 'center', background: 'var(--bg-secondary)' }}>{DEFAULT_COUNTRY_CODE}</div>
                    <input className="input" type="tel" maxLength={DEFAULT_PHONE_DIGITS} placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
                  </div>
                </div>
                <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={handlePhoneSubmit} disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 24 }}>Enter verification code sent to {DEFAULT_COUNTRY_CODE} {phone}</p>
                <div className="otp-row" style={{ marginBottom: 24, justifyContent: 'center' }}>
                  {otp.map((d, i) => (
                    <input key={i} ref={otpRefs[i]} className="otp-box" style={{ width: 44, height: 50, fontSize: 20 }} type="tel" maxLength={1} value={d}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => e.key === 'Backspace' && !otp[i] && i > 0 && otpRefs[i-1].current.focus()} />
                  ))}
                </div>
                <button className="btn btn-primary btn-full" onClick={verifyOtp} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                <button className="btn btn-ghost btn-full" style={{ marginTop: 12 }} onClick={() => setStep('input')}>Change Number</button>
              </>
            )}
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 40 }}>
        Protected by Firebase. <span style={{ color: 'var(--blue)' }}>Privacy Policy</span>
      </p>
    </div>
  );
}
