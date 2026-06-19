<script setup>
defineProps({
  activeStep: {
    type: Number,
    default: 1,
  },
})

const steps = ['Booking Tiket', 'Isi Data', 'Review', 'Pembayaran']
</script>

<template>
  <div
    class="checkout-stepper"
    :style="{ '--step-ratio': (activeStep - 1) / (steps.length - 1) }"
    aria-label="Tahapan booking"
  >
    <div
      v-for="(step, index) in steps"
      :key="step"
      class="checkout-step"
      :class="{
        active: index + 1 === activeStep,
        complete: index + 1 < activeStep,
      }"
    >
      <div class="step-dot">
        <span></span>
      </div>
      <strong>{{ index + 1 }}. {{ step }}</strong>
    </div>
  </div>
</template>
