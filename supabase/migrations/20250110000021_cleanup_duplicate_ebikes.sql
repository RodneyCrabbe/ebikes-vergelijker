-- Clean up duplicate e-bikes and fix Sparta e-Speed D11S data
-- First, delete duplicate records, keeping the ones with the most complete data

-- Delete duplicate VanMoof S5 (keep the one with comprehensive data)
DELETE FROM ebikes WHERE id = '550e8400-e29b-41d4-a716-446655440019';

-- Delete duplicate Sparta e-Speed D11S (keep the one with correct data)
DELETE FROM ebikes WHERE id = '6d3cac56-2dff-42eb-8318-aa260d9616b8';

-- Delete duplicate Batavus Diva E-go (keep the one with comprehensive data)
DELETE FROM ebikes WHERE id = '5fc51535-cf77-413d-8102-558b79a89042';

-- Delete duplicate Koga E-Nova Evo (keep the one with comprehensive data)
DELETE FROM ebikes WHERE id = 'bfc23d1e-04dc-466f-8053-5d0456ba6531';

-- Delete duplicate Gazelle Ultimate C8+ HMB (keep the one with comprehensive data)
DELETE FROM ebikes WHERE id = 'c23f9573-f3ab-4577-8048-aacdb05eb560';

-- Delete duplicate VanMoof S5 (keep the one with comprehensive data)
DELETE FROM ebikes WHERE id = 'aa718671-7bc4-4391-9bee-c47fad427c44';

-- Fix Sparta e-Speed D11S data to match the comprehensive details
UPDATE ebikes
SET 
  version = 'Speed-pedelec (45 km/u) — archiefmodel',
  price = 3499.00,
  action_radius_km = 100,
  top_speed_kmh = 45.00,
  action_radius_text = '70-130 km (625 Wh Bosch Speed) | tot ~120–145 km (Ion 500 Wh)',
  top_speed_text = '45 km/h (speed-pedelec)',
  description = 'De Sparta e-Speed D11S is een speed-pedelec (45 km/u) bedoeld voor woon-werk. Generatie-afhankelijk vind je in de e-Speed-lijn: Vroege e-Speed (±2014–2016) met ION XHP achternaafmotor en 500 Wh, of latere e-Speed/d-Burst varianten (±2021–2022) met Bosch Performance Line Speed middenmotor en 625 Wh geïntegreerde accu. De aanduiding D11S past het best bij een sportieve uitvoering met 11-speed derailleur in speed-trim.'
WHERE id = '550e8400-e29b-41d4-a716-446655440016';
