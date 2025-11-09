import { useState } from 'react';
import { ArrowLeft, Phone, MapPin, Calendar, MessageCircle, Edit, Trash2, DollarSign } from 'lucide-react';
import { Muzakki } from '../types';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getInitials, formatRelativeTime, formatCurrency } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

interface DetailProspekPageProps {
  muzakki?: Muzakki;
  onBack?: () => void;
}

export function DetailProspekPage({ onBack }: DetailProspekPageProps) {
  // Mock data for demo
  const [muzakki] = useState<Muzakki>({
    id: '1',
    name: 'Ahmad Syarif',
    phone: '+62812345001',
    city: 'Jakarta Selatan',
    status: 'follow-up',
    notes: 'Tertarik untuk zakat profesi. Sudah dijelaskan perhitungan nisab. Akan transfer minggu depan.',
    lastContact: new Date('2025-11-07'),
    createdBy: '1',
    createdAt: new Date('2025-10-01')
  });

  const [communications] = useState([
    {
      id: '1',
      type: 'call' as const,
      date: new Date('2025-11-07'),
      notes: 'Follow up zakat profesi. Beliau tertarik dan akan menghitung ulang nisabnya.'
    },
    {
      id: '2',
      type: 'whatsapp' as const,
      date: new Date('2025-11-05'),
      notes: 'Mengirim materi tentang zakat profesi dan cara perhitungannya.'
    },
    {
      id: '3',
      type: 'meeting' as const,
      date: new Date('2025-11-01'),
      notes: 'Pertemuan pertama di acara sosialisasi. Sangat antusias.'
    }
  ]);

  const [donations] = useState([
    {
      id: '1',
      date: new Date('2025-10-15'),
      amount: 500000,
      category: 'zakat' as const,
      receipt: 'ZKT20251015001'
    },
    {
      id: '2',
      date: new Date('2025-09-20'),
      amount: 250000,
      category: 'infaq' as const,
      receipt: 'INF20250920002'
    }
  ]);

  const getStatusBadge = (status: Muzakki['status']) => {
    const variants = {
      'baru': 'bg-blue-100 text-blue-700',
      'follow-up': 'bg-yellow-100 text-yellow-700',
      'donasi': 'bg-green-100 text-green-700'
    };
    const labels = {
      'baru': 'Baru',
      'follow-up': 'Follow Up',
      'donasi': 'Donasi'
    };
    return (
      <Badge className={`${variants[status]} border-none`}>
        {labels[status]}
      </Badge>
    );
  };

  const handleWhatsApp = () => {
    toast.success('Membuka WhatsApp...');
    window.open(`https://wa.me/${muzakki.phone.replace('+', '')}`, '_blank');
  };

  const handleCall = () => {
    toast.success('Membuka panggilan...');
    window.location.href = `tel:${muzakki.phone}`;
  };

  const handleChangeStatus = (newStatus: Muzakki['status']) => {
    toast.success(`Status diubah menjadi "${newStatus}"`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Detail Muzakki</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Profile Card */}
        <Card className="p-6 shadow-card mb-4">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${muzakki.name}`} />
              <AvatarFallback className="bg-primary-100 text-primary-700">
                {getInitials(muzakki.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-gray-900 mb-1">{muzakki.name}</h3>
                  {getStatusBadge(muzakki.status)}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{muzakki.phone}</span>
                </div>
                {muzakki.city && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{muzakki.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Bergabung {formatRelativeTime(muzakki.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={handleCall}
              variant="outline"
            >
              <Phone className="h-4 w-4 mr-2" />
              Telepon
            </Button>
          </div>
        </Card>

        {/* Change Status */}
        <Card className="p-4 mb-4">
          <h4 className="text-gray-900 mb-3">Ubah Status</h4>
          <div className="flex gap-2">
            {(['baru', 'follow-up', 'donasi'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleChangeStatus(status)}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                  muzakki.status === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'baru' ? 'Baru' : status === 'follow-up' ? 'Follow Up' : 'Donasi'}
              </button>
            ))}
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="komunikasi" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="komunikasi">Komunikasi</TabsTrigger>
            <TabsTrigger value="donasi">Donasi</TabsTrigger>
            <TabsTrigger value="catatan">Catatan</TabsTrigger>
          </TabsList>

          <TabsContent value="komunikasi" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-900">Riwayat Komunikasi</h4>
                <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                  Tambah
                </Button>
              </div>
              
              <div className="space-y-3">
                {communications.map((comm) => {
                  const icons = {
                    call: '📞',
                    whatsapp: '💬',
                    meeting: '🤝'
                  };
                  
                  return (
                    <div key={comm.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{icons[comm.type]}</div>
                      <div className="flex-1">
                        <p className="text-gray-500 mb-1">
                          {formatRelativeTime(comm.date)}
                        </p>
                        <p className="text-gray-700">{comm.notes}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="donasi" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-900">Riwayat Donasi</h4>
                <div className="text-right">
                  <p className="text-gray-500">Total</p>
                  <p className="text-primary-600">
                    {formatCurrency(donations.reduce((sum, d) => sum + d.amount, 0))}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-900 capitalize">{donation.category}</p>
                        <p className="text-gray-500">{formatRelativeTime(donation.date)}</p>
                        <p className="text-gray-400">Resi: {donation.receipt}</p>
                      </div>
                    </div>
                    <p className="text-green-600">{formatCurrency(donation.amount)}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="catatan" className="mt-4">
            <Card className="p-4">
              <h4 className="text-gray-900 mb-3">Catatan</h4>
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-gray-700">{muzakki.notes}</p>
              </div>
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Catatan
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
