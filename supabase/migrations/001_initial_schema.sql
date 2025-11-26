-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- E-bikes table
CREATE TABLE ebikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand VARCHAR(100) NOT NULL,
  model_name VARCHAR(150) NOT NULL,
  version VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  build_date DATE,
  gender_type VARCHAR(20) CHECK (gender_type IN ('man', 'vrouw', 'unisex')),
  action_radius INTEGER,
  battery_capacity INTEGER,
  top_speed INTEGER,
  image_url TEXT,
  affiliate_url TEXT NOT NULL,
  cpl_rate DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(100),
  newsletter_subscribed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved comparisons
CREATE TABLE saved_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200),
  ebike_ids UUID[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ebike_id UUID REFERENCES ebikes(id),
  guest_email VARCHAR(255),
  guest_name VARCHAR(100),
  appointment_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ebike_id UUID REFERENCES ebikes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  content TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lead tracking
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ebike_id UUID REFERENCES ebikes(id),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  cpl_earned DECIMAL(10,2),
  clicked_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter subscriptions
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX idx_ebikes_brand ON ebikes(brand);
CREATE INDEX idx_ebikes_price ON ebikes(price);
CREATE INDEX idx_ebikes_gender_type ON ebikes(gender_type);
CREATE INDEX idx_leads_ebike_id ON leads(ebike_id);
CREATE INDEX idx_reviews_ebike_id ON reviews(ebike_id);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_saved_comparisons_user_id ON saved_comparisons(user_id);

-- Insert sample data
INSERT INTO ebikes (brand, model_name, price, gender_type, action_radius, battery_capacity, top_speed, affiliate_url, cpl_rate, description) VALUES
  ('Gazelle', 'Ultimate C8+ HMB', 3499.00, 'unisex', 120, 500, 25, 'https://example.com/gazelle-ultimate', 45.00, 'De Gazelle Ultimate C8+ HMB is een premium e-bike met uitstekende rijkwaliteit.'),
  ('VanMoof', 'S5', 2498.00, 'unisex', 150, 487, 32, 'https://example.com/vanmoof-s5', 50.00, 'De VanMoof S5 is een slimme e-bike met geïntegreerde technologie.'),
  ('Sparta', 'e-Speed D11S', 2899.00, 'man', 100, 500, 25, 'https://example.com/sparta-espeed', 40.00, 'De Sparta e-Speed D11S is perfect voor dagelijks woon-werkverkeer.'),
  ('Batavus', 'Diva E-go Power', 2599.00, 'vrouw', 110, 400, 25, 'https://example.com/batavus-diva', 38.00, 'De Batavus Diva E-go Power combineert stijl met comfort.'),
  ('Koga', 'E-Nova Evo', 3199.00, 'unisex', 130, 625, 25, 'https://example.com/koga-enova', 42.00, 'De Koga E-Nova Evo biedt uitzonderlijke prestaties en duurzaamheid.'),
  ('Giant', 'Explore E+ 1', 2799.00, 'unisex', 140, 500, 25, 'https://example.com/giant-explore', 43.00, 'De Giant Explore E+ 1 is ideaal voor lange ritten en avonturen.');
