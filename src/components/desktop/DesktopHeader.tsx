import { useState } from 'react';
import { Bell, BarChart3, Menu, Search, Menu as MenuIcon, X, TrendingUp } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '../../lib/utils';
import { currentUser } from '../../lib/mockData';
import { cn } from '../../lib/utils';

interface DesktopHeaderProps {
  onNotificationClick?: () => void;
  onStatsClick?: () => void;
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
  isSidebarOpen?: boolean;
}

export function DesktopHeader({ 
  onNotificationClick, 
  onStatsClick, 
  onMenuClick,
  onSearch,
  isSidebarOpen = true
}: DesktopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left section - Menu button and search */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={onMenuClick}
            title={isSidebarOpen ? 'Sembunyikan menu' : 'Tampilkan menu'}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
          
          <form 
            onSubmit={handleSearch} 
            className={cn(
              "relative transition-all duration-300",
              isSearchFocused ? 'w-80' : 'w-64'
            )}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Cari donatur, program, atau laporan..."
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-0 focus-visible:ring-2 focus-visible:ring-primary-500 transition-all duration-300",
                isSearchFocused ? 'bg-white shadow-sm ring-1 ring-gray-300' : ''
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </form>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onStatsClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <TrendingUp className="h-5 w-5 text-gray-600" />
          </button>
          
          <button 
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-2 border-white">
              3
            </Badge>
          </button>
        </div>
      </div>
    </header>
  );
}