import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import './styles/index.css';

import SplashPage from './pages/SplashPage';
import Onboarding1Page from './pages/Onboarding1Page';
import Onboarding2Page from './pages/Onboarding2Page';
import Onboarding3Page from './pages/Onboarding3Page';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MedicineListPage from './pages/MedicineListPage';
import AddMedicinePage from './pages/AddMedicinePage';
import EditMedicinePage from './pages/EditMedicinePage';
import ReminderDetailPage from './pages/ReminderDetailPage';
import HealthDashboardPage from './pages/HealthDashboardPage';
import VitalsDetailPage from './pages/VitalsDetailPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import ViewPrescriptionPage from './pages/ViewPrescriptionPage';
import SosPage from './pages/SosPage';
import CareNetworkPage from './pages/CareNetworkPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import MedHistoryPage from './pages/MedHistoryPage';
import AiCoachPage from './pages/AiCoachPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import BottomNav from './components/BottomNav';
import GlobalHeader from './components/GlobalHeader';
import ReminderModal from './components/ReminderModal';

function AppShell() {
  const { pathname } = useLocation();
  const { loading, user, activeReminder, setActiveReminder, markDose, snoozeMedicine } = useApp();
  
  const isDoctor = user?.role === 'doctor';
  
  const showNav = !isDoctor && ['/home', '/medicines', '/health', '/prescriptions', '/profile', '/notifications', '/settings'].some(p => pathname.startsWith(p));
  const showDoctorNav = isDoctor && ['/doctor/dashboard', '/profile', '/notifications', '/settings'].some(p => pathname.startsWith(p));

  if (loading) {
    return (
      <div className="splash-bg">
        <div className="splash-loader">
          <div className="splash-loader-bar" style={{ animationDuration: '1s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="app-frame">
      {(showNav || showDoctorNav) && <GlobalHeader />}
      <div className="app-content">
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/onboarding/1" element={<Onboarding1Page />} />
            <Route path="/onboarding/2" element={<Onboarding2Page />} />
            <Route path="/onboarding/3" element={<Onboarding3Page />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Patient Routes */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/medicines" element={<MedicineListPage />} />
            <Route path="/medicines/add" element={<AddMedicinePage />} />
            <Route path="/medicines/:id" element={<ReminderDetailPage />} />
            <Route path="/medicines/:id/edit" element={<EditMedicinePage />} />
            <Route path="/health" element={<HealthDashboardPage />} />
            <Route path="/health/:type" element={<VitalsDetailPage />} />
            <Route path="/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/prescriptions/:id" element={<ViewPrescriptionPage />} />
            <Route path="/sos" element={<SosPage />} />
            <Route path="/care-network" element={<CareNetworkPage />} />
            
            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
            
            {/* Shared Routes */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/history" element={<MedHistoryPage />} />
            <Route path="/ai-coach" element={<AiCoachPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      {showNav && <BottomNav />}
      
      {activeReminder && (
        <ReminderModal 
          medicine={activeReminder}
          onTake={() => markDose(activeReminder.id, 'taken')}
          onSnooze={(mins) => snoozeMedicine(activeReminder, mins)}
          onClose={() => setActiveReminder(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}
