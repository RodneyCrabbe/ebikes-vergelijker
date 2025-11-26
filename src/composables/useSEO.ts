import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { seoOptimizer } from '../utils/seo'
import { sitemapGenerator } from '../utils/sitemapGenerator'
import type { EBike } from '../types/ebike'

export function useSEO() {
  const route = useRoute()
  const currentTitle = ref('')
  const currentDescription = ref('')
  const currentKeywords = ref<string[]>([])

  // Update page SEO based on route
  const updatePageSEO = (pageData?: any) => {
    const pageName = getPageNameFromRoute(route.path)
    const seoConfig = seoOptimizer.generatePageSEO(pageName, pageData)
    
    seoOptimizer.applySEO(seoConfig)
    
    currentTitle.value = seoConfig.title
    currentDescription.value = seoConfig.description
    currentKeywords.value = seoConfig.keywords
  }

  // Update e-bike specific SEO
  const updateEBikeSEO = (ebike: EBike) => {
    const seoConfig = seoOptimizer.generatePageSEO('ebike-detail', ebike)
    seoConfig.structuredData = seoOptimizer.generateEBikeStructuredData(ebike)
    
    seoOptimizer.applySEO(seoConfig)
    
    currentTitle.value = seoConfig.title
    currentDescription.value = seoConfig.description
    currentKeywords.value = seoConfig.keywords
  }

  // Update breadcrumb SEO
  const updateBreadcrumbSEO = (breadcrumbs: Array<{name: string, url: string}>) => {
    const breadcrumbData = sitemapGenerator.generateBreadcrumbStructuredData(breadcrumbs)
    seoOptimizer.addStructuredData(breadcrumbData)
  }

  // Update FAQ SEO
  const updateFAQSEO = (faqs: Array<{question: string, answer: string}>) => {
    const faqData = sitemapGenerator.generateFAQStructuredData(faqs)
    seoOptimizer.addStructuredData(faqData)
  }

  // Get page name from route
  const getPageNameFromRoute = (path: string): string => {
    if (path === '/') return 'home'
    if (path.startsWith('/ebike/')) return 'ebike-detail'
    if (path === '/ebikes') return 'ebikes'
    if (path === '/vergelijken') return 'comparison'
    if (path === '/reviews') return 'reviews'
    if (path === '/community') return 'community'
    if (path === '/over-ons') return 'about'
    if (path === '/contact') return 'contact'
    return 'home'
  }

  // Watch route changes
  watch(() => route.path, (newPath) => {
    updatePageSEO()
  })

  // Initialize on mount
  onMounted(() => {
    updatePageSEO()
  })

  return {
    currentTitle,
    currentDescription,
    currentKeywords,
    updatePageSEO,
    updateEBikeSEO,
    updateBreadcrumbSEO,
    updateFAQSEO
  }
}

// SEO composable for specific pages
export function usePageSEO(pageName: string, pageData?: any) {
  const seo = useSEO()

  const updateSEO = () => {
    const seoConfig = seoOptimizer.generatePageSEO(pageName, pageData)
    seoOptimizer.applySEO(seoConfig)
    
    seo.currentTitle.value = seoConfig.title
    seo.currentDescription.value = seoConfig.description
    seo.currentKeywords.value = seoConfig.keywords
  }

  onMounted(() => {
    updateSEO()
  })

  return {
    ...seo,
    updateSEO
  }
}

// SEO composable for e-bike pages
export function useEBikeSEO(ebike: EBike) {
  const seo = useSEO()

  const updateEBikeSEO = () => {
    seo.updateEBikeSEO(ebike)
  }

  onMounted(() => {
    updateEBikeSEO()
  })

  return {
    ...seo,
    updateEBikeSEO
  }
}

// SEO composable for comparison pages
export function useComparisonSEO(ebikes: EBike[]) {
  const seo = useSEO()

  const updateComparisonSEO = () => {
    const seoConfig = seoOptimizer.generatePageSEO('comparison', { ebikes })
    seoOptimizer.applySEO(seoConfig)
    
    // Add comparison structured data
    const comparisonData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'E-Bike Comparison',
      description: 'Compare e-bikes side by side',
      numberOfItems: ebikes.length,
      itemListElement: ebikes.map((ebike, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: seoOptimizer.generateEBikeStructuredData(ebike)
      }))
    }
    
    seoOptimizer.addStructuredData(comparisonData)
    
    seo.currentTitle.value = seoConfig.title
    seo.currentDescription.value = seoConfig.description
    seo.currentKeywords.value = seoConfig.keywords
  }

  onMounted(() => {
    updateComparisonSEO()
  })

  return {
    ...seo,
    updateComparisonSEO
  }
}

// SEO composable for search pages
export function useSearchSEO(query: string, results: any[]) {
  const seo = useSEO()

  const updateSearchSEO = () => {
    const seoConfig = seoOptimizer.generatePageSEO('search', { query, results })
    seoConfig.title = `Zoekresultaten voor "${query}" | E-Bike Platform`
    seoConfig.description = `Vind ${results.length} e-bikes voor "${query}". Bekijk specificaties, prijzen en reviews.`
    
    seoOptimizer.applySEO(seoConfig)
    
    seo.currentTitle.value = seoConfig.title
    seo.currentDescription.value = seoConfig.description
    seo.currentKeywords.value = seoConfig.keywords
  }

  onMounted(() => {
    updateSearchSEO()
  })

  return {
    ...seo,
    updateSearchSEO
  }
}
