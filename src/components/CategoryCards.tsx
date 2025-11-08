import { Card } from './ui/card';

const categories = [
  { 
    id: 'regu', 
    name: 'Regu Saya', 
    icon: '👥', 
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-900'
  },
  { 
    id: 'template', 
    name: 'Template Pesan', 
    icon: '✉️', 
    color: 'from-pink-500 to-pink-600',
    textColor: 'text-pink-900'
  },
  { 
    id: 'zakat', 
    name: 'Zakat', 
    icon: '💰', 
    color: 'from-emerald-500 to-emerald-600',
    textColor: 'text-emerald-900'
  },
  { 
    id: 'infaq', 
    name: 'Infaq', 
    icon: '🕋', 
    color: 'from-yellow-400 to-yellow-500',
    textColor: 'text-yellow-900'
  },
  { 
    id: 'sedekah', 
    name: 'Sedekah', 
    icon: '❤️', 
    color: 'from-sky-400 to-sky-500',
    textColor: 'text-sky-900'
  },
  { 
    id: 'wakaf', 
    name: 'Wakaf', 
    icon: '🌿', 
    color: 'from-slate-400 to-slate-500',
    textColor: 'text-slate-900'
  },
];

interface CategoryCardsProps {
  onCategoryClick?: (categoryId: string) => void;
}

export function CategoryCards({ onCategoryClick }: CategoryCardsProps) {
  return (
    <div className="px-4 mb-6">
      <h3 className="text-gray-900 mb-4">Shortcut</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {categories.slice(0, 4).map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick?.(category.id)}
            className="w-full"
          >
            <Card className={`bg-gradient-to-br ${category.color} border-none shadow-md hover:shadow-lg transition-shadow w-full p-4`}>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-4xl mb-2">{category.icon}</div>
                <p className={`text-sm font-medium ${category.textColor} text-center`}>{category.name}</p>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
