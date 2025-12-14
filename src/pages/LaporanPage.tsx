import { useState } from 'react';
import { BottomNavigation } from '../components/BottomNavigation';
import { Header } from '../components/Header';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { getInitials, formatCurrency } from '../lib/utils';
import { Trophy, TrendingUp, Calendar, Download, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { useAppContext } from '../contexts/AppContext';
import { useStatistics } from '../hooks/useStatistics';
import { useRegu } from '../hooks/useRegu';

interface LaporanPageProps {
  onNavigate?: (page: any) => void;
}

export function LaporanPage({ onNavigate }: LaporanPageProps) {
  const [activeNav, setActiveNav] = useState<'dashboard' | 'donatur' | 'laporan' | 'profil'>('laporan');
  const [selectedPeriod, setSelectedPeriod] = useState('bulan-ini');
  const { user } = useAppContext();
  const { statistics, loading: statsLoading } = useStatistics(user?.id || null);
  const { members, loading: reguLoading } = useRegu(user?.regu_id || null);

  const handleNavigation = (item: 'dashboard' | 'donatur' | 'laporan' | 'profil') => {
    setActiveNav(item);
    onNavigate?.(item);
  };

  const categoryTotals = statistics?.donations_by_category || {
    zakat: 0,
    infaq: 0,
    sedekah: 0,
    wakaf: 0
  };

  const totalDonations = statistics?.total_donations || 0;
  const monthlyTarget = statistics?.monthly_target || 15000000;
  const monthlyProgress = (totalDonations / monthlyTarget) * 100;

  // Sort members by total donations for leaderboard
  const leaderboard = [...members].sort((a, b) => 
    (b.total_donations || 0) - (a.total_donations || 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header 
        pageName="Laporan & Statistik"
        onNotificationClick={() => onNavigate?.('notifikasi')}
        onStatsClick={() => onNavigate?.('laporan')}
      />
      
      <div className="px-4 -mt-4">
        {/* Summary Card */}
        <Card className="p-4 shadow-card mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Ringkasan Periode</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1"
            >
              <option value="minggu-ini">Minggu Ini</option>
              <option value="bulan-ini">Bulan Ini</option>
              <option value="tahun-ini">Tahun Ini</option>
            </select>
          </div>

          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <>
              {/* Total Donasi */}
              <div className="mb-4">
                <p className="text-gray-600 text-sm mb-2">Total Donasi</p>
                <p className="text-2xl text-gray-900 mb-2">
                  {formatCurrency(totalDonations)}
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 text-sm">+12% dari periode sebelumnya</span>
                </div>
              </div>

              {/* Target Progress */}
              <div className="mb-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Progress Target Bulanan</p>
                  <span className="text-gray-900">{Math.round(monthlyProgress)}%</span>
                </div>
                <Progress value={monthlyProgress} className="h-2 mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-primary-600 text-sm">
                    {formatCurrency(totalDonations)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    dari {formatCurrency(monthlyTarget)}
                  </span>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="kategori" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="kategori">Per Kategori</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Kategori Tab */}
          <TabsContent value="kategori" className="space-y-3">
            {statsLoading ? (
              <Card className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
              </Card>
            ) : (
              <>
                <CategoryCard
                  title="Zakat"
                  amount={categoryTotals.zakat}
                  color="green"
                  percentage={totalDonations > 0 ? (categoryTotals.zakat / totalDonations) * 100 : 0}
                />
                <CategoryCard
                  title="Infaq"
                  amount={categoryTotals.infaq}
                  color="yellow"
                  percentage={totalDonations > 0 ? (categoryTotals.infaq / totalDonations) * 100 : 0}
                />
                <CategoryCard
                  title="Sedekah"
                  amount={categoryTotals.sedekah}
                  color="blue"
                  percentage={totalDonations > 0 ? (categoryTotals.sedekah / totalDonations) * 100 : 0}
                />
                <CategoryCard
                  title="Wakaf"
                  amount={categoryTotals.wakaf}
                  color="purple"
                  percentage={totalDonations > 0 ? (categoryTotals.wakaf / totalDonations) * 100 : 0}
                />
              </>
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <h3 className="text-gray-900">Top Relawan</h3>
              </div>

              {reguLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada data leaderboard</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.slice(0, 10).map((member, index) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className={`text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {getInitials(member.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">
                          {member.full_name}
                          {member.id === user?.id && (
                            <Badge className="ml-2 bg-primary-600 text-white border-none text-xs">
                              Anda
                            </Badge>
                          )}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {member.total_muzakki || 0} muzakki
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-green-600 font-medium">
                          {formatCurrency(member.total_donations || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Button */}
        <Card className="p-4">
          <button className="w-full flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700">
            <Download className="h-5 w-5" />
            <span>Export Laporan PDF</span>
          </button>
        </Card>
      </div>

      <BottomNavigation active={activeNav} onNavigate={handleNavigation} />
    </div>
  );
}

// Category Card Component
interface CategoryCardProps {
  title: string;
  amount: number;
  color: 'green' | 'yellow' | 'blue' | 'purple';
  percentage: number;
}

function CategoryCard({ title, amount, color, percentage }: CategoryCardProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
            <span className="text-lg">🕌</span>
          </div>
          <div>
            <h4 className="text-gray-900">{title}</h4>
            <p className="text-gray-500 text-sm">{Math.round(percentage)}% dari total</p>
          </div>
        </div>
        <p className="text-gray-900">{formatCurrency(amount)}</p>
      </div>
      <Progress value={percentage} className="h-1" />
    </Card>
  );
}