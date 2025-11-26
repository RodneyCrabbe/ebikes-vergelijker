-- Add Urban Drivestyle UNI MK Classic - Utility/fat-tire stads e-bike with comprehensive details
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
  'urban-drivestyle-uni-mk-classic-detailed',
  'Urban Drivestyle',
  'UNI MK Classic',
  'Utility/fat-tire stads e-bike',
  0.00,
  'EUR',
  '2024-01-01',
  'unisex',
  'tot ~100 km (conditie-afhankelijk)',
  100,
  684,
  '25 km/u (pedelec, EU)',
  25.00,
  '/src/img/Urban Drivestyle UNI MK Classic/Urban-Drivestyle-Uni-Mk-Classic-900x900.jpg',
  'https://urbandrivestyle.com/products/uni-mk-classic',
  25.0,
  '# Urban Drivestyle UNI MK Classic — Utility/fat-tire stads e-bike (48 V ~14,25 Ah ≈ 684 Wh, 250 W EU, 20×4.0″)

**Kort overzicht**  
De UNI MK Classic is Urban Drivestyle''s iconische moped-style utility e-bike met Chromoly stalen frame, lange zitting (geschikt voor twee personen) en dikke 20×4.0″ banden. De EU-versie gebruikt een 48 V accu van ca. 14,25 Ah (≈ 684 Wh) en een EU-legale 250 W achternaafmotor. Platformgegevens noemen tot ~100 km bereik (conditie-afhankelijk), max. toelaatbaar totaalgewicht 185 kg, zithoogte ~84 cm en 9 PAS-niveaus met (dubbele) torsiesensor.

## Highlights

- **Utility-platform voor 2 personen:** lange zitting, goedgekeurd voor twee; totaalgewicht tot 185 kg.
- **Energie & range:** 48 V ~14,25 Ah ≈ 684 Wh accu, tot ~100 km opgave; 6–8 u laadtijd.
- **Soepele ondersteuning:** EU 250 W achternaaf; 9 ondersteuningsniveaus met (double) torque sensor.
- **Controle & comfort:** hydraulische schijfremmen en 20×4.0″ banden; stabiel Chromoly frame.
- **Volledig afgemonteerd:** 7-speed mechanische versnellingen, grote LED-koplamp, accessoires-ecosysteem (dragers, pegs, etc.).

## Specificaties

**Algemeen**
- Merk/Model: Urban Drivestyle UNI MK Classic
- Doelgroep: Unisex (one-size, lange zitting voor 1–2 personen)
- Categorie: Utility / moped-style fat-tire stads e-bike
- Gewicht: ~33–35 kg inclusief accu (bron/uitvoering afhankelijk)
- Afmetingen/zit: 171,5×71×110 cm, zithoogte ~84 cm
- Max. toelaatbaar totaalgewicht: 185 kg

**Motor**
- Type: Achternaafmotor (Bafang-familie op platform)
- Vermogen (EU): 250 W nominaal
- Ondersteuning: tot 25 km/u (pedelec, EU)
- Sensoren/bediening: (Double) torque sensor, 9 PAS-niveaus; LCD-display met snelheid/ODO e.d.

**Accu**
- Accu: 48 V ~14,25 Ah ≈ 684 Wh (Panasonic/Samsung cells; "Silverfish"-vormfactor)
- Uitneembaar: Ja (vergrendelbaar), onder het zadel geplaatst
- Laadtijd (indicatie): ~6–8 uur tot vol
- Opgegeven bereik: tot ~100 km (sterk afhankelijk van gewicht, terrein, bandenspanning, temp., rijstand)

**Frame**
- Materiaal: Chromoly staal (utility-platform)
- Zit/ergo: Lange seat-bench, geschikt voor 2; multi-rack/accessoire-opties
- Verlichting: Grote LED-koplamp + achterlicht (accuvoeding)

**Wielen**
- Wielen/banden: 20″ wielen met 20×4.0″ (Kenda/all-terrain) banden
- Remmen: Hydraulische schijfremmen (Tektro-familie veel gezien)
- Aandrijving: 7-speed mechanische derailleur

**Features**
- Toepassing: For Fun, Family & Work; cargo/passagier-opties
- Accessoires: Dragers, pegs/voetsteunen, tassen, kinderzit(s) compatibele set-ups (via UD-ecosysteem)

## Prijs & beschikbaarheid

- **Richtprijs:** Op aanvraag (Urban Drivestyle)
- **Waar te koop:** https://urbandrivestyle.com/products/uni-mk-classic

## Wettelijke noot (NL/EU)

**Pedelec**: trapondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u. Let op: reviews uit de VS tonen soms 500–750 W en throttle—dit zijn niet-EU uitvoeringen.

## Links

- **Waar te koop:** https://urbandrivestyle.com/products/uni-mk-classic
- **Bron(nen):** thepack.news, urbandrivestyle.com',
  '[
    "/src/img/Urban Drivestyle UNI MK Classic/Urban-Drivestyle-Uni-Mk-Classic-900x900.jpg",
    "/src/img/Urban Drivestyle UNI MK Classic/urban-drivestyle-uni-moke-mk-classic-zwart.webp"
  ]'::jsonb,
  '[
    {"name": "Black", "value": "black", "available": true},
    {"name": "White", "value": "white", "available": true},
    {"name": "Red", "value": "red", "available": true}
  ]'::jsonb,
  '[
    {
      "icon": "👥",
      "title": "Utility-platform voor 2 personen",
      "description": "lange zitting, goedgekeurd voor twee; totaalgewicht tot 185 kg"
    },
    {
      "icon": "🔋",
      "title": "Energie & range",
      "description": "48 V ~14,25 Ah ≈ 684 Wh accu, tot ~100 km opgave; 6–8 u laadtijd"
    },
    {
      "icon": "⚡",
      "title": "Soepele ondersteuning",
      "description": "EU 250 W achternaaf; 9 ondersteuningsniveaus met (double) torque sensor"
    },
    {
      "icon": "🛡️",
      "title": "Controle & comfort",
      "description": "hydraulische schijfremmen en 20×4.0″ banden; stabiel Chromoly frame"
    },
    {
      "icon": "⚙️",
      "title": "Volledig afgemonteerd",
      "description": "7-speed mechanische versnellingen, grote LED-koplamp, accessoires-ecosysteem (dragers, pegs, etc.)"
    }
  ]'::jsonb,
  '{
    "algemeen": {
      "merk_model": "Urban Drivestyle UNI MK Classic",
      "doelgroep": "Unisex (one-size, lange zitting voor 1–2 personen)",
      "categorie": "Utility / moped-style fat-tire stads e-bike",
      "gewicht": "~33–35 kg inclusief accu (bron/uitvoering afhankelijk)",
      "afmetingen_zit": "171,5×71×110 cm, zithoogte ~84 cm",
      "max_toelaatbaar_totaalgewicht": "185 kg"
    },
    "motor": {
      "type": "Achternaafmotor (Bafang-familie op platform)",
      "vermogen_eu": "250 W nominaal",
      "ondersteuning": "tot 25 km/u (pedelec, EU)",
      "sensoren_bediening": "(Double) torque sensor, 9 PAS-niveaus; LCD-display met snelheid/ODO e.d."
    },
    "accu": {
      "accu": "48 V ~14,25 Ah ≈ 684 Wh (Panasonic/Samsung cells; \"Silverfish\"-vormfactor)",
      "uitneembaar": "Ja (vergrendelbaar), onder het zadel geplaatst",
      "laadtijd_indicatie": "~6–8 uur tot vol",
      "opgegeven_bereik": "tot ~100 km (sterk afhankelijk van gewicht, terrein, bandenspanning, temp., rijstand)"
    },
    "frame": {
      "materiaal": "Chromoly staal (utility-platform)",
      "zit_ergo": "Lange seat-bench, geschikt voor 2; multi-rack/accessoire-opties",
      "verlichting": "Grote LED-koplamp + achterlicht (accuvoeding)"
    },
    "wielen": {
      "wielen_banden": "20″ wielen met 20×4.0″ (Kenda/all-terrain) banden",
      "remmen": "Hydraulische schijfremmen (Tektro-familie veel gezien)",
      "aandrijving": "7-speed mechanische derailleur"
    },
    "features": {
      "toepassing": "For Fun, Family & Work; cargo/passagier-opties",
      "accessoires": "Dragers, pegs/voetsteunen, tassen, kinderzit(s) compatibele set-ups (via UD-ecosysteem)"
    }
  }'::jsonb,
  '[
    "EU EPAC gecertificeerd",
    "Achternaafmotor 250W (Bafang-familie)",
    "9 PAS-niveaus met double torque sensor",
    "7-speed mechanische derailleur",
    "Hydraulische schijfremmen (Tektro)",
    "LCD-display met snelheid/ODO",
    "Uitneembare accu (684Wh)",
    "Kenda 20×4.0″ all-terrain banden",
    "Grote LED-koplamp + achterlicht",
    "Lange zitting (1-2 personen)",
    "Chromoly stalen frame",
    "Utility-platform",
    "Max. 185kg totaalgewicht",
    "Multi-rack/accessoire-opties",
    "For Fun, Family & Work",
    "Cargo/passagier-opties",
    "UD-ecosysteem accessoires"
  ]'::jsonb,
  34.0,
  '20"',
  '20×4.0″',
  'Chromoly staal',
  'Achternaafmotor (Bafang-familie)',
  250,
  0.0,
  'Li-ion (Panasonic/Samsung cells)',
  48,
  14.25,
  7.0,
  'Hydraulische schijfremmen (Tektro)',
  '7-speed mechanische derailleur',
  'Geen',
  'Grote LED-koplamp + achterlicht',
  'LCD-display met snelheid/ODO',
  '{"app": false, "gps": false, "bluetooth": false, "usb": false}'::jsonb,
  2,
  'EU EPAC',
  NOW(),
  NOW()
);
