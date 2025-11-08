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
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary-700 text-white">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-primary-50">Hi, {currentUser.name} 👋</p>
            <p className="text-white mt-0.5">{currentUser.reguName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onStatsClick}
            className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <TrendingUp className="h-5 w-5 text-white" />
          </button>
          <button 
            onClick={onNotificationClick}
            className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <Bell className="h-5 w-5 text-white" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-2 border-primary-500">
              3
            </Badge>
          </button>
        </div>
      </div>
    </div>
  );
}