import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { mockMuzakki } from '../../lib/mockData';
import { Search, Filter, Plus, Phone, Mail, MoreHorizontal } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

type StatusFilter = 'semua' | 'baru' | 'follow-up' | 'donasi';

interface DonaturPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function DonaturPage({ onNavigate }: DonaturPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('donatur');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('semua');

  const filteredMuzakki = mockMuzakki.filter(muzakki => {
    const matchesSearch = muzakki.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         muzakki.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'semua' || muzakki.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'baru': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800';
      case 'donasi': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'baru': return 'Baru';
      case 'follow-up': return 'Follow-up';
      case 'donasi': return 'Donasi';
      default: return status;
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
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Donatur</h1>
            <p className="text-gray-600 mt-1">Kelola data dan komunikasi dengan donatur</p>
          </div>
          <Button className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Donatur
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama atau nomor telepon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {(['semua', 'baru', 'follow-up', 'donasi'] as StatusFilter[]).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status === 'semua' ? 'Semua' : getStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Donatur</p>
                  <p className="text-2xl font-bold text-gray-900">{mockMuzakki.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Donatur Baru</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockMuzakki.filter(m => m.status === 'baru').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Perlu Follow-up</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockMuzakki.filter(m => m.status === 'follow-up').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Donasi Rutin</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockMuzakki.filter(m => m.status === 'donasi').length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donatur List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Donatur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMuzakki.map((muzakki) => (
                <div key={muzakki.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary-600">
                        {muzakki.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{muzakki.name}</h3>
                      <p className="text-sm text-gray-500">{muzakki.phone}</p>
                      {muzakki.city && (
                        <p className="text-xs text-gray-400">{muzakki.city}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(muzakki.status)}>
                      {getStatusLabel(muzakki.status)}
                    </Badge>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredMuzakki.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada donatur yang sesuai dengan filter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopLayout>
  );
}

// Import additional icons
import { Users, UserPlus, Clock, Heart } from 'lucide-react';