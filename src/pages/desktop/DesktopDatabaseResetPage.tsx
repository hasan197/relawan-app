import { useState } from 'react';
import { ArrowLeft, Database, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner@2.0.3';
import { useResetDatabase } from '../../hooks/useResetDatabase';

interface DesktopDatabaseResetPageProps {
  onBack?: () => void;
}

export function DesktopDatabaseResetPage({ onBack }: DesktopDatabaseResetPageProps) {
  const [confirmed, setConfirmed] = useState(false);
  const { resetDatabase, resetting, success } = useResetDatabase();

  const handleReset = async () => {
    if (!confirmed) {
      toast.error('Anda harus mencentang konfirmasi terlebih dahulu');
      return;
    }

    try {
      await resetDatabase();
      toast.success('Database berhasil direset!');
    } catch (error: any) {
      toast.error(`Gagal reset database: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-gray-900">Reset & Seed Database</h1>
              <p className="text-gray-600 text-sm">Hapus dan isi ulang database dengan data testing</p>
            </div>
          </div>
        </div>

        {success ? (
          <Card className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">Database Berhasil Direset!</h3>
            <p className="text-gray-600 mb-6">
              Database telah direset dan diisi dengan data testing
            </p>
            <Button onClick={onBack}>
              Kembali ke Admin Dashboard
            </Button>
          </Card>
        ) : (
          <>
            <Card className="p-6 mb-4 border-red-200 bg-red-50">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-red-900 mb-2">⚠️ Peringatan Penting</h3>
                  <p className="text-red-700 text-sm mb-3">
                    Tindakan ini akan menghapus SEMUA data yang ada di database termasuk:
                  </p>
                  <ul className="text-red-700 text-sm space-y-1 mb-3 list-disc list-inside">
                    <li>Semua akun pengguna (relawan, pembimbing, admin)</li>
                    <li>Semua data regu dan anggotanya</li>
                    <li>Semua data muzakki dan prospek</li>
                    <li>Semua riwayat donasi dan komunikasi</li>
                    <li>Semua data chat dan notifikasi</li>
                  </ul>
                  <p className="text-red-700 text-sm font-semibold">
                    ⚠️ Tindakan ini TIDAK DAPAT dibatalkan!
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="text-gray-900 mb-4">Data Testing Yang Akan Dibuat</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <p className="text-gray-700"><strong>3 Akun User:</strong> admin@ziswaf.com, pembimbing@ziswaf.com, relawan@ziswaf.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <p className="text-gray-700"><strong>Password semua akun:</strong> password123</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <p className="text-gray-700"><strong>2 Regu:</strong> Regu Al-Fatih & Regu Al-Ikhlas dengan anggota</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <p className="text-gray-700"><strong>10 Muzakki:</strong> Data prospek dengan berbagai status</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <p className="text-gray-700"><strong>20 Donasi:</strong> Riwayat donasi dari berbagai muzakki</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <p className="text-gray-700"><strong>Template Pesan:</strong> Template WhatsApp untuk fundraising</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-4">
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                />
                <Label htmlFor="confirm" className="text-gray-900 cursor-pointer">
                  Saya memahami bahwa tindakan ini akan menghapus semua data secara permanen
                </Label>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button 
                onClick={onBack}
                variant="outline"
                className="flex-1"
                disabled={resetting}
              >
                Batal
              </Button>
              <Button 
                onClick={handleReset}
                disabled={!confirmed || resetting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {resetting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mereset Database...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Reset & Seed Database
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
