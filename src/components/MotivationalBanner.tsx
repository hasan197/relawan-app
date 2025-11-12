import { Card } from "./ui/card";
import { Sparkles, Heart, Star } from "lucide-react";

const motivationalQuotes = [
  {
    text: "Tangan yang di atas lebih baik daripada tangan yang di bawah",
    author: "HR. Bukhari",
    icon: Heart,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    text: "Sedekah tidak akan mengurangi harta",
    author: "HR. Muslim",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain",
    author: "HR. Ahmad",
    icon: Star,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    text: "Harta tidak akan habis karena sedekah",
    author: "HR. Tirmidzi",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    text: "Orang yang menunjukkan kebaikan seperti orang yang melakukannya",
    author: "HR. Muslim",
    icon: Heart,
    gradient: "from-purple-500 to-pink-500",
  },
];

export function MotivationalBanner() {
  // Get quote based on day of year to ensure consistency throughout the day
  const dayOfYear = Math.floor(
    (Date.now() -
      new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  const quote =
    motivationalQuotes[dayOfYear % motivationalQuotes.length];
  const Icon = quote.icon;

  return (
    <div className="relative">
      {/* Glassmorphism Card */}
      <Card className="relative bg-white/40 backdrop-blur-md border border-white/50 shadow-2xl p-4 overflow-hidden">
        {/* Gradient Overlay untuk efek glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-lg pointer-events-none" />

        {/* Decorative blur circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-300 rounded-full blur-3xl opacity-20 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Quote Text - Bold & Large */}
          <p className="text-xl text-gray-800 font-medium leading-relaxed mb-4">
            "{quote.text}"
          </p>

          {/* Decorative gradient line */}
          <div
            className={`h-1 w-16 bg-gradient-to-r ${quote.gradient} rounded-full mb-4`}
          />

          {/* Author - Medium gray */}
          <p className="text-sm text-gray-600 font-medium">
            {quote.author}
          </p>
        </div>
      </Card>
    </div>
  );
}