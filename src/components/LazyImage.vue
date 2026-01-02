<template>
  <div class="lazy-image-container" :style="{ height: height }">
    <img
      v-if="!imageError"
      :src="cleanSrc"
      :alt="alt"
      :class="imgClass"
      @load="onLoad"
      @error="onError"
    />
    <div
      v-else
      class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400"
      :class="imgClass"
    >
      <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  src: string
  alt: string
  height?: string
  imgClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '200px',
  imgClass: 'w-full h-full object-cover'
})

const imageError = ref(false)

// Remove query parameters from image URLs and ensure proper encoding
const cleanSrc = computed(() => {
  if (!props.src) return ''
  // Remove query parameters (e.g., ?v=1760346847501)
  let url = props.src.split('?')[0]
  // Ensure spaces are properly encoded for URLs (though Vite should handle this)
  // But we'll keep the original path as Vite serves from public folder
  return url
})

const onLoad = () => {
  imageError.value = false
}

const onError = () => {
  imageError.value = true
}
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
}
</style>
