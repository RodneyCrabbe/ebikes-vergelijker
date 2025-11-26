-- Add missing e-bikes that are showing in the UI but missing from database
INSERT INTO ebikes (id, brand, model_name, version, price, currency, build_date, gender_type, action_radius_text, action_radius_km, battery_capacity, top_speed_text, top_speed_kmh, image_url, affiliate_url, cpl_rate, description, created_at, updated_at) VALUES

-- VANMOOF S5
('550e8400-e29b-41d4-a716-446655440013', 'VanMoof', 'S5', 'Premium stads e-bike met geavanceerde technologie', 2498, 'EUR', '2022-01-01', 'unisex', 'Tot 60 km', 60, 487, '25 km/h (EU)', 25, '/img/vanmoof-s5.jpg', 'https://vanmoof.com/products/s5', 25.0, 'De VanMoof S5 is een premium stads e-bike met geavanceerde technologie en stijlvol design.', NOW(), NOW()),

-- BATAVUS Diva E-go Power
('550e8400-e29b-41d4-a716-446655440014', 'Batavus', 'Diva E-go Power', 'Elegante dames e-bike met krachtige motor', 2599, 'EUR', '2022-01-01', 'vrouw', 'Tot 80 km', 80, 400, '25 km/h (EU)', 25, '/img/batavus-diva-ego-power.jpg', 'https://batavus.com/products/diva-ego-power', 25.0, 'De Batavus Diva E-go Power is een elegante dames e-bike met krachtige motor en comfortabele zitpositie.', NOW(), NOW()),

-- GIANT Explore E+ 1
('550e8400-e29b-41d4-a716-446655440015', 'Giant', 'Explore E+ 1', 'Trekking e-bike met betrouwbare aandrijving', 2799, 'EUR', '2022-01-01', 'unisex', 'Tot 90 km', 90, 500, '25 km/h (EU)', 25, '/img/giant-explore-e-plus-1.jpg', 'https://giant-bicycles.com/products/explore-e-plus-1', 25.0, 'De Giant Explore E+ 1 is een betrouwbare trekking e-bike met krachtige aandrijving.', NOW(), NOW()),

-- SPARTA e-Speed D11S
('550e8400-e29b-41d4-a716-446655440016', 'Sparta', 'e-Speed D11S', 'Snelle stads e-bike met sportieve uitstraling', 2899, 'EUR', '2022-01-01', 'unisex', 'Tot 75 km', 75, 500, '25 km/h (EU)', 25, '/img/sparta-espeed-d11s.jpg', 'https://sparta.nl/products/espeed-d11s', 25.0, 'De Sparta e-Speed D11S is een snelle stads e-bike met sportieve uitstraling en krachtige motor.', NOW(), NOW()),

-- KOGA E-Nova Evo
('550e8400-e29b-41d4-a716-446655440017', 'Koga', 'E-Nova Evo', 'Premium trekking e-bike met geavanceerde technologie', 3199, 'EUR', '2022-01-01', 'unisex', 'Tot 120 km', 120, 625, '25 km/h (EU)', 25, '/img/koga-enova-evo.jpg', 'https://koga.com/products/enova-evo', 25.0, 'De Koga E-Nova Evo is een premium trekking e-bike met geavanceerde technologie en uitstekende prestaties.', NOW(), NOW()),

-- GAZELLE Ultimate C8+ HMB
('550e8400-e29b-41d4-a716-446655440018', 'Gazelle', 'Ultimate C8+ HMB', 'Premium stads e-bike met riemaandrijving', 3499, 'EUR', '2022-01-01', 'unisex', 'Tot 100 km', 100, 500, '25 km/h (EU)', 25, '/img/gazelle-ultimate-c8-hmb.jpg', 'https://gazelle.nl/products/ultimate-c8-hmb', 25.0, 'De Gazelle Ultimate C8+ HMB is een premium stads e-bike met onderhoudsarme riemaandrijving.', NOW(), NOW())

ON CONFLICT (id) DO NOTHING;
