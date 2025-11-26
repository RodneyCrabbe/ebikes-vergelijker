<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  rating: number
  editable?: boolean
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  size: 'md',
  showNumber: false
})

const emit = defineEmits<{
  ratingChange: [rating: number]
}>()

const hoverRating = ref(0)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4'
    case 'lg':
      return 'w-8 h-8'
    default:
      return 'w-6 h-6'
  }
})

const handleClick = (rating: number) => {
  if (props.editable) {
    emit('ratingChange', rating)
  }
}

const handleMouseEnter = (rating: number) => {
  if (props.editable) {
    hoverRating.value = rating
  }
}

const handleMouseLeave = () => {
  if (props.editable) {
    hoverRating.value = 0
  }
}

const getStarClass = (starNumber: number) => {
  const currentRating = hoverRating.value || props.rating
  const isFilled = starNumber <= currentRating
  
  return {
    'text-yellow-400': isFilled,
    'text-gray-300': !isFilled,
    'cursor-pointer': props.editable,
    'hover:text-yellow-300': props.editable
  }
}
</script>

<template>
  <div class="flex items-center space-x-1">
    <div class="flex">
      <svg
        v-for="star in 5"
        :key="star"
        :class="[sizeClasses, getStarClass(star)]"
        fill="currentColor"
        viewBox="0 0 20 20"
        @click="handleClick(star)"
        @mouseenter="handleMouseEnter(star)"
        @mouseleave="handleMouseLeave"
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    </div>
    
    <span v-if="showNumber" class="ml-2 text-sm text-gray-600">
      {{ rating }}/5
    </span>
  </div>
</template>

<style scoped>
/* Custom styles for star rating */
</style>
