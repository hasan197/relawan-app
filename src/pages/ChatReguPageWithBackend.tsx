import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image as ImageIcon, Smile, Loader2, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { getInitials, formatRelativeTime } from '../lib/utils';
import { useAppContext } from '../contexts/AppContext';
import { useChat } from '../hooks/useChat';
import { toast } from 'sonner@2.0.3';

interface ChatReguPageWithBackendProps {
  onBack?: () => void;
}

export function ChatReguPageWithBackend({ onBack }: ChatReguPageWithBackendProps) {
  const { user } = useAppContext();
  const { messages, loading, error, sending, sendMessage, refetch } = useChat(
    user?.regu_id || null,
    user?.id || null,
    5000 // Poll every 5 seconds
  );

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      await sendMessage(newMessage, user?.full_name || 'Relawan');
      setNewMessage('');
      toast.success('Pesan terkirim');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim pesan');
      console.error('Send message error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages to determine when to show avatar/name
  const processedMessages = messages.map((msg, index) => {
    const isOwnMessage = msg.sender_id === user?.id;
    const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
    const showName = showAvatar && !isOwnMessage;

    return {
      ...msg,
      isOwnMessage,
      showAvatar,
      showName
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1">
            <h3 className="text-white">{user?.regu_name || 'Chat Regu'}</h3>
            <p className="text-primary-100 text-sm">
              {loading ? 'Memuat...' : `${messages.length} pesan`}
            </p>
          </div>
          <button
            onClick={refetch}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Memuat pesan...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              Coba Lagi
            </Button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-8">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg mb-2">Belum ada pesan</p>
            <p className="text-sm">Mulai percakapan dengan mengirim pesan pertama</p>
          </div>
        ) : (
          processedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isOwnMessage && msg.showAvatar && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {getInitials(msg.sender_name)}
                  </AvatarFallback>
                </Avatar>
              )}

              {!msg.isOwnMessage && !msg.showAvatar && (
                <div className="w-8 mr-2" />
              )}

              <div className={`max-w-[75%] ${msg.isOwnMessage ? '' : 'flex-1'}`}>
                {msg.showName && (
                  <p className="text-gray-600 text-sm mb-1 ml-1">{msg.sender_name}</p>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    msg.isOwnMessage
                      ? 'bg-primary-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-900 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="break-words">{msg.message}</p>
                </div>
                <p className={`text-gray-400 text-xs mt-1 ml-1 ${msg.isOwnMessage ? 'text-right' : ''}`}>
                  {formatRelativeTime(new Date(msg.created_at))}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 z-30 bg-white border-t border-gray-200 p-4">
        {!user?.regu_id ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Anda belum tergabung dalam regu</p>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ImageIcon className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Tulis pesan..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
                disabled={sending}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                <Smile className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-primary-600 hover:bg-primary-700"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}