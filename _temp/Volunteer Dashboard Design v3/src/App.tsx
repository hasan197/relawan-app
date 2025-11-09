import { useState } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { DonaturPage } from './pages/DonaturPage';
import { LaporanPage } from './pages/LaporanPage';
import { ProfilPage } from './pages/ProfilPage';
import { TemplatePesanPage } from './pages/TemplatePesanPage';
import { ProgramPage } from './pages/ProgramPage';
import { LoginPage } from './pages/LoginPage';
import { OTPVerificationPage } from './pages/OTPVerificationPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DetailProspekPage } from './pages/DetailProspekPage';
import { TambahProspekPage } from './pages/TambahProspekPage';
import { ReguPage } from './pages/ReguPage';
import { GeneratorResiPage } from './pages/GeneratorResiPage';
import { NotifikasiPage } from './pages/NotifikasiPage';
import { ImportKontakPage } from './pages/ImportKontakPage';
import { RegisterPage } from './pages/RegisterPage';
import { RegisterSuccessPage } from './pages/RegisterSuccessPage';
import { ReminderFollowUpPage } from './pages/ReminderFollowUpPage';
import { UcapanTerimaKasihPage } from './pages/UcapanTerimaKasihPage';
import { RiwayatAktivitasPage } from './pages/RiwayatAktivitasPage';
import { MateriPromosiPage } from './pages/MateriPromosiPage';
import { ChatReguPage } from './pages/ChatReguPage';
import { PengaturanPage } from './pages/PengaturanPage';
import { SplashScreen } from './pages/SplashScreen';
import { ErrorPage } from './pages/ErrorPage';
import { DetailProgramPage } from './pages/DetailProgramPage';
import { Toaster } from './components/ui/sonner';

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
  | 'error'
  | 'offline';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
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
        return <RegisterSuccessPage onComplete={() => setCurrentPage('onboarding')} />;
      
      case 'otp':
        return (
          <OTPVerificationPage
            phoneNumber={phoneNumber}
            onVerify={() => setCurrentPage('onboarding')}
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
        return <ReguPage onBack={() => setCurrentPage('profil')} onNavigate={handleNavigation} />;
      
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
      
      case 'chat-regu':
        return <ChatReguPage onBack={() => setCurrentPage('regu')} />;
      
      case 'pengaturan':
        return <PengaturanPage onBack={() => setCurrentPage('profil')} />;
      
      case 'error':
        return (
          <ErrorPage
            type="error"
            onRetry={() => setCurrentPage('dashboard')}
            onHome={() => setCurrentPage('dashboard')}
          />
        );
      
      case 'offline':
        return (
          <ErrorPage
            type="offline"
            onRetry={() => setCurrentPage('dashboard')}
            onHome={() => setCurrentPage('dashboard')}
          />
        );
      
      default:
        return <DashboardPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster position="top-center" />
    </>
  );
}