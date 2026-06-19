<script setup>
import { computed } from 'vue'

const props = defineProps({
  auth: {
    type: Object,
    default: null,
  },
  criteria: {
    type: Object,
    default: null,
  },
  error: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  tickets: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['change-search', 'require-login', 'select-ticket'])

const formatDate = (date) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const getFacilities = (icon) =>
  String(icon || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const getPhoto = (photo) => String(photo || '').split(',').find(Boolean)

const resultText = computed(() => {
  if (props.loading) return 'Mencari jadwal tersedia'
  return `Menampilkan ${props.tickets.length} hasil`
})

const getTicketKey = (ticket) => `${ticket.id}-${ticket.trayekId}-${ticket.to}`

const selectTicket = (ticket) => {
  if (!props.auth?.accessToken) {
    emit('require-login')
    return
  }

  emit('select-ticket', ticket)
}
</script>

<template>
  <section v-if="criteria || loading || error" class="ticket-results">
    <div class="search-summary-card">
      <div>
        <div class="route-title">
          <strong>{{ criteria?.fromName || '-' }}</strong>
          <span></span>
          <strong>{{ criteria?.toName || '-' }}</strong>
        </div>
        <p>
          {{ formatDate(criteria?.date) }}
          <span></span>
          {{ criteria?.passenger || 1 }} Kursi
        </p>
      </div>

      <button class="change-search-button" type="button" @click="emit('change-search')">
        Ubah Pencarian
      </button>
    </div>

    <div class="ticket-layout">
      <aside class="ticket-filter">
        <article>
          <h3>Urutkan</h3>
          <label><input checked name="sort" type="radio" /> Waktu Keberangkatan</label>
          <label><input name="sort" type="radio" /> Harga Termurah</label>
          <label><input name="sort" type="radio" /> Kursi Tersedia</label>
        </article>

        <article>
          <h3>Filter Hasil Pencarian</h3>
          <strong>Fasilitas</strong>
          <label><input checked type="checkbox" /> AC</label>
          <label><input checked type="checkbox" /> Toilet</label>
          <label><input checked type="checkbox" /> TV</label>
          <label><input checked type="checkbox" /> Reclining</label>
        </article>
      </aside>

      <div class="ticket-list-panel">
        <p class="result-count">{{ resultText }}</p>

        <div v-if="loading" class="ticket-empty">
          <h3>Mengambil jadwal bus...</h3>
          <p>Mohon tunggu sebentar.</p>
        </div>

        <div v-else-if="error" class="ticket-empty">
          <h3>Pencarian belum berhasil</h3>
          <p>{{ error }}</p>
        </div>

        <div v-else-if="!tickets.length" class="ticket-empty">
          <h3>Jadwal tidak ditemukan</h3>
          <p>Coba ubah tanggal, asal, tujuan, atau jumlah penumpang.</p>
        </div>

        <template v-else>
          <article v-for="ticket in tickets" :key="getTicketKey(ticket)" class="ticket-card">
            <div class="ticket-card-main">
              <div class="operator-line">
                <img v-if="getPhoto(ticket.photo)" :src="getPhoto(ticket.photo)" alt="" />
                <div>
                  <strong>{{ ticket.title }}</strong>
                  <span>{{ ticket.id }} - Jalur {{ ticket.jalur }}</span>
                </div>
              </div>

              <div class="ticket-badges">
                <span>{{ ticket.class }}</span>
                <span>{{ ticket.jmlSeat }} Seat</span>
              </div>
            </div>

            <div class="ticket-time-row">
              <div>
                <strong>{{ ticket.time }}</strong>
                <span>{{ ticket.from }}</span>
              </div>
              <div class="ticket-route-line">
                <span></span>
              </div>
              <div>
                <strong>{{ ticket.to }}</strong>
                <span>{{ ticket.addressDropOff || 'Alamat tujuan menyusul' }}</span>
              </div>
            </div>

            <div class="facility-list">
              <span v-for="facility in getFacilities(ticket.icon)" :key="facility">{{ facility }}</span>
            </div>

            <div class="ticket-footer-row">
              <div class="price-block">
                <small>Mulai dari</small>
                <strong>{{ ticket.priceDescription || formatPrice(ticket.price) }}</strong>
              </div>

              <div class="seat-block">
                <strong>{{ ticket.seatAvailable }}</strong>
                <span>Kursi tersedia</span>
              </div>

              <button class="primary-action" type="button" @click="selectTicket(ticket)">
                Pilih Kursi
              </button>
            </div>
          </article>
        </template>
      </div>
    </div>
  </section>
</template>
