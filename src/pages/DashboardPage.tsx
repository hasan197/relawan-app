import { useState } from 'react';
import { Bell, TrendingUp, Users, DollarSign, Target, Plus, Send, FileText, Gift, MessageSquare, BarChart3, Award, CalendarCheck, QrCode, Settings } from 'lucide-react';
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

        {/* Total Donasi Card */}
        <Card className="p-5 bg-white/95 backdrop-blur">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Donasi Terkumpul</p>
              <h3 className="text-2xl text-gray-900 mb-1">
                {loading ? '...' : formatCurrency(totalDonations)}
              </h3>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 text-sm">+12% bulan ini</span>
              </div>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
            <Button
              onClick={() => onNavigate?.('tambah-prospek')}
              className="bg-primary-600 hover:bg-primary-700 text-sm"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Tambah Donatur
            </Button>
            <Button
              onClick={() => handleNavigation('laporan')}
              variant="outline"
              className="text-sm"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-1" />
              Lihat Laporan
            </Button>
          </div>
        </Card>
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

      {/* Quick Stats Cards */}
      <div className="mt-4 px-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary-600" />
              <Badge className="bg-primary-100 text-primary-700 border-none text-xs">
                Aktif
              </Badge>
            </div>
            <p className="text-2xl text-gray-900 mb-1">
              {loading ? '...' : totalMuzakki}
            </p>
            <p className="text-gray-500 text-sm">Total Muzakki</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700 border-none text-xs">
                {Math.round(monthlyProgress)}%
              </Badge>
            </div>
            <p className="text-2xl text-gray-900 mb-1">
              {loading ? '...' : formatCurrency(monthlyTarget - totalDonations)}
            </p>
            <p className="text-gray-500 text-sm">Sisa Target</p>
          </Card>
        </div>
      </div>

      {/* Target Progress */}
      <div className="mt-4 px-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-900 mb-1">Target Bulanan</p>
              <p className="text-2xl text-gray-900">{Math.round(monthlyProgress)}%</p>
            </div>
            <div className="text-right">
              <p className="text-primary-600">{formatCurrency(totalDonations)}</p>
              <p className="text-gray-500 text-sm">dari {formatCurrency(monthlyTarget)}</p>
            </div>
          </div>
          <Progress value={monthlyProgress} className="h-2" />
        </Card>
      </div>

      {/* QR Code Regu - Featured Card */}
      {user?.regu_id && (user?.role === 'admin' || user?.role === 'pembimbing') && (
        <div className="mt-4 px-4">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-primary-50 border-primary-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600 rounded-xl">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 mb-1">QR Code Regu</h4>
                <p className="text-gray-600 text-sm">
                  Share untuk undang anggota baru
                </p>
              </div>
              <Button
                onClick={() => onNavigate?.('regu-qr-code')}
                className="bg-primary-600 hover:bg-primary-700"
                size="sm"
              >
                Buka
              </Button>
            </div>
          </Card>
        </div>
      )}

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