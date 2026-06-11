# Hiba Putra - Tiket Online

Frontend Vue.js untuk UI pemesanan tiket bus online Hiba Putra. Aplikasi ini hanya berisi
antarmuka pengguna dengan data statis untuk demo.

Backend `D:\ticket-api` dan database SQL Server tidak diubah.

## Fitur UI

- Form pencarian rute, tanggal perjalanan, dan jumlah penumpang.
- Daftar jadwal bus dengan harga, fasilitas, titik naik, dan titik turun.
- Simulasi pemilihan kursi dan ringkasan total.
- Area promo, rute populer, highlight layanan, FAQ, dan footer.
- Layout responsif untuk desktop dan mobile.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

## Build Untuk Apache Ubuntu 22.04.5

```bash
npm run build
```

Salin isi folder `dist` ke document root Apache, misalnya:

```bash
sudo rsync -av dist/ /var/www/html/
sudo systemctl reload apache2
```

Jika nanti frontend dihubungkan ke backend, arahkan request API ke service dari
`D:\ticket-api` melalui konfigurasi environment atau reverse proxy Apache.
