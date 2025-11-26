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

// Initialize e-bikes store and mount app
async function initializeApp() {
  console.log('Starting app initialization...')

  try {
    // Mount the app first
    app.mount('#app')
    console.log('App mounted successfully!')

    // Then load e-bikes data from local storage
    console.log('Loading e-bikes data from local storage...')
    await ebikeStore.fetchEBikes()
    console.log('E-bikes data loaded:', ebikeStore.ebikes.length, 'items')
  } catch (error) {
    console.error('Error during initialization:', error)

    // Try to mount the app even if data loading fails
    try {
      app.mount('#app')
      console.log('App mounted after error!')
    } catch (mountError) {
      console.error('Failed to mount app:', mountError)
    }
  }
}

initializeApp()