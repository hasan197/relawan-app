import { useState } from 'react';
import { ArrowLeft, Users, QrCode, Check, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppContext } from '../contexts/AppContext';
import { useCreateRegu } from '../hooks/useRegu';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

interface CreateReguPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function CreateReguPage({ onBack, onSuccess }: CreateReguPageProps) {
  const { user } = useAppContext();
  const { createRegu, creating } = useCreateRegu();
  
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '60000000'
  });
  const [createdRegu, setCreatedRegu] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔍 Current user data:', user);
    console.log('🔍 User ID:', user?.id);
    console.log('🔍 User role:', user?.role);

    if (!user?.id) {
      toast.error('User tidak ditemukan. Silakan login kembali.');
      return;
    }

    if (user.role !== 'pembimbing') {
      toast.error(`Anda perlu role pembimbing untuk membuat regu. Role saat ini: ${user.role}`);
      console.error('❌ Role check failed:', { role: user.role });
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Nama regu harus diisi');
      return;
    }

    try {
      const targetAmount = parseInt(formData.targetAmount) || 60000000;
      console.log('📝 Attempting to create regu with:', {
        pembimbingId: user.id,
        name: formData.name.trim(),
        targetAmount
      });
      
      const newRegu = await createRegu(user.id, formData.name.trim(), targetAmount);
      
      setCreatedRegu(newRegu);
      toast.success('Regu berhasil dibuat! ✨');
      
      // Reset form
      setFormData({
        name: '',
        targetAmount: '60000000'
      });
    } catch (error: any) {
      console.error('❌ Create regu failed:', error);
      toast.error(error.message || 'Gagal membuat regu');
    }
  };

  const handleCopyCode = () => {
    if (createdRegu?.join_code) {
      navigator.clipboard.writeText(createdRegu.join_code);
      toast.success('Kode regu berhasil disalin!');
    }
  };

  const handleDone = () => {
    if (onSuccess) {
      onSuccess();
    } else if (onBack) {
      onBack();
    }
  };

  // Check if user is pembimbing
  if (user?.role !== 'pembimbing') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={onBack}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h2 className="text-white">Buat Regu Baru</h2>
          </div>
        </div>

        <div className="px-4 py-8">
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">🚫</div>
            <p className="text-gray-600 mb-2">Akses Ditolak</p>
            <p className="text-gray-400 text-sm">
              Hanya pembimbing yang dapat membuat regu baru
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Success state - show created regu details with join code
  if (createdRegu) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={handleDone}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h2 className="text-white">Regu Berhasil Dibuat</h2>
          </div>
        </div>

        <div className="px-4 -mt-4 pb-6">
          {/* Success Card */}
          <Card className="p-6 mb-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Regu Berhasil Dibuat! 🎉</h3>
            <p className="text-gray-600 mb-4">
              {createdRegu.name} siap menerima anggota
            </p>
          </Card>

          {/* Regu Details */}
          <Card className="p-6 mb-4">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="h-8 w-8 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 mb-1">{createdRegu.name}</h3>
                <p className="text-gray-600 mb-2">
                  Pembimbing: {createdRegu.pembimbing_name}
                </p>
                <p className="text-gray-500 text-sm">
                  Target: {formatCurrency(createdRegu.target_amount || 60000000)}
                </p>
              </div>
            </div>

            {/* Join Code Section */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="h-5 w-5 text-primary-600" />
                <p className="text-gray-700">Kode Regu</p>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-white rounded-lg px-4 py-3 border border-primary-300">
                  <p className="text-2xl tracking-widest text-center text-primary-700 font-mono">
                    {createdRegu.join_code}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleCopyCode}
                variant="outline"
                className="w-full border-primary-300 text-primary-700 hover:bg-primary-100"
              >
                Salin Kode
              </Button>
              
              <p className="text-gray-500 text-sm mt-3 text-center">
                Bagikan kode ini kepada relawan untuk bergabung
              </p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleDone}
              className="w-full bg-primary-600 hover:bg-primary-700"
            >
              Selesai
            </Button>
            
            <Button 
              onClick={() => setCreatedRegu(null)}
              variant="outline"
              className="w-full"
            >
              Buat Regu Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Buat Regu Baru</h2>
        </div>
        <p className="text-primary-50 text-sm">
          Buat regu untuk mengelompokkan relawan
        </p>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Info Card */}
        <Card className="p-6 mb-4 bg-gradient-to-br from-blue-50 to-primary-50 border-primary-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h4 className="text-gray-900 mb-1">Tentang Regu</h4>
              <p className="text-gray-600 text-sm">
                Regu adalah kelompok relawan yang bekerja sama mencapai target donasi. 
                Setiap regu memiliki kode unik untuk bergabung.
              </p>
            </div>
          </div>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-4">
            <h3 className="text-gray-900 mb-4">Informasi Regu</h3>
            
            {/* Nama Regu */}
            <div className="mb-4">
              <Label htmlFor="name" className="text-gray-700 mb-2 block">
                Nama Regu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Contoh: Regu Ar-Rahman"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full"
                disabled={creating}
                required
              />
              <p className="text-gray-500 text-sm mt-1">
                Pilih nama yang inspiratif dan mudah diingat
              </p>
            </div>

            {/* Target Amount */}
            <div>
              <Label htmlFor="target" className="text-gray-700 mb-2 block">
                Target Donasi
              </Label>
              <Input
                id="target"
                type="number"
                placeholder="60000000"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full"
                disabled={creating}
                min="1000000"
                step="1000000"
              />
              <p className="text-gray-500 text-sm mt-1">
                Target: {formatCurrency(parseInt(formData.targetAmount) || 60000000)}
              </p>
            </div>
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700"
            disabled={creating || !formData.name.trim()}
          >
            {creating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Membuat Regu...
              </>
            ) : (
              <>
                <Users className="h-5 w-5 mr-2" />
                Buat Regu
              </>
            )}
          </Button>
        </form>

        {/* Additional Info */}
        <Card className="p-4 mt-4 bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800 text-sm">
            💡 <strong>Tips:</strong> Setelah regu dibuat, Anda akan mendapatkan kode unik 
            yang bisa dibagikan kepada relawan untuk bergabung.
          </p>
        </Card>
      </div>
    </div>
  );
}