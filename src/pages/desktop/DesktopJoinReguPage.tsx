import { ArrowLeft, QrCode, Users } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { useJoinRegu } from '../../hooks/useJoinRegu';
import { useAppContext } from '../../contexts/AppContext';

interface DesktopJoinReguPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function DesktopJoinReguPage({ onBack, onSuccess }: DesktopJoinReguPageProps) {
  const { user, refreshUser } = useAppContext();
  const [joinCode, setJoinCode] = useState('');
  const { joinRegu, loading } = useJoinRegu();

  const handleJoin = async () => {
    if (!user?.id) {
      toast.error('User tidak ditemukan. Silakan login kembali.');
      return;
    }

    if (joinCode.length !== 6) {
      toast.error('Kode regu harus 6 karakter');
      return;
    }

    const result = await joinRegu(user.id, joinCode);

    if (result.success) {
      // Refresh user context to get updated regu_id
      await refreshUser();
      toast.success(result.message);
      onSuccess?.();
    } else {
      toast.error(result.message);
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
              <h1 className="text-gray-900">Gabung Regu</h1>
              <p className="text-gray-600 text-sm">Masukkan kode untuk bergabung dengan regu</p>
            </div>
          </div>
        </div>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Bergabung dengan Regu</h3>
            <p className="text-gray-600 text-sm">Dapatkan kode dari pembimbing regu Anda</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Kode Regu</Label>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="REGU-XXXXX"
                className="mt-2 text-center font-mono text-lg"
              />
            </div>

            <Button 
              onClick={handleJoin}
              disabled={loading || !joinCode}
              className="w-full bg-primary-600 hover:bg-primary-700"
              size="lg"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Gabung Regu
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}