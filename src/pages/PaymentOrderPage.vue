<script setup>
import QRCode from 'qrcode'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import CheckoutStepper from '../components/CheckoutStepper.vue'
import { getApiBaseUrl } from '../services/ticketApi'

const props = defineProps({
  auth: {
    type: Object,
    default: null,
  },
  order: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['done', 'login'])

const copyStatus = ref('')
const openInstructionIndexes = ref([0])
const remainingSeconds = ref(0)
const qrisImageUrl = ref('')
let timerInterval = null

const logoByCode = {
  QRIS: 'qris.png',
  BCA_VA: 'bca.png',
  BNI_VA: 'bni.png',
  BRI_VA: 'bri.png',
  MANDIRI_VA: 'mandiri.png',
  PERMATA_VA: 'permata_bank.png',
  CIMB_VA: 'cimbniaga.png',
  DANA: 'dana.png',
  OVO: 'ovo.png',
  LINKAJA: 'linkaja.png',
  SHOPEEPAY: 'shopeepay.png',
  GOPAY: 'gopay.png',
  ALFAMART: 'alfamart.png',
  INDOMARET: 'indomaret.png',
}

const walletMethods = ['OVO', 'LINKAJA', 'DANA', 'SHOPEEPAY']

const ticket = computed(() => props.order?.ticket || null)
const paymentMethod = computed(() => props.order?.method || null)
const paymentCode = computed(() => String(ticket.value?.paymentMethod || paymentMethod.value?.code || '').toUpperCase())
const paymentName = computed(
  () => ticket.value?.paymentDisplayName || paymentMethod.value?.name || ticket.value?.paymentMethod || '-',
)
const isQris = computed(() => paymentCode.value === 'QRIS')
const isWallet = computed(() => walletMethods.includes(paymentCode.value))
const passengerList = computed(() => ticket.value?.ticketPassenger || [])
const paymentNumber = computed(() =>
  isWallet.value ? ticket.value?.phoneNumberInformation : ticket.value?.virtualAccountNo,
)
const paymentAmount = computed(() => ticket.value?.totalAmount || ticket.value?.amount || 0)
const instructionsHtml = computed(() =>
  String(ticket.value?.paymentHtml || '')
    .replaceAll('<content>', '')
    .replaceAll('</content>', ''),
)
const instructionGroups = computed(() => {
  if (!instructionsHtml.value) return []

  const parser = new DOMParser()
  const doc = parser.parseFromString(instructionsHtml.value, 'text/html')
  const body = doc.body
  const groups = []
  let activeGroup = null

  Array.from(body.children).forEach((element) => {
    const tagName = element.tagName.toLowerCase()
    const text = element.textContent?.trim() || ''
    const isHeading = /^h[1-6]$/.test(tagName) || (tagName === 'p' && text && !activeGroup)

    if (isHeading) {
      activeGroup = {
        title: text,
        content: '',
      }
      groups.push(activeGroup)
      return
    }

    if (!activeGroup) {
      activeGroup = {
        title: paymentName.value || 'Instruksi Pembayaran',
        content: '',
      }
      groups.push(activeGroup)
    }

    activeGroup.content += element.outerHTML
  })

  return groups.length
    ? groups.map((group) => ({
        ...group,
        content: group.content || '<p>Instruksi pembayaran belum tersedia.</p>',
      }))
    : [
        {
          title: paymentName.value || 'Instruksi Pembayaran',
          content: instructionsHtml.value,
        },
      ]
})
const routeTitle = computed(() => `${ticket.value?.from || '-'} ke ${ticket.value?.to || '-'}`)
const paymentExpiredDate = computed(() => ticket.value?.ExpiredDate || ticket.value?.expiredDate || '')
const timerLabel = computed(() => {
  if (!paymentExpiredDate.value) return '-'
  if (remainingSeconds.value <= 0) return 'Expired'

  const hours = Math.floor(remainingSeconds.value / 3600)
  const minutes = Math.floor((remainingSeconds.value % 3600) / 60)
  const seconds = remainingSeconds.value % 60

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
})
const isTimerExpired = computed(() => paymentExpiredDate.value && remainingSeconds.value <= 0)

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(String(value || 0).replace('.00', '')))

const formatDateTime = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

const getPaymentLogoUrl = () => {
  const logoValue =
    paymentMethod.value?.logoUrl ||
    paymentMethod.value?.logoFileName ||
    paymentMethod.value?.logo ||
    logoByCode[paymentCode.value] ||
    'payment.png'

  if (/^https?:\/\//i.test(logoValue)) return logoValue

  const baseUrl = getApiBaseUrl().replace(/api\/?$/i, '')
  const separator = baseUrl.endsWith('/') ? '' : '/'
  return `${baseUrl}${separator}payment-logo/${encodeURIComponent(logoValue)}`
}

const copyText = async (value, successMessage) => {
  if (!value) return

  try {
    await navigator.clipboard.writeText(value)
    copyStatus.value = successMessage
  } catch {
    copyStatus.value = 'Data pembayaran belum bisa disalin otomatis.'
  }
}

const copyPaymentNumber = () => copyText(paymentNumber.value, 'Nomor pembayaran disalin.')
const copyQrisContent = () => copyText(ticket.value?.qrContent, 'Kode QRIS disalin.')

const isInstructionOpen = (index) => openInstructionIndexes.value.includes(index)

const toggleInstruction = (index) => {
  openInstructionIndexes.value = isInstructionOpen(index)
    ? openInstructionIndexes.value.filter((item) => item !== index)
    : [...openInstructionIndexes.value, index]
}

const updateRemainingTime = () => {
  if (!paymentExpiredDate.value) {
    remainingSeconds.value = 0
    return
  }

  const expiredAt = new Date(paymentExpiredDate.value).getTime()
  const nextRemaining = Math.max(Math.floor((expiredAt - Date.now()) / 1000), 0)
  remainingSeconds.value = Number.isFinite(nextRemaining) ? nextRemaining : 0
}

const startPaymentTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }

  updateRemainingTime()
  timerInterval = setInterval(updateRemainingTime, 1000)
}

const generateQrisImage = async (qrContent) => {
  qrisImageUrl.value = ''
  if (!qrContent) return

  try {
    qrisImageUrl.value = await QRCode.toDataURL(qrContent, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 280,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
  } catch {
    qrisImageUrl.value = ''
  }
}

watch(
  () => paymentExpiredDate.value,
  () => startPaymentTimer(),
  { immediate: true },
)

watch(
  () => ticket.value?.qrContent,
  (qrContent) => generateQrisImage(qrContent),
  { immediate: true },
)

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<template>
  <section class="payment-order-page">
    <div v-if="!auth" class="ticket-empty">
      <h3>Login diperlukan</h3>
      <p>Silakan login terlebih dahulu untuk melihat instruksi pembayaran.</p>
      <button class="primary-action" type="button" @click="emit('login')">Login</button>
    </div>

    <div v-else-if="!ticket" class="ticket-empty">
      <h3>Data pembayaran belum tersedia</h3>
      <p>Silakan lakukan pembayaran dari halaman metode pembayaran.</p>
      <button class="primary-action" type="button" @click="emit('done')">Ke Beranda</button>
    </div>

    <template v-else>
      <CheckoutStepper :active-step="4" />

      <div class="payment-order-layout">
        <div class="payment-order-main">
          <section class="payment-order-card payment-order-header">
            <div class="payment-brand">
              <span>
                <img :src="getPaymentLogoUrl()" alt="" />
              </span>
              <div>
                <p class="eyebrow">Metode Pembayaran</p>
                <h2>{{ paymentName }}</h2>
              </div>
            </div>
            <div>
              <span class="payment-status">{{ ticket.paymentStatus || 'Pending' }}</span>
              <small>Batas pembayaran: {{ formatDateTime(paymentExpiredDate) }}</small>
              <div class="payment-timer" :class="{ expired: isTimerExpired }">
                <span>Sisa waktu pembayaran</span>
                <strong>{{ timerLabel }}</strong>
              </div>
            </div>
          </section>

          <section class="payment-order-card payment-target">
            <div>
              <p class="eyebrow">{{ isQris ? 'QRIS' : 'Nomor Pembayaran' }}</p>
              <h3>{{ isQris ? 'Scan QR untuk melakukan pembayaran' : 'Transfer ke nomor berikut' }}</h3>
            </div>

            <div v-if="isQris" class="qris-box">
              <template v-if="qrisImageUrl">
                <img :src="qrisImageUrl" alt="QRIS pembayaran" />
                <span>Scan QRIS untuk melakukan pembayaran</span>
              </template>
              <template v-else-if="ticket.qrContent">
                <span>Kode QRIS</span>
                <strong>{{ ticket.qrContent }}</strong>
                <button class="ghost-action" type="button" @click="copyQrisContent">
                  Salin Kode QRIS
                </button>
                <small v-if="copyStatus">{{ copyStatus }}</small>
              </template>
              <p v-else>QRIS belum tersedia. Silakan cek instruksi pembayaran.</p>
            </div>

            <div v-else class="payment-number-box">
              <span>{{ paymentName }}</span>
              <strong>{{ paymentNumber || '-' }}</strong>
              <button class="ghost-action" type="button" @click="copyPaymentNumber">
                Salin Nomor
              </button>
              <small v-if="copyStatus">{{ copyStatus }}</small>
            </div>

            <a
              v-if="ticket.urlPayment"
              class="primary-action payment-link"
              :href="ticket.urlPayment"
              rel="noreferrer"
              target="_blank"
            >
              Bayar Sekarang
            </a>
          </section>

          <section v-if="instructionGroups.length" class="payment-order-card payment-instructions">
            <h3>Cara Pembayaran</h3>
            <div class="payment-instruction-list">
              <article
                v-for="(instruction, index) in instructionGroups"
                :key="`${instruction.title}-${index}`"
                class="payment-instruction-item"
              >
                <button type="button" @click="toggleInstruction(index)">
                  <span>{{ instruction.title }}</span>
                  <strong>{{ isInstructionOpen(index) ? '-' : '+' }}</strong>
                </button>
                <div v-if="isInstructionOpen(index)" class="payment-instruction-content">
                  <div v-html="instruction.content"></div>
                </div>
              </article>
            </div>
          </section>
        </div>

        <aside class="payment-order-card payment-order-summary">
          <h3>Ringkasan Pesanan</h3>

          <dl>
            <div>
              <dt>No. Booking</dt>
              <dd>{{ ticket.bookingNumber || '-' }}</dd>
            </div>
            <div>
              <dt>Rute</dt>
              <dd>{{ routeTitle }}</dd>
            </div>
            <div>
              <dt>Berangkat</dt>
              <dd>{{ formatDate(ticket.date) }}, {{ ticket.time || '-' }}</dd>
            </div>
            <div>
              <dt>Jumlah Penumpang</dt>
              <dd>{{ ticket.totalPassenger || passengerList.length || 0 }} orang</dd>
            </div>
          </dl>

          <div class="payment-passenger-list">
            <article v-for="passenger in passengerList" :key="passenger.passengerID || passenger.seatCode">
              <span>{{ passenger.seatCode || '-' }}</span>
              <strong>{{ passenger.passengerName || '-' }}</strong>
            </article>
          </div>

          <div class="payment-total-box">
            <span>Total Pembayaran</span>
            <strong>{{ formatPrice(paymentAmount) }}</strong>
          </div>

          <button class="primary-action" type="button" @click="emit('done')">Selesai</button>
        </aside>
      </div>
    </template>
  </section>
</template>
