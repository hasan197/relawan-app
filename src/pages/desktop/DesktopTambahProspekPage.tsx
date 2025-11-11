import { useState } from 'react';
import { UserPlus, Save, X, Phone, Mail, MapPin, Building2, MessageSquare } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { DesktopTopbar } from '../../components/desktop/DesktopTopbar';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface DesktopTambahProspekPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
  onSave?: () => void;
}

export function DesktopTambahProspekPage({ onNavigate, onBack, onSave }: DesktopTambahProspekPageProps) {
  const { addMuzakki, loading } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    occupation: '',
    status: 'baru' as 'baru' | 'follow-up' | 'donasi',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Nama dan nomor telepon wajib diisi');
      return;
    }

    try {
      await addMuzakki({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        city: formData.city || undefined,
        address: formData.address || undefined,
        occupation: formData.occupation || undefined,
        status: formData.status,
        notes: formData.notes || undefined
      });

      toast.success('Muzakki berhasil ditambahkan!');
      onSave?.();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menambahkan muzakki');
    }
  };

  const handleCancel = () => {
    if (formData.name || formData.phone) {
      if (confirm('Data belum disimpan. Yakin ingin keluar?')) {
        onBack?.();
      }
    } else {
      onBack?.();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopTopbar 
        title="Tambah Muzakki Baru" 
        subtitle="Isi formulir untuk menambahkan muzakki baru"
        onNavigate={onNavigate}
      />

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="col-span-2 space-y-6">
                {/* Personal Info */}
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6 flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary-600" />
                    Informasi Personal
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="name">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">
                        Nomor Telepon <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+62 812-3456-7890"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="city">Kota</Label>
                      <div className="relative mt-2">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="city"
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Jakarta"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="occupation">Pekerjaan</Label>
                      <div className="relative mt-2">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="occupation"
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          placeholder="Wiraswasta"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="address">Alamat Lengkap</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Jl. Contoh No. 123, RT/RW 001/002, Kelurahan, Kecamatan"
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>

                {/* Status & Notes */}
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary-600" />
                    Status & Catatan
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">Status Muzakki</Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      >
                        <option value="baru">Baru</option>
                        <option value="follow-up">Follow Up</option>
                        <option value="donasi">Sudah Donasi</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="notes">Catatan</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Tambahkan catatan penting tentang muzakki ini..."
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar - Tips & Actions */}
              <div className="col-span-1 space-y-6">
                {/* Action Buttons */}
                <Card className="p-6">
                  <h4 className="text-gray-900 mb-4">Aksi</h4>
                  <div className="space-y-3">
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary-600 hover:bg-primary-700 gap-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Simpan Muzakki
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <X className="h-4 w-4" />
                      Batal
                    </Button>
                  </div>
                </Card>

                {/* Tips */}
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <h4 className="text-blue-900 mb-3">💡 Tips</h4>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Pastikan nomor telepon valid dan aktif WhatsApp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Tambahkan catatan untuk memudahkan follow-up</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Update status setelah melakukan kontak</span>
                    </li>
                  </ul>
                </Card>

                {/* Quick Stats */}
                <Card className="p-6">
                  <h4 className="text-gray-900 mb-3">Statistik Anda</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Muzakki</span>
                      <span className="text-gray-900">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Follow Up</span>
                      <span className="text-yellow-600">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sudah Donasi</span>
                      <span className="text-green-600">16</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
