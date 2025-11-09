import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { currentUser } from '../lib/mockData';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { getInitials } from '../lib/utils';
import { 
  User, 
  Phone, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell,
  Moon,
  HelpCircle
} from 'lucide-react';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'program' | 'login' | 'regu' | 'notifikasi' | 'materi-promosi' | 'pengaturan' | 'import-kontak' | 'tambah-prospek' | 'generator-resi' | 'chat-regu' | 'register-success' | 'reminder-followup' | 'riwayat-aktivitas' | 'ucapan-terimakasih' | 'detail-program' | 'detail-prospek' | 'onboarding' | 'splash' | 'error';

interface ProfilPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function ProfilPage({ onNavigate }: ProfilPageProps) {
  const handleNavigation = (page: string) => {
    console.log(`Navigation requested to: ${page}`);
    if (onNavigate) {
      console.log('Calling onNavigate with:', page);
      onNavigate(page as any);
    } else {
      console.error('onNavigate is not defined!');
    }
  };

  const handleLogout = () => {
    // Hapus token jika ada
    localStorage.removeItem('token');
    // Arahkan ke halaman login
    onNavigate?.('login');
  };

  const menuSections = [
    {
      title: 'Akun',
      items: [
        { 
          icon: User, 
          label: 'Edit Profil', 
          onClick: () => {
            console.log('Navigating to edit profile');
            onNavigate?.('profil');
          } 
        },
        { 
          icon: Phone, 
          label: 'Nomor WhatsApp', 
          value: currentUser.phone,
          onClick: () => {}
        },
        { 
          icon: Users, 
          label: 'Regu Saya', 
          onClick: () => {
            console.log('Navigating to regu');
            onNavigate?.('regu');
          }, 
          value: currentUser.reguName 
        },
      ]
    },
    {
      title: 'Konten',
      items: [
        { 
          icon: FileText, 
          label: 'Template Pesan', 
          onClick: () => {
            console.log('Navigating to template');
            onNavigate?.('template');
          } 
        },
        { 
          icon: MessageSquare, 
          label: 'Materi Promosi', 
          onClick: () => {
            console.log('Navigating to materi-promosi');
            onNavigate?.('materi-promosi');
          } 
        },
      ]
    },
    {
      title: 'Pengaturan',
      items: [
        { 
          icon: Bell, 
          label: 'Notifikasi', 
          onClick: () => {
            console.log('Navigating to notifikasi');
            onNavigate?.('notifikasi');
          } 
        },
        { 
          icon: Moon, 
          label: 'Mode Gelap', 
          onClick: () => {
            console.log('Toggling dark mode');
            // Add dark mode toggle logic here
          } 
        },
        { 
          icon: HelpCircle, 
          label: 'Bantuan & FAQ', 
          onClick: () => {
            console.log('Opening help');
            // Add help navigation logic here
          } 
        },
        { 
          icon: Settings, 
          label: 'Pengaturan', 
          onClick: () => {
            console.log('Navigating to pengaturan');
            onNavigate?.('pengaturan');
          } 
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header 
        onNotificationClick={() => onNavigate?.('notifikasi')}
        onStatsClick={() => onNavigate?.('laporan')}
      />
      
      <div className="px-4 -mt-4">
        {/* Profile Card */}
        <Card className="p-6 shadow-card mb-4">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-4 border-primary-100">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-gray-900 mb-1">{currentUser.name}</h3>
            <p className="text-gray-500 mb-2">{currentUser.reguName}</p>
            <div className="inline-flex px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
              Relawan
            </div>
          </div>
        </Card>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="mb-4 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h4 className="text-gray-700">{section.title}</h4>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, itemIndex) => {
                console.log(`Rendering menu item: ${item.label}`, { hasOnClick: !!item.onClick });
                return (
                  <div 
                    key={itemIndex}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(`Menu item clicked: ${item.label}`);
                      if (item.onClick) {
                        console.log(`Calling onClick for: ${item.label}`);
                        item.onClick();
                      } else {
                        console.warn(`No onClick handler for: ${item.label}`);
                      }
                    }}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-gray-500">{item.value}</span>
                      )}
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full p-4 flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Keluar</span>
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Aplikasi Relawan ZISWAF
          </p>
          <div className="mt-1 text-xs text-gray-400">
            <p>Versi {import.meta.env.VITE_APP_VERSION || '1.0.0'}</p>
            <p>Dibangun pada: {new Date(import.meta.env.VITE_APP_BUILD_DATE || new Date().toISOString()).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      </div>

      <BottomNavigation active="profil" onNavigate={handleNavigation} />
    </div>
  );
}