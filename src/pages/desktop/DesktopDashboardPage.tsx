import { useState, useMemo } from 'react';
import { DesktopTopbar } from '../../components/desktop/DesktopTopbar';
import { useAppContext } from '../../contexts/AppContext';
import { useStatistics } from '../../hooks/useStatistics';
import { formatCurrency, getInitials, formatRelativeTime } from '../../lib/utils';
import { getMonthlyDonations, getWeeklyTrend, getTopMuzakki, getMonthlyTrend, calculatePercentageChange, getPreviousPeriodData } from '../../lib/dataAggregation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ServerStatusBanner } from '../../components/ServerStatusBanner';
import { Plus, DollarSign, Download, Users, Target, Activity, ArrowUp, ArrowDown, MessageCircle, Package } from 'lucide-react';

interface DesktopDashboardPageProps {
  onNavigate?: (page: string) => void;
}

export function DesktopDashboardPage({ onNavigate }: DesktopDashboardPageProps) {
  const { user, donations, muzakkiList, muzakkiError, donationsError, getTotalDonations, getDonationsByCategory } = useAppContext();
  const { statistics } = useStatistics(user?.id || null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const totalDonations = getTotalDonations();
  const categoryData = getDonationsByCategory();

  // Use dataAggregation utilities
  const monthlyData = useMemo(() => getMonthlyDonations(donations), [donations]);
  const trendData = useMemo(() => getWeeklyTrend(donations), [donations]);
  const topMuzakkiData = useMemo(() => getTopMuzakki(donations, muzakkiList, 5), [donations, muzakkiList]);
  const monthlyTrendData = useMemo(() => getMonthlyTrend(donations), [donations]);

  // Calculate percentage changes
  const currentPeriodTotal = donations
    .filter(d => d.type === 'incoming')
    .reduce((sum, d) => sum + d.amount, 0);
  const previousPeriodTotal = getPreviousPeriodData(donations, selectedPeriod);
  const donationChange = calculatePercentageChange(currentPeriodTotal, previousPeriodTotal);

  // Stats Cards Data with real calculations
  const statsCards = [
    {
      title: 'Total Donasi',
      value: formatCurrency(totalDonations),
      change: donationChange,
      trend: donationChange.startsWith('+') ? 'up' as const : 'down' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Muzakki',
      value: muzakkiList.length.toString(),
      change: '+8.2%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Target Bulanan',
      value: '75%',
      change: '+5.4%',
      trend: 'up' as const,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Aktivitas',
      value: donations.length.toString(),
      change: '-2.1%',
      trend: 'down' as const,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Chart Data using dataAggregation
  const categoryChartData = [
    { name: 'Zakat', value: categoryData.zakat, color: '#10b981' },
    { name: 'Infaq', value: categoryData.infaq, color: '#fbbf24' },
    { name: 'Sedekah', value: categoryData.sedekah, color: '#3b82f6' },
    { name: 'Wakaf', value: categoryData.wakaf, color: '#8b5cf6' }
  ].filter(item => item.value > 0);


  // Recent Activities from backend
  const recentActivities = statistics?.recent_activities || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopTopbar
        title="Dashboard Relawan"
        subtitle="Selamat datang kembali! Berikut ringkasan aktivitas Anda."
        onNavigate={onNavigate}
      />

      <div className="p-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onNavigate?.('tambah-prospek')}
              className="bg-primary-600 hover:bg-primary-700 gap-2 h-9"
            >
              <Plus className="h-4 w-4" />
              Tambah Muzakki
            </Button>
            <Button
              onClick={() => onNavigate?.('generator-resi')}
              variant="outline"
              className="gap-2 h-9"
            >
              <DollarSign className="h-4 w-4" />
              Catat Donasi
            </Button>
            <Button
              onClick={() => onNavigate?.('template')}
              variant="outline"
              className="gap-2 h-9"
            >
              <Download className="h-4 w-4" />
              Template WA
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${selectedPeriod === period
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {period === 'week' ? 'Minggu Ini' : period === 'month' ? 'Bulan Ini' : 'Tahun Ini'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge className={`${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    } border-none gap-1`}>
                    {stat.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-500">{stat.title}</p>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {/* Trend Chart */}
          <Card className="col-span-2 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900 mb-1">Trend Donasi</h3>
                <p className="text-gray-500">7 hari terakhir</p>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-2" />
                Export
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="p-5">
            <h3 className="text-gray-900 mb-1">Distribusi Kategori</h3>
            <p className="text-gray-500 mb-4">Total donasi per kategori</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {categoryChartData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-600">{cat.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Monthly Performance & Recent Activities */}
        <div className="grid grid-cols-3 gap-4">
          {/* Monthly Performance */}
          <Card className="col-span-2 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900 mb-1">Performa Bulanan</h3>
                <p className="text-gray-500">6 bulan terakhir</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="zakat" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="infaq" fill="#fbbf24" radius={[8, 8, 0, 0]} />
                <Bar dataKey="sedekah" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="wakaf" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Activities */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Aktivitas Terbaru</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.('riwayat-aktivitas')}
              >
                Lihat Semua
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => {
                  const getActivityIcon = () => {
                    switch (activity.type) {
                      case 'donation':
                        return DollarSign;
                      case 'follow-up':
                        return MessageCircle;
                      case 'distribution':
                        return Package;
                      default:
                        return Activity;
                    }
                  };
                  
                  const getActivityColor = () => {
                    switch (activity.type) {
                      case 'donation':
                        return 'bg-green-100 text-green-600';
                      case 'follow-up':
                        return 'bg-blue-100 text-blue-600';
                      case 'distribution':
                        return 'bg-purple-100 text-purple-600';
                      default:
                        return 'bg-gray-100 text-gray-600';
                    }
                  };

                  const Icon = getActivityIcon();
                  const iconColor = getActivityColor();

                  return (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900">{activity.title}</p>
                        {activity.amount && (
                          <p className="text-green-600">{formatCurrency(activity.amount)}</p>
                        )}
                        {activity.muzakki_name && (
                          <p className="text-gray-500 text-sm">{activity.muzakki_name}</p>
                        )}
                        <p className="text-gray-400 text-sm">
                          {formatRelativeTime(activity.time)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}