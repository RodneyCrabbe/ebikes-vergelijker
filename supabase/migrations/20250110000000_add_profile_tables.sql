-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Nederland',
  date_of_birth DATE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Update saved_comparisons table to add missing columns
ALTER TABLE saved_comparisons 
ADD COLUMN IF NOT EXISTS comparison_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Make name column NOT NULL if it isn't already
ALTER TABLE saved_comparisons ALTER COLUMN name SET NOT NULL;

-- Create saved_ebikes table
CREATE TABLE IF NOT EXISTS saved_ebikes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ebike_id UUID REFERENCES ebikes(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ebike_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ebike_id UUID REFERENCES ebikes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ebike_id)
);

-- Update appointments table to add missing columns
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Make title column NOT NULL if it isn't already
ALTER TABLE appointments ALTER COLUMN title SET NOT NULL;

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_ebikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for saved_comparisons
CREATE POLICY "Users can view own comparisons" ON saved_comparisons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own comparisons" ON saved_comparisons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comparisons" ON saved_comparisons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comparisons" ON saved_comparisons
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for saved_ebikes
CREATE POLICY "Users can view own saved ebikes" ON saved_ebikes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved ebikes" ON saved_ebikes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved ebikes" ON saved_ebikes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved ebikes" ON saved_ebikes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites" ON favorites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for appointments
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments" ON appointments
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_comparisons_user_id ON saved_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_ebikes_user_id ON saved_ebikes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_comparisons_updated_at
  BEFORE UPDATE ON saved_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
