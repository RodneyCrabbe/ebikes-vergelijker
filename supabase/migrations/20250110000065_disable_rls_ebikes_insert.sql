-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to ebikes" ON ebikes;
DROP POLICY IF EXISTS "Allow public insert access to ebikes" ON ebikes;
DROP POLICY IF EXISTS "Allow public update access to ebikes" ON ebikes;

-- Disable Row Level Security on ebikes table to allow public access
ALTER TABLE ebikes DISABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to ebikes
CREATE POLICY "Allow public read access to ebikes" ON ebikes
    FOR SELECT USING (true);

-- Create a policy to allow public insert access to ebikes
CREATE POLICY "Allow public insert access to ebikes" ON ebikes
    FOR INSERT WITH CHECK (true);

-- Create a policy to allow public update access to ebikes
CREATE POLICY "Allow public update access to ebikes" ON ebikes
    FOR UPDATE USING (true) WITH CHECK (true);

-- Enable RLS again but with the public policies
ALTER TABLE ebikes ENABLE ROW LEVEL SECURITY;
