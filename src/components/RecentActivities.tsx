import { Activity } from '../types';
import { formatCurrency, formatRelativeTime } from '../lib/utils';
import { Calendar, Users, Package, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';

interface RecentActivitiesProps {
  activities: Activity[];
  onViewAll?: () => void;
}

export function RecentActivities({ activities, onViewAll }: RecentActivitiesProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'donation':
        return Calendar;
      case 'follow-up':
        return Users;
      case 'distribution':
        return Package;
    }
  };

  const getIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'donation':
        return 'bg-green-100 text-green-600';
      case 'follow-up':
        return 'bg-blue-100 text-blue-600';
      case 'distribution':
        return 'bg-orange-100 text-orange-600';
    }
  };

  return (
    <Card className="mx-3 mb-4 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-900 text-sm font-medium">Aktivitas Terbaru</h3>
      </div>
      
      <div className="space-y-2">
        {activities.slice(0, 4).map((activity) => {
          const Icon = getIcon(activity.type);
          const iconColor = getIconColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm">
              <div className={`p-1.5 rounded-full ${iconColor}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 truncate text-sm">{activity.title}</p>
                <p className="text-gray-500 text-xs">{formatRelativeTime(activity.time)}</p>
              </div>
              
              {activity.amount && (
                <div className={`text-xs whitespace-nowrap ${activity.type === 'distribution' ? 'text-orange-600' : 'text-green-600'}`}>
                  {activity.type === 'distribution' ? '-' : '+'}
                  {formatCurrency(activity.amount).replace('Rp', '')}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <button 
        onClick={onViewAll}
        className="w-full mt-2 flex items-center justify-center gap-1 py-1.5 text-primary-600 hover:text-primary-700 transition-colors text-sm"
      >
        <span>Lihat Semua</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </Card>
  );
}
