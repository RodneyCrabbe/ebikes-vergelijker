-- Temporarily disable RLS for profiles table to allow testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to profiles
CREATE POLICY "Allow public read access to profiles" ON profiles
    FOR SELECT USING (true);

-- Create a policy to allow public insert access to profiles
CREATE POLICY "Allow public insert access to profiles" ON profiles
    FOR INSERT WITH CHECK (true);

-- Create a policy to allow public update access to profiles
CREATE POLICY "Allow public update access to profiles" ON profiles
    FOR UPDATE USING (true) WITH CHECK (true);

-- Enable RLS again but with the public policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
