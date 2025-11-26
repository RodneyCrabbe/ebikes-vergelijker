-- Create appointments table with proper references
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ebike_id VARCHAR(255) REFERENCES ebikes(id),
  guest_email VARCHAR(255),
  guest_name VARCHAR(100),
  dealer_id VARCHAR(255),
  type VARCHAR(50) CHECK (type IN ('test_drive', 'purchase_consultation', 'repair_service')),
  date DATE,
  time TIME,
  duration INTEGER DEFAULT 60,
  appointment_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_ebike_id ON appointments(ebike_id);
CREATE INDEX IF NOT EXISTS idx_appointments_dealer_id ON appointments(dealer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_type ON appointments(type);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Disable Row Level Security on appointments table to allow public access
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to appointments" ON appointments;
DROP POLICY IF EXISTS "Allow public insert access to appointments" ON appointments;
DROP POLICY IF EXISTS "Allow public update access to appointments" ON appointments;
DROP POLICY IF EXISTS "Allow public delete access to appointments" ON appointments;

-- Create a policy to allow public read access to appointments
CREATE POLICY "Allow public read access to appointments" ON appointments
    FOR SELECT USING (true);

-- Create a policy to allow public insert access to appointments
CREATE POLICY "Allow public insert access to appointments" ON appointments
    FOR INSERT WITH CHECK (true);

-- Create a policy to allow public update access to appointments
CREATE POLICY "Allow public update access to appointments" ON appointments
    FOR UPDATE USING (true);

-- Create a policy to allow public delete access to appointments
CREATE POLICY "Allow public delete access to appointments" ON appointments
    FOR DELETE USING (true);

-- Enable RLS again but with the public policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
