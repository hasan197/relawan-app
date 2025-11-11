import { Card } from './ui/card';
import { 
  Users, 
  MessageSquare, 
  Target, 
  Gift,
  FileText,
  TrendingUp,
  Upload,
  Calendar
} from 'lucide-react';

const quickMenus = [
  { 
    id: 'regu', 
    name: 'Regu Saya', 
    icon: Users, 
    color: 'from-emerald-400 to-emerald-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  { 
    id: 'template', 
    name: 'Template', 
    icon: MessageSquare, 
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  { 
    id: 'program', 
    name: 'Program', 
    icon: Target, 
    color: 'from-purple-400 to-purple-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  { 
    id: 'generator-resi', 
    name: 'Generator Resi', 
    icon: FileText, 
    color: 'from-orange-400 to-orange-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600'
  },
  { 
    id: 'ucapan-terima-kasih', 
    name: 'Ucapan', 
    icon: Gift, 
    color: 'from-pink-400 to-pink-500',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600'
  },
  { 
    id: 'riwayat-aktivitas', 
    name: 'Riwayat', 
    icon: TrendingUp, 
    color: 'from-cyan-400 to-cyan-500',
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-600'
  },
  { 
    id: 'import-kontak', 
    name: 'Import Kontak', 
    icon: Upload, 
    color: 'from-indigo-400 to-indigo-500',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600'
  },
  { 
    id: 'reminder-follow-up', 
    name: 'Reminder', 
    icon: Calendar, 
    color: 'from-yellow-400 to-yellow-500',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600'
  },
];

interface QuickMenuCardsProps {
  onMenuClick?: (menuId: string) => void;
}

export function QuickMenuCards({ onMenuClick }: QuickMenuCardsProps) {
  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">Menu Cepat</h3>
        <span className="text-xs text-gray-500">Akses Mudah</span>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {quickMenus.map((menu) => {
          const Icon = menu.icon;
          return (
            <button
              key={menu.id}
              onClick={() => onMenuClick?.(menu.id)}
              className="flex flex-col items-center group"
            >
              <div className={`${menu.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon className={`w-6 h-6 ${menu.iconColor}`} />
              </div>
              <p className="text-xs text-gray-700 text-center leading-tight line-clamp-2">
                {menu.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
