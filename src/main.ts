import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import './assets/main.css'
import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
// 1. 引入持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
// 2. 告訴 Pinia 使用這個插件
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
