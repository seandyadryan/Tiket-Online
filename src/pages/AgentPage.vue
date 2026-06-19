<script setup>
defineProps({
  page: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="agent-page">
    <div class="section-head">
      <p class="eyebrow">Agen keberangkatan</p>
      <h2>{{ page.title }}</h2>
      <p>{{ page.subtitle }}</p>
    </div>
    <div class="agent-grid">
      <article v-for="location in page.locations" :key="location">
        <span>Pool</span>
        <h3>{{ location }}</h3>
        <p>Lokasi agen, titik naik, informasi jadwal, dan bantuan tiket.</p>
        <button type="button">Lihat Detail</button>
      </article>
    </div>
  </section>
</template>
