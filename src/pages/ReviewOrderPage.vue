<script setup>
import { computed, ref } from 'vue'
import CheckoutStepper from '../components/CheckoutStepper.vue'
import { getApiBaseUrl } from '../services/ticketApi'

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

const emit = defineEmits(['back-to-detail', 'continue-payment', 'login'])

const formatDate = (date) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
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

const customerName = computed(() => getProfileValue('fullName', 'FullName') || '-')
const customerPhone = computed(() => getProfileValue('phoneNumber', 'PhoneNumber') || '-')
const customerEmail = computed(() => getProfileValue('email', 'Email') || '-')
const ticketSubtotal = computed(() => Number(props.ticket?.price || 0) * props.passengers.length)
const discount = computed(() => 0)
const totalPayment = computed(() => Math.max(ticketSubtotal.value - discount.value, 0))
const showVoucherModal = ref(false)
const showTermsModal = ref(false)
const voucherCode = ref('')
const isLoadingTerms = ref(false)
const termsAccepted = ref(false)
const termsHtml = ref('')

const termsUrl = computed(() => getApiBaseUrl().replace(/api\/?$/i, 'content/tnc.html'))

const fallbackTerms = `
  <div class="terms-fallback">
    <h2>Syarat dan Ketentuan</h2>
    <h3>PO. Hiba Putra</h3>
    <ol>
      <li>Tiket yang sudah dibeli hanya berlaku untuk <strong>1 kali perjalanan</strong> dan tiket wajib dibawa pada saat keberangkatan.</li>
      <li>Tiket berlaku hanya untuk penumpang yang melakukan perjalanan sesuai dengan tanggal dan waktu keberangkatan bus yang tertera pada tiket.</li>
      <li>Pengubahan apapun terhadap tiket, misalnya correction tip, coretan, edit electronic, atau edit manual, mengakibatkan tiket menjadi tidak sah.</li>
      <li>Penumpang wajib ada pada lokasi titik keberangkatan <strong>45 menit sebelum jadwal keberangkatan.</strong></li>
      <li>Penumpang wajib berkoordinasi dengan agen pada lokasi keberangkatan terkait informasi kedatangan kendaraan, alokasi bus yang akan dinaiki, dan <strong>wajib menukarkan nomor booking tiket kepada agen.</strong></li>
      <li>Penumpang bertanggung jawab penuh atas barang-barang pribadinya dan PO. Hiba Putra tidak bertanggung jawab atas kerusakan atau kehilangan barang penumpang.</li>
      <li>Penumpang diperbolehkan membawa bagasi dengan ukuran <strong>maksimal 40cm x 40cm x 30cm</strong> dan berat <strong>maksimum 25 kg</strong>. Bagasi melebihi ketentuan akan dikenakan biaya sebagaimana ketentuan PO. Hiba Putra.</li>
      <li>Penumpang dilarang membawa barang ilegal, zat mudah terbakar, barang dengan bau menyengat, dan binatang.</li>
      <li>PO. Hiba Putra dapat mengubah waktu berangkat, tipe bus, dan rute bus sewaktu-waktu karena alasan operasional.</li>
      <li>PO. Hiba Putra berhak memindahkan penumpang ke kursi atau bus lain jika diperlukan.</li>
      <li>Penumpang dilarang merokok pada kendaraan ber-AC.</li>
      <li>Anak-anak di bawah usia 6 tahun dapat melakukan perjalanan didampingi orang dewasa.</li>
      <li>Anak-anak dengan tinggi di atas 90 cm sudah dikenakan biaya 1 tiket penuh.</li>
    </ol>
    <p>Jika Anda ingin memberi masukan, saran, atau pesan, Anda dapat menghubungi customer care kami di telepon <strong>0878-0859-9888</strong>.</p>
  </div>
`

const openVoucherModal = () => {
  showVoucherModal.value = true
}

const closeVoucherModal = () => {
  showVoucherModal.value = false
}

const openTermsModal = async () => {
  showTermsModal.value = true
  termsAccepted.value = false

  if (termsHtml.value) return

  isLoadingTerms.value = true
  try {
    const response = await fetch(termsUrl.value)
    termsHtml.value = response.ok ? await response.text() : fallbackTerms
  } catch {
    termsHtml.value = fallbackTerms
  } finally {
    isLoadingTerms.value = false
  }
}

const closeTermsModal = () => {
  showTermsModal.value = false
}

const continueToPayment = () => {
  if (!termsAccepted.value) return
  showTermsModal.value = false
  emit('continue-payment')
}
</script>

<template>
  <section class="review-order-page">
    <div v-if="!auth" class="ticket-empty">
      <h3>Login diperlukan</h3>
      <p>Silakan login terlebih dahulu untuk melihat review booking.</p>
      <button class="primary-action" type="button" @click="emit('login')">Login</button>
    </div>

    <div v-else-if="!ticket || !passengers.length" class="ticket-empty">
      <h3>Data review belum tersedia</h3>
      <p>Silakan lengkapi data penumpang terlebih dahulu.</p>
      <button class="primary-action" type="button" @click="emit('back-to-detail')">
        Kembali Isi Data
      </button>
    </div>

    <template v-else>
      <CheckoutStepper :active-step="3" />

      <div class="review-layout">
        <div class="review-main">
          <section class="review-trip-card">
            <div class="review-trip-head">
              <span>Bus</span>
              <div>
                <strong>{{ ticket.class || ticket.title }}</strong>
                <small>{{ ticket.id }}</small>
              </div>
            </div>

            <div class="review-route">
              <div>
                <span>Keberangkatan</span>
                <strong>{{ ticket.from }}</strong>
                <small>{{ formatDate(criteria?.date) }}, {{ ticket.time }} WIB</small>
              </div>
              <div class="review-route-line">
                <span>{{ ticket.fullDescription || '11 Jam 0 menit' }}</span>
              </div>
              <div>
                <span>Tujuan</span>
                <strong>{{ ticket.to }}</strong>
                <small>{{ formatDate(criteria?.date) }}</small>
              </div>
            </div>

            <div class="review-passenger-list">
              <h3>Detail Penumpang</h3>
              <article v-for="passenger in passengers" :key="passenger.id">
                <div class="review-person-icon">P</div>
                <div>
                  <strong>{{ passenger.title }} {{ passenger.name }}</strong>
                  <span>{{ ticket.class }}</span>
                </div>
                <em>{{ passenger.seatNumber }}</em>
              </article>
            </div>
          </section>

          <section class="review-customer-card">
            <h3>Data Pemesan</h3>
            <dl>
              <div>
                <dt>Nama Pemesan</dt>
                <dd>{{ customerName }}</dd>
              </div>
              <div>
                <dt>No HP</dt>
                <dd>{{ customerPhone }}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{{ customerEmail }}</dd>
              </div>
            </dl>
          </section>
        </div>

        <aside class="review-side">
          <button class="review-voucher" type="button" @click="openVoucherModal">
            <span>Voucher</span>
            <strong>Pakai Voucher</strong>
            <small>Masukkan kode promo untuk diskon</small>
          </button>

          <section class="review-price-card">
            <h3>Rincian Harga</h3>
            <dl>
              <div>
                <dt>Harga Tiket ({{ passengers.length }})</dt>
                <dd>{{ formatPrice(ticketSubtotal) }}</dd>
              </div>
              <div>
                <dt>Diskon</dt>
                <dd>- {{ formatPrice(discount) }}</dd>
              </div>
              <div>
                <dt>Total Pembayaran</dt>
                <dd>{{ formatPrice(totalPayment) }}</dd>
              </div>
            </dl>
          </section>

          <button class="primary-action" type="button" @click="openTermsModal">
            Bayar Sekarang
          </button>
          <button class="ghost-action" type="button" @click="emit('back-to-detail')">
            Kembali
          </button>
        </aside>
      </div>

      <div v-if="showVoucherModal" class="modal-backdrop" role="dialog" aria-modal="true">
        <section class="voucher-modal">
          <div class="voucher-modal-head">
            <div>
              <strong>Pakai Voucher</strong>
              <span>Masukkan kode promo untuk diskon</span>
            </div>
            <button type="button" @click="closeVoucherModal">x</button>
          </div>

          <div class="voucher-input-row">
            <label>
              <span>Kode Voucher / Promo</span>
              <input
                v-model="voucherCode"
                placeholder="MASUKKAN KODE DI SINI"
                type="text"
              />
            </label>
            <button class="primary-action" type="button">Gunakan</button>
          </div>

          <div class="voucher-divider"><span>ATAU PILIH VOUCHER</span></div>

          <div class="voucher-empty">
            <div>-</div>
            <strong>Belum ada voucher</strong>
            <p>Masukkan kode voucher secara manual di atas.</p>
          </div>

          <p class="voucher-note">
            Voucher hanya berlaku untuk satu transaksi dan tidak dapat digabung dengan promo lainnya.
          </p>
        </section>
      </div>

      <div v-if="showTermsModal" class="modal-backdrop" role="dialog" aria-modal="true">
        <section class="terms-modal">
          <div class="terms-modal-head">
            <div>
              <strong>Syarat dan Ketentuan</strong>
              <span>Mohon baca dan setujui sebelum melanjutkan pembayaran.</span>
            </div>
            <button type="button" @click="closeTermsModal">x</button>
          </div>

          <div class="terms-content">
            <p v-if="isLoadingTerms">Memuat syarat dan ketentuan...</p>
            <div v-else class="terms-html" v-html="termsHtml"></div>
          </div>

          <label class="terms-approval">
            <input v-model="termsAccepted" type="checkbox" />
            <span>Saya telah membaca dan menyetujui Syarat & Ketentuan Perjalanan Hiba Putra.</span>
          </label>

          <div class="terms-actions">
            <button class="ghost-action" type="button" @click="closeTermsModal">Cek Ulang</button>
            <button
              class="primary-action"
              type="button"
              :disabled="!termsAccepted"
              @click="continueToPayment"
            >
              Setuju & Lanjutkan
            </button>
          </div>
        </section>
      </div>
    </template>
  </section>
</template>
