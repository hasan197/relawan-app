import { useState } from 'react';
import { Header } from '../components/Header';
import { TotalDonationCard } from '../components/TotalDonationCard';
import { RecentActivities } from '../components/RecentActivities';
import { QuickMenuCards } from '../components/QuickMenuCards';
import { QuickStatsCards } from '../components/QuickStatsCards';
import { TargetProgress } from '../components/TargetProgress';
import { MotivationalBanner } from '../components/MotivationalBanner';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockActivities, mockTarget } from '../lib/mockData';

interface DashboardPageProps {
  onNavigate?: (page: any) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeNav, setActiveNav] = useState<'dashboard' | 'donatur' | 'laporan' | 'profil'>('dashboard');

  const handleNavigation = (item: 'dashboard' | 'donatur' | 'laporan' | 'profil') => {
    setActiveNav(item);
    onNavigate?.(item);
  };

  const handleQuickMenuClick = (menuId: string) => {
    console.log('Quick menu clicked:', menuId);
    onNavigate?.(menuId as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <Header 
        onNotificationClick={() => onNavigate?.('notifikasi')}
        onStatsClick={() => onNavigate?.('laporan')}
      />
      
      {/* Main Card - Total Donasi */}
      <div className="px-4 pt-4">
        <TotalDonationCard
          total={12450000}
          increase={450000}
          onSalurkan={() => onNavigate?.('generator-resi')}
          onTambahDonatur={() => handleNavigation('donatur')}
          onLaporan={() => handleNavigation('laporan')}
        />
      </div>

      {/* Motivational Quote */}
      <div className="mt-6">
        <MotivationalBanner />
      </div>

      {/* Menu Cepat - Menggantikan Kategori ZISWAF */}
      <div className="mt-2">
        <QuickMenuCards onMenuClick={handleQuickMenuClick} />
      </div>

      {/* Quick Stats */}
      <div className="mt-4">
        <QuickStatsCards 
          totalMuzakki={24}
          activeConversations={8}
          completionRate={75}
          rank={3}
        />
      </div>

      {/* Target Progress */}
      <div className="mt-4 px-4">
        <TargetProgress target={mockTarget} />
      </div>

      {/* Divider */}
      <div className="px-4 my-6">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Aktivitas Terbaru */}
      <div className="mb-6">
        <RecentActivities 
          activities={mockActivities}
          onViewAll={() => onNavigate?.('riwayat-aktivitas')}
        />
      </div>

      <BottomNavigation active={activeNav} onNavigate={handleNavigation} />
    </div>
  );
}