import { ArrowLeft, Bell, TrendingUp, LucideIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface HeaderWithBackProps {
  onBack?: () => void;
  onNotificationClick?: () => void;
  onStatsClick?: () => void;
  pageName?: string;
  subtitle?: string;
  rightIcon?: LucideIcon;
  sticky?: boolean;
  customPadding?: string;
}

export function HeaderWithBack({ onBack, onNotificationClick, onStatsClick, pageName, subtitle, rightIcon: RightIcon, sticky, customPadding }: HeaderWithBackProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Default behavior: go to previous page in app navigation history
      // Use event system to communicate with App.tsx
      const event = new CustomEvent('goBackInApp');
      window.dispatchEvent(event);
    }
  };

  // Determine if we should show the right actions (stats/notification)
  const showRightActions = onStatsClick || onNotificationClick;
  const showRightIcon = RightIcon;

  return (
    <div className={`bg-gradient-to-r from-primary-500 to-primary-600 ${customPadding || 'px-4 py-4'} rounded-b-3xl shadow-lg ${sticky ? 'sticky top-0 z-10' : ''}`}>
      <div className="flex items-start justify-between mb-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h2 className="text-white mb-1">{pageName || 'Page'}</h2>
            {subtitle && <p className="text-primary-100 text-sm">{subtitle}</p>}
          </div>
        </div>

        {showRightIcon && !showRightActions && (
          <div className="p-2 bg-white/20 rounded-full">
            <RightIcon className="h-5 w-5 text-white opacity-80" />
          </div>
        )}

        {showRightActions && (
          <div className="flex items-center gap-2">
            {onStatsClick && (
              <button
                onClick={onStatsClick}
                className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-white" />
              </button>
            )}
            {onNotificationClick && (
              <button
                onClick={onNotificationClick}
                className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Bell className="h-5 w-5 text-white" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-2 border-primary-500">
                  3
                </Badge>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
