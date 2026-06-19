<script setup>
defineProps({
  fleet: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="detail-layout">
    <img :src="fleet.image" :alt="fleet.title" />
    <div class="detail-copy">
      <div class="stat-row">
        <span>
          <small>Kursi</small>
          <strong>{{ fleet.seats }}</strong>
        </span>
        <span>
          <small>Layanan</small>
          <strong>{{ fleet.service }}</strong>
        </span>
      </div>
      <p>{{ fleet.summary }}</p>
      <h2>Fasilitas Bus</h2>
      <ul class="pill-list">
        <li v-for="item in fleet.facilities" :key="item">{{ item }}</li>
      </ul>
      <h2>Rute Layanan</h2>
      <ul class="route-list">
        <li v-for="route in fleet.routes" :key="route">{{ route }}</li>
      </ul>
    </div>
  </section>
</template>
