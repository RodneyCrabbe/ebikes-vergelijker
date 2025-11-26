-- Add SUPER73 S2 with comprehensive details
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
  'super73-s2-detailed',
  'SUPER73',
  'S2',
  'Fat-tire e-bike (EU)',
  3499.00,
  'EUR',
  '2024-01-01',
  'unisex',
  '~64–120 km per lading (sterk afhankelijk van rijstand, wind/temperatuur, bandenspanning, terrein en totaalgewicht)',
  110,
  960,
  '25 km/u (EU-pedelec)',
  25.00,
  '/src/img/SUPER73 S2/super73-S2-gal-black-01.jpg',
  'https://eu.super73.com/products/super73-s2-bone-white',
  25.0,
  '# SUPER73 S2 — Fat-tire e-bike (48 V 20 Ah ≈ 960 Wh, 25 km/u EU)

**Kort overzicht**  
De SUPER73 S2 (EU) is een straatgerichte fat-tire e-bike met 48 V / 20 Ah (≈ 960 Wh) accu en een EU-legale 250 W achternaafmotor. De brede 20×4,5–5,0″ banden en hydraulische schijfremmen zorgen voor comfort en controle in de stad. Fabrieks-/retaileropgave: ~64–120 km per lading (gebruik/condities afhankelijk). EU-topsnelheid 25 km/u (pedelec).

## Highlights

- **Soepele aandrijving:** EU-gelimiteerde 250 W naafmotor (pedelec).
- **Energiepakket:** 48 V / 20 Ah ≈ 960 Wh interne accu.
- **Actieradius (claim/opgave):** ~64–120 km; in veel NL/EU-tests komt ~110 km als bovengrens onder gunstige omstandigheden.
- **Controle & veiligheid:** hydraulische schijfremmen, brede banden, geïntegreerde verlichting.
- **Gebruiksgemak:** one-size moped-stijl frame, doorgaans single-speed setup (EU-spec).

## Specificaties

**E-systeem**
- Motor: achternaaf 250 W (EU)
- Accu: 48 V / 20 Ah ≈ 960 Wh
- Ondersteuning: tot 25 km/u (EU-pedelec)

**Frame & remmen**
- Frame: aluminium, moped-stijl, one-size
- Remmen: hydraulische schijfremmen

**Wielen & maten**
- Wielen: 20″
- Banden: 20×4,5–5,0″ (SUPER73 BDGR)

## Prijs & beschikbaarheid (EU)

- **Richtprijs:** € 3.499 (EU-store, model/kleur afhankelijk)

## Actieradius

**Claim/opgave:** ~64–120 km per lading (sterk afhankelijk van rijstand, wind/temperatuur, bandenspanning, terrein en totaalgewicht).

**Praktijkreferentie (EU):** ~110 km als orde van grootte bij rustig gebruik.

## Wettelijke noot (NL/EU)

Deze fiets is een **pedelec**: ondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u.

## Filters (voor jullie e-bike categorie)

- **Merk:** SUPER73
- **Model + versie:** S2
- **Prijs (EU indicatie):** € 3.499
- **Heren/Dames:** Unisex
- **Actieradius:** ~64–120 km (claim) | ~110 km (opgave/ideaal)
- **Accucapaciteit:** ≈ 960 Wh (48 V / 20 Ah)
- **Topsnelheid:** 25 km/u (EU)
- **Wielmaat/banden:** 20″ / 20×4,5–5,0″
- **Remmen:** Hydraulische schijfremmen
- **Bijzonderheden:** EU EPAC, geïntegreerde verlichting, single-speed (EU-spec)

## Links

- **Waar te koop:** https://eu.super73.com/products/super73-s2-bone-white
- **Bron(nen):** eu.super73.com',
  '[
    "/src/img/SUPER73 S2/super73-S2-gal-black-01.jpg",
    "/src/img/SUPER73 S2/super73-S2-gal-black-02.jpg",
    "/src/img/SUPER73 S2/super73-S2-gal-black-03.jpg",
    "/src/img/SUPER73 S2/Super73_EU_YM22_S2-White_Right_068a112d-4680-46cf-85c2-9ebf5a13f13d.webp",
    "/src/img/SUPER73 S2/Super73_YM22.5_S2-Obsidian_Detail-2_c093d521-39c7-481e-8c26-f0d74ba5b025.webp",
    "/src/img/SUPER73 S2/Super73_YM22.5_S2-Obsidian_Detail-5_ccdf53a2-e1f2-4963-aa37-7bf9ada680e9.webp"
  ]'::jsonb,
  '[
    {"name": "Bone White", "value": "bone-white", "available": true},
    {"name": "Obsidian", "value": "obsidian", "available": true},
    {"name": "Galaxy Black", "value": "galaxy-black", "available": true}
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
      "description": "48 V / 20 Ah ≈ 960 Wh interne accu"
    },
    {
      "icon": "📍",
      "title": "Actieradius",
      "description": "~64–120 km; in veel NL/EU-tests komt ~110 km als bovengrens"
    },
    {
      "icon": "🛡️",
      "title": "Controle & veiligheid",
      "description": "Hydraulische schijfremmen, brede banden, geïntegreerde verlichting"
    },
    {
      "icon": "🚴‍♂️",
      "title": "Gebruiksgemak",
      "description": "One-size moped-stijl frame, single-speed setup (EU-spec)"
    }
  ]'::jsonb,
  '{
    "e_systeem": {
      "motor": "achternaaf 250 W (EU)",
      "accu": "48 V / 20 Ah ≈ 960 Wh",
      "ondersteuning": "tot 25 km/u (EU-pedelec)"
    },
    "frame_remmen": {
      "frame": "aluminium, moped-stijl, one-size",
      "remmen": "hydraulische schijfremmen"
    },
    "wielen_maten": {
      "wielen": "20″",
      "banden": "20×4,5–5,0″ (SUPER73 BDGR)"
    }
  }'::jsonb,
  '[
    "EU EPAC gecertificeerd",
    "Geïntegreerde verlichting",
    "Single-speed setup",
    "Moped-stijl frame",
    "Hydraulische schijfremmen",
    "Fat-tire banden",
    "One-size fits all"
  ]'::jsonb,
  25.5,
  '20"',
  '20×4,5–5,0″',
  'Aluminium',
  'Achternaaf 250 W (EU)',
  250,
  0.0,
  'Lithium-ion',
  48,
  20.0,
  6.0,
  'Hydraulische schijfremmen',
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
