import { ArrowLeft, Share2, ExternalLink, Calendar, Target, Users, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { formatCurrency, copyToClipboard } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import { useSingleProgram } from '../../hooks/usePrograms.tsx';

interface DesktopDetailProgramPageProps {
  programId?: string;
  onBack?: () => void;
}

export function DesktopDetailProgramPage({ programId, onBack }: DesktopDetailProgramPageProps) {
  const { program, loading } = useSingleProgram(programId || null);

  const progress = program ? (program.collected / program.target) * 100 : 0;
  const daysLeft = program ? Math.ceil((new Date(program.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const handleShare = (programId: string) => {
    const shareText = `Lihat program ${program.name} - ${program.description}. Target: Rp ${program.target.toLocaleString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: program.name,
        text: shareText,
        url: window.location.href
      }).then(() => {
        toast.success('Berhasil membagikan program!');
      }).catch(async () => {
        const success = await copyToClipboard(shareText);
        if (success) toast.success('Link berhasil disalin!');
      });
    } else {
      copyToClipboard(shareText).then(success => {
        if (success) toast.success('Teks program berhasil disalin!');
      });
    }
  };

  const handleOpenLink = () => {
    toast.success('Membuka link donasi...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail program...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-gray-900">Detail Program</h1>
            </div>
          </div>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
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
                <h1 className="text-gray-900">Detail Program</h1>
                <p className="text-gray-600 text-sm">Informasi lengkap program ZISWAF</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => handleShare(programId || '')} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Bagikan
              </Button>
              <Button onClick={handleOpenLink} size="sm" className="bg-primary-600 hover:bg-primary-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                Donasi Sekarang
              </Button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Hero & Description */}
          <div className="col-span-2 space-y-4">
            {/* Hero Image */}
            <Card className="overflow-hidden">
              <ImageWithFallback
                src={program.image}
                alt={program.title}
                className="w-full h-64 object-cover"
              />
            </Card>

            {/* Title & Description */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-gray-900 mb-2">{program.title}</h2>
                  {getCategoryBadge(program.category)}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>
            </Card>

            {/* Full Description */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-3">Deskripsi Lengkap</h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p className="leading-relaxed">{program.description}</p>
              </div>
            </Card>
          </div>

          {/* Right Column - Progress & Info */}
          <div className="col-span-1 space-y-4">
            {/* Progress Card */}
            <Card className="p-5">
              <div className="mb-5">
                <p className="text-gray-500 text-xs mb-1">Terkumpul</p>
                <p className="text-2xl text-primary-600 mb-3">{formatCurrency(program.collected)}</p>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{progress.toFixed(1)}% tercapai</span>
                  <span className="text-gray-900">{formatCurrency(program.target)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Donatur</p>
                    <p className="text-gray-900 text-sm font-semibold">{program.contributors}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Sisa Waktu</p>
                    <p className="text-gray-900 text-sm font-semibold">{daysLeft > 0 ? `${daysLeft} hari` : 'Berakhir'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Information Card */}
            <Card className="p-5">
              <h4 className="text-gray-900 text-sm font-semibold mb-4">Informasi Program</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Target className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Lokasi</p>
                    <p className="text-gray-900 text-sm">{program.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Berakhir pada</p>
                    <p className="text-gray-900 text-sm">{new Date(program.endDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}