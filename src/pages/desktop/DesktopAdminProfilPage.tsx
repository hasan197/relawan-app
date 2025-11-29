import { Camera, Edit, Mail, Phone, MapPin, Calendar, Settings, HelpCircle, Info, Shield } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { DesktopTopbar } from '../../components/desktop/DesktopTopbar';
import { useAppContext } from '../../contexts/AppContext';
import { getInitials } from '../../lib/utils';

interface DesktopAdminProfilPageProps {
  onNavigate?: (page: string) => void;
}

export function DesktopAdminProfilPage({ onNavigate }: DesktopAdminProfilPageProps) {
  const { user } = useAppContext();

  const menuItems = [
    { id: 'pengaturan', label: 'Pengaturan Akun', icon: Settings, description: 'Kelola informasi dan keamanan akun', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'bantuan', label: 'Bantuan & FAQ', icon: HelpCircle, description: 'Panduan penggunaan sistem', color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'tentang', label: 'Tentang Aplikasi', icon: Info, description: 'Informasi versi dan developer', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopTopbar 
        title="Profil Admin" 
        subtitle="Kelola akun administrator sistem"
        onNavigate={onNavigate}
      />

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="col-span-1">
              <Card className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name}`} />
                      <AvatarFallback className="bg-purple-600 text-white text-3xl">
                        {getInitials(user?.full_name || 'Admin')}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  <h2 className="text-gray-900 mb-1">{user?.full_name || 'Administrator'}</h2>
                  <Badge className="bg-purple-100 text-purple-700 border-none mb-2">
                    <Shield className="h-3 w-3 mr-1" />
                    Administrator
                  </Badge>
                  <p className="text-xs text-gray-500 mb-4">Akses Penuh Sistem</p>

                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => onNavigate?.('pengaturan')}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profil
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{user?.phone || '+62 812-3456-7890'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm break-all">{user?.email || 'admin@ziswaf.org'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{user?.city || 'Jakarta, Indonesia'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">Bergabung sejak 2024</span>
                  </div>
                </div>

                {/* Admin Badge */}
                <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-purple-900">Admin Panel</h4>
                      <p className="text-xs text-purple-600">Full Access</p>
                    </div>
                  </div>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    Anda memiliki akses penuh untuk mengelola data, validasi, dan administrasi sistem ZISWAF Manager.
                  </p>
                </div>
              </Card>
            </div>

            {/* Right Column - Menu */}
            <div className="col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-gray-900 mb-6">Akses Cepat</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => onNavigate?.('admin-dashboard')}
                    className="p-4 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:border-purple-400 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-gray-900 font-semibold">Dashboard Admin</h4>
                    </div>
                    <p className="text-sm text-gray-600">Kelola sistem secara keseluruhan</p>
                  </button>

                  <button
                    onClick={() => onNavigate?.('admin-validasi-donasi')}
                    className="p-4 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-400 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-gray-900 font-semibold">Validasi Donasi</h4>
                    </div>
                    <p className="text-sm text-gray-600">Verifikasi transaksi masuk</p>
                  </button>

                  <button
                    onClick={() => onNavigate?.('admin-data-management')}
                    className="p-4 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:border-green-400 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <Edit className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-gray-900 font-semibold">Kelola Data</h4>
                    </div>
                    <p className="text-sm text-gray-600">Program, template, dan master data</p>
                  </button>

                  <button
                    onClick={() => onNavigate?.('admin-tools')}
                    className="p-4 rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:border-orange-400 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-600 rounded-lg">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-gray-900 font-semibold">Admin Tools</h4>
                    </div>
                    <p className="text-sm text-gray-600">Utilities dan pengaturan lanjutan</p>
                  </button>
                </div>
              </Card>

              {/* Settings Menu */}
              <Card className="p-6">
                <h3 className="text-gray-900 mb-6">Pengaturan & Informasi</h3>
                <div className="space-y-3">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate?.(item.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-600 hover:bg-primary-50 transition-all text-left group"
                      >
                        <div className={`p-3 ${item.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
                          <Icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                            {item.label}
                          </h4>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* System Info */}
              <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-900 rounded-xl">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-2">ZISWAF Manager v1.0</h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      Sistem manajemen relawan dan fundraising untuk organisasi ZISWAF (Zakat, Infaq, Sedekah, Wakaf).
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-semibold">Build:</span> 2024.11.29
                      </div>
                      <div>
                        <span className="font-semibold">Environment:</span> Production
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
