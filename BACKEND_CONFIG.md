# Backend Configuration Guide

## Overview

Aplikasi ini mendukung dua backend provider:
- **Supabase** (default untuk production)
- **Convex** (alternatif backend)

## Cara Mengatur Backend Provider

### 1. Via Environment Variable

Buat file `.env` di root project dan tambahkan:

```bash
# Untuk menggunakan Supabase (default)
VITE_BACKEND_PROVIDER=supabase

# Untuk menggunakan Convex
VITE_BACKEND_PROVIDER=convex
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

### 2. Tanpa Environment Variable

Jika `VITE_BACKEND_PROVIDER` tidak diset, aplikasi akan menggunakan **Convex** sebagai default (sesuai `backendConfig.ts`).

## Arsitektur

### File Kunci

1. **`src/lib/backendConfig.ts`**
   - Menentukan backend provider yang aktif
   - Membaca dari `VITE_BACKEND_PROVIDER` atau `VITE_BACKEND`

2. **`src/lib/supabase.ts`**
   - Fungsi `apiCall()` yang routing ke backend yang sesuai
   - Jika `BACKEND_PROVIDER === 'convex'` → route ke `convexRouter`
   - Jika `BACKEND_PROVIDER === 'supabase'` → route ke Supabase Edge Function

3. **`src/lib/convexRouter.ts`**
   - Memetakan endpoint REST API ke Convex queries/mutations
   - Contoh: `GET /muzakki?relawan_id=123` → `api.muzakkis.listByRelawan()`

### Alur Request

```
Hook (useMuzakki, useDonations, dll)
  ↓
apiCall(endpoint, options)
  ↓
[Check BACKEND_PROVIDER]
  ↓
├─ convex → routeToConvex() → Convex HTTP Client
└─ supabase → fetch() → Supabase Edge Function
```

## Endpoint Mapping (Convex)

Berikut adalah mapping endpoint yang didukung di `convexRouter.ts`:

### Authentication
- `POST /auth/register` → `api.auth.register`
- `POST /auth/send-otp` → `api.auth.sendOtp`
- `POST /auth/verify-otp` → `api.auth.verifyOtp`
- `PUT /users/phone/:phone` → `api.auth.updatePhone`

### Muzakki
- `GET /muzakki?relawan_id=:id` → `api.muzakkis.listByRelawan`
- `GET /muzakki/:id` → `api.muzakkis.get`
- `POST /muzakki` → `api.muzakkis.create`
- `PUT /muzakki/:id` → `api.muzakkis.update`
- `DELETE /muzakki/:id` → `api.muzakkis.deleteMuzakki`

### Donations
- `GET /donations?relawan_id=:id` → `api.donations.listByRelawan`
- `GET /donations?muzakki_id=:id` → `api.donations.listByMuzakki`
- `POST /donations` → `api.donations.create`

### Regu
- `GET /regus` → `api.regus.list`
- `POST /regus` → `api.regus.create`
- `GET /regu/:id` → `api.regus.get`
- `GET /regu/by-code/:code` → `api.regus.getByCode`
- `GET /regu/:id/members` → `api.regus.getMembers`
- `POST /regu/:id/members` → `api.regus.addMember`

### Programs
- `GET /programs` → `api.programs.list`
- `GET /programs/:id` → `api.programs.get`
- `POST /programs` → `api.programs.create`

### Templates
- `GET /templates` → `api.templates.list`
- `POST /templates` → `api.templates.create`

### Notifications
- `GET /notifications/:userId` → `api.notifications.getByUser`
- `POST /notifications` → `api.notifications.create`
- `PUT /notifications/:id/read` → `api.notifications.markAsRead`

### Statistics
- `GET /statistics/:relawanId` → `api.statistics.getRelawanStatistics`
- `GET /admin/stats/global` → `api.statistics.getGlobalStats`
- `GET /admin/stats/regu` → `api.statistics.getReguStats`

### Chat
- `GET /chat/:reguId` → `api.chat.list`
- `POST /chat` → `api.chat.send`

### Communications
- `GET /communications/:muzakkiId` → `api.muzakkis.listCommunications`
- `POST /communications` → `api.muzakkis.addCommunication`

## Testing

### Test dengan Supabase
```bash
# .env
VITE_BACKEND_PROVIDER=supabase
```

Jalankan: `npm run dev`

Console log akan menampilkan:
```
🔧 Backend Provider: supabase
🔀 Backend: Supabase (/muzakki?relawan_id=...)
```

### Test dengan Convex
```bash
# .env
VITE_BACKEND_PROVIDER=convex
VITE_CONVEX_URL=https://quixotic-rhinoceros-311.convex.cloud
```

Jalankan: `npm run dev`

Console log akan menampilkan:
```
🔧 Backend Provider: convex
🔀 Backend: Convex (/muzakki?relawan_id=...)
🔀 Routing to Convex: GET /muzakki?relawan_id=...
```

## Troubleshooting

### Error: "Convex route not implemented"
Endpoint yang Anda panggil belum dimapping di `convexRouter.ts`. Tambahkan mapping baru sesuai pola yang ada.

### Error: "VITE_CONVEX_URL is not configured"
Pastikan `.env` memiliki `VITE_CONVEX_URL` yang valid saat menggunakan Convex backend.

### Data tidak muncul
1. Cek console log untuk melihat backend provider yang aktif
2. Pastikan backend yang dipilih sudah di-deploy dan accessible
3. Untuk Supabase: pastikan Edge Function `make-server-f689ca3f` sudah deployed
4. Untuk Convex: pastikan Convex deployment URL benar

## Migrasi dari Single Backend

Jika sebelumnya aplikasi hanya menggunakan satu backend:

1. **Tidak perlu mengubah hooks** - semua hooks tetap menggunakan `apiCall()` dari `src/lib/supabase.ts`
2. **Tidak perlu mengubah komponen** - semua komponen tetap sama
3. **Hanya perlu set environment variable** untuk switch backend

Ini adalah keuntungan dari arsitektur adapter pattern yang digunakan.
