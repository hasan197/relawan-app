import { useState } from 'react';
import { ArrowLeft, Calendar, MessageCircle, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { getInitials, formatRelativeTime } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import { useFollowUp, FollowUpItem } from '../../hooks/useFollowUp';
import { LoadingState } from '../../components/LoadingState';
import { useAppContext } from '../../contexts/AppContext';

interface DesktopReminderFollowUpPageProps {
  onBack?: () => void;
}

export function DesktopReminderFollowUpPage({ onBack }: DesktopReminderFollowUpPageProps) {
  const { user } = useAppContext();
  const { followUps, loading, error } = useFollowUp(user?.id || null);
  const [filter, setFilter] = useState<'semua' | 'high' | 'medium' | 'low'>('semua');

  const filteredFollowUps = followUps.filter(item => {
    if (filter === 'semua') return true;
    return item.priority === filter;
  });

  if (loading) {
    return <LoadingState message="Memuat data follow-up..." />;
  }

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
      {/* Desktop Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-3xl mb-1">Reminder Follow-up</h1>
              <p className="text-primary-100">
                {followUps.length} muzakki perlu dihubungi
              </p>
            </div>
          </div>
          
          {highPriorityCount > 0 && (
            <div className="flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-xl">
              <AlertCircle className="h-6 w-6" />
              <div>
                <p className="text-sm opacity-90">Prioritas Tinggi</p>
                <p className="text-xl">{highPriorityCount} muzakki urgent</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar - Stats & Filters */}
          <div className="col-span-1 space-y-6">
            {/* Stats Cards */}
            <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <p className="text-gray-600 mb-2">Prioritas Tinggi</p>
              <p className="text-4xl text-red-700 mb-1">
                {followUps.filter(f => f.priority === 'high').length}
              </p>
              <p className="text-sm text-gray-500">Segera hubungi</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <p className="text-gray-600 mb-2">Prioritas Sedang</p>
              <p className="text-4xl text-yellow-700 mb-1">
                {followUps.filter(f => f.priority === 'medium').length}
              </p>
              <p className="text-sm text-gray-500">Dalam waktu dekat</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
              <p className="text-gray-600 mb-2">Prioritas Rendah</p>
              <p className="text-4xl text-blue-700 mb-1">
                {followUps.filter(f => f.priority === 'low').length}
              </p>
              <p className="text-sm text-gray-500">Sesegera mungkin</p>
            </Card>

            {/* Filter Buttons */}
            <Card className="p-4">
              <h3 className="text-gray-900 mb-3">Filter</h3>
              <div className="space-y-2">
                {(['semua', 'high', 'medium', 'low'] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setFilter(priority)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
                      filter === priority
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {priority === 'semua' ? 'Semua' : priority === 'high' ? 'Tinggi' : priority === 'medium' ? 'Sedang' : 'Rendah'}
                      </span>
                      {priority !== 'semua' && (
                        <Badge className={
                          filter === priority
                            ? 'bg-white/20 text-white border-none'
                            : 'bg-gray-200 text-gray-700 border-none'
                        }>
                          {followUps.filter(f => f.priority === priority).length}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content - Follow-up List */}
          <div className="col-span-3">
            {filteredFollowUps.length === 0 ? (
              <Card className="p-16 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-gray-900 mb-3">Semua follow-up sudah selesai! 🎉</h3>
                <p className="text-gray-500">
                  Tidak ada muzakki yang perlu dihubungi saat ini
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900">
                    {filter === 'semua' ? 'Semua Follow-up' : `Prioritas ${filter === 'high' ? 'Tinggi' : filter === 'medium' ? 'Sedang' : 'Rendah'}`}
                  </h2>
                  <Badge className="bg-gray-100 text-gray-700 border-none">
                    {filteredFollowUps.length} muzakki
                  </Badge>
                </div>

                {/* Follow-up Cards Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {filteredFollowUps.map((item) => (
                    <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.muzakki_name}`} />
                          <AvatarFallback className="bg-primary-100 text-primary-700">
                            {getInitials(item.muzakki_name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-2">{item.muzakki_name}</h4>
                          {getPriorityBadge(item.priority)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">
                            Terakhir dihubungi {formatRelativeTime(item.last_contact)} 
                            <span className="text-gray-400"> ({item.days_since_contact} hari lalu)</span>
                          </span>
                        </div>
                        
                        {item.notes && (
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                            <p className="text-blue-800 text-sm">
                              💡 {item.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleCall(item.muzakki_phone, item.muzakki_name)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleWhatsApp(item.muzakki_phone, item.muzakki_name)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WA
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => handleMarkDone(item.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}