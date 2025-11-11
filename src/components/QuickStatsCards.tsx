import { Card } from './ui/card';
import { Users, TrendingUp, Target, Award } from 'lucide-react';

interface QuickStatsCardsProps {
  totalMuzakki?: number;
  activeConversations?: number;
  completionRate?: number;
  rank?: number;
}

export function QuickStatsCards({ 
  totalMuzakki = 24,
  activeConversations = 8,
  completionRate = 75,
  rank = 3
}: QuickStatsCardsProps) {
  const stats = [
    {
      id: 'muzakki',
      label: 'Total Muzakki',
      value: totalMuzakki,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      suffix: ''
    },
    {
      id: 'conversations',
      label: 'Follow Up Aktif',
      value: activeConversations,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      suffix: ''
    },
    {
      id: 'completion',
      label: 'Tingkat Selesai',
      value: completionRate,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      suffix: '%'
    },
    {
      id: 'rank',
      label: 'Peringkat Regu',
      value: rank,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      suffix: ''
    },
  ];

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.id} 
              className="p-4 shadow-sm border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="text-xs text-gray-500">
                  {stat.id === 'rank' ? '🏆' : '📊'}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-xs text-gray-600 leading-tight">
                  {stat.label}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
