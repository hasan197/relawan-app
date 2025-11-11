# 🕌 ZISWAF Manager - Platform Manajemen Relawan Zakat Digital

Platform manajemen relawan zakat digital yang lengkap dengan fitur autentikasi, real-time chat, tracking donasi, dan analytics untuk memudahkan pengelolaan ZISWAF (Zakat, Infaq, Sedekah, Wakaf).

## ✨ Fitur Utama

### 🔐 Autentikasi & Keamanan
- **Login dengan OTP WhatsApp** - Autentikasi aman via nomor telepon
- **Registrasi Relawan** - Pendaftaran mudah dengan validasi lengkap
- **Session Management** - Auto-login dan persistent session
- **Role-based Access** - Relawan, Pembimbing, dan Admin

### 👥 Manajemen Muzakki
- **CRUD Muzakki Lengkap** - Tambah, edit, hapus muzakki dengan data tersimpan di Supabase
- **Status Tracking** - Baru, Follow-up, Donasi
- **Import Kontak** - Import dari CSV atau kontak ponsel
- **Search & Filter** - Cari berdasarkan nama, nomor, kota
- **Reminder Follow-up** - Notifikasi otomatis untuk muzakki yang perlu dihubungi

### 💰 Manajemen Donasi
- **Pencatatan Donasi Real-time** - Data tersimpan langsung di database
- **Kategori ZISWAF** - Zakat, Infaq, Sedekah, Wakaf
- **Generator Resi** - Buat resi donasi digital otomatis
- **Tracking Penyaluran** - Monitor donasi masuk dan keluar
- **Statistik Lengkap** - Total donasi, breakdown per kategori

### 📊 Analytics & Reporting
- **Dashboard Relawan** - Lihat performa dan target pribadi
- **Dashboard Admin** - Monitoring semua regu dan relawan
- **Leaderboard** - Ranking regu dan relawan terbaik
- **Export Laporan** - Download laporan dalam berbagai format
- **Real-time Statistics** - Data update otomatis

### 💬 Komunikasi & Kolaborasi
- **Chat Regu Real-time** - Komunikasi instant antar anggota regu
- **Template Pesan** - Template WhatsApp siap pakai
- **Materi Promosi** - Library gambar, video, caption untuk promosi
- **Ucapan Terima Kasih** - Generator ucapan untuk donatur
- **Log Komunikasi** - Riwayat interaksi dengan muzakki

### 🎯 Gamifikasi & Motivasi
- **Target & Progress** - Set dan track target pribadi dan regu
- **Leaderboard** - Kompetisi sehat antar regu
- **Achievement Badges** - Penghargaan untuk pencapaian
- **Progress Visualization** - Chart dan grafik motivasi

## 🚀 Teknologi

### Frontend
- **React 18** - UI library modern
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS
- **Shadcn/ui** - Component library premium
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Recharts** - Data visualization

### Backend
- **Supabase** - Backend as a Service
  - Authentication - OTP dan session management
  - Database - PostgreSQL dengan KV store
  - Real-time - WebSocket untuk chat
  - Storage - File upload (future feature)
- **Hono** - Edge function framework
- **Deno** - Server runtime

## 📱 Halaman Aplikasi (30+ Halaman)

### Autentikasi (4 halaman)
1. ✅ Splash Screen
2. ✅ Login Page
3. ✅ Register Page
4. ✅ OTP Verification
5. ✅ Onboarding

### Dashboard & Navigasi (4 halaman)
6. ✅ Dashboard Relawan
7. ✅ Daftar Muzakki/Donatur
8. ✅ Laporan & Statistik
9. ✅ Profil

### Manajemen Prospek (5 halaman)
10. ✅ Detail Prospek
11. ✅ Tambah Prospek
12. ✅ Import Kontak
13. ✅ Reminder Follow-up
14. ✅ Riwayat Aktivitas

### Digital Fundraising (5 halaman)
15. ✅ Template Pesan WhatsApp
16. ✅ Generator Resi Donasi
17. ✅ Ucapan Terima Kasih
18. ✅ Daftar Program
19. ✅ Detail Program

### Regu & Tim (3 halaman)
20. ✅ Regu Page
21. ✅ Chat Regu (Real-time)
22. ✅ Leaderboard

### Informasi & Komunikasi (3 halaman)
23. ✅ Notifikasi
24. ✅ Materi Promosi
25. ✅ Riwayat Aktivitas

### Settings & Admin (4 halaman)
26. ✅ Pengaturan
27. ✅ Admin Dashboard
28. ✅ Error Page
29. ✅ Offline Mode
30. ✅ Register Success

## 🗄️ Struktur Database (Supabase KV Store)

```typescript
// Users
user:{userId} = {
  id: string,
  full_name: string,
  phone: string,
  city: string,
  regu_id: string | null,
  role: 'relawan' | 'pembimbing' | 'admin',
  created_at: string
}

// Muzakki
muzakki:{relawanId}:{muzakkiId} = {
  id: string,
  relawan_id: string,
  name: string,
  phone: string,
  city: string,
  notes: string,
  status: 'baru' | 'follow-up' | 'donasi',
  created_at: string,
  last_contact: string
}

// Donations
donation:{relawanId}:{donationId} = {
  id: string,
  relawan_id: string,
  muzakki_id: string | null,
  amount: number,
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf',
  type: 'incoming' | 'outgoing',
  receipt_number: string,
  notes: string,
  created_at: string
}

// Communications
communication:{muzakkiId}:{commId} = {
  id: string,
  relawan_id: string,
  muzakki_id: string,
  type: 'call' | 'whatsapp' | 'meeting',
  notes: string,
  created_at: string
}

// Chat Messages
chat:{reguId}:{messageId} = {
  id: string,
  regu_id: string,
  sender_id: string,
  sender_name: string,
  message: string,
  created_at: string
}

// OTP (temporary)
otp:{phone} = {
  otp: string,
  expires_at: number
}
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Daftar relawan baru
- `POST /auth/send-otp` - Kirim OTP ke WhatsApp
- `POST /auth/verify-otp` - Verifikasi OTP dan login

### Muzakki Management
- `GET /muzakki?relawan_id={id}` - Get all muzakki
- `POST /muzakki` - Add new muzakki
- `PUT /muzakki/:id` - Update muzakki
- `DELETE /muzakki/:id` - Delete muzakki

### Donations
- `GET /donations?relawan_id={id}` - Get donations
- `POST /donations` - Add donation

### Communications
- `GET /communications/:muzakki_id` - Get communication log
- `POST /communications` - Log new communication

### Chat
- `GET /chat/:regu_id` - Get chat messages
- `POST /chat` - Send message

### Statistics
- `GET /statistics/:relawan_id` - Get relawan statistics

## 🎨 Design System

### Colors
- **Primary (Hijau):** `#10b981` - Melambangkan keberkahan
- **Accent (Kuning Pastel):** `#fbbf24` - Melambangkan keikhlasan
- **Secondary:** `#f3f4f6` - Background lembut
- **Success:** `#22c55e`
- **Warning:** `#f59e0b`
- **Error:** `#ef4444`

### Typography
- **Heading:** Poppins/Inter
- **Body:** System font stack
- **Sizes:** Predefined di globals.css

### Components
- **Cards:** Rounded-2xl dengan shadow-card
- **Buttons:** Rounded-lg dengan gradients
- **Inputs:** Rounded-lg dengan border focus
- **Badges:** Rounded-full dengan warna semantik

## 📦 Custom Hooks

```typescript
// useAuth - Authentication management
const { user, isAuthenticated, register, sendOTP, verifyOTP, logout } = useAuth();

// useMuzakki - Muzakki CRUD operations
const { muzakkiList, loading, addMuzakki, updateMuzakki, deleteMuzakki } = useMuzakki(relawanId);

// useDonations - Donation management
const { donations, addDonation, getTotalDonations, getDonationsByCategory } = useDonations(relawanId);

// useChat - Real-time chat
const { messages, loading, sendMessage } = useChat(reguId, userId);
```

## 🔄 State Management

Menggunakan **React Context API** dengan `AppProvider`:

```typescript
const { 
  user, 
  isAuthenticated, 
  muzakkiList, 
  donations,
  addMuzakki,
  addDonation,
  refetchAll 
} = useAppContext();
```

## 🚦 Cara Menggunakan

### 1. Register & Login
1. Buka aplikasi
2. Klik "Daftar Sekarang"
3. Isi data lengkap (nama, WA, kota)
4. Submit - akun tersimpan di Supabase
5. Masukkan nomor WhatsApp untuk login
6. Masukkan OTP yang diterima (untuk demo, OTP ditampilkan di notifikasi)
7. Complete onboarding

### 2. Menambah Muzakki
1. Go to Donatur page
2. Klik tombol "Tambah"
3. Isi form (nama, WA, kota, catatan)
4. Submit - data tersimpan di database
5. Data langsung muncul di list

### 3. Catat Donasi
1. Go to Dashboard
2. Klik "Salurkan" atau "Generator Resi"
3. Isi form donasi (donatur, nominal, kategori)
4. Generate resi
5. Data tersimpan dan statistik update otomatis

### 4. Chat dengan Regu
1. Go to Profil > Regu Saya
2. Klik "Chat Regu"
3. Ketik pesan dan send
4. Pesan tersimpan di database
5. Auto-refresh setiap 3 detik (polling)

### 5. Lihat Statistik
1. Go to Laporan page
2. Lihat breakdown donasi per kategori
3. Lihat leaderboard regu
4. Export laporan jika perlu

## 🔧 Environment Variables

Aplikasi ini sudah terintegrasi dengan Supabase. Environment variables sudah dikonfigurasi di `/utils/supabase/info.tsx`:
- `projectId` - Supabase project ID
- `publicAnonKey` - Supabase anon key

## 🛠️ Next Steps untuk Production

### 1. SMS/WhatsApp OTP Integration
- Setup Twilio untuk SMS OTP
- Atau WhatsApp Business API
- Remove demo OTP display

### 2. Supabase Realtime
- Ganti polling dengan Realtime subscriptions
- Instant chat updates
- Live notification

### 3. File Upload
- Implement Supabase Storage
- Upload bukti transfer
- Upload materi promosi

### 4. Push Notifications
- Service workers setup
- Browser notifications
- Reminder otomatis

### 5. Analytics Dashboard
- Google Analytics integration
- Custom events tracking
- User behavior analysis

### 6. Performance Optimization
- Code splitting
- Lazy loading pages
- Image optimization
- Bundle size reduction

### 7. Security Enhancement
- Row Level Security (RLS)
- API rate limiting
- CORS configuration
- Input sanitization

## 📄 License

This project is created for educational and non-commercial purposes.

## 🤝 Contributing

This is a demo project. For production use, please implement proper security measures and comply with data protection regulations.

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase**

**Berbagi Keberkahan, Raih Pahala** 🕌
