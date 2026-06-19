<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { getSeatAvailableList } from '../services/bookingApi'

const props = defineProps({
  passengerCount: {
    type: Number,
    default: 1,
  },
  ticket: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'complete'])

const activePassengerIndex = ref(0)
const error = ref('')
const isLoading = ref(false)
const rawSeats = ref([])
const passengers = ref([])

const normalizeSeat = (seat) => ({
  seatID: seat.seatID ?? seat.SeatID ?? seat.seatId ?? '',
  seatRow: String(seat.seatRow ?? seat.SeatRow ?? ''),
  seatKolom: String(seat.seatKolom ?? seat.SeatKolom ?? ''),
  seatKode: String(seat.seatKode ?? seat.SeatKode ?? ''),
  seatStatus: seat.seatStatus ?? seat.SeatStatus ?? 'Kosong',
})

const resetPassengers = () => {
  passengers.value = Array.from({ length: Math.max(props.passengerCount, 1) }, (_, index) => ({
    id: String(index + 1),
    name: `Penumpang ${index + 1}`,
    seatCode: null,
    seatNumber: null,
  }))
  activePassengerIndex.value = 0
}

const visibleBaseSeats = computed(() => {
  const seats = rawSeats.value.map(normalizeSeat)
  let visibleSeats = seats.filter((seat) => seat.seatRow !== '0' && seat.seatRow !== '1')

  if (seats.length > 100) {
    visibleSeats = seats.filter(
      (seat) => !['5', '6', '7', '8', '9', '10'].includes(seat.seatRow),
    )
  }

  return visibleSeats
})

const seats = computed(() =>
  visibleBaseSeats.value.map((seat) => {
    const selectedPassengerIndex = passengers.value.findIndex(
      (passenger) => passenger.seatNumber === seat.seatKode,
    )

    return {
      ...seat,
      selectedPassengerIndex,
      displayStatus: selectedPassengerIndex >= 0 ? 'Selected' : seat.seatStatus,
    }
  }),
)

const activePassenger = computed(() => passengers.value[activePassengerIndex.value])
const isAllSeatSelected = computed(() => passengers.value.every((passenger) => passenger.seatNumber))
const totalPrice = computed(() => Number(props.ticket.price || 0) * passengers.value.length)

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const isBlockedSeat = (seat) =>
  seat.seatStatus === 'Booking' ||
  seat.seatStatus === 'NA' ||
  seat.seatStatus === 'NFS' ||
  !seat.seatKode ||
  seat.seatKode === 'null'

const getSeatClass = (seat) => ({
  booked: seat.displayStatus === 'Booking',
  empty: seat.seatKode === 'null',
  selected: seat.displayStatus === 'Selected',
  unavailable: seat.displayStatus === 'NA' || seat.displayStatus === 'NFS',
})

const loadSeats = async () => {
  isLoading.value = true
  error.value = ''
  rawSeats.value = []

  try {
    rawSeats.value = await getSeatAvailableList({
      draftNo: props.ticket.id,
      trayekID: props.ticket.trayekId,
    })
  } catch (loadError) {
    error.value = loadError.message || 'Data kursi belum bisa dimuat.'
  } finally {
    isLoading.value = false
  }
}

const selectPassenger = (index) => {
  activePassengerIndex.value = index
}

const removeSeat = (index) => {
  passengers.value[index].seatNumber = null
  passengers.value[index].seatCode = null
  activePassengerIndex.value = index
}

const selectSeat = (seat) => {
  if (isBlockedSeat(seat) || !activePassenger.value) return

  passengers.value.forEach((passenger, index) => {
    if (index !== activePassengerIndex.value && passenger.seatNumber === seat.seatKode) {
      passenger.seatNumber = null
      passenger.seatCode = null
    }
  })

  activePassenger.value.seatNumber = seat.seatKode
  activePassenger.value.seatCode = seat.seatID

  if (activePassengerIndex.value < passengers.value.length - 1) {
    activePassengerIndex.value += 1
  }
}

const completeSeatSelection = () => {
  emit('complete', {
    passengers: passengers.value.map((passenger) => ({ ...passenger })),
    ticket: props.ticket,
  })
}

watch(
  () => [props.ticket.id, props.ticket.trayekId, props.passengerCount],
  () => {
    resetPassengers()
    loadSeats()
  },
)

onMounted(() => {
  resetPassengers()
  loadSeats()
})
</script>

<template>
  <div class="seat-picker">
    <div class="seat-picker-head">
      <div>
        <p class="eyebrow">Pilih Kursi</p>
        <h3>{{ ticket.title }}</h3>
        <span>{{ ticket.from }} ke {{ ticket.to }} - {{ ticket.time }}</span>
      </div>
      <button class="ghost-action" type="button" @click="emit('close')">Tutup</button>
    </div>

    <div class="passenger-strip">
      <button
        v-for="(passenger, index) in passengers"
        :key="passenger.id"
        type="button"
        :class="{ active: activePassengerIndex === index }"
        @click="selectPassenger(index)"
        @dblclick="removeSeat(index)"
      >
        <strong>Penumpang #{{ index + 1 }}</strong>
        <span>No Kursi: {{ passenger.seatNumber || '-' }}</span>
      </button>
    </div>

    <div class="seat-legend-row">
      <span><i class="available"></i>Tersedia</span>
      <span><i class="selected"></i>Dipilih</span>
      <span><i class="booked"></i>Dipesan</span>
    </div>

    <div v-if="isLoading" class="seat-loading">Mengambil data kursi...</div>
    <div v-else-if="error" class="seat-loading error">{{ error }}</div>

    <div v-else class="bus-seat-shell">
      <div class="driver-label">Supir</div>
      <div class="bus-seat-grid">
        <button
          v-for="(seat, index) in seats"
          :key="`${seat.seatID}-${seat.seatKode}-${index}`"
          class="bus-seat"
          type="button"
          :class="getSeatClass(seat)"
          :disabled="isBlockedSeat(seat)"
          @click="selectSeat(seat)"
        >
          <span v-if="seat.seatKode !== 'null'">{{ seat.seatKode }}</span>
        </button>
      </div>
    </div>

    <div class="seat-picker-footer">
      <div>
        <span>Total</span>
        <strong>{{ formatPrice(totalPrice) }}</strong>
      </div>
      <button
        class="primary-action"
        type="button"
        :disabled="!isAllSeatSelected"
        @click="completeSeatSelection"
      >
        Selesai
      </button>
    </div>
  </div>
</template>
