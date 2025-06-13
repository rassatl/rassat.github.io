import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'leaflet/dist/leaflet.css'
import { useLang } from './useLang.js'

const app = createApp(App)

const lang = useLang()
app.provide('t', lang.t)
app.provide('changeLang', lang.changeLang)
app.provide('currentLang', lang.currentLang)

app.mount('#app')