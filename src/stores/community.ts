import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EBike } from '../types/ebike'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

export interface QAPost {
  id: string
  ebike_id: string
  user_id: string
  question: string
  tags: string[]
  is_resolved: boolean
  views: number
  created_at: string
  updated_at: string
  user: {
    id: string
    name: string
    avatar_url?: string
  }
  ebike: {
    id: string
    brand: string
    model_name: string
    image_url?: string
  }
  answers: QAAnswer[]
  answers_count: number
}

export interface QAAnswer {
  id: string
  post_id: string
  user_id: string
  answer: string
  is_expert: boolean
  is_accepted: boolean
  votes: number
  created_at: string
  updated_at: string
  user: {
    id: string
    name: string
    avatar_url?: string
  }
  votes_count: number
  user_vote?: 'upvote' | 'downvote'
}

export interface UserPost {
  id: string
  user_id: string
  title: string
  content: string
  post_type: 'general' | 'review' | 'tip' | 'question' | 'experience'
  tags: string[]
  images: string[]
  likes: number
  comments_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
  user: {
    id: string
    name: string
    avatar_url?: string
  }
  user_liked: boolean
  comments: PostComment[]
}

export interface PostComment {
  id: string
  post_id: string
  user_id: string
  content: string
  parent_id?: string
  likes: number
  created_at: string
  updated_at: string
  user: {
    id: string
    name: string
    avatar_url?: string
  }
  user_liked: boolean
  replies: PostComment[]
}

export interface UserFollow {
  follower_id: string
  following_id: string
  created_at: string
  follower: {
    id: string
    name: string
    avatar_url?: string
  }
  following: {
    id: string
    name: string
    avatar_url?: string
  }
}

export const useCommunityStore = defineStore('community', () => {
  const authStore = useAuthStore()
  
  // State
  const qaPosts = ref<QAPost[]>([])
  const userPosts = ref<UserPost[]>([])
  const following = ref<UserFollow[]>([])
  const followers = ref<UserFollow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const followingCount = computed(() => following.value.length)
  const followersCount = computed(() => followers.value.length)

  // Q&A Posts
  async function fetchQAPosts(ebikeId?: string, limit = 20) {
    try {
      let query = supabase
        .from('qa_posts')
        .select(`
          *,
          user:profiles(id, name),
          ebike:ebikes(id, brand, model_name, image_url),
          answers:qa_answers(
            *,
            user:profiles(id, name),
            votes_count:answer_votes(count)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (ebikeId) {
        query = query.eq('ebike_id', ebikeId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      qaPosts.value = data?.map(post => ({
        ...post,
        answers_count: post.answers?.length || 0
      })) || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch Q&A posts'
    }
  }

  async function createQAPost(ebikeId: string, question: string, tags: string[] = []) {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      const { data, error: insertError } = await supabase
        .from('qa_posts')
        .insert({
          ebike_id: ebikeId,
          user_id: user.value!.id,
          question,
          tags
        })
        .select(`
          *,
          user:profiles(id, name),
          ebike:ebikes(id, brand, model_name, image_url)
        `)
        .single()

      if (insertError) throw insertError

      qaPosts.value.unshift({
        ...data,
        answers: [],
        answers_count: 0
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create Q&A post'
      throw e
    }
  }

  async function createQAAnswer(postId: string, answer: string) {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      const { data, error: insertError } = await supabase
        .from('qa_answers')
        .insert({
          post_id: postId,
          user_id: user.value!.id,
          answer
        })
        .select(`
          *,
          user:profiles(id, name)
        `)
        .single()

      if (insertError) throw insertError

      // Update the post's answers count
      const post = qaPosts.value.find(p => p.id === postId)
      if (post) {
        post.answers.push({
          ...data,
          votes_count: 0,
          user_vote: undefined
        })
        post.answers_count++
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create answer'
      throw e
    }
  }

  async function voteOnAnswer(answerId: string, voteType: 'upvote' | 'downvote') {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      const { error: upsertError } = await supabase
        .from('answer_votes')
        .upsert({
          answer_id: answerId,
          user_id: user.value!.id,
          vote_type: voteType
        })

      if (upsertError) throw upsertError

      // Update local state
      qaPosts.value.forEach(post => {
        post.answers.forEach(answer => {
          if (answer.id === answerId) {
            answer.user_vote = voteType
          }
        })
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to vote on answer'
      throw e
    }
  }

  // User Posts
  async function fetchUserPosts(limit = 20) {
    try {
      const { data, error: fetchError } = await supabase
        .from('user_posts')
        .select(`
          *,
          user:profiles(id, name),
          comments:post_comments(
            *,
            user:profiles(id, name),
            replies:post_comments(
              *,
              user:profiles(id, name)
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (fetchError) throw fetchError

      userPosts.value = data?.map(post => ({
        ...post,
        user_liked: false, // TODO: Check if user liked this post
        comments: post.comments?.map(comment => ({
          ...comment,
          user_liked: false, // TODO: Check if user liked this comment
          replies: comment.replies || []
        })) || []
      })) || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch user posts'
    }
  }

  async function createUserPost(postData: {
    title: string
    content: string
    post_type: 'general' | 'review' | 'tip' | 'question' | 'experience'
    tags?: string[]
    images?: string[]
  }) {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      const { data, error: insertError } = await supabase
        .from('user_posts')
        .insert({
          user_id: user.value!.id,
          ...postData
        })
        .select(`
          *,
          user:profiles(id, name)
        `)
        .single()

      if (insertError) throw insertError

      userPosts.value.unshift({
        ...data,
        user_liked: false,
        comments: []
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create post'
      throw e
    }
  }

  async function likePost(postId: string) {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.value!.id
        })

      if (insertError) throw insertError

      // Update local state
      const post = userPosts.value.find(p => p.id === postId)
      if (post) {
        post.likes++
        post.user_liked = true
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to like post'
      throw e
    }
  }

  async function unlikePost(postId: string) {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.value!.id)

      if (deleteError) throw deleteError

      // Update local state
      const post = userPosts.value.find(p => p.id === postId)
      if (post) {
        post.likes--
        post.user_liked = false
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to unlike post'
      throw e
    }
  }

  async function createPostComment(postId: string, content: string, parentId?: string) {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      const { data, error: insertError } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.value!.id,
          content,
          parent_id: parentId
        })
        .select(`
          *,
          user:profiles(id, name)
        `)
        .single()

      if (insertError) throw insertError

      // Update local state
      const post = userPosts.value.find(p => p.id === postId)
      if (post) {
        if (parentId) {
          // Add as reply
          const parentComment = post.comments.find(c => c.id === parentId)
          if (parentComment) {
            parentComment.replies.push({
              ...data,
              user_liked: false,
              replies: []
            })
          }
        } else {
          // Add as top-level comment
          post.comments.push({
            ...data,
            user_liked: false,
            replies: []
          })
        }
        post.comments_count++
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create comment'
      throw e
    }
  }

  // Following system
  async function fetchFollowing() {
    if (!isAuthenticated.value) return

    try {
      const { data, error: fetchError } = await supabase
        .from('user_follows')
        .select(`
          *,
          following:profiles!user_follows_following_id_fkey(id, name)
        `)
        .eq('follower_id', user.value!.id)

      if (fetchError) throw fetchError

      following.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch following'
    }
  }

  async function fetchFollowers() {
    if (!isAuthenticated.value) return

    try {
      const { data, error: fetchError } = await supabase
        .from('user_follows')
        .select(`
          *,
          follower:profiles!user_follows_follower_id_fkey(id, name)
        `)
        .eq('following_id', user.value!.id)

      if (fetchError) throw fetchError

      followers.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch followers'
    }
  }

  async function followUser(userId: string) {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      const { error: insertError } = await supabase
        .from('user_follows')
        .insert({
          follower_id: user.value!.id,
          following_id: userId
        })

      if (insertError) throw insertError

      // Update local state
      await fetchFollowing()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to follow user'
      throw e
    }
  }

  async function unfollowUser(userId: string) {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      const { error: deleteError } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.value!.id)
        .eq('following_id', userId)

      if (deleteError) throw deleteError

      // Update local state
      following.value = following.value.filter(f => f.following_id !== userId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to unfollow user'
      throw e
    }
  }

  // Initialize community data
  async function initialize() {
    if (!isAuthenticated.value) return

    loading.value = true
    error.value = null

    try {
      await Promise.all([
        fetchQAPosts(),
        fetchUserPosts(),
        fetchFollowing(),
        fetchFollowers()
      ])
    } catch (e) {
      console.error('Error initializing community:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    qaPosts,
    userPosts,
    following,
    followers,
    loading,
    error,
    
    // Computed
    user,
    isAuthenticated,
    followingCount,
    followersCount,
    
    // Q&A Actions
    fetchQAPosts,
    createQAPost,
    createQAAnswer,
    voteOnAnswer,
    
    // User Posts Actions
    fetchUserPosts,
    createUserPost,
    likePost,
    unlikePost,
    createPostComment,
    
    // Following Actions
    fetchFollowing,
    fetchFollowers,
    followUser,
    unfollowUser,
    
    // Initialize
    initialize
  }
})
