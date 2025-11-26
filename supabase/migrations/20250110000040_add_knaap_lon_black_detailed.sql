-- Add Knaap LON (Black) - Fat-tire stads e-bike with comprehensive details
INSERT INTO ebikes (
  id,
  brand,
  model_name,
  version,
  price,
  currency,
  build_date,
  gender_type,
  action_radius_text,
  action_radius_km,
  battery_capacity,
  top_speed_text,
  top_speed_kmh,
  image_url,
  affiliate_url,
  cpl_rate,
  description,
  images,
  colors,
  highlights,
  specifications,
  features,
  weight_kg,
  wheel_size,
  tire_size,
  frame_material,
  motor_type,
  motor_power_w,
  torque_nm,
  battery_type,
  battery_voltage,
  battery_ah,
  charging_time_hours,
  brake_type,
  gear_system,
  suspension,
  lighting,
  display,
  connectivity,
  warranty_years,
  certification,
  created_at,
  updated_at
) VALUES (
  'knaap-lon-black-detailed',
  'Knaap',
  'LON',
  'Black - Fat-tire stads e-bike',
  2549.00,
  'EUR',
  '2024-01-01',
  'unisex',
  'tot ~80 km per lading (conditie/stand afhankelijk)',
  80,
  960,
  '25 km/u (EU-pedelec)',
  25.00,
  '/src/img/Knaap LON/KNAAP-LON-Black-Edition-600x600.jpg',
  'https://knaap.nl/products/lon-black',
  25.0,
  '# Knaap LON (Black) — Fat-tire stads e-bike (48 V 20 Ah ≈ 960 Wh, 250 W)

**Kort overzicht**  
De Knaap LON (Black) is een stoere, stadsgerichte fat-bike met 48 V / 20 Ah (≈ 960 Wh) accu en een EU-legale 250 W achternaafmotor (ANANDA). Hij rijdt tot 25 km/u, remt met hydraulische schijfremmen en rolt op 20×4.0″ banden. Met Shimano 7-versnellingen, LED-verlichting voor/achter en kleur/LCD-display is hij klaar voor woon-werk en vrije tijd. Bereik (retaileropgave): tot ~80 km per lading; laadtijd ~4–6 uur. Richtprijs: € 2.549.

## Highlights

- **Krachtige hub-aandrijving:** ANANDA achternaaf, 250 W (48 V), ondersteuning tot 25 km/u (EU).
- **Grote accu:** 48 V / 20 Ah ≈ 960 Wh; laden ~4–6 uur met 230 V-lader.
- **Controle & veiligheid:** hydraulische schijfremmen, LED-verlichting voor/achter.
- **Transmissie:** Shimano 7-speed derailleur.
- **Comfort & grip:** 20×4.0″ banden; starre vork voor direct stuurgedrag.
- **Praktische details:** LON heeft compacte stadsafmetingen (ca. 1760×900×1160 mm) en 37,5 kg rijklaar gewicht (retailer).

## Specificaties

**Algemeen**
- Merk/Model: Knaap LON (Black)
- Doelgroep: Unisex
- Categorie: Fat-tire stads e-bike / moped-stijl
- Prijs (EU): € 2.549 (opgegeven)
- Gewicht: ~37,5 kg (retaileropgave)
- Afmetingen: ca. 1760 × 900 × 1160 mm (retailer)
- Payload: n.t.b.

**Motor**
- Motor: ANANDA achternaaf (brushless)
- Vermogen: 250 W (EU)
- Voedingsspanning: 48 V
- Ondersteuning: 25 km/u (EU-pedelec)
- Bediening/Display: LED/kleur-display (snelheid, accu, km-teller)

**Accu**
- Accu: 48 V / 20 Ah ≈ 960 Wh (Li-ion), uitneembaar en vergrendelbaar
- Bereik (opgave): tot ~80 km (conditie/stand afhankelijk)
- Lader / laadtijd: ~4–6 uur via standaard 230 V-stopcontact

**Frame**
- Frame: aluminium (moped-stijl), one-size
- Vork: starre voorvork (rigid)
- Zadel: lang zadel; retailer vermeldt 1-persoons configuratie voor LON-variant

**Wielen**
- Wielmaat: 20″
- Banden: 20×4.0″ street/anti-lek (retailer)
- Remmen: hydraulische schijfremmen voor & achter
- Aandrijving: Shimano 7-speed derailleur

**Features**
- Verlichting: LED koplamp & achterlicht (accuvoeding)
- Assist-niveaus: 5 ondersteuningsstanden (Knaap-spec)
- Accessoires: spatborden, dragers, telefoonhouder, slot/alarm (opties)
- Waterdichtheid: spatwaterbestendig (IP-rating niet gespecificeerd)

## Prijs & beschikbaarheid

- **Richtprijs:** € 2.549 (EU-store, Black variant)

## Wettelijke noot (NL/EU)

Dit model is een **pedelec**: trapondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u. Controleer lokale regels/verzekering en dealerconfiguratie.

## Links

- **Waar te koop:** https://knaap.nl/products/lon-black
- **Bron(nen):** knaap.nl',
  '[
    "/src/img/Knaap LON/KNAAP-LON-Black-Edition-600x600.jpg",
    "/src/img/Knaap LON/KNAAP-LON-Zwart-fatbikeskopen_nl-2.webp",
    "/src/img/Knaap LON/KNAAP-LON-Zwart-fatbikeskopen_nl-3.webp",
    "/src/img/Knaap LON/KNAAP-LON-Zwart-fatbikeskopen_nl-4.webp",
    "/src/img/Knaap LON/KNAAP-LON-Zwart-fatbikeskopen_nl-5.webp",
    "/src/img/Knaap LON/KNAAP-LON-Zwart-fatbikeskopen_nl-6.webp",
    "/src/img/Knaap LON/KNAAP-LON-Zwart-fatbikeskopen_nl-7.webp",
    "/src/img/Knaap LON/KNAAP-LON-Zwart-fatbikeskopen_nl-8.webp",
    "/src/img/Knaap LON/Knaaplon-600x600-1.png"
  ]'::jsonb,
  '[
    {"name": "Black", "value": "black", "available": true},
    {"name": "White", "value": "white", "available": true},
    {"name": "Red", "value": "red", "available": true}
  ]'::jsonb,
  '[
    {
      "icon": "⚡",
      "title": "Krachtige hub-aandrijving",
      "description": "ANANDA achternaaf, 250 W (48 V), ondersteuning tot 25 km/u (EU)"
    },
    {
      "icon": "🔋",
      "title": "Grote accu",
      "description": "48 V / 20 Ah ≈ 960 Wh; laden ~4–6 uur met 230 V-lader"
    },
    {
      "icon": "🛡️",
      "title": "Controle & veiligheid",
      "description": "Hydraulische schijfremmen, LED-verlichting voor/achter"
    },
    {
      "icon": "⚙️",
      "title": "Transmissie",
      "description": "Shimano 7-speed derailleur"
    },
    {
      "icon": "🛞",
      "title": "Comfort & grip",
      "description": "20×4.0″ banden; starre vork voor direct stuurgedrag"
    },
    {
      "icon": "📏",
      "title": "Praktische details",
      "description": "Compacte stadsafmetingen (ca. 1760×900×1160 mm) en 37,5 kg rijklaar gewicht"
    }
  ]'::jsonb,
  '{
    "algemeen": {
      "merk_model": "Knaap LON (Black)",
      "doelgroep": "Unisex",
      "categorie": "Fat-tire stads e-bike / moped-stijl",
      "prijs_eu": "€ 2.549 (opgegeven)",
      "gewicht": "~37,5 kg (retaileropgave)",
      "afmetingen": "ca. 1760 × 900 × 1160 mm (retailer)",
      "payload": "n.t.b."
    },
    "motor": {
      "motor": "ANANDA achternaaf (brushless)",
      "vermogen": "250 W (EU)",
      "voedingsspanning": "48 V",
      "ondersteuning": "25 km/u (EU-pedelec)",
      "bediening_display": "LED/kleur-display (snelheid, accu, km-teller)"
    },
    "accu": {
      "accu": "48 V / 20 Ah ≈ 960 Wh (Li-ion), uitneembaar en vergrendelbaar",
      "bereik_opgave": "tot ~80 km (conditie/stand afhankelijk)",
      "lader_laadtijd": "~4–6 uur via standaard 230 V-stopcontact",
      "extender": "n.v.t."
    },
    "frame": {
      "frame": "aluminium (moped-stijl), one-size",
      "vork": "starre voorvork (rigid)",
      "zadel": "lang zadel; retailer vermeldt 1-persoons configuratie voor LON-variant"
    },
    "wielen": {
      "wielmaat": "20″",
      "banden": "20×4.0″ street/anti-lek (retailer)",
      "remmen": "hydraulische schijfremmen voor & achter",
      "aandrijving_versnellingen": "Shimano 7-speed derailleur"
    },
    "features": {
      "verlichting": "LED koplamp & achterlicht (accuvoeding)",
      "assist_niveaus": "5 ondersteuningsstanden (Knaap-spec)",
      "accessoires_opties": "spatborden, dragers, telefoonhouder, slot/alarm",
      "waterdichtheid": "spatwaterbestendig (IP-rating niet gespecificeerd)"
    }
  }'::jsonb,
  '[
    "EU EPAC gecertificeerd",
    "ANANDA achternaafmotor 250W",
    "48V voedingsspanning",
    "Shimano 7-speed derailleur",
    "Hydraulische schijfremmen",
    "LED-verlichting voor/achter",
    "LED/kleur-display",
    "Uitneembare accu",
    "Lang zadel (1-persoons configuratie)",
    "Anti-lek streetbanden",
    "Spatwaterbestendig",
    "Aluminium frame",
    "5 ondersteuningsstanden",
    "Compacte stadsafmetingen"
  ]'::jsonb,
  37.5,
  '20"',
  '20×4.0″',
  'Aluminium',
  'ANANDA achternaaf (brushless)',
  250,
  0.0,
  'Li-ion',
  48,
  20.0,
  5.0,
  'Hydraulische schijfremmen voor & achter',
  'Shimano 7-speed derailleur',
  'Starre voorvork (rigid)',
  'LED koplamp & achterlicht',
  'LED/kleur-display (snelheid, accu, km-teller)',
  '{"app": false, "gps": false, "bluetooth": false, "lcd": true, "led_color": true}'::jsonb,
  2,
  'EU EPAC',
  NOW(),
  NOW()
);
