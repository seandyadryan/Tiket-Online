<script setup>
defineProps({
  image: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section
    class="hero"
    :style="{
      backgroundImage: `linear-gradient(90deg, rgba(28, 32, 40, .9), rgba(28, 32, 40, .44)), url(${image})`,
    }"
  >
    <div class="hero-content">
      <p class="eyebrow">Hiba Putra Group</p>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
  </section>
</template>
