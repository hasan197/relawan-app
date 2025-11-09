import { useEffect } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <span className="text-6xl">🕌</span>
          </div>
          
          {/* Ripple Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-white/30 rounded-full animate-ping" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-white mb-2 animate-fade-in">ZISWAF Manager</h1>
        <p className="text-primary-100 mb-8 animate-fade-in-delay">
          Platform Manajemen Relawan Zakat Digital
        </p>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Tagline */}
        <p className="text-white/80 mt-8 animate-fade-in-delay-2">
          Berbagi Keberkahan, Raih Pahala
        </p>
      </div>
    </div>
  );
}
