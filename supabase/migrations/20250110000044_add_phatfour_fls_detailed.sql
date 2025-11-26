-- Add Phatfour FLS - Lage zit, stads fat-bike with comprehensive details
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
  'phatfour-fls-detailed',
  'Phatfour',
  'FLS',
  'Lage zit, stads fat-bike',
  0.00,
  'EUR',
  '2024-01-01',
  'unisex',
  '470 Wh: ~25–45 km · 630 Wh: ~40–65 km (stand/condities afhankelijk)',
  65,
  630,
  '25 km/u (EU-pedelec)',
  25.00,
  '/src/img/Phatfour FLS/website_sides.235.1_1728x.webp',
  'https://phatfour.nl/products/fls',
  25.0,
  '# Phatfour FLS — Lage zit, stads fat-bike (36 V 13–17,5 Ah ≈ 470–630 Wh, Bafang 250 W, 25 km/u)

**Kort overzicht**  
De Phatfour FLS (serie) is de lagere-zithoogte-variant binnen de Nederlandse Phatfour-lijn. Hij gebruikt een Bafang SWXH achternaafmotor (EU 250 W) met keuze uit 36 V 13 Ah (~470 Wh) of 36 V 17,5 Ah (~630 Wh) accu. Fabrieksopgave noemt ~25–65 km bereik (afhankelijk van accu en stand). Laden gebeurt met een 42 V / 2 A lader (~5 uur tot vol, ~80 min tot ~50%). Verder: Shimano 7-speed, hydraulische schijfremmen (Tektro 180 mm), 20×4,25″ Kenda banden en kleuren-LCD met USB. Opmerking: de huidige catalogus voert vooral de FLS+ (doorontwikkeling met o.a. geveerde voorvork); onderstaande kernspecs en accukeuzes gelden voor de FLS-reeks in EU-trim.

## Highlights

- **Natuurlijke ondersteuning:** Bafang SWXH achternaaf, 250 W (EU), ondersteuning tot 25 km/u.
- **Accu-opties:** 36 V 13 Ah (~470 Wh) of 17,5 Ah (~630 Wh), uitneembaar en vergrendelbaar.
- **Praktische actieradius:** ~25–45 km (470 Wh) of ~40–65 km (630 Wh) volgens opgave/rijstand.
- **Controle & veiligheid:** hydraulische remmen met Tektro 180 mm schijven; LED-koplamp.
- **Gebruiksgemak:** Shimano 7-speed, kleur-LCD (snelheid, accu, afstand) met USB-uitgang.
- **FLS vs FLS+:** FLS+ voegt o.a. geveerde, hydraulisch gedempte voorvork en vernieuwde elektronica (9 modi) toe.

## Specificaties

**Algemeen**
- Merk/Model: Phatfour FLS (serie)
- Doelgroep: Unisex (one-size)
- Categorie: Stads/fun fat-bike (lage zithoogte)
- Gewicht: ~35 kg incl. accu (model/batch afhankelijk)

**Motor**
- Motor: Bafang SWXH achternaaf (geared, brushless)
- Vermogen (EU): 250 W (pedelec)
- Ondersteuning: tot 25 km/u (EU-instelling)
- Display/bediening: Kleur-LCD (snelheid, accustatus, afstand, assist-niveaus) + USB-lading

**Accu**
- Accu-opties: 36 V / 13 Ah ≈ 470 Wh of 36 V / 17,5 Ah ≈ 630 Wh
- Beide uitneembaar (Unit Pack Power), vergrendelbaar
- Laden: 42 V / 2 A; ~5 uur tot vol, ~80 min tot ~50%
- Bereik (opgave): 470 Wh: ~25–45 km · 630 Wh: ~40–65 km (stand/condities afhankelijk)

**Frame**
- Frame: Staal, dubbel gecoat; handgestikt skai-leren zadel
- Zithoogte/ergonomie: lage zit (FLS-reeks); FLS+ met geveerde vork en vernieuwde elektronica (9 modi)
- Verlichting: LED koplamp (accuvoeding)

**Wielen**
- Wielen: 20″ × 3,5″
- Banden: Kenda 20×4,25″ (fat)
- Remmen: hydraulische schijfremmen met Tektro 180 mm rotors
- Versnellingen: Shimano 7-speed derailleur

**Features**
- Poorten: USB-uitgang aan het display
- Rijderlengte (richtwaarde): ~155–180 cm (opgave FLS-pagina)

## Prijs & beschikbaarheid

- **Richtprijs:** Op aanvraag (Phatfour)
- **Waar te koop:** https://phatfour.nl/products/fls

## Wettelijke noot (NL/EU)

**Pedelec**: trapondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u.

## Links

- **Waar te koop:** https://phatfour.nl/products/fls
- **Bron(nen):** phatfour.nl',
  '[
    "/src/img/Phatfour FLS/website_sides.235.1_1728x.webp",
    "/src/img/Phatfour FLS/website_sides.236.1_1728x.webp",
    "/src/img/Phatfour FLS/website_sides.238_1728x.webp"
  ]'::jsonb,
  '[
    {"name": "Black", "value": "black", "available": true},
    {"name": "White", "value": "white", "available": true},
    {"name": "Red", "value": "red", "available": true}
  ]'::jsonb,
  '[
    {
      "icon": "⚡",
      "title": "Natuurlijke ondersteuning",
      "description": "Bafang SWXH achternaaf, 250 W (EU), ondersteuning tot 25 km/u"
    },
    {
      "icon": "🔋",
      "title": "Accu-opties",
      "description": "36 V 13 Ah (~470 Wh) of 17,5 Ah (~630 Wh), uitneembaar en vergrendelbaar"
    },
    {
      "icon": "📏",
      "title": "Praktische actieradius",
      "description": "~25–45 km (470 Wh) of ~40–65 km (630 Wh) volgens opgave/rijstand"
    },
    {
      "icon": "🛡️",
      "title": "Controle & veiligheid",
      "description": "hydraulische remmen met Tektro 180 mm schijven; LED-koplamp"
    },
    {
      "icon": "⚙️",
      "title": "Gebruiksgemak",
      "description": "Shimano 7-speed, kleur-LCD (snelheid, accu, afstand) met USB-uitgang"
    },
    {
      "icon": "🚀",
      "title": "FLS vs FLS+",
      "description": "FLS+ voegt o.a. geveerde, hydraulisch gedempte voorvork en vernieuwde elektronica (9 modi) toe"
    }
  ]'::jsonb,
  '{
    "algemeen": {
      "merk_model": "Phatfour FLS (serie)",
      "doelgroep": "Unisex (one-size)",
      "categorie": "Stads/fun fat-bike (lage zithoogte)",
      "gewicht": "~35 kg incl. accu (model/batch afhankelijk)",
      "rijderlengte": "~155–180 cm (opgave FLS-pagina)"
    },
    "motor": {
      "motor": "Bafang SWXH achternaaf (geared, brushless)",
      "vermogen_eu": "250 W (pedelec)",
      "ondersteuning": "tot 25 km/u (EU-instelling)",
      "display_bediening": "Kleur-LCD (snelheid, accustatus, afstand, assist-niveaus) + USB-lading"
    },
    "accu": {
      "accu_opties": "36 V / 13 Ah ≈ 470 Wh of 36 V / 17,5 Ah ≈ 630 Wh",
      "type": "Beide uitneembaar (Unit Pack Power), vergrendelbaar",
      "laden": "42 V / 2 A; ~5 uur tot vol, ~80 min tot ~50%",
      "bereik_opgave": "470 Wh: ~25–45 km · 630 Wh: ~40–65 km (stand/condities afhankelijk)"
    },
    "frame": {
      "frame": "Staal, dubbel gecoat; handgestikt skai-leren zadel",
      "zithoogte_ergonomie": "lage zit (FLS-reeks); FLS+ met geveerde vork en vernieuwde elektronica (9 modi)",
      "verlichting": "LED koplamp (accuvoeding)"
    },
    "wielen": {
      "wielen": "20″ × 3,5″",
      "banden": "Kenda 20×4,25″ (fat)",
      "remmen": "hydraulische schijfremmen met Tektro 180 mm rotors",
      "versnellingen": "Shimano 7-speed derailleur"
    },
    "features": {
      "poorten": "USB-uitgang aan het display"
    }
  }'::jsonb,
  '[
    "EU EPAC gecertificeerd",
    "Bafang SWXH achternaafmotor 250W",
    "Twee accu-opties (470Wh/630Wh)",
    "Shimano 7-speed derailleur",
    "Hydraulische schijfremmen (Tektro 180mm)",
    "Kleur-LCD display",
    "USB-uitgang",
    "LED koplamp",
    "Uitneembare accu",
    "Kenda 20×4,25″ fat-banden",
    "Lage zithoogte",
    "Staal frame dubbel gecoat",
    "Handgestikt skai-leren zadel",
    "One-size fits all",
    "Nederlandse kwaliteit"
  ]'::jsonb,
  35.0,
  '20"',
  '20×4,25″',
  'Staal (dubbel gecoat)',
  'Bafang SWXH achternaaf (geared, brushless)',
  250,
  0.0,
  'Li-ion (Unit Pack Power)',
  36,
  17.5,
  5.0,
  'Hydraulische schijfremmen (Tektro 180mm)',
  'Shimano 7-speed derailleur',
  'Geen',
  'LED koplamp (accuvoeding)',
  'Kleur-LCD (snelheid, accustatus, afstand, assist-niveaus)',
  '{"app": false, "gps": false, "bluetooth": false, "usb": true}'::jsonb,
  2,
  'EU EPAC',
  NOW(),
  NOW()
);
