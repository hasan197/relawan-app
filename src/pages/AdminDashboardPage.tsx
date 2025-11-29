import { useState } from 'react';
import { ArrowLeft, DollarSign, Users, TrendingUp, Award, RefreshCcw, Download, Loader2, Settings, CheckCircle, Database, Clock, AlertCircle, Target, BarChart3 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { formatCurrency, getInitials } from '../lib/utils';
import { toast } from 'sonner@2.0.3';
import { useAdminStats } from '../hooks/useAdminStats';
import { StatsCardSkeleton, LeaderboardSkeleton } from '../components/LoadingState';
import { BottomNavigation } from '../components/BottomNavigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
  const globalProgress = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

  // Prepare chart data for category breakdown
  const categoryChartData = Object.entries(globalStats.by_category).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
    percentage: globalStats.total_donations > 0 ? ((amount / globalStats.total_donations) * 100).toFixed(1) : 0
  }));

  // Colors for chart
  const COLORS = {
    zakat: '#10b981',
    infaq: '#f59e0b',
    sedekah: '#3b82f6',
    wakaf: '#6b7280'
  };

  // Top performing regu (top 3)
  const topReguStats = reguStats.slice(0, 3);

  // Achievement status
  const achievementRate = globalProgress;
  const achievementStatus = achievementRate >= 100 ? 'excellent' : 
                           achievementRate >= 75 ? 'good' : 
                           achievementRate >= 50 ? 'fair' : 'needs-attention';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded flex items-center justify-center">
                <span className="text-white text-lg font-bold">Z</span>
              </div>
            </div>
            <div className="text-white">
              <h2 className="text-white">Admin Dashboard</h2>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`h-5 w-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
          </button>
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
            {/* Key Metrics - Primary Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  {globalProgress >= 75 && <Badge className="bg-green-600 text-white text-xs">✨ Good</Badge>}
                </div>
                <p className="text-gray-600 text-xs mb-1">Total Donasi</p>
                <h3 className="text-gray-900">{formatCurrency(globalStats.total_donations)}</h3>
                <p className="text-xs text-green-700 mt-1">{Math.round(globalProgress)}% dari target</p>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-600 text-xs mb-1">Target Global</p>
                <h3 className="text-gray-900">{formatCurrency(totalTarget)}</h3>
                <p className="text-xs text-blue-700 mt-1">Sisa {formatCurrency(totalTarget - totalAchieved)}</p>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-gray-600 text-xs mb-1">Total Muzakki</p>
                <h3 className="text-gray-900">{globalStats.total_muzakki}</h3>
                <p className="text-xs text-purple-700 mt-1">Donatur aktif</p>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <Award className="h-8 w-8 text-orange-600" />
                  {globalStats.pendingDonations && globalStats.pendingDonations > 0 && (
                    <Badge className="bg-red-500 text-white text-xs pulse">{globalStats.pendingDonations}</Badge>
                  )}
                </div>
                <p className="text-gray-600 text-xs mb-1">Total Relawan</p>
                <h3 className="text-gray-900">{globalStats.total_relawan}</h3>
                <p className="text-xs text-orange-700 mt-1">Dalam {globalStats.total_regu} regu</p>
              </Card>
            </div>

            {/* Global Progress - Enhanced */}
            <Card className={`p-5 mb-4 ${
              achievementStatus === 'excellent' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' :
              achievementStatus === 'good' ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300' :
              achievementStatus === 'fair' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300' :
              'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-5 w-5 ${
                    achievementStatus === 'excellent' ? 'text-green-600' :
                    achievementStatus === 'good' ? 'text-blue-600' :
                    achievementStatus === 'fair' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                  <h4 className="text-gray-900">Progress Global</h4>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${
                    achievementStatus === 'excellent' ? 'text-green-600' :
                    achievementStatus === 'good' ? 'text-blue-600' :
                    achievementStatus === 'fair' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>{Math.round(globalProgress)}%</span>
                </div>
              </div>
              
              <Progress value={globalProgress} className="h-4 mb-3" />
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tercapai</p>
                  <p className="text-green-600 font-semibold text-sm">{formatCurrency(totalAchieved)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Sisa</p>
                  <p className="text-orange-600 font-semibold text-sm">{formatCurrency(totalTarget - totalAchieved)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Target</p>
                  <p className="text-gray-900 font-semibold text-sm">{formatCurrency(totalTarget)}</p>
                </div>
              </div>

              {/* Achievement Status Badge */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <Badge className={
                    achievementStatus === 'excellent' ? 'bg-green-600' :
                    achievementStatus === 'good' ? 'bg-blue-600' :
                    achievementStatus === 'fair' ? 'bg-yellow-600' :
                    'bg-red-600'
                  }>
                    {achievementStatus === 'excellent' ? '🎉 Excellent Progress!' :
                     achievementStatus === 'good' ? '💪 Good Progress' :
                     achievementStatus === 'fair' ? '⚡ Keep Going' :
                     '⚠️ Needs Attention'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Category Breakdown Chart */}
            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <h4 className="text-gray-900">Breakdown Per Kategori</h4>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                  />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-2 mt-3">
                {categoryChartData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[cat.name.toLowerCase() as keyof typeof COLORS] }}
                      />
                      <span className="text-gray-600">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions - Prominent */}
            {globalStats.pendingDonations && globalStats.pendingDonations > 0 && (
              <Card className="p-4 mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Perlu Validasi</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Ada {globalStats.pendingDonations} donasi menunggu validasi Anda
                    </p>
                    <Button
                      onClick={() => onNavigate?.('admin-validasi-donasi')}
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Validasi Sekarang
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Top 3 Regu - Featured */}
            <Card className="p-4 mb-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-purple-600" />
                <h4 className="text-gray-900">🏆 Top 3 Regu Terbaik</h4>
              </div>
              
              {topReguStats.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Belum ada data regu</p>
              ) : (
                <div className="space-y-3">
                  {topReguStats.map((regu, index) => {
                    const progress = (regu.total_donations / regu.target) * 100;
                    const ranking = index + 1;
                    
                    return (
                      <div key={regu.id} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            ranking === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                            ranking === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                            'bg-gradient-to-br from-orange-400 to-orange-500'
                          }`}>
                            <span className="text-xl">
                              {ranking === 1 ? '🥇' : ranking === 2 ? '🥈' : '🥉'}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h5 className="text-gray-900 font-semibold">{regu.name}</h5>
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                {Math.round(progress)}%
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2">
                              👤 {regu.pembimbing_name} • {regu.member_count} anggota • {regu.total_muzakki} muzakki
                            </p>
                            
                            <Progress value={progress} className="h-2 mb-2" />
                            
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-green-600 font-semibold">
                                {formatCurrency(regu.total_donations)}
                              </span>
                              <span className="text-gray-500">
                                / {formatCurrency(regu.target)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {reguStats.length > 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => {
                    // Scroll to full leaderboard
                    document.getElementById('full-leaderboard')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Lihat Semua Regu ({reguStats.length})
                </Button>
              )}
            </Card>

            {/* Tabs */}
            <div id="full-leaderboard">
              <Tabs defaultValue="regu" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="regu">Semua Regu</TabsTrigger>
                  <TabsTrigger value="detail">Detail Kategori</TabsTrigger>
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

              <TabsContent value="detail" className="space-y-3">
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
            </div>

            {/* Admin Actions Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                onClick={() => onNavigate?.('admin-data-management')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 h-auto py-4 flex-col gap-2"
              >
                <Database className="h-6 w-6" />
                <span className="text-sm">Data</span>
              </Button>

              <Button
                onClick={() => onNavigate?.('admin-tools')}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 h-auto py-4 flex-col gap-2"
              >
                <Settings className="h-6 w-6" />
                <span className="text-sm">Tools</span>
              </Button>
            </div>

            <Button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 mt-3"
            >
              <Download className="h-4 w-4 mr-2" />
              Ekspor Laporan Lengkap
            </Button>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        active="admin-dashboard" 
        onNavigate={(item) => onNavigate?.(item)} 
      />
    </div>
  );
}