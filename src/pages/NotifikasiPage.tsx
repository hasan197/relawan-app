import { useState } from 'react';
import { ArrowLeft, Bell, CheckCheck, Trash2, Calendar, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatRelativeTime } from '../lib/utils';
import { toast } from 'sonner';

interface NotifikasiPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'admin' | 'team';
  title: string;
  message: string;
  time: Date;
  isRead: boolean;
}

export function NotifikasiPage({ onBack }: NotifikasiPageProps) {
  const [filter, setFilter] = useState<'semua' | 'belum-dibaca'>('semua');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'reminder',
      title: 'Reminder Follow-up',
      message: 'Saatnya menghubungi Fatimah Azzahra. Sudah 3 hari tidak ada follow-up.',
      time: new Date('2025-11-08T09:00:00'),
      isRead: false
    },
    {
      id: '2',
      type: 'achievement',
      title: '🎉 Target Tercapai!',
      message: 'Selamat! Kamu telah mencapai 80% dari target donasi bulan ini.',
      time: new Date('2025-11-08T08:00:00'),
      isRead: false
    },
    {
      id: '3',
      type: 'admin',
      title: 'Pengumuman Program Baru',
      message: 'Program Wakaf Produktif telah diluncurkan. Yuk bantu sosialisasikan!',
      time: new Date('2025-11-07T15:00:00'),
      isRead: false
    },
    {
      id: '4',
      type: 'team',
      title: 'Pesan dari Pembimbing',
      message: 'Rapat koordinasi regu dijadwalkan besok pukul 19:00 WIB via Zoom.',
      time: new Date('2025-11-07T10:00:00'),
      isRead: true
    },
    {
      id: '5',
      type: 'achievement',
      title: '⭐ Naik Peringkat!',
      message: 'Kamu naik ke peringkat #2 di leaderboard regu. Pertahankan!',
      time: new Date('2025-11-06T20:00:00'),
      isRead: true
    },
    {
      id: '6',
      type: 'reminder',
      title: 'Reminder Follow-up',
      message: 'Muhammad Rizki masih berstatus "Baru". Hubungi untuk perkenalan.',
      time: new Date('2025-11-06T09:00:00'),
      isRead: true
    }
  ]);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'belum-dibaca') return !notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return Calendar;
      case 'achievement':
        return TrendingUp;
      case 'admin':
        return Bell;
      case 'team':
        return Users;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-100 text-blue-600';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-600';
      case 'admin':
        return 'bg-purple-100 text-purple-600';
      case 'team':
        return 'bg-green-100 text-green-600';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('Semua notifikasi ditandai sudah dibaca');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notifikasi dihapus');
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
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white border-none">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Filters */}
        <Card className="p-4 mb-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('semua')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  filter === 'semua'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilter('belum-dibaca')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  filter === 'belum-dibaca'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Belum Dibaca ({unreadCount})
              </button>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="w-full"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Tandai Semua Sudah Dibaca
            </Button>
          )}
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const Icon = getIcon(notif.type);
            const iconColor = getIconColor(notif.type);

            return (
              <Card
                key={notif.id}
                className={`p-4 ${!notif.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${iconColor} flex-shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-gray-900">{notif.title}</h4>
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5 ml-2" />
                      )}
                    </div>

                    <p className="text-gray-600 mb-2">{notif.message}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-400">{formatRelativeTime(notif.time)}</p>

                      <div className="flex gap-2">
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <CheckCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {filter === 'belum-dibaca' 
                  ? 'Tidak ada notifikasi yang belum dibaca'
                  : 'Belum ada notifikasi'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
