<script setup>
import appStoreBadge from '../assets/app-store-badge.png'
import googlePlayBadge from '../assets/google-play-badge.png'
import { downloadLinks } from '../data/siteData'

const emit = defineEmits(['navigate'])

const contactItems = [
  '(021) 471 300 3',
  'admin.customercare@hibautama.com',
  '0878 0011 7077 (Chat Only)',
]
</script>

<template>
  <footer class="footer">
    <div>
      <h3>Hiba Putra</h3>
      <p>© 2026 Hiba Group. All rights reserved.</p>
    </div>

    <div>
      <h3>Hubungi Kami</h3>
      <p v-for="item in contactItems" :key="item">{{ item }}</p>
    </div>

    <div>
      <h3>Links</h3>
      <button type="button" @click="emit('navigate', 'armada/super-double-decker')">Armada</button>
      <button type="button" @click="emit('navigate', 'layanan/akap')">Layanan</button>
      <button type="button" @click="emit('navigate', 'agen/dki-jakarta')">Agen</button>
      <button type="button" @click="emit('navigate', 'kontak/hubungi-kami')">Kontak</button>
    </div>

    <div>
      <h3>Download</h3>
      <div class="store-badge-row footer-store-badges">
        <a :href="downloadLinks.playStore" rel="noopener noreferrer" target="_blank">
          <img :src="googlePlayBadge" alt="Get it on Google Play" />
        </a>
        <a :href="downloadLinks.appStore" rel="noopener noreferrer" target="_blank">
          <img :src="appStoreBadge" alt="Download on the App Store" />
        </a>
      </div>
    </div>
  </footer>
</template>
