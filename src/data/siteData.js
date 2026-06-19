export const navGroups = [
  {
    title: 'Beranda',
    slug: 'home',
    links: [
      { title: 'Tentang Hiba Putra', slug: 'tentang' },
      { title: 'Aturan dan Ketentuan', slug: 'aturan' },
      { title: 'Informasi dan Cara Pemesanan', slug: 'informasi' },
    ],
  },
  {
    title: 'Armada',
    slug: 'armada',
    links: [
      { title: 'Super Double Decker', slug: 'armada/super-double-decker' },
      { title: 'Executive', slug: 'armada/executive' },
      { title: 'VIP', slug: 'armada/vip' },
    ],
  },
  {
    title: 'Layanan',
    slug: 'layanan',
    links: [
      { title: 'Antar Kota Antar Propinsi', slug: 'layanan/akap' },
      { title: 'Jabodetabek dan Bandara', slug: 'layanan/bandara' },
      { title: 'Angkutan Pariwisata', slug: 'layanan/pariwisata' },
    ],
  },
  {
    title: 'Agen',
    slug: 'agen',
    links: [
      { title: 'Banten', slug: 'agen/banten' },
      { title: 'DKI Jakarta', slug: 'agen/dki-jakarta' },
      { title: 'Jawa Barat', slug: 'agen/jawa-barat' },
      { title: 'Jawa Tengah', slug: 'agen/jawa-tengah' },
      { title: 'Yogyakarta', slug: 'agen/yogyakarta' },
      { title: 'Jawa Timur', slug: 'agen/jawa-timur' },
      { title: 'Sumatera Selatan', slug: 'agen/sumatera-selatan' },
      { title: 'Lampung', slug: 'agen/lampung' },
    ],
  },
  {
    title: 'Kontak',
    slug: 'kontak',
    links: [
      { title: 'Hubungi Kami', slug: 'kontak/hubungi-kami' },
      { title: 'Sosial Media', slug: 'kontak/sosial-media' },
    ],
  },
]

export const heroImages = {
  home: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1800&q=80',
  armada: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1800&q=80',
  layanan: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1800&q=80',
  agen: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1800&q=80',
  kontak: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80',
}

export const downloadLinks = {
  playStore: 'https://play.google.com/store/search?q=hiba%20putra&c=apps',
  appStore: 'https://apps.apple.com/id/app/hiba-putra/id6760380888?l=id',
}

export const homeHighlights = [
  {
    title: '50+ Rute',
    text: 'Rute antarkota, bandara, dan wisata dibuat mudah dicari dari satu tempat.',
  },
  {
    title: 'Reservasi Online',
    text: 'Penumpang dapat memilih jadwal, titik naik, dan menyiapkan tiket digital.',
  },
  {
    title: 'Kenyamanan',
    text: 'Armada tampil dengan informasi kursi, AC, hiburan, dan bagasi yang jelas.',
  },
  {
    title: 'Bantuan',
    text: 'Kontak, agen, dan informasi perjalanan dibuat cepat dipindai pengguna.',
  },
]

export const routeOptions = [
  'Jakarta',
  'Bogor',
  'Bekasi',
  'Tangerang',
  'Bandung',
  'Yogyakarta',
  'Solo',
  'Wonogiri',
]

export const fleetPages = {
  'armada/super-double-decker': {
    title: 'Super Double Decker',
    summary: 'Armada tingkat dua untuk perjalanan jarak jauh dengan kabin lega dan fasilitas lengkap.',
    seats: '44-50',
    service: 'Lintas Propinsi',
    image: heroImages.armada,
    facilities: [
      'Konfigurasi kursi premium',
      'Reclining seat dan sandaran kaki',
      'TV kabin dan audio',
      'Toilet',
      'Selimut dan bantal',
      'USB charging',
      'Bagasi besar',
    ],
    routes: ['Jakarta - Wonogiri', 'Bogor - Jepara', 'Tangerang - Pati', 'Bekasi - Solo'],
  },
  'armada/executive': {
    title: 'Executive',
    summary: 'Bus executive untuk rute reguler dengan susunan kursi nyaman dan layanan stabil.',
    seats: '32-34',
    service: 'Lintas Propinsi',
    image: heroImages.layanan,
    facilities: [
      'Konfigurasi bangku 2-2',
      'Reclining seat',
      'Sandaran kaki',
      'Bantal dan selimut',
      'Televisi',
      'AC dan lampu baca',
      'Bagasi kabin',
    ],
    routes: ['Jakarta Timur - Solo', 'Bogor - Pacitan', 'Depok - Wonogiri', 'Tangerang - Ponorogo'],
  },
  'armada/vip': {
    title: 'VIP',
    summary: 'Pilihan kelas nyaman untuk perjalanan harian dan antarkota dengan harga lebih efisien.',
    seats: '36',
    service: 'Reguler dan Lintas Propinsi',
    image: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?auto=format&fit=crop&w=1800&q=80',
    facilities: [
      'Konfigurasi bangku 2-2',
      'AC penuh',
      'Kursi rebah',
      'Hiburan kabin',
      'Bagasi',
      'Lampu baca',
    ],
    routes: ['Cilegon - Wonogiri', 'Bogor - Karanganyar', 'Tangerang - Pacitan', 'Bekasi - Wonogiri'],
  },
}

export const servicePages = {
  'layanan/akap': {
    title: 'Antar Kota Antar Propinsi',
    summary: 'Layanan perjalanan lintas kota dan lintas provinsi dengan pilihan armada VIP, Executive, dan Double Decker.',
    bullets: ['Full AC', 'Reclining seat', 'Charging station', 'Bagasi kabin', 'Snack dan air mineral', 'Titik naik resmi'],
    cta: 'Cari Tiket Sekarang',
  },
  'layanan/bandara': {
    title: 'Jabodetabek dan Bandara',
    summary: 'Layanan penghubung area Jabodetabek menuju bandara dengan jadwal praktis dan titik naik strategis.',
    bullets: ['Jadwal pagi sampai malam', 'Rute pool dan terminal', 'Kursi bernomor', 'Bagasi teratur', 'Informasi keberangkatan jelas'],
    cta: 'Lihat Jadwal Bandara',
  },
  'layanan/pariwisata': {
    title: 'Angkutan Pariwisata',
    summary: 'Sewa bus untuk kegiatan wisata, perusahaan, sekolah, dan rombongan keluarga.',
    bullets: ['Seat 16, 29, 56, dan 59', 'Microphone dan karaoke', 'Crew berpengalaman', 'Bagasi luas', 'Harga paket fleksibel'],
    cta: 'Ajukan Sewa Bus',
  },
}

export const agentPages = {
  'agen/banten': ['Terminal Pakupatan', 'Cilegon Pool', 'Serang Timur'],
  'agen/dki-jakarta': ['Pulo Gebang', 'Kampung Rambutan', 'Lebak Bulus', 'Kalideres'],
  'agen/jawa-barat': ['Bekasi Timur', 'Bogor Baranangsiang', 'Depok', 'Karawang'],
  'agen/jawa-tengah': ['Semarang', 'Solo Tirtonadi', 'Pati', 'Jepara'],
  'agen/yogyakarta': ['Giwangan', 'Jombor', 'Prambanan'],
  'agen/jawa-timur': ['Surabaya Bungurasih', 'Madiun', 'Bojonegoro', 'Pacitan'],
  'agen/sumatera-selatan': ['Palembang Kertapati', 'Kayu Agung'],
  'agen/lampung': ['Rajabasa', 'Bakauheni', 'Kalianda'],
}

export const pages = {
  home: {
    type: 'home',
    title: 'Pesan tiket Hiba Putra online',
    subtitle: 'Jelajah Nusantara dengan layanan bus antarkota, bandara, dan pariwisata.',
  },
  'search-ticket': {
    type: 'ticketSearch',
    title: 'Hasil Pencarian Tiket',
    subtitle: 'Pilih jadwal bus yang tersedia sesuai rute, tanggal, dan jumlah penumpang.',
  },
  'booking-order': {
    type: 'bookingOrder',
    title: 'Booking Order',
    subtitle: 'Pilih kursi dan cek data pemesan sebelum melanjutkan pembayaran.',
  },
  'passenger-detail': {
    type: 'passengerDetail',
    title: 'Detail Penumpang',
    subtitle: 'Lengkapi title dan nama lengkap sesuai ID untuk setiap penumpang.',
  },
  'review-order': {
    type: 'reviewOrder',
    title: 'Review Booking',
    subtitle: 'Periksa kembali perjalanan, penumpang, dan rincian harga sebelum pembayaran.',
  },
  'payment-method': {
    type: 'paymentMethod',
    title: 'Metode Pembayaran',
    subtitle: 'Pilih metode pembayaran dan selesaikan transaksi sebelum batas waktu.',
  },
  'payment-order': {
    type: 'paymentOrder',
    title: 'Selesaikan Pembayaran',
    subtitle: 'Ikuti instruksi pembayaran sesuai metode yang dipilih.',
  },
  login: {
    type: 'login',
    title: 'Login dan Register',
    subtitle: 'Masuk, daftar akun baru, atau gunakan Gmail untuk akses akun Hiba Putra.',
  },
  profile: {
    type: 'profile',
    title: 'Profil Akun',
    subtitle: 'Kelola session login dan lihat ringkasan data akun Hiba Putra Anda.',
  },
  armada: {
    type: 'overview',
    title: 'Armada Hiba Putra',
    subtitle: 'Pilihan kelas bus untuk perjalanan reguler, lintas provinsi, dan perjalanan jarak jauh.',
    cards: [
      { title: 'Super Double Decker', slug: 'armada/super-double-decker', text: 'Kabin dua tingkat dengan fasilitas premium.' },
      { title: 'Executive', slug: 'armada/executive', text: 'Kelas executive untuk rute reguler jarak jauh.' },
      { title: 'VIP', slug: 'armada/vip', text: 'Pilihan nyaman dan efisien untuk perjalanan antarkota.' },
    ],
  },
  layanan: {
    type: 'overview',
    title: 'Layanan Hiba Putra',
    subtitle: 'Layanan transportasi untuk penumpang umum, bandara, dan kebutuhan rombongan.',
    cards: [
      { title: 'Antar Kota Antar Propinsi', slug: 'layanan/akap', text: 'Rute lintas kota dan lintas provinsi.' },
      { title: 'Jabodetabek dan Bandara', slug: 'layanan/bandara', text: 'Rute penghubung kota dan bandara.' },
      { title: 'Angkutan Pariwisata', slug: 'layanan/pariwisata', text: 'Sewa bus untuk rombongan dan wisata.' },
    ],
  },
  agen: {
    type: 'overview',
    title: 'Agen Hiba Putra',
    subtitle: 'Pilih wilayah agen untuk melihat contoh titik keberangkatan dan layanan penumpang.',
    cards: [
      { title: 'Banten', slug: 'agen/banten', text: 'Pool dan agen area Banten.' },
      { title: 'DKI Jakarta', slug: 'agen/dki-jakarta', text: 'Pool utama area Jakarta.' },
      { title: 'Jawa Barat', slug: 'agen/jawa-barat', text: 'Agen Bekasi, Bogor, Depok, dan Karawang.' },
      { title: 'Jawa Tengah', slug: 'agen/jawa-tengah', text: 'Agen Semarang, Solo, Pati, dan Jepara.' },
      { title: 'Yogyakarta', slug: 'agen/yogyakarta', text: 'Agen Giwangan, Jombor, dan Prambanan.' },
      { title: 'Jawa Timur', slug: 'agen/jawa-timur', text: 'Agen Surabaya, Madiun, Bojonegoro, dan Pacitan.' },
      { title: 'Sumatera Selatan', slug: 'agen/sumatera-selatan', text: 'Agen Palembang dan sekitarnya.' },
      { title: 'Lampung', slug: 'agen/lampung', text: 'Agen Rajabasa, Bakauheni, dan Kalianda.' },
    ],
  },
  kontak: {
    type: 'overview',
    title: 'Kontak Hiba Putra',
    subtitle: 'Kanal bantuan untuk informasi perjalanan, agen, dan pemesanan.',
    cards: [
      { title: 'Hubungi Kami', slug: 'kontak/hubungi-kami', text: 'Form kontak dan alamat kantor.' },
      { title: 'Sosial Media', slug: 'kontak/sosial-media', text: 'Kanal sosial untuk pengumuman dan promo.' },
    ],
  },
  tentang: {
    type: 'content',
    title: 'Tentang Hiba Putra',
    subtitle: 'Solusi transportasi darat yang mengutamakan kenyamanan, ketepatan, dan pelayanan.',
    sections: [
      {
        title: 'Tentang Kami',
        body: 'Hiba Putra disiapkan sebagai brand layanan transportasi bus online yang melayani perjalanan antarkota, bandara, dan kebutuhan wisata. Halaman ini merangkum profil perusahaan, layanan utama, serta kanal pemesanan dalam satu pengalaman yang mudah digunakan.',
      },
      {
        title: 'Visi dan Misi',
        body: 'Menjadi operator perjalanan darat yang terpercaya dengan reservasi praktis, armada nyaman, dan layanan pelanggan yang responsif di setiap titik perjalanan.',
      },
    ],
  },
  aturan: {
    type: 'rules',
    title: 'Aturan dan Ketentuan',
    subtitle: 'Ketentuan pemesanan tiket online, refund, dan perubahan jadwal.',
    rules: [
      'Penumpang hadir di titik keberangkatan minimal 30 menit sebelum jadwal.',
      'Tiket berlaku sesuai nama penumpang, tanggal, jam, dan rute yang tertera.',
      'Bagasi pribadi menjadi tanggung jawab penumpang selama perjalanan.',
      'Barang berbahaya, mudah terbakar, berbau kuat, dan hewan tidak diperbolehkan.',
      'Jadwal, armada, atau rute dapat berubah karena kondisi operasional.',
      'Perubahan jadwal dan refund mengikuti batas waktu serta ketentuan layanan.',
    ],
  },
  informasi: {
    type: 'steps',
    title: 'Informasi dan Cara Pemesanan',
    subtitle: 'Alur pemesanan dibuat mirip dengan pola website operator bus online.',
    steps: [
      'Pilih menu Booking Tiket, tentukan kota asal, tujuan, tanggal, dan jumlah penumpang.',
      'Pilih jadwal perjalanan yang tersedia.',
      'Pilih titik naik, titik turun, dan nomor kursi.',
      'Isi data penumpang sesuai identitas.',
      'Pilih metode pembayaran yang tersedia.',
      'Selesaikan pembayaran sebelum batas waktu transaksi.',
      'Tiket digital dapat dicek dari menu Cek Tiket.',
    ],
  },
  'kontak/hubungi-kami': {
    type: 'contact',
    title: 'Hubungi Kami',
    subtitle: 'Silakan hubungi representatif Hiba Putra untuk bantuan pemesanan dan kerja sama.',
  },
  'kontak/sosial-media': {
    type: 'social',
    title: 'Sosial Media',
    subtitle: 'Kanal sosial untuk informasi rute, promo, dan pengumuman operasional.',
  },
}
