import { useState } from 'react';
import { ArrowLeft, Users, TrendingUp, Award, MessageSquare } from 'lucide-react';
import { mockRegus, mockLeaderboard } from '../lib/mockData';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getInitials, formatCurrency } from '../lib/utils';
import { Progress } from '../components/ui/progress';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'program' | 'login' | 'regu' | 'notifikasi';

interface ReguPageProps {
  onBack?: () => void;
  onNavigate?: (page: NavigatePage) => void;
}

export function ReguPage({ onBack, onNavigate }: ReguPageProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const [selectedRegu] = useState(mockRegus[0]); // Current user's regu
  const reguMembers = mockLeaderboard; // Mock regu members

  const reguTarget = 60000000; // Target regu
  const reguProgress = (selectedRegu.totalDonations / reguTarget) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={handleBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Regu Saya</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Regu Info Card */}
        <Card className="p-6 shadow-card mb-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">{selectedRegu.name}</h3>
              <p className="text-gray-600 mb-2">
                Pembimbing: {selectedRegu.pembimbingName}
              </p>
              <div className="flex gap-3">
                <Badge className="bg-primary-100 text-primary-700 border-none">
                  {selectedRegu.memberCount} Anggota
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-none">
                  {formatCurrency(selectedRegu.totalDonations)}
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
                {formatCurrency(selectedRegu.totalDonations)}
              </span>
              <span className="text-gray-500">
                dari {formatCurrency(reguTarget)}
              </span>
            </div>
          </div>

          <Button className="w-full bg-primary-600 hover:bg-primary-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat Regu
          </Button>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-primary-600 mx-auto mb-2" />
            <p className="text-gray-500 mb-1">Peringkat</p>
            <p className="text-gray-900">#1</p>
          </Card>
          
          <Card className="p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-gray-500 mb-1">Anggota</p>
            <p className="text-gray-900">{selectedRegu.memberCount}</p>
          </Card>
          
          <Card className="p-4 text-center">
            <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-gray-500 mb-1">Prestasi</p>
            <p className="text-gray-900">3 🏆</p>
          </Card>
        </div>

        {/* Members List */}
        <Card className="p-4">
          <h4 className="text-gray-900 mb-4">Anggota Regu</h4>
          
          <div className="space-y-3">
            {reguMembers.map((member) => (
              <div 
                key={member.relawanId}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="relative">
                  {member.rank <= 3 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white z-10">
                      <span className="text-xs">#{member.rank}</span>
                    </div>
                  )}
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {getInitials(member.relawanName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 truncate">{member.relawanName}</h4>
                  <p className="text-gray-500">{member.muzakkiCount} muzakki</p>
                </div>
                
                <div className="text-right">
                  <p className="text-gray-900">{formatCurrency(member.totalDonations)}</p>
                  {member.rank <= 3 && (
                    <p className="text-yellow-600">⭐ Top {member.rank}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Motivation Card */}
        <Card className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
          <div className="text-center">
            <p className="text-2xl mb-2">🎯</p>
            <h4 className="text-gray-900 mb-2">Semangat {selectedRegu.name}!</h4>
            <p className="text-gray-700">
              Tinggal {formatCurrency(reguTarget - selectedRegu.totalDonations)} lagi untuk mencapai target!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
