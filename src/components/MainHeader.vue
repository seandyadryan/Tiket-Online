<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  navGroups: {
    type: Array,
    required: true,
  },
  currentSlug: {
    type: String,
    required: true,
  },
  user: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['navigate'])
const openDropdown = ref('')

const getFirstName = (value) => String(value || '').trim().split(/\s+/)[0]
const userName = computed(() => getFirstName(props.user?.fullName) || props.user?.email || 'Profil')

const isActive = (group, currentSlug) =>
  currentSlug === group.slug || currentSlug.startsWith(`${group.slug}/`)

const openMenu = (slug) => {
  openDropdown.value = slug
}

const closeMenu = () => {
  openDropdown.value = ''
}

const closeMenuOnFocusOut = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    closeMenu()
  }
}

const navigate = (slug) => {
  closeMenu()
  emit('navigate', slug)
}
</script>

<template>
  <header class="main-header">
    <button class="brand" type="button" @click="navigate('home')">
      <span class="brand-mark">HP</span>
      <span>
        <strong>Hiba Putra</strong>
        <small>Jelajah Nusantara</small>
      </span>
    </button>

    <nav aria-label="Navigasi utama">
      <div
        v-for="group in navGroups"
        :key="group.title"
        class="nav-group"
        :class="{ open: openDropdown === group.slug }"
        @focusout="closeMenuOnFocusOut"
        @mouseenter="openMenu(group.slug)"
        @mouseleave="closeMenu"
      >
        <button
          type="button"
          :class="{ active: isActive(group, currentSlug) }"
          @click="navigate(group.slug)"
          @focus="openMenu(group.slug)"
        >
          {{ group.title }}
        </button>

        <div class="dropdown">
          <button
            v-for="link in group.links"
            :key="link.slug"
            type="button"
            @click="navigate(link.slug)"
          >
            {{ link.title }}
          </button>
        </div>
      </div>
    </nav>

    <button
      class="outline-action account-action"
      type="button"
      @click="navigate(props.user ? 'profile' : 'login')"
    >
      {{ props.user ? userName : 'Masuk / Daftar' }}
    </button>
  </header>
</template>
