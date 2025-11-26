-- Enhanced Dealer Portal Migration
-- Comprehensive dealer management system with inventory, analytics, and commission tracking

-- 1. Enhanced Dealer Inventory Table
CREATE TABLE IF NOT EXISTS dealer_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  
  -- Basic Information
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  version VARCHAR(50),
  price_eur DECIMAL(10,2) NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('unisex', 'male', 'female', 'kids')),
  
  -- Range & Battery
  range_km_claimed INTEGER,
  range_km_verified INTEGER,
  battery_v INTEGER,
  battery_ah DECIMAL(5,2),
  battery_wh INTEGER,
  
  -- Motor & Performance
  motor_power_w_eu INTEGER,
  torque_nm DECIMAL(5,2),
  top_speed_kmh INTEGER,
  
  -- Physical Specifications
  wheel_size VARCHAR(20),
  tire_size VARCHAR(30),
  weight_kg DECIMAL(5,2),
  payload_kg DECIMAL(5,2),
  frame VARCHAR(100),
  brakes VARCHAR(100),
  
  -- Additional Information
  notes TEXT,
  where_to_buy TEXT,
  
  -- Inventory Management
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 1,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Images
  image_urls TEXT[] DEFAULT '{}',
  thumbnail_url VARCHAR(500),
  
  -- SEO & Marketing
  meta_title VARCHAR(200),
  meta_description TEXT,
  keywords TEXT[],
  
  -- Status & Timestamps
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued', 'pending')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Dealer Analytics Events Table
CREATE TABLE IF NOT EXISTS dealer_analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES dealer_inventory(id) ON DELETE CASCADE,
  
  -- Event Details
  event_type VARCHAR(50) NOT NULL, -- 'view', 'click', 'lead', 'conversion', 'sale'
  event_source VARCHAR(50), -- 'website', 'advertisement', 'social_media', 'direct'
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Event Data
  event_data JSONB,
  session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  referrer VARCHAR(500),
  
  -- Location Data
  country VARCHAR(100),
  city VARCHAR(100),
  region VARCHAR(100),
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Enhanced Dealer Leads Table
CREATE TABLE IF NOT EXISTS dealer_leads_enhanced (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES dealer_inventory(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Lead Information
  lead_type VARCHAR(50) NOT NULL CHECK (lead_type IN ('appointment', 'inquiry', 'purchase_intent', 'test_ride', 'quote_request')),
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost', 'nurturing')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  source VARCHAR(50) CHECK (source IN ('website', 'referral', 'advertisement', 'direct', 'social_media', 'email_campaign')),
  
  -- Contact Information
  contact_name VARCHAR(200) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  preferred_contact VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'sms', 'whatsapp')),
  
  -- Lead Details
  message TEXT,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  timeline VARCHAR(50), -- 'immediate', '1_month', '3_months', '6_months', 'flexible'
  financing_needed BOOLEAN DEFAULT false,
  trade_in BOOLEAN DEFAULT false,
  
  -- E-bike Interest
  interested_models TEXT[],
  specific_requirements TEXT,
  test_ride_requested BOOLEAN DEFAULT false,
  
  -- Lead Scoring
  lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
  engagement_level VARCHAR(20) DEFAULT 'low' CHECK (engagement_level IN ('low', 'medium', 'high', 'very_high')),
  
  -- Communication History
  last_contacted_at TIMESTAMP,
  contact_attempts INTEGER DEFAULT 0,
  response_time_hours DECIMAL(5,2),
  
  -- Conversion Tracking
  converted_at TIMESTAMP,
  conversion_value DECIMAL(10,2),
  conversion_source VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Dealer Commission Tracking Table
CREATE TABLE IF NOT EXISTS dealer_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES dealer_leads_enhanced(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES dealer_inventory(id) ON DELETE CASCADE,
  
  -- Commission Details
  commission_type VARCHAR(50) NOT NULL CHECK (commission_type IN ('lead', 'conversion', 'sale', 'referral', 'bonus')),
  base_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL, -- e.g., 0.05 for 5%
  calculated_amount DECIMAL(10,2) NOT NULL,
  bonus_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Status & Payment
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled', 'disputed')),
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  paid_at TIMESTAMP,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Dealer Performance Metrics Table
CREATE TABLE IF NOT EXISTS dealer_performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  
  -- Time Period
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Lead Metrics
  total_leads INTEGER DEFAULT 0,
  new_leads INTEGER DEFAULT 0,
  qualified_leads INTEGER DEFAULT 0,
  converted_leads INTEGER DEFAULT 0,
  lost_leads INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  
  -- View & Click Metrics
  total_views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  click_through_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Revenue Metrics
  total_revenue DECIMAL(12,2) DEFAULT 0,
  commission_earned DECIMAL(10,2) DEFAULT 0,
  average_deal_size DECIMAL(10,2) DEFAULT 0,
  
  -- Response Metrics
  avg_response_time_hours DECIMAL(5,2) DEFAULT 0,
  response_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Customer Satisfaction
  customer_satisfaction_score DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicate metrics
  UNIQUE(dealer_id, period_type, period_start, period_end)
);

-- 6. Dealer Settings Enhanced Table
CREATE TABLE IF NOT EXISTS dealer_settings_enhanced (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE UNIQUE,
  
  -- Business Information
  business_name VARCHAR(200),
  business_type VARCHAR(50) CHECK (business_type IN ('retail', 'wholesale', 'service', 'franchise', 'online')),
  tax_id VARCHAR(100),
  business_license VARCHAR(100),
  
  -- Contact & Location
  primary_contact_name VARCHAR(200),
  primary_contact_email VARCHAR(255),
  primary_contact_phone VARCHAR(50),
  website_url VARCHAR(500),
  social_media JSONB DEFAULT '{}',
  
  -- Working Hours
  working_hours JSONB DEFAULT '{
    "monday": {"start": "09:00", "end": "17:00", "enabled": true},
    "tuesday": {"start": "09:00", "end": "17:00", "enabled": true},
    "wednesday": {"start": "09:00", "end": "17:00", "enabled": true},
    "thursday": {"start": "09:00", "end": "17:00", "enabled": true},
    "friday": {"start": "09:00", "end": "17:00", "enabled": true},
    "saturday": {"start": "10:00", "end": "16:00", "enabled": true},
    "sunday": {"start": "10:00", "end": "16:00", "enabled": false}
  }',
  
  -- Service Areas
  service_areas TEXT[],
  delivery_radius_km INTEGER DEFAULT 50,
  delivery_fee DECIMAL(8,2) DEFAULT 0,
  
  -- Commission Settings
  default_commission_rate DECIMAL(5,4) DEFAULT 0.05,
  commission_tiers JSONB DEFAULT '{}',
  
  -- Notification Preferences
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "sms": false,
    "push": true,
    "lead_notifications": true,
    "commission_notifications": true,
    "inventory_alerts": true,
    "performance_reports": true
  }',
  
  -- Marketing Settings
  marketing_settings JSONB DEFAULT '{
    "auto_respond": true,
    "response_template": "Thank you for your interest in our e-bikes! We will contact you within 24 hours.",
    "follow_up_sequence": true,
    "email_signature": "",
    "social_sharing": true
  }',
  
  -- Inventory Settings
  inventory_settings JSONB DEFAULT '{
    "auto_approve": false,
    "low_stock_threshold": 5,
    "featured_rotation_days": 7,
    "price_update_frequency": "weekly"
  }',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Dealer Communication Log Table
CREATE TABLE IF NOT EXISTS dealer_communication_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES dealer_leads_enhanced(id) ON DELETE CASCADE,
  
  -- Communication Details
  communication_type VARCHAR(50) NOT NULL CHECK (communication_type IN ('email', 'phone', 'sms', 'whatsapp', 'meeting', 'note')),
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject VARCHAR(200),
  content TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'replied', 'failed')),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_dealer_inventory_dealer_id ON dealer_inventory(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_inventory_brand ON dealer_inventory(brand);
CREATE INDEX IF NOT EXISTS idx_dealer_inventory_status ON dealer_inventory(status);
CREATE INDEX IF NOT EXISTS idx_dealer_inventory_price ON dealer_inventory(price_eur);

CREATE INDEX IF NOT EXISTS idx_dealer_analytics_dealer_id ON dealer_analytics_events(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_analytics_inventory_id ON dealer_analytics_events(inventory_id);
CREATE INDEX IF NOT EXISTS idx_dealer_analytics_event_type ON dealer_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_dealer_analytics_created_at ON dealer_analytics_events(created_at);

CREATE INDEX IF NOT EXISTS idx_dealer_leads_dealer_id ON dealer_leads_enhanced(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_leads_status ON dealer_leads_enhanced(status);
CREATE INDEX IF NOT EXISTS idx_dealer_leads_priority ON dealer_leads_enhanced(priority);
CREATE INDEX IF NOT EXISTS idx_dealer_leads_created_at ON dealer_leads_enhanced(created_at);
CREATE INDEX IF NOT EXISTS idx_dealer_leads_lead_score ON dealer_leads_enhanced(lead_score);

CREATE INDEX IF NOT EXISTS idx_dealer_commissions_dealer_id ON dealer_commissions(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_commissions_status ON dealer_commissions(status);
CREATE INDEX IF NOT EXISTS idx_dealer_commissions_created_at ON dealer_commissions(created_at);

CREATE INDEX IF NOT EXISTS idx_dealer_performance_dealer_id ON dealer_performance_metrics(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_performance_period ON dealer_performance_metrics(period_type, period_start, period_end);

-- Enable RLS
ALTER TABLE dealer_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_leads_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_settings_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_communication_log ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Dealers can manage their own inventory" ON dealer_inventory;
DROP POLICY IF EXISTS "Dealers can view their own analytics" ON dealer_analytics_events;
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON dealer_analytics_events;
DROP POLICY IF EXISTS "Dealers can manage their own leads" ON dealer_leads_enhanced;
DROP POLICY IF EXISTS "Dealers can view their own commissions" ON dealer_commissions;
DROP POLICY IF EXISTS "Dealers can view their own performance" ON dealer_performance_metrics;
DROP POLICY IF EXISTS "Dealers can manage their own settings" ON dealer_settings_enhanced;
DROP POLICY IF EXISTS "Dealers can manage their own communication logs" ON dealer_communication_log;

-- Dealer Inventory Policies
CREATE POLICY "Dealers can manage their own inventory" ON dealer_inventory
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

-- Dealer Analytics Policies
CREATE POLICY "Dealers can view their own analytics" ON dealer_analytics_events
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

CREATE POLICY "Anyone can insert analytics events" ON dealer_analytics_events
  FOR INSERT WITH CHECK (true);

-- Dealer Leads Policies
CREATE POLICY "Dealers can manage their own leads" ON dealer_leads_enhanced
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

-- Dealer Commissions Policies
CREATE POLICY "Dealers can view their own commissions" ON dealer_commissions
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

-- Dealer Performance Policies
CREATE POLICY "Dealers can view their own performance" ON dealer_performance_metrics
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

-- Dealer Settings Policies
CREATE POLICY "Dealers can manage their own settings" ON dealer_settings_enhanced
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

-- Dealer Communication Log Policies
CREATE POLICY "Dealers can manage their own communication logs" ON dealer_communication_log
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

-- Create Functions for Analytics
CREATE OR REPLACE FUNCTION calculate_dealer_conversion_rate(dealer_uuid UUID, start_date DATE, end_date DATE)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_leads INTEGER;
  converted_leads INTEGER;
  conversion_rate DECIMAL(5,2);
BEGIN
  SELECT COUNT(*) INTO total_leads
  FROM dealer_leads_enhanced
  WHERE dealer_id = dealer_uuid
    AND created_at >= start_date
    AND created_at <= end_date;
  
  SELECT COUNT(*) INTO converted_leads
  FROM dealer_leads_enhanced
  WHERE dealer_id = dealer_uuid
    AND status = 'converted'
    AND created_at >= start_date
    AND created_at <= end_date;
  
  IF total_leads > 0 THEN
    conversion_rate := (converted_leads::DECIMAL / total_leads::DECIMAL) * 100;
  ELSE
    conversion_rate := 0;
  END IF;
  
  RETURN conversion_rate;
END;
$$ LANGUAGE plpgsql;

-- Create Function for Lead Scoring
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  lead_data RECORD;
  score INTEGER := 0;
BEGIN
  SELECT * INTO lead_data FROM dealer_leads_enhanced WHERE id = lead_uuid;
  
  -- Base score
  score := 10;
  
  -- Budget scoring
  IF lead_data.budget_max > 5000 THEN score := score + 20;
  ELSIF lead_data.budget_max > 3000 THEN score := score + 15;
  ELSIF lead_data.budget_max > 1500 THEN score := score + 10;
  END IF;
  
  -- Timeline scoring
  IF lead_data.timeline = 'immediate' THEN score := score + 25;
  ELSIF lead_data.timeline = '1_month' THEN score := score + 20;
  ELSIF lead_data.timeline = '3_months' THEN score := score + 10;
  END IF;
  
  -- Engagement scoring
  IF lead_data.contact_attempts > 3 THEN score := score + 15;
  ELSIF lead_data.contact_attempts > 1 THEN score := score + 10;
  END IF;
  
  -- Test ride request
  IF lead_data.test_ride_requested THEN score := score + 15;
  END IF;
  
  -- Financing need
  IF lead_data.financing_needed THEN score := score + 10;
  END IF;
  
  -- Cap at 100
  IF score > 100 THEN score := 100; END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Add Comments
COMMENT ON TABLE dealer_inventory IS 'Comprehensive dealer inventory management with detailed e-bike specifications';
COMMENT ON TABLE dealer_analytics_events IS 'Analytics events tracking for dealer performance monitoring';
COMMENT ON TABLE dealer_leads_enhanced IS 'Enhanced lead management with scoring and conversion tracking';
COMMENT ON TABLE dealer_commissions IS 'Commission tracking and payment management for dealers';
COMMENT ON TABLE dealer_performance_metrics IS 'Aggregated performance metrics for dealer analytics';
COMMENT ON TABLE dealer_settings_enhanced IS 'Comprehensive dealer settings and configuration';
COMMENT ON TABLE dealer_communication_log IS 'Communication history tracking for dealer leads';
