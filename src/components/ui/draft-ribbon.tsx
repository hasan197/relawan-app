interface DraftRibbonProps {
  text?: string;
  color?: 'red' | 'orange' | 'yellow' | 'blue' | 'green';
  position?: 'top-right' | 'top-left';
}

export function DraftRibbon({ 
  text = 'DRAFT', 
  color = 'red',
  position = 'top-right' 
}: DraftRibbonProps) {
  const colorClasses = {
    red: 'bg-red-600',
    orange: 'bg-orange-600',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-600',
    green: 'bg-green-600'
  };

  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0'
  };

  const ribbonClasses = {
    'top-right': 'top-2 -right-10 rotate-45',
    'top-left': 'top-2 -left-10 rotate-45'
  };

  return (
    <div className={`fixed ${positionClasses[position]} w-32 h-32 overflow-hidden pointer-events-none z-50`}>
      <div 
        className={`absolute ${ribbonClasses[position]} w-40 ${colorClasses[color]} text-white text-center py-2 shadow-lg`}
        style={{
          transform: position === 'top-left' ? 'rotate(-45deg)' : 'rotate(45deg)'
        }}
      >
        <span className="font-semibold tracking-wider text-sm">{text}</span>
      </div>
    </div>
  );
}
