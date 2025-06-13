<script setup>
import { useLang } from '../useLang.js'
import { languages } from '../lang.js'

const { currentLang, changeLang } = useLang()

// On extrait juste les clés : ['fr', 'en']
const availableLangs = Object.keys(languages)
</script>

<template>
  <div class="lang-switch">
    <button
      v-for="lang in availableLangs"
      :key="lang"
      :class="{ active: currentLang.currentLang === lang }"
      @click="changeLang(lang)"
    >

      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.lang-switch button {
  background-color: transparent;
  border: 1px solid var(--red-esigelec);
  color: var(--red-esigelec);
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-switch button.active {
  background-color: var(--red-esigelec);
  color: white;
}

.lang-switch button:hover {
  background-color: var(--red-btn-hover);
  color: white;
}
</style>
