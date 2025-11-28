import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, RefreshCw, Users, Search } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { getInitials, formatRelativeTime } from '../../lib/utils';
import { useAppContext } from '../../contexts/AppContext';
import { useChat } from '../../hooks/useChat';
import { toast } from 'sonner@2.0.3';

interface DesktopChatReguPageProps {
  onBack?: () => void;
}

export function DesktopChatReguPage({ onBack }: DesktopChatReguPageProps) {
  const { user } = useAppContext();
  const { messages, loading, error, sending, sendMessage, refetch } = useChat(
    user?.regu_id || null,
    user?.id || null,
    5000 // Poll every 5 seconds
  );

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter messages based on search
  const filteredMessages = searchQuery
    ? processedMessages.filter(
        (msg) =>
          msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.sender_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : processedMessages;

  // Get unique senders for member list
  const uniqueSenders = Array.from(
    new Map(messages.map((msg) => [msg.sender_id, msg.sender_name])).entries()
  ).map(([id, name]) => ({ id, name }));

  return (
    <div className="h-full flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.regu_name || 'Chat Regu'}
                </h2>
                <p className="text-sm text-gray-500">
                  {loading ? 'Memuat...' : `${messages.length} pesan • ${uniqueSenders.length} anggota`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari pesan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button
                onClick={refetch}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p className="text-lg">Memuat pesan...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <Button onClick={refetch} variant="outline" size="lg">
                Coba Lagi
              </Button>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <div className="text-8xl mb-6">💬</div>
              <p className="text-xl mb-2">
                {searchQuery ? 'Tidak ada pesan yang cocok' : 'Belum ada pesan'}
              </p>
              <p className="text-sm">
                {searchQuery
                  ? 'Coba kata kunci lain'
                  : 'Mulai percakapan dengan mengirim pesan pertama'}
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isOwnMessage && msg.showAvatar && (
                  <Avatar className="h-10 w-10 mr-3 mt-1">
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {getInitials(msg.sender_name)}
                    </AvatarFallback>
                  </Avatar>
                )}

                {!msg.isOwnMessage && !msg.showAvatar && (
                  <div className="w-10 mr-3" />
                )}

                <div className={`max-w-[60%] ${msg.isOwnMessage ? '' : 'flex-1'}`}>
                  {msg.showName && (
                    <p className="text-gray-600 text-sm font-medium mb-1 ml-1">
                      {msg.sender_name}
                    </p>
                  )}
                  <div
                    className={`rounded-2xl px-5 py-3 ${
                      msg.isOwnMessage
                        ? 'bg-primary-600 text-white rounded-tr-md'
                        : 'bg-white text-gray-900 rounded-tl-md shadow-sm border border-gray-100'
                    }`}
                  >
                    <p className="break-words leading-relaxed">{msg.message}</p>
                  </div>
                  <p
                    className={`text-gray-400 text-xs mt-1 ml-1 ${
                      msg.isOwnMessage ? 'text-right' : ''
                    }`}
                  >
                    {formatRelativeTime(new Date(msg.created_at))}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-6">
          {!user?.regu_id ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Anda belum tergabung dalam regu</p>
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <Avatar className="h-10 w-10 mb-1">
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {getInitials(user?.full_name || 'R')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Tulis pesan..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sending}
                  className="h-10"
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="bg-primary-600 hover:bg-primary-700 h-10 px-6"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Kirim
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Member List */}
      <div className="w-80 bg-white border-l border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-1">Anggota Regu</h3>
          <p className="text-sm text-gray-500">{uniqueSenders.length} anggota aktif</p>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {uniqueSenders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada anggota</p>
          ) : (
            uniqueSenders.map((sender) => (
              <div
                key={sender.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {getInitials(sender.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {sender.name}
                  </p>
                  {sender.id === user?.id && (
                    <p className="text-xs text-primary-600">Anda</p>
                  )}
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
