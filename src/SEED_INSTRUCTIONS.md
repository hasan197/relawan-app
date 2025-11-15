# 🌱 ZISWAF MANAGER - DATABASE SEEDER

## Cara Menggunakan Seeder

Database seeder akan mengisi database dengan data dummy lengkap untuk testing dan development.

### 📊 Data yang Akan Dibuat:

- ✅ **13 Users** (1 Admin, 3 Pembimbing, 8+ Relawan)
- ✅ **3 Regu** dengan pembimbing dan anggota
- ✅ **5 Program ZISWAF** (Zakat, Infaq, Sedekah, Wakaf)
- ✅ **~50 Muzakki** (prospek donatur)
- ✅ **~40 Donations** dengan berbagai kategori
- ✅ **~30 Communications** (log komunikasi)
- ✅ **36 Chat Messages** (12 per regu)
- ✅ **30 Activities** (10 per regu)

---

## 🚀 Cara Menjalankan Seeder

### Method 1: Via cURL (Recommended)

```bash
curl -X POST https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/seed
```

**CATATAN**: Endpoint seed ini tidak memerlukan authorization header karena ini development-only endpoint.

### Method 2: Via Postman/Insomnia

- Method: `POST`
- URL: `https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/seed`
- Headers: (tidak perlu header khusus)
- Body: (kosong)

### Method 3: Via Browser Console

```javascript
fetch('https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/seed', {
  method: 'POST'
})
.then(res => res.json())
.then(data => {
  console.log('✅ Seeding complete!');
  console.log(data);
});
```

---

## 📱 Credentials untuk Testing

Setelah seeding berhasil, Anda bisa login dengan akun berikut:

### **Admin**
- Phone: `+6281234567890`
- Name: Admin ZISWAF
- Role: admin

### **Pembimbing**

| Phone | Name | Regu |
|-------|------|------|
| `+6281234567891` | Ustadz Abdullah Rahman | Regu Ar-Rahman |
| `+6281234567895` | Ustadzah Aisyah | Regu Al-Karim |
| `+6281234567899` | Ustadz Ibrahim | Regu As-Salam |

### **Relawan (Sample)**

| Phone | Name | Regu |
|-------|------|------|
| `+6281234567892` | Muhammad Hasan | Regu Ar-Rahman |
| `+6281234567893` | Fatimah Zahra | Regu Ar-Rahman |
| `+6281234567896` | Khadijah Aminah | Regu Al-Karim |
| `+6281234567897` | Umar Faruq | Regu Al-Karim |
| `+6281234567801` | Ali Akbar | Regu As-Salam |
| `+6281234567802` | Zaynab Husna | Regu As-Salam |

---

## 🔐 Cara Login

1. **Pastikan seeder sudah dijalankan** (lihat instruksi di atas)
2. Masukkan salah satu nomor phone dari daftar credentials di atas
3. Klik "Kirim OTP"
   - ✅ Jika nomor terdaftar: OTP akan dikirim dan muncul di console log
   - ❌ Jika nomor BELUM terdaftar: Error "Nomor ini belum terdaftar"
4. Lihat **OTP code di console log server** (karena belum ada SMS service)
5. Masukkan kode OTP (6 digit)
6. Login berhasil! ✨

**PENTING:** 
- User dari seeder TIDAK perlu register lagi, langsung bisa login
- Nomor yang belum di-seed harus register dulu via halaman Register
- OTP berbeda setiap kali request (valid 5 menit)

---

## 📋 Data yang Dibuat

### Regu (3 Regu)
- **Regu Ar-Rahman** - Target: Rp 50 juta
- **Regu Al-Karim** - Target: Rp 45 juta
- **Regu As-Salam** - Target: Rp 40 juta

### Programs (5 Programs)
1. **Sedekah Jumat Berkah** (Sedekah) - Target: Rp 100 juta
2. **Zakat Fitrah 1446H** (Zakat) - Target: Rp 500 juta
3. **Wakaf Sumur Palestina** (Wakaf) - Target: Rp 250 juta
4. **Beasiswa Anak Yatim** (Infaq) - Target: Rp 150 juta
5. **Bantuan Korban Bencana** (Infaq) - Target: Rp 200 juta (Completed)

### Muzakki
- Setiap relawan akan memiliki 5-8 muzakki
- Status: Baru, Follow-up, Donasi
- Kota: Jakarta, Tangerang, Bekasi, Depok, Bogor

### Donations
- Total donations: ~Rp 300+ juta
- Kategori: Zakat, Infaq, Sedekah, Wakaf
- Nominal: Rp 500K - Rp 5 juta per donasi

---

## ⚠️ PENTING!

1. **Jalankan seeder hanya sekali** - Jika dijalankan lagi, akan membuat data duplikat
2. **Development Only** - Seeder ini hanya untuk testing, JANGAN dijalankan di production
3. **OTP di Console** - Karena belum ada SMS service, OTP akan terlihat di console log server
4. **Phone Format** - Gunakan format lengkap dengan +62

---

## 🔄 Reset Database (Optional)

Jika ingin menghapus semua data dan mulai dari awal, sayangnya saat ini belum ada endpoint clear database karena keterbatasan KV store API.

Solusi:
1. Hapus dan buat ulang project Supabase
2. Atau hapus data manual via Supabase UI

---

## 📊 Checking Data

Setelah seeding, Anda bisa verify data dengan endpoints berikut:

```bash
# Check users
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-f689ca3f/users/phone/+6281234567892

# Check regus
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-f689ca3f/regus

# Check programs
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-f689ca3f/programs

# Check admin stats
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-f689ca3f/admin/stats/global
```

---

## 🎉 Happy Testing!

Setelah seeding berhasil, aplikasi ZISWAF Manager Anda akan terisi dengan data realistic untuk testing semua fitur:

- ✅ Multi-role access (Relawan, Pembimbing, Admin)
- ✅ Manajemen Muzakki dengan berbagai status
- ✅ Donations dengan kategori lengkap
- ✅ Chat Regu dengan real conversations
- ✅ Leaderboard dengan data performa regu
- ✅ Program ZISWAF dengan progress tracking
- ✅ Dashboard Admin dengan statistik lengkap

---

**Note**: Ganti `YOUR_PROJECT_ID` dengan project ID Supabase Anda yang sebenarnya.