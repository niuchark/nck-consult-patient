import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'

// 在main.scss之前引入vant的样式，因为后面需要覆盖vant的样式
import 'vant/lib/index.css'
import './styles/main.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
