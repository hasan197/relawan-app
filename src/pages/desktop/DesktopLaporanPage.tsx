import { useState, useMemo } from 'react';
import { Download, TrendingUp, DollarSign, Users, Calendar, Filter, FileText } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { DesktopTopbar } from '../../components/desktop/DesktopTopbar';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DesktopLaporanPageProps {
  onNavigate?: (page: string) => void;
}

export function DesktopLaporanPage({ onNavigate }: DesktopLaporanPageProps) {
  const { donations, muzakkiList, getTotalDonations, getTotalDistributed, getDonationsByCategory } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const totalDonations = getTotalDonations();
  const totalDistributed = getTotalDistributed();
  const categoryData = getDonationsByCategory();
  const balance = totalDonations - totalDistributed;

  const categoryChartData = [
    { name: 'Zakat', value: categoryData.zakat, color: '#10b981' },
    { name: 'Infaq', value: categoryData.infaq, color: '#fbbf24' },
    { name: 'Sedekah', value: categoryData.sedekah, color: '#3b82f6' },
    { name: 'Wakaf', value: categoryData.wakaf, color: '#8b5cf6' }
  ].filter(item => item.value > 0);

  // Calculate Monthly Trend
  const monthlyTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Initialize last 6 months
    const data: {
      month: string;
      monthIndex: number;
      year: number;
      donasi: number;
      penyaluran: number;
    }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentMonth - i);
      const monthIndex = d.getMonth();
      data.push({
        month: months[monthIndex],
        monthIndex: monthIndex,
        year: d.getFullYear(),
        donasi: 0,
        penyaluran: 0
      });
    }

    donations.forEach(d => {
      const date = new Date(d.created_at);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      const monthData = data.find(m => m.monthIndex === monthIndex && m.year === year);
      if (monthData) {
        if (d.type === 'incoming') {
          monthData.donasi += d.amount;
        } else if (d.type === 'outgoing') {
          monthData.penyaluran += d.amount;
        }
      }
    });

    return data;
  }, [donations]);

  // Calculate Top Muzakki
  const topMuzakki = useMemo(() => {
    const muzakkiStats = new Map<string, { name: string, total: number, count: number }>();

    donations.forEach(d => {
      if (d.type === 'incoming' && d.muzakki_id) {
        const current = muzakkiStats.get(d.muzakki_id) || { name: '', total: 0, count: 0 };
        // Find muzakki name from muzakkiList
        if (!current.name) {
          const muzakki = muzakkiList.find(m => m.id === d.muzakki_id);
          current.name = muzakki ? muzakki.name : 'Unknown';
        }

        current.total += d.amount;
        current.count += 1;
        muzakkiStats.set(d.muzakki_id, current);
      }
    });

    return Array.from(muzakkiStats.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [donations, muzakkiList]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopTopbar
        title="Laporan & Analytics"
        subtitle="Analisis lengkap performa donasi Anda"
        onNavigate={onNavigate}
      />

      <div className="p-8">
        {/* Period Selector & Export */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg transition-colors ${selectedPeriod === period
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                {period === 'week' ? 'Minggu Ini' : period === 'month' ? 'Bulan Ini' : 'Tahun Ini'}
              </button>
            ))}
          </div>
          <Button className="bg-primary-600 hover:bg-primary-700 gap-2">
            <Download className="h-4 w-4" />
            Export Laporan
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-none">
                +12.5%
              </Badge>
            </div>
            <h3 className="text-gray-900 mb-1">{formatCurrency(totalDonations)}</h3>
            <p className="text-gray-500">Total Donasi Masuk</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-none">
                +8.2%
              </Badge>
            </div>
            <h3 className="text-gray-900 mb-1">{formatCurrency(totalDistributed)}</h3>
            <p className="text-gray-500">Total Penyaluran</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 border-none">
                Saldo
              </Badge>
            </div>
            <h3 className="text-gray-900 mb-1">{formatCurrency(balance)}</h3>
            <p className="text-gray-500">Dana Tersedia</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-none">
                Total
              </Badge>
            </div>
            <h3 className="text-gray-900 mb-1">{muzakkiList.length}</h3>
            <p className="text-gray-500">Total Muzakki</p>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Trend Chart */}
          <Card className="col-span-2 p-6">
            <h3 className="text-gray-900 mb-6">Trend Donasi vs Penyaluran</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  formatter={(value: number) => `Rp ${value}M`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="donasi"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Donasi"
                  dot={{ fill: '#10b981', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="penyaluran"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Penyaluran"
                  dot={{ fill: '#3b82f6', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">Distribusi Kategori</h3>
            {categoryChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
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
                <div className="space-y-2 mt-4">
                  {categoryChartData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-gray-600">{cat.name}</span>
                      </div>
                      <span className="text-gray-900">{formatCurrency(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Belum ada data donasi</p>
              </div>
            )}
          </Card>
        </div>

        {/* Detailed Tables */}
        <Tabs defaultValue="muzakki" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="muzakki">Top Muzakki</TabsTrigger>
            <TabsTrigger value="transaksi">Riwayat Transaksi</TabsTrigger>
            <TabsTrigger value="kategori">Per Kategori</TabsTrigger>
          </TabsList>

          <TabsContent value="muzakki">
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-gray-900">Top 5 Muzakki</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-600">Ranking</th>
                      <th className="px-6 py-4 text-left text-gray-600">Nama</th>
                      <th className="px-6 py-4 text-left text-gray-600">Total Donasi</th>
                      <th className="px-6 py-4 text-left text-gray-600">Jumlah Transaksi</th>
                      <th className="px-6 py-4 text-left text-gray-600">Rata-rata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topMuzakki.map((muzakki, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                              index === 2 ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-50 text-blue-700'
                            }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{muzakki.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-green-600">{formatCurrency(muzakki.total)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{muzakki.count}x</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600">{formatCurrency(muzakki.total / muzakki.count)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="transaksi">
            <Card className="p-6">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Riwayat transaksi akan ditampilkan di sini</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="kategori">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(categoryData as Record<string, number>).map(([category, amount]) => (
                  <Card key={category} className="p-6 bg-gray-50">
                    <h4 className="text-gray-600 mb-2 capitalize">{category}</h4>
                    <h2 className="text-gray-900 mb-4">{formatCurrency(amount)}</h2>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600"
                        style={{ width: `${(amount / totalDonations) * 100}%` }}
                      />
                    </div>
                    <p className="text-gray-500 mt-2">
                      {((amount / totalDonations) * 100).toFixed(1)}% dari total
                    </p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}