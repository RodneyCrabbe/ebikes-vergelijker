-- Fix RLS policies to work with auth.users instead of users table
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own comparisons" ON saved_comparisons;
DROP POLICY IF EXISTS "Users can insert own comparisons" ON saved_comparisons;
DROP POLICY IF EXISTS "Users can update own comparisons" ON saved_comparisons;
DROP POLICY IF EXISTS "Users can delete own comparisons" ON saved_comparisons;

-- Create new policies that work with auth.users
CREATE POLICY "Users can view own comparisons" ON saved_comparisons
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own comparisons" ON saved_comparisons
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own comparisons" ON saved_comparisons
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own comparisons" ON saved_comparisons
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Also fix other table policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Fix saved_ebikes policies
DROP POLICY IF EXISTS "Users can view own saved ebikes" ON saved_ebikes;
DROP POLICY IF EXISTS "Users can insert own saved ebikes" ON saved_ebikes;
DROP POLICY IF EXISTS "Users can update own saved ebikes" ON saved_ebikes;
DROP POLICY IF EXISTS "Users can delete own saved ebikes" ON saved_ebikes;

CREATE POLICY "Users can view own saved ebikes" ON saved_ebikes
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own saved ebikes" ON saved_ebikes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own saved ebikes" ON saved_ebikes
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own saved ebikes" ON saved_ebikes
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Fix favorites policies
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can update own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own favorites" ON favorites
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Fix appointments policies
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;

CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own appointments" ON appointments
  FOR DELETE USING (auth.uid()::text = user_id::text);
