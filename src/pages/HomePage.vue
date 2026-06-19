<script setup>
import appStoreBadge from '../assets/app-store-badge.png'
import googlePlayBadge from '../assets/google-play-badge.png'
import BookingTabs from '../components/BookingTabs.vue'
import { downloadLinks, homeHighlights } from '../data/siteData'

const emit = defineEmits(['search-complete', 'search-error', 'search-start'])
</script>

<template>
  <BookingTabs
    @search-complete="emit('search-complete', $event)"
    @search-error="emit('search-error', $event)"
    @search-start="emit('search-start', $event)"
  />

  <section class="home-intro">
    <div>
      <p class="eyebrow">Reservasi mudah dan cepat</p>
      <h2>Pesan tiket, cek pesanan, dan ajukan sewa bus dari satu tempat</h2>
      <p>
        UI ini mengikuti struktur website operator bus seperti referensi: navigasi lengkap,
        form reservasi, halaman armada, halaman layanan, halaman agen, dan kontak.
      </p>
    </div>
    <div class="download-card">
      <span>Aplikasi Mobile</span>
      <strong>Hiba Putra Online</strong>
      <p>Unduh aplikasi resmi Hiba Putra melalui Play Store atau App Store.</p>
      <div class="store-badge-row">
        <a :href="downloadLinks.playStore" rel="noopener noreferrer" target="_blank">
          <img :src="googlePlayBadge" alt="Get it on Google Play" />
        </a>
        <a :href="downloadLinks.appStore" rel="noopener noreferrer" target="_blank">
          <img :src="appStoreBadge" alt="Download on the App Store" />
        </a>
      </div>
    </div>
  </section>

  <section class="feature-grid">
    <article v-for="item in homeHighlights" :key="item.title">
      <span>0{{ homeHighlights.indexOf(item) + 1 }}</span>
      <h3>{{ item.title }}</h3>
      <p>{{ item.text }}</p>
    </article>
  </section>
</template>
