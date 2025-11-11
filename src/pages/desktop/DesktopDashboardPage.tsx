import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  ArrowUp,
  ArrowDown,
  Plus,
  Download,
  Calendar,
  Activity
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { DesktopTopbar } from '../../components/desktop/DesktopTopbar';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency, getInitials, formatRelativeTime } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DesktopDashboardPageProps {
  onNavigate?: (page: string) => void;
}

export function DesktopDashboardPage({ onNavigate }: DesktopDashboardPageProps) {
  const { donations, muzakkiList, getTotalDonations, getDonationsByCategory } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const totalDonations = getTotalDonations();
  const categoryData = getDonationsByCategory();

  // Stats Cards Data
  const statsCards = [
    {
      title: 'Total Donasi',
      value: formatCurrency(totalDonations),
      change: '+12.5%',
      trend: 'up' as const,
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

  // Chart Data
  const categoryChartData = [
    { name: 'Zakat', value: categoryData.zakat, color: '#10b981' },
    { name: 'Infaq', value: categoryData.infaq, color: '#fbbf24' },
    { name: 'Sedekah', value: categoryData.sedekah, color: '#3b82f6' },
    { name: 'Wakaf', value: categoryData.wakaf, color: '#8b5cf6' }
  ];

  const monthlyData = [
    { month: 'Jan', zakat: 40, infaq: 24, sedekah: 12, wakaf: 8 },
    { month: 'Feb', zakat: 52, infaq: 28, sedekah: 15, wakaf: 10 },
    { month: 'Mar', zakat: 48, infaq: 32, sedekah: 18, wakaf: 12 },
    { month: 'Apr', zakat: 61, infaq: 35, sedekah: 20, wakaf: 14 },
    { month: 'Mei', zakat: 55, infaq: 38, sedekah: 22, wakaf: 16 },
    { month: 'Jun', zakat: 67, infaq: 42, sedekah: 25, wakaf: 18 }
  ];

  const trendData = [
    { date: 'Sen', amount: 45 },
    { date: 'Sel', amount: 52 },
    { date: 'Rab', amount: 48 },
    { date: 'Kam', amount: 61 },
    { date: 'Jum', amount: 55 },
    { date: 'Sab', amount: 67 },
    { date: 'Min', amount: 72 }
  ];

  // Recent Activities
  const recentActivities = donations.slice(0, 5).map(d => ({
    id: d.id,
    type: d.category,
    amount: d.amount,
    date: d.created_at,
    status: 'completed'
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopTopbar 
        title="Dashboard Relawan" 
        subtitle="Selamat datang kembali! Berikut ringkasan aktivitas Anda."
        onNavigate={onNavigate}
      />

      <div className="p-8">
        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => onNavigate?.('tambah-prospek')}
              className="bg-primary-600 hover:bg-primary-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Tambah Muzakki
            </Button>
            <Button 
              onClick={() => onNavigate?.('generator-resi')}
              variant="outline"
              className="gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Catat Donasi
            </Button>
            <Button 
              onClick={() => onNavigate?.('template')}
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Template WA
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPeriod === period
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
        <div className="grid grid-cols-4 gap-6 mb-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge className={`${
                    stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Trend Chart */}
          <Card className="col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 mb-1">Trend Donasi</h3>
                <p className="text-gray-500">7 hari terakhir</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
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
          <Card className="p-6">
            <h3 className="text-gray-900 mb-1">Distribusi Kategori</h3>
            <p className="text-gray-500 mb-6">Total donasi per kategori</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
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
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categoryChartData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-600">{cat.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Monthly Performance & Recent Activities */}
        <div className="grid grid-cols-3 gap-6">
          {/* Monthly Performance */}
          <Card className="col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
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
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
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
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900">Donasi {activity.type}</p>
                      <p className="text-green-600">{formatCurrency(activity.amount)}</p>
                      <p className="text-gray-400">
                        {formatRelativeTime(new Date(activity.date))}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
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
