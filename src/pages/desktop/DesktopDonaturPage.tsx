import { useState } from 'react';
import { UserPlus, Search, Filter, Upload, Phone, MessageCircle, Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { DesktopTopbar } from '../../components/desktop/DesktopTopbar';
import { useAppContext } from '../../contexts/AppContext';
import { getInitials, formatRelativeTime } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';

interface DesktopDonaturPageProps {
  onNavigate?: (page: string) => void;
}

export function DesktopDonaturPage({ onNavigate }: DesktopDonaturPageProps) {
  const { muzakkiList, deleteMuzakki, loading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'baru' | 'follow-up' | 'donasi'>('all');
  const [selectedMuzakki, setSelectedMuzakki] = useState<string[]>([]);

  const filteredMuzakki = muzakkiList.filter(muzakki => {
    // Skip null or undefined items
    if (!muzakki || !muzakki.name) return false;
    
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

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus ${name}?`)) {
      try {
        await deleteMuzakki(id);
        toast.success('Muzakki berhasil dihapus');
      } catch (error: any) {
        toast.error(error.message || 'Gagal menghapus muzakki');
      }
    }
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
    all: muzakkiList.filter(m => m && m.name).length,
    baru: muzakkiList.filter(m => m && m.status === 'baru').length,
    'follow-up': muzakkiList.filter(m => m && m.status === 'follow-up').length,
    donasi: muzakkiList.filter(m => m && m.status === 'donasi').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopTopbar 
        title="Daftar Muzakki" 
        subtitle={`${muzakkiList.length} total muzakki`}
        onNavigate={onNavigate}
      />

      <div className="p-8">
        {/* Action Bar */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari nama, nomor, atau kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filters */}
            <div className="flex gap-2">
              {(['all', 'baru', 'follow-up', 'donasi'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
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

            <div className="flex gap-2 ml-auto">
              <Button
                onClick={() => onNavigate?.('import-kontak')}
                variant="outline"
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button
                onClick={() => onNavigate?.('tambah-prospek')}
                className="bg-primary-600 hover:bg-primary-700 gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Tambah Muzakki
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Memuat data...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMuzakki.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Tidak ada muzakki yang sesuai filter'
                  : 'Belum ada muzakki'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Tambahkan muzakki pertama Anda untuk memulai'}
              </p>
              <Button
                onClick={() => onNavigate?.('tambah-prospek')}
                className="bg-primary-600 hover:bg-primary-700 gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Tambah Muzakki
              </Button>
            </div>
          </Card>
        )}

        {/* Table View */}
        {!loading && filteredMuzakki.length > 0 && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-600">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-6 py-4 text-left text-gray-600">Muzakki</th>
                    <th className="px-6 py-4 text-left text-gray-600">Kontak</th>
                    <th className="px-6 py-4 text-left text-gray-600">Kota</th>
                    <th className="px-6 py-4 text-left text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-gray-600">Terakhir Kontak</th>
                    <th className="px-6 py-4 text-right text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMuzakki.map((muzakki) => (
                    <tr key={muzakki.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${muzakki.name}`} />
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {getInitials(muzakki.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-gray-900">{muzakki.name}</p>
                            {muzakki.notes && (
                              <p className="text-gray-500 truncate max-w-xs">
                                {muzakki.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{muzakki.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">{muzakki.city || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(muzakki.status)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">
                          {formatRelativeTime(new Date(muzakki.last_contact))}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCall(muzakki.phone, muzakki.name)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Call"
                          >
                            <Phone className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleWhatsApp(muzakki.phone, muzakki.name)}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => onNavigate?.('detail-prospek')}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Detail"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(muzakki.id, muzakki.name)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-gray-600">
                Menampilkan {filteredMuzakki.length} dari {muzakkiList.length} muzakki
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary-600 text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}