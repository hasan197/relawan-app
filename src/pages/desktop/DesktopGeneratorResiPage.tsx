import { useState } from 'react';
import { ArrowLeft, Download, Share2, Copy, CheckCircle, Printer, Receipt } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { formatCurrency, generateReceiptNumber, copyToClipboard } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';

interface DesktopGeneratorResiPageProps {
  onBack?: () => void;
}

export function DesktopGeneratorResiPage({ onBack }: DesktopGeneratorResiPageProps) {
  const [formData, setFormData] = useState({
    donorName: '',
    amount: '',
    category: 'zakat' as 'zakat' | 'infaq' | 'sedekah' | 'wakaf',
    paymentMethod: 'transfer'
  });

  const [receipt, setReceipt] = useState<{
    number: string;
    date: string;
    donorName: string;
    amount: number;
    category: string;
    paymentMethod: string;
  } | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.donorName || !formData.amount) {
      toast.error('Nama donatur dan nominal harus diisi');
      return;
    }

    const receiptNumber = generateReceiptNumber();
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setReceipt({
      number: receiptNumber,
      date: today,
      donorName: formData.donorName,
      amount: parseFloat(formData.amount),
      category: formData.category,
      paymentMethod: formData.paymentMethod
    });

    toast.success('Resi berhasil dibuat!');
  };

  const handleCopy = async () => {
    if (!receipt) return;

    const text = `
RESI DONASI ${receipt.category.toUpperCase()}

No. Resi: ${receipt.number}
Tanggal: ${receipt.date}

Nama Donatur: ${receipt.donorName}
Nominal: ${formatCurrency(receipt.amount)}
Kategori: ${receipt.category.charAt(0).toUpperCase() + receipt.category.slice(1)}
Metode Pembayaran: ${receipt.paymentMethod === 'transfer' ? 'Transfer Bank' : 'Tunai'}

Jazakumullah khairan katsiran
Semoga menjadi amal jariyah yang berkah

---
ZISWAF Manager
Platform Manajemen Relawan Zakat Digital
    `.trim();

    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Resi berhasil disalin!');
    } else {
      toast.error('Gagal menyalin resi');
    }
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

Jazakumullah khairan katsiran 🤲
Semoga menjadi amal jariyah yang berkah ✨
    `.trim();

    if (navigator.share) {
      navigator.share({ text }).then(() => {
        toast.success('Resi berhasil dibagikan!');
      });
    } else {
      copyToClipboard(text).then(success => {
        if (success) toast.success('Resi disalin ke clipboard!');
      });
    }
  };

  const handleReset = () => {
    setReceipt(null);
    setFormData({
      donorName: '',
      amount: '',
      category: 'zakat',
      paymentMethod: 'transfer'
    });
  };

  const categoryColors = {
    zakat: 'from-green-500 to-green-600',
    infaq: 'from-yellow-400 to-yellow-500',
    sedekah: 'from-blue-500 to-blue-600',
    wakaf: 'from-slate-500 to-slate-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h1 className="text-white text-3xl mb-1">Generator Resi Donasi</h1>
            <p className="text-primary-100">
              Buat resi digital untuk bukti penerimaan donasi
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {!receipt ? (
          // Form
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <Card className="p-8">
              <h3 className="text-gray-900 mb-6">Buat Resi Baru</h3>
              
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <Label htmlFor="donorName">Nama Donatur *</Label>
                  <Input
                    id="donorName"
                    type="text"
                    placeholder="Masukkan nama donatur"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Nominal Donasi *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="mt-1.5"
                  />
                  {formData.amount && (
                    <p className="text-sm text-gray-500 mt-2">
                      = {formatCurrency(parseFloat(formData.amount))}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Kategori Donasi</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {(['zakat', 'infaq', 'sedekah', 'wakaf'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`px-4 py-3 rounded-lg transition-all capitalize ${
                          formData.category === cat
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Metode Pembayaran</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      { value: 'transfer', label: 'Transfer Bank' },
                      { value: 'cash', label: 'Tunai' }
                    ].map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                        className={`px-4 py-3 rounded-lg transition-all ${
                          formData.paymentMethod === method.value
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700"
                  size="lg"
                >
                  <Receipt className="h-5 w-5 mr-2" />
                  Generate Resi
                </Button>
              </form>
            </Card>

            {/* Right Column - Info */}
            <div className="space-y-6">
              <Card className="p-8 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Receipt className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Tentang Resi Digital</h3>
                    <p className="text-gray-600">
                      Resi digital adalah bukti penerimaan donasi yang dapat dibagikan kepada donatur
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900 mb-1">Nomor Resi Unik</p>
                      <p className="text-gray-600 text-sm">Setiap resi memiliki nomor identifikasi unik</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900 mb-1">Format Profesional</p>
                      <p className="text-gray-600 text-sm">Tampilan resi yang rapi dan mudah dibaca</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900 mb-1">Mudah Dibagikan</p>
                      <p className="text-gray-600 text-sm">Dapat dikirim via WhatsApp atau media sosial</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <h4 className="text-blue-900 mb-3">💡 Tips Penggunaan</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• Buat resi segera setelah menerima donasi</li>
                  <li>• Pastikan nama dan nominal sudah benar</li>
                  <li>• Simpan screenshot resi untuk arsip</li>
                  <li>• Kirimkan resi kepada donatur sebagai bukti</li>
                </ul>
              </Card>
            </div>
          </div>
        ) : (
          // Receipt Display
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Receipt Preview */}
            <Card className="p-10">
              <div className={`bg-gradient-to-br ${categoryColors[receipt.category as keyof typeof categoryColors]} text-white p-8 rounded-2xl mb-6`}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl mb-2">RESI DONASI {receipt.category.toUpperCase()}</h2>
                  <p className="text-white/90">ZISWAF Manager</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Nomor Resi</p>
                    <p className="text-xl font-mono">{receipt.number}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">Tanggal</p>
                    <p className="text-lg">{receipt.date}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-gray-600 text-sm mb-1">Nama Donatur</p>
                  <p className="text-gray-900 text-lg">{receipt.donorName}</p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <p className="text-gray-600 text-sm mb-1">Nominal Donasi</p>
                  <p className="text-gray-900 text-2xl">{formatCurrency(receipt.amount)}</p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <p className="text-gray-600 text-sm mb-1">Kategori</p>
                  <p className="text-gray-900 capitalize">{receipt.category}</p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <p className="text-gray-600 text-sm mb-1">Metode Pembayaran</p>
                  <p className="text-gray-900">{receipt.paymentMethod === 'transfer' ? 'Transfer Bank' : 'Tunai'}</p>
                </div>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-800">Jazakumullah khairan katsiran 🤲</p>
                <p className="text-green-700 text-sm mt-1">Semoga menjadi amal jariyah yang berkah</p>
              </div>
            </Card>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Aksi</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleShare}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Bagikan Resi
                  </Button>

                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    Salin Teks Resi
                  </Button>

                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full"
                  >
                    Buat Resi Baru
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <h4 className="text-green-900">Resi Berhasil Dibuat!</h4>
                </div>
                <p className="text-green-800 mb-4">
                  Resi dengan nomor <strong>{receipt.number}</strong> sudah siap dibagikan
                </p>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li>✓ Nomor resi unik telah digenerate</li>
                  <li>✓ Data donatur tercatat</li>
                  <li>✓ Siap dikirim ke donatur</li>
                </ul>
              </Card>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <h4 className="text-blue-900 mb-3">💡 Langkah Selanjutnya</h4>
                <ol className="space-y-2 text-blue-800 text-sm">
                  <li>1. Bagikan resi kepada donatur via WhatsApp</li>
                  <li>2. Simpan screenshot untuk arsip</li>
                  <li>3. Catat di sistem donasi (opsional)</li>
                  <li>4. Kirim ucapan terima kasih</li>
                </ol>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}