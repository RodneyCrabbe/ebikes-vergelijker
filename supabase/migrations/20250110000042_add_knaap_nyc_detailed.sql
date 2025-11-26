-- Add Knaap NYC - Belt-drive stads e-bike with comprehensive details
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
  'knaap-nyc-detailed',
  'Knaap',
  'NYC',
  'Belt-drive stads e-bike',
  3199.00,
  'EUR',
  '2024-01-01',
  'unisex',
  'tot ~100 km per lading (conditie-afhankelijk)',
  100,
  504,
  '25 km/u (EU-pedelec)',
  25.00,
  '/src/img/Knaap NYC/NEW-KNAAP-NYC.png',
  'https://knaap.nl/products/nyc',
  25.0,
  '# Knaap NYC — Belt-drive stads e-bike (36 V 14 Ah ≈ 504 Wh, Ananda mid-motor 120 Nm, 8-versn. naaf)

**Kort overzicht**  
De Knaap NYC is Knaap''s riemaangedreven stads-e-bike met Ananda middenmotor (36 V / 250 W / tot 120 Nm), 8-versnellingsnaaf en Gates-achtige riem. Hij rolt op 26×2.4″ banden, heeft hydraulische schijfremmen, geïntegreerde LED-verlichting en track-&-trace compatibiliteit. De 36 V 14 Ah (≈ 504 Wh) accu zit uitneembaar in het frame. Retailers noemen een bereik tot ~100 km (conditie-afhankelijk). Richtprijs: € 3.199.

## Highlights

- **Krachtige middenmotor:** Ananda 36 V / 250 W, tot 120 Nm koppel; ondersteuning tot 25 km/u (EU-pedelec).
- **Onderhoudsarm:** Riem­aandrijving + 8 geïntegreerde versnellingen in het achterwiel (Nexus/IGH-platform).
- **Energie & bereik:** 36 V 14 Ah ≈ 504 Wh; retailers communiceren tot ~100 km bij gunstige omstandigheden.
- **Controle & zichtbaarheid:** Hydraulische schijfremmen, geïntegreerde LED-verlichting vóór/achter.
- **Connectiviteit & security:** Track-&-trace compatibel (FRIS Opsporing), app-koppeling.
- **Ergonomie:** Zithoogte ~83 cm; comfortzadel.

## Specificaties

**Algemeen**
- Merk/Model: Knaap NYC
- Doelgroep: Unisex
- Categorie: Stads/commuter e-bike (riem + IGH)
- Prijs (EU): € 3.199 (Knaap shop, indicatie)
- Gewicht: n.t.b. (fabrikant-/retailerinfo varieert; controleer bij dealer)
- Zithoogte: ~83 cm (comfort seat)

**Motor**
- Motor: Ananda middenmotor
- Vermogen: 250 W (EU)
- Koppel (opgave): tot 120 Nm
- Ondersteuning: 25 km/u (EU-pedelec)
- Versnellingen: 8 geïntegreerd in het achterwiel (interne naaf)
- Aandrijving: Riem (belt drive)

**Accu**
- Accu: 36 V / 14 Ah ≈ 504 Wh (uitneembaar)
- Bereik (retaileropgave): tot ~100 km (afhankelijk van stand/terrein/weer/bandenspanning/gewicht)
- Track & Trace: Compatibel met FRIS Opsporing (app)

**Frame**
- Frame: Aluminium, geïntegreerde verlichting & kabelvoering
- Zadel: comfortzadel, krasbestendige cover (serie-eigenschap)

**Wielen**
- Wielmaat / banden: 26×2.4″ (ca. 60 mm breed) — stabiel en comfortabel in de stad
- Remmen: Hydraulische schijfremmen vóór/achter

**Features**
- Verlichting: Geïntegreerde LED voor & achter (accuvoeding)
- Display/App: Knaap-display; FRIS app-compatibel (track-&-trace)

## Prijs & beschikbaarheid

- **Richtprijs:** € 3.199 (Knaap shop, indicatie)

## Wettelijke noot (NL/EU)

Deze fiets valt onder **pedelec-regels**: trapondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u.

## Links

- **Waar te koop:** https://knaap.nl/products/nyc
- **Bron(nen):** knaap.nl',
  '[
    "/src/img/Knaap NYC/NEW-KNAAP-NYC.png",
    "/src/img/Knaap NYC/NEW-KNAAP-NYC-voorkant.png",
    "/src/img/Knaap NYC/NEW-KNAAP-NYC-schuin.png",
    "/src/img/Knaap NYC/NEW-KNAAP-NYC-achterkant.png"
  ]'::jsonb,
  '[
    {"name": "Black", "value": "black", "available": true},
    {"name": "White", "value": "white", "available": true},
    {"name": "Silver", "value": "silver", "available": true}
  ]'::jsonb,
  '[
    {
      "icon": "⚡",
      "title": "Krachtige middenmotor",
      "description": "Ananda 36 V / 250 W, tot 120 Nm koppel; ondersteuning tot 25 km/u (EU-pedelec)"
    },
    {
      "icon": "🔧",
      "title": "Onderhoudsarm",
      "description": "Riem­aandrijving + 8 geïntegreerde versnellingen in het achterwiel (Nexus/IGH-platform)"
    },
    {
      "icon": "🔋",
      "title": "Energie & bereik",
      "description": "36 V 14 Ah ≈ 504 Wh; retailers communiceren tot ~100 km bij gunstige omstandigheden"
    },
    {
      "icon": "🛡️",
      "title": "Controle & zichtbaarheid",
      "description": "Hydraulische schijfremmen, geïntegreerde LED-verlichting vóór/achter"
    },
    {
      "icon": "📱",
      "title": "Connectiviteit & security",
      "description": "Track-&-trace compatibel (FRIS Opsporing), app-koppeling"
    },
    {
      "icon": "🪑",
      "title": "Ergonomie",
      "description": "Zithoogte ~83 cm; comfortzadel"
    }
  ]'::jsonb,
  '{
    "algemeen": {
      "merk_model": "Knaap NYC",
      "doelgroep": "Unisex",
      "categorie": "Stads/commuter e-bike (riem + IGH)",
      "prijs_eu": "€ 3.199 (Knaap shop, indicatie)",
      "gewicht": "n.t.b. (fabrikant-/retailerinfo varieert; controleer bij dealer)",
      "zithoogte": "~83 cm (comfort seat)"
    },
    "motor": {
      "motor": "Ananda middenmotor",
      "vermogen": "250 W (EU)",
      "koppel_opgave": "tot 120 Nm",
      "ondersteuning": "25 km/u (EU-pedelec)",
      "versnellingen": "8 geïntegreerd in het achterwiel (interne naaf)",
      "aandrijving": "Riem (belt drive)"
    },
    "accu": {
      "accu": "36 V / 14 Ah ≈ 504 Wh (uitneembaar)",
      "bereik_retaileropgave": "tot ~100 km (afhankelijk van stand/terrein/weer/bandenspanning/gewicht)",
      "track_trace": "Compatibel met FRIS Opsporing (app)"
    },
    "frame": {
      "frame": "Aluminium, geïntegreerde verlichting & kabelvoering",
      "zadel": "comfortzadel, krasbestendige cover (serie-eigenschap)"
    },
    "wielen": {
      "wielmaat_banden": "26×2.4″ (ca. 60 mm breed) — stabiel en comfortabel in de stad",
      "remmen": "Hydraulische schijfremmen vóór/achter"
    },
    "features": {
      "verlichting": "Geïntegreerde LED voor & achter (accuvoeding)",
      "display_app": "Knaap-display; FRIS app-compatibel (track-&-trace)"
    }
  }'::jsonb,
  '[
    "EU EPAC gecertificeerd",
    "Ananda middenmotor 250W",
    "120 Nm koppel",
    "8-versnellingsnaaf (IGH)",
    "Riem-aandrijving (belt drive)",
    "Hydraulische schijfremmen",
    "Geïntegreerde LED-verlichting",
    "Knaap-display",
    "Uitneembare accu",
    "Comfortzadel",
    "Track-&-trace compatibel",
    "FRIS app-koppeling",
    "Aluminium frame",
    "26×2.4″ banden",
    "Onderhoudsarm systeem"
  ]'::jsonb,
  0.0,
  '26"',
  '26×2.4″',
  'Aluminium',
  'Ananda middenmotor',
  250,
  120.0,
  'Li-ion',
  36,
  14.0,
  4.0,
  'Hydraulische schijfremmen vóór/achter',
  '8-versnellingsnaaf (IGH)',
  'Geen',
  'Geïntegreerde LED voor & achter',
  'Knaap-display',
  '{"app": true, "gps": true, "bluetooth": true, "track_trace": true, "fris": true}'::jsonb,
  2,
  'EU EPAC',
  NOW(),
  NOW()
);
