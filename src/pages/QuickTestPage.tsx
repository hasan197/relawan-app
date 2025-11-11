import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { apiCall } from '../lib/supabase';

interface QuickTestPageProps {
  onBack?: () => void;
}

export function QuickTestPage({ onBack }: QuickTestPageProps) {
  const [phone, setPhone] = useState('08123456789');
  const [name, setName] = useState('Test User');
  const [city, setCity] = useState('Jakarta');
  const [otp, setOtp] = useState('');
  const [currentOtp, setCurrentOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Register
  const handleRegister = async () => {
    setLoading(true);
    try {
      console.log('📝 Registering user:', { name, phone, city });
      
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: name,
          phone: phone,
          city: city,
          reguId: null
        })
      });

      console.log('✅ Register response:', response);
      
      if (response.success) {
        toast.success('✅ Registrasi berhasil!');
      } else {
        toast.error(response.error || 'Registrasi gagal');
      }
    } catch (error: any) {
      console.error('❌ Register error:', error);
      toast.error(error.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send OTP
  const handleSendOTP = async () => {
    setLoading(true);
    try {
      console.log('📱 Sending OTP to:', phone);
      
      const response = await apiCall('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone })
      });

      console.log('✅ Send OTP response:', response);
      
      if (response.success) {
        setCurrentOtp(response.demo_otp || '');
        toast.success('✅ OTP dikirim!');
        
        if (response.demo_otp) {
          toast.info(`🔑 OTP Anda: ${response.demo_otp}`, { 
            duration: 10000 
          });
          
          console.log('\n═══════════════════════════════════════════');
          console.log('📱 KODE OTP VERIFIKASI');
          console.log('═══════════════════════════════════════════');
          console.log(`Phone: ${phone}`);
          console.log(`OTP: ${response.demo_otp}`);
          console.log('═══════════════════════════════════════════\n');
        }
      } else {
        toast.error(response.error || 'Gagal mengirim OTP');
      }
    } catch (error: any) {
      console.error('❌ Send OTP error:', error);
      toast.error(error.message || 'Gagal mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      console.log('🔐 Verifying OTP:', { phone, otp });
      
      const response = await apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp })
      });

      console.log('✅ Verify OTP response:', response);
      
      if (response.success) {
        console.log('👤 User data:', response.user);
        console.log('🔑 Access token:', response.access_token);
        console.log('🆔 User ID:', response.user?.id);
        
        // Save to localStorage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Verify save
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('access_token');
        
        console.log('✅ Saved to localStorage:');
        console.log('- User:', savedUser);
        console.log('- Token:', savedToken);
        
        toast.success('✅ Login berhasil!');
        toast.info('🔄 Refresh halaman untuk masuk ke dashboard');
        
        // Reload after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.error || 'Verifikasi OTP gagal');
      }
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error);
      toast.error(error.message || 'Verifikasi OTP gagal');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Add Muzakki
  const handleAddMuzakki = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        toast.error('❌ Belum login! Login dulu.');
        return;
      }
      
      console.log('➕ Adding muzakki for user:', user.id);
      
      const muzakkiData = {
        relawan_id: user.id,
        name: 'Ahmad Muzakki',
        phone: '08123456789',
        city: 'Jakarta',
        status: 'baru',
        notes: 'Test muzakki 1'
      };
      
      const response = await apiCall('/muzakki', {
        method: 'POST',
        body: JSON.stringify(muzakkiData)
      });

      console.log('✅ Add muzakki response:', response);
      
      if (response.success) {
        toast.success('✅ Muzakki berhasil ditambahkan!');
      } else {
        toast.error(response.error || 'Gagal menambah muzakki');
      }
    } catch (error: any) {
      console.error('❌ Add muzakki error:', error);
      toast.error(error.message || 'Gagal menambah muzakki');
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Check Muzakki
  const handleCheckMuzakki = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        toast.error('❌ Belum login! Login dulu.');
        return;
      }
      
      console.log('🔍 Fetching muzakki for user:', user.id);
      
      const response = await apiCall(`/muzakki?relawan_id=${user.id}`);

      console.log('✅ Fetch muzakki response:', response);
      console.log('📊 Muzakki count:', response.data?.length || 0);
      console.log('📦 Muzakki data:', response.data);
      
      if (response.success) {
        toast.success(`✅ Ditemukan ${response.data?.length || 0} muzakki`);
      } else {
        toast.error(response.error || 'Gagal fetch muzakki');
      }
    } catch (error: any) {
      console.error('❌ Fetch muzakki error:', error);
      toast.error(error.message || 'Gagal fetch muzakki');
    } finally {
      setLoading(false);
    }
  };

  // Check localStorage
  const handleCheckLocalStorage = () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    console.log('\n═══════════════════════════════════════════');
    console.log('📦 LOCALSTORAGE CHECK');
    console.log('═══════════════════════════════════════════');
    console.log('User:', user);
    console.log('Token:', token);
    console.log('Parsed User:', user ? JSON.parse(user) : null);
    console.log('═══════════════════════════════════════════\n');
    
    if (user && token) {
      toast.success('✅ LocalStorage OK');
    } else {
      toast.error('❌ LocalStorage kosong - belum login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">🧪 Quick Test Page</h1>
          <p className="text-gray-600 mb-4">
            Test register, login, dan add muzakki dengan mudah
          </p>
        </Card>

        {/* Step 1: Register */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">1️⃣ Register User</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ahmad Muzakki"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nomor WhatsApp</label>
              <Input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kota</label>
              <Input 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jakarta"
              />
            </div>
            <Button 
              onClick={handleRegister}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Register'}
            </Button>
          </div>
        </Card>

        {/* Step 2: Send OTP */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">2️⃣ Send OTP</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nomor WhatsApp</label>
              <Input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
              />
            </div>
            <Button 
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Kirim OTP'}
            </Button>
            {currentOtp && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm font-medium text-green-900">
                  🔑 OTP Code: <span className="text-2xl font-mono">{currentOtp}</span>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Step 3: Verify OTP */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">3️⃣ Verify OTP & Login</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Kode OTP (6 digit)</label>
              <Input 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <Button 
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Verify OTP & Login'}
            </Button>
          </div>
        </Card>

        {/* Step 4: Add Muzakki */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">4️⃣ Add Muzakki</h2>
          <p className="text-sm text-gray-600 mb-3">
            (Pastikan sudah login dulu!)
          </p>
          <Button 
            onClick={handleAddMuzakki}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : 'Add Test Muzakki'}
          </Button>
        </Card>

        {/* Step 5: Check Data */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">5️⃣ Check Data</h2>
          <div className="space-y-2">
            <Button 
              onClick={handleCheckMuzakki}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? 'Loading...' : 'Check Muzakki Data'}
            </Button>
            <Button 
              onClick={handleCheckLocalStorage}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Check LocalStorage
            </Button>
          </div>
        </Card>

        {/* Console Info */}
        <Card className="p-6 bg-blue-50">
          <h3 className="font-bold mb-2">💡 Instructions:</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Register user terlebih dahulu</li>
            <li>Kirim OTP (lihat kode di notifikasi atau console)</li>
            <li>Copy OTP code dan paste di Step 3</li>
            <li>Verify OTP untuk login</li>
            <li>Setelah login, add muzakki</li>
            <li>Check data untuk verifikasi</li>
          </ol>
          <p className="text-sm mt-3 font-medium">
            📝 Semua log akan muncul di browser console (F12)
          </p>
        </Card>
      </div>
    </div>
  );
}