# SIPAKU

Sistem Informasi dan Pengelolaan Administrasi Komisariat PK IPNU-IPPNU UNUGIRI.

## Fondasi aplikasi

- React + TypeScript + Vite + Tailwind CSS
- Firebase Authentication, Cloud Firestore, Storage, Functions, Hosting
- Pendaftaran akun dengan email terverifikasi dan status `pending`
- Role dan status akun ditetapkan backend; akun Super Admin dibuat hanya melalui proses bootstrap tepercaya
- Profil pribadi dipisahkan dari direktori ringkas (`public_people`)
- Data organisasi ditautkan ke periode (`periodId`) agar riwayat masa khidmat tetap tersimpan
- Modul awal: profil organisasi, data anggota, periode/kepengurusan, program/tugas, agenda dan presensi pribadi

## Setup lokal

1. Salin `.env.example` menjadi `.env` lalu isi konfigurasi Firebase client.
2. Isi project ID pada `.firebaserc`.
3. Install dependency frontend: `npm install`.
4. Install dependency functions: `cd functions && npm install`.
5. Jalankan frontend: `npm run dev`.

Jangan pernah menyimpan service account atau private key di repo. Untuk deployment, gunakan Firebase CLI dan kredensial developer tepercaya.

## Bootstrap Super Admin

Tidak ada callable Function publik untuk membuat Super Admin. Buat akun Auth secara manual di Firebase Console atau melalui proses admin tepercaya, verifikasi alamat email, lalu jalankan script bootstrap lokal pada lingkungan tepercaya dengan Application Default Credentials dan variabel:

- `BOOTSTRAP_ADMIN_UID`: UID akun Auth yang sudah dibuat
- `BOOTSTRAP_ADMIN_USERNAME`: harus tepat `PK IPNU IPPNU UNUGIRI`

Jangan masukkan kredensial atau password ke source code. Setelah serah terima, ubah password melalui alur Firebase Authentication.

## Perhatian keamanan dan status

Rules melarang akses umum ke profil pribadi; direktori yang dapat dilihat hanya `public_people` dan harus berisi field non-sensitif. Firebase Rules tidak menyaring field individual pada hasil dokumen, sehingga jangan menaruh NIM/kontak di dokumen direktori.

Konfigurasi dan kode ini adalah fondasi awal, belum berarti deployment atau audit keamanan telah dilakukan. Jalankan Firebase Emulator Suite dan pengujian build/rules sebelum produksi.
