import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '../lib/supabase';

export interface ChatMessage {
  id: string;
  regu_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export function useChat(reguId: string | null, userId: string | null, pollingInterval: number = 5000) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!reguId) {
      console.log('⏭️ Skipping fetchMessages: No regu ID');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching chat messages for regu:', reguId);
      const response = await apiCall(`/chat/${reguId}`);
      console.log('✅ Chat messages fetched:', response.data?.length || 0, 'items');
      setMessages(response.data || []);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat pesan chat';
      setError(errorMessage);
      console.error('❌ Error fetching chat messages:', {
        reguId,
        error: errorMessage,
        fullError: err
      });
    } finally {
      setLoading(false);
    }
  }, [reguId]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Polling for new messages
  useEffect(() => {
    if (!reguId) return;

    const interval = setInterval(() => {
      console.log('🔄 Polling for new messages...');
      fetchMessages();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [reguId, pollingInterval, fetchMessages]);

  const sendMessage = async (message: string, senderName: string) => {
    console.log('🔍 sendMessage called with:', { message, senderName });
    console.log('🔍 Current reguId:', reguId);
    console.log('🔍 Current userId:', userId);
    
    if (!reguId) {
      console.error('❌ Error: Regu ID tidak ditemukan!');
      throw new Error('Regu ID tidak ditemukan. Silakan pilih regu terlebih dahulu.');
    }

    if (!userId) {
      console.error('❌ Error: User ID tidak ditemukan!');
      throw new Error('User ID tidak ditemukan. Silakan login kembali.');
    }

    if (!message.trim()) {
      console.error('❌ Error: Message kosong!');
      throw new Error('Pesan tidak boleh kosong.');
    }

    try {
      console.log('📤 Sending chat message...');
      setSending(true);
      const response = await apiCall('/chat', {
        method: 'POST',
        body: JSON.stringify({
          regu_id: reguId,
          sender_id: userId,
          sender_name: senderName,
          message: message.trim()
        })
      });

      console.log('✅ Message sent successfully:', response.data);

      // Immediately fetch updated messages
      await fetchMessages();

      return response.data;
    } catch (error: any) {
      console.error('❌ Error sending message:', {
        error: error.message,
        fullError: error,
        reguId,
        userId
      });
      throw error;
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    refetch: fetchMessages
  };
}
