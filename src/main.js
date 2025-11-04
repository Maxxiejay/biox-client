import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router/index.js'
import './style.css'
import 'vue-sonner/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(VueQueryPlugin)
app.mount('#app')
