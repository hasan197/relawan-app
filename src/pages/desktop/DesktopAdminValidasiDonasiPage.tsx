import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Search, Filter, FileText } from 'lucide-react';
import { DesktopTopbar } from '../../components/desktop/DesktopTopbar';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from 'sonner@2.0.3';
import { apiCall } from '../../lib/supabase';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import { LoadingSpinner } from '../../components/LoadingState';
import type { Donation } from '../../types';

interface DesktopAdminValidasiDonasiPageProps {
  onNavigate?: (page: string) => void;
}

export function DesktopAdminValidasiDonasiPage({ onNavigate }: DesktopAdminValidasiDonasiPageProps) {
  const { user } = useAppContext();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'validated' | 'rejected'>('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [validationAction, setValidationAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [donations, searchQuery, statusFilter]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/donations?admin=true');
      
      if (response.success) {
        const transformedDonations = response.data.map((d: any) => ({
          id: d.id,
          amount: d.amount,
          category: d.category,
          donorName: d.donor_name || d.donorName || 'Anonim',
          donorId: d.muzakki_id,
          relawanId: d.relawan_id,
          relawanName: d.relawan_name,
          eventName: d.eventName,
          createdAt: new Date(d.created_at),
          type: d.type || 'incoming',
          status: d.status || 'pending',
          buktiTransferUrl: d.bukti_transfer_url,
          paymentMethod: d.payment_method,
          notes: d.notes,
          validatedBy: d.validated_by,
          validatedByName: d.validated_by_name,
          validatedAt: d.validated_at ? new Date(d.validated_at) : undefined,
          rejectionReason: d.rejection_reason
        }));
        
        setDonations(transformedDonations);
      }
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      toast.error('Gagal memuat data donasi');
    } finally {
      setLoading(false);
    }
  };

  const filterDonations = () => {
    let filtered = [...donations];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.donorName.toLowerCase().includes(query) ||
        d.relawanName?.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setFilteredDonations(filtered);
  };

  const handleValidate = async () => {
    if (!selectedDonation || !user) return;

    if (validationAction === 'reject' && !rejectionReason.trim()) {
      toast.error('Alasan penolakan harus diisi');
      return;
    }

    try {
      setValidating(true);
      
      const response = await apiCall(`/donations/${selectedDonation.id}/validate`, {
        method: 'POST',
        body: JSON.stringify({
          admin_id: user.id,
          admin_name: user.name,
          action: validationAction,
          rejection_reason: validationAction === 'reject' ? rejectionReason : null
        })
      });

      if (response.success) {
        toast.success(validationAction === 'approve' ? 'Donasi berhasil divalidasi!' : 'Donasi ditolak');
        setShowValidateDialog(false);
        setSelectedDonation(null);
        setRejectionReason('');
        fetchDonations();
      }
    } catch (error: any) {
      console.error('Validation error:', error);
      toast.error(error.message || 'Gagal memvalidasi donasi');
    } finally {
      setValidating(false);
    }
  };

  const openValidateDialog = (donation: Donation, action: 'approve' | 'reject') => {
    setSelectedDonation(donation);
    setValidationAction(action);
    setRejectionReason('');
    setShowValidateDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Menunggu</Badge>;
      case 'validated':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Tervalidasi</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      zakat: 'bg-green-100 text-green-800 border-green-300',
      infaq: 'bg-blue-100 text-blue-800 border-blue-300',
      sedekah: 'bg-purple-100 text-purple-800 border-purple-300',
      wakaf: 'bg-orange-100 text-orange-800 border-orange-300'
    };
    
    return (
      <Badge variant="outline" className={colors[category as keyof typeof colors]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.status === 'pending').length,
    validated: donations.filter(d => d.status === 'validated').length,
    rejected: donations.filter(d => d.status === 'rejected').length,
    pendingAmount: donations
      .filter(d => d.status === 'pending')
      .reduce((sum, d) => sum + d.amount, 0),
    validatedAmount: donations
      .filter(d => d.status === 'validated')
      .reduce((sum, d) => sum + d.amount, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DesktopTopbar
          title="Validasi Donasi"
          subtitle="Memuat data donasi..."
          onNavigate={onNavigate}
        />
        <LoadingSpinner message="Memuat data donasi..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopTopbar
        title="Validasi Donasi"
        subtitle="Review dan validasi laporan donasi dari relawan"
        onNavigate={onNavigate}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donasi</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu Validasi</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(stats.pendingAmount)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tervalidasi</p>
                <p className="text-2xl font-bold text-green-600">{stats.validated}</p>
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(stats.validatedAmount)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari donatur atau relawan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[200px] h-9">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">Semua Status</SelectItem>
                <SelectItem key="pending" value="pending">Menunggu</SelectItem>
                <SelectItem key="validated" value="validated">Tervalidasi</SelectItem>
                <SelectItem key="rejected" value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Donations Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Donatur</TableHead>
                <TableHead>Relawan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead className="text-right">Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Tidak ada donasi ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="text-sm">
                      {formatRelativeTime(donation.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{donation.donorName}</div>
                        {donation.notes && (
                          <div className="text-xs text-gray-500 line-clamp-1">{donation.notes}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{donation.relawanName || '-'}</TableCell>
                    <TableCell>{getCategoryBadge(donation.category)}</TableCell>
                    <TableCell className="text-sm">
                      {donation.paymentMethod === 'tunai' ? '💵 Tunai' : 
                       donation.paymentMethod === 'transfer' ? '🏦 Transfer' : 
                       donation.paymentMethod === 'qris' ? '📱 QRIS' : '💳 Lainnya'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary-600">
                      {formatCurrency(donation.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(donation.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        {donation.buktiTransferUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(donation.buktiTransferUrl, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {donation.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => openValidateDialog(donation, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => openValidateDialog(donation, 'reject')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Validation Dialog */}
      <Dialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {validationAction === 'approve' ? 'Validasi Donasi' : 'Tolak Donasi'}
            </DialogTitle>
          </DialogHeader>

          {selectedDonation && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Donatur:</span>
                  <span className="font-semibold">{selectedDonation.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nominal:</span>
                  <span className="font-bold text-primary-600">
                    {formatCurrency(selectedDonation.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Kategori:</span>
                  {getCategoryBadge(selectedDonation.category)}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Relawan:</span>
                  <span className="font-semibold">{selectedDonation.relawanName}</span>
                </div>
                {selectedDonation.notes && (
                  <div>
                    <span className="text-sm text-gray-600">Catatan:</span>
                    <p className="text-sm mt-1">{selectedDonation.notes}</p>
                  </div>
                )}
              </div>

              {validationAction === 'reject' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Alasan Penolakan *
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Contoh: Bukti transfer tidak jelas, nominal tidak sesuai, dll."
                    rows={4}
                  />
                </div>
              )}

              {validationAction === 'approve' && (
                <p className="text-sm text-gray-600">
                  Donasi ini akan divalidasi dan masuk ke dalam total donasi tervalidasi.
                  Relawan akan mendapat notifikasi bahwa donasi mereka telah divalidasi.
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowValidateDialog(false)}
              disabled={validating}
            >
              Batal
            </Button>
            <Button
              onClick={handleValidate}
              disabled={validating}
              className={validationAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {validating ? 'Memproses...' : validationAction === 'approve' ? 'Validasi' : 'Tolak'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
