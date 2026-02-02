import { useState } from 'react';
import { ArrowLeft, Calendar, MessageCircle, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getInitials, formatRelativeTime } from '../lib/utils';
import { toast } from 'sonner@2.0.3';
import { HeaderWithBack } from '../components/HeaderWithBack';

interface ReminderFollowUpPageProps {
  onBack?: () => void;
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
    window.open(`https://wa.me/${phone.replace('+', '')}`, '_blank');
  };

  const handleCall = (phone: string, name: string) => {
    toast.success(`Memanggil ${name}...`);
    window.location.href = `tel:${phone}`;
  };

  const handleMarkDone = (id: string) => {
    setFollowUps(prev => prev.filter(item => item.id !== id));
    toast.success('Follow-up selesai ditandai!');
  };

  const highPriorityCount = followUps.filter(f => f.priority === 'high').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderWithBack
        pageName="Reminder Follow-up"
        subtitle={`${followUps.length} muzakki perlu dihubungi`}
        onBack={onBack}
        rightIcon={highPriorityCount > 0 ? AlertCircle : undefined}
        sticky
      />

      <div className="px-4 mt-4 pb-6">
        {/* Filters */}
        <Card className="p-4 mb-4 shadow-card">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['semua', 'high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setFilter(priority)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${filter === priority
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {priority === 'semua' ? 'Semua' : priority === 'high' ? 'Tinggi' : priority === 'medium' ? 'Sedang' : 'Rendah'}
                {priority !== 'semua' && (
                  <span className="ml-1">
                    ({followUps.filter(f => f.priority === priority).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Follow-up List */}
        <div className="space-y-3">
          {filteredFollowUps.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.muzakkiName}`} />
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {getInitials(item.muzakkiName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h4 className="text-gray-900 mb-1">{item.muzakkiName}</h4>
                  {getPriorityBadge(item.priority)}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Terakhir dihubungi {formatRelativeTime(item.lastContact)}
                    ({item.daysSinceContact} hari lalu)
                  </span>
                </div>

                {item.notes && (
                  <p className="text-gray-600 bg-gray-50 p-2 rounded">
                    💡 {item.notes}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCall(item.phone, item.muzakkiName)}
                >
                  <Phone className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleWhatsApp(item.phone, item.muzakkiName)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>WA</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkDone(item.id)}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}

          {filteredFollowUps.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <p className="text-gray-500">Semua follow-up sudah selesai! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}