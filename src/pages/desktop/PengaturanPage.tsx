import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { Bell, Shield, Globe, Moon, Sun, Download, Upload, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

interface PengaturanPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function PengaturanPage({ onNavigate }: PengaturanPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('pengaturan');
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    smsNotifications: true,
    darkMode: false,
    autoBackup: true,
    language: 'id',
    currency: 'IDR',
  });

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DesktopLayout
      activeNav={activeNav}
      onNavigate={(page) => {
        setActiveNav(page);
        onNavigate?.(page);
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600 mt-1">Kelola preferensi dan konfigurasi aplikasi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
                    { id: 'keamanan', label: 'Keamanan', icon: Shield },
                    { id: 'tampilan', label: 'Tampilan', icon: Moon },
                    { id: 'bahasa', label: 'Bahasa & Region', icon: Globe },
                    { id: 'backup', label: 'Backup & Data', icon: Download },
                  ].map((item) => (
                    <button
                      key={item.id}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-700">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Pengaturan Notifikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="font-medium">
                      Notifikasi Aplikasi
                    </Label>
                    <p className="text-sm text-gray-500">
                      Terima notifikasi untuk aktivitas penting
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Notifikasi Email
                    </Label>
                    <p className="text-sm text-gray-500">
                      Kirim notifikasi melalui email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications" className="font-medium">
                      Notifikasi SMS
                    </Label>
                    <p className="text-sm text-gray-500">
                      Kirim notifikasi melalui SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Tampilan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="font-medium">
                      Mode Gelap
                    </Label>
                    <p className="text-sm text-gray-500">
                      Ubah tampilan aplikasi ke mode gelap
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="font-medium">
                    Bahasa
                  </Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="font-medium">
                    Mata Uang
                  </Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => handleSettingChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Manajemen Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup" className="font-medium">
                      Backup Otomatis
                    </Label>
                    <p className="text-sm text-gray-500">
                      Backup data secara otomatis setiap minggu
                    </p>
                  </div>
                  <Switch
                    id="auto-backup"
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Semua Data
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DesktopLayout>
  );
}