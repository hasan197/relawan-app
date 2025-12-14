import { useAppContext } from '../../contexts/AppContext';
import { useGeneratorResiViewModel } from '../../features/generator-resi/viewmodels/useGeneratorResiViewModel';
import { ArrowLeft, CheckCircle, Copy, Receipt, Share2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { formatCurrency } from '../../lib/utils';

interface GeneratorResiPageMvvmProps {
  onBack?: () => void;
}

export function GeneratorResiPageMvvm({ onBack }: GeneratorResiPageMvvmProps) {
  const { user, muzakkiList } = useAppContext();

  const vm = useGeneratorResiViewModel({
    user: user ? { id: user.id, name: user.name } : null
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 pb-20">
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Lapor Donasi</h1>
            <p className="text-sm text-primary-100">Catat & upload bukti transfer</p>
          </div>
          <Receipt className="h-6 w-6 opacity-80" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-4 md:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void vm.submit();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="muzakki">Pilih Donatur (Opsional)</Label>
                <Select
                  value={vm.formData.muzakkiId}
                  onValueChange={(value: string) => {
                    if (value === 'new') {
                      vm.setFormData({ ...vm.formData, muzakkiId: '', donorName: '' });
                      return;
                    }

                    const selected = muzakkiList.find((m) => m.id === value);
                    vm.setFormData({
                      ...vm.formData,
                      muzakkiId: value,
                      donorName: selected ? selected.name : vm.formData.donorName
                    });
                  }}
                >
                  <SelectTrigger className="h-10 md:h-12">
                    <SelectValue placeholder="Pilih dari daftar muzakki" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Donatur Baru</SelectItem>
                    {muzakkiList.map((muzakki) => (
                      <SelectItem key={muzakki.id} value={muzakki.id}>
                        {muzakki.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="donorName">Nama Donatur *</Label>
                <Input
                  id="donorName"
                  placeholder="Masukkan nama donatur"
                  value={vm.formData.donorName}
                  onChange={(e) => vm.setFormData({ ...vm.formData, donorName: e.target.value })}
                  required
                  className="h-10 md:h-12"
                />
              </div>

              <div>
                <Label htmlFor="amount">Nominal Donasi *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Contoh: 500000"
                  value={vm.formData.amount}
                  onChange={(e) => vm.setFormData({ ...vm.formData, amount: e.target.value })}
                  required
                  className="h-10 md:h-12"
                />
                {vm.formData.amount && (
                  <p className="text-sm text-primary-600 mt-1">
                    {formatCurrency(parseFloat(vm.formData.amount))}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={vm.formData.category}
                  onValueChange={(value: any) => vm.setFormData({ ...vm.formData, category: value })}
                >
                  <SelectTrigger className="h-10 md:h-12">
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

              <div>
                <Label htmlFor="paymentMethod">Metode Pembayaran *</Label>
                <Select
                  value={vm.formData.paymentMethod}
                  onValueChange={(value: any) => vm.setFormData({ ...vm.formData, paymentMethod: value })}
                >
                  <SelectTrigger className="h-10 md:h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tunai">💵 Tunai</SelectItem>
                    <SelectItem value="transfer">🏦 Transfer Bank</SelectItem>
                    <SelectItem value="qris">📱 QRIS</SelectItem>
                    <SelectItem value="other">💳 Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {vm.formData.paymentMethod !== 'tunai' && (
              <div>
                <Label>
                  Bukti Transfer {vm.formData.paymentMethod === 'transfer' ? '*' : '(Opsional)'}
                </Label>
                <div className="mt-2">
                  <input
                    ref={vm.fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) vm.selectBuktiFile(file);
                    }}
                    className="hidden"
                    id="bukti-upload"
                  />

                  {vm.buktiPreview ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative rounded-lg overflow-hidden border-2 border-primary-200">
                        <img
                          src={vm.buktiPreview}
                          alt="Preview bukti transfer"
                          className="w-full h-48 md:h-64 object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white"
                          onClick={vm.removeBukti}
                        >
                          Hapus
                        </Button>
                      </div>
                      <div className="flex items-center">
                        <label
                          htmlFor="bukti-upload"
                          className="w-full flex items-center justify-center gap-2 p-4 md:p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors"
                        >
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">Ganti Gambar</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="bukti-upload"
                      className="flex flex-col items-center justify-center gap-2 p-6 md:p-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors"
                    >
                      <ImageIcon className="h-10 w-10 md:h-12 md:w-12 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        Upload Bukti Transfer
                      </span>
                      <span className="text-xs text-gray-500">JPG, PNG (Max 5MB)</span>
                    </label>
                  )}
                </div>
                {vm.formData.paymentMethod === 'transfer' && !vm.hasBuktiFile && (
                  <p className="text-xs text-red-500 mt-1">
                    * Wajib upload bukti transfer untuk pembayaran via transfer
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="notes">Catatan (Opsional)</Label>
              <Textarea
                id="notes"
                placeholder="Tambahkan catatan jika diperlukan..."
                value={vm.formData.notes}
                onChange={(e) => vm.setFormData({ ...vm.formData, notes: e.target.value })}
                rows={3}
                className="md:rows-4"
              />
            </div>

            <div className="md:flex md:justify-center md:pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto md:min-w-[320px] bg-primary-600 hover:bg-primary-700 h-11 md:h-12"
                disabled={vm.submitting}
              >
                {vm.submitting ? (
                  'Menyimpan...'
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Lapor Donasi
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">Donasi akan menunggu validasi dari admin</p>
          </form>
        </Card>
      </div>

      {vm.receipt && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-gradient-to-br from-white to-primary-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full">
                  <Receipt className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Resi Donasi</h2>
                  <p className="text-sm text-gray-600">Donasi berhasil dilaporkan!</p>
                </div>
              </div>

              <Button type="button" variant="outline" size="sm" onClick={vm.closeReceipt}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">No. Resi</span>
                <span className="font-bold">{vm.receipt.number}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tanggal</span>
                <span className="font-medium">{vm.receipt.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Donatur</span>
                <span className="font-medium">{vm.receipt.donorName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Nominal</span>
                <span className="font-bold text-lg text-primary-600">{formatCurrency(vm.receipt.amount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Kategori</span>
                <span className="font-medium capitalize">{vm.receipt.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  Menunggu Validasi
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-800 text-center">
                ⏳ Donasi Anda sedang menunggu validasi dari admin. Anda akan mendapat notifikasi setelah divalidasi.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => void vm.copyReceipt()} variant="outline" className="flex-1 gap-2">
                <Copy className="h-4 w-4" />
                Salin
              </Button>
              <Button onClick={() => void vm.shareReceipt()} className="flex-1 gap-2 bg-primary-600 hover:bg-primary-700">
                <Share2 className="h-4 w-4" />
                Bagikan
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">Jazakumullah khairan katsiran 🤲</p>
          </Card>
        </div>
      )}
    </div>
  );
}
