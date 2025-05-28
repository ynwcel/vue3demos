import './assets/css/app.css'
import "nprogress/nprogress.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import CScrollbar from 'c-scrollbar';

import App from './App.vue'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)

app.use(pinia).use(router).use(CScrollbar).mount('#app')
