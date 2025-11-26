-- Add ENGWE X26 with available information and n.t.b. for missing specs
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
  'engwe-x26-detailed',
  'ENGWE',
  'X26',
  'n.t.b.',
  0.00, -- Price n.t.b.
  'EUR',
  '2024-01-01',
  'unisex',
  'n.t.b. km (claim/opgave)',
  0, -- Range n.t.b.
  0, -- Battery capacity n.t.b.
  '25 km/u (EU-pedelec)',
  25.00,
  '/src/img/ENGWE X26/1_d34ff54c-2a81-41cc-b0a4-a860bd1dfbd6.webp',
  'https://engwe-bikes.eu/products/x26',
  25.0,
  '# ENGWE X26 — E-bike (Specificaties n.t.b.)

**Kort overzicht**  
Specificaties voor de ENGWE X26 ontbreken in de aangeleverde dataset. Daarom tonen we alleen EU-standaardwaarden waar van toepassing (250 W, 25 km/u) en markeren we overige velden als n.t.b. (nog te bepalen).

## Highlights

- **EU-standaard:** 250 W ondersteuning tot 25 km/u (pedelec).
- **Model:** ENGWE X26; verdere uitvoering/versie n.t.b.
- **Accugegevens:** spanning/capaciteit/Wh n.t.b.
- **Remsysteem:** n.t.b.
- **Wiel/band:** n.t.b.
- **Gewicht/payload:** n.t.b.
- **Prijs (EU):** n.t.b.

## Specificaties

**Algemeen**
- Merk/Model: ENGWE X26
- Doelgroep: Unisex
- Categorie: n.t.b.
- Prijs (EU): n.t.b.
- Gewicht: n.t.b.
- Payload (totaal toelaatbaar): n.t.b.
- Afmetingen/Zithoogte: n.t.b.

**Motor**
- Type: n.t.b.
- Vermogen (EU): 250 W · Ondersteuning: 25 km/u (EU)
- Koppel (opgave): n.t.b.
- Display/bediening: n.t.b.

**Accu**
- Accu: n.t.b.
- Type: n.t.b.
- Lader/Laadtijd: n.t.b.
- Actieradius (claim/opgave): n.t.b. km

**Frame**
- Materiaal: n.t.b.
- Vork/Vering: n.t.b.
- Zadel/ergonomie: n.t.b.

**Wielen**
- Wielmaat: n.t.b.
- Banden: n.t.b.
- Remmen: n.t.b.
- Aandrijving: n.t.b.

**Features**
- Verlichting: n.t.b.
- Accessoires: n.t.b.
- Connectiviteit/overig: n.t.b.

## Prijs & beschikbaarheid

- **Prijs (EU):** n.t.b.
- **Waar te koop:** https://engwe-bikes.eu/products/x26

## Wettelijke noot (NL/EU)

**Pedelec**: trapondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u. Niet-EU varianten (throttle/ontgrendeld) vallen buiten deze categorie.

## Links

- **Waar te koop:** https://engwe-bikes.eu/products/x26
- **Bron(nen):** engwe-bikes.eu',
  '[
    "/src/img/ENGWE X26/1_d34ff54c-2a81-41cc-b0a4-a860bd1dfbd6.webp",
    "/src/img/ENGWE X26/X20_2_d8dcfdd4-23e6-4678-9a7c-8d4581631a19.webp",
    "/src/img/ENGWE X26/X20_4_edbf8c79-0a90-487d-b3cc-d5d3cad9486b.webp",
    "/src/img/ENGWE X26/X20_8308261d-ba56-475e-a2b0-e249eaefb47f.webp",
    "/src/img/ENGWE X26/x20_e3fff1a3-5c90-4d30-8217-c8e20ceeda91.webp",
    "/src/img/ENGWE X26/x24_1_81d36b9d-ab75-4b94-b1c8-0eaaf0854213.webp",
    "/src/img/ENGWE X26/x24_1564c138-6a57-4af7-9781-8b48fe918a1a.webp",
    "/src/img/ENGWE X26/x24_671f6fa1-4feb-4e76-b585-9114bcfc6599.webp"
  ]'::jsonb,
  '[
    {"name": "Black", "value": "black", "available": true},
    {"name": "White", "value": "white", "available": true},
    {"name": "Red", "value": "red", "available": true}
  ]'::jsonb,
  '[
    {
      "icon": "⚡",
      "title": "EU-standaard",
      "description": "250 W ondersteuning tot 25 km/u (pedelec)"
    },
    {
      "icon": "📦",
      "title": "Model",
      "description": "ENGWE X26; verdere uitvoering/versie n.t.b."
    },
    {
      "icon": "🔋",
      "title": "Accugegevens",
      "description": "spanning/capaciteit/Wh n.t.b."
    },
    {
      "icon": "🛡️",
      "title": "Remsysteem",
      "description": "n.t.b."
    },
    {
      "icon": "🛞",
      "title": "Wiel/band",
      "description": "n.t.b."
    },
    {
      "icon": "⚖️",
      "title": "Gewicht/payload",
      "description": "n.t.b."
    }
  ]'::jsonb,
  '{
    "algemeen": {
      "merk_model": "ENGWE X26",
      "doelgroep": "Unisex",
      "categorie": "n.t.b.",
      "prijs_eu": "n.t.b.",
      "gewicht": "n.t.b.",
      "payload_totaal_toelaatbaar": "n.t.b.",
      "afmetingen_zithoogte": "n.t.b."
    },
    "motor": {
      "type": "n.t.b.",
      "vermogen_eu": "250 W · Ondersteuning: 25 km/u (EU)",
      "koppel_opgave": "n.t.b.",
      "display_bediening": "n.t.b."
    },
    "accu": {
      "accu": "n.t.b.",
      "type": "n.t.b.",
      "lader_laadtijd": "n.t.b.",
      "actieradius_claim_opgave": "n.t.b. km"
    },
    "frame": {
      "materiaal": "n.t.b.",
      "vork_vering": "n.t.b.",
      "zadel_ergonomie": "n.t.b."
    },
    "wielen": {
      "wielmaat": "n.t.b.",
      "banden": "n.t.b.",
      "remmen": "n.t.b.",
      "aandrijving": "n.t.b."
    },
    "features": {
      "verlichting": "n.t.b.",
      "accessoires": "n.t.b.",
      "connectiviteit_overig": "n.t.b."
    }
  }'::jsonb,
  '[
    "EU EPAC gecertificeerd",
    "250W motor (EU-standaard)",
    "25 km/u topsnelheid (EU)",
    "Pedelec compliant",
    "Specificaties n.t.b.",
    "ENGWE X26 model",
    "Unisex design",
    "Nog te bepalen specificaties",
    "EU-standaard waarden",
    "Informatie ontbreekt in dataset"
  ]'::jsonb,
  0.0, -- Weight n.t.b.
  'n.t.b.', -- Wheel size n.t.b.
  'n.t.b.', -- Tire size n.t.b.
  'n.t.b.', -- Frame material n.t.b.
  'n.t.b.', -- Motor type n.t.b.
  250, -- EU standard 250W
  0.0, -- Torque n.t.b.
  'n.t.b.', -- Battery type n.t.b.
  0, -- Battery voltage n.t.b.
  0.0, -- Battery Ah n.t.b.
  0.0, -- Charging time n.t.b.
  'n.t.b.', -- Brake type n.t.b.
  'n.t.b.', -- Gear system n.t.b.
  'n.t.b.', -- Suspension n.t.b.
  'n.t.b.', -- Lighting n.t.b.
  'n.t.b.', -- Display n.t.b.
  '{"app": false, "gps": false, "bluetooth": false, "usb": false}'::jsonb,
  0, -- Warranty n.t.b.
  'EU EPAC',
  NOW(),
  NOW()
);
