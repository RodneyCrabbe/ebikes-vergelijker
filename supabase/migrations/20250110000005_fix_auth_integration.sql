-- Fix authentication integration by using Supabase Auth properly
-- This migration removes the custom users table and creates a proper profiles table

-- First, drop all RLS policies that depend on the user_id column
DROP POLICY IF EXISTS "Users can view own comparisons" ON saved_comparisons;
DROP POLICY IF EXISTS "Users can insert own comparisons" ON saved_comparisons;
DROP POLICY IF EXISTS "Users can update own comparisons" ON saved_comparisons;
DROP POLICY IF EXISTS "Users can delete own comparisons" ON saved_comparisons;

DROP POLICY IF EXISTS "Users can view own saved ebikes" ON saved_ebikes;
DROP POLICY IF EXISTS "Users can insert own saved ebikes" ON saved_ebikes;
DROP POLICY IF EXISTS "Users can update own saved ebikes" ON saved_ebikes;
DROP POLICY IF EXISTS "Users can delete own saved ebikes" ON saved_ebikes;

DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can update own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- Drop all foreign key constraints that reference the custom users table
ALTER TABLE saved_comparisons DROP CONSTRAINT IF EXISTS saved_comparisons_user_id_fkey;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_user_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_user_id_fkey;
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
ALTER TABLE saved_ebikes DROP CONSTRAINT IF EXISTS saved_ebikes_user_id_fkey;
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;

-- Drop the custom users table
DROP TABLE IF EXISTS users CASCADE;

-- Create a proper profiles table that references auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Nederland',
  date_of_birth DATE,
  newsletter_subscribed BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update all tables to reference profiles instead of users
ALTER TABLE saved_comparisons 
  ALTER COLUMN user_id TYPE UUID,
  ADD CONSTRAINT saved_comparisons_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE appointments 
  ALTER COLUMN user_id TYPE UUID,
  ADD CONSTRAINT appointments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE reviews 
  ALTER COLUMN user_id TYPE UUID,
  ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE leads 
  ALTER COLUMN user_id TYPE UUID,
  ADD CONSTRAINT leads_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Drop the old user_profiles table and recreate as profiles
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Update saved_ebikes and favorites tables
ALTER TABLE saved_ebikes 
  ALTER COLUMN user_id TYPE UUID,
  ADD CONSTRAINT saved_ebikes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE favorites 
  ALTER COLUMN user_id TYPE UUID,
  ADD CONSTRAINT favorites_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, newsletter_subscribed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE((NEW.raw_user_meta_data->>'newsletter_subscribed')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_saved_comparisons_user_id ON saved_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_ebikes_user_id ON saved_ebikes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);

-- Create trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
