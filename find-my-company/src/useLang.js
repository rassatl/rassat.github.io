import { reactive } from 'vue'
import { languages } from './lang'

const state = reactive({
  currentLang: localStorage.getItem('lang') || 'fr'
})

export function useLang() {
  const t = (keyPath) => {
    const keys = keyPath.split('.')
    return keys.reduce((acc, key) => acc?.[key], languages[state.currentLang]) || keyPath
  }

  const changeLang = (lang) => {
    if (languages[lang]) {
      state.currentLang = lang
      localStorage.setItem('lang', lang)
    }
  }

  return {
    t,
    changeLang,
    currentLang: state
  }
}