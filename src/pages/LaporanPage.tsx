import { useState } from 'react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockLeaderboard, mockTarget, mockDonations } from '../lib/mockData';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { getInitials, formatCurrency } from '../lib/utils';
import { Trophy, TrendingUp, Calendar, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MessageCircle } from 'lucide-react';

interface LaporanPageProps {
  onNavigate?: (page: 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'program') => void;
}

export function LaporanPage({ onNavigate }: LaporanPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('bulan-ini');

  const handleNavigation = (item: 'dashboard' | 'donatur' | 'laporan' | 'profil') => {
    onNavigate?.(item);
  };

  const getTotalByCategory = () => {
    const totals = {
      zakat: 0,
      infaq: 0,
      sedekah: 0,
      wakaf: 0
    };
    
    mockDonations.filter(d => d.type === 'incoming').forEach(donation => {
      totals[donation.category] += donation.amount;
    });
    
    return totals;
  };

  const categoryTotals = getTotalByCategory();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header 
        onNotificationClick={() => onNavigate?.('notifikasi')}
        onStatsClick={() => onNavigate?.('laporan')}
      />
      
      <div className="px-4 -mt-4">
        <Card className="p-4 shadow-card mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Laporan & Statistik</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => onNavigate?.('riwayat-aktivitas')}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Riwayat</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Ekspor</span>
              </button>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {['hari-ini', 'minggu-ini', 'bulan-ini', 'semua'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period === 'hari-ini' ? 'Hari Ini' : period === 'minggu-ini' ? 'Minggu Ini' : period === 'bulan-ini' ? 'Bulan Ini' : 'Semua'}
              </button>
            ))}
          </div>

          <Tabs defaultValue="statistik" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="statistik">Statistik</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            <TabsContent value="statistik" className="mt-4 space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                  <TrendingUp className="h-5 w-5 mb-2 opacity-80" />
                  <p className="mb-1 opacity-90">Total Donasi</p>
                  <h4>{formatCurrency(mockTarget.currentAmount)}</h4>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Calendar className="h-5 w-5 mb-2 opacity-80" />
                  <p className="mb-1 opacity-90">Muzakki Aktif</p>
                  <h4>{mockTarget.currentMuzakki} orang</h4>
                </Card>
              </div>

              {/* Category Breakdown */}
              <Card className="p-4">
                <h4 className="text-gray-900 mb-3">Breakdown per Kategori</h4>
                <div className="space-y-3">
                  {Object.entries(categoryTotals).map(([category, amount]) => {
                    const icons = {
                      zakat: '💰',
                      infaq: '🕋',
                      sedekah: '❤️',
                      wakaf: '🌿'
                    };
                    const colors = {
                      zakat: 'bg-green-100 text-green-700',
                      infaq: 'bg-yellow-100 text-yellow-700',
                      sedekah: 'bg-blue-100 text-blue-700',
                      wakaf: 'bg-gray-100 text-gray-700'
                    };
                    const percentage = mockTarget.currentAmount > 0 
                      ? ((amount / mockTarget.currentAmount) * 100).toFixed(1)
                      : 0;

                    return (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{icons[category as keyof typeof icons]}</div>
                          <div>
                            <p className="text-gray-900 capitalize">{category}</p>
                            <p className="text-gray-500">{percentage}%</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">{formatCurrency(amount)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-4 space-y-4">
              <Card className="p-4">
                <h4 className="text-gray-900 mb-3">Peringkat Regu</h4>
                <div className="space-y-3">
                  {mockLeaderboard.map((entry) => (
                    <div 
                      key={entry.relawanId}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          {entry.rank <= 3 && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white z-10">
                              <Trophy className="h-3 w-3" />
                            </div>
                          )}
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={entry.avatar} />
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {getInitials(entry.relawanName)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary-100 text-primary-700 border-none">
                              #{entry.rank}
                            </Badge>
                            <h4 className="text-gray-900 truncate">{entry.relawanName}</h4>
                          </div>
                          <p className="text-gray-500">{entry.muzakkiCount} muzakki</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-gray-900">{formatCurrency(entry.totalDonations)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <BottomNavigation active="laporan" onNavigate={handleNavigation} />
    </div>
  );
}