import { useState } from 'react';
import { ArrowLeft, Download, Share2, Copy, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { formatCurrency, generateReceiptNumber } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

interface GeneratorResiPageProps {
  onBack?: () => void;
}

export function GeneratorResiPage({ onBack }: GeneratorResiPageProps) {
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

  const handleCopy = () => {
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

    navigator.clipboard.writeText(text);
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

Jazakumullah khairan katsiran 🤲
Semoga menjadi amal jariyah yang berkah ✨
    `.trim();

    if (navigator.share) {
      navigator.share({ text }).then(() => {
        toast.success('Resi berhasil dibagikan!');
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Resi disalin ke clipboard!');
    }
  };

  const categoryColors = {
    zakat: 'from-green-500 to-green-600',
    infaq: 'from-yellow-400 to-yellow-500',
    sedekah: 'from-blue-500 to-blue-600',
    wakaf: 'from-slate-500 to-slate-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Generator Resi Donasi</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {!receipt ? (
          // Form
          <Card className="p-6 shadow-card">
            <h3 className="text-gray-900 mb-4">Buat Resi Baru</h3>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <Label htmlFor="donorName">Nama Donatur *</Label>
                <Input
                  id="donorName"
                  type="text"
                  placeholder="Masukkan nama donatur"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
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
                />
              </div>

              <div>
                <Label>Kategori</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {(['zakat', 'infaq', 'sedekah', 'wakaf'] as const).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setFormData({ ...formData, category })}
                      className={`px-3 py-2 rounded-lg transition-colors capitalize ${
                        formData.category === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Metode Pembayaran</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'transfer' })}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      formData.paymentMethod === 'transfer'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Transfer Bank
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      formData.paymentMethod === 'cash'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tunai
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                Generate Resi
              </Button>
            </form>
          </Card>
        ) : (
          // Receipt Display
          <div className="space-y-4">
            <Card className={`overflow-hidden shadow-xl bg-gradient-to-br ${categoryColors[receipt.category as keyof typeof categoryColors]} text-white`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="opacity-90 mb-1">Resi Donasi</p>
                    <h2 className="uppercase">{receipt.category}</h2>
                  </div>
                  <CheckCircle className="h-12 w-12 opacity-90" />
                </div>

                <div className="space-y-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div>
                    <p className="opacity-80">No. Resi</p>
                    <p className="text-xl">{receipt.number}</p>
                  </div>
                  
                  <div>
                    <p className="opacity-80">Tanggal</p>
                    <p>{receipt.date}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="text-gray-900 mb-4">Detail Donasi</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Nama Donatur</span>
                  <span className="text-gray-900">{receipt.donorName}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Nominal</span>
                  <span className="text-gray-900">{formatCurrency(receipt.amount)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Kategori</span>
                  <span className="text-gray-900 capitalize">{receipt.category}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Metode Pembayaran</span>
                  <span className="text-gray-900">
                    {receipt.paymentMethod === 'transfer' ? 'Transfer Bank' : 'Tunai'}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary-50 rounded-lg text-center">
                <p className="text-primary-700">
                  Jazakumullah khairan katsiran 🤲
                </p>
                <p className="text-primary-600">
                  Semoga menjadi amal jariyah yang berkah
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex-col h-auto py-3"
              >
                <Copy className="h-5 w-5 mb-1" />
                <span>Salin</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-col h-auto py-3"
              >
                <Share2 className="h-5 w-5 mb-1" />
                <span>Bagikan</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex-col h-auto py-3"
              >
                <Download className="h-5 w-5 mb-1" />
                <span>Unduh</span>
              </Button>
            </div>

            <Button
              onClick={() => setReceipt(null)}
              className="w-full bg-primary-600 hover:bg-primary-700"
            >
              Buat Resi Baru
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
