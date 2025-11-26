-- Fix RLS policies for ebikes table to ensure public access
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to ebikes" ON ebikes;
DROP POLICY IF EXISTS "Allow public insert access to ebikes" ON ebikes;
DROP POLICY IF EXISTS "Allow public update access to ebikes" ON ebikes;

-- Disable RLS temporarily
ALTER TABLE ebikes DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE ebikes ENABLE ROW LEVEL SECURITY;

-- Create policies that allow public access
CREATE POLICY "Allow public read access to ebikes" ON ebikes
    FOR SELECT USING (true);

-- Test the connection by selecting a few e-bikes
DO $$
DECLARE
    ebike_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO ebike_count FROM ebikes;
    RAISE NOTICE 'E-bikes count: %', ebike_count;
    
    IF ebike_count = 0 THEN
        RAISE NOTICE 'No e-bikes found in database!';
    ELSE
        RAISE NOTICE 'E-bikes found: %', ebike_count;
    END IF;
END $$;
