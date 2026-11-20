import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/900.css';
import '@fontsource/montserrat/400-italic.css';
import '@/assets/base.css';

createApp(App).use(router).mount('#app');
