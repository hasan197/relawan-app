import { useState } from 'react';
import { ArrowLeft, Download, Share2, Image as ImageIcon, Video, FileText, Copy } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { copyToClipboard } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';

interface DesktopMateriPromosiPageProps {
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

export function DesktopMateriPromosiPage({ onBack }: DesktopMateriPromosiPageProps) {
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
      copyToClipboard(shareText).then(success => {
        if (success) toast.success('Caption disalin ke clipboard!');
      });
    }
  };

  const handleCopyCaption = async (caption: string) => {
    const success = await copyToClipboard(caption);
    if (success) {
      toast.success('Caption berhasil disalin!');
    } else {
      toast.error('Gagal menyalin caption');
    }
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
      {/* Desktop Header - Compact */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl">Materi Promosi</h1>
            <p className="text-primary-100 text-xs">
              {filteredMaterials.length} materi tersedia
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Category Filter - Compact */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(['semua', 'zakat', 'infaq', 'sedekah', 'wakaf', 'umum'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all text-sm whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-xl grid grid-cols-3 mb-4 h-9">
            <TabsTrigger value="all" className="text-xs">Semua</TabsTrigger>
            <TabsTrigger value="images" className="text-xs">Gambar</TabsTrigger>
            <TabsTrigger value="captions" className="text-xs">Caption</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-4 gap-3">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    <div className="flex items-start gap-2 mb-2">
                      {material.type === 'image' && <ImageIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />}
                      {material.type === 'video' && <Video className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />}
                      {material.type === 'text' && <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 text-sm font-medium truncate">{material.title}</h4>
                        <p className="text-gray-600 text-xs line-clamp-1">{material.description}</p>
                      </div>
                    </div>

                    {material.caption && (
                      <div className="mb-2 p-2 bg-gray-50 rounded text-gray-700 text-xs line-clamp-2">
                        {material.caption}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-1.5">
                      {material.type === 'image' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleDownload(material)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Unduh
                        </Button>
                      )}
                      
                      {material.caption && material.type !== 'image' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleCopyCaption(material.caption!)}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Salin
                        </Button>
                      )}
                      
                      <Button
                        className={`bg-primary-600 hover:bg-primary-700 h-7 text-xs ${material.type === 'image' ? '' : 'col-span-2'}`}
                        size="sm"
                        onClick={() => handleShare(material)}
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Bagikan
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="grid grid-cols-4 gap-3">
              {filteredMaterials.filter(m => m.type === 'image').map((material) => (
                <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    <h4 className="text-gray-900 text-sm mb-2 truncate">{material.title}</h4>
                    {material.caption && (
                      <div className="mb-2 p-2 bg-gray-50 rounded text-gray-700 text-xs line-clamp-2">
                        {material.caption}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleDownload(material)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Unduh
                      </Button>
                      <Button
                        className="bg-primary-600 hover:bg-primary-700 h-7 text-xs"
                        size="sm"
                        onClick={() => handleShare(material)}
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Bagikan
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="captions">
            <div className="grid grid-cols-3 gap-3">
              {filteredMaterials.filter(m => m.type === 'text').map((material) => (
                <Card key={material.id} className="p-3 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                      <h4 className="text-gray-900 text-sm">{material.title}</h4>
                    </div>
                    {getCategoryBadge(material.category)}
                  </div>
                  
                  <div className="p-2 bg-gray-50 rounded mb-2">
                    <p className="text-gray-700 text-xs line-clamp-3">{material.caption}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleCopyCaption(material.caption!)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Salin
                    </Button>
                    <Button
                      className="bg-primary-600 hover:bg-primary-700 h-7 text-xs"
                      size="sm"
                      onClick={() => handleShare(material)}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Bagikan
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}