-- Add Knaap BCN (Black) - Full-suspension fat-tire stads e-bike with comprehensive details
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
  'knaap-bcn-black-detailed',
  'Knaap',
  'BCN',
  'Black - Full-suspension fat-tire stads e-bike',
  2549.00,
  'EUR',
  '2024-01-01',
  'unisex',
  'tot ~140 km per lading (stand/condities afhankelijk)',
  140,
  960,
  '25 km/u (EU-pedelec)',
  25.00,
  '/src/img/Knaap BCN/17292455812.jpg',
  'https://knaap.nl/products/bcn-black',
  25.0,
  '# Knaap BCN (Black) — Full-suspension fat-tire stads e-bike (48 V 20 Ah ≈ 960 Wh, 250 W, 25 km/u)

**Kort overzicht**  
De Knaap BCN (Black) is de geveerde variant voor stedelijk gebruik: voor- én achterschokdemper, een ANANDA 250 W achternaafmotor en een uitneembare 48 V / 20 Ah (≈ 960 Wh) accu. Je krijgt een full-color LCD-display met USB-poort, Shimano 7-versnellingen, hydraulische schijfremmen en 20″×4.0 stadsbanden. Knaap claimt tot ~140 km per lading; vol laden in ~4–6 uur. Richtprijs/Shop: € 2.549.

## Highlights

- **Volledig geveerd comfort:** voor- én achtervering dempt klinkers en slecht wegdek; stabiel en speels in de stad.
- **Krachtige hub-aandrijving:** ANANDA 250 W (EU) met opgegeven tot ~80 Nm koppel; ondersteuning tot 25 km/u (pedelec).
- **Grote accu & praktische range:** 48 V / 20 Ah ≈ 960 Wh; opgave tot ~140 km, laden ~4–6 uur.
- **Controle & zichtbaarheid:** hydraulische schijfremmen, LED-verlichting (voor/achter), full-color display met USB.
- **Compleet afgemonteerd:** Shimano 7-speed derailleur, 20×4.0 banden, verstelbaar stuur, leren zadel/grepen.

## Specificaties

**Algemeen**
- Merk/Model: Knaap BCN (Black)
- Doelgroep: Unisex
- Categorie: Fat-tire stads e-bike, full-suspension
- Prijs (EU): € 2.549 (Knaap shop)
- Gewicht: 39,5 kg (Knaap spec) *Sommige aanbieders melden lager rijklaar gewicht; reken met 31–39,5 kg afhankelijk van uitvoering.
- Afmetingen: compact moped-stijl; verstelbaar stuur

**Motor**
- Motor: ANANDA achternaaf (brushless, geared)
- Vermogen: 250 W nominaal (EU)
- Koppel (max, opgave): ~80 Nm
- Ondersteuning: 25 km/u (EU-pedelec)
- Display/bediening: Full-color LCD met USB-poort (snelheid, accu, km-teller)

**Accu**
- Accu: 48 V / 20 Ah ≈ 960 Wh, uitneembaar en vergrendelbaar
- Bereik (opgave): tot ~140 km (stand/condities afhankelijk)
- Laden: ~4–6 uur; retailers noemen 3 A lader (specificatie varieert)

**Frame**
- Frame: Aluminium moped-stijl, one-size
- Vering: voorvork + achterschokdemper (double-suspension)
- Ergonomie/afwerking: verstelbaar stuur, leren zadel en handvatten

**Wielen**
- Wielmaat: 20″
- Banden: 20×4.0 (street/urban)
- Remmen: hydraulische schijfremmen (Knaap); sommige retailers vermelden Tektro-sets
- Aandrijving: Shimano 7-speed derailleur

**Features**
- Verlichting: LED koplamp & achterlicht
- Waterdichtheid: water-/schokbestendig display; spatwaterbestendige opbouw
- Overig: removable battery, brushless motor; accessoires zoals spatborden/dragers beschikbaar

## Prijs & beschikbaarheid

- **Richtprijs:** € 2.549 (Knaap shop, Black variant)

## Wettelijke noot (NL/EU)

Dit model valt onder **pedelec-regels**: trapondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u. Controleer lokale regelgeving en verzekeringsplicht.

## Links

- **Waar te koop:** https://knaap.nl/products/bcn-black
- **Bron(nen):** knaap.nl',
  '[
    "/src/img/Knaap BCN/17292455812.jpg",
    "/src/img/Knaap BCN/17292455813.jpg",
    "/src/img/Knaap BCN/17292455814.jpg",
    "/src/img/Knaap BCN/17292455815.jpg",
    "/src/img/Knaap BCN/17292455816.jpg",
    "/src/img/Knaap BCN/17292455817.jpg",
    "/src/img/Knaap BCN/17292455818.jpg",
    "/src/img/Knaap BCN/17599213921.jpg"
  ]'::jsonb,
  '[
    {"name": "Black", "value": "black", "available": true},
    {"name": "Deep Green", "value": "deep-green", "available": true},
    {"name": "White", "value": "white", "available": true}
  ]'::jsonb,
  '[
    {
      "icon": "🛡️",
      "title": "Volledig geveerd comfort",
      "description": "Voor- én achtervering dempt klinkers en slecht wegdek; stabiel en speels in de stad"
    },
    {
      "icon": "⚡",
      "title": "Krachtige hub-aandrijving",
      "description": "ANANDA 250 W (EU) met opgegeven tot ~80 Nm koppel; ondersteuning tot 25 km/u (pedelec)"
    },
    {
      "icon": "🔋",
      "title": "Grote accu & praktische range",
      "description": "48 V / 20 Ah ≈ 960 Wh; opgave tot ~140 km, laden ~4–6 uur"
    },
    {
      "icon": "🛡️",
      "title": "Controle & zichtbaarheid",
      "description": "Hydraulische schijfremmen, LED-verlichting (voor/achter), full-color display met USB"
    },
    {
      "icon": "⚙️",
      "title": "Compleet afgemonteerd",
      "description": "Shimano 7-speed derailleur, 20×4.0 banden, verstelbaar stuur, leren zadel/grepen"
    }
  ]'::jsonb,
  '{
    "algemeen": {
      "merk_model": "Knaap BCN (Black)",
      "doelgroep": "Unisex",
      "categorie": "Fat-tire stads e-bike, full-suspension",
      "prijs_eu": "€ 2.549 (Knaap shop)",
      "gewicht": "39,5 kg (Knaap spec) *Sommige aanbieders melden lager rijklaar gewicht; reken met 31–39,5 kg afhankelijk van uitvoering.",
      "afmetingen": "compact moped-stijl; verstelbaar stuur"
    },
    "motor": {
      "motor": "ANANDA achternaaf (brushless, geared)",
      "vermogen": "250 W nominaal (EU)",
      "koppel_max_opgave": "~80 Nm",
      "ondersteuning": "25 km/u (EU-pedelec)",
      "display_bediening": "Full-color LCD met USB-poort (snelheid, accu, km-teller)"
    },
    "accu": {
      "accu": "48 V / 20 Ah ≈ 960 Wh, uitneembaar en vergrendelbaar",
      "bereik_opgave": "tot ~140 km (stand/condities afhankelijk)",
      "laden": "~4–6 uur; retailers noemen 3 A lader (specificatie varieert)"
    },
    "frame": {
      "frame": "Aluminium moped-stijl, one-size",
      "vering": "voorvork + achterschokdemper (double-suspension)",
      "ergonomie_afwerking": "verstelbaar stuur, leren zadel en handvatten"
    },
    "wielen": {
      "wielmaat": "20″",
      "banden": "20×4.0 (street/urban)",
      "remmen": "hydraulische schijfremmen (Knaap); sommige retailers vermelden Tektro-sets (nauwkeurige typeaanduiding verschilt per batch)",
      "aandrijving": "Shimano 7-speed derailleur"
    },
    "features": {
      "verlichting": "LED koplamp & achterlicht",
      "waterdichtheid": "water-/schokbestendig display; spatwaterbestendige opbouw",
      "overig": "removable battery, brushless motor; accessoires zoals spatborden/dragers beschikbaar"
    }
  }'::jsonb,
  '[
    "EU EPAC gecertificeerd",
    "Full-suspension (voor- en achtervering)",
    "ANANDA achternaafmotor 250W",
    "80 Nm koppel",
    "Shimano 7-speed derailleur",
    "Hydraulische schijfremmen",
    "LED-verlichting voor/achter",
    "Full-color LCD-display met USB-poort",
    "Uitneembare accu",
    "Verstelbaar stuur",
    "Leren zadel en handvatten",
    "Anti-lek streetbanden",
    "Water-/schokbestendig",
    "Aluminium frame",
    "Double-suspension systeem"
  ]'::jsonb,
  39.5,
  '20"',
  '20×4.0″',
  'Aluminium',
  'ANANDA achternaaf (brushless, geared)',
  250,
  80.0,
  'Li-ion',
  48,
  20.0,
  5.0,
  'Hydraulische schijfremmen (Knaap/Tektro)',
  'Shimano 7-speed derailleur',
  'Voorvork + achterschokdemper (double-suspension)',
  'LED koplamp & achterlicht',
  'Full-color LCD met USB-poort (snelheid, accu, km-teller)',
  '{"app": false, "gps": false, "bluetooth": false, "lcd": true, "usb": true, "full_color": true}'::jsonb,
  2,
  'EU EPAC',
  NOW(),
  NOW()
);
