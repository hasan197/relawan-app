import { Card } from './ui/card';

const categories = [
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
      <h3 className="text-gray-900 mb-4">Kategori ZISWAF</h3>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick?.(category.id)}
            className="flex-shrink-0"
          >
            <Card className={`bg-gradient-to-br ${category.color} border-none shadow-md hover:shadow-lg transition-shadow w-32 p-4`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{category.icon}</div>
                <p className={`${category.textColor}`}>{category.name}</p>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
