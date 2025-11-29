import { ArrowLeft, Users, TrendingUp, Award, Settings, Database, AlertCircle, CheckCircle, DollarSign, Target, BarChart3, Download } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { formatCurrency } from '../../lib/utils';
import { useAdminStats } from '../../hooks/useAdminStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

// Format currency dengan singkatan Indonesia untuk box yang sempit
function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `Rp${(value / 1_000_000_000_000).toFixed(1)} T`;
  } else if (value >= 1_000_000_000) {
    return `Rp${(value / 1_000_000_000).toFixed(1)} M`;
  } else if (value >= 1_000_000) {
    return `Rp${(value / 1_000_000).toFixed(1)} Jt`;
  } else if (value >= 1_000) {
    return `Rp${(value / 1_000).toFixed(0)} Rb`;
  } else {
    return `Rp${value}`;
  }
}

interface DesktopAdminDashboardPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function DesktopAdminDashboardPage({ onBack, onNavigate }: DesktopAdminDashboardPageProps) {
  const { globalStats, reguStats, loading, error } = useAdminStats();

  const totalTarget = reguStats.reduce((sum, regu) => sum + regu.target, 0);
  const totalAchieved = reguStats.reduce((sum, regu) => sum + regu.total_donations, 0);
  const globalProgress = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

  // Prepare chart data
  const categoryChartData = Object.entries(globalStats?.by_category || {}).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
    percentage: globalStats?.total_donations > 0 ? ((amount / globalStats.total_donations) * 100).toFixed(1) : 0
  }));

  const COLORS = {
    zakat: '#10b981',
    infaq: '#f59e0b',
    sedekah: '#3b82f6',
    wakaf: '#6b7280'
  };

  // Top 3 regu
  const topReguStats = reguStats.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 mb-2">Gagal memuat data</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button onClick={() => onNavigate?.('admin-validasi-donasi')} variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Validasi Donasi
                {globalStats.pendingDonations && globalStats.pendingDonations > 0 && (
                  <Badge className="ml-2 bg-yellow-500 text-xs">{globalStats.pendingDonations}</Badge>
                )}
              </Button>
              <Button onClick={() => onNavigate?.('admin-tools')} variant="outline" size="sm">
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                Admin Tools
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              {globalProgress >= 75 && <Badge className="bg-green-600 text-white text-xs px-1.5 py-0">✨</Badge>}
            </div>
            <p className="text-gray-600 text-xs mb-0.5">Total Donasi</p>
            <p className="text-lg text-gray-900 font-semibold mb-0.5">{formatCurrencyShort(globalStats.total_donations || 0)}</p>
            <p className="text-xs text-green-700">{Math.round(globalProgress)}% dari target</p>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-0.5">Target Global</p>
            <p className="text-lg text-gray-900 font-semibold mb-0.5">{formatCurrencyShort(totalTarget)}</p>
            <p className="text-xs text-blue-700">Sisa {formatCurrencyShort(totalTarget - totalAchieved)}</p>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-0.5">Total Muzakki</p>
            <p className="text-lg text-gray-900 font-semibold mb-0.5">{globalStats.total_muzakki || 0}</p>
            <p className="text-xs text-purple-700">Donatur aktif</p>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <Award className="h-4 w-4 text-orange-600" />
              </div>
              {globalStats.pendingDonations && globalStats.pendingDonations > 0 && (
                <Badge className="bg-red-500 text-white text-xs pulse px-1.5 py-0">{globalStats.pendingDonations}</Badge>
              )}
            </div>
            <p className="text-gray-600 text-xs mb-0.5">Total Relawan</p>
            <p className="text-lg text-gray-900 font-semibold mb-0.5">{globalStats.total_relawan || 0}</p>
            <p className="text-xs text-orange-700">Dalam {globalStats.total_regu || 0} regu</p>
          </Card>
        </div>

        {/* Global Progress */}
        <Card className="p-4 mb-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <h3 className="text-gray-900 text-sm font-semibold">Progress Global Target</h3>
            </div>
            <Badge className={
              globalProgress >= 100 ? 'bg-green-600' :
              globalProgress >= 75 ? 'bg-blue-600' :
              globalProgress >= 50 ? 'bg-yellow-600' : 'bg-red-600'
            }>
              {Math.round(globalProgress)}%
            </Badge>
          </div>
          
          <Progress value={globalProgress} className="h-3 mb-3" />
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-0.5">Tercapai</p>
              <p className="text-base text-green-600 font-semibold">{formatCurrencyShort(totalAchieved)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-0.5">Sisa</p>
              <p className="text-base text-orange-600 font-semibold">{formatCurrencyShort(totalTarget - totalAchieved)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-0.5">Target</p>
              <p className="text-base text-gray-900 font-semibold">{formatCurrencyShort(totalTarget)}</p>
            </div>
          </div>
        </Card>

        {/* Charts & Data */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Category Breakdown */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <h3 className="text-gray-900 text-sm font-semibold">Breakdown Per Kategori</h3>
            </div>
            
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  stroke="#9ca3af"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
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
                  <div className="flex items-center gap-1.5">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: COLORS[cat.name.toLowerCase() as keyof typeof COLORS] }}
                    />
                    <span className="text-gray-600">{cat.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top 3 Regu */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-4 w-4 text-purple-600" />
              <h3 className="text-gray-900 text-sm font-semibold">🏆 Top 3 Regu Terbaik</h3>
            </div>

            {topReguStats.length === 0 ? (
              <p className="text-gray-500 text-center py-6 text-sm">Belum ada data regu</p>
            ) : (
              <div className="space-y-3">
                {topReguStats.map((regu, index) => {
                  const progress = (regu.total_donations / regu.target) * 100;
                  const ranking = index + 1;
                  
                  return (
                    <div key={regu.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          ranking === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                          ranking === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                          'bg-gradient-to-br from-orange-400 to-orange-500'
                        }`}>
                          <span className="text-lg">
                            {ranking === 1 ? '🥇' : ranking === 2 ? '🥈' : '🥉'}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gray-900 font-semibold text-sm truncate">{regu.name}</h4>
                              <p className="text-xs text-gray-600 truncate">
                                👤 {regu.pembimbing_name}
                              </p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-700 text-xs ml-2">
                              {Math.round(progress)}%
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2 mb-1.5 text-xs text-gray-600">
                            <span>{regu.member_count} anggota</span>
                            <span>•</span>
                            <span>{regu.total_muzakki} muzakki</span>
                          </div>
                          
                          <Progress value={progress} className="h-1.5 mb-1.5" />
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-green-600 font-semibold">
                              {formatCurrencyShort(regu.total_donations)}
                            </span>
                            <span className="text-gray-500">
                              / {formatCurrencyShort(regu.target)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* All Regu Leaderboard */}
        {reguStats.length > 3 && (
          <Card className="p-4 mb-4">
            <h3 className="text-gray-900 mb-3 text-sm font-semibold">📊 Semua Regu ({reguStats.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-xs text-gray-600 font-medium">Rank</th>
                    <th className="text-left py-2 px-2 text-xs text-gray-600 font-medium">Nama Regu</th>
                    <th className="text-left py-2 px-2 text-xs text-gray-600 font-medium">Pembimbing</th>
                    <th className="text-center py-2 px-2 text-xs text-gray-600 font-medium">Anggota</th>
                    <th className="text-center py-2 px-2 text-xs text-gray-600 font-medium">Muzakki</th>
                    <th className="text-right py-2 px-2 text-xs text-gray-600 font-medium">Donasi</th>
                    <th className="text-right py-2 px-2 text-xs text-gray-600 font-medium">Target</th>
                    <th className="text-center py-2 px-2 text-xs text-gray-600 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {reguStats.map((regu, index) => {
                    const progress = (regu.total_donations / regu.target) * 100;
                    const ranking = index + 1;
                    
                    return (
                      <tr key={regu.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-2">
                          <div className="flex items-center">
                            {ranking <= 3 ? (
                              <span className="text-base">
                                {ranking === 1 ? '🥇' : ranking === 2 ? '🥈' : '🥉'}
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs">#{ranking}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <span className="text-gray-900 font-medium text-xs">{regu.name}</span>
                        </td>
                        <td className="py-2 px-2">
                          <span className="text-gray-600 text-xs">{regu.pembimbing_name}</span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <Badge className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0">
                            {regu.member_count}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0">
                            {regu.total_muzakki}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <span className="text-green-600 font-semibold text-xs">
                            {formatCurrencyShort(regu.total_donations)}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <span className="text-gray-600 text-xs">
                            {formatCurrencyShort(regu.target)}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-1.5">
                            <Progress value={progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-gray-600 w-9 text-right">
                              {Math.round(progress)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {globalStats?.pendingDonations && globalStats.pendingDonations > 0 && (
            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 col-span-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 text-sm font-semibold mb-0.5">⚠️ Perlu Validasi</h4>
                    <p className="text-xs text-gray-600">
                      Ada {globalStats.pendingDonations} donasi menunggu validasi Anda
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => onNavigate?.('admin-validasi-donasi')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                  size="sm"
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  Validasi Sekarang
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate?.('admin-data-management')}>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 mb-1 text-sm font-semibold">Data Management</h4>
                <p className="text-gray-600 text-xs">Kelola users, regu, muzakki, dan donasi</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate?.('admin-tools')}>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 mb-1 text-sm font-semibold">Admin Tools</h4>
                <p className="text-gray-600 text-xs">Database, logs, dan sistem tools</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 mb-1 text-sm font-semibold">Ekspor Laporan</h4>
                <p className="text-gray-600 text-xs">Download laporan lengkap (Excel/PDF)</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
