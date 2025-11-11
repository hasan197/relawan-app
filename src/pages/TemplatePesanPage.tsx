import { useState } from 'react';
import { ArrowLeft, Search, Copy, Send, Plus, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from 'sonner@2.0.3';
import { useTemplates } from '../hooks/useTemplates';

interface TemplatePesanPageProps {
  onBack?: () => void;
}

export function TemplatePesanPage({ onBack }: TemplatePesanPageProps) {
  const { templates, loading, addTemplate } = useTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    category: 'terima-kasih',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'terima-kasih', label: 'Terima Kasih' },
    { id: 'follow-up', label: 'Follow Up' },
    { id: 'laporan', label: 'Laporan' },
    { id: 'reminder', label: 'Reminder' }
  ];

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Template berhasil disalin!');
  };

  const handleSendTemplate = (template: any) => {
    const message = template.message || template.content || '';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleAddTemplate = async () => {
    if (!newTemplate.title || !newTemplate.content) {
      toast.error('Judul dan isi template harus diisi');
      return;
    }

    try {
      setIsSubmitting(true);
      await addTemplate({
        title: newTemplate.title,
        category: newTemplate.category,
        message: newTemplate.content
      });
      toast.success('Template berhasil ditambahkan!');
      setIsAddDialogOpen(false);
      setNewTemplate({ title: '', category: 'terima-kasih', content: '' });
    } catch (error) {
      toast.error('Gagal menambahkan template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Template Pesan</h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Category Tabs */}
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

        {/* Add Template Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary-600 hover:bg-primary-700 mb-4">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Template Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Template Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Judul Template</Label>
                <Input
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  placeholder="Contoh: Ucapan Terima Kasih"
                />
              </div>
              <div>
                <Label>Kategori</Label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="terima-kasih">Terima Kasih</option>
                  <option value="follow-up">Follow Up</option>
                  <option value="laporan">Laporan</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div>
                <Label>Isi Template</Label>
                <Textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  placeholder="Assalamualaikum..."
                  rows={6}
                />
              </div>
              <Button
                onClick={handleAddTemplate}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Template'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Templates List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-2">📝</div>
            <p className="text-gray-600 mb-1">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Tidak ada template yang cocok' 
                : 'Belum ada template'}
            </p>
            <p className="text-gray-400 text-sm">
              {searchQuery || selectedCategory !== 'all'
                ? 'Coba kata kunci atau kategori lain'
                : 'Tambahkan template baru untuk memudahkan komunikasi'}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{template.title}</h3>
                    <Badge className="bg-primary-100 text-primary-700 border-none text-xs">
                      {categories.find(c => c.id === template.category)?.label || template.category}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">
                  {template.message || template.content || ''}
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCopyTemplate(template.message || template.content || '')}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Salin
                  </Button>
                  <Button
                    onClick={() => handleSendTemplate(template)}
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Kirim WA
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
