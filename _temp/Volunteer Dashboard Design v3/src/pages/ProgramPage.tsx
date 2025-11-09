import { useState } from 'react';
import { ArrowLeft, Share2, ExternalLink } from 'lucide-react';
import { mockPrograms } from '../lib/mockData';
import { Program } from '../types';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface ProgramPageProps {
  onBack?: () => void;
}

export function ProgramPage({ onBack }: ProgramPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'semua' | Program['category']>('semua');

  const filteredPrograms = mockPrograms.filter(program => {
    const matchesCategory = selectedCategory === 'semua' || program.category === selectedCategory;
    return matchesCategory && program.isActive;
  });

  const getCategoryBadge = (category: Program['category']) => {
    const variants = {
      'zakat': 'bg-green-100 text-green-700',
      'infaq': 'bg-yellow-100 text-yellow-700',
      'sedekah': 'bg-blue-100 text-blue-700',
      'wakaf': 'bg-gray-100 text-gray-700'
    };
    return <Badge className={`${variants[category]} border-none capitalize`}>{category}</Badge>;
  };

  const handleShare = (program: Program) => {
    const shareText = `${program.title}\n\n${program.description}\n\nTarget: ${formatCurrency(program.targetAmount)}\nTerkumpul: ${formatCurrency(program.currentAmount)}\n\nDonasi: ${program.donationLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: program.title,
        text: shareText
      }).then(() => {
        toast.success('Berhasil membagikan program!');
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        toast.success('Link berhasil disalin!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Link berhasil disalin!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Program Zakat</h2>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Category Filter */}
        <Card className="p-4 mb-4 shadow-card">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['semua', 'zakat', 'infaq', 'sedekah', 'wakaf'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as typeof selectedCategory)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        {/* Program List */}
        <div className="space-y-4 pb-6">
          {filteredPrograms.map((program) => {
            const progress = (program.currentAmount / program.targetAmount) * 100;
            
            return (
              <Card key={program.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={program.imageUrl}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {getCategoryBadge(program.category)}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Terkumpul</span>
                      <span className="text-gray-900">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600">
                        {formatCurrency(program.currentAmount)}
                      </span>
                      <span className="text-gray-500">
                        dari {formatCurrency(program.targetAmount)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleShare(program)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Bagikan
                    </Button>
                    <Button
                      className="flex-1 bg-primary-600 hover:bg-primary-700"
                      onClick={() => {
                        window.open(program.donationLink, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Donasi
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredPrograms.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada program aktif</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
