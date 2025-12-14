
## Dokumen strategi refactor frontend → MVVM (tanpa mengubah UI/UX)

### 1) Tujuan & batasan
- **Tujuan utama**: memisahkan *rendering* (View) dari *state + business logic + side effects* (ViewModel) dan *akses data/domain* (Model) agar:
  - lebih mudah dirawat,
  - duplikasi logic (mobile/desktop) turun,
  - perubahan fitur tidak “mengotori” file page.
- **Batasan**: **tidak mengubah hasil akhir UI/UX**.
  - Jangan ubah struktur JSX, className Tailwind, layout, copywriting, atau urutan elemen.
  - Perubahan tahap awal hanya “memindahkan logic” dan “rewiring handler”.

---

### 2) Ringkasan arsitektur saat ini (yang relevan untuk strategi)
- **Pages sangat tebal** (contoh [GeneratorResiPage.tsx](cci:7://file:///Users/admin/Workspace/projects/relawan-app/source-code/src/pages/GeneratorResiPage.tsx:0:0-0:0)): berisi form state, validasi, upload file, API call, generate receipt, toast, reset.
- **Hooks data** ([useMuzakki](cci:1://file:///Users/admin/Workspace/projects/relawan-app/source-code/src/hooks/useMuzakki.ts:15:0-147:1), `useDonations`, [useAuth](cci:1://file:///Users/admin/Workspace/projects/relawan-app/source-code/src/hooks/useAuth.ts:12:0-175:1)) sudah semi-*repository* tapi masih:
  - mencampur concerns (debug log, shaping response, caching).
- **API access** terpusat via [apiCall()](cci:1://file:///Users/admin/Workspace/projects/relawan-app/source-code/src/lib/supabase.ts:14:0-101:1) ([src/lib/supabase.ts](cci:7://file:///Users/admin/Workspace/projects/relawan-app/source-code/src/lib/supabase.ts:0:0-0:0)) dan bisa routing ke Convex (`routeToConvex`).
- **Global state** via `AppContext` yang mengagregasi hook-hook.

Artinya: refactor MVVM paling aman adalah **mulai dari layer logic di page** → pindahkan ke ViewModel, **tanpa mengubah JSX**.

---

### 3) Definisi MVVM yang cocok untuk React + TypeScript di repo ini
#### View
- Komponen React (page/component) yang:
  - menerima `state` dan `actions` dari ViewModel,
  - melakukan `render()` sesuai state,
  - event handler hanya memanggil action (mis. `vm.submit()`).
- **Tidak** melakukan:
  - [apiCall()](cci:1://file:///Users/admin/Workspace/projects/relawan-app/source-code/src/lib/supabase.ts:14:0-101:1),
  - validasi bisnis yang kompleks,
  - komposisi text resi,
  - upload / FileReader, dll (ini tugas VM).

#### ViewModel
- Bentuk paling natural di React adalah **custom hook**: `useXxxViewModel()`.
- Bertanggung jawab untuk:
  - state screen (`formData`, `receipt`, `submitting`, `buktiPreview`),
  - side effects (submit, upload, share/copy),
  - validasi,
  - derived values (mis. `formattedAmount`).
- Menggunakan service/repository dari Model layer untuk komunikasi ke backend.

#### Model
- Domain types + use cases + repository/service.
- Pure helper functions (mis. `buildReceiptText`) ditaruh di Model agar bisa dipakai mobile+desktop.

---

### 4) Struktur folder target (minim perubahan, mudah migrasi)
Rekomendasi: *feature-based MVVM*.

```
src/
  features/
    generator-resi/
      views/
        GeneratorResiPageView.tsx              (opsional; bisa tetap pakai src/pages/*)
        DesktopGeneratorResiPageView.tsx       (opsional)
      viewmodels/
        useGeneratorResiViewModel.ts
        useDesktopGeneratorResiViewModel.ts   (atau reuse VM yang sama bila memungkinkan)
      models/
        types.ts
        receiptText.ts
        validation.ts
      data/
        donationRepository.ts
        uploadRepository.ts                   (opsional)
```

Catatan:
- Untuk versi mvvm, kamu **gunakan** page di `features/*/views`.

---

### 5) “Seams” refactor yang aman (agar UI tidak berubah)
Gunakan urutan extraction berikut supaya risiko kecil:

- **Seam A: Pure functions (paling aman)**
  - `buildReceiptText(receipt, mode)`
  - `validateGeneratorResi(formData, user, buktiFile)`
  - Hasil: page masih sama, tapi logic string/validasi keluar.

- **Seam B: Data access**
  - Buat `DonationRepository.createDonation()`
  - Buat [DonationRepository.uploadBuktiTransfer()](cci:1://file:///Users/admin/Workspace/projects/relawan-app/source-code/src/pages/GeneratorResiPage.tsx:69:2-104:4)
  - Page masih bisa memanggil repository langsung sementara (transisi).

- **Seam C: ViewModel**
  - Pindahkan `useState` + handler ke `useGeneratorResiViewModel`.
  - Page tinggal:
    - binding value,
    - `onChange -> vm.setFormData(...)`,
    - `onSubmit -> vm.submit()`.

- **Seam D: Dedup mobile vs desktop**
  - Saat VM/Model layer sudah ada, desktop dan mobile:
    - share `receiptText.ts`,
    - share `validation.ts`,
    - bisa share `use case` submit bila flow sama.

---

### 6) Kontrak ViewModel yang disarankan (agar View tetap tipis)
Untuk `GeneratorResi` minimal seperti ini (konsep, bukan implementasi):

- **State**
  - `formData`
  - `buktiPreview`
  - `submitting`
  - `receipt`
- **Derived**
  - `formattedAmount` (opsional)
  - `isTransferRequiresBukti` (opsional)
- **Actions**
  - `setFormField(key, value)` / `updateForm(partial)`
  - `selectFile(file)`
  - `removeFile()`
  - `submit()`
  - `copyReceipt()`
  - `shareReceipt()`

Dengan kontrak ini, kamu bisa mempertahankan seluruh JSX (layout) dan hanya mengganti isi handler.

---

### 7) Strategi migrasi bertahap skala project (roadmap)
#### Fase 1 — “Stop the bleeding” (cepat, dampak besar)
- Target: page-page paling tebal & sering berubah.
- Aksi:
  - Extract pure functions + repository wrapper.
  - Introduce ViewModel untuk 1–2 fitur paling kompleks (mis. `GeneratorResi`, form program/donasi).

Output fase 1:
- UI sama, logic terpisah, duplikasi berkurang.

#### Fase 2 — Standardisasi data layer
- Buat pola umum:
  - `repositories/*` yang membungkus [apiCall](cci:1://file:///Users/admin/Workspace/projects/relawan-app/source-code/src/lib/supabase.ts:14:0-101:1)
  - mapping response → domain types
- Kurangi log debug di hook production (opsional, tapi jangan ubah behavior).

#### Fase 3 — Rampingkan AppContext (opsional)
- `AppContext` saat ini menggabungkan banyak hook.
- Target MVVM: `AppContext` menjadi “composition root” untuk dependencies/stores.
- Tapi ini **tidak wajib** untuk MVVM awal—lebih baik dikerjakan belakangan.

---

### 8) Guardrails supaya UI/UX benar-benar tidak berubah
- **Tidak menyentuh JSX markup** (kecuali mengganti `onClick={handleX}` menjadi `onClick={vm.handleX}`).
- **Snapshot test / visual check** (manual):
  - buka page sebelum/sesudah refactor,
  - pastikan DOM order & className sama.
- **Kontrak state**: pastikan VM mengembalikan shape state yang sama dengan kebutuhan View.
- **Error/Toast**: pastikan string toast dan timing-nya sama.

---

### 9) Prioritas refactor yang saya rekomendasikan untuk repo ini
Urutan paling “worth it” berdasarkan pola code yang terbaca:

1) **GeneratorResi (mobile + desktop)**: banyak logic, ada upload, validasi, receipt composition.
2) **Donasi/Muzakki hooks**: jadikan repository layer yang bersih, lalu VM per halaman.
3) **Auth flow**: ViewModel untuk login/otp pages (lebih mudah ditest, side effects jelas).
4) **Pages admin**: biasanya kompleks (validasi donasi, management data) cocok MVVM.

---

### 10) Pisahkan URL untuk hasil refactor (MVVM) di URL berbeda
Tujuan bagian ini: kamu bisa deploy/akses versi MVVM untuk QA dan perbandingan, **tanpa mengganti URL existing**.

#### Opsi A — Path prefix di domain yang sama (disarankan untuk localhost)
- **URL existing**: `http://localhost:3000/` (default)
- **URL MVVM (sandbox)**: `http://localhost:3000/mvvm` (dan turunan seperti `/mvvm/generator-resi`)

Pola implementasi (cocok untuk arsitektur saat ini yang belum pakai React Router):
- Saat init `App.tsx`, baca `window.location.pathname`.
- Jika path diawali `/mvvm`, set mode `mvvm` (feature flag) dan render varian MVVM untuk page yang relevan.
- Untuk navigasi internal, kamu bisa tetap memakai `currentPage` seperti sekarang, tapi ketika mode `mvvm` aktif:
  - mapping `currentPage` -> URL `/mvvm/<page>` via `history.pushState(...)` (opsional),
  - dan dengarkan event `popstate` untuk back/forward browser (opsional).

Catatan penting:
- Di dev (Vite) biasanya path seperti `/mvvm` aman.
- Di static hosting/production, path prefix butuh **SPA rewrite** (semua route diarahkan ke `index.html`).

Kelebihan:
- URL benar-benar berbeda per “page”, tetap dalam satu domain.
- Enak untuk QA compare (tinggal buka 2 tab: `/` vs `/mvvm`).

Kekurangan:
- Perlu konfigurasi rewrite saat production (kalau bukan hanya localhost).

#### Opsi B — URL berbeda via query param (paling minim perubahan kode)
- **URL existing**: `/`
- **URL MVVM**: `/?mvvm=1`

Pola implementasi (tanpa React Router):
- Pada init `App.tsx`, baca `new URLSearchParams(window.location.search).get('mvvm')`.
- Jika `mvvm=1`, gunakan varian page MVVM (mis. `GeneratorResiPageMvvm`) saat render.
- Jika tidak, render page existing.

Kelebihan:
- Tidak perlu server rewrite.
- Perubahan kecil (sejalan dengan arsitektur `currentPage` state yang sudah ada).

Kekurangan:
- URL tetap “root”, bedanya hanya query string.

#### Opsi C — Hash-based URL prefix (cocok untuk static hosting)
- **URL existing**: `/#/app` (atau default tanpa hash)
- **URL MVVM**: `/#/mvvm`

Kenapa hash route bagus untuk project ini:
- App saat ini mengontrol navigasi via state `currentPage` (bukan router).
- Hash route tidak butuh konfigurasi server rewrite, jadi aman untuk static hosting.

Pola implementasi:
- Baca `window.location.hash` saat init.
- Jika `#/mvvm`, set “mode MVVM” (feature flag) dan render varian MVVM.
- (Opsional) update hash saat user pindah halaman untuk deep-link.

#### Rekomendasi praktis
- Untuk beda “page” tapi masih satu domain (localhost): **Opsi A (path prefix `/mvvm`)**.
- Untuk perubahan paling kecil: **Opsi B (`?mvvm=1`)**.
- Kalau nanti ingin benar-benar dipisah saat production: subdomain/deploy terpisah tetap bisa dipakai sebagai opsi lanjutan.
