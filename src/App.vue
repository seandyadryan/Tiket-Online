<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import FooterSection from './components/FooterSection.vue'
import HeroSection from './components/HeroSection.vue'
import MainHeader from './components/MainHeader.vue'
import {
  agentPages,
  fleetPages,
  heroImages,
  navGroups,
  pages,
  servicePages,
} from './data/siteData'
import AgentPage from './pages/AgentPage.vue'
import ContactPage from './pages/ContactPage.vue'
import ContentPage from './pages/ContentPage.vue'
import FleetPage from './pages/FleetPage.vue'
import HomePage from './pages/HomePage.vue'
import BookingOrderPage from './pages/BookingOrderPage.vue'
import LoginPage from './pages/LoginPage.vue'
import OverviewPage from './pages/OverviewPage.vue'
import PassengerDetailPage from './pages/PassengerDetailPage.vue'
import PaymentMethodPage from './pages/PaymentMethodPage.vue'
import PaymentOrderPage from './pages/PaymentOrderPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import ReviewOrderPage from './pages/ReviewOrderPage.vue'
import RulesPage from './pages/RulesPage.vue'
import ServicePage from './pages/ServicePage.vue'
import SocialPage from './pages/SocialPage.vue'
import StepsPage from './pages/StepsPage.vue'
import TicketSearchPage from './pages/TicketSearchPage.vue'
import { submitFinalOrder } from './services/bookingApi'
import { clearStoredAuth, getStoredAuth } from './services/ticketApi'
import { getLastTicket, getUserProfile } from './services/userApi'

const hashToSlug = () => window.location.hash.replace(/^#\/?/, '') || 'home'

const currentSlug = ref(hashToSlug())
const searchCriteria = ref(null)
const searchError = ref('')
const searchLoading = ref(false)
const tickets = ref([])
const auth = ref(getStoredAuth())
const profile = ref(null)
const profileError = ref('')
const profileLoading = ref(false)
const loginReturnSlug = ref(currentSlug.value === 'login' ? 'home' : currentSlug.value)
const selectedBookingTicket = ref(null)
const selectedBookingPassengers = ref([])
const bookingPassengerDetails = ref([])
const finalOrderSubmitting = ref(false)
const finalOrderError = ref('')
const paymentOrder = ref(null)

const agentPageData = computed(() =>
  Object.fromEntries(
    Object.entries(agentPages).map(([slug, locations]) => [
      slug,
      {
        type: 'agent',
        title: navGroups.flatMap((group) => group.links).find((link) => link.slug === slug)?.title,
        subtitle: 'Berikut adalah contoh lokasi agen Hiba Putra di wilayah ini.',
        locations,
      },
    ]),
  ),
)

const allPages = computed(() => ({
  ...pages,
  ...fleetPages,
  ...servicePages,
  ...agentPageData.value,
}))

const activePage = computed(() => allPages.value[currentSlug.value] || pages.home)

const pageFamily = computed(() => {
  if (currentSlug.value.startsWith('armada')) return 'armada'
  if (currentSlug.value.startsWith('layanan')) return 'layanan'
  if (currentSlug.value.startsWith('agen')) return 'agen'
  if (currentSlug.value.startsWith('kontak')) return 'kontak'
  return 'home'
})

const activeHeroImage = computed(() => heroImages[pageFamily.value])
const activeHeroSubtitle = computed(() => activePage.value.subtitle || activePage.value.summary || '')

const setPage = (slug) => {
  if (slug === 'login' && currentSlug.value !== 'login') {
    loginReturnSlug.value = currentSlug.value
  }

  currentSlug.value = slug
  window.location.hash = `/${slug}`
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const syncFromHash = () => {
  const nextSlug = hashToSlug()

  if (nextSlug === 'login' && currentSlug.value !== 'login') {
    loginReturnSlug.value = currentSlug.value
  }

  currentSlug.value = nextSlug
}

const handleSearchStart = ({ criteria }) => {
  searchCriteria.value = criteria
  searchError.value = ''
  searchLoading.value = true
  tickets.value = []
}

const handleSearchComplete = ({ criteria, tickets: nextTickets }) => {
  searchCriteria.value = criteria
  searchError.value = ''
  searchLoading.value = false
  tickets.value = nextTickets
  setPage('search-ticket')
}

const handleSearchError = ({ criteria, message }) => {
  searchCriteria.value = criteria
  searchError.value = message
  searchLoading.value = false
  tickets.value = []
  setPage('search-ticket')
}

const goToSearchForm = () => {
  setPage('home')
}

const goToSearchResults = () => {
  setPage('search-ticket')
}

const handleSelectTicket = (ticket) => {
  if (!auth.value?.accessToken) {
    setPage('login')
    return
  }

  selectedBookingTicket.value = ticket
  selectedBookingPassengers.value = []
  bookingPassengerDetails.value = []
  setPage('booking-order')
}

const handleSeatComplete = (passengers) => {
  selectedBookingPassengers.value = passengers
  setPage('passenger-detail')
}

const handlePassengerDetailsComplete = (passengers) => {
  bookingPassengerDetails.value = passengers
  finalOrderError.value = ''
  setPage('review-order')
}

const getProfileValue = (...keys) => {
  const data = profile.value || auth.value || {}
  return keys.map((key) => data[key]).find(Boolean) || ''
}

const buildFinalOrderPayload = (payment) => ({
  busId: String(selectedBookingTicket.value?.id || ''),
  trayekID: String(selectedBookingTicket.value?.trayekId || ''),
  fullNameInformation: getProfileValue('fullName', 'FullName') || '',
  mobileNumberInformation: getProfileValue('phoneNumber', 'PhoneNumber') || '',
  emailInformation: getProfileValue('email', 'Email') || '',
  acceptTerm: 'true',
  DepartureDate:
    searchCriteria.value?.dateParam || String(searchCriteria.value?.date || '').replaceAll('-', ''),
  DepartureTime: String(selectedBookingTicket.value?.time || ''),
  From: String(selectedBookingTicket.value?.from || ''),
  To: String(selectedBookingTicket.value?.to || ''),
  TicketPrice: String(selectedBookingTicket.value?.price || 0),
  passengerList: bookingPassengerDetails.value.map((passenger, index) => ({
    id: String(passenger.id || index + 1),
    name: String(passenger.name || '').trim(),
    seatNumber: String(passenger.seatCode || ''),
    seatCode: String(passenger.seatNumber || ''),
  })),
  paymentMethod: String(payment?.code || ''),
  AddressPickUp: selectedBookingTicket.value?.addressPickUp || '',
  AddressDropOff: selectedBookingTicket.value?.addressDropOff || '',
})

const handlePaymentSubmit = async ({ payment }) => {
  finalOrderError.value = ''

  const phoneNumber = getProfileValue('phoneNumber', 'PhoneNumber')
  if (!phoneNumber) {
    finalOrderError.value = 'Nomor handphone belum tersedia di profile.'
    return
  }

  const hasEmptyPassengerName = bookingPassengerDetails.value.some((passenger) => !passenger.name?.trim())
  if (hasEmptyPassengerName) {
    finalOrderError.value = 'Lengkapi nama semua penumpang terlebih dahulu.'
    setPage('passenger-detail')
    return
  }

  finalOrderSubmitting.value = true

  try {
    await submitFinalOrder(buildFinalOrderPayload(payment))
    const lastTicket = await getLastTicket()
    paymentOrder.value = {
      method: payment,
      ticket: lastTicket,
    }
    setPage('payment-order')
  } catch (error) {
    finalOrderError.value = error.message || 'Pemesanan belum bisa diproses.'
  } finally {
    finalOrderSubmitting.value = false
  }
}

const loadProfile = async () => {
  if (!auth.value?.accessToken) {
    profile.value = null
    return
  }

  profileLoading.value = true
  profileError.value = ''

  try {
    profile.value = await getUserProfile()
  } catch (error) {
    profileError.value = error.message || 'Profil belum bisa dimuat.'
  } finally {
    profileLoading.value = false
  }
}

const handleAuthSuccess = async (nextAuth) => {
  auth.value = nextAuth
  await loadProfile()
  setPage(loginReturnSlug.value && loginReturnSlug.value !== 'login' ? loginReturnSlug.value : 'home')
}

const handleLogout = () => {
  clearStoredAuth()
  auth.value = null
  profile.value = null
  profileError.value = ''
  setPage('login')
}

onMounted(() => {
  window.addEventListener('hashchange', syncFromHash)
  loadProfile()
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncFromHash)
})
</script>

<template>
  <div class="site-shell">
    <div class="top-strip">
      <a href="mailto:info@hibaputra.co.id">info@hibaputra.co.id</a>
      <span>021 - 293 899 71</span>
    </div>

    <MainHeader
      :current-slug="currentSlug"
      :nav-groups="navGroups"
      :user="profile || auth"
      @navigate="setPage"
    />

    <main>
      <HeroSection
        :image="activeHeroImage"
        :subtitle="activeHeroSubtitle"
        :title="activePage.title"
      />

      <HomePage
        v-if="activePage.type === 'home'"
        @search-complete="handleSearchComplete"
        @search-error="handleSearchError"
        @search-start="handleSearchStart"
      />
      <TicketSearchPage
        v-else-if="activePage.type === 'ticketSearch'"
        :auth="auth"
        :criteria="searchCriteria"
        :error="searchError"
        :loading="searchLoading"
        :profile="profile"
        :tickets="tickets"
        @change-search="goToSearchForm"
        @require-login="setPage('login')"
        @select-ticket="handleSelectTicket"
      />
      <BookingOrderPage
        v-else-if="activePage.type === 'bookingOrder'"
        :auth="auth"
        :criteria="searchCriteria"
        :ticket="selectedBookingTicket"
        @back-to-search="goToSearchResults"
        @login="setPage('login')"
        @seat-complete="handleSeatComplete"
      />
      <PassengerDetailPage
        v-else-if="activePage.type === 'passengerDetail'"
        :auth="auth"
        :criteria="searchCriteria"
        :passengers="selectedBookingPassengers"
        :profile="profile"
        :ticket="selectedBookingTicket"
        @back-to-seat="setPage('booking-order')"
        @continue-review="handlePassengerDetailsComplete"
        @login="setPage('login')"
      />
      <ReviewOrderPage
        v-else-if="activePage.type === 'reviewOrder'"
        :auth="auth"
        :criteria="searchCriteria"
        :passengers="bookingPassengerDetails"
        :profile="profile"
        :ticket="selectedBookingTicket"
        @back-to-detail="setPage('passenger-detail')"
        @continue-payment="setPage('payment-method')"
        @login="setPage('login')"
      />
      <PaymentMethodPage
        v-else-if="activePage.type === 'paymentMethod'"
        :auth="auth"
        :passengers="bookingPassengerDetails"
        :submit-error="finalOrderError"
        :submitting="finalOrderSubmitting"
        :ticket="selectedBookingTicket"
        @back-to-review="setPage('review-order')"
        @login="setPage('login')"
        @pay="handlePaymentSubmit"
      />
      <PaymentOrderPage
        v-else-if="activePage.type === 'paymentOrder'"
        :auth="auth"
        :order="paymentOrder"
        @done="setPage('home')"
        @login="setPage('login')"
      />
      <LoginPage v-else-if="activePage.type === 'login'" @auth-success="handleAuthSuccess" />
      <ProfilePage
        v-else-if="activePage.type === 'profile'"
        :auth="auth"
        :error="profileError"
        :is-loading="profileLoading"
        :profile="profile"
        @login="setPage('login')"
        @logout="handleLogout"
        @refresh="loadProfile"
      />
      <OverviewPage
        v-else-if="activePage.type === 'overview'"
        :cards="activePage.cards"
        @navigate="setPage"
      />
      <ContentPage v-else-if="activePage.type === 'content'" :sections="activePage.sections" />
      <RulesPage v-else-if="activePage.type === 'rules'" :rules="activePage.rules" />
      <StepsPage v-else-if="activePage.type === 'steps'" :steps="activePage.steps" />
      <FleetPage v-else-if="fleetPages[currentSlug]" :fleet="fleetPages[currentSlug]" />
      <ServicePage v-else-if="servicePages[currentSlug]" :service="servicePages[currentSlug]" />
      <AgentPage v-else-if="activePage.type === 'agent'" :page="activePage" />
      <ContactPage v-else-if="activePage.type === 'contact'" />
      <SocialPage v-else-if="activePage.type === 'social'" />
    </main>

    <FooterSection @navigate="setPage" />
  </div>
</template>
