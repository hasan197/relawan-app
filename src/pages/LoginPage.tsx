import { useState } from 'react';
import { Phone, ArrowRight, Users, TrendingUp, Award, Shield, Zap } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../hooks/useAuth';

interface LoginPageProps {
  onLogin?: () => void;
  onSendOTP?: (phone: string) => void;
  onRegister?: () => void;
}

export function LoginPage({ onLogin, onSendOTP, onRegister }: LoginPageProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error('Nomor WhatsApp harus diisi');
      return;
    }

    // Improved phone validation - accept various formats
    const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits

    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      toast.error('Nomor WhatsApp harus 10-15 digit');
      return;
    }

    setIsLoading(true);

    try {
      const response = await sendOTP(cleanPhone);

      // Show demo OTP for development - karena belum ada third party SMS
      if (response.demo_otp) {
        toast.success('Kode OTP berhasil dikirim!');
        toast.info(`🔑 Demo OTP: ${response.demo_otp}`, {
          duration: 15000,
          description: 'Salin kode ini untuk verifikasi (belum ada SMS service)'
        });
        console.log('\n═══════════════════════════════════════════');
        console.log('📱 KODE OTP LOGIN');
        console.log('═══════════════════════════════════════════');
        console.log(`Phone: ${cleanPhone}`);
        console.log(`OTP: ${response.demo_otp}`);
        console.log('═══════════════════════════════════════════\n');
      } else {
        toast.success('Kode OTP telah dikirim ke WhatsApp Anda');
      }

      onSendOTP?.(cleanPhone);
    } catch (error: any) {
      console.error('❌ Login error:', error);

      // Handle specific error for unregistered phone
      if (error.message?.includes('belum terdaftar') || error.message?.includes('not found')) {
        toast.error('Nomor belum terdaftar', {
          description: 'Silakan daftar terlebih dahulu',
          action: {
            label: 'Daftar',
            onClick: () => onRegister?.()
          },
          duration: 5000
        });
      } else {
        toast.error(error.message || 'Gagal mengirim OTP');
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
                Kelola Donasi ZISWAF dengan Mudah & Profesional
              </h1>
              <p className="text-primary-100 text-lg leading-relaxed">
                Platform lengkap untuk relawan dalam mengelola zakat, infaq, sedekah, dan wakaf.
                Tingkatkan efektivitas fundraising Anda dengan tools digital yang modern.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Users className="h-8 w-8 text-accent-300 mb-2" />
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-primary-100 text-sm">Relawan Aktif</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <TrendingUp className="h-8 w-8 text-accent-300 mb-2" />
                <div className="text-2xl font-bold text-white">5M+</div>
                <div className="text-primary-100 text-sm">Total Donasi</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Award className="h-8 w-8 text-accent-300 mb-2" />
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-primary-100 text-sm">Regu Aktif</div>
              </div>
            </div>
          </div>

          {/* Bottom Features */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-accent-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Aman & Terpercaya</h3>
                <p className="text-primary-100 text-sm">Data terenkripsi dan sistem keamanan berlapis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-accent-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Real-time Analytics</h3>
                <p className="text-primary-100 text-sm">Pantau performa dan target secara langsung</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header - Compact */}
            <div className="lg:hidden text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-3xl">🕌</span>
              </div>
              <h1 className="text-gray-900 text-xl font-bold mb-1">ZISWAF Manager</h1>
              <p className="text-gray-600 text-sm">Platform Relawan Digital</p>
            </div>

            {/* Login Card */}
            <Card className="p-6 lg:p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-gray-900 text-xl lg:text-2xl font-bold mb-2">Selamat Datang</h2>
                <p className="text-gray-600 text-sm">
                  Masukkan nomor WhatsApp untuk menerima kode OTP
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-9 lg:h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 lg:h-4 lg:w-4 text-primary-600" />
                    </div>
                    <Input
                      type="tel"
                      placeholder="08123456789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-14 lg:pl-12 h-12 lg:h-11 text-base lg:text-sm border-2 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl lg:rounded-lg"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Contoh: 08123456789 atau +628123456789
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 lg:h-11 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-base lg:text-sm font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl lg:rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Mengirim...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Kirim Kode OTP
                      <ArrowRight className="h-5 w-5 lg:h-4 lg:w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  Belum punya akun?{' '}
                  <button
                    onClick={onRegister}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Daftar Sekarang
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
                <Zap className="h-3 w-3" />
                <span>Cepat</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>500+ Relawan</span>
              </div>
            </div>

            <p className="text-center text-gray-500 text-xs mt-4">
              Dengan masuk, Anda menyetujui{' '}
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