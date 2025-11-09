import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { mockDonations, mockLeaderboard } from '../../lib/mockData';
import { Calendar, Download, Filter, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

type TimeFilter = 'hari-ini' | 'minggu-ini' | 'bulan-ini' | 'tahun-ini' | 'semua';

interface LaporanPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function LaporanPage({ onNavigate }: LaporanPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('laporan');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('minggu-ini');

  const totalDonations = mockDonations
    .filter(d => d.type === 'incoming')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalDistributions = mockDonations
    .filter(d => d.type === 'outgoing')
    .reduce((sum, d) => sum + d.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeFilterLabel = (filter: TimeFilter) => {
    switch (filter) {
      case 'hari-ini': return 'Hari Ini';
      case 'minggu-ini': return 'Minggu Ini';
      case 'bulan-ini': return 'Bulan Ini';
      case 'tahun-ini': return 'Tahun Ini';
      case 'semua': return 'Semua Waktu';
      default: return filter;
    }
  };

  return (
    <DesktopLayout
      activeNav={activeNav}
      onNavigate={(page) => {
        setActiveNav(page);
        onNavigate?.(page);
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan & Analytics</h1>
            <p className="text-gray-600 mt-1">Analisis performa dan statistik donasi</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              {getTimeFilterLabel(timeFilter)}
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Donasi</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDonations)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">+12.5% dari minggu lalu</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Penyaluran</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDistributions)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">85% dari target</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Transaksi</p>
                  <p className="text-2xl font-bold text-gray-900">{mockDonations.length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-2">+3 transaksi baru</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Donatur Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-orange-600 mt-2">+2 minggu ini</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaksi Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDonations.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          donation.type === 'incoming' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {donation.type === 'incoming' ? (
                            <DollarSign className="h-4 w-4 text-green-600" />
                          ) : (
                            <Target className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{donation.donorName}</p>
                          <p className="text-sm text-gray-500">{donation.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          donation.type === 'incoming' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {formatCurrency(donation.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {donation.createdAt.toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard Regu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLeaderboard.map((entry) => (
                    <div key={entry.relawanId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-600">#{entry.rank}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{entry.relawanName}</p>
                          <p className="text-xs text-gray-500">{entry.reguName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(entry.totalDonations)}</p>
                        <p className="text-xs text-gray-500">{entry.muzakkiCount} donatur</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Breakdown Kategori Donasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['zakat', 'infaq', 'sedekah', 'wakaf'].map((category) => {
                const categoryDonations = mockDonations
                  .filter(d => d.category === category && d.type === 'incoming')
                  .reduce((sum, d) => sum + d.amount, 0);
                
                const percentage = (categoryDonations / totalDonations) * 100;
                
                return (
                  <div key={category} className="text-center p-4 border border-gray-200 rounded-lg">
                    <Badge className="mb-2 capitalize">{category}</Badge>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(categoryDonations)}</p>
                    <p className="text-sm text-gray-500">{percentage.toFixed(1)}% dari total</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopLayout>
  );
}