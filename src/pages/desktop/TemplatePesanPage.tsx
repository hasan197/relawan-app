import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { mockTemplates } from '../../lib/mockData';
import { Search, Plus, Copy, MessageSquare, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

type CategoryFilter = 'semua' | 'zakat' | 'infaq' | 'sedekah' | 'wakaf' | 'umum';

interface TemplatePesanPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function TemplatePesanPage({ onNavigate }: TemplatePesanPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('template');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('semua');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'semua' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Template berhasil disalin ke clipboard');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'zakat': return 'bg-blue-100 text-blue-800';
      case 'infaq': return 'bg-green-100 text-green-800';
      case 'sedekah': return 'bg-purple-100 text-purple-800';
      case 'wakaf': return 'bg-orange-100 text-orange-800';
      case 'umum': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'zakat': return 'Zakat';
      case 'infaq': return 'Infaq';
      case 'sedekah': return 'Sedekah';
      case 'wakaf': return 'Wakaf';
      case 'umum': return 'Umum';
      default: return category;
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Template Pesan</h1>
            <p className="text-gray-600 mt-1">Kelola template pesan untuk komunikasi dengan donatur</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Template Baru
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
                    placeholder="Cari template..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {(['semua', 'zakat', 'infaq', 'sedekah', 'wakaf', 'umum'] as CategoryFilter[]).map((category) => (
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Daftar Template ({filteredTemplates.length})</h2>
            
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">{template.title}</h3>
                        <Badge className={getCategoryColor(template.category)}>
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.content.replace(/\n/g, ' ')}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {template.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyTemplate(template.content);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada template yang sesuai dengan filter</p>
              </div>
            )}
          </div>

          {/* Template Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Preview Template</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {mockTemplates.find(t => t.id === selectedTemplate)?.content}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          const template = mockTemplates.find(t => t.id === selectedTemplate);
                          if (template) handleCopyTemplate(template.content);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Salin Template
                      </Button>
                      <Button variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Pilih template untuk melihat preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Import Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Export Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Template Default
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DesktopLayout>
  );
}