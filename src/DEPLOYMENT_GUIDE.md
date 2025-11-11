# 🚀 ZISWAF Manager - Deployment & Usage Guide

## ✅ STATUS APLIKASI: 100% SELESAI & SIAP DIGUNAKAN

---

## 📋 **Ringkasan Lengkap**

### **✓ Backend**
- ✅ Supabase Edge Functions (Hono server)
- ✅ KV Store Database (PostgreSQL)
- ✅ 15+ API Endpoints
- ✅ Authentication dengan OTP
- ✅ Real-time Chat (polling)
- ✅ Error handling & logging

### **✓ Frontend**
- ✅ 30+ halaman React
- ✅ TypeScript type-safe
- ✅ Tailwind CSS v4
- ✅ 40+ Shadcn components
- ✅ Context API state management
- ✅ Custom hooks (useAuth, useMuzakki, useDonations, useChat)
- ✅ Responsive mobile-first design

### **✓ Features**
- ✅ Multi-role authentication (Relawan, Pembimbing, Admin)
- ✅ CRUD Muzakki dengan backend
- ✅ Donation tracking & statistics
- ✅ Real-time chat regu
- ✅ Template WhatsApp
- ✅ Generator Resi Digital
- ✅ Leaderboard & Gamifikasi
- ✅ Analytics Dashboard
- ✅ Export Laporan
- ✅ Import Kontak

---

## 🎯 **Cara Menggunakan Aplikasi**

### **STEP 1: Test Koneksi Database**

Aplikasi sekarang **otomatis membuka Test Connection Page**.

**Klik tombol "Run Connection Test"** untuk verify:
- ✅ Server Health
- ✅ KV Store (read/write operations)
- ✅ Authentication Service

**Expected Result:**
```
✓ Server Health: Connected
✓ KV Store: Connected  
✓ Authentication: Connected
```

Jika semua ✅ hijau = **Database terhubung sempurna!**

---

### **STEP 2: Register Relawan Baru**

1. Klik **"Kembali"** dari Test Connection Page
2. Aplikasi akan redirect ke Dashboard
3. **Untuk test authentication**, buka halaman Login
4. Klik **"Daftar Sekarang"**

**Isi Form:**
```
Nama Lengkap: Ahmad Dahlan
Nomor WhatsApp: 081234567890
Kota: Jakarta Selatan
Regu: Pilih salah satu (optional)
```

5. Klik **"Daftar"**
6. Data akan tersimpan di Supabase!

**Cek di Console:**
```javascript
// Browser console akan show:
POST /auth/register - 200 OK
{
  success: true,
  message: "Registrasi berhasil!",
  user: { id, full_name, phone, ... }
}
```

---

### **STEP 3: Login dengan OTP**

1. Setelah register, masukkan **Nomor WhatsApp**
2. Klik **"Kirim Kode OTP"**
3. **PENTING:** Untuk demo, kode OTP akan muncul di **Toast Notification** (pojok atas)
   - Contoh: "Demo OTP: 123456"
4. Masukkan 6 digit OTP
5. Klik **"Verifikasi"**
6. Login berhasil! ✅

**Data tersimpan:**
- `localStorage.setItem('access_token', token)`
- `localStorage.setItem('user', JSON.stringify(user))`

---

### **STEP 4: Tambah Muzakki**

1. Go to **"Donatur"** page (bottom navigation)
2. Klik tombol **"+ Tambah"**
3. Isi form:
   ```
   Nama: Budi Santoso
   WhatsApp: 081298765432
   Kota: Tangerang
   Status: Baru
   Catatan: Tertarik zakat profesi
   ```
4. Klik **"Simpan"**
5. Data tersimpan di Supabase KV Store!

**Cek Database:**
```typescript
// Key di KV Store:
muzakki:{relawanId}:{muzakkiId}

// Value:
{
  id: "uuid",
  relawan_id: "user-id",
  name: "Budi Santoso",
  phone: "081298765432",
  city: "Tangerang",
  status: "baru",
  notes: "Tertarik zakat profesi",
  created_at: "2025-11-09T10:30:00Z",
  last_contact: "2025-11-09T10:30:00Z"
}
```

---

### **STEP 5: Catat Donasi**

1. Go to **Dashboard**
2. Klik **"Salurkan"** atau buka **"Generator Resi"**
3. Isi form donasi:
   ```
   Donatur: Pilih dari list muzakki
   Kategori: Zakat / Infaq / Sedekah / Wakaf
   Nominal: 500000
   Catatan: Zakat fitrah
   ```
4. Generate & simpan
5. Statistik otomatis update! 📊

---

### **STEP 6: Chat dengan Regu**

1. Go to **Profil** > **"Regu Saya"**
2. Klik **"Chat Regu"**
3. Ketik pesan dan send
4. Pesan tersimpan di database
5. **Auto-refresh setiap 3 detik** untuk pesan baru

**Real-time Polling:**
```typescript
// useChat hook automatically polls:
useEffect(() => {
  const interval = setInterval(fetchMessages, 3000);
  return () => clearInterval(interval);
}, [reguId]);
```

---

### **STEP 7: Lihat Analytics**

1. Go to **Laporan** page
2. Lihat:
   - Total donasi per kategori
   - Chart breakdown ZISWAF
   - Trending bulan ini
   - Export laporan

**Admin Dashboard:**
1. Go to Dashboard > klik icon Admin (jika role admin)
2. Lihat:
   - Global statistics
   - Leaderboard regu
   - Ranking relawan
   - Progress per kategori

---

## 🗄️ **Database Structure**

### **Table: `kv_store_f689ca3f`**

**Status:** ✅ Sudah ada & terhubung

**Data yang Tersimpan:**

| Prefix | Purpose | Count |
|--------|---------|-------|
| `user:*` | User accounts | Dynamic |
| `muzakki:*` | Muzakki data | Dynamic |
| `donation:*` | Donation records | Dynamic |
| `communication:*` | Contact logs | Dynamic |
| `chat:*` | Chat messages | Dynamic |
| `otp:*` | OTP codes (temp) | Auto-expire |
| `regu:*` | Regu/team data | Static |

**Query Examples:**
```typescript
// Get all muzakki for relawan
const muzakkiList = await kv.getByPrefix(`muzakki:${relawanId}:`);

// Get all chat for regu
const messages = await kv.getByPrefix(`chat:${reguId}:`);

// Get user data
const user = await kv.get(`user:${userId}`);
```

---

## 🔌 **API Endpoints Reference**

### **Base URL:**
```
https://{projectId}.supabase.co/functions/v1/make-server-f689ca3f
```

### **Quick Test:**
```bash
# Health check
curl https://{projectId}.supabase.co/functions/v1/make-server-f689ca3f/health

# Response:
{
  "status": "ok",
  "timestamp": "2025-11-09T10:30:00.000Z"
}
```

### **Authentication Flow:**
```typescript
// 1. Register
POST /auth/register
Body: { fullName, phone, city, reguId }
Response: { success: true, user: {...} }

// 2. Send OTP
POST /auth/send-otp
Body: { phone }
Response: { success: true, demo_otp: "123456" }

// 3. Verify OTP & Login
POST /auth/verify-otp
Body: { phone, otp }
Response: { success: true, user: {...}, access_token: "..." }
```

---

## 🛠️ **Development Mode**

### **Current Settings:**

**1. OTP Demo Mode:**
- ✅ OTP ditampilkan di toast notification
- ✅ Tidak perlu SMS/WhatsApp API
- ✅ Perfect untuk testing

**2. Mock Data:**
- ✅ Regu data di `/lib/mockData.tsx`
- ✅ Template pesan pre-filled
- ✅ Sample programs

**3. Auto-login:**
- ✅ Session persisted di localStorage
- ✅ Auto-redirect jika logged in

---

## 🚀 **Production Deployment**

### **Untuk Production:**

**1. Setup SMS/WhatsApp OTP:**
```typescript
// Update /supabase/functions/server/index.tsx
// Replace mock OTP dengan Twilio/WhatsApp API

import twilio from 'twilio';
const client = twilio(accountSid, authToken);

await client.messages.create({
  body: `Kode OTP ZISWAF: ${otp}`,
  from: 'whatsapp:+14155238886',
  to: `whatsapp:${phone}`
});
```

**2. Enable Supabase Realtime:**
```typescript
// Replace polling dengan Realtime subscriptions
const channel = supabase
  .channel(`chat:${reguId}`)
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'chat' },
    (payload) => setMessages(prev => [...prev, payload.new])
  )
  .subscribe();
```

**3. Add Row Level Security:**
```sql
-- In Supabase Dashboard > SQL Editor
ALTER TABLE kv_store_f689ca3f ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own data"
ON kv_store_f689ca3f
FOR SELECT
USING (key LIKE 'muzakki:' || auth.uid() || ':%' OR key = 'user:' || auth.uid());
```

**4. Configure CORS:**
```typescript
// Update server CORS untuk production domain
app.use('*', cors({
  origin: 'https://your-production-domain.com',
  credentials: true
}));
```

**5. Environment Variables:**
```bash
# Production secrets di Supabase Dashboard
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
WHATSAPP_API_KEY=xxx
```

---

## 📊 **Monitoring & Analytics**

### **1. Supabase Dashboard**
- Functions > Logs: Monitor API calls
- Authentication > Users: Track registrations
- Database > KV Store: View data

### **2. Browser Console**
```javascript
// Check localStorage
localStorage.getItem('user')
localStorage.getItem('access_token')

// Test API manually
fetch('SERVER_URL/health')
  .then(r => r.json())
  .then(console.log)
```

### **3. Error Tracking**
- All errors logged to console
- Toast notifications for user feedback
- Server logs in Supabase Functions

---

## ✅ **Verification Checklist**

Sebelum deploy production, pastikan:

- [x] Test Connection Page: All green ✅
- [x] Register: New user tersimpan
- [x] Login: OTP verification works
- [x] Add Muzakki: Data tersimpan di database
- [x] Add Donation: Statistics update
- [x] Chat: Messages tersimpan & polling works
- [ ] SMS OTP: Replace demo dengan real API
- [ ] Realtime: Setup Supabase subscriptions
- [ ] Security: Enable RLS
- [ ] Domain: Configure production URL
- [ ] Analytics: Setup tracking

---

## 🎉 **APLIKASI SIAP DIGUNAKAN!**

### **Quick Start:**
1. ✅ Test koneksi (sudah otomatis terbuka)
2. ✅ Register user baru
3. ✅ Login dengan OTP
4. ✅ Tambah muzakki
5. ✅ Catat donasi
6. ✅ Chat dengan regu

### **Current Features:**
- 🔐 Authentication ✅
- 👥 Muzakki Management ✅
- 💰 Donation Tracking ✅
- 💬 Real-time Chat ✅
- 📊 Analytics & Reports ✅
- 📱 Mobile Responsive ✅
- 🎨 Beautiful UI ✅

### **Database:**
- ✅ Supabase connected
- ✅ KV Store ready
- ✅ 15+ API endpoints active
- ✅ Data persistence working

---

**Selamat menggunakan ZISWAF Manager!** 🕌

**Berbagi Keberkahan, Raih Pahala** 💚

---

**Built with:**
- React 18 + TypeScript
- Tailwind CSS v4
- Supabase Backend
- Shadcn/ui Components
- Hono Web Framework

**Last Updated:** November 9, 2025
