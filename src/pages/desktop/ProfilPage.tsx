import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { currentUser } from '../../lib/mockData';
import { Edit, Camera, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

interface ProfilPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function ProfilPage({ onNavigate }: ProfilPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('profil');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    phone: currentUser.phone,
    reguName: currentUser.reguName || '',
  });

  const handleSave = () => {
    // Simpan data (dalam implementasi real, ini akan ke API)
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name,
      phone: currentUser.phone,
      reguName: currentUser.reguName || '',
    });
    setIsEditing(false);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
            <p className="text-gray-600 mt-1">Kelola informasi profil Anda</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profil
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback className="bg-primary-600 text-white text-xl">
                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{currentUser.name}</h3>
                    <p className="text-gray-600">{currentUser.role}</p>
                    <p className="text-sm text-gray-500">{currentUser.reguName}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{currentUser.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{currentUser.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regu">Nama Regu</Label>
                    {isEditing ? (
                      <Input
                        id="regu"
                        value={formData.reguName}
                        onChange={(e) => setFormData({...formData, reguName: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{currentUser.reguName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Peran</Label>
                    <p className="text-gray-900 capitalize">{currentUser.role}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Perubahan
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Batal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Donasi</span>
                  <span className="font-semibold">Rp 12.450.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Donatur</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bergabung</span>
                  <span className="font-semibold">3 Bulan</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ranking</span>
                  <span className="font-semibold">#2</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keamanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Ubah Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Verifikasi Akun
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  Hapus Akun
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DesktopLayout>
  );
}