import { useState } from 'react';
import { DesktopLayout } from '../../components/desktop/DesktopLayout';
import { Upload, Download, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

type NavigatePage = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

interface ImportKontakPageProps {
  onNavigate?: (page: NavigatePage) => void;
}

export function ImportKontakPage({ onNavigate }: ImportKontakPageProps) {
  const [activeNav, setActiveNav] = useState<NavigatePage>('donatur');
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file) return;
    setImporting(true);
    // Simulate import process
    setTimeout(() => {
      setImporting(false);
      setFile(null);
    }, 2000);
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import Kontak</h1>
          <p className="text-gray-600 mt-1">Import data kontak dari file CSV atau Excel</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag & drop file CSV atau Excel di sini
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  atau
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload">
                  <Button asChild variant="outline">
                    <span>Pilih File</span>
                  </Button>
                </label>
              </div>

              {file && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">{file.name}</p>
                    <p className="text-sm text-green-600">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Hapus
                  </Button>
                </div>
              )}

              <Button 
                onClick={handleImport}
                disabled={!file || importing}
                className="w-full"
              >
                {importing ? 'Mengimport...' : 'Import Kontak'}
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Panduan Import</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Format File yang Didukung:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    CSV (.csv)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Excel (.xlsx, .xls)
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Format Kolom:</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <code className="text-gray-700">
                    name,phone,city,notes
                  </code>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Contoh Data:</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <code className="text-gray-700 whitespace-pre">
{`Ahmad Syarif,081234567890,Jakarta,Rutin donasi
Fatimah Azzahra,081234567891,Bandung,Tertarik wakaf`}
                  </code>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Imports */}
        <Card>
          <CardHeader>
            <CardTitle>Import Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada riwayat import</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopLayout>
  );
}