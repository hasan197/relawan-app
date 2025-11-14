import { useState } from 'react';
import { ArrowLeft, Share2, Copy, MessageCircle, Download } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

interface UcapanTerimaKasihPageProps {
  onBack?: () => void;
}

export function UcapanTerimaKasihPage({ onBack }: UcapanTerimaKasihPageProps) {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    toast.success('Pesan berhasil disalin!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: message }).then(() => {
        toast.success('Pesan berhasil dibagikan!');
      });
    } else {
      navigator.clipboard.writeText(message);
      toast.success('Pesan disalin ke clipboard!');
    }
  };

  const handleSendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    toast.success('Membuka WhatsApp...');
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
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Ucapan Terima Kasih</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Form */}
        <Card className="p-4 mb-4 shadow-card">
          <h4 className="text-gray-900 mb-4">Detail Donatur</h4>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="donorName">Nama Donatur</Label>
              <Input
                id="donorName"
                type="text"
                placeholder="Masukkan nama donatur"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
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
              />
            </div>

            <div>
              <Label>Kategori</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {(['zakat', 'infaq', 'sedekah', 'wakaf'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-lg transition-colors capitalize ${
                      category === cat
                        ? 'bg-primary-600 text-white'
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

        {/* Template Quick Add */}
        <Card className="p-4 mb-4">
          <h4 className="text-gray-900 mb-3">Template Pesan Tambahan</h4>
          <div className="space-y-2 mb-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setCustomMessage(template.message)}
                className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="text-gray-900 mb-1">{template.name}</p>
                <p className="text-gray-600">{template.message}</p>
              </button>
            ))}
          </div>
          
          <div>
            <Label htmlFor="customMessage">Atau Tulis Pesan Kustom</Label>
            <textarea
              id="customMessage"
              placeholder="Tambahkan pesan pribadi..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-4 mb-4">
          <h4 className="text-gray-900 mb-3">Preview Pesan</h4>
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {message}
            </p>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button
            variant="outline"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            Salin
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
          onClick={handleSendWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Kirim via WhatsApp
        </Button>

        {/* Info Card */}
        <Card className="mt-4 p-4 bg-primary-50 border-primary-200">
          <h4 className="text-primary-900 mb-2">💡 Tips Mengirim Ucapan</h4>
          <ul className="space-y-1 text-primary-700">
            <li>• Kirim segera setelah menerima donasi</li>
            <li>• Personalisasi dengan nama donatur</li>
            <li>• Sertakan doa dan harapan baik</li>
            <li>• Gunakan bahasa yang ramah dan sopan</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}