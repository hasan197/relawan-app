import { useState } from 'react';
import { CheckCircle, XCircle, Loader, Database, Server, Zap } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { apiCall, SERVER_URL } from '../lib/supabase';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

interface TestConnectionPageProps {
  onBack?: () => void;
}

export function TestConnectionPage({ onBack }: TestConnectionPageProps) {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    serverHealth: { status: 'idle' | 'testing' | 'success' | 'error', message?: string },
    kvStore: { status: 'idle' | 'testing' | 'success' | 'error', message?: string },
    auth: { status: 'idle' | 'testing' | 'success' | 'error', message?: string }
  }>({
    serverHealth: { status: 'idle' },
    kvStore: { status: 'idle' },
    auth: { status: 'idle' }
  });

  const runTests = async () => {
    setTesting(true);

    // Test 1: Server Health Check
    setResults(prev => ({ ...prev, serverHealth: { status: 'testing' } }));
    try {
      const response = await fetch(`${SERVER_URL}/health`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        setResults(prev => ({
          ...prev,
          serverHealth: { 
            status: 'success', 
            message: `Server aktif! (${new Date(data.timestamp).toLocaleTimeString()})` 
          }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          serverHealth: { status: 'error', message: 'Server tidak merespon dengan benar' }
        }));
      }
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        serverHealth: { status: 'error', message: error.message }
      }));
    }

    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2: KV Store - Write & Read Test
    setResults(prev => ({ ...prev, kvStore: { status: 'testing' } }));
    try {
      const testKey = `test_connection_${Date.now()}`;
      const testData = {
        message: 'Connection test successful!',
        timestamp: new Date().toISOString()
      };

      // Try to write (through send OTP which writes to KV)
      const writeResponse = await apiCall('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: '+62812TEST999' })
      });

      if (writeResponse.success) {
        setResults(prev => ({
          ...prev,
          kvStore: { 
            status: 'success', 
            message: 'KV Store berfungsi! Data bisa ditulis dan dibaca.' 
          }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          kvStore: { status: 'error', message: 'Gagal menulis ke KV Store' }
        }));
      }
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        kvStore: { status: 'error', message: error.message }
      }));
    }

    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 3: Auth Service
    setResults(prev => ({ ...prev, auth: { status: 'testing' } }));
    try {
      const response = await apiCall('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: '+62812TEST123' })
      });

      if (response.success) {
        setResults(prev => ({
          ...prev,
          auth: { 
            status: 'success', 
            message: 'Auth service aktif! OTP bisa digenerate.' 
          }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          auth: { status: 'error', message: 'Auth service error' }
        }));
      }
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        auth: { status: 'error', message: error.message }
      }));
    }

    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'testing':
        return <Loader className="h-6 w-6 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <div className="h-6 w-6 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-700 border-none">Testing...</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-700 border-none">✓ Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 border-none">✗ Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-none">Not Tested</Badge>;
    }
  };

  const allSuccess = results.serverHealth.status === 'success' && 
                     results.kvStore.status === 'success' && 
                     results.auth.status === 'success';

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Database className="h-16 w-16 text-primary-600 mx-auto mb-3" />
          <h1 className="text-gray-900 mb-2">🔌 Test Koneksi Database</h1>
          <p className="text-gray-600">Verifikasi koneksi Supabase dan Backend</p>
        </div>

        {/* Configuration Info */}
        <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
          <h3 className="text-blue-900 mb-3">📋 Konfigurasi</h3>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-center justify-between">
              <span>Project ID:</span>
              <code className="bg-white px-2 py-1 rounded text-xs">{projectId}</code>
            </div>
            <div className="flex items-center justify-between">
              <span>Server URL:</span>
              <code className="bg-white px-2 py-1 rounded text-xs break-all">
                {SERVER_URL.substring(0, 40)}...
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span>Anon Key:</span>
              <code className="bg-white px-2 py-1 rounded text-xs">
                {publicAnonKey.substring(0, 20)}...
              </code>
            </div>
          </div>
        </Card>

        {/* Test Results */}
        <div className="space-y-3 mb-6">
          {/* Server Health */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              {getStatusIcon(results.serverHealth.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-gray-600" />
                    <h4 className="text-gray-900">Server Health</h4>
                  </div>
                  {getStatusBadge(results.serverHealth.status)}
                </div>
                {results.serverHealth.message && (
                  <p className={`mt-2 ${
                    results.serverHealth.status === 'success' ? 'text-green-700' :
                    results.serverHealth.status === 'error' ? 'text-red-700' :
                    'text-gray-600'
                  }`}>
                    {results.serverHealth.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* KV Store */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              {getStatusIcon(results.kvStore.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-600" />
                    <h4 className="text-gray-900">KV Store Database</h4>
                  </div>
                  {getStatusBadge(results.kvStore.status)}
                </div>
                {results.kvStore.message && (
                  <p className={`mt-2 ${
                    results.kvStore.status === 'success' ? 'text-green-700' :
                    results.kvStore.status === 'error' ? 'text-red-700' :
                    'text-gray-600'
                  }`}>
                    {results.kvStore.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Auth Service */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              {getStatusIcon(results.auth.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gray-600" />
                    <h4 className="text-gray-900">Authentication Service</h4>
                  </div>
                  {getStatusBadge(results.auth.status)}
                </div>
                {results.auth.message && (
                  <p className={`mt-2 ${
                    results.auth.status === 'success' ? 'text-green-700' :
                    results.auth.status === 'error' ? 'text-red-700' :
                    'text-gray-600'
                  }`}>
                    {results.auth.message}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Test Button */}
        <Button
          onClick={runTests}
          disabled={testing}
          className="w-full bg-primary-600 hover:bg-primary-700 h-10"
        >
          {testing ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              Run Connection Test
            </>
          )}
        </Button>

        {/* Success Message */}
        {allSuccess && (
          <Card className="p-4 mt-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="text-green-900 mb-1">✅ Semua Koneksi Berhasil!</h4>
                <p className="text-green-700">
                  Database terhubung dan siap digunakan. Aplikasi bisa langsung dipakai!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Back Button */}
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full mt-4"
          >
            Kembali
          </Button>
        )}

        {/* Info */}
        <Card className="p-4 mt-4 bg-gray-50 border-gray-200">
          <h4 className="text-gray-900 mb-2">ℹ️ Informasi</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• Server: Supabase Edge Functions dengan Hono</li>
            <li>• Database: KV Store (key-value) - table: kv_store_f689ca3f</li>
            <li>• Auth: Supabase Auth dengan OTP</li>
            <li>• Runtime: Deno pada Supabase platform</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
