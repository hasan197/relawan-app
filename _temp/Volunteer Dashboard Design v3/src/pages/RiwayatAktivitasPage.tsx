import { useState } from 'react';
import { ArrowLeft, Calendar, Users, Package, MessageCircle, Filter, Download } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatRelativeTime, formatCurrency } from '../lib/utils';
import { mockActivities } from '../lib/mockData';

interface RiwayatAktivitasPageProps {
  onBack?: () => void;
}

export function RiwayatAktivitasPage({ onBack }: RiwayatAktivitasPageProps) {
  const [filter, setFilter] = useState<'semua' | 'donation' | 'follow-up' | 'distribution'>('semua');
  const [dateFilter, setDateFilter] = useState<'hari-ini' | 'minggu-ini' | 'bulan-ini' | 'semua'>('semua');

  // Extended mock data
  const allActivities = [
    ...mockActivities,
    {
      id: '5',
      type: 'follow-up' as const,
      title: 'Follow-up Siti Nurhaliza',
      time: new Date('2025-11-04T15:00:00'),
      relawanId: '1'
    },
    {
      id: '6',
      type: 'donation' as const,
      title: 'Donasi dari Bapak Wijaya',
      amount: 750000,
      time: new Date('2025-11-03T10:00:00'),
      relawanId: '1'
    },
    {
      id: '7',
      type: 'distribution' as const,
      title: 'Penyaluran ke Yayasan Al-Hidayah',
      amount: 1000000,
      time: new Date('2025-11-02T14:00:00'),
      relawanId: '1'
    },
    {
      id: '8',
      type: 'follow-up' as const,
      title: 'Follow-up Muhammad Rizki',
      time: new Date('2025-11-01T16:00:00'),
      relawanId: '1'
    }
  ];

  const filteredActivities = allActivities.filter(activity => {
    const matchesType = filter === 'semua' || activity.type === filter;
    
    let matchesDate = true;
    const now = new Date();
    const activityDate = activity.time;
    
    if (dateFilter === 'hari-ini') {
      matchesDate = activityDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'minggu-ini') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = activityDate >= weekAgo;
    } else if (dateFilter === 'bulan-ini') {
      matchesDate = activityDate.getMonth() === now.getMonth() && 
                    activityDate.getFullYear() === now.getFullYear();
    }
    
    return matchesType && matchesDate;
  });

  const getIcon = (type: 'donation' | 'follow-up' | 'distribution') => {
    switch (type) {
      case 'donation':
        return Calendar;
      case 'follow-up':
        return Users;
      case 'distribution':
        return Package;
    }
  };

  const getIconColor = (type: 'donation' | 'follow-up' | 'distribution') => {
    switch (type) {
      case 'donation':
        return 'bg-green-100 text-green-600';
      case 'follow-up':
        return 'bg-blue-100 text-blue-600';
      case 'distribution':
        return 'bg-orange-100 text-orange-600';
    }
  };

  const getTypeLabel = (type: 'donation' | 'follow-up' | 'distribution') => {
    switch (type) {
      case 'donation':
        return 'Donasi';
      case 'follow-up':
        return 'Follow-up';
      case 'distribution':
        return 'Penyaluran';
    }
  };

  // Statistics
  const stats = {
    total: filteredActivities.length,
    donations: filteredActivities.filter(a => a.type === 'donation').length,
    followUps: filteredActivities.filter(a => a.type === 'follow-up').length,
    distributions: filteredActivities.filter(a => a.type === 'distribution').length,
    totalAmount: filteredActivities
      .filter(a => a.amount)
      .reduce((sum, a) => sum + (a.amount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="text-white">Riwayat Aktivitas</h2>
            <p className="text-primary-100">
              {stats.total} aktivitas tercatat
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/20 border-white/40 text-white hover:bg-white/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Ekspor
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="p-3 text-center">
            <Calendar className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-gray-500">Donasi</p>
            <p className="text-gray-900">{stats.donations}</p>
          </Card>
          
          <Card className="p-3 text-center">
            <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-gray-500">Follow-up</p>
            <p className="text-gray-900">{stats.followUps}</p>
          </Card>
          
          <Card className="p-3 text-center">
            <Package className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <p className="text-gray-500">Salur</p>
            <p className="text-gray-900">{stats.distributions}</p>
          </Card>
        </div>

        {/* Date Filter */}
        <Card className="p-4 mb-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-gray-600" />
            <h4 className="text-gray-900">Filter</h4>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
            {(['hari-ini', 'minggu-ini', 'bulan-ini', 'semua'] as const).map((date) => (
              <button
                key={date}
                onClick={() => setDateFilter(date)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  dateFilter === date
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {date === 'hari-ini' ? 'Hari Ini' : date === 'minggu-ini' ? 'Minggu Ini' : date === 'bulan-ini' ? 'Bulan Ini' : 'Semua'}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['semua', 'donation', 'follow-up', 'distribution'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filter === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'semua' ? 'Semua Tipe' : getTypeLabel(type)}
              </button>
            ))}
          </div>
        </Card>

        {/* Activities List */}
        <div className="space-y-3">
          {filteredActivities.map((activity) => {
            const Icon = getIcon(activity.type);
            const iconColor = getIconColor(activity.type);
            
            return (
              <Card key={activity.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${iconColor} flex-shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-gray-900">{activity.title}</h4>
                      <Badge className="bg-gray-100 text-gray-700 border-none">
                        {getTypeLabel(activity.type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500">
                        {formatRelativeTime(activity.time)}
                      </p>
                      {activity.amount && (
                        <p className={`${
                          activity.type === 'distribution' 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                        }`}>
                          {activity.type === 'distribution' ? '-' : '+'}
                          {formatCurrency(activity.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada aktivitas ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
