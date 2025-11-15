import { useState, useEffect } from 'react';
import { UserPlus, Search, Filter, Upload, Phone, MessageCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { getInitials, formatRelativeTime } from '../lib/utils';
import { useAppContext } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { MuzakkiListSkeleton } from '../components/LoadingState';

interface DonaturPageWithBackendProps {
  onNavigate?: (page: string) => void;
  onSelectMuzakki?: (id: string) => void;
}

export function DonaturPageWithBackend({ onNavigate, onSelectMuzakki }: DonaturPageWithBackendProps) {
  const { muzakkiList, loading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'baru' | 'follow-up' | 'donasi'>('all');

  const filteredMuzakki = muzakkiList.filter(muzakki => {
    const matchesSearch = muzakki.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         muzakki.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         muzakki.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || muzakki.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'baru': 'bg-blue-100 text-blue-700',
      'follow-up': 'bg-yellow-100 text-yellow-700',
      'donasi': 'bg-green-100 text-green-700'
    };
    const labels = {
      'baru': 'Baru',
      'follow-up': 'Follow Up',
      'donasi': 'Donasi'
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-700'} border-none`}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const handleWhatsApp = (phone: string, name: string) => {
    window.open(`https://wa.me/${phone.replace('+', '')}`, '_blank');
    toast.success(`Membuka WhatsApp ${name}...`);
  };

  const handleCall = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast.success(`Memanggil ${name}...`);
  };

  const statusCounts = {
    all: muzakkiList.length,
    baru: muzakkiList.filter(m => m.status === 'baru').length,
    'follow-up': muzakkiList.filter(m => m.status === 'follow-up').length,
    donasi: muzakkiList.filter(m => m.status === 'donasi').length
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header 
        onNotificationClick={() => onNavigate?.('notifikasi')}
        onStatsClick={() => onNavigate?.('laporan')}
      />
      
      <div className="px-4 -mt-4">
        <Card className="p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Daftar Muzakki</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => onNavigate?.('import-kontak')}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Import</span>
              </button>
              <button 
                onClick={() => onNavigate?.('tambah-prospek')}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama, nomor, atau kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {(['all', 'baru', 'follow-up', 'donasi'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Semua' : status === 'baru' ? 'Baru' : status === 'follow-up' ? 'Follow Up' : 'Donasi'}
                <span className="ml-1">({statusCounts[status]})</span>
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <MuzakkiListSkeleton />
          )}

          {/* Empty State */}
          {!loading && filteredMuzakki.length === 0 && (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Tidak ada muzakki yang sesuai filter'
                  : 'Belum ada muzakki. Tambahkan yang pertama!'}
              </p>
            </div>
          )}

          {/* Muzakki List */}
          <div className="space-y-3">
            {filteredMuzakki.map((muzakki) => (
              <Card 
                key={muzakki.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectMuzakki?.(muzakki.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${muzakki.name}`} />
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {getInitials(muzakki.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-gray-900">{muzakki.name}</h4>
                      {getStatusBadge(muzakki.status)}
                    </div>
                    
                    <p className="text-gray-600 mb-1">{muzakki.phone}</p>
                    
                    {muzakki.city && (
                      <p className="text-gray-500">{muzakki.city}</p>
                    )}
                    
                    <p className="text-gray-400 mt-2">
                      Terakhir dihubungi {formatRelativeTime(new Date(muzakki.last_contact))}
                    </p>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(muzakki.phone, muzakki.name);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Call</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsApp(muzakki.phone, muzakki.name);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>WA</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      <BottomNavigation 
        activeItem="donatur"
        onNavigate={(item) => onNavigate?.(item)}
      />
    </div>
  );
}