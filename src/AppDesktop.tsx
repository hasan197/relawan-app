import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DashboardPage } from './pages/desktop/DashboardPage';
import { DonaturPage } from './pages/desktop/DonaturPage';
import { LaporanPage } from './pages/desktop/LaporanPage';
import { ProfilPage } from './pages/desktop/ProfilPage';
import { TemplatePesanPage } from './pages/desktop/TemplatePesanPage';
import { ReguPage } from './pages/desktop/ReguPage';
import { PengaturanPage } from './pages/desktop/PengaturanPage';
import { ProgramPage } from './pages/desktop/ProgramPage';
import { NotifikasiPage } from './pages/desktop/NotifikasiPage';
import { GeneratorResiPage } from './pages/desktop/GeneratorResiPage';
import { ChatReguPage } from './pages/desktop/ChatReguPage';
import { ImportKontakPage } from './pages/desktop/ImportKontakPage';
import { LoginPage } from './pages/LoginPage';
import { OTPVerificationPage } from './pages/OTPVerificationPage';
import { Toaster } from './components/ui/sonner';
import { ScrollToTop } from './components/ScrollToTop';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

// Simple Protected Route Component (temporary)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return children;
};

const AppDesktop = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (phone: string) => {
    setPhoneNumber(phone);
    navigate('/otp');
  };

  const handleVerifyOTP = () => {
    // Skip token for now
    navigate('/dashboard');
  };
  
  // Handle navigation from pages
  const handleNavigation = (page: NavigatePage) => {
    navigate(`/${page}`);
  };

  // Redirect to dashboard if accessing root on desktop
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location.pathname, navigate]);

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

        {/* Protected Routes - Desktop Version */}
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

        {/* Desktop Routes */}
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
          path="/template" 
          element={
            <ProtectedRoute>
              <TemplatePesanPage onNavigate={handleNavigation} />
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
          path="/notifikasi" 
          element={
            <ProtectedRoute>
              <NotifikasiPage onNavigate={handleNavigation} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/generator-resi" 
          element={
            <ProtectedRoute>
              <GeneratorResiPage onNavigate={handleNavigation} onBack={() => navigate('/dashboard')} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/chat-regu" 
          element={
            <ProtectedRoute>
              <ChatReguPage onNavigate={handleNavigation} />
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

        {/* 404 Page */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">404 - Halaman tidak ditemukan</h1>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
};

export default AppDesktop;