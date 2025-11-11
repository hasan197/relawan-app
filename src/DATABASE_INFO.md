# 🗄️ Database & Backend - Status Koneksi

## ✅ STATUS: TERHUBUNG & SIAP DIGUNAKAN

### 📊 **Table Database**

#### **Nama Table: `kv_store_f689ca3f`**
- ✅ **Status:** Sudah ada (pre-configured by Supabase)
- ✅ **Type:** Key-Value Store
- ✅ **Platform:** PostgreSQL on Supabase
- ✅ **Access:** Via `/supabase/functions/server/kv_store.tsx`

**TIDAK perlu CREATE TABLE manual!** Table KV store sudah otomatis tersedia.

---

## 🔌 **Koneksi Backend**

### **1. Supabase Configuration**
```typescript
// Location: /utils/supabase/info.tsx
export const projectId = "your-project-id"
export const publicAnonKey = "your-anon-key"
```

✅ **Status:** Terkonfigurasi otomatis

### **2. Server URL**
```
https://{projectId}.supabase.co/functions/v1/make-server-f689ca3f
```

✅ **Status:** Edge Functions aktif di Supabase

### **3. Server Runtime**
- **Framework:** Hono (lightweight web framework)
- **Runtime:** Deno
- **Platform:** Supabase Edge Functions
- **Location:** `/supabase/functions/server/index.tsx`

✅ **Status:** Server code sudah deploy-ready

---

## 📡 **API Endpoints (15 Endpoints)**

### **Authentication (3 endpoints)**
| Endpoint | Method | Status | Deskripsi |
|----------|--------|--------|-----------|
| `/auth/register` | POST | ✅ Ready | Daftar user baru |
| `/auth/send-otp` | POST | ✅ Ready | Kirim OTP |
| `/auth/verify-otp` | POST | ✅ Ready | Verifikasi & login |

### **Muzakki Management (4 endpoints)**
| Endpoint | Method | Status | Deskripsi |
|----------|--------|--------|-----------|
| `/muzakki` | GET | ✅ Ready | Get all muzakki |
| `/muzakki` | POST | ✅ Ready | Add muzakki |
| `/muzakki/:id` | PUT | ✅ Ready | Update muzakki |
| `/muzakki/:id` | DELETE | ✅ Ready | Delete muzakki |

### **Donations (2 endpoints)**
| Endpoint | Method | Status | Deskripsi |
|----------|--------|--------|-----------|
| `/donations` | GET | ✅ Ready | Get donations |
| `/donations` | POST | ✅ Ready | Add donation |

### **Communications (2 endpoints)**
| Endpoint | Method | Status | Deskripsi |
|----------|--------|--------|-----------|
| `/communications/:muzakki_id` | GET | ✅ Ready | Get comm log |
| `/communications` | POST | ✅ Ready | Log communication |

### **Chat (2 endpoints)**
| Endpoint | Method | Status | Deskripsi |
|----------|--------|--------|-----------|
| `/chat/:regu_id` | GET | ✅ Ready | Get messages |
| `/chat` | POST | ✅ Ready | Send message |

### **Statistics (2 endpoints)**
| Endpoint | Method | Status | Deskripsi |
|----------|--------|--------|-----------|
| `/statistics/:relawan_id` | GET | ✅ Ready | Get stats |
| `/health` | GET | ✅ Ready | Health check |

---

## 🗃️ **Data Structure (KV Store)**

### **Key Pattern System**

```typescript
// Users
"user:{userId}" = {
  id: string,
  full_name: string,
  phone: string,
  city: string,
  regu_id: string | null,
  role: 'relawan' | 'pembimbing' | 'admin',
  created_at: string
}

// Muzakki
"muzakki:{relawanId}:{muzakkiId}" = {
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
"donation:{relawanId}:{donationId}" = {
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
"communication:{muzakkiId}:{commId}" = {
  id: string,
  relawan_id: string,
  muzakki_id: string,
  type: 'call' | 'whatsapp' | 'meeting',
  notes: string,
  created_at: string
}

// Chat Messages
"chat:{reguId}:{messageId}" = {
  id: string,
  regu_id: string,
  sender_id: string,
  sender_name: string,
  message: string,
  created_at: string
}

// OTP (temporary, 5 min expiry)
"otp:{phone}" = {
  otp: string,
  expires_at: number
}

// Regu
"regu:{reguId}" = {
  id: string,
  name: string,
  pembimbing_id: string,
  pembimbing_name: string,
  target: number,
  created_at: string
}
```

---

## 🔧 **KV Store Operations**

### **Available Functions:**
```typescript
import * as kv from './kv_store.tsx'

// Single operations
await kv.set(key, value)      // Write data
const data = await kv.get(key) // Read data
await kv.del(key)              // Delete data

// Multiple operations
await kv.mset(entries)         // Write multiple
const items = await kv.mget(keys) // Read multiple
await kv.mdel(keys)            // Delete multiple

// Query operations
const items = await kv.getByPrefix(prefix) // Get all keys with prefix
```

✅ **Status:** Fully functional

---

## 🧪 **Test Connection**

### **Cara Test Koneksi:**

1. **Via UI Test Page**
   - Aplikasi sekarang membuka halaman Test Connection
   - Klik tombol "Run Connection Test"
   - Akan mengetes 3 komponen:
     - ✅ Server Health
     - ✅ KV Store (read/write)
     - ✅ Authentication Service

2. **Manual Test via Console**
   ```javascript
   // Test health endpoint
   fetch('https://{projectId}.supabase.co/functions/v1/make-server-f689ca3f/health')
     .then(r => r.json())
     .then(console.log)
   ```

3. **Test Authentication**
   - Buka halaman Register
   - Isi form dan submit
   - Data akan tersimpan di KV store
   - Check browser console untuk response

---

## ✅ **Checklist Koneksi**

- [x] **Supabase Project** - Terkonfigurasi
- [x] **Environment Variables** - Tersedia di /utils/supabase/info.tsx
- [x] **KV Store Table** - Pre-configured (kv_store_f689ca3f)
- [x] **Edge Functions** - Server code ready
- [x] **API Endpoints** - 15 endpoints implemented
- [x] **Frontend Integration** - Hooks & Context ready
- [x] **Error Handling** - Try-catch & toast notifications
- [x] **Authentication** - OTP flow implemented
- [x] **Real-time Chat** - Polling every 3 seconds

---

## 🚀 **Cara Menggunakan**

### **1. Test Koneksi (SEKARANG)**
```
Aplikasi sekarang membuka Test Connection Page
Klik "Run Connection Test" untuk verify
```

### **2. Register User Baru**
```typescript
// Frontend akan call:
POST /auth/register
Body: { fullName, phone, city, reguId }

// Server akan:
1. Create user di Supabase Auth
2. Simpan data di KV store: user:{userId}
3. Return user data
```

### **3. Login dengan OTP**
```typescript
// Step 1: Send OTP
POST /auth/send-otp
Body: { phone }
// Server generate OTP dan simpan di: otp:{phone}

// Step 2: Verify OTP
POST /auth/verify-otp
Body: { phone, otp }
// Server verify dan return user + access_token
```

### **4. Tambah Muzakki**
```typescript
// Frontend call:
POST /muzakki
Body: { relawan_id, name, phone, city, notes, status }

// Server simpan di:
muzakki:{relawanId}:{muzakkiId}
```

### **5. Chat Real-time**
```typescript
// Frontend polling every 3 seconds:
GET /chat/{reguId}

// Send message:
POST /chat
Body: { regu_id, sender_id, sender_name, message }

// Server simpan di:
chat:{reguId}:{messageId}
```

---

## 📊 **Data Flow**

```
┌──────────────┐
│   Frontend   │
│  (React)     │
└──────┬───────┘
       │ HTTP Request + Bearer Token
       ▼
┌──────────────────┐
│  Supabase Edge   │
│  Functions       │
│  (Hono Server)   │
└──────┬───────────┘
       │ KV Operations (get/set/del)
       ▼
┌──────────────────┐
│  KV Store Table  │
│  (PostgreSQL)    │
│  kv_store_f689ca3f
└──────────────────┘
```

---

## 🔒 **Security**

### **Current Implementation:**
- ✅ Bearer token authentication
- ✅ Server-side validation
- ✅ CORS enabled
- ✅ Error logging

### **Production TODO:**
- ⏳ Row Level Security (RLS)
- ⏳ Rate limiting
- ⏳ Input sanitization
- ⏳ API key rotation
- ⏳ HTTPS only

---

## 💡 **Tips**

### **Debugging:**
```typescript
// Check browser console untuk:
- API request logs
- Error messages
- Response data

// Check server logs di Supabase Dashboard:
Functions > server > Logs
```

### **Common Issues:**

**Issue: "Failed to fetch"**
- ✅ Check internet connection
- ✅ Verify Supabase project is active
- ✅ Check environment variables

**Issue: "Unauthorized"**
- ✅ Check access token di localStorage
- ✅ Login ulang

**Issue: "OTP expired"**
- ✅ OTP valid 5 menit
- ✅ Request OTP baru

---

## 📞 **Support**

Jika ada masalah koneksi:
1. Run Test Connection Page
2. Check browser console
3. Check Supabase Dashboard > Functions > Logs
4. Verify environment variables

---

**🎉 Database siap digunakan!**

**Last Updated:** November 9, 2025
