<script setup>
import { computed, ref } from 'vue'
import { login, loginWithOAuth, register } from '../services/authApi'
import { signInWithGooglePopup, signOutFromFirebase } from '../services/firebaseAuth'

const emit = defineEmits(['auth-success'])

const mode = ref('login')
const isLoading = ref(false)
const message = ref('')
const messageType = ref('')

const loginForm = ref({
  username: '',
  password: '',
})

const registerForm = ref({
  fullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const isLoginMode = computed(() => mode.value === 'login')

const setMessage = (type, text) => {
  messageType.value = type
  message.value = text
}

const getFirstName = (value) => String(value || '').trim().split(/\s+/)[0]

const handleLoginSuccess = ({ auth }) => {
  setMessage('success', `Selamat datang, ${getFirstName(auth.fullName) || auth.email || 'user'}.`)
  emit('auth-success', auth)
}

const submitLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    setMessage('error', 'Email/no. handphone dan password wajib diisi.')
    return
  }

  isLoading.value = true
  setMessage('', '')

  try {
    const result = await login(loginForm.value)
    handleLoginSuccess(result)
  } catch (error) {
    setMessage('error', error.message || 'Login gagal.')
  } finally {
    isLoading.value = false
  }
}

const submitRegister = async () => {
  if (!registerForm.value.acceptTerms) {
    setMessage('error', 'Anda harus menyetujui syarat dan ketentuan.')
    return
  }

  if (
    !registerForm.value.fullName ||
    !registerForm.value.phoneNumber ||
    !registerForm.value.email ||
    !registerForm.value.password ||
    !registerForm.value.confirmPassword
  ) {
    setMessage('error', 'Semua kolom register wajib diisi.')
    return
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    setMessage('error', 'Konfirmasi password belum sama.')
    return
  }

  const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
  if (!strongPasswordPattern.test(registerForm.value.password)) {
    setMessage('error', 'Password minimal 8 karakter dengan huruf besar, huruf kecil, angka, dan simbol.')
    return
  }

  isLoading.value = true
  setMessage('', '')

  try {
    const response = await register(registerForm.value)
    setMessage('success', response?.message || 'Registrasi berhasil. Silakan login.')
    mode.value = 'login'
    loginForm.value.username = registerForm.value.email
  } catch (error) {
    setMessage('error', error.message || 'Registrasi gagal.')
  } finally {
    isLoading.value = false
  }
}

const submitGoogleLogin = async () => {
  isLoading.value = true
  setMessage('', '')

  try {
    const { accessToken, firebaseUser, idToken } = await signInWithGooglePopup()
    const result = await loginWithOAuth({
      email: firebaseUser.email,
      idToken: accessToken || idToken,
      name: firebaseUser.displayName,
      phoneNumber: firebaseUser.phoneNumber || '',
    })
    handleLoginSuccess(result)
  } catch (error) {
    await signOutFromFirebase().catch(() => {})
    setMessage('error', error.message || 'Login Google gagal.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-card">
      <div class="auth-copy">
        <p class="eyebrow">Akun Hiba Putra</p>
        <h2>{{ isLoginMode ? 'Masuk ke akun Anda' : 'Daftar akun baru' }}</h2>
        <p>
          Gunakan akun yang sama dengan aplikasi mobile Hiba Putra untuk mengakses tiket,
          riwayat perjalanan, dan proses booking berikutnya.
        </p>
      </div>

      <div class="auth-tabs">
        <button type="button" :class="{ active: isLoginMode }" @click="mode = 'login'">
          Login
        </button>
        <button type="button" :class="{ active: !isLoginMode }" @click="mode = 'register'">
          Register
        </button>
      </div>

      <form v-if="isLoginMode" class="auth-form" @submit.prevent="submitLogin">
        <label>
          <span>Email / No. Handphone</span>
          <input v-model="loginForm.username" autocomplete="username" type="text" />
        </label>
        <label>
          <span>Password</span>
          <input v-model="loginForm.password" autocomplete="current-password" type="password" />
        </label>

        <button class="primary-action" type="submit" :disabled="isLoading">
          {{ isLoading ? 'Memproses...' : 'Login' }}
        </button>
      </form>

      <form v-else class="auth-form" @submit.prevent="submitRegister">
        <label>
          <span>Nama Lengkap</span>
          <input v-model="registerForm.fullName" autocomplete="name" type="text" />
        </label>
        <label>
          <span>No. Handphone</span>
          <input v-model="registerForm.phoneNumber" autocomplete="tel" type="tel" />
        </label>
        <label>
          <span>Email</span>
          <input v-model="registerForm.email" autocomplete="email" type="email" />
        </label>
        <label>
          <span>Password</span>
          <input v-model="registerForm.password" autocomplete="new-password" type="password" />
        </label>
        <label>
          <span>Konfirmasi Password</span>
          <input
            v-model="registerForm.confirmPassword"
            autocomplete="new-password"
            type="password"
          />
        </label>
        <label class="terms-check">
          <input v-model="registerForm.acceptTerms" type="checkbox" />
          <span>Saya menyetujui Syarat & Ketentuan</span>
        </label>

        <button class="primary-action" type="submit" :disabled="isLoading">
          {{ isLoading ? 'Memproses...' : 'Register' }}
        </button>
      </form>

      <div class="auth-divider"><span>atau</span></div>

      <button class="google-button" type="button" :disabled="isLoading" @click="submitGoogleLogin">
        <span class="google-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              fill="#4285f4"
              d="M22.6 12.2c0-.8-.1-1.6-.2-2.3H12v4.4h5.9a5.1 5.1 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8.1z"
            />
            <path
              fill="#34a853"
              d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.8 0-5.2-1.9-6.1-4.5H2.2v2.8A11 11 0 0 0 12 23z"
            />
            <path
              fill="#fbbc05"
              d="M5.9 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.2a11 11 0 0 0 0 9.8l3.7-2.8z"
            />
            <path
              fill="#ea4335"
              d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A10.7 10.7 0 0 0 12 1 11 11 0 0 0 2.2 7.1l3.7 2.8c.9-2.6 3.3-4.5 6.1-4.5z"
            />
          </svg>
        </span>
        Login dengan Gmail
      </button>

      <p v-if="message" class="auth-message" :class="messageType">{{ message }}</p>
    </div>
  </section>
</template>
