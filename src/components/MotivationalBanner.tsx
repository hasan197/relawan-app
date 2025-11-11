import { Card } from './ui/card';
import { Sparkles } from 'lucide-react';

const motivationalQuotes = [
  {
    text: 'Tangan yang di atas lebih baik daripada tangan yang di bawah',
    author: 'HR. Bukhari'
  },
  {
    text: 'Sedekah tidak akan mengurangi harta',
    author: 'HR. Muslim'
  },
  {
    text: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain',
    author: 'HR. Ahmad'
  },
  {
    text: 'Harta tidak akan habis karena sedekah',
    author: 'HR. Tirmidzi'
  },
  {
    text: 'Orang yang menunjukkan kebaikan seperti orang yang melakukannya',
    author: 'HR. Muslim'
  },
];

export function MotivationalBanner() {
  // Get quote based on day of year to ensure consistency throughout the day
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const quote = motivationalQuotes[dayOfYear % motivationalQuotes.length];

  return (
    <div className="px-4 mb-6">
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-100 rounded-full flex-shrink-0">
            <Sparkles className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 italic leading-relaxed mb-1">
              "{quote.text}"
            </p>
            <p className="text-xs text-gray-500">
              — {quote.author}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
