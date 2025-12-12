# Manual Pengguna Sistem Relawan - Versi Mobile

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Instalasi & Login](#instalasi--login)
3. [Role Pengguna](#role-pengguna)
4. [Panduan Relawan](#panduan-relawan)
5. [Panduan Pembimbing](#panduan-pembimbing)
6. [Panduan Admin](#panduan-admin)
7. [Fitur Umum](#fitur-umum)
8. [Troubleshooting](#troubleshooting)

---

## Pendahuluan

Sistem Relawan adalah aplikasi mobile untuk mengelola kegiatan relawan, donasi, dan manajemen tim. Aplikasi ini dirancang untuk memudahkan relawan dalam melaksanakan tugas sehari-hari, melacak progress, dan berkolaborasi dengan tim.

### Fitur Utama:
- ✅ Manajemen Donatur (Muzakki)
- ✅ Pelacakan Donasi Real-time
- ✅ Manajemen Tim (Regu)
- ✅ Sistem Validasi Donasi
- ✅ Laporan dan Statistik
- ✅ Komunikasi Tim

---

## Instalasi & Login

### Persyaratan Sistem
- Android 8.0+ atau iOS 12+
- Koneksi internet stabil
- Nomor telepon aktif untuk OTP

### Cara Login
1. Buka aplikasi Relawan Dashboard
2. Masukkan nomor telepon Anda
3. Tunggu kode OTP dikirim via WhatsApp/SMS
4. Masukkan kode OTP yang diterima
5. Sistem akan otomatis mengenali role Anda

### First Time Setup
- **Relawan**: Isi data diri dan pilih/masuk regu
- **Pembimbing**: Konfirmasi data regu yang akan dibimbing
- **Admin**: Verifikasi akses administrator

---

## Role Pengguna

Sistem memiliki 3 role utama dengan akses berbeda:

### 🤝 Relawan
- Mengelola donatur pribadi
- Input donasi harian
- Melihat statistik pribadi
- Bergabung dengan regu

### 👨‍🏫 Pembimbing
- Memantau progress regu
- Validasi donasi anggota
- Koordinasi tim
- Laporan regu

### 👨‍💼 Admin
- Manajemen pengguna
- Validasi donasi sistem
- Laporan global
- Pengaturan sistem

---

## Panduan Relawan

### Dashboard Utama

**Beranda Relawan** menampilkan:
- 📊 Ringkasan donasi bulan ini
- 🎯 Progress target pribadi
- 📝 Aktivitas terbaru
- 🔔 Notifikasi penting

#### Navigasi Dashboard
```
┌─────────────────────────┐
│  📊 Total Donasi        │
│  💰 Rp 1.250.000        │
│  👥 3 Donatur Baru      │
├─────────────────────────┤
│  🎯 Target Bulanan      │
│  ████████░░ 80%         │
│  Rp 12.5M / Rp 15M      │
├─────────────────────────┤
│  📝 Aktivitas Terkini   │
│  • Donasi ke Ahmad      │
│  • Follow Up Siti       │
│  • Bergabung Regu X     │
└─────────────────────────┘
```

### Mengelola Donatur (Muzakki)

#### Menambah Donatur Baru
1. Klik menu **Donatur** di bottom navigation
2. Tekan tombol **+ Tambah Donatur**
3. Isi form:
   - Nama lengkap
   - Nomor telepon
   - Kota/domisili
   - Kategori: Baru/Follow Up/Donasi
   - Catatan (opsional)
4. Klik **Simpan**

#### Follow Up Donatur
1. Buka halaman **Donatur**
2. Cari donatur yang akan di-follow up
3. Klik nama donatur
4. Pilih **Follow Up**
5. Update status dan catat hasilnya

#### Status Donatur:
- **🟢 Baru**: Prospek baru yang belum dihubungi
- **🟡 Follow-up**: Sedang dalam proses pendekatan
- **🟣 Donasi**: Sudah pernah berdonasi

### Input Donasi

#### Cara Input Donasi
1. Buka menu **Donatur** di bottom navigation
2. Cari dan pilih donatur yang akan diberi donasi
3. Di halaman detail donatur, klik tombol **+ Tambah Donasi**
4. Isi form donasi:
   ```
   💰 Nominal: Rp 500.000
   📂 Kategori: [Zakat|Infaq|Sedekah|Wakaf]
   📅 Tanggal: [Otomatis hari ini]
   💳 Metode Pembayaran: [Tunai|Transfer|QRIS]
   📝 Catatan: (opsional)
   📷 Bukti Transfer: (Upload jika metode transfer)
   ```
5. Klik **Simpan Donasi**

#### Validasi Donasi
- Donasi akan masuk ke status **Menunggu Validasi**
- Admin akan menerima notifikasi donasi baru
- Status berubah menjadi **Tervalidasi** setelah disetujui admin
- Donatur akan menerima notifikasi donasi tervalidasi

### Manajemen Regu

#### Bergabung dengan Regu
1. Menu **Profil** → **Regu Saya**
2. Klik **Gabung Regu**
3. Scan QR Code regu atau masukkan kode regu
4. Tunggu persetujuan Pembimbing

#### Aktivitas Regu
- Lihat progress regu
- Chat dengan anggota regu
- Lihat leaderboard internal regu

### Laporan Pribadi

#### Mengakses Laporan
1. Menu **Laporan** di bottom navigation
2. Pilih periode laporan
3. Lihat statistik lengkap:
   - Total donasi
   - Jumlah donatur
   - Kategori donasi
   - Grafik perkembangan

#### Export Laporan
- Klik icon **Download** 
- Pilih format (PDF/Excel)
- Laporan akan di-download ke perangkat

---

## Panduan Pembimbing

### Dashboard Pembimbing

**Beranda Pembimbing** menampilkan:
- 📊 Statistik keseluruhan regu
- 👥 Daftar regu yang dibimbing
- ⏳ Donasi pending validasi
- 🏆 Performa anggota regu

#### Tampilan Dashboard:
```
┌─────────────────────────┐
│  👥 Regu Yang Dibimbing  │
│  • Regu Al-Ikhlas (8)    │
│  • Regu Al-Amanah (6)    │
├─────────────────────────┤
│  ⏳ Menunggu Validasi    │
│  📊 5 Donasi - Rp 2.1M   │
│  [Validasi Sekarang]     │
├─────────────────────────┤
│  🏆 Top Performer        │
│  1. Ahmad - Rp 5.2M      │
│  2. Siti - Rp 4.8M       │
│  3. Budi - Rp 3.9M       │
└─────────────────────────┘
```

### Validasi Donasi

#### Proses Validasi
1. Dari dashboard, klik **Validasi Donasi**
2. Daftar donasi pending akan muncul
3. Review setiap donasi:
   ```
   💰 Rp 500.000 - Zakat
   👤 Ahmad Syarif
   📅 08 Nov 2025
   📷 [Lihat Bukti Transfer]
   📝 Catatan: Donasi rutin
   
   [✅ Validasi] [❌ Tolak] [💬 Chat]
   ```
4. Klik **Validasi** jika disetujui
5. Berikan alasan jika menolak

#### Kriteria Validasi:
- ✅ Bukti transfer jelas
- ✅ Nominal sesuai
- ✅ Donatur terdaftar
- ✅ Kategori tepat

### Manajemen Regu

#### Memantau Progress Regu
1. Menu **Regu** → pilih regu
2. Lihat detail:
   - Total donasi regu
   - Target vs realisasi
   - Performa per anggota
   - Aktivitas terkini

#### Koordinasi Regu
- **Broadcast**: Kirim pesan ke semua anggota
- **Chat Grup**: Diskusi dengan regu
- **Reminder**: Set reminder donasi/follow-up

### Laporan Regu

#### Generate Laporan
1. Menu **Laporan** → **Laporan Regu**
2. Pilih regu dan periode
3. Pilih jenis laporan:
   - Summary donasi
   - Performa anggota
   - Kategori donasi
   - Trend analysis

#### Review Performa
- Identifikasi anggota berprestasi
- Deteksi anggota butuh bimbingan
- Planning target bulan depan

---

## Panduan Admin

### Dashboard Admin

**Beranda Admin** menampilkan:
- 📊 Statistik global sistem
- 💰 Total donasi masuk
- 👥 Total pengguna aktif
- ⚠️ Alert sistem penting

#### Overview Dashboard:
```
┌─────────────────────────┐
│  📊 Statistik Global     │
│  💰 Rp 125.500.000      │
│  👥 245 Relawan          │
│  🏆 15 Regu              │
├─────────────────────────┤
│  📈 Performa Bulanan     │
│  📊 Grafik Donasi        │
│  📊 Grafik Pertumbuhan   │
├─────────────────────────┤
│  ⚠️ System Alerts        │
│  • 8 Donasi pending      │
│  • 3 User baru           │
│  • Backup needed         │
└─────────────────────────┘
```

### Manajemen Pengguna

#### Kelola Relawan
1. Menu **Pengguna** → **Relawan**
2. Lihat daftar semua relawan
3. Aksi yang tersedia:
   - ✏️ Edit data relawan
   - 🔄 Reset password
   - 🚫 Suspended akun
   - 👁️ Lihat aktivitas

#### Kelola Pembimbing
1. Menu **Pengguna** → **Pembimbing**
2. Assign regu ke pembimbing
3. Monitor performa pembimbing

#### Tambah Pengguna Baru
1. Klik **+ Tambah Pengguna**
2. Pilih role (Relawan/Pembimbing/Admin)
3. Input data dasar
4. System akan kirim invite via WhatsApp

### Validasi Sistem

#### Validasi Donasi Global
1. Menu **Validasi** → **Semua Donasi**
2. Filter berdasarkan:
   - Status (Pending/Validated/Rejected)
   - Tanggal range
   - Kategori
   - Relawan
3. Mass validation:
   - Pilih multiple donasi
   - Klik **Validasi Semua**

#### Review Rejected Donations
- Analisis alasan penolakan
- Feedback ke relawan terkait
- Improve proses validasi

### Manajemen Regu

#### Create Regu Baru
1. Menu **Regu** → **+ Buat Regu**
2. Input data regu:
   ```
   📝 Nama Regu: Regu Al-Hikmah
   👨‍🏫 Pembimbing: [Pilih dari daftar]
   🎯 Target Bulanan: Rp 50.000.000
   📝 Deskripsi: (opsional)
   ```
3. Generate QR Code untuk invite

#### Monitor Semua Regu
- Lihat performa semua regu
- Compare antar regu
- Identifikasi regu butuh attention

### Laporan & Analytics

#### Global Reports
1. Menu **Laporan** → **Global**
2. Pilih jenis report:
   - Donasi keseluruhan
   - Pertumbuhan pengguna
   - Performa regu
   - Trend analysis

#### Export Data
- **CSV**: Untuk analysis di Excel
- **PDF**: Report formal
- **JSON**: Untuk integrasi sistem

### System Settings

#### Pengaturan Umum
1. Menu **Pengaturan** → **System**
2. Konfigurasi:
   - Target donasi default
   - Batas maksimal donasi
   - Auto-reminder settings
   - Backup schedule

#### Maintenance
- Backup database
- Clean up old data
- Update system parameters
- Monitor system health

---

## Fitur Umum

### Navigasi Aplikasi

#### Bottom Navigation (Mobile)
```
[🏠 Beranda] [👥 Donatur] [📊 Laporan] [👤 Profil]
```

#### Menu Utama (Swipe Right)
```
• 📊 Dashboard
• 👥 Donatur Saya
• 💬 Chat Regu
• 📝 Template Pesan
• ⚙️ Pengaturan
• ❓ Bantuan
• 🚪 Keluar
```

#### Side Menu (Admin/Pembimbing)
- Validasi Donasi
- Manajemen Regu  
- Pengaturan
- Bantuan
- Logout

### Notifikasi

#### Jenis Notifikasi:
- 🔔 **Donasi Masuk**: Donasi baru perlu validasi
- 👋 **New User**: Relawan baru bergabung
- 🎯 **Target Alert**: Target tercapai/terlampaui
- 💬 **New Message**: Pesan dari anggota regu
- ⚠️ **System**: Maintenance atau error

#### Push Notification Settings:
1. Menu **Pengaturan** → **Notifikasi**
2. Toggle sesuai kebutuhan:
   - Donasi updates
   - Team messages  
   - System alerts
   - Daily summary

### Search & Filter

#### Global Search:
- Cari donatur berdasarkan nama/telepon
- Cari donasi berdasarkan nominal/tanggal
- Cari relawan berdasarkan nama/regu

#### Advanced Filter:
- Filter berdasarkan tanggal
- Filter berdasarkan kategori
- Filter berdasarkan status
- Filter berdasarkan regu

### Offline Mode

#### Fitur Offline:
- ✅ View data yang sudah di-load
- ✅ Input donasi (sync saat online)
- ✅ Lihat profil donatur
- ❌ Input data baru (memerlukan koneksi)

#### Sync Process:
- Otomatis sync saat koneksi tersedia
- Manual sync: pull to refresh
- Indikator sync status di header

---

## Troubleshooting

### Common Issues

#### Login Problems
**Issue**: Tidak menerima kode OTP
**Solution**:
1. Cek nomor telepon sudah benar
2. Tunggu 2-3 menit, coba lagi
3. Cek folder spam SMS
4. Contact admin jika masih gagal

#### Sync Issues
**Issue**: Data tidak sync otomatis
**Solution**:
1. Cek koneksi internet
2. Pull to refresh
3. Force close dan buka kembali aplikasi
4. Clear cache jika perlu

#### Validation Errors
**Issue**: Donasi tidak bisa divalidasi
**Solution**:
1. Cek bukti transfer jelas
2. Pastikan nominal sesuai
3. Cek donatur sudah terdaftar
4. Contact admin untuk data bermasalah

#### Performance Issues
**Issue**: Aplikasi lambat
**Solution**:
1. Clear cache aplikasi
2. Update ke versi terbaru
3. Free up storage device
4. Restart device

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| AUTH_001 | Invalid OTP | Request new OTP |
| NET_001 | No Internet | Check connection |
| VAL_001 | Validation Failed | Check input data |
| SYNC_001 | Sync Error | Try manual sync |
| PERM_001 | Permission Denied | Contact admin |

### Contact Support

#### Self-Service:
- 📖 **FAQ**: Menu **Bantuan** → **FAQ**
- 📹 **Video Tutorial**: Menu **Bantuan** → **Tutorial**
- 📧 **Email**: support@relawan-system.com

#### Admin Contact:
- 📱 **Hotline**: +62 812-3456-7890
- 💬 **WhatsApp**: +62 812-3456-7890
- 📧 **Email**: admin@relawan-system.com

#### Emergency Support:
- 🚨 **Critical Issues**: 24/7 hotline
- 🕐 **Business Hours**: 08:00 - 17:00 WIB
- 📅 **Response Time**: < 2 hours (business hours)

---

## Quick Reference

### Shortcuts & Gestures

#### Mobile Gestures:
- **Swipe Right**: Open side menu
- **Pull to Refresh**: Sync data
- **Long Press**: Show context menu
- **Double Tap**: Zoom (images/reports)

#### Keyboard Shortcuts (Web/Desktop):
- **Ctrl+N**: New donation
- **Ctrl+D**: New donor  
- **Ctrl+R**: Refresh data
- **Ctrl+S**: Save/Submit

### Important Numbers

#### System Limits:
- Max donation per transaction: Rp 10.000.000
- Max donors per relawan: 100
- Max members per regu: 15
- File upload size: 5MB

#### Contact Hours:
- **Support**: 08:00 - 17:00 WIB
- **Emergency**: 24/7
- **Maintenance**: Every Sunday 02:00-04:00 WIB

---

## Version History

### v2.1.0 (Current)
- ✅ Enhanced mobile UI
- ✅ Offline mode support
- ✅ Batch validation
- ✅ Advanced reporting

### v2.0.0
- ✅ Real-time sync
- ✅ QR Code join regu
- ✅ Push notifications
- ✅ Performance improvements

### v1.0.0
- ✅ Basic donation tracking
- ✅ User management
- ✅ Simple reporting

---

*Manual ini diperbarui terakhir: 3 Desember 2025*
*Untuk informasi terbaru, kunjungi: help.relawan-system.com*
