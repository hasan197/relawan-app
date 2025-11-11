# 📱 ZISWAF Manager - OTP System dengan Console Log

## 🔑 SISTEM OTP TANPA SMS SERVICE

Karena belum ada third party untuk OTP/SMS service, sistem OTP menggunakan **console log** untuk development dan testing.

---

## 🎯 **Cara Kerja:**

### **1. User Request OTP**
```
User masukkan nomor HP → Klik "Kirim Kode OTP"
```

### **2. Server Generate OTP**
```
Server generate 6 digit random OTP
→ Save to database (expires 5 menit)
→ LOG OTP di console server
→ Return demo_otp di response
```

### **3. Frontend Show OTP**
```
Browser console → Log OTP dengan format jelas
Toast notification → Tampilkan OTP selama 15 detik
User → Salin OTP dari notifikasi/console
```

### **4. User Input OTP**
```
User paste OTP ke form → Verify → Login berhasil
```

---

## 🖥️ **SERVER SIDE LOG**

### **Console Output Format:**

```bash
═══════════════════════════════════════════
📱 OTP VERIFICATION CODE
═══════════════════════════════════════════
Phone: 08123456789
OTP Code: 123456
Expires: 5 minutes
═══════════════════════════════════════════
```

### **Kapan Muncul:**
- ✅ Saat user klik "Kirim Kode OTP" di Login Page
- ✅ Saat user klik "Kirim Ulang Kode" di OTP Page
- ✅ Log muncul di **Supabase Edge Function logs**

### **Cara Lihat Log Server:**
1. Buka **Supabase Dashboard**
2. Pilih project ZISWAF Manager
3. Klik **Edge Functions**
4. Pilih function `make-server-f689ca3f`
5. Klik tab **Logs**
6. OTP akan terlihat di logs dengan format di atas

---

## 🌐 **FRONTEND/BROWSER SIDE LOG**

### **Console Output Format:**

```bash
═══════════════════════════════════════════
📱 KODE OTP LOGIN
═══════════════════════════════════════════
Phone: 08123456789
OTP: 123456
═══════════════════════════════════════════
```

### **Toast Notification:**

```
✅ Kode OTP berhasil dikirim!

ℹ️ 🔑 Demo OTP: 123456
   Salin kode ini untuk verifikasi (belum ada SMS service)
   [Duration: 15 seconds]
```

### **Kapan Muncul:**
- ✅ Di **LoginPage** setelah kirim OTP
- ✅ Di **OTPVerificationPage** setelah resend OTP
- ✅ Muncul sebagai toast notification & browser console

### **Cara Lihat:**
1. Klik kanan → **Inspect** (atau F12)
2. Buka tab **Console**
3. OTP akan terlihat dengan format di atas
4. ATAU lihat di **toast notification** (pojok atas)

---

## 📋 **FLOW LENGKAP**

### **Login Flow:**

```
1. LoginPage
   ↓
   User input: 08123456789
   ↓
   Klik: "Kirim Kode OTP"
   ↓
   POST /auth/send-otp
   ↓
   Server: Generate OTP (e.g., 123456)
   ↓
   Server: LOG to console:
   ═══════════════════════════════════════════
   📱 OTP VERIFICATION CODE
   Phone: 08123456789
   OTP Code: 123456
   ═══════════════════════════════════════════
   ↓
   Response: { demo_otp: "123456" }
   ↓
   Frontend: Show toast notification
   Toast: 🔑 Demo OTP: 123456
   ↓
   Frontend: LOG to browser console
   ═══════════════════════════════════════════
   📱 KODE OTP LOGIN
   Phone: 08123456789
   OTP: 123456
   ═══════════════════════════════════════════
   ↓
   Navigate to: OTPVerificationPage

2. OTPVerificationPage
   ↓
   User lihat OTP di:
   - Toast notification (15 detik)
   - Browser console (permanent)
   - Server logs (di Supabase)
   ↓
   User salin & paste: 123456
   ↓
   Klik: "Verifikasi"
   ↓
   POST /auth/verify-otp
   ↓
   Server: Check OTP valid & not expired
   ↓
   ✅ Login berhasil!
   ↓
   Navigate to: Dashboard
```

---

## 🔍 **DIMANA OTP TERLIHAT**

### **3 Tempat OTP Muncul:**

| # | Location | Format | Duration |
|---|----------|--------|----------|
| 1 | **Server Logs** | Console box format | Permanent |
| 2 | **Browser Console** | Console box format | Permanent |
| 3 | **Toast Notification** | Info toast | 15 seconds |

### **Prioritas Lihat OTP:**

**Paling Mudah:**
```
Toast Notification (pojok atas layar)
→ Muncul otomatis 15 detik
→ Langsung salin kode
```

**Alternatif 1:**
```
Browser Console (F12 → Console tab)
→ OTP dengan format box
→ Bisa scroll cari log lama
```

**Alternatif 2:**
```
Supabase Logs (untuk developer)
→ Edge Function logs
→ Complete server logs
```

---

## 💻 **CODE IMPLEMENTATION**

### **Server Side (index.tsx):**

```typescript
// Send OTP endpoint
app.post('/make-server-f689ca3f/auth/send-otp', async (c) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  await kv.set(`otp:${phone}`, {
    otp: otp,
    expires_at: Date.now() + 5 * 60 * 1000
  });

  // ========================================
  // 📱 OTP LOG (Karena belum ada SMS service)
  // ========================================
  console.log('\n');
  console.log('═══════════════════════════════════════════');
  console.log('📱 OTP VERIFICATION CODE');
  console.log('═══════════════════════════════════════════');
  console.log(`Phone: ${phone}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`Expires: 5 minutes`);
  console.log('═══════════════════════════════════════════');
  console.log('\n');

  return c.json({
    success: true,
    message: 'Kode OTP telah dikirim',
    demo_otp: otp  // ✅ Return OTP untuk frontend
  });
});
```

### **Frontend - LoginPage:**

```typescript
try {
  const response = await sendOTP(phoneNumber);
  
  // Show demo OTP for development
  if (response.demo_otp) {
    toast.success('Kode OTP berhasil dikirim!');
    toast.info(`🔑 Demo OTP: ${response.demo_otp}`, { 
      duration: 15000,
      description: 'Salin kode ini untuk verifikasi'
    });
    
    // Browser console log
    console.log('\n═══════════════════════════════════════════');
    console.log('📱 KODE OTP LOGIN');
    console.log('═══════════════════════════════════════════');
    console.log(`Phone: ${phoneNumber}`);
    console.log(`OTP: ${response.demo_otp}`);
    console.log('═══════════════════════════════════════════\n');
  }
  
  onSendOTP?.(phoneNumber);
} catch (error) {
  toast.error('Gagal mengirim OTP');
}
```

### **Frontend - OTPVerificationPage:**

```typescript
const handleResend = async () => {
  try {
    const response = await sendOTP(phoneNumber);
    
    if (response.demo_otp) {
      toast.success(`Kode OTP baru dikirim!`);
      toast.info(`🔑 Demo OTP: ${response.demo_otp}`, { 
        duration: 15000,
        description: 'Cek console log untuk melihat OTP'
      });
      
      // Browser console log
      console.log('\n═══════════════════════════════════════════');
      console.log('📱 KODE OTP VERIFIKASI');
      console.log('═══════════════════════════════════════════');
      console.log(`Phone: ${phoneNumber}`);
      console.log(`OTP: ${response.demo_otp}`);
      console.log('═══════════════════════════════════════════\n');
    }
  } catch (error) {
    toast.error('Gagal mengirim ulang OTP');
  }
};
```

---

## 🔒 **SECURITY NOTES**

### **⚠️ PENTING:**

1. **demo_otp field HANYA untuk development**
   - Di production, HAPUS field `demo_otp` dari response
   - OTP seharusnya dikirim via SMS/WhatsApp, bukan di response

2. **OTP Storage:**
   - ✅ OTP disimpan di KV Store dengan expiry 5 menit
   - ✅ OTP dihapus setelah berhasil diverifikasi
   - ✅ OTP expired otomatis setelah 5 menit

3. **Console Logs:**
   - ✅ OK untuk development/staging
   - ⚠️ Di production, disable atau encrypt console logs

### **Production Checklist:**

```typescript
// ❌ REMOVE in production:
return c.json({
  success: true,
  message: 'Kode OTP telah dikirim',
  demo_otp: otp  // ← DELETE THIS LINE
});

// ✅ KEEP in production:
return c.json({
  success: true,
  message: 'Kode OTP telah dikirim'
  // OTP sent via SMS, not in response
});
```

---

## 🚀 **CARA TESTING**

### **Test Login Flow:**

1. **Start App:**
   ```bash
   # App auto-runs in Figma Make
   ```

2. **Open Browser Console:**
   ```
   F12 → Console tab
   ```

3. **Login Page:**
   ```
   Nomor HP: 08123456789
   Klik: "Kirim Kode OTP"
   ```

4. **Lihat OTP di 3 tempat:**
   ```
   ✅ Toast notification (pojok atas)
   ✅ Browser console (F12)
   ✅ Supabase logs (optional)
   ```

5. **Copy OTP:**
   ```
   Salin dari toast: 123456
   ```

6. **OTP Verification Page:**
   ```
   Paste: 1-2-3-4-5-6
   Klik: "Verifikasi"
   ```

7. **Success:**
   ```
   ✅ Login berhasil
   ✅ Navigate to Dashboard
   ```

### **Test Resend OTP:**

1. **OTP Page:**
   ```
   Tunggu countdown 60 detik
   ```

2. **Klik: "Kirim Ulang Kode"**
   ```
   New OTP generated
   Toast shows new OTP
   Console logs new OTP
   ```

3. **Use New OTP:**
   ```
   Paste new OTP
   Verify
   ```

---

## 📊 **OTP EXPIRY**

### **Validity:**
```
OTP valid for: 5 minutes (300 seconds)
After 5 minutes: OTP expired, must request new
```

### **Error Handling:**

```typescript
// Expired OTP
if (storedOtpData.expires_at < Date.now()) {
  await kv.del(`otp:${phone}`);
  return c.json({ error: 'OTP sudah kadaluarsa' }, 400);
}

// Wrong OTP
if (storedOtpData.otp !== otp) {
  return c.json({ error: 'Kode OTP salah' }, 400);
}

// OTP not found
if (!storedOtpData) {
  return c.json({ error: 'OTP tidak valid' }, 400);
}
```

---

## 🔧 **INTEGRASI SMS GATEWAY (Future)**

### **Untuk Production, Integrasi dengan:**

**Option 1: Twilio**
```typescript
import twilio from 'twilio';

const client = twilio(accountSid, authToken);

await client.messages.create({
  body: `Kode OTP ZISWAF: ${otp}`,
  from: '+1234567890',
  to: phone
});
```

**Option 2: Vonage (Nexmo)**
```typescript
import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
  apiKey: key,
  apiSecret: secret
});

await vonage.sms.send({
  to: phone,
  from: 'ZISWAF',
  text: `Kode OTP: ${otp}`
});
```

**Option 3: WhatsApp Business API**
```typescript
// Kirim OTP via WhatsApp
await sendWhatsAppMessage({
  to: phone,
  template: 'otp_verification',
  parameters: [otp]
});
```

**Setelah integrasi SMS:**
1. ✅ Remove `demo_otp` from response
2. ✅ Send OTP via SMS/WhatsApp
3. ✅ Keep server logs for debugging
4. ✅ Remove browser console logs (optional)

---

## ✅ **CURRENT STATUS**

### **✅ Working:**
- OTP generation (6 digits random)
- OTP storage in KV Store
- OTP expiry (5 minutes)
- Server-side logging
- Browser-side logging
- Toast notification
- OTP verification
- Delete after verify
- Resend functionality

### **🔄 Pending (Production):**
- SMS/WhatsApp integration
- Remove demo_otp from response
- Production logging strategy
- Rate limiting for OTP requests

---

## 📝 **SUMMARY**

**Untuk Development:**
```
✅ OTP muncul di 3 tempat:
   1. Server logs (Supabase)
   2. Browser console (F12)
   3. Toast notification (15s)

✅ User bisa:
   - Copy dari toast notification
   - Copy dari browser console
   - Check di server logs

✅ Testing mudah tanpa SMS gateway
```

**Untuk Production:**
```
🔄 Integrasikan SMS gateway
🔄 Remove demo_otp dari response
🔄 Implement rate limiting
🔄 Setup production logging
```

---

**OTP System siap untuk development & testing!** 🚀  
**Tinggal integrasi SMS gateway untuk production!** 📱

**Last Updated:** November 9, 2025  
**Status:** Development Ready ✅
