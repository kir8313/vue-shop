import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import alertPlagin from "@/plugins/alert.plugin";

createApp(App).use(store).use(router).use(alertPlagin).mount('#app')
