import { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface OnboardingPageProps {
  onComplete?: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      emoji: '🕌',
      title: 'Selamat Datang!',
      description: 'Mari bersama-sama membangun gerakan relawan zakat digital yang membawa keberkahan untuk umat',
      color: 'from-primary-500 to-primary-600'
    },
    {
      id: 'role',
      emoji: '🤝',
      title: 'Tugas Relawan',
      description: 'Sebagai relawan, tugasmu adalah mengelola muzakki, menyalurkan donasi, dan membantu sesama dengan penuh keikhlasan',
      color: 'from-blue-500 to-blue-600',
      features: [
        'Kelola data muzakki',
        'Catat setiap donasi',
        'Follow-up rutin',
        'Salurkan dengan amanah'
      ]
    },
    {
      id: 'features',
      emoji: '✨',
      title: 'Fitur Unggulan',
      description: 'Manfaatkan fitur-fitur yang akan memudahkan pekerjaanmu sebagai relawan',
      color: 'from-purple-500 to-purple-600',
      features: [
        '📋 Template pesan donasi siap pakai',
        '🎯 Pantau target dan capaian',
        '🏆 Leaderboard dan gamifikasi',
        '👥 Kolaborasi dalam regu'
      ]
    },
    {
      id: 'ready',
      emoji: '🚀',
      title: 'Siap Memulai?',
      description: 'Mulai perjalananmu sebagai relawan zakat dan raih keberkahan bersama!',
      color: 'from-green-500 to-green-600'
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    console.log('🎯 Onboarding - Next clicked. Current step:', currentStep, '/', steps.length - 1);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('✅ Onboarding - Complete! Calling onComplete...');
      onComplete?.();
    }
  };

  const handleSkip = () => {
    console.log('⏭️ Onboarding - Skip clicked. Calling onComplete...');
    onComplete?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 flex flex-col">
      {/* Skip Button */}
      <div className="p-4 flex justify-end">
        {currentStep < steps.length - 1 && (
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-900"
          >
            Lewati
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          {/* Illustration */}
          <div className="text-center mb-8">
            <div className={`w-32 h-32 bg-gradient-to-br ${currentStepData.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
              <span className="text-6xl">{currentStepData.emoji}</span>
            </div>
            
            <h1 className="text-gray-900 mb-3">{currentStepData.title}</h1>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Features */}
          {currentStepData.features && (
            <Card className="p-6 mb-6 shadow-xl">
              <div className="space-y-3">
                {currentStepData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-primary-600" />
                    </div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Progress Indicator */}
          <div className="flex gap-2 justify-center mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary-600'
                    : index < currentStep
                    ? 'w-2 bg-primary-400'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <Button
            onClick={handleNext}
            className={`w-full bg-gradient-to-r ${currentStepData.color} hover:opacity-90 text-white shadow-lg`}
          >
            {currentStep < steps.length - 1 ? (
              <>
                <span>Lanjutkan</span>
                <ChevronRight className="h-5 w-5 ml-2" />
              </>
            ) : (
              <span>Mulai Sekarang</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}