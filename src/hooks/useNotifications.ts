import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder';
  read: boolean;
  created_at: string;
  action_url?: string;
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching notifications for user:', userId);
      const response = await apiCall(`/notifications/${userId}`);
      console.log('✅ Notifications fetched:', response.data?.length || 0);
      const notifs = response.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: Notification) => !n.read).length);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat notifikasi';
      setError(errorMessage);
      console.error('❌ Error fetching notifications:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      console.log('📤 Marking notification as read:', notificationId);
      const response = await apiCall(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      console.log('✅ Notification marked as read');
      await fetchNotifications();
      return response.data;
    } catch (error: any) {
      console.error('❌ Error marking notification as read:', error.message);
      throw error;
    }
  };

  const createNotification = async (data: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    try {
      console.log('📤 Creating notification:', data);
      const response = await apiCall('/notifications', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log('✅ Notification created:', response.data);
      await fetchNotifications();
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating notification:', error.message);
      throw error;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    createNotification,
    refetch: fetchNotifications
  };
}
