# Deployment Guide: Donation Validation Feature

## Prerequisites

Pastikan Anda sudah:
1. ✅ Deploy Supabase Edge Function (`make-server-f689ca3f`)
2. ✅ Set environment variables di Supabase Dashboard
3. ✅ Test koneksi backend sudah berhasil

## Deployment Steps

### 1. Redeploy Edge Function

Karena ada perubahan besar di backend (new endpoints), Anda harus redeploy:

```bash
# Deploy ulang Edge Function
supabase functions deploy make-server-f689ca3f
```

**New Endpoints yang ditambahkan**:
- `POST /donations/upload-bukti` - Upload bukti transfer
- `GET /donations/pending` - Get pending donations
- `POST /donations/:id/validate` - Validate/reject donation
- `PATCH /donations/:id` - Update donation
- `GET /donations/stats` - Get donation statistics

### 2. Verify Storage Bucket

Bucket akan auto-create saat pertama kali upload, tapi Anda bisa verifikasi:

1. Buka Supabase Dashboard → Storage
2. Cek apakah bucket `make-f689ca3f-bukti-transfer` exists
3. Pastikan bucket adalah **Private** (bukan public)

**Manual Create (opsional)**:
```sql
-- Di Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('make-f689ca3f-bukti-transfer', 'make-f689ca3f-bukti-transfer', false);
```

### 3. Test Upload Functionality

**Test 1: Upload Bukti Transfer**
```bash
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f689ca3f/donations/upload-bukti \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -F "file=@test-image.jpg" \
  -F "donation_id=test-123"
```

Expected response:
```json
{
  "success": true,
  "message": "Bukti transfer berhasil diupload",
  "data": {
    "url": "https://...signed-url...",
    "path": "test-123-1234567890.jpg"
  }
}
```

**Test 2: Get Pending Donations**
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f689ca3f/donations/pending \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Test 3: Donation Stats**
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f689ca3f/donations/stats \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### 4. Test Frontend Integration

**As Relawan**:
1. Login sebagai relawan
2. Go to Dashboard → Generator Resi
3. Fill form:
   - Nama donatur: "Test Donatur"
   - Nominal: 500000
   - Kategori: Zakat
   - Metode: Transfer Bank
4. Upload bukti transfer (pilih gambar)
5. Submit
6. Verify resi shows status "Menunggu Validasi"

**As Admin**:
1. Login sebagai admin
2. Go to Admin Dashboard
3. Click "Validasi Donasi" button
4. Verify donation muncul dengan status "Pending"
5. Click "Lihat Bukti" → opens image in new tab
6. Click "Validasi" → confirm
7. Verify status changed to "Tervalidasi"

### 5. Monitor Logs

Check Supabase Edge Function logs:

```bash
supabase functions logs make-server-f689ca3f --follow
```

Look for:
- ✅ `Upload bukti error:` - jika ada error upload
- ✅ `Validate donation error:` - jika ada error validasi
- ✅ `Get pending donations error:` - jika ada error fetch

## Common Issues & Fixes

### Issue 1: "Upload failed" Error

**Cause**: Bucket tidak exist atau permission salah

**Fix**:
```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE name = 'make-f689ca3f-bukti-transfer';

-- Create if doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('make-f689ca3f-bukti-transfer', 'make-f689ca3f-bukti-transfer', false);
```

### Issue 2: "Cannot read file" Error

**Cause**: File terlalu besar atau format tidak didukung

**Fix**: Di frontend sudah ada validasi:
- Max size: 5MB
- Format: image/* only

### Issue 3: Signed URL Expired

**Cause**: URL expired (default 1 year)

**Fix**: Generate new signed URL:
```javascript
const { data: signedUrl } = await supabase.storage
  .from('make-f689ca3f-bukti-transfer')
  .createSignedUrl(fileName, 3600 * 24 * 365); // 1 year
```

### Issue 4: "Pending donations not showing"

**Cause**: Status field tidak ada di existing donations

**Fix**: Reset existing donations atau add status field:
```javascript
// Di admin tools, run migration:
const donations = await kv.getByPrefix('donation:');
for (const donation of donations) {
  if (!donation.status) {
    donation.status = 'validated'; // existing = validated
    await kv.set(`donation:${donation.relawan_id}:${donation.id}`, donation);
  }
}
```

## Performance Considerations

### 1. Image Optimization

Bukti transfer bisa besar. Consider:
- Frontend: Compress sebelum upload (future enhancement)
- Backend: Resize image (future enhancement)
- Current: Max 5MB limit

### 2. Pagination

Jika ada banyak pending donations:
- Add pagination di endpoint `/donations/pending`
- Frontend: Infinite scroll atau pagination

### 3. Caching

Stats bisa di-cache:
```javascript
// In useAdminStats hook
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
// Add cache logic
```

## Security Checklist

- [x] Bucket adalah **private** (not public)
- [x] Signed URLs valid for limited time (1 year)
- [x] Only admin can validate donations
- [x] File upload validates file type and size
- [x] SQL injection safe (using KV store, not raw SQL)
- [x] CORS enabled properly

## Rollback Plan

Jika ada issue critical:

1. **Rollback Edge Function**:
```bash
# Deploy previous version
git checkout <previous-commit>
supabase functions deploy make-server-f689ca3f
```

2. **Disable Feature**:
   - Hide "Validasi Donasi" button di Admin Dashboard
   - Show maintenance message di Generator Resi page

3. **Keep Data**:
   - Donations tetap tersimpan
   - Bukti transfer tetap di storage
   - Bisa di-recover setelah fix

## Monitoring

### Metrics to Track

1. **Upload Success Rate**
   - Log setiap upload attempt
   - Track success/failure ratio

2. **Validation Time**
   - Time from donation created to validated
   - Admin response time

3. **Rejection Rate**
   - % of donations rejected
   - Common rejection reasons

4. **Storage Usage**
   - Bucket size growth
   - Number of files

### Alerts

Set up alerts for:
- Upload failure rate > 10%
- Pending donations > 50
- Storage > 1GB (check pricing)

## Next Steps

After successful deployment:

1. ✅ Train relawan to use Generator Resi properly
2. ✅ Train admin to validate donations quickly
3. ✅ Monitor for 1 week
4. ✅ Gather feedback
5. ✅ Implement enhancements (OCR, bulk validation, etc.)

---

**Status**: Ready to Deploy
**Last Updated**: 2025-11-29
**Version**: 1.0.0
