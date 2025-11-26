-- Update SUPER73 ZX with comprehensive technical specifications
UPDATE ebikes 
SET 
  -- General specifications
  weight_kg = 22.0, -- Estimated based on similar models
  
  -- Motor specifications
  motor_type = 'Achter-naafmotor (geared, borstelloos)',
  motor_power_w = 250,
  torque_nm = 0.0, -- Not specified in EU specs
  
  -- Battery specifications
  battery_type = 'Lithium-ion',
  battery_voltage = 48,
  battery_ah = 10.0,
  charging_time_hours = 4.0, -- 2A charger for 10Ah battery
  
  -- Frame specifications
  frame_material = '6061-T6 aluminium',
  wheel_size = '20"',
  tire_size = '20×4″ (SUPER73 Trooper)',
  
  -- Brake and drivetrain
  brake_type = 'Schijfremmen (mechanisch)',
  gear_system = 'Single-speed (EU-spec)',
  suspension = 'Starre voorvork (rigid)',
  
  -- Features
  lighting = 'Geïntegreerde LED koplamp en achterlicht (accuvoeding)',
  display = 'Stuurdisplay + SUPER73-app',
  connectivity = '{"app": true, "gps": false, "bluetooth": true, "super73_app": true}'::jsonb,
  
  -- Additional features
  features = '[
    "EU EPAC gecertificeerd",
    "Toegankelijke Z-serie",
    "Single-speed setup",
    "Moped-stijl frame",
    "Schijfremmen (mechanisch)",
    "Trooper-banden 20×4″",
    "One-size fits all",
    "Geïntegreerde LED verlichting",
    "SUPER73-app connectiviteit",
    "Uitneembare accu met sleutel",
    "Spatwaterbestendig",
    "6061-T6 aluminium frame"
  ]'::jsonb,
  
  -- Enhanced specifications JSON
  specifications = '{
    "algemeen": {
      "merk_model": "SUPER73 ZX",
      "doelgroep": "Unisex",
      "categorie": "Fat-tire stads e-bike / moped-stijl",
      "gewicht": "n.t.b. (EU-specificatie niet consistent gepubliceerd)",
      "payload": "n.t.b. (raadpleeg EU-store/dealer)"
    },
    "motor": {
      "motor": "Achter-naafmotor (geared, borstelloos)",
      "vermogen": "250 W nominaal (EU)",
      "systeem": "SUPER73 controller/elektronica (EU-spec)",
      "ondersteuning": "EU 25 km/u (pedelec)",
      "bediening": "Stuurdisplay + SUPER73-app (iOS/Android)"
    },
    "accu": {
      "accu": "48 V / 10 Ah ≈ 480 Wh",
      "type": "Extern, uitneembaar met sleutel (op bovenbuis)",
      "bereik": "~60 km (claim/opgave) – afhankelijk van stand, terrein, wind/temperatuur, bandenspanning en totaalgewicht",
      "lader": "Standaard 2 A (EU)",
      "extender": "n.v.t."
    },
    "frame": {
      "frame": "6061-T6 aluminium, moped-stijl, one-size",
      "vork": "Starre voorvork (rigid)",
      "wielmaat": "20″",
      "banden": "SUPER73 Trooper 20×4″ (street-pattern)"
    },
    "wielen": {
      "banden": "SUPER73 Trooper 20×4″ (street)",
      "remmen": "Schijfremmen (mechanisch) in EU-uitvoering",
      "aandrijving": "Single-speed (EU-spec)",
      "crank": "n.t.b."
    },
    "features": {
      "verlichting": "Geïntegreerde LED koplamp en achterlicht (accuvoeding)",
      "accessoires": "Optioneel: bagagedrager(s), spatborden, passagiers-voetsteunen, telefoonhouder",
      "connectiviteit": "SUPER73-app (Bluetooth)",
      "waterdichtheid": "Spatwaterbestendig (rijden in regen oké; dompelen vermijden)"
    }
  }'::jsonb,
  
  -- Enhanced highlights
  highlights = '[
    {
      "icon": "⚡",
      "title": "Soepele aandrijving",
      "description": "EU-gelimiteerde 250 W naafmotor (pedelec)"
    },
    {
      "icon": "🔋",
      "title": "Energiepakket",
      "description": "48 V / 10 Ah ≈ 480 Wh accu"
    },
    {
      "icon": "📍",
      "title": "Actieradius",
      "description": "~60 km onder gunstige omstandigheden"
    },
    {
      "icon": "🛡️",
      "title": "Controle & comfort",
      "description": "Schijfremmen en brede 20×4″ Trooper-banden"
    },
    {
      "icon": "🚴‍♂️",
      "title": "Gebruiksgemak",
      "description": "One-size moped-stijl frame; single-speed in EU-spec"
    },
    {
      "icon": "💡",
      "title": "Verlichting",
      "description": "Geïntegreerde LED koplamp en achterlicht"
    },
    {
      "icon": "📱",
      "title": "Connectiviteit",
      "description": "SUPER73-app (Bluetooth) voor iOS/Android"
    },
    {
      "icon": "🔧",
      "title": "Onderhoud",
      "description": "Uitneembare accu met sleutel voor eenvoudig onderhoud"
    }
  ]'::jsonb,
  
  updated_at = NOW()
WHERE id = 'super73-zx-detailed';
