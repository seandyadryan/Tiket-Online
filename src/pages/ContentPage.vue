<script setup>
defineProps({
  sections: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section class="content-page">
    <article v-for="section in sections" :key="section.title" class="text-panel">
      <h2>{{ section.title }}</h2>
      <p>{{ section.body }}</p>
    </article>
  </section>
</template>
