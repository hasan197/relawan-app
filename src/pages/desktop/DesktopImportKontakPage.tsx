import { useState } from 'react';
import { ArrowLeft, Upload, Users, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner@2.0.3';

interface DesktopImportKontakPageProps {
  onBack?: () => void;
  onImport?: (contacts: any[]) => void;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  selected: boolean;
  isDuplicate: boolean;
}

export function DesktopImportKontakPage({ onBack, onImport }: DesktopImportKontakPageProps) {
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectAll, setSelectAll] = useState(true);

  // Mock contacts for demo
  const mockContacts: Contact[] = [
    { id: '1', name: 'Abdullah Rahman', phone: '+628123456701', selected: true, isDuplicate: false },
    { id: '2', name: 'Siti Khadijah', phone: '+628123456702', selected: true, isDuplicate: false },
    { id: '3', name: 'Ahmad Syarif', phone: '+62812345001', selected: false, isDuplicate: true },
    { id: '4', name: 'Umar bin Khattab', phone: '+628123456703', selected: true, isDuplicate: false },
    { id: '5', name: 'Aisyah binti Abu Bakar', phone: '+628123456704', selected: true, isDuplicate: false },
    { id: '6', name: 'Ali bin Abi Thalib', phone: '+628123456705', selected: true, isDuplicate: false },
    { id: '7', name: 'Fatimah Az-Zahra', phone: '+628123456706', selected: true, isDuplicate: false },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate file processing
    toast.success('Memproses file...');
    setTimeout(() => {
      setContacts(mockContacts);
      setStep('review');
      toast.success(`${mockContacts.length} kontak ditemukan`);
    }, 1500);
  };

  const handleRequestPermission = () => {
    // Simulate permission request
    toast.success('Mengakses kontak...');
    setTimeout(() => {
      setContacts(mockContacts);
      setStep('review');
      toast.success(`${mockContacts.length} kontak ditemukan`);
    }, 1500);
  };

  const handleToggleContact = (id: string) => {
    setContacts(prev =>
      prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c)
    );
  };

  const handleToggleAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setContacts(prev =>
      prev.map(c => ({ ...c, selected: newSelectAll && !c.isDuplicate }))
    );
  };

  const handleImport = () => {
    const selectedContacts = contacts.filter(c => c.selected);
    if (selectedContacts.length === 0) {
      toast.error('Pilih minimal 1 kontak untuk diimpor');
      return;
    }

    toast.success(`${selectedContacts.length} kontak berhasil diimpor!`);
    onImport?.(selectedContacts);
  };

  const selectedCount = contacts.filter(c => c.selected).length;
  const duplicateCount = contacts.filter(c => c.isDuplicate).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h1 className="text-white text-3xl mb-1">Import Kontak</h1>
            <p className="text-primary-100">
              {step === 'upload' ? 'Pilih sumber kontak' : `${contacts.length} kontak ditemukan`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {step === 'upload' ? (
          // Upload Step
          <div className="grid grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-10 text-center hover:shadow-xl transition-shadow">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Import dari File</h3>
              <p className="text-gray-600 mb-8">
                Upload file CSV atau Excel dengan kontak muzakki Anda
              </p>

              <label className="block">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button className="w-full bg-primary-600 hover:bg-primary-700 cursor-pointer" size="lg">
                  <Upload className="h-5 w-5 mr-2" />
                  Pilih File
                </Button>
              </label>

              <div className="mt-6">
                <button className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mx-auto">
                  <Download className="h-4 w-4" />
                  <span>Download Template CSV</span>
                </button>
              </div>
            </Card>

            <Card className="p-10 text-center hover:shadow-xl transition-shadow">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Import dari Ponsel</h3>
              <p className="text-gray-600 mb-8">
                Akses daftar kontak di ponsel Anda secara langsung
              </p>

              <Button
                onClick={handleRequestPermission}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Users className="h-5 w-5 mr-2" />
                Akses Kontak
              </Button>

              <p className="text-gray-400 text-sm mt-6">
                Browser akan meminta izin akses kontak
              </p>
            </Card>

            {/* Info Card */}
            <Card className="col-span-2 p-6 bg-blue-50 border-blue-200">
              <div className="flex gap-4">
                <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-blue-900 mb-2">Format File CSV</h4>
                  <p className="text-blue-800 mb-3">
                    Pastikan file CSV memiliki kolom: <strong>Nama</strong> dan <strong>Nomor WhatsApp</strong>
                  </p>
                  <p className="text-blue-700 text-sm">
                    Contoh: Abdullah Rahman,+6281234567890
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Review Step
          <div className="grid grid-cols-4 gap-6">
            {/* Sidebar - Stats */}
            <div className="col-span-1 space-y-6">
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <p className="text-gray-600">Dipilih</p>
                </div>
                <p className="text-4xl text-green-700">{selectedCount}</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <p className="text-gray-600">Total</p>
                </div>
                <p className="text-4xl text-blue-700">{contacts.length}</p>
              </Card>

              {duplicateCount > 0 && (
                <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                    <p className="text-gray-600">Duplikat</p>
                  </div>
                  <p className="text-4xl text-yellow-700">{duplicateCount}</p>
                </Card>
              )}

              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-blue-800 text-sm">
                  💡 Kontak duplikat sudah ada di database dan tidak akan diimpor
                </p>
              </Card>
            </div>

            {/* Main Content - Contact List */}
            <div className="col-span-3 space-y-6">
              {/* Header & Controls */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900">Review Kontak</h3>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleToggleAll}
                      />
                      <span className="text-gray-700">Pilih Semua</span>
                    </label>
                    <Badge className="bg-gray-100 text-gray-700 border-none">
                      {selectedCount} dari {contacts.length}
                    </Badge>
                  </div>
                </div>

                {/* Contact List */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        contact.isDuplicate
                          ? 'bg-yellow-50 border-yellow-200'
                          : contact.selected
                          ? 'bg-primary-50 border-primary-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        checked={contact.selected}
                        onCheckedChange={() => handleToggleContact(contact.id)}
                        disabled={contact.isDuplicate}
                      />
                      
                      <div className="flex-1">
                        <h4 className="text-gray-900">{contact.name}</h4>
                        <p className="text-gray-600 text-sm">{contact.phone}</p>
                      </div>

                      {contact.isDuplicate && (
                        <Badge className="bg-yellow-100 text-yellow-700 border-none">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Duplikat
                        </Badge>
                      )}

                      {contact.selected && !contact.isDuplicate && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep('upload')}
                >
                  Kembali
                </Button>
                <Button
                  size="lg"
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={handleImport}
                  disabled={selectedCount === 0}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Import {selectedCount} Kontak
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
