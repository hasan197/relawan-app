import { ArrowLeft, Bell, Check, X, Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { formatRelativeTime } from '../../lib/utils';
import { useNotifications } from '../../hooks/useNotifications';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface DesktopNotifikasiPageProps {
  onBack?: () => void;
}

export function DesktopNotifikasiPage({ onBack }: DesktopNotifikasiPageProps) {
  const { user } = useAppContext();
  const { notifications, loading, markAsRead, refetch } = useNotifications(user?.id || null);

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      toast.success('Notifikasi ditandai sudah dibaca');
      refetch();
    } catch (error) {
      toast.error('Gagal menandai notifikasi');
    }
  };

  const NotificationCard = ({ notification, showMarkAsRead = false }: any) => (
    <Card className={`p-4 ${!notification.read ? 'bg-primary-50 border-primary-100' : 'bg-white'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          notification.type === 'donation' ? 'bg-green-100' :
          notification.type === 'reminder' ? 'bg-yellow-100' :
          notification.type === 'achievement' ? 'bg-purple-100' :
          'bg-blue-100'
        }`}>
          <Bell className={`h-4 w-4 ${
            notification.type === 'donation' ? 'text-green-600' :
            notification.type === 'reminder' ? 'text-yellow-600' :
            notification.type === 'achievement' ? 'text-purple-600' :
            'text-blue-600'
          }`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-gray-900 font-medium text-sm">{notification.title}</h4>
            {!notification.read && (
              <Badge className="bg-primary-600 text-white border-none text-xs">Baru</Badge>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
          <p className="text-gray-500 text-xs">{formatRelativeTime(notification.created_at)}</p>
        </div>
        
        {showMarkAsRead && !notification.read && (
          <Button 
            onClick={() => handleMarkAsRead(notification.id)}
            size="sm"
            variant="ghost"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-gray-900">Notifikasi</h1>
                <p className="text-gray-600 text-sm">{unreadNotifications.length} notifikasi belum dibaca</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="unread" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="unread">
              Belum Dibaca ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="read">
              Sudah Dibaca ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : unreadNotifications.length === 0 ? (
              <Card className="p-12 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada notifikasi baru</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {unreadNotifications.map(notification => (
                  <NotificationCard key={notification.id} notification={notification} showMarkAsRead />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="read" className="mt-0">
            {readNotifications.length === 0 ? (
              <Card className="p-12 text-center">
                <Check className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada notifikasi</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {readNotifications.map(notification => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}