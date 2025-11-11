import { Search, Bell, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { getInitials } from '../../lib/utils';

interface DesktopTopbarProps {
  title: string;
  subtitle?: string;
  onNavigate?: (page: string) => void;
}

export function DesktopTopbar({ title, subtitle, onNavigate }: DesktopTopbarProps) {
  const { user } = useAppContext();

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h1 className="text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari muzakki, donasi, atau program..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Quick Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('test-connection')}
            className="gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Test DB
          </Button>

          {/* Notifications */}
          <button 
            onClick={() => onNavigate?.('notifikasi')}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button 
            onClick={() => onNavigate?.('pengaturan')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          {/* User Menu */}
          <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name}`} />
              <AvatarFallback className="bg-primary-600 text-white">
                {getInitials(user?.full_name || 'User')}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
