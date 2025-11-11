import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAppContext } from '../contexts/AppContext';
import { RefreshCw, ArrowLeft } from 'lucide-react';

interface DebugPageProps {
  onBack?: () => void;
}

export function DebugPage({ onBack }: DebugPageProps) {
  const { user, isAuthenticated, muzakkiList } = useAppContext();
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  const loadLocalStorage = () => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    
    setLocalStorageData({
      access_token: token,
      user: userStr ? JSON.parse(userStr) : null
    });
  };

  useEffect(() => {
    loadLocalStorage();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1>🔧 Debug Page</h1>
          <Button onClick={loadLocalStorage} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Auth Status */}
        <Card className="p-4">
          <h3 className="mb-3">🔐 Auth Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold w-40">Is Authenticated:</span>
              <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {isAuthenticated ? '✅ Yes' : '❌ No'}
              </span>
            </div>
          </div>
        </Card>

        {/* User Context */}
        <Card className="p-4">
          <h3 className="mb-3">👤 User Context (from useAppContext)</h3>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
            {JSON.stringify(user, null, 2)}
          </pre>
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold w-40">User ID:</span>
              <span className={user?.id ? 'text-green-600' : 'text-red-600'}>
                {user?.id || '❌ NOT FOUND'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-40">Full Name:</span>
              <span>{user?.full_name || '-'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-40">Phone:</span>
              <span>{user?.phone || '-'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-40">Role:</span>
              <span>{user?.role || '-'}</span>
            </div>
          </div>
        </Card>

        {/* Local Storage */}
        <Card className="p-4">
          <h3 className="mb-3">💾 Local Storage</h3>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-sm mb-2">Access Token:</p>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {localStorageData?.access_token || 'null'}
              </pre>
            </div>
            <div>
              <p className="font-semibold text-sm mb-2">User:</p>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(localStorageData?.user, null, 2) || 'null'}
              </pre>
            </div>
          </div>
        </Card>

        {/* Muzakki List */}
        <Card className="p-4">
          <h3 className="mb-3">📋 Muzakki List</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold w-40">Count:</span>
              <span>{muzakkiList.length} items</span>
            </div>
            {muzakkiList.length > 0 && (
              <div>
                <p className="font-semibold mb-2">Data:</p>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify(muzakkiList, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>

        {/* Console Commands */}
        <Card className="p-4">
          <h3 className="mb-3">🖥️ Console Commands</h3>
          <div className="space-y-2 text-sm bg-gray-900 text-green-400 p-4 rounded font-mono">
            <div># Check localStorage</div>
            <div>localStorage.getItem('user')</div>
            <div className="mt-3"># Check parsed user</div>
            <div>JSON.parse(localStorage.getItem('user'))</div>
            <div className="mt-3"># Check user ID</div>
            <div>JSON.parse(localStorage.getItem('user')).id</div>
          </div>
        </Card>

        {/* Issue Detection */}
        <Card className="p-4">
          <h3 className="mb-3">🚨 Issue Detection</h3>
          <div className="space-y-3">
            {!isAuthenticated && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 font-semibold">❌ Not Authenticated</p>
                <p className="text-red-600 text-sm">User is not logged in</p>
              </div>
            )}
            
            {isAuthenticated && !user?.id && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 font-semibold">❌ Missing User ID</p>
                <p className="text-red-600 text-sm">User object exists but ID is missing</p>
              </div>
            )}
            
            {isAuthenticated && user?.id && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-green-800 font-semibold">✅ All Good!</p>
                <p className="text-green-600 text-sm">User is authenticated with valid ID</p>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-4">
          <h3 className="mb-3">⚡ Actions</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                console.log('=== DEBUG INFO ===');
                console.log('isAuthenticated:', isAuthenticated);
                console.log('user:', user);
                console.log('user.id:', user?.id);
                console.log('localStorage.user:', localStorage.getItem('user'));
                console.log('muzakkiList:', muzakkiList);
                console.log('================');
              }}
            >
              Log to Console
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                loadLocalStorage();
              }}
            >
              Reload Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}