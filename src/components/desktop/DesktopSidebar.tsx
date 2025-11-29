import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  User, 
  MessageSquare,
  Gift,
  Settings,
  LogOut,
  Shield,
  TrendingUp,
  Bell,
  Database
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { getInitials } from '../../lib/utils';

interface DesktopSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function DesktopSidebar({ currentPage, onNavigate }: DesktopSidebarProps) {
  const { user, logout } = useAppContext();

  // Admin gets different menu structure
  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
    { id: 'admin-validasi-donasi', label: 'Validasi Donasi', icon: Shield },
    { id: 'admin-data', label: 'Data Management', icon: Database },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  // Regular users (Relawan & Pembimbing)
  const regularMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donatur', label: 'Muzakki', icon: Users },
    { id: 'laporan', label: 'Laporan', icon: FileText },
    { id: 'program', label: 'Program', icon: Gift },
    { id: 'regu', label: 'Regu Saya', icon: MessageSquare },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : regularMenuItems;

  const adminItems: typeof adminMenuItems = [];

  const bottomItems = [
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo & Brand */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center ${
            user?.role === 'admin' 
              ? 'from-purple-500 to-purple-600' 
              : 'from-primary-500 to-primary-600'
          }`}>
            {user?.role === 'admin' ? (
              <Shield className="h-5 w-5 text-white" />
            ) : (
              <TrendingUp className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-gray-900">ZISWAF</h2>
            <p className={user?.role === 'admin' ? 'text-purple-600' : 'text-gray-500'}>
              {user?.role === 'admin' ? 'Admin Panel' : 'Manager'}
            </p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2 p-2 bg-primary-50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name || 'User'}`} />
            <AvatarFallback className="bg-primary-600 text-white">
              {getInitials(user?.full_name || 'User')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="text-gray-900 truncate">{user?.full_name || 'Relawan'}</h4>
            <p className="text-primary-600 truncate">{user?.role || 'Relawan'}</p>
          </div>
          <button 
            onClick={() => onNavigate('notifikasi')}
            className="relative p-1.5 hover:bg-white rounded-lg transition-colors"
          >
            <Bell className="h-3.5 w-3.5 text-gray-600" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? user?.role === 'admin'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className={isActive ? '' : ''}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-gray-200 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}