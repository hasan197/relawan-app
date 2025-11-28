import { ArrowLeft, Phone, MapPin, Calendar, MessageCircle, Edit, Trash2, DollarSign, Loader2, Users } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { getInitials, formatRelativeTime, formatCurrency } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import { useSingleMuzakki, useCommunications, useUpdateMuzakki, useAddCommunication, useDeleteMuzakki } from '../../hooks/useMuzakki';
import { useMuzakkiDonations } from '../../hooks/useDonations';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { useAppContext } from '../../contexts/AppContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

interface DesktopDetailProspekPageProps {
  muzakkiId?: string;
  onBack?: () => void;
}

export function DesktopDetailProspekPage({ muzakkiId, onBack }: DesktopDetailProspekPageProps) {
  const { user } = useAppContext();
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
      <Badge className={`${variants[status as keyof typeof variants]} border-none text-xs`}>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data muzakki...</p>
        </div>
      </div>
    );
  }

  if (!muzakki) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="p-8 text-center">
            <p className="text-gray-600">Data muzakki tidak ditemukan</p>
          </Card>
        </div>
      </div>
    );
  }

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
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
                <h1 className="text-gray-900">Detail Muzakki</h1>
                <p className="text-gray-600 text-sm">Informasi lengkap dan riwayat komunikasi</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsEditDialogOpen(true)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button onClick={() => setIsDeleteDialogOpen(true)} variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Profile & Info */}
          <div className="col-span-1 space-y-4">
            {/* Profile Card */}
            <Card className="p-5">
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={muzakki.photo} />
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {getInitials(muzakki.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-gray-900 mb-2">{muzakki.name}</h3>
                {getStatusBadge(muzakki.status)}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{muzakki.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{muzakki.city || '-'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{formatRelativeTime(muzakki.createdAt)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button onClick={handleWhatsApp} size="sm" className="bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
                <Button onClick={handleCall} size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="p-5">
              <h4 className="text-gray-900 text-sm font-semibold mb-4">Statistik Donasi</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Total Donasi</span>
                  <span className="text-primary-600 font-semibold">{formatCurrency(totalDonations)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Jumlah Transaksi</span>
                  <span className="text-gray-900 font-semibold">{donations.length}</span>
                </div>
              </div>
            </Card>

            {/* Quick Status Change */}
            <Card className="p-5">
              <h4 className="text-gray-900 text-sm font-semibold mb-3">Ubah Status</h4>
              <div className="space-y-2">
                {['baru', 'follow-up', 'donasi'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleChangeStatus(status)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      muzakki.status === status 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {status === 'baru' ? 'Baru' : status === 'follow-up' ? 'Follow Up' : 'Donasi'}
                  </button>
                ))}
              </div>
            </Card>

            {/* Notes Card */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-900 text-sm font-semibold">Catatan</h4>
                <Button onClick={() => setIsNotesDialogOpen(true)} variant="ghost" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                {muzakki.notes || 'Belum ada catatan'}
              </p>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="col-span-2">
            <Card className="p-5">
              <Tabs defaultValue="communications" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="communications">Riwayat Komunikasi</TabsTrigger>
                  <TabsTrigger value="donations">Riwayat Donasi</TabsTrigger>
                </TabsList>

                <TabsContent value="communications" className="mt-0">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-600 text-sm">{communications.length} komunikasi tercatat</p>
                    <Button onClick={() => setIsCommDialogOpen(true)} size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Tambah Komunikasi
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {communications.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Belum ada riwayat komunikasi</p>
                      </div>
                    ) : (
                      communications.map((comm) => (
                        <div key={comm.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {comm.type === 'whatsapp' && <MessageCircle className="h-4 w-4 text-green-600" />}
                              {comm.type === 'call' && <Phone className="h-4 w-4 text-blue-600" />}
                              {comm.type === 'meeting' && <Users className="h-4 w-4 text-purple-600" />}
                              <span className="text-gray-900 text-sm font-medium capitalize">{comm.type}</span>
                            </div>
                            <span className="text-gray-500 text-xs">{formatRelativeTime(comm.createdAt)}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{comm.notes}</p>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="donations" className="mt-0">
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">{donations.length} donasi tercatat</p>
                  </div>
                  
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {donations.length === 0 ? (
                      <div className="text-center py-8">
                        <DollarSign className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Belum ada riwayat donasi</p>
                      </div>
                    ) : (
                      donations.map((donation) => (
                        <div key={donation.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-gray-900 font-semibold">{formatCurrency(donation.amount)}</p>
                              <p className="text-gray-600 text-xs capitalize">{donation.type}</p>
                            </div>
                            <span className="text-gray-500 text-xs">{formatRelativeTime(donation.createdAt)}</span>
                          </div>
                          {donation.notes && (
                            <p className="text-gray-600 text-sm mt-2">{donation.notes}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isCommDialogOpen} onOpenChange={setIsCommDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Komunikasi</DialogTitle>
            <DialogDescription>Catat komunikasi dengan muzakki</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipe Komunikasi</Label>
              <select
                value={commType}
                onChange={(e) => setCommType(e.target.value as any)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="call">Telepon</option>
                <option value="meeting">Pertemuan</option>
              </select>
            </div>
            <div>
              <Label>Catatan</Label>
              <Textarea
                value={commNotes}
                onChange={(e) => setCommNotes(e.target.value)}
                placeholder="Tulis catatan komunikasi..."
                className="mt-2"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCommDialogOpen(false)}>Batal</Button>
              <Button onClick={handleAddCommunication} disabled={adding || !commNotes}>
                {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Catatan</DialogTitle>
            <DialogDescription>Perbarui catatan muzakki</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tulis catatan..."
              rows={6}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>Batal</Button>
              <Button onClick={handleUpdateNotes} disabled={updating}>
                {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Muzakki</DialogTitle>
            <DialogDescription>Perbarui informasi muzakki</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Lengkap</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nama lengkap"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Nomor Telepon</Label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+62"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Kota</Label>
              <Input
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                placeholder="Kota"
                className="mt-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
              <Button onClick={handleEditMuzakki} disabled={updating || !editName || !editPhone}>
                {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Muzakki?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data muzakki dan semua riwayat komunikasi akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMuzakki} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}