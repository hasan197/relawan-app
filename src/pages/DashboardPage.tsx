import { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { TotalDonationCard } from '../components/TotalDonationCard';
import { RecentActivities } from '../components/RecentActivities';
import { CategoryCards } from '../components/CategoryCards';
import { TargetProgress } from '../components/TargetProgress';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockActivities, mockTarget } from '../lib/mockData';
import { toast } from 'sonner';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'program' | 'regu' | 'notifikasi' | 'generator-resi';

interface DashboardPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('dashboard');
  const [isSalurkanInProgress, setIsSalurkanInProgress] = useState(false);

  const handleNavigation = useCallback((item: NavigatePage) => {
    if (isSalurkanInProgress && item !== 'dashboard' && item !== 'generator-resi') {
      toast.error('Harap selesaikan proses salurkan terlebih dahulu');
      return;
    }
    setActiveNav(item);
    onNavigate?.(item);
  }, [isSalurkanInProgress, onNavigate]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header 
        onNotificationClick={() => onNavigate?.('notifikasi')}
        onStatsClick={() => onNavigate?.('laporan')}
      />
      
      <TotalDonationCard
        total={12450000}
        increase={450000}
        onSalurkan={() => {
          setIsSalurkanInProgress(true);
          onNavigate?.('generator-resi');
        }}
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
        onCategoryClick={(id) => {
          if (id === 'regu') {
            onNavigate?.('regu');
          } else if (id === 'template') {
            onNavigate?.('template');
          } else {
            onNavigate?.('program');
          }
        }}
      />

      <BottomNavigation active={activeNav} onNavigate={handleNavigation} />
    </div>
  );
}