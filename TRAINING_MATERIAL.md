# Materi Pelatihan (Training Material) ZISWAF Manager

**Target Peserta**: Relawan Baru, Pembimbing Regu, dan Staf Admin/Keuangan  
**Durasi Estimasi**: 2 Jam (Termasuk Sesi Tanya Jawab)  
**Tujuan Pelatihan**: Memastikan semua pengguna memahami alur kerja aplikasi, cara mencatat aktivitas fund-raising, dan prosedur validasi keuangan.

---

## 📌 SESI 1: Pengenalan & Persiapan (15 Menit)

### 1. Apa itu ZISWAF Manager?
- Penjelasan singkat: Ini adalah aplikasi *Relawan Digital* pengganti form kertas & buku kuitansi manual. 
- Misi: Semua pendataan Muzakki, resi donasi, dan target tim terekam real-time secara online untuk memudahkan transparansi.

### 2. Praktik Login Bersama
- **Instruktur**: Minta semua peserta membuka aplikasi URL di HP masing-masing (Android/iPhone via Browser).
- **Langkah Praktik**:
  1. Masukkan nomor WhatsApp yang aktif (+62 / 08...).
  2. Tekan "Kirim OTP".
  3. Cek notifikasi WhatsApp, lalu masukkan 6 digit OTP.
  4. (Bagi admin: Pastikan role peserta sudah di-set ke `relawan` dari layar Admin sebelum training dimulai).

---

## 🚀 SESI 2: Modul Utama Relawan (45 Menit)
*Sesi ini wajib diperhatikan oleh semua Relawan Lapangan & Pembimbing Regu.*

### 1. Membaca Peta Kekuatan (Dashboard)
- Tunjukkan cara membaca **Target Bulanan** vs **Capaian Nominal**.
- Tunjukkan diagram donasi personal.
- *Tip Instruktur*: Beritahu relawan bahwa skor ini dipantau juga oleh Pembimbing Regu, sehingga memicu semangat mencapai target.

### 2. Praktik Membangun Database (Menu Muzakki)
- **Instruktur**: Pandu relawan untuk buka menu `Muzakki/Donatur`.
- **Latihan A (Input Manual)**: 
  - Minta Relawan klik tombol `+`. Masukkan nama rekan sebelah mereka sebagai percobaan, set status `Prospek Baru`.
- **Latihan B (Import Kontak)**:
  - Tunjukkan fitur klik `Import Kontak` untuk memudahkan tidak usah mengetik satu-satu dari buku telepon HP.
- **Latihan C (Follow Up via WA)**:
  - Klik nama Muzakki berstatus *Follow Up*. Tunjukkan tombol *Kirim Pesan (WhatsApp)*.
  - Tunjukkan betapa cepatnya memanggil *Template Pesan* sapaan Jumat Berkah tanpa capek ngetik.

### 3. Praktik Lapor Donasi & Cetak Resi (Menu Generator Resi)
- Ini adalah inti dari aplikasi ZISWAF.
- **Simulasi Skenario**: "Seorang donatur Bapak A mentransfer Rp 50.000 untuk Infaq".
- **Langkah Praktik**:
  1. Buka `Lapor Donasi`.
  2. Pilih donatur.
  3. Isi nominal `50000` (tanpa titik). Pilih metode: `Transfer Bank`.
  4. **PENTING**: Minta relawan mencoba upload sembarang foto (sebagai simulasi *Bukti Transfer*). Tekankan bahwa format gambar harus jpg/png.
  5. Klik hijau "Lapor Donasi".
  6. Setelah Resi Digital keluar, ajar relawan menekan tombol `Bagikan` untuk mengirim *soft-copy* resi menunggu validasi ke chat WA donatur.

### 4. Koordinasi Tim (Menu Regu)
- Buka `Regu Saya`.
- Praktik: Minta satu Pembimbing membuat Regu "Regu Pelatihan 1", lalu tunjukkan *QR Code/Kode Gabung* ke proyektor. Minta relawan scan QR tersebut untuk join.
- Coba tes lempar obrolan di fitur *Chat Regu*.

---

## 💼 SESI 3: Modul Backoffice Admin & Keuangan (30 Menit)
*Sesi khusus untuk pengguna dengan hak akses `admin` atau `superadmin`.*

### 1. Validasi Keuangan (Menu Validasi Donasi)
- **Instruktur**: Penekanan bahwa "Nominal belum masuk rekap Yayasan dan Dasbor Relawan jika Admin belum menekan *Validasi*".
- **Praktik**: 
  - Admin membuka antrean ber-badge *Kuning / Pending*.
  - Buka *Lihat Bukti*, cek fotonya.
  - Praktik **Setujui (Hijau)**: Uang tervalidasi.
  - Praktik **Tolak (Merah)**: Minta admin mencoba menolak satu donasi, dan *wajib mengisi kolom alasan tolakan* agar relawan tidak bingung (contoh ketik: "Bukti transfer buram, mohon foto ulang").

### 2. Pusat Kendali (Menu Data Management)
- Admin diajari membuka menu *Multi-Tab*:
  - **Tab User Management**: Cara merubah jabatan relawan jadi pembimbing, dan membekukan akun.
  - **Tab Program**: Cara Admin pusat merilis promo *Campaign Zakat Baru* untuk dieksekusi relawan (Input: Judul, Target Dana Rp, Foto Banner, Tanggal Selesai).
  - **Tab Template**: Cara *Superadmin* menyeragamkan redaksi Whatsapp relawan se-nasional memakai format `{nama}` dan `{jumlah}`.

### 3. Ekspor & Tools (Menu Admin Tools)
- Cara *Superadmin* menyebarkan papan pengumuman lewat fitur *Broadcast Notifikasi*.
- Cara mengunduh file Excel (*Download Report*).

---

## ❓ SESI 4: FAQ & Troubleshooting Paling Sering (15 Menit)

🗣️ **Relawan**: *Saya sudah lapor donatur Rp 2 Juta, kok di progress bar saya masih 0?*
💡 **Jawaban**: Silakan cek status donasi Anda. Jika masih berstatus `Menunggu` (jam pasir), berarti pihak Keuangan/Admin pusat belum menceklis bukti mutasi rekeningnya.

🗣️ **Admin**: *Ada relawan salah mendaftarkan donasi (Rp 10.000.000 harusnya Rp 1.000.000), bagaimana perbaikannya?*
💡 **Jawaban**: Admin silakan tolak donasi (Reject) dengan alasan "Salah ketik nominal". Relawan kemudian mendaftarkan donasi baru yang benar dengan nominal Rp 1.000.000 dengan melampirkan foto bukti yang sama. 

🗣️ **Relawan**: *Apakah saya bisa pakai nomor beda / login di komputer sekaligus?*
💡 **Jawaban**: Bisa, gunakan nomor WA utama untuk menerima kode OTP, lalu buka URL di laptop dan masukan kode tersebut.

🗣️ **Relawan**: *Kenapa bukti transfer foto/kuitansi saya tidak bisa terupload atau gagal dilaporkan?*
💡 **Jawaban**: Cek kembali file foto Anda. Batas aman aplikasi adalah format JPG atau PNG dengan maksimum ukuran foto sebesar 5MB. Pastikan sinyal internet stabil saat Anda upload foto (jangan putus).

---

## 📝 LEMBAR CEKLIST PENILAIAN / POST-TEST

_(Untuk Instruktur: Gunakan daftar ini untuk memastikan peserta sudah lulus training)_

- [ ] Relawan berhasil Login menggunakan OTP.
- [ ] Relawan tahu cara menambahkan 1 prospek di menu Muzakki.
- [ ] Relawan tahu cara memilih Template untuk Follow-Up WA.
- [ ] Relawan bisa melakukan demonstrasi **Upload Bukti Transfer** dan membuat 1 Resi Donasi.
- [ ] Relawan berhasil scan/gabung ke dalam Regu dan tes 1 chat.
- [ ] Admin berhasil klik Validasi & coba menolak 1 simulasi resi.
- [ ] Admin bisa menambahkan 1 contoh Program Campaign ZISWAF.

---
**Dokumen Selesai** - *Selamat Mencetak Relawan Handal!*
