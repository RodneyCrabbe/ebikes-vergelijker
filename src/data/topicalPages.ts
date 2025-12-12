export interface TopicalPage {
  slug: string
  title: string
  template: string
  intent: string
  description: string
  criteria: string[]
  ebikeIds: string[]
  partnerStores?: string[]
}

export const partnerStores = [
  'Fietsenwinkel.nl',
  '12GO Biking',
  'Mantel',
  'Bol.com',
  'Coolblue',
  'Decathlon',
  'Halfords',
  'BikeRepublic'
]

export const topicalPages: TopicalPage[] = [
  {
    slug: '/beste-e-bikes/onder-1500-euro',
    title: 'Beste e-bikes onder 1500 euro',
    template: 'Budget',
    intent: 'Prijszoekers met hoge koopbereidheid',
    description: 'Selectie van instap- en midrange-modellen onder €1.500 met degelijke actieradius en NL-legale ondersteuning.',
    criteria: [
      'Prijsplafond €1.500 voor maximale prijsspecificiteit',
      'Minimaal 60 km praktische actieradius',
      'Bekende merken en EU-legale ondersteuning (25 km/u)'
    ],
    ebikeIds: [
      '550e8400-e29b-41d4-a716-446655440001', // Lectric XP 3.0
      '550e8400-e29b-41d4-a716-446655440002', // Aventon Level.2
      '550e8400-e29b-41d4-a716-446655440003', // RadRunner 2
      'fiido-m1-pro-detailed',
      'engwe-ep2-pro-detailed',
      '550e8400-e29b-41d4-a716-446655440116', // Aventon Soltera 2
      '550e8400-e29b-41d4-a716-446655440124' // SUPER73 ZX (EU)
    ]
  },
  {
    slug: '/e-bikes-voor/ouderen/lage-instap',
    title: 'Elektrische fietsen voor ouderen met lage instap',
    template: 'Doelgroep + Behoefte',
    intent: 'Comfort en veiligheid voor senioren',
    description: 'Lage instap, comfortabele geometrie en stabiele ondersteuning voor dagelijks gebruik.',
    criteria: [
      'Lage of comfortabele instap en rechte zithouding',
      'Rustige ondersteuning en stabiele remmen',
      'NL-legale topsnelheid en stadsgericht bereik'
    ],
    ebikeIds: [
      '550e8400-e29b-41d4-a716-446655440014', // Batavus Diva E-go
      '550e8400-e29b-41d4-a716-446655440120', // Batavus Diva E-go (variant)
      '550e8400-e29b-41d4-a716-446655440018', // Gazelle Ultimate C8+ HMB
      '550e8400-e29b-41d4-a716-446655440009', // Gazelle Ultimate C380 HMB
      '550e8400-e29b-41d4-a716-446655440112', // Gazelle Ultimate C380 HMB (variant)
      '550e8400-e29b-41d4-a716-446655440017', // Koga E-Nova Evo
      '550e8400-e29b-41d4-a716-446655440122', // Koga E-Nova Evo (variant)
      '550e8400-e29b-41d4-a716-446655440121', // Sparta e-Speed D11S
      '550e8400-e29b-41d4-a716-446655440016', // Sparta e-Speed D11S (variant)
      '550e8400-e29b-41d4-a716-446655440100' // Trek FX+ 1
    ]
  },
  {
    slug: '/motor/midden/bosch',
    title: 'E-bikes met Bosch middenmotor',
    template: 'Motor Positie & Merk',
    intent: 'Koopintentie rond motorplatform',
    description: 'Bosch middenmotoren voor natuurlijk rijgevoel, sterk koppel en goede service-dekking.',
    criteria: [
      'Bosch middenmotor (Performance/Active/Cargo line)',
      'Betrouwbare dealers & onderdelen-ecosysteem',
      'Geschikt voor heuvels en zwaardere berijders'
    ],
    ebikeIds: [
      '550e8400-e29b-41d4-a716-446655440010', // R&M Charger4 GT Vario
      '550e8400-e29b-41d4-a716-446655440113', // R&M Charger4 GT Vario (variant)
      '550e8400-e29b-41d4-a716-446655440108', // R&M Load 75
      '550e8400-e29b-41d4-a716-446655440008', // CUBE Kathmandu Hybrid Pro 625
      '550e8400-e29b-41d4-a716-446655440128', // Cube Longtail Sport Hybrid 725
      '550e8400-e29b-41d4-a716-446655440005', // Trek Allant+ 7 Gen 2
      '550e8400-e29b-41d4-a716-446655440126', // Trek Allant+ 7 Gen 2 (variant)
      '550e8400-e29b-41d4-a716-446655440017', // Koga E-Nova Evo
      '550e8400-e29b-41d4-a716-446655440122', // Koga E-Nova Evo (variant)
      '550e8400-e29b-41d4-a716-446655440018', // Gazelle Ultimate C8+ HMB
      '550e8400-e29b-41d4-a716-446655440009', // Gazelle Ultimate C380 HMB
      '550e8400-e29b-41d4-a716-446655440112', // Gazelle Ultimate C380 HMB (variant)
      '550e8400-e29b-41d4-a716-446655440119', // Kalkhoff Endeavour 7.B Move
      '550e8400-e29b-41d4-a716-446655440011' // Canyon Precede:ON 7
    ]
  },
  {
    slug: '/aandrijving/riemaandrijving',
    title: 'E-bikes met riemaandrijving (belt drive)',
    template: 'Aandrijving',
    intent: 'Onderhoudsarme pendelaars en stadsrijders',
    description: 'Riemaandrijving + naaf of Enviolo voor stille, onderhoudsarme kilometers in weer en wind.',
    criteria: [
      'Riem + naaf/Enviolo voor minimale kettingzorg',
      'Ideaal voor dagelijks woon-werk en regenweer',
      'Extra aantrekkelijk voor leaserijders en fleet'
    ],
    ebikeIds: [
      '550e8400-e29b-41d4-a716-446655440009', // Gazelle Ultimate C380 HMB
      '550e8400-e29b-41d4-a716-446655440112', // Gazelle Ultimate C380 HMB (variant)
      '550e8400-e29b-41d4-a716-446655440010', // R&M Charger4 GT Vario
      '550e8400-e29b-41d4-a716-446655440113', // R&M Charger4 GT Vario (variant)
      'knaap-nyc-detailed', // Belt-drive stads e-bike
      '550e8400-e29b-41d4-a716-446655440103', // Cowboy 4 ST
      '550e8400-e29b-41d4-a716-446655440104', // VanMoof S5
      '550e8400-e29b-41d4-a716-446655440013' // VANMOOF S5 (variant)
    ]
  },
  {
    slug: '/gebruik/woon-werk/15-30-km',
    title: 'Beste e-bikes voor 15–30 km woon-werk',
    template: 'Woon-werk afstand',
    intent: 'Accu-bereik afgestemd op dagelijkse rit',
    description: 'Modellen met ≥80 km opgegeven bereik, efficiënte ondersteuning en commuter-ergonomie.',
    criteria: [
      'Minimaal 80 km opgegeven bereik bij eco/standaard modus',
      'Comfortabele geometrie en spatborden/dragers mogelijk',
      'Betrouwbare remmen voor dagelijks verkeer'
    ],
    ebikeIds: [
      '550e8400-e29b-41d4-a716-446655440012', // Orbea Vibe H30
      '550e8400-e29b-41d4-a716-446655440011', // Canyon Precede:ON 7
      '550e8400-e29b-41d4-a716-446655440100', // Trek FX+ 1
      '550e8400-e29b-41d4-a716-446655440007', // Cannondale Tesoro Neo X 3
      '550e8400-e29b-41d4-a716-446655440102', // Cannondale Tesoro Neo X 3 (variant)
      '550e8400-e29b-41d4-a716-446655440101', // Specialized Turbo Vado SL 5.0 EQ
      '550e8400-e29b-41d4-a716-446655440005', // Trek Allant+ 7 Gen 2
      '550e8400-e29b-41d4-a716-446655440126', // Trek Allant+ 7 Gen 2 (variant)
      '550e8400-e29b-41d4-a716-446655440018', // Gazelle Ultimate C8+ HMB
      '550e8400-e29b-41d4-a716-446655440009', // Gazelle Ultimate C380 HMB
      '550e8400-e29b-41d4-a716-446655440112', // Gazelle Ultimate C380 HMB (variant)
      '550e8400-e29b-41d4-a716-446655440015', // Giant Explore E+ 1
      '550e8400-e29b-41d4-a716-446655440127' // Giant Explore E+ 1 (variant)
    ]
  },
  {
    slug: '/gewicht/lichtgewicht/camper',
    title: 'Lichtgewicht e-bikes voor camper en caravan',
    template: 'Vakantie & Gewicht',
    intent: 'Draagbaar op drager, makkelijk tillen',
    description: 'Onder de ~22 kg, compact en eenvoudig te laden op een fietsendrager of in de camper.',
    criteria: [
      '<= 22 kg rijklaar gewicht waar beschikbaar',
      'Compact of vouwbaar frame voor opslag',
      'Actieradius minimaal 50–70 km voor dagtochten'
    ],
    ebikeIds: [
      '550e8400-e29b-41d4-a716-446655440116', // Aventon Soltera 2
      '550e8400-e29b-41d4-a716-446655440103', // Cowboy 4 ST
      '550e8400-e29b-41d4-a716-446655440104', // VanMoof S5
      '550e8400-e29b-41d4-a716-446655440109', // Brompton Electric P Line
      '550e8400-e29b-41d4-a716-446655440111', // GoCycle G4
      '550e8400-e29b-41d4-a716-446655440101', // Specialized Turbo Vado SL 5.0 EQ
      '550e8400-e29b-41d4-a716-446655440100', // Trek FX+ 1
      '550e8400-e29b-41d4-a716-446655440110', // Tern Vektron S10
      '550e8400-e29b-41d4-a716-446655440124' // SUPER73 ZX (EU)
    ]
  },
  {
    slug: '/fatbikes/legaal-zonder-gashendel',
    title: 'Legale fatbikes zonder gashendel',
    template: 'Legale Fatbike',
    intent: 'Zekerheid over regelgeving en verzekering',
    description: 'EU-pedelec configuraties (25 km/u) zonder gashendel, met verlichting en remmen volgens NL-regels.',
    criteria: [
      '25 km/u ondersteuning, geen gashendel vereist',
      'Verlichting en remmen conform NL verkeersregels',
      'Duidelijke specificaties voor verzekering/helm'
    ],
    ebikeIds: [
      '550e8400-e29b-41d4-a716-446655440001', // Lectric XP 3.0
      '550e8400-e29b-41d4-a716-446655440003', // RadRunner 2
      'knaap-ams-x-black-detailed',
      'knaap-ams-x-ice-blue-detailed',
      'knaap-rtd-x-detailed',
      'knaap-lon-black-detailed',
      'knaap-bcn-black-detailed',
      'knaap-lax-detailed',
      'phatfour-fls-detailed',
      'phatfour-flb-detailed',
      'phatfour-flx-detailed',
      '550e8400-e29b-41d4-a716-446655440129', // Phatfour FLS variant
      '550e8400-e29b-41d4-a716-446655440130', // Phatfour FLB variant
      '550e8400-e29b-41d4-a716-446655440131', // Phatfour FLX variant
      'urban-drivestyle-uni-mk-classic-detailed',
      '550e8400-e29b-41d4-a716-446655440125', // Urban Drivestyle UNI MK Classic variant
      'engwe-ep2-pro-detailed',
      'fiido-m1-pro-detailed',
      'super73-s2-detailed',
      'super73-zx-detailed'
    ]
  },
  {
    slug: '/bakfietsen/2-kinderen',
    title: 'Elektrische bakfietsen voor 2 kinderen',
    template: 'Bakfiets Gezinssamenstelling',
    intent: 'Veilig vervoer van gezin + bagage',
    description: 'Stabiele bak- en longtail-fietsen die twee kids (en extra bagage) veilig meenemen.',
    criteria: [
      'Minimaal ruimte/last voor twee kinderen',
      'Stabiele remmen en lage instap',
      'Sterke middenmotor of cargo-tuning'
    ],
    ebikeIds: [
      '550e8400-e29b-41d4-a716-446655440107', // Urban Arrow Family
      '550e8400-e29b-41d4-a716-446655440108', // R&M Load 75
      '550e8400-e29b-41d4-a716-446655440117', // Tern GSD S00
      '550e8400-e29b-41d4-a716-446655440128' // Cube Longtail Sport Hybrid 725
    ]
  },
  {
    slug: '/levertijd/direct-leverbaar',
    title: 'E-bikes direct leverbaar',
    template: 'Direct Leverbaar',
    intent: 'Aankoopnu of snelle vervanging',
    description: 'Modellen die doorgaans op voorraad zijn of snel geleverd kunnen worden volgens retailers.',
    criteria: [
      'Prijs en actuele modellen (geen TBD-prijzen)',
      'Standaard EU-pedelec configuratie',
      'Sterke voorraad- en dealernetwerken'
    ],
    ebikeIds: [
      '550e8400-e29b-41d4-a716-446655440001', // Lectric XP 3.0
      '550e8400-e29b-41d4-a716-446655440002', // Aventon Level.2
      '550e8400-e29b-41d4-a716-446655440003', // RadRunner 2
      '550e8400-e29b-41d4-a716-446655440004', // Aventon Aventure.2
      '550e8400-e29b-41d4-a716-446655440115', // RadCity 5 Plus
      '550e8400-e29b-41d4-a716-446655440116', // Aventon Soltera 2
      '550e8400-e29b-41d4-a716-446655440014', // Batavus Diva E-go
      '550e8400-e29b-41d4-a716-446655440012', // Orbea Vibe H30
      '550e8400-e29b-41d4-a716-446655440011', // Canyon Precede:ON 7
      '550e8400-e29b-41d4-a716-446655440005', // Trek Allant+ 7 Gen 2
      '550e8400-e29b-41d4-a716-446655440007', // Cannondale Tesoro Neo X 3
      '550e8400-e29b-41d4-a716-446655440018', // Gazelle Ultimate C8+ HMB
      '550e8400-e29b-41d4-a716-446655440017', // Koga E-Nova Evo
      '550e8400-e29b-41d4-a716-446655440103', // Cowboy 4 ST
      '550e8400-e29b-41d4-a716-446655440104', // VanMoof S5
      '550e8400-e29b-41d4-a716-446655440100', // Trek FX+ 1
      '550e8400-e29b-41d4-a716-446655440119' // Kalkhoff Endeavour 7.B Move
    ]
  },
  {
    slug: '/vergelijk/gazelle-vs-koga',
    title: 'Gazelle vs Koga: welke e-bike past bij jou?',
    template: 'Vergelijking (Vs.)',
    intent: 'Bottom-of-funnel vergelijking',
    description: 'Directe vergelijking tussen populaire Nederlandse merken voor forenzen en lange ritten.',
    criteria: [
      'Comfort-geometrie en commuter focus',
      'Bosch middenmotor en riem/naaf-opties',
      'Sterk dealernetwerk en servicepunten in NL'
    ],
    ebikeIds: [
      '550e8400-e29b-41d4-a716-446655440018', // Gazelle Ultimate C8+ HMB
      '550e8400-e29b-41d4-a716-446655440009', // Gazelle Ultimate C380 HMB
      '550e8400-e29b-41d4-a716-446655440112', // Gazelle Ultimate C380 HMB (variant)
      '550e8400-e29b-41d4-a716-446655440017', // Koga E-Nova Evo
      '550e8400-e29b-41d4-a716-446655440122' // Koga E-Nova Evo (variant)
    ],
    partnerStores: ['12GO Biking', 'Fietsenwinkel.nl', 'Mantel']
  }
]

export function getTopicalPageBySlug(slug: string) {
  return topicalPages.find(page => page.slug === slug)
}



