import { useState } from 'react';
import { ArrowLeft, Upload, Users, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

interface ImportKontakPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
  onImport?: (contacts: any[]) => void;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  selected: boolean;
  isDuplicate: boolean;
}

export function ImportKontakPage({ onBack, onNavigate, onImport }: ImportKontakPageProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate('dashboard');
    }
  };

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
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-white">Import Kontak</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {step === 'upload' ? (
          // Upload Step
          <div className="space-y-4">
            <Card className="p-6 shadow-card">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Import dari File</h3>
                <p className="text-gray-600">
                  Upload file CSV atau Excel dengan kontak muzakki
                </p>
              </div>

              <label className="block">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button className="w-full bg-primary-600 hover:bg-primary-700 cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Pilih File
                </Button>
              </label>

              <div className="mt-4 text-center">
                <button className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mx-auto">
                  <Download className="h-4 w-4" />
                  <span>Download Template CSV</span>
                </button>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Import dari Ponsel</h3>
                <p className="text-gray-600">
                  Akses kontak di ponsel Anda langsung
                </p>
              </div>

              <Button
                onClick={handleRequestPermission}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Akses Kontak Ponsel
              </Button>
            </Card>

            <Card className="p-4 bg-primary-50 border-primary-200">
              <h4 className="text-primary-900 mb-2">📝 Format File CSV</h4>
              <p className="text-primary-700 mb-2">File harus memiliki kolom:</p>
              <ul className="space-y-1 text-primary-700">
                <li>• <strong>Nama</strong> - Nama lengkap muzakki</li>
                <li>• <strong>Nomor HP</strong> - Format: 08xxx atau +62xxx</li>
                <li>• <strong>Kota</strong> - Domisili (opsional)</li>
                <li>• <strong>Catatan</strong> - Informasi tambahan (opsional)</li>
              </ul>
            </Card>
          </div>
        ) : (
          // Review Step
          <div className="space-y-4">
            {/* Summary */}
            <Card className="p-4 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-900">Kontak Ditemukan</h4>
                <Badge className="bg-primary-100 text-primary-700 border-none">
                  {contacts.length} kontak
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Dipilih</span>
                  </div>
                  <p className="text-green-900">{selectedCount} kontak</p>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-700 mb-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>Duplikat</span>
                  </div>
                  <p className="text-orange-900">{duplicateCount} kontak</p>
                </div>
              </div>
            </Card>

            {/* Select All */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleToggleAll}
                />
                <Label htmlFor="select-all" className="text-gray-700 cursor-pointer">
                  Pilih Semua ({contacts.filter(c => !c.isDuplicate).length} kontak)
                </Label>
              </div>
            </Card>

            {/* Contacts List */}
            <Card className="p-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      contact.isDuplicate ? 'bg-orange-50' : 'bg-gray-50'
                    }`}
                  >
                    <Checkbox
                      id={`contact-${contact.id}`}
                      checked={contact.selected}
                      onCheckedChange={() => handleToggleContact(contact.id)}
                      disabled={contact.isDuplicate}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900">{contact.name}</p>
                        {contact.isDuplicate && (
                          <Badge className="bg-orange-100 text-orange-700 border-none">
                            Duplikat
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep('upload')}
              >
                Kembali
              </Button>
              <Button
                className="flex-1 bg-primary-600 hover:bg-primary-700"
                onClick={handleImport}
                disabled={selectedCount === 0}
              >
                Import ({selectedCount})
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
