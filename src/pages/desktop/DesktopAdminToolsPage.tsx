import { ArrowLeft, Database, RefreshCw, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

interface DesktopAdminToolsPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function DesktopAdminToolsPage({ onBack, onNavigate }: DesktopAdminToolsPageProps) {
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
            <div>
              <h1 className="text-gray-900">Admin Tools</h1>
              <p className="text-gray-600 text-sm">Tools untuk mengelola database dan sistem</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Database className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Reset & Seed Database</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Hapus semua data dan isi ulang dengan data testing untuk development
                </p>
                <Button 
                  onClick={() => onNavigate?.('database-reset')}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset Database
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
