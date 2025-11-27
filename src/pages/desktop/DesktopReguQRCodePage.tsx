import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, Copy, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useRegu } from '../../hooks/useRegu';
import { copyToClipboard } from '../../lib/utils';
import { toast } from 'sonner';
import { useAppContext } from '../../contexts/AppContext';
import QRCode from 'qrcode';

interface DesktopReguQRCodePageProps {
  onBack?: () => void;
}

export function DesktopReguQRCodePage({ onBack }: DesktopReguQRCodePageProps) {
  const { user } = useAppContext();
  const { reguData } = useRegu(user?.regu_id);

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!user?.regu_id) {
        setLoading(false);
        return;
      }

      try {
        setError(false);
        const code = `REGU-${user.regu_id.slice(0, 8).toUpperCase()}`;
        
        const url = await QRCode.toDataURL(code, {
          width: 400,
          margin: 2,
          color: {
            dark: '#16a34a',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        });
        
        setQrCodeUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('Error generating QR Code:', err);
        setError(true);
        setLoading(false);
        toast.error('Gagal membuat QR code');
      }
    };

    generateQRCode();
  }, [user?.regu_id]);

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `REGU-${user?.regu_id?.slice(0, 8).toUpperCase()}.png`;
      link.click();
      toast.success('QR Code berhasil diunduh');
    }
  };

  const handleShareQR = () => {
    const text = `Bergabung dengan Regu ${reguData?.name}!\nGunakan kode: ${reguData?.join_code}\n\nScan QR code atau masukkan kode di aplikasi ZISWAF Manager.`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      copyToClipboard(text).then(success => {
        if (success) toast.success('Kode berhasil disalin!');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-gray-900">QR Code Regu</h1>
              <p className="text-gray-600 text-sm">Bagikan QR code untuk join regu</p>
            </div>
          </div>
        </div>

        <Card className="p-12 text-center">
          <div className="w-64 h-64 bg-white border-4 border-gray-300 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            {loading ? (
              <Loader2 className="h-48 w-48 text-gray-400 animate-spin" />
            ) : error ? (
              <AlertCircle className="h-48 w-48 text-red-400" />
            ) : (
              <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
            )}
          </div>
          
          <h3 className="text-gray-900 mb-2">Kode Regu</h3>
          <p className="text-2xl font-mono text-primary-600 mb-6">
            REGU-{user?.regu_id?.slice(0, 8).toUpperCase()}
          </p>

          <div className="flex gap-3 justify-center">
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleShareQR} className="bg-primary-600 hover:bg-primary-700">
              <Share2 className="h-4 w-4 mr-2" />
              Bagikan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}