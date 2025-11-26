-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, plan_id)
);

-- Create subscription usage tracking table
CREATE TABLE IF NOT EXISTS subscription_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  feature_type VARCHAR(50) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, subscription_id, feature_type, period_start)
);

-- Create subscription limits table
CREATE TABLE IF NOT EXISTS subscription_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id VARCHAR(50) NOT NULL,
  feature_type VARCHAR(50) NOT NULL,
  limit_value INTEGER NOT NULL,
  is_unlimited BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(plan_id, feature_type)
);

-- Insert subscription limits
INSERT INTO subscription_limits (plan_id, feature_type, limit_value, is_unlimited) VALUES
('free', 'saved_bikes', 3, false),
('free', 'comparisons', 5, false),
('free', 'price_alerts', 0, false),
('free', 'ai_chat_messages', 10, false),
('free', 'export_reports', 0, false),
('free', 'priority_support', 0, false),
('free', 'ad_free', 0, false),

('premium', 'saved_bikes', 0, true),
('premium', 'comparisons', 0, true),
('premium', 'price_alerts', 20, false),
('premium', 'ai_chat_messages', 0, true),
('premium', 'export_reports', 1, false),
('premium', 'priority_support', 1, false),
('premium', 'ad_free', 1, false),

('premium_yearly', 'saved_bikes', 0, true),
('premium_yearly', 'comparisons', 0, true),
('premium_yearly', 'price_alerts', 20, false),
('premium_yearly', 'ai_chat_messages', 0, true),
('premium_yearly', 'export_reports', 1, false),
('premium_yearly', 'priority_support', 1, false),
('premium_yearly', 'ad_free', 1, false);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_user_id ON subscription_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_subscription_id ON subscription_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_limits_plan_id ON subscription_limits(plan_id);

-- Create function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limit(
  p_user_id UUID,
  p_feature_type VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
  current_limit INTEGER;
  current_usage INTEGER;
  is_unlimited BOOLEAN;
BEGIN
  -- Get current subscription
  SELECT sl.limit_value, sl.is_unlimited
  INTO current_limit, is_unlimited
  FROM user_subscriptions us
  JOIN subscription_limits sl ON us.plan_id = sl.plan_id
  WHERE us.user_id = p_user_id
    AND us.status = 'active'
    AND sl.feature_type = p_feature_type
  ORDER BY us.created_at DESC
  LIMIT 1;

  -- If no subscription found, use free plan limits
  IF current_limit IS NULL THEN
    SELECT sl.limit_value, sl.is_unlimited
    INTO current_limit, is_unlimited
    FROM subscription_limits sl
    WHERE sl.plan_id = 'free'
      AND sl.feature_type = p_feature_type;
  END IF;

  -- If unlimited, return true
  IF is_unlimited THEN
    RETURN TRUE;
  END IF;

  -- Get current usage for this period
  SELECT COALESCE(SUM(usage_count), 0)
  INTO current_usage
  FROM subscription_usage su
  JOIN user_subscriptions us ON su.subscription_id = us.id
  WHERE us.user_id = p_user_id
    AND su.feature_type = p_feature_type
    AND su.period_start <= NOW()
    AND su.period_end >= NOW();

  -- Check if usage is within limit
  RETURN current_usage < current_limit;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment usage
CREATE OR REPLACE FUNCTION increment_subscription_usage(
  p_user_id UUID,
  p_feature_type VARCHAR(50),
  p_increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
  current_subscription_id UUID;
  current_period_start TIMESTAMP;
  current_period_end TIMESTAMP;
BEGIN
  -- Get current subscription
  SELECT id, current_period_start, current_period_end
  INTO current_subscription_id, current_period_start, current_period_end
  FROM user_subscriptions
  WHERE user_id = p_user_id
    AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;

  -- If no subscription, use free plan (no tracking needed)
  IF current_subscription_id IS NULL THEN
    RETURN;
  END IF;

  -- Insert or update usage
  INSERT INTO subscription_usage (
    user_id,
    subscription_id,
    feature_type,
    usage_count,
    period_start,
    period_end
  ) VALUES (
    p_user_id,
    current_subscription_id,
    p_feature_type,
    p_increment,
    current_period_start,
    current_period_end
  )
  ON CONFLICT (user_id, subscription_id, feature_type, period_start)
  DO UPDATE SET
    usage_count = subscription_usage.usage_count + p_increment,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to get user's current plan
CREATE OR REPLACE FUNCTION get_user_current_plan(p_user_id UUID)
RETURNS TABLE(
  plan_id VARCHAR(50),
  status VARCHAR(20),
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT us.plan_id, us.status, us.current_period_end, us.cancel_at_period_end
  FROM user_subscriptions us
  WHERE us.user_id = p_user_id
    AND us.status = 'active'
  ORDER BY us.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on subscription tables
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for subscription_usage
CREATE POLICY "Users can view their own usage" ON subscription_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage data" ON subscription_usage
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update usage data" ON subscription_usage
  FOR UPDATE USING (true);
