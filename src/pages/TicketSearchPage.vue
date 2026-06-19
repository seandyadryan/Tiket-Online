<script setup>
import TicketResults from '../components/TicketResults.vue'

defineProps({
  auth: {
    type: Object,
    default: null,
  },
  profile: {
    type: Object,
    default: null,
  },
  criteria: {
    type: Object,
    default: null,
  },
  error: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  tickets: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['change-search', 'require-login', 'select-ticket'])
</script>

<template>
  <TicketResults
    v-if="criteria || loading || error"
    :auth="auth"
    :criteria="criteria"
    :error="error"
    :loading="loading"
    :profile="profile"
    :tickets="tickets"
    @change-search="emit('change-search')"
    @require-login="emit('require-login')"
    @select-ticket="emit('select-ticket', $event)"
  />

  <section v-else class="ticket-results">
    <div class="ticket-empty">
      <h3>Belum ada pencarian tiket</h3>
      <p>Silakan kembali ke Beranda untuk memilih asal, tujuan, tanggal, dan jumlah penumpang.</p>
      <button class="primary-action" type="button" @click="emit('change-search')">
        Cari Tiket
      </button>
    </div>
  </section>
</template>
