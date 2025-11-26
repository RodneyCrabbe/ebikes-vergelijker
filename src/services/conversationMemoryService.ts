import { supabase } from '../lib/supabase'

export interface ChatMessage {
  id: string
  user_id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: {
    language?: string
    voice_enabled?: boolean
    context?: any
  }
}

export interface ChatSession {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
  language: string
  is_voice_enabled: boolean
}

class ConversationMemoryService {
  private memoryCache = new Map<string, ChatMessage[]>()
  private sessionCache = new Map<string, ChatSession>()
  private cacheTimeout = 30 * 60 * 1000 // 30 minutes

  // Create a new chat session
  async createSession(userId: string, title: string, language: string = 'nl', isVoiceEnabled: boolean = false): Promise<ChatSession> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title,
          language,
          is_voice_enabled: isVoiceEnabled
        })
        .select()
        .single()

      if (error) throw error

      const session: ChatSession = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        created_at: data.created_at,
        updated_at: data.updated_at,
        message_count: 0,
        language: data.language,
        is_voice_enabled: data.is_voice_enabled
      }

      this.sessionCache.set(session.id, session)
      return session
    } catch (error) {
      console.error('Error creating chat session:', error)
      throw error
    }
  }

  // Get user's chat sessions
  async getUserSessions(userId: string): Promise<ChatSession[]> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      const sessions = data.map(session => ({
        id: session.id,
        user_id: session.user_id,
        title: session.title,
        created_at: session.created_at,
        updated_at: session.updated_at,
        message_count: session.message_count || 0,
        language: session.language || 'nl',
        is_voice_enabled: session.is_voice_enabled || false
      }))

      // Cache sessions
      sessions.forEach(session => {
        this.sessionCache.set(session.id, session)
      })

      return sessions
    } catch (error) {
      console.error('Error fetching user sessions:', error)
      return []
    }
  }

  // Get messages for a session
  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const cacheKey = `messages:${sessionId}`
    const cached = this.memoryCache.get(cacheKey)
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })

      if (error) throw error

      const messages = data.map(msg => ({
        id: msg.id,
        user_id: msg.user_id,
        session_id: msg.session_id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        metadata: msg.metadata || {}
      }))

      // Cache messages
      this.memoryCache.set(cacheKey, messages)
      setTimeout(() => this.memoryCache.delete(cacheKey), this.cacheTimeout)

      return messages
    } catch (error) {
      console.error('Error fetching session messages:', error)
      return []
    }
  }

  // Add a message to a session
  async addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: message.user_id,
          session_id: message.session_id,
          role: message.role,
          content: message.content,
          metadata: message.metadata || {}
        })
        .select()
        .single()

      if (error) throw error

      const newMessage: ChatMessage = {
        id: data.id,
        user_id: data.user_id,
        session_id: data.session_id,
        role: data.role,
        content: data.content,
        timestamp: data.timestamp,
        metadata: data.metadata || {}
      }

      // Update cache
      const cacheKey = `messages:${message.session_id}`
      const cached = this.memoryCache.get(cacheKey) || []
      cached.push(newMessage)
      this.memoryCache.set(cacheKey, cached)

      // Update session message count
      await this.updateSessionMessageCount(message.session_id)

      return newMessage
    } catch (error) {
      console.error('Error adding message:', error)
      throw error
    }
  }

  // Update session message count
  private async updateSessionMessageCount(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id', { count: 'exact' })
        .eq('session_id', sessionId)

      if (error) throw error

      const messageCount = data?.length || 0

      await supabase
        .from('chat_sessions')
        .update({ 
          message_count: messageCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      // Update cache
      const session = this.sessionCache.get(sessionId)
      if (session) {
        session.message_count = messageCount
        session.updated_at = new Date().toISOString()
        this.sessionCache.set(sessionId, session)
      }
    } catch (error) {
      console.error('Error updating session message count:', error)
    }
  }

  // Delete a session
  async deleteSession(sessionId: string): Promise<void> {
    try {
      // Delete messages first
      await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId)

      // Delete session
      await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)

      // Clear cache
      this.memoryCache.delete(`messages:${sessionId}`)
      this.sessionCache.delete(sessionId)
    } catch (error) {
      console.error('Error deleting session:', error)
      throw error
    }
  }

  // Update session title
  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    try {
      await supabase
        .from('chat_sessions')
        .update({ 
          title,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      // Update cache
      const session = this.sessionCache.get(sessionId)
      if (session) {
        session.title = title
        session.updated_at = new Date().toISOString()
        this.sessionCache.set(sessionId, session)
      }
    } catch (error) {
      console.error('Error updating session title:', error)
      throw error
    }
  }

  // Get conversation context for AI
  async getConversationContext(sessionId: string, maxMessages: number = 10): Promise<ChatMessage[]> {
    const messages = await this.getSessionMessages(sessionId)
    return messages.slice(-maxMessages)
  }

  // Search messages across all sessions
  async searchMessages(userId: string, query: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .ilike('content', `%${query}%`)
        .order('timestamp', { ascending: false })
        .limit(50)

      if (error) throw error

      return data.map(msg => ({
        id: msg.id,
        user_id: msg.user_id,
        session_id: msg.session_id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        metadata: msg.metadata || {}
      }))
    } catch (error) {
      console.error('Error searching messages:', error)
      return []
    }
  }

  // Get session statistics
  async getSessionStats(userId: string): Promise<{
    totalSessions: number
    totalMessages: number
    averageMessagesPerSession: number
    mostActiveLanguage: string
    voiceEnabledSessions: number
  }> {
    try {
      const sessions = await this.getUserSessions(userId)
      
      const totalSessions = sessions.length
      const totalMessages = sessions.reduce((sum, session) => sum + session.message_count, 0)
      const averageMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0
      
      // Count languages
      const languageCounts = sessions.reduce((counts, session) => {
        counts[session.language] = (counts[session.language] || 0) + 1
        return counts
      }, {} as Record<string, number>)
      
      const mostActiveLanguage = Object.entries(languageCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'nl'
      
      const voiceEnabledSessions = sessions.filter(s => s.is_voice_enabled).length

      return {
        totalSessions,
        totalMessages,
        averageMessagesPerSession: Math.round(averageMessagesPerSession * 100) / 100,
        mostActiveLanguage,
        voiceEnabledSessions
      }
    } catch (error) {
      console.error('Error getting session stats:', error)
      return {
        totalSessions: 0,
        totalMessages: 0,
        averageMessagesPerSession: 0,
        mostActiveLanguage: 'nl',
        voiceEnabledSessions: 0
      }
    }
  }

  // Clear cache
  clearCache() {
    this.memoryCache.clear()
    this.sessionCache.clear()
  }

  // Cache validation
  private isCacheValid(key: string): boolean {
    // Simple cache validation - in production you'd want more sophisticated caching
    return true
  }
}

export const conversationMemoryService = new ConversationMemoryService()
