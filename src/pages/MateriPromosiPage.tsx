import { useState } from 'react';
import { ArrowLeft, Download, Share2, Image as ImageIcon, Video, FileText, Copy } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../lib/utils';

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
        url: material.url
      }).then(() => {
        toast.success('Berhasil membagikan materi!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Caption disalin ke clipboard!');
    }
  };

  const handleCopyCaption = (caption: string) => {
    copyToClipboard(caption);
    toast.success('Caption berhasil disalin!');
  };

  const getCategoryBadge = (category: Material['category']) => {
    const variants = {
      'zakat': 'bg-green-100 text-green-700',
      'infaq': 'bg-yellow-100 text-yellow-700',
      'sedekah': 'bg-blue-100 text-blue-700',
      'wakaf': 'bg-gray-100 text-gray-700',
      'umum': 'bg-purple-100 text-purple-700'
    };
    return <Badge className={`${variants[category]} border-none capitalize`}>{category}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
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
        {/* Category Filter */}
        <Card className="p-4 mb-4 shadow-card">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['semua', 'zakat', 'infaq', 'sedekah', 'wakaf', 'umum'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
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

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="images">Gambar</TabsTrigger>
            <TabsTrigger value="captions">Caption</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="overflow-hidden">
                {material.type === 'image' && material.url && (
                  <div className="relative h-32">
                    <ImageWithFallback
                      src={material.url}
                      alt={material.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getCategoryBadge(material.category)}
                    </div>
                  </div>
                )}

                <div className="p-3">
                  <div className="flex items-start gap-1.5 mb-2">
                    {material.type === 'image' && <ImageIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />}
                    {material.type === 'video' && <Video className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />}
                    {material.type === 'text' && <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 text-sm font-medium mb-0.5 line-clamp-2">{material.title}</h4>
                      <p className="text-gray-600 text-xs line-clamp-1">{material.description}</p>
                    </div>
                  </div>

                  {material.caption && (
                    <div className="mb-2 p-2 bg-gray-50 rounded text-gray-700 text-xs line-clamp-2">
                      {material.caption}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    {material.type === 'image' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-7 text-xs"
                        onClick={() => handleDownload(material)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Unduh
                      </Button>
                    )}
                    
                    {material.caption && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-7 text-xs"
                        onClick={() => handleCopyCaption(material.caption!)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Salin
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      className="w-full h-7 text-xs bg-primary-600 hover:bg-primary-700"
                      onClick={() => handleShare(material)}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Bagikan
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="images" className="grid grid-cols-2 gap-3">
            {filteredMaterials.filter(m => m.type === 'image').map((material) => (
              <Card key={material.id} className="overflow-hidden">
                <div className="relative h-32">
                  <ImageWithFallback
                    src={material.url}
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getCategoryBadge(material.category)}
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="text-gray-900 text-sm font-medium mb-2 line-clamp-2">{material.title}</h4>
                  {material.caption && (
                    <div className="mb-2 p-2 bg-gray-50 rounded text-gray-700 text-xs line-clamp-2">
                      {material.caption}
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs"
                      onClick={() => handleDownload(material)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Unduh
                    </Button>
                    <Button
                      size="sm"
                      className="w-full h-7 text-xs bg-primary-600 hover:bg-primary-700"
                      onClick={() => handleShare(material)}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Bagikan
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="captions" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredMaterials.filter(m => m.type === 'text').map((material) => (
              <Card key={material.id} className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-gray-900 text-sm font-medium line-clamp-2 flex-1">{material.title}</h4>
                  {getCategoryBadge(material.category)}
                </div>
                <div className="p-2 bg-gray-50 rounded mb-2">
                  <p className="text-gray-700 text-xs line-clamp-3">{material.caption}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-xs"
                    onClick={() => handleCopyCaption(material.caption!)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Salin
                  </Button>
                  <Button
                    size="sm"
                    className="w-full h-7 text-xs bg-primary-600 hover:bg-primary-700"
                    onClick={() => handleShare(material)}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Bagikan
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}