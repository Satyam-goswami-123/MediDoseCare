import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import './styles/index.css';

import SplashPage from './pages/SplashPage';
import Onboarding1Page from './pages/Onboarding1Page';
import Onboarding2Page from './pages/Onboarding2Page';
import Onboarding3Page from './pages/Onboarding3Page';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MedicineListPage from './pages/MedicineListPage';
import AddMedicinePage from './pages/AddMedicinePage';
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

// Pages that should NOT show the bottom nav
const NO_NAV_PATHS = ['/', '/onboarding/1', '/onboarding/2', '/onboarding/3', '/login'];

function AppShell() {
  const { pathname } = useLocation();
  const showNav = !NO_NAV_PATHS.includes(pathname);

  return (
    <div className="app-frame">
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/onboarding/1" element={<Onboarding1Page />} />
        <Route path="/onboarding/2" element={<Onboarding2Page />} />
        <Route path="/onboarding/3" element={<Onboarding3Page />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/medicines" element={<MedicineListPage />} />
        <Route path="/medicines/add" element={<AddMedicinePage />} />
        <Route path="/medicines/:id" element={<ReminderDetailPage />} />
        <Route path="/health" element={<HealthDashboardPage />} />
        <Route path="/health/:type" element={<VitalsDetailPage />} />
        <Route path="/prescriptions" element={<PrescriptionsPage />} />
        <Route path="/prescriptions/:id" element={<ViewPrescriptionPage />} />
        <Route path="/sos" element={<SosPage />} />
        <Route path="/care-network" element={<CareNetworkPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/history" element={<MedHistoryPage />} />
        <Route path="/ai-coach" element={<AiCoachPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* BottomNav lives here — outside all page animations — so position:fixed always works */}
      {showNav && <BottomNav />}
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
