-- Add SUPER73 ZX with comprehensive details
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
  'super73-zx-detailed',
  'SUPER73',
  'ZX',
  'Fat-tire e-bike (EU)',
  2499.00,
  'EUR',
  '2024-01-01',
  'unisex',
  '~60 km per lading (sterk afhankelijk van rijstand, wind/temperatuur, bandenspanning, terrein en totaalgewicht)',
  60,
  480,
  '25 km/u (EU-pedelec)',
  25.00,
  '/src/img/SUPER73 ZX/1844817042.jpg',
  'https://eu.super73.com/products/super73-zx',
  25.0,
  '# SUPER73 ZX — Fat-tire e-bike (48 V 10 Ah ≈ 480 Wh, 25 km/u EU)

**Kort overzicht**  
De SUPER73 ZX (EU) is de toegankelijke, stadsgerichte fat-bike in de Z-serie. Hij heeft een EU-legale 250 W achternaafmotor en een 48 V / 10 Ah (≈ 480 Wh) accu. De 20×4″ Trooper-banden geven veel grip en comfort; schijfremmen zorgen voor controle. Fabrieks/retaileropgave: ~60 km bereik per lading (afhankelijk van stand, wegdek en omstandigheden). EU-topsnelheid 25 km/u (pedelec).

## Highlights

- **Soepele aandrijving:** EU-gelimiteerde 250 W naafmotor (pedelec).
- **Energiepakket:** 48 V / 10 Ah ≈ 480 Wh accu.
- **Actieradius (claim/opgave):** ~60 km onder gunstige omstandigheden.
- **Controle & comfort:** schijfremmen en brede 20×4″ Trooper-banden.
- **Gebruiksgemak:** one-size moped-stijl frame; doorgaans single-speed in EU-spec.

## Specificaties

**E-systeem**
- Motor: achternaaf 250 W (EU)
- Accu: 48 V / 10 Ah ≈ 480 Wh
- Ondersteuning: tot 25 km/u (EU-pedelec)

**Frame & remmen**
- Frame: aluminium, moped-stijl, one-size
- Remmen: schijfremmen

**Wielen & banden**
- Wielen: 20″
- Banden: 20×4″ (SUPER73 Trooper)

## Actieradius

**Claim/opgave:** ~60 km per lading (sterk afhankelijk van rijstand, wind/temperatuur, bandenspanning, terrein en totaalgewicht).

## Wettelijke noot (NL/EU)

Deze fiets is een **pedelec**: ondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u.

## Filters (voor jullie e-bike categorie)

- **Merk:** SUPER73
- **Model + versie:** ZX
- **Prijs (EU indicatie):** € 2.499
- **Heren/Dames:** Unisex
- **Actieradius:** ~60 km (claim/opgave)
- **Accucapaciteit:** ≈ 480 Wh (48 V / 10 Ah)
- **Topsnelheid:** 25 km/u (EU)
- **Wielmaat/banden:** 20″ / 20×4″
- **Remmen:** Schijfremmen
- **Bijzonderheden:** EU EPAC, toegankelijke Z-serie, single-speed (EU-spec)

## Links

- **Waar te koop:** https://eu.super73.com/products/super73-zx
- **Bron(nen):** eu.super73.com',
  '[
    "/src/img/SUPER73 ZX/1844817042.jpg",
    "/src/img/SUPER73 ZX/1844817045.jpg",
    "/src/img/SUPER73 ZX/1844817048.jpg",
    "/src/img/SUPER73 ZX/1844817051.jpg",
    "/src/img/SUPER73 ZX/1844817054.jpg",
    "/src/img/SUPER73 ZX/1844817057.jpg",
    "/src/img/SUPER73 ZX/1844817060.jpg"
  ]'::jsonb,
  '[
    {"name": "Black", "value": "black", "available": true},
    {"name": "White", "value": "white", "available": true},
    {"name": "Red", "value": "red", "available": true}
  ]'::jsonb,
  '[
    {
      "icon": "⚡",
      "title": "Soepele aandrijving",
      "description": "EU-gelimiteerde 250 W naafmotor (pedelec)"
    },
    {
      "icon": "🔋",
      "title": "Energiepakket",
      "description": "48 V / 10 Ah ≈ 480 Wh accu"
    },
    {
      "icon": "📍",
      "title": "Actieradius",
      "description": "~60 km onder gunstige omstandigheden"
    },
    {
      "icon": "🛡️",
      "title": "Controle & comfort",
      "description": "Schijfremmen en brede 20×4″ Trooper-banden"
    },
    {
      "icon": "🚴‍♂️",
      "title": "Gebruiksgemak",
      "description": "One-size moped-stijl frame; single-speed in EU-spec"
    }
  ]'::jsonb,
  '{
    "e_systeem": {
      "motor": "achternaaf 250 W (EU)",
      "accu": "48 V / 10 Ah ≈ 480 Wh",
      "ondersteuning": "tot 25 km/u (EU-pedelec)"
    },
    "frame_remmen": {
      "frame": "aluminium, moped-stijl, one-size",
      "remmen": "schijfremmen"
    },
    "wielen_banden": {
      "wielen": "20″",
      "banden": "20×4″ (SUPER73 Trooper)"
    }
  }'::jsonb,
  '[
    "EU EPAC gecertificeerd",
    "Toegankelijke Z-serie",
    "Single-speed setup",
    "Moped-stijl frame",
    "Schijfremmen",
    "Trooper-banden",
    "One-size fits all"
  ]'::jsonb,
  22.0,
  '20"',
  '20×4″',
  'Aluminium',
  'Achternaaf 250 W (EU)',
  250,
  0.0,
  'Lithium-ion',
  48,
  10.0,
  4.0,
  'Schijfremmen',
  'Single-speed',
  'Geen',
  'Geïntegreerde LED verlichting',
  'Geen display',
  '{"app": false, "gps": false, "bluetooth": false}'::jsonb,
  2,
  'EU EPAC',
  NOW(),
  NOW()
);
