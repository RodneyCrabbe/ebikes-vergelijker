-- Add missing columns to appointments table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS dealer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS type VARCHAR(50) CHECK (type IN ('test_drive', 'purchase_consultation', 'repair_service')),
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS time TIME,
ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 60;

-- Update the existing appointment_date to be compatible with the new structure
-- We'll keep both for backward compatibility
-- The new 'date' column will be used for the date part, 'time' for the time part
-- and 'appointment_date' will remain as a full timestamp

-- Add index for the new columns
CREATE INDEX IF NOT EXISTS idx_appointments_dealer_id ON appointments(dealer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_type ON appointments(type);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
