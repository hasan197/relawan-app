import { useState, useEffect } from 'react';
import { apiCall } from '../lib/supabase';

interface ChatMessage {
  id: string;
  regu_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export function useChat(reguId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!reguId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiCall(`/chat/${reguId}`);
      setMessages(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [reguId]);

  const sendMessage = async (message: string, senderName: string) => {
    if (!reguId || !userId) throw new Error('Regu ID atau User ID tidak ditemukan');

    try {
      const response = await apiCall('/chat', {
        method: 'POST',
        body: JSON.stringify({
          regu_id: reguId,
          sender_id: userId,
          sender_name: senderName,
          message: message
        })
      });

      // Optimistically add message
      setMessages(prev => [...prev, response.data]);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: fetchMessages
  };
}
