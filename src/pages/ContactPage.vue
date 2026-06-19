<script setup>
const contactItems = [
  {
    label: '(021) 471 300 3',
    type: 'phone',
  },
  {
    label: 'admin.customercare@hibautama.com',
    type: 'mail',
  },
  {
    label: '0878 0011 7077 (Chat Only)',
    type: 'wa',
  },
]
</script>

<template>
  <section class="contact-page">
    <form class="contact-form">
      <label>
        <span>Nama</span>
        <input type="text" />
      </label>
      <label>
        <span>Email</span>
        <input type="email" />
      </label>
      <label>
        <span>Pesan</span>
        <textarea rows="5"></textarea>
      </label>
      <button class="primary-action" type="button">Submit</button>
    </form>
    <div class="contact-card">
      <h2>Hubungi Kami</h2>
      <div class="contact-list">
        <p v-for="item in contactItems" :key="item.label" class="contact-row">
          <span class="contact-icon" :class="item.type" aria-hidden="true">
            <svg v-if="item.type === 'phone'" viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.7 3.4 3.2 4.9 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1.3.4 2.7.7 4.1.7.7 0 1.2.5 1.2 1.2v3.5c0 .7-.5 1.2-1.2 1.2C10.4 21.6 2.4 13.6 2.4 3.3c0-.7.5-1.2 1.2-1.2h3.5c.7 0 1.2.5 1.2 1.2 0 1.4.2 2.8.7 4.1.1.4 0 .8-.3 1.2l-2.1 2.2z" />
            </svg>
            <svg v-else-if="item.type === 'mail'" viewBox="0 0 24 24">
              <path d="M3 5h18c.7 0 1.2.5 1.2 1.2v11.6c0 .7-.5 1.2-1.2 1.2H3c-.7 0-1.2-.5-1.2-1.2V6.2C1.8 5.5 2.3 5 3 5zm9 8.1 8-5.6H4l8 5.6zm0 2.3L3.8 9.7v7.1h16.4V9.7L12 15.4z" />
            </svg>
            <svg v-else viewBox="0 0 24 24">
              <path d="M12 2.2A9.7 9.7 0 0 0 3.8 17l-1.1 4.1 4.2-1.1A9.7 9.7 0 1 0 12 2.2zm0 17.4c-1.6 0-3.1-.5-4.4-1.4l-.3-.2-2.5.7.7-2.4-.2-.3A7.7 7.7 0 1 1 12 19.6zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.2-.3.2-.6.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2.1-.3 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s1 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.4-.6 1.6-1.1.2-.5.2-1 .2-1.1-.1-.1-.2-.2-.4-.3z" />
            </svg>
          </span>
          <span>{{ item.label }}</span>
        </p>
      </div>
    </div>
  </section>
</template>
