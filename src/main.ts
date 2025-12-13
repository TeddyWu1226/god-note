import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import './assets/main.css'
import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";

const pinia = createPinia()
const app = createApp(App)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
