import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { Bell, Check, Trash2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

type NotificationType = 'donasi' | 'follow-up' | 'sistem' | 'promosi';

type NotificationStatus = 'unread' | 'read';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: Date;
  status: NotificationStatus;
  action?: string;
}

interface NotifikasiPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function NotifikasiPage({ onNavigate }: NotifikasiPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('pengaturan');
  const [filter, setFilter] = useState<NotificationType | 'semua'>('semua');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'donasi',
      title: 'Donasi Baru',
      message: 'Ahmad Syarif telah melakukan donasi sebesar Rp 250.000',
      time: new Date('2025-11-09T10:30:00'),
      status: 'unread',
      action: 'Lihat Detail'
    },
    {
      id: '2',
      type: 'follow-up',
      title: 'Pengingat Follow-up',
      message: 'Fatimah Azzahra perlu difollow-up untuk program wakaf',
      time: new Date('2025-11-09T09:15:00'),
      status: 'unread',
      action: 'Follow-up'
    },
    {
      id: '3',
      type: 'sistem',
      title: 'Backup Berhasil',
      message: 'Data Anda telah berhasil dibackup secara otomatis',
      time: new Date('2025-11-08T18:00:00'),
      status: 'read'
    },
    {
      id: '4',
      type: 'promosi',
      title: 'Program Baru',
      message: 'Program Zakat Fitrah 1446 H telah diluncurkan',
      time: new Date('2025-11-08T14:20:00'),
      status: 'read',
      action: 'Lihat Program'
    },
    {
      id: '5',
      type: 'donasi',
      title: 'Target Tercapai',
      message: 'Selamat! Anda telah mencapai target donasi minggu ini',
      time: new Date('2025-11-07T16:45:00'),
      status: 'read'
    }
  ]);

  const filteredNotifications = notifications.filter(notif => 
    filter === 'semua' || notif.type === filter
  );

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, status: 'read' } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, status: 'read' }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'donasi': return 'bg-green-100 text-green-800';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800';
      case 'sistem': return 'bg-blue-100 text-blue-800';
      case 'promosi': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'donasi': return 'Donasi';
      case 'follow-up': return 'Follow-up';
      case 'sistem': return 'Sistem';
      case 'promosi': return 'Promosi';
      default: return type;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID');
  };

  return (
    <DesktopLayout
      activeNav={activeNav}
      onNavigate={(page) => {
        setActiveNav(page);
        onNavigate?.(page);
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi telah dibaca'}
            </p>
          </div>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Tandai Semua Dibaca
              </Button>
            )}
            <Button variant="outline" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Semua
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              {(['semua', 'donasi', 'follow-up', 'sistem', 'promosi'] as const).map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? 'default' : 'outline'}
                  onClick={() => setFilter(type)}
                  className="capitalize"
                >
                  {type === 'semua' ? 'Semua' : getTypeLabel(type)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Notifikasi ({filteredNotifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    notification.status === 'unread'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Bell className={`h-4 w-4 ${
                            notification.status === 'unread' ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <Badge className={getTypeColor(notification.type)}>
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                        {notification.status === 'unread' && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {formatTime(notification.time)}
                        </span>
                        
                        <div className="flex gap-2">
                          {notification.action && (
                            <Button variant="outline" size="sm">
                              {notification.action}
                            </Button>
                          )}
                          {notification.status === 'unread' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada notifikasi</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopLayout>
  );
}