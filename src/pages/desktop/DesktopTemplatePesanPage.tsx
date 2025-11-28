import { useState } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, MessageSquare, Loader2, DollarSign, Heart, Sparkles, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { copyToClipboard } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import { useTemplates } from '../../hooks/useTemplates';

interface DesktopTemplatePesanPageProps {
  onBack?: () => void;
}

export function DesktopTemplatePesanPage({ onBack }: DesktopTemplatePesanPageProps) {
  const { templates, loading } = useTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleCopy = async (content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      toast.success('Template berhasil disalin!');
    } else {
      toast.error('Gagal menyalin template');
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'zakat': return <DollarSign className="h-4 w-4" />;
      case 'infaq': return <Heart className="h-4 w-4" />;
      case 'sedekah': return <Sparkles className="h-4 w-4" />;
      case 'wakaf': return <Calendar className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Compact */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-gray-900 text-xl">Template Pesan</h1>
              <p className="text-gray-600 text-xs">Kumpulan template pesan untuk fundraising</p>
            </div>
          </div>
        </div>

        {/* Search & Tabs - Compact */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari template..."
              className="pl-10 h-10"
            />
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-shrink-0">
            <TabsList className="grid grid-cols-5 h-10">
              <TabsTrigger value="all" className="text-xs">Semua</TabsTrigger>
              <TabsTrigger value="zakat" className="text-xs">Zakat</TabsTrigger>
              <TabsTrigger value="infaq" className="text-xs">Infaq</TabsTrigger>
              <TabsTrigger value="sedekah" className="text-xs">Sedekah</TabsTrigger>
              <TabsTrigger value="wakaf" className="text-xs">Wakaf</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content - More Compact Grid */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsContent value={selectedCategory} className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {getCategoryIcon(template.category)}
                        </div>
                        <h3 className="text-gray-900 text-sm font-medium truncate">{template.title}</h3>
                      </div>
                      <Badge className="bg-primary-100 text-primary-700 border-none text-xs capitalize ml-2 flex-shrink-0">
                        {template.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-3 line-clamp-3 leading-relaxed">
                      {template.content}
                    </p>
                    
                    <Button 
                      onClick={() => handleCopy(template.content)}
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Salin
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredTemplates.length === 0 && (
              <Card className="p-8 text-center">
                <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Tidak ada template ditemukan</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}