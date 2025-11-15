import { ArrowLeft, Users, Plus, TrendingUp, Loader2, QrCode } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useAppContext } from '../contexts/AppContext';
import { usePembimbingRegus } from '../hooks/useRegu';
import { formatCurrency, copyToClipboard } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

interface MyRegusPageProps {
  onBack?: () => void;
  onNavigate?: (page: string, reguId?: string) => void;
}

export function MyRegusPage({ onBack, onNavigate }: MyRegusPageProps) {
  const { user } = useAppContext();
  const { regus, loading } = usePembimbingRegus(user?.id || null);

  // Check if user is pembimbing
  if (user?.role !== 'pembimbing') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={onBack}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h2 className="text-white">Regu Saya</h2>
          </div>
        </div>

        <div className="px-4 py-8">
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">🚫</div>
            <p className="text-gray-600 mb-2">Akses Ditolak</p>
            <p className="text-gray-400 text-sm">
              Hanya pembimbing yang dapat mengelola regu
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="text-white">Regu Saya</h2>
            <p className="text-primary-50 text-sm">
              Kelola regu sebagai pembimbing
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Stats Summary */}
        <Card className="p-6 mb-4 bg-gradient-to-br from-blue-50 to-primary-50 border-primary-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Regu</p>
              <p className="text-2xl text-primary-700">{regus.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Anggota</p>
              <p className="text-2xl text-primary-700">
                {regus.reduce((sum, regu) => sum + (regu.member_count || 0), 0)}
              </p>
            </div>
          </div>
        </Card>

        {/* Add Regu Button */}
        <Button 
          onClick={() => onNavigate?.('create-regu')}
          className="w-full bg-primary-600 hover:bg-primary-700 mb-4"
        >
          <Plus className="h-5 w-5 mr-2" />
          Buat Regu Baru
        </Button>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : regus.length === 0 ? (
          /* Empty State */
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-gray-900 mb-2">Belum Ada Regu</h4>
            <p className="text-gray-500 text-sm mb-4">
              Buat regu pertama Anda untuk mengelola relawan
            </p>
            <Button 
              onClick={() => onNavigate?.('create-regu')}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Buat Regu Pertama
            </Button>
          </Card>
        ) : (
          /* Regu List */
          <div className="space-y-4">
            <h3 className="text-gray-700">Daftar Regu ({regus.length})</h3>
            
            {regus.map((regu) => {
              const progress = ((regu.total_donations || 0) / (regu.target_amount || 60000000)) * 100;
              
              return (
                <Card key={regu.id} className="p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-1">{regu.name}</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className="bg-primary-100 text-primary-700 border-none text-xs">
                          {regu.member_count} Anggota
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 border-none text-xs">
                          {formatCurrency(regu.total_donations || 0)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Progress Target</span>
                      <span className="text-gray-900 text-sm">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Set active regu and navigate
                        console.log('View regu:', regu.id);
                        // TODO: Implement regu detail view
                      }}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Lihat Detail
                    </Button>
                    
                    <Button 
                      size="sm"
                      className="bg-primary-600 hover:bg-primary-700"
                      onClick={async () => {
                        // Copy join code
                        if (regu.join_code) {
                          const success = await copyToClipboard(regu.join_code);
                          if (success) {
                            toast.success('Kode regu berhasil disalin!');
                          } else {
                            toast.error('Gagal menyalin kode');
                          }
                        }
                      }}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Kode: {regu.join_code}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="p-4 mt-4 bg-blue-50 border-blue-200">
          <p className="text-blue-800 text-sm">
            💡 <strong>Tip:</strong> Sebagai pembimbing, Anda dapat membuat dan mengelola 
            beberapa regu sekaligus untuk mengorganisir relawan dengan lebih baik.
          </p>
        </Card>
      </div>
    </div>
  );
}