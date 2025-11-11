import { useState } from 'react';
import { ArrowLeft, Shield, UserCog, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useAuth } from '../hooks/useAuth';

interface AdminToolsPageProps {
  onBack?: () => void;
}

export function AdminToolsPage({ onBack }: AdminToolsPageProps) {
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<'relawan' | 'pembimbing' | 'admin'>('pembimbing');
  const [isLoading, setIsLoading] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<any>(null);
  const { user: currentUser, refreshUser } = useAuth();

  const handleUpdateRole = async () => {
    if (!phone) {
      toast.error('Nomor WhatsApp harus diisi');
      return;
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? `+62${cleanPhone.substring(1)}` : cleanPhone.startsWith('62') ? `+${cleanPhone}` : `+62${cleanPhone}`;

    setIsLoading(true);
    setUpdatedUser(null);

    try {
      console.log('🔄 Updating user role:', { phone: formattedPhone, role: selectedRole });

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f689ca3f/users/${formattedPhone}/role`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role: selectedRole })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal update role');
      }

      console.log('✅ Role updated:', data);
      toast.success(data.message || 'Role berhasil diubah!');
      setUpdatedUser(data.user);
      setPhone('');

      // If the updated user is the current user, refresh their data
      if (currentUser && currentUser.phone === data.user.phone) {
        console.log('🔄 Refreshing current user data...');
        await refreshUser();
        toast.info('✅ Data Anda telah diperbarui!', {
          description: 'Perubahan role sudah aktif. Anda sekarang bisa membuat regu.',
          duration: 5000
        });
      }

    } catch (error: any) {
      console.error('❌ Update role error:', error);
      toast.error(error.message || 'Gagal update role');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: 'relawan', label: 'Relawan', color: 'bg-blue-100 text-blue-700' },
    { value: 'pembimbing', label: 'Pembimbing', color: 'bg-green-100 text-green-700' },
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-700' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-white">Admin Tools</h2>
        </div>
        <div className="flex items-center gap-2 text-white/90">
          <Shield className="h-4 w-4" />
          <span className="text-sm">Management & Configuration</span>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Update User Role Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <UserCog className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Update User Role</h3>
              <p className="text-gray-600 text-sm">Change user role permissions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Nomor WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="081316056909"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: 08xxx atau +62xxx
              </p>
            </div>

            <div>
              <Label>Pilih Role Baru</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedRole === role.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <Badge className={`${role.color} border-none text-xs mb-1`}>
                        {role.label}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleUpdateRole}
              disabled={isLoading || !phone}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Updating...' : 'Update Role'}
            </Button>
          </div>
        </Card>

        {/* Success Result */}
        {updatedUser && (
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-1" />
              <div className="flex-1">
                <h4 className="text-green-900 mb-2">✅ Role Updated Successfully</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <strong>Nama:</strong> {updatedUser.full_name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> {updatedUser.phone}
                  </p>
                  <p className="text-gray-700">
                    <strong>New Role:</strong>{' '}
                    <Badge className={
                      updatedUser.role === 'admin' ? 'bg-purple-100 text-purple-700 border-none' :
                      updatedUser.role === 'pembimbing' ? 'bg-green-100 text-green-700 border-none' :
                      'bg-blue-100 text-blue-700 border-none'
                    }>
                      {updatedUser.role}
                    </Badge>
                  </p>
                  <p className="text-gray-700">
                    <strong>Regu:</strong> {updatedUser.regu_id || 'Belum ditentukan'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="text-blue-900 mb-2 text-sm">ℹ️ Role Permissions</h4>
          <ul className="space-y-1 text-xs text-gray-700">
            <li>• <strong>Relawan:</strong> Basic access, no QR code generation</li>
            <li>• <strong>Pembimbing:</strong> Can generate QR code, manage regu</li>
            <li>• <strong>Admin:</strong> Full access to all features</li>
          </ul>
        </Card>

        {/* Quick Actions */}
        <Card className="p-4">
          <h4 className="text-gray-900 mb-3">Quick Set Role</h4>
          <div className="space-y-2">
            <Button
              onClick={() => {
                setPhone('081316056909');
                setSelectedRole('pembimbing');
              }}
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              Set 081316056909 → Pembimbing
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}