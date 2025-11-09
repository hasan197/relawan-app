import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { Download, Printer, Copy, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

interface GeneratorResiPageProps {
  onBack?: () => void;
  onNavigate?: (page: NavigatePage) => void;
}

export function GeneratorResiPage({ onBack, onNavigate }: GeneratorResiPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('dashboard');
  const [formData, setFormData] = useState({
    donorName: '',
    amount: '',
    category: 'zakat',
    program: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleGenerate = () => {
    if (!formData.donorName || !formData.amount) {
      toast.error('Harap isi nama donatur dan jumlah donasi');
      return;
    }
    toast.success('Resi berhasil dibuat');
  };

  const handleCopyResi = () => {
    const resiContent = `RESI DONASI
Nama: ${formData.donorName}
Jumlah: Rp ${parseInt(formData.amount).toLocaleString('id-ID')}
Kategori: ${formData.category}
Tanggal: ${new Date(formData.date).toLocaleDateString('id-ID')}

Terima kasih atas donasi Anda.`;
    
    navigator.clipboard.writeText(resiContent);
    toast.success('Resi berhasil disalin');
  };

  return (
    <DesktopLayout
      activeNav={activeNav}
      onNavigate={(page) => {
        setActiveNav(page);
        onNavigate?.(page);
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Generator Resi</h1>
              <p className="text-gray-600 mt-1">Buat dan cetak resi donasi</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Data Donasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Nama Donatur</Label>
                <Input
                  id="donorName"
                  placeholder="Masukkan nama donatur"
                  value={formData.donorName}
                  onChange={(e) => setFormData({...formData, donorName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Donasi</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Masukkan jumlah donasi"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori Donasi</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zakat">Zakat</SelectItem>
                    <SelectItem value="infaq">Infaq</SelectItem>
                    <SelectItem value="sedekah">Sedekah</SelectItem>
                    <SelectItem value="wakaf">Wakaf</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Tanggal Donasi</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <Button onClick={handleGenerate} className="w-full">
                Generate Resi
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview Resi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">RESI DONASI</h2>
                  <p className="text-sm text-gray-500">No: RESI-{Date.now().toString().slice(-6)}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama Donatur:</span>
                    <span className="font-medium">{formData.donorName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jumlah:</span>
                    <span className="font-medium">
                      {formData.amount ? `Rp ${parseInt(formData.amount).toLocaleString('id-ID')}` : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kategori:</span>
                    <span className="font-medium capitalize">{formData.category || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="font-medium">
                      {formData.date ? new Date(formData.date).toLocaleDateString('id-ID') : '-'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    Terima kasih atas donasi Anda. Semoga menjadi amal jariyah.
                  </p>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleCopyResi}>
                    <Copy className="h-4 w-4 mr-2" />
                    Salin
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />
                    Cetak
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Resi */}
        <Card>
          <CardHeader>
            <CardTitle>Resi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">Belum ada resi yang dibuat</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopLayout>
  );
}