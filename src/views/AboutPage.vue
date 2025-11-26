<script setup lang="ts">
import { onMounted } from 'vue'
import { useScrollAnimations } from '../composables/useScrollAnimations'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import EnhancedAIChatbot from '../components/EnhancedAIChatbot.vue'

useScrollAnimations()

onMounted(() => {
  // Set page title for SEO
  document.title = 'Over Ons - E-Bike Vergelijker | Nederland\'s #1 E-Bike Platform'
  
  // Add meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Ontdek het verhaal achter E-Bike Vergelijker. Onze missie, visie en het team dat Nederland helpt de perfecte e-bike te vinden. Transparant, betrouwbaar en innovatief.')
  }
})
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Header />

    <main class="pt-20 flex-1">
      <!-- Hero Section -->
      <section class="relative py-16 overflow-hidden bg-white">
        <div class="parallax-layer absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50" data-speed="0.5"></div>
        
        <div class="container mx-auto px-6 relative z-10">
          <div class="scroll-reveal text-center max-w-3xl mx-auto">
            <h1 class="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Over E-Bike Vergelijker
            </h1>
            <p class="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Nederland's meest vertrouwde platform voor e-bike vergelijking en advies
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <RouterLink
                to="/e-bikes"
                class="btn-primary px-8 py-3 text-base"
              >
                Ontdek E-Bikes
              </RouterLink>
              <RouterLink
                to="/contact"
                class="btn-glass px-8 py-3 text-base"
              >
                Neem Contact Op
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Mission & Vision Section -->
      <section class="py-16 relative">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <!-- Mission -->
            <div class="scroll-reveal">
              <div class="glass-card p-8 card-interactive">
                <div class="text-4xl mb-6 text-primary-500">🎯</div>
                <h2 class="text-2xl font-display font-bold text-gradient mb-4">Onze Missie</h2>
                <p class="text-base text-text-secondary leading-relaxed mb-4">
                  Wij maken het vinden van de perfecte e-bike eenvoudig, transparant en betrouwbaar. 
                  Door geavanceerde vergelijkingstechnologie en onafhankelijke reviews helpen we 
                  elke Nederlander de e-bike te vinden die perfect past bij hun levensstijl en budget.
                </p>
                <ul class="space-y-2 text-text-secondary text-sm">
                  <li class="flex items-center">
                    <span class="text-primary-500 mr-2">✓</span>
                    Transparante prijsvergelijking
                  </li>
                  <li class="flex items-center">
                    <span class="text-primary-500 mr-2">✓</span>
                    Onafhankelijke productreviews
                  </li>
                  <li class="flex items-center">
                    <span class="text-primary-500 mr-2">✓</span>
                    Persoonlijk advies op maat
                  </li>
                </ul>
              </div>
            </div>

            <!-- Vision -->
            <div class="scroll-reveal" style="animation-delay: 0.2s;">
              <div class="glass-card p-8 card-interactive">
                <div class="text-4xl mb-6 text-secondary-500">🔮</div>
                <h2 class="text-2xl font-display font-bold text-gradient mb-4">Onze Visie</h2>
                <p class="text-base text-text-secondary leading-relaxed mb-4">
                  Wij streven ernaar om Nederland's toonaangevende e-bike platform te worden, 
                  waar technologie en menselijke expertise samenkomen om duurzame mobiliteit 
                  voor iedereen toegankelijk te maken.
                </p>
                <div class="bg-gradient-to-r from-primary-100 to-secondary-100 p-4 rounded-lg">
                  <h3 class="text-base font-bold text-text-primary mb-2">Onze Doelen voor 2025</h3>
                  <ul class="space-y-1 text-text-secondary text-sm">
                    <li>• 100.000+ tevreden gebruikers</li>
                    <li>• 500+ e-bike modellen in database</li>
                    <li>• 95%+ klanttevredenheid</li>
                    <li>• CO2-neutrale operaties</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="py-16 parallax-section relative">
        <div class="parallax-layer absolute inset-0 bg-gradient-to-b from-secondary-50/50 to-primary-50/50" data-speed="0.3"></div>
        
        <div class="container mx-auto px-6 relative z-10">
          <div class="scroll-reveal text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-display font-bold text-gradient mb-4">
              Ontmoet Ons Team
            </h2>
            <p class="text-lg text-text-secondary max-w-2xl mx-auto">
              De gepassioneerde experts achter E-Bike Vergelijker, die dagelijks werken aan 
              de beste e-bike ervaring voor jou.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Team Member 1 -->
            <div class="scroll-reveal glass-card p-6 card-interactive group">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white">
                  MS
                </div>
                <h3 class="text-lg font-bold text-text-primary">Marco van der Berg</h3>
                <p class="text-primary-600 font-semibold text-sm">CEO & Oprichter</p>
              </div>
              <p class="text-text-secondary text-center leading-relaxed text-sm">
                Voormalig product manager bij een grote fietsfabrikant. 15+ jaar ervaring in de 
                e-bike industrie en gepassioneerd over duurzame mobiliteit.
              </p>
              <div class="flex justify-center mt-3 space-x-2">
                <span class="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">E-bike Expert</span>
                <span class="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">CEO</span>
              </div>
            </div>

            <!-- Team Member 2 -->
            <div class="scroll-reveal glass-card p-6 card-interactive group" style="animation-delay: 0.1s;">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-accent-400 to-primary-400 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white">
                  SJ
                </div>
                <h3 class="text-lg font-bold text-text-primary">Sophie Jansen</h3>
                <p class="text-primary-600 font-semibold text-sm">CTO & Tech Lead</p>
              </div>
              <p class="text-text-secondary text-center leading-relaxed text-sm">
                Full-stack developer met expertise in Vue.js en machine learning. 
                Verantwoordelijk voor onze AI-powered vergelijkingstechnologie.
              </p>
              <div class="flex justify-center mt-3 space-x-2">
                <span class="px-2 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">Tech Lead</span>
                <span class="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">AI Expert</span>
              </div>
            </div>

            <!-- Team Member 3 -->
            <div class="scroll-reveal glass-card p-6 card-interactive group" style="animation-delay: 0.2s;">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-secondary-400 to-accent-400 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white">
                  TL
                </div>
                <h3 class="text-lg font-bold text-text-primary">Tom de Leeuw</h3>
                <p class="text-primary-600 font-semibold text-sm">Product Specialist</p>
              </div>
              <p class="text-text-secondary text-center leading-relaxed text-sm">
                Voormalig fietsenmaker en e-bike technicus. Test en evalueert elke e-bike 
                persoonlijk voor onze database en reviews.
              </p>
              <div class="flex justify-center mt-3 space-x-2">
                <span class="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">Tester</span>
                <span class="px-2 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">Expert</span>
              </div>
            </div>

            <!-- Team Member 4 -->
            <div class="scroll-reveal glass-card p-6 card-interactive group" style="animation-delay: 0.3s;">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white">
                  EM
                </div>
                <h3 class="text-lg font-bold text-text-primary">Emma Mulder</h3>
                <p class="text-primary-600 font-semibold text-sm">UX/UI Designer</p>
              </div>
              <p class="text-text-secondary text-center leading-relaxed text-sm">
                Creatieve designer met oog voor detail. Zorgt ervoor dat onze platform 
                intuïtief en visueel aantrekkelijk is voor elke gebruiker.
              </p>
              <div class="flex justify-center mt-3 space-x-2">
                <span class="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Designer</span>
                <span class="px-2 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">UX Expert</span>
              </div>
            </div>

            <!-- Team Member 5 -->
            <div class="scroll-reveal glass-card p-6 card-interactive group" style="animation-delay: 0.4s;">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-accent-400 to-secondary-400 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white">
                  RK
                </div>
                <h3 class="text-lg font-bold text-text-primary">Rick Klaassen</h3>
                <p class="text-primary-600 font-semibold text-sm">Customer Success</p>
              </div>
              <p class="text-text-secondary text-center leading-relaxed text-sm">
                Klantenservice specialist die ervoor zorgt dat elke gebruiker de perfecte 
                e-bike vindt. Altijd bereid om persoonlijk advies te geven.
              </p>
              <div class="flex justify-center mt-3 space-x-2">
                <span class="px-2 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">Support</span>
                <span class="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">Advisor</span>
              </div>
            </div>

            <!-- Team Member 6 -->
            <div class="scroll-reveal glass-card p-6 card-interactive group" style="animation-delay: 0.5s;">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white">
                  LV
                </div>
                <h3 class="text-lg font-bold text-text-primary">Lisa Visser</h3>
                <p class="text-primary-600 font-semibold text-sm">Marketing Manager</p>
              </div>
              <p class="text-text-secondary text-center leading-relaxed text-sm">
                Marketing expert die E-Bike Vergelijker bekend maakt bij duizenden 
                Nederlanders. Gespecialiseerd in duurzame mobiliteit marketing.
              </p>
              <div class="flex justify-center mt-3 space-x-2">
                <span class="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">Marketing</span>
                <span class="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Growth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values Section -->
      <section class="py-16 relative">
        <div class="container mx-auto px-6">
          <div class="scroll-reveal text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-display font-bold text-gradient mb-4">
              Onze Waarden
            </h2>
            <p class="text-lg text-text-secondary max-w-2xl mx-auto">
              De principes die ons dagelijks leiden bij het helpen van duizenden Nederlanders 
              bij het vinden van hun perfecte e-bike.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="scroll-reveal glass-card p-6 card-interactive text-center group">
              <div class="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🔍</div>
              <h3 class="text-lg font-bold mb-3 text-text-primary">Transparantie</h3>
              <p class="text-text-secondary leading-relaxed text-sm">
                Geen verborgen kosten, geen verkoopstricks. Alleen eerlijke, 
                objectieve informatie.
              </p>
            </div>

            <div class="scroll-reveal glass-card p-6 card-interactive text-center group" style="animation-delay: 0.1s;">
              <div class="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🌱</div>
              <h3 class="text-lg font-bold mb-3 text-text-primary">Duurzaamheid</h3>
              <p class="text-text-secondary leading-relaxed text-sm">
                We geloven in een groenere toekomst en promoten duurzame 
                mobiliteitsoplossingen.
              </p>
            </div>

            <div class="scroll-reveal glass-card p-6 card-interactive text-center group" style="animation-delay: 0.2s;">
              <div class="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🤝</div>
              <h3 class="text-lg font-bold mb-3 text-text-primary">Vertrouwen</h3>
              <p class="text-text-secondary leading-relaxed text-sm">
                Onze gebruikers vertrouwen ons met hun belangrijkste 
                aankoopbeslissing.
              </p>
            </div>

            <div class="scroll-reveal glass-card p-6 card-interactive text-center group" style="animation-delay: 0.3s;">
              <div class="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🚀</div>
              <h3 class="text-lg font-bold mb-3 text-text-primary">Innovatie</h3>
              <p class="text-text-secondary leading-relaxed text-sm">
                We blijven voorop lopen met de nieuwste technologieën 
                en vergelijkingstools.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-16 animated-gradient text-white relative overflow-hidden">
        <div class="parallax-layer absolute inset-0 opacity-20" data-speed="0.4">
          <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div class="container mx-auto px-6 relative z-10">
          <div class="scroll-reveal text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-display font-bold mb-4">
              Onze Impact in Cijfers
            </h2>
            <p class="text-lg font-light max-w-2xl mx-auto">
              De resultaten van onze missie om Nederland te helpen bij het vinden van de perfecte e-bike
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="scroll-reveal text-center">
              <div class="text-4xl font-bold mb-3">50K+</div>
              <div class="text-lg font-semibold mb-1">Tevreden Gebruikers</div>
              <div class="text-white/80 text-sm">En groeiend elke dag</div>
            </div>

            <div class="scroll-reveal text-center" style="animation-delay: 0.1s;">
              <div class="text-4xl font-bold mb-3">300+</div>
              <div class="text-lg font-semibold mb-1">E-Bike Modellen</div>
              <div class="text-white/80 text-sm">Uitgebreide database</div>
            </div>

            <div class="scroll-reveal text-center" style="animation-delay: 0.2s;">
              <div class="text-4xl font-bold mb-3">95%</div>
              <div class="text-lg font-semibold mb-1">Klanttevredenheid</div>
              <div class="text-white/80 text-sm">Gebaseerd op reviews</div>
            </div>

            <div class="scroll-reveal text-center" style="animation-delay: 0.3s;">
              <div class="text-4xl font-bold mb-3">24/7</div>
              <div class="text-lg font-semibold mb-1">Beschikbaar</div>
              <div class="text-white/80 text-sm">Altijd bereikbaar</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 relative">
        <div class="container mx-auto px-6">
          <div class="scroll-reveal glass-card p-8 text-center max-w-3xl mx-auto">
            <h2 class="text-3xl md:text-4xl font-display font-bold text-gradient mb-6">
              Klaar om jouw Perfecte E-Bike te Vinden?
            </h2>
            <p class="text-lg text-text-secondary mb-8 leading-relaxed">
              Sluit je aan bij duizenden tevreden gebruikers die hun droom e-bike hebben gevonden 
              met behulp van ons platform.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <RouterLink
                to="/e-bikes"
                class="btn-primary px-8 py-4 text-base"
              >
                Start E-Bike Zoeken
              </RouterLink>
              <RouterLink
                to="/contact"
                class="btn-glass px-8 py-4 text-base"
              >
                Neem Contact Op
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
    
    <!-- Enhanced AI Chatbot -->
    <EnhancedAIChatbot />
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
</style>
