-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id VARCHAR(255) NOT NULL,
  page_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  properties JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page_url ON analytics_events(page_url);

-- Create analytics views for common queries
CREATE OR REPLACE VIEW analytics_daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as daily_active_users,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) as total_events,
  COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
  COUNT(*) FILTER (WHERE event_type = 'ebike_view') as ebike_views,
  COUNT(*) FILTER (WHERE event_type = 'ebike_comparison') as comparisons,
  COUNT(*) FILTER (WHERE event_type = 'appointment_booked') as appointments,
  COUNT(*) FILTER (WHERE event_type = 'conversion') as conversions
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW analytics_top_pages AS
SELECT 
  page_url,
  COUNT(*) as views,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events
WHERE event_type = 'page_view'
GROUP BY page_url
ORDER BY views DESC
LIMIT 20;

CREATE OR REPLACE VIEW analytics_top_ebikes AS
SELECT 
  properties->>'ebike_id' as ebike_id,
  properties->>'ebike_name' as ebike_name,
  COUNT(*) as views,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events
WHERE event_type = 'ebike_view' 
  AND properties->>'ebike_id' IS NOT NULL
GROUP BY properties->>'ebike_id', properties->>'ebike_name'
ORDER BY views DESC
LIMIT 20;

CREATE OR REPLACE VIEW analytics_conversion_funnel AS
WITH funnel_data AS (
  SELECT 
    CASE 
      WHEN event_type = 'page_view' THEN 'Page View'
      WHEN event_type = 'ebike_view' THEN 'E-bike View'
      WHEN event_type = 'ebike_comparison' THEN 'Comparison'
      WHEN event_type = 'appointment_booked' THEN 'Appointment'
      WHEN event_type = 'conversion' THEN 'Conversion'
    END as step,
    COUNT(DISTINCT user_id) as users
  FROM analytics_events
  WHERE event_type IN ('page_view', 'ebike_view', 'ebike_comparison', 'appointment_booked', 'conversion')
    AND created_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    CASE 
      WHEN event_type = 'page_view' THEN 'Page View'
      WHEN event_type = 'ebike_view' THEN 'E-bike View'
      WHEN event_type = 'ebike_comparison' THEN 'Comparison'
      WHEN event_type = 'appointment_booked' THEN 'Appointment'
      WHEN event_type = 'conversion' THEN 'Conversion'
    END
)
SELECT 
  step,
  users,
  LAG(users) OVER (ORDER BY 
    CASE step
      WHEN 'Page View' THEN 1
      WHEN 'E-bike View' THEN 2
      WHEN 'Comparison' THEN 3
      WHEN 'Appointment' THEN 4
      WHEN 'Conversion' THEN 5
    END
  ) as previous_step_users,
  ROUND(
    (users::DECIMAL / LAG(users) OVER (ORDER BY 
      CASE step
        WHEN 'Page View' THEN 1
        WHEN 'E-bike View' THEN 2
        WHEN 'Comparison' THEN 3
        WHEN 'Appointment' THEN 4
        WHEN 'Conversion' THEN 5
      END
    )) * 100, 2
  ) as conversion_rate,
  ROUND(
    (1 - (users::DECIMAL / LAG(users) OVER (ORDER BY 
      CASE step
        WHEN 'Page View' THEN 1
        WHEN 'E-bike View' THEN 2
        WHEN 'Comparison' THEN 3
        WHEN 'Appointment' THEN 4
        WHEN 'Conversion' THEN 5
      END
    ))) * 100, 2
  ) as drop_off_rate
FROM funnel_data
ORDER BY 
  CASE step
    WHEN 'Page View' THEN 1
    WHEN 'E-bike View' THEN 2
    WHEN 'Comparison' THEN 3
    WHEN 'Appointment' THEN 4
    WHEN 'Conversion' THEN 5
  END;

-- Create function to clean up old analytics events
CREATE OR REPLACE FUNCTION cleanup_old_analytics_events()
RETURNS void AS $$
BEGIN
  -- Delete events older than 1 year
  DELETE FROM analytics_events 
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create function to get user retention data
CREATE OR REPLACE FUNCTION get_user_retention_data(days_back INTEGER DEFAULT 30)
RETURNS TABLE(
  date DATE,
  retention_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  WITH daily_users AS (
    SELECT 
      DATE(created_at) as date,
      COUNT(DISTINCT user_id) as users
    FROM analytics_events
    WHERE user_id IS NOT NULL
      AND created_at >= NOW() - (days_back || ' days')::INTERVAL
    GROUP BY DATE(created_at)
  ),
  retention_calc AS (
    SELECT 
      date,
      users,
      LAG(users) OVER (ORDER BY date) as previous_day_users,
      CASE 
        WHEN LAG(users) OVER (ORDER BY date) > 0 
        THEN ROUND((users::DECIMAL / LAG(users) OVER (ORDER BY date)) * 100, 2)
        ELSE 0
      END as retention_rate
    FROM daily_users
  )
  SELECT 
    date,
    retention_rate
  FROM retention_calc
  WHERE previous_day_users IS NOT NULL
  ORDER BY date;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on analytics events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics events
CREATE POLICY "Analytics events are viewable by authenticated users" ON analytics_events
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Analytics events can be inserted by anyone" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Create function to insert analytics event
CREATE OR REPLACE FUNCTION insert_analytics_event(
  p_event_type VARCHAR(100),
  p_session_id VARCHAR(255),
  p_page_url TEXT,
  p_user_id UUID DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_properties JSONB DEFAULT '{}',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO analytics_events (
    event_type,
    user_id,
    session_id,
    page_url,
    referrer,
    user_agent,
    properties,
    metadata
  ) VALUES (
    p_event_type,
    p_user_id,
    p_session_id,
    p_page_url,
    p_referrer,
    p_user_agent,
    p_properties,
    p_metadata
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql;
