import { useState } from 'react';
import { ArrowLeft, DollarSign, Users, TrendingUp, Award, RefreshCcw, Download, Loader2, Settings, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { formatCurrency, getInitials } from '../lib/utils';
import { toast } from 'sonner@2.0.3';
import { useAdminStats } from '../hooks/useAdminStats';
import { StatsCardSkeleton, LeaderboardSkeleton } from '../components/LoadingState';

interface AdminDashboardPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function AdminDashboardPage({ onBack, onNavigate }: AdminDashboardPageProps) {
  const { globalStats, reguStats, loading, error, refetch } = useAdminStats();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    toast.success('Data berhasil diperbarui!');
  };

  const handleExport = () => {
    toast.success('Mengekspor laporan...');
    // In real implementation, this would generate and download a report
  };

  const totalTarget = reguStats.reduce((sum, regu) => sum + regu.target, 0);
  const totalAchieved = reguStats.reduce((sum, regu) => sum + regu.total_donations, 0);
  const globalProgress = (totalAchieved / totalTarget) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="text-white">Dashboard Admin</h2>
            <p className="text-purple-100">Monitoring & Analytics</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/20 border-white/40 text-white hover:bg-white/30"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {loading ? (
          <>
            {/* Loading Stats */}
            <StatsCardSkeleton count={4} />
            
            {/* Loading Leaderboard */}
            <div className="mt-6">
              <LeaderboardSkeleton count={5} />
            </div>
          </>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-2">❌ {error}</p>
            <Button onClick={refetch} variant="outline" size="sm">
              Coba Lagi
            </Button>
          </Card>
        ) : (
          <>
            {/* Global Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="p-4">
                <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-gray-500 mb-1">Total Donasi</p>
                <h3 className="text-gray-900">{formatCurrency(globalStats.total_donations)}</h3>
              </Card>
              
              <Card className="p-4">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-gray-500 mb-1">Total Muzakki</p>
                <h3 className="text-gray-900">{globalStats.total_muzakki}</h3>
              </Card>
              
              <Card className="p-4">
                <Award className="h-8 w-8 text-purple-600 mb-2" />
                <p className="text-gray-500 mb-1">Total Relawan</p>
                <h3 className="text-gray-900">{globalStats.total_relawan}</h3>
              </Card>
              
              <Card className="p-4">
                <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
                <p className="text-gray-500 mb-1">Total Regu</p>
                <h3 className="text-gray-900">{globalStats.total_regu}</h3>
              </Card>
            </div>

            {/* Global Progress */}
            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-900">Progress Global</h4>
                <span className="text-purple-600">{Math.round(globalProgress)}%</span>
              </div>
              <Progress value={globalProgress} className="h-3 mb-3" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Tercapai</p>
                  <p className="text-green-600">{formatCurrency(totalAchieved)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Target</p>
                  <p className="text-gray-900">{formatCurrency(totalTarget)}</p>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="regu" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="regu">Leaderboard Regu</TabsTrigger>
                <TabsTrigger value="category">Per Kategori</TabsTrigger>
              </TabsList>

              <TabsContent value="regu" className="space-y-3">
                {reguStats.map((regu, index) => {
                  const progress = (regu.total_donations / regu.target) * 100;
                  const ranking = index + 1;
                  
                  return (
                    <Card key={regu.id} className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          ranking === 1 ? 'bg-yellow-100' :
                          ranking === 2 ? 'bg-gray-100' :
                          ranking === 3 ? 'bg-orange-100' :
                          'bg-blue-50'
                        }`}>
                          {ranking <= 3 ? (
                            <span className="text-xl">
                              {ranking === 1 ? '🥇' : ranking === 2 ? '🥈' : '🥉'}
                            </span>
                          ) : (
                            <span className="text-gray-600">#{ranking}</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-1">{regu.name}</h4>
                          <p className="text-gray-600 mb-2">
                            Pembimbing: {regu.pembimbing_name}
                          </p>
                          
                          <div className="flex gap-3 mb-3">
                            <Badge className="bg-blue-100 text-blue-700 border-none">
                              {regu.member_count} Anggota
                            </Badge>
                            <Badge className="bg-green-100 text-green-700 border-none">
                              {regu.total_muzakki} Muzakki
                            </Badge>
                          </div>

                          <Progress value={progress} className="h-2 mb-2" />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-green-600">
                              {formatCurrency(regu.total_donations)}
                            </span>
                            <span className="text-gray-500">
                              Target: {formatCurrency(regu.target)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="category" className="space-y-3">
                {Object.entries(globalStats.by_category).map(([category, amount]) => {
                  const percentage = (amount / globalStats.total_donations) * 100;
                  const colors = {
                    zakat: { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-600' },
                    infaq: { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-600' },
                    sedekah: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-600' },
                    wakaf: { bg: 'bg-gray-100', text: 'text-gray-700', bar: 'bg-gray-600' }
                  };
                  const color = colors[category as keyof typeof colors];

                  return (
                    <Card key={category} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center`}>
                            <span className="capitalize">{category.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <h4 className="text-gray-900 capitalize">{category}</h4>
                            <p className={`${color.text}`}>{Math.round(percentage)}%</p>
                          </div>
                        </div>
                        <p className="text-gray-900">{formatCurrency(amount)}</p>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${color.bar} transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>

            {/* Admin Tools & Export Buttons */}
            <div className="space-y-3 mt-4">
              <Button
                onClick={() => onNavigate?.('admin-validasi-donasi')}
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Validasi Donasi
                {globalStats.pendingDonations && globalStats.pendingDonations > 0 && (
                  <Badge className="ml-2 bg-yellow-500">{globalStats.pendingDonations}</Badge>
                )}
              </Button>

              <Button
                onClick={() => onNavigate?.('admin-tools')}
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin Tools
              </Button>

              <Button
                onClick={handleExport}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Ekspor Laporan Lengkap
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}