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
