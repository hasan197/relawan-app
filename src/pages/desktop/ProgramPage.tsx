import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { mockPrograms } from '../../lib/mockData';
import { Search, Filter, Heart, Target, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

type CategoryFilter = 'semua' | 'zakat' | 'infaq' | 'sedekah' | 'wakaf';

interface ProgramPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function ProgramPage({ onNavigate }: ProgramPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('template');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('semua');

  const filteredPrograms = mockPrograms.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'semua' || program.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'zakat': return 'bg-blue-100 text-blue-800';
      case 'infaq': return 'bg-green-100 text-green-800';
      case 'sedekah': return 'bg-purple-100 text-purple-800';
      case 'wakaf': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'zakat': return 'Zakat';
      case 'infaq': return 'Infaq';
      case 'sedekah': return 'Sedekah';
      case 'wakaf': return 'Wakaf';
      default: return category;
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  return (
    <DesktopLayout
      activeNav={activeNav}
      onNavigate={(page) => {
        setActiveNav(page);
        onNavigate?.(page);
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Program Donasi</h1>
            <p className="text-gray-600 mt-1">Kelola dan promosikan program donasi</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Program Baru
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari program..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {(['semua', 'zakat', 'infaq', 'sedekah', 'wakaf'] as CategoryFilter[]).map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? 'default' : 'outline'}
                    onClick={() => setCategoryFilter(category)}
                    className="capitalize"
                  >
                    {category === 'semua' ? 'Semua' : getCategoryLabel(category)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Program</p>
                  <p className="text-2xl font-bold text-gray-900">{mockPrograms.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Program Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockPrograms.filter(p => p.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Terkumpul</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(mockPrograms.reduce((sum, p) => sum + p.currentAmount, 0))}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Target Keseluruhan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(mockPrograms.reduce((sum, p) => sum + p.targetAmount, 0))}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={program.imageUrl}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={getCategoryColor(program.category)}>
                    {getCategoryLabel(program.category)}
                  </Badge>
                </div>
                {program.isActive && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {program.description}
                </p>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {formatCurrency(program.currentAmount)} / {formatCurrency(program.targetAmount)}
                    </span>
                  </div>
                  <Progress 
                    value={calculateProgress(program.currentAmount, program.targetAmount)} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {calculateProgress(program.currentAmount, program.targetAmount).toFixed(1)}%
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    Donasi
                  </Button>
                  <Button variant="outline">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPrograms.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada program yang sesuai dengan filter</p>
            </div>
          )}
        </div>
      </div>
    </DesktopLayout>
  );
}

// Import additional icons
import { Plus } from 'lucide-react';