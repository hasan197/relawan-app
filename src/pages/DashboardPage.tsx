import { useState } from 'react';
import { Bell, TrendingUp, Users, DollarSign, Target, Plus, Send, FileText, Gift, MessageSquare, BarChart3, Award, CalendarCheck, QrCode, Settings, Sparkles, ArrowUpRight } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatCurrency, formatRelativeTime, getInitials } from '../lib/utils';
import { Progress } from '../components/ui/progress';
import { MotivationalBanner } from '../components/MotivationalBanner';
import { BottomNavigation } from '../components/BottomNavigation';
import { useAppContext } from '../contexts/AppContext';
import { useStatistics } from '../hooks/useStatistics';
import { motion } from 'motion/react';

interface DashboardPageProps {
  onNavigate?: (page: any) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeNav, setActiveNav] = useState<'dashboard' | 'donatur' | 'laporan' | 'profil'>('dashboard');
  const { user } = useAppContext();
  const { statistics, loading } = useStatistics(user?.id || null);

  const handleNavigation = (item: 'dashboard' | 'donatur' | 'laporan' | 'profil') => {
    setActiveNav(item);
    onNavigate?.(item);
  };

  const handleQuickMenuClick = (menuId: string) => {
    console.log('Quick menu clicked:', menuId);
    onNavigate?.(menuId as any);
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const totalDonations = statistics?.total_donations || 0;
  const totalMuzakki = statistics?.total_muzakki || 0;
  const monthlyTarget = statistics?.monthly_target || 15000000;
  const monthlyProgress = (totalDonations / monthlyTarget) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-100 text-sm">{getGreeting()},</p>
            <h2 className="text-white text-xl">{user?.full_name || 'Relawan'}</h2>
          </div>
          <button
            onClick={() => onNavigate?.('notifikasi')}
            className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <Bell className="h-5 w-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Total Donasi Card - UPGRADED DESIGN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 border-none shadow-xl">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white rounded-full"></div>
            </div>
            
            {/* Sparkle Icon */}
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-6 w-6 text-yellow-300" />
              </motion.div>
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-white/25 backdrop-blur-sm rounded-lg shadow-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-white/95 text-sm">Total Donasi Terkumpul</p>
                  </div>
                  
                  <motion.h3 
                    className="text-white text-3xl mb-2 drop-shadow-lg"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                  >
                    {loading ? '...' : formatCurrency(totalDonations)}
                  </motion.h3>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-400/40 backdrop-blur-sm rounded-full border border-white/20">
                      <TrendingUp className="h-3 w-3 text-white" />
                      <span className="text-white text-xs">+12%</span>
                    </div>
                    <span className="text-white/90 text-xs">bulan ini</span>
                  </div>
                </div>
              </div>

              {/* Stats Mini Cards */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-3 bg-white/15 backdrop-blur-sm rounded-lg border border-white/25 shadow-lg">
                  <p className="text-white/90 text-xs mb-1">Muzakki Aktif</p>
                  <p className="text-white text-lg drop-shadow">{loading ? '...' : totalMuzakki}</p>
                </div>
                <div className="p-3 bg-white/15 backdrop-blur-sm rounded-lg border border-white/25 shadow-lg">
                  <p className="text-white/90 text-xs mb-1">Target Bulan Ini</p>
                  <p className="text-white text-lg drop-shadow">{Math.round(monthlyProgress)}%</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => onNavigate?.('tambah-prospek')}
                  className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Donatur
                </Button>
                <Button
                  onClick={() => handleNavigation('laporan')}
                  className="bg-white/25 text-white hover:bg-white/35 backdrop-blur-sm border border-white/30 shadow-lg"
                  size="sm"
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Lihat Laporan
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Motivational Banner */}
      <div className="mt-4">
        <MotivationalBanner />
      </div>

      {/* Quick Menu - 8 Shortcuts */}
      <div className="mt-4 px-4">
        <h3 className="text-gray-900 mb-3">Menu Cepat</h3>
        <div className="grid grid-cols-4 gap-3">
          <QuickMenuItem
            icon={<Users className="h-5 w-5" />}
            label="Regu"
            onClick={() => handleQuickMenuClick('regu')}
          />
          <QuickMenuItem
            icon={<MessageSquare className="h-5 w-5" />}
            label="Template"
            onClick={() => handleQuickMenuClick('template-pesan')}
          />
          <QuickMenuItem
            icon={<Gift className="h-5 w-5" />}
            label="Program"
            onClick={() => handleQuickMenuClick('program')}
          />
          <QuickMenuItem
            icon={<FileText className="h-5 w-5" />}
            label="Generator"
            onClick={() => handleQuickMenuClick('generator-resi')}
          />
          <QuickMenuItem
            icon={<Send className="h-5 w-5" />}
            label="Follow Up"
            onClick={() => handleQuickMenuClick('reminder-follow-up')}
          />
          <QuickMenuItem
            icon={<BarChart3 className="h-5 w-5" />}
            label="Laporan"
            onClick={() => handleNavigation('laporan')}
          />
          <QuickMenuItem
            icon={<CalendarCheck className="h-5 w-5" />}
            label="Aktivitas"
            onClick={() => handleQuickMenuClick('riwayat-aktivitas')}
          />
          <QuickMenuItem
            icon={<Award className="h-5 w-5" />}
            label="Materi"
            onClick={() => handleQuickMenuClick('materi-promosi')}
          />
          {user?.role === 'admin' && (
            <QuickMenuItem
              icon={<Settings className="h-5 w-5" />}
              label="Admin Tools"
              onClick={() => onNavigate?.('admin-tools')}
            />
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="px-4 my-6">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Recent Activities */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900">Aktivitas Terbaru</h3>
          <button
            onClick={() => onNavigate?.('riwayat-aktivitas')}
            className="text-primary-600 text-sm"
          >
            Lihat Semua
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <Card className="p-4">
              <p className="text-center text-gray-500">Memuat aktivitas...</p>
            </Card>
          ) : statistics?.recent_activities && statistics.recent_activities.length > 0 ? (
            statistics.recent_activities.slice(0, 5).map((activity) => (
              <Card key={activity.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'donation' ? 'bg-green-100' :
                    activity.type === 'follow-up' ? 'bg-blue-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'donation' ? (
                      <DollarSign className="h-4 w-4 text-green-600" />
                    ) : activity.type === 'follow-up' ? (
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Send className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm">{activity.title}</p>
                    {activity.muzakki_name && (
                      <p className="text-gray-500 text-sm">{activity.muzakki_name}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {formatRelativeTime(activity.time)}
                    </p>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className="text-green-600 font-medium text-sm">
                        +{formatCurrency(activity.amount)}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-2">📋</div>
              <p className="text-gray-500">Belum ada aktivitas</p>
              <p className="text-gray-400 text-sm mt-1">
                Mulai tambahkan muzakki dan donasi
              </p>
            </Card>
          )}
        </div>
      </div>

      <BottomNavigation active={activeNav} onNavigate={handleNavigation} />
    </div>
  );
}

// Quick Menu Item Component
interface QuickMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function QuickMenuItem({ icon, label, onClick }: QuickMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
    >
      <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
        {icon}
      </div>
      <span className="text-xs text-gray-700 text-center leading-tight">
        {label}
      </span>
    </button>
  );
}