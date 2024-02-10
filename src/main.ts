import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from "axios";

import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(axios)
app.component('SvgIcon', SvgIcon)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$axios = axios

app.mount('#app')
