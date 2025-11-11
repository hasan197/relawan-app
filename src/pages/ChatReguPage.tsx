import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image as ImageIcon, Smile } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { getInitials, formatRelativeTime } from '../lib/utils';
import { currentUser } from '../lib/mockData';

interface ChatReguPageProps {
  onBack?: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  time: Date;
  isOwnMessage: boolean;
}

export function ChatReguPage({ onBack }: ChatReguPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'p1',
      senderName: 'Ustadz Abdullah',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah',
      message: 'Assalamualaikum warahmatullahi wabarakatuh, semangat pagi untuk seluruh anggota regu!',
      time: new Date('2025-11-08T07:00:00'),
      isOwnMessage: false
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'Aminah Zahra',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aminah',
      message: 'Waalaikumsalam, selamat pagi Ustadz dan teman-teman! 🌅',
      time: new Date('2025-11-08T07:05:00'),
      isOwnMessage: false
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Hasan',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hasan',
      message: 'Waalaikumsalam, siap melayani hari ini!',
      time: new Date('2025-11-08T07:10:00'),
      isOwnMessage: true
    },
    {
      id: '4',
      senderId: 'p1',
      senderName: 'Ustadz Abdullah',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah',
      message: 'Alhamdulillah, update terbaru: Regu kita sudah mencapai 86% target bulan ini. Tinggal sedikit lagi! 🎯',
      time: new Date('2025-11-08T07:15:00'),
      isOwnMessage: false
    },
    {
      id: '5',
      senderId: '3',
      senderName: 'Yusuf Rahman',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yusuf',
      message: 'MasyaAllah, semangat semua! Ayo kita kejar target 100%',
      time: new Date('2025-11-08T07:20:00'),
      isOwnMessage: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      message: newMessage,
      time: new Date(),
      isOwnMessage: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1">
            <h3 className="text-white">{currentUser.reguName}</h3>
            <p className="text-primary-100">8 anggota</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
          const showName = showAvatar && !msg.isOwnMessage;

          return (
            <div
              key={msg.id}
              className={`flex ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isOwnMessage && showAvatar && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarImage src={msg.senderAvatar} />
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {getInitials(msg.senderName)}
                  </AvatarFallback>
                </Avatar>
              )}

              {!msg.isOwnMessage && !showAvatar && (
                <div className="w-8 mr-2" />
              )}

              <div className={`max-w-[75%] ${msg.isOwnMessage ? '' : 'flex-1'}`}>
                {showName && (
                  <p className="text-gray-600 mb-1 ml-1">{msg.senderName}</p>
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
                <p className={`text-gray-400 mt-1 ml-1 ${msg.isOwnMessage ? 'text-right' : ''}`}>
                  {formatRelativeTime(msg.time)}
                </p>
              </div>
            </div>
          );
        })}
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
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Smile className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
