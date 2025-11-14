import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Keyboard, Loader2, CheckCircle2, QrCode } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner@2.0.3';
import { useAppContext } from '../contexts/AppContext';
import { useJoinRegu } from '../hooks/useJoinRegu';
import { motion } from 'motion/react';
import jsQR from 'jsqr';

interface JoinReguPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function JoinReguPage({ onBack, onSuccess }: JoinReguPageProps) {
  const { user, refreshUser } = useAppContext();
  const { joinRegu, loading } = useJoinRegu();
  const [mode, setMode] = useState<'choice' | 'scan' | 'manual'>('choice');
  const [joinCode, setJoinCode] = useState('');
  const [success, setSuccess] = useState(false);
  const [reguInfo, setReguInfo] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const scanningIntervalRef = useRef<number | null>(null);

  // Format code input (auto-uppercase, max 6 chars)
  const handleCodeInput = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setJoinCode(formatted);
  };

  // Handle manual join
  const handleManualJoin = async () => {
    if (!user?.id) {
      toast.error('User tidak ditemukan. Silakan login kembali.');
      return;
    }

    if (joinCode.length !== 6) {
      toast.error('Kode regu harus 6 karakter');
      return;
    }

    const result = await joinRegu(user.id, joinCode);

    if (result.success) {
      setSuccess(true);
      setReguInfo(result.data?.regu);
      
      // Refresh user context to get updated regu_id
      await refreshUser();

      // Show success for 2 seconds then navigate
      setTimeout(() => {
        toast.success(result.message);
        onSuccess?.();
      }, 2000);
    } else {
      toast.error(result.message);
    }
  };

  // Start camera for QR scanning
  const startCamera = async () => {
    setMode('scan');
    setScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // For demo purposes: Since we don't have QR scanner library,
      // show manual input after 2 seconds
      setTimeout(() => {
        toast.info('Scan QR code atau klik "Input Manual" untuk memasukkan kode');
      }, 1000);
    } catch (err) {
      console.error('Camera error:', err);
      toast.error('Tidak dapat mengakses kamera. Gunakan input manual.');
      setMode('manual');
      setScanning(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
  };

  // Scan QR code from video frame
  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current || !user?.id) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (canvas.width === 0 || canvas.height === 0) return;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code && code.data) {
      console.log('✅ QR Code detected:', code.data);
      
      // Stop scanning
      setScanning(false);
      stopCamera();
      
      // Extract just the code (in case QR contains full URL or extra data)
      const detectedCode = code.data.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
      
      if (detectedCode.length !== 6) {
        toast.error('QR code tidak valid. Gunakan input manual.');
        setMode('manual');
        return;
      }
      
      // Join regu with detected code
      const result = await joinRegu(user.id, detectedCode);

      if (result.success) {
        setSuccess(true);
        setReguInfo(result.data?.regu);
        
        // Refresh user context to get updated regu_id
        await refreshUser();

        // Show success for 2 seconds then navigate
        setTimeout(() => {
          toast.success(result.message);
          onSuccess?.();
        }, 2000);
      } else {
        toast.error(result.message);
        setMode('manual');
      }
    }
  };

  // Start scanning interval
  useEffect(() => {
    if (scanning) {
      scanningIntervalRef.current = window.setInterval(scanQRCode, 300);
    } else {
      if (scanningIntervalRef.current) {
        clearInterval(scanningIntervalRef.current);
        scanningIntervalRef.current = null;
      }
    }

    return () => {
      if (scanningIntervalRef.current) {
        clearInterval(scanningIntervalRef.current);
        scanningIntervalRef.current = null;
      }
    };
  }, [scanning, user]);

  // Success Animation
  if (success && reguInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          >
            <CheckCircle2 className="h-24 w-24 text-green-600 mx-auto mb-6" />
          </motion.div>
          
          <h2 className="text-2xl text-gray-900 mb-2">Berhasil Bergabung!</h2>
          <p className="text-gray-600 mb-6">
            Selamat datang di <span className="font-semibold text-primary-600">{reguInfo.name}</span>
          </p>
          
          <Card className="p-6 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                <QrCode className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">{reguInfo.name}</h3>
                <p className="text-gray-600 text-sm">
                  Pembimbing: {reguInfo.pembimbing_name}
                </p>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              Mengarahkan ke dashboard...
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => {
              stopCamera();
              onBack?.();
            }}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h2 className="text-white">Gabung Regu</h2>
            <p className="text-primary-100 text-sm">Scan QR atau masukkan kode</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Choice Mode */}
        {mode === 'choice' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">🕌</div>
              <h3 className="text-gray-900 mb-2">Pilih Cara Bergabung</h3>
              <p className="text-gray-600 text-sm mb-6">
                Gunakan QR code dari pembimbing atau masukkan kode manual
              </p>

              <div className="space-y-3">
                <Button
                  onClick={startCamera}
                  className="w-full bg-primary-600 hover:bg-primary-700"
                  size="lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Scan QR Code
                </Button>

                <Button
                  onClick={() => setMode('manual')}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Keyboard className="h-5 w-5 mr-2" />
                  Input Kode Manual
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex gap-3">
                <div className="text-2xl">ℹ️</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <strong>Catatan:</strong> Minta kode regu 6 digit dari pembimbing atau admin Anda untuk bergabung.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Scan Mode */}
        {mode === 'scan' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <Card className="overflow-hidden">
              {/* Camera View */}
              <div className="relative bg-black aspect-square">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Scan Frame Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-4 border-white rounded-2xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-2xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-2xl"></div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full inline-block">
                    Arahkan kamera ke QR Code
                  </p>
                </div>
              </div>

              <div className="p-4">
                <Button
                  onClick={() => {
                    stopCamera();
                    setMode('manual');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Keyboard className="h-4 w-4 mr-2" />
                  Gunakan Input Manual
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex gap-3">
                <div className="text-2xl">💡</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Pastikan QR code terlihat jelas dalam kotak scan untuk hasil terbaik.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Manual Input Mode */}
        {mode === 'manual' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Masukkan Kode Regu</h3>
                <p className="text-gray-600 text-sm">
                  Masukkan kode 6 digit dari pembimbing
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Kode Regu (6 Karakter)</Label>
                  <Input
                    type="text"
                    value={joinCode}
                    onChange={(e) => handleCodeInput(e.target.value)}
                    placeholder="Contoh: ABC123"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono uppercase"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">
                    {joinCode.length}/6 karakter
                  </p>
                </div>

                <Button
                  onClick={handleManualJoin}
                  disabled={loading || joinCode.length !== 6}
                  className="w-full bg-primary-600 hover:bg-primary-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Gabung Regu'
                  )}
                </Button>

                <Button
                  onClick={() => setMode('choice')}
                  variant="ghost"
                  className="w-full"
                >
                  Kembali
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex gap-3">
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <strong>Contoh kode:</strong> A1B2C3, XYZ789, atau ABC123
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Hidden canvas for QR code scanning */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}