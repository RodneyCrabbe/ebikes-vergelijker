-- Ensure RLS policies are properly set up for all user tables
-- Enable RLS on all tables
ALTER TABLE saved_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_ebikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own comparisons" ON saved_comparisons;
DROP POLICY IF EXISTS "Users can insert own comparisons" ON saved_comparisons;
DROP POLICY IF EXISTS "Users can update own comparisons" ON saved_comparisons;
DROP POLICY IF EXISTS "Users can delete own comparisons" ON saved_comparisons;

-- Create RLS policies for saved_comparisons
CREATE POLICY "Users can view own comparisons" ON saved_comparisons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own comparisons" ON saved_comparisons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comparisons" ON saved_comparisons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comparisons" ON saved_comparisons
  FOR DELETE USING (auth.uid() = user_id);

-- Drop and recreate policies for other tables
DROP POLICY IF EXISTS "Users can view own saved ebikes" ON saved_ebikes;
DROP POLICY IF EXISTS "Users can insert own saved ebikes" ON saved_ebikes;
DROP POLICY IF EXISTS "Users can update own saved ebikes" ON saved_ebikes;
DROP POLICY IF EXISTS "Users can delete own saved ebikes" ON saved_ebikes;

CREATE POLICY "Users can view own saved ebikes" ON saved_ebikes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved ebikes" ON saved_ebikes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved ebikes" ON saved_ebikes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved ebikes" ON saved_ebikes
  FOR DELETE USING (auth.uid() = user_id);

-- Drop and recreate policies for favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can update own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites" ON favorites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Drop and recreate policies for appointments
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;

CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments" ON appointments
  FOR DELETE USING (auth.uid() = user_id);

-- Drop and recreate policies for reviews
DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

CREATE POLICY "Users can view own reviews" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Drop and recreate policies for leads
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
DROP POLICY IF EXISTS "Users can insert own leads" ON leads;
DROP POLICY IF EXISTS "Users can update own leads" ON leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON leads;

CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);
