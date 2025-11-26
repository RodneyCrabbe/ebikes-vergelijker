-- Fix profiles table foreign key constraint to reference auth.users instead of users
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add foreign key constraint to auth.users
ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
