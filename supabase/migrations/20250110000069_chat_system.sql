-- Create chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  language VARCHAR(10) DEFAULT 'nl',
  is_voice_enabled BOOLEAN DEFAULT false,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Create function to update session message count
CREATE OR REPLACE FUNCTION update_chat_session_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE chat_sessions 
    SET message_count = message_count + 1, updated_at = NOW()
    WHERE id = NEW.session_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE chat_sessions 
    SET message_count = message_count - 1, updated_at = NOW()
    WHERE id = OLD.session_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for message count updates
CREATE OR REPLACE TRIGGER trg_update_chat_session_message_count
  AFTER INSERT OR DELETE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_session_message_count();

-- Create function to update session timestamp on message insert
CREATE OR REPLACE FUNCTION update_chat_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions 
  SET updated_at = NOW()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for session timestamp updates
CREATE OR REPLACE TRIGGER trg_update_chat_session_timestamp
  AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_session_timestamp();

-- Enable RLS on chat tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" ON chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view their own chat messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat messages" ON chat_messages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages" ON chat_messages
  FOR DELETE USING (auth.uid() = user_id);
