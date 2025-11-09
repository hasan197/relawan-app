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
  onNavigate?: (page: string) => void;
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
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
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
        <Card className="p-4 mb-4">
          <h3 className="text-gray-900 mb-3">Form Ucapan</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="donorName">Nama Donatur</Label>
              <Input
                id="donorName"
                type="text"
                placeholder="Nama donatur"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="amount">Nominal Donasi</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Contoh: 100000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <Label>Jenis Donasi</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  className={`p-2 rounded-md text-center ${category === 'zakat' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`}
                  onClick={() => setCategory('zakat')}
                >
                  Zakat
                </button>
                <button
                  type="button"
                  className={`p-2 rounded-md text-center ${category === 'infaq' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`}
                  onClick={() => setCategory('infaq')}
                >
                  Infaq
                </button>
                <button
                  type="button"
                  className={`p-2 rounded-md text-center ${category === 'sedekah' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`}
                  onClick={() => setCategory('sedekah')}
                >
                  Sedekah
                </button>
                <button
                  type="button"
                  className={`p-2 rounded-md text-center ${category === 'wakaf' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`}
                  onClick={() => setCategory('wakaf')}
                >
                  Wakaf
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="customMessage">Pesan Tambahan (Opsional)</Label>
              <textarea
                id="customMessage"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
                placeholder="Tulis pesan tambahan..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-4">
          <h3 className="text-gray-900 mb-3">Template Pesan</h3>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                className="w-full p-3 text-left bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setCustomMessage(template.message)}
              >
                <p className="text-sm font-medium text-gray-900">{template.name}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{template.message}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4 mb-4">
          <h3 className="text-gray-900 mb-3">Pratinjau Pesan</h3>
          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line text-sm text-gray-700">
            {message}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Salin
          </Button>
          <Button variant="outline" onClick={handleSendWhatsApp}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Kirim WA
          </Button>
          <Button className="col-span-2 bg-primary-600 hover:bg-primary-700" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Bagikan
          </Button>
        </div>
      </div>
    </div>
  );
}
