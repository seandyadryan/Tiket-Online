# Hiba Putra - Tiket Online

Frontend Vue.js untuk UI pemesanan tiket bus online Hiba Putra. Form booking sudah diarahkan
ke API environment dev untuk data asal, tujuan, dan jumlah maksimal penumpang.


## Fitur UI

- Form pencarian rute, tanggal perjalanan, dan jumlah penumpang dari API dev.
- Login, register, dan login dengan Gmail menggunakan Firebase + endpoint auth API.
- Daftar jadwal bus dengan harga, fasilitas, titik naik, dan titik turun.
- Simulasi pemilihan kursi dan ringkasan total.
- Area promo, rute populer, highlight layanan, FAQ, dan footer.
- Layout responsif untuk desktop dan mobile.

## Menjalankan Lokal

```bash
corepack pnpm install
corepack pnpm run dev
```

Default `build` saat ini memakai environment dev terlebih dahulu.
Endpoint auth mengikuti aplikasi mobile:

- `auth/login`
- `auth/register`
- `auth/external-auth`

```bash
corepack pnpm run build
```

Untuk build production:

```bash
corepack pnpm run build:prod
```

## Build Untuk Apache Ubuntu 22.04.5

```bash
corepack pnpm run build
```

Salin isi folder `dist` ke document root Apache, misalnya:

```bash
sudo rsync -av dist/ /var/www/html/
sudo systemctl reload apache2
```

Jika nanti frontend diarahkan ke production, gunakan `corepack pnpm run build:prod`.
