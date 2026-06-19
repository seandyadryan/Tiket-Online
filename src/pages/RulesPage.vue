<script setup>
defineProps({
  rules: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section class="content-page">
    <article class="text-panel">
      <h2>Persyaratan dan Ketentuan</h2>
      <ol>
        <li v-for="rule in rules" :key="rule">{{ rule }}</li>
      </ol>
    </article>
    <article class="text-panel split-panel">
      <div>
        <h3>Refund</h3>
        <p>
          Pengajuan refund dapat diarahkan ke kantor pusat atau agen keberangkatan dengan membawa
          identitas dan kode booking.
        </p>
      </div>
      <div>
        <h3>Reschedule</h3>
        <p>Perubahan jadwal mengikuti ketersediaan kursi dan batas waktu operasional yang berlaku.</p>
      </div>
    </article>
  </section>
</template>
