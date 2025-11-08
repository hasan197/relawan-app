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
import { Toaster } from './components/ui/sonner';

type Page = 
  | 'login'
  | 'otp'
  | 'onboarding'
  | 'dashboard'
  | 'donatur'
  | 'laporan'
  | 'profil'
  | 'template'
  | 'program'
  | 'detail-prospek'
  | 'tambah-prospek'
  | 'regu'
  | 'generator-resi'
  | 'notifikasi'
  | 'import-kontak';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
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
        return <ReguPage onBack={() => setCurrentPage('profil')} />;
      
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