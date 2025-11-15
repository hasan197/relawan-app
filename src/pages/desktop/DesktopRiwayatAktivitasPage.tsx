import { useState } from 'react';
import { ArrowLeft, Filter, DollarSign, MessageSquare, Send, Loader2, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { formatRelativeTime, formatCurrency } from '../../lib/utils';
import { useAppContext } from '../../contexts/AppContext';
import { useStatistics } from '../../hooks/useStatistics';

interface DesktopRiwayatAktivitasPageProps {
  onBack?: () => void;
}

export function DesktopRiwayatAktivitasPage({ onBack }: DesktopRiwayatAktivitasPageProps) {
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
      {/* Desktop Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-3xl mb-1">Riwayat Aktivitas</h1>
            <p className="text-primary-100">
              {loading ? 'Memuat...' : `${filteredActivities.length} aktivitas tercatat`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar - Stats & Filters */}
          <div className="col-span-1 space-y-6">
            {/* Stats Summary */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-primary-50 border-primary-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Aktivitas</p>
                  <p className="text-2xl text-primary-700">{activities.length}</p>
                </div>
              </div>
            </Card>

            {/* Filter Card */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-gray-900">Filter</h3>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'all', label: 'Semua', count: activities.length },
                  { id: 'donation', label: 'Donasi', count: activities.filter(a => a.type === 'donation').length },
                  { id: 'follow-up', label: 'Follow Up', count: activities.filter(a => a.type === 'follow-up').length },
                  { id: 'distribution', label: 'Penyaluran', count: activities.filter(a => a.type === 'distribution').length }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterType(filter.id as any)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
                      filterType === filter.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{filter.label}</span>
                      <Badge className={
                        filterType === filter.id
                          ? 'bg-white/20 text-white border-none'
                          : 'bg-gray-200 text-gray-700 border-none'
                      }>
                        {filter.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-blue-800 text-sm">
                💡 Aktivitas mencatat semua donasi, follow up, dan penyaluran yang Anda lakukan
              </p>
            </Card>
          </div>

          {/* Main Content - Activities List */}
          <div className="col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
              </div>
            ) : filteredActivities.length === 0 ? (
              <Card className="p-16 text-center">
                <div className="text-gray-400 text-6xl mb-6">📋</div>
                <h3 className="text-gray-900 mb-3">
                  {filterType === 'all' 
                    ? 'Belum ada aktivitas' 
                    : `Belum ada aktivitas ${getActivityLabel(filterType).toLowerCase()}`}
                </h3>
                <p className="text-gray-500">
                  Aktivitas Anda akan muncul di sini
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900">
                    {filterType === 'all' ? 'Semua Aktivitas' : getActivityLabel(filterType)}
                  </h2>
                  <Badge className="bg-gray-100 text-gray-700 border-none">
                    {filteredActivities.length} aktivitas
                  </Badge>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredActivities.map((activity) => (
                    <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-5">
                        <div className={`p-4 rounded-xl ${getActivityBgColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-gray-900">{activity.title}</h3>
                                <Badge className="bg-gray-100 text-gray-600 border-none text-xs">
                                  {getActivityLabel(activity.type)}
                                </Badge>
                              </div>
                              {activity.muzakki_name && (
                                <p className="text-gray-600 mb-2">{activity.muzakki_name}</p>
                              )}
                              {activity.category && (
                                <Badge className="bg-primary-100 text-primary-700 border-none">
                                  {activity.category}
                                </Badge>
                              )}
                            </div>
                            
                            {activity.amount && (
                              <div className="text-right ml-4">
                                <p className="text-green-600 text-xl font-medium">
                                  +{formatCurrency(activity.amount)}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-400 text-sm mt-3">
                            {formatRelativeTime(activity.time)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
