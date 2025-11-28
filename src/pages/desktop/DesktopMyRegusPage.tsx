import { useAppContext } from '../../contexts/AppContext';
import { usePembimbingRegus } from '../../hooks/useRegu';
import { formatCurrency, copyToClipboard } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';

interface DesktopMyRegusPageProps {
  onBack?: () => void;
  onNavigate?: (page: string, reguId?: string) => void;
}

export function DesktopMyRegusPage({ onBack, onNavigate }: DesktopMyRegusPageProps) {
  const { user } = useAppContext();
  const { regus, loading } = usePembimbingRegus(user?.id || null);

  // Check if user is pembimbing
  if (user?.role !== 'pembimbing') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-8">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-3xl mb-1">Regu Saya</h1>
              <p className="text-primary-50">Kelola regu sebagai pembimbing</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-8">
          <Card className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-6">🚫</div>
            <h3 className="text-gray-900 mb-3">Akses Ditolak</h3>
            <p className="text-gray-500">
              Hanya pembimbing yang dapat mengelola regu
            </p>
          </Card>
        </div>
      </div>
    );
  }

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
              <h1 className="text-white text-3xl mb-1">Regu Saya</h1>
              <p className="text-primary-50">Kelola regu sebagai pembimbing</p>
            </div>
          </div>

          <Button 
            onClick={() => onNavigate?.('create-regu')}
            className="bg-white text-primary-700 hover:bg-primary-50"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Buat Regu Baru
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-primary-50 border-primary-200">
            <p className="text-gray-600 mb-2">Total Regu</p>
            <p className="text-4xl text-primary-700 mb-1">{regus.length}</p>
            <p className="text-sm text-gray-500">Regu yang Anda bimbing</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <p className="text-gray-600 mb-2">Total Anggota</p>
            <p className="text-4xl text-green-700 mb-1">
              {regus.reduce((sum, regu) => sum + (regu.member_count || 0), 0)}
            </p>
            <p className="text-sm text-gray-500">Relawan aktif</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
            <p className="text-gray-600 mb-2">Total Donasi</p>
            <p className="text-4xl text-yellow-700 mb-1">
              {formatCurrency(regus.reduce((sum, regu) => sum + (regu.total_donations || 0), 0))}
            </p>
            <p className="text-sm text-gray-500">Dari semua regu</p>
          </Card>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
          </div>
        ) : regus.length === 0 ? (
          /* Empty State */
          <Card className="p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-3">Belum Ada Regu</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Buat regu pertama Anda untuk mengelola relawan dan mengorganisir kegiatan fundraising
            </p>
            <Button 
              onClick={() => onNavigate?.('create-regu')}
              className="bg-primary-600 hover:bg-primary-700"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Buat Regu Pertama
            </Button>
          </Card>
        ) : (
          /* Regu Grid */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Daftar Regu ({regus.length})</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {regus.map((regu) => {
                const progress = ((regu.total_donations || 0) / (regu.target_amount || 60000000)) * 100;
                
                return (
                  <Card key={regu.id} className="p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start gap-5 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 mb-2">{regu.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-primary-100 text-primary-700 border-none">
                            <Users className="h-3 w-3 mr-1" />
                            {regu.member_count} Anggota
                          </Badge>
                          <Badge className="bg-green-100 text-green-700 border-none">
                            {formatCurrency(regu.total_donations || 0)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Progress Target</span>
                        <span className="text-gray-900">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2.5" />
                      <p className="text-gray-500 text-sm mt-2">
                        Target: {formatCurrency(regu.target_amount || 60000000)}
                      </p>
                    </div>

                    {/* Join Code Display */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Kode Join Regu</p>
                          <p className="text-gray-900 font-mono text-lg">{regu.join_code}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (regu.join_code) {
                              copyToClipboard(regu.join_code);
                              toast.success('Kode join telah disalin ke clipboard');
                            }
                          }}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          Salin
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          console.log('View regu:', regu.id);
                          // TODO: Implement regu detail view
                        }}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </Button>
                      
                      <Button 
                        className="bg-primary-600 hover:bg-primary-700"
                        onClick={() => onNavigate?.('regu-qr', regu.id)}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Tampilkan QR
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Card */}
        {regus.length > 0 && (
          <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
            <div className="flex gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h4 className="text-blue-900 mb-2">Tips untuk Pembimbing</h4>
                <p className="text-blue-800">
                  Sebagai pembimbing, Anda dapat membuat dan mengelola beberapa regu sekaligus 
                  untuk mengorganisir relawan dengan lebih baik. Setiap regu memiliki kode join 
                  unik dan QR code yang dapat dibagikan kepada calon anggota.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}