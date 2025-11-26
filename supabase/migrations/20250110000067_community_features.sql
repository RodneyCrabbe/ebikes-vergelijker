-- Social Features & Community Migration
-- Add user-generated content, Q&A forum, and social interactions

-- Create user follows table
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- Create review votes table
CREATE TABLE IF NOT EXISTS review_votes (
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (review_id, user_id)
);

-- Create Q&A posts table
CREATE TABLE IF NOT EXISTS qa_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ebike_id VARCHAR(255) REFERENCES ebikes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_resolved BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Q&A answers table
CREATE TABLE IF NOT EXISTS qa_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES qa_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_expert BOOLEAN DEFAULT false,
  is_accepted BOOLEAN DEFAULT false,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create answer votes table
CREATE TABLE IF NOT EXISTS answer_votes (
  answer_id UUID REFERENCES qa_answers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (answer_id, user_id)
);

-- Create user posts table for general community content
CREATE TABLE IF NOT EXISTS user_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  post_type VARCHAR(20) DEFAULT 'general' CHECK (post_type IN ('general', 'review', 'tip', 'question', 'experience')),
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create post likes table
CREATE TABLE IF NOT EXISTS post_likes (
  post_id UUID REFERENCES user_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Create post comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES user_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

-- Create user expertise table
CREATE TABLE IF NOT EXISTS user_expertise (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  expertise_area VARCHAR(50) NOT NULL,
  expertise_level VARCHAR(20) DEFAULT 'intermediate' CHECK (expertise_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, expertise_area)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_review ON review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_user ON review_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_qa_posts_ebike ON qa_posts(ebike_id);
CREATE INDEX IF NOT EXISTS idx_qa_posts_user ON qa_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_qa_posts_created ON qa_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_qa_answers_post ON qa_answers(post_id);
CREATE INDEX IF NOT EXISTS idx_qa_answers_user ON qa_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_posts_user ON user_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_posts_type ON user_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_user_posts_created ON user_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user ON post_comments(user_id);

-- Create functions for updating counters
CREATE OR REPLACE FUNCTION update_review_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews 
    SET votes = votes + CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE reviews 
    SET votes = votes + CASE WHEN NEW.vote_type = 'upvote' THEN 2 ELSE -2 END
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews 
    SET votes = votes - CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_posts SET likes = likes + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_posts SET likes = likes - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_answer_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE qa_answers 
    SET votes = votes + CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END
    WHERE id = NEW.answer_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE qa_answers 
    SET votes = votes + CASE WHEN NEW.vote_type = 'upvote' THEN 2 ELSE -2 END
    WHERE id = NEW.answer_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE qa_answers 
    SET votes = votes - CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END
    WHERE id = OLD.answer_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_review_vote_count
  AFTER INSERT OR UPDATE OR DELETE ON review_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_vote_count();

CREATE TRIGGER trigger_update_post_like_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

CREATE TRIGGER trigger_update_post_comment_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

CREATE TRIGGER trigger_update_answer_vote_count
  AFTER INSERT OR UPDATE OR DELETE ON answer_votes
  FOR EACH ROW EXECUTE FUNCTION update_answer_vote_count();

-- Enable RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_expertise ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_follows
CREATE POLICY "Users can view all follows" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Users can manage their own follows" ON user_follows 
  FOR ALL USING (auth.uid() = follower_id);

-- Create RLS policies for review_votes
CREATE POLICY "Users can view all review votes" ON review_votes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own review votes" ON review_votes 
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for qa_posts
CREATE POLICY "Users can view all Q&A posts" ON qa_posts FOR SELECT USING (true);
CREATE POLICY "Users can create Q&A posts" ON qa_posts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own Q&A posts" ON qa_posts 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for qa_answers
CREATE POLICY "Users can view all Q&A answers" ON qa_answers FOR SELECT USING (true);
CREATE POLICY "Users can create Q&A answers" ON qa_answers 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own Q&A answers" ON qa_answers 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for answer_votes
CREATE POLICY "Users can view all answer votes" ON answer_votes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own answer votes" ON answer_votes 
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_posts
CREATE POLICY "Users can view all posts" ON user_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON user_posts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON user_posts 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON user_posts 
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for post_likes
CREATE POLICY "Users can view all post likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own post likes" ON post_likes 
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for post_comments
CREATE POLICY "Users can view all post comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create post comments" ON post_comments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own post comments" ON post_comments 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own post comments" ON post_comments 
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for comment_likes
CREATE POLICY "Users can view all comment likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own comment likes" ON comment_likes 
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_expertise
CREATE POLICY "Users can view all expertise" ON user_expertise FOR SELECT USING (true);
CREATE POLICY "Users can manage their own expertise" ON user_expertise 
  FOR ALL USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE user_follows IS 'User following relationships for social features';
COMMENT ON TABLE review_votes IS 'Voting system for bike reviews';
COMMENT ON TABLE qa_posts IS 'Q&A posts for specific bike models';
COMMENT ON TABLE qa_answers IS 'Answers to Q&A posts';
COMMENT ON TABLE answer_votes IS 'Voting system for Q&A answers';
COMMENT ON TABLE user_posts IS 'General community posts and content';
COMMENT ON TABLE post_likes IS 'Likes for community posts';
COMMENT ON TABLE post_comments IS 'Comments on community posts';
COMMENT ON TABLE comment_likes IS 'Likes for post comments';
COMMENT ON TABLE user_expertise IS 'User expertise areas and verification';
