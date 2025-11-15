import { useState } from 'react';
import { ArrowLeft, Share2, ExternalLink, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { formatCurrency } from '../lib/utils';
import { usePrograms } from '../hooks/usePrograms';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ProgramCardSkeleton } from '../components/LoadingState';

interface ProgramPageProps {
  onBack?: () => void;
  onNavigate?: (page: string, data?: any) => void;
}

export function ProgramPage({ onBack, onNavigate }: ProgramPageProps) {
  const { programs, loading } = usePrograms();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Program' },
    { id: 'zakat', label: 'Zakat' },
    { id: 'infaq', label: 'Infaq' },
    { id: 'sedekah', label: 'Sedekah' },
    { id: 'wakaf', label: 'Wakaf' }
  ];

  // Filter programs by category
  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter(p => p.category === selectedCategory);

  const handleShareProgram = (program: any) => {
    const message = `🕌 *${program.title}*\n\n${program.description}\n\n📊 Target: ${formatCurrency(program.target || program.target_amount || 0)}\n💰 Terkumpul: ${formatCurrency(program.collected || program.collected_amount || 0)}\n\n${program.url || 'https://ziswaf.app'}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'zakat':
        return 'bg-green-100 text-green-700';
      case 'infaq':
        return 'bg-yellow-100 text-yellow-700';
      case 'sedekah':
        return 'bg-blue-100 text-blue-700';
      case 'wakaf':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h2 className="text-white">Program ZISWAF</h2>
            <p className="text-primary-100 text-sm">
              {loading ? 'Memuat...' : `${programs.length} program tersedia`}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Programs List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <ProgramCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredPrograms.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-2">🕌</div>
            <p className="text-gray-600 mb-1">Belum ada program</p>
            <p className="text-gray-400 text-sm">
              {selectedCategory !== 'all' 
                ? 'Tidak ada program untuk kategori ini'
                : 'Program akan segera hadir'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPrograms.map((program) => {
              const target = program.target || program.target_amount || 0;
              const collected = program.collected || program.collected_amount || 0;
              const progress = target > 0 ? (collected / target) * 100 : 0;

              return (
                <Card 
                  key={program.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onNavigate?.('detail-program', program)}
                >
                  {/* Program Image */}
                  {program.image && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={program.image || program.image_url || ''}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    {/* Category Badge */}
                    <Badge className={`${getCategoryColor(program.category)} border-none mb-2`}>
                      {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
                    </Badge>

                    {/* Title */}
                    <h3 className="text-gray-900 mb-2">{program.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {program.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Terkumpul</span>
                        <span className="text-sm text-gray-900">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2 mb-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-primary-600">
                          {formatCurrency(collected)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          dari {formatCurrency(target)}
                        </span>
                      </div>
                    </div>

                    {/* Contributors */}
                    {program.contributors && (
                      <p className="text-gray-500 text-sm mb-4">
                        👥 {program.contributors.toLocaleString()} donatur
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareProgram(program);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Bagikan
                      </Button>
                      {program.url && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(program.url, '_blank');
                          }}
                          size="sm"
                          className="flex-1 bg-primary-600 hover:bg-primary-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Donasi
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}