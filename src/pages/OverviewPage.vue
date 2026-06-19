<script setup>
defineProps({
  cards: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['navigate'])
</script>

<template>
  <section class="overview-page">
    <article v-for="card in cards" :key="card.slug">
      <h3>{{ card.title }}</h3>
      <p>{{ card.text }}</p>
      <button type="button" @click="emit('navigate', card.slug)">Buka Halaman</button>
    </article>
  </section>
</template>
