<script setup>
import { computed, ref } from 'vue'
import { changePassword } from '../services/authApi'

const props = defineProps({
  auth: {
    type: Object,
    default: null,
  },
  error: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  profile: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['login', 'logout', 'refresh'])

const user = computed(() => props.profile || props.auth || {})
const passwordForm = ref({
  confirmPassword: '',
  currentPassword: '',
  newPassword: '',
})
const passwordMessage = ref('')
const passwordMessageType = ref('')
const isChangingPassword = ref(false)
const showPasswordForm = ref(false)

const initials = computed(() => {
  const name = user.value.fullName || user.value.FullName || user.value.email || user.value.Email || 'HP'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
})

const getFirstName = (value) => String(value || '').trim().split(/\s+/)[0]
const displayName = computed(
  () => getFirstName(user.value.fullName || user.value.FullName) || 'Pengguna Hiba Putra',
)
const displayEmail = computed(() => user.value.email || user.value.Email || '-')
const displayPhone = computed(() => user.value.phoneNumber || user.value.PhoneNumber || '-')
const displayRole = computed(() => user.value.role || user.value.Role || 'Customer')
const displayUsername = computed(() => user.value.username || user.value.Username || '-')
const isVerified = computed(() => user.value.isEmailVerified ?? user.value.IsEmailVerified)

const summaryItems = computed(() => [
  { label: 'Total Tiket', value: user.value.totalTickets ?? user.value.TotalTickets ?? 0 },
  { label: 'Tiket Aktif', value: user.value.activeTickets ?? user.value.ActiveTickets ?? 0 },
  { label: 'Tiket Batal', value: user.value.cancelledTickets ?? user.value.CancelledTickets ?? 0 },
])

const setPasswordMessage = (type, text) => {
  passwordMessageType.value = type
  passwordMessage.value = text
}

const togglePasswordForm = () => {
  showPasswordForm.value = !showPasswordForm.value
  setPasswordMessage('', '')
}

const submitChangePassword = async () => {
  if (
    !passwordForm.value.currentPassword ||
    !passwordForm.value.newPassword ||
    !passwordForm.value.confirmPassword
  ) {
    setPasswordMessage('error', 'Semua kolom password wajib diisi.')
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    setPasswordMessage('error', 'Konfirmasi password baru belum sama.')
    return
  }

  const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
  if (!strongPasswordPattern.test(passwordForm.value.newPassword)) {
    setPasswordMessage(
      'error',
      'Password baru minimal 8 karakter dengan huruf besar, huruf kecil, angka, dan simbol.',
    )
    return
  }

  isChangingPassword.value = true
  setPasswordMessage('', '')

  try {
    const response = await changePassword(passwordForm.value)
    setPasswordMessage('success', response?.message || 'Kata sandi berhasil diubah.')
    passwordForm.value = {
      confirmPassword: '',
      currentPassword: '',
      newPassword: '',
    }
    showPasswordForm.value = false
  } catch (error) {
    setPasswordMessage('error', error.message || 'Kata sandi belum berhasil diubah.')
  } finally {
    isChangingPassword.value = false
  }
}
</script>

<template>
  <section class="profile-page">
    <div v-if="!auth" class="profile-empty">
      <h2>Anda belum login</h2>
      <p>Silakan masuk untuk melihat profil, session akun, dan riwayat tiket.</p>
      <button class="primary-action" type="button" @click="emit('login')">Masuk Sekarang</button>
    </div>

    <template v-else>
      <article class="profile-card">
        <div class="profile-avatar">{{ initials }}</div>
        <div class="profile-main">
          <p class="eyebrow">Profil Penumpang</p>
          <h2>{{ displayName }}</h2>
          <p>{{ displayEmail }}</p>
          <span class="profile-badge" :class="{ verified: isVerified }">
            {{ isVerified ? 'Email terverifikasi' : 'Email belum terverifikasi' }}
          </span>
        </div>
        <div class="profile-actions">
          <button class="outline-action" type="button" @click="emit('refresh')">
            Refresh
          </button>
          <button class="ghost-action" type="button" @click="togglePasswordForm">
            Ubah Password
          </button>
          <button class="ghost-action" type="button" @click="emit('logout')">
            Logout
          </button>
        </div>
      </article>

      <p v-if="isLoading" class="profile-note">Memuat data profil terbaru...</p>
      <p v-else-if="error" class="profile-note error">{{ error }}</p>

      <div class="profile-grid">
        <article>
          <span>Username</span>
          <strong>{{ displayUsername }}</strong>
        </article>
        <article>
          <span>No. Handphone</span>
          <strong>{{ displayPhone }}</strong>
        </article>
        <article>
          <span>Role</span>
          <strong>{{ displayRole }}</strong>
        </article>
      </div>

      <div class="profile-stats">
        <article v-for="item in summaryItems" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>

      <article v-if="showPasswordForm" class="password-panel">
        <div>
          <p class="eyebrow">Keamanan Akun</p>
          <h2>Ubah Password</h2>
        </div>

        <form class="auth-form" @submit.prevent="submitChangePassword">
          <label>
            <span>Password Sekarang</span>
            <input
              v-model="passwordForm.currentPassword"
              autocomplete="current-password"
              type="password"
            />
          </label>
          <label>
            <span>Password Baru</span>
            <input
              v-model="passwordForm.newPassword"
              autocomplete="new-password"
              type="password"
            />
          </label>
          <label>
            <span>Konfirmasi Password Baru</span>
            <input
              v-model="passwordForm.confirmPassword"
              autocomplete="new-password"
              type="password"
            />
          </label>

          <button class="primary-action" type="submit" :disabled="isChangingPassword">
            {{ isChangingPassword ? 'Menyimpan...' : 'Simpan Password' }}
          </button>
        </form>

        <p v-if="passwordMessage" class="auth-message" :class="passwordMessageType">
          {{ passwordMessage }}
        </p>
      </article>
    </template>
  </section>
</template>
