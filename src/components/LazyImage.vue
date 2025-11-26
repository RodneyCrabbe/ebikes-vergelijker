<template>
  <div class="lazy-image-container" :style="{ height: height }">
    <img
      :src="src"
      :alt="alt"
      :class="imgClass"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  height?: string
  imgClass?: string
}

withDefaults(defineProps<Props>(), {
  height: '200px',
  imgClass: 'w-full h-full object-cover'
})

const onLoad = () => {
  // Image loaded successfully
}

const onError = () => {
  // Image failed to load
}
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
}
</style>
