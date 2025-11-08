import { useState } from 'react';
import { ArrowLeft, Search, Copy, Send, Plus } from 'lucide-react';
import { mockTemplates } from '../lib/mockData';
import { MessageTemplate } from '../types';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';

interface TemplatePesanPageProps {
  onBack?: () => void;
}

export function TemplatePesanPage({ onBack }: TemplatePesanPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'semua' | MessageTemplate['category']>('semua');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: MessageTemplate['category']) => {
    const variants = {
      'zakat': 'bg-green-100 text-green-700',
      'infaq': 'bg-yellow-100 text-yellow-700',
      'sedekah': 'bg-blue-100 text-blue-700',
      'wakaf': 'bg-gray-100 text-gray-700',
      'umum': 'bg-purple-100 text-purple-700'
    };
    return <Badge className={`${variants[category]} border-none capitalize`}>{category}</Badge>;
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Template berhasil disalin!');
  };

  const handleSend = (content: string) => {
    toast.success('Membuka WhatsApp...');
    console.log('Send via WhatsApp:', content);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Template Pesan</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Category Filter */}
        <Card className="p-4 mb-4 shadow-card">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['semua', 'zakat', 'infaq', 'sedekah', 'wakaf', 'umum'].map((category) => (
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

        {/* Add New Button */}
        <Button className="w-full mb-4 bg-primary-600 hover:bg-primary-700">
          <Plus className="h-4 w-4 mr-2" />
          Buat Template Baru
        </Button>

        {/* Template List */}
        <div className="space-y-3 pb-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTemplate(selectedTemplate?.id === template.id ? null : template)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-gray-900">{template.title}</h4>
                {getCategoryBadge(template.category)}
              </div>
              
              <p className="text-gray-600 mb-3 line-clamp-2">{template.content}</p>
              
              {template.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-gray-600">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {selectedTemplate?.id === template.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{template.content}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(template.content);
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Salin
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSend(template.content);
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Kirim WA
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada template ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
