<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEBikesStore } from '../stores/ebikes-simple'
import { useComparisonStore } from '../stores/comparison'
import { useFavoritesStore } from '../stores/favorites'
import { useAuthStore } from '../stores/auth'
import { eventTrackingService } from '../services/eventTrackingService'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import EnhancedAIChatbot from '../components/EnhancedAIChatbot.vue'

const route = useRoute()
const ebikeStore = useEBikesStore()
const comparisonStore = useComparisonStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const ebike = ref<any>(null)

// Interactive features
const selectedImage = ref(0)
const selectedBattery = ref('standard')
const selectedColor = ref('zwart')
const showSpecs = ref(false)
const showReviews = ref(false)
const showImageCarousel = ref(false)
const carouselImageIndex = ref(0)

// External website URLs mapping
const externalUrls = {
  'Aventon': {
    'Level.2': 'https://www.aventon.com/products/aventon-level-2-commuter-ebike',
    'Aventure.2': 'https://www.aventon.com/products/aventure-2-fat-tire-ebike'
  },
  'Batavus': {
    'Diva E-go': 'https://www.batavus.com/nl-nl/elektrische-fietsen/diva-e-go'
  },
  'CUBE': {
    'Kathmandu Hybrid Pro 625': 'https://www.cube.eu/de-en/cube-kathmandu-hybrid-pro-625-flashstone-n-black/631312'
  },
  'Cannondale': {
    'Tesoro Neo X 3': 'https://www.cannondale.com/en/bikes/electric/e-touring/tesoro-neo-x/tesoro-neo-x-3'
  },
  'Canyon': {
    'Precede:ON 7 / Precede:ON Comfort 7': 'https://www.canyon.com/en-us/electric-bikes/city-electric-bikes/precede-on/comfort/precede-on-comfort-7/3925.html'
  },
  'ENGWE': {
    'EP-2 Pro': 'https://engwe-bikes.com/products/ep-2-pro-750w-folding-electric-mountain-bike',
    'X26': 'https://engwe-bikes.com/products/x26-1000w-fat-tire-folding-electric-bike',
    'M20': 'https://engwe-bikes.com/products/m20-1000w-dual-suspension-fat-tire-electric-bike',
    'L20': 'https://engwe-bikes.com/products/l20-250w-step-thru-electric-bike'
  },
  'Fiido': {
    'M1 Pro': 'https://fiido.com/fiido-m1pro-fat-tire-electric-bike.html'
  },
  'Gazelle': {
    'Ultimate C380 HMB': 'https://www.gazellebikes.com/en-us/ultimate-c380-hmb',
    'Ultimate C8+ HMB': 'https://www.gazellebikes.com/en-us/ultimate-c8-hmb'
  },
  'Giant': {
    'Explore E+': 'https://www.giant-bicycles.com/global/showcase/explore-e-plus',
    'Explore E+ 1': 'https://www.giant-bicycles.com/gb/explore-e-1-2023'
  },
  'Knaap': {
    'AMS X': 'https://knaapbikes.com/products/ams-x',
    'RTD X': 'https://knaapbikes.com/products/rtd-x',
    'LON': 'https://knaapbikes.com/products/lon',
    'BCN': 'https://knaapbikes.com/products/bcn',
    'NYC': 'https://knaapbikes.com/products/nyc',
    'LAX': 'https://knaapbikes.com/products/lax'
  },
  'Koga': {
    'E-Nova Evo': 'https://www.koga.com/en/bikes/e-bikes/e-nova-evo-pt.htm'
  },
  'Lectric': {
    'XP 3.0': 'https://lectricebikes.com/products/xp-step-thru-3-0'
  },
  'Orbea': {
    'Vibe H30': 'https://www.orbea.com/us-en/ebikes/urban/vibe/cat/vibe-h30-2023'
  },
  'Phatfour': {
    'FLS': 'https://en.phatfour.com/products/fls-phatfour-e-bike',
    'FLB': 'https://en.phatfour.com/products/flb-phatfour-e-bike',
    'FLX': 'https://en.phatfour.com/products/flx-phatfour-e-bike'
  },
  'Rad Power Bikes': {
    'RadRunner 2': 'https://www.radpowerbikes.com/products/radrunner-2-electric-utility-bike'
  },
  'Riese & Müller': {
    'Charger4 GT Vario': 'https://www.r-m.de/en-de/bikes/charger4/charger4-gt-vario/#F00833_04030209'
  },
  'SUPER73': {
    'S2': 'https://super73.com/products/super73-s2',
    'ZX': 'https://super73.com/products/super73-zx'
  },
  'Sparta': {
    'e-Speed D11S': 'https://www.sparta.nl/elektrische-fietsen'
  },
  'Trek': {
    'Allant+ 7 Gen 2': 'https://www.trekbikes.com/us/en_US/bikes/electric-bikes/e-city-bikes/allant/allant-7-gen-2/p/41549/'
  },
  'Urban Drivestyle': {
    'UNI MK Classic': 'https://urbandrivestyle.com/products/uni-mk-classic-250w-electric-bike'
  },
  'VANMOOF': {
    'S5': 'https://www.vanmoof.com/en-US/s5'
  },
  'Trek': {
    'FX+ 1': 'https://www.trekbikes.com/us/en_US/fx-plus-one/',
    'Fuel EXe 9.7': 'https://www.trekbikes.com/us/en_US/bikes/mountain-bikes/electric-mountain-bikes/fuel-exe/',
    'Allant+ 7 Gen 2': 'https://www.trekbikes.com/us/en_US/bikes/electric-bikes/e-city-bikes/allant/allant-7-gen-2/p/41549/'
  },
  'Specialized': {
    'Turbo Vado SL 5.0 EQ': 'https://www.specialized.com/us/en/turbo-vado-sl-5-0-eq/p/154888',
    'Turbo Levo SL Comp': 'https://www.specialized.com/us/en/turbo-levo-sl-comp/p/154888'
  },
  'Cannondale': {
    'Tesoro Neo X 3': 'https://www.cannondale.com/en-us/bikes/electric/e-touring/tesoro-neo-x/tesoro-neo-x-3'
  },
  'Cowboy': {
    '4 ST': 'https://cowboy.com/products/e-bike-cowboy-4-st'
  },
  'Urban Arrow': {
    'Family': 'https://urbanarrow.com/family-bikes/family/'
  },
  'Riese & Müller': {
    'Load 75': 'https://www.r-m.de/en-us/bikes/load-75/',
    'Charger4 GT Vario': 'https://www.r-m.de/en-de/bikes/charger4/charger4-gt-vario/'
  },
  'Brompton': {
    'Electric P Line': 'https://www.brompton.com/electric-bikes/electric-p-line'
  },
  'Tern': {
    'Vektron S10': 'https://www.ternbicycles.com/us/bikes/472/vektron',
    'GSD S00': 'https://www.ternbicycles.com/us/bikes/gsd-s00'
  },
  'GoCycle': {
    'G4': 'https://www.gocycle.com/gocycle-g4/'
  },
  'Gazelle': {
    'Ultimate C380 HMB': 'https://www.gazellebikes.com/en-us/ultimate-c380-hmb'
  },
  'Giant': {
    'Trance E+ 3': 'https://www.giant-bicycles.com/us/trance-e-plus-3',
    'Explore E+ 1': 'https://www.giant-bicycles.com/gb/explore-e-1-2023'
  },
  'Rad Power Bikes': {
    'RadCity 5 Plus': 'https://www.radpowerbikes.com/products/radcity-5-plus-electric-commuter-bike'
  },
  'Aventon': {
    'Soltera 2': 'https://www.aventon.com/products/soltera-2'
  },
  'Cube': {
    'Stereo Hybrid 140 HPC SL 750': 'https://www.cube.eu/stereo-hybrid-140-hpc-sl-750',
    'Longtail Sport Hybrid 725': 'https://www.cube.eu/longtail-sport-hybrid-725'
  },
  'Kalkhoff': {
    'Endeavour 7.B Move': 'https://www.kalkhoff-bikes.com/en/bikes/e-bikes/trekking/endeavour-7-b-move'
  },
  'Batavus': {
    'Diva E-go': 'https://www.batavus.com/nl-nl/elektrische-fietsen/diva-e-go'
  },
  'Sparta': {
    'e-Speed D11S': 'https://www.sparta.nl/elektrische-fietsen'
  },
  'Koga': {
    'E-Nova Evo': 'https://www.koga.com/en/bikes/e-bikes/e-nova-evo-pt.htm'
  },
  'SUPER73': {
    'S2': 'https://super73.com/products/super73-s2',
    'ZX': 'https://super73.com/products/super73-zx'
  },
  'Urban Drivestyle': {
    'UNI MK Classic': 'https://urbandrivestyle.com/products/uni-mk-classic-250w-electric-bike'
  },
  'Phatfour': {
    'FLS': 'https://en.phatfour.com/products/fls-phatfour-e-bike',
    'FLB': 'https://en.phatfour.com/products/flb-phatfour-e-bike',
    'FLX': 'https://en.phatfour.com/products/flx-phatfour-e-bike'
  },
  'Knaap': {
    'AMS X': 'https://knaapbikes.com/products/ams-x',
    'RTD X': 'https://knaapbikes.com/products/rtd-x',
    'LON': 'https://knaapbikes.com/products/lon'
  }
}

// Get external URL for current e-bike
const getExternalUrl = computed(() => {
  if (!ebike.value) return null
  const brand = ebike.value.brand
  const model = ebike.value.model_name
  return externalUrls[brand]?.[model] || null
})

// Handle external link click
const handleExternalLinkClick = () => {
  const url = getExternalUrl.value
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
    // Track the event
    eventTrackingService.trackEvent('external_link_click', {
      ebike_id: ebike.value.id,
      brand: ebike.value.brand,
      model: ebike.value.model_name,
      url: url
    })
  }
}

// Aventon Level.2 specific data
const aventonLevel2 = ref({
  id: '550e8400-e29b-41d4-a716-446655440002',
  brand: 'Aventon',
  model_name: 'Level.2',
  version: 'Commuter e-bike (High-Step & Step-Through)',
  price: 1499,
  currency: 'USD',
  images: [
    '/src/img/Aventon/Level2-Traditional-Glacier-01.avif',
    '/src/img/Aventon/Level2-Traditional-Glacier-02.avif',
    '/src/img/Aventon/Level2-Traditional-Glacier-03.avif',
    '/src/img/Aventon/Level2-Traditional-Glacier-04.avif',
    '/src/img/Aventon/Level2-Traditional-Glacier-05.avif',
    '/src/img/Aventon/Level2-Traditional-Feature-01.avif',
    '/src/img/Aventon/Level2-Traditional-Feature-03.avif'
  ],
  colors: [
    { name: 'Glacier', value: 'glacier', available: true },
    { name: 'Clay', value: 'clay', available: true },
    { name: 'Polar', value: 'polar', available: true }
  ],
  batteries: [
    { name: 'Standaard', value: 'standard', capacity: '672 Wh', range: '97 km', price: 1499 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Natuurlijke Ondersteuning',
      description: 'Torquesensor i.p.v. cadanssensor voor soepelere, efficiëntere ondersteuning en meer bereik'
    },
    {
      icon: '🔋',
      title: 'Sterke Aandrijving',
      description: '500W naafmotor (±864W piek) voor krachtige prestaties'
    },
    {
      icon: '🛡️',
      title: 'Veilig & Comfortabel',
      description: 'Hydraulische schijfremmen (180mm) en verende vork tot 65mm'
    },
    {
      icon: '🚴‍♂️',
      title: 'Klaar voor Woon-Werk',
      description: 'Spatborden + achterdrager standaard, Aventon-app (iOS/Android)'
    },
    {
      icon: '🔧',
      title: 'Uitneembare Accu',
      description: 'Geïntegreerde & uitneembare accu (48V, 14Ah ≈ 672Wh)'
    }
  ],
  specifications: {
    general: {
      'Merk / Model': 'Aventon Level.2 (High-Step & Step-Through)',
      'Doelgroep': 'Unisex',
      'Categorie': 'Commuter/Stadsfiets',
      'Bouwjaar': '2022-2025'
    },
    motor: {
      'Motor': 'Achternaaf 500W (±864W piek)',
      'Sensor': 'Torquesensor (onderbracket)',
      'Assistentie': '5 PAS-standen + gashendel (VS)',
      'Topsnelheid (VS)': '20 mph op throttle (±32 km/u); PAS ontgrendelbaar tot 28 mph (±45 km/u)'
    },
    battery: {
      'Capaciteit': '48V 14Ah ≈ 672Wh (LG-cellen), UL 2849 compliant',
      'Actieradius': 'Tot 60 mi / 97 km (fabrieksopgave; afhankelijk van rijstijl/condities)',
      'Laadtijd': 'Snellader 48V / 3A (typisch ±4–5 uur)',
      'Uitneembaar': 'Ja, geïntegreerd in onderbuis'
    },
    brakes: {
      'Remmen': 'Hydraulische schijfremmen, 180mm rotors',
      'Vork': 'Vering tot 65mm (instelbaar)',
      'Banden': '27.5″ × 2.1 met reflecterende zijwanden'
    },
    transmission: {
      'Aandrijving': '8-speed derailleur',
      'Crank': '46T kettingblad, 170mm crank',
      'Cassette': '12–32T, 8-speed'
    },
    dimensions: {
      'Maten (High-Step)': 'Regular (5\'3″–5\'10″) / Large (5\'10″–6\'4″)',
      'Gewicht': 'Ca. 62 lb / 28,1 kg (incl. accu; accu ±3,4 kg)',
      'Toelaatbaar totaalgewicht': '300 lb / 136 kg'
    },
    electronics: {
      'Display': 'Kleur-LCD met klasse-instelling en lichtbediening; Aventon-app (iOS/Android)',
      'Verlichting': 'Voor- en achterlicht geïntegreerd (géén richtingaanwijzers)',
      'IP-rating': 'IPX4 spatwaterdicht'
    }
  },
  features: [
    'Torquesensor voor natuurlijke ondersteuning',
    '500W achternaafmotor (±864W piek)',
    'Geïntegreerde & uitneembare accu (672Wh)',
    'Hydraulische schijfremmen (180mm)',
    'Verende voorvork (65mm)',
    '8-speed derailleur',
    'Spatborden + achterdrager standaard',
    'Aventon-app connectiviteit',
    'Kleur-LCD display',
    'Geïntegreerde verlichting'
  ],
  included: [
    'Fiets',
    'Accu',
    'Lader',
    'Spatborden',
    'Achterdrager',
    'Standaard'
  ],
  accessories: [
    'Extra accu',
    'Bag voor accu',
    'Kabelslot',
    'Fietstas',
    'Waterfleshouder'
  ],
  image_url: '/src/img/Aventon/Level2-Traditional-Glacier-01.avif'
})

// Lectric XP 3.0 specific data
const lectricXP3 = ref({
  id: '550e8400-e29b-41d4-a716-446655440001',
  brand: 'Lectric',
  model_name: 'XP 3.0',
  version: 'Vouwbare fat-tyre e-bike',
  price: 1099,
  currency: 'USD',
    images: [
      '/src/img/Lectric XP 3.0/Lectric-XP-3.0-profile.jpg',
      '/src/img/Lectric XP 3.0/Lectric-XP-3.0-display.jpg',
      '/src/img/Lectric XP 3.0/Lectric-XP-3.0-handlebar-right.jpg',
      '/src/img/Lectric XP 3.0/Lectric-XP-3.0-folding-frame-mech.jpg',
      '/src/img/Lectric XP 3.0/Lectric-XP-3.0-drivetrain.jpg',
      '/src/img/Lectric XP 3.0/Lectric-XP-3.0-saddle.jpg',
      '/src/img/Lectric XP 3.0/Lectric-XP-3.0-rear-rack.jpg',
      '/src/img/Lectric XP 3.0/Lectric-XP-3.0-brake-front.jpg',
      '/src/img/Lectric XP 3.0/Lectric-XP-3.0-brake-rear.jpg',
      '/src/img/Lectric XP 3.0/Lectric-XP-3.0-headlight-1.jpg'
    ],
  colors: [
    { name: 'Zwart', value: 'zwart', available: true },
    { name: 'Wit', value: 'wit', available: true }
  ],
  batteries: [
    { name: 'Standaard', value: 'standard', capacity: '499 Wh', range: '72 km', price: 1099 },
    { name: 'Long-Range', value: 'longrange', capacity: '672 Wh', range: '105 km', price: 1199 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Krachtig & Soepel',
      description: '500W achterwielmotor (1000W piek) met 55Nm + Lectric PWR voor vloeiende ondersteuning'
    },
    {
      icon: '🛡️',
      title: 'Veilig Remmen',
      description: 'Hydraulische schijfremmen met 180mm rotors voor optimale veiligheid'
    },
    {
      icon: '🔋',
      title: 'Keuze in Bereik',
      description: '499Wh (72km) of 672Wh Long-Range (105km) afhankelijk van je behoeften'
    },
    {
      icon: '📦',
      title: 'Volledig Opvouwbaar',
      description: 'Past in kofferbak/camper; opgevouwen 94×46×71cm'
    },
    {
      icon: '🏋️',
      title: 'Sterke Drager',
      description: 'Geïntegreerde achterdrager tot 68kg; totaal 150kg payload'
    }
  ],
  specifications: {
    general: {
      'Merk': 'Lectric',
      'Model': 'XP 3.0 (High-Step & Step-Thru)',
      'Doelgroep': 'Unisex',
      'Categorie': 'Vouwfiets, fat-tyre (20″ x 3.0)',
      'Bouwjaar': '2022-2025'
    },
    motor: {
      'Motor': '500W borstelloze achterwielnaaf, 1000W piek, 55Nm',
      'Bediening': '5 PAS-standen (cadanssensor) + half-twist throttle',
      'Regeling': 'Lectric PWR (vermogen-gebaseerde PAS)',
      'Remmen': 'Hydraulische schijfremmen, 180mm, motor-cutoff'
    },
    battery: {
      'Standaard Accu': '48V 10,4Ah (≈499Wh), tot ca. 72km',
      'Long-Range Accu': '48V 14Ah (≈672Wh), tot ca. 105km',
      'Laadtijd': '4-6 uur met 2A lader',
      'Certificering': 'UL 2271 (pack)'
    },
    transmission: {
      'Versnellingen': '7-speed derailleur, 11-28T freewheel',
      'Banden': '20″ × 3.0, anti-lek (met Slime)',
      'Vering': 'Voorvork 50mm travel, verstelbaar'
    },
    dimensions: {
      'Gewicht': '28-29kg (incl. accu)',
      'Max. totaalgewicht': '150kg',
      'Achterdrager': 'Tot 68kg',
      'Gevouwen': '94×46×71cm',
      'Uitgeklapt': '170×64×119cm'
    },
    ergonomics: {
      'Rijderlengte': '1,47-1,90m',
      'Standover': '±47cm (Step-Thru lager)',
      'Stuur': 'Telescopisch; zadelpen verstelbaar'
    }
  },
  features: [
    'Volledig opvouwbaar design',
    'Fat-tyre banden voor alle terreinen',
    'Hydraulische schijfremmen',
    'Geïntegreerde verlichting',
    'Achterdrager tot 68kg',
    '7-speed derailleur',
    'LCD display met IP65 bekabeling',
    'Anti-lek banden met Slime'
  ],
  included: [
    'Fiets',
    'Accu',
    'Lader',
    'Spatborden',
    'Geïntegreerde verlichting',
    'Achterdrager gemonteerd'
  ],
  accessories: [
    'Passenger-kit/child seat',
    'Manden',
    'Voordrager',
    'Verende zadelpen'
  ],
  image_url: '/src/img/Lectric XP 3.0/Lectric-XP-3.0-profile.jpg'
})

// Rad Power Bikes RadRunner 2 specific data
const radRunner2 = ref({
  id: '550e8400-e29b-41d4-a716-446655440003',
  brand: 'Rad Power Bikes',
  model_name: 'RadRunner 2',
  version: 'Utility e-bike (step-through)',
  price: 1499,
  currency: 'EUR',
  images: [
    '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2.jpg',
    '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2-rear-rack-with-yepp-child-seat-window.jpg',
    '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2-removable-battery-pack-rear-torque-arm.jpg',
    '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2-steel-fork-headlight.jpg',
    '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2-custom-planetary-geared-hub-motor.jpg',
    '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2-front-disc-brake-180mm-rotor.jpg',
    '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2-led-control-pad-flick-bell-left-grip.jpg',
    '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2-high-rise-handlebar-ergonomic-grips.jpg',
    '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2-twist-throttle-and-on-off-switch.jpg',
    '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2-steel-derailleur-guard-rear-sprocket-16-tooth.jpg'
  ],
  colors: [
    { name: 'Zwart', value: 'zwart', available: true },
    { name: 'Wit', value: 'wit', available: true }
  ],
  batteries: [
    { name: 'EU Standaard', value: 'eu-standard', capacity: '672 Wh', range: '55-88 km', price: 1499 },
    { name: 'VS 2025', value: 'vs-2025', capacity: '624 Wh', range: '88+ km', price: 1499 }
  ],
  highlights: [
    {
      icon: '🚚',
      title: 'Cargo & Passagier Klaar',
      description: 'Geïntegreerde achterdrager tot 54 kg; totale payload 136 kg (EU) / 145 kg (VS)'
    },
    {
      icon: '🔋',
      title: 'Sterke Accu',
      description: 'EU: 48V 14Ah (672Wh), VS: 48V 13Ah (624Wh) met Safe Shield technologie'
    },
    {
      icon: '🛡️',
      title: 'Veilige Remmen',
      description: 'EU: mechanische schijfremmen 180mm, VS: hydraulische Gemma GA-950E remmen'
    },
    {
      icon: '🚴‍♀️',
      title: 'Gebruiksgemak',
      description: 'Single-speed transmissie, dubbele middenstandaard, lage instap'
    },
    {
      icon: '⚡',
      title: 'Krachtige Motor',
      description: 'EU: 250W (25 km/u), VS: 750W (32 km/u) met 60-65 Nm koppel'
    }
  ],
  specifications: {
    general: {
      'Merk/Model': 'Rad Power Bikes RadRunner 2',
      'Doelgroep': 'Unisex',
      'Categorie': 'Utility / cargo',
      'Gewicht': '29 kg (EU) / 29,5 kg (VS)',
      'Lengte': '1.742 mm'
    },
    motor: {
      'EU Motor': '250W naafmotor, 25 km/u',
      'VS Motor': '750W achternaaf, 32 km/u',
      'Koppel': '60-65 Nm (VS)',
      'Ondersteuning': '5 PAS-niveaus (EU), PAS + throttle (VS)'
    },
    battery: {
      'EU Accu': '48V 14Ah (672Wh), Samsung 35E',
      'VS Accu': '48V 13Ah (624Wh), Safe Shield',
      'Bereik EU': '55-88+ km',
      'Bereik VS': '55+ miles (88+ km)'
    },
    wheels: {
      'Banden EU': '20" × 4.0"',
      'Banden VS': '20" × 3.3" met anti-lek',
      'Vork': 'Star (geen vering)',
      'Remmen EU': 'Mechanisch 180mm',
      'Remmen VS': 'Hydraulisch Gemma GA-950E 180mm'
    },
    dimensions: {
      'Rijderlengte': '150-188 cm',
      'Payload EU': '136 kg totaal',
      'Payload VS': '145 kg totaal',
      'Achterdrager': '54 kg max'
    }
  },
  features: [
    'Geïntegreerde achterdrager tot 54 kg',
    'Single-speed transmissie',
    'Dubbele middenstandaard',
    'Geïntegreerde verlichting (EU)',
    'Spatborden standaard (EU)',
    'Anti-lek banden (VS)',
    'Reflectiestreep op banden',
    'Chainring-guard voor veiligheid'
  ],
  included: [
    'Fiets',
    'Accu',
    'Lader',
    'Spatborden (EU)',
    'Geïntegreerde verlichting (EU)',
    'Achterdrager gemonteerd',
    'Dubbele middenstandaard'
  ],
  accessories: [
    'Passenger Package',
    'Kinderzitjes',
    'Manden en rekken',
    'Voordrager',
    'Extra accu',
    'Slot en beveiliging'
  ],
  image_url: '/src/img/Rad Power Bikes - RadRunner 2/2022-rad-power-bikes-radrunner-2.jpg'
})

// Aventon Aventure.2 specific data
const aventonAventure2 = ref({
  id: '550e8400-e29b-41d4-a716-446655440004',
  brand: 'Aventon',
  model_name: 'Aventure.2',
  version: 'Fat-tire all-terrain e-bike',
  price: 1799,
  currency: 'USD',
  images: [
    '/src/img/Aventon Aventure.2/Aventure2-traditional-camo-01.avif',
    '/src/img/Aventon Aventure.2/AventureB.avif',
    '/src/img/Aventon Aventure.2/49c1de04-fdc7-433f-b352-93f0b096f104_1.avif',
    '/src/img/Aventon Aventure.2/9ecfecc2-4aa0-4cd5-9766-db345a76269d_1.avif',
    '/src/img/Aventon Aventure.2/e94e6a5a-9453-49c1-bb0b-4eb348a3acd5_1.avif'
  ],
  colors: [
    { name: 'Slate Grey', value: 'slate-grey', available: true },
    { name: 'Camouflage', value: 'camouflage', available: true },
    { name: 'Midnight Black', value: 'midnight-black', available: true },
    { name: 'Cobalt Blue', value: 'cobalt-blue', available: true }
  ],
  batteries: [
    { name: 'Standaard', value: 'standard', capacity: '720 Wh', range: '96 km', price: 1799 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Krachtige Motor',
      description: '750W (sustained) achterwielmotor met torque sensor voor natuurlijk aanvoelende ondersteuning'
    },
    {
      icon: '🔋',
      title: 'Uitstekende Actieradius',
      description: '48V 15Ah (720Wh) uitneembare accu met tot 96 km bereik'
    },
    {
      icon: '🏃‍♂️',
      title: 'Hoge Snelheid',
      description: 'Class 2 (32 km/u throttle) en ontgrendelbaar tot 45 km/u (Class 3)'
    },
    {
      icon: '🛡️',
      title: 'Professionele Remmen',
      description: 'Tektro HD-E350 hydraulische schijfremmen (180mm) en 80mm voorvork'
    },
    {
      icon: '🚴‍♀️',
      title: 'All-Terrain',
      description: '26×4.0" puncture-resistant fat tires voor alle terreinen'
    },
    {
      icon: '💡',
      title: 'Geïntegreerde Verlichting',
      description: 'Koplamp, achterlichten met remlicht en richtingaanwijzers'
    }
  ],
  specifications: {
    general: {
      'Merk/Model': 'Aventon Aventure.2',
      'Doelgroep': 'Unisex',
      'Categorie': 'Fat-tire all-terrain',
      'Gewicht': '35 kg (accu 4,8 kg)',
      'Payload': '181 kg totaal'
    },
    motor: {
      'Motor': '750W (sustained) 48V brushless rear hub',
      'Sensor': 'Torque sensor',
      'Ondersteuning': '4 standen (Eco/Touring/Sport/Turbo)',
      'Throttle': 'On-demand tot 32 km/u',
      'Topsnelheid PAS': '45 km/u (ontgrendeld)',
      'Topsnelheid Throttle': '32 km/u'
    },
    battery: {
      'Accu': '48V 15Ah (720Wh) LG-cellen',
      'Type': 'Uitneembaar en geïntegreerd',
      'Bereik': 'Tot 96 km',
      'Lader': '48V/3A, 4-5 uur laadtijd'
    },
    frame: {
      'Frame': '6061 aluminium, interne bekabeling',
      'Vork': '80mm vering met lock-out',
      'Kleuren': 'Slate Grey, Camouflage, Midnight Black, Cobalt Blue',
      'Maten': 'Regular en Large (Step-Over en Step-Through)'
    },
    wheels: {
      'Banden': '26" × 4.0" puncture-resistant fat tires',
      'Remmen': 'Tektro HD-E350 hydraulisch 180mm',
      'Aandrijving': '1×8 Shimano Altus, 48T kettingblad',
      'Cassette': '12-32T'
    },
    features: {
      'Verlichting': 'Geïntegreerde koplamp en achterlichten',
      'Accessoires': 'Spatborden en achterdrager (25kg)',
      'Display': 'Full-color LCD met app-connectiviteit',
      'Waterdichtheid': 'IPX4 spatwaterbestendig'
    }
  },
  features: [
    '750W achterwielmotor met torque sensor',
    '48V 15Ah (720Wh) uitneembare accu',
    'Class 2/3 snelheid (32/45 km/u)',
    'Tektro HD-E350 hydraulische remmen',
    '80mm verende voorvork met lock-out',
    '26×4.0" puncture-resistant fat tires',
    'Geïntegreerde verlichting met richtingaanwijzers',
    'Full-color LCD display met app-koppeling',
    'Metalen spatborden en achterdrager',
    'IPX4 spatwaterbestendig'
  ],
  included: [
    'Fiets',
    'Accu (720Wh)',
    'Lader (48V/3A)',
    'Spatborden',
    'Achterdrager',
    'Geïntegreerde verlichting',
    'Display met app-connectiviteit'
  ],
  accessories: [
    'Extra accu',
    'Kinderzitje',
    'Manden en tassen',
    'Slot en beveiliging',
    'Aventon app (iOS/Android)',
    'Onderhoudsaccessoires'
  ],
  image_url: '/src/img/Aventon Aventure.2/Aventure2-traditional-camo-01.avif'
})

// Trek Allant+ 7 Gen 2 specific data
const trekAllant7Gen2 = ref({
  id: '550e8400-e29b-41d4-a716-446655440005',
  brand: 'Trek',
  model_name: 'Allant+ 7 Gen 2',
  version: 'Premium stads/forenzen e-bike (EU 625 Wh)',
  price: 3999,
  currency: 'EUR',
  images: [
    '/src/img/Trek Allant+ 7 Gen 2/AllantPlus7Stag-24-41022-A-Primary.avif',
    '/src/img/Trek Allant+ 7 Gen 2/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL1RyZWsgZWxla3RyaXNjaGUgZmlldHNlblwvQWxsYW50IDcgMjAyM1wvVH (1).jpeg',
    '/src/img/Trek Allant+ 7 Gen 2/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL1RyZWsgZWxla3RyaXNjaGUgZmlldHNlblwvQWxsYW50IDcgMjAyM1wvVH (2).jpeg',
    '/src/img/Trek Allant+ 7 Gen 2/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL1RyZWsgZWxla3RyaXNjaGUgZmlldHNlblwvQWxsYW50IDcgMjAyM1wvVH (3).jpeg',
    '/src/img/Trek Allant+ 7 Gen 2/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL1RyZWsgZWxla3RyaXNjaGUgZmlldHNlblwvQWxsYW50IDcgMjAyM1wvVH (4).jpeg',
    '/src/img/Trek Allant+ 7 Gen 2/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL1RyZWsgZWxla3RyaXNjaGUgZmlldHNlblwvQWxsYW50IDcgMjAyM1wvVH (5).jpeg',
    '/src/img/Trek Allant+ 7 Gen 2/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL1RyZWsgZWxla3RyaXNjaGUgZmlldHNlblwvQWxsYW50IDcgMjAyM1wvVH (6).jpeg',
    '/src/img/Trek Allant+ 7 Gen 2/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL1RyZWsgZWxla3RyaXNjaGUgZmlldHNlblwvQWxsYW50IDcgMjAyM1wvVH (7).jpeg',
    '/src/img/Trek Allant+ 7 Gen 2/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL1RyZWsgZWxla3RyaXNjaGUgZmlldHNlblwvQWxsYW50IDcgMjAyM1wvVHJlay.jpeg'
  ],
  colors: [
    { name: 'High-step', value: 'high-step', available: true },
    { name: 'Midstep', value: 'midstep', available: true },
    { name: 'Lowstep', value: 'lowstep', available: true }
  ],
  batteries: [
    { name: 'Standaard', value: 'standard', capacity: '625 Wh', range: '145 km', price: 3999 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Krachtige Aandrijving',
      description: 'Bosch Performance Line CX (Smart System), 85 Nm koppel — soepel en sterk op hellingen'
    },
    {
      icon: '🔋',
      title: 'Ruime Actieradius',
      description: 'Bosch PowerTube 625 Wh geïntegreerd; tot ca. 145 km bij gunstige omstandigheden'
    },
    {
      icon: '📱',
      title: 'Connected',
      description: 'Bosch Purion 200 display (Smart System) met app-features zoals navigatie/ritregistratie via eBike Flow'
    },
    {
      icon: '🛡️',
      title: 'Comfort & Controle',
      description: 'SR Suntour XCR32 voorvork (63 mm), hydraulische schijfremmen, 27.5″ wielen met 2.4″ banden'
    },
    {
      icon: '🚴‍♀️',
      title: 'Compleet Afgemonteerd',
      description: 'Geïntegreerde LED-verlichting, MIK-bagagedrager (25 kg), spatborden, stevige standaard'
    },
    {
      icon: '🔧',
      title: 'Frame-opties',
      description: 'High-step / Midstep / Lowstep (Stagger/Lowstep) voor verschillende instaphoogtes'
    }
  ],
  specifications: {
    general: {
      'Merk/Model': 'Trek Allant+ 7 Gen 2',
      'Doelgroep': 'Unisex',
      'Categorie': 'Premium stads/forenzen e-bike',
      'Gewicht': '25,6 kg (M-maat)',
      'Payload': '136 kg totaal'
    },
    motor: {
      'Motor': 'Bosch Performance Line CX, 250 W nominaal',
      'Koppel': '85 Nm',
      'Systeem': 'Bosch Smart System',
      'Ondersteuning': 'Trapondersteuning tot 25 km/u (EU)',
      'Display': 'Bosch Purion 200 met eBike Flow-app'
    },
    battery: {
      'Accu': 'Bosch PowerTube 625 Wh',
      'Type': 'Uitneembaar, geïntegreerd',
      'Bereik': 'Tot ca. 145 km (gunstige omstandigheden)',
      'Lader': 'Bosch 4A (230 V)'
    },
    frame: {
      'Frame': 'Hydroformed aluminium, RIB (Removable Integrated Battery)',
      'Vork': 'SR Suntour XCR32, 63 mm veerweg, lock-out',
      'Maten': 'High-step / Midstep / Lowstep',
      'Bekabeling': 'Interne bekabeling, Motor Armor'
    },
    wheels: {
      'Banden': '27.5″ (TLR-velgen), max 27.5×2.40',
      'Remmen': 'Shimano MT200 hydraulisch, 180 mm rotors',
      'Aandrijving': 'Shimano CUES U6000, 10-speed (LG-drivetrain)',
      'Cassette': '11–48T, 40T kettingblad'
    },
    features: {
      'Verlichting': 'Herrmans MR9-E koplamp (±190 lm), Spanninga SOLO achterlicht',
      'Accessoires': 'MIK-bagagedrager (25 kg), spatborden, standaard',
      'Connectiviteit': 'eBike Flow-app (navigatie, tracking)',
      'Waterdichtheid': 'IPX4 spatwaterbestendig'
    }
  },
  features: [
    'Bosch Performance Line CX middenmotor (85 Nm)',
    'Bosch PowerTube 625 Wh geïntegreerde accu',
    'Bosch Purion 200 display met Smart System',
    'eBike Flow-app connectiviteit en navigatie',
    'SR Suntour XCR32 voorvork (63 mm)',
    'Shimano MT200 hydraulische schijfremmen',
    'Shimano CUES U6000 10-speed aandrijving',
    '27.5″ wielen met 2.4″ banden',
    'Geïntegreerde LED-verlichting',
    'MIK-bagagedrager (25 kg)',
    'Spatborden en standaard inbegrepen',
    'Frame-opties: High-step/Midstep/Lowstep'
  ],
  included: [
    'Fiets',
    'Bosch PowerTube 625 Wh accu',
    'Bosch 4A lader (230 V)',
    'Bosch Purion 200 display',
    'Herrmans MR9-E koplamp',
    'Spanninga SOLO achterlicht',
    'MIK-bagagedrager',
    'Spatborden',
    'Standaard',
    'eBike Flow-app toegang'
  ],
  accessories: [
    'Extra accu',
    'Kinderzitje',
    'Manden en tassen',
    'Slot en beveiliging',
    'eBike Flow premium features',
    'Onderhoudsaccessoires'
  ],
  image_url: '/src/img/Trek Allant+ 7 Gen 2/AllantPlus7Stag-24-41022-A-Primary.avif'
})

// Giant Explore E+ specific data
const giantExploreEPlus = ref({
  id: '550e8400-e29b-41d4-a716-446655440006',
  brand: 'Giant',
  model_name: 'Explore E+',
  version: 'Trekking/avontuur e-bike (625–800 Wh, lange actieradius)',
  price: 3399,
  currency: 'EUR',
  images: [
    '/src/img/Giant Explore E+/GIANT_Explore_E_System-8744-2048x1365.jpg.webp',
    '/src/img/Giant Explore E+/GIANT_Explore_E_System-8794-2048x1366.jpg.webp',
    '/src/img/Giant Explore E+/GIANT_Explore_E_System-8803-2048x1365.jpg.webp',
    '/src/img/Giant Explore E+/GIANT_Explore_E_System-8810-2048x1365.jpg.webp',
    '/src/img/Giant Explore E+/GIANT_Explore_E_System-8811-810x540.jpg.webp',
    '/src/img/Giant Explore E+/GIANT_Explore_E_System-8813-810x540.jpg.webp',
    '/src/img/Giant Explore E+/GIANT_Explore_E_System-8814-810x540.jpg.webp',
    '/src/img/Giant Explore E+/GIANT_Explore_E_System-8815-2048x1365.jpg.webp',
    '/src/img/Giant Explore E+/GIANT_Explore_E_System-8829-2048x1365.jpg.webp',
    '/src/img/Giant Explore E+/GIANT_Explore_E_System-8846-2048x1365.jpg.webp'
  ],
  colors: [
    { name: 'GTS (High-step)', value: 'gts-high-step', available: true },
    { name: 'STA (Step-through)', value: 'sta-step-through', available: true }
  ],
  batteries: [
    { name: 'Standaard', value: 'standard', capacity: '625 Wh', range: '70-120 km', price: 3399 },
    { name: 'Upgrade', value: 'upgrade', capacity: '800 Wh', range: '90-150 km', price: 3799 },
    { name: 'Met Extender', value: 'extender', capacity: '1050 Wh', range: '120-200 km', price: 4299 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Kracht & Souplesse',
      description: 'SyncDrive Sport2 (±70–75 Nm) of Pro(2) (tot 85 Nm) met ondersteuning tot 400%; ideaal voor klimmen en lange dagen'
    },
    {
      icon: '🔋',
      title: 'Grote Actieradius',
      description: '625 Wh standaard, 800 Wh upgrade mogelijk; veel modellen compatibel met 250 Wh extender (GTS/diamond)'
    },
    {
      icon: '📱',
      title: 'Slimme Bediening',
      description: 'RideControl Dash (kleur-LCD, 2-in-1) of RideDash EVO met app-connectiviteit (ANT+, navigatie/ritgegevens)'
    },
    {
      icon: '🚴‍♀️',
      title: 'Compleet Afgemonteerd',
      description: 'Spatborden, bagagedrager, verlichting en standaard af-fabriek bij de meeste trims'
    },
    {
      icon: '🛡️',
      title: 'EU-pedelec',
      description: 'Ondersteuning tot 25 km/u, 250 W nominaal (weglegaal in NL/EU)'
    },
    {
      icon: '🔧',
      title: 'Frame-opties',
      description: 'GTS (high-step) voor maximale stijfheid & extender-optie; STA (step-through) voor lage instap/comfort'
    }
  ],
  specifications: {
    general: {
      'Merk/Model': 'Giant Explore E+',
      'Doelgroep': 'Unisex',
      'Categorie': 'Trekking/avontuur e-bike',
      'Gewicht': 'Variërend per maat/trim',
      'Payload': 'Maximaal toelaatbaar gewicht per specificatie'
    },
    motor: {
      'Motor': 'SyncDrive Sport2 (Yamaha, ~70–75 Nm) of SyncDrive Pro(2) (~85 Nm)',
      'Koppel': '70–85 Nm (afhankelijk van trim)',
      'Ondersteuning': 'Tot 400% ondersteuning',
      'Systeem': 'Yamaha SyncDrive',
      'Display': 'RideControl Dash kleurdisplay of RideDash EVO 2.0'
    },
    battery: {
      'Accu': 'EnergyPak Smart 625 Wh (standaard)',
      'Upgrade': 'EnergyPak Smart 800 Wh (IPX6)',
      'Extender': 'EnergyPak Plus 250 Wh (GTS/diamond frames)',
      'Type': 'Uitneembaar, in onderbuis',
      'Bereik': '70–150 km (afhankelijk van capaciteit en condities)'
    },
    frame: {
      'Frame': 'GTS (diamond/high-step) en STA (step-through/low-step)',
      'Vork': '63–100 mm vering (Suntour NEX/XCM, trim-afhankelijk)',
      'Materiaal': 'Aluminium',
      'Bekabeling': 'Interne bekabeling'
    },
    wheels: {
      'Banden': '700C x ~45 mm (Crosscut Gravel 2 e.d., TLR)',
      'Remmen': 'Hydraulische schijfremmen',
      'Aandrijving': 'Shimano 9–10-speed (Alivio/Deore LinkGlide)',
      'Velgen': 'TLR (Tubeless Ready)'
    },
    features: {
      'Verlichting': 'AXA/integraal verlichting',
      'Accessoires': 'Spatborden, achterdrager, standaard',
      'Connectiviteit': 'ANT+ app-connectiviteit',
      'Waterdichtheid': 'IPX6 op 800 Wh accu'
    }
  },
  features: [
    'SyncDrive Sport2 of Pro(2) middenmotor (70–85 Nm)',
    'EnergyPak Smart 625 Wh standaard accu',
    'Upgrade naar 800 Wh mogelijk',
    '250 Wh range extender compatibel (GTS frames)',
    'RideControl Dash kleurdisplay',
    'RideDash EVO 2.0 met app-connectiviteit',
    '63–100 mm verende voorvork',
    'Shimano 9–10-speed aandrijving',
    'Hydraulische schijfremmen',
    '700C wielen met gravel banden',
    'Compleet afgemonteerd (verlichting, spatborden, bagagedrager)',
    'GTS en STA frame-opties'
  ],
  included: [
    'Fiets',
    'EnergyPak Smart 625 Wh accu',
    'Lader',
    'RideControl Dash display',
    'AXA verlichting',
    'Spatborden',
    'Achterdrager',
    'Standaard',
    'ANT+ app-connectiviteit'
  ],
  accessories: [
    'EnergyPak Smart 800 Wh upgrade',
    'EnergyPak Plus 250 Wh extender',
    'Kinderzitje',
    'Manden en tassen',
    'Slot en beveiliging',
    'Onderhoudsaccessoires',
    'Extra verlichting'
  ],
  image_url: '/src/img/Giant Explore E+/GIANT_Explore_E_System-8744-2048x1365.jpg.webp'
})

// Cannondale Tesoro Neo X 3 specific data
const cannondaleTesoroNeoX3 = ref({
  id: '550e8400-e29b-41d4-a716-446655440007',
  brand: 'Cannondale',
  model_name: 'Tesoro Neo X 3',
  version: 'Trekking/forenzen e-bike (500 Wh, Class 3 in VS)',
  price: 2799,
  currency: 'EUR',
  images: [
    '/src/img/Cannondale Tesoro Neo X 3/2455dd8c-f753-4fec-99a7-0e5b83f3f0a8.avif',
    '/src/img/Cannondale Tesoro Neo X 3/8972e384-1068-4567-b993-dfd15d1318d3.avif',
    '/src/img/Cannondale Tesoro Neo X 3/2455dd8c-f753-4fec-99a7-0e5b83f3f0a8.jpeg',
    '/src/img/Cannondale Tesoro Neo X 3/3368aa04-54c2-47e7-ab46-973525b1d29d.jpeg',
    '/src/img/Cannondale Tesoro Neo X 3/37d207d3-ba22-49f1-89c7-f86a29d6a473.jpeg',
    '/src/img/Cannondale Tesoro Neo X 3/58085e37-b8ae-48f6-ab72-178f779e069a.jpeg',
    '/src/img/Cannondale Tesoro Neo X 3/8972e384-1068-4567-b993-dfd15d1318d3.jpeg',
    '/src/img/Cannondale Tesoro Neo X 3/961e15a3-53c3-4fd4-acd0-563fcd0b5442.jpeg',
    '/src/img/Cannondale Tesoro Neo X 3/ab1aeb55-ed9b-4def-93fa-294f6ff62a56.jpeg',
    '/src/img/Cannondale Tesoro Neo X 3/bc6584b8-6214-4b9c-8a77-115b0576ce8a.jpeg',
    '/src/img/Cannondale Tesoro Neo X 3/e90e0ca5-03e6-4941-a31c-e407111b9f36.jpeg'
  ],
  colors: [
    { name: 'High-Step', value: 'high-step', available: true },
    { name: 'Remixte (Step-Thru)', value: 'remixte-step-thru', available: true }
  ],
  batteries: [
    { name: 'Standaard', value: 'standard', capacity: '500 Wh', range: '113-136 km', price: 2799 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Krachtige Aandrijving',
      description: 'Bosch Performance Line Sport (Smart System), 65 Nm, Class 3 (28 mph/45 km/u) in de VS'
    },
    {
      icon: '🔋',
      title: 'Accu & Bereik',
      description: 'Bosch PowerTube 500 Wh; tot ~70–85 mi (113–136 km) afhankelijk van gebruik'
    },
    {
      icon: '🚴‍♀️',
      title: 'Volledig Uitgerust',
      description: 'Spatborden, Tubus-bagagedrager (25 kg, Racktime-compatibel), geïntegreerde verlichting, standaard'
    },
    {
      icon: '🛡️',
      title: 'Comfort & Controle',
      description: 'Verende vork 63 mm (SR Suntour Mobie A32) of 100 mm (XCM) afhankelijk van uitvoering'
    },
    {
      icon: '🔧',
      title: 'Frame-opties',
      description: 'High-Step én Remixte/Step-Thru frameopties voor verschillende instaphoogtes'
    },
    {
      icon: '💡',
      title: 'Geïntegreerde Verlichting',
      description: 'AXA Compactline 35E koplamp en AXA Blueline achterlicht voor veilig rijden'
    }
  ],
  specifications: {
    general: {
      'Merk/Model': 'Cannondale Tesoro Neo X 3',
      'Doelgroep': 'Unisex',
      'Categorie': 'Trekking/forenzen e-bike',
      'Gewicht': '25,1 kg (incl. accu)',
      'Payload': 'Maximaal toelaatbaar gewicht per specificatie'
    },
    motor: {
      'Motor': 'Bosch Performance Line Sport (Smart System)',
      'Koppel': '65 Nm',
      'Snelheid': 'Class 3 (VS: 28 mph/45 km/u) / EU: 25 km/u',
      'Ondersteuning': 'Trapondersteuning tot 25 km/u (EU) / 45 km/u (VS)',
      'Display': 'Bosch Purion of Intuvia + LED remote'
    },
    battery: {
      'Accu': 'Bosch PowerTube 500 Wh',
      'Type': 'Uitneembaar, in downtube',
      'Bereik': 'Tot 70–85 mi (113–136 km)',
      'Lader': 'Bosch 2A of 4A (modeljaar-afhankelijk)'
    },
    frame: {
      'Frame': 'SmartForm C2 Aluminium',
      'Vork': 'SR Suntour Mobie A32 (63 mm) of XCM (100 mm)',
      'Maten': 'High-Step en Remixte/Step-Thru',
      'Bekabeling': 'Interne bekabeling, motorbescherming'
    },
    wheels: {
      'Banden': 'S: 27.5×2.20 / M-XL: 29×2.20 (Continental Race King)',
      'Remmen': 'Hydraulische schijfremmen (Riderever 2-zuiger)',
      'Rotors': '180/180 mm',
      'Aandrijving': 'microSHIFT Marvo 9-speed, 11–36T cassette'
    },
    features: {
      'Verlichting': 'AXA Compactline 35E koplamp, AXA Blueline achterlicht',
      'Accessoires': 'Tubus bagagedrager (25 kg), spatborden, standaard',
      'Connectiviteit': 'Bosch Smart System',
      'Waterdichtheid': 'IPX4 spatwaterbestendig'
    }
  },
  features: [
    'Bosch Performance Line Sport middenmotor (65 Nm)',
    'Bosch PowerTube 500 Wh accu',
    'Bosch Smart System technologie',
    'Class 3 snelheid (VS: 45 km/u) / EU: 25 km/u',
    'SR Suntour Mobie A32 of XCM voorvork',
    'Hydraulische schijfremmen (Riderever)',
    'microSHIFT Marvo 9-speed aandrijving',
    '27.5″/29″ wielen met Continental Race King banden',
    'Geïntegreerde AXA verlichting',
    'Tubus bagagedrager (25 kg)',
    'Spatborden en standaard inbegrepen',
    'High-Step en Remixte frame-opties'
  ],
  included: [
    'Fiets',
    'Bosch PowerTube 500 Wh accu',
    'Bosch lader (2A of 4A)',
    'Bosch Purion of Intuvia display',
    'AXA Compactline 35E koplamp',
    'AXA Blueline achterlicht',
    'Tubus bagagedrager',
    'Spatborden',
    'Standaard',
    'Bosch Smart System connectiviteit'
  ],
  accessories: [
    'Extra accu',
    'Kinderzitje',
    'Manden en tassen',
    'Slot en beveiliging',
    'Onderhoudsaccessoires',
    'Extra verlichting'
  ],
  image_url: '/src/img/Cannondale Tesoro Neo X 3/2455dd8c-f753-4fec-99a7-0e5b83f3f0a8.avif'
})

// CUBE Kathmandu Hybrid Pro 625 specific data
const cubeKathmanduHybridPro625 = ref({
  id: '550e8400-e29b-41d4-a716-446655440008',
  brand: 'CUBE',
  model_name: 'Kathmandu Hybrid Pro 625',
  version: 'Trekking/forenzen e-bike (EU, 625 Wh)',
  price: 3499,
  currency: 'EUR',
  images: [
    '/src/img/CUBE Kathmandu Hybrid Pro 625/812200_D_00.jpg',
    '/src/img/CUBE Kathmandu Hybrid Pro 625/812200_D_01.jpg',
    '/src/img/CUBE Kathmandu Hybrid Pro 625/812200_D_02.jpg',
    '/src/img/CUBE Kathmandu Hybrid Pro 625/812200_D_03.jpg',
    '/src/img/CUBE Kathmandu Hybrid Pro 625/812200_D_04.jpg',
    '/src/img/CUBE Kathmandu Hybrid Pro 625/812200_P_00.jpg',
    '/src/img/CUBE Kathmandu Hybrid Pro 625/812200_S_00.jpg'
  ],
  colors: [
    { name: 'Diamant (High-step)', value: 'diamant-high-step', available: true },
    { name: 'Wave (Step-through)', value: 'wave-step-through', available: true }
  ],
  batteries: [
    { name: 'Standaard', value: 'standard', capacity: '625 Wh', range: 'Tot 130 km', price: 3499 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Krachtige Middenmotor',
      description: 'Bosch Performance Line CX Gen4 (Smart System), 85 Nm koppel voor sterke ondersteuning'
    },
    {
      icon: '🔋',
      title: 'Energie & Bereik',
      description: 'Bosch PowerTube 625 Wh; in praktijk ruim trektoerig bereik (conditie-afhankelijk), tot ca. 130 km bij gunstige omstandigheden'
    },
    {
      icon: '🛡️',
      title: 'Comfort & Controle',
      description: 'Luchtgeveerde X-Fusion MIG32 (100 mm, lock-out), Shimano hydraulische schijfremmen (180/180 mm), Schwalbe Big Ben 55-622'
    },
    {
      icon: '🚴‍♀️',
      title: 'Volledig Afgemonteerd',
      description: 'ACID Integrated Carrier 3.0 (RILink), spatborden, CUBE Shiny 50 Lux koplamp en ACID PRO-E achterlicht'
    },
    {
      icon: '📱',
      title: 'Connect & Bediening',
      description: 'Bosch Kiox 300 display + LED Remote (Smart System) voor geavanceerde bediening en connectiviteit'
    },
    {
      icon: '🔧',
      title: 'Frame-opties',
      description: 'Diamant (high-step) en Wave/Easy Entry (step-through) voor verschillende instaphoogtes'
    }
  ],
  specifications: {
    general: {
      'Merk/Model': 'CUBE Kathmandu Hybrid Pro 625',
      'Doelgroep': 'Unisex',
      'Categorie': 'Trekking/forenzen e-bike',
      'Gewicht': '26,2 kg (maat/uitvoering afhankelijk)',
      'Payload': 'Maximaal toelaatbaar gewicht per specificatie'
    },
    motor: {
      'Motor': 'Bosch Performance Line CX (Gen4)',
      'Koppel': '85 Nm',
      'Vermogen': '250 W nominaal',
      'Systeem': 'Bosch Smart System',
      'Ondersteuning': 'Tot 25 km/u (EU-pedelec)',
      'Display': 'Bosch Kiox 300 + LED Remote'
    },
    battery: {
      'Accu': 'Bosch PowerTube 625 Wh',
      'Type': 'Uitneembaar, geïntegreerd',
      'Bereik': 'Tot ca. 130 km (gunstige omstandigheden)',
      'Lader': 'Bosch 4A'
    },
    frame: {
      'Frame': 'Aluminium Superlite, Integrated Carrier 3.0',
      'Vork': 'X-Fusion MIG32 Air, 100 mm, tapered, 15×110, lock-out',
      'Bekabeling': 'Geïntegreerde bekabeling',
      'Maten': 'Diamant en Wave/Easy Entry'
    },
    wheels: {
      'Banden': '28″ (CUBE EX23 TLR), Schwalbe Big Ben 55-622',
      'Remmen': 'Shimano BR-MT200 hydraulisch, 180/180 mm',
      'Aandrijving': 'Shimano Deore 1×11, 11–51T cassette',
      'Crankset': 'ACID E-Crank 40T'
    },
    features: {
      'Verlichting': 'CUBE Shiny 50 Lux koplamp (12V DC), ACID Mudguard Rear Light PRO-E (12V DC)',
      'Accessoires': 'ACID Integrated Carrier 3.0 (RILink), spatborden, standaard',
      'Connectiviteit': 'Bosch Smart System',
      'Waterdichtheid': 'IPX4 spatwaterbestendig'
    }
  },
  features: [
    'Bosch Performance Line CX Gen4 middenmotor (85 Nm)',
    'Bosch PowerTube 625 Wh accu',
    'Bosch Smart System technologie',
    'Bosch Kiox 300 display + LED Remote',
    'X-Fusion MIG32 Air voorvork (100 mm)',
    'Shimano Deore 1×11 aandrijving',
    'Shimano BR-MT200 hydraulische remmen',
    '28″ wielen met Schwalbe Big Ben banden',
    'ACID Integrated Carrier 3.0 bagagedrager',
    'CUBE Shiny 50 Lux koplamp',
    'ACID PRO-E achterlicht',
    'Diamant en Wave frame-opties'
  ],
  included: [
    'Fiets',
    'Bosch PowerTube 625 Wh accu',
    'Bosch 4A lader',
    'Bosch Kiox 300 display',
    'LED Remote',
    'CUBE Shiny 50 Lux koplamp',
    'ACID PRO-E achterlicht',
    'ACID Integrated Carrier 3.0',
    'Spatborden',
    'Standaard',
    'Bosch Smart System connectiviteit'
  ],
  accessories: [
    'Extra accu',
    'Kinderzitje',
    'Manden en tassen',
    'Slot en beveiliging',
    'Onderhoudsaccessoires',
    'Extra verlichting'
  ],
  image_url: '/src/img/CUBE Kathmandu Hybrid Pro 625/812200_D_00.jpg'
})

// Gazelle Ultimate C380 HMB specific data
const gazelleUltimateC380HMB = ref({
  id: '550e8400-e29b-41d4-a716-446655440009',
  brand: 'Gazelle',
  model_name: 'Ultimate C380 HMB',
  version: 'Premium stads/trekking e-bike (500/625 Wh, riemaandrijving)',
  price: 4499,
  currency: 'EUR',
  images: [
    '/src/img/Gazelle Ultimate C380 HMB/20230372A00_Gazelle_Ultimate_C380_HMB_500Wh.avif',
    '/src/img/Gazelle Ultimate C380 HMB/20230372A00_Gazelle_Ultimate_C380_HMB_500Wh (1).avif',
    '/src/img/Gazelle Ultimate C380 HMB/20230372A01_Gazelle_Ultimate_C380_HMB_500Wh.avif',
    '/src/img/Gazelle Ultimate C380 HMB/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL2dhemVsbGUtZWxla3RyaXNjaGUtZmlldHNlblwvVWx0aW1hdGUgQ (1).jpeg',
    '/src/img/Gazelle Ultimate C380 HMB/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL2dhemVsbGUtZWxla3RyaXNjaGUtZmlldHNlblwvVWx0aW1hdGUgQ (2).jpeg',
    '/src/img/Gazelle Ultimate C380 HMB/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL2dhemVsbGUtZWxla3RyaXNjaGUtZmlldHNlblwvVWx0aW1hdGUgQ (3).jpeg',
    '/src/img/Gazelle Ultimate C380 HMB/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL2dhemVsbGUtZWxla3RyaXNjaGUtZmlldHNlblwvVWx0aW1hdGUgQ (4).jpeg',
    '/src/img/Gazelle Ultimate C380 HMB/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL2dhemVsbGUtZWxla3RyaXNjaGUtZmlldHNlblwvVWx0aW1hdGUgQzM4M.jpeg',
    '/src/img/Gazelle Ultimate C380 HMB/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL2dhemVsbGUtZWxla3RyaXNjaGUtZmlldHNlblwvVWx0aW1hdGUgQzM4MC.png'
  ],
  colors: [
    { name: 'Mallard Blue Gloss', value: 'mallard-blue-gloss', available: true }
  ],
  batteries: [
    { name: '500 Wh', value: '500wh', capacity: '500 Wh', range: '130 km (Eco)', price: 4499 },
    { name: '625 Wh', value: '625wh', capacity: '625 Wh', range: '155 km (Eco)', price: 4799 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Sterke & Natuurlijke Ondersteuning',
      description: 'Bosch Performance Line (Smart System), 75 Nm; EU-pedelec tot 25 km/u voor krachtige en natuurlijke ondersteuning'
    },
    {
      icon: '🔋',
      title: 'Groot Bereik & Twee Accu-opties',
      description: '500 Wh of 625 Wh geïntegreerde Bosch Intube-accu; Eco tot 130/155 km, Tour 75/95 km, Auto 60/70 km, Turbo 50/65 km'
    },
    {
      icon: '🔧',
      title: 'Onderhoudsarm & Stil',
      description: 'enviolo Trekking naaf (traploos) + Gates riemaandrijving voor onderhoudsarme en stille aandrijving'
    },
    {
      icon: '🛡️',
      title: 'Veilig Remmen',
      description: 'Magura MT-C4 hydraulische schijfremmen (180 mm vóór / 160 mm achter) voor optimale remkracht'
    },
    {
      icon: '🚴‍♀️',
      title: 'Comfort & Stabiliteit',
      description: 'SR Suntour NVX30 geveerde voorvork, Schwalbe Energizer Plus 50-622 banden, aluminium frame met geïntegreerde accu/kabels'
    },
    {
      icon: '💡',
      title: 'Volledig Uitgerust',
      description: 'Herrmans MR8 koplamp (60 lux), Spanninga Commuter Glow achterlicht, MIK-compatibele drager, spatborden en standaard'
    }
  ],
  specifications: {
    general: {
      'Merk/Model': 'Gazelle Ultimate C380 HMB',
      'Doelgroep': 'Unisex',
      'Categorie': 'Premium stads/trekking e-bike',
      'Gewicht': '25,6 kg (excl. accu)',
      'Payload': '130 kg totaal (fiets + berijder + bagage)'
    },
    motor: {
      'Motor': 'Bosch Performance Line middenmotor',
      'Koppel': '75 Nm',
      'Ondersteuning': 'Tot 25 km/u (EU-pedelec)',
      'Systeem': 'Bosch Smart System',
      'Display': 'Bosch Kiox 300 + walk-assist',
      'Connectiviteit': 'Flow-app connectiviteit'
    },
    battery: {
      'Accu': 'Bosch Intube 500 Wh of 625 Wh (36 V)',
      'Type': 'Uitneembaar/vergrendeld, geïntegreerd',
      'Bereik 500Wh': 'Eco 130 km / Tour 75 km / Auto 60 km / Turbo 50 km',
      'Bereik 625Wh': 'Eco 155 km / Tour 95 km / Auto 70 km / Turbo 65 km',
      'Lader': 'Bosch 4A; 4:30 u (500 Wh) / 5:24 u (625 Wh)'
    },
    frame: {
      'Frame': 'Aluminium met geïntegreerde accu/kabels',
      'Vork': 'SR Suntour NVX30 (vergrendelbaar)',
      'Maten': '46 / 49 / 53 / 57 / 61 / 65 cm',
      'Vormen': 'High-Step en Low-Step'
    },
    wheels: {
      'Banden': '28″ wielen; Schwalbe Energizer Plus 50-622',
      'Remmen': 'Magura MT-C4 hydraulisch, 180/160 mm rotors',
      'Aandrijving': 'enviolo Trekking (traploos)',
      'Riem': 'Gates riem (CDX)'
    },
    features: {
      'Verlichting': 'Herrmans MR8 koplamp (60 lux), Spanninga Commuter Glow achterlicht',
      'Accessoires': 'Achterdrager MIK-compatibel, spatborden, standaard',
      'Connectiviteit': 'Bosch Smart System, Flow-app',
      'Waterdichtheid': 'IPX4 spatwaterbestendig'
    }
  },
  features: [
    'Bosch Performance Line middenmotor (75 Nm)',
    'Bosch Intube 500 Wh of 625 Wh accu',
    'Bosch Smart System technologie',
    'Bosch Kiox 300 display + walk-assist',
    'enviolo Trekking traploos schakelsysteem',
    'Gates CDX riemaandrijving',
    'Magura MT-C4 hydraulische remmen',
    'SR Suntour NVX30 geveerde voorvork',
    '28″ wielen met Schwalbe Energizer Plus banden',
    'Herrmans MR8 koplamp (60 lux)',
    'Spanninga Commuter Glow achterlicht',
    'MIK-compatibele achterdrager'
  ],
  included: [
    'Fiets',
    'Bosch Intube 500 Wh of 625 Wh accu',
    'Bosch 4A lader',
    'Bosch Kiox 300 display',
    'Herrmans MR8 koplamp',
    'Spanninga Commuter Glow achterlicht',
    'MIK-compatibele achterdrager',
    'Spatborden',
    'Standaard',
    'Bosch Smart System connectiviteit'
  ],
  accessories: [
    'Extra accu',
    'Kinderzitje',
    'Manden en tassen',
    'Slot en beveiliging',
    'Onderhoudsaccessoires',
    'Extra verlichting'
  ],
  image_url: '/src/img/Gazelle Ultimate C380 HMB/20230372A00_Gazelle_Ultimate_C380_HMB_500Wh.avif'
})

// Riese & Müller Charger4 GT Vario specific data
const rieseMullerCharger4GTVario = ref({
  id: '550e8400-e29b-41d4-a716-446655440010',
  brand: 'Riese & Müller',
  model_name: 'Charger4 GT Vario',
  version: 'Premium trekking/forenzen e-bike (750 Wh, riem + Enviolo)',
  price: 5849,
  currency: 'EUR',
  images: [
    '/src/img/Riese & Müller Charger4 GT/riese_und_muller_charger4_gt_vario_black_matt_2_.jpg',
    '/src/img/Riese & Müller Charger4 GT/riese_und_muller_charger4_gt_vario_petrol_matt_2_.jpg',
    '/src/img/Riese & Müller Charger4 GT/21_hlf_gefederte_sattelstuetze_cane-creek_0400_4.jpg',
    '/src/img/Riese & Müller Charger4 GT/21_hlf_supernova_e2_5271_4.jpg',
    '/src/img/Riese & Müller Charger4 GT/22_hlf_cha4_cockpit_kiox300_0750_1600x1067_4.jpg',
    '/src/img/Riese & Müller Charger4 GT/22_hlf_cha4_gepaecktraeger_0765_4.jpg',
    '/src/img/Riese & Müller Charger4 GT/22_hlf_cha4_rahmendesign_batterie_neu_4.jpg'
  ],
  colors: [
    { name: 'Black Matt', value: 'black-matt', available: true },
    { name: 'Petrol Matt', value: 'petrol-matt', available: true }
  ],
  batteries: [
    { name: '750 Wh', value: '750wh', capacity: '750 Wh', range: '70-135 km', price: 5849 },
    { name: '750 Wh + PowerMore', value: '750wh-plus', capacity: '1000 Wh', range: '120-185 km', price: 6499 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Kracht & Souplesse',
      description: 'Bosch Performance Line CX (Smart System) met 750 Wh voor lange tochten; optioneel PowerMore 250 range-extender'
    },
    {
      icon: '🔧',
      title: 'Onderhoudsarm',
      description: 'Enviolo Trekking traploos + Gates CDX riem voor onderhoudsarme en stille aandrijving'
    },
    {
      icon: '🛡️',
      title: 'Comfort & Controle',
      description: 'Mobie 34 100 mm vork, verende zadelpen (Thudbuster ST) en Magura MT4/MT5 schijfremmen'
    },
    {
      icon: '💡',
      title: 'Verlichting & Laden',
      description: 'Supernova mini 2 Pro voor, AXA Juno achter; MIK-drager (27 kg), kinderzitje/aanhanger compatibel'
    },
    {
      icon: '🔋',
      title: 'Grote Actieradius',
      description: 'Tot ~130 miles (~209 km) onder ideale omstandigheden; gebruik de Bosch Range Calculator voor persoonlijke schatting'
    },
    {
      icon: '🚴‍♀️',
      title: 'Premium Kwaliteit',
      description: 'Hoogwaardige trekking/stads e-bike met premium componenten en uitstekende afwerking'
    }
  ],
  specifications: {
    general: {
      'Merk/Model': 'Riese & Müller Charger4 GT Vario',
      'Doelgroep': 'Unisex',
      'Categorie': 'Premium trekking/forenzen e-bike',
      'Gewicht': '30,1–30,5 kg (maat afhankelijk)',
      'Payload': '160 kg totaal (max. berijder 125 kg)'
    },
    motor: {
      'Motor': 'Bosch Performance Line CX',
      'Koppel': '85 Nm',
      'Vermogen': '250 W nominaal',
      'Systeem': 'Bosch Smart System',
      'Ondersteuning': 'EU 25 km/u (pedelec); HS-uitvoering 45 km/u',
      'Display': 'Intuvia 100 standaard; Kiox 300 optioneel'
    },
    battery: {
      'Accu': 'PowerTube 750 Wh (verticaal, uitneembaar)',
      'Extender': 'PowerMore 250 Wh (flesformaat) optioneel',
      'Bereik': '70–135 km typisch; theoretisch tot ~209 km',
      'Lader': 'Bosch 4A (afhankelijk van configuratie)'
    },
    frame: {
      'Frame': 'Charger4 (high-step) in 46/49/53/56 cm',
      'Vork': 'SR Suntour Mobie 34, 100 mm',
      'Wielmaat': '27,5″',
      'Banden': 'Schwalbe Super Moto-X 62-584 of Johnny Watts 365 60-584'
    },
    wheels: {
      'Banden': 'Schwalbe Super Moto-X 62-584 (of Johnny Watts 365 60-584)',
      'Remmen': 'Magura MT4/MT5 hydraulische schijfremmen',
      'Aandrijving': 'Enviolo Trekking (traploos) met gripshift',
      'Riem': 'Gates CDX riem (55T/24T)'
    },
    features: {
      'Verlichting': 'Supernova mini 2 Pro voor, AXA Juno Signal LED achter',
      'Accessoires': 'Riese & Müller MIK-drager (27 kg), kinderzitje/aanhanger compatibel',
      'Connectiviteit': 'Bosch Smart System',
      'Waterdichtheid': 'IPX4 spatwaterbestendig'
    }
  },
  features: [
    'Bosch Performance Line CX middenmotor (85 Nm)',
    'Bosch PowerTube 750 Wh accu',
    'PowerMore 250 Wh range-extender optioneel',
    'Bosch Smart System technologie',
    'Intuvia 100 display (Kiox 300 optioneel)',
    'Enviolo Trekking traploos schakelsysteem',
    'Gates CDX riemaandrijving',
    'SR Suntour Mobie 34 voorvork (100 mm)',
    'Magura MT4/MT5 hydraulische remmen',
    '27,5″ wielen met Schwalbe banden',
    'Supernova mini 2 Pro koplamp',
    'AXA Juno Signal LED achterlicht',
    'Riese & Müller MIK-bagagedrager (27 kg)'
  ],
  included: [
    'Fiets',
    'Bosch PowerTube 750 Wh accu',
    'Bosch 4A lader',
    'Intuvia 100 display',
    'Supernova mini 2 Pro koplamp',
    'AXA Juno Signal LED achterlicht',
    'Riese & Müller MIK-bagagedrager',
    'Bosch Smart System connectiviteit'
  ],
  accessories: [
    'PowerMore 250 Wh range-extender',
    'Kiox 300 display upgrade',
    'Kinderzitje',
    'Aanhanger',
    'Manden en tassen',
    'Slot en beveiliging',
    'Onderhoudsaccessoires',
    'Extra verlichting'
  ],
  image_url: '/src/img/Riese & Müller Charger4 GT/riese_und_muller_charger4_gt_vario_black_matt_2_.jpg'
})

// Canyon Precede:ON 7 / Precede:ON Comfort 7 specific data
const canyonPrecedeON7Comfort7 = ref({
  id: '550e8400-e29b-41d4-a716-446655440011',
  brand: 'Canyon',
  model_name: 'Precede:ON 7 / Precede:ON Comfort 7',
  version: 'Stads/commuter e-bikes (500–625 Wh; EU/US snelheid)',
  price: 3549,
  currency: 'EUR',
  images: [
    '/src/img/Canyon PrecedeON 7  Comfort 7/1B02A7D4-6B99-4295-BACEE60AF6C6EFF6.avif',
    '/src/img/Canyon PrecedeON 7  Comfort 7/3A74CC50-872E-49B9-90A3D14C2308A52C.avif',
    '/src/img/Canyon PrecedeON 7  Comfort 7/59B6830E-3201-4731-85E112CC69FE1BC9.avif',
    '/src/img/Canyon PrecedeON 7  Comfort 7/777DD2E1-8680-4494-828D81C7DCB510CF.avif',
    '/src/img/Canyon PrecedeON 7  Comfort 7/AE6746DB-E731-499E-809CCEC805165533.avif',
    '/src/img/Canyon PrecedeON 7  Comfort 7/CA53ECE2-7099-437C-BF6F9E8BD470DD69.avif'
  ],
  colors: [
    { name: 'Comfort 7 (Step-through)', value: 'comfort-7', available: true },
    { name: 'Precede:ON 7 (Standaard)', value: 'precede-on-7', available: true }
  ],
  batteries: [
    { name: 'Comfort 7 - 625 Wh', value: 'comfort-625wh', capacity: '625 Wh', range: 'Ruim voldoende voor dag- tot meerdaags woon-werk', price: 3549 },
    { name: 'Precede:ON 7 - 500 Wh', value: 'precede-500wh', capacity: '500 Wh', range: 'Tot ~100 km (S/M maten)', price: 3499 },
    { name: 'Precede:ON 7 - 625 Wh', value: 'precede-625wh', capacity: '625 Wh', range: 'Tot ~100 km (L/XL maten)', price: 3499 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Bosch-aandrijving & Grote Accu\'s',
      description: '500–625 Wh geïntegreerde Bosch PowerTube (Comfort 7: 625 Wh) voor lange ritten'
    },
    {
      icon: '🔧',
      title: 'Onderhoudsarm',
      description: 'Gates CDX riem + Nexus 5 (Comfort 7) of Enviolo (Precede:ON 7) voor onderhoudsarme aandrijving'
    },
    {
      icon: '🛡️',
      title: 'Comfort & Controle',
      description: 'Carbon voorvork, brede stadsbanden, 180 mm schijven, volledige stadsafmontage (verlichting, spatborden, drager, standaard, slot)'
    },
    {
      icon: '🌍',
      title: 'EU vs US Topsnelheid',
      description: 'EU 25 km/u (pedelec-wetgeving); US Comfort 7 met Performance Line Sport ondersteunt tot 28 mph tijdens trappen'
    },
    {
      icon: '🚴‍♀️',
      title: 'Twee Varianten',
      description: 'Comfort 7: step-through one-size (160–195 cm); Precede:ON 7: standaard frame in MD/LG/XL'
    },
    {
      icon: '💡',
      title: 'Volledige Stadssetup',
      description: 'Geïntegreerde verlichting, spatborden, drager, ABUS Bordo 6000 vouwslot, verende zadelpen'
    }
  ],
  specifications: {
    general: {
      'Merk/Model': 'Canyon Precede:ON 7 / Precede:ON Comfort 7',
      'Doelgroep': 'Unisex',
      'Categorie': 'Stads/commuter e-bikes',
      'Gewicht': '27,3–27,4 kg (Comfort 7)',
      'Payload': 'Maximaal toelaatbaar gewicht per specificatie'
    },
    motor: {
      'Motor (EU)': 'Bosch Performance Line (Smart System), 75 Nm',
      'Motor (US)': 'Bosch Performance Line Sport, ondersteuning tot 28 mph',
      'Vermogen': '250 W nominaal',
      'Systeem': 'Bosch Smart System',
      'Ondersteuning': 'EU 25 km/u (pedelec); US 28 mph (Class 3)',
      'Display': 'Bosch Purion 200 (Flow-app connect)'
    },
    battery: {
      'Accu': 'Bosch PowerTube 500–625 Wh (uitneembaar)',
      'Type': 'Geïntegreerd, uitneembaar',
      'Bereik': 'Afhankelijk van modus/condities; 625 Wh stadsgebruik = ruim voldoende',
      'Lader': 'Bosch standaard lader'
    },
    frame: {
      'Frame Comfort 7': 'Step-through one-size (aanpasbaar voor 160–195 cm)',
      'Frame Precede:ON 7': 'Standaard AL met maten MD/LG/XL',
      'Vork': 'Carbon',
      'Wielmaat': '27,5″ / 650b'
    },
    wheels: {
      'Banden': 'Schwalbe Big Ben Plus ±55 mm (Comfort 7) / Schwalbe G-One Allround 57-584 (Precede:ON 7)',
      'Remmen': 'Schijfremmen 180/180 mm (Comfort 7) / Magura MT Thirty hydraulisch 180 mm (Precede:ON 7)',
      'Aandrijving Comfort 7': 'Shimano Nexus 5 (naaf) + Gates CDX riem',
      'Aandrijving Precede:ON 7': 'Enviolo traploos (IGH) + Gates CDX riem'
    },
    features: {
      'Verlichting': 'LightSkin (voor) + Supernova E3 Tail Light 2 (achter)',
      'Accessoires': 'Achterdrager, spatborden, ABUS Bordo 6000 vouwslot, verende zadelpen 50 mm',
      'Connectiviteit': 'Bosch Flow-app connect',
      'Waterdichtheid': 'IPX4 spatwaterbestendig'
    }
  },
  features: [
    'Bosch Performance Line motor (75 Nm EU / Performance Line Sport US)',
    'Bosch PowerTube 500–625 Wh accu',
    'Bosch Smart System technologie',
    'Bosch Purion 200 display',
    'Gates CDX riemaandrijving',
    'Shimano Nexus 5 (Comfort 7) / Enviolo traploos (Precede:ON 7)',
    'Carbon voorvork',
    'Hydraulische schijfremmen (180 mm)',
    '27,5″ wielen met Schwalbe banden',
    'Geïntegreerde verlichting',
    'Volledige stadssetup (spatborden, drager, slot)',
    'ABUS Bordo 6000 vouwslot',
    'Verende zadelpen 50 mm'
  ],
  included: [
    'Fiets',
    'Bosch PowerTube 500–625 Wh accu',
    'Bosch lader',
    'Bosch Purion 200 display',
    'LightSkin koplamp',
    'Supernova E3 Tail Light 2 achterlicht',
    'Achterdrager',
    'Spatborden',
    'ABUS Bordo 6000 vouwslot',
    'Verende zadelpen 50 mm',
    'Standaard'
  ],
  accessories: [
    'Extra accu',
    'Kinderzitje',
    'Manden en tassen',
    'Extra verlichting',
    'Onderhoudsaccessoires',
    'Extra sloten'
  ],
  image_url: '/src/img/Canyon PrecedeON 7  Comfort 7/1B02A7D4-6B99-4295-BACEE60AF6C6EFF6.avif'
})

// Orbea Vibe H30 specific data
const orbeaVibeH30 = ref({
  id: '550e8400-e29b-41d4-a716-446655440012',
  brand: 'Orbea',
  model_name: 'Vibe H30',
  version: 'Lichtgewicht commuter e-bike (Mahle X35, 248 Wh)',
  price: 2799,
  currency: 'EUR',
  images: [
    '/src/img/Orbea Vibe H30/Orbea-Vibe-H30-Crossbar-2024-Green-Electric-Bike.webp',
    '/src/img/Orbea Vibe H30/Orbea-Vibe-H30-Crossbar-2024-Red-Electric-Bike.webp',
    '/src/img/Orbea Vibe H30/Orbea-Vibe-H30-Crossbar-2024-White-Electric-Bike.webp'
  ],
  colors: [
    { name: 'Green', value: 'green', available: true },
    { name: 'Red', value: 'red', available: true },
    { name: 'White', value: 'white', available: true }
  ],
  batteries: [
    { name: '248 Wh Intern', value: '248wh-intern', capacity: '248 Wh', range: 'Tot ~125 km (gunstige omstandigheden)', price: 2799 },
    { name: '248 Wh + 208 Wh Extender', value: '248wh-plus-extender', capacity: '456 Wh', range: 'Tot ~220 km (gunstig)', price: 3299 }
  ],
  highlights: [
    {
      icon: '⚡',
      title: 'Licht & Strak',
      description: 'Aluminium frame met carbon vork; complete H30 weegt vanaf ~15,1–15,5 kg (maat/trim afhankelijk)'
    },
    {
      icon: '🔋',
      title: 'Stadsrange, Uitbreidbaar',
      description: '248 Wh intern + optie 208 Wh Mahle X35 Range Extender (bidonhouder), samen voor ~200+ km in ideale omstandigheden'
    },
    {
      icon: '🔇',
      title: 'Praktisch Stil & Natuurlijk',
      description: 'Mahle X35 Plus naafmotor (hub), iWoc TRIO bediening; zeer onopvallend geïntegreerd'
    },
    {
      icon: '🛡️',
      title: 'Bewezen Stadsset-up',
      description: 'Magura MT30 hydraulische schijfremmen, Kenda 700×45C banden; H30 EQ met verlichting/spatborden/drager'
    },
    {
      icon: '🚴‍♀️',
      title: 'Twee Varianten',
      description: 'H30 (naked, minimalistisch) en H30 EQ (met stadsaccessoires zoals spatborden en drager)'
    },
    {
      icon: '🌍',
      title: 'EU vs US Snelheid',
      description: 'EU 25 km/u (pedelec); VS Class 1: 20 mph - ideaal voor verschillende markten'
    }
  ],
  specifications: {
    general: {
      'Merk/Model': 'Orbea Vibe H30',
      'Doelgroep': 'Unisex',
      'Categorie': 'Lichtgewicht commuter e-bike',
      'Gewicht': '15,1–15,5 kg (H30) / ~18 kg (H30 EQ)',
      'Payload': 'Maximaal toelaatbaar gewicht per specificatie'
    },
    motor: {
      'Motor': 'Mahle X35 Plus achternaaf',
      'Vermogen': '250 W nominaal',
      'Systeem': 'Mahle X35',
      'Ondersteuning': 'EU 25 km/u; VS 20 mph (Class 1)',
      'Bediening': 'Mahle iWoc TRIO top-tube remote'
    },
    battery: {
      'Accu': 'Mahle 36 V / 6,9 Ah = 248 Wh (intern)',
      'Type': 'Geïntegreerd, uitneembaar',
      'Bereik': 'Tot ~125 km (248 Wh); tot ~220 km met 208 Wh extender',
      'Lader': 'Mahle X35',
      'Extender': 'Mahle X35 Range Extender 208 Wh (plug-&-play, ~1,45 kg)'
    },
    frame: {
      'Frame': 'Orbea Vibe Top Bar Hydro 6061 alu, interne kabels',
      'Vork': 'Orbea Vibe carbon (12×100 steekas)',
      'Wielmaat': '700c',
      'Banden': 'Kenda K1052 700×45C (reflectiestreep, anti-lek)'
    },
    wheels: {
      'Banden': 'Kenda K1052 700×45C (reflectiestreep, anti-lek)',
      'Remmen': 'Magura MT30 hydraulisch, flat-mount',
      'Aandrijving': 'Shimano Deore 1×10 (11–46T)',
      'Crank': 'Forged alloy 42T met chainguard'
    },
    features: {
      'Verlichting': 'Lezyne STVZO achterlicht (H30); volledige stadsverlichting (H30 EQ)',
      'Accessoires': 'H30 EQ: spatborden, drager, volledige stadsuitrusting',
      'Connectiviteit': 'Mahle iWoc TRIO',
      'Waterdichtheid': 'IPX4 spatwaterbestendig'
    }
  },
  features: [
    'Mahle X35 Plus achternaafmotor',
    'Mahle 248 Wh interne accu',
    'Mahle X35 Range Extender 208 Wh optioneel',
    'Mahle iWoc TRIO bediening',
    'Shimano Deore 1×10 aandrijving',
    'Magura MT30 hydraulische remmen',
    'Carbon voorvork',
    '700c wielen met Kenda banden',
    'Aluminium frame met interne kabels',
    'Lezyne STVZO verlichting',
    'Tubeless-ready velgen',
    'Anti-lek banden met reflectiestreep'
  ],
  included: [
    'Fiets',
    'Mahle 248 Wh interne accu',
    'Mahle X35 lader',
    'Mahle iWoc TRIO bediening',
    'Lezyne STVZO achterlicht',
    'Shimano Deore 1×10 aandrijving',
    'Magura MT30 hydraulische remmen',
    'Carbon voorvork',
    'Kenda 700×45C banden'
  ],
  accessories: [
    'Mahle X35 Range Extender 208 Wh',
    'H30 EQ stadsuitrusting (spatborden, drager)',
    'Extra verlichting',
    'Kinderzitje',
    'Manden en tassen',
    'Onderhoudsaccessoires'
  ],
  image_url: '/src/img/Orbea Vibe H30/Orbea-Vibe-H30-Crossbar-2024-Green-Electric-Bike.webp'
})

// VanMoof S5 specific data
const vanMoofS5 = ref({
  id: '550e8400-e29b-41d4-a716-446655440013',
  brand: 'VANMOOF',
  model_name: 'S5',
  version: 'Stads/commuter e-bike (487 Wh, 27.5″, anti-diefstal)',
  price: 3298,
  currency: 'EUR',
  images: [
    '/img/Van Moof - S5/S5-Grey-product-foto-1.webp',
    '/img/Van Moof - S5/VanMoof_S5_Gray.webp',
    '/img/Van Moof - S5/423841-2022_S5A5_Master_16x9_01-c35ff0-original-1649148516.webp',
    '/img/Van Moof - S5/423845-2022_S5A5_Master_16x9_FussFree_Clean_04-8e7432-original-1649148517_1.webp',
    '/img/Van Moof - S5/423468-Screen_Edit01-1c9f55-original-1648821974.webp',
    '/img/Van Moof - S5/VanMoof.webp'
  ],
  colors: [
    { name: 'Zwart', value: 'zwart', available: true },
    { name: 'Wit', value: 'wit', available: true }
  ],
  batteries: [
    { name: 'Standaard', value: 'standard', capacity: '487 Wh', range: '60-150 km', price: 3298 }
  ],
  highlights: [
    {
      title: 'Soepele aandrijving',
      description: 'Gen-5 motor met torquesensor + E-shifter (auto 3-speed)',
      icon: '⚡',
      source: 'vanmoof.com'
    },
    {
      title: 'Eén-druk beveiliging',
      description: 'Kick Lock, alarm en anti-diefstal-features, gekoppeld aan de app',
      icon: '🔒',
      source: 'vanmoof.com'
    },
    {
      title: 'Zichtbaar & geïntegreerd',
      description: 'Halo Ring cockpit en Gen-5 Hi-Vis verlichting',
      icon: '💡',
      source: 'd21buns5ku92am.cloudfront.net'
    },
    {
      title: 'Bereik & laadtijden',
      description: '487 Wh, 60–150 km (modus-afhankelijk); 0–50% ±2u30, 0–100% ±6u30',
      icon: '🔋',
      source: 'vanmoof.com'
    },
    {
      title: 'Wielen & fit',
      description: '27.5″ wielen; rijderlengte 165–210 cm',
      icon: '🚴‍♂️',
      source: 'The Verge'
    }
  ],
  specifications: {
    general: {
      'Merk': 'VanMoof',
      'Model + versie': 'S5 (Gen 5)',
      'Doelgroep': 'Unisex stadsfietser/forens',
      'Categorie': 'Stads/commuter e-bike',
      'Bouwjaar/modeljaar': '2022–heden (re-engineered terug in verkoop 2024–2025)',
      'Prijs (EU indicatie)': '€3.298 RRP; retailacties ~€2.8–3.0k',
      'Heren/Dames': 'Beide (unisex)',
      'Actieradius': '~60–150 km (modus/condities)',
      'Accucapaciteit': '487 Wh (intern)',
      'Topsnelheid': '25 km/u (EU)',
      'Wielmaat': '27.5″ (650b)',
      'Gewicht': '≈23 kg'
    },
    eSystem: {
      'Motor': 'Voornaaf 250 W (Gen 5), Boost-koppel 68 Nm; EU 25 km/u ondersteuning',
      'Sensoren & schakeling': 'Torquesensor + E-shifter met automatische 3-versnellingsnaaf',
      'Accu': '487 Wh (intern). Bereik: ~60 km (Full Power) tot ~150 km (Eco). Laadtijd: ≈2u30 (0–50%) / ≈6u30 (0–100%)',
      'Gewicht': 'ca. 23 kg'
    },
    frameWheelsBrakes: {
      'Frame': 'Aluminium, één maat (165–210 cm)',
      'Wielen/banden': '27.5″ (650b); lage rolweerstand 27.5×2.0″ (testkenmerk)',
      'Remmen': 'Hydraulische schijfremmen (Gen-5)'
    },
    interfaceLighting: {
      'Halo Ring': 'In het stuur (battery/snelheid/lock-status)',
      'Verlichting': 'Gen-5 Hi-Vis koplamp/achterlicht (e-bike normeringen EU/DE)'
    },
    antiTheftApp: {
      'Kick Lock': 'In de naaf: tik om te vergrendelen, alarm en remote-lockdown via app'
    },
    pricingAvailability: {
      'Richtprijs herintro 2024': '€3.298 (NL/DE)',
      'Retailvoorbeelden NL': 'Aanbiedingen gezien rond €2.798–€2.998 (kleur/voorraad afhankelijk)',
      'Context': 'Na de doorstart onder McLaren Applied/Lavoie keerden de S5/A5 terug, met service via partnernetwerk en gestroomlijnde onderdelen/logistiek'
    },
    usageTargetGroup: {
      'Doelgroep': 'Unisex stadsfietser/forens die strak design en geïntegreerde tech wil, met focus op dagelijks gebruik, woon-werk en snelle ritten in de stad'
    },
    legalNote: {
      'Wettelijke noot (NL/EU)': 'De S5 is een pedelec: trapondersteuning tot 25 km/u, 250 W nominaal, geen gashendel. Instellingen/varianten voor andere markten (bijv. VS Class 1 20 mph) kunnen afwijken. Controleer lokale regels.'
    }
  },
  features: [
    'Near-silent 250 W voornaafmotor',
    'Torquesensor + E-shifter (automatische 3-versnellingsnaaf)',
    'Kick Lock en geïntegreerde verlichting/elektronica',
    'Boost-koppel tot 68 Nm voor snelle sprints',
    'Halo Ring cockpit display',
    'Gen-5 Hi-Vis verlichting',
    'Anti-diefstal features gekoppeld aan app',
    '27.5″ wielen voor extra comfort',
    'Aluminium frame, één maat (165–210 cm)',
    'Hydraulische schijfremmen (Gen-5)',
    'Lage rolweerstand 27.5×2.0″ banden',
    'Remote-lockdown via app'
  ],
  included: [
    'VanMoof S5 e-bike',
    '487 Wh accu (intern)',
    'Lader (0-50% in 2.5u, 0-100% in 6.5u)',
    'Halo Ring cockpit',
    'Gen-5 Hi-Vis verlichting',
    'Kick Lock systeem',
    'VanMoof app toegang',
    'Anti-diefstal alarm',
    'Handleiding en documentatie',
    'Hydraulische schijfremmen',
    '27.5″ wielen met lage rolweerstand banden'
  ],
  sources: [
    'Officiële productpagina S5: 487 Wh, 60–150 km, laadtijden, EU 25 km/u, 23 kg (vanmoof.com)',
    'VanMoof pers/blog & perskit (2024): torquesensor, E-shifter 3-speed, 27.5″ wielen, Halo Ring/Hi-Vis lights (vanmoof.com)',
    'The Verge / MT/Sprout (2024): herintroductie & prijs €3.298 (The Verge)',
    'Retail NL (Superfietsen/Hoogeveen): actuele winkelprijzen ~€2.798–€2.998 (Superfietsen.nl)',
    'Wheel size bevestiging (The Verge 2022 / DOWNTOWN): 27.5″ S5 (The Verge)'
  ],
  shortOverview: 'De VanMoof S5 is een minimalistische stads/commuter e-bike met Gen 5-platform: near-silent 250 W voornaafmotor, torquesensor + E-shifter (automatische 3-versnellingsnaaf), Kick Lock en geïntegreerde verlichting/elektronica. De interne 487 Wh accu levert een fabrieksschatting van ca. 60–150 km—met Boost-koppel tot 68 Nm voor snelle sprints. EU-topsnelheid 25 km/u. Gewicht circa 23 kg. Wielen: 27.5″ (650b) voor extra comfort.',
  image_url: '/img/Van Moof - S5/S5-Grey-product-foto-1.webp'
})

// Batavus Diva E-go specific data
const batavusDivaEgo = ref({
  id: '550e8400-e29b-41d4-a716-446655440014',
  brand: 'Batavus',
  model_name: 'Diva E-go',
  version: 'Stijlvolle elektrische transportfiets (E-Motion voorwielmotor, 300/400 Wh)',
  price: 1699,
  currency: 'EUR',
  images: [
    '/img/Diva E-go/product.webp',
    '/img/Diva E-go/product (1).webp',
    '/img/Diva E-go/product (2).webp',
    '/img/Diva E-go/product (3).webp',
    '/img/Diva E-go/product (4).webp',
    '/img/Diva E-go/product (5).webp'
  ],
  image_url: '/img/Diva E-go/product.webp',
  colors: [
    { name: 'Wit', value: 'wit', available: true },
    { name: 'Zeegroen mat', value: 'zeegroen', available: true },
    { name: 'Grijs', value: 'grijs', available: true }
  ],
  batteries: [
    { name: '300 Wh', value: '300wh', capacity: '300 Wh', range: '22-100 km', price: 1699 },
    { name: '400 Wh', value: '400wh', capacity: '400 Wh', range: '29-140 km', price: 1849 }
  ],
  highlights: [
    {
      title: 'Transport klaar',
      description: 'Stevige voordrager, stuurvergrendeling en tweepootstandaard voor stabiel laden/parkeren',
      icon: '🚚',
      source: 'kaandorpfietsen.nl'
    },
    {
      title: 'Eenvoudig & betaalbaar',
      description: 'E-Motion voorwielmotor met uitneembare drageraccu (300/400 Wh)',
      icon: '⚡',
      source: 'kaandorpfietsen.nl'
    },
    {
      title: 'Stadsgemak',
      description: 'Nexus 7 + rollerbrakes; lage instap (dames)',
      icon: '🏙️',
      source: 'kaandorpfietsen.nl'
    },
    {
      title: 'Flexibele accu-opties',
      description: 'Kies tussen 300 Wh (22-100 km) of 400 Wh (29-140 km) actieradius',
      icon: '🔋',
      source: 'kaandorpfietsen.nl'
    },
    {
      title: 'Praktische uitrusting',
      description: 'Voordrager, stuurvergrendeling, Ursus Jumbo tweepootstandaard en ding-dong bel',
      icon: '🔧',
      source: 'kaandorpfietsen.nl'
    }
  ],
  specifications: {
    general: {
      'Merk': 'Batavus',
      'Model + versie': 'Diva E-go (E-Motion, transport)',
      'Doelgroep': 'Dames (lage instap)',
      'Categorie': 'Elektrische transportfiets',
      'Bouwjaar/modeljaar': '2016–2017 (uitlopend/2e hands)',
      'Prijs (EU indicatie)': 'vanaf € 1.699 (2017, 300 Wh) | + € 150 voor 400 Wh',
      'Heren/Dames': 'Dames',
      'Actieradius': '~ 22–100 km (300 Wh) | ~ 29–140 km (400 Wh)',
      'Accucapaciteit': '317–396 Wh (36 V 8.8/11 Ah)',
      'Topsnelheid': '25 km/u',
      'Wielmaat': '28 inch',
      'Gewicht': '± 25,0 kg (excl. accu)'
    },
    eSystem: {
      'Motor': 'Batavus E-Motion (voorwiel)',
      'Accu-opties': '300 Wh (8.8 Ah/36 V ≈ 317 Wh) of 400 Wh (11 Ah/36 V ≈ 396 Wh), uitneembaar onder de achterdrager',
      'Ondersteuning': 'EU 25 km/u pedelec',
      'Lader': '2A standaard; 4A snellader tegen meerprijs (brochure)'
    },
    aandrijvingRemmen: {
      'Versnellingen': 'Shimano Nexus 7 (naaf)',
      'Remmen': 'rollerbrakes voor/achter'
    },
    frameUitrusting: {
      'Frame': 'lage-instap D in 50 / 56 / 62 cm',
      'Kleuren (2017)': 'Wit, Zeegroen mat, Grijs',
      'Uitrusting': 'voordrager, stuurvergrendeling, Ursus Jumbo tweepootstandaard, klassiek Selle Royal Drifter zadel, ding-dong bel'
    },
    actieradius: {
      '300 Wh': 'ca. 22–100 km (afhankelijk van stand/condities)',
      '400 Wh': 'ca. 29–140 km (idem)',
      'Opmerking': 'Werkelijke range hangt o.a. af van wind, temperatuur, bandenspanning, terrein en totaalgewicht'
    },
    prijsBeschikbaarheid: {
      'Brochureprijs (2017)': 'vanaf € 1.699 (300 Wh), + € 150 voor 400 Wh',
      'Status': 'Model inmiddels uit productie'
    },
    gebruikDoelgroep: {
      'Doelgroep': 'Dames (lage instap) die een modieuze stads-/transport e-bike zoeken voor dagelijks gebruik, boodschappen en school/werkritjes'
    },
    wettelijkeNoot: {
      'Wettelijke noot (NL/EU)': 'Pedelec: trapondersteuning tot 25 km/u, nominaal 250 W, geen gashendel > 6 km/u. Controleer lokale regels en verzekering waar nodig.'
    }
  },
  features: [
    'E-Motion voorwielmotor',
    'Uitneembare drageraccu (300/400 Wh)',
    'Shimano Nexus 7 naafversnelling',
    'Rollerbrakes voor/achter',
    'Lage instap frame (dames)',
    'Voordrager voor transport',
    'Stuurvergrendeling',
    'Ursus Jumbo tweepootstandaard',
    'Klassiek Selle Royal Drifter zadel',
    'Ding-dong bel',
    'EU 25 km/u pedelec ondersteuning',
    '36V accusysteem'
  ],
  included: [
    'Batavus Diva E-go e-bike',
    'E-Motion voorwielmotor',
    '300 Wh of 400 Wh drageraccu',
    '2A standaard lader',
    '4A snellader (optioneel)',
    'Voordrager',
    'Stuurvergrendeling',
    'Ursus Jumbo tweepootstandaard',
    'Selle Royal Drifter zadel',
    'Ding-dong bel',
    'Handleiding en documentatie',
    'Shimano Nexus 7 naafversnelling',
    'Rollerbrakes voor/achter'
  ],
  sources: [
    'Batavus E-bike brochure 2017 (PDF): DIVA E-GO pagina met prijs vanaf € 1.699, Nexus 7 + rollerbrakes, maatvoering 50/56/62, kleurvarianten, gewicht 25,0 kg (excl. accu), accu-opties 317/396 Wh en E-Motion/achterdrageraccu (kaandorpfietsen.nl)',
    'Mantel (archiefpagina): bevestigt 300 Wh standaard, 400 Wh optioneel en uitrusting voordrager, stuurvergrendeling, Ursus Jumbo. Tevens E-Motion actieradius-tabel (300 Wh 22–100 km) (kaandorpfietsen.nl)',
    'Batavus transportfiets catalogus 2016-2017: Diva E-go specificaties, kleurvarianten en prijzen (Batavus officieel)',
    'Nederlandse e-bike retailers: actuele 2e hands prijzen en beschikbaarheid Diva E-go (verschillende retailers)',
    'E-Motion motor specificaties: voorwielmotor technische details en ondersteuningsniveaus (E-Motion officieel)'
  ],
  shortOverview: 'De Batavus Diva E-go is de elektrische uitvoering van Batavus\' populaire Diva transportfiets: lage instap, voordrager, stuurvergrendeling en Ursus Jumbo tweepootstandaard. Aandrijving via een E-Motion voorwielmotor met keuze uit 300 Wh (≈317 Wh, 36 V 8.8 Ah) of 400 Wh (≈396 Wh, 36 V 11 Ah) drageraccu. Shimano Nexus 7 en rollerbrakes zorgen voor eenvoudig, stadsproof onderhoud. Richtgewicht ± 25,0 kg (excl. accu).'
})

// Sparta e-Speed D11S specific data
const spartaESpeedD11S = ref({
  id: '550e8400-e29b-41d4-a716-446655440016',
  brand: 'Sparta',
  model_name: 'e-Speed D11S',
  version: 'Speed-pedelec (45 km/u) — archiefmodel',
  price: 3499,
  currency: 'EUR',
  images: [
    '/img/Sparta e-Speed D11S/page.webp',
    '/img/Sparta e-Speed D11S/page (1).webp',
    '/img/Sparta e-Speed D11S/page (2).webp'
  ],
  image_url: '/img/Sparta e-Speed D11S/page.webp',
  colors: [
    { name: 'Zwart', value: 'zwart', available: true },
    { name: 'Wit', value: 'wit', available: true },
    { name: 'Grijs', value: 'grijs', available: true }
  ],
  batteries: [
    { name: '500 Wh', value: '500wh', capacity: '500 Wh', range: '120-145 km', price: 2599 },
    { name: '625 Wh', value: '625wh', capacity: '625 Wh', range: '70-130 km', price: 3499 }
  ],
  highlights: [
    {
      title: 'Snel & forens-proof',
      description: '45 km/u ondersteuning (speed-pedelec)',
      icon: '⚡',
      source: 'Rijksoverheid'
    },
    {
      title: 'Sterke aandrijving',
      description: 'Bosch Performance Line Speed (middenmotor) óf oudere ION XHP (achternaaf) afhankelijk van bouwjaar/generatie',
      icon: '🔧',
      source: 'spartabikes.com'
    },
    {
      title: 'Energie',
      description: '500–625 Wh geïntegreerd (latere generaties vaak 625 Wh, soms uitbreidbaar met +500 Wh)',
      icon: '🔋',
      source: 'spartabikes.com'
    },
    {
      title: 'Transmissie',
      description: '11-versnellingen derailleur (afgeleid uit D11-naam; exacte groep n.t.b.)',
      icon: '⚙️',
      source: 'Sparta specificatie'
    },
    {
      title: 'Remmen',
      description: 'Hydraulische schijfremmen (speed-pedelec-generatie) / oudere Ion: hydraulische velgremmen (HS11)',
      icon: '🛑',
      source: 'spartabikes.com'
    }
  ],
  specifications: {
    general: {
      'Merk': 'Sparta',
      'Model + versie': 'e-Speed D11S (archief; 11-speed derailleur speed-pedelec)',
      'Doelgroep': 'Woon-werk forenzen',
      'Categorie': 'Speed-pedelec (45 km/u)',
      'Bouwjaar/modeljaar': '±2016–2022 (familie e-Speed/d-Burst)',
      'Prijs (indicatie)': '~€2,6k (oud) – €4,7k (latere speed-reeks)',
      'Heren/Dames': 'Unisex/High-step (D)',
      'Actieradius': '~70–130 km (625 Wh Bosch Speed) | tot ~120–145 km (Ion 500 Wh)',
      'Accucapaciteit': '500–625 Wh (generatie-afhankelijk)',
      'Topsnelheid': '45 km/u (speed-pedelec)',
      'Wielmaat': '27,5″ of 28″ afhankelijk van generatie',
      'Gewicht': '~28–30 kg typisch speed-pedelec'
    },
    eSystem: {
      'Motor': 'waarschijnlijk Bosch Performance Line Speed (midden, 45 km/u) — D11S; alternatief (oudere reeks): ION XHP (achternaaf, ~40 km/u)',
      'Accu': 'waarschijnlijk Bosch PowerTube 625 Wh (Dual Battery optie +500 Wh op d-Burst Speed); oudere Ion-reeks: 500 Wh',
      'Display': 'Kiox/Intuvia (generatie-afhankelijk, n.t.b. voor D11S)',
      'Topsnelheid': '45 km/u (speed-pedelec)'
    },
    aandrijvingRemmen: {
      'Versnellingen': '11-speed derailleur (D11 → afgeleid; exacte groep n.t.b.)',
      'Remmen': 'hydraulische schijfremmen (speed-reeks); Ion-reeks had Magura HS-11 velgremmen'
    },
    frameVorkWielen: {
      'Frame': 'aluminium; heren/unisex (hoog-instap), maten n.t.b. (vergelijkbaar met sparta speed/d-Burst: 53/57/61 etc.)',
      'Wielmaat/band': '27,5″ of 28″ afhankelijk van generatie (n.t.b. voor D11S)',
      'Gewicht': '~28–30 kg typisch speed-pedelec (indicatie; n.t.b.)'
    },
    actieradius: {
      'Ion e-Speed 500 Wh (oud)': 'claims tot ~120–145 km onder ideale condities',
      'Bosch Speed 625 Wh (d-Burst)': '~70–130 km realistisch; met +500 Wh range-extender ruim meer'
    },
    prijsBeschikbaarheid: {
      'Historisch (Ion e-Speed)': 'vanaf ~€2.599 (2014-context); internationale info rond $3.081 (2016)',
      'Latere snelheid-modellen (d-Burst Speed)': '€4.299–4.699 nieuwprijsrange bij introductie',
      'Status': 'archief/uit productie; aanbod via dealers/tweedehands'
    },
    gebruikDoelgroep: {
      'Doelgroep': 'Woon-werk forenzen die snel en stabiel willen rijden (45 km/u), met focus op afstand/tempo. D11S past bij rijders die sportiever schakelen (11-speed derailleur) i.p.v. traploos/riem'
    },
    wettelijkeNoot: {
      'Wettelijke noot (NL) — speed-pedelec': 'Een speed-pedelec valt in NL onder bromfiets-regels: AM-rijbewijs, helm NTA-8776 of ECE, gele kentekenplaat, WA-verzekering, rijden op de rijbaan (niet op regulier fietspad)'
    }
  },
  features: [
    '45 km/u speed-pedelec ondersteuning',
    'Bosch Performance Line Speed middenmotor (latere generatie)',
    'ION XHP achternaafmotor (oudere generatie)',
    '500-625 Wh geïntegreerde accu',
    'Dual Battery optie (+500 Wh range-extender)',
    '11-speed derailleur transmissie',
    'Hydraulische schijfremmen',
    'Kiox/Intuvia display',
    'Aluminium frame (heren/unisex)',
    '27,5″ of 28″ wielen',
    'Speed-pedelec specificaties',
    'Woon-werk geoptimaliseerd'
  ],
  included: [
    'Sparta e-Speed D11S e-bike',
    'Bosch Performance Line Speed middenmotor (of ION XHP)',
    '500-625 Wh geïntegreerde accu',
    'Kiox/Intuvia display',
    '11-speed derailleur groep',
    'Hydraulische schijfremmen',
    'Aluminium frame',
    '27,5″ of 28″ wielen',
    'Speed-pedelec verlichting',
    'Handleiding en documentatie',
    'Lader',
    'Warranty documentatie'
  ],
  sources: [
    'Sparta — d-BÜRST METb Speed (archief): Bosch Performance Line Speed, 625 Wh + Dual Battery mogelijkheid, Kiox; speed-pedelec specs (spartabikes.com)',
    'Accell Group persbericht (intro speed-pedelec d-Burst): D-BÜRST Speed modellen en prijsrange (accell-group.com)',
    'Greenfinder (Sparta Ion e-Speed 2016): ION XHP naafmotor, 500 Wh, ~40 km/u, HS11 remmen (greenfinder.de)',
    'Wiewatwaarhoe review (Ion e-Speed 2014): claim tot 145 km, 40 km/u, prijscontext (wiewatwaarhoe.nl)',
    'Rijksoverheid (speed-pedelec regels): helm (NTA-8776/ECE), AM-rijbewijs, kenteken/verzekering, rijbaan (Rijksoverheid)'
  ],
  shortOverview: 'De Sparta e-Speed D11S is een speed-pedelec (45 km/u) bedoeld voor woon-werk. Generatie-afhankelijk vind je in de e-Speed-lijn: Vroege e-Speed (±2014–2016) met ION XHP achternaafmotor en 500 Wh, of latere e-Speed/d-Burst varianten (±2021–2022) met Bosch Performance Line Speed middenmotor en 625 Wh geïntegreerde accu. De aanduiding D11S past het best bij een sportieve uitvoering met 11-speed derailleur in speed-trim.'
})

// Gazelle Ultimate C8+ HMB specific data
const gazelleUltimateC8HMB = ref({
  id: '550e8400-e29b-41d4-a716-446655440018',
  brand: 'Gazelle',
  model_name: 'Ultimate C8+ HMB',
  version: 'Comfortabele stads/trekking e-bike (Bosch Smart System, 500 Wh, riemaandrijving)',
  price: 3499,
  currency: 'EUR',
  images: [
    '/img/Gazelle Ultimate C8+ HMB/1280_6BfcfcP1EkZ67oEg.webp',
    '/img/Gazelle Ultimate C8+ HMB/1280_INWUZ0c0WFG91IyI.webp',
    '/img/Gazelle Ultimate C8+ HMB/1280_oRJdkYSKJdT68sOv.webp',
    '/img/Gazelle Ultimate C8+ HMB/1280_UBRizqROASR41Mju.webp',
    '/img/Gazelle Ultimate C8+ HMB/1280_UXMmvvqzyNm81cTh.webp',
    '/img/Gazelle Ultimate C8+ HMB/eyJidWNrZXQiOiJmdnMtcHJvZHVjdGlvbiIsImtleSI6InVwbG9hZHNcL2dhemVsbGUtZWxla3RyaXNjaGUtZmlldHNlblwvdWx0aW1hdGUtYzgtcGx1cy1obWJcL0dhemVsbGUtdWx0aW1hdGVjOHBsdXNobWItZGFtZXNmaWV0cy1yb28.jpeg'
  ],
  image_url: '/img/Gazelle Ultimate C8+ HMB/1280_6BfcfcP1EkZ67oEg.webp',
  colors: [
    { name: 'Zwart', value: 'zwart', available: true },
    { name: 'Wit', value: 'wit', available: true },
    { name: 'Grijs', value: 'grijs', available: true },
    { name: 'Blauw', value: 'blauw', available: true }
  ],
  batteries: [
    { name: '500 Wh', value: '500wh', capacity: '500 Wh', range: '70-175 km', price: 3499 }
  ],
  highlights: [
    'Soepel & stil: Bosch Active Line Plus (50 Nm) met Smart System en Purion 200 kleurdisplay',
    'Onderhoudsarm: Gates CDX riem + Shimano Nexus 8 interne naaf',
    'Comfort & controle: geïntegreerde voorvorkvering (±40 mm), Shimano BR-MT200 schijfremmen (180/160 mm)',
    'Volledig afgemonteerd: Herrmans MR8 60 lux voor, Spanninga Commuter Glow achter, AXA ringslot (ART), Ursus Mooi standaard, MIK HD-drager 27 kg',
    'Bereik & laadtijd: 500 Wh Intube; 2A: ~7u30 / 4A: ~4u30 laden; Eco tot ~175 km (conditie-afhankelijk)'
  ],
  specifications: {
    filters: {
      'Merk': 'Gazelle',
      'Model + versie': 'Ultimate C8+ HMB (High-Step / Low-Step)',
      'Prijs (EU indicatie)': '€3.249–€3.399 (actie); RRP ~€3.799',
      'Bouwjaar/modeljaar': '2024–2025 (Smart System-generatie)',
      'Heren/Dames': 'Beide (unisex)',
      'Actieradius': 'tot ~175 km (Eco, 500 Wh — condities)',
      'Accucapaciteit': '500 Wh (Bosch Intube)',
      'Topsnelheid': '25 km/u (EU pedelec)',
      'Aandrijving': 'Gates CDX riem + Nexus 8',
      'Remmen': 'Hydraulische schijfremmen (BR-MT200, 180/160)',
      'Gewicht': '~24,5 kg (excl. accu)'
    },
    eSystem: {
      'Motor': 'Bosch Active Line Plus, 50 Nm, middenmotor',
      'Accu': 'Bosch PowerTube 500 Wh (36 V, Intube, uitneembaar)',
      'Display/remote': 'Bosch Purion 200 (kleur, walk-assist)',
      'Lader': '2A standaard (optie 4A bij dealers). Laadtijd: ±7u30 (2A) / 4u30 (4A)',
      'Ondersteuning': 'tot 25 km/u (EU) / 20 mph (Class 1)'
    },
    aandrijvingRemmen: {
      'Versnellingen': 'Shimano Nexus 8 (naaf)',
      'Aandrijving': 'Gates riem (55T voor / 24T achter; CDX CenterTrack)',
      'Remmen': 'Shimano BR-MT200 hydraulisch, 180 mm vóór / 160 mm achter'
    },
    frameUitrusting: {
      'Frame': 'aluminium; High-Step en Low-Step. Actieve zitpositie',
      'Vork': 'Mono Integrated vering, ±40 mm; geen lock-out',
      'Wielen/banden': '28″, velgen Dutch 19; Schwalbe Energizer Plus 50-622'
    },
    verlichtingUitrusting: {
      'Koplamp': 'Herrmans MR8, 60 lux (accuvoeding)',
      'Achterlicht': 'Spanninga Commuter Glow (accuvoeding)',
      'Slot': 'AXA ringslot (ART)',
      'Standaard': 'Ursus Mooi (drop-down)',
      'Drager': 'MIK HD systeemdrager, max. 27 kg'
    },
    matenGewicht: {
      'Gewicht': 'ca. 24,5 kg (excl. accu)',
      'Max. toelaatbaar totaalgewicht': '130 kg (fiets + berijder + bagage)',
      'Maten': 'Low-Step 46/53/57 cm; High-Step o.a. 49/53/57/61/65 cm'
    },
    actieradius: {
      '500 Wh': 'Eco ~175 km / Tour ~105 km / Auto ~80 km / Turbo ~70 km (ideale omstandigheden; praktijk varieert)'
    },
    prijsBeschikbaarheid: {
      'Advies/retail (NL)': 'vaak €3.799 RRP; actuele verkoopprijzen regelmatig €3.249–€3.399 (afhankelijk van dealer/actie)',
      'Opmerking': 'specificaties/kleuren kunnen per modeljaar en land afwijken; controleer bij je dealer de actuele uitvoering'
    },
    gebruikDoelgroep: {
      'Doelgroep': 'Unisex forenzen en tourrijders die comfort en laag onderhoud zoeken (riem + Nexus 8)',
      'Toepassing': 'woon-werk, toeren, stadsritten — stil, strak en degelijk uitgebalanceerd frame'
    },
    wettelijkeNoot: {
      'Wettelijke noot (NL/EU)': 'De Ultimate C8+ HMB is een pedelec: ondersteuning tot 25 km/u, 250 W nominaal, geen gashendel > 6 km/u. Hiermee is de fiets weglegaal als e-bike in NL/EU. (Speed-pedelec regels zijn niet van toepassing.)'
    }
  },
  features: [
    'Bosch Active Line Plus middenmotor (50 Nm)',
    'Bosch Smart System technologie',
    'Bosch PowerTube 500 Wh Intube accu',
    'Bosch Purion 200 kleurdisplay',
    'Gates CDX riemaandrijving',
    'Shimano Nexus 8 naafversnelling',
    'Shimano BR-MT200 hydraulische schijfremmen',
    'Mono Integrated voorvorkvering (±40 mm)',
    'Herrmans MR8 60 lux koplamp',
    'Spanninga Commuter Glow achterlicht',
    'AXA ringslot (ART)',
    'Ursus Mooi standaard',
    'MIK HD systeemdrager (27 kg)',
    '28″ wielen met Schwalbe Energizer Plus banden',
    'Aluminium frame (High-Step/Low-Step)',
    'EU 25 km/u pedelec ondersteuning'
  ],
  included: [
    'Gazelle Ultimate C8+ HMB e-bike',
    'Bosch Active Line Plus middenmotor',
    'Bosch PowerTube 500 Wh Intube accu',
    'Bosch Purion 200 kleurdisplay',
    '2A standaard lader',
    '4A snellader (optioneel)',
    'Gates CDX riemaandrijving',
    'Shimano Nexus 8 naafversnelling',
    'Shimano BR-MT200 hydraulische schijfremmen',
    'Mono Integrated voorvorkvering',
    'Herrmans MR8 koplamp',
    'Spanninga Commuter Glow achterlicht',
    'AXA ringslot (ART)',
    'Ursus Mooi standaard',
    'MIK HD systeemdrager',
    'Handleiding en documentatie',
    'Warranty documentatie'
  ],
  sources: [
    'Gazelle (EN-GB) – Ultimate C8+ HMB: volledige specificaties (motor Active Line Plus 50 Nm, 500 Wh, Purion 200, gewichten, verlichting, MIK HD 27 kg, ART-slot, rem-/bandenspecificatie, range) (Gazelle Bikes)',
    'Gazelle factsheet (PDF) – Ultimate C8 Smart System: componentdetails (vorkvering ±40 mm, 55T/24T Gates, BR-MT200 180/160, 24,5 kg excl. accu, Low-Step maten/kleuren) (Gazelle)',
    'Mantel & NL-retail: actuele NL-prijzen/acties voor de Ultimate C8+ HMB (Mantel)',
    'Gazelle Ultimate C8+ HMB productpagina: technische specificaties, kleuren, maten en prijzen (Gazelle Bikes)',
    'Bosch Smart System documentatie: Active Line Plus motor, PowerTube accu en Purion 200 display specificaties (Bosch eBike Systems)'
  ],
  shortOverview: 'De Ultimate C8+ HMB is Gazelle\'s onderhoudsarme allrounder: Bosch Active Line Plus (Smart System, 50 Nm) middenmotor, geïntegreerde 500 Wh accu, Gates riemaandrijving en Shimano Nexus 8 naaf. Standaard met hydraulische schijfremmen, geïntegreerde vorkvering (±40 mm), Herrmans MR8 60 lux koplamp en MIK HD-bagagedrager (27 kg). Fabrieksopgave actieradius tot ca. 175/105/80/70 km (Eco/Tour/Auto/Turbo); EU-topsnelheid 25 km/u. Gewicht ca. 24,5 kg (excl. accu).'
})

// Koga E-Nova Evo specific data
const kogaENovaEvo = ref({
  id: '550e8400-e29b-41d4-a716-446655440017',
  brand: 'Koga',
  model_name: 'E-Nova Evo',
  version: 'Comfortabele stads/trekking e-bike (riem, Nexus 8, 500–625 Wh opties)',
  price: 3199,
  currency: 'EUR',
  images: [
    '/img/E-Nova Evo/E-Nova 4405.jpg',
    '/img/E-Nova Evo/E-Nova 4419.jpg',
    '/img/E-Nova Evo/Disc Brakes - koga 4493-small.jpg',
    '/img/E-Nova Evo/KNOL0302.png',
    '/img/E-Nova Evo/PACE B10 4544.jpg'
  ],
  image_url: '/img/E-Nova Evo/E-Nova 4405.jpg',
  colors: [
    { name: 'Zwart', value: 'zwart', available: true },
    { name: 'Wit', value: 'wit', available: true },
    { name: 'Grijs', value: 'grijs', available: true },
    { name: 'Blauw', value: 'blauw', available: true }
  ],
  batteries: [
    { name: '400 Wh', value: '400wh', capacity: '400 Wh', range: 'dagtoer-klasse', price: 2999 },
    { name: '500 Wh', value: '500wh', capacity: '500 Wh', range: 'dagtoer-klasse', price: 3199 },
    { name: '625 Wh', value: '625wh', capacity: '625 Wh', range: 'dagtoer-klasse', price: 3699 }
  ],
  highlights: [
    'Onderhoudsarm & stil: Gates CDX riem + Shimano Nexus 8 interne naaf',
    'Comfortframe met vering: Feathershock 2.0 (±30 mm) en interne bekabeling voor een strakke look',
    'Accukeuze & integratie: E-Nova Evo met rack-accu; E-Nova Evo PT met Bosch PowerTube 400/500/625 Wh',
    'Betrouwbare remmen & verlichting: Shimano hydraulische schijfremmen; in de specsheets o.a. B&M Eyc 50 lux en Toplight 2C Plus',
    'Realistisch gewicht: ~25,6 kg (E-Nova Evo 500 Wh) / ~27,9 kg (E-Nova Evo PT 625 Wh)'
  ],
  specifications: {
    filters: {
      'Merk': 'Koga',
      'Model + versie': 'E-Nova Evo / E-Nova Evo PT (en PT Pro / PT Unlimited als trims)',
      'Prijs (EU indicatie)': '~€2.999 (Evo 500 Wh) | ~€3.699 (PT 625 Wh) | ~€4.599 (PT Pro)',
      'Bouwjaar/modeljaar': '2022–2025 (lopende generatie)',
      'Heren/Dames': 'Beide (unisex)',
      'Actieradius': 'dagtoer-klasse; 625 Wh > 500 Wh (conditie-afhankelijk)',
      'Accucapaciteit': '400/500/625 Wh (rack of PowerTube, per uitvoering)',
      'Topsnelheid': '25 km/u (EU-pedelec)',
      'Aandrijving': 'Gates CDX riem + Nexus 8 (PT Pro varianten ook Enviolo traploos)',
      'Remmen': 'Hydraulische schijfremmen (Shimano MT400 e.d.)',
      'Gewicht': '~25,6–27,9 kg (accu/trim afhankelijk)'
    },
    eSystem: {
      'Motor': 'Bosch Active Line Plus middenmotor, ca. 50 Nm ondersteuning (E-Nova Evo / PT)',
      'Accu': 'E-Nova Evo: geïntegreerde rack-accu (typisch 500 Wh, opties 300/400/500/625 Wh afhankelijk van jaar) | E-Nova Evo PT: Bosch PowerTube 400/500/625 Wh in het frame',
      'Display/bediening': 'o.a. Bosch Intuvia/Purion (afhankelijk van uitvoering)',
      'Ondersteuning': '25 km/u (EU-pedelec)'
    },
    aandrijvingRemmen: {
      'Versnellingen': 'Shimano Nexus 8 (IGH)',
      'Aandrijving': 'Gates CDX riem (CenterTrack)',
      'Remmen': 'Shimano hydraulische schijfremmen (bijv. MT400, 180/160 mm)'
    },
    frameUitrusting: {
      'Frame': 'aluminium met super smooth welds, interne kabelgeleiding; geïntegreerde drager (range-afhankelijk)',
      'Vork': 'Koga Feathershock 2.0 (ca. 30 mm)',
      'Wielen/banden': '28"/29" met o.a. Schwalbe Energizer 50-622 (trim-afhankelijk)'
    },
    verlichtingUitrusting: {
      'Koplamp': 'B&M Eyc 50 lux (voorbeeld uit E-Nova Evo-sheet)',
      'Achterlicht': 'B&M Toplight 2C Plus',
      'Zadelpen': 'Koga geveerd; verstelbare Koga Oversized stuurpen'
    },
    gewicht: {
      'E-Nova Evo (500 Wh)': '~25,6 kg (2022-sheet)',
      'E-Nova Evo PT (625 Wh)': '~27,9 kg (sheet)'
    },
    actieradius: {
      'Opmerking': 'Afhankelijk van accu (400/500/625 Wh), ondersteuningsstand, temperatuur, wind, bandenspanning en gewicht. Koga/Bosch communiceren ruim dagtoer-bereik; 625 Wh biedt duidelijk meer marge dan 500 Wh.'
    },
    prijsBeschikbaarheid: {
      'E-Nova Evo (500 Wh)': 'rond €2.999 (2024, fabrikant/price trackers)',
      'E-Nova Evo PT (625 Wh)': 'vaak €3.699 voor de entry-trim; PT Pro rond €4.599 (2025)',
      'Opmerking': 'Prijzen verschillen per accu/trim en dealeractie. Exacte specs (motor/displays, verlichting, banden) en kleuren kunnen per modeljaar/trim (Evo, Evo PT, PT Pro, PT Unlimited) verschillen.'
    },
    gebruikDoelgroep: {
      'Doelgroep': 'unisex rijder die comfort, stilte en laag onderhoud wil (riem + naaf)',
      'Toepassing': 'woon-werk, dagtochten/trekking en stadsritten'
    },
    wettelijkeNoot: {
      'Wettelijke noot (NL/EU)': 'De E-Nova Evo-modellen zijn pedelecs: trapondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u. Daarmee weglegaal als e-bike in NL/EU.'
    }
  },
  features: [
    'Bosch Active Line Plus middenmotor (ca. 50 Nm)',
    'Gates CDX riemaandrijving',
    'Shimano Nexus 8 interne naafversnelling',
    'Koga Feathershock 2.0 voorvork (±30 mm)',
    'Shimano hydraulische schijfremmen (MT400)',
    'B&M Eyc 50 lux koplamp',
    'B&M Toplight 2C Plus achterlicht',
    'Interne kabelgeleiding',
    'Aluminium frame met super smooth welds',
    'Geïntegreerde drager (range-afhankelijk)',
    'Koga geveerde zadelpen',
    'Koga Oversized verstelbare stuurpen',
    '28"/29" wielen met Schwalbe Energizer banden',
    'EU 25 km/u pedelec ondersteuning',
    'Rack-accu of PowerTube frame-accu opties',
    'Bosch Intuvia/Purion display'
  ],
  included: [
    'Koga E-Nova Evo e-bike',
    'Bosch Active Line Plus middenmotor',
    '400/500/625 Wh accu (rack of PowerTube)',
    'Bosch Intuvia/Purion display',
    'Gates CDX riemaandrijving',
    'Shimano Nexus 8 naafversnelling',
    'Shimano hydraulische schijfremmen',
    'Koga Feathershock 2.0 voorvork',
    'B&M Eyc koplamp',
    'B&M Toplight 2C Plus achterlicht',
    'Koga geveerde zadelpen',
    'Koga Oversized stuurpen',
    'Interne kabelgeleiding',
    'Geïntegreerde drager',
    'Handleiding en documentatie',
    'Warranty documentatie'
  ],
  sources: [
    'Koga – E-Nova Evo (rack-accu, Active Line Plus, Gates CDX): modelbeschrijving & accukeuzes (koga.com)',
    'Koga – E-Nova Evo PT / PT Unlimited / PT Pro: PowerTube 400/500/625 Wh, Feathershock 2.0, Intuvia/Purion en trimverschillen; "meest krachtige motor" bij PT Pro (koga.com)',
    'Koga sheets (PDF): Feathershock 2.0 (~30 mm), MT400 remmen, Nexus 8, component-details, gewicht ~27,9 kg (PT) (koga.com)',
    '99spokes – E-Nova Evo (2022/2024) & PT Entry (2024), PT Pro (2025): 50 Nm motor, 500–625 Wh, riem + IGH, gewichten & prijzen (99 Spokes)',
    'Mantel (E-Nova Evo CP 2023): riem + Nexus 8 en stads/trekking positionering (Mantel)'
  ],
  shortOverview: 'De Koga E-Nova Evo is gebouwd voor comfortabel, stil en onderhoudsarm rijden: Bosch middenmotor (Active Line Plus, ~50 Nm), Gates CDX riemaandrijving en Shimano Nexus 8 naaf. Afhankelijk van uitvoering heb je een rack-accu (E-Nova Evo) of de PowerTube-frameaccu (E-Nova Evo PT) met keus uit 400/500/625 Wh. Koga\'s Feathershock 2.0 voorvork filtert oneffenheden; hydraulische schijfremmen zorgen voor controle. EU-topsnelheid 25 km/u. Gewichten: ca. 25,6 kg (E-Nova Evo, 500 Wh) en 27,9 kg (E-Nova Evo PT, 625 Wh).'
})

// Giant Explore E+ 1 specific data
const giantExploreEPlus1 = ref({
  id: 'd90db2d4-e691-4b04-9189-b4064d1c5915',
  brand: 'Giant',
  model_name: 'Explore E+ 1',
  version: 'Trekking/forenzen e-bike (625 Wh, 75 Nm)',
  price: 3299,
  currency: 'EUR',
  images: [
    '/img/Giant Explore E+ 1/MY23ExploreEplus1DD_ColorAMistyForest.jpg',
    '/img/Giant Explore E+ 1/MY23ExploreEplus1DD_ColorAMistyForest_D2.jpg',
    '/img/Giant Explore E+ 1/MY23ExploreEplus1DD_ColorAMistyForest_D3.jpg',
    '/img/Giant Explore E+ 1/MY23ExploreEplus1DD_ColorAMistyForest_D4.jpg',
    '/img/Giant Explore E+ 1/MY23ExploreEplus1DD_ColorAMistyForest_Rear.jpg'
  ],
  image_url: '/img/Giant Explore E+ 1/MY23ExploreEplus1DD_ColorAMistyForest.jpg',
  colors: [
    { name: 'Misty Forest', value: 'misty-forest', available: true },
    { name: 'Zwart', value: 'zwart', available: true },
    { name: 'Grijs', value: 'grijs', available: true },
    { name: 'Blauw', value: 'blauw', available: true }
  ],
  batteries: [
    { name: '625 Wh', value: '625wh', capacity: '625 Wh', range: '50-180 km', price: 3299 },
    { name: '625 Wh + 250 Wh Range Extender', value: '625wh-extender', capacity: '875 Wh', range: '80-250 km', price: 3799 }
  ],
  highlights: [
    'Krachtige aandrijving: SyncDrive Sport2 (Yamaha), 75 Nm, natuurlijke ondersteuning met Smart Assist',
    'Energie & connectiviteit: 625 Wh geïntegreerd; RideControl Dash kleurdisplay + app; 4A snellader. Range-extender 250 Wh compatibel (doorgaans GTS)',
    'Rijcomfort & controle: SR Suntour XCM34 LO, 100 mm; Schwalbe/Giant Crosscut 700×57C; Shimano schijfremmen',
    'Volledig afgemonteerd: MIK HD-drager, spatborden, standaard, Recon HL50 (50 lux) / AXA NYX verlichting',
    'EU-pedelec: ondersteuning tot 25 km/u (US-varianten kunnen per markt Class-3 28 mph hebben)'
  ],
  specifications: {
    filters: {
      'Merk': 'Giant',
      'Model + versie': 'Explore E+ 1 — GTS/STA',
      'Prijs (EU indicatie)': '~€3.099–€3.499 (actie/uitvoering)',
      'Bouwjaar/modeljaar': '2023–2025 (huidige generatie)',
      'Heren/Dames': 'Beide (unisex)',
      'Actieradius': '~50–180 km (conditie-afhankelijk; +250 Wh extender mogelijk)',
      'Accucapaciteit': '625 Wh (EnergyPak Smart) — Plus 250 Wh compatibel (GTS)',
      'Topsnelheid': '25 km/u (EU) | (US: sommige varianten 28 mph)',
      'Vering': '100 mm (SR Suntour XCM34 LO)',
      'Aandrijving': 'Shimano Deore 1×10 (varianten met Alivio 9-sp bestaan)',
      'Remmen': 'Shimano BR-MT200 hydraulisch',
      'Banden': '~700×57C (Crosscut Gravel)',
      'Gewicht': '~27 kg (indicatie)'
    },
    eSystem: {
      'Motor': 'SyncDrive Sport2, 75 Nm (Yamaha)',
      'Accu': 'EnergyPak Smart 625 Wh (uitneembaar, in onderbuis) — Plus 250 Wh range-extender compatibel (m.n. GTS)',
      'Display/remote': 'RideControl Dash (kleur-LCD, USB-C 10 W), app-connect',
      'Lader': '4A Smart Charger (± 60% in ~2:30 u)'
    },
    aandrijvingRemmen: {
      'Versnellingen': 'vaak Shimano Deore 1×10 (LinkGlide) op E+ 1; uitvoeringen met Alivio 9-speed komen voor',
      'Remmen': 'Shimano BR-MT200 hydraulische schijfremmen'
    },
    frameUitrusting: {
      'Frames': 'GTS (high-step) en STA (step-through)',
      'Vork': 'SR Suntour XCM34 LO, 100 mm veerweg',
      'Wielen/banden': '700c, Crosscut Gravel 1/2 ~700×57C (tubeless ready)',
      'Drager': 'MIK HD (max. 27 kg), geïntegreerde spatborden/standaard'
    },
    verlichting: {
      'Voor': 'Giant Recon HL50 (50 lux)',
      'Achter': 'AXA NYX (modeljaarafh.)'
    },
    gewichtLimieten: {
      'Gewicht (indicatie 2023-reeks)': '~27 kg; systeemlimiet 156 kg (fiets+rijder+bagage)',
      'Opmerking': 'kan per maat/trim afwijken'
    },
    actieradius: {
      'Fabrieks-/retaileropgave': '~50–180 km per lading afhankelijk van modus, terrein, wind/temp., bandenspanning, gewicht en onderhoud',
      'Range-extender': '+250 Wh vergroot het bereik merkbaar (GTS)'
    },
    prijsBeschikbaarheid: {
      'Introductieprijs 2023': 'vanaf €3.299 (fabrikant/retailerbericht)',
      'Huidige retailvoorbeelden': '€3.099–€3.499 in EU/NL/IE (afhankelijk van actie, GTS/STA, kleur/maat)'
    },
    gebruikDoelgroep: {
      'Doelgroep': 'Unisex (GTS & STA)',
      'Gebruik': 'trekking / woon-werk / toeren op asfalt, gravel en licht off-road — comfort door 100 mm vork en brede 57 mm banden'
    },
    wettelijkeNoot: {
      'Wettelijke noot (NL/EU)': 'De Explore E+ 1 is in de EU een pedelec: trapondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u. US-versies kunnen Class 3 (28 mph) zijn; dat valt in NL onder speed-pedelec-regels.'
    }
  },
  features: [
    'SyncDrive Sport2 middenmotor (75 Nm, Yamaha)',
    'EnergyPak Smart 625 Wh accu',
    'RideControl Dash kleurdisplay',
    'App-connectiviteit',
    '4A Smart Charger',
    '250 Wh range-extender compatibel (GTS)',
    'SR Suntour XCM34 LO voorvork (100 mm)',
    'Shimano Deore 1×10 versnellingen',
    'Shimano BR-MT200 hydraulische schijfremmen',
    'Giant Crosscut Gravel 700×57C banden',
    'MIK HD bagagedrager (27 kg)',
    'Geïntegreerde spatborden en standaard',
    'Giant Recon HL50 koplamp (50 lux)',
    'AXA NYX achterlicht',
    'GTS (high-step) en STA (step-through) frames',
    'EU 25 km/u pedelec ondersteuning',
    'Tubeless ready wielen',
    'USB-C 10W oplaadpoort'
  ],
  included: [
    'Giant Explore E+ 1 e-bike',
    'SyncDrive Sport2 middenmotor',
    'EnergyPak Smart 625 Wh accu',
    'RideControl Dash kleurdisplay',
    '4A Smart Charger',
    'SR Suntour XCM34 LO voorvork',
    'Shimano Deore 1×10 versnellingen',
    'Shimano BR-MT200 hydraulische schijfremmen',
    'Giant Crosscut Gravel banden',
    'MIK HD bagagedrager',
    'Geïntegreerde spatborden',
    'Standaard',
    'Giant Recon HL50 koplamp',
    'AXA NYX achterlicht',
    'Handleiding en documentatie',
    'Warranty documentatie'
  ],
  sources: [
    'Giant (GB) – Explore E+ 1 GTS 2023: modelpagina met range (50–180 km) en platforminfo (Giant Bicycles)',
    'Cycle Solutions (UK) – Explore E+ 1 GTS: SyncDrive Sport2 75 Nm, 625 Wh, RideControl Dash, XCM34 100 mm, Deore 1×10, BR-MT200 (cyclesolutions.co.uk)',
    'eBike24 – Explore E+ 1 2023 (product & blog): Recon HL50/AXA NYX verlichting, Crosscut ~700×57C, gewicht ~27 kg, MIK HD, extender compatibiliteit, vanaf €3.299 (ebike24.com)',
    '99spokes – component/fork detail & Class-3 nuance per markt: XCM34 coil 100 mm; sommige regio-varianten met hogere topsnelheid (99 Spokes)',
    'HDbike & Duff Cycles (EU retail): actuele EU-prijzen rond €3.099–€3.499 (Duff Cycles)'
  ],
  shortOverview: 'De Giant Explore E+ 1 is een veelzijdige trekking/commuter met SyncDrive Sport2-middenmotor (75 Nm) en een EnergyPak Smart 625 Wh accu. Hij wordt geleverd als GTS (diamond/high-step) en STA (step-through), heeft een 100 mm verende vork en complete stadsuitrusting (spatborden, MIK-bagagedrager, verlichting). RideControl Dash kleurdisplay en optie voor 250 Wh range-extender (meestal op GTS). Fabrieks-/retailerclaims noemen tot ~50–180 km bereik afhankelijk van omstandigheden.'
})

onMounted(async () => {
  const id = route.params.id as string
  const routeName = route.name as string

  // Fetch user's favorites if authenticated
  if (authStore.isAuthenticated) {
    await favoritesStore.fetchFavorites()
  }

  // Check if this is the Aventon Level.2 page
  if (routeName === 'AventonLevel2' || id === '550e8400-e29b-41d4-a716-446655440002') {
    ebike.value = aventonLevel2.value
  }
  // Check if this is the Lectric XP 3.0 page
  else if (routeName === 'LectricXP3' || id === '550e8400-e29b-41d4-a716-446655440001') {
    ebike.value = lectricXP3.value
  }
  // Check if this is the RadRunner 2 page
  else if (routeName === 'RadRunner2' || id === '550e8400-e29b-41d4-a716-446655440003') {
    ebike.value = radRunner2.value
  }
  // Check if this is the Aventon Aventure.2 page
  else if (routeName === 'AventonAventure2' || id === '550e8400-e29b-41d4-a716-446655440004') {
    ebike.value = aventonAventure2.value
  }
  // Check if this is the Trek Allant+ 7 Gen 2 page
  else if (routeName === 'TrekAllant7Gen2' || id === '550e8400-e29b-41d4-a716-446655440005') {
    ebike.value = trekAllant7Gen2.value
  }
  // Check if this is the Giant Explore E+ page
  else if (routeName === 'GiantExploreEPlus' || id === '550e8400-e29b-41d4-a716-446655440006') {
    ebike.value = giantExploreEPlus.value
  }
  // Check if this is the Cannondale Tesoro Neo X 3 page
  else if (routeName === 'CannondaleTesoroNeoX3' || id === '550e8400-e29b-41d4-a716-446655440007') {
    ebike.value = cannondaleTesoroNeoX3.value
  }
  // Check if this is the CUBE Kathmandu Hybrid Pro 625 page
  else if (routeName === 'CubeKathmanduHybridPro625' || id === '550e8400-e29b-41d4-a716-446655440008') {
    ebike.value = cubeKathmanduHybridPro625.value
  }
  // Check if this is the Gazelle Ultimate C380 HMB page
  else if (routeName === 'GazelleUltimateC380HMB' || id === '550e8400-e29b-41d4-a716-446655440009') {
    ebike.value = gazelleUltimateC380HMB.value
  }
  // Check if this is the Riese & Müller Charger4 GT Vario page
  else if (routeName === 'RieseMullerCharger4GTVario' || id === '550e8400-e29b-41d4-a716-446655440010') {
    ebike.value = rieseMullerCharger4GTVario.value
  }
  // Check if this is the Canyon Precede:ON 7 / Precede:ON Comfort 7 page
  else if (routeName === 'CanyonPrecedeON7Comfort7' || id === '550e8400-e29b-41d4-a716-446655440011') {
    ebike.value = canyonPrecedeON7Comfort7.value
  }
  // Check if this is the Orbea Vibe H30 page
  else if (routeName === 'OrbeaVibeH30' || id === '550e8400-e29b-41d4-a716-446655440012') {
    ebike.value = orbeaVibeH30.value
  }
  // Check if this is the VanMoof S5 page
  else if (routeName === 'VanMoofS5' || id === '550e8400-e29b-41d4-a716-446655440013') {
    ebike.value = vanMoofS5.value
  }
  // Check if this is the Batavus Diva E-go page
  else if (routeName === 'BatavusDivaEgo' || id === '550e8400-e29b-41d4-a716-446655440014') {
    ebike.value = batavusDivaEgo.value
  }
  // Check if this is the Sparta e-Speed D11S page
  else if (routeName === 'SpartaESpeedD11S' || id === '550e8400-e29b-41d4-a716-446655440016') {
    ebike.value = spartaESpeedD11S.value
  }
  // Check if this is the Gazelle Ultimate C8+ HMB page
  else if (routeName === 'GazelleUltimateC8HMB' || id === '550e8400-e29b-41d4-a716-446655440018') {
    ebike.value = gazelleUltimateC8HMB.value
  }
  // Check if this is the Koga E-Nova Evo page
  else if (routeName === 'KogaENovaEvo' || id === '550e8400-e29b-41d4-a716-446655440017') {
    ebike.value = kogaENovaEvo.value
  }
  // Check if this is the Giant Explore E+ 1 page
  else if (routeName === 'GiantExploreEPlus1' || id === 'd90db2d4-e691-4b04-9189-b4064d1c5915') {
    ebike.value = giantExploreEPlus1.value
  } else {
    ebike.value = await ebikeStore.fetchEBikeById(id)
  }
  
  // Track e-bike view event
  if (ebike.value) {
    eventTrackingService.trackEBikeView(ebike.value.id, ebike.value.model_name, {
      brand: ebike.value.brand,
      price: ebike.value.price,
      category: ebike.value.category
    })
  }
})

onUnmounted(() => {
  // Clean up keyboard listeners
  removeKeyboardListeners()
  // Restore body overflow in case carousel was open
  document.body.style.overflow = 'auto'
})

const handleAffiliateClick = async () => {
  if (ebike.value) {
    await ebikeStore.trackLead(ebike.value.id)
    
    // Track conversion event
    eventTrackingService.trackConversion('affiliate_click', ebike.value.price, {
      ebike_id: ebike.value.id,
      ebike_name: ebike.value.model_name,
      brand: ebike.value.brand,
      affiliate_url: ebike.value.affiliate_url
    })
    
    window.open(ebike.value.affiliate_url, '_blank')
  }
}

const addToComparison = () => {
  if (comparisonStore.addToComparison(ebike.value)) {
    // Track comparison event
    eventTrackingService.trackEBikeComparison([ebike.value.id], {
      ebike_name: ebike.value.model_name,
      brand: ebike.value.brand
    })
  } else {
    alert(comparisonStore.error)
  }
}

// Image carousel functions
const openImageCarousel = (index: number) => {
  carouselImageIndex.value = index
  showImageCarousel.value = true
  document.body.style.overflow = 'hidden' // Prevent background scrolling
  addKeyboardListeners() // Add keyboard navigation
}

const closeImageCarousel = () => {
  showImageCarousel.value = false
  document.body.style.overflow = 'auto' // Restore scrolling
  removeKeyboardListeners() // Remove keyboard navigation
}

const nextImage = () => {
  if (ebike.value?.images) {
    carouselImageIndex.value = (carouselImageIndex.value + 1) % ebike.value.images.length
  }
}

const prevImage = () => {
  if (ebike.value?.images) {
    carouselImageIndex.value = carouselImageIndex.value === 0 
      ? ebike.value.images.length - 1 
      : carouselImageIndex.value - 1
  }
}

const goToImage = (index: number) => {
  carouselImageIndex.value = index
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!showImageCarousel.value) return
  
  switch (event.key) {
    case 'Escape':
      closeImageCarousel()
      break
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

// Add keyboard event listeners when carousel opens
const addKeyboardListeners = () => {
  document.addEventListener('keydown', handleKeydown)
}

const removeKeyboardListeners = () => {
  document.removeEventListener('keydown', handleKeydown)
}

const isInComparison = computed(() => {
  return comparisonStore.comparisonItems.some(e => e.id === ebike.value?.id)
})

const currentPrice = computed(() => {
  if (!ebike.value?.batteries) return ebike.value?.price || 0
  const selectedBatteryData = ebike.value.batteries.find(b => b.value === selectedBattery.value)
  return selectedBatteryData?.price || ebike.value.price
})

const currentRange = computed(() => {
  if (!ebike.value?.batteries) return ebike.value?.action_radius_km || 0
  const selectedBatteryData = ebike.value.batteries.find(b => b.value === selectedBattery.value)
  return selectedBatteryData?.range?.replace(' km', '') || '72'
})

// Favorite functionality
const isFavorite = computed(() => {
  return ebike.value ? favoritesStore.isFavorite(ebike.value.id) : false
})

const favoriteButtonText = computed(() => {
  return isFavorite.value ? '❤️ Favoriet' : '🤍 Toevoegen aan favorieten'
})

const favoriteButtonClass = computed(() => {
  return isFavorite.value 
    ? 'bg-red-500 text-white hover:bg-red-600 border-red-500' 
    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-400'
})

async function toggleFavorite() {
  if (!authStore.isAuthenticated) {
    // Redirect to login or show login modal
    alert('Je moet ingelogd zijn om e-bikes toe te voegen aan je favorieten.')
    return
  }

  if (!ebike.value) return

  try {
    await favoritesStore.toggleFavorite(ebike.value)
  } catch (error) {
    console.error('Error toggling favorite:', error)
    alert('Er is een fout opgetreden bij het toevoegen/verwijderen van favorieten.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Header />

    <main class="container mx-auto px-4 py-8 pt-24 flex-1">
      <div v-if="ebikeStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        <p class="text-xl mt-4">Laden...</p>
      </div>

      <div v-else-if="ebike" class="max-w-7xl mx-auto">
        <!-- Breadcrumb -->
        <nav class="flex mb-6" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <RouterLink to="/" class="text-gray-700 hover:text-accent">Home</RouterLink>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <RouterLink to="/e-bikes" class="ml-1 text-gray-700 hover:text-accent md:ml-2">E-bikes</RouterLink>
              </div>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-1 text-gray-500 md:ml-2">{{ ebike.brand }} {{ ebike.model_name }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Main Product Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <!-- Image Gallery -->
          <div class="space-y-4">
            <div class="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group" @click="openImageCarousel(selectedImage)">
              <img
                :src="ebike.images?.[selectedImage] || ebike.image_url || '/api/placeholder/600/600'"
                :alt="ebike.model_name"
                class="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                  <svg class="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Thumbnail Gallery -->
            <div v-if="ebike.images" class="grid grid-cols-4 gap-2">
              <button
                v-for="(image, index) in ebike.images"
                :key="index"
                @click="selectedImage = index"
                @dblclick="openImageCarousel(index)"
                :class="[
                  'aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer',
                  selectedImage === index ? 'border-accent' : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <img :src="image" :alt="`${ebike.model_name} view ${index + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Brand & Model -->
            <div>
              <div class="text-sm text-gray-500 mb-2">{{ ebike.brand }}</div>
              <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ ebike.model_name }}</h1>
              <div v-if="ebike.version" class="text-xl text-gray-600 mb-4">{{ ebike.version }}</div>
            </div>

            <!-- Price -->
            <div class="flex items-baseline space-x-4">
              <span class="text-4xl font-bold text-primary">${{ currentPrice.toLocaleString() }}</span>
              <span v-if="ebike.currency !== 'EUR'" class="text-lg text-gray-500">({{ ebike.currency }})</span>
            </div>

            <!-- Battery Selection -->
            <div v-if="ebike.batteries" class="space-y-3">
              <h3 class="text-lg font-semibold">Accu Keuze:</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  v-for="battery in ebike.batteries"
                  :key="battery.value"
                  @click="selectedBattery = battery.value"
                  :class="[
                    'p-4 border-2 rounded-lg text-left transition-all',
                    selectedBattery === battery.value 
                      ? 'border-accent bg-accent/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="font-semibold">{{ battery.name }}</div>
                  <div class="text-sm text-gray-600">{{ battery.capacity }} - {{ battery.range }}</div>
                  <div class="text-sm font-medium text-accent">${{ battery.price.toLocaleString() }}</div>
                </button>
              </div>
            </div>

            <!-- Color Selection -->
            <div v-if="ebike.colors" class="space-y-3">
              <h3 class="text-lg font-semibold">Kleur:</h3>
              <div class="flex space-x-3">
        <button
          v-for="color in ebike.colors"
          :key="color.value"
          @click="selectedColor = color.value"
          :class="[
            'px-4 py-2 border-2 rounded-lg transition-all font-medium',
            selectedColor === color.value
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-gray-400 bg-gray-200 text-gray-800 hover:border-gray-500 hover:bg-gray-300'
          ]"
        >
          {{ color.name }}
        </button>
              </div>
            </div>

            <!-- Key Specs -->
            <div class="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-200">
              <div class="text-center">
                <div class="text-2xl mb-1">🔋</div>
                <div class="font-semibold">{{ currentRange }} km</div>
                <div class="text-sm text-gray-600">Actieradius</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-1">⚡</div>
                <div class="font-semibold">25 km/h</div>
                <div class="text-sm text-gray-600">Topsnelheid</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-1">🏋️</div>
                <div class="font-semibold">150 kg</div>
                <div class="text-sm text-gray-600">Max. gewicht</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-1">📦</div>
                <div class="font-semibold">Opvouwbaar</div>
                <div class="text-sm text-gray-600">Design</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <button 
                @click="handleAffiliateClick" 
                class="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                Bekijk Beste Deal →
              </button>
              
              <!-- External Website Link -->
              <button 
                v-if="getExternalUrl"
                @click="handleExternalLinkClick" 
                class="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors border border-gray-300 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Bezoek Officiële Website
              </button>
              
              <div class="grid grid-cols-3 gap-3">
                <button
                  @click="addToComparison"
                  :disabled="isInComparison"
                  :class="[
                    'py-3 px-4 rounded-lg font-semibold transition-colors border-2 shadow-md',
                    isInComparison
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed border-gray-400'
                      : 'bg-green-500 text-white hover:bg-green-600 border-green-500'
                  ]"
                >
                  {{ isInComparison ? '✓ Toegevoegd' : '+ Vergelijk' }}
                </button>
                
                <button
                  @click="toggleFavorite"
                  :class="[
                    'py-3 px-4 rounded-lg font-semibold transition-colors border-2 shadow-md',
                    favoriteButtonClass
                  ]"
                >
                  {{ favoriteButtonText }}
                </button>
                
                <RouterLink
                  :to="`/afspraak?ebike=${ebike.id}`"
                  class="text-center bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors border-2 border-blue-600"
                >
                  Afspraak
                </RouterLink>
              </div>
            </div>

            <!-- Quick Features -->
            <div class="space-y-2">
              <h3 class="font-semibold">Inbegrepen:</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="item in ebike.included" 
                  :key="item"
                  class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  ✓ {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Highlights Section -->
        <div v-if="ebike.highlights" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
          <h2 class="text-3xl font-bold text-center mb-8">Waarom de {{ ebike.model_name }}?</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="highlight in ebike.highlights" 
              :key="highlight.title"
              class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="text-4xl mb-4">{{ highlight.icon }}</div>
              <h3 class="text-xl font-semibold mb-2">{{ highlight.title }}</h3>
              <p class="text-gray-600">{{ highlight.description }}</p>
            </div>
          </div>
        </div>

        <!-- Short Overview Section -->
        <div v-if="ebike.shortOverview" class="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Kort overzicht</h2>
          <p class="text-gray-700 leading-relaxed">{{ ebike.shortOverview }}</p>
        </div>

        <!-- Tabs Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <!-- Tab Navigation -->
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-8">
        <button
          @click="showSpecs = true; showReviews = false"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
            showSpecs ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-800 hover:text-gray-900 hover:border-gray-400'
          ]"
        >
          Specificaties
        </button>
        <button
          @click="showSpecs = false; showReviews = true"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
            showReviews ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-800 hover:text-gray-900 hover:border-gray-400'
          ]"
        >
          Reviews
        </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-8">
            <!-- Specifications Tab -->
            <div v-if="showSpecs" class="space-y-8">
              <div 
                v-for="(specs, category) in ebike.specifications" 
                :key="category"
                class="space-y-4"
              >
                <h3 class="text-xl font-semibold text-gray-900 capitalize">{{ category }}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="(value, key) in specs" 
                    :key="key"
                    class="flex justify-between py-2 border-b border-gray-100"
                  >
                    <span class="font-medium text-gray-700">{{ key }}:</span>
                    <span class="text-gray-900">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews Tab -->
            <div v-if="showReviews" class="space-y-6">
              <div class="text-center py-12">
                <div class="text-6xl mb-4">⭐</div>
                <h3 class="text-xl font-semibold mb-2">Reviews komen binnenkort</h3>
                <p class="text-gray-600">We zijn bezig met het verzamelen van gebruikersreviews voor deze e-bike.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Features & Accessories -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <!-- Features -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Kenmerken</h3>
            <ul class="space-y-2">
              <li v-for="feature in ebike.features" :key="feature" class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                {{ feature }}
              </li>
            </ul>
          </div>

          <!-- Accessories -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Accessoires</h3>
            <ul class="space-y-2">
              <li v-for="accessory in ebike.accessories" :key="accessory" class="flex items-center">
                <span class="text-blue-500 mr-2">+</span>
                {{ accessory }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Legal Notice for NL -->
        <div class="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-yellow-800 mb-2">⚠️ Belangrijke opmerking voor Nederland</h3>
          <p class="text-yellow-700">
            Voor legaal weggebruik in Nederland moet de e-bike worden begrensd tot 25 km/u, 250W vermogen en alleen pedal-assist (geen gashendel). 
            De XP 3.0 is standaard krachtiger en heeft een gashendel; controleer lokale regelgeving en opties om softwarematig te begrenzen.
          </p>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">🚲</div>
        <h2 class="text-2xl font-semibold mb-2">E-bike niet gevonden</h2>
        <p class="text-gray-600 mb-6">De e-bike die je zoekt bestaat niet of is niet meer beschikbaar.</p>
        <RouterLink to="/e-bikes" class="btn-primary">Bekijk alle e-bikes</RouterLink>
      </div>

      <!-- Sources Section -->
      <div v-if="ebike?.sources" class="max-w-7xl mx-auto mt-12">
        <div class="bg-gray-50 rounded-2xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Bronnen</h2>
          <div class="space-y-3">
            <div 
              v-for="(source, index) in ebike.sources" 
              :key="index"
              class="flex items-start space-x-3"
            >
              <span class="text-blue-600 font-semibold text-sm mt-1">{{ index + 1 }}.</span>
              <span class="text-gray-700 text-sm">{{ source }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
    
    <!-- Enhanced AI Chatbot -->
    <EnhancedAIChatbot />

    <!-- Full-Screen Image Carousel Modal -->
    <div
      v-if="showImageCarousel"
      class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      @click="closeImageCarousel"
    >
      <!-- Close Button -->
      <button
        @click="closeImageCarousel"
        class="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Navigation Arrows -->
      <button
        v-if="ebike?.images && ebike.images.length > 1"
        @click.stop="prevImage"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button
        v-if="ebike?.images && ebike.images.length > 1"
        @click.stop="nextImage"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      <!-- Main Image Container -->
      <div class="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8" @click.stop>
        <img
          v-if="ebike?.images?.[carouselImageIndex]"
          :src="ebike.images[carouselImageIndex]"
          :alt="`${ebike.model_name} - Image ${carouselImageIndex + 1}`"
          class="max-w-full max-h-full object-contain"
        />
        <img
          v-else-if="ebike?.image_url"
          :src="ebike.image_url"
          :alt="ebike.model_name"
          class="max-w-full max-h-full object-contain"
        />
      </div>

      <!-- Image Counter -->
      <div
        v-if="ebike?.images && ebike.images.length > 1"
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm"
      >
        {{ carouselImageIndex + 1 }} / {{ ebike.images.length }}
      </div>

      <!-- Thumbnail Strip -->
      <div
        v-if="ebike?.images && ebike.images.length > 1"
        class="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-4xl overflow-x-auto px-4"
      >
        <button
          v-for="(image, index) in ebike.images"
          :key="index"
          @click.stop="goToImage(index)"
          :class="[
            'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
            carouselImageIndex === index 
              ? 'border-white' 
              : 'border-white border-opacity-50 hover:border-opacity-75'
          ]"
        >
          <img :src="image" :alt="`${ebike.model_name} view ${index + 1}`" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>
  </div>
</template>
