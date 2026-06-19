<script setup>
import { homeHighlights } from '../data/siteData'

defineProps({
  service: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="service-page">
    <div class="service-copy">
      <h2>{{ service.title }}</h2>
      <p>{{ service.summary }}</p>
      <ul class="service-list">
        <li v-for="item in service.bullets" :key="item">{{ item }}</li>
      </ul>
      <button class="primary-action" type="button">{{ service.cta }}</button>
    </div>
    <div class="service-card-grid">
      <article v-for="item in homeHighlights" :key="item.title">
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </div>
  </section>
</template>
