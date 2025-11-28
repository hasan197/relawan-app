import { useState } from 'react';
import { ArrowLeft, Bell, Moon, Globe, Lock, Smartphone, Trash2, LogOut, Settings } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner@2.0.3';

interface DesktopPengaturanPageProps {
  onBack?: () => void;
}

export function DesktopPengaturanPage({ onBack }: DesktopPengaturanPageProps) {
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
    toast.error('Fitur hapus akun memerlukan konfirmasi admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary-600" />
            <h1 className="text-gray-900">Pengaturan</h1>
          </div>
        </div>
        <p className="text-gray-600 text-sm ml-14">Kelola preferensi dan konfigurasi aplikasi Anda</p>
      </div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Notifications */}
          <Card className="overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-600" />
                <h3 className="text-gray-900 text-sm font-semibold">Notifikasi</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="notif-enabled" className="text-sm">Aktifkan Notifikasi</Label>
                  <p className="text-gray-500 text-xs">Terima semua notifikasi aplikasi</p>
                </div>
                <Switch
                  id="notif-enabled"
                  checked={settings.notificationEnabled}
                  onCheckedChange={() => handleToggle('notificationEnabled')}
                />
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="push-notif" className="text-sm">Push Notification</Label>
                  <p className="text-gray-500 text-xs">Notifikasi langsung ke perangkat</p>
                </div>
                <Switch
                  id="push-notif"
                  checked={settings.pushNotification}
                  onCheckedChange={() => handleToggle('pushNotification')}
                  disabled={!settings.notificationEnabled}
                />
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="email-notif" className="text-sm">Email Notification</Label>
                  <p className="text-gray-500 text-xs">Terima notifikasi via email</p>
                </div>
                <Switch
                  id="email-notif"
                  checked={settings.emailNotification}
                  onCheckedChange={() => handleToggle('emailNotification')}
                  disabled={!settings.notificationEnabled}
                />
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="reminder" className="text-sm">Reminder Follow-up</Label>
                  <p className="text-gray-500 text-xs">Pengingat otomatis follow-up muzakki</p>
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
          <Card className="overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-gray-600" />
                <h3 className="text-gray-900 text-sm font-semibold">Tampilan</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="dark-mode" className="text-sm">Mode Gelap</Label>
                  <p className="text-gray-500 text-xs">Ubah tema menjadi gelap</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggle('darkMode')}
                />
              </div>

              <div className="px-4 py-3">
                <Label className="text-sm">Bahasa</Label>
                <p className="text-gray-500 text-xs mb-2">Pilih bahasa aplikasi</p>
                <select
                  value={settings.language}
                  onChange={(e) => {
                    setSettings({ ...settings, language: e.target.value });
                    toast.success('Bahasa berhasil diubah');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Security */}
          <Card className="overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-600" />
                <h3 className="text-gray-900 text-sm font-semibold">Keamanan & Privasi</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="biometric" className="text-sm">Autentikasi Biometrik</Label>
                  <p className="text-gray-500 text-xs">Login dengan sidik jari/wajah</p>
                </div>
                <Switch
                  id="biometric"
                  checked={settings.biometric}
                  onCheckedChange={() => handleToggle('biometric')}
                />
              </div>

              <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="text-left flex-1">
                  <p className="text-gray-900 text-sm">Ubah Password</p>
                  <p className="text-gray-500 text-xs">Ganti password akun Anda</p>
                </div>
                <Lock className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </Card>

          {/* Data & Storage */}
          <Card className="overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-gray-600" />
                <h3 className="text-gray-900 text-sm font-semibold">Data & Penyimpanan</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="auto-backup" className="text-sm">Backup Otomatis</Label>
                  <p className="text-gray-500 text-xs">Cadangkan data secara otomatis</p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={settings.autoBackup}
                  onCheckedChange={() => handleToggle('autoBackup')}
                />
              </div>

              <button 
                onClick={handleClearCache}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left flex-1">
                  <p className="text-gray-900 text-sm">Hapus Cache</p>
                  <p className="text-gray-500 text-xs">Bersihkan data sementara</p>
                </div>
                <Trash2 className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <div className="px-4 py-2.5 bg-red-50 border-b border-red-100">
              <h3 className="text-red-700 text-sm font-semibold">Zona Berbahaya</h3>
            </div>
            
            <div className="p-4">
              <Button
                variant="outline"
                onClick={handleDeleteAccount}
                className="w-full border-red-600 text-red-600 hover:bg-red-50 text-sm"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Akun
              </Button>
              <p className="text-gray-500 text-xs mt-2 text-center">
                Tindakan ini tidak dapat dibatalkan
              </p>
            </div>
          </Card>

          {/* Version Info */}
          <div className="text-center text-gray-400 text-xs py-2">
            <p>ZISWAF Manager v1.0.0</p>
            <p>Build 2025.11.08</p>
          </div>
        </div>
      </div>
    </div>
  );
}
