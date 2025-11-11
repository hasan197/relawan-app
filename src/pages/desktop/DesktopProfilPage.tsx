import { useState } from 'react';
import { Camera, Edit, Mail, Phone, MapPin, Calendar, Award, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { DesktopTopbar } from '../../components/desktop/DesktopTopbar';
import { useAppContext } from '../../contexts/AppContext';
import { getInitials, formatCurrency } from '../../lib/utils';

interface DesktopProfilPageProps {
  onNavigate?: (page: string) => void;
}

export function DesktopProfilPage({ onNavigate }: DesktopProfilPageProps) {
  const { user, getTotalDonations, donations, muzakkiList } = useAppContext();

  const totalDonations = getTotalDonations();
  const stats = [
    { label: 'Total Donasi', value: formatCurrency(totalDonations), icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Total Muzakki', value: muzakkiList.length.toString(), icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Transaksi', value: donations.length.toString(), icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  const menuItems = [
    { id: 'regu', label: 'Regu Saya', icon: Users, description: 'Lihat informasi regu dan leaderboard' },
    { id: 'chat-regu', label: 'Chat Regu', icon: MessageSquare, description: 'Diskusi dengan anggota regu' },
    { id: 'template', label: 'Template Pesan', icon: Mail, description: 'Template WhatsApp untuk fundraising' },
    { id: 'materi-promosi', label: 'Materi Promosi', icon: Award, description: 'Download materi promosi' },
    { id: 'pengaturan', label: 'Pengaturan', icon: Edit, description: 'Atur preferensi aplikasi' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopTopbar 
        title="Profil Saya" 
        subtitle="Kelola profil dan preferensi akun Anda"
        onNavigate={onNavigate}
      />

      <div className="p-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="col-span-1 space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name}`} />
                    <AvatarFallback className="bg-primary-600 text-white text-3xl">
                      {getInitials(user?.full_name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <h2 className="text-gray-900 mb-1">{user?.full_name || 'Nama Relawan'}</h2>
                <Badge className="bg-primary-100 text-primary-700 border-none mb-4">
                  {user?.role || 'Relawan'}
                </Badge>

                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => onNavigate?.('pengaturan')}
                >
                  <Edit className="h-4 w-4" />
                  Edit Profil
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span>{user?.phone || '+62 812-3456-7890'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span>{user?.email || 'relawan@ziswaf.org'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{user?.city || 'Jakarta, Indonesia'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>Bergabung sejak 2024</span>
                </div>
              </div>
            </Card>

            {/* Regu Info */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Regu Saya</h3>
              <div className="p-4 bg-primary-50 rounded-xl mb-4">
                <h4 className="text-primary-900 mb-1">{user?.regu_name || 'Regu Sakinah'}</h4>
                <p className="text-primary-600">5 Anggota</p>
              </div>
              <Button 
                className="w-full bg-primary-600 hover:bg-primary-700 gap-2"
                onClick={() => onNavigate?.('regu')}
              >
                <Users className="h-4 w-4" />
                Lihat Detail Regu
              </Button>
            </Card>
          </div>

          {/* Right Column - Stats & Menu */}
          <div className="col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                    <h3 className="text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-500">{stat.label}</p>
                  </Card>
                );
              })}
            </div>

            {/* Menu Grid */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-6">Menu Profil</h3>
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate?.(item.id)}
                      className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-600 hover:bg-primary-50 transition-all text-left group"
                    >
                      <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-primary-100 transition-colors">
                        <Icon className="h-6 w-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                          {item.label}
                        </h4>
                        <p className="text-gray-500">{item.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Activity History */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900">Aktivitas Terakhir</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate?.('riwayat-aktivitas')}
                >
                  Lihat Semua
                </Button>
              </div>
              <div className="space-y-4">
                {donations.slice(0, 5).map((donation) => (
                  <div key={donation.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">Donasi {donation.category}</p>
                      <p className="text-gray-500">
                        {new Date(donation.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <p className="text-green-600">{formatCurrency(donation.amount)}</p>
                  </div>
                ))}
                {donations.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Belum ada aktivitas</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}