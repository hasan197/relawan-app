import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Smile, Paperclip, MoreVertical } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { DesktopTopbar } from '../../components/desktop/DesktopTopbar';
import { getInitials, formatRelativeTime } from '../../lib/utils';
import { useAppContext } from '../../contexts/AppContext';
import { useChat } from '../../hooks/useChat';
import { useReguMembers } from '../../hooks/useReguMembers';
import { toast } from 'sonner@2.0.3';

interface DesktopChatReguPageProps {
  onNavigate?: (page: string) => void;
}

export function DesktopChatReguPage({ onNavigate }: DesktopChatReguPageProps) {
  const { user } = useAppContext();
  const reguId = user?.regu_id || 'demo-regu';
  const { messages, loading, sendMessage } = useChat(reguId, user?.id);
  const { members, loading: membersLoading } = useReguMembers(reguId);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    
    try {
      await sendMessage(newMessage, user?.full_name || 'Anonymous');
      setNewMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim pesan');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopTopbar 
        title="Chat Regu" 
        subtitle={user?.regu_name || 'Diskusi dengan anggota regu'}
        onNavigate={onNavigate}
      />

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Members Sidebar */}
          <Card className="p-4 overflow-y-auto">
            <h3 className="text-gray-900 mb-4">Anggota Regu ({members.length})</h3>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.full_name}`} />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {getInitials(member.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate">{member.full_name}</p>
                    <p className="text-gray-500">
                      {member.status === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="col-span-3 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">Grup Chat</h3>
                <p className="text-gray-500">{messages.length} pesan</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto">
              {loading && messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Memuat pesan...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Belum ada pesan. Mulai percakapan!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, index) => {
                    const isOwnMessage = msg.sender_id === user?.id;
                    const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
                    const showName = showAvatar && !isOwnMessage;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isOwnMessage && showAvatar && (
                          <Avatar className="h-8 w-8 mr-3 mt-1">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender_name}`} />
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {getInitials(msg.sender_name)}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        {!isOwnMessage && !showAvatar && (
                          <div className="w-8 mr-3" />
                        )}

                        <div className={`max-w-md ${isOwnMessage ? '' : 'flex-1'}`}>
                          {showName && (
                            <p className="text-gray-600 mb-1 ml-1">{msg.sender_name}</p>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              isOwnMessage
                                ? 'bg-primary-600 text-white rounded-tr-sm'
                                : 'bg-white text-gray-900 rounded-tl-sm shadow-sm'
                            }`}
                          >
                            <p className="break-words">{msg.message}</p>
                          </div>
                          <p className={`text-gray-400 mt-1 ml-1 ${isOwnMessage ? 'text-right' : ''}`}>
                            {formatRelativeTime(new Date(msg.created_at))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Tulis pesan..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-12"
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
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}