<script setup>
import { computed, ref } from 'vue'
import CheckoutStepper from '../components/CheckoutStepper.vue'
import SeatPicker from '../components/SeatPicker.vue'

const props = defineProps({
  auth: {
    type: Object,
    default: null,
  },
  criteria: {
    type: Object,
    default: null,
  },
  ticket: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['back-to-search', 'login', 'seat-complete'])

const selectedPassengers = ref([])

const passengerCount = computed(() => Number(props.criteria?.passenger || 1))

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

const totalPrice = computed(() => Number(props.ticket?.price || 0) * passengerCount.value)

const handleSeatComplete = ({ passengers }) => {
  selectedPassengers.value = passengers
  emit('seat-complete', passengers)
}
</script>

<template>
  <section class="booking-order-page">
    <div v-if="!auth" class="ticket-empty">
      <h3>Login diperlukan</h3>
      <p>Silakan login terlebih dahulu untuk memilih kursi dan melanjutkan booking.</p>
      <button class="primary-action" type="button" @click="emit('login')">Login</button>
    </div>

    <div v-else-if="!ticket" class="ticket-empty">
      <h3>Data booking belum tersedia</h3>
      <p>Silakan pilih jadwal bus dari halaman hasil pencarian.</p>
      <button class="primary-action" type="button" @click="emit('back-to-search')">
        Kembali ke Hasil Pencarian
      </button>
    </div>

    <template v-else>
      <CheckoutStepper :active-step="1" />

      <div class="booking-order-head">
        <div>
          <p class="eyebrow">Booking Order</p>
          <h2>{{ ticket.title }}</h2>
          <p>{{ ticket.from }} ke {{ ticket.to }} - {{ formatDate(criteria?.date) }}</p>
        </div>
        <button class="ghost-action" type="button" @click="emit('back-to-search')">
          Kembali
        </button>
      </div>

      <div class="booking-order-layout">
        <div class="booking-order-main">
          <SeatPicker
            :passenger-count="passengerCount"
            :ticket="ticket"
            @close="emit('back-to-search')"
            @complete="handleSeatComplete"
          />
        </div>

        <aside class="booking-order-side">
          <h3>Ringkasan Pembayaran</h3>
          <p>{{ passengerCount }} kursi x {{ formatPrice(ticket.price) }}</p>
          <strong>{{ formatPrice(totalPrice) }}</strong>
          <button class="primary-action" type="button" :disabled="!selectedPassengers.length">
            Lanjutkan
          </button>
        </aside>
      </div>
    </template>
  </section>
</template>
