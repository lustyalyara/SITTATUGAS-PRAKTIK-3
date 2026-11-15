# SITTA – Tugas Praktik 3 STSI4209

Aplikasi sederhana Sistem Informasi Tiras dan Transaksi Bahan Ajar Universitas Terbuka menggunakan Vue.js 2, Vue Component, dan Vue Template.

## Menjalankan aplikasi
1. Ekstrak folder `tugas3-vue-ut`.
2. Buka folder tersebut di Visual Studio Code.
3. Jalankan `index.html` menggunakan ekstensi **Live Server**. Jangan membuka file dengan klik dua kali karena browser membatasi `fetch()` untuk file JSON dan template.
4. Pastikan perangkat terhubung ke internet untuk memuat Vue.js dari CDN.

## Struktur proyek
```text
tugas3-vue-ut/
├── index.html
├── assets/
│   └── css/style.css
├── data/dataBahanAjar.json
├── js/
│   ├── app.js
│   ├── services/api.js
│   └── components/
│       ├── stock-table.js
│       ├── do-tracking.js
│       ├── status-badge.js
│       └── app-modal.js
└── templates/
    ├── stock-table.html
    ├── do-tracking.html
    ├── status-badge.html
    └── app-modal.html
```

## Penerapan materi Vue.js
- **Component dan template:** `ba-stock-table`, `do-tracking`, `status-badge`, dan `app-modal` didaftarkan melalui `Vue.component()`; template disimpan terpisah di folder `templates`.
- **Data rendering:** mustache (`{{ }}`), `v-text`/`v-html` pada badge status dan catatan, serta `v-for` untuk daftar data.
- **Directive:** `v-if`, `v-else`/kondisi alternatif, `v-show` melalui tooltip status, `v-bind` (`:`), `v-model`, dan event `@click`, `@submit`, `@keydown`.
- **Computed:** daftar stok hasil filter dan sorting, statistik stok, pilihan kategori sesuai UT-Daerah, paket terpilih, nomor DO otomatis.
- **Watcher:** perubahan filter UT-Daerah mengatur ulang kategori; perubahan filter stok dipantau; keyword pencarian dan pilihan paket juga dipantau.
- **Filter teks:** format Rupiah, satuan buah, tanggal, dan tanggal-waktu.
- **Form dan validasi:** tambah/edit stok, hapus dengan konfirmasi, buat DO, dan tambah progress pengiriman.

## Catatan penggunaan
Data bersumber dari `data/dataBahanAjar.json`. Aplikasi ini merupakan front-end/dummy data tanpa backend atau database. Perubahan data berlaku selama aplikasi terbuka; muat ulang halaman akan mengembalikan data awal JSON. Untuk menyimpan perubahan secara permanen diperlukan backend atau penyimpanan tambahan, yang tidak termasuk implementasi ini.

Pilihan ekspedisi mengikuti data `pengirimanList` pada JSON terlampir (Reguler dan Ekspres). Data awal tracking memuat nomor DO `DO2025-0001`; entri dengan nomor sama ditampilkan sebagai satu pengiriman agar tidak terduplikasi.
