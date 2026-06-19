<script setup>
import { computed, ref, watch } from 'vue'
import CheckoutStepper from '../components/CheckoutStepper.vue'

const props = defineProps({
  auth: {
    type: Object,
    default: null,
  },
  criteria: {
    type: Object,
    default: null,
  },
  passengers: {
    type: Array,
    default: () => [],
  },
  profile: {
    type: Object,
    default: null,
  },
  ticket: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['back-to-seat', 'continue-review', 'login'])

const passengerForms = ref([])
const titles = ['Tuan', 'Nyonya', 'Nona']

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

const getProfileValue = (...keys) => {
  const data = props.profile || props.auth || {}
  return keys.map((key) => data[key]).find(Boolean) || ''
}

const customerName = computed(() => getProfileValue('fullName', 'FullName') || '')
const customerPhone = computed(() => getProfileValue('phoneNumber', 'PhoneNumber') || '-')
const customerEmail = computed(() => getProfileValue('email', 'Email') || '-')
const totalPrice = computed(() => Number(props.ticket?.price || 0) * props.passengers.length)

const syncPassengerForms = () => {
  passengerForms.value = props.passengers.map((passenger, index) => ({
    id: passenger.id || String(index + 1),
    name: index === 0 ? customerName.value : '',
    seatCode: passenger.seatCode,
    seatNumber: passenger.seatNumber,
    title: '',
  }))
}

const continueToReview = () => {
  emit(
    'continue-review',
    passengerForms.value.map((passenger) => ({ ...passenger })),
  )
}

watch(
  () => [props.passengers, customerName.value],
  syncPassengerForms,
  { immediate: true },
)
</script>

<template>
  <section class="passenger-detail-page">
    <div v-if="!auth" class="ticket-empty">
      <h3>Login diperlukan</h3>
      <p>Silakan login terlebih dahulu untuk mengisi detail penumpang.</p>
      <button class="primary-action" type="button" @click="emit('login')">Login</button>
    </div>

    <div v-else-if="!ticket || !passengers.length" class="ticket-empty">
      <h3>Data kursi belum tersedia</h3>
      <p>Silakan pilih kursi terlebih dahulu dari halaman booking order.</p>
      <button class="primary-action" type="button" @click="emit('back-to-seat')">
        Kembali Pilih Kursi
      </button>
    </div>

    <template v-else>
      <CheckoutStepper :active-step="2" />

      <div class="passenger-detail-layout">
        <div class="passenger-detail-main">
          <section class="booking-data-card">
            <div class="section-head compact">
              <p class="eyebrow">Data Pemesan</p>
              <h3>Kontak dari Profile</h3>
            </div>

            <div class="readonly-form">
              <label>
                <span>Nama Lengkap</span>
                <input :value="customerName || '-'" readonly type="text" />
              </label>
              <label>
                <span>No. Handphone</span>
                <input :value="customerPhone" readonly type="text" />
              </label>
              <label>
                <span>Email</span>
                <input :value="customerEmail" readonly type="email" />
              </label>
            </div>
          </section>

          <section class="booking-data-card">
            <div class="section-head compact">
              <p class="eyebrow">Detail Penumpang</p>
              <h3>Lengkapi Title dan Nama Lengkap Sesuai ID</h3>
            </div>

            <div class="passenger-detail-list">
              <article v-for="(passenger, index) in passengerForms" :key="passenger.id">
                <div class="passenger-card-head">
                  <span>{{ index + 1 }}</span>
                  <div>
                    <strong>Penumpang {{ index + 1 }}</strong>
                    <small>Lengkapi data perjalanan</small>
                  </div>
                  <em>Pergi {{ passenger.seatNumber }}</em>
                </div>

                <div class="passenger-form-row">
                  <label>
                    <span>Title</span>
                    <select v-model="passenger.title">
                      <option disabled value="">Pilih</option>
                      <option v-for="title in titles" :key="title" :value="title">
                        {{ title }}
                      </option>
                    </select>
                  </label>
                  <label>
                    <span>Nama Lengkap Sesuai ID</span>
                    <input
                      v-model="passenger.name"
                      placeholder="Masukkan nama lengkap"
                      type="text"
                    />
                  </label>
                </div>
              </article>
            </div>
          </section>
        </div>

        <aside class="booking-order-side">
          <h3>Detail Perjalanan</h3>
          <p>{{ ticket.from }} ke {{ ticket.to }}</p>
          <strong>{{ ticket.time }}</strong>
          <p>{{ formatDate(criteria?.date) }}</p>
          <h3>Detail Pembayaran</h3>
          <p>{{ passengers.length }} kursi x {{ formatPrice(ticket.price) }}</p>
          <strong>{{ formatPrice(totalPrice) }}</strong>
          <button class="primary-action" type="button" @click="continueToReview">
            Lanjutkan
          </button>
        </aside>
      </div>
    </template>
  </section>
</template>
