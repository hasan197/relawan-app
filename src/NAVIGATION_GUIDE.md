# 🧭 ZISWAF Manager - Panduan Navigasi

## ✅ DASHBOARD SEKARANG TERBUKA LANGSUNG!

Aplikasi sekarang **otomatis membuka Dashboard** saat pertama kali load.

---

## 📱 **NAVIGASI MOBILE (< 768px)**

### **Bottom Navigation (4 Menu Utama)**

```
┌─────────────────────────────────────┐
│                                     │
│        DASHBOARD CONTENT            │
│                                     │
│                                     │
└─────────────────────────────────────┘
┌─────┬─────┬─────┬─────┐
│ 🏠  │ 👥  │ 📊  │ 👤  │
│Home │Muzak│Lapor│Profi│
└─────┴─────┴─────┴─────┘
```

**Bottom Nav Menu:**
1. **🏠 Beranda** → Dashboard
2. **👥 Donatur** → Daftar Muzakki
3. **📊 Laporan** → Analytics & Reports
4. **👤 Profil** → User Profile

### **Cara Navigasi:**

#### **Dari Dashboard:**
- Klik **"👥 Donatur"** di bottom nav → Ke halaman Muzakki
- Klik **"📊 Laporan"** di bottom nav → Ke halaman Analytics
- Klik **"👤 Profil"** di bottom nav → Ke halaman Profile
- Klik **"+ Tambah"** button → Tambah muzakki baru
- Klik **"Salurkan"** button → Generator Resi
- Klik card "Template" → Template WhatsApp
- Klik card "Program" → Lihat program ZISWAF

#### **Dari Halaman Donatur:**
- Klik **"+ Tambah"** → Form tambah muzakki
- Klik card muzakki → Detail muzakki
- Klik **"🏠 Beranda"** → Kembali ke dashboard

#### **Dari Halaman Profil:**
- Klik **"Regu Saya"** → Info regu
- Klik **"Chat Regu"** (dalam Regu Saya) → Chat
- Klik **"Template Pesan"** → Template WA
- Klik **"Pengaturan"** → Settings
- Klik **"Logout"** → Keluar

---

## 🖥️ **NAVIGASI DESKTOP (≥ 1024px)**

### **Sidebar Navigation**

```
┌─────────┬────────────────────┐
│ LOGO    │  TOPBAR + SEARCH  │
├─────────┼────────────────────┤
│ Dashbrd │                    │
│ Muzakki │   CONTENT AREA     │
│ Laporan │                    │
│ Program │                    │
│ Regu    │                    │
│ Profil  │                    │
│─────────│                    │
│ Admin   │ (if admin role)    │
│─────────│                    │
│Settings │                    │
│ Logout  │                    │
└─────────┴────────────────────┘
```

**Sidebar Menu (Selalu Terlihat):**
1. 📊 **Dashboard** → Analytics & stats
2. 👥 **Muzakki** → Table data muzakki
3. 📈 **Laporan** → Reports & charts
4. 🎁 **Program** → Program ZISWAF
5. 💬 **Regu Saya** → Team chat
6. 👤 **Profil** → User profile
7. 🛡️ **Admin Panel** (if admin)
8. ⚙️ **Pengaturan** → Settings
9. 🚪 **Logout** → Sign out

### **Topbar (Sticky):**
- **🔍 Search Bar** → Cari muzakki, donasi
- **❓ Test DB** → Tes koneksi database
- **🔔 Notifikasi** → Alerts
- **⚙️ Settings** → Quick settings
- **User Avatar** → User menu

### **Cara Navigasi Desktop:**

#### **Klik Sidebar Menu:**
- **Dashboard** → Lihat stats, charts, activities
- **Muzakki** → Table dengan search & filter
- **Laporan** → Charts & leaderboard
- **Regu Saya** → Chat dengan team
- **Profil** → User info & settings

#### **Quick Actions di Dashboard:**
- **"+ Tambah Muzakki"** → Form tambah
- **"Catat Donasi"** → Generator resi
- **"Template WA"** → Template pesan
- **Period Selector** → Filter minggu/bulan/tahun

#### **Actions di Table Muzakki:**
- **📞 Call** → Telepon muzakki
- **💬 WhatsApp** → Buka WA
- **👁️ View** → Lihat detail
- **✏️ Edit** → Edit data
- **🗑️ Delete** → Hapus

---

## 🔄 **FLOW NAVIGASI LENGKAP**

### **Flow 1: Tambah Muzakki Baru**
```
Dashboard 
  → Klik "Tambah Muzakki" 
  → Isi form 
  → Save 
  → Kembali ke Dashboard/Muzakki
```

### **Flow 2: Catat Donasi**
```
Dashboard 
  → Klik "Salurkan" / "Generator Resi"
  → Pilih muzakki
  → Input nominal & kategori
  → Generate resi
  → Save
  → Dashboard (stats update otomatis)
```

### **Flow 3: Chat dengan Regu**
```
Desktop: Sidebar → Klik "Regu Saya"
Mobile: Profil → "Regu Saya" → "Chat Regu"
  → Ketik pesan
  → Send
  → Auto-refresh 3 detik
```

### **Flow 4: Lihat Laporan**
```
Klik "Laporan" (sidebar/bottom nav)
  → Lihat stats summary
  → Lihat charts
  → Tab "Top Muzakki"
  → Export laporan (desktop)
```

### **Flow 5: Test Koneksi Database**
```
Desktop: Topbar → Klik "Test DB"
Mobile: Dashboard → Menu → Test Connection
  → Klik "Run Connection Test"
  → Lihat hasil (Server, KV Store, Auth)
  → Klik "Kembali"
```

---

## 🎯 **SHORTCUT NAVIGASI**

### **Mobile Shortcuts:**
- **Swipe Right** → Buka menu (future)
- **Tap Bottom Nav** → Quick switch halaman
- **Back Button** → Kembali ke halaman sebelumnya

### **Desktop Shortcuts:**
- **Click Sidebar** → Langsung ke halaman
- **Click Logo** → Kembali ke dashboard
- **Click Search** → Focus search bar
- **Keyboard:** `Cmd/Ctrl + K` → Search (future)

---

## 📍 **CURRENT PAGE INDICATORS**

### **Mobile:**
- Bottom nav icon **berwarna hijau** = halaman aktif
- Bottom nav icon **abu-abu** = halaman lain

### **Desktop:**
- Sidebar item **background hijau** + text putih = halaman aktif
- Sidebar item **background putih** + text abu = halaman lain

---

## 🗺️ **SITEMAP LENGKAP**

```
ZISWAF Manager
├── 🏠 Dashboard (Default Page) ✅
│   ├── Stats Cards (4)
│   ├── Charts (3)
│   ├── Recent Activities
│   └── Quick Actions
│
├── 👥 Muzakki/Donatur
│   ├── Table View (Desktop)
│   ├── Card View (Mobile)
│   ├── + Tambah Muzakki
│   │   └── Form Input
│   ├── Detail Muzakki
│   └── Import Kontak
│
├── 📊 Laporan
│   ├── Summary Stats
│   ├── Trend Charts
│   ├── Category Breakdown
│   ├── Top Muzakki Leaderboard
│   └── Export Report
│
├── 👤 Profil
│   ├── User Info
│   ├── Edit Profile
│   ├── Regu Saya
│   │   └── Chat Regu ✅
│   ├── Template Pesan
│   ├── Materi Promosi
│   └── Pengaturan
│
├── 🎁 Program ZISWAF
│   ├── List Program
│   └── Detail Program
│
├── 📝 Generator Resi
│   ├── Input Donasi
│   └── Generate Receipt
│
├── 🔔 Notifikasi
│   └── List Notifications
│
├── 🛡️ Admin Dashboard (Admin Only)
│   ├── Global Stats
│   ├── Leaderboard Regu
│   └── Manage Users
│
└── 🔧 Utility Pages
    ├── Test Connection ✅
    ├── Login
    ├── Register
    ├── OTP Verification
    └── Onboarding
```

---

## ✅ **QUICK START GUIDE**

### **1. Baru Buka Aplikasi:**
✅ **Dashboard otomatis terbuka!**

### **2. Mobile User:**
1. Lihat dashboard dengan stats & charts
2. Gunakan **bottom navigation** untuk pindah halaman
3. Klik **"+ Tambah"** untuk tambah muzakki
4. Klik **👤 Profil** → **Regu Saya** → **Chat** untuk chat

### **3. Desktop User:**
1. Dashboard terbuka dengan sidebar di kiri
2. Klik menu di **sidebar** untuk navigasi
3. Gunakan **search bar** di topbar
4. Klik **"Test DB"** untuk test koneksi

### **4. Test Database:**
```
Desktop: Topbar → "Test DB" button
  atau
URL: Tambahkan #test di URL (future feature)
```

### **5. Logout:**
```
Mobile: Profil → Scroll down → Logout
Desktop: Sidebar bottom → Logout button (merah)
```

---

## 🎨 **VISUAL CUES**

### **Active Page:**
- **Mobile:** Bottom nav icon hijau + bold
- **Desktop:** Sidebar background hijau + shadow

### **Buttons:**
- **Primary (Hijau):** Action utama
- **Outline (Abu):** Secondary action
- **Red:** Delete/Logout

### **Status Badges:**
- **Biru:** Status "Baru"
- **Kuning:** Status "Follow-up"
- **Hijau:** Status "Donasi"

---

## 📱 **RESPONSIVE BEHAVIOR**

### **Auto-Switch:**
```
< 768px    → Mobile View (Bottom Nav)
768-1024px → Tablet View (Hybrid)
≥ 1024px   → Desktop View (Sidebar)
```

**Resize browser untuk lihat perubahan otomatis!**

---

## 🚀 **PRO TIPS**

1. **Dashboard = Home**
   - Klik logo ZISWAF (desktop) → Kembali ke dashboard
   - Klik 🏠 icon (mobile) → Kembali ke dashboard

2. **Quick Add Muzakki**
   - Desktop: Dashboard → "Tambah Muzakki" button
   - Mobile: Donatur → "+" floating button

3. **Fast Navigation**
   - Desktop: Sidebar selalu visible, klik kapan saja
   - Mobile: Bottom nav = 1 tap to any main page

4. **Test Database**
   - Desktop: Topbar → "Test DB" (quick access)
   - Gunakan untuk verify koneksi sebelum input data

5. **Export Data**
   - Desktop Laporan page → "Export" button
   - Download laporan dalam format CSV/Excel

---

## ✅ **CHECKLIST NAVIGASI**

- [x] Dashboard terbuka otomatis ✅
- [x] Bottom nav (mobile) working
- [x] Sidebar nav (desktop) working
- [x] Responsive auto-switch
- [x] Back buttons semua halaman
- [x] Test DB quick access
- [x] Logout accessible
- [x] Chat accessible
- [x] All 30+ pages reachable

---

## 🎉 **NAVIGASI LENGKAP & INTUITIF!**

**Dashboard sekarang langsung terbuka!**
**Gunakan bottom nav (mobile) atau sidebar (desktop) untuk navigasi.**

**Resize browser Anda untuk lihat responsive switching!** 📱 ↔️ 🖥️

---

**Last Updated:** November 9, 2025
