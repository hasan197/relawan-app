import { Bell, TrendingUp } from 'lucide-react';
import { currentUser } from '../lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getInitials } from '../lib/utils';
import { Badge } from './ui/badge';

interface HeaderProps {
  onNotificationClick?: () => void;
  onStatsClick?: () => void;
}

export function Header({ onNotificationClick, onStatsClick }: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-4 rounded-b-2xl shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary-600 text-white text-sm">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-primary-50 text-sm">Hi, {currentUser.name.split(' ')[0]} 👋</p>
            <p className="text-white/90 text-xs">{currentUser.reguName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={onStatsClick}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Statistik"
          >
            <TrendingUp className="h-5 w-5 text-white" />
          </button>
          <button 
            onClick={onNotificationClick}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors relative"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5 text-white" />
            <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 bg-red-500 text-[10px] text-white border border-white">
              3
            </Badge>
          </button>
        </div>
      </div>
    </div>
  );
}