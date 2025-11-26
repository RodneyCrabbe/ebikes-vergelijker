-- Update Batavus Diva E-go with basic details
UPDATE ebikes 
SET 
  model_name = 'Diva E-go',
  version = 'Stijlvolle elektrische transportfiets (E-Motion voorwielmotor, 300/400 Wh)',
  price = 1699.00,
  currency = 'EUR',
  build_date = '2016-01-01',
  gender_type = 'vrouw',
  action_radius_km = 100, -- Max range for 300Wh
  top_speed_kmh = 25,
  battery_capacity = 317, -- 300Wh option
  description = 'De Batavus Diva E-go is de elektrische uitvoering van Batavus'' populaire Diva transportfiets: lage instap, voordrager, stuurvergrendeling en Ursus Jumbo tweepootstandaard. Aandrijving via een E-Motion voorwielmotor met keuze uit 300 Wh (≈317 Wh, 36 V 8.8 Ah) of 400 Wh (≈396 Wh, 36 V 11 Ah) drageraccu. Shimano Nexus 7 en rollerbrakes zorgen voor eenvoudig, stadsproof onderhoud. Richtgewicht ± 25,0 kg (excl. accu).'
WHERE id = '550e8400-e29b-41d4-a716-446655440014';
