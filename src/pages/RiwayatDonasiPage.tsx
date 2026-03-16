import { useState, useEffect } from 'react';
import { Download, Receipt, Eye, Loader2, CheckCircle, Clock, XCircle, Share2, Copy, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { formatCurrency, formatRelativeTime, copyToClipboard } from '../lib/utils';
import { toast } from 'sonner';
import { useAppContext } from '../contexts/AppContext';
import { apiCall } from '../lib/supabase';
import { HeaderWithBack } from '../components/HeaderWithBack';
import { LoadingSpinner } from '../components/LoadingState';

interface Donation {
  id: string;
  receipt_number: string;
  donor_name: string;
  amount: number;
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf';
  payment_method: 'tunai' | 'transfer' | 'qris' | 'other';
  status: 'pending' | 'validated' | 'rejected';
  notes?: string;
  bukti_transfer_url?: string;
  created_at: string;
  validated_at?: string;
  validated_by?: string;
}

interface RiwayatDonasiPageProps {
  onBack?: () => void;
}

export function RiwayatDonasiPage({ onBack }: RiwayatDonasiPageProps) {
  const { user } = useAppContext();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'validated' | 'rejected'>('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  
  // Bukti transfer modal
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [buktiUrl, setBuktiUrl] = useState<string | null>(null);
  const [loadingBukti, setLoadingBukti] = useState(false);

  const fetchDonations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await apiCall(`/donations?relawan_id=${user.id}&order=created_at.desc`);
      setDonations(response.data || []);
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      toast.error('Gagal memuat data donasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [user?.id]);

  const filteredDonations = filterStatus === 'all'
    ? donations
    : donations.filter(d => d.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validated':
        return (
          <Badge className="bg-green-100 text-green-800 border-none">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tervalidasi
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-none">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-none">
            <XCircle className="h-3 w-3 mr-1" />
            Ditolak
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      zakat: 'Zakat',
      infaq: 'Infaq',
      sedekah: 'Sedekah',
      wakaf: 'Wakaf'
    };
    return labels[category] || category;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      tunai: 'Tunai',
      transfer: 'Transfer Bank',
      qris: 'QRIS',
      other: 'Lainnya'
    };
    return labels[method] || method;
  };

  const handleCopyReceipt = (donation: Donation) => {
    const text = `
RESI DONASI ${donation.category.toUpperCase()}

No. Resi: ${donation.receipt_number}
Tanggal: ${new Date(donation.created_at).toLocaleDateString('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})}

Nama Donatur: ${donation.donor_name}
Nominal: ${formatCurrency(donation.amount)}
Kategori: ${getCategoryLabel(donation.category)}
Metode Pembayaran: ${getPaymentMethodLabel(donation.payment_method)}

Status: ${donation.status === 'validated' ? 'Tervalidasi ✓' : donation.status === 'pending' ? 'Menunggu Validasi ⏳' : 'Ditolak ✗'}

Jazakumullah khairan katsiran
Semoga menjadi amal jariyah yang berkah

---
ZISWAF Manager
Platform Manajemen Relawan Zakat Digital
    `.trim();

    copyToClipboard(text);
    toast.success('Resi berhasil disalin!');
  };

  const handleShareReceipt = (donation: Donation) => {
    const text = `
RESI DONASI ${donation.category.toUpperCase()}

No. Resi: ${donation.receipt_number}
Tanggal: ${new Date(donation.created_at).toLocaleDateString('id-ID')}

Nama Donatur: ${donation.donor_name}
Nominal: ${formatCurrency(donation.amount)}
Kategori: ${getCategoryLabel(donation.category)}

Status: ${donation.status === 'validated' ? 'Tervalidasi ✓' : donation.status === 'pending' ? 'Menunggu Validasi ⏳' : 'Ditolak ✗'}

Jazakumullah khairan katsiran 🤲
    `.trim();

    if (navigator.share) {
      navigator.share({
        title: 'Resi Donasi ZISWAF',
        text: text
      }).catch(err => console.log('Share error:', err));
    } else {
      copyToClipboard(text);
      toast.success('Resi berhasil disalin!');
    }
  };

  const handleDownloadReceipt = (donation: Donation) => {
    const receiptContent = `
╔══════════════════════════════════════════════════════════╗
║                    RESI DONASI                           ║
║                  ZISWAF Manager                          ║
╚══════════════════════════════════════════════════════════╝

No. Resi         : ${donation.receipt_number}
Tanggal          : ${new Date(donation.created_at).toLocaleDateString('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})}

────────────────────────────────────────────────────────────
Nama Donatur     : ${donation.donor_name}
Nominal          : ${formatCurrency(donation.amount)}
Kategori         : ${getCategoryLabel(donation.category)}
Metode Bayar     : ${getPaymentMethodLabel(donation.payment_method)}
────────────────────────────────────────────────────────────

Status           : ${donation.status === 'validated' ? '✓ Tervalidasi' : donation.status === 'pending' ? '⏳ Menunggu Validasi' : '✗ Ditolak'}

${donation.notes ? `Catatan          : ${donation.notes}` : ''}

╔══════════════════════════════════════════════════════════╗
║         Jazakumullah khairan katsiran                    ║
║   Semoga menjadi amal jariyah yang berkah                ║
╚══════════════════════════════════════════════════════════╝

ZISWAF Manager
Platform Manajemen Relawan Zakat Digital
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resi-${donation.receipt_number}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Resi berhasil diunduh!');
  };

  const openBuktiModal = async (donation: Donation) => {
    setLoadingBukti(true);
    setShowBuktiModal(true);
    setBuktiUrl(null);
    
    try {
      const url = donation.bukti_transfer_url;
      if (url?.startsWith('http')) {
        setBuktiUrl(url);
      } else if (url) {
        const result = await apiCall('/storage-url', {
          method: 'POST',
          body: JSON.stringify({ storageId: url })
        });
        if (result.url) {
          setBuktiUrl(result.url);
        } else {
          toast.error('Gagal mendapatkan URL bukti transfer');
          setShowBuktiModal(false);
        }
      }
    } catch (e) {
      toast.error('Gagal membuka bukti transfer');
      setShowBuktiModal(false);
    } finally {
      setLoadingBukti(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeaderWithBack
        pageName="Riwayat Donasi"
        subtitle={loading ? 'Memuat...' : `${donations.length} donasi`}
        onBack={onBack}
        rightIcon={Receipt}
        sticky
      />

      <div className="px-0 pt-3 bg-white border-b border-gray-200">
        <div className="flex px-4 gap-2 overflow-x-auto scrollbar-hide pb-4">
          {[
            { id: 'all', label: 'Semua', count: donations.length },
            { id: 'pending', label: 'Menunggu', count: donations.filter(d => d.status === 'pending').length },
            { id: 'validated', label: 'Tervalidasi', count: donations.filter(d => d.status === 'validated').length },
            { id: 'rejected', label: 'Ditolak', count: donations.filter(d => d.status === 'rejected').length }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setFilterStatus(filter.id as any)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-medium ${filterStatus === filter.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : filteredDonations.length === 0 ? (
          <Card className="p-8 text-center">
            <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-1">
              {filterStatus === 'all'
                ? 'Belum ada donasi'
                : `Belum ada donasi dengan status ${filterStatus}`}
            </p>
            <p className="text-gray-400 text-sm">
              Riwayat donasi Anda akan muncul di sini
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredDonations.map((donation) => (
              <Card key={donation.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Receipt className="h-4 w-4 text-primary-600" />
                      <span className="font-mono text-sm text-gray-600">{donation.receipt_number}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{donation.donor_name}</h3>
                  </div>
                  {getStatusBadge(donation.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500">Nominal:</span>
                    <p className="font-bold text-primary-600">{formatCurrency(donation.amount)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Kategori:</span>
                    <p className="font-medium text-gray-900">{getCategoryLabel(donation.category)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Metode:</span>
                    <p className="font-medium text-gray-900">{getPaymentMethodLabel(donation.payment_method)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tanggal:</span>
                    <p className="font-medium text-gray-900">{formatRelativeTime(donation.created_at)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {donation.bukti_transfer_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openBuktiModal(donation)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Bukti
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedDonation(donation)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownloadReceipt(donation)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Unduh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareReceipt(donation)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedDonation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Detail Donasi</h2>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center pb-4 border-b">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-2">
                    <Receipt className="h-6 w-6 text-primary-600" />
                  </div>
                  <p className="font-mono text-sm text-gray-600">{selectedDonation.receipt_number}</p>
                  <div className="mt-2">{getStatusBadge(selectedDonation.status)}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nama Donatur</span>
                    <span className="font-medium">{selectedDonation.donor_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nominal</span>
                    <span className="font-bold text-primary-600">{formatCurrency(selectedDonation.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kategori</span>
                    <span className="font-medium">{getCategoryLabel(selectedDonation.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Metode Bayar</span>
                    <span className="font-medium">{getPaymentMethodLabel(selectedDonation.payment_method)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="font-medium">
                      {new Date(selectedDonation.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      } as any)}
                    </span>
                  </div>
                  {selectedDonation.validated_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Divalidasi</span>
                      <span className="font-medium">
                        {new Date(selectedDonation.validated_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  {selectedDonation.notes && (
                    <div className="pt-2 border-t">
                      <span className="text-gray-500 text-sm">Catatan:</span>
                      <p className="text-gray-700 mt-1">{selectedDonation.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleCopyReceipt(selectedDonation)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Salin
                  </Button>
                  <Button
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                    onClick={() => handleDownloadReceipt(selectedDonation)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Unduh Resi
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Bukti Transfer Preview Modal */}
      <Dialog open={showBuktiModal} onOpenChange={setShowBuktiModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-[95vw] h-[90vh] flex flex-col p-4">
          <DialogHeader>
            <DialogTitle>Bukti Transfer</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex items-center justify-center overflow-auto min-h-0">
            {loadingBukti ? (
              <LoadingSpinner />
            ) : buktiUrl ? (
              <img 
                src={buktiUrl} 
                alt="Bukti Transfer" 
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-gray-500">Gagal memuat bukti transfer</div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowBuktiModal(false)} className="w-full sm:w-auto">
              Tutup
            </Button>
            {buktiUrl && (
              <Button onClick={() => window.open(buktiUrl, '_blank')} className="w-full sm:w-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                Buka di Tab Baru
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
