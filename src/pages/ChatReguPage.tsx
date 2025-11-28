import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image as ImageIcon, Smile, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { getInitials, formatRelativeTime } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { toast } from 'sonner@2.0.3';
import { ChatSkeleton } from '../components/LoadingState';

interface ChatReguPageProps {
  onBack?: () => void;
}

export function ChatReguPage({ onBack }: ChatReguPageProps) {
  const { user } = useAuth();
  const { messages, loading, sending, sendMessage } = useChat(
    user?.regu_id || null,
    user?.id || null,
    3000 // Poll every 3 seconds
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
    if (!newMessage.trim()) return;
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }

    try {
      await sendMessage(newMessage, user.full_name);
      setNewMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim pesan');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat chat...</p>
        </div>
      </div>
    );
  }

  if (!user?.regu_id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h3 className="text-white">Chat Regu</h3>
          </div>
        </div>
        <div className="p-4">
          <Card className="p-8 text-center">
            <p className="text-gray-600">Anda belum bergabung dengan regu. Silakan join regu terlebih dahulu.</p>
          </Card>
        </div>
      </div>
    );
  }

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
            <h3 className="text-white">{user.regu_name || 'Chat Regu'}</h3>
            <p className="text-primary-100 text-sm">Chat grup regu</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada pesan. Mulai percakapan!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.sender_id === user?.id;
            const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
            const showName = showAvatar && !isOwnMessage;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwnMessage && showAvatar && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender_name}`} />
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {getInitials(msg.sender_name)}
                    </AvatarFallback>
                  </Avatar>
                )}

                {!isOwnMessage && !showAvatar && (
                  <div className="w-8 mr-2" />
                )}

                <div className={`max-w-[75%] ${isOwnMessage ? '' : 'flex-1'}`}>
                  {showName && (
                    <p className="text-gray-600 mb-1 ml-1 text-sm">{msg.sender_name}</p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-primary-600 text-white rounded-tr-sm'
                        : 'bg-white text-gray-900 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <p className="break-words">{msg.message}</p>
                  </div>
                  <p className={`text-gray-400 text-xs mt-1 ml-1 ${isOwnMessage ? 'text-right' : ''}`}>
                    {formatRelativeTime(new Date(msg.created_at))}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
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
      </div>
    </div>
  );
}