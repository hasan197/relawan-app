import { BottomNavigation } from '../components/BottomNavigation';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { getInitials, formatCurrency } from '../lib/utils';
import { useAppContext } from '../contexts/AppContext';
import { useStatistics } from '../hooks/useStatistics';
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
  HelpCircle,
  QrCode,
  Plus,
  List,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  Edit,
  Shield,
  BookOpen,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfilPageProps {
  onNavigate?: (page: 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'program') => void;
}

export function ProfilPage({ onNavigate }: ProfilPageProps) {
  const { user, logout } = useAppContext();
  const { statistics, loading } = useStatistics(user?.id || null);
  
  const handleNavigation = (item: 'dashboard' | 'donatur' | 'laporan' | 'profil') => {
    onNavigate?.(item);
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    logout();
    window.location.reload(); // Refresh to go back to login
  };

  // Icon colors mapping for different menu items
  const iconColors: { [key: string]: string } = {
    'Edit Profil': 'text-blue-500 bg-blue-50',
    'Nomor WhatsApp': 'text-green-500 bg-green-50',
    'Regu Saya': 'text-purple-500 bg-purple-50',
    'Kelola Semua Regu': 'text-indigo-500 bg-indigo-50',
    'Buat Regu Baru': 'text-teal-500 bg-teal-50',
    'QR Code Regu': 'text-cyan-500 bg-cyan-50',
    'Chat Regu': 'text-pink-500 bg-pink-50',
    'Template Pesan': 'text-orange-500 bg-orange-50',
    'Materi Promosi': 'text-rose-500 bg-rose-50',
    'Notifikasi': 'text-amber-500 bg-amber-50',
    'Mode Gelap': 'text-slate-500 bg-slate-50',
    'Bantuan & FAQ': 'text-emerald-500 bg-emerald-50',
    'Pengaturan Lainnya': 'text-gray-500 bg-gray-50',
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
    // ✅ Only show "Regu & Kolaborasi" section if user is pembimbing or admin
    ...(user?.role === 'admin' || user?.role === 'pembimbing' ? [{
      title: 'Regu & Kolaborasi',
      items: [
        ...(user?.role === 'pembimbing' ? [
          { icon: List, label: 'Kelola Semua Regu', onClick: () => onNavigate?.('my-regus'), badge: 'Pembimbing' },
          { icon: Plus, label: 'Buat Regu Baru', onClick: () => onNavigate?.('create-regu'), badge: null }
        ] : []),
        { icon: QrCode, label: 'QR Code Regu', onClick: () => onNavigate?.('regu-qr-code'), badge: user?.regu_id ? 'Aktif' : null },
        { icon: MessageSquare, label: 'Chat Regu', onClick: () => onNavigate?.('chat-regu') },
      ]
    }] : []),
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

  // Get role badge color
  const getRoleBadgeStyle = () => {
    if (user?.role === 'admin') return 'bg-gradient-to-r from-red-500 to-orange-500 text-white';
    if (user?.role === 'pembimbing') return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
    return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
  };

  const getRoleIcon = () => {
    if (user?.role === 'admin') return Shield;
    if (user?.role === 'pembimbing') return BookOpen;
    return Zap;
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pb-24">
      {/* Modern Header with Gradient */}
      <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 pt-6 pb-32 px-4 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-white/80 text-sm mb-1">Profil Saya</p>
              <h1 className="text-white text-2xl">Halo, {user?.full_name?.split(' ')[0] || 'Relawan'}! 👋</h1>
            </div>
            <Button
              onClick={() => console.log('Edit profil')}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30"
              size="sm"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-24 relative z-10">
        {/* Profile Card - Floating Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 shadow-xl bg-white mb-4 border-none">
            <div className="flex flex-col items-center text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Avatar className="h-28 w-28 mb-4 border-4 border-white shadow-xl ring-4 ring-rose-100">
                  <AvatarFallback className="bg-gradient-to-br from-rose-400 to-fuchsia-500 text-white text-3xl">
                    {getInitials(user?.full_name || 'Relawan')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              <h3 className="text-gray-900 text-xl mb-1">{user?.full_name || 'Relawan'}</h3>
              <p className="text-gray-500 mb-3 flex items-center gap-1">
                📍 {user?.city || 'Kota belum diisi'}
              </p>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getRoleBadgeStyle()} shadow-lg`}>
                <RoleIcon className="h-4 w-4" />
                <span className="text-sm">
                  {user?.role === 'admin' ? 'Admin' : user?.role === 'pembimbing' ? 'Pembimbing' : 'Relawan'}
                </span>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 gap-3 w-full mt-5 pt-5 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl text-gray-900 mb-1">{loading ? '...' : statistics?.total_muzakki || 0}</p>
                  <p className="text-gray-500 text-xs">Muzakki</p>
                </div>
                <div className="text-center border-x border-gray-100">
                  <p className="text-2xl text-gray-900 mb-1">
                    {loading ? '...' : Math.round((statistics?.total_donations || 0) / (statistics?.monthly_target || 15000000) * 100)}%
                  </p>
                  <p className="text-gray-500 text-xs">Target</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-gray-900 mb-1">#12</p>
                  <p className="text-gray-500 text-xs">Peringkat</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Menu Sections - Modern Card Design */}
        {menuSections.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + (sectionIndex * 0.1) }}
          >
            <Card className="mb-4 overflow-hidden shadow-md border-none">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <h4 className="text-gray-800">{section.title}</h4>
              </div>
              <div className="divide-y divide-gray-50">
                {section.items.map((item, itemIndex) => (
                  <motion.button
                    key={itemIndex}
                    onClick={item.onClick}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all group"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${iconColors[item.label] || 'text-gray-400 bg-gray-50'} transition-transform group-hover:scale-110`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-gray-500 text-sm">{item.value}</span>
                      )}
                      {item.badge && (
                        <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full shadow-sm">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Logout Button - Enhanced Design */}
        <motion.button 
          className="w-full p-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 rounded-xl hover:from-red-100 hover:to-pink-100 transition-all shadow-md border border-red-100" 
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <LogOut className="h-5 w-5" />
          <span>Keluar dari Akun</span>
        </motion.button>

        <motion.p 
          className="text-center text-gray-400 mt-6 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ZISWAF Manager • Versi 1.0.0
        </motion.p>
      </div>

      {/* Bottom Navigation - Fixed to Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation active="profil" onNavigate={handleNavigation} />
      </div>
    </div>
  );
}