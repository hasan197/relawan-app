import { useState } from 'react';
import { ArrowLeft, Bell, Moon, Globe, Lock, Smartphone, Trash2, LogOut } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';

interface PengaturanPageProps {
  onBack?: () => void;
}

export function PengaturanPage({ onBack }: PengaturanPageProps) {
  const [settings, setSettings] = useState({
    notificationEnabled: true,
    pushNotification: true,
    emailNotification: false,
    reminderFollowUp: true,
    darkMode: false,
    language: 'id',
    autoBackup: true,
    biometric: false
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Pengaturan berhasil diubah');
  };

  const handleClearCache = () => {
    toast.success('Cache berhasil dibersihkan');
  };

  const handleDeleteAccount = () => {
    // Show confirmation dialog
    toast.error('Fitur hapus akun memerlukan konfirmasi admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Pengaturan</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Notifications */}
        <Card className="mb-4 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <h4 className="text-gray-700">Notifikasi</h4>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <Label htmlFor="notif-enabled">Aktifkan Notifikasi</Label>
                <p className="text-gray-500">Terima semua notifikasi aplikasi</p>
              </div>
              <Switch
                id="notif-enabled"
                checked={settings.notificationEnabled}
                onCheckedChange={() => handleToggle('notificationEnabled')}
              />
            </div>

            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <Label htmlFor="push-notif">Push Notification</Label>
                <p className="text-gray-500">Notifikasi langsung ke perangkat</p>
              </div>
              <Switch
                id="push-notif"
                checked={settings.pushNotification}
                onCheckedChange={() => handleToggle('pushNotification')}
                disabled={!settings.notificationEnabled}
              />
            </div>

            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif">Email Notification</Label>
                <p className="text-gray-500">Terima notifikasi via email</p>
              </div>
              <Switch
                id="email-notif"
                checked={settings.emailNotification}
                onCheckedChange={() => handleToggle('emailNotification')}
                disabled={!settings.notificationEnabled}
              />
            </div>

            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <Label htmlFor="reminder">Reminder Follow-up</Label>
                <p className="text-gray-500">Pengingat otomatis follow-up muzakki</p>
              </div>
              <Switch
                id="reminder"
                checked={settings.reminderFollowUp}
                onCheckedChange={() => handleToggle('reminderFollowUp')}
              />
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="mb-4 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-gray-600" />
              <h4 className="text-gray-700">Tampilan</h4>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Mode Gelap</Label>
                <p className="text-gray-500">Ubah tema menjadi gelap</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </div>

            <div className="px-4 py-4">
              <Label>Bahasa</Label>
              <p className="text-gray-500 mb-3">Pilih bahasa aplikasi</p>
              <select
                value={settings.language}
                onChange={(e) => {
                  setSettings({ ...settings, language: e.target.value });
                  toast.success('Bahasa berhasil diubah');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="mb-4 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-600" />
              <h4 className="text-gray-700">Keamanan & Privasi</h4>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <Label htmlFor="biometric">Autentikasi Biometrik</Label>
                <p className="text-gray-500">Login dengan sidik jari/wajah</p>
              </div>
              <Switch
                id="biometric"
                checked={settings.biometric}
                onCheckedChange={() => handleToggle('biometric')}
              />
            </div>

            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="text-left">
                <p className="text-gray-700">Ubah Password</p>
                <p className="text-gray-500">Ganti password akun Anda</p>
              </div>
              <Lock className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </Card>

        {/* Data & Storage */}
        <Card className="mb-4 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-gray-600" />
              <h4 className="text-gray-700">Data & Penyimpanan</h4>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <Label htmlFor="auto-backup">Backup Otomatis</Label>
                <p className="text-gray-500">Cadangkan data secara otomatis</p>
              </div>
              <Switch
                id="auto-backup"
                checked={settings.autoBackup}
                onCheckedChange={() => handleToggle('autoBackup')}
              />
            </div>

            <button 
              onClick={handleClearCache}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <p className="text-gray-700">Hapus Cache</p>
                <p className="text-gray-500">Bersihkan data sementara</p>
              </div>
              <Trash2 className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="mb-4 border-red-200">
          <div className="px-4 py-3 bg-red-50 border-b border-red-100">
            <h4 className="text-red-700">Zona Berbahaya</h4>
          </div>
          
          <div className="p-4">
            <Button
              variant="outline"
              onClick={handleDeleteAccount}
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Akun
            </Button>
            <p className="text-gray-500 mt-2 text-center">
              Tindakan ini tidak dapat dibatalkan
            </p>
          </div>
        </Card>

        <div className="text-center text-gray-400 mb-4">
          <p>ZISWAF Manager v1.0.0</p>
          <p>Build 2025.11.08</p>
        </div>
      </div>
    </div>
  );
}