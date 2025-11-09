import { useState } from 'react';
import { ArrowLeft, Phone, User, MapPin } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { toast } from 'sonner@2.0.3';
import { mockRegus } from '../lib/mockData';

interface RegisterPageProps {
  onBack?: () => void;
  onRegister?: () => void;
}

export function RegisterPage({ onBack, onRegister }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    reguId: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.city) {
      toast.error('Semua field wajib diisi');
      return;
    }

    if (formData.phone.length < 10) {
      toast.error('Nomor WhatsApp tidak valid');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Pendaftaran berhasil! Kode OTP akan dikirim');
      onRegister?.();
    }, 1500);
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
              <Label htmlFor="city">Kota/Kabupaten *</Label>
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
              <Label htmlFor="regu">Pilih Regu (Opsional)</Label>
              <select
                id="regu"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={formData.reguId}
                onChange={(e) => setFormData({ ...formData, reguId: e.target.value })}
                disabled={isLoading}
              >
                <option value="">Pilih regu (opsional)</option>
                {mockRegus.map((regu) => (
                  <option key={regu.id} value={regu.id}>
                    {regu.name} - {regu.leader}
                  </option>
                ))}
              </select>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6 bg-primary-600 hover:bg-primary-700"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Dengan mendaftar, Anda menyetujui{' '}
            <a href="#" className="text-primary-600 hover:underline">Syarat & Ketentuan</a>{' '}
            dan{' '}
            <a href="#" className="text-primary-600 hover:underline">Kebijakan Privasi</a>
          </p>
        </Card>

        <p className="text-center text-gray-500 mt-6">
          Sudah punya akun?{' '}
          <a href="#" className="text-primary-600 font-medium hover:underline">
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}
