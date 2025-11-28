import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface RegisterSuccessPageProps {
  onComplete?: () => void;
}

export function RegisterSuccessPage({ onComplete }: RegisterSuccessPageProps) {
  const handleContinue = () => {
    console.log('✅ Registration success - Redirecting to login for OTP authentication');
    onComplete?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-gray-900 mb-3">Pendaftaran Berhasil! 🎉</h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Selamat! Akun Anda telah berhasil dibuat. 
            Silakan login dengan nomor WhatsApp untuk verifikasi dan mulai menggunakan aplikasi.
          </p>

          {/* Info Card */}
          <div className="bg-primary-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="text-primary-900 mb-3">Langkah Selanjutnya:</h4>
            <ul className="space-y-2 text-primary-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Login dengan nomor WhatsApp Anda</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Verifikasi kode OTP yang dikirimkan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Ikuti onboarding dan mulai mengelola muzakki</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleContinue}
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            Lanjut ke Login
          </Button>
        </Card>

        <p className="text-center text-gray-500 mt-6">
          Butuh bantuan?{' '}
          <button className="text-primary-600 hover:underline">
            Hubungi Admin
          </button>
        </p>
      </div>
    </div>
  );
}