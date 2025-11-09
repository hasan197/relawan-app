import { useState } from 'react';
import { ArrowLeft, Calendar, MessageCircle, Phone, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getInitials, formatRelativeTime } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

interface ReminderFollowUpPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

interface FollowUpItem {
  id: string;
  muzakkiId: string;
  muzakkiName: string;
  phone: string;
  lastContact: Date;
  daysSinceContact: number;
  priority: 'high' | 'medium' | 'low';
  status: 'baru' | 'follow-up' | 'donasi';
  notes: string;
}

export function ReminderFollowUpPage({ onBack }: ReminderFollowUpPageProps) {
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([
    {
      id: '1',
      muzakkiId: '2',
      muzakkiName: 'Fatimah Azzahra',
      phone: '+62812345002',
      lastContact: new Date('2025-11-05'),
      daysSinceContact: 3,
      priority: 'high',
      status: 'follow-up',
      notes: 'Tertarik untuk wakaf'
    },
    {
      id: '2',
      muzakkiId: '3',
      muzakkiName: 'Muhammad Rizki',
      phone: '+62812345003',
      lastContact: new Date('2025-11-06'),
      daysSinceContact: 2,
      priority: 'high',
      status: 'baru',
      notes: 'Kontak dari acara sosialisasi'
    },
    {
      id: '3',
      muzakkiId: '4',
      muzakkiName: 'Siti Nurhaliza',
      phone: '+62812345004',
      lastContact: new Date('2025-11-06'),
      daysSinceContact: 2,
      priority: 'medium',
      status: 'follow-up',
      notes: 'Butuh info lebih detail tentang zakat profesi'
    },
    {
      id: '4',
      muzakkiId: '5',
      muzakkiName: 'Abdullah Rahman',
      phone: '+62812345005',
      lastContact: new Date('2025-11-04'),
      daysSinceContact: 4,
      priority: 'high',
      status: 'follow-up',
      notes: 'Sudah berkomitmen untuk donasi minggu depan'
    }
  ]);

  const [filter, setFilter] = useState<'semua' | 'high' | 'medium' | 'low'>('semua');

  const filteredFollowUps = followUps.filter(item => {
    if (filter === 'semua') return true;
    return item.priority === filter;
  });

  const getPriorityBadge = (priority: FollowUpItem['priority']) => {
    const variants = {
      'high': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-blue-100 text-blue-700'
    };
    const labels = {
      'high': 'Prioritas Tinggi',
      'medium': 'Prioritas Sedang',
      'low': 'Prioritas Rendah'
    };
    return (
      <Badge className={`${variants[priority]} border-none`}>
        {labels[priority]}
      </Badge>
    );
  };

  const handleWhatsApp = (phone: string, name: string) => {
    toast.success(`Membuka WhatsApp ${name}...`);
    // In a real app, this would open WhatsApp with the phone number
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
  };

  const handleCall = (phone: string, name: string) => {
    toast.success(`Menghubungi ${name}...`);
    // In a real app, this would initiate a phone call
    window.open(`tel:${phone}`);
  };

  const handleMarkAsContacted = (id: string) => {
    setFollowUps(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              lastContact: new Date(),
              daysSinceContact: 0,
              status: 'follow-up' as const
            } 
          : item
      )
    );
    toast.success('Status follow up diperbarui');
  };

  const handleMarkAsDonated = (id: string) => {
    setFollowUps(prev => prev.filter(item => item.id !== id));
    toast.success('Status donasi diperbarui');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Pengingat Follow Up</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('semua')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'semua' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'high' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Prioritas Tinggi
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'medium' 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Prioritas Sedang
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'low' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Prioritas Rendah
          </button>
        </div>

        {/* Follow Up List */}
        <div className="space-y-3">
          {filteredFollowUps.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">Tidak ada follow up yang perlu ditindaklanjuti</p>
            </Card>
          ) : (
            filteredFollowUps.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {getInitials(item.muzakkiName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-gray-900">{item.muzakkiName}</h4>
                        <p className="text-sm text-gray-500">{item.phone}</p>
                      </div>
                    </div>
                    {getPriorityBadge(item.priority)}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-700">{item.notes}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Terakhir dihubungi: {formatRelativeTime(item.lastContact)}</span>
                    </div>
                    <span className="text-sm font-medium">{item.daysSinceContact} hari lalu</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleWhatsApp(item.phone, item.muzakkiName)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleCall(item.phone, item.muzakkiName)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Telepon
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleMarkAsDonated(item.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Sudah Donasi
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
