import { createApp } from 'vue';
import App from './App.vue';

// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

// Configure Telegram Mini App
tg.ready();
tg.expand();

// Set theme
if (tg.colorScheme === 'dark') {
  document.documentElement.classList.add('dark');
}

const app = createApp(App);
app.provide('tg', tg);
app.mount('#app');