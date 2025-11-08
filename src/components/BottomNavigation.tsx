import { Home, Users, BarChart3, User } from 'lucide-react';

type NavItem = 'dashboard' | 'donatur' | 'laporan' | 'profil';

interface BottomNavigationProps {
  active: NavItem;
  onNavigate?: (item: NavItem) => void;
}

export function BottomNavigation({ active, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'dashboard' as NavItem, label: 'Dashboard', icon: Home },
    { id: 'donatur' as NavItem, label: 'Donatur', icon: Users },
    { id: 'laporan' as NavItem, label: 'Laporan', icon: BarChart3 },
    { id: 'profil' as NavItem, label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom">
      <div className="flex items-stretch max-w-md mx-auto h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`}
              aria-label={item.label}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                isActive ? 'bg-primary-50' : 'bg-transparent'
              }`}>
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
              </div>
              <span className="text-[10px] font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
