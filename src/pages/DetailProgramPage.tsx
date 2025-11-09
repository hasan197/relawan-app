import { useState } from 'react';
import { ArrowLeft, Share2, ExternalLink, Calendar, Target, Users, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { formatCurrency } from '../lib/utils';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface DetailProgramPageProps {
  onBack?: () => void;
}

export function DetailProgramPage({ onBack }: DetailProgramPageProps) {
  // Mock program data
  const program = {
    id: '1',
    title: 'Zakat Fitrah 1446 H',
    description: 'Program pengumpulan dan penyaluran zakat fitrah untuk membantu fakir miskin di bulan Ramadhan. Dana yang terkumpul akan disalurkan langsung kepada mustahik yang berhak menerimanya.',
    category: 'zakat' as const,
    targetAmount: 50000000,
    currentAmount: 32500000,
    donorCount: 487,
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800',
    donationLink: 'https://donasi.example.com/zakat-fitrah',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-04-15'),
    status: 'active' as const,
    organizer: 'Lembaga Zakat ZISWAF',
    detailDescription: `
Program Zakat Fitrah 1446 H merupakan program tahunan yang bertujuan untuk memudahkan umat muslim dalam menunaikan zakat fitrah dan memastikan penyaluran yang tepat sasaran.

**Tujuan Program:**
- Memudahkan pembayaran zakat fitrah
- Menjangkau lebih banyak mustahik
- Penyaluran yang transparan dan akuntabel
- Memberikan manfaat maksimal untuk penerima

**Penerima Manfaat:**
- Fakir dan miskin
- Yatim piatu
- Lansia tidak mampu
- Keluarga dhuafa

**Timeline:**
- Pengumpulan: 1 Ramadhan - 1 Syawal
- Penyaluran: Sebelum Shalat Idul Fitri
    `.trim(),
    updates: [
      {
        id: '1',
        date: new Date('2025-11-07'),
        title: 'Update Progress 65%',
        description: 'Alhamdulillah sudah terkumpul Rp 32.5 juta dari 487 donatur.'
      },
      {
        id: '2',
        date: new Date('2025-11-05'),
        title: 'Sosialisasi di Masjid Al-Ikhlas',
        description: 'Telah dilakukan sosialisasi dan edukasi tentang zakat fitrah.'
      }
    ]
  };

  const progress = (program.currentAmount / program.targetAmount) * 100;
  const daysLeft = Math.ceil((program.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleShare = () => {
    const shareText = `${program.title}\n\n${program.description}\n\nTarget: ${formatCurrency(program.targetAmount)}\nTerkumpul: ${formatCurrency(program.currentAmount)}\n\nDonasi: ${program.donationLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: program.title,
        text: shareText
      }).then(() => {
        toast.success('Berhasil membagikan program!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Link berhasil disalin!');
    }
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
          <h2 className="text-white">Detail Program</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Hero Image */}
        <Card className="overflow-hidden mb-4 shadow-card">
          <div className="relative h-56">
            <ImageWithFallback
              src={program.imageUrl}
              alt={program.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-600 text-white border-none">
                {program.status === 'active' ? 'Aktif' : 'Selesai'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Title & Category */}
        <Card className="p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-gray-900 flex-1">{program.title}</h3>
            <Badge className="bg-green-100 text-green-700 border-none capitalize">
              {program.category}
            </Badge>
          </div>
          <p className="text-gray-600">{program.description}</p>
        </Card>

        {/* Progress Card */}
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-gray-900">Progress Donasi</h4>
            <span className="text-primary-600">{Math.round(progress)}%</span>
          </div>
          
          <Progress value={progress} className="h-3 mb-3" />
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500">Terkumpul</p>
              <p className="text-primary-600">{formatCurrency(program.currentAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Target</p>
              <p className="text-gray-900">{formatCurrency(program.targetAmount)}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-gray-500">Donatur</p>
              <p className="text-gray-900">{program.donorCount}</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600 mx-auto mb-1" />
              <p className="text-gray-500">Sisa Hari</p>
              <p className="text-gray-900">{daysLeft}</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-gray-500">Kekurangan</p>
              <p className="text-gray-900">{formatCurrency(program.targetAmount - program.currentAmount)}</p>
            </div>
          </div>
        </Card>

        {/* Detail Description */}
        <Card className="p-4 mb-4">
          <h4 className="text-gray-900 mb-3">Tentang Program</h4>
          <div className="prose prose-sm text-gray-700 whitespace-pre-wrap">
            {program.detailDescription}
          </div>
        </Card>

        {/* Organizer */}
        <Card className="p-4 mb-4">
          <h4 className="text-gray-900 mb-2">Penyelenggara</h4>
          <p className="text-gray-600">{program.organizer}</p>
        </Card>

        {/* Updates */}
        <Card className="p-4 mb-4">
          <h4 className="text-gray-900 mb-3">Update Terbaru</h4>
          <div className="space-y-3">
            {program.updates.map((update) => (
              <div key={update.id} className="border-l-2 border-primary-500 pl-4 py-2">
                <p className="text-gray-500 mb-1">
                  {update.date.toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
                <h4 className="text-gray-900 mb-1">{update.title}</h4>
                <p className="text-gray-600">{update.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-lg">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5 mr-2" />
              Bagikan
            </Button>
            <Button 
              size="lg" 
              className="flex-1 bg-primary-600 hover:bg-primary-700"
              onClick={() => window.open(program.donationLink, '_blank')}
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Donasi Sekarang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
