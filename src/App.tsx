import { useState, useEffect } from 'react';
import { SplashScreen } from './pages/SplashScreen';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RegisterSuccessPage } from './pages/RegisterSuccessPage';
import { OTPVerificationPage } from './pages/OTPVerificationPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DonaturPage } from './pages/DonaturPage';
import { LaporanPage } from './pages/LaporanPage';
import { ProfilPage } from './pages/ProfilPage';
import { TemplatePesanPage } from './pages/TemplatePesanPage';
import { ProgramPage } from './pages/ProgramPage';
import { DetailProgramPage } from './pages/DetailProgramPage';
import { DetailProspekPage } from './pages/DetailProspekPage';
import { TambahProspekPage } from './pages/TambahProspekPage';
import { ReguPage } from './pages/ReguPage';
import { GeneratorResiPage } from './pages/GeneratorResiPage';
import { NotifikasiPage } from './pages/NotifikasiPage';
import { ImportKontakPage } from './pages/ImportKontakPage';
import { ReminderFollowUpPage } from './pages/ReminderFollowUpPage';
import { UcapanTerimaKasihPage } from './pages/UcapanTerimaKasihPage';
import { RiwayatAktivitasPage } from './pages/RiwayatAktivitasPage';
import { MateriPromosiPage } from './pages/MateriPromosiPage';
import { ChatReguPage } from './pages/ChatReguPage';
import { PengaturanPage } from './pages/PengaturanPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ErrorPage } from './pages/ErrorPage';
import OfflinePage from './pages/OfflinePage';
import { TestConnectionPage } from './pages/TestConnectionPage';
import { Toaster } from './components/ui/sonner';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { DesktopDashboardPage } from './pages/desktop/DesktopDashboardPage';
import { DesktopDonaturPage } from './pages/desktop/DesktopDonaturPage';
import { DesktopLaporanPage } from './pages/desktop/DesktopLaporanPage';
import { DesktopProfilPage } from './pages/desktop/DesktopProfilPage';
import { DesktopTambahProspekPage } from './pages/desktop/DesktopTambahProspekPage';
import { DesktopChatReguPage } from './pages/desktop/DesktopChatReguPage';
import { DesktopLayout } from './components/desktop/DesktopLayout';
import { useResponsive } from './hooks/useResponsive';
import { DebugPage } from './pages/DebugPage';
import { QuickTestPage } from './pages/QuickTestPage';

type Page = 
  | 'splash'
  | 'login'
  | 'register'
  | 'register-success'
  | 'otp'
  | 'onboarding'
  | 'dashboard'
  | 'donatur'
  | 'laporan'
  | 'profil'
  | 'template'
  | 'program'
  | 'detail-program'
  | 'detail-prospek'
  | 'tambah-prospek'
  | 'regu'
  | 'generator-resi'
  | 'notifikasi'
  | 'import-kontak'
  | 'reminder-follow-up'
  | 'ucapan-terima-kasih'
  | 'riwayat-aktivitas'
  | 'materi-promosi'
  | 'chat-regu'
  | 'pengaturan'
  | 'admin-dashboard'
  | 'test-connection'
  | 'debug'
  | 'quick-test'
  | 'error'
  | 'offline';

function AppContent() {
  const { isAuthenticated, loading, user, logout } = useAppContext();
  const { isDesktop } = useResponsive();
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Check if there's a ?test query param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'quick') {
      return 'quick-test';
    }
    return 'splash';
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorType, setErrorType] = useState<'error' | 'no-user-id' | 'offline' | '404'>('error');

  useEffect(() => {
    // Check if user is authenticated on mount
    if (!loading) {
      console.log('🔐 Auth Check:', { isAuthenticated, user, currentPage });
      
      if (isAuthenticated) {
        // ✅ User is authenticated
        
        // Check if user has ID (relawan_id)
        if (!user?.id) {
          console.error('❌ User authenticated but NO USER ID found!');
          console.error('User object:', user);
          
          // Force logout if no user ID
          logout();
          setErrorType('no-user-id');
          setCurrentPage('error');
          return;
        }
        
        console.log('✅ User ID exists:', user.id);
        console.log('✅ User authenticated and ready!');
        
        // If on auth pages, redirect to dashboard
        if (currentPage === 'splash' || currentPage === 'login' || currentPage === 'otp') {
          console.log('📍 Redirecting from', currentPage, 'to dashboard');
          setCurrentPage('dashboard');
        }
      } else {
        // ❌ User not authenticated
        console.log('❌ User not authenticated');
        
        // If on protected pages, redirect to login
        const protectedPages = ['dashboard', 'donatur', 'laporan', 'profil', 'tambah-prospek', 'detail-prospek'];
        if (protectedPages.includes(currentPage)) {
          console.log('📍 Not authenticated, redirecting to login');
          setCurrentPage('login');
          return;
        }
        
        // If on splash, auto-redirect to login after delay
        if (currentPage === 'splash') {
          setTimeout(() => {
            console.log('📍 Splash complete, redirecting to login');
            setCurrentPage('login');
          }, 2500);
        }
      }
    }
  }, [loading, isAuthenticated, currentPage, user, logout]);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  const renderMobilePage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentPage('login')} />;
      
      case 'login':
        return (
          <LoginPage
            onLogin={() => setCurrentPage('otp')}
            onSendOTP={(phone) => {
              setPhoneNumber(phone);
              setCurrentPage('otp');
            }}
            onRegister={() => setCurrentPage('register')}
          />
        );
      
      case 'register':
        return (
          <RegisterPage
            onBack={() => setCurrentPage('login')}
            onRegister={() => setCurrentPage('register-success')}
          />
        );
      
      case 'register-success':
        return <RegisterSuccessPage onComplete={() => setCurrentPage('login')} />;
      
      case 'otp':
        return (
          <OTPVerificationPage
            phoneNumber={phoneNumber}
            onVerify={() => {
              // After successful OTP verification, navigate to onboarding
              // Auth state should be updated by now
              console.log('📍 OTP verified, navigating to dashboard (skip onboarding for now)');
              setCurrentPage('dashboard');
            }}
            onBack={() => setCurrentPage('login')}
          />
        );
      
      case 'onboarding':
        return <OnboardingPage onComplete={() => setCurrentPage('dashboard')} />;
      
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigation} />;
      
      case 'donatur':
        return <DonaturPage onNavigate={handleNavigation} />;
      
      case 'laporan':
        return <LaporanPage onNavigate={handleNavigation} />;
      
      case 'profil':
        return <ProfilPage onNavigate={handleNavigation} />;
      
      case 'template':
        return <TemplatePesanPage onBack={() => setCurrentPage('profil')} />;
      
      case 'program':
        return <ProgramPage onBack={() => setCurrentPage('dashboard')} />;
      
      case 'detail-program':
        return <DetailProgramPage onBack={() => setCurrentPage('program')} />;
      
      case 'detail-prospek':
        return <DetailProspekPage onBack={() => setCurrentPage('donatur')} />;
      
      case 'tambah-prospek':
        return (
          <TambahProspekPage
            onBack={() => setCurrentPage('donatur')}
            onSave={() => setCurrentPage('donatur')}
          />
        );
      
      case 'regu':
      case 'chat-regu':
        return <ReguPage onBack={() => setCurrentPage('dashboard')} onNavigate={handleNavigation} />;
      
      case 'generator-resi':
        return <GeneratorResiPage onBack={() => setCurrentPage('dashboard')} />;
      
      case 'notifikasi':
        return <NotifikasiPage onBack={() => setCurrentPage('dashboard')} />;
      
      case 'import-kontak':
        return (
          <ImportKontakPage
            onBack={() => setCurrentPage('donatur')}
            onImport={() => setCurrentPage('donatur')}
          />
        );
      
      case 'reminder-follow-up':
        return <ReminderFollowUpPage onBack={() => setCurrentPage('dashboard')} />;
      
      case 'ucapan-terima-kasih':
        return <UcapanTerimaKasihPage onBack={() => setCurrentPage('dashboard')} />;
      
      case 'riwayat-aktivitas':
        return <RiwayatAktivitasPage onBack={() => setCurrentPage('laporan')} />;
      
      case 'materi-promosi':
        return <MateriPromosiPage onBack={() => setCurrentPage('profil')} />;
      
      case 'pengaturan':
        return <PengaturanPage onBack={() => setCurrentPage('profil')} />;
      
      case 'admin-dashboard':
        return <AdminDashboardPage onBack={() => setCurrentPage('dashboard')} />;

      case 'test-connection':
        return <TestConnectionPage onBack={() => setCurrentPage('dashboard')} />;

      case 'quick-test':
        return <QuickTestPage onBack={() => setCurrentPage('dashboard')} />;

      case 'debug':
        return <DebugPage onBack={() => setCurrentPage('dashboard')} />;

      case 'error':
        return (
          <ErrorPage
            type={errorType}
            onRetry={() => setCurrentPage('dashboard')}
            onHome={() => setCurrentPage('dashboard')}
            onLogout={() => {
              logout();
              setCurrentPage('login');
            }}
          />
        );
      
      case 'offline':
        return (
          <OfflinePage
            onRetry={() => setCurrentPage('dashboard')}
            onHome={() => setCurrentPage('dashboard')}
          />
        );
      
      default:
        return <DashboardPage onNavigate={handleNavigation} />;
    }
  };

  const renderDesktopPage = () => {
    // Auth pages (no layout)
    if (['login', 'register', 'register-success', 'otp', 'onboarding', 'test-connection', 'quick-test', 'splash'].includes(currentPage)) {
      switch (currentPage) {
        case 'splash':
          return <SplashScreen onComplete={() => setCurrentPage('login')} />;
        
        case 'login':
          return (
            <LoginPage
              onLogin={() => setCurrentPage('otp')}
              onSendOTP={(phone) => {
                setPhoneNumber(phone);
                setCurrentPage('otp');
              }}
              onRegister={() => setCurrentPage('register')}
            />
          );
        
        case 'register':
          return (
            <RegisterPage
              onBack={() => setCurrentPage('login')}
              onRegister={() => setCurrentPage('register-success')}
            />
          );
        
        case 'register-success':
          return <RegisterSuccessPage onComplete={() => setCurrentPage('login')} />;
        
        case 'otp':
          return (
            <OTPVerificationPage
              phoneNumber={phoneNumber}
              onVerify={() => {
                // After successful OTP verification, navigate to onboarding
                // Auth state should be updated by now
                console.log('📍 OTP verified, navigating to dashboard (skip onboarding for now)');
                setCurrentPage('dashboard');
              }}
              onBack={() => setCurrentPage('login')}
            />
          );
        
        case 'onboarding':
          return <OnboardingPage onComplete={() => setCurrentPage('dashboard')} />;

        case 'test-connection':
          return <TestConnectionPage onBack={() => setCurrentPage('dashboard')} />;
        
        case 'quick-test':
          return <QuickTestPage onBack={() => setCurrentPage('dashboard')} />;
        
        default:
          return null;
      }
    }

    // Main pages (with desktop layout)
    return (
      <DesktopLayout currentPage={currentPage} onNavigate={handleNavigation}>
        {(() => {
          switch (currentPage) {
            case 'dashboard':
              return <DesktopDashboardPage onNavigate={handleNavigation} />;
            
            case 'donatur':
              return <DesktopDonaturPage onNavigate={handleNavigation} />;
            
            case 'laporan':
              return <DesktopLaporanPage onNavigate={handleNavigation} />;
            
            case 'regu':
            case 'chat-regu':
              return <DesktopChatReguPage onNavigate={handleNavigation} />;
            
            case 'profil':
              return <DesktopProfilPage onNavigate={handleNavigation} />;
            
            case 'admin-dashboard':
              return <AdminDashboardPage onBack={() => setCurrentPage('dashboard')} />;

            // Other pages use mobile version in desktop layout
            case 'template':
              return <TemplatePesanPage onBack={() => setCurrentPage('profil')} />;
            
            case 'program':
              return <ProgramPage onBack={() => setCurrentPage('dashboard')} />;
            
            case 'detail-program':
              return <DetailProgramPage onBack={() => setCurrentPage('program')} />;
            
            case 'detail-prospek':
              return <DetailProspekPage onBack={() => setCurrentPage('donatur')} />;
            
            case 'tambah-prospek':
              return (
                <DesktopTambahProspekPage
                  onBack={() => setCurrentPage('donatur')}
                  onSave={() => setCurrentPage('donatur')}
                />
              );
            
            case 'generator-resi':
              return <GeneratorResiPage onBack={() => setCurrentPage('dashboard')} />;
            
            case 'notifikasi':
              return <NotifikasiPage onBack={() => setCurrentPage('dashboard')} />;
            
            case 'import-kontak':
              return (
                <ImportKontakPage
                  onBack={() => setCurrentPage('donatur')}
                  onImport={() => setCurrentPage('donatur')}
                />
              );
            
            case 'pengaturan':
              return <PengaturanPage onBack={() => setCurrentPage('profil')} />;
            
            default:
              return <DesktopDashboardPage onNavigate={handleNavigation} />;
          }
        })()}
      </DesktopLayout>
    );
  };

  return (
    <>
      {isDesktop ? renderDesktopPage() : renderMobilePage()}
      <Toaster 
        position="top-center" 
        closeButton
        richColors
        expand={false}
        toastOptions={{
          duration: 4000,
          className: 'toast-custom',
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}