-- Notification System Migration
-- Add comprehensive notification system for user engagement

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),
  read BOOLEAN DEFAULT false,
  data JSONB,
  priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create notification templates table
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) UNIQUE NOT NULL,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ebike_id VARCHAR(255) REFERENCES ebikes(id) ON DELETE CASCADE,
  target_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_checked TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, ebike_id)
);

-- Create email digest preferences table
CREATE TABLE IF NOT EXISTS email_digest_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  frequency VARCHAR(20) DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'never')),
  include_price_alerts BOOLEAN DEFAULT true,
  include_new_reviews BOOLEAN DEFAULT true,
  include_community_activity BOOLEAN DEFAULT true,
  include_recommendations BOOLEAN DEFAULT true,
  last_sent TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create notification delivery logs table
CREATE TABLE IF NOT EXISTS notification_delivery_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  delivery_method VARCHAR(20) NOT NULL CHECK (delivery_method IN ('in_app', 'email', 'push')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  error_message TEXT,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_ebike ON price_alerts(ebike_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active, last_checked);
CREATE INDEX IF NOT EXISTS idx_email_digest_user ON email_digest_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_delivery_notification ON notification_delivery_logs(notification_id);

-- Insert default notification templates
INSERT INTO notification_templates (type, title_template, message_template) VALUES
('price_drop', 'Price Drop Alert: {{ebike_name}}', 'The price of {{ebike_name}} has dropped to €{{new_price}}! That''s a {{discount_percent}}% discount.'),
('new_review', 'New Review: {{ebike_name}}', '{{reviewer_name}} has posted a new review for {{ebike_name}}. Check it out!'),
('appointment_reminder', 'Appointment Reminder', 'You have an appointment for {{ebike_name}} at {{appointment_time}} on {{appointment_date}}.'),
('appointment_confirmed', 'Appointment Confirmed', 'Your appointment for {{ebike_name}} has been confirmed for {{appointment_date}} at {{appointment_time}}.'),
('new_follower', 'New Follower', '{{follower_name}} is now following you!'),
('qa_answer', 'New Answer to Your Question', '{{answerer_name}} has answered your question about {{ebike_name}}.'),
('achievement_unlocked', 'Achievement Unlocked!', 'Congratulations! You''ve unlocked the "{{achievement_title}}" achievement.'),
('weekly_digest', 'Your Weekly E-Bike Digest', 'Here''s what''s new in the e-bike world this week...'),
('new_bike_launch', 'New Bike Alert: {{bike_name}}', 'A new bike matching your preferences has been added: {{bike_name}}!'),
('maintenance_reminder', 'Maintenance Reminder', 'It''s time for maintenance on your {{bike_name}}. {{reminder_type}} is due.')
ON CONFLICT (type) DO NOTHING;

-- Create function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR(50),
  p_title VARCHAR(200),
  p_message TEXT,
  p_link VARCHAR(500) DEFAULT NULL,
  p_data JSONB DEFAULT NULL,
  p_priority VARCHAR(10) DEFAULT 'normal',
  p_expires_at TIMESTAMP DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id, type, title, message, link, data, priority, expires_at
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_link, p_data, p_priority, p_expires_at
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_read(
  p_user_id UUID,
  p_notification_ids UUID[] DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  IF p_notification_ids IS NULL THEN
    UPDATE notifications 
    SET read = true 
    WHERE user_id = p_user_id AND read = false;
  ELSE
    UPDATE notifications 
    SET read = true 
    WHERE user_id = p_user_id AND id = ANY(p_notification_ids);
  END IF;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications 
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to send price drop notifications
CREATE OR REPLACE FUNCTION check_price_drops()
RETURNS INTEGER AS $$
DECLARE
  alert_record RECORD;
  notification_count INTEGER := 0;
BEGIN
  FOR alert_record IN 
    SELECT pa.*, e.brand, e.model_name, e.price as current_price
    FROM price_alerts pa
    JOIN ebikes e ON pa.ebike_id = e.id
    WHERE pa.is_active = true 
    AND e.price < pa.target_price
    AND e.price != pa.current_price
  LOOP
    -- Create notification
    PERFORM create_notification(
      alert_record.user_id,
      'price_drop',
      'Price Drop Alert: ' || alert_record.brand || ' ' || alert_record.model_name,
      'The price has dropped to €' || alert_record.current_price || '!',
      '/e-bikes/' || alert_record.ebike_id,
      json_build_object(
        'ebike_id', alert_record.ebike_id,
        'old_price', alert_record.current_price,
        'new_price', alert_record.current_price,
        'discount_percent', ROUND(((alert_record.current_price - alert_record.current_price) / alert_record.current_price * 100)::numeric, 1)
      ),
      'high'
    );
    
    -- Update current price in alert
    UPDATE price_alerts 
    SET current_price = alert_record.current_price, last_checked = NOW()
    WHERE id = alert_record.id;
    
    notification_count := notification_count + 1;
  END LOOP;
  
  RETURN notification_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to send appointment reminders
CREATE OR REPLACE FUNCTION send_appointment_reminders()
RETURNS INTEGER AS $$
DECLARE
  appointment_record RECORD;
  notification_count INTEGER := 0;
BEGIN
  -- 24 hour reminders
  FOR appointment_record IN 
    SELECT a.*, e.brand, e.model_name, p.name as user_name
    FROM appointments a
    JOIN ebikes e ON a.ebike_id = e.id
    JOIN profiles p ON a.user_id = p.id
    WHERE a.status = 'confirmed'
    AND a.date = CURRENT_DATE + INTERVAL '1 day'
    AND NOT EXISTS (
      SELECT 1 FROM notifications n 
      WHERE n.user_id = a.user_id 
      AND n.type = 'appointment_reminder_24h'
      AND n.data->>'appointment_id' = a.id::text
    )
  LOOP
    PERFORM create_notification(
      appointment_record.user_id,
      'appointment_reminder_24h',
      'Appointment Reminder Tomorrow',
      'You have an appointment for ' || appointment_record.brand || ' ' || appointment_record.model_name || ' tomorrow at ' || appointment_record.time,
      '/appointments/' || appointment_record.id,
      json_build_object('appointment_id', appointment_record.id),
      'normal'
    );
    
    notification_count := notification_count + 1;
  END LOOP;
  
  -- 1 hour reminders
  FOR appointment_record IN 
    SELECT a.*, e.brand, e.model_name, p.name as user_name
    FROM appointments a
    JOIN ebikes e ON a.ebike_id = e.id
    JOIN profiles p ON a.user_id = p.id
    WHERE a.status = 'confirmed'
    AND a.date = CURRENT_DATE
    AND a.time::time <= (CURRENT_TIME + INTERVAL '1 hour')::time
    AND a.time::time > CURRENT_TIME
    AND NOT EXISTS (
      SELECT 1 FROM notifications n 
      WHERE n.user_id = a.user_id 
      AND n.type = 'appointment_reminder_1h'
      AND n.data->>'appointment_id' = a.id::text
    )
  LOOP
    PERFORM create_notification(
      appointment_record.user_id,
      'appointment_reminder_1h',
      'Appointment Starting Soon',
      'Your appointment for ' || appointment_record.brand || ' ' || appointment_record.model_name || ' starts in 1 hour!',
      '/appointments/' || appointment_record.id,
      json_build_object('appointment_id', appointment_record.id),
      'high'
    );
    
    notification_count := notification_count + 1;
  END LOOP;
  
  RETURN notification_count;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_digest_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for notification_templates
CREATE POLICY "Anyone can view notification templates" ON notification_templates 
  FOR SELECT USING (true);

-- Create RLS policies for price_alerts
CREATE POLICY "Users can manage their own price alerts" ON price_alerts 
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for email_digest_preferences
CREATE POLICY "Users can manage their own email digest preferences" ON email_digest_preferences 
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for notification_delivery_logs
CREATE POLICY "Users can view their own notification delivery logs" ON notification_delivery_logs 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM notifications n 
      WHERE n.id = notification_delivery_logs.notification_id 
      AND n.user_id = auth.uid()
    )
  );

-- Add comments for documentation
COMMENT ON TABLE notifications IS 'User notifications for various events';
COMMENT ON TABLE notification_templates IS 'Templates for different notification types';
COMMENT ON TABLE price_alerts IS 'Price drop alerts for specific bikes';
COMMENT ON TABLE email_digest_preferences IS 'User preferences for email digests';
COMMENT ON TABLE notification_delivery_logs IS 'Logs of notification delivery attempts';
