import { useState } from 'react';
import { ArrowLeft, Calendar, Users, Package, MessageCircle, Filter, Download } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatRelativeTime, formatCurrency } from '../lib/utils';
import { mockActivities } from '../lib/mockData';

interface RiwayatAktivitasPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
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

  const handleExport = () => {
    // In a real app, this would export the data to a file
    alert('Mengekspor data riwayat aktivitas...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h2 className="text-white">Riwayat Aktivitas</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={handleExport}
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Filters */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</span>
            <button
              onClick={() => setFilter('semua')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                filter === 'semua' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('donation')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                filter === 'donation' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Donasi
            </button>
            <button
              onClick={() => setFilter('follow-up')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                filter === 'follow-up' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Follow-up
            </button>
            <button
              onClick={() => setFilter('distribution')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                filter === 'distribution' 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Penyaluran
            </button>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Waktu:</span>
            <button
              onClick={() => setDateFilter('hari-ini')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                dateFilter === 'hari-ini' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setDateFilter('minggu-ini')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                dateFilter === 'minggu-ini' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setDateFilter('bulan-ini')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                dateFilter === 'bulan-ini' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setDateFilter('semua')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                dateFilter === 'semua' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Semua
            </button>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">Tidak ada aktivitas yang ditemukan</p>
            </Card>
          ) : (
            filteredActivities.map((activity) => {
              const Icon = getIcon(activity.type);
              const iconColor = getIconColor(activity.type);
              const typeLabel = getTypeLabel(activity.type);
              
              return (
                <Card key={activity.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${iconColor}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-gray-900">{activity.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Badge variant="outline" className="border-gray-200">
                              {typeLabel}
                            </Badge>
                            <span>•</span>
                            <span>{formatRelativeTime(activity.time)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {'amount' in activity && (
                        <span className="text-green-600 font-medium">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        Detail
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
