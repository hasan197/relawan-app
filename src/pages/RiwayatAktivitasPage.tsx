import { useState } from 'react';
import { ArrowLeft, Filter, DollarSign, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatRelativeTime, formatCurrency } from '../lib/utils';
import { useAppContext } from '../contexts/AppContext';
import { useStatistics } from '../hooks/useStatistics';

interface RiwayatAktivitasPageProps {
  onBack?: () => void;
}

export function RiwayatAktivitasPage({ onBack }: RiwayatAktivitasPageProps) {
  const { user } = useAppContext();
  const { statistics, loading } = useStatistics(user?.id || null);
  const [filterType, setFilterType] = useState<'all' | 'donation' | 'follow-up' | 'distribution'>('all');

  const activities = statistics?.recent_activities || [];

  // Filter activities by type
  const filteredActivities = filterType === 'all'
    ? activities
    : activities.filter(a => a.type === filterType);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'follow-up':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'distribution':
        return <Send className="h-5 w-5 text-orange-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'donation':
        return 'bg-green-100';
      case 'follow-up':
        return 'bg-blue-100';
      case 'distribution':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'donation':
        return 'Donasi';
      case 'follow-up':
        return 'Follow Up';
      case 'distribution':
        return 'Penyaluran';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h2 className="text-white">Riwayat Aktivitas</h2>
            <p className="text-primary-100 text-sm">
              {loading ? 'Memuat...' : `${filteredActivities.length} aktivitas`}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'all', label: 'Semua', count: activities.length },
            { id: 'donation', label: 'Donasi', count: activities.filter(a => a.type === 'donation').length },
            { id: 'follow-up', label: 'Follow Up', count: activities.filter(a => a.type === 'follow-up').length },
            { id: 'distribution', label: 'Penyaluran', count: activities.filter(a => a.type === 'distribution').length }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id as any)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                filterType === filter.id
                  ? 'bg-white text-primary-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : filteredActivities.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-2">📋</div>
            <p className="text-gray-600 mb-1">
              {filterType === 'all' 
                ? 'Belum ada aktivitas' 
                : `Belum ada aktivitas ${getActivityLabel(filterType).toLowerCase()}`}
            </p>
            <p className="text-gray-400 text-sm">
              Aktivitas Anda akan muncul di sini
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-full ${getActivityBgColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{activity.title}</h3>
                        {activity.muzakki_name && (
                          <p className="text-gray-600 text-sm">{activity.muzakki_name}</p>
                        )}
                        {activity.category && (
                          <Badge className="bg-gray-100 text-gray-700 border-none text-xs mt-1">
                            {activity.category}
                          </Badge>
                        )}
                      </div>
                      
                      {activity.amount && (
                        <div className="text-right ml-3">
                          <p className="text-green-600 font-medium">
                            +{formatCurrency(activity.amount)}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-xs mt-2">
                      {formatRelativeTime(activity.time)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
