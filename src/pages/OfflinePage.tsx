import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface OfflinePageProps {
  onRetry: () => void;
  onHome: () => void;
}

export function OfflinePage({ onRetry, onHome }: OfflinePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-orange-100 rounded-full">
            <WifiOff className="h-16 w-16 text-orange-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-gray-900 text-2xl mb-3">
          Tidak Ada Koneksi Internet
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Sepertinya Anda sedang offline. Periksa koneksi internet Anda dan coba lagi.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full bg-primary-600 hover:bg-primary-700"
            size="lg"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Coba Lagi
          </Button>

          <Button
            onClick={onHome}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Tips:</strong> Pastikan WiFi atau data seluler Anda aktif
          </p>
        </div>
      </Card>
    </div>
  );
}
