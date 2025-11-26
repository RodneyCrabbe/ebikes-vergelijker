-- Seed data for local development
-- This file is executed when Supabase starts

-- Ensure we have some test data for development
-- Note: User accounts should be created via the Supabase Auth API, not directly in SQL

-- Insert some sample e-bikes if the table is empty
-- Note: The ebikes table already has 36 e-bikes from migrations, so we don't need to insert more
-- This seed file is mainly for development user creation and other setup

-- Create a function to help with development user creation
CREATE OR REPLACE FUNCTION create_dev_user(
  user_email TEXT,
  user_password TEXT,
  user_name TEXT
) RETURNS TEXT AS $$
DECLARE
  user_id UUID;
BEGIN
  -- This function is a placeholder for development
  -- In practice, users should be created via Supabase Auth API
  -- This ensures proper password hashing and session management
  
  RAISE NOTICE 'To create a test user, use the Supabase Auth API or the registration form in the app';
  RAISE NOTICE 'Email: %, Name: %', user_email, user_name;
  
  RETURN 'Use Supabase Auth API to create users';
END;
$$ LANGUAGE plpgsql;

-- Log that seed data has been loaded
DO $$
BEGIN
    RAISE NOTICE 'Seed data loaded successfully';
    RAISE NOTICE 'E-bikes count: %', (SELECT COUNT(*) FROM ebikes);
    RAISE NOTICE 'To create test users, use the registration form in the app';
END $$;
