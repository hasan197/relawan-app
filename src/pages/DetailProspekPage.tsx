import { ArrowLeft, Phone, MapPin, Calendar, MessageCircle, Edit, Trash2, DollarSign, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getInitials, formatRelativeTime, formatCurrency } from '../lib/utils';
import { toast } from 'sonner@2.0.3';
import { useSingleMuzakki, useCommunications, useUpdateMuzakki, useAddCommunication, useDeleteMuzakki } from '../hooks/useMuzakki';
import { useMuzakkiDonations } from '../hooks/useDonations';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { useAppContext } from '../contexts/AppContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';

interface DetailProspekPageProps {
  muzakkiId?: string;
  onBack?: () => void;
}

export function DetailProspekPage({ muzakkiId, onBack }: DetailProspekPageProps) {
  const { user } = useAppContext();
  // Fetch data from hooks
  const { muzakki, loading: muzakkiLoading, refetch: refetchMuzakki } = useSingleMuzakki(muzakkiId || null);
  const { communications, loading: commLoading, refetch: refetchComms } = useCommunications(muzakkiId || null);
  const { donations, loading: donLoading } = useMuzakkiDonations(muzakkiId || null);
  const { updateMuzakki, updating } = useUpdateMuzakki();
  const { addCommunication, adding } = useAddCommunication();
  const { deleteMuzakki, deleting } = useDeleteMuzakki();

  const [isCommDialogOpen, setIsCommDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commType, setCommType] = useState<'call' | 'whatsapp' | 'meeting'>('whatsapp');
  const [commNotes, setCommNotes] = useState('');
  const [notes, setNotes] = useState(muzakki?.notes || '');
  
  // Edit form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');

  const loading = muzakkiLoading || commLoading || donLoading;

  const getStatusBadge = (status: string) => {
    const variants = {
      'baru': 'bg-blue-100 text-blue-700',
      'follow-up': 'bg-yellow-100 text-yellow-700',
      'donasi': 'bg-green-100 text-green-700'
    };
    const labels = {
      'baru': 'Baru',
      'follow-up': 'Follow Up',
      'donasi': 'Donasi'
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border-none`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleWhatsApp = () => {
    if (!muzakki) return;
    toast.success('Membuka WhatsApp...');
    window.open(`https://wa.me/${muzakki.phone.replace('+', '')}`, '_blank');
  };

  const handleCall = () => {
    if (!muzakki) return;
    toast.success('Membuka panggilan...');
    window.location.href = `tel:${muzakki.phone}`;
  };

  const handleChangeStatus = (newStatus: string) => {
    if (!muzakki) return;
    updateMuzakki(muzakkiId || '', { status: newStatus })
      .then(() => {
        toast.success(`Status diubah menjadi "${newStatus}"`);
        refetchMuzakki();
      })
      .catch((error) => {
        toast.error(`Gagal mengubah status: ${error.message}`);
      });
  };

  const handleAddCommunication = () => {
    if (!muzakki || !user?.id) return;
    addCommunication(muzakkiId || '', user.id, { type: commType, notes: commNotes })
      .then(() => {
        toast.success('Komunikasi berhasil ditambahkan');
        refetchComms();
        setIsCommDialogOpen(false);
        setCommNotes('');
      })
      .catch((error) => {
        toast.error(`Gagal menambahkan komunikasi: ${error.message}`);
      });
  };

  const handleUpdateNotes = () => {
    if (!muzakki) return;
    updateMuzakki(muzakkiId || '', { notes: notes })
      .then(() => {
        toast.success('Catatan berhasil diperbarui');
        refetchMuzakki();
        setIsNotesDialogOpen(false);
      })
      .catch((error) => {
        toast.error(`Gagal memperbarui catatan: ${error.message}`);
      });
  };

  const handleEditMuzakki = () => {
    if (!muzakki) return;
    updateMuzakki(muzakkiId || '', { 
      name: editName,
      phone: editPhone,
      city: editCity
    })
      .then(() => {
        toast.success('Data muzakki berhasil diperbarui');
        refetchMuzakki();
        setIsEditDialogOpen(false);
      })
      .catch((error) => {
        toast.error(`Gagal memperbarui data: ${error.message}`);
      });
  };

  const handleDeleteMuzakki = () => {
    if (!muzakki) return;
    deleteMuzakki(muzakkiId || '')
      .then(() => {
        toast.success('Muzakki berhasil dihapus');
        setIsDeleteDialogOpen(false);
        onBack?.();
      })
      .catch((error) => {
        toast.error(`Gagal menghapus muzakki: ${error.message}`);
      });
  };

  // Update notes and edit fields state when muzakki changes
  useEffect(() => {
    if (muzakki) {
      setNotes(muzakki.notes || '');
      setEditName(muzakki.name);
      setEditPhone(muzakki.phone);
      setEditCity(muzakki.city || '');
    }
  }, [muzakki]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data muzakki...</p>
        </div>
      </div>
    );
  }

  if (!muzakki) {
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
            <h2 className="text-white">Detail Muzakki</h2>
          </div>
        </div>
        <div className="px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-gray-600">Data muzakki tidak ditemukan</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Detail Muzakki</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Profile Card */}
        <Card className="p-6 shadow-card mb-4">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${muzakki.name}`} />
              <AvatarFallback className="bg-primary-100 text-primary-700">
                {getInitials(muzakki.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-gray-900 mb-1">{muzakki.name}</h3>
                  {getStatusBadge(muzakki.status)}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditDialogOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{muzakki.phone}</span>
                </div>
                {muzakki.city && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{muzakki.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Bergabung {formatRelativeTime(new Date(muzakki.created_at))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={handleCall}
              variant="outline"
            >
              <Phone className="h-4 w-4 mr-2" />
              Telepon
            </Button>
          </div>
        </Card>

        {/* Change Status */}
        <Card className="p-4 mb-4">
          <h4 className="text-gray-900 mb-3">Ubah Status</h4>
          <div className="flex gap-2">
            {(['baru', 'follow-up', 'donasi'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleChangeStatus(status)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                  muzakki.status === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'baru' ? 'Baru' : status === 'follow-up' ? 'Follow Up' : 'Donasi'}
              </button>
            ))}
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="komunikasi" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="komunikasi">Komunikasi</TabsTrigger>
            <TabsTrigger value="donasi">Donasi</TabsTrigger>
            <TabsTrigger value="catatan">Catatan</TabsTrigger>
          </TabsList>

          <TabsContent value="komunikasi" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-900">Riwayat Komunikasi</h4>
                <Button size="sm" className="bg-primary-600 hover:bg-primary-700" onClick={() => setIsCommDialogOpen(true)}>
                  Tambah
                </Button>
              </div>
              
              {communications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada riwayat komunikasi
                </div>
              ) : (
                <div className="space-y-3">
                  {communications.map((comm) => {
                    const icons = {
                      call: '📞',
                      whatsapp: '💬',
                      meeting: '🤝',
                      other: '📝'
                    };
                    
                    return (
                      <div key={comm.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{icons[comm.type as keyof typeof icons]}</div>
                        <div className="flex-1">
                          <p className="text-gray-500 mb-1">
                            {formatRelativeTime(new Date(comm.created_at))}
                          </p>
                          <p className="text-gray-700">{comm.notes}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="donasi" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-900">Riwayat Donasi</h4>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Total</p>
                  <p className="text-primary-600 font-semibold">
                    {formatCurrency(donations.reduce((sum, d) => sum + d.amount, 0))}
                  </p>
                </div>
              </div>
              
              {donations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada donasi
                </div>
              ) : (
                <div className="space-y-3">
                  {donations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 capitalize">{donation.category}</p>
                          <p className="text-gray-500 text-sm">{formatRelativeTime(new Date(donation.created_at))}</p>
                          <p className="text-gray-400 text-xs">Resi: {donation.receipt_number}</p>
                        </div>
                      </div>
                      <p className="text-green-600 font-semibold">{formatCurrency(donation.amount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="catatan" className="mt-4">
            <Card className="p-4">
              <h4 className="text-gray-900 mb-3">Catatan</h4>
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-gray-700">{muzakki.notes || 'Tidak ada catatan'}</p>
              </div>
              <Button className="w-full" variant="outline" onClick={() => setIsNotesDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Catatan
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Communication Dialog */}
      <Dialog open={isCommDialogOpen} onOpenChange={setIsCommDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Komunikasi</DialogTitle>
            <DialogDescription>
              Tambahkan catatan komunikasi dengan muzakki ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commType">Jenis Komunikasi</Label>
              <select
                id="commType"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={commType}
                onChange={(e) => setCommType(e.target.value as 'call' | 'whatsapp' | 'meeting')}
              >
                <option value="call">Panggilan</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="meeting">Rapat</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commNotes">Catatan</Label>
              <Textarea
                id="commNotes"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={commNotes}
                onChange={(e) => setCommNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              className="bg-primary-600 hover:bg-primary-700"
              onClick={handleAddCommunication}
              disabled={adding}
            >
              {adding ? 'Menambahkan...' : 'Tambah'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Perbarui Catatan</DialogTitle>
            <DialogDescription>
              Perbarui catatan muzakki ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              className="bg-primary-600 hover:bg-primary-700"
              onClick={handleUpdateNotes}
              disabled={updating}
            >
              {updating ? 'Memperbarui...' : 'Perbarui'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Muzakki Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Muzakki</DialogTitle>
            <DialogDescription>
              Perbarui data muzakki ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Nama</Label>
              <Input
                id="editName"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPhone">Nomor Telepon</Label>
              <Input
                id="editPhone"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCity">Kota</Label>
              <Input
                id="editCity"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              className="bg-primary-600 hover:bg-primary-700"
              onClick={handleEditMuzakki}
              disabled={updating}
            >
              {updating ? 'Memperbarui...' : 'Perbarui'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Muzakki Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Muzakki</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus muzakki ini? Tindakan ini tidak dapat diurungkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMuzakki}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}