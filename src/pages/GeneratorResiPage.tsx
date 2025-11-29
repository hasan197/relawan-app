import { useState, useRef } from 'react';
import { ArrowLeft, Download, Share2, Copy, CheckCircle, Printer, Receipt, Upload, Image as ImageIcon } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { formatCurrency, generateReceiptNumber, copyToClipboard } from '../lib/utils';
import { toast } from 'sonner@2.0.3';
import { useAppContext } from '../contexts/AppContext';
import { useDonations } from '../hooks/useDonations';
import { apiCall } from '../lib/supabase';

interface GeneratorResiPageProps {
  onBack?: () => void;
}

export function GeneratorResiPage({ onBack }: GeneratorResiPageProps) {
  const { user, muzakkiList } = useAppContext();
  const { addDonationWithFile } = useDonations(user?.id || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    donorName: '',
    muzakkiId: '',
    amount: '',
    category: 'zakat' as 'zakat' | 'infaq' | 'sedekah' | 'wakaf',
    paymentMethod: 'transfer' as 'tunai' | 'transfer' | 'qris' | 'other',
    notes: ''
  });

  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [buktiPreview, setBuktiPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [receipt, setReceipt] = useState<{
    number: string;
    date: string;
    donorName: string;
    amount: number;
    category: string;
    paymentMethod: string;
  } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }

      setBuktiFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBuktiPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadBuktiTransfer = async (donationId: string): Promise<string | null> => {
    if (!buktiFile) return null;

    try {
      const formData = new FormData();
      formData.append('file', buktiFile);
      formData.append('donation_id', donationId);

      const response = await fetch(
        `https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/donations/upload-bukti`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZXJhbnpmcWtjY2RxYWRwaWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMzcxMTgsImV4cCI6MjA0NjkxMzExOH0.6Uyy-d1VXz_DvdbK40W0yvIqZBz4GJc3SFn9k_WN27s`
          },
          body: formData
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Upload failed with status:', response.status, result);
        throw new Error(result.error || `Upload failed with status ${response.status}`);
      }

      if (result.success) {
        return result.data.url;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Gagal upload bukti transfer: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.donorName || !formData.amount) {
      toast.error('Nama donatur dan nominal harus diisi');
      return;
    }

    if (!user) {
      toast.error('User tidak ditemukan');
      return;
    }

    // Validate transfer requires bukti
    if (formData.paymentMethod === 'transfer' && !buktiFile) {
      toast.error('Bukti transfer harus diupload untuk pembayaran transfer');
      return;
    }

    try {
      setSubmitting(true);

      const amount = parseFloat(formData.amount);
      const receiptNumber = generateReceiptNumber();

      // Create donation with file upload in one step
      const donationData = {
        donor_id: formData.muzakkiId || undefined,
        donor_name: formData.donorName,
        amount: amount,
        category: formData.category,
        type: 'incoming' as const,
        payment_method: formData.paymentMethod,
        receipt_number: receiptNumber,
        notes: formData.notes,
        relawan_name: user.full_name || 'Unknown', // 🔥 Fix: use user.full_name
      };

      const response = await addDonationWithFile(donationData, buktiFile || undefined);

      // Generate receipt
      const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      setReceipt({
        number: receiptNumber,
        date: today,
        donorName: formData.donorName,
        amount: amount,
        category: formData.category,
        paymentMethod: formData.paymentMethod
      });

      toast.success('Donasi berhasil dilaporkan!', {
        description: 'Menunggu validasi dari admin'
      });

      // Reset form
      setFormData({
        donorName: '',
        muzakkiId: '',
        amount: '',
        category: 'zakat',
        paymentMethod: 'transfer',
        notes: ''
      });
      setBuktiFile(null);
      setBuktiPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      console.error('Submit donation error:', error);
      toast.error(error.message || 'Gagal menyimpan donasi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!receipt) return;

    const text = `
RESI DONASI ${receipt.category.toUpperCase()}

No. Resi: ${receipt.number}
Tanggal: ${receipt.date}

Nama Donatur: ${receipt.donorName}
Nominal: ${formatCurrency(receipt.amount)}
Kategori: ${receipt.category.charAt(0).toUpperCase() + receipt.category.slice(1)}
Metode Pembayaran: ${
  receipt.paymentMethod === 'transfer' ? 'Transfer Bank' :
  receipt.paymentMethod === 'tunai' ? 'Tunai' :
  receipt.paymentMethod === 'qris' ? 'QRIS' : 'Lainnya'
}

Status: Menunggu Validasi Admin

Jazakumullah khairan katsiran
Semoga menjadi amal jariyah yang berkah

---
ZISWAF Manager
Platform Manajemen Relawan Zakat Digital
    `.trim();

    copyToClipboard(text);
    toast.success('Resi berhasil disalin!');
  };

  const handleShare = () => {
    if (!receipt) return;

    const text = `
RESI DONASI ${receipt.category.toUpperCase()}

No. Resi: ${receipt.number}
Tanggal: ${receipt.date}

Nama Donatur: ${receipt.donorName}
Nominal: ${formatCurrency(receipt.amount)}
Kategori: ${receipt.category.charAt(0).toUpperCase() + receipt.category.slice(1)}

Status: Menunggu Validasi Admin ⏳

Jazakumullah khairan katsiran 🤲
Semoga menjadi amal jariyah yang berkah ✨
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Lapor Donasi</h1>
            <p className="text-sm text-primary-100">Catat & upload bukti transfer</p>
          </div>
          <Receipt className="h-6 w-6 opacity-80" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Form */}
        <Card className="p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Desktop: 2 Column Layout for Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Donatur Selection */}
              <div className="md:col-span-2">
                <Label htmlFor="muzakki">Pilih Donatur (Opsional)</Label>
                <Select value={formData.muzakkiId} onValueChange={(value) => {
                  if (value === 'new') {
                    setFormData({ ...formData, muzakkiId: '', donorName: '' });
                  } else {
                    setFormData({ ...formData, muzakkiId: value });
                    const selected = muzakkiList.find(m => m.id === value);
                    if (selected) {
                      setFormData(prev => ({ ...prev, donorName: selected.name }));
                    }
                  }
                }}>
                  <SelectTrigger className="h-10 md:h-12">
                    <SelectValue placeholder="Pilih dari daftar muzakki" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Donatur Baru</SelectItem>
                    {muzakkiList.map((muzakki) => (
                      <SelectItem key={muzakki.id} value={muzakki.id}>
                        {muzakki.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Donor Name */}
              <div>
                <Label htmlFor="donorName">Nama Donatur *</Label>
                <Input
                  id="donorName"
                  placeholder="Masukkan nama donatur"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  required
                  className="h-10 md:h-12"
                />
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount">Nominal Donasi *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Contoh: 500000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="h-10 md:h-12"
                />
                {formData.amount && (
                  <p className="text-sm text-primary-600 mt-1">
                    {formatCurrency(parseFloat(formData.amount))}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="h-10 md:h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zakat">Zakat</SelectItem>
                    <SelectItem value="infaq">Infaq</SelectItem>
                    <SelectItem value="sedekah">Sedekah</SelectItem>
                    <SelectItem value="wakaf">Wakaf</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method */}
              <div>
                <Label htmlFor="paymentMethod">Metode Pembayaran *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value: any) => setFormData({ ...formData, paymentMethod: value })}>
                  <SelectTrigger className="h-10 md:h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tunai">💵 Tunai</SelectItem>
                    <SelectItem value="transfer">🏦 Transfer Bank</SelectItem>
                    <SelectItem value="qris">📱 QRIS</SelectItem>
                    <SelectItem value="other">💳 Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bukti Transfer Upload - Full Width */}
            {formData.paymentMethod !== 'tunai' && (
              <div>
                <Label>
                  Bukti Transfer {formData.paymentMethod === 'transfer' ? '*' : '(Opsional)'}
                </Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="bukti-upload"
                  />
                  
                  {buktiPreview ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative rounded-lg overflow-hidden border-2 border-primary-200">
                        <img
                          src={buktiPreview}
                          alt="Preview bukti transfer"
                          className="w-full h-48 md:h-64 object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white"
                          onClick={() => {
                            setBuktiFile(null);
                            setBuktiPreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
                      <div className="flex items-center">
                        <label
                          htmlFor="bukti-upload"
                          className="w-full flex items-center justify-center gap-2 p-4 md:p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors"
                        >
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">Ganti Gambar</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="bukti-upload"
                      className="flex flex-col items-center justify-center gap-2 p-6 md:p-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors"
                    >
                      <ImageIcon className="h-10 w-10 md:h-12 md:w-12 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        Upload Bukti Transfer
                      </span>
                      <span className="text-xs text-gray-500">
                        JPG, PNG (Max 5MB)
                      </span>
                    </label>
                  )}
                </div>
                {formData.paymentMethod === 'transfer' && !buktiFile && (
                  <p className="text-xs text-red-500 mt-1">
                    * Wajib upload bukti transfer untuk pembayaran via transfer
                  </p>
                )}
              </div>
            )}

            {/* Notes - Full Width */}
            <div>
              <Label htmlFor="notes">Catatan (Opsional)</Label>
              <Textarea
                id="notes"
                placeholder="Tambahkan catatan jika diperlukan..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="md:rows-4"
              />
            </div>

            {/* Submit Button - Centered on Desktop */}
            <div className="md:flex md:justify-center md:pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto md:min-w-[320px] bg-primary-600 hover:bg-primary-700 h-11 md:h-12"
                disabled={submitting}
              >
                {submitting ? (
                  'Menyimpan...'
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Lapor Donasi
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Donasi akan menunggu validasi dari admin
            </p>
          </form>
        </Card>

        {/* Receipt Preview */}
        {receipt && (
          <Card className="p-6 bg-gradient-to-br from-white to-primary-50">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-3">
                <Receipt className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="font-bold text-xl mb-1">Resi Donasi</h2>
              <p className="text-sm text-gray-600">Donasi berhasil dilaporkan!</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">No. Resi</span>
                <span className="font-bold">{receipt.number}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tanggal</span>
                <span className="font-medium">{receipt.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Donatur</span>
                <span className="font-medium">{receipt.donorName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Nominal</span>
                <span className="font-bold text-lg text-primary-600">
                  {formatCurrency(receipt.amount)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Kategori</span>
                <span className="font-medium capitalize">{receipt.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  Menunggu Validasi
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-800 text-center">
                ⏳ Donasi Anda sedang menunggu validasi dari admin. Anda akan mendapat notifikasi setelah divalidasi.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Copy className="h-4 w-4" />
                Salin
              </Button>
              <Button
                onClick={handleShare}
                className="flex-1 gap-2 bg-primary-600 hover:bg-primary-700"
              >
                <Share2 className="h-4 w-4" />
                Bagikan
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Jazakumullah khairan katsiran 🤲
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
