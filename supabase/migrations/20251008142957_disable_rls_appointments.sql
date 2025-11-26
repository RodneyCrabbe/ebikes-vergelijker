-- Disable Row Level Security on appointments table to allow public access
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

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
