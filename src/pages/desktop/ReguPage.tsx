import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { mockRegus, currentUser, mockLeaderboard } from '../../lib/mockData';
import { Users, TrendingUp, MessageCircle, Phone, Mail, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

interface ReguPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function ReguPage({ onNavigate }: ReguPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('regu');
  const [selectedRegu, setSelectedRegu] = useState(mockRegus[0].id);

  const currentRegu = mockRegus.find(regu => regu.id === selectedRegu) || mockRegus[0];
  const reguMembers = mockLeaderboard.filter(member => member.reguName === currentRegu.name);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DesktopLayout
      activeNav={activeNav}
      onNavigate={(page) => {
        setActiveNav(page);
        onNavigate?.(page);
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Regu</h1>
            <p className="text-gray-600 mt-1">Kelola regu dan koordinasi dengan anggota</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Grup Chat
            </Button>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Undang Anggota
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Regu List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Regu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRegus.map((regu) => (
                  <div
                    key={regu.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRegu === regu.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRegu(regu.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{regu.name}</h3>
                        <p className="text-sm text-gray-500">{regu.pembimbingName}</p>
                      </div>
                      {regu.id === currentUser.reguId && (
                        <Badge className="bg-primary-100 text-primary-800">Regu Saya</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                      <span>{regu.memberCount} anggota</span>
                      <span>{formatCurrency(regu.totalDonations)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Regu Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Regu Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{currentRegu.name}</h2>
                      {currentRegu.id === currentUser.reguId && (
                        <Badge className="bg-primary-100 text-primary-800">Regu Anda</Badge>
                      )}
                    </div>
                    <p className="text-gray-600">Pembimbing: {currentRegu.pembimbingName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(currentRegu.totalDonations)}
                    </p>
                    <p className="text-sm text-gray-500">Total Donasi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Anggota</p>
                      <p className="text-2xl font-bold text-gray-900">{currentRegu.memberCount}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Ranking</p>
                      <p className="text-2xl font-bold text-gray-900">#2</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Donatur Aktif</p>
                      <p className="text-2xl font-bold text-gray-900">45</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Crown className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Members */}
            <Card>
              <CardHeader>
                <CardTitle>Anggota Regu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reguMembers.map((member) => (
                    <div key={member.relawanId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.relawanName} />
                          <AvatarFallback className="bg-primary-100 text-primary-600">
                            {member.relawanName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{member.relawanName}</h3>
                            {member.relawanId === currentUser.id && (
                              <Badge className="bg-primary-100 text-primary-800">Anda</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">Rank #{member.rank}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(member.totalDonations)}</p>
                          <p className="text-sm text-gray-500">{member.muzakkiCount} donatur</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DesktopLayout>
  );
}