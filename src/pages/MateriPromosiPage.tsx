import { useState } from 'react';
import { ArrowLeft, Download, Share2, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface MateriPromosiPageProps {
  onBack?: () => void;
}

interface Material {
  id: string;
  type: 'image' | 'video' | 'text';
  title: string;
  description: string;
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf' | 'umum';
  url: string;
  thumbnail?: string;
  caption?: string;
}

export function MateriPromosiPage({ onBack }: MateriPromosiPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'semua' | Material['category']>('semua');

  const materials: Material[] = [
    {
      id: '1',
      type: 'image',
      title: 'Infografis Zakat Fitrah',
      description: 'Panduan lengkap zakat fitrah dan cara perhitungannya',
      category: 'zakat',
      url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800',
      caption: 'Tunaikan zakat fitrah Anda sebelum Idul Fitri. Besaran: 3,5 liter/2,5 kg beras atau senilai uang.'
    },
    {
      id: '2',
      type: 'image',
      title: 'Poster Infaq Masjid',
      description: 'Ajakan berinfaq untuk pembangunan masjid',
      category: 'infaq',
      url: 'https://images.unsplash.com/photo-1564769610726-4b3b8b8b8b8b?w=800',
      caption: 'Mari berkontribusi membangun rumah Allah. Setiap rupiah Anda sangat berarti.'
    },
    {
      id: '3',
      type: 'image',
      title: 'Kampanye Sedekah Pangan',
      description: 'Program berbagi sembako untuk keluarga dhuafa',
      category: 'sedekah',
      url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
      caption: 'Berbagi kebahagiaan dengan paket sembako. Bantu saudara kita yang membutuhkan.'
    },
    {
      id: '4',
      type: 'image',
      title: 'Wakaf Produktif',
      description: 'Informasi program wakaf untuk pendidikan',
      category: 'wakaf',
      url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
      caption: 'Wakaf produktif untuk pendidikan anak yatim. Pahala mengalir hingga akhirat.'
    },
    {
      id: '5',
      type: 'text',
      title: 'Caption Ramadhan',
      description: 'Kumpulan caption untuk bulan Ramadhan',
      category: 'umum',
      url: '',
      caption: '🌙 Ramadhan Mubarak! Mari perbanyak amal shalih dan berbagi kebaikan di bulan penuh berkah ini. #RamadhanKareem #BerbagiBerkah'
    },
    {
      id: '6',
      type: 'text',
      title: 'Caption Ajakan Zakat',
      description: 'Template caption untuk ajakan zakat',
      category: 'zakat',
      url: '',
      caption: '💰 Sudahkah Anda menunaikan zakat? Mari bersihkan harta dengan zakat dan raih keberkahan. Info: [link donasi] #ZakatBerkah'
    }
  ];

  const filteredMaterials = materials.filter(material => {
    if (selectedCategory === 'semua') return true;
    return material.category === selectedCategory;
  });

  const handleDownload = (material: Material) => {
    toast.success(`Mengunduh ${material.title}...`);
    // In real app, trigger download
  };

  const handleShare = (material: Material) => {
    const shareText = material.caption || material.description;
    
    if (navigator.share) {
      navigator.share({
        title: material.title,
        text: shareText,
        url: material.url || window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${material.title}\n\n${shareText}${material.url ? '\n\n' + material.url : ''}`);
      toast.success('Konten berhasil disalin ke clipboard');
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      zakat: 'Zakat',
      infaq: 'Infaq',
      sedekah: 'Sedekah',
      wakaf: 'Wakaf',
      umum: 'Umum'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      zakat: 'bg-yellow-100 text-yellow-800',
      infaq: 'bg-blue-100 text-blue-800',
      sedekah: 'bg-green-100 text-green-800',
      wakaf: 'bg-purple-100 text-purple-800',
      umum: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
          <h2 className="text-white">Materi Promosi</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        <Tabs defaultValue="semua" className="mb-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-white p-1 rounded-xl border border-gray-200 w-max">
              <TabsTrigger 
                value="semua" 
                className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 rounded-lg px-4 py-2 text-sm font-medium"
                onClick={() => setSelectedCategory('semua')}
              >
                Semua
              </TabsTrigger>
              {['zakat', 'infaq', 'sedekah', 'wakaf', 'umum'].map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 rounded-lg px-4 py-2 text-sm font-medium"
                  onClick={() => setSelectedCategory(category as Material['category'])}
                >
                  {getCategoryLabel(category)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="space-y-4">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="overflow-hidden">
              {material.type === 'image' && material.url && (
                <div className="relative h-48">
                  <ImageWithFallback
                    src={material.url}
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-900 font-medium">{material.title}</h3>
                  <Badge className={`text-xs ${getCategoryColor(material.category)}`}>
                    {getCategoryLabel(material.category)}
                  </Badge>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{material.description}</p>
                
                {material.caption && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-gray-700 text-sm whitespace-pre-line">{material.caption}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload(material)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Unduh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleShare(material)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredMaterials.length === 0 && (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">Tidak ada materi</h3>
              <p className="text-gray-500 text-sm">Tidak ada materi yang tersedia untuk kategori ini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
