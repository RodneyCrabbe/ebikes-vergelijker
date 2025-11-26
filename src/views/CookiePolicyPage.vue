<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <main class="max-w-4xl mx-auto px-4 py-12">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Cookiebeleid
          </h1>
          <p class="text-gray-600">
            Laatst bijgewerkt: {{ lastUpdated }}
          </p>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <!-- Who we are -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Wie zijn wij</h2>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-700">
                <strong>E-Bike Vergelijker</strong><br>
                Adres: [Bedrijfsadres]<br>
                KvK: [KvK nummer]<br>
                Contact e-mail DPO/Privacy: privacy@ebike-vergelijker.nl
              </p>
            </div>
          </section>

          <!-- What are cookies -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Wat zijn cookies?</h2>
            <p class="text-gray-700 leading-relaxed">
              Kleine bestanden die we op je apparaat plaatsen. Sommige zijn noodzakelijk; andere gebruiken we alleen met jouw toestemming.
            </p>
          </section>

          <!-- Cookie categories -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Welke cookies gebruiken we en waarom?</h2>
            
            <div class="space-y-6">
              <div class="border border-gray-200 rounded-lg p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Noodzakelijk</h3>
                <p class="text-gray-700 mb-4">
                  Sessies, beveiliging, cookiekeuze, winkelmandje/favorieten. (geen toestemming vereist; we informeren wél).
                </p>
                <div class="bg-blue-50 p-3 rounded">
                  <p class="text-sm text-blue-800">
                    <strong>Wettelijke grondslag:</strong> Uitvoeren van de dienst (Telecommunicatiewet) – geen toestemming nodig; wel informatie.
                  </p>
                </div>
              </div>

              <div class="border border-gray-200 rounded-lg p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Voorkeuren</h3>
                <p class="text-gray-700 mb-4">
                  Taal/locatie en UI-instellingen.
                </p>
                <div class="bg-green-50 p-3 rounded">
                  <p class="text-sm text-green-800">
                    <strong>Wettelijke grondslag:</strong> Toestemming (AVG art. 6(1)(a))
                  </p>
                </div>
              </div>

              <div class="border border-gray-200 rounded-lg p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
                <p class="text-gray-700 mb-4">
                  Geaggregeerde statistieken (bijv. pageviews, tijd op pagina).
                </p>
                <div class="bg-green-50 p-3 rounded">
                  <p class="text-sm text-green-800">
                    <strong>Wettelijke grondslag:</strong> Toestemming (AVG art. 6(1)(a))
                  </p>
                </div>
              </div>

              <div class="border border-gray-200 rounded-lg p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Marketing/Advertenties</h3>
                <p class="text-gray-700 mb-4">
                  Metingen, remarketing, social en affiliate-tracking bij doorklik naar winkels.
                </p>
                <div class="bg-green-50 p-3 rounded">
                  <p class="text-sm text-green-800">
                    <strong>Wettelijke grondslag:</strong> Toestemming (AVG art. 6(1)(a))
                  </p>
                </div>
              </div>

              <div class="border border-gray-200 rounded-lg p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Support/UX</h3>
                <p class="text-gray-700 mb-4">
                  Chat, feedback, A/B-testen/UX-metingen.
                </p>
                <div class="bg-green-50 p-3 rounded">
                  <p class="text-sm text-green-800">
                    <strong>Wettelijke grondslag:</strong> Toestemming (AVG art. 6(1)(a))
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Cookie examples table -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Voorbeelden van cookies</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categorie</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aanbieder</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retentie</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doel</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr>
                    <td class="px-4 py-3 text-sm text-gray-900">Noodzakelijk</td>
                    <td class="px-4 py-3 text-sm font-mono text-gray-900">session_id</td>
                    <td class="px-4 py-3 text-sm text-gray-900">1st party</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Sessie</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Houdt je ingelogd / mandje</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 text-sm text-gray-900">Noodzakelijk</td>
                    <td class="px-4 py-3 text-sm font-mono text-gray-900">consent_choice</td>
                    <td class="px-4 py-3 text-sm text-gray-900">1st party</td>
                    <td class="px-4 py-3 text-sm text-gray-900">6–12 mnd</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Onthoudt je cookievoorkeur</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 text-sm text-gray-900">Voorkeuren</td>
                    <td class="px-4 py-3 text-sm font-mono text-gray-900">locale</td>
                    <td class="px-4 py-3 text-sm text-gray-900">1st party</td>
                    <td class="px-4 py-3 text-sm text-gray-900">12 mnd</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Taal/land</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 text-sm text-gray-900">Analytics</td>
                    <td class="px-4 py-3 text-sm font-mono text-gray-900">_ga, _ga_*</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Google</td>
                    <td class="px-4 py-3 text-sm text-gray-900">2–24 mnd</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Statistische analyse (GA4)</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 text-sm text-gray-900">Marketing</td>
                    <td class="px-4 py-3 text-sm font-mono text-gray-900">_gcl_au</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Google Ads</td>
                    <td class="px-4 py-3 text-sm text-gray-900">3 mnd</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Advertentiemeting</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 text-sm text-gray-900">Marketing</td>
                    <td class="px-4 py-3 text-sm font-mono text-gray-900">_fbp</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Meta</td>
                    <td class="px-4 py-3 text-sm text-gray-900">3 mnd</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Remarketing</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 text-sm text-gray-900">Marketing</td>
                    <td class="px-4 py-3 text-sm font-mono text-gray-900">aw*_</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Affiliate netwerk</td>
                    <td class="px-4 py-3 text-sm text-gray-900">30–60 dgn</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Commissiemeting</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 text-sm text-gray-900">Support/UX</td>
                    <td class="px-4 py-3 text-sm font-mono text-gray-900">intercom-id-*</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Intercom</td>
                    <td class="px-4 py-3 text-sm text-gray-900">9 mnd</td>
                    <td class="px-4 py-3 text-sm text-gray-900">Klantenchat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Third parties -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Derden / data-deling</h2>
            <p class="text-gray-700 leading-relaxed">
              Bij marketing/affiliate-doeleinden delen we (persoons)gegevens met derde partijen. 
              In Instellingen tonen we per doel de categorie gegevens en het aantal derden; 
              in dit beleid vind je de actuele lijst met partijen/links naar hun policies.
            </p>
          </section>

          <!-- Withdraw consent -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Intrekken of wijzigen van toestemming</h2>
            <p class="text-gray-700 leading-relaxed">
              Je kunt je keuze op elk moment aanpassen of intrekken via 
              <button 
                @click="openSettings"
                class="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                Cookie-instellingen
              </button> 
              onderaan elke pagina. Het weigeren van cookies mag de site niet onbruikbaar maken.
            </p>
          </section>

          <!-- Retention periods -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Bewaartermijnen</h2>
            <p class="text-gray-700 leading-relaxed">
              We bewaren jouw toestemmingslog (keuze, timestamp, versie, land/taal) 12 maanden of tot je het intrekt, 
              en vragen daarna opnieuw. (Bij materiële wijzigingen vragen we eerder opnieuw.)
            </p>
          </section>
        </div>

        <!-- Actions -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div class="text-sm text-gray-600">
              <p>Je kunt je toestemming altijd wijzigen via "Cookie-instellingen" (link/icoon onderin elke pagina).</p>
            </div>
            <div class="flex gap-3">
              <button
                @click="openSettings"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Cookie-instellingen
              </button>
              <RouterLink
                to="/privacy"
                class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                Privacyverklaring
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCookieConsentStore } from '../stores/cookieConsent'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'

const cookieStore = useCookieConsentStore()

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const openSettings = () => {
  cookieStore.openSettings()
}
</script>
