import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { DonaturPage } from './pages/DonaturPage';
import { LaporanPage } from './pages/LaporanPage';
import { ProfilPage } from './pages/ProfilPage';
import { LoginPage } from './pages/LoginPage';
import { OTPVerificationPage } from './pages/OTPVerificationPage';
import { ReguPage } from './pages/ReguPage';
import { TemplatePesanPage } from './pages/TemplatePesanPage';
import { NotifikasiPage } from './pages/NotifikasiPage';
import { ImportKontakPage } from './pages/ImportKontakPage';
import { TambahProspekPage } from './pages/TambahProspekPage';
import { GeneratorResiPage } from './pages/GeneratorResiPage';
import { ChatReguPage } from './pages/ChatReguPage';
import { RegisterSuccessPage } from './pages/RegisterSuccessPage';
import { ReminderFollowUpPage } from './pages/ReminderFollowUpPage';
import { RiwayatAktivitasPage } from './pages/RiwayatAktivitasPage';
import { UcapanTerimaKasihPage } from './pages/UcapanTerimaKasihPage';
import { DetailProgramPage } from './pages/DetailProgramPage';
import { DetailProspekPage } from './pages/DetailProspekPage';
import { ErrorPage } from './pages/ErrorPage';
import { MateriPromosiPage } from './pages/MateriPromosiPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { PengaturanPage } from './pages/PengaturanPage';
import { ProgramPage } from './pages/ProgramPage';
import { RegisterPage } from './pages/RegisterPage';
import { SplashScreen } from './pages/SplashScreen';
import { Toaster } from './components/ui/sonner';
import { ScrollToTop } from './components/ScrollToTop';

// Simple Protected Route Component (temporary)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return children;
};

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleLogin = (phone: string) => {
    setPhoneNumber(phone);
    navigate('/otp');
  };

  const handleVerifyOTP = () => {
    // Skip token for now
    navigate('/dashboard');
  };
  
  // Handle navigation from pages
  const handleNavigation = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <LoginPage 
              onLogin={() => {}}
              onSendOTP={handleLogin}
            />
          } 
        />
        
        <Route 
          path="/otp" 
          element={
            <OTPVerificationPage
              phoneNumber={phoneNumber}
              onVerify={handleVerifyOTP}
              onBack={() => navigate('/login')}
            />
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/donatur" 
          element={
            <ProtectedRoute>
              <DonaturPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/laporan" 
          element={
            <ProtectedRoute>
              <LaporanPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profil" 
          element={
            <ProtectedRoute>
              <ProfilPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/generator-resi" 
          element={
            <ProtectedRoute>
              <GeneratorResiPage onBack={() => navigate('/dashboard')} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/regu" 
          element={
            <ProtectedRoute>
              <ReguPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/template" 
          element={
            <ProtectedRoute>
              <TemplatePesanPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/notifikasi" 
          element={
            <ProtectedRoute>
              <NotifikasiPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/import-kontak" 
          element={
            <ProtectedRoute>
              <ImportKontakPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/tambah-prospek" 
          element={
            <ProtectedRoute>
              <TambahProspekPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        {/* New Pages */}
        <Route 
          path="/chat-regu" 
          element={
            <ProtectedRoute>
              <ChatReguPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/register-success" 
          element={
            <ProtectedRoute>
              <RegisterSuccessPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reminder-followup" 
          element={
            <ProtectedRoute>
              <ReminderFollowUpPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/riwayat-aktivitas" 
          element={
            <ProtectedRoute>
              <RiwayatAktivitasPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ucapan-terimakasih" 
          element={
            <ProtectedRoute>
              <UcapanTerimaKasihPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        {/* Additional New Pages */}
        <Route 
          path="/detail-program/:id" 
          element={
            <ProtectedRoute>
              <DetailProgramPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/detail-prospek/:id" 
          element={
            <ProtectedRoute>
              <DetailProspekPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/materi-promosi" 
          element={
            <ProtectedRoute>
              <MateriPromosiPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/onboarding" 
          element={
            <OnboardingPage onComplete={() => navigate('/dashboard')} />
          } 
        />

        <Route 
          path="/pengaturan" 
          element={
            <ProtectedRoute>
              <PengaturanPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/program" 
          element={
            <ProtectedRoute>
              <ProgramPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/register" 
          element={
            <RegisterPage onSuccess={() => navigate('/register-success')} />
          } 
        />

        <Route 
          path="/splash" 
          element={
            <SplashScreen onFinish={() => navigate('/onboarding')} />
          } 
        />

        {/* Error Page */}
        <Route 
          path="/error" 
          element={
            <ErrorPage 
              onRetry={() => window.location.reload()} 
              onBack={() => navigate(-1)}
            />
          } 
        />

        {/* Redirect root to /dashboard */}
        <Route 
          path="/" 
          element={
            <Navigate to="/dashboard" replace />
          } 
        />

        {/* 404 Page */}
        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-2xl font-bold">404 - Halaman tidak ditemukan</h1>
            </div>
          } 
        />
      </Routes>
    </div>
  );
};

export default App;
