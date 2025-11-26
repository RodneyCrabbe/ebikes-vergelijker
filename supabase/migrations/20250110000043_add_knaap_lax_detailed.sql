-- Add Knaap LAX - Low-step stads e-bike with comprehensive details
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
  'knaap-lax-detailed',
  'Knaap',
  'LAX',
  'Low-step stads e-bike',
  3199.00,
  'EUR',
  '2024-01-01',
  'unisex',
  'varieert per bron; Knaap generieke specs noemen tot ~140 km, retailers communiceren doorgaans lager/afhankelijk van omstandigheden',
  140,
  504,
  '25 km/u (EU-pedelec)',
  25.00,
  '/src/img/Knaap LAX/NEW-KNAAP-LAX-zonder-Pre-Order-t-1024x1024.png',
  'https://knaap.nl/products/lax',
  25.0,
  '# Knaap LAX — Low-step stads e-bike (36 V 14 Ah ≈ 504 Wh, Ananda mid-motor 120 Nm, 26×2.4″)

**Kort overzicht**  
De Knaap LAX is de low-step stads e-bike van Knaap met Ananda middenmotor (36 V / 250 W / tot 120 Nm), 26×2.4″ banden en een uitneembare 36 V 14 Ah (≈ 504 Wh) accu. Hij rijdt tot 25 km/u (EU-pedelec), heeft LED-verlichting en hydraulische schijfremmen. Prijs op de Knaap-shop: € 3.199. Afhankelijk van uitvoering zie je óf 8-versnellingen met riemaandrijving (interne naaf), óf "Shimano 8-speed" zoals op de Knaap-specpagina staat—dit lijkt een modeljaar/batch-verschil.

## Highlights

- **Sterke middenmotor:** Ananda 36 V / 250 W, tot 120 Nm koppel; EU 25 km/u ondersteuning.
- **Accu & laden:** 36 V 14 Ah ≈ 504 Wh, opladen met 36 V 2 A lader (inclusief).
- **Aandrijving (afhankelijk van trim/jaar):** retailers tonen riem + 8-versnellingsnaaf, Knaap-site noemt Shimano 8-speed.
- **Controle & zichtbaarheid:** hydraulische schijfremmen, LED-verlichting voor & achter, 26×2.4″ stadsbanden.
- **Comfort & instap:** low-step frame, rechtop zit; gewicht indicatief ~32 kg (refurb-listing).
- **Smart/veiligheid:** compatibel met track-&-trace volgens dealerinfo.

## Specificaties

**Algemeen**
- Merk/Model: Knaap LAX
- Doelgroep: Unisex
- Categorie: Stads/commuter e-bike (low-step)
- Prijs (EU): € 3.199 (Knaap shop)
- Gewicht: ~32 kg (indicatie; bron/uitvoering afhankelijk)

**Motor**
- Motor: Ananda middenmotor
- Vermogen: 250 W (EU)
- Koppel (max): tot 120 Nm
- Ondersteuning: 25 km/u (EU-pedelec)
- Display/bediening: Knaap-display (snelheid/accu/kilometrage)

**Accu**
- Accu: 36 V / 14 Ah ≈ 504 Wh (Li-ion), uitneembaar
- Lader: 36 V 2 A inbegrepen
- Bereik (opgave in de markt): varieert per bron; Knaap generieke specs noemen tot ~140 km, retailers communiceren doorgaans lager/afhankelijk van omstandigheden

**Frame**
- Frame: aluminium, low-step
- Zitpositie: rechtop, stadsgeoriënteerd

**Wielen**
- Wielmaat: 26″
- Banden: 26×2.4″ (ca. 60 mm) stadsbanden
- Remmen: hydraulische schijfremmen (voor/achter)
- Aandrijving (config-afhankelijk): Belt drive + 8-versnellingsnaaf (retailer/2024-modellen), of Shimano 8-speed (derailleur/shifter) volgens Knaap-specpagina

**Features**
- Verlichting: LED voor & achter (accuvoeding)
- Connectiviteit/veiligheid: track-&-trace-compatibel (dealerinformatie)

## Prijs & beschikbaarheid

- **Richtprijs:** € 3.199 (Knaap shop)

## Wettelijke noot (NL/EU)

**Pedelec**: trapondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u.

## Links

- **Waar te koop:** https://knaap.nl/products/lax
- **Bron(nen):** knaap.nl',
  '[
    "/src/img/Knaap LAX/NEW-KNAAP-LAX-zonder-Pre-Order-t-1024x1024.png",
    "/src/img/Knaap LAX/NEW-KNAAP-LAX-voorkant-qps9q4246d6ad662ddh0pp7hmw8hx3q125gk3lk5z8.png",
    "/src/img/Knaap LAX/NEW-KNAAP-LAX-schuin-qi1x52r0x3w38onfnkrapxzom0vxzjtbfsqatlw284.png",
    "/src/img/Knaap LAX/NEW-KNAAP-LAX-achterkant-qps9q5xsk18v0e3c2ea9uoqetnz8chxhqerj25hdms.png",
    "/src/img/Knaap LAX/Schermafbeelding-2024-06-17-om-10.08.24-qps9t618dzcu3jqbj70dbfgf4z6fxoumh9sd8z13r8.png"
  ]'::jsonb,
  '[
    {"name": "Black", "value": "black", "available": true},
    {"name": "White", "value": "white", "available": true},
    {"name": "Silver", "value": "silver", "available": true}
  ]'::jsonb,
  '[
    {
      "icon": "⚡",
      "title": "Sterke middenmotor",
      "description": "Ananda 36 V / 250 W, tot 120 Nm koppel; EU 25 km/u ondersteuning"
    },
    {
      "icon": "🔋",
      "title": "Accu & laden",
      "description": "36 V 14 Ah ≈ 504 Wh, opladen met 36 V 2 A lader (inclusief)"
    },
    {
      "icon": "⚙️",
      "title": "Aandrijving (afhankelijk van trim/jaar)",
      "description": "retailers tonen riem + 8-versnellingsnaaf, Knaap-site noemt Shimano 8-speed"
    },
    {
      "icon": "🛡️",
      "title": "Controle & zichtbaarheid",
      "description": "hydraulische schijfremmen, LED-verlichting voor & achter, 26×2.4″ stadsbanden"
    },
    {
      "icon": "🪑",
      "title": "Comfort & instap",
      "description": "low-step frame, rechtop zit; gewicht indicatief ~32 kg (refurb-listing)"
    },
    {
      "icon": "📱",
      "title": "Smart/veiligheid",
      "description": "compatibel met track-&-trace volgens dealerinfo"
    }
  ]'::jsonb,
  '{
    "algemeen": {
      "merk_model": "Knaap LAX",
      "doelgroep": "Unisex",
      "categorie": "Stads/commuter e-bike (low-step)",
      "prijs_eu": "€ 3.199 (Knaap shop)",
      "gewicht": "~32 kg (indicatie; bron/uitvoering afhankelijk)"
    },
    "motor": {
      "motor": "Ananda middenmotor",
      "vermogen": "250 W (EU)",
      "koppel_max": "tot 120 Nm",
      "ondersteuning": "25 km/u (EU-pedelec)",
      "display_bediening": "Knaap-display (snelheid/accu/kilometrage)"
    },
    "accu": {
      "accu": "36 V / 14 Ah ≈ 504 Wh (Li-ion), uitneembaar",
      "lader": "36 V 2 A inbegrepen",
      "bereik_opgave_in_de_markt": "varieert per bron; Knaap generieke specs noemen tot ~140 km, retailers communiceren doorgaans lager/afhankelijk van omstandigheden"
    },
    "frame": {
      "frame": "aluminium, low-step",
      "zitpositie": "rechtop, stadsgeoriënteerd"
    },
    "wielen": {
      "wielmaat": "26″",
      "banden": "26×2.4″ (ca. 60 mm) stadsbanden",
      "remmen": "hydraulische schijfremmen (voor/achter)",
      "aandrijving_config_afhankelijk": "Belt drive + 8-versnellingsnaaf (retailer/2024-modellen), of Shimano 8-speed (derailleur/shifter) volgens Knaap-specpagina"
    },
    "features": {
      "verlichting": "LED voor & achter (accuvoeding)",
      "connectiviteit_veiligheid": "track-&-trace-compatibel (dealerinformatie)"
    }
  }'::jsonb,
  '[
    "EU EPAC gecertificeerd",
    "Ananda middenmotor 250W",
    "120 Nm koppel",
    "Low-step frame",
    "Hydraulische schijfremmen",
    "LED-verlichting voor/achter",
    "Knaap-display",
    "Uitneembare accu",
    "26×2.4″ stadsbanden",
    "Track-&-trace compatibel",
    "Aluminium frame",
    "Rechtop zitpositie",
    "Stadsgeoriënteerd",
    "36V 2A lader inbegrepen",
    "Configuratie-afhankelijke aandrijving"
  ]'::jsonb,
  32.0,
  '26"',
  '26×2.4″',
  'Aluminium',
  'Ananda middenmotor',
  250,
  120.0,
  'Li-ion',
  36,
  14.0,
  7.0,
  'Hydraulische schijfremmen (voor/achter)',
  '8-versnellingsnaaf (IGH) / Shimano 8-speed (config-afhankelijk)',
  'Geen',
  'LED voor & achter',
  'Knaap-display (snelheid/accu/kilometrage)',
  '{"app": false, "gps": false, "bluetooth": false, "track_trace": true}'::jsonb,
  2,
  'EU EPAC',
  NOW(),
  NOW()
);
