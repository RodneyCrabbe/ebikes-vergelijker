-- Allow guest appointments by modifying RLS policies
-- Drop existing appointment policies
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;

-- Create new policies that allow both authenticated and guest appointments
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND guest_email IS NOT NULL)
  );

CREATE POLICY "Users can insert own appointments" ON appointments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (user_id IS NULL AND guest_email IS NOT NULL)
  );

CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND guest_email IS NOT NULL)
  );

CREATE POLICY "Users can delete own appointments" ON appointments
  FOR DELETE USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND guest_email IS NOT NULL)
  );
