import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useEBikesStore } from './stores/ebikes-simple'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize stores
const ebikeStore = useEBikesStore()

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info)
}

// Initialize app and mount
async function initializeApp() {
  console.log('Starting app initialization...')

  try {
    // Mount the app - data loading will happen in App.vue
    app.mount('#app')
    console.log('App mounted successfully!')
  } catch (error) {
    console.error('Error during initialization:', error)
  }
}

initializeApp()