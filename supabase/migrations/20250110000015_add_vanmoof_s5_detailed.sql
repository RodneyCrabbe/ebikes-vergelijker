-- Add detailed VanMoof S5 entry with comprehensive specifications
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
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440019',
    'VANMOOF',
    'S5',
    'Gen 5 Smart e-bike',
    3298,
    'EUR',
    '2024-01-01',
    'unisex',
    '60-150 km',
    60,
    487,
    '25 km/h (EU)',
    25,
    '/img/Van Moof - S5/vanmoof-s5-main.jpg',
    'https://www.vanmoof.com/en-NL/s5',
    35.0,
    'De VanMoof S5 is een minimalistische stads/commuter e-bike met Gen 5-platform: near-silent 250 W voornaafmotor, torquesensor + E-shifter (automatische 3-versnellingsnaaf), Kick Lock en geïntegreerde verlichting/elektronica. De interne 487 Wh accu levert een fabrieksschatting van ca. 60–150 km—met Boost-koppel tot 68 Nm voor snelle sprints. EU-topsnelheid 25 km/u. Gewicht circa 23 kg. Wielen: 27.5″ (650b) voor extra comfort.',
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
    updated_at = NOW();

-- Add detailed specifications as a JSON field (if we have one) or create a specifications table
-- For now, let's add some key highlights to the description
UPDATE ebikes 
SET description = description || '

HIGHLIGHTS:
• Soepele aandrijving: Gen-5 motor met torquesensor + E-shifter (auto 3-speed)
• Eén-druk beveiliging: Kick Lock, alarm en anti-diefstal-features, gekoppeld aan de app
• Zichtbaar & geïntegreerd: Halo Ring cockpit en Gen-5 Hi-Vis verlichting
• Bereik & laadtijden: 487 Wh, 60–150 km (modus-afhankelijk); 0–50% ±2u30, 0–100% ±6u30
• Wielen & fit: 27.5″ wielen; rijderlengte 165–210 cm

SPECIFICATIES:
• Motor: voornaaf 250 W (Gen 5), Boost-koppel 68 Nm; EU 25 km/u ondersteuning
• Sensoren & schakeling: torquesensor + E-shifter met automatische 3-versnellingsnaaf
• Accu: 487 Wh (intern). Bereik: ~60 km (Full Power) tot ~150 km (Eco)
• Laadtijd: ≈2u30 (0–50%) / ≈6u30 (0–100%)
• Gewicht: ca. 23 kg
• Frame: aluminium, één maat (165–210 cm)
• Wielen/banden: 27.5″ (650b); lage rolweerstand 27.5×2.0″
• Remmen: hydraulische schijfremmen (Gen-5)
• Interface: Halo Ring in het stuur (battery/snelheid/lock-status)
• Verlichting: Gen-5 Hi-Vis koplamp/achterlicht (e-bike normeringen EU/DE)
• Anti-diefstal: Kick Lock in de naaf: tik om te vergrendelen, alarm en remote-lockdown via app

PRIJS & BESCHIKBAARHEID:
• Richtprijs herintro 2024: €3.298 (NL/DE)
• Retailvoorbeelden NL: aanbiedingen gezien rond €2.798–€2.998 (kleur/voorraad afhankelijk)

DOELGROEP:
Unisex stadsfietser/forens die strak design en geïntegreerde tech wil, met focus op dagelijks gebruik, woon-werk en snelle ritten in de stad.'
WHERE id = '550e8400-e29b-41d4-a716-446655440019';
