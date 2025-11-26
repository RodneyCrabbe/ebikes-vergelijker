-- Add ENGWE L20 with placeholder specifications
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
    'engwe-l20-detailed',
    'ENGWE',
    'L20',
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
    '/src/img/ENGWE L20/1_8550be20-cec1-41d8-9d16-3756a3dcbdd2.webp',
    'https://engwe-bikes.eu/products/l20',
    25.00,
    '# ENGWE L20 — n.t.b. (n.t.b., 250 W EU, n.t.b., n.t.b.)

**Kort overzicht**
Specificaties voor de ENGWE L20 ontbreken in de aangeleverde dataset. Daarom tonen we alleen EU-standaardwaarden (250 W, 25 km/u) en markeren we overige velden als n.t.b. (nog te bepalen).

## Highlights

- **EU-standaard:** 250 W ondersteuning tot 25 km/u (pedelec).
- **Model:** ENGWE L20; uitvoering/versie n.t.b.
- **Accugegevens:** spanning/capaciteit/Wh n.t.b.
- **Remsysteem:** n.t.b.
- **Wiel/band:** n.t.b.
- **Gewicht/payload:** n.t.b.
- **Prijs (EU):** n.t.b.

## Volledige specificaties
**Algemeen**
- Merk/Model: ENGWE L20
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
Deze fiets valt als pedelec onder de regels: trapondersteuning tot 25 km/u, max. 250 W continu motorvermogen, en geen gashendel boven 6 km/u. Varianten met hogere snelheid of volwaardige gashendel vallen buiten deze categorie en vereisen andere toelatingen.',
    '["/src/img/ENGWE L20/1_8550be20-cec1-41d8-9d16-3756a3dcbdd2.webp", "/src/img/ENGWE L20/2_14712d36-eed6-4d7a-8a84-e51223c62da4.webp", "/src/img/ENGWE L20/3_3dfcefb3-2dda-4b8d-b052-a825a83f5774.webp", "/src/img/ENGWE L20/4_b035ec23-01bf-4078-af5a-7807d7988d36.webp", "/src/img/ENGWE L20/5_6f7a5401-652f-4591-a713-124412fd7288.webp", "/src/img/ENGWE L20/6_4ac9f2a0-35bf-4528-922c-d1567dfabc74.webp", "/src/img/ENGWE L20/7_7ff9b0ab-07ba-4c59-b938-0f2b1273512a.webp", "/src/img/ENGWE L20/8_36e53477-21a5-41e1-bc63-067dfc3d8a4e.webp", "/src/img/ENGWE L20/9_21ff7a0f-6663-4cc1-a640-35ee032be06d.webp", "/src/img/ENGWE L20/10_e28d2b54-48c0-40e7-b587-848b62cfbc32.webp", "/src/img/ENGWE L20/11_a8f9524a-bf18-4dd1-98fd-b80e9728187c.webp", "/src/img/ENGWE L20/12_6f1fc1f4-69c2-4286-b8fc-6dfd370fe0c9.webp", "/src/img/ENGWE L20/13_0fa39308-71f3-4136-9d22-dc35759467e0.webp"]',
    '[{"name": "Black", "value": "black", "available": true}, {"name": "White", "value": "white", "available": true}, {"name": "Red", "value": "red", "available": true}]',
    '["EU EPAC gecertificeerd", "250W motor (EU-standaard)", "25 km/u topsnelheid (EU)", "Pedelec compliant", "Specificaties n.t.b.", "ENGWE L20 model", "Unisex design", "Nog te bepalen specificaties", "EU-standaard waarden", "Informatie ontbreekt in dataset"]',
    '{"algemeen": {"merk_model": "ENGWE L20", "doelgroep": "Unisex", "categorie": "n.t.b.", "prijs_eu": "n.t.b.", "gewicht": "n.t.b.", "payload_totaal_toelaatbaar": "n.t.b.", "afmetingen_zithoogte": "n.t.b."}, "motor": {"type": "n.t.b.", "vermogen_eu": "250 W · Ondersteuning: 25 km/u (EU)", "koppel_opgave": "n.t.b.", "display_bediening": "n.t.b."}, "accu": {"accu": "n.t.b.", "type": "n.t.b.", "lader_laadtijd": "n.t.b.", "actieradius_claim_opgave": "n.t.b. km"}, "frame": {"materiaal": "n.t.b.", "vork_vering": "n.t.b.", "ergonomie_zadel": "n.t.b.", "bijzonderheden": "n.t.b."}, "wielen": {"wielmaat": "n.t.b.", "bandenmaat": "n.t.b.", "remmen": "n.t.b.", "aandrijving_versnellingen": "n.t.b."}, "features": {"verlichting": "n.t.b.", "accessoires": "n.t.b.", "connectiviteit": "n.t.b.", "waterdichtheid": "n.t.b."}}',
    '["EU EPAC gecertificeerd", "250W motor (EU-standaard)", "25 km/u topsnelheid (EU)", "Pedelec compliant", "Specificaties n.t.b.", "ENGWE L20 model", "Unisex design", "Nog te bepalen specificaties", "EU-standaard waarden", "Informatie ontbreekt in dataset"]',
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
