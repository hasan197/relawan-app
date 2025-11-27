import { ArrowLeft, Plus } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateRegu } from '../../hooks/useRegu';
import { useAppContext } from '../../contexts/AppContext';

interface DesktopCreateReguPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function DesktopCreateReguPage({ onBack, onSuccess }: DesktopCreateReguPageProps) {
  const { user } = useAppContext();
  const [reguName, setReguName] = useState('');
  const [targetAmount, setTargetAmount] = useState('60000000');
  const { createRegu, creating } = useCreateRegu();

  const handleCreate = async () => {
    if (!user?.id) {
      toast.error('User tidak ditemukan. Silakan login kembali.');
      return;
    }

    if (user.role !== 'pembimbing') {
      toast.error('Hanya pembimbing yang dapat membuat regu');
      return;
    }

    if (!reguName.trim()) {
      toast.error('Nama regu harus diisi');
      return;
    }

    try {
      const target = parseInt(targetAmount) || 60000000;
      await createRegu(user.id, reguName.trim(), target);
      toast.success('Regu berhasil dibuat!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat regu');
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
              <h1 className="text-gray-900">Buat Regu Baru</h1>
              <p className="text-gray-600 text-sm">Buat dan kelola regu relawan</p>
            </div>
          </div>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <Label>Nama Regu *</Label>
              <Input
                value={reguName}
                onChange={(e) => setReguName(e.target.value)}
                placeholder="Contoh: Regu Al-Fatih"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Target Donasi (Rp) *</Label>
              <Input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="60000000"
                className="mt-2"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={onBack} variant="outline" className="flex-1">
                Batal
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={creating || !reguName}
                className="flex-1 bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Buat Regu
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}