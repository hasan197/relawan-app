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
  Bell
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donatur', label: 'Muzakki', icon: Users },
    { id: 'laporan', label: 'Laporan', icon: FileText },
    { id: 'program', label: 'Program', icon: Gift },
    { id: 'regu', label: 'Regu Saya', icon: MessageSquare },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Admin Panel', icon: Shield },
  ];

  const bottomItems = [
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">ZISWAF</h2>
            <p className="text-gray-500">Manager</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
          <Avatar className="h-10 w-10">
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
            className="relative p-2 hover:bg-white rounded-lg transition-colors"
          >
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className={isActive ? '' : ''}>{item.label}</span>
                {item.id === 'donatur' && (
                  <Badge className="ml-auto bg-blue-100 text-blue-700 border-none">
                    12
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="mt-6">
            <p className="px-4 text-gray-400 mb-2">Admin</p>
            <div className="space-y-1">
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
