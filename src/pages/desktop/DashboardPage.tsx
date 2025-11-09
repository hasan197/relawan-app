import { useState, useCallback } from 'react';
import { TotalDonationCard } from '../../components/TotalDonationCard';
import { RecentActivities } from '../../components/RecentActivities';
import { CategoryCards } from '../../components/CategoryCards';
import { TargetProgress } from '../../components/TargetProgress';
import { mockActivities, mockTarget } from '../../lib/mockData';
import { toast } from 'sonner';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

interface DashboardPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('dashboard');
  const [isSalurkanInProgress, setIsSalurkanInProgress] = useState(false);

  const handleNavigation = useCallback((item: NavigatePage) => {
    if (isSalurkanInProgress && item !== 'dashboard') {
      toast.error('Harap selesaikan proses salurkan terlebih dahulu');
      return;
    }
    setActiveNav(item);
    onNavigate?.(item);
  }, [isSalurkanInProgress, onNavigate]);

  return (
    <DesktopLayout
      activeNav={activeNav}
      onNavigate={handleNavigation}
      onNotificationClick={() => handleNavigation('pengaturan')}
      onStatsClick={() => handleNavigation('laporan')}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Selamat Datang Kembali! 👋</h1>
              <p className="text-primary-100 mb-6 mt-1">
                Mari terus berjuang untuk kebaikan bersama. Progress Anda hari ini:
              </p>
            </div>
            <div className="text-right">
              <p className="text-primary-100 text-sm">Hari ini</p>
              <p className="text-lg font-bold">Sabtu, 9 Nov 2024</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-3">
            <TotalDonationCard
              total={12450000}
              increase={450000}
              onSalurkan={() => {
                setIsSalurkanInProgress(true);
                toast.success('Proses salurkan dimulai');
              }}
              onTambahDonatur={() => handleNavigation('donatur')}
              onLaporan={() => handleNavigation('laporan')}
            />
          </div>
          
          <div>
            <TargetProgress target={mockTarget} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Donatur</p>
                <p className="text-lg font-bold text-gray-900">12</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-1">+2 minggu ini</p>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Follow-up Aktif</p>
                <p className="text-lg font-bold text-gray-900">8</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-1">3 perlu tindakan</p>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Program Aktif</p>
                <p className="text-lg font-bold text-gray-900">4</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-1">Semua berjalan baik</p>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Ranking Regu</p>
                <p className="text-lg font-bold text-gray-900">#2</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-1">Naik 1 peringkat</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-3">
            <RecentActivities 
              activities={mockActivities}
              onViewAll={() => console.log('View all activities')}
            />
          </div>
          
          <div>
            <CategoryCards 
              onCategoryClick={(id) => {
                if (id === 'regu') {
                  handleNavigation('regu');
                } else if (id === 'template') {
                  handleNavigation('template');
                } else {
                  handleNavigation('donatur');
                }
              }}
            />
          </div>
        </div>
      </div>
    </DesktopLayout>
  );
}

// Import icons used in the component
import { Users, MessageSquare, BarChart3, TrendingUp } from 'lucide-react';