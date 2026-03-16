# Analisis Proyek Volunteer Dashboard Design

**Tanggal Analisis**: 2026-02-03  
**Nama Proyek**: Volunteer Dashboard Design / relawan-app  
**Versi**: 0.1.0

---

## Ringkasan Proyek

Proyek ini adalah aplikasi dashboard untuk manajemen relawan dan donasi dengan fokus pada aktivitas keislaman (zakat, sedekah, dll). Aplikasi ini menggunakan React + TypeScript di frontend dengan backend yang fleksibel (Convex atau Supabase).

**Repository**: https://github.com/hasan197/relawan-app  
**Figma Design**: https://www.figma.com/design/TeOSmOcWhrlNFUXwRsequL/Volunteer-Dashboard-Design

---

## Tech Stack

### Frontend
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Components**: 
  - TailwindCSS (styling)
  - shadcn/ui + Radix UI (komponen UI)
  - Lucide React (icons)
- **State Management**: React Context (AppContext)
- **Form Handling**: React Hook Form 7.55.0
- **Charts**: Recharts 2.15.2
- **Testing**: Vitest 4.0.9 + Testing Library

### Backend
- **Primary**: Convex 1.29.1 (Real-time database)
- **Alternative**: Supabase 2.39.0
- **Storage**: Backblaze B2 + Convex Storage
- **Edge Functions**: Hono 4 (Supabase Edge Functions)

### Other Libraries
- QR Code: qrcode + jsqr
- Authentication: jsonwebtoken 9.0.3
- Toast Notifications: sonner 2.0.3
- Theme: next-themes 0.4.6

---

## Struktur Direktori

```
relawan-app/
├── src/
│   ├── pages/              # 46 halaman (mobile + desktop)
│   │   ├── mobile/         # Halaman mobile
│   │   ├── desktop/        # Halaman desktop
│   │   └── mvvm/           # Halaman dengan MVVM (refactor in-progress)
│   ├── components/         # UI components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # 21 custom hooks
│   ├── lib/                # Utilities & backend adapters
│   ├── features/           # Feature-based modules (MVVM pattern)
│   │   └── generator-resi/ # Contoh implementasi MVVM
│   ├── contexts/           # React Context providers
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── convex/                 # Convex backend (14 files)
│   ├── auth.ts             # Authentication logic
│   ├── donations.ts        # Donation operations
│   ├── muzakkis.ts         # Muzakki operations
│   ├── admin.ts            # Admin operations
│   └── ...                 # Lainnya
├── backend/                # Additional backend
├── supabase/               # Supabase backend
└── public/                 # Static assets
```

**Total Files**: 192 TypeScript/TSX files

---

## Arsitektur

### Arsitektur Saat Ini

**Pattern**: Traditional React dengan Pages yang tebal

**Alur Data**:
```
Component (Page) → Custom Hook → apiCall() → Backend Provider
                                      ↓
                               ┌────────┴────────┐
                               ↓                 ↓
                           Convex           Supabase
                          (router)      (Edge Function)
```

### Backend Provider Switching

Aplikasi ini menggunakan **Adapter Pattern** untuk routing ke backend:

**File**: `src/lib/backendConfig.ts`
- Environment variable: `VITE_BACKEND_PROVIDER`
- Default: Convex

**File**: `src/lib/supabase.ts`
- Fungsi `apiCall()` routing endpoint ke backend yang sesuai
- Jika `BACKEND_PROVIDER === 'convex'` → `routeToConvex()`
- Jika `BACKEND_PROVIDER === 'supabase'` → Supabase Edge Function

**Endpoint Mapping** (Convex): `src/lib/convexRouter.ts`
- Authentication: `/auth/*`
- Muzakki: `/muzakki/*`
- Donations: `/donations/*`
- Regu: `/regus/*`
- Programs: `/programs/*`
- Admin: `/admin/*`
- dll (total ~20 endpoints)

### State Management

- **Global State**: React Context (`AppContext`)
- **Local State**: useState, useReducer di components
- **Server State**: Custom hooks (useMuzakki, useDonations, dll)

### Data Fetching

**Custom Hooks** (21 total):
- `useAuth` - Authentication state
- `useMuzakki` - Muzakki data
- `useDonations` - Donation data
- `useRegu` - Team/regu data
- `usePrograms` - Program data
- `useAdminData` - Admin data
- `useNotifications` - Notifications
- dll.

**Contoh Pattern**:
```typescript
export function useMuzakki(relawanId: string | null) {
  const [muzakkiList, setMuzakkiList] = useState<Muzakki[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchMuzakki = async () => {
    const response = await apiCall(`/muzakki?relawan_id=${relawanId}`);
    setMuzakkiList(response.data || []);
  };
  
  // ...
}
```

### MVVM Refactoring (In-Progress)

**Dokumentasi**: `MVVM.md`

**Tujuan**: Memisahkan rendering (View) dari state + business logic (ViewModel) dan data access (Model)

**Struktur Target**:
```
features/
  generator-resi/           # Contoh implementasi
    views/                   # View components
    viewmodels/              # Custom hooks (VM)
      useGeneratorResiViewModel.ts
    models/                  # Domain logic
      types.ts
      receiptText.ts
      validation.ts
    data/                    # Repository
      donationRepository.ts
```

**Progress**:
- ✅ Generator Resi sudah mulai refactoring
- ✅ Ada file MVVM di `src/features/generator-resi/`
- ⏳ Fase lain belum di-refactor

**Prioritas Refactoring**:
1. GeneratorResi (mobile + desktop)
2. Donasi/Muzakki hooks → repository layer
3. Auth flow → ViewModel
4. Pages admin → MVVM

---

## Fitur Utama

### 1. User Management
- Phone-based authentication with OTP
- User registration & verification
- Profile management

### 2. Donation Management
- Create donations (Generator Resi)
- Validate donations (Admin)
- Track donation status
- Upload proof of transfer (bukti transfer)
- Generate receipt

### 3. Team Management (Regu)
- Create teams (Regu)
- Join teams with QR code
- Team member management
- Team chat

### 4. Donor Management (Muzakki)
- Add donors
- Track donor status (baru, follow-up, donasi)
- Import contacts
- Follow-up reminders

### 5. Program Management
- Create programs (zakat, sedekah, dll)
- View program details
- Track program donations

### 6. Communication
- Team chat (Chat Regu)
- Message templates
- Follow-up reminders

### 7. Admin Dashboard
- Global statistics
- Regu statistics
- Data management
- Donation validation
- User management

### 8. Responsive Design
- Mobile-first design
- Desktop version for all pages
- Adaptive layout based on screen size

---

## Konfigurasi Build & Deployment

### Vite Configuration
- Plugin: `@vitejs/plugin-react-swc`
- Path alias: `@/*` → `./src/*`
- Build output: `build/`
- Dev server: port 3000

### TypeScript Configuration
- Target: ES2020
- Module: ESNext
- Strict mode: enabled
- No unused locals/params: enabled

### Environment Variables
```
VITE_BACKEND_PROVIDER=convex|supabase
VITE_CONVEX_URL=https://...
```

### Deployment
- **Vercel**: Konfigurasi di `vercel.json`
- **Static Hosting**: Vite build output
- **Convex**: Auto-deploy dari `convex/` folder
- **Supabase**: Edge functions di `supabase/functions/`

---

## Kode Terbesar

**Top 10 Largest Files**:

1. `src/supabase/functions/server/index.tsx` - 2961 lines (Supabase server)
2. `src/pages/AdminDataManagementPage.tsx` - 1293 lines
3. `src/pages/desktop/DesktopAdminDataManagementPage.tsx` - 1275 lines
4. `src/components/ui/sidebar.tsx` - 726 lines
5. `src/supabase/functions/server/seed.tsx` - 699 lines
6. `src/App.tsx` - 586 lines (routing & navigation)
7. `src/pages/GeneratorResiPage.tsx` - 565 lines
8. `src/pages/DetailProspekPage.tsx` - 544 lines
9. `src/pages/desktop/DesktopDetailProspekPage.tsx` - 509 lines
10. `src/pages/AdminDashboardPage.tsx` - 509 lines

**Observasi**:
- Banyak halaman dengan >500 lines → indikasi perlu refactoring
- Duplikasi antara mobile dan desktop versions
- App.tsx cukup besar karena routing logic

---

## Poin-poin Analisis

### Strengths

1. **Backend Flexibility**: Desain adapter pattern memungkinkan switch backend dengan mudah
2. **UI/UX**: Menggunakan shadcn/ui + Radix UI yang modern dan accessible
3. **Responsive**: Mendukung mobile dan desktop dengan baik
4. **Type Safety**: TypeScript strict mode enabled
5. **Real-time**: Convex menyediakan real-time updates
6. **Features**: Fitur lengkap untuk manajemen relawan dan donasi
7. **Testing**: Setup testing dengan Vitest sudah ada
8. **Documentation**: MVVM.md dan BACKEND_CONFIG.md mendokumentasikan arsitektur

### Weaknesses

1. **Code Duplication**: Halaman mobile dan desktop memiliki banyak duplikasi logic
2. **Fat Pages**: Banyak halaman dengan >500 lines, mixing concerns
3. **Inconsistent Architecture**: Sebagian code menggunakan pattern MVVM, sebagian belum
4. **Limited Error Handling**: Beberapa hooks belum memiliki error handling yang baik
5. **Global State**: AppContext mungkin terlalu besar untuk skala ini
6. **No Router**: Menggunakan manual page routing bukan React Router
7. **Large Supabase Server**: `index.tsx` sangat besar (2961 lines)
8. **Limited Testing**: Tidak banyak test files terlihat

### Technical Debt

1. **Refactoring MVVM**: Sebagian besar halaman belum di-refactor ke MVVM
2. **Repository Layer**: Data access masih tersebar di hooks, belum terpusat
3. **Error Boundaries**: Tidak ada error boundary components
4. **Loading States**: Tidak konsisten (ada LOADING_STATE_EXAMPLES.tsx)
5. **Type Coercion**: Beberapa tempat menggunakan type assertion (`as`)
6. **Console Logs**: Banyak debug console.log yang perlu dibersihkan

### Security Considerations

1. **JWT Tokens**: JWT digunakan untuk auth, perlu review expiration & refresh
2. **File Upload**: Validasi file upload (max 5MB, image only) ada, tapi perlu review security
3. **Environment Variables**: API keys di env, baik untuk security
4. **CORS**: Perlu memastikan CORS configuration di backend
5. **Rate Limiting**: Tidak terlihat implementasi rate limiting

---

## Rekomendasi

### Short Term (Immediate)

1. **Split Large Files**:
   - Split `AdminDataManagementPage.tsx` into smaller components
   - Split `App.tsx` routing into separate file
   - Refactor `supabase/functions/server/index.tsx`

2. **Remove Debug Logs**:
   - Clean up console.log statements in production

3. **Error Handling**:
   - Add Error Boundary component
   - Standardize error handling in hooks

4. **Testing**:
   - Add critical path tests (auth, donation creation)
   - Add tests for MVVM features

### Medium Term

1. **Continue MVVM Refactoring**:
   - Prioritasi halaman yang sering berubah
   - Extract pure functions & repository wrappers
   - Dedup mobile vs desktop logic

2. **Repository Pattern**:
   - Create centralized repository layer
   - Standardize API response mapping

3. **Router**:
   - Consider using React Router for better routing
   - Implement proper history management

4. **State Management**:
   - Consider splitting AppContext into smaller contexts
   - Or adopt a state management library (Zustand, Jotai)

### Long Term

1. **Performance**:
   - Implement code splitting
   - Add lazy loading for heavy pages
   - Optimize re-renders with useMemo/useCallback

2. **Accessibility**:
   - Audit WCAG compliance
   - Add ARIA labels where missing
   - Keyboard navigation support

3. **Monitoring**:
   - Add error tracking (Sentry)
   - Add performance monitoring
   - Add analytics

4. **CI/CD**:
   - Setup automated tests in CI/CD
   - Add linting & type checking in pipeline

---

## Deployment & Production Readiness

### Environment Setup

**Required Variables**:
```bash
VITE_BACKEND_PROVIDER=convex
VITE_CONVEX_URL=https://your-convex-url.convex.cloud
```

**Optional**:
```bash
VITE_BACKEND_PROVIDER=supabase  # Switch to Supabase
```

### Deployment Checklist

- [ ] Backend deployed (Convex or Supabase)
- [ ] Environment variables configured
- [ ] Storage configured (Backblaze B2)
- [ ] Edge functions deployed (if using Supabase)
- [ ] Static assets built (`npm run build`)
- [ ] Vercel/Netlify/AWS deployment configured
- [ ] Custom domain configured
- [ ] SSL/HTTPS enabled
- [ ] Error tracking setup
- [ ] Monitoring setup

---

## Lisensi & Penggunaan

**Lisensi**: Waqf (Islamic endowment)

**Permitted Use**:
- Islamic organizations and charitable activities
- Community service initiatives
- Educational and humanitarian purposes

**Prohibited Use**:
- Commercial exploitation for profit
- Use contrary to Islamic principles
- Distribution to entities engaged in haram activities

---

## Kontak & Kontribusi

**GitHub Repository**: https://github.com/hasan197/relawan-app

**Issues & Feature Requests**: GitHub Issues

**Contribution Guidelines**: Lihat README.md

---

## Catatan Akhir

Proyek ini adalah aplikasi volunteer management yang komprehensif dengan fitur lengkap. Arsitektur backend yang fleksibel (Convex/Supabase) adalah kekuatan utama. Refactoring MVVM yang sedang berlangsung adalah langkah yang tepat untuk meningkatkan maintainability. Fokus utama ke depan adalah:

1. Menyelesaikan refactoring MVVM
2. Mengurangi duplikasi code
3. Memperbaiki code organization
4. Menambah test coverage
5. Mempersiapkan untuk production deployment

Proyek ini berpotensi menjadi solusi yang sangat berguna untuk komunitas Muslim dalam mengelola aktivitas zakat, sedekah, dan relawan.

---

**Analisis dibuat oleh**: AI Assistant  
**Tanggal**: 2026-02-03
