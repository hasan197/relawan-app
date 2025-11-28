import { ArrowLeft, Share2, ExternalLink, Calendar, Target, Users, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { formatCurrency, copyToClipboard } from '../lib/utils';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { useSingleProgram } from '../hooks/usePrograms.tsx';

interface DetailProgramPageProps {
  programId?: string;
  onBack?: () => void;
}

export function DetailProgramPage({ programId, onBack }: DetailProgramPageProps) {
  const { program, loading } = useSingleProgram(programId || null);

  const progress = program ? (program.collected / program.target) * 100 : 0;
  const daysLeft = program ? Math.ceil((new Date(program.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const handleShare = async () => {
    if (!program) return;

    const shareText = `${program.title}\n\n${program.description}\n\nTarget: ${formatCurrency(program.target)}\nTerkumpul: ${formatCurrency(program.collected)}\n\nLihat detail program ini di aplikasi ZISWAF Manager`;
    
    if (navigator.share) {
      navigator.share({
        title: program.title,
        text: shareText
      }).then(() => {
        toast.success('Berhasil membagikan program!');
      }).catch(async () => {
        // User cancelled share or error occurred
        const success = await copyToClipboard(shareText);
        if (success) toast.success('Link berhasil disalin!');
      });
    } else {
      const success = await copyToClipboard(shareText);
      if (success) toast.success('Teks program berhasil disalin!');
    }
  };

  const handleOpenLink = () => {
    toast.success('Membuka link donasi...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail program...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h2 className="text-white">Detail Program</h2>
          </div>
        </div>
        <div className="px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-gray-600">Program tidak ditemukan</p>
          </Card>
        </div>
      </div>
    );
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      zakat: 'bg-green-100 text-green-700',
      infaq: 'bg-blue-100 text-blue-700',
      sedekah: 'bg-yellow-100 text-yellow-700',
      wakaf: 'bg-purple-100 text-purple-700'
    };
    return (
      <Badge className={`${variants[category as keyof typeof variants] || 'bg-gray-100 text-gray-700'} border-none capitalize`}>
        {category}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Detail Program</h2>
        </div>
      </div>

      <div className="px-4 -mt-2 pb-6">
        {/* Hero Image */}
        <div className="mb-4 -mx-4 px-4">
          <ImageWithFallback
            src={program.image}
            alt={program.title}
            className="w-full h-48 object-cover rounded-2xl"
          />
        </div>

        {/* Title & Category */}
        <Card className="p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-gray-900 mb-2">{program.title}</h3>
              {getCategoryBadge(program.category)}
            </div>
            <Button
              onClick={handleShare}
              size="sm"
              variant="outline"
              className="ml-2"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-600 text-sm">{program.description}</p>
        </Card>

        {/* Progress Card */}
        <Card className="p-4 mb-4">
          <div className="mb-4">
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="text-gray-500 text-sm">Terkumpul</p>
                <p className="text-2xl text-primary-600">{formatCurrency(program.collected)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Target</p>
                <p className="text-gray-900">{formatCurrency(program.target)}</p>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-gray-500 text-sm mt-2">{progress.toFixed(1)}% tercapai</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Donatur</p>
                <p className="text-gray-900 font-semibold">{program.contributors}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Sisa Waktu</p>
                <p className="text-gray-900 font-semibold">{daysLeft > 0 ? `${daysLeft} hari` : 'Berakhir'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Location & Organizer */}
        <Card className="p-4 mb-4">
          <h4 className="text-gray-900 mb-3">Informasi Program</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Target className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Lokasi</p>
                <p className="text-gray-900">{program.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Berakhir pada</p>
                <p className="text-gray-900">{new Date(program.endDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-4 mb-4">
          <h4 className="text-gray-900 mb-3">Deskripsi Lengkap</h4>
          <div className="prose prose-sm max-w-none text-gray-700">
            <p>{program.description}</p>
          </div>
        </Card>

        {/* CTA Button */}
        <Button
          onClick={handleOpenLink}
          className="w-full bg-primary-600 hover:bg-primary-700"
          size="lg"
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          Donasi Sekarang
        </Button>
      </div>
    </div>
  );
}