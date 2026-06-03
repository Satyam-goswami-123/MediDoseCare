import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Pill, Flame, Trophy, AlertTriangle } from 'lucide-react';
import { medicinesApi, healthApi, prescriptionsApi, notificationsApi, authApi } from '../api';
import { applyLanguageToUI } from '../utils/languageTranslator';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Auth State ──
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('mdc_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('mdc_token'));
  const [loading, setLoading] = useState(true);

  // ── Data State ──
  const [medicines, setMedicines] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [doseHistory, setDoseHistory] = useState([]);
  const [registeredDoctors, setRegisteredDoctors] = useState([
    {
      id: 101,
      name: 'Dr. Priya Sharma',
      specialty: 'Diabetologist',
      hospital: 'Apollo Hospitals',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfhnh1tlasXW18unaAU-rHt8GbVCNxlfGR2w&s',
      experience: '12 Years',
      rating: 4.8,
      fee: 850,
      slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '05:00 PM']
    }
  ]);
  const [appointments, setAppointments] = useState([]);
  const [streak, setStreak] = useState(0);
  const [achievements] = useState([
    { id: 1, name: 'First Dose', icon: <Pill size={36} />, earned: false },
    { id: 2, name: '7-Day Streak', icon: <Flame size={36} />, earned: false },
    { id: 3, name: 'Health Hero', icon: <Trophy size={36} />, earned: false },
    { id: 4, name: 'SOS Ready', icon: <AlertTriangle size={36} />, earned: true },
  ]);

  const [activeReminder, setActiveReminder] = useState(null);
  const [snoozedReminders, setSnoozedReminders] = useState([]);

  const isFetching = useRef(false);

  // ── UI State ──
  const [theme, setTheme] = useState(localStorage.getItem('mdc_theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('mdc_language') || 'en');
  const [settings, setSettings] = useState(() => {
    try {
      const s = localStorage.getItem('mdc_settings');
      if (s) return JSON.parse(s);
    } catch (e) { }
    return {
      vibration: true,
      softNotifications: true,
      soundEnabled: true,
      selectedReminderSound: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
      selectedNotificationSound: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      selectedVibrationPattern: 'standard',
      autoSync: true,
      healthTips: true,
      skipAlerts: true,
    };
  });

  // ════════════════════════════════════════════════
  //  CORE: Fetch all data from DB
  // ════════════════════════════════════════════════
  const fetchAllData = async () => {
    const t = localStorage.getItem('mdc_token') || token;
    if (!t || isFetching.current) return;
    isFetching.current = true;

    try {
      console.log("✅ Fetching data from DB...");
      const [meds, health, rx, notifs, logs] = await Promise.all([
        medicinesApi.getAll(),
        healthApi.getLogs().catch(() => []),
        prescriptionsApi.getAll().catch(() => []),
        notificationsApi.getAll().catch(() => []),
        medicinesApi.getLogs().catch(() => [])
      ]);

      setMedicines(Array.isArray(meds) ? meds : []);
      setHealthLogs(Array.isArray(health) ? health : []);
      setPrescriptions(Array.isArray(rx) ? rx : []);
      setNotifications(Array.isArray(notifs) ? notifs : []);
      setDoseHistory(Array.isArray(logs) ? logs : []);
    } catch (err) {
      console.error("❌ Fetch failed:", err);
    } finally {
      isFetching.current = false;
    }
  };

  // ════════════════════════════════════════════════
  //  AUTH
  // ════════════════════════════════════════════════
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('mdc_token', userToken);
    localStorage.setItem('mdc_user', JSON.stringify(userData));
  };

  const logout = async () => {
    localStorage.removeItem('mdc_token');
    localStorage.removeItem('mdc_user');
    if (auth.currentUser) await signOut(auth);
    setUser(null);
    setToken(null);
    setMedicines([]);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const res = await authApi.socialLogin({ email: fbUser.email, name: fbUser.displayName, uid: fbUser.uid });
          if (res?.token) login(res.user, res.token);
        } catch (e) { console.error("Auth sync error:", e); }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (token) fetchAllData();
  }, [token]);

  // ── Notification Permission ──
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const lastTriggeredMinute = useRef("");

  // ── Reminder Loop ──
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      if (lastTriggeredMinute.current === currentTime) return;

      // Check for scheduled medicines
      medicines.forEach(med => {
        if (med.times && med.times.includes(currentTime)) {
          const isSnoozed = snoozedReminders.some(s => s.id === med.id && s.remindAt === currentTime);
          if (!activeReminder && !isSnoozed && med.status !== 'taken') {
            triggerReminder(med);
            lastTriggeredMinute.current = currentTime;
          }
        }
      });

      // Check snoozed reminders
      const updatedSnoozed = snoozedReminders.filter(s => {
        if (s.remindAt === currentTime) {
          triggerReminder(s.med);
          lastTriggeredMinute.current = currentTime;
          return false;
        }
        return true;
      });
      if (updatedSnoozed.length !== snoozedReminders.length) setSnoozedReminders(updatedSnoozed);
    };

    const triggerReminder = (med) => {
      setActiveReminder(med);

      // Browser Notification
      if (Notification.permission === "granted") {
        new Notification("MediDoseCare: Time for Medicine", {
          body: `Time to take ${med.name} (${med.dosage})`,
          icon: "/logo192.png",
          vibrate: [200, 100, 200]
        });
      }
    };

    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [medicines, activeReminder, snoozedReminders]);

  // ✅ Language Effect
  useEffect(() => {
    localStorage.setItem('mdc_language', language);
    applyLanguageToUI(language);
  }, [language]);

  // ✅ Theme Effect (Restore Toggle Functionality)
  useEffect(() => {
    if (theme === 'light') document.documentElement.classList.add('light-mode');
    else document.documentElement.classList.remove('light-mode');
    localStorage.setItem('mdc_theme', theme);
  }, [theme]);

  // ════════════════════════════════════════════════
  //  ACTIONS
  // ════════════════════════════════════════════════
  const addMedicine = async (med) => {
    try {
      const saved = await medicinesApi.create(med);
      await fetchAllData();
      return saved;
    } catch (e) { return null; }
  };

  const addHealthLog = async (log) => {
    try {
      const saved = await healthApi.addLog(log);
      await fetchAllData();
      return saved;
    } catch (e) { return null; }
  };

  const addPrescription = async (px) => {
    try {
      const saved = await prescriptionsApi.create(px);
      await fetchAllData();
      return saved;
    } catch (e) { return null; }
  };

  const updateMedicine = async (id, data) => {
    try {
      const updated = await medicinesApi.update(id, data);
      await fetchAllData();
      return updated;
    } catch (e) { return null; }
  };

  const deleteMedicine = async (id) => {
    try {
      await medicinesApi.remove(id);
      await fetchAllData();
      return true;
    } catch (e) { return false; }
  };

  const markDose = async (id, status, logId) => {
    // Optimistic UI Update
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    if (activeReminder?.id === id) setActiveReminder(null);

    try {
      if (logId) {
        await medicinesApi.updateDose(logId, status);
      } else {
        await medicinesApi.update(id, { status });
      }
      // Re-fetch to sync with server
      await fetchAllData();
    } catch (e) {
      console.error("Failed to mark dose:", e);
      // Rollback on error? (Optional for now)
      await fetchAllData();
    }
  };

  const snoozeMedicine = (med, minutes) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const remindAt = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setSnoozedReminders(prev => [...prev, { id: med.id, remindAt, med }]);
    setActiveReminder(null);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('mdc_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const bookAppointment = (appointment) => {
    setAppointments(prev => [...prev, { ...appointment, id: Date.now(), status: 'scheduled' }]);
  };

  const updateDoctorProfile = async (doctorId, data) => {
    setRegisteredDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, ...data } : d));
    if (user?.id === doctorId) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('mdc_user', JSON.stringify(updatedUser));
      try {
        await usersApi.updateProfile(data);
      } catch (e) {
        console.error('Failed to sync doctor profile with server:', e);
      }
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await notificationsApi.markRead(id);
      await fetchAllData();
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationsApi.markAllRead();
      await fetchAllData();
    } catch (e) {
      console.error('Failed to mark all notifications as read:', e);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AppContext.Provider value={{
      user, setUser, loading, token, medicines, healthLogs, prescriptions, notifications,
      doseHistory, streak, achievements, theme, language, settings, unreadCount,
      activeReminder, setActiveReminder, snoozeMedicine,
      registeredDoctors, appointments,
      login, logout, fetchAllData, addMedicine, updateMedicine, deleteMedicine, addHealthLog, addPrescription, markDose, updateSettings,
      bookAppointment, updateDoctorProfile, markNotificationRead, markAllNotificationsRead,
      setLanguage, toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark'),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);