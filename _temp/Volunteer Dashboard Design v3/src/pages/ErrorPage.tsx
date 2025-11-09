import { WifiOff, AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface ErrorPageProps {
  type?: 'offline' | 'error' | '404';
  onRetry?: () => void;
  onHome?: () => void;
}

export function ErrorPage({ type = 'error', onRetry, onHome }: ErrorPageProps) {
  const errorContent = {
    offline: {
      icon: WifiOff,
      title: 'Tidak Ada Koneksi',
      description: 'Sepertinya Anda sedang offline. Periksa koneksi internet dan coba lagi.',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    error: {
      icon: AlertCircle,
      title: 'Terjadi Kesalahan',
      description: 'Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    '404': {
      icon: AlertCircle,
      title: 'Halaman Tidak Ditemukan',
      description: 'Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.',
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  };

  const content = errorContent[type];
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-xl">
        {/* Icon */}
        <div className={`w-24 h-24 ${content.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Icon className={`h-12 w-12 ${content.iconColor}`} />
        </div>

        {/* Title */}
        <h2 className="text-gray-900 mb-3">{content.title}</h2>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {content.description}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          {type !== '404' && (
            <Button
              onClick={onRetry}
              className="w-full bg-primary-600 hover:bg-primary-700"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          )}
          
          <Button
            onClick={onHome}
            variant="outline"
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>

        {/* Offline Mode Info */}
        {type === 'offline' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              💡 Beberapa fitur mungkin tersedia dalam mode offline
            </p>
          </div>
        )}

        {/* Help */}
        <p className="text-gray-500 mt-6">
          Butuh bantuan?{' '}
          <button className="text-primary-600 hover:underline">
            Hubungi Support
          </button>
        </p>
      </Card>
    </div>
  );
}
