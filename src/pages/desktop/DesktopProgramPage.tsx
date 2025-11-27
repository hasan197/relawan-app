import { useState } from 'react';
import { Search, Filter, Calendar, Users, TrendingUp, Target, ArrowRight, MapPin } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { DesktopTopbar } from '../../components/desktop/DesktopTopbar';
import { formatCurrency } from '../../lib/utils';
import { usePrograms } from '../../hooks/usePrograms';

interface DesktopProgramPageProps {
  onNavigate?: (page: string) => void;
}

export function DesktopProgramPage({ onNavigate }: DesktopProgramPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'zakat' | 'infaq' | 'sedekah' | 'wakaf'>('all');
  const { programs: apiPrograms, loading } = usePrograms();

  // Use only API data from backend
  const programs = apiPrograms;

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || program.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryColors = {
    zakat: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    infaq: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    sedekah: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    wakaf: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' }
  };

  const stats = [
    { label: 'Total Program', value: programs.length.toString(), icon: Target },
    { label: 'Total Terkumpul', value: formatCurrency(programs.reduce((sum, p) => sum + p.collected, 0)), icon: TrendingUp },
    { label: 'Total Donatur', value: programs.reduce((sum, p) => sum + p.contributors, 0).toString(), icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopTopbar 
        title="Program ZISWAF" 
        subtitle={`${programs.length} program aktif`}
        onNavigate={onNavigate}
      />

      <div className="p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'zakat', 'infaq', 'sedekah', 'wakaf'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    categoryFilter === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'Semua' : category}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Programs Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredPrograms.map((program) => {
            const progress = (program.collected / program.target) * 100;
            const colors = categoryColors[program.category as keyof typeof categoryColors];
            const daysLeft = Math.ceil((new Date(program.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${colors.bg} ${colors.text} border-none capitalize`}>
                      {program.category}
                    </Badge>
                  </div>
                  {daysLeft <= 30 && daysLeft > 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-100 text-red-700 border-none">
                        {daysLeft} hari lagi
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-500 mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{program.location}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Terkumpul</span>
                      <span className="text-green-600">{formatCurrency(program.collected)}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">
                        {progress.toFixed(1)}% dari {formatCurrency(program.target)}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {program.contributors}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => onNavigate?.('detail-program')}
                    className="w-full bg-primary-600 hover:bg-primary-700 gap-2"
                  >
                    Lihat Detail
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPrograms.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">Tidak ada program yang sesuai</h3>
              <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}