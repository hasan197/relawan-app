import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Share2, Copy, CheckCircle2, Loader2, AlertCircle, Users } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { useAppContext } from '../contexts/AppContext';
import { useRegu } from '../hooks/useRegu';
import { copyToClipboard } from '../lib/utils';
import QRCode from 'qrcode';

interface ReguQRCodePageProps {
  onBack?: () => void;
}

export function ReguQRCodePage({ onBack }: ReguQRCodePageProps) {
  const { user } = useAppContext();
  const { regu, members, loading } = useRegu(user?.regu_id || null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrError, setQrError] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper function to get the join code (backward compatibility)
  const getJoinCode = () => {
    return regu?.join_code || regu?.qr_code || null;
  };

  // Generate QR Code
  useEffect(() => {
    console.log('🔍 QR Code useEffect triggered');
    console.log('📊 Regu data:', regu);
    console.log('📊 Join code:', regu?.join_code);
    console.log('📊 QR code (legacy):', regu?.qr_code);
    console.log('📊 Loading:', loading);
    
    const code = getJoinCode();
    
    if (code) {
      console.log('✅ Code exists, generating QR for:', code);
      generateQRCode(code);
    } else if (regu && !code) {
      console.warn('⚠️ Regu loaded but NO join_code or qr_code!');
      setQrError(true);
    } else {
      console.log('⏳ Waiting for regu data...');
    }
  }, [regu, loading]);

  const generateQRCode = async (code: string) => {
    try {
      console.log('🔄 Generating QR Code for:', code);
      setQrError(false);
      
      // Generate QR code as data URL
      const url = await QRCode.toDataURL(code, {
        width: 400,
        margin: 2,
        color: {
          dark: '#16a34a', // primary-600
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });
      
      console.log('✅ QR Code generated successfully');
      console.log('📊 QR URL length:', url.length);
      console.log('📊 QR URL preview:', url.substring(0, 50) + '...');
      
      setQrCodeUrl(url);
    } catch (err) {
      console.error('❌ QR generation error:', err);
      setQrError(true);
      toast.error('Gagal membuat QR code. Silakan gunakan kode manual.');
    }
  };

  // Copy code to clipboard
  const handleCopyCode = async () => {
    const code = getJoinCode();
    if (code) {
      const success = await copyToClipboard(code);
      if (success) {
        setCopied(true);
        toast.success('Kode berhasil disalin!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error('Gagal menyalin kode');
      }
    }
  };

  // Download QR as image
  const handleDownloadQR = async () => {
    if (!qrCodeUrl) return;

    try {
      const code = getJoinCode();
      
      // Create a canvas with branding
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 600;
      canvas.height = 800;

      // Background
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(0, 0, canvas.width, 150);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Gabung Regu ZISWAF', canvas.width / 2, 60);

      // Regu Name
      ctx.font = '24px Inter, sans-serif';
      ctx.fillText(regu?.name || '', canvas.width / 2, 100);

      // QR Code
      const qrImage = new Image();
      qrImage.src = qrCodeUrl;
      await new Promise((resolve) => {
        qrImage.onload = resolve;
      });
      
      const qrSize = 400;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 180;
      
      // White background for QR
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);
      
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      // Code text
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 28px monospace';
      ctx.fillText(code || '', canvas.width / 2, qrY + qrSize + 70);

      // Instructions
      ctx.fillStyle = '#6b7280';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText('Scan QR atau masukkan kode di atas', canvas.width / 2, qrY + qrSize + 110);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-regu-${code}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('QR Code berhasil diunduh!');
      });
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Gagal mengunduh QR code');
    }
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    if (!regu) return;

    const code = getJoinCode();
    const message = `🕌 *Gabung ${regu.name}!*\\n\\nAyo bergabung dengan regu kami!\\n\\n📱 Cara Join:\\n1. Buka aplikasi ZISWAF Manager\\n2. Pilih \"Gabung Regu\"\\n3. Masukkan kode: *${code}*\\n\\nAtau scan QR code yang terlampir.\\n\\n👥 Pembimbing: ${regu.pembimbing_name}\\n✅ Member: ${members.length} relawan`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  // Share API (native share if available)
  const handleNativeShare = async () => {
    if (!regu) return;

    const code = getJoinCode();
    const shareData = {
      title: `Gabung ${regu.name}`,
      text: `Kode regu: ${code}\\n\\nAyo bergabung dengan ${regu.name}!\\nPembimbing: ${regu.pembimbing_name}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to WhatsApp
        handleShareWhatsApp();
      }
    } catch (err) {
      console.log('Share cancelled or failed', err);
    }
  };

  if (!user?.regu_id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h2 className="text-white">QR Code Regu</h2>
          </div>
        </div>

        <div className="px-4 py-8">
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">👥</div>
            <p className="text-gray-600 mb-2">Anda belum tergabung dalam regu</p>
            <p className="text-gray-400 text-sm">
              Bergabunglah dengan regu untuk mengakses fitur ini
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // ✅ NEW: Role-based access control
  const canAccessQRCode = user?.role === 'admin' || user?.role === 'pembimbing';

  if (!canAccessQRCode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h2 className="text-white">QR Code Regu</h2>
          </div>
        </div>

        <div className="px-4 py-8">
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-gray-900 mb-2">Akses Terbatas</h3>
            <p className="text-gray-600 mb-4">
              Fitur ini hanya dapat diakses oleh <strong>Pembimbing</strong> atau <strong>Admin</strong>
            </p>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-left">
              <p className="text-sm text-gray-700">
                <strong>💡 Info:</strong> Untuk mendapatkan QR Code regu, hubungi pembimbing Anda.
              </p>
            </div>
            <Button
              onClick={onBack}
              variant="outline"
              className="mt-6"
            >
              Kembali
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h2 className="text-white">QR Code Regu</h2>
            <p className="text-primary-100 text-sm">Share untuk mengundang anggota baru</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {loading ? (
          <Card className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat QR Code...</p>
          </Card>
        ) : (
          <>
            {/* Regu Info */}
            <Card className="p-6 mb-4">
              <div className="text-center mb-4">
                <Badge className="bg-primary-600 text-white border-none mb-2">
                  Kode Join Regu
                </Badge>
                <h3 className="text-gray-900 text-2xl mb-1">{regu?.name}</h3>
                <p className="text-gray-600">
                  Pembimbing: {regu?.pembimbing_name}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  👥 {members.length} Anggota
                </p>
              </div>
            </Card>

            {/* QR Code Card */}
            <Card className="p-8 mb-4">
              <div className="text-center">
                {/* Debug Info (for troubleshooting) */}
                {!getJoinCode() && !loading && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-700 font-semibold mb-1">
                      ⚠️ Join Code Tidak Ditemukan
                    </p>
                    <p className="text-red-600 text-sm mb-2">
                      Regu ini belum memiliki kode join. Silakan hubungi admin.
                    </p>
                    <div className="text-xs text-left bg-red-100 p-2 rounded mt-2 font-mono">
                      <p>Debug Info:</p>
                      <p>Regu ID: {regu?.id || 'N/A'}</p>
                      <p>Regu Name: {regu?.name || 'N/A'}</p>
                      <p>Join Code: {regu?.join_code || 'MISSING'}</p>
                      <p>QR Code (legacy): {regu?.qr_code || 'MISSING'}</p>
                    </div>
                  </div>
                )}

                {/* QR Code */}
                {qrCodeUrl ? (
                  <div className="mb-6">
                    <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-64 h-64 mx-auto"
                      />
                    </div>
                  </div>
                ) : qrError ? (
                  <div className="w-64 h-64 mx-auto mb-6 flex flex-col items-center justify-center bg-red-50 rounded-2xl border-2 border-red-200">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                    <p className="text-red-600 text-sm">Gagal membuat QR Code</p>
                  </div>
                ) : getJoinCode() ? (
                  <div className="w-64 h-64 mx-auto mb-6 flex flex-col items-center justify-center bg-gray-100 rounded-2xl">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
                    <p className="text-gray-500 text-sm mt-2">Membuat QR Code...</p>
                  </div>
                ) : null}

                {/* Code Display */}
                {getJoinCode() && (
                  <div className="mb-6">
                    <p className="text-gray-600 text-sm mb-2">Atau masukkan kode:</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="px-6 py-3 bg-gray-100 rounded-lg">
                        <span className="text-3xl font-mono font-bold text-primary-600 tracking-widest">
                          {getJoinCode()}
                        </span>
                      </div>
                      <Button
                        onClick={handleCopyCode}
                        size="sm"
                        variant="outline"
                        className="gap-2 h-auto"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-xs">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span className="text-xs">Salin</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Only show if join_code exists */}
                {getJoinCode() && (
                  <div className="space-y-3">
                    <Button
                      onClick={handleShareWhatsApp}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                      disabled={!qrCodeUrl}
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Share via WhatsApp
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleDownloadQR}
                        variant="outline"
                        className="w-full"
                        disabled={!qrCodeUrl}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>

                      <Button
                        onClick={handleNativeShare}
                        variant="outline"
                        className="w-full"
                        disabled={!qrCodeUrl}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                <span>📱</span>
                <span>Cara Mengundang Anggota:</span>
              </h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Share QR code atau kode via WhatsApp</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Anggota baru buka aplikasi ZISWAF Manager</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>Pilih "Gabung Regu" dan scan/input kode</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>Anggota otomatis bergabung dengan regu</span>
                </li>
              </ol>
            </Card>

            {/* Recent Members */}
            {members.length > 0 && (
              <Card className="p-4 mt-4">
                <h4 className="text-gray-900 mb-3">Anggota Terbaru</h4>
                <div className="space-y-2">
                  {members.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm font-semibold">
                        {member.full_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-sm truncate">{member.full_name}</p>
                        <p className="text-gray-500 text-xs">{member.city || 'N/A'}</p>
                      </div>
                      {member.id === user?.id && (
                        <Badge className="bg-primary-600 text-white border-none text-xs">
                          Anda
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}