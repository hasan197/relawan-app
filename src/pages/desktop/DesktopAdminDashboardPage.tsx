import { ArrowLeft, Users, TrendingUp, Award, Settings, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { formatCurrency } from '../../lib/utils';
import { useAdminStats } from '../../hooks/useAdminStats';

interface DesktopAdminDashboardPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function DesktopAdminDashboardPage({ onBack, onNavigate }: DesktopAdminDashboardPageProps) {
  const { globalStats: stats, loading } = useAdminStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
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
                <h1 className="text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">Kelola sistem ZISWAF Manager</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onNavigate?.('admin-validasi-donasi')} variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                <CheckCircle className="h-4 w-4 mr-2" />
                Validasi Donasi
                {stats.pendingDonations && stats.pendingDonations > 0 && (
                  <Badge className="ml-2 bg-yellow-500">{stats.pendingDonations}</Badge>
                )}
              </Button>
              <Button onClick={() => onNavigate?.('admin-tools')} variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Admin Tools
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm">Total Relawan</p>
            </div>
            <p className="text-2xl text-gray-900 font-semibold">{stats?.total_relawan || 0}</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm">Total Donasi</p>
            </div>
            <p className="text-2xl text-primary-600 font-semibold">{formatCurrency(stats?.total_donations || 0)}</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-gray-600 text-sm">Total Relawan</p>
            </div>
            <p className="text-2xl text-gray-900 font-semibold">{stats?.total_regu || 0}</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-gray-600 text-sm">Total Muzakki</p>
            </div>
            <p className="text-2xl text-gray-900 font-semibold">{stats?.total_muzakki || 0}</p>
          </Card>
        </div>

        {/* Admin Tools */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Database className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Database Management</h3>
                <p className="text-gray-600 text-sm mb-4">Kelola database, reset, dan seed data testing</p>
                <Button onClick={() => onNavigate?.('admin-tools')} size="sm">
                  Kelola Database
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">System Logs</h3>
                <p className="text-gray-600 text-sm mb-4">Monitor aktivitas dan error sistem</p>
                <Button size="sm" variant="outline">
                  Lihat Logs
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
