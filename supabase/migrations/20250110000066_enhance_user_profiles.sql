-- Enhanced User Profile System Migration
-- Add comprehensive user profile features for engagement and gamification

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS riding_style VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_brands TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS price_range_min DECIMAL(10,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS price_range_max DECIMAL(10,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS activity_points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_level VARCHAR(20) DEFAULT 'beginner';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true, "price_alerts": true, "new_reviews": true}';

-- Add constraints
DO $$
BEGIN
    -- Add experience level constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'check_experience_level'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT check_experience_level 
          CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert'));
    END IF;
    
    -- Add riding style constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'check_riding_style'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT check_riding_style 
          CHECK (riding_style IN ('city', 'mountain', 'commute', 'touring', 'cargo', 'folding', 'fat_bike', 'road', 'hybrid'));
    END IF;
END $$;

-- Create user activity tracking table
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  activity_data JSONB,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);

-- Create user preferences table for detailed preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  bike_types TEXT[] DEFAULT '{}',
  max_weight INTEGER,
  min_range_km INTEGER,
  max_price DECIMAL(10,2),
  preferred_colors TEXT[] DEFAULT '{}',
  must_have_features TEXT[] DEFAULT '{}',
  nice_to_have_features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user bike ownership history
CREATE TABLE IF NOT EXISTS user_bike_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ebike_id VARCHAR(255) REFERENCES ebikes(id) ON DELETE CASCADE,
  ownership_type VARCHAR(20) NOT NULL CHECK (ownership_type IN ('owned', 'test_rode', 'rented', 'borrowed')),
  start_date DATE,
  end_date DATE,
  mileage_km INTEGER,
  maintenance_notes TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for bike history
CREATE INDEX IF NOT EXISTS idx_user_bike_history_user_id ON user_bike_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bike_history_ebike_id ON user_bike_history(ebike_id);

-- Create maintenance reminders table
CREATE TABLE IF NOT EXISTS maintenance_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bike_history_id UUID REFERENCES user_bike_history(id) ON DELETE CASCADE,
  reminder_type VARCHAR(50) NOT NULL,
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user achievements/badges system
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_data JSONB,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

-- Predefined achievement types
INSERT INTO user_achievements (user_id, achievement_type, achievement_data) 
SELECT 
  p.id,
  'first_login',
  '{"title": "Welcome!", "description": "You have joined the e-bike community", "icon": "👋"}'
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM user_achievements ua 
  WHERE ua.user_id = p.id AND ua.achievement_type = 'first_login'
);

-- Create function to update activity points
CREATE OR REPLACE FUNCTION update_user_activity_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total points in profiles table
  UPDATE profiles 
  SET activity_points = activity_points + COALESCE(NEW.points_earned, 0)
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update points
CREATE TRIGGER trigger_update_activity_points
  AFTER INSERT ON user_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_user_activity_points();

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION check_user_achievements()
RETURNS TRIGGER AS $$
DECLARE
  achievement_count INTEGER;
  comparison_count INTEGER;
  review_count INTEGER;
  favorite_count INTEGER;
BEGIN
  -- Count different activities for achievements
  SELECT COUNT(*) INTO achievement_count FROM user_activities WHERE user_id = NEW.user_id;
  SELECT COUNT(*) INTO comparison_count FROM saved_comparisons WHERE user_id = NEW.user_id;
  SELECT COUNT(*) INTO review_count FROM reviews WHERE user_id = NEW.user_id;
  SELECT COUNT(*) INTO favorite_count FROM favorites WHERE user_id = NEW.user_id;
  
  -- Award "Explorer" badge for 10 activities
  IF achievement_count >= 10 AND NOT EXISTS (
    SELECT 1 FROM user_achievements WHERE user_id = NEW.user_id AND achievement_type = 'explorer'
  ) THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_data)
    VALUES (NEW.user_id, 'explorer', '{"title": "Explorer", "description": "Completed 10 activities", "icon": "🔍"}');
  END IF;
  
  -- Award "Reviewer" badge for 5 reviews
  IF review_count >= 5 AND NOT EXISTS (
    SELECT 1 FROM user_achievements WHERE user_id = NEW.user_id AND achievement_type = 'reviewer'
  ) THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_data)
    VALUES (NEW.user_id, 'reviewer', '{"title": "Reviewer", "description": "Written 5 reviews", "icon": "⭐"}');
  END IF;
  
  -- Award "Comparer" badge for 10 comparisons
  IF comparison_count >= 10 AND NOT EXISTS (
    SELECT 1 FROM user_achievements WHERE user_id = NEW.user_id AND achievement_type = 'comparer'
  ) THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_data)
    VALUES (NEW.user_id, 'comparer', '{"title": "Comparer", "description": "Made 10 comparisons", "icon": "⚖️"}');
  END IF;
  
  -- Award "Collector" badge for 20 favorites
  IF favorite_count >= 20 AND NOT EXISTS (
    SELECT 1 FROM user_achievements WHERE user_id = NEW.user_id AND achievement_type = 'collector'
  ) THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_data)
    VALUES (NEW.user_id, 'collector', '{"title": "Collector", "description": "Added 20 bikes to favorites", "icon": "❤️"}');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check achievements after activity
CREATE TRIGGER trigger_check_achievements
  AFTER INSERT ON user_activities
  FOR EACH ROW
  EXECUTE FUNCTION check_user_achievements();

-- Enable RLS on new tables
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bike_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_activities
CREATE POLICY "Users can view their own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_bike_history
CREATE POLICY "Users can manage their own bike history" ON user_bike_history
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for maintenance_reminders
CREATE POLICY "Users can manage their own maintenance reminders" ON maintenance_reminders
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE user_activities IS 'Tracks user engagement activities and points earned';
COMMENT ON TABLE user_preferences IS 'Detailed user preferences for bike recommendations';
COMMENT ON TABLE user_bike_history IS 'History of bikes owned, tested, or rented by users';
COMMENT ON TABLE maintenance_reminders IS 'Maintenance reminders for user bikes';
COMMENT ON TABLE user_achievements IS 'User achievements and badges system';