import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface RegisterSuccessPageProps {
  onContinue?: () => void;
  onNavigate?: (page: string) => void;
}

export function RegisterSuccessPage({ onContinue }: RegisterSuccessPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-gray-900 mb-3">Pendaftaran Berhasil! 🎉</h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Selamat! Akun Anda telah berhasil dibuat. 
            Mari mulai perjalanan sebagai relawan zakat dan raih keberkahan bersama.
          </p>

          {/* Info Card */}
          <div className="bg-primary-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="text-primary-900 mb-3">Langkah Selanjutnya:</h4>
            <ul className="space-y-2 text-primary-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Ikuti proses onboarding untuk mengenal aplikasi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Lengkapi profil dan pilih regu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Mulai tambahkan muzakki pertama Anda</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onContinue}
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            Mulai Onboarding
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
