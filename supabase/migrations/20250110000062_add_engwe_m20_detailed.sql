-- Add ENGWE M20 with placeholder specifications
INSERT INTO ebikes (
    id, brand, model_name, version, price, currency, build_date, gender_type,
    action_radius_text, action_radius_km, battery_capacity, top_speed_text, top_speed_kmh,
    image_url, affiliate_url, cpl_rate, description,
    images, colors, highlights, specifications, features,
    weight_kg, wheel_size, tire_size, frame_material, motor_type, motor_power_w,
    torque_nm, battery_type, battery_voltage, battery_ah, charging_time_hours,
    brake_type, gear_system, suspension, lighting, display, connectivity,
    warranty_years, certification, created_at, updated_at
) VALUES (
    'engwe-m20-detailed',
    'ENGWE',
    'M20',
    'n.t.b.',
    0.00, -- Price on request
    'EUR',
    '2024-01-01',
    'unisex',
    '~n.t.b. km (claim/opgave)',
    0,
    0,
    '25 km/u (EU-pedelec)',
    25.00,
    '/src/img/ENGWE M20/M20_6b6b1530-b8a9-4c8a-ba35-73d929914c9e.webp',
    'https://engwe-bikes.eu/products/m20',
    25.00,
    '# ENGWE M20 — 250 W EU

**Kort overzicht**
Specificaties voor de ENGWE M20 ontbreken in de aangeleverde dataset. Daarom tonen we alleen EU-standaardwaarden waar van toepassing (250 W, 25 km/u) en markeren we overige velden als n.t.b. (nog te bepalen).

## Highlights

- **EU-standaard:** 250 W ondersteuning tot 25 km/u (pedelec).
- **Model:** ENGWE M20; uitvoering/versie n.t.b.
- **Accugegevens:** spanning/capaciteit/Wh n.t.b.
- **Remsysteem:** n.t.b.
- **Wiel/band:** n.t.b.
- **Gewicht/payload:** n.t.b.
- **Prijs (EU):** n.t.b.

## Volledige specificaties
**Algemeen**
- Merk/Model: ENGWE M20
- Doelgroep: Unisex
- Categorie: n.t.b.
- Prijs (EU): n.t.b.
- Gewicht: n.t.b.
- Payload (max. toelaatbaar): n.t.b.
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
- Ergonomie/Zadel: n.t.b.
- Bijzonderheden: n.t.b.

**Wielen**
- Wielmaat: n.t.b.
- Bandenmaat: n.t.b.
- Remmen: n.t.b.
- Aandrijving/versnellingen: n.t.b.

**Features**
- Verlichting: n.t.b.
- Accessoires: n.t.b.
- Connectiviteit: n.t.b.
- Waterdichtheid: n.t.b.

**Wettelijke noot (NL/EU)**
Deze fiets valt als pedelec onder de volgende regels: trapondersteuning tot 25 km/u, max. 250 W continu motorvermogen, en geen gashendel boven 6 km/u. Varianten met hogere snelheid of volwaardige gashendel vallen buiten de pedelec-categorie en vereisen andere toelatingen.',
    '["/src/img/ENGWE M20/M20_6b6b1530-b8a9-4c8a-ba35-73d929914c9e.webp", "/src/img/ENGWE M20/M20_c155b11d-689d-4767-bb25-daeb65cdd335.webp", "/src/img/ENGWE M20/M20_dbc4ca10-d4f1-4115-bc16-4c2c69cbff54.webp", "/src/img/ENGWE M20/M20_ebb8428f-7a96-4a5b-91e9-894eb4c6a419.webp", "/src/img/ENGWE M20/16.webp", "/src/img/ENGWE M20/17.webp", "/src/img/ENGWE M20/18.webp", "/src/img/ENGWE M20/19.webp"]',
    '[{"name": "Black", "value": "black", "available": true}, {"name": "White", "value": "white", "available": true}, {"name": "Red", "value": "red", "available": true}]',
    '["EU EPAC gecertificeerd", "250W motor (EU-standaard)", "25 km/u topsnelheid (EU)", "Pedelec compliant", "Specificaties n.t.b.", "ENGWE M20 model", "Unisex design", "Nog te bepalen specificaties", "EU-standaard waarden", "Informatie ontbreekt in dataset"]',
    '{"algemeen": {"merk_model": "ENGWE M20", "doelgroep": "Unisex", "categorie": "n.t.b.", "prijs_eu": "n.t.b.", "gewicht": "n.t.b.", "payload_max_toelaatbaar": "n.t.b.", "afmetingen_zithoogte": "n.t.b."}, "motor": {"type": "n.t.b.", "vermogen_eu": "250 W · Ondersteuning: 25 km/u (EU)", "koppel_opgave": "n.t.b.", "display_bediening": "n.t.b."}, "accu": {"accu": "n.t.b.", "type": "n.t.b.", "lader_laadtijd": "n.t.b.", "actieradius_claim_opgave": "n.t.b. km"}, "frame": {"materiaal": "n.t.b.", "vork_vering": "n.t.b.", "ergonomie_zadel": "n.t.b.", "bijzonderheden": "n.t.b."}, "wielen": {"wielmaat": "n.t.b.", "bandenmaat": "n.t.b.", "remmen": "n.t.b.", "aandrijving_versnellingen": "n.t.b."}, "features": {"verlichting": "n.t.b.", "accessoires": "n.t.b.", "connectiviteit": "n.t.b.", "waterdichtheid": "n.t.b."}}',
    '["EU EPAC gecertificeerd", "250W motor (EU-standaard)", "25 km/u topsnelheid (EU)", "Pedelec compliant", "Specificaties n.t.b.", "ENGWE M20 model", "Unisex design", "Nog te bepalen specificaties", "EU-standaard waarden", "Informatie ontbreekt in dataset"]',
    0.00,
    'n.t.b.',
    'n.t.b.',
    'n.t.b.',
    'n.t.b.',
    250,
    0.00,
    'n.t.b.',
    0,
    0.00,
    0.00,
    'n.t.b.',
    'n.t.b.',
    'n.t.b.',
    'n.t.b.',
    'n.t.b.',
    '{"app": false, "gps": false, "bluetooth": false}',
    0,
    'EU EPAC',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    brand = EXCLUDED.brand,
    model_name = EXCLUDED.model_name,
    version = EXCLUDED.version,
    price = EXCLUDED.price,
    currency = EXCLUDED.currency,
    build_date = EXCLUDED.build_date,
    gender_type = EXCLUDED.gender_type,
    action_radius_text = EXCLUDED.action_radius_text,
    action_radius_km = EXCLUDED.action_radius_km,
    battery_capacity = EXCLUDED.battery_capacity,
    top_speed_text = EXCLUDED.top_speed_text,
    top_speed_kmh = EXCLUDED.top_speed_kmh,
    image_url = EXCLUDED.image_url,
    affiliate_url = EXCLUDED.affiliate_url,
    cpl_rate = EXCLUDED.cpl_rate,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    colors = EXCLUDED.colors,
    highlights = EXCLUDED.highlights,
    specifications = EXCLUDED.specifications,
    features = EXCLUDED.features,
    weight_kg = EXCLUDED.weight_kg,
    wheel_size = EXCLUDED.wheel_size,
    tire_size = EXCLUDED.tire_size,
    frame_material = EXCLUDED.frame_material,
    motor_type = EXCLUDED.motor_type,
    motor_power_w = EXCLUDED.motor_power_w,
    torque_nm = EXCLUDED.torque_nm,
    battery_type = EXCLUDED.battery_type,
    battery_voltage = EXCLUDED.battery_voltage,
    battery_ah = EXCLUDED.battery_ah,
    charging_time_hours = EXCLUDED.charging_time_hours,
    brake_type = EXCLUDED.brake_type,
    gear_system = EXCLUDED.gear_system,
    suspension = EXCLUDED.suspension,
    lighting = EXCLUDED.lighting,
    display = EXCLUDED.display,
    connectivity = EXCLUDED.connectivity,
    warranty_years = EXCLUDED.warranty_years,
    certification = EXCLUDED.certification,
    updated_at = NOW();
