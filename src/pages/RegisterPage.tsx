import { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, ArrowRight, Users, Target, Heart, Zap, Shield } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../hooks/useAuth';

interface RegisterPageProps {
  onBack?: () => void;
  onRegister?: () => void;
  onNavigate?: (page: string) => void;
}

export function RegisterPage({ onBack, onRegister, onNavigate }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

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
        city: formData.city
      });

      // Use cleaned phone number
      const result = await register(formData.fullName, cleanPhone, formData.city);
      
      console.log('✅ Registration successful:', result);
      toast.success('Pendaftaran berhasil!');
      onRegister?.();
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      // Handle server unavailable error
      if (error.message === "SERVER_UNAVAILABLE") {
        toast.error("Server Backend Belum Aktif", {
          description: "Mohon deploy Supabase Edge Function terlebih dahulu. Lihat console untuk instruksi.",
          duration: 10000,
        });
      } else {
        toast.error(error.message || 'Gagal mendaftar. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Hero Section (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-16">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🕌</span>
              </div>
              <div>
                <h2 className="text-white font-semibold">ZISWAF Manager</h2>
                <p className="text-primary-100 text-sm">Platform Relawan Digital</p>
              </div>
            </div>

            {/* Main Hero Content */}
            <div className="mb-12">
              <h1 className="text-white text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                Bergabung Sebagai Relawan ZISWAF
              </h1>
              <p className="text-primary-100 text-lg leading-relaxed mb-8">
                Menjadi bagian dari gerakan berbagi keberkahan. Raih pahala sambil mengembangkan skill digital fundraising Anda.
              </p>
              
              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-accent-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Berbagi Keberkahan</h3>
                    <p className="text-primary-100 text-sm">Bantu menyalurkan ZISWAF kepada yang membutuhkan</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-accent-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Sistem Target & Reward</h3>
                    <p className="text-primary-100 text-sm">Capai target dan dapatkan apresiasi atas dedikasi Anda</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-accent-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Tools Digital Lengkap</h3>
                    <p className="text-primary-100 text-sm">Template WhatsApp, manajemen prospek, dan analytics real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-white italic mb-3">
                "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya."
              </p>
              <p className="text-primary-100 text-sm">— HR. Ahmad, ath-Thabrani</p>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative">
          {/* Back Button - Fixed for all screen sizes */}
          <button 
            onClick={onBack}
            className="fixed top-4 left-4 lg:left-auto lg:top-8 lg:right-8 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <div className="w-full max-w-md">
            {/* Mobile Header - Compact */}
            <div className="lg:hidden text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-3xl">🕌</span>
              </div>
              <h1 className="text-gray-900 text-xl font-bold mb-1">Daftar Relawan</h1>
              <p className="text-gray-600 text-sm">Bergabung untuk berbagi keberkahan</p>
            </div>

            {/* Register Card */}
            <Card className="p-6 lg:p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-gray-900 text-xl lg:text-2xl font-bold mb-2">Daftar Sekarang</h2>
                <p className="text-gray-600 text-sm">
                  Lengkapi data Anda untuk bergabung sebagai relawan
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-gray-700 font-medium text-sm">
                    Nama Lengkap *
                  </Label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="pl-12 h-10 border-2 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">
                    Nomor WhatsApp *
                  </Label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Phone className="h-4 w-4 text-primary-600" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="08123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-12 h-10 border-2 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="city" className="text-gray-700 font-medium text-sm">
                    Kota/Domisili *
                  </Label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary-600" />
                    </div>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Contoh: Jakarta Selatan"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="pl-12 h-10 border-2 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 font-semibold shadow-lg hover:shadow-xl transition-all mt-6 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Mendaftar...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Daftar Sekarang
                      <ArrowRight className="h-5 w-5 lg:h-4 lg:w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  Sudah punya akun?{' '}
                  <button 
                    onClick={onBack}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Masuk
                  </button>
                </p>
              </div>
            </Card>

            {/* Trust badges - Compact for mobile */}
            <div className="flex items-center justify-center gap-3 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Aman</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Terpercaya</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>Mudah</span>
              </div>
            </div>

            <p className="text-center text-gray-500 text-xs mt-4">
              Dengan mendaftar, Anda menyetujui{' '}
              <button className="text-primary-600 hover:underline font-medium">
                Syarat & Ketentuan
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}