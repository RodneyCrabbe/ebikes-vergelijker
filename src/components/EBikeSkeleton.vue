<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div
      v-for="n in count"
      :key="n"
      class="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse"
    >
      <!-- Image Skeleton -->
      <div class="h-64 bg-gray-200"></div>
      
      <!-- Content Skeleton -->
      <div class="p-8">
        <!-- Brand Skeleton -->
        <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
        
        <!-- Title Skeleton -->
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        
        <!-- Features Skeleton -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center">
            <div class="w-5 h-5 bg-gray-200 rounded mr-3"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div class="flex items-center">
            <div class="w-5 h-5 bg-gray-200 rounded mr-3"></div>
            <div class="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div class="flex items-center">
            <div class="w-5 h-5 bg-gray-200 rounded mr-3"></div>
            <div class="h-4 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
        
        <!-- Button Skeleton -->
        <div class="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 6
})
</script>
