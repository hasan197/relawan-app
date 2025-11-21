# Summary Investigasi: Missing Achievements untuk User ID `j572pdvbvzfp3p89v846q8wn6h7vpw72`

## 🔍 Problem Statement
User dengan ID `j572pdvbvzfp3p89v846q8wn6h7vpw72` melaporkan bahwa halaman laporan tidak menampilkan pencapaian (achievements/donations) di production.

## 🏗️ Arsitektur Aplikasi yang Ditemukan

### Frontend
- **Framework**: React + Vite + TypeScript
- **State Management**: `AppContext` (Context API)
- **UI**: Tailwind CSS + shadcn/ui components
- **Routing**: Client-side navigation (state-based)

### Backend - **DUAL BACKEND ARCHITECTURE** ⚠️
Aplikasi ini menggunakan **DUA backend berbeda**:

#### 1. **Convex Backend** (Configured but NOT used for statistics)
- **Location**: `/convex` directory
- **Schema**: Defined in `convex/schema.ts`
- **Tables**: users, donations, targets, muzakkis, activities, etc.
- **Provider**: `ConvexProvider` in `src/main.tsx`
- **User ID Format**: Convex IDs (e.g., `j572pdvbvzfp3p89v846q8wn6h7vpw72`)

#### 2. **Supabase Edge Function Backend** (ACTIVELY USED)
- **Location**: `src/supabase/functions/server/index.tsx`
- **Framework**: Hono (Deno runtime)
- **Storage**: Supabase KV Store (`kv_store_f689ca3f` table)
- **Key Format**: `donation:{relawanId}:{donationId}`
- **User ID Format**: UUID v4 (e.g., `crypto.randomUUID()`)

## 🔴 ROOT CAUSE IDENTIFIED

### Masalah Utama: **Backend Mismatch**

1. **User ID berasal dari Convex** (`j572pdvbvzfp3p89v846q8wn6h7vpw72`)
   - Format ini adalah Convex Document ID

2. **Statistics endpoint menggunakan Supabase KV Store**
   - Endpoint: `GET /make-server-f689ca3f/statistics/:relawan_id`
   - Location: `src/supabase/functions/server/index.tsx` (line 1162-1272)
   - Query: `kv.getByPrefix('donation:' + relawanId + ':')`

3. **Data Flow untuk Laporan Page**:
   ```
   LaporanPage.tsx 
     → useStatistics(user.id)
       → apiCall('/statistics/' + relawanId)
         → Supabase Edge Function
           → KV Store: getByPrefix('donation:j572pdvbvzfp3p89v846q8wn6h7vpw72:')
             → ❌ TIDAK DITEMUKAN (karena donations disimpan dengan UUID format)
   ```

### Kenapa Data Tidak Muncul?

**Scenario A**: User login via Convex Auth, tapi donations disimpan di Supabase KV dengan UUID berbeda
- User ID dari Convex: `j572pdvbvzfp3p89v846q8wn6h7vpw72`
- Donation keys di Supabase: `donation:{different-uuid}:{donation-id}`
- **Result**: Query tidak menemukan donations karena prefix tidak match

**Scenario B**: Data memang belum ada di Supabase KV Store
- User baru atau belum ada donations yang tercatat
- Seed data hanya di development/local

## 📊 Code Analysis

### 1. Statistics Endpoint (`src/supabase/functions/server/index.tsx`)
```typescript
// Line 1162-1272
app.get('/make-server-f689ca3f/statistics/:relawan_id', async (c) => {
  const relawanId = c.req.param('relawan_id');
  
  // ⚠️ Query menggunakan relawanId sebagai prefix
  const donations = await kv.getByPrefix(`donation:${relawanId}:`);
  const muzakkiList = await kv.getByPrefix(`muzakki:${relawanId}:`);
  
  // Calculate statistics
  const totalDonations = donations.reduce(...);
  // ...
});
```

### 2. Frontend Hook (`src/hooks/useStatistics.ts`)
```typescript
// Line 36-64
const fetchStatistics = useCallback(async () => {
  if (!relawanId) return;
  
  // ⚠️ Calls Supabase Edge Function
  const response = await apiCall(`/statistics/${relawanId}`);
  setStatistics(response.data);
}, [relawanId]);
```

### 3. KV Store Implementation (`src/supabase/functions/server/kv_store.tsx`)
```typescript
// Line 80-87
export const getByPrefix = async (prefix: string): Promise<any[]> => {
  const supabase = client();
  const { data, error } = await supabase
    .from("kv_store_f689ca3f")
    .select("key, value")
    .like("key", prefix + "%");
  return data?.map((d) => d.value) ?? [];
};
```

## 🔧 Verification Script Created

Created: `convex/verify_user_data.ts`
- Purpose: Check if user exists in Convex DB
- Check donations and targets in Convex
- **Note**: Script failed to run (need `--prod` flag)

## ✅ Next Steps untuk Sesi Berikutnya

### Option 1: Verify Data in Convex (Recommended First)
```bash
npx convex run verify_user_data:verify --prod --args '{"userId": "j572pdvbvzfp3p89v846q8wn6h7vpw72"}'
```

### Option 2: Check Supabase KV Store
Query Supabase database `kv_store_f689ca3f`:
```sql
SELECT * FROM kv_store_f689ca3f 
WHERE key LIKE 'user:%' 
  AND value->>'id' = 'j572pdvbvzfp3p89v846q8wn6h7vpw72';

SELECT * FROM kv_store_f689ca3f 
WHERE key LIKE 'donation:%';
```

### Option 3: Fix Backend Integration
1. **Unify backend** - Choose either Convex OR Supabase
2. **Create migration script** - Sync data between backends
3. **Update authentication flow** - Ensure consistent user IDs

### Option 4: Create Debug Endpoint
Add endpoint to check user across both backends:
```typescript
app.get('/debug/user/:userId', async (c) => {
  const userId = c.req.param('userId');
  
  // Check Supabase KV
  const supabaseUser = await kv.get(`user:${userId}`);
  const donations = await kv.getByPrefix(`donation:${userId}:`);
  
  return c.json({
    backend: 'supabase',
    user: supabaseUser,
    donationsCount: donations.length,
    // Also check if user exists with phone lookup
  });
});
```

## 📝 Files Modified/Created

1. ✅ `convex/verify_user_data.ts` - Verification query
2. ✅ `implementation_plan.md` - Investigation plan
3. ✅ `task.md` - Task tracking

## 🎯 Recommended Action

**Immediate**: Run verification script dengan flag `--prod` untuk confirm apakah data ada di Convex:
```bash
npx convex run verify_user_data:verify --prod --args '{"userId": "j572pdvbvzfp3p89v846q8wn6h7vpw72"}'
```

**If data exists in Convex**: 
- Update frontend to use Convex queries instead of Supabase
- OR migrate data from Convex to Supabase

**If data doesn't exist anywhere**:
- Check production logs
- Verify user registration flow
- Check if donations were actually created

---

**Last Updated**: 2025-11-19 23:13
**Status**: Investigation Complete, Awaiting Verification
