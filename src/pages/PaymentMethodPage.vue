<script setup>
import { computed, onMounted, ref } from 'vue'
import CheckoutStepper from '../components/CheckoutStepper.vue'
import { getPaymentList } from '../services/bookingApi'
import { getApiBaseUrl } from '../services/ticketApi'

const props = defineProps({
  auth: {
    type: Object,
    default: null,
  },
  passengers: {
    type: Array,
    default: () => [],
  },
  submitError: {
    type: String,
    default: '',
  },
  submitting: {
    type: Boolean,
    default: false,
  },
  ticket: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['back-to-review', 'login', 'pay'])

const isLoadingPayments = ref(false)
const paymentError = ref('')
const paymentMethods = ref([])
const selectedPaymentCode = ref('')

const fallbackPayments = [
  {
    id: 'credit-card',
    name: 'Kartu Kredit',
    code: 'CC',
    logoFileName: 'cc.png',
    adminFeePercentage: 0,
    fixedAdminFee: 0,
  },
  {
    id: 'other-payment',
    name: 'Metode Pembayaran Lainnya',
    code: 'OTHER',
    logoFileName: 'other.png',
    adminFeePercentage: 0,
    fixedAdminFee: 0,
  },
]

const normalizePayment = (payment) => ({
  id: payment.id ?? payment.Id ?? payment.code ?? payment.Code,
  name: payment.name ?? payment.Name ?? 'Metode Pembayaran',
  code: payment.code ?? payment.Code ?? payment.id ?? payment.Id,
  logo: payment.logo ?? payment.Logo ?? '',
  logoFileName:
    payment.logoFileName ??
    payment.logoFilename ??
    payment.fileName ??
    payment.filename ??
    payment.LogoFileName ??
    '',
  logoUrl: payment.logoUrl ?? payment.urlLogo ?? payment.imageUrl ?? payment.LogoUrl ?? '',
  adminFeePercentage: Number(payment.adminFeePercentage ?? payment.AdminFeePercentage ?? 0),
  fixedAdminFee: Number(payment.fixedAdminFee ?? payment.FixedAdminFee ?? 0),
})

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

const visiblePaymentMethods = computed(() =>
  paymentMethods.value.length ? paymentMethods.value : fallbackPayments,
)

const selectedPayment = computed(
  () =>
    visiblePaymentMethods.value.find((payment) => payment.code === selectedPaymentCode.value) ||
    visiblePaymentMethods.value[0],
)

const ticketSubtotal = computed(() => Number(props.ticket?.price || 0) * props.passengers.length)

const serviceFee = computed(() => {
  const feePercentage = Number(selectedPayment.value?.adminFeePercentage || 0)
  const fixedFee = Number(selectedPayment.value?.fixedAdminFee || 0)

  if (!feePercentage) return Math.ceil(fixedFee)

  const feeRate = feePercentage / 100
  if (feeRate >= 1) return 0

  return Math.ceil(ticketSubtotal.value / (1 - feeRate) - ticketSubtotal.value)
})

const totalPayment = computed(() => ticketSubtotal.value + serviceFee.value)
const selectedSeatText = computed(() =>
  props.passengers.map((passenger) => passenger.seatNumber).filter(Boolean).join(', '),
)

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const getPaymentLogoFileName = (payment) => {
  const code = String(payment.code || '').toUpperCase()
  return logoByCode[code] || `${code.toLowerCase().split('_')[0] || 'payment'}.png`
}

const getPaymentLogoUrl = (payment) => {
  const logoValue =
    payment.logoUrl || payment.logoFileName || payment.logo || getPaymentLogoFileName(payment)

  if (/^https?:\/\//i.test(logoValue)) {
    return logoValue
  }

  const baseUrl = getApiBaseUrl().replace(/api\/?$/i, '')
  const separator = baseUrl.endsWith('/') ? '' : '/'
  return `${baseUrl}${separator}payment-logo/${encodeURIComponent(logoValue)}`
}

const loadPaymentMethods = async () => {
  isLoadingPayments.value = true
  paymentError.value = ''

  try {
    paymentMethods.value = (await getPaymentList()).map(normalizePayment)
    selectedPaymentCode.value = visiblePaymentMethods.value[0]?.code || ''
  } catch (error) {
    paymentError.value = error.message || 'Metode pembayaran belum bisa dimuat.'
    selectedPaymentCode.value = fallbackPayments[0].code
  } finally {
    isLoadingPayments.value = false
  }
}

const handlePay = () => {
  if (!selectedPayment.value || props.submitting) return
  emit('pay', {
    payment: selectedPayment.value,
    serviceFee: serviceFee.value,
    totalPayment: totalPayment.value,
  })
}

onMounted(() => {
  loadPaymentMethods()
})
</script>

<template>
  <section class="payment-method-page">
    <div v-if="!auth" class="ticket-empty">
      <h3>Login diperlukan</h3>
      <p>Silakan login terlebih dahulu untuk memilih metode pembayaran.</p>
      <button class="primary-action" type="button" @click="emit('login')">Login</button>
    </div>

    <div v-else-if="!ticket || !passengers.length" class="ticket-empty">
      <h3>Data pembayaran belum tersedia</h3>
      <p>Silakan cek kembali review booking Anda.</p>
      <button class="primary-action" type="button" @click="emit('back-to-review')">
        Kembali ke Review
      </button>
    </div>

    <template v-else>
      <CheckoutStepper :active-step="4" />

      <div class="payment-card">
        <h2>Metode Pembayaran</h2>

        <div class="payment-layout">
          <div class="payment-list">
            <p v-if="isLoadingPayments" class="payment-note">Mengambil metode pembayaran...</p>
            <p v-else-if="paymentError" class="payment-note error">{{ paymentError }}</p>

            <label
              v-for="payment in visiblePaymentMethods"
              :key="payment.code"
              class="payment-option"
              :class="{ active: selectedPaymentCode === payment.code }"
            >
              <span class="payment-icon">
                <img :src="getPaymentLogoUrl(payment)" alt="" />
              </span>
              <strong>{{ payment.name }}</strong>
              <input v-model="selectedPaymentCode" :value="payment.code" type="radio" />
            </label>
          </div>

          <aside class="payment-summary">
            <h3>Detail Pembayaran</h3>
            <dl>
              <div>
                <dt>Jumlah Tiket Pergi</dt>
                <dd>{{ passengers.length }} ({{ selectedSeatText }})</dd>
              </div>
              <div>
                <dt>Total Harga Tiket Pergi</dt>
                <dd>{{ formatPrice(ticketSubtotal) }}</dd>
              </div>
              <div v-if="serviceFee">
                <dt>Biaya Admin</dt>
                <dd>{{ formatPrice(serviceFee) }}</dd>
              </div>
              <div>
                <dt>Total Pembayaran</dt>
                <dd>{{ formatPrice(totalPayment) }}</dd>
              </div>
            </dl>

            <p v-if="submitError" class="payment-note error">{{ submitError }}</p>
            <button
              class="primary-action"
              type="button"
              :disabled="submitting || !selectedPayment"
              @click="handlePay"
            >
              {{ submitting ? 'Memproses...' : 'Bayar' }}
            </button>
          </aside>
        </div>
      </div>
    </template>
  </section>
</template>
