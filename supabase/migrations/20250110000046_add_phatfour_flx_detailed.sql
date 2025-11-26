-- Add Phatfour FLX - Stads/fun fat-bike with comprehensive details
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
  'phatfour-flx-detailed',
  'Phatfour',
  'FLX',
  'Stads/fun fat-bike',
  0.00,
  'EUR',
  '2024-01-01',
  'unisex',
  '~65 km (500 Wh) of ~98 km (750 Wh) in zomer, 80 kg, windstil',
  98,
  750,
  '25 km/u (EU-instelling)',
  25.00,
  '/src/img/Phatfour FLX/FLX.jpg',
  'https://phatfour.nl/products/flx',
  25.0,
  '# Phatfour FLX — Stads/fun fat-bike (Bafang G062 250 W, 500/750 Wh, 25 km/u)

**Kort overzicht**  
De Phatfour FLX is de "Phat Standard 2.0": een stadsgerichte fat-bike met Bafang G062 achternaafmotor (250 W), uitneembare 43 V accu in 500 Wh of 750 Wh, en een geavanceerd kleurendisplay met reikwijdte-indicator en verbruiksinfo. Fabrieksopgave: 25 km/u (EU-instelling) en in zomerse, gunstige omstandigheden ca. 65 km (500 Wh) of ca. 98 km (750 Wh) bereik. Remt met hydraulische Shimano-schijfremmen; rolt op 20×4.0″ CST Tourance banden. Gewicht rond 35 kg incl. accu. Beschikbare kleuren: Black, Yellow, Army Green.

## Highlights

- **Aandrijving:** Bafang G062 achternaaf, 250 W (EU), ondersteuning tot 25 km/u.
- **Accu''s & laden:** 43 V 500 Wh of 750 Wh; laden met 50 V lader (2 A standaard / 3 A snel). Indicatieve laadtijd: 500 Wh ~6,8 u (2 A) / ~5 u (3 A); 750 Wh ~10 u (2 A) / ~6,5 u (3 A).
- **Actieradius (opgave):** ~65 km (500 Wh) of ~98 km (750 Wh) in de zomer (referentie: 80 kg, windstil).
- **Controle & comfort:** Hydraulische Shimano-remmen, 20×4.0″ CST Tourance banden, LED-koplamp met daglichtstand.
- **Gebruiksgemak:** Kleurendisplay met range-indicator, huidig/gemiddeld verbruik & snelheid; uitneembare accu.
- **Bouw & afmeting:** Dubbel gecoat stalen frame, 20″×3,5 wielen, rijderslengte 160–200 cm, gewicht ~35 kg incl. accu.

## Specificaties

**Algemeen**
- Merk/Model: Phatfour FLX
- Doelgroep: Unisex (one-size; lang zadel voor evt. 2 personen)
- Categorie: Stads/fun fat-bike
- Kleuren: Black, Yellow, Army Green
- Gewicht: ~35 kg incl. accu (fabrieksopgave)

**Motor**
- Type: Bafang G062 achternaaf (geared, brushless)
- Vermogen (EU): 250 W
- Ondersteuning: tot 25 km/u (EU-instelling)
- Regeling: Direct Drive System voor soepele, snelle aanzet (Phatfour-tuning van aansturing/regelaar)

**Accu**
- Configuraties: 43 V 500 Wh óf 43 V 750 Wh, uitneembaar (vergrendelbaar)
- Laden: 50 V lader, 2 A standaard / 3 A snel
- 500 Wh: ~6,8 u (2 A) / ~5 u (3 A)
- 750 Wh: ~10 u (2 A) / ~6,5 u (3 A)
- Actieradius (opgave): ~65 km (500 Wh) · ~98 km (750 Wh) in zomer, 80 kg, windstil

**Frame**
- Frame: Dubbel gecoat staal
- Zadel: Handgestikt skai-leer
- Stuur: Aluminium
- Rijderslengte: 160–200 cm

**Wielen**
- Wielen: 20″ × 3,5″
- Banden: CST Tourance 20×4.00″ (extra breed)
- Remmen: Hydraulische Shimano-schijfremmen

**Features**
- Verlichting: LED-koplamp met daglichtstand (achterlicht aanwezig op productiesets; controleer dealerconfig)
- Display & connectiviteit: Advanced color display met range-indicator, huidig/gemiddeld verbruik, snelheid, accupercentage
- Garantie: 2 jaar op de complete fiets (fabrieksopgave)

## Prijs & beschikbaarheid

- **Richtprijs:** Op aanvraag (Phatfour)
- **Waar te koop:** https://phatfour.nl/products/flx

## Wettelijke noot (NL/EU)

**Pedelec**: trapondersteuning tot 25 km/u, max. 250 W continu, geen gashendel > 6 km/u.

## Links

- **Waar te koop:** https://phatfour.nl/products/flx
- **Bron(nen):** phatfour.nl',
  '[
    "/src/img/Phatfour FLX/FLX.jpg",
    "/src/img/Phatfour FLX/FLX (1).jpg",
    "/src/img/Phatfour FLX/FLX (2).jpg",
    "/src/img/Phatfour FLX/FLX (3).jpg",
    "/src/img/Phatfour FLX/FLX (Black, 500Wh accu).png",
    "/src/img/Phatfour FLX/[A0172] 1 persoonszadel Diamond stiched (FLS+ en FLB+).png"
  ]'::jsonb,
  '[
    {"name": "Black", "value": "black", "available": true},
    {"name": "Yellow", "value": "yellow", "available": true},
    {"name": "Army Green", "value": "army-green", "available": true}
  ]'::jsonb,
  '[
    {
      "icon": "⚡",
      "title": "Aandrijving",
      "description": "Bafang G062 achternaaf, 250 W (EU), ondersteuning tot 25 km/u"
    },
    {
      "icon": "🔋",
      "title": "Accu''s & laden",
      "description": "43 V 500 Wh of 750 Wh; laden met 50 V lader (2 A standaard / 3 A snel)"
    },
    {
      "icon": "📏",
      "title": "Actieradius (opgave)",
      "description": "~65 km (500 Wh) of ~98 km (750 Wh) in de zomer (referentie: 80 kg, windstil)"
    },
    {
      "icon": "🛡️",
      "title": "Controle & comfort",
      "description": "Hydraulische Shimano-remmen, 20×4.0″ CST Tourance banden, LED-koplamp met daglichtstand"
    },
    {
      "icon": "📱",
      "title": "Gebruiksgemak",
      "description": "Kleurendisplay met range-indicator, huidig/gemiddeld verbruik & snelheid; uitneembare accu"
    },
    {
      "icon": "🔨",
      "title": "Bouw & afmeting",
      "description": "Dubbel gecoat stalen frame, 20″×3,5 wielen, rijderslengte 160–200 cm, gewicht ~35 kg incl. accu"
    }
  ]'::jsonb,
  '{
    "algemeen": {
      "merk_model": "Phatfour FLX",
      "doelgroep": "Unisex (one-size; lang zadel voor evt. 2 personen)",
      "categorie": "Stads/fun fat-bike",
      "kleuren": "Black, Yellow, Army Green",
      "gewicht": "~35 kg incl. accu (fabrieksopgave)"
    },
    "motor": {
      "type": "Bafang G062 achternaaf (geared, brushless)",
      "vermogen_eu": "250 W",
      "ondersteuning": "tot 25 km/u (EU-instelling)",
      "regeling": "Direct Drive System voor soepele, snelle aanzet (Phatfour-tuning van aansturing/regelaar)"
    },
    "accu": {
      "configuraties": "43 V 500 Wh óf 43 V 750 Wh, uitneembaar (vergrendelbaar)",
      "laden": "50 V lader, 2 A standaard / 3 A snel",
      "500_wh_laadtijden": "~6,8 u (2 A) / ~5 u (3 A)",
      "750_wh_laadtijden": "~10 u (2 A) / ~6,5 u (3 A)",
      "actieradius_opgave": "~65 km (500 Wh) · ~98 km (750 Wh) in zomer, 80 kg, windstil"
    },
    "frame": {
      "frame": "Dubbel gecoat staal",
      "zadel": "Handgestikt skai-leer",
      "stuur": "Aluminium",
      "rijderslengte": "160–200 cm"
    },
    "wielen": {
      "wielen": "20″ × 3,5″",
      "banden": "CST Tourance 20×4.00″ (extra breed)",
      "remmen": "Hydraulische Shimano-schijfremmen"
    },
    "features": {
      "verlichting": "LED-koplamp met daglichtstand (achterlicht aanwezig op productiesets; controleer dealerconfig)",
      "display_connectiviteit": "Advanced color display met range-indicator, huidig/gemiddeld verbruik, snelheid, accupercentage",
      "garantie": "2 jaar op de complete fiets (fabrieksopgave)"
    }
  }'::jsonb,
  '[
    "EU EPAC gecertificeerd",
    "Bafang G062 achternaafmotor 250W",
    "Direct Drive System",
    "Twee accu-opties (500Wh/750Wh)",
    "Hydraulische Shimano-schijfremmen",
    "Advanced color display",
    "Range-indicator",
    "Verbruiksinfo display",
    "Uitneembare accu",
    "CST Tourance 20×4.0″ banden",
    "LED-koplamp met daglichtstand",
    "Handgestikt skai-leer zadel",
    "Dubbel gecoat stalen frame",
    "Aluminium stuur",
    "Lang zadel (1-2 personen)",
    "Nederlandse kwaliteit",
    "2 jaar complete fiets garantie",
    "Extra brede banden"
  ]'::jsonb,
  35.0,
  '20"',
  '20×4.0″',
  'Staal (dubbel gecoat)',
  'Bafang G062 achternaaf (geared, brushless)',
  250,
  0.0,
  'Li-ion',
  43,
  17.44,
  6.5,
  'Hydraulische Shimano-schijfremmen',
  'Single-speed',
  'Geen',
  'LED-koplamp met daglichtstand',
  'Advanced color display met range-indicator',
  '{"app": false, "gps": false, "bluetooth": false, "usb": false}'::jsonb,
  2,
  'EU EPAC',
  NOW(),
  NOW()
);
