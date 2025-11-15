import { useState } from 'react';
import { ArrowLeft, Database, AlertTriangle, CheckCircle2, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { apiCall } from '../lib/supabase';

interface DatabaseResetPageProps {
  onBack?: () => void;
}

export function DatabaseResetPage({ onBack }: DatabaseResetPageProps) {
  const [resetting, setResetting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedData, setSeedData] = useState<any>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    if (!confirmReset) {
      toast.error('Silakan centang konfirmasi terlebih dahulu');
      return;
    }

    try {
      setResetting(true);
      console.log('🗑️ Resetting database...');
      
      const response = await apiCall('/admin/reset-database', {
        method: 'POST'
      });

      console.log('✅ Database reset response:', response);
      toast.success('Database berhasil di-reset!');
      setSeedData(null);
      setConfirmReset(false);
    } catch (error: any) {
      console.error('❌ Reset error:', error);
      toast.error(error.message || 'Gagal reset database');
    } finally {
      setResetting(false);
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      console.log('🌱 Seeding database...');
      
      const response = await apiCall('/admin/seed-database', {
        method: 'POST'
      });

      console.log('✅ Seed response:', response);
      setSeedData(response.data);
      toast.success('Database berhasil di-seed dengan data sample!');
    } catch (error: any) {
      console.error('❌ Seed error:', error);
      toast.error(error.message || 'Gagal seed database');
    } finally {
      setSeeding(false);
    }
  };

  const handleResetAndSeed = async () => {
    if (!confirmReset) {
      toast.error('Silakan centang konfirmasi terlebih dahulu');
      return;
    }

    await handleReset();
    
    // Wait a bit before seeding
    setTimeout(async () => {
      await handleSeed();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-red-500 to-red-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h2 className="text-white flex items-center gap-2">
              <Database className="h-6 w-6" />
              Reset Database
            </h2>
            <p className="text-red-100 text-sm">⚠️ Admin Only - Danger Zone</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Warning Card */}
        <Card className="p-6 mb-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-red-900 font-semibold mb-2">
                ⚠️ Peringatan Penting!
              </h3>
              <p className="text-red-700 text-sm mb-3">
                Fitur ini akan <strong>MENGHAPUS SEMUA DATA</strong> di database termasuk:
              </p>
              <ul className="text-red-700 text-sm space-y-1 ml-4">
                <li>• Semua user (admin, pembimbing, relawan)</li>
                <li>• Semua regu dan anggotanya</li>
                <li>• Semua donasi dan prospek</li>
                <li>• Semua template dan chat</li>
              </ul>
              <p className="text-red-700 text-sm mt-3 font-semibold">
                ⚠️ Tindakan ini TIDAK BISA dibatalkan!
              </p>
            </div>
          </div>
        </Card>

        {/* Confirmation */}
        <Card className="p-6 mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmReset}
              onChange={(e) => setConfirmReset(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <div className="text-sm">
              <p className="text-gray-900 font-semibold mb-1">
                Saya mengerti dan yakin ingin melanjutkan
              </p>
              <p className="text-gray-600">
                Saya memahami bahwa semua data akan dihapus permanen
              </p>
            </div>
          </label>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={handleResetAndSeed}
            disabled={!confirmReset || resetting || seeding}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            size="lg"
          >
            {(resetting || seeding) ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {resetting ? 'Mereset...' : 'Menginisialisasi...'}
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                Reset & Seed Database (Recommended)
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleReset}
              disabled={!confirmReset || resetting || seeding}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              {resetting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Reset Only
            </Button>

            <Button
              onClick={handleSeed}
              disabled={seeding || resetting}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              {seeding ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Seed Only
            </Button>
          </div>
        </div>

        {/* Seed Data Summary */}
        {seedData && (
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <h3 className="text-green-900 font-semibold">
                Database Berhasil Di-seed!
              </h3>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white rounded-lg">
                <p className="text-gray-600 text-xs">Total Users</p>
                <p className="text-gray-900 text-2xl font-bold">
                  {seedData.stats?.total_users || 0}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-gray-600 text-xs">Total Regus</p>
                <p className="text-gray-900 text-2xl font-bold">
                  {seedData.stats?.total_regus || 0}
                </p>
              </div>
            </div>

            {/* Admin Credentials */}
            <div className="mb-4">
              <h4 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                <Badge className="bg-purple-600 text-white border-none">Admin</Badge>
              </h4>
              <div className="p-3 bg-white rounded-lg text-sm">
                <p className="text-gray-600">
                  📱 <strong>Phone:</strong> {seedData.users?.admin?.phone}
                </p>
                <p className="text-gray-600">
                  🔑 <strong>Password:</strong> {seedData.users?.admin?.password}
                </p>
              </div>
            </div>

            {/* Pembimbing Credentials */}
            <div className="mb-4">
              <h4 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                <Badge className="bg-blue-600 text-white border-none">Pembimbing</Badge>
              </h4>
              <div className="space-y-2">
                {seedData.users?.pembimbing?.map((p: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white rounded-lg text-sm">
                    <p className="text-gray-900 font-semibold mb-1">{p.regu}</p>
                    <p className="text-gray-600">
                      📱 <strong>Phone:</strong> {p.phone}
                    </p>
                    <p className="text-gray-600">
                      🔑 <strong>Password:</strong> {p.password}
                    </p>
                    <p className="text-primary-600 font-mono font-bold mt-1">
                      Join Code: {p.code}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relawan Credentials */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                <Badge className="bg-green-600 text-white border-none">Relawan</Badge>
              </h4>
              <div className="space-y-2">
                {seedData.users?.relawan?.map((r: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white rounded-lg text-sm">
                    <p className="text-gray-900 font-semibold mb-1">{r.regu}</p>
                    <p className="text-gray-600">
                      📱 <strong>Phone:</strong> {r.phone}
                    </p>
                    <p className="text-gray-600">
                      🔑 <strong>Password:</strong> {r.password}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-4 mt-4 bg-blue-50 border-blue-200">
          <h4 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            <span>Cara Menggunakan:</span>
          </h4>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Klik "Reset & Seed Database" untuk reset dan isi dengan data sample</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Data sample termasuk: 1 admin, 2 pembimbing, 3 relawan, 2 regu</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Setelah seeding, gunakan kredensial di atas untuk login</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Semua password default bisa diubah setelah login</span>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
