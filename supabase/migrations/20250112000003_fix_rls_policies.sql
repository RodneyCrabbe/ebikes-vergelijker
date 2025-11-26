-- Fix RLS policies for better compatibility

-- Update user_preferences RLS to allow inserts
DROP POLICY IF EXISTS "Users can manage their own preferences" ON user_preferences;
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own preferences" ON user_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Update email_digest_preferences RLS to allow inserts
DROP POLICY IF EXISTS "Users can manage their own email digest preferences" ON email_digest_preferences;
CREATE POLICY "Users can view their own email digest preferences" ON email_digest_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own email digest preferences" ON email_digest_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own email digest preferences" ON email_digest_preferences
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own email digest preferences" ON email_digest_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Update profiles RLS to allow better access
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
