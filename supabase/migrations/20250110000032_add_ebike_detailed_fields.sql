-- Add detailed fields for comprehensive e-bike information
-- This migration adds fields for multiple images, detailed specifications, and enhanced product data

-- Add new columns for detailed e-bike information
ALTER TABLE ebikes
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS wheel_size VARCHAR(20),
ADD COLUMN IF NOT EXISTS tire_size VARCHAR(50),
ADD COLUMN IF NOT EXISTS frame_material VARCHAR(50),
ADD COLUMN IF NOT EXISTS motor_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS motor_power_w INTEGER,
ADD COLUMN IF NOT EXISTS torque_nm DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS battery_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS battery_voltage INTEGER,
ADD COLUMN IF NOT EXISTS battery_ah DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS charging_time_hours DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS brake_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS gear_system VARCHAR(100),
ADD COLUMN IF NOT EXISTS suspension VARCHAR(100),
ADD COLUMN IF NOT EXISTS lighting VARCHAR(100),
ADD COLUMN IF NOT EXISTS display VARCHAR(100),
ADD COLUMN IF NOT EXISTS connectivity JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS warranty_years INTEGER,
ADD COLUMN IF NOT EXISTS certification VARCHAR(100);

-- Add comments to document the new fields
COMMENT ON COLUMN ebikes.images IS 'Array of image URLs for product gallery';
COMMENT ON COLUMN ebikes.colors IS 'Available color options with names and availability';
COMMENT ON COLUMN ebikes.highlights IS 'Key product highlights and features';
COMMENT ON COLUMN ebikes.specifications IS 'Detailed technical specifications as JSON';
COMMENT ON COLUMN ebikes.features IS 'List of product features and capabilities';
COMMENT ON COLUMN ebikes.weight_kg IS 'Total weight in kilograms';
COMMENT ON COLUMN ebikes.wheel_size IS 'Wheel diameter (e.g., 20", 26", 27.5")';
COMMENT ON COLUMN ebikes.tire_size IS 'Tire dimensions (e.g., 20x4.5, 26x2.1)';
COMMENT ON COLUMN ebikes.frame_material IS 'Frame construction material';
COMMENT ON COLUMN ebikes.motor_type IS 'Motor type and location (e.g., "achternaaf 250W")';
COMMENT ON COLUMN ebikes.motor_power_w IS 'Motor power in watts';
COMMENT ON COLUMN ebikes.torque_nm IS 'Motor torque in Newton meters';
COMMENT ON COLUMN ebikes.battery_type IS 'Battery chemistry type (e.g., "Lithium-ion")';
COMMENT ON COLUMN ebikes.battery_voltage IS 'Battery voltage in volts';
COMMENT ON COLUMN ebikes.battery_ah IS 'Battery capacity in amp-hours';
COMMENT ON COLUMN ebikes.charging_time_hours IS 'Full charging time in hours';
COMMENT ON COLUMN ebikes.brake_type IS 'Brake system type (e.g., "Hydraulische schijfremmen")';
COMMENT ON COLUMN ebikes.gear_system IS 'Gear system description';
COMMENT ON COLUMN ebikes.suspension IS 'Suspension system details';
COMMENT ON COLUMN ebikes.lighting IS 'Lighting system description';
COMMENT ON COLUMN ebikes.display IS 'Display/interface description';
COMMENT ON COLUMN ebikes.connectivity IS 'Connectivity features (app, GPS, etc.)';
COMMENT ON COLUMN ebikes.warranty_years IS 'Warranty period in years';
COMMENT ON COLUMN ebikes.certification IS 'Safety certifications (e.g., "EU EPAC")';

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_ebikes_weight_kg ON ebikes(weight_kg);
CREATE INDEX IF NOT EXISTS idx_ebikes_motor_power_w ON ebikes(motor_power_w);
CREATE INDEX IF NOT EXISTS idx_ebikes_battery_voltage ON ebikes(battery_voltage);
CREATE INDEX IF NOT EXISTS idx_ebikes_wheel_size ON ebikes(wheel_size);
CREATE INDEX IF NOT EXISTS idx_ebikes_frame_material ON ebikes(frame_material);
CREATE INDEX IF NOT EXISTS idx_ebikes_brake_type ON ebikes(brake_type);
CREATE INDEX IF NOT EXISTS idx_ebikes_certification ON ebikes(certification);

-- Drop and recreate the ebikes view to include new fields
DROP VIEW IF EXISTS ebikes_with_stats;
CREATE VIEW ebikes_with_stats AS
SELECT
  e.*,
  CASE
    WHEN e.price > 0 THEN
      ROUND((e.price - (SELECT AVG(price) FROM ebikes WHERE price > 0)) /
            (SELECT AVG(price) FROM ebikes WHERE price > 0) * 100)
    ELSE NULL
  END as price_diff_percent,
  CASE
    WHEN e.top_speed_kmh IS NOT NULL THEN
      e.top_speed_kmh >= (SELECT MAX(top_speed_kmh) FROM ebikes)
    ELSE false
  END as is_fastest,
  CASE
    WHEN e.battery_capacity IS NOT NULL THEN
      e.battery_capacity >= (SELECT MAX(battery_capacity) FROM ebikes)
    ELSE false
  END as has_largest_battery,
  CASE
    WHEN e.action_radius_km IS NOT NULL THEN
      e.action_radius_km >= (SELECT MAX(action_radius_km) FROM ebikes)
    ELSE false
  END as has_longest_range
FROM ebikes e;
