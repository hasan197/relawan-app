import { useState } from 'react';
import { Header } from '../components/Header';
import { TotalDonationCard } from '../components/TotalDonationCard';
import { RecentActivities } from '../components/RecentActivities';
import { CategoryCards } from '../components/CategoryCards';
import { TargetProgress } from '../components/TargetProgress';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockActivities, mockTarget } from '../lib/mockData';

interface DashboardPageProps {
  onNavigate?: (page: 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'program') => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeNav, setActiveNav] = useState<'dashboard' | 'donatur' | 'laporan' | 'profil'>('dashboard');

  const handleNavigation = (item: 'dashboard' | 'donatur' | 'laporan' | 'profil') => {
    setActiveNav(item);
    onNavigate?.(item);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header 
        onNotificationClick={() => onNavigate?.('notifikasi')}
        onStatsClick={() => onNavigate?.('laporan')}
      />
      
      <TotalDonationCard
        total={12450000}
        increase={450000}
        onSalurkan={() => onNavigate?.('generator-resi')}
        onTambahDonatur={() => handleNavigation('donatur')}
        onLaporan={() => handleNavigation('laporan')}
      />

      <div className="mt-6">
        <TargetProgress target={mockTarget} />
      </div>

      <RecentActivities 
        activities={mockActivities}
        onViewAll={() => console.log('View all activities')}
      />

      <CategoryCards 
        onCategoryClick={(id) => onNavigate?.('program')}
      />

      <BottomNavigation active={activeNav} onNavigate={handleNavigation} />
    </div>
  );
}