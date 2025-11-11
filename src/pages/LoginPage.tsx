import { useState } from 'react';
import { Phone } from 'lucide-react';
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
      toast.error(error.message || 'Gagal mengirim OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🕌</span>
          </div>
          <h1 className="text-gray-900 mb-2">ZISWAF Manager</h1>
          <p className="text-gray-600">Platform Manajemen Relawan Zakat Digital</p>
        </div>

        {/* Login Card */}
        <Card className="p-6 shadow-xl">
          <h3 className="text-gray-900 mb-2">Masuk ke Akun</h3>
          <p className="text-gray-600 mb-6">
            Masukkan nomor WhatsApp untuk menerima kode OTP
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="08123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              <p className="text-gray-500 mt-2">
                Contoh: 08123456789
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700"
              disabled={isLoading}
            >
              {isLoading ? 'Mengirim OTP...' : 'Kirim Kode OTP'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Belum punya akun?{' '}
              <button 
                onClick={onRegister}
                className="text-primary-600 hover:text-primary-700"
              >
                Daftar Sekarang
              </button>
            </p>
          </div>
        </Card>

        <p className="text-center text-gray-500 mt-6">
          Dengan masuk, Anda menyetujui{' '}
          <button className="text-primary-600 hover:underline">
            Syarat & Ketentuan
          </button>
        </p>
      </div>
    </div>
  );
}