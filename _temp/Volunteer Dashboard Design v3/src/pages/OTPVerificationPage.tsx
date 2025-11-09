import { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';

interface OTPVerificationPageProps {
  phoneNumber?: string;
  onVerify?: () => void;
  onBack?: () => void;
}

export function OTPVerificationPage({ phoneNumber = '08123456789', onVerify, onBack }: OTPVerificationPageProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Masukkan kode OTP lengkap');
      return;
    }

    setIsLoading(true);

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      if (otpCode === '123456') {
        toast.success('Verifikasi berhasil!');
        onVerify?.();
      } else {
        toast.error('Kode OTP salah. Gunakan 123456 untuk demo');
      }
    }, 1500);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    toast.success('Kode OTP baru telah dikirim');
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

        {/* Illustration */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">📱</span>
          </div>
          <h2 className="text-gray-900 mb-2">Verifikasi OTP</h2>
          <p className="text-gray-600">
            Kode verifikasi telah dikirim ke
          </p>
          <p className="text-gray-900">
            {phoneNumber}
          </p>
        </div>

        <Card className="p-6 shadow-xl">
          <div className="mb-6">
            <label className="block text-gray-700 mb-4 text-center">
              Masukkan Kode OTP
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleVerify}
            className="w-full bg-primary-600 hover:bg-primary-700 mb-4"
            disabled={isLoading || otp.join('').length !== 6}
          >
            {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
          </Button>

          <div className="text-center">
            <p className="text-gray-600 mb-2">Tidak menerima kode?</p>
            {countdown > 0 ? (
              <p className="text-gray-500">
                Kirim ulang dalam {countdown} detik
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-primary-600 hover:text-primary-700"
              >
                Kirim Ulang Kode
              </button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-500">
              💡 Untuk demo, gunakan kode: <span className="text-gray-900">123456</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
