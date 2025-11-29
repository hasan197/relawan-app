import { Camera, Edit, Mail, Phone, MapPin, Calendar, Settings, HelpCircle, Info, Shield, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { BottomNavigation } from '../components/BottomNavigation';
import { useAppContext } from '../contexts/AppContext';
import { getInitials } from '../lib/utils';

interface AdminProfilPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function AdminProfilPage({ onNavigate, onBack }: AdminProfilPageProps) {
  const { user } = useAppContext();

  const quickActions = [
    { id: 'admin-dashboard', label: 'Dashboard Admin', icon: Settings, color: 'bg-purple-600' },
    { id: 'admin-validasi-donasi', label: 'Validasi Donasi', icon: Shield, color: 'bg-blue-600' },
    { id: 'admin-data-management', label: 'Kelola Data', icon: Edit, color: 'bg-green-600' },
    { id: 'admin-tools', label: 'Admin Tools', icon: Settings, color: 'bg-orange-600' },
  ];

  const menuItems = [
    { id: 'pengaturan', label: 'Pengaturan Akun', icon: Settings, description: 'Kelola informasi dan keamanan' },
    { id: 'bantuan', label: 'Bantuan & FAQ', icon: HelpCircle, description: 'Panduan penggunaan sistem' },
    { id: 'tentang', label: 'Tentang Aplikasi', icon: Info, description: 'Informasi versi dan developer' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-primary-600 px-6 pt-6 pb-8">
        <h1 className="text-white mb-1">Profil Admin</h1>
        <p className="text-purple-100 text-sm">Kelola akun administrator</p>
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-4">
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name}`} />
                <AvatarFallback className="bg-purple-600 text-white text-2xl">
                  {getInitials(user?.full_name || 'Admin')}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 bg-purple-600 text-white rounded-full">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900 mb-1">{user?.full_name || 'Administrator'}</h2>
              <Badge className="bg-purple-100 text-purple-700 border-none mb-2">
                <Shield className="h-3 w-3 mr-1" />
                Administrator
              </Badge>
              <p className="text-xs text-gray-500">Akses Penuh Sistem</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full gap-2 mb-6"
            onClick={() => onNavigate?.('pengaturan')}
          >
            <Edit className="h-4 w-4" />
            Edit Profil
          </Button>

          {/* Contact Info */}
          <div className="space-y-3 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{user?.phone || '+62 812-3456-7890'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm break-all">{user?.email || 'admin@ziswaf.org'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{user?.city || 'Jakarta, Indonesia'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Bergabung sejak 2024</span>
            </div>
          </div>

          {/* Admin Badge */}
          <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Shield className="h-4 w-4 text-white" />
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

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <h3 className="text-gray-900 mb-3">Akses Cepat</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate?.(action.id)}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-600 active:scale-95 transition-all"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm text-gray-900 text-center leading-tight">{action.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 mt-6">
        <h3 className="text-gray-900 mb-3">Pengaturan & Informasi</h3>
        <Card className="divide-y divide-gray-100">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-gray-900">{item.label}</h4>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            );
          })}
        </Card>
      </div>

      {/* System Info */}
      <div className="px-6 mt-6 mb-6">
        <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-900 rounded-lg">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 mb-1">ZISWAF Manager v1.0</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                Sistem manajemen relawan dan fundraising untuk organisasi ZISWAF.
              </p>
              <div className="flex gap-3 text-xs text-gray-500">
                <div>Build: 2024.11.29</div>
                <div>Env: Production</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <BottomNavigation currentPage="profil" onNavigate={onNavigate} />
    </div>
  );
}
