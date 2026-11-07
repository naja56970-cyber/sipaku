# SIPAKU

Sistem Informasi dan Pengelolaan Administrasi Komisariat PK IPNU-IPPNU UNUGIRI.

## Fase 2 - Fondasi aplikasi

Proyek ini adalah fondasi aman untuk SIPAKU berdasarkan keputusan berikut:

- Super Admin username: `PK IPNU IPPNU UNUGIRI`
- Ketua IPNU dan Ketua IPPNU menangani persetujuan program kerja
- Super Admin berwenang penuh atas sistem
- Data anggota pribadi tidak dibuka ke user umum
- Data per periode tetap tersimpan dan tidak ditimpa
- Satu organisasi aktif: PK IPNU-IPPNU UNUGIRI

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting
- Firebase Rules
- Cloud Functions

## Menjalankan aplikasi

1. Salin `.env.example` menjadi `.env`
2. Isi konfigurasi Firebase
3. Install dependency:

```bash
npm install
```

4. Jalankan:

```bash
npm run dev
```

## Struktur awal

- `src/` - aplikasi frontend
- `functions/` - Cloud Functions
- `firestore.rules` - aturan Firestore
- `storage.rules` - aturan Storage
- `firebase.json` - konfigurasi Firebase

## Catatan keamanan

- Admin SDK tidak pernah dipasang di frontend
- Role dan status akun tidak boleh diubah dari aplikasi klien
- Operasi sensitive dikerjakan melalui backend/Cloud Function

## Status

Fase 2 sedang dibangun dan masih dalam tahap fondasi. Fase 3 akan berlanjut ke data organisasi, struktur, dan modul operasional.
