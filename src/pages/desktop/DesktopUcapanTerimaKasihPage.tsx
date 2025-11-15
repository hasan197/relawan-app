import { useState } from 'react';
import { ArrowLeft, Share2, Copy, MessageCircle, Download } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { formatCurrency, copyToClipboard } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';

interface DesktopUcapanTerimaKasihPageProps {
  onBack?: () => void;
}

export function DesktopUcapanTerimaKasihPage({ onBack }: DesktopUcapanTerimaKasihPageProps) {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'zakat' | 'infaq' | 'sedekah' | 'wakaf'>('zakat');
  const [customMessage, setCustomMessage] = useState('');

  const generateMessage = () => {
    const categoryEmojis = {
      zakat: '🕌',
      infaq: '💚',
      sedekah: '🤲',
      wakaf: '🏛️'
    };

    const baseMessage = `
Barakallahu fiikum ${donorName || '[Nama Donatur]'} ${categoryEmojis[category]}

Jazakumullah khairan katsiran atas ${category} Anda sebesar ${amount ? formatCurrency(parseFloat(amount)) : '[Nominal]'}

Semoga Allah SWT membalas kebaikan Anda dengan berlipat ganda dan menjadikannya amal jariyah yang terus mengalir pahalanya.

"Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji. Allah melipatgandakan bagi siapa yang Dia kehendaki." (QS. Al-Baqarah: 261)

${customMessage || ''}

Semoga Allah senantiasa memberikan keberkahan dan kesehatan untuk Anda dan keluarga. 

Wassalamualaikum warahmatullahi wabarakatuh 🤲
    `.trim();

    return baseMessage;
  };

  const message = generateMessage();

  const handleCopy = async () => {
    const success = await copyToClipboard(message);
    if (success) {
      toast.success('Pesan berhasil disalin!');
    } else {
      toast.error('Gagal menyalin pesan');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: message }).then(() => {
        toast.success('Pesan berhasil dibagikan!');
      });
    } else {
      copyToClipboard(message).then(success => {
        if (success) toast.success('Pesan disalin ke clipboard!');
      });
    }
  };

  const handleSendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    toast.success('Membuka WhatsApp...');
  };

  const handleDownload = () => {
    const blob = new Blob([message], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ucapan_terima_kasih.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Pesan berhasil didownload!');
  };

  const templates = [
    {
      id: 1,
      name: 'Ucapan Standar',
      message: 'Semoga Allah membalas kebaikan Anda dengan berlipat ganda.'
    },
    {
      id: 2,
      name: 'Doa Khusus',
      message: 'Semoga Allah memberikan keberkahan rezeki dan kesehatan untuk Anda dan keluarga.'
    },
    {
      id: 3,
      name: 'Motivasi',
      message: 'Mari terus berbagi kebaikan. Setiap rupiah yang kita infakkan adalah investasi untuk akhirat.'
    }
  ];

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
            <h1 className="text-white text-3xl mb-1">Ucapan Terima Kasih</h1>
            <p className="text-primary-100">Generator pesan apresiasi untuk donatur</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Detail Donatur */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-5">Detail Donatur</h3>
              
              <div className="space-y-5">
                <div>
                  <Label htmlFor="donorName">Nama Donatur</Label>
                  <Input
                    id="donorName"
                    type="text"
                    placeholder="Masukkan nama donatur"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Nominal Donasi</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1.5"
                  />
                  {amount && (
                    <p className="text-sm text-gray-500 mt-2">
                      = {formatCurrency(parseFloat(amount))}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Kategori Donasi</Label>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {(['zakat', 'infaq', 'sedekah', 'wakaf'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-3 rounded-lg transition-all capitalize ${
                          category === cat
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Template Pesan */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Template Pesan Tambahan</h3>
              <div className="space-y-3 mb-5">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setCustomMessage(template.message)}
                    className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-primary-300"
                  >
                    <p className="text-gray-900 mb-1">{template.name}</p>
                    <p className="text-gray-600 text-sm">{template.message}</p>
                  </button>
                ))}
              </div>
              
              <div>
                <Label htmlFor="customMessage">Atau Tulis Pesan Kustom</Label>
                <textarea
                  id="customMessage"
                  placeholder="Tambahkan pesan pribadi untuk donatur..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mt-1.5"
                />
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h4 className="text-blue-900 mb-3">💡 Tips Mengirim Ucapan</h4>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Kirim segera setelah menerima donasi untuk menunjukkan apresiasi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600"></span>
                  <span>Personalisasi dengan nama donatur agar lebih personal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Sertakan doa dan harapan baik untuk donatur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Gunakan bahasa yang ramah, sopan, dan penuh syukur</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Preview Pesan</h3>
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {message}
                </p>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Aksi</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleSendWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Kirim via WhatsApp
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Salin Pesan
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Pesan
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <p className="text-gray-600 text-sm mb-1">Kategori</p>
                <p className="text-2xl text-green-700 capitalize">{category}</p>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
                <p className="text-gray-600 text-sm mb-1">Jumlah Karakter</p>
                <p className="text-2xl text-blue-700">{message.length}</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}