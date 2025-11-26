<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScrollAnimations } from '../composables/useScrollAnimations'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import EnhancedAIChatbot from '../components/EnhancedAIChatbot.vue'

useScrollAnimations()

const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  preferredContact: 'email'
})

const isSubmitting = ref(false)
const submitMessage = ref('')

const submitForm = async () => {
  isSubmitting.value = true
  // Simulate form submission
  setTimeout(() => {
    isSubmitting.value = false
    submitMessage.value = 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.'
    contactForm.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredContact: 'email'
    }
  }, 2000)
}

onMounted(() => {
  // Set page title for SEO
  document.title = 'Contact - E-Bike Vergelijker | Neem Contact Op'
  
  // Add meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Neem contact op met E-Bike Vergelijker. Vragen over e-bikes, prijzen, afspraken? Ons AI-team helpt je graag verder. Bel, mail of chat met ons!')
  }
})
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Header />

    <main class="pt-20 flex-1">
      <!-- Hero Section -->
      <section class="relative py-16 overflow-hidden">
        <div class="parallax-layer absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50" data-speed="0.5"></div>
        
        <div class="container mx-auto px-6 relative z-10">
          <div class="scroll-reveal text-center max-w-3xl mx-auto">
            <h1 class="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Neem Contact Op
            </h1>
            <p class="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed">
              Heb je vragen over e-bikes, prijzen of wil je een afspraak maken? 
              Ons team staat voor je klaar!
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="tel:+31851234567"
                class="btn-primary px-8 py-3 text-base"
              >
                📞 Bel Direct
              </a>
              <a
                href="mailto:info@ebikevergelijker.nl"
                class="btn-glass px-8 py-3 text-base"
              >
                ✉️ Stuur E-mail
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Methods Section -->
      <section class="py-16 relative">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <!-- Phone -->
            <div class="scroll-reveal glass-card p-6 card-interactive text-center group">
              <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📞</div>
              <h3 class="text-xl font-bold mb-3 text-text-primary">Bel Ons</h3>
              <p class="text-text-secondary mb-2 text-sm">Ma-Vr: 9:00-18:00, Za: 10:00-16:00</p>
              <a href="tel:+31851234567" class="text-lg font-bold text-primary-600 hover:text-primary-700 transition-colors">
                +31 85 123 45 67
              </a>
            </div>

            <!-- Email -->
            <div class="scroll-reveal glass-card p-6 card-interactive text-center group" style="animation-delay: 0.1s;">
              <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">✉️</div>
              <h3 class="text-xl font-bold mb-3 text-text-primary">E-mail Ons</h3>
              <p class="text-text-secondary mb-4 text-sm">We reageren binnen 2 uur</p>
              <a href="mailto:info@ebikevergelijker.nl" class="text-base font-semibold text-primary-600 hover:text-primary-700 transition-colors break-all">
                info@ebikevergelijker.nl
              </a>
            </div>

            <!-- Chat -->
            <div class="scroll-reveal glass-card p-6 card-interactive text-center group" style="animation-delay: 0.2s;">
              <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💬</div>
              <h3 class="text-xl font-bold mb-3 text-text-primary">Live Chat</h3>
              <p class="text-text-secondary mb-4 text-sm">AI-assistent 24/7 beschikbaar</p>
              <button 
                @click="$refs.chatbot?.openChat()"
                class="text-base font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Start Chat →
              </button>
            </div>
          </div>

          <!-- Business Hours & Address -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Business Hours -->
            <div class="scroll-reveal">
              <div class="glass-card p-8">
                <h2 class="text-2xl font-display font-bold text-gray-900 mb-6">Openingstijden</h2>
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2 border-b border-gray-200">
                    <span class="text-text-primary font-semibold">Maandag - Vrijdag</span>
                    <span class="text-text-secondary">9:00 - 18:00</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-200">
                    <span class="text-text-primary font-semibold">Zaterdag</span>
                    <span class="text-text-secondary">10:00 - 16:00</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-text-primary font-semibold">Zondag & Feestdagen</span>
                    <span class="text-text-secondary">Gesloten</span>
                  </div>
                </div>
                <div class="mt-6 p-4 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg">
                  <h3 class="text-base font-bold text-text-primary mb-1">AI Chatbot</h3>
                  <p class="text-text-secondary text-sm">
                    24/7 beschikbaar voor vragen over e-bikes, prijzen en afspraken.
                  </p>
                </div>
              </div>
            </div>

            <!-- Address -->
            <div class="scroll-reveal" style="animation-delay: 0.2s;">
              <div class="glass-card p-8">
                <h2 class="text-2xl font-display font-bold text-gray-900 mb-6">Ons Adres</h2>
                <div class="space-y-4">
                  <div class="flex items-start">
                    <span class="text-xl mr-3">📍</span>
                    <div>
                      <p class="text-text-primary font-semibold">E-Bike Vergelijker B.V.</p>
                      <p class="text-text-secondary text-sm">Hoofdstraat 123, 1012 AB Amsterdam</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <span class="text-xl mr-3">🚗</span>
                    <div>
                      <p class="text-text-primary font-semibold text-sm">Parkeren</p>
                      <p class="text-text-secondary text-sm">Gratis voor klanten (P1 & P2)</p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <span class="text-xl mr-3">🚇</span>
                    <div>
                      <p class="text-text-primary font-semibold text-sm">Openbaar Vervoer</p>
                      <p class="text-text-secondary text-sm">Metro: Centraal Station (5 min)</p>
                      <p class="text-text-secondary text-sm">Tram: Lijn 1, 2, 5 (halte Dam)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Google Maps Section -->
      <section class="py-16 parallax-section relative">
        <div class="parallax-layer absolute inset-0 bg-gradient-to-b from-secondary-50/50 to-primary-50/50" data-speed="0.3"></div>
        
        <div class="container mx-auto px-6 relative z-10">
          <div class="scroll-reveal text-center mb-8">
            <h2 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Vind Ons
            </h2>
            <p class="text-lg text-text-secondary max-w-2xl mx-auto">
              Bezoek ons showroom in het hart van Amsterdam voor persoonlijk advies 
              en testritten van onze e-bikes.
            </p>
          </div>

          <!-- Google Maps Embed -->
          <div class="scroll-reveal glass-card p-6">
            <div class="aspect-video rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.476961783373!2d4.9041399!3d52.3675734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c91a3c5cdf%3A0x4700c5a18c23d5c2!2sDam%2C%20Amsterdam!5e0!3m2!1sen!2snl!4v1699123456789!5m2!1sen!2snl"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                class="rounded-lg"
              ></iframe>
            </div>
            <div class="mt-4 text-center">
              <a
                href="https://maps.google.com/?q=Hoofdstraat+123,+1012+AB+Amsterdam"
                target="_blank"
                class="btn-primary inline-block px-6 py-3"
              >
                📍 Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Form Section -->
      <section class="py-16 relative">
        <div class="container mx-auto px-6">
          <div class="max-w-6xl mx-auto">
            <div class="scroll-reveal text-center mb-12">
              <h2 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                Stuur Ons een Bericht
              </h2>
              <p class="text-lg text-text-secondary">
                Heb je een specifieke vraag? Vul het formulier in en we nemen zo snel mogelijk contact met je op.
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Contact Form -->
              <div class="scroll-reveal">
                <div class="glass-card p-8">
                  <form @submit.prevent="submitForm" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="name" class="block text-sm font-semibold text-text-primary mb-1">
                          Naam *
                        </label>
                        <input
                          id="name"
                          v-model="contactForm.name"
                          type="text"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
                          placeholder="Jouw naam"
                        />
                      </div>
                      <div>
                        <label for="email" class="block text-sm font-semibold text-text-primary mb-1">
                          E-mail *
                        </label>
                        <input
                          id="email"
                          v-model="contactForm.email"
                          type="email"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
                          placeholder="jouw@email.nl"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="phone" class="block text-sm font-semibold text-text-primary mb-1">
                          Telefoon
                        </label>
                        <input
                          id="phone"
                          v-model="contactForm.phone"
                          type="tel"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
                          placeholder="06-12345678"
                        />
                      </div>
                      <div>
                        <label for="subject" class="block text-sm font-semibold text-text-primary mb-1">
                          Onderwerp *
                        </label>
                        <select
                          id="subject"
                          v-model="contactForm.subject"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
                        >
                          <option value="">Selecteer onderwerp</option>
                          <option value="algemeen">Algemene vraag</option>
                          <option value="e-bike-advies">E-bike advies</option>
                          <option value="prijs">Prijsinformatie</option>
                          <option value="afspraak">Afspraak maken</option>
                          <option value="klacht">Klacht</option>
                          <option value="partnership">Partnership</option>
                          <option value="anders">Anders</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label for="message" class="block text-sm font-semibold text-text-primary mb-1">
                        Bericht *
                      </label>
                      <textarea
                        id="message"
                        v-model="contactForm.message"
                        required
                        rows="4"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none text-sm"
                        placeholder="Vertel ons hoe we je kunnen helpen..."
                      ></textarea>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-text-primary mb-2">
                        Voorkeur contact
                      </label>
                      <div class="flex space-x-4">
                        <label class="flex items-center">
                          <input
                            v-model="contactForm.preferredContact"
                            type="radio"
                            value="email"
                            class="mr-2"
                          />
                          <span class="text-text-secondary text-sm">E-mail</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="contactForm.preferredContact"
                            type="radio"
                            value="phone"
                            class="mr-2"
                          />
                          <span class="text-text-secondary text-sm">Telefoon</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      :disabled="isSubmitting"
                      class="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="isSubmitting" class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Versturen...
                      </span>
                      <span v-else>Verstuur Bericht</span>
                    </button>

                    <div v-if="submitMessage" class="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                      {{ submitMessage }}
                    </div>
                  </form>
                </div>
              </div>

              <!-- Contact Info Sidebar -->
              <div class="scroll-reveal" style="animation-delay: 0.2s;">
                <div class="space-y-6">
                  <!-- Quick Contact -->
                  <div class="glass-card p-6">
                    <h3 class="text-xl font-bold text-text-primary mb-4">Snelle Contact</h3>
                    <div class="space-y-3">
                      <a href="tel:+31851234567" class="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                        <span class="text-xl mr-3">📞</span>
                        <div>
                          <p class="font-semibold text-text-primary text-sm">Bel Direct</p>
                          <p class="text-text-secondary text-sm">+31 85 123 45 67</p>
                        </div>
                      </a>
                      <a href="mailto:info@ebikevergelijker.nl" class="flex items-center p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                        <span class="text-xl mr-3">✉️</span>
                        <div>
                          <p class="font-semibold text-text-primary text-sm">E-mail</p>
                          <p class="text-text-secondary text-sm">info@ebikevergelijker.nl</p>
                        </div>
                      </a>
                      <button 
                        @click="$refs.chatbot?.openChat()"
                        class="flex items-center p-3 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors w-full"
                      >
                        <span class="text-xl mr-3">💬</span>
                        <div class="text-left">
                          <p class="font-semibold text-text-primary text-sm">AI Chat</p>
                          <p class="text-text-secondary text-sm">24/7 beschikbaar</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- FAQ -->
                  <div class="glass-card p-6">
                    <h3 class="text-xl font-bold text-text-primary mb-4">Veelgestelde Vragen</h3>
                    <div class="space-y-3">
                      <div class="border-b border-gray-200 pb-3">
                        <h4 class="font-semibold text-text-primary mb-1 text-sm">Hoe werkt de e-bike vergelijking?</h4>
                        <p class="text-xs text-text-secondary">Onze AI vergelijkt automatisch specificaties, prijzen en reviews van honderden e-bikes.</p>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <h4 class="font-semibold text-text-primary mb-1 text-sm">Kan ik een testrit maken?</h4>
                        <p class="text-xs text-text-secondary">Ja! Maak een afspraak via ons platform of bel direct voor een testrit.</p>
                      </div>
                      <div>
                        <h4 class="font-semibold text-text-primary mb-1 text-sm">Zijn jullie prijzen actueel?</h4>
                        <p class="text-xs text-text-secondary">We updaten dagelijks onze prijsdatabase voor de meest actuele informatie.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />

    <!-- Enhanced AI Chatbot Component -->
    <EnhancedAIChatbot ref="chatbot" />
  </div>
</template>

<style scoped>
/* Additional component-specific styles */
.text-gradient {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Form styling */
input:focus, textarea:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
