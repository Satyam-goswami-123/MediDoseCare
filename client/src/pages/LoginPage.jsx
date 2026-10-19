import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authApi } from '../api';
import { auth, googleProvider } from '../firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
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
  return err?.error || err?.message || 'Something went wrong. Please try again.';
};

const saveSignupProfile = ({ uid, firstName, lastName, email }) => {
  if (!uid) return;
  const fullName = `${firstName} ${lastName}`.trim();
  const normalizedEmail = (email || '').trim().toLowerCase();

  let profiles = {};
  try {
    profiles = JSON.parse(localStorage.getItem('mdc_user_profiles') || '{}');
  } catch {
    profiles = {};
  }

  profiles[uid] = {
    name: fullName || 'User',
    email: normalizedEmail || null,
  };
  localStorage.setItem('mdc_user_profiles', JSON.stringify(profiles));
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // If RequireAuth redirected the user here, send them back after login
  const from = location.state?.from?.pathname || null;
  const getRedirectPath = (role) => from || (role === 'doctor' ? '/doctor/dashboard' : '/home');
  const { login } = useApp();
  const [mode, setMode] = useState('choice'); // choice, email, phone, signup
  const [userRole, setUserRole] = useState('patient'); // patient, doctor
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpEmailSent, setOtpEmailSent] = useState(false);
  const [otpEmailCode, setOtpEmailCode] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Firebase uses 6 digits
  const [step, setStep] = useState('input'); // input, verify
  const [confirmationResult, setConfirmationResult] = useState(null);

  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const response = await authApi.socialLogin({
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        uid: userCredential.user.uid,
        role: userRole
      });
      login(response.user, response.token);
      navigate(getRedirectPath(userRole));
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
    setSuccess('');
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, normalizedPassword);
        await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}`.trim() });

        // Also call our backend to save the user with role and doctor info
        await authApi.signup({
          uid: userCredential.user.uid,
          email: normalizedEmail,
          name: `${firstName} ${lastName}`.trim(),
          phone: contactNumber,
          role: userRole,
          specialization: userRole === 'doctor' ? specialization : null,
          hospitalName: userRole === 'doctor' ? hospitalName : null
        });

        localStorage.setItem('mdc_signup_phone', `${DEFAULT_COUNTRY_CODE}${contactNumber}`);
        saveSignupProfile({ uid: userCredential.user.uid, firstName, lastName, email: normalizedEmail });
        await signOut(auth);
        setMode('email');
        setPassword('');
        setSuccess('Registration successful. Please login with Email/Password.');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, normalizedPassword);
        // After firebase login, we check the role from our backend or localStorage
        // For now, let's assume login() updates the context which we'll use for routing
        // In a real app, you'd fetch the user profile here

        const response = await authApi.socialLogin({
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          uid: userCredential.user.uid,
          role: userRole
        });

        login(response.user, response.token);
        navigate(getRedirectPath(userRole));
      }
    } catch (err) {
      setError(toFirebaseMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOtpSend = async () => {
    const normalizedEmail = otpEmail.trim().toLowerCase();
    if (!normalizedEmail) return setError('Please enter your email address');
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authApi.sendEmailOtp(normalizedEmail);
      setOtpEmailSent(true);
      setOtpEmailCode('');
      setSuccess('A 6-digit OTP has been sent to your email.');
    } catch (err) {
      setOtpEmailSent(false);
      setError(toFirebaseMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOtpVerify = async () => {
    const normalizedEmail = otpEmail.trim().toLowerCase();
    const normalizedOtp = otpEmailCode.trim();
    if (!normalizedEmail) return setError('Please enter your email address');
    if (!/^\d{6}$/.test(normalizedOtp)) return setError('Enter a valid 6-digit OTP');

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await authApi.verifyEmailOtp(normalizedEmail, normalizedOtp);
      if (!response?.token || !response?.user) {
        throw new Error('Login failed. Please try again.');
      }

      localStorage.setItem('mdc_custom_auth', JSON.stringify({
        token: response.token,
        user: response.user,
      }));
      login(response.user, response.token);
      navigate(getRedirectPath(response.user.role));
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
      const userCredential = await confirmationResult.confirm(code);
      const response = await authApi.socialLogin({
        email: userCredential.user.email || `${phone}@medidose.care`,
        name: userCredential.user.displayName || `User ${phone}`,
        uid: userCredential.user.uid,
        role: userRole
      });
      login(response.user, response.token);
      navigate(getRedirectPath(userRole));
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
    <div style={{
      minHeight: '100%',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div id="recaptcha-container" />

      {/* ── Animated background blobs ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          top: -80, left: -80, animation: 'pulse 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          bottom: 60, right: -60, animation: 'pulse 5s ease-in-out infinite 1s',
        }} />
        <div style={{
          position: 'absolute', width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
          top: '45%', left: '50%', transform: 'translate(-50%,-50%)',
          animation: 'pulse 6s ease-in-out infinite 0.5s',
        }} />
      </div>

      {/* ── Back to home button ── */}
      {mode !== 'choice' && (
        <button
          onClick={() => { setMode('choice'); setError(''); setSuccess(''); setOtpEmailSent(false); setStep('input'); }}
          style={{
            position: 'absolute', top: 16, left: 16, zIndex: 10,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: '8px 14px', color: 'var(--text-secondary)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
            backdropFilter: 'blur(8px)',
          }}
        >
          <ChevronLeft size={15} /> Back
        </button>
      )}
      {mode === 'choice' && (
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 16, left: 16, zIndex: 10,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: '8px 14px', color: 'var(--text-secondary)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
            backdropFilter: 'blur(8px)',
          }}
        >
          <ChevronLeft size={15} /> Home
        </button>
      )}

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 24px 32px', position: 'relative', zIndex: 1 }}>

        {/* Logo + title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
            animation: 'float 3s ease-in-out infinite',
          }}>💊</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>
            {mode === 'choice' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : mode === 'email' ? 'Sign In' : mode === 'emailOtp' ? 'OTP Login' : 'Phone Login'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>
            {mode === 'choice' ? 'Your health companion, always with you' : mode === 'signup' ? 'Join thousands of healthier seniors' : 'Secure & private authentication'}
          </p>
        </div>

        {/* Error / Success banners */}
        {error && (
          <div style={{
            marginBottom: 16, padding: '12px 16px', borderRadius: 14,
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#F87171', fontSize: 13, fontWeight: 500, display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div style={{
            marginBottom: 16, padding: '12px 16px', borderRadius: 14,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
            color: '#4ADE80', fontSize: 13, fontWeight: 500, display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <span>✅</span> {success}
          </div>
        )}

        {/* ════ CHOICE MODE ════ */}
        {mode === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Role Selector */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 18, padding: 6, display: 'flex', gap: 6, marginBottom: 4,
              backdropFilter: 'blur(10px)',
            }}>
              {[
                { role: 'patient', label: 'Patient', emoji: '🧑' },
                { role: 'doctor', label: 'Doctor', emoji: '👨‍⚕️' },
              ].map(({ role, label, emoji }) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  style={{
                    flex: 1, padding: '12px 8px', borderRadius: 14, border: 'none',
                    background: userRole === role
                      ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)'
                      : 'transparent',
                    color: userRole === role ? '#fff' : 'var(--text-muted)',
                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all 0.25s ease',
                    boxShadow: userRole === role ? '0 4px 16px rgba(59,130,246,0.35)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%', padding: '15px 20px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.95)', color: '#1a1a1a',
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Connecting…' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Email Login */}
            <button
              onClick={() => setMode('email')}
              style={{
                width: '100%', padding: '15px 20px', borderRadius: 16,
                border: '1px solid rgba(59,130,246,0.4)',
                background: 'rgba(59,130,246,0.1)',
                color: '#60A5FA', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Mail size={20} /> Login with Email & Password
            </button>

            {/* Sign up link */}
            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              New to MediDose?{' '}
              <button
                onClick={() => setMode('signup')}
                style={{ background: 'none', border: 'none', color: '#818CF8', fontWeight: 700, cursor: 'pointer', fontSize: 14, padding: 0 }}
              >
                Create Account →
              </button>
            </p>
          </div>
        )}

        {/* ════ EMAIL / SIGNUP MODE ════ */}
        {(mode === 'email' || mode === 'signup') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Role selector (compact) */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, padding: 4, display: 'flex', gap: 4,
            }}>
              {[{ role: 'patient', label: '🧑 Patient' }, { role: 'doctor', label: '👨‍⚕️ Doctor' }].map(({ role, label }) => (
                <button key={role} onClick={() => setUserRole(role)} style={{
                  flex: 1, padding: '9px 8px', borderRadius: 11, border: 'none',
                  background: userRole === role ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)' : 'transparent',
                  color: userRole === role ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                }}>{label}</button>
              ))}
            </div>

            {/* Signup-only fields */}
            {mode === 'signup' && (
              <>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { label: 'First Name', val: firstName, set: setFirstName, ph: 'Rajan' },
                    { label: 'Last Name', val: lastName, set: setLastName, ph: 'Sharma' },
                  ].map(({ label, val, set, ph }) => (
                    <div key={label} style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>{label}</label>
                      <input className="input" type="text" placeholder={ph} value={val} onChange={e => set(e.target.value)} style={{ borderRadius: 12 }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Phone Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div className="input" style={{ width: 56, textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 12, flexShrink: 0 }}>{DEFAULT_COUNTRY_CODE}</div>
                    <input className="input" type="tel" maxLength={DEFAULT_PHONE_DIGITS} placeholder="9876543210" value={contactNumber} onChange={e => setContactNumber(e.target.value.replace(/\D/g, ''))} style={{ borderRadius: 12 }} />
                  </div>
                </div>
                {userRole === 'doctor' && (
                  <>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Specialization</label>
                      <input className="input" type="text" placeholder="e.g. Cardiologist" value={specialization} onChange={e => setSpecialization(e.target.value)} style={{ borderRadius: 12 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Hospital / Clinic</label>
                      <input className="input" type="text" placeholder="e.g. Apollo Hospitals" value={hospitalName} onChange={e => setHospitalName(e.target.value)} style={{ borderRadius: 12 }} />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Email Address</label>
              <input className="input" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} style={{ borderRadius: 12 }} />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ borderRadius: 12 }} />
                <button onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0,
                }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={() => handleEmailAction(mode === 'signup')}
              disabled={loading}
              style={{
                width: '100%', padding: '15px', borderRadius: 16, border: 'none', marginTop: 4,
                background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                color: '#fff', fontWeight: 800, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 24px rgba(59,130,246,0.4)',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              {loading ? (
                <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Processing…</>
              ) : mode === 'signup' ? '🚀 Create Account' : '🔐 Sign In Securely'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
              {mode === 'signup' ? 'Already have an account? ' : 'New here? '}
              <button onClick={() => { setMode(mode === 'signup' ? 'email' : 'signup'); setError(''); setSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#818CF8', fontWeight: 700, cursor: 'pointer', fontSize: 13, padding: 0 }}>
                {mode === 'signup' ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        )}

        {/* ════ EMAIL OTP MODE ════ */}
        {mode === 'emailOtp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Your Email</label>
              <input className="input" type="email" placeholder="name@example.com" value={otpEmail} onChange={e => setOtpEmail(e.target.value)} style={{ borderRadius: 12 }} />
            </div>
            <button onClick={handleEmailOtpSend} disabled={loading} style={{
              width: '100%', padding: '15px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
              color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(59,130,246,0.35)',
            }}>
              {loading ? 'Sending…' : '📧 Send OTP to Email'}
            </button>
            {otpEmailSent && (
              <>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Enter 6-digit OTP</label>
                  <input className="input" type="tel" maxLength={6} placeholder="••••••" value={otpEmailCode}
                    onChange={e => setOtpEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))} style={{ borderRadius: 12, fontSize: 22, letterSpacing: 8, textAlign: 'center' }} />
                </div>
                <button onClick={handleEmailOtpVerify} disabled={loading} style={{
                  width: '100%', padding: '15px', borderRadius: 16, border: 'none',
                  background: 'linear-gradient(135deg,#22C55E,#16A34A)',
                  color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(34,197,94,0.35)',
                }}>
                  {loading ? 'Verifying…' : '✅ Verify & Login'}
                </button>
              </>
            )}
          </div>
        )}

        {/* ════ PHONE MODE ════ */}
        {mode === 'phone' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {step === 'input' ? (
              <>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Mobile Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div className="input" style={{ width: 56, textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 12, flexShrink: 0 }}>{DEFAULT_COUNTRY_CODE}</div>
                    <input className="input" type="tel" maxLength={DEFAULT_PHONE_DIGITS} placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} style={{ borderRadius: 12 }} />
                  </div>
                </div>
                <button onClick={handlePhoneSubmit} disabled={loading} style={{
                  width: '100%', padding: '15px', borderRadius: 16, border: 'none',
                  background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                  color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(59,130,246,0.35)',
                }}>
                  {loading ? 'Sending…' : '📲 Send OTP'}
                </button>
              </>
            ) : (
              <>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  Code sent to <strong style={{ color: 'var(--text-primary)' }}>{DEFAULT_COUNTRY_CODE} {phone}</strong>
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  {otp.map((d, i) => (
                    <input
                      key={i} ref={otpRefs[i]}
                      type="tel" maxLength={1} value={d}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => e.key === 'Backspace' && !otp[i] && i > 0 && otpRefs[i - 1].current.focus()}
                      style={{
                        width: 44, height: 54, borderRadius: 14, border: '2px solid rgba(59,130,246,0.35)',
                        background: 'rgba(59,130,246,0.08)', color: 'var(--text-primary)',
                        fontSize: 22, fontWeight: 800, textAlign: 'center', outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                    />
                  ))}
                </div>
                <button onClick={verifyOtp} disabled={loading} style={{
                  width: '100%', padding: '15px', borderRadius: 16, border: 'none',
                  background: 'linear-gradient(135deg,#22C55E,#16A34A)',
                  color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(34,197,94,0.35)',
                }}>
                  {loading ? 'Verifying…' : '✅ Verify & Continue'}
                </button>
                <button onClick={() => setStep('input')} style={{
                  background: 'none', border: 'none', color: 'var(--text-muted)',
                  fontSize: 13, cursor: 'pointer', textDecoration: 'underline',
                }}>
                  Change number
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', padding: '0 24px 28px', position: 'relative', zIndex: 1 }}>
        🔒 Secured by Firebase Auth &nbsp;·&nbsp;
        <span style={{ color: 'var(--blue)', cursor: 'pointer' }}>Privacy Policy</span>
      </p>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

