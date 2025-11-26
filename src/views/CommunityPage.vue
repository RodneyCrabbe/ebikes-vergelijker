<template>
  <div class="community-page">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-4">E-Bike Community</h1>
        <p class="text-xl opacity-90">Connect with fellow e-bike enthusiasts, share experiences, and get expert advice</p>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-2 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
            <span v-if="tab.count" class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Q&A Tab -->
      <div v-if="activeTab === 'qa'" class="space-y-6">
        <!-- Search and Filter -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <input
                v-model="qaSearchQuery"
                type="text"
                placeholder="Search questions..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div class="flex gap-2">
              <select
                v-model="qaFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Questions</option>
                <option value="unresolved">Unresolved</option>
                <option value="resolved">Resolved</option>
                <option value="recent">Recent</option>
              </select>
              <button
                @click="showAskQuestionModal = true"
                class="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Ask Question
              </button>
            </div>
          </div>
        </div>

        <!-- Q&A Posts -->
        <div class="space-y-4">
          <div
            v-for="post in filteredQAPosts"
            :key="post.id"
            class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <img
                    :src="post.user.avatar_url || '/default-avatar.png'"
                    :alt="post.user.name"
                    class="w-8 h-8 rounded-full"
                  />
                  <span class="font-medium text-gray-900">{{ post.user.name }}</span>
                  <span class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</span>
                </div>
                
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ post.question }}</h3>
                
                <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>{{ post.ebike.brand }} {{ post.ebike.model_name }}</span>
                  <span>{{ post.views }} views</span>
                  <span>{{ post.answers_count }} answers</span>
                  <span v-if="post.is_resolved" class="text-green-600 font-medium">✓ Resolved</span>
                </div>

                <div v-if="post.tags.length" class="flex gap-2 mb-4">
                  <span
                    v-for="tag in post.tags"
                    :key="tag"
                    class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="flex gap-2">
                  <button
                    @click="viewQuestion(post)"
                    class="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Answers
                  </button>
                  <button
                    v-if="isAuthenticated"
                    @click="followQuestion(post)"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    Follow
                  </button>
                </div>
              </div>
              
              <div class="ml-4">
                <img
                  :src="post.ebike.image_url || '/placeholder-bike.png'"
                  :alt="post.ebike.model_name"
                  class="w-16 h-16 rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Community Posts Tab -->
      <div v-if="activeTab === 'posts'" class="space-y-6">
        <!-- Create Post -->
        <div v-if="isAuthenticated" class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center gap-3 mb-4">
            <img
              :src="user?.avatar_url || '/default-avatar.png'"
              :alt="user?.name"
              class="w-10 h-10 rounded-full"
            />
            <button
              @click="showCreatePostModal = true"
              class="flex-1 text-left text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-4 py-2"
            >
              Share your e-bike experience...
            </button>
          </div>
        </div>

        <!-- Community Posts -->
        <div class="space-y-4">
          <div
            v-for="post in userPosts"
            :key="post.id"
            class="bg-white rounded-lg shadow-sm border p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <img
                :src="post.user.avatar_url || '/default-avatar.png'"
                :alt="post.user.name"
                class="w-10 h-10 rounded-full"
              />
              <div>
                <h4 class="font-medium text-gray-900">{{ post.user.name }}</h4>
                <p class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</p>
              </div>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ post.title }}</h3>
            <p class="text-gray-700 mb-4">{{ post.content }}</p>

            <div v-if="post.images.length" class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              <img
                v-for="image in post.images.slice(0, 6)"
                :key="image"
                :src="image"
                :alt="post.title"
                class="w-full h-32 object-cover rounded-lg"
              />
            </div>

            <div v-if="post.tags.length" class="flex gap-2 mb-4">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex items-center gap-6 text-sm text-gray-500">
              <button
                @click="togglePostLike(post)"
                :class="[
                  'flex items-center gap-1',
                  post.user_liked ? 'text-primary-600' : 'hover:text-gray-700'
                ]"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                </svg>
                {{ post.likes }}
              </button>
              <button class="flex items-center gap-1 hover:text-gray-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {{ post.comments_count }}
              </button>
              <button class="hover:text-gray-700">Share</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Following Tab -->
      <div v-if="activeTab === 'following'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold mb-4">People You Follow</h2>
          <div v-if="following.length === 0" class="text-center py-8 text-gray-500">
            <p>You're not following anyone yet.</p>
            <p class="text-sm">Start following other e-bike enthusiasts to see their posts and reviews!</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="follow in following"
              :key="follow.following_id"
              class="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
            >
              <img
                :src="follow.following.avatar_url || '/default-avatar.png'"
                :alt="follow.following.name"
                class="w-12 h-12 rounded-full"
              />
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ follow.following.name }}</h4>
                <p class="text-sm text-gray-500">E-bike enthusiast</p>
              </div>
              <button
                @click="unfollowUser(follow.following_id)"
                class="text-gray-500 hover:text-gray-700"
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ask Question Modal -->
    <div v-if="showAskQuestionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 class="text-lg font-semibold mb-4">Ask a Question</h3>
        <form @submit.prevent="submitQuestion">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Select E-bike</label>
            <select
              v-model="newQuestion.ebike_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose an e-bike...</option>
              <option v-for="ebike in ebikes" :key="ebike.id" :value="ebike.id">
                {{ ebike.brand }} {{ ebike.model_name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Your Question</label>
            <textarea
              v-model="newQuestion.question"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ask your question about this e-bike..."
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
            <input
              v-model="newQuestion.tags"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="performance, battery, maintenance..."
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showAskQuestionModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {{ loading ? 'Posting...' : 'Post Question' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Post Modal -->
    <div v-if="showCreatePostModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 class="text-lg font-semibold mb-4">Create Post</h3>
        <form @submit.prevent="submitPost">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
            <select
              v-model="newPost.post_type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="general">General</option>
              <option value="review">Review</option>
              <option value="tip">Tip</option>
              <option value="question">Question</option>
              <option value="experience">Experience</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              v-model="newPost.title"
              required
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Enter post title..."
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              v-model="newPost.content"
              required
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Share your thoughts..."
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
            <input
              v-model="newPost.tags"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e-bike, commuting, tips..."
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showCreatePostModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {{ loading ? 'Posting...' : 'Create Post' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCommunityStore } from '../stores/community'
import { useEBikesStore } from '../stores/ebikes'
import { useAuthStore } from '../stores/auth'
import { useUserProfileStore } from '../stores/userProfile'

const communityStore = useCommunityStore()
const ebikeStore = useEBikesStore()
const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

// State
const activeTab = ref('qa')
const qaSearchQuery = ref('')
const qaFilter = ref('')
const showAskQuestionModal = ref(false)
const showCreatePostModal = ref(false)
const loading = ref(false)

const newQuestion = ref({
  ebike_id: '',
  question: '',
  tags: ''
})

const newPost = ref({
  title: '',
  content: '',
  post_type: 'general' as const,
  tags: ''
})

// Computed
const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const ebikes = computed(() => ebikeStore.ebikes)
const qaPosts = computed(() => communityStore.qaPosts)
const userPosts = computed(() => communityStore.userPosts)
const following = computed(() => communityStore.following)

const tabs = computed(() => [
  { id: 'qa', label: 'Q&A', count: qaPosts.value.length },
  { id: 'posts', label: 'Community Posts', count: userPosts.value.length },
  { id: 'following', label: 'Following', count: following.value.length }
])

const filteredQAPosts = computed(() => {
  let filtered = qaPosts.value

  if (qaSearchQuery.value) {
    filtered = filtered.filter(post =>
      post.question.toLowerCase().includes(qaSearchQuery.value.toLowerCase()) ||
      post.ebike.brand.toLowerCase().includes(qaSearchQuery.value.toLowerCase()) ||
      post.ebike.model_name.toLowerCase().includes(qaSearchQuery.value.toLowerCase())
    )
  }

  if (qaFilter.value === 'unresolved') {
    filtered = filtered.filter(post => !post.is_resolved)
  } else if (qaFilter.value === 'resolved') {
    filtered = filtered.filter(post => post.is_resolved)
  } else if (qaFilter.value === 'recent') {
    filtered = filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  return filtered
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewQuestion = (post: any) => {
  // Navigate to question detail page
  console.log('View question:', post.id)
}

const followQuestion = (post: any) => {
  // Implement follow question functionality
  console.log('Follow question:', post.id)
}

const togglePostLike = async (post: any) => {
  if (!isAuthenticated.value) return

  try {
    if (post.user_liked) {
      await communityStore.unlikePost(post.id)
    } else {
      await communityStore.likePost(post.id)
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const submitQuestion = async () => {
  if (!isAuthenticated.value) return

  loading.value = true
  try {
    const tags = newQuestion.value.tags
      ? newQuestion.value.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : []

    await communityStore.createQAPost(
      newQuestion.value.ebike_id,
      newQuestion.value.question,
      tags
    )

    // Reset form
    newQuestion.value = {
      ebike_id: '',
      question: '',
      tags: ''
    }
    showAskQuestionModal.value = false
  } catch (error) {
    console.error('Error creating question:', error)
  } finally {
    loading.value = false
  }
}

const submitPost = async () => {
  if (!isAuthenticated.value) return

  loading.value = true
  try {
    const tags = newPost.value.tags
      ? newPost.value.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : []

    await communityStore.createUserPost({
      title: newPost.value.title,
      content: newPost.value.content,
      post_type: newPost.value.post_type,
      tags
    })

    // Reset form
    newPost.value = {
      title: '',
      content: '',
      post_type: 'general',
      tags: ''
    }
    showCreatePostModal.value = false
  } catch (error) {
    console.error('Error creating post:', error)
  } finally {
    loading.value = false
  }
}

const unfollowUser = async (userId: string) => {
  try {
    await communityStore.unfollowUser(userId)
  } catch (error) {
    console.error('Error unfollowing user:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    ebikeStore.fetchEBikes(),
    communityStore.initialize()
  ])
})
</script>

<style scoped>
.community-page {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
