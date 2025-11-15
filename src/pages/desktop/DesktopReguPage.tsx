import { useState } from 'react';
import { ArrowLeft, Users, TrendingUp, Award, MessageSquare, Loader2, QrCode, Plus, Settings } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { getInitials, formatCurrency } from '../../lib/utils';
import { Progress } from '../../components/ui/progress';
import { useAppContext } from '../../contexts/AppContext';
import { useRegu } from '../../hooks/useRegu';

interface DesktopReguPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function DesktopReguPage({ onBack, onNavigate }: DesktopReguPageProps) {
  const { user } = useAppContext();
  const { regu, members, loading } = useRegu(user?.regu_id || null);

  const isPembimbingWithoutRegu = user?.role === 'pembimbing' && !user?.regu_id;

  if (!user?.regu_id) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-gray-900">Regu Saya</h1>
            </div>
          </div>

          <Card className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-gray-900 mb-2">
              {isPembimbingWithoutRegu ? 'Anda belum memiliki regu' : 'Anda belum tergabung dalam regu'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {isPembimbingWithoutRegu 
                ? 'Sebagai pembimbing, Anda dapat membuat regu baru untuk mengelola relawan'
                : 'Scan QR code dari pembimbing atau masukkan kode regu untuk bergabung'
              }
            </p>
            
            {isPembimbingWithoutRegu ? (
              <Button 
                onClick={() => onNavigate?.('create-regu')}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Buat Regu Baru
              </Button>
            ) : (
              <Button 
                onClick={() => onNavigate?.('join-regu')}
                className="bg-primary-600 hover:bg-primary-700"
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

  const sortedMembers = [...members].sort((a, b) => 
    (b.total_donations || 0) - (a.total_donations || 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-gray-900">Regu Saya</h1>
                <p className="text-gray-600 text-sm">Kelola dan pantau performa regu</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user?.role === 'pembimbing' && (
                <Button onClick={() => onNavigate?.('my-regus')} variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Kelola Regu
                </Button>
              )}
              <Button onClick={() => onNavigate?.('regu-qr-code')} variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
              <Button onClick={() => onNavigate?.('chat-regu')} size="sm" className="bg-primary-600 hover:bg-primary-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat Regu
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Regu Info */}
            <div className="col-span-1 space-y-4">
              <Card className="p-5">
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-3">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-gray-900 mb-1">{regu?.name || user?.regu_name || 'Regu'}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Pembimbing: {regu?.pembimbing_name || 'Ustadz Abdullah'}
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-primary-100 text-primary-700 border-none text-xs">
                      {members.length} Anggota
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-gray-600 text-xs mb-2">Progress Target Regu</p>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-primary-600 text-sm font-semibold">{formatCurrency(reguDonations)}</span>
                      <span className="text-gray-900 text-xs font-semibold">{Math.round(reguProgress)}%</span>
                    </div>
                    <Progress value={reguProgress} className="h-2 mb-1" />
                    <p className="text-gray-500 text-xs text-right">Target: {formatCurrency(reguTarget)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h4 className="text-gray-900 text-sm font-semibold mb-4">Statistik Regu</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total Anggota</span>
                    <span className="text-gray-900 font-semibold">{members.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total Donasi</span>
                    <span className="text-primary-600 font-semibold text-sm">{formatCurrency(reguDonations)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Rata-rata</span>
                    <span className="text-gray-900 font-semibold text-sm">{formatCurrency(members.length > 0 ? reguDonations / members.length : 0)}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Leaderboard */}
            <div className="col-span-2">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-gray-900 mb-1">Leaderboard Regu</h3>
                    <p className="text-gray-600 text-sm">Peringkat donasi anggota regu</p>
                  </div>
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {sortedMembers.map((member, index) => {
                    const isCurrentUser = member.id === user?.id;
                    return (
                      <div 
                        key={member.id}
                        className={`p-4 rounded-lg border transition-all ${
                          isCurrentUser 
                            ? 'bg-primary-50 border-primary-200' 
                            : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`text-2xl font-bold ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            index === 2 ? 'text-orange-600' :
                            'text-gray-400'
                          }`}>
                            #{index + 1}
                          </div>
                          
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className={
                              isCurrentUser 
                                ? 'bg-primary-200 text-primary-700' 
                                : 'bg-gray-200 text-gray-600'
                            }>
                              {getInitials(member.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-gray-900 font-medium">
                                {member.full_name}
                                {isCurrentUser && (
                                  <span className="text-primary-600 text-xs ml-2">(Anda)</span>
                                )}
                              </p>
                              {member.role === 'pembimbing' && (
                                <Badge className="bg-purple-100 text-purple-700 border-none text-xs">
                                  Pembimbing
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">{member.phone}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-primary-600 font-semibold">
                              {formatCurrency(member.total_donations || 0)}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {member.total_muzakki || 0} muzakki
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
