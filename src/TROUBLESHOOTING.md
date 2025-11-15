# 🔧 ZISWAF MANAGER - TROUBLESHOOTING

## ❌ Error: "User tidak ditemukan. Silakan daftar terlebih dahulu."

**Penyebab:**
- Nomor WhatsApp yang dimasukkan belum ada di database
- Seeder belum dijalankan
- Nomor salah ketik

**Solusi:**
1. ✅ **Pastikan seeder sudah dijalankan:**
   ```bash
   curl -X POST https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/seed
   ```

2. ✅ **Gunakan nomor yang benar dari seed data:**
   - Admin: `+6281234567890`
   - Pembimbing: `+6281234567891`, `+6281234567895`, `+6281234567899`
   - Relawan: `+6281234567892`, `+6281234567893`, dll

3. ✅ **Verify user exists di database:**
   ```bash
   curl https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/users/phone/+6281234567892
   ```

4. ✅ **Jika nomor belum terdaftar:**
   - Gunakan halaman Register untuk buat akun baru
   - Atau gunakan nomor yang sudah di-seed

---

## ❌ Error: "Nomor ini belum terdaftar. Silakan daftar terlebih dahulu."

**Penyebab:**
- Ini adalah flow yang benar! System mengecek user exist sebelum kirim OTP

**Solusi:**
1. **Untuk testing:** Gunakan nomor dari seed data (lihat SEED_INSTRUCTIONS.md)
2. **Untuk user baru:** Klik "Register" dan buat akun baru terlebih dahulu
3. **Verify seeder status:** Check apakah seed sudah berhasil

---

## ❌ Error: "OTP tidak valid atau sudah kadaluarsa"

**Penyebab:**
- OTP sudah expired (lebih dari 5 menit)
- OTP salah ketik
- Belum request OTP

**Solusi:**
1. ✅ Request OTP baru dengan klik "Kirim OTP"
2. ✅ Check console log server untuk melihat OTP code
3. ✅ Masukkan 6 digit OTP dengan benar
4. ✅ Input OTP dalam waktu 5 menit

---

## ❌ Error: "Kode OTP salah"

**Penyebab:**
- OTP yang dimasukkan tidak sesuai dengan yang di-generate

**Solusi:**
1. ✅ **Lihat OTP di console log server:**
   - Buka Supabase Dashboard → Functions → Logs
   - Cari section "📱 OTP VERIFICATION CODE"
   - Copy 6 digit OTP code

2. ✅ **Atau cek response dari send-otp:**
   - Response API include `demo_otp` field
   - Check di Network tab browser (DevTools)

---

## 🔍 How to Check Console Log for OTP

### Method 1: Supabase Dashboard
1. Buka https://supabase.com/dashboard
2. Pilih project ZISWAF Manager
3. Menu sidebar → Functions → Logs
4. Filter untuk "make-server-f689ca3f"
5. Cari log dengan format:
   ```
   ═══════════════════════════════════════════
   📱 OTP VERIFICATION CODE
   ═══════════════════════════════════════════
   Phone: +6281234567892
   Name: Muhammad Hasan
   Role: relawan
   OTP Code: 123456
   Expires: 5 minutes
   ═══════════════════════════════════════════
   ```

### Method 2: Browser DevTools (demo_otp)
1. Buka DevTools (F12)
2. Tab Network
3. Request OTP via UI
4. Klik request "/auth/send-otp"
5. Tab Response
6. Lihat field `demo_otp`

---

## 📱 Test Login Flow

### Flow Lengkap:

```
1. User Input: +6281234567892
   ↓
2. Klik "Kirim OTP"
   ↓
3. System Check: User exists? ✅
   ↓
4. Generate OTP: 123456
   ↓
5. Save to KV: otp:+6281234567892
   ↓
6. Log to Console: 📱 OTP CODE: 123456
   ↓
7. User Input OTP: 123456
   ↓
8. Verify OTP matches ✅
   ↓
9. Generate token: ziswaf_{userId}_{timestamp}
   ↓
10. Return user data + token
    ↓
11. Login Success! 🎉
```

---

## 🧪 Quick Test Commands

### 1. Test Seeder
```bash
curl -X POST https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/seed
```

### 2. Check User Exists
```bash
curl https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/users/phone/+6281234567892
```

### 3. Get All Regus
```bash
curl https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/regus
```

### 4. Get Admin Stats
```bash
curl https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/admin/stats/global
```

### 5. Manual Send OTP (untuk debugging)
```bash
curl -X POST https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+6281234567892"}'
```

Response akan include `demo_otp` untuk testing.

---

## 📊 Verify Seed Data

Setelah run seeder, verify dengan cara:

### Via Browser Console:
```javascript
// Check users
fetch('https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/users/phone/+6281234567892')
  .then(r => r.json())
  .then(console.log);

// Check regus
fetch('https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/regus')
  .then(r => r.json())
  .then(d => console.log('Total Regus:', d.data.length));

// Check programs
fetch('https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/programs')
  .then(r => r.json())
  .then(d => console.log('Total Programs:', d.data.length));
```

---

## 🔄 Reset & Reseed

Jika data corrupt atau ingin reset:

1. **Clear data manual** via Supabase Dashboard:
   - Table Explorer → kv_store_f689ca3f
   - Delete all rows
   
2. **Run seeder lagi:**
   ```bash
   curl -X POST https://cqeranzfqkccdqadpica.supabase.co/functions/v1/make-server-f689ca3f/seed
   ```

---

## 🐛 Common Issues

### Issue: "Missing authorization header"
**Fix:** Endpoint seed sekarang tidak perlu auth header, langsung POST saja.

### Issue: Duplicate data after re-seeding
**Why:** Seeder tidak clear existing data dulu
**Fix:** Manual delete di Supabase UI atau recreate project

### Issue: OTP tidak muncul di console
**Why:** Server logs belum di-refresh
**Fix:** Tunggu 5-10 detik, refresh log page

### Issue: Login berhasil tapi role salah
**Why:** Data user di-seed dengan role tertentu
**Fix:** Use correct phone number untuk role yang diinginkan:
- Admin: `+6281234567890`
- Pembimbing: `+6281234567891/895/899`
- Relawan: others

---

## 📞 Need Help?

Check these files:
- `/SEED_INSTRUCTIONS.md` - Complete seeder guide
- `/supabase/functions/server/seed.tsx` - Seed data definitions
- `/supabase/functions/server/index.tsx` - API endpoints

Debug mode:
- Check console logs in Supabase Dashboard
- Use Browser DevTools Network tab
- Check API responses for error messages

---

**Last Updated:** 2025-11-15
