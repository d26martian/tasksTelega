import { createApp } from 'vue';
import App from './App.vue';

// Initialize Telegram WebApp with fallback
const initTelegram = () => {
  // Check if running inside Telegram
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Configure Telegram Mini App
    tg.ready();
    tg.expand();
    
    // Set theme
    if (tg.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    
    // Set header color to match theme
    tg.setHeaderColor(tg.colorScheme === 'dark' ? '#1a1a1a' : '#ffffff');
    
    return tg;
  }
  
  // Development fallback when not in Telegram
  console.warn('Not running in Telegram WebApp - using development mode');
  
  return {
    ready: () => {},
    expand: () => {},
    colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    initData: '',
    initDataUnsafe: {},
    showAlert: (msg) => alert(msg),
    showPopup: (params, callback) => {
      const confirmed = confirm(params.message);
      if (callback) callback(confirmed ? 'ok' : 'cancel');
    },
    setHeaderColor: () => {},
    HapticFeedback: {
      notificationOccurred: () => {},
      impactOccurred: () => {}
    },
    // Development user mock
    devMode: true
  };
};

const tg = initTelegram();

const app = createApp(App);
app.provide('tg', tg);
app.mount('#app');