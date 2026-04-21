import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Pill, Flame, Trophy, AlertTriangle, ClipboardList, Zap } from 'lucide-react';

const AppContext = createContext(null);

// Demo data for offline/demo mode
const DEMO_MEDICINES = [
  { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'twice_daily', times: ['08:00', '20:00'], color: '#22C55E', status: 'upcoming' },
  { id: 2, name: 'Amlodipine', dosage: '5mg', frequency: 'daily', times: ['09:00'], color: '#3B82F6', status: 'taken' },
  { id: 3, name: 'Atorvastatin', dosage: '10mg', frequency: 'daily', times: ['21:00'], color: '#A855F7', status: 'upcoming' },
];
const DEMO_HEALTH = [
  { id: 1, systolic: 128, diastolic: 82, heart_rate: 74, blood_sugar: 118.5, spo2: 98, recorded_at: new Date().toISOString() },
  { id: 2, systolic: 132, diastolic: 85, heart_rate: 78, blood_sugar: 125.0, spo2: 97, recorded_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, systolic: 125, diastolic: 80, heart_rate: 72, blood_sugar: 112.0, spo2: 99, recorded_at: new Date(Date.now() - 172800000).toISOString() },
];
const DEMO_PRESCRIPTIONS = [
  { id: 1, doctor_name: 'Dr. Priya Sharma', hospital: 'Apollo Hospitals', prescribed_date: '2024-03-10', diagnosis: 'Type 2 Diabetes', notes: 'Continue Metformin. Review after 3 months.' },
  { id: 2, doctor_name: 'Dr. Arjun Mehta', hospital: 'Fortis Healthcare', prescribed_date: '2024-02-20', diagnosis: 'Hypertension', notes: 'Monitor BP daily. Reduce salt intake.' },
];
const DEMO_NOTIFICATIONS = [
  { id: 1, title: 'Medicine Reminder', message: 'Time to take Metformin 500mg', type: 'reminder', is_read: 0, created_at: new Date().toISOString() },
  { id: 2, title: 'Missed Dose Alert', message: 'You missed Amlodipine at 9:00 AM', type: 'alert', is_read: 0, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, title: 'Great Job! 🎉', message: '5-day streak maintained! Keep it up!', type: 'info', is_read: 1, created_at: new Date(Date.now() - 7200000).toISOString() },
];
const DEMO_USER = { id: 1, name: 'Ramesh Kumar', phone: '9876543210', age: 72, blood_group: 'B+', emergency_contact: '9876543211', role: 'patient' };

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('mdc_token'));
  const [medicines, setMedicines] = useState(DEMO_MEDICINES);
  const [healthLogs, setHealthLogs] = useState(DEMO_HEALTH);
  const [prescriptions, setPrescriptions] = useState(DEMO_PRESCRIPTIONS);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [streak, setStreak] = useState(5);
  const [achievements, setAchievements] = useState([
    { id: 1, name: 'First Dose', icon: <Pill size={36} />, earned: true },
    { id: 2, name: '7-Day Streak', icon: <Flame size={36} />, earned: true },
    { id: 3, name: 'Health Hero', icon: <Trophy size={36} />, earned: false },
    { id: 4, name: 'SOS Ready', icon: <AlertTriangle size={36} />, earned: true },
    { id: 5, name: 'Rx Master', icon: <ClipboardList size={36} />, earned: false },
    { id: 6, name: '30-Day Warrior', icon: <Zap size={36} />, earned: false },
  ]);

  const [theme, setTheme] = useState(localStorage.getItem('mdc_theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [theme]);

  // Firebase Auth Listener
  useEffect(() => {
    const getStoredProfiles = () => {
      try {
        return JSON.parse(localStorage.getItem('mdc_user_profiles') || '{}');
      } catch {
        return {};
      }
    };

    const upsertStoredProfile = (uid, profile) => {
      if (!uid) return;
      const profiles = getStoredProfiles();
      profiles[uid] = { ...(profiles[uid] || {}), ...profile };
      localStorage.setItem('mdc_user_profiles', JSON.stringify(profiles));
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        const storedFallbackPhone = localStorage.getItem('mdc_signup_phone');
        const fallbackPhone = /^\+91\d{10}$/.test(storedFallbackPhone || '') ? storedFallbackPhone : null;
        const storedProfile = getStoredProfiles()[firebaseUser.uid] || {};
        const name = firebaseUser.displayName || storedProfile.name || 'User';
        const email = firebaseUser.email || storedProfile.email || null;
        const phone = firebaseUser.phoneNumber || storedProfile.phone || fallbackPhone || null;
        const age = storedProfile.age ?? null;
        const blood_group = storedProfile.blood_group ?? null;
        const emergency_contact = null;

        upsertStoredProfile(firebaseUser.uid, { name, email, age, blood_group });

        setUser({
          id: firebaseUser.uid,
          name,
          email,
          phone,
          age,
          blood_group,
          emergency_contact,
          photo: firebaseUser.photoURL,
          role: 'patient'
        });
        if (firebaseUser.phoneNumber && fallbackPhone) {
          localStorage.removeItem('mdc_signup_phone');
        }
        setToken(idToken);
        localStorage.setItem('mdc_token', idToken);
        localStorage.removeItem('mdc_custom_auth');
      } else {
        let customAuth = null;
        try {
          customAuth = JSON.parse(localStorage.getItem('mdc_custom_auth') || 'null');
        } catch {
          customAuth = null;
        }

        if (customAuth?.token && customAuth?.user) {
          setUser(customAuth.user);
          setToken(customAuth.token);
          localStorage.setItem('mdc_token', customAuth.token);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('mdc_token');
          localStorage.removeItem('mdc_signup_phone');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData, userToken) => {
    // This is now primarily handled by onAuthStateChanged
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('mdc_token', userToken);
  };

  const logout = async () => {
    try {
      localStorage.removeItem('mdc_custom_auth');
      if (auth.currentUser) {
        await signOut(auth);
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('mdc_token');
        localStorage.removeItem('mdc_signup_phone');
      }
      localStorage.removeItem('mdc_signup_phone');
      // logout logic is handled by onAuthStateChanged
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const addMedicine = (med) => {
    const newMed = { ...med, id: Date.now(), status: 'upcoming' };
    setMedicines((prev) => [newMed, ...prev]);
    return newMed;
  };

  const markDose = (id, status) => {
    setMedicines((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
    if (status === 'taken') setStreak((s) => s + 1);
  };

  const addHealthLog = (log) => {
    setHealthLogs((prev) => [{ ...log, id: Date.now(), recorded_at: new Date().toISOString() }, ...prev]);
  };

  const addPrescription = (rx) => {
    setPrescriptions((prev) => [{ ...rx, id: Date.now() }, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: 1 } : n));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AppContext.Provider value={{
      user, loading, token, medicines, healthLogs, prescriptions, notifications, streak, achievements, theme,
      login, logout, addMedicine, markDose, addHealthLog, addPrescription, markNotificationRead, unreadCount, toggleTheme: () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('mdc_theme', newTheme);
      },
      setUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
