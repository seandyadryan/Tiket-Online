<script setup>
import { computed, ref } from 'vue'

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)

const toInputDate = (date) => date.toISOString().slice(0, 10)

const search = ref({
  from: 'Jakarta',
  to: 'Bandung',
  date: toInputDate(tomorrow),
  passengers: 1,
})

const hasSearched = ref(true)
const selectedTripId = ref(1)
const selectedSeats = ref(['A2'])

const quickCities = ['Jakarta', 'Bandung', 'Yogyakarta', 'Semarang', 'Surabaya', 'Denpasar']

const trips = [
  {
    id: 1,
    operator: 'Hiba Putra Executive',
    class: 'Executive AC',
    depart: '06:30',
    arrive: '09:45',
    duration: '3j 15m',
    price: 125000,
    seats: 18,
    pickup: 'Terminal Pulo Gebang',
    drop: 'Pool Pasteur',
    amenities: ['AC', 'Recliner', 'USB', 'Bagasi'],
    rating: 4.8,
  },
  {
    id: 2,
    operator: 'Hiba Putra Shuttle',
    class: 'Shuttle Premium',
    depart: '10:15',
    arrive: '13:20',
    duration: '3j 5m',
    price: 145000,
    seats: 9,
    pickup: 'Cawang Hub',
    drop: 'Dipatiukur',
    amenities: ['AC', 'Snack', 'USB'],
    rating: 4.7,
  },
  {
    id: 3,
    operator: 'Hiba Putra Sleeper',
    class: 'Suite Class',
    depart: '21:00',
    arrive: '05:30',
    duration: '8j 30m',
    price: 320000,
    seats: 6,
    pickup: 'Lebak Bulus',
    drop: 'Terminal Giwangan',
    amenities: ['Sleeper', 'Selimut', 'Makan', 'Toilet'],
    rating: 4.9,
  },
]

const popularRoutes = [
  { route: 'Jakarta ke Bandung', price: 95000, count: '128 jadwal' },
  { route: 'Jakarta ke Yogyakarta', price: 175000, count: '74 jadwal' },
  { route: 'Bandung ke Semarang', price: 160000, count: '52 jadwal' },
  { route: 'Surabaya ke Denpasar', price: 210000, count: '38 jadwal' },
]

const operatorHighlights = [
  'Tiket digital',
  'Pilih kursi',
  'Bisa reschedule',
  'CS 07:00 - 23:00',
]

const seatRows = [
  ['A1', 'A2', '', 'A3', 'A4'],
  ['B1', 'B2', '', 'B3', 'B4'],
  ['C1', 'C2', '', 'C3', 'C4'],
  ['D1', 'D2', '', 'D3', 'D4'],
  ['E1', 'E2', '', 'E3', 'E4'],
]

const soldSeats = ['A1', 'B4', 'C2', 'D3', 'E1']

const selectedTrip = computed(() => trips.find((trip) => trip.id === selectedTripId.value) ?? trips[0])

const total = computed(() => selectedSeats.value.length * selectedTrip.value.price)

const flattenedSeats = computed(() =>
  seatRows.flatMap((row, rowIndex) =>
    row.map((seat, columnIndex) => ({
      id: seat || `aisle-${rowIndex}-${columnIndex}`,
      seat,
    })),
  ),
)

const formattedDate = computed(() =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(search.value.date)),
)

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const setDate = (date) => {
  search.value.date = toInputDate(date)
}

const swapRoute = () => {
  const currentFrom = search.value.from
  search.value.from = search.value.to
  search.value.to = currentFrom
}

const submitSearch = () => {
  hasSearched.value = true
}

const chooseTrip = (tripId) => {
  selectedTripId.value = tripId
  selectedSeats.value = []
}

const toggleSeat = (seat) => {
  if (!seat || soldSeats.includes(seat)) return
  if (selectedSeats.value.includes(seat)) {
    selectedSeats.value = selectedSeats.value.filter((selectedSeat) => selectedSeat !== seat)
    return
  }
  selectedSeats.value = [...selectedSeats.value, seat]
}
</script>

<template>
  <div class="app-shell">
    <div class="promo-bar">
      <span>Promo pembukaan Hiba Putra</span>
      <strong>Diskon 20% untuk 500 pemesan pertama</strong>
    </div>

    <header class="site-header">
      <a class="brand" href="#" aria-label="Hiba Putra beranda">
        <span class="brand-mark">HP</span>
        <span>
          <strong>Hiba Putra</strong>
          <small>Tiket bus online</small>
        </span>
      </a>
      <nav aria-label="Navigasi utama">
        <a href="#jadwal">Jadwal</a>
        <a href="#promo">Promo</a>
        <a href="#bantuan">Bantuan</a>
      </nav>
      <button class="ghost-button" type="button">Tiket Saya</button>
    </header>

    <main>
      <section class="hero-section" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">Partner perjalanan antarkota</p>
          <h1 id="hero-title">Pesan tiket bus Hiba Putra dengan cepat dan nyaman</h1>
          <p>
            Bandingkan jadwal, pilih kursi, dan siapkan perjalanan dari satu layar yang ringan
            untuk desktop maupun mobile.
          </p>
          <div class="trust-row" aria-label="Keunggulan">
            <span>350+ rute</span>
            <span>24 operator mitra</span>
            <span>Pembayaran aman</span>
          </div>
        </div>

        <form class="search-panel" aria-label="Cari tiket bus" @submit.prevent="submitSearch">
          <div class="route-grid">
            <label>
              <span>Dari</span>
              <select v-model="search.from">
                <option v-for="city in quickCities" :key="city" :value="city">{{ city }}</option>
              </select>
            </label>

            <button class="swap-button" type="button" aria-label="Tukar rute" @click="swapRoute">
              <span aria-hidden="true">Tukar</span>
            </button>

            <label>
              <span>Ke</span>
              <select v-model="search.to">
                <option v-for="city in quickCities" :key="city" :value="city">{{ city }}</option>
              </select>
            </label>
          </div>

          <div class="route-grid route-grid-bottom">
            <label>
              <span>Tanggal perjalanan</span>
              <input v-model="search.date" type="date" />
            </label>

            <label>
              <span>Penumpang</span>
              <input v-model.number="search.passengers" min="1" max="8" type="number" />
            </label>
          </div>

          <div class="quick-actions" aria-label="Pilihan tanggal cepat">
            <button type="button" @click="setDate(today)">Hari ini</button>
            <button type="button" @click="setDate(tomorrow)">Besok</button>
          </div>

          <button class="primary-button" type="submit">Cari bus</button>
        </form>
      </section>

      <section class="content-band" id="jadwal" aria-labelledby="schedule-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Jadwal tersedia</p>
            <h2 id="schedule-title">{{ search.from }} ke {{ search.to }}</h2>
          </div>
          <span>{{ formattedDate }}</span>
        </div>

        <div v-if="hasSearched" class="booking-layout">
          <aside class="filter-panel" aria-label="Filter hasil">
            <h3>Filter</h3>
            <label><input type="checkbox" checked /> Berangkat pagi</label>
            <label><input type="checkbox" /> Bisa reschedule</label>
            <label><input type="checkbox" checked /> Kursi tersedia</label>
            <div class="price-range">
              <span>Harga mulai</span>
              <strong>{{ formatCurrency(95000) }}</strong>
            </div>
          </aside>

          <div class="trip-list">
            <article
              v-for="trip in trips"
              :key="trip.id"
              class="trip-card"
              :class="{ selected: selectedTripId === trip.id }"
            >
              <div class="trip-main">
                <div>
                  <p class="operator">{{ trip.operator }}</p>
                  <span>{{ trip.class }}</span>
                </div>
                <div class="rating">Rating {{ trip.rating }}</div>
              </div>

              <div class="timeline">
                <strong>{{ trip.depart }}</strong>
                <span>{{ trip.duration }}</span>
                <strong>{{ trip.arrive }}</strong>
              </div>

              <div class="trip-points">
                <span>{{ trip.pickup }}</span>
                <span>{{ trip.drop }}</span>
              </div>

              <div class="amenities">
                <span v-for="amenity in trip.amenities" :key="amenity">{{ amenity }}</span>
              </div>

              <div class="trip-footer">
                <div>
                  <small>Mulai dari</small>
                  <strong>{{ formatCurrency(trip.price) }}</strong>
                </div>
                <span>{{ trip.seats }} kursi</span>
                <button class="secondary-button" type="button" @click="chooseTrip(trip.id)">
                  Pilih
                </button>
              </div>
            </article>
          </div>

          <aside class="seat-panel" aria-label="Pilih kursi">
            <div class="seat-heading">
              <div>
                <h3>Pilih kursi</h3>
                <span>{{ selectedTrip.operator }}</span>
              </div>
              <span class="driver-seat">Supir</span>
            </div>

            <div class="seat-map">
              <button
                v-for="item in flattenedSeats"
                :key="item.id"
                type="button"
                class="seat"
                :class="{
                  aisle: !item.seat,
                  sold: soldSeats.includes(item.seat),
                  active: selectedSeats.includes(item.seat),
                }"
                :disabled="!item.seat || soldSeats.includes(item.seat)"
                @click="toggleSeat(item.seat)"
              >
                {{ item.seat }}
              </button>
            </div>

            <div class="seat-legend">
              <span><i class="available"></i>Tersedia</span>
              <span><i class="active"></i>Dipilih</span>
              <span><i class="sold"></i>Terisi</span>
            </div>

            <div class="summary-box">
              <span>Kursi</span>
              <strong>{{ selectedSeats.length ? selectedSeats.join(', ') : '-' }}</strong>
              <span>Total</span>
              <strong>{{ formatCurrency(total) }}</strong>
              <button class="primary-button" type="button" :disabled="!selectedSeats.length">
                Lanjutkan
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section class="route-section" aria-labelledby="popular-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Rute favorit</p>
            <h2 id="popular-title">Perjalanan populer minggu ini</h2>
          </div>
        </div>

        <div class="route-cards">
          <article v-for="route in popularRoutes" :key="route.route">
            <span>{{ route.count }}</span>
            <h3>{{ route.route }}</h3>
            <p>Mulai {{ formatCurrency(route.price) }}</p>
          </article>
        </div>
      </section>

      <section class="promo-section" id="promo" aria-labelledby="promo-title">
        <div>
          <p class="eyebrow">Promo eksklusif</p>
          <h2 id="promo-title">Hemat lebih banyak untuk perjalanan keluarga</h2>
          <p>
            Gunakan kode HIBAGO saat checkout. UI ini sudah disiapkan untuk alur promo,
            pemilihan kursi, dan pembayaran online.
          </p>
        </div>
        <div class="promo-stats">
          <strong>537</strong>
          <span>Promo aktif</span>
          <strong>8120</strong>
          <span>Rute tersedia</span>
        </div>
      </section>

      <section class="why-section" aria-labelledby="why-title">
        <div>
          <p class="eyebrow">Mengapa Hiba Putra</p>
          <h2 id="why-title">Alur pemesanan dibuat ringkas untuk penumpang</h2>
        </div>
        <div class="highlight-grid">
          <article v-for="item in operatorHighlights" :key="item">
            <span aria-hidden="true">OK</span>
            <h3>{{ item }}</h3>
            <p>Informasi penting tampil jelas agar proses beli tiket terasa cepat dan pasti.</p>
          </article>
        </div>
      </section>

      <section class="faq-section" id="bantuan" aria-labelledby="faq-title">
        <p class="eyebrow">Bantuan</p>
        <h2 id="faq-title">Pertanyaan umum</h2>
        <details open>
          <summary>Apakah UI ini sudah terhubung ke backend?</summary>
          <p>Belum. Halaman ini hanya UI Vue dan memakai data statis untuk demo.</p>
        </details>
        <details>
          <summary>Apakah database atau backend diubah?</summary>
          <p>Tidak. Backend dan database hanya dicatat sebagai referensi integrasi berikutnya.</p>
        </details>
        <details>
          <summary>Apakah bisa dideploy di Apache Ubuntu 22.04.5?</summary>
          <p>Bisa. Jalankan build lalu salin isi folder dist ke document root Apache.</p>
        </details>
      </section>
    </main>

    <footer class="site-footer">
      <strong>Hiba Putra</strong>
      <span>Frontend Vue untuk pemesanan tiket bus online.</span>
    </footer>
  </div>
</template>
