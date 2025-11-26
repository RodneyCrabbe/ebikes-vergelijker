-- Create dealers table
CREATE TABLE IF NOT EXISTS dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  country VARCHAR(100) DEFAULT 'Netherlands',
  website VARCHAR(255),
  description TEXT,
  logo_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create dealer leads table
CREATE TABLE IF NOT EXISTS dealer_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ebike_id VARCHAR(255) REFERENCES ebikes(id) ON DELETE CASCADE,
  lead_type VARCHAR(50) NOT NULL CHECK (lead_type IN ('appointment', 'inquiry', 'purchase_intent', 'test_ride')),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'referral', 'advertisement', 'direct')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  contact_info JSONB NOT NULL,
  ebike_info JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  contacted_at TIMESTAMP,
  converted_at TIMESTAMP
);

-- Create dealer performance table
CREATE TABLE IF NOT EXISTS dealer_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  period VARCHAR(20) NOT NULL, -- e.g., '30d', '90d', '1y'
  total_leads INTEGER DEFAULT 0,
  converted_leads INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  total_revenue DECIMAL(10,2) DEFAULT 0.00,
  commission_earned DECIMAL(10,2) DEFAULT 0.00,
  avg_response_time DECIMAL(5,2) DEFAULT 0.00, -- in hours
  customer_satisfaction DECIMAL(3,2) DEFAULT 0.00, -- 1-5 rating
  top_ebikes JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(dealer_id, period)
);

-- Create dealer commissions table
CREATE TABLE IF NOT EXISTS dealer_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES dealer_leads(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create dealer settings table
CREATE TABLE IF NOT EXISTS dealer_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE UNIQUE,
  auto_respond BOOLEAN DEFAULT false,
  response_template TEXT,
  working_hours JSONB DEFAULT '{
    "monday": {"start": "09:00", "end": "17:00", "enabled": true},
    "tuesday": {"start": "09:00", "end": "17:00", "enabled": true},
    "wednesday": {"start": "09:00", "end": "17:00", "enabled": true},
    "thursday": {"start": "09:00", "end": "17:00", "enabled": true},
    "friday": {"start": "09:00", "end": "17:00", "enabled": true},
    "saturday": {"start": "10:00", "end": "16:00", "enabled": true},
    "sunday": {"start": "10:00", "end": "16:00", "enabled": false}
  }',
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "sms": false,
    "push": true
  }',
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dealers_user_id ON dealers(user_id);
CREATE INDEX IF NOT EXISTS idx_dealers_status ON dealers(status);
CREATE INDEX IF NOT EXISTS idx_dealer_leads_dealer_id ON dealer_leads(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_leads_status ON dealer_leads(status);
CREATE INDEX IF NOT EXISTS idx_dealer_leads_created_at ON dealer_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_dealer_performance_dealer_id ON dealer_performance(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_performance_period ON dealer_performance(period);
CREATE INDEX IF NOT EXISTS idx_dealer_commissions_dealer_id ON dealer_commissions(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_commissions_status ON dealer_commissions(status);

-- Create function to calculate dealer performance
CREATE OR REPLACE FUNCTION calculate_dealer_performance(
  p_dealer_id UUID,
  p_period VARCHAR(20)
)
RETURNS VOID AS $$
DECLARE
  period_start TIMESTAMP;
  period_end TIMESTAMP;
  total_leads_count INTEGER;
  converted_leads_count INTEGER;
  conversion_rate_val DECIMAL(5,2);
  total_revenue_val DECIMAL(10,2);
  commission_earned_val DECIMAL(10,2);
  avg_response_time_val DECIMAL(5,2);
  top_ebikes_data JSONB;
BEGIN
  -- Calculate period dates
  CASE p_period
    WHEN '30d' THEN
      period_start := NOW() - INTERVAL '30 days';
      period_end := NOW();
    WHEN '90d' THEN
      period_start := NOW() - INTERVAL '90 days';
      period_end := NOW();
    WHEN '1y' THEN
      period_start := NOW() - INTERVAL '1 year';
      period_end := NOW();
    ELSE
      period_start := NOW() - INTERVAL '30 days';
      period_end := NOW();
  END CASE;

  -- Get total leads
  SELECT COUNT(*)
  INTO total_leads_count
  FROM dealer_leads
  WHERE dealer_id = p_dealer_id
    AND created_at >= period_start
    AND created_at <= period_end;

  -- Get converted leads
  SELECT COUNT(*)
  INTO converted_leads_count
  FROM dealer_leads
  WHERE dealer_id = p_dealer_id
    AND status = 'converted'
    AND created_at >= period_start
    AND created_at <= period_end;

  -- Calculate conversion rate
  IF total_leads_count > 0 THEN
    conversion_rate_val := (converted_leads_count::DECIMAL / total_leads_count) * 100;
  ELSE
    conversion_rate_val := 0;
  END IF;

  -- Calculate total revenue (from converted leads)
  SELECT COALESCE(SUM((ebike_info->>'price')::DECIMAL), 0)
  INTO total_revenue_val
  FROM dealer_leads
  WHERE dealer_id = p_dealer_id
    AND status = 'converted'
    AND created_at >= period_start
    AND created_at <= period_end;

  -- Calculate commission earned
  SELECT COALESCE(SUM(amount), 0)
  INTO commission_earned_val
  FROM dealer_commissions
  WHERE dealer_id = p_dealer_id
    AND status = 'paid'
    AND created_at >= period_start
    AND created_at <= period_end;

  -- Calculate average response time (simplified)
  SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (contacted_at - created_at)) / 3600), 0)
  INTO avg_response_time_val
  FROM dealer_leads
  WHERE dealer_id = p_dealer_id
    AND contacted_at IS NOT NULL
    AND created_at >= period_start
    AND created_at <= period_end;

  -- Get top e-bikes
  SELECT jsonb_agg(
    jsonb_build_object(
      'ebike_id', ebike_id,
      'leads_count', leads_count,
      'conversion_rate', conversion_rate
    )
  )
  INTO top_ebikes_data
  FROM (
    SELECT 
      ebike_id,
      COUNT(*) as leads_count,
      (COUNT(*) FILTER (WHERE status = 'converted')::DECIMAL / COUNT(*)) * 100 as conversion_rate
    FROM dealer_leads
    WHERE dealer_id = p_dealer_id
      AND created_at >= period_start
      AND created_at <= period_end
    GROUP BY ebike_id
    ORDER BY leads_count DESC
    LIMIT 5
  ) top_ebikes;

  -- Insert or update performance data
  INSERT INTO dealer_performance (
    dealer_id,
    period,
    total_leads,
    converted_leads,
    conversion_rate,
    total_revenue,
    commission_earned,
    avg_response_time,
    top_ebikes
  ) VALUES (
    p_dealer_id,
    p_period,
    total_leads_count,
    converted_leads_count,
    conversion_rate_val,
    total_revenue_val,
    commission_earned_val,
    avg_response_time_val,
    COALESCE(top_ebikes_data, '[]'::jsonb)
  )
  ON CONFLICT (dealer_id, period)
  DO UPDATE SET
    total_leads = EXCLUDED.total_leads,
    converted_leads = EXCLUDED.converted_leads,
    conversion_rate = EXCLUDED.conversion_rate,
    total_revenue = EXCLUDED.total_revenue,
    commission_earned = EXCLUDED.commission_earned,
    avg_response_time = EXCLUDED.avg_response_time,
    top_ebikes = EXCLUDED.top_ebikes,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to create commission when lead is converted
CREATE OR REPLACE FUNCTION create_commission_on_conversion()
RETURNS TRIGGER AS $$
DECLARE
  dealer_commission_rate DECIMAL(5,2);
  ebike_price DECIMAL(10,2);
  commission_amount DECIMAL(10,2);
BEGIN
  -- Only process if status changed to 'converted'
  IF NEW.status = 'converted' AND (OLD.status IS NULL OR OLD.status != 'converted') THEN
    -- Get dealer commission rate
    SELECT commission_rate
    INTO dealer_commission_rate
    FROM dealers
    WHERE id = NEW.dealer_id;

    -- Get e-bike price
    SELECT (NEW.ebike_info->>'price')::DECIMAL
    INTO ebike_price
    WHERE NEW.ebike_info->>'price' IS NOT NULL;

    -- Calculate commission (only if price is available)
    IF ebike_price IS NOT NULL AND ebike_price > 0 THEN
      commission_amount := ebike_price * (dealer_commission_rate / 100);

      -- Insert commission record
      INSERT INTO dealer_commissions (
        dealer_id,
        lead_id,
        amount,
        status
      ) VALUES (
        NEW.dealer_id,
        NEW.id,
        commission_amount,
        'pending'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for commission creation
CREATE OR REPLACE TRIGGER trg_create_commission_on_conversion
  AFTER UPDATE ON dealer_leads
  FOR EACH ROW EXECUTE FUNCTION create_commission_on_conversion();

-- Enable RLS on dealer tables
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for dealers
CREATE POLICY "Dealers can view their own profile" ON dealers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Dealers can update their own profile" ON dealers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Dealers can insert their own profile" ON dealers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for dealer_leads
CREATE POLICY "Dealers can view their own leads" ON dealer_leads
  FOR SELECT USING (
    dealer_id IN (
      SELECT id FROM dealers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Dealers can update their own leads" ON dealer_leads
  FOR UPDATE USING (
    dealer_id IN (
      SELECT id FROM dealers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert leads" ON dealer_leads
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for dealer_performance
CREATE POLICY "Dealers can view their own performance" ON dealer_performance
  FOR SELECT USING (
    dealer_id IN (
      SELECT id FROM dealers WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for dealer_commissions
CREATE POLICY "Dealers can view their own commissions" ON dealer_commissions
  FOR SELECT USING (
    dealer_id IN (
      SELECT id FROM dealers WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for dealer_settings
CREATE POLICY "Dealers can view their own settings" ON dealer_settings
  FOR SELECT USING (
    dealer_id IN (
      SELECT id FROM dealers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Dealers can update their own settings" ON dealer_settings
  FOR UPDATE USING (
    dealer_id IN (
      SELECT id FROM dealers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Dealers can insert their own settings" ON dealer_settings
  FOR INSERT WITH CHECK (
    dealer_id IN (
      SELECT id FROM dealers WHERE user_id = auth.uid()
    )
  );
