import { AlertCircle, ExternalLink, Terminal } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

interface ServerStatusBannerProps {
  error?: string | null;
}

export function ServerStatusBanner({ error }: ServerStatusBannerProps) {
  if (!error || !error.includes('Server belum aktif')) {
    return null;
  }

  return (
    <Alert className="mb-4 bg-yellow-50 border-yellow-200">
      <AlertCircle className="h-5 w-5 text-yellow-600" />
      <AlertDescription className="ml-2">
        <div className="space-y-3">
          <p className="text-yellow-900">
            <strong>Backend server belum aktif.</strong> Aplikasi memerlukan Supabase Edge Function untuk berjalan dengan baik.
          </p>
          
          <div className="bg-yellow-100 rounded-lg p-3 space-y-2">
            <p className="text-yellow-900 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <strong>Cara Deploy:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-yellow-800 ml-6">
              <li>Install Supabase CLI: <code className="bg-yellow-200 px-1 rounded">npm install -g supabase</code></li>
              <li>Login ke Supabase: <code className="bg-yellow-200 px-1 rounded">supabase login</code></li>
              <li>Link project: <code className="bg-yellow-200 px-1 rounded">supabase link --project-ref cqeranzfqkccdqadpica</code></li>
              <li>Deploy function: <code className="bg-yellow-200 px-1 rounded">supabase functions deploy make-server-f689ca3f</code></li>
            </ol>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => window.open('https://supabase.com/docs/guides/functions/deploy', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Baca Dokumentasi
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
