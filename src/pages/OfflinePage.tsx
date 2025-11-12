import React from 'react';
import { Button } from '../components/ui/button';
import { WifiOff } from 'lucide-react';

export const OfflinePage: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <WifiOff className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tidak Ada Koneksi Internet</h1>
        <p className="text-gray-600 mb-6">
          Sepertinya Anda sedang offline. Silakan periksa koneksi internet Anda dan coba lagi.
        </p>
        <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
          Coba Lagi
        </Button>
      </div>
    </div>
  );
};

export default OfflinePage;
