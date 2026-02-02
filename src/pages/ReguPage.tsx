import { useState } from 'react';
import { Users, TrendingUp, Award, MessageSquare, Loader2, QrCode, Plus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getInitials, formatCurrency } from '../lib/utils';
import { Progress } from '../components/ui/progress';
import { useAppContext } from '../contexts/AppContext';
import { useRegu } from '../hooks/useRegu';
import { HeaderWithBack } from '../components/HeaderWithBack';

interface ReguPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function ReguPage({ onBack, onNavigate }: ReguPageProps) {
  const { user } = useAppContext();
  const { regu, members, loading } = useRegu(user?.regu_id || null);

  // Check if user is pembimbing without regu
  const isPembimbingWithoutRegu = user?.role === 'pembimbing' && !user?.regu_id;

  if (!user?.regu_id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderWithBack
          pageName="Regu Saya"
          onNotificationClick={() => onNavigate?.('notifikasi')}
          onStatsClick={() => onNavigate?.('laporan')}
        />

        <div className="px-4 py-8">
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">👥</div>
            <p className="text-gray-600 mb-2">
              {isPembimbingWithoutRegu ? 'Anda belum memiliki regu' : 'Anda belum tergabung dalam regu'}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              {isPembimbingWithoutRegu
                ? 'Sebagai pembimbing, Anda dapat membuat regu baru untuk mengelola relawan'
                : 'Scan QR code dari pembimbing atau masukkan kode regu untuk bergabung'
              }
            </p>

            {/* Tombol Buat Regu untuk Pembimbing */}
            {isPembimbingWithoutRegu && (
              <Button
                onClick={() => onNavigate?.('create-regu')}
                className="bg-primary-600 hover:bg-primary-700 mt-2"
              >
                <Plus className="h-5 w-5 mr-2" />
                Buat Regu Baru
              </Button>
            )}

            {/* Tombol Gabung Regu untuk Relawan */}
            {!isPembimbingWithoutRegu && (
              <Button
                onClick={() => onNavigate?.('join-regu')}
                className="bg-primary-600 hover:bg-primary-700 mt-2"
              >
                <QrCode className="h-5 w-5 mr-2" />
                Gabung Regu
              </Button>
            )}
          </Card>
        </div>
      </div>
    );
  }

  const reguTarget = regu?.target_amount || 60000000;
  const reguDonations = regu?.total_donations || 0;
  const reguProgress = (reguDonations / reguTarget) * 100;

  // Sort members by total_donations (leaderboard)
  const sortedMembers = [...members].sort((a, b) =>
    (b.total_donations || 0) - (a.total_donations || 0)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithBack
        pageName="Regu Saya"
        onNotificationClick={() => onNavigate?.('notifikasi')}
        onStatsClick={() => onNavigate?.('laporan')}
        customPadding="px-4 py-8"
      />

      <div className="px-4 -mt-4 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            {/* Regu Info Card */}
            <Card className="p-6 shadow-card mb-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{regu?.name || user?.regu_name || 'Regu'}</h3>
                  <p className="text-gray-600 mb-2">
                    Pembimbing: {regu?.pembimbing_name || 'Ustadz Abdullah'}
                  </p>
                  <div className="flex gap-3">
                    <Badge className="bg-primary-100 text-primary-700 border-none">
                      {members.length} Anggota
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 border-none">
                      {formatCurrency(reguDonations)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Target Regu</span>
                  <span className="text-gray-900">{Math.round(reguProgress)}%</span>
                </div>
                <Progress value={reguProgress} className="h-2 mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-primary-600">
                    {formatCurrency(reguDonations)}
                  </span>
                  <span className="text-gray-500">
                    dari {formatCurrency(reguTarget)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={() => onNavigate?.('chat-regu')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat Regu
                </Button>

                <Button
                  variant="outline"
                  onClick={() => onNavigate?.('regu-qr-code')}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
              </div>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Card className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm mb-1">Peringkat</p>
                <p className="text-gray-900">#1</p>
              </Card>

              <Card className="p-4 text-center">
                <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm mb-1">Anggota</p>
                <p className="text-gray-900">{members.length}</p>
              </Card>

              <Card className="p-4 text-center">
                <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm mb-1">Prestasi</p>
                <p className="text-gray-900">3 🏆</p>
              </Card>
            </div>

            {/* Leaderboard */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Leaderboard Regu</h3>

              <div className="space-y-3">
                {sortedMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada anggota</p>
                  </div>
                ) : (
                  sortedMembers.map((member, index) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-500'
                        }`}>
                        {index + 1}
                      </div>

                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {getInitials(member.full_name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">
                          {member.full_name}
                          {member.id === user?.id && (
                            <span className="text-primary-600 text-sm ml-2">(Anda)</span>
                          )}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {member.total_muzakki || 0} muzakki
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-green-600 font-medium">
                          {formatCurrency(member.total_donations || 0)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}