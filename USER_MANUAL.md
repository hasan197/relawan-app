# Buku Panduan Pengguna Lengkap (User Manual) Relawan & Admin Aplikasi ZISWAF Manager

Selamat datang di platform **ZISWAF Manager**. Panduan ini berisi penjelasan lengkap dan detail fungsional untuk memudahkan **Relawan** maupun **Admin** dalam menggunakan seluruh fasilitas sistem secara optimal.

---

## 🔐 1. Akses Sistem & Login (Semua Pengguna)
Aplikasi hanya menggunakan aktivasi **OTP WhatsApp** demi keamanan dan kecepatan login.
1. Buka tautan sistem pada *browser* Anda.
2. Di halaman **Login/Selamat Datang**, masukkan **Nomor WhatsApp** pada kolom yang tersedia (contoh: `08123456789`). Panjang nomor harus 10-15 digit.
3. Klik tombol **Kirim Kode OTP**.  
   *(Catatan: Jika nomor Anda belum terdaftar, Anda akan diarahkan ke layar Registrasi Profil).*
4. Tunggu kode OTP masuk ke WhatsApp Anda. Masukkan 6 digit kode tersebut ke formulir OTP dan klik **Verifikasi**.

---

# 🦸‍♂️ PANDUAN UNTUK RELAWAN

Sebagai Relawan (atau Pembimbing/Ketua Regu), tugas Anda adalah mengelola prospek, menindaklanjuti donatur, serta melaporkan masuknya donasi.

## 📊 2. Dashboard Panggung Utama
Dashboard akan muncul pertama kali setelah Anda login.
- **Card Target**: Melacak *Target Nominal Donasi* dan *Target Muzakki* bulan/minggu ini. Terdapat *progress bar* persentase capaian.
- **Aktivitas Hari Ini**: Diagram atau statistik ringkas pergerakan relawan.
- **Navigasi Bawah**: Gunakan menu bawah untuk pindah cepat ke: Dasbor, Lapor Donasi, Muzakki, Target/Laporan, dan Pengaturan.

## 👥 3. Mengelola Tim (Menu Regu)
Relawan bergerak secara tim (Regu). Anda harus tergabung ke grup untuk performa kolektif.
1. Buka menu **Regu Saya** (My Regus).
2. Tiga aksi utama untuk Regu:
   - **Gabung Regu**: Klik tombol *Join* lalu Ketik "Kode Refferal Grup", atau klik tombol pindai **QR Code**. 
   - **Buat Regu (Opsional)**: Anda dapat membuat Regu baru jika Anda berposisi sebagai Pembimbing.
   - **Chat Regu**: Di dalam detail Regu, Anda masuk ke forum obrolan internal antarteman seregu untuk berkoordinasi.

## 👥 4. Buku Kontak Donatur (Menu Muzakki)
Halaman ini adalah *buku telepon digital* Anda khusus untuk calon donatur.
1. Masuk ke halaman **Muzakki/Donatur**.
2. **Tambah Manual**: Klik ikon "Tambah" (`+`). Isi kolom wajib: Nama & Nomor Telepon.
3. **Import Kontak**: Agar tidak mengetik satu-satu, klik fitur `Import Kontak` untuk menyalin dari *Phonebook* perangkat HP Anda.
4. **Status Muzakki**: Setiap nama akan diberi *tag* (label status) oleh Anda: 
   - `Baru` (Kandidat hangat), 
   - `Follow-up` (Sedang dihubungi), 
   - `Donasi` (Berhasil bayar).

## 💬 5. Kirim WhatsApp & Template Pesan
Anda tidak perlu repot mengetik ulang format sapaan karena Admin pusat sudah membakukan *Template Pesan*.
1. Saat berada di halaman Muzakki > klik nama orang berstatus "Follow Up"
2. Klik tombol **Kirim Pesan (WhatsApp)**.
3. Layar pop-up akan menampilkan "Pilih Template":
   * (Contoh: *Template Salam Jumat Berkah*, *Reminder Zakat Bulanan*, *Ucapan Terima Kasih*).
4. Klik **Kirim**. Aplikasi akan langsung membuka dan mengarahkan Anda ke aplikasi WhatsApp utama dengan pesan yang merujuk pada `Nama Donatur`.

## 💳 6. Lapor Donasi (Generator Resi)
Alat wajib harian. Laporankan setiap sumbangan baru.
1. Buka navigasi **Lapor Donasi**. 
2. Pada formulir isi:
   - **Dropdown Pilih Donatur**: Pilih dari daftar prospek.
   - **Kategori**: Pilih `Zakat`, `Infaq`, `Sedekah`, atau `Wakaf`.
   - **Metode Pembayaran**: `Transfer Bank`, `QRIS`, atau `Tunai`.
   - **Nominal (Rp)**: Masukkan hanya angka (Contoh: `5000000`).
   - **Bukti Transfer**: *(Wajib jika metode Transfer!)*. Klik panah Upload, pilih gambar (`JPG/PNG` max 5MB) mutasi dari donatur.
3. Klik tombol hijau **Lapor Donasi**.
4. **Resi Digital** otomatis keluar. Klik tombol **Salin** atau **Bagikan** di bawah resi untuk segera di-forward buktinya ke WhatsApp Donatur (Status Sementara: *Menunggu Validasi Admin*).

## 📋 7. Menu Laporan, Program Aktif & Notifikasi
Di luar pelaporan keuangan, Anda juga dibekali alat pendukung.
- **Program (Campaign)**: Cari tahu program apa yang sedang dibuka oleh Pusat (misal: "Wakaf Sumur Palestina") lengkap dengan brosur/banner di menu **Program ZISWAF**.
- **Notifikasi**: Tombol lonceng di atas layar Dasbor. Info jika *Donasi divalidasi/ditolak* oleh admin ada di mari.
- **Laporan & Riwayat**: Cek menu **Riwayat Aktivitas** atau Laporan Performa bulanan pribadi Anda agar tetap semangat.

---

# 👨‍💻 PANDUAN UNTUK ADMIN PUSAT

Login dengan status **Admin** akan menampilkan antarmuka dan hak istimewa yang murni bertugas mengatur _pembukuan dan sistem pangkalan data_.

## 📊 8. Dasbor Keuangan Admin
1. Dasbor admin memuat angka *real-time*: **Global Stats**.
2. Menampilkan jumlah seluruh donasi berstatus *Pending*, *Valid*, dana *Tolak*, sampai jumlah Relawan total.

## ✍️ 9. Validasi Keuangan Donasi (Core Action)
Seluruh laporan masuk para Relawan tertahan di halaman ini. **Mustahil angka yayasan naik bila Admin tidak klik tombol Validasi!**
1. Buka halaman **Validasi Donasi**.
2. Fokus ke daftar *Badge Kuning: Menunggu (Pending)*.
3. Klik tombol outline **Mata / Lihat Bukti**. Tab foto transfer (struk rekening/m-banking) relawan akan tampil.
4. Sesuaikan mutasi rekening yayasan.
   - JIKA PAS: Klik tombol centang hijau **Validasi**. Klik konfirmasi. Relawan akan otomatis terkirim notifikasi berhasil.
   - JIKA MUTASI NIHIL / STRUK PALSU / BLUR: Klik tombol silang merah **Tolak**. Pop-up mewajibkan Anda mengisi *Kotak Alasan Penolakan* (misal: "Dana Rp 1Juta belum masuk di klikbca BNI per-tgl X"). Ini agar Relawan tahu mengapa donasinya ditolak.

## 🗃️ 10. Admin Data Management (Pusat Kendali Data)
Semua entitas berada dalam kekuasaan Admin di satu halaman **Data Management**. Menggunakan navigasi *Tab* di bagian layar:
1. **Tab Users / Relawan**:
   - Untuk menambah akun baru secara "pintu belakang", mengubah *Role* seseorang (contoh: Promosi Relawan biasa menjadi *Pembimbing* regu).
2. **Tab Regu**:
   - Membuat nama *Grup Yayasan* baru (Misal: "Cabang Bandung Utara").
   - Menunjuk nama "Pembimbing regu", hingga mengedit Target Dana untuk grup tersebut.
3. **Tab Muzakki & Donasi**:
   - Mengubah langsung biodata seorang donatur lintas relawan jika terjadi redudansi (double record). 
   - Anda juga bisa menghapus (Delete) / Edit donasi yang mengalami Typo sistem ekstrim.
4. **Tab Program**:
   - Fungsi untuk meluncurkan Campaign Baru.
   - Anda bisa membuat judul baru (Misal "Sedekah Beras Yatim").
   - Masukkan *Target Nominal* dan **URL Banner / Foto** campaign.
   - Jika pendanaan sudah selesai, Admin harus mengganti Status Program dari `Active` ke `Completed/Inactive` di tab ini.
5. **Tab Template Pesan**:
   - Pusat bisa menyeragamkan gaya copywriting / format sapaan WhatsApp dengan menu Editor Template.
   - Anda cukup simpan kerangka seperti ini: `"Assalamualaikum {nama}, donasi {program} sebesar {jumlah} telah tervalidasi."` Variabel kurung kurawal `{}` ini nantinya akan diekstrak otomatis saat relawan memencet tombol *Send_Wa*.

## ⚙️ 11. Admin Tools & System
Fitur bagi `Superadmin` untuk melakukan _override_ fungsional:
- Melakukan "Broadcast Notif" pengumuman langsung tayang ke HP / browser seluruh relawan di pagi hari.
- Tarik Laporan Akhir (Export/Generator Excel) dan fungsi pembersihan Database.
