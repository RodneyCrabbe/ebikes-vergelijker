<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

interface Props {
  content: string
}

const props = defineProps<Props>()

// Configure marked options
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // GitHub Flavored Markdown
})

// Parse markdown to HTML
const htmlContent = computed(() => {
  if (!props.content) return ''
  return marked.parse(props.content)
})
</script>

<template>
  <div 
    class="markdown-content w-full"
    v-html="htmlContent"
  />
</template>

<style scoped>
/* Additional responsive spacing for mobile */
@media (max-width: 640px) {
  .markdown-content :deep(h1) {
    @apply text-2xl mt-6 mb-3;
  }
  
  .markdown-content :deep(h2) {
    @apply text-xl mt-5 mb-2;
  }
  
  .markdown-content :deep(h3) {
    @apply text-lg mt-4 mb-2;
  }
  
  .markdown-content :deep(p) {
    @apply text-sm mb-3;
  }
  
  .markdown-content :deep(ul),
  .markdown-content :deep(ol) {
    @apply pl-4 my-3;
  }
  
  .markdown-content :deep(li) {
    @apply text-sm mb-1;
  }
}

/* Ensure proper spacing between sections */
.markdown-content :deep(h1 + *),
.markdown-content :deep(h2 + *),
.markdown-content :deep(h3 + *),
.markdown-content :deep(h4 + *) {
  @apply mt-2;
}

/* Better list styling */
.markdown-content :deep(ul) {
  list-style-type: disc;
}

.markdown-content :deep(ol) {
  list-style-type: decimal;
}

.markdown-content :deep(li) {
  margin-left: 0.5rem;
}

/* Nested lists */
.markdown-content :deep(ul ul),
.markdown-content :deep(ol ol),
.markdown-content :deep(ul ol),
.markdown-content :deep(ol ul) {
  @apply mt-2 mb-2;
}

/* Link styling */
.markdown-content :deep(a) {
  @apply transition-colors duration-200;
}

/* Code block improvements */
.markdown-content :deep(pre code) {
  @apply bg-transparent p-0;
}
</style>

