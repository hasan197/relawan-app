import { Home, Users, BarChart3, User, MessageSquare, Users2, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { currentUser } from '../../lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '../../lib/utils';
import { cn } from '../../lib/utils';

type NavItem = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

interface SidebarProps {
  active: NavItem;
  onNavigate?: (item: NavItem) => void;
  isCollapsed?: boolean;
}

export function Sidebar({ active, onNavigate, isCollapsed = false }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as NavItem, label: 'Dashboard', icon: Home },
    { id: 'donatur' as NavItem, label: 'Donatur', icon: Users },
    { id: 'regu' as NavItem, label: 'Regu', icon: Users2 },
    { id: 'template' as NavItem, label: 'Template', icon: MessageSquare },
    { id: 'laporan' as NavItem, label: 'Laporan', icon: BarChart3 },
    { id: 'pengaturan' as NavItem, label: 'Pengaturan', icon: Settings },
    { id: 'profil' as NavItem, label: 'Profil', icon: User },
  ];

  return (
    <div 
      className={cn(
        "bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className={cn("border-b border-gray-200 transition-all duration-300", isCollapsed ? 'p-4' : 'p-6')}>
        <div className={cn("flex items-center", isCollapsed ? 'justify-center' : 'gap-3')}>
          <Avatar className={cn("transition-all duration-300", isCollapsed ? 'h-8 w-8' : 'h-10 w-10')}>
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary-600 text-white text-xs">
              {isCollapsed ? getInitials(currentUser.name, 1) : getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="font-semibold text-gray-900 truncate">{currentUser.name}</h2>
              <p className="text-sm text-gray-500 truncate">{currentUser.reguName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate?.(item.id)}
                  className={cn(
                    "w-full flex items-center rounded-lg transition-all duration-200 overflow-hidden",
                    "hover:bg-gray-50",
                    isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600',
                    isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3',
                    !isCollapsed && isActive ? 'border-r-2 border-primary-600' : ''
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={cn(
                    "flex-shrink-0",
                    isActive ? 'text-primary-600' : 'text-gray-400',
                    isCollapsed ? 'h-5 w-5' : 'h-5 w-5'
                  )} />
                  {!isCollapsed && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200">
        <button 
          className={cn(
            "w-full flex items-center rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
            isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3',
            isCollapsed ? 'mt-2' : ''
          )}
          title={isCollapsed ? 'Keluar' : undefined}
        >
          <LogOut className={cn("flex-shrink-0", isCollapsed ? 'h-5 w-5' : 'h-5 w-5')} />
          {!isCollapsed && <span className="font-medium">Keluar</span>}
        </button>
        
        {/* Collapse/Expand button - only visible on desktop */}
        <button 
          onClick={() => {}}
          className={cn(
            "hidden lg:flex items-center justify-center w-full mt-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors",
            isCollapsed ? 'justify-center' : 'justify-end pr-1'
          )}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", isCollapsed ? 'rotate-180' : '')} />
        </button>
      </div>
    </div>
  );
}