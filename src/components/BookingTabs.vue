<script setup>
import { computed, onMounted, ref } from 'vue'
import { routeOptions } from '../data/siteData'
import {
  getApiBaseUrl,
  getFromList,
  getMaxPassenger,
  getToList,
  searchBus,
} from '../services/ticketApi'
import { getTicketDetail } from '../services/userApi'

const emit = defineEmits(['search-complete', 'search-error', 'search-start'])

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)

const formatDateInput = (date) => date.toISOString().slice(0, 10)

const activeBookingTab = ref('booking')
const fromOptions = ref([])
const toOptions = ref([])
const maxPassenger = ref(4)
const isLoadingTicketOptions = ref(false)
const isSearching = ref(false)
const isCheckingTicket = ref(false)
const ticketOptionsError = ref('')
const searchError = ref('')
const checkTicketError = ref('')
const checkedTicket = ref(null)

const booking = ref({
  from: '',
  to: '',
  depart: formatDateInput(tomorrow),
  passengers: '1',
  phone: '',
  bookingCode: '',
})

const bookingTabs = [
  { key: 'booking', label: 'Booking Tiket' },
  { key: 'check', label: 'Cek Tiket' },
]

const fallbackTerminalOptions = routeOptions.map((city) => ({
  id: city,
  name: city,
  description: 'Terminal utama',
}))

const normalizeTerminalOptions = (items) =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
  }))

const departureOptions = computed(() =>
  fromOptions.value.length ? fromOptions.value : fallbackTerminalOptions,
)

const destinationOptions = computed(() =>
  toOptions.value.length ? toOptions.value : fallbackTerminalOptions,
)

const passengerOptions = computed(() =>
  Array.from({ length: maxPassenger.value }, (_, index) => String(index + 1)),
)

const selectDefaultValues = () => {
  if (!passengerOptions.value.includes(booking.value.passengers)) {
    booking.value.passengers = passengerOptions.value[0] ?? '1'
  }
}

const loadTicketOptions = async () => {
  isLoadingTicketOptions.value = true
  ticketOptionsError.value = ''

  try {
    const [departures, destinations, passengerLimit] = await Promise.all([
      getFromList(),
      getToList(),
      getMaxPassenger(),
    ])

    fromOptions.value = normalizeTerminalOptions(departures)
    toOptions.value = normalizeTerminalOptions(destinations)
    maxPassenger.value = passengerLimit
  } catch (error) {
    ticketOptionsError.value =
      'Data rute dari API dev belum tersedia. Sementara memakai data fallback.'
  } finally {
    selectDefaultValues()
    isLoadingTicketOptions.value = false
  }
}

const formatSearchDate = (date) => date.replaceAll('-', '')

const findTerminal = (items, id) => items.find((item) => item.id === id)

const handleSearch = async () => {
  searchError.value = ''

  if (!booking.value.from || !booking.value.to) {
    searchError.value = 'Pilih keberangkatan dan tujuan terlebih dahulu.'
    return
  }

  isSearching.value = true

  const departure = findTerminal(departureOptions.value, booking.value.from)
  const destination = findTerminal(destinationOptions.value, booking.value.to)

  const criteria = {
    date: booking.value.depart,
    dateParam: formatSearchDate(booking.value.depart),
    from: booking.value.from,
    fromName: departure?.name ?? booking.value.from,
    fromDescription: departure?.description ?? '',
    passenger: booking.value.passengers,
    to: booking.value.to,
    toName: destination?.name ?? booking.value.to,
    toDescription: destination?.description ?? '',
  }

  emit('search-start', { criteria })

  try {
    const tickets = await searchBus({
      date: criteria.dateParam,
      from: criteria.from,
      passenger: criteria.passenger,
      to: criteria.to,
    })
    emit('search-complete', { criteria, tickets })
  } catch (error) {
    searchError.value = 'Pencarian tiket gagal. Silakan coba lagi.'
    emit('search-error', { criteria, message: searchError.value })
  } finally {
    isSearching.value = false
  }
}

const normalizePhoneNumber = (value) => String(value || '').replace(/[^\d]/g, '').replace(/^62/, '0')

const getTicketValue = (ticket, ...keys) => keys.map((key) => ticket?.[key]).find(Boolean) || ''

const formatTicketDate = (date) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

const formatTicketPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(String(value || 0).replace('.00', '')))

const checkedTicketPassengers = computed(() =>
  getTicketValue(checkedTicket.value, 'ticketPassenger', 'TicketPassenger') || [],
)

const handleCheckTicket = async () => {
  checkTicketError.value = ''
  checkedTicket.value = null

  if (!booking.value.phone || !booking.value.bookingCode) {
    checkTicketError.value = 'Masukkan nomor HP pemesan dan kode booking.'
    return
  }

  isCheckingTicket.value = true

  try {
    const detail = await getTicketDetail(booking.value.bookingCode.trim())
    const inputPhone = normalizePhoneNumber(booking.value.phone)
    const ticketPhone = normalizePhoneNumber(
      getTicketValue(detail, 'phoneNumberInformation', 'PhoneNumberInformation'),
    )

    if (ticketPhone && inputPhone !== ticketPhone) {
      checkTicketError.value = 'Nomor HP tidak sesuai dengan data pemesan tiket.'
      return
    }

    checkedTicket.value = detail
  } catch (error) {
    checkTicketError.value =
      error.message || 'Detail tiket belum bisa dimuat. Pastikan Anda sudah login.'
  } finally {
    isCheckingTicket.value = false
  }
}

onMounted(loadTicketOptions)
</script>

<template>
  <section class="booking-section" aria-label="Reservasi">
    <div class="booking-tabs">
      <button
        v-for="tab in bookingTabs"
        :key="tab.key"
        type="button"
        :class="{ active: activeBookingTab === tab.key }"
        @click="activeBookingTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <form v-if="activeBookingTab === 'booking'" class="booking-card" @submit.prevent="handleSearch">
      <div class="booking-status">
        <span v-if="isLoadingTicketOptions">Mengambil data rute dari API dev...</span>
        <span v-else-if="searchError">{{ searchError }}</span>
        <span v-else-if="ticketOptionsError">{{ ticketOptionsError }}</span>
        <span v-else>API dev aktif: {{ getApiBaseUrl() }}</span>
      </div>

      <label>
        <span>Dari</span>
        <select v-model="booking.from">
          <option disabled value="">Pilih Keberangkatan</option>
          <option v-for="terminal in departureOptions" :key="terminal.id" :value="terminal.id">
            {{ terminal.name }} - {{ terminal.description }}
          </option>
        </select>
      </label>
      <label>
        <span>Tujuan</span>
        <select v-model="booking.to">
          <option disabled value="">Pilih Tujuan</option>
          <option v-for="terminal in destinationOptions" :key="terminal.id" :value="terminal.id">
            {{ terminal.name }} - {{ terminal.description }}
          </option>
        </select>
      </label>
      <label>
        <span>Keberangkatan</span>
        <input v-model="booking.depart" type="date" />
      </label>
      <label>
        <span>Penumpang</span>
        <select v-model="booking.passengers">
          <option v-for="passenger in passengerOptions" :key="passenger" :value="passenger">
            {{ passenger }}
          </option>
        </select>
      </label>
      <button class="primary-action" type="submit" :disabled="isSearching">
        {{ isSearching ? 'Mencari...' : 'Cari' }}
      </button>
    </form>

    <form v-else-if="activeBookingTab === 'check'" class="booking-card compact check-card" @submit.prevent="handleCheckTicket">
      <label>
        <span>No. HP</span>
        <input v-model="booking.phone" placeholder="0812..." type="tel" />
      </label>
      <label>
        <span>Kode Booking</span>
        <input v-model="booking.bookingCode" placeholder="HP123ABC" type="text" />
      </label>
      <button class="primary-action" type="submit" :disabled="isCheckingTicket">
        {{ isCheckingTicket ? 'Mengecek...' : 'Cek Tiket' }}
      </button>

      <p v-if="checkTicketError" class="check-ticket-message error">{{ checkTicketError }}</p>

      <section v-if="checkedTicket" class="ticket-check-result">
        <div class="ticket-check-head">
          <div>
            <span>Kode Booking</span>
            <strong>{{ getTicketValue(checkedTicket, 'bookingNumber', 'BookingNumber') }}</strong>
          </div>
          <em>{{ getTicketValue(checkedTicket, 'paymentStatus', 'PaymentStatus') || '-' }}</em>
        </div>

        <div class="ticket-check-route">
          <div>
            <span>Keberangkatan</span>
            <strong>{{ getTicketValue(checkedTicket, 'from', 'From') || '-' }}</strong>
          </div>
          <div>
            <span>Tujuan</span>
            <strong>{{ getTicketValue(checkedTicket, 'to', 'To') || '-' }}</strong>
          </div>
          <div>
            <span>Jadwal</span>
            <strong>
              {{ formatTicketDate(getTicketValue(checkedTicket, 'date', 'Date')) }},
              {{ getTicketValue(checkedTicket, 'time', 'Time') || '-' }}
            </strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{{ formatTicketPrice(getTicketValue(checkedTicket, 'totalAmount', 'TotalAmount')) }}</strong>
          </div>
        </div>

        <div v-if="checkedTicketPassengers.length" class="ticket-check-passengers">
          <article
            v-for="passenger in checkedTicketPassengers"
            :key="getTicketValue(passenger, 'passengerID', 'passengerId', 'PassengerID') || getTicketValue(passenger, 'seatCode', 'SeatCode')"
          >
            <span>{{ getTicketValue(passenger, 'seatCode', 'SeatCode') || '-' }}</span>
            <strong>{{ getTicketValue(passenger, 'passengerName', 'PassengerName') || '-' }}</strong>
          </article>
        </div>
      </section>
    </form>

  </section>
</template>
