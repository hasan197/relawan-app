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
    <Card className="mx-4 mb-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">Aktivitas Terbaru</h3>
      </div>
      
      <div className="space-y-3">
        {activities.slice(0, 3).map((activity) => {
          const Icon = getIcon(activity.type);
          const iconColor = getIconColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`p-2 rounded-full ${iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 truncate">{activity.title}</p>
                <p className="text-gray-500">{formatRelativeTime(activity.time)}</p>
              </div>
              
              {activity.amount && (
                <div className={activity.type === 'distribution' ? 'text-orange-600' : 'text-green-600'}>
                  <p>
                    {activity.type === 'distribution' ? '-' : '+'}
                    {formatCurrency(activity.amount).replace('Rp', 'Rp ')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <button 
        onClick={onViewAll}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-primary-600 hover:text-primary-700 transition-colors"
      >
        <span>Lihat Semua</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </Card>
  );
}
