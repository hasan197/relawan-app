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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={handleBack}
            className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors touch-manipulation"
            style={{
              WebkitTapHighlightColor: 'transparent',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10
            }}
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white text-xl font-semibold">Pengaturan</h2>
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
                <Label htmlFor="reminder-followup">Pengingat Follow Up</Label>
                <p className="text-gray-500">Aktifkan pengingat untuk follow up donatur</p>
              </div>
              <Switch
                id="reminder-followup"
                checked={settings.reminderFollowUp}
                onCheckedChange={() => handleToggle('reminderFollowUp')}
                disabled={!settings.notificationEnabled}
              />
            </div>
          </div>
        </Card>

        {/* Display */}
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
                <p className="text-gray-500">Aktifkan tampilan mode gelap</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </div>

            <div className="px-4 py-4">
              <Label htmlFor="language" className="block mb-2">Bahasa</Label>
              <select
                id="language"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={settings.language}
                onChange={(e) => {
                  setSettings(prev => ({ ...prev, language: e.target.value }));
                  toast.success('Bahasa berhasil diubah');
                }}
              >
                <option value="id">Bahasa Indonesia</option>
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
              <h4 className="text-gray-700">Keamanan</h4>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <Label htmlFor="biometric">Otentikasi Biometrik</Label>
                <p className="text-gray-500">Gunakan sidik jari atau wajah untuk login</p>
              </div>
              <Switch
                id="biometric"
                checked={settings.biometric}
                onCheckedChange={() => handleToggle('biometric')}
              />
            </div>

            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <Label>Backup Otomatis</Label>
                <p className="text-gray-500">Pencadangan data otomatis ke cloud</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={() => handleToggle('autoBackup')}
              />
            </div>
          </div>
        </Card>

        {/* Storage */}
        <Card className="mb-4 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-gray-600" />
              <h4 className="text-gray-700">Penyimpanan</h4>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Penyimpanan yang digunakan</span>
              <span className="text-sm font-medium">245 MB dari 2 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '12.25%' }}></div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={handleClearCache}
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-500" />
              Bersihkan Cache
            </Button>
          </div>
        </Card>

        {/* Account Actions */}
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus Akun
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Versi 1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">© 2025 Relawan App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
