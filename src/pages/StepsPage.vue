<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section class="content-page">
    <article class="text-panel">
      <h2>Cara Pemesanan</h2>
      <ol class="step-list">
        <li v-for="step in steps" :key="step">{{ step }}</li>
      </ol>
    </article>
  </section>
</template>
