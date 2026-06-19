<script setup>
const channels = [
  {
    name: 'Instagram',
    handle: '@hibaputraonline',
    className: 'instagram',
    viewBox: '0 0 24 24',
    path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm8.3 2H7.9A3.9 3.9 0 0 0 4 7.9v8.2A3.9 3.9 0 0 0 7.9 20h8.2a3.9 3.9 0 0 0 3.9-3.9V7.9A3.9 3.9 0 0 0 16.1 4zM12 7.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 2a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8zm5.2-2.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z',
  },
  {
    name: 'Facebook',
    handle: 'Hiba Putra',
    className: 'facebook',
    viewBox: '0 0 24 24',
    path: 'M14.2 8.1V6.7c0-.7.5-.9.9-.9h2.2V2.1L14.2 2c-3.4 0-4.1 2.5-4.1 4.1v2H7.5v3.8h2.6V22h4.1V11.9h3.1l.5-3.8h-3.6z',
  },
  {
    name: 'X / Twitter',
    handle: '@hibaputraonline',
    className: 'twitter',
    viewBox: '0 0 24 24',
    path: 'M18.2 2.8h3.2l-7 8 8.2 10.8h-6.4l-5-6.6-5.8 6.6H2.2l7.5-8.5L1.8 2.8h6.6l4.5 6 5.3-6zm-1.1 16.9h1.8L7.4 4.6H5.5l11.6 15.1z',
  },
  {
    name: 'YouTube',
    handle: 'Hiba Putra Official',
    className: 'youtube',
    viewBox: '0 0 24 24',
    path: 'M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.8 4 12 4 12 4s-3.8 0-6.7.2c-.4.1-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.8v1.7c0 1.8.2 3.6.2 3.6s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.7.2 6.4.2 6.4.2s3.8 0 6.7-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.6v-1.7c0-1.8-.2-3.6-.2-3.6zM10.1 14.7V8.5l5.8 3.1-5.8 3.1z',
  },
]
</script>

<template>
  <section class="social-page">
    <article v-for="channel in channels" :key="channel.name">
      <span class="social-logo" :class="channel.className">
        <svg :viewBox="channel.viewBox" aria-hidden="true">
          <path :d="channel.path" />
        </svg>
      </span>
      <h3>{{ channel.name }}</h3>
      <p>{{ channel.handle }}</p>
    </article>
  </section>
</template>
