import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Eye, Download, Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner@2.0.3';
import { apiCall } from '../lib/supabase';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency, formatRelativeTime } from '../lib/utils';
import { LoadingSpinner } from '../components/LoadingState';
import type { Donation } from '../types';

interface AdminValidasiDonasiPageProps {
  onBack?: () => void;
}

export function AdminValidasiDonasiPage({ onBack }: AdminValidasiDonasiPageProps) {
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
        // Transform backend data to frontend format
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

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.donorName.toLowerCase().includes(query) ||
        d.relawanName?.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
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
        fetchDonations(); // Refresh list
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
    rejected: donations.filter(d => d.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
          <h1 className="font-semibold text-lg">Validasi Donasi</h1>
        </div>
        <LoadingSpinner message="Memuat data donasi..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">Validasi Donasi</h1>
            <p className="text-sm text-primary-100">Review & validasi laporan donasi</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xl font-bold">{stats.total}</div>
            <div className="text-xs text-primary-100">Total</div>
          </div>
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xl font-bold">{stats.pending}</div>
            <div className="text-xs text-yellow-100">Pending</div>
          </div>
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xl font-bold">{stats.validated}</div>
            <div className="text-xs text-green-100">Valid</div>
          </div>
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xl font-bold">{stats.rejected}</div>
            <div className="text-xs text-red-100">Tolak</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari donatur atau relawan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="h-10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="validated">Tervalidasi</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Donations List */}
      <div className="px-4 pb-4 space-y-3">
        {filteredDonations.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="text-gray-400 mb-2">📋</div>
            <p className="text-gray-600">Tidak ada donasi ditemukan</p>
          </Card>
        ) : (
          filteredDonations.map((donation) => (
            <Card key={donation.id} className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getCategoryBadge(donation.category)}
                    {getStatusBadge(donation.status)}
                  </div>
                  <h3 className="font-semibold">{donation.donorName}</h3>
                  <p className="text-sm text-gray-500">
                    Relawan: {donation.relawanName || 'Unknown'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-primary-600">
                    {formatCurrency(donation.amount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(donation.createdAt)}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {donation.paymentMethod === 'tunai' ? '💵 Tunai' : 
                   donation.paymentMethod === 'transfer' ? '🏦 Transfer' : 
                   donation.paymentMethod === 'qris' ? '📱 QRIS' : '💳 Lainnya'}
                </span>
              </div>

              {/* Notes */}
              {donation.notes && (
                <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                  {donation.notes}
                </p>
              )}

              {/* Rejection Reason */}
              {donation.status === 'rejected' && donation.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-red-800">
                    <strong>Alasan Ditolak:</strong> {donation.rejectionReason}
                  </p>
                </div>
              )}

              {/* Validation Info */}
              {donation.status !== 'pending' && donation.validatedByName && (
                <div className="text-xs text-gray-500 mb-3">
                  Divalidasi oleh {donation.validatedByName} • {formatRelativeTime(donation.validatedAt!)}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {donation.buktiTransferUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(donation.buktiTransferUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Lihat Bukti
                  </Button>
                )}
                
                {donation.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => openValidateDialog(donation, 'approve')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Validasi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => openValidateDialog(donation, 'reject')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Tolak
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
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
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
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
