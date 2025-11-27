import { useState } from 'react';
import { ArrowLeft, Search, Copy, CheckCircle2, MessageSquare, Loader2, DollarSign, Heart, Sparkles, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { copyToClipboard } from '../../lib/utils';
import { toast } from 'sonner';
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
                         template.message.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-gray-900">Template Pesan</h1>
                <p className="text-gray-600 text-sm">Kumpulan template pesan untuk fundraising</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari template..."
              className="pl-10"
            />
          </div>
        </Card>

        {/* Content */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-6">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="zakat">Zakat</TabsTrigger>
            <TabsTrigger value="infaq">Infaq</TabsTrigger>
            <TabsTrigger value="sedekah">Sedekah</TabsTrigger>
            <TabsTrigger value="wakaf">Wakaf</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                        <h3 className="text-gray-900 font-medium">{template.title}</h3>
                      </div>
                      <Badge className="bg-primary-100 text-primary-700 border-none text-xs capitalize">
                        {template.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-4 leading-relaxed">
                      {template.message}
                    </p>
                    
                    <Button 
                      onClick={() => handleCopy(template.message)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Salin Template
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredTemplates.length === 0 && (
              <Card className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada template ditemukan</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}