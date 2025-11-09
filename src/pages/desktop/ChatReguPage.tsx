import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { Send, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

interface ChatReguPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function ChatReguPage({ onNavigate }: ChatReguPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('regu');
  const [message, setMessage] = useState('');

  return (
    <DesktopLayout
      activeNav={activeNav}
      onNavigate={(page) => {
        setActiveNav(page);
        onNavigate?.(page);
      }}
    >
      <div className="h-[calc(100vh-8rem)] flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200">
          <Card className="h-full rounded-none border-0">
            <CardHeader>
              <CardTitle>Grup Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Regu Al-Ikhlas', 'Regu Al-Amanah', 'Regu Al-Barakah'].map((group, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary-100 text-primary-600">
                          {group.split(' ')[1][0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{group}</h3>
                        <p className="text-sm text-gray-500">Pesan terakhir...</p>
                      </div>
                      <div className="text-xs text-gray-500">10:30</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="h-full rounded-none border-0">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary-100 text-primary-600">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Regu Al-Ikhlas</CardTitle>
                    <p className="text-sm text-gray-500">8 anggota online</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              {/* Messages */}
              <div className="h-[400px] p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-center">
                  <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    Hari ini
                  </div>
                </div>

                {[
                  { user: 'Ustadz Abdullah', message: 'Assalamualaikum semua, ada update program?', time: '10:15', isMe: false },
                  { user: 'Anda', message: 'Waalaikumsalam, program zakat fitrah sudah mencapai 65%', time: '10:16', isMe: true },
                  { user: 'Aminah', message: 'Alhamdulillah, saya akan follow-up beberapa donatur lagi', time: '10:20', isMe: false },
                ].map((msg, index) => (
                  <div key={index} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                      msg.isMe 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {!msg.isMe && (
                        <p className="text-xs font-medium mb-1">{msg.user}</p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isMe ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Ketik pesan..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DesktopLayout>
  );
}