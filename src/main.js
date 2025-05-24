import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 安装mitt: npm install mitt
import mitt from 'mitt'
// 创建事件总线
const bus = mitt()

const app = createApp(App)

// 挂载到Vue原型，使所有组件可通过this.$bus访问
app.config.globalProperties.$bus = bus

app.use(router)
app.use(ElementPlus)
app.mount('#app')
