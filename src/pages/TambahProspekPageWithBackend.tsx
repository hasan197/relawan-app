import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner@2.0.3';
import { useAppContext } from '../contexts/AppContext';

interface TambahProspekPageWithBackendProps {
  onBack?: () => void;
  onSave?: () => void;
}

export function TambahProspekPageWithBackend({ onBack, onSave }: TambahProspekPageWithBackendProps) {
  const { addMuzakki, user } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    notes: '',
    status: 'baru' as const
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Nama dan nomor WhatsApp harus diisi');
      return;
    }

    // Validasi user ID sebelum submit
    if (!user?.id) {
      console.error('❌ User ID not found:', user);
      toast.error('Session tidak valid. Silakan logout dan login kembali.');
      return;
    }

    console.log('✅ Submitting muzakki with user ID:', user.id);

    setIsLoading(true);

    try {
      await addMuzakki(formData);
      toast.success('Muzakki berhasil ditambahkan!');
      onSave?.();
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      toast.error(error.message || 'Gagal menambahkan muzakki');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            disabled={isLoading}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Tambah Muzakki Baru</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        <Card className="p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Nomor WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isLoading}
              />
              <p className="text-gray-500 mt-1">
                Format: 08xxxxxxxxxx atau +62xxxxxxxxxx
              </p>
            </div>

            {/* City */}
            <div>
              <Label htmlFor="city">Kota/Domisili</Label>
              <Input
                id="city"
                type="text"
                placeholder="Contoh: Jakarta Selatan"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={isLoading}
              />
            </div>

            {/* Status */}
            <div>
              <Label>Status Awal</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(['baru', 'follow-up', 'donasi'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, status })}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      formData.status === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={isLoading}
                  >
                    {status === 'baru' ? 'Baru' : status === 'follow-up' ? 'Follow Up' : 'Donasi'}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                placeholder="Tambahkan catatan tentang muzakki ini..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                disabled={isLoading}
              />
              <p className="text-gray-500 mt-1">
                Contoh: Bertemu di acara X, tertarik untuk zakat profesi, dll
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onBack}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary-600 hover:bg-primary-700"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Help Card */}
        <Card className="mt-4 p-4 bg-primary-50 border-primary-200">
          <h4 className="text-primary-900 mb-2">💡 Tips Menambah Prospek</h4>
          <ul className="space-y-1 text-primary-700">
            <li>• Pastikan nomor WhatsApp valid dan aktif</li>
            <li>• Tambahkan catatan detail untuk follow-up lebih mudah</li>
            <li>• Update status secara berkala</li>
            <li>• Gunakan template pesan untuk komunikasi awal</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}