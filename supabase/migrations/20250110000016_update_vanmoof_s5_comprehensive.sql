-- Update the existing VanMoof S5 record with comprehensive details
UPDATE ebikes 
SET 
    brand = 'VANMOOF',
    model_name = 'S5',
    version = 'Stads/commuter e-bike (487 Wh, 27.5″, anti-diefstal)',
    price = 3298,
    currency = 'EUR',
    build_date = '2024-01-01',
    gender_type = 'unisex',
    action_radius_text = '60-150 km',
    action_radius_km = 60,
    battery_capacity = 487,
    top_speed_text = '25 km/h (EU)',
    top_speed_kmh = 25,
    image_url = '/img/Van Moof - S5/vanmoof-s5-main.jpg',
    affiliate_url = 'https://www.vanmoof.com/en-NL/s5',
    cpl_rate = 35.0,
    description = 'De VanMoof S5 is een minimalistische stads/commuter e-bike met Gen 5-platform: near-silent 250 W voornaafmotor, torquesensor + E-shifter (automatische 3-versnellingsnaaf), Kick Lock en geïntegreerde verlichting/elektronica. De interne 487 Wh accu levert een fabrieksschatting van ca. 60–150 km—met Boost-koppel tot 68 Nm voor snelle sprints. EU-topsnelheid 25 km/u. Gewicht circa 23 kg. Wielen: 27.5″ (650b) voor extra comfort.

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
Unisex stadsfietser/forens die strak design en geïntegreerde tech wil, met focus op dagelijks gebruik, woon-werk en snelle ritten in de stad.

WETTELIJKE NOOT (NL/EU):
De S5 is een pedelec: trapondersteuning tot 25 km/u, 250 W nominaal, geen gashendel. Instellingen/varianten voor andere markten (bijv. VS Class 1 20 mph) kunnen afwijken. Controleer lokale regels.

BRONNEN:
• Officiële productpagina S5: 487 Wh, 60–150 km, laadtijden, EU 25 km/u, 23 kg (vanmoof.com)
• VanMoof pers/blog & perskit (2024): torquesensor, E-shifter 3-speed, 27.5″ wielen, Halo Ring/Hi-Vis lights (vanmoof.com)
• The Verge / MT/Sprout (2024): herintroductie & prijs €3.298 (The Verge)
• Retail NL (Superfietsen/Hoogeveen): actuele winkelprijzen ~€2.798–€2.998 (Superfietsen.nl)
• Wheel size bevestiging (The Verge 2022 / DOWNTOWN): 27.5″ S5 (The Verge)',
    updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440013';
