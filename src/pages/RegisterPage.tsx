import { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../hooks/useAuth';
import { useAllRegus } from '../hooks/useRegu';

interface RegisterPageProps {
  onBack?: () => void;
  onRegister?: () => void;
  onNavigate?: (page: string) => void;
}

export function RegisterPage({ onBack, onRegister, onNavigate }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    regu: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [regusLoading, setRegusLoading] = useState(false);
  const { register } = useAuth();
  const { regus } = useAllRegus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.city) {
      toast.error('Semua field wajib diisi');
      return;
    }

    // Improved phone validation - accept various formats
    const cleanPhone = formData.phone.replace(/\D/g, ''); // Remove non-digits
    
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      toast.error('Nomor WhatsApp harus 10-15 digit');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('📝 Registering user:', {
        fullName: formData.fullName,
        phone: cleanPhone,
        city: formData.city,
        reguId: formData.regu
      });

      // Use cleaned phone number
      const result = await register(formData.fullName, cleanPhone, formData.city, formData.regu);
      
      console.log('✅ Registration successful:', result);
      toast.success('Pendaftaran berhasil!');
      onRegister?.();
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      toast.error(error.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Kembali</span>
        </button>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🕌</span>
          </div>
          <h1 className="text-gray-900 mb-2">Daftar Relawan</h1>
          <p className="text-gray-600">Bergabung menjadi relawan zakat dan raih keberkahan</p>
        </div>

        {/* Register Card */}
        <Card className="p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nama Lengkap *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Nomor WhatsApp *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city">Kota/Domisili *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="city"
                  type="text"
                  placeholder="Contoh: Jakarta Selatan"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="regu">Regu (Opsional)</Label>
              <div className="space-y-3">
                <select
                  id="regu"
                  value={formData.regu}
                  onChange={(e) => setFormData({ ...formData, regu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isLoading || regusLoading}
                >
                  <option value="">Akan ditentukan kemudian</option>
                  {regus.map((regu) => (
                    <option key={regu.id} value={regu.id}>
                      {regu.name} - {regu.pembimbing_name}
                    </option>
                  ))}
                </select>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate?.('join-regu')}
                >
                  Atau Gabung via QR Code
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700"
              disabled={isLoading}
            >
              {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Sudah punya akun?{' '}
              <button 
                onClick={onBack}
                className="text-primary-600 hover:text-primary-700"
              >
                Masuk
              </button>
            </p>
          </div>
        </Card>

        <p className="text-center text-gray-500 mt-6">
          Dengan mendaftar, Anda menyetujui{' '}
          <button className="text-primary-600 hover:underline">
            Syarat & Ketentuan
          </button>
        </p>
      </div>
    </div>
  );
}