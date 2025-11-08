import { useState } from 'react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockMuzakki } from '../lib/mockData';
import { Muzakki } from '../types';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { getInitials, formatRelativeTime } from '../lib/utils';
import { Search, UserPlus, Phone, MapPin } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Upload } from 'lucide-react';

interface DonaturPageProps {
  onNavigate?: (page: 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'program' | 'notifikasi' | 'import-kontak' | 'tambah-prospek') => void;
}

export function DonaturPage({ onNavigate }: DonaturPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'semua' | Muzakki['status']>('semua');

  const handleNavigation = (item: 'dashboard' | 'donatur' | 'laporan' | 'profil') => {
    onNavigate?.(item);
  };

  const filteredMuzakki = mockMuzakki.filter(muzakki => {
    const matchesSearch = muzakki.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         muzakki.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === 'semua' || muzakki.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Muzakki['status']) => {
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
      <Badge className={`${variants[status]} border-none`}>
        {labels[status]}
      </Badge>
    );
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama atau nomor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['semua', 'baru', 'follow-up', 'donasi'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as typeof selectedStatus)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'semua' ? 'Semua' : status === 'baru' ? 'Baru' : status === 'follow-up' ? 'Follow Up' : 'Donasi'}
              </button>
            ))}
          </div>

          {/* Muzakki List */}
          <div className="space-y-3">
            {filteredMuzakki.map((muzakki) => (
              <Card key={muzakki.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
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
                    
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Phone className="h-3 w-3" />
                      <span>{muzakki.phone}</span>
                    </div>
                    
                    {muzakki.city && (
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{muzakki.city}</span>
                      </div>
                    )}
                    
                    {muzakki.notes && (
                      <p className="text-gray-600 mb-2 line-clamp-2">{muzakki.notes}</p>
                    )}
                    
                    {muzakki.lastContact && (
                      <p className="text-gray-400">
                        Terakhir dihubungi {formatRelativeTime(muzakki.lastContact)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredMuzakki.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada muzakki ditemukan</p>
            </div>
          )}
        </Card>
      </div>

      <BottomNavigation active="donatur" onNavigate={handleNavigation} />
    </div>
  );
}