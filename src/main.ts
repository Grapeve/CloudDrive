import './assets/main.css'

import { createApp, provide } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

// 导入路由鉴权
import './permission'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('SvgIcon', SvgIcon)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

if (process.env.NODE_ENV === 'development') {
  app.provide('baseFront', window.location.origin + '/#')
} else {
  app.provide('baseFront', window.location.origin + '/pan/#')
}

app.mount('#app')
