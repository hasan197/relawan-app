import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { DraftRibbon } from './components/ui/draft-ribbon.tsx';
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
import { ReguQRCodePage } from './pages/ReguQRCodePage';
import { JoinReguPage } from './pages/JoinReguPage';
import { CreateReguPage } from './pages/CreateReguPage';
import { MyRegusPage } from './pages/MyRegusPage';
import { GeneratorResiPage } from './pages/GeneratorResiPage';
import { NotifikasiPage } from './pages/NotifikasiPage';
import { ImportKontakPage } from './pages/ImportKontakPage';
import { ReminderFollowUpPage } from './pages/ReminderFollowUpPage';
import { UcapanTerimaKasihPage } from './pages/UcapanTerimaKasihPage';
import { RiwayatAktivitasPage } from './pages/RiwayatAktivitasPage';
import { MateriPromosiPage } from './pages/MateriPromosiPage';
import { ChatReguPageWithBackend } from './pages/ChatReguPageWithBackend';
import { PengaturanPage } from './pages/PengaturanPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminValidasiDonasiPage } from './pages/AdminValidasiDonasiPage';
import { AdminDataManagementPage } from './pages/AdminDataManagementPage';
import { AdminProfilPage } from './pages/AdminProfilPage';
import { ErrorPage } from './pages/ErrorPage';
import { OfflinePage } from './pages/OfflinePage';
import { TestConnectionPage } from './pages/TestConnectionPage';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { DesktopDashboardPage } from './pages/desktop/DesktopDashboardPage';
import { DesktopDonaturPage } from './pages/desktop/DesktopDonaturPage';
import { DesktopLaporanPage } from './pages/desktop/DesktopLaporanPage';
import { DesktopProfilPage } from './pages/desktop/DesktopProfilPage';
import { DesktopTambahProspekPage } from './pages/desktop/DesktopTambahProspekPage';
import { DesktopChatReguPage } from './pages/desktop/DesktopChatReguPage';
import { DesktopProgramPage } from './pages/desktop/DesktopProgramPage';
import { DesktopPengaturanPage } from './pages/desktop/DesktopPengaturanPage';
import { DesktopDetailProgramPage } from './pages/desktop/DesktopDetailProgramPage';
import { DesktopDetailProspekPage } from './pages/desktop/DesktopDetailProspekPage';
import { DesktopReguPage } from './pages/desktop/DesktopReguPage';
import { DesktopReguQRCodePage } from './pages/desktop/DesktopReguQRCodePage';
import { DesktopJoinReguPage } from './pages/desktop/DesktopJoinReguPage';
import { DesktopCreateReguPage } from './pages/desktop/DesktopCreateReguPage';
import { DesktopTemplatePesanPage } from './pages/desktop/DesktopTemplatePesanPage';
import { DesktopNotifikasiPage } from './pages/desktop/DesktopNotifikasiPage';
import { DesktopAdminDashboardPage } from './pages/desktop/DesktopAdminDashboardPage';
import { DesktopAdminValidasiDonasiPage } from './pages/desktop/DesktopAdminValidasiDonasiPage';
import { DesktopAdminDataManagementPage } from './pages/desktop/DesktopAdminDataManagementPage';
import { DesktopAdminToolsPage } from './pages/desktop/DesktopAdminToolsPage';
import { DesktopAdminProfilPage } from './pages/desktop/DesktopAdminProfilPage';
import { DesktopDatabaseResetPage } from './pages/desktop/DesktopDatabaseResetPage';
import { DesktopLayout } from './components/desktop/DesktopLayout';
import { useResponsive } from './hooks/useResponsive';
import { DebugPage } from './pages/DebugPage';
import { QuickTestPage } from './pages/QuickTestPage';
import { AdminToolsPage } from './pages/AdminToolsPage';
import { DatabaseResetPage } from './pages/DatabaseResetPage';
import { GeneratorResiPageMvvm } from './pages/mvvm/GeneratorResiPageMvvm';

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
  | 'template-pesan'
  | 'program'
  | 'detail-program'
  | 'detail-prospek'
  | 'tambah-prospek'
  | 'regu'
  | 'regu-qr-code'
  | 'join-regu'
  | 'create-regu'
  | 'my-regus'
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
  | 'admin-validasi-donasi'
  | 'admin-data'
  | 'admin-tools'
  | 'database-reset'
  | 'test-connection'
  | 'debug'
  | 'quick-test'
  | 'error'
  | 'offline';

function AppContent() {
  const { isAuthenticated, loading, user, logout, refetchAll } = useAppContext();
  const { isDesktop } = useResponsive();
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Check if there's a ?test query param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'quick') {
      return 'quick-test';
    }

    // MVVM sandbox routing (path prefix)
    const path = window.location.pathname || '/';
    if (path.startsWith('/mvvm')) {
      const mvvmPath = path.replace(/^\/mvvm\/?/, '');
      if (mvvmPath === 'generator-resi') {
        return 'generator-resi';
      }
    }

    return 'splash';
  });
  const isMvvmMode = (window.location.pathname || '').startsWith('/mvvm');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorType, setErrorType] = useState<'error' | 'no-user-id' | 'offline' | '404'>('error');
  const [navigationHistory, setNavigationHistory] = useState<Page[]>([]);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [selectedMuzakkiId, setSelectedMuzakkiId] = useState<string | null>(null);

  const setPage = (page: string) => {
    setCurrentPage(page as Page);
  };

  // Track navigation history when page changes (excluding back navigation)
  useEffect(() => {
    if (currentPage && !isNavigatingBack) {
      setNavigationHistory(prev => {
        // Don't add if it's the same as the last page
        if (prev[prev.length - 1] === currentPage) {
          return prev;
        }
        return [...prev, currentPage];
      });
    }
    setIsNavigatingBack(false);
  }, [currentPage, isNavigatingBack]);

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

        // If on auth pages, redirect to appropriate dashboard based on role
        if (currentPage === 'splash' || currentPage === 'login' || currentPage === 'otp') {
          const targetPage = user.role === 'admin' ? 'admin-dashboard' : 'dashboard';
          console.log('📍 Redirecting from', currentPage, 'to', targetPage, '(role:', user.role, ')');
          setCurrentPage(targetPage);
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

  const handleNavigation = (page: string) => {
    setNavigationHistory([...navigationHistory, page as Page]);
    setCurrentPage(page as Page);
    // Scroll to top setiap pindah halaman
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackNavigation = () => {
    if (navigationHistory.length > 1) {
      const previousPage = navigationHistory[navigationHistory.length - 2];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentPage(previousPage);
      setIsNavigatingBack(true);
      // Scroll to top setiap pindah halaman
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  useEffect(() => {
    // Handle custom navigation events
    const handleGoBackInApp = () => {
      handleBackNavigation();
    };

    window.addEventListener('goBackInApp', handleGoBackInApp);

    return () => {
      window.removeEventListener('goBackInApp', handleGoBackInApp);
    };
  }, [navigationHistory]);

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
        return <DonaturPage onNavigate={handleNavigation} onSelectMuzakki={(id) => {
          setSelectedMuzakkiId(id);
          handleNavigation('detail-prospek');
        }} />;

      case 'laporan':
        return <LaporanPage onNavigate={handleNavigation} />;

      case 'profil':
        return user?.role === 'admin'
          ? <AdminProfilPage onNavigate={handleNavigation} />
          : <ProfilPage onNavigate={handleNavigation} />;

      case 'template':
        return <TemplatePesanPage onBack={handleBackNavigation} />;

      case 'template-pesan':
        return <TemplatePesanPage onBack={handleBackNavigation} />;

      case 'program':
        return <ProgramPage onBack={() => setCurrentPage('dashboard')} />;

      case 'detail-program':
        return <DetailProgramPage onBack={() => setCurrentPage('program')} />;

      case 'detail-prospek':
        return <DetailProspekPage muzakkiId={selectedMuzakkiId || undefined} onBack={() => setCurrentPage('donatur')} />;

      case 'tambah-prospek':
        return (
          <TambahProspekPage
            onBack={() => setCurrentPage('donatur')}
            onSave={async () => {
              await refetchAll();
              setCurrentPage('donatur');
            }}
          />
        );

      case 'regu':
        return <ReguPage onBack={() => setCurrentPage('dashboard')} onNavigate={handleNavigation} />;

      case 'regu-qr-code':
        return <ReguQRCodePage onBack={() => setCurrentPage('regu')} />;

      case 'join-regu':
        return (
          <JoinReguPage
            onBack={() => {
              // Back to appropriate page based on auth state
              if (isAuthenticated) {
                setCurrentPage('regu');
              } else {
                setCurrentPage('register');
              }
            }}
            onSuccess={() => {
              console.log('✅ Join regu success');
              setCurrentPage('dashboard');
            }}
          />
        );

      case 'create-regu':
        return (
          <CreateReguPage
            onBack={() => setCurrentPage('regu')}
            onSuccess={() => {
              console.log('✅ Create regu success');
              setCurrentPage('regu');
            }}
          />
        );

      case 'my-regus':
        return <MyRegusPage onBack={handleBackNavigation} />;

      case 'chat-regu':
        return <ChatReguPageWithBackend onBack={handleBackNavigation} />;

      case 'generator-resi':
        return isMvvmMode
          ? <GeneratorResiPageMvvm onBack={handleBackNavigation} />
          : <GeneratorResiPage onBack={handleBackNavigation} />;

      case 'notifikasi':
        return <NotifikasiPage onBack={handleBackNavigation} />;

      case 'import-kontak':
        return (
          <ImportKontakPage
            onBack={handleBackNavigation}
            onImport={() => setCurrentPage('donatur')}
          />
        );

      case 'reminder-follow-up':
        return <ReminderFollowUpPage onBack={handleBackNavigation} />;

      case 'ucapan-terima-kasih':
        return <UcapanTerimaKasihPage onBack={handleBackNavigation} />;

      case 'riwayat-aktivitas':
        return <RiwayatAktivitasPage onBack={handleBackNavigation} />;

      case 'materi-promosi':
        return <MateriPromosiPage onBack={handleBackNavigation} />;

      case 'pengaturan':
        return <PengaturanPage onBack={handleBackNavigation} />;

      case 'admin-dashboard':
        return <AdminDashboardPage onBack={handleBackNavigation} onNavigate={setPage} />;

      case 'admin-validasi-donasi':
        return <AdminValidasiDonasiPage onBack={handleBackNavigation} onNavigate={handleNavigation} />;

      case 'admin-data':
        return <AdminDataManagementPage onBack={handleBackNavigation} onNavigate={setPage} />;

      case 'admin-tools':
        return <AdminToolsPage onBack={handleBackNavigation} onNavigate={setPage} />;

      case 'database-reset':
        return <DatabaseResetPage onBack={handleBackNavigation} />;

      case 'test-connection':
        return <TestConnectionPage onBack={handleBackNavigation} />;

      case 'quick-test':
        return <QuickTestPage onBack={handleBackNavigation} />;

      case 'debug':
        return <DebugPage onBack={handleBackNavigation} />;

      case 'error':
        return (
          <ErrorPage
            type={errorType}
            onRetry={handleBackNavigation}
            onHome={handleBackNavigation}
            onLogout={() => {
              logout();
              setCurrentPage('login');
            }}
          />
        );

      case 'offline':
        return (
          <OfflinePage
            onRetry={handleBackNavigation}
            onHome={handleBackNavigation}
          />
        );

      default:
        return <DashboardPage onNavigate={handleNavigation} />;
    }
  };

  const renderDesktopPage = () => {
    // Auth pages and system pages (no desktop layout)
    const noLayoutPages = ['splash', 'login', 'register', 'register-success', 'otp', 'onboarding', 'error', 'offline', 'test-connection', 'quick-test', 'debug'];

    if (noLayoutPages.includes(currentPage)) {
      return renderMobilePage(); // Use mobile version for auth pages
    }

    // Desktop pages with DesktopLayout
    return (
      <DesktopLayout currentPage={currentPage} onNavigate={handleNavigation}>
        {(() => {
          switch (currentPage) {
            case 'dashboard':
              return <DesktopDashboardPage onNavigate={handleNavigation} />;

            case 'donatur':
              return <DesktopDonaturPage onNavigate={handleNavigation} onSelectMuzakki={(id) => {
                setSelectedMuzakkiId(id);
                handleNavigation('detail-prospek');
              }} />;

            case 'laporan':
              return <DesktopLaporanPage onNavigate={handleNavigation} />;

            case 'profil':
              return user?.role === 'admin'
                ? <DesktopAdminProfilPage onNavigate={handleNavigation} />
                : <DesktopProfilPage onNavigate={handleNavigation} />;

            case 'program':
              return <DesktopProgramPage onNavigate={handleNavigation} />;

            case 'tambah-prospek':
              return (
                <DesktopTambahProspekPage
                  onBack={() => setCurrentPage('donatur')}
                  onSave={() => setCurrentPage('donatur')}
                />
              );

            case 'chat-regu':
              return <DesktopChatReguPage onBack={() => setCurrentPage('regu')} />;

            case 'pengaturan':
              return <DesktopPengaturanPage onBack={() => setCurrentPage('profil')} />;

            case 'detail-program':
              return <DesktopDetailProgramPage onBack={() => setCurrentPage('program')} />;

            case 'detail-prospek':
              return <DesktopDetailProspekPage muzakkiId={selectedMuzakkiId || undefined} onBack={() => setCurrentPage('donatur')} />;

            case 'regu':
              return <DesktopReguPage onBack={() => setCurrentPage('dashboard')} onNavigate={handleNavigation} />;

            case 'regu-qr-code':
              return <DesktopReguQRCodePage onBack={() => setCurrentPage('regu')} />;

            case 'join-regu':
              return (
                <DesktopJoinReguPage
                  onBack={() => setCurrentPage('regu')}
                  onSuccess={() => setCurrentPage('dashboard')}
                />
              );

            case 'create-regu':
              return (
                <DesktopCreateReguPage
                  onBack={() => setCurrentPage('regu')}
                  onSuccess={() => setCurrentPage('regu')}
                />
              );

            case 'template-pesan':
              return <DesktopTemplatePesanPage onBack={() => setCurrentPage('profil')} />;

            case 'notifikasi':
              return <DesktopNotifikasiPage onBack={() => setCurrentPage('dashboard')} />;

            case 'admin-dashboard':
              return <DesktopAdminDashboardPage onBack={() => setCurrentPage('dashboard')} onNavigate={handleNavigation} />;

            case 'admin-validasi-donasi':
              return <DesktopAdminValidasiDonasiPage onNavigate={handleNavigation} />;

            case 'admin-data':
              return <DesktopAdminDataManagementPage onBack={() => setCurrentPage('admin-dashboard')} onNavigate={handleNavigation} />;

            case 'admin-tools':
              return <DesktopAdminToolsPage onBack={() => setCurrentPage('admin-dashboard')} onNavigate={handleNavigation} />;

            case 'database-reset':
              return <DesktopDatabaseResetPage onBack={() => setCurrentPage('admin-tools')} />;

            case 'generator-resi':
              return renderMobilePage();

            // For pages without desktop version, use mobile version
            default:
              return renderMobilePage();
          }
        })()}
      </DesktopLayout>
    );
  };

  return (
    <>
      {isMvvmMode && (
        <DraftRibbon text="MVVM" color="yellow" position="top-left" />
      )}
      {isDesktop ? renderDesktopPage() : renderMobilePage()}
      <Toaster
        position="bottom-center"
        closeButton
        richColors
        expand={false}
        offset="80px"
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