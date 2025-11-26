-- Migration to add new fields to ebikes table
-- Run this in your Supabase SQL Editor

-- Add new columns to ebikes table
ALTER TABLE ebikes
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'EUR',
ADD COLUMN IF NOT EXISTS action_radius_text TEXT,
ADD COLUMN IF NOT EXISTS action_radius_km INTEGER,
ADD COLUMN IF NOT EXISTS top_speed_text TEXT,
ADD COLUMN IF NOT EXISTS top_speed_kmh DECIMAL(5,2);

-- Add comment to document the changes
COMMENT ON COLUMN ebikes.currency IS 'Currency code (EUR, USD, etc.)';
COMMENT ON COLUMN ebikes.action_radius_text IS 'Full action radius text with range and conditions';
COMMENT ON COLUMN ebikes.action_radius_km IS 'Average action radius in kilometers for comparison';
COMMENT ON COLUMN ebikes.top_speed_text IS 'Full top speed text with different regions';
COMMENT ON COLUMN ebikes.top_speed_kmh IS 'Top speed in km/h (EU standard) for comparison';

-- Update existing records to have EUR as default currency if price exists
UPDATE ebikes
SET currency = 'EUR'
WHERE currency IS NULL AND price > 0;

-- Create index on commonly filtered fields for better performance
CREATE INDEX IF NOT EXISTS idx_ebikes_action_radius_km ON ebikes(action_radius_km);
CREATE INDEX IF NOT EXISTS idx_ebikes_top_speed_kmh ON ebikes(top_speed_kmh);
CREATE INDEX IF NOT EXISTS idx_ebikes_currency ON ebikes(currency);

-- Update the ebikes view if you have one (optional)
-- This creates a view with computed fields for easier querying
CREATE OR REPLACE VIEW ebikes_with_stats AS
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
  END as is_fastest
FROM ebikes e;

-- Grant permissions (adjust as needed for your setup)
GRANT SELECT ON ebikes_with_stats TO anon, authenticated;
