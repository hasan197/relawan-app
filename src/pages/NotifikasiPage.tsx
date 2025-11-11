import { useState } from 'react';
import { ArrowLeft, Bell, Check, CheckCheck, Trash2, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatRelativeTime } from '../lib/utils';
import { useAppContext } from '../contexts/AppContext';
import { useNotifications } from '../hooks/useNotifications';
import { toast } from 'sonner@2.0.3';

interface NotifikasiPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function NotifikasiPage({ onBack, onNavigate }: NotifikasiPageProps) {
  const { user } = useAppContext();
  const { notifications, unreadCount, loading, markAsRead } = useNotifications(user?.id || null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      toast.success('Notifikasi ditandai sudah dibaca');
    } catch (error) {
      toast.error('Gagal menandai notifikasi');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'reminder':
        return '🔔';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'reminder':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
          <div className="flex-1">
            <h2 className="text-white">Notifikasi</h2>
            {unreadCount > 0 && (
              <p className="text-primary-100 text-sm">
                {unreadCount} notifikasi belum dibaca
              </p>
            )}
          </div>
          <div className="relative">
            <Bell className="h-6 w-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-white text-primary-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Semua ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-white text-primary-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-2">🔔</div>
            <p className="text-gray-600 mb-1">
              {filter === 'unread' 
                ? 'Tidak ada notifikasi yang belum dibaca' 
                : 'Belum ada notifikasi'}
            </p>
            <p className="text-gray-400 text-sm">
              Notifikasi akan muncul di sini
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 ${!notification.read ? 'border-l-4 border-l-primary-600 bg-primary-50/50' : ''}`}
                onClick={() => {
                  if (!notification.read) {
                    handleMarkAsRead(notification.id);
                  }
                  if (notification.action_url) {
                    onNavigate?.(notification.action_url);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{getNotificationIcon(notification.type)}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-gray-900">{notification.title}</h3>
                      {!notification.read && (
                        <Badge className="bg-primary-600 text-white border-none text-xs ml-2">
                          Baru
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-xs">
                        {formatRelativeTime(new Date(notification.created_at))}
                      </p>
                      
                      {!notification.read && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-primary-600"
                        >
                          <CheckCheck className="h-4 w-4 mr-1" />
                          Tandai Dibaca
                        </Button>
                      )}
                    </div>
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
