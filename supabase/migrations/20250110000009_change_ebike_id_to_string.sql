-- First, drop all foreign key constraints that reference ebikes(id)
DO $$
BEGIN
    -- Drop appointments foreign key constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%appointments_ebike_id_fkey%'
    ) THEN
        ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_ebike_id_fkey;
    END IF;
    
    -- Drop reviews foreign key constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%reviews_ebike_id_fkey%'
    ) THEN
        ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_ebike_id_fkey;
    END IF;
    
    -- Drop leads foreign key constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%leads_ebike_id_fkey%'
    ) THEN
        ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_ebike_id_fkey;
    END IF;
    
    -- Drop saved_ebikes foreign key constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%saved_ebikes_ebike_id_fkey%'
    ) THEN
        ALTER TABLE saved_ebikes DROP CONSTRAINT IF EXISTS saved_ebikes_ebike_id_fkey;
    END IF;
    
    -- Drop favorites foreign key constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%favorites_ebike_id_fkey%'
    ) THEN
        ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_ebike_id_fkey;
    END IF;
END $$;

-- Also update the ebikes table id column to VARCHAR if it's UUID
-- First check if it exists and is UUID type
DO $$ 
BEGIN
    -- Check if ebikes table exists and has id column
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ebikes') THEN
        -- Check if id column is UUID type
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'ebikes' 
            AND column_name = 'id' 
            AND data_type = 'uuid'
        ) THEN
            -- Change ebikes.id from UUID to VARCHAR
            ALTER TABLE ebikes ALTER COLUMN id TYPE VARCHAR(255);
        END IF;
    END IF;
END $$;

-- Now change ebike_id columns from UUID to VARCHAR to support string IDs
ALTER TABLE appointments 
ALTER COLUMN ebike_id TYPE VARCHAR(255);

ALTER TABLE reviews 
ALTER COLUMN ebike_id TYPE VARCHAR(255);

ALTER TABLE leads 
ALTER COLUMN ebike_id TYPE VARCHAR(255);

ALTER TABLE saved_ebikes 
ALTER COLUMN ebike_id TYPE VARCHAR(255);

ALTER TABLE favorites 
ALTER COLUMN ebike_id TYPE VARCHAR(255);

-- Recreate all foreign key constraints
ALTER TABLE appointments 
ADD CONSTRAINT appointments_ebike_id_fkey 
FOREIGN KEY (ebike_id) REFERENCES ebikes(id);

ALTER TABLE reviews 
ADD CONSTRAINT reviews_ebike_id_fkey 
FOREIGN KEY (ebike_id) REFERENCES ebikes(id) ON DELETE CASCADE;

ALTER TABLE leads 
ADD CONSTRAINT leads_ebike_id_fkey 
FOREIGN KEY (ebike_id) REFERENCES ebikes(id);

ALTER TABLE saved_ebikes 
ADD CONSTRAINT saved_ebikes_ebike_id_fkey 
FOREIGN KEY (ebike_id) REFERENCES ebikes(id) ON DELETE CASCADE;

ALTER TABLE favorites 
ADD CONSTRAINT favorites_ebike_id_fkey 
FOREIGN KEY (ebike_id) REFERENCES ebikes(id) ON DELETE CASCADE;
