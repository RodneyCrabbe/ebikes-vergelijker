-- Add missing profile columns

-- Add province column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS province VARCHAR(100);

-- Add postcode column as alias for postal_code
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS postcode VARCHAR(20);

-- Add avatar_url column for profile pictures
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comment
COMMENT ON COLUMN profiles.province IS 'Province where the user lives';
COMMENT ON COLUMN profiles.postcode IS 'Postal code (same as postal_code, for convenience)';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user profile picture';
