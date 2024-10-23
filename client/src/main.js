// import App from './App.vue'

import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import mitt from 'mitt'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
//import e from 'express'

const emitter = mitt()
const app = createApp(App)
app.use(createBootstrap())
app.use(router)


app.config.globalProperties.emitter = emitter
app.mount('#app')
