import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { getInitials } from '../lib/utils';
import { useAppContext } from '../contexts/AppContext';
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

interface ProfilPageProps {
  onNavigate?: (page: 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'program') => void;
}

export function ProfilPage({ onNavigate }: ProfilPageProps) {
  const { user, logout } = useAppContext();
  
  const handleNavigation = (item: 'dashboard' | 'donatur' | 'laporan' | 'profil') => {
    onNavigate?.(item);
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    logout();
    window.location.reload(); // Refresh to go back to login
  };

  const menuSections = [
    {
      title: 'Akun',
      items: [
        { icon: User, label: 'Edit Profil', onClick: () => console.log('Edit profil') },
        { icon: Phone, label: 'Nomor WhatsApp', value: user?.phone || '-' },
        { icon: Users, label: 'Regu Saya', onClick: () => onNavigate?.('regu'), value: user?.regu_id ? 'Regu ' + user.regu_id : 'Belum ditentukan' },
      ]
    },
    {
      title: 'Konten',
      items: [
        { icon: FileText, label: 'Template Pesan', onClick: () => onNavigate?.('template') },
        { icon: MessageSquare, label: 'Materi Promosi', onClick: () => onNavigate?.('materi-promosi') },
      ]
    },
    {
      title: 'Pengaturan',
      items: [
        { icon: Bell, label: 'Notifikasi', onClick: () => onNavigate?.('notifikasi') },
        { icon: Moon, label: 'Mode Gelap', onClick: () => console.log('Dark mode') },
        { icon: HelpCircle, label: 'Bantuan & FAQ', onClick: () => console.log('Bantuan') },
        { icon: Settings, label: 'Pengaturan Lainnya', onClick: () => onNavigate?.('pengaturan') },
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
              <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl">
                {getInitials(user?.full_name || 'Relawan')}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-gray-900 mb-1">{user?.full_name || 'Relawan'}</h3>
            <p className="text-gray-500 mb-2">{user?.city || 'Kota belum diisi'}</p>
            <div className="inline-flex px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
              {user?.role === 'admin' ? 'Admin' : 'Relawan'}
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
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.onClick}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
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
                </button>
              ))}
            </div>
          </Card>
        ))}

        {/* Logout Button */}
        <button className="w-full p-4 flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span>Keluar</span>
        </button>

        <p className="text-center text-gray-400 mt-4 mb-4">
          Versi 1.0.0
        </p>
      </div>

      <BottomNavigation active="profil" onNavigate={handleNavigation} />
    </div>
  );
}