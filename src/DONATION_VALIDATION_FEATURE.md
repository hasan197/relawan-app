# Fitur Laporan & Validasi Donasi

## Overview
Sistem lengkap untuk relawan melaporkan donasi dengan bukti transfer dan admin melakukan validasi atas dana yang masuk.

## Fitur Utama

### 1. Lapor Donasi (Relawan)
**File**: `/pages/GeneratorResiPage.tsx`

Relawan dapat:
- ✅ Input data donasi (donatur, nominal, kategori, metode pembayaran)
- ✅ Upload bukti transfer (max 5MB, format gambar)
- ✅ Pilih donatur dari daftar muzakki yang ada
- ✅ Tambah catatan donasi
- ✅ Generate resi digital
- ✅ Status default: "pending" (menunggu validasi)

**Validasi**:
- Pembayaran transfer WAJIB upload bukti
- Preview bukti sebelum submit
- Auto-generate nomor resi

### 2. Validasi Donasi (Admin)
**File**: `/pages/AdminValidasiDonasiPage.tsx` (Mobile)
**File**: `/pages/desktop/DesktopAdminValidasiDonasiPage.tsx` (Desktop)

Admin dapat:
- ✅ Lihat semua donasi (pending, validated, rejected)
- ✅ Filter by status dan search
- ✅ Lihat bukti transfer
- ✅ Approve donasi → status "validated"
- ✅ Reject donasi dengan alasan penolakan
- ✅ Dashboard stats (total, pending, validated, rejected)

**Akses**: Navigasi dari Admin Dashboard → Button "Validasi Donasi"

### 3. Status Donasi
- **Pending**: Menunggu validasi admin (default)
- **Validated**: Sudah divalidasi, masuk ke total donasi
- **Rejected**: Ditolak dengan alasan

### 4. Upload Bukti Transfer
**Backend**: `/supabase/functions/server/index.tsx`

- Endpoint: `POST /donations/upload-bukti`
- Storage: Supabase Storage bucket `make-f689ca3f-bukti-transfer`
- Signed URL validity: 1 tahun
- Auto-create bucket jika belum ada

## Backend API Endpoints

### 1. POST `/donations`
Create donation dengan status pending
```json
{
  "relawan_id": "uuid",
  "relawan_name": "string",
  "donor_name": "string",
  "muzakki_id": "uuid | null",
  "amount": number,
  "category": "zakat|infaq|sedekah|wakaf",
  "payment_method": "tunai|transfer|qris|other",
  "bukti_transfer_url": "string | null",
  "notes": "string",
  "status": "pending"
}
```

### 2. POST `/donations/upload-bukti`
Upload bukti transfer
```
FormData:
- file: File
- donation_id: string
```
Returns: `{ url: signedUrl, path: filePath }`

### 3. GET `/donations/pending`
Get all pending donations (admin only)

### 4. POST `/donations/:donationId/validate`
Validate or reject donation
```json
{
  "admin_id": "uuid",
  "admin_name": "string",
  "action": "approve|reject",
  "rejection_reason": "string (required if reject)"
}
```

### 5. PATCH `/donations/:donationId`
Update donation (untuk update bukti transfer URL)

### 6. GET `/donations/stats`
Get donation statistics
```json
{
  "total": number,
  "pending": number,
  "validated": number,
  "rejected": number,
  "total_amount": number,
  "pending_amount": number
}
```

## Type Definitions

**File**: `/types/index.ts`

```typescript
export type DonationStatus = 'pending' | 'validated' | 'rejected';

export interface Donation {
  id: string;
  amount: number;
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf';
  donorName: string;
  donorId?: string;
  relawanId: string;
  relawanName?: string;
  eventName?: string;
  createdAt: Date;
  type: 'incoming' | 'outgoing';
  
  // Validation fields
  status: DonationStatus;
  buktiTransferUrl?: string;
  paymentMethod?: 'tunai' | 'transfer' | 'qris' | 'other';
  notes?: string;
  
  // Admin validation
  validatedBy?: string;
  validatedByName?: string;
  validatedAt?: Date;
  rejectionReason?: string;
}
```

## Navigation Flow

### Relawan
1. Dashboard → Quick Menu → "Generator Resi" / "Lapor Donasi"
2. Fill form → Upload bukti (if transfer) → Submit
3. See receipt with status "Menunggu Validasi"

### Admin
1. Dashboard → "Admin Dashboard" (if role = admin)
2. Click "Validasi Donasi" button (with pending count badge)
3. Filter/search donations
4. Click donation → View bukti → Approve/Reject
5. Done!

## UI Components

### Mobile
- **AdminValidasiDonasiPage**: List view dengan filter dan search
- **GeneratorResiPage**: Form dengan upload bukti

### Desktop
- **DesktopAdminValidasiDonasiPage**: Table view dengan inline actions
- Responsive layout untuk layar besar

## Admin Dashboard Integration

**File**: `/pages/AdminDashboardPage.tsx`
**File**: `/pages/desktop/DesktopAdminDashboardPage.tsx`

- Badge showing pending donations count
- Button "Validasi Donasi" dengan icon CheckCircle
- Stats di `useAdminStats` hook sudah include `pendingDonations`

## Database Schema (KV Store)

Key pattern: `donation:{relawan_id}:{donation_id}`

```json
{
  "id": "uuid",
  "relawan_id": "uuid",
  "relawan_name": "string",
  "donor_name": "string",
  "muzakki_id": "uuid | null",
  "amount": number,
  "category": "zakat|infaq|sedekah|wakaf",
  "type": "incoming",
  "payment_method": "tunai|transfer|qris|other",
  "bukti_transfer_url": "string | null",
  "receipt_number": "string",
  "notes": "string",
  "status": "pending|validated|rejected",
  "created_at": "ISO8601",
  "validated_by": "uuid | null",
  "validated_by_name": "string | null",
  "validated_at": "ISO8601 | null",
  "rejection_reason": "string | null"
}
```

## Testing Checklist

### Relawan Flow
- [ ] Upload donasi tunai (no bukti required)
- [ ] Upload donasi transfer (bukti required) 
- [ ] Upload donasi QRIS (bukti optional)
- [ ] Preview bukti sebelum submit
- [ ] Generate resi dengan status pending
- [ ] Copy/share resi

### Admin Flow
- [ ] Lihat pending donations dengan badge count
- [ ] Filter by status (all/pending/validated/rejected)
- [ ] Search by donatur atau relawan name
- [ ] View bukti transfer dalam new tab
- [ ] Approve donation → status validated
- [ ] Reject donation dengan alasan → status rejected
- [ ] Stats card update setelah validasi

### Edge Cases
- [ ] Upload file > 5MB → error
- [ ] Upload non-image file → error
- [ ] Submit transfer tanpa bukti → error
- [ ] Reject tanpa alasan → error
- [ ] Network error saat upload → graceful fallback

## Screenshots Locations

### Mobile
- Lapor Donasi: Form dengan upload bukti
- Resi dengan status pending
- Admin Validasi: List dengan filter
- Admin Validasi: Dialog approve/reject

### Desktop
- Admin Validasi: Table view dengan stats cards
- Bukti transfer preview

## Future Enhancements

1. **Notifikasi Real-time**
   - Push notification saat donasi divalidasi/ditolak
   - WebSocket untuk update real-time

2. **OCR Bukti Transfer**
   - Auto-extract nominal dari bukti
   - Validasi otomatis jika match

3. **Bulk Validation**
   - Select multiple donations
   - Bulk approve/reject

4. **Export Report**
   - Export validated donations to Excel
   - Filter by date range

5. **Audit Trail**
   - Log semua approval/rejection
   - History validation per admin

## Notes

- ✅ Semua endpoint sudah terintegrasi dengan Supabase backend
- ✅ Mobile-first design dengan desktop responsive
- ✅ Loading states & error handling sudah proper
- ✅ File upload menggunakan Supabase Storage (private bucket)
- ✅ Signed URLs untuk akses bukti transfer (1 tahun validity)
- ✅ Role-based access: admin only bisa validasi

---

**Status**: ✅ Ready for Production
**Last Updated**: 2025-11-29
