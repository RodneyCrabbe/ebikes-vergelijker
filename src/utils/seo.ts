import { EBike } from '../types/ebike'

export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  structuredData?: any
}

export class SEOOptimizer {
  private static instance: SEOOptimizer
  private baseUrl = 'https://ebike-platform.com'

  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer()
    }
    return SEOOptimizer.instance
  }

  // Update page title
  updateTitle(title: string, siteName = 'E-Bike Platform'): void {
    const fullTitle = title ? `${title} | ${siteName}` : siteName
    document.title = fullTitle
    
    // Update meta title
    this.updateMetaTag('title', fullTitle)
  }

  // Update meta description
  updateDescription(description: string): void {
    this.updateMetaTag('description', description)
  }

  // Update meta keywords
  updateKeywords(keywords: string[]): void {
    this.updateMetaTag('keywords', keywords.join(', '))
  }

  // Update Open Graph tags
  updateOpenGraph(config: {
    title?: string
    description?: string
    image?: string
    url?: string
    type?: string
  }): void {
    if (config.title) {
      this.updateMetaTag('og:title', config.title, 'property')
    }
    if (config.description) {
      this.updateMetaTag('og:description', config.description, 'property')
    }
    if (config.image) {
      this.updateMetaTag('og:image', config.image, 'property')
    }
    if (config.url) {
      this.updateMetaTag('og:url', config.url, 'property')
    }
    if (config.type) {
      this.updateMetaTag('og:type', config.type, 'property')
    }
  }

  // Update Twitter Card tags
  updateTwitterCard(config: {
    title?: string
    description?: string
    image?: string
    card?: 'summary' | 'summary_large_image'
  }): void {
    if (config.title) {
      this.updateMetaTag('twitter:title', config.title)
    }
    if (config.description) {
      this.updateMetaTag('twitter:description', config.description)
    }
    if (config.image) {
      this.updateMetaTag('twitter:image', config.image)
    }
    if (config.card) {
      this.updateMetaTag('twitter:card', config.card)
    }
  }

  // Add structured data
  addStructuredData(data: any): void {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    script.id = 'structured-data'
    
    // Remove existing structured data
    const existing = document.getElementById('structured-data')
    if (existing) {
      existing.remove()
    }
    
    document.head.appendChild(script)
  }

  // Generate e-bike structured data
  generateEBikeStructuredData(ebike: EBike): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: ebike.model_name,
      brand: {
        '@type': 'Brand',
        name: ebike.brand
      },
      description: ebike.description || `${ebike.brand} ${ebike.model_name} e-bike`,
      image: ebike.image_url ? [ebike.image_url] : [],
      offers: {
        '@type': 'Offer',
        price: ebike.price || 0,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'E-Bike Platform'
        }
      },
      category: this.mapCategoryToSchema(ebike.category),
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Motor Power',
          value: ebike.motor_power || 'N/A'
        },
        {
          '@type': 'PropertyValue',
          name: 'Battery Capacity',
          value: ebike.battery_capacity || 'N/A'
        },
        {
          '@type': 'PropertyValue',
          name: 'Range',
          value: ebike.range || 'N/A'
        },
        {
          '@type': 'PropertyValue',
          name: 'Weight',
          value: ebike.weight || 'N/A'
        }
      ]
    }
  }

  // Generate organization structured data
  generateOrganizationStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'E-Bike Platform',
      url: this.baseUrl,
      logo: `${this.baseUrl}/logo.png`,
      description: 'De grootste e-bike vergelijkingssite van Nederland. Vind de perfecte e-bike voor jouw behoeften.',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+31-20-123-4567',
        contactType: 'customer service',
        availableLanguage: ['Dutch', 'English']
      },
      sameAs: [
        'https://www.facebook.com/ebikeplatform',
        'https://www.instagram.com/ebikeplatform',
        'https://www.twitter.com/ebikeplatform'
      ]
    }
  }

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData(items: Array<{name: string, url: string}>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.baseUrl}${item.url}`
      }))
    }
  }

  // Generate FAQ structured data
  generateFAQStructuredData(faqs: Array<{question: string, answer: string}>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  // Generate sitemap data
  generateSitemapData(pages: Array<{url: string, lastmod: string, changefreq: string, priority: number}>): string {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`
    return sitemap
  }

  // Generate robots.txt content
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /profiel/
Disallow: /notifications/
Disallow: /dealer/`
  }

  // Update meta tag helper
  private updateMetaTag(name: string, content: string, attribute = 'name'): void {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
    
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(attribute, name)
      document.head.appendChild(meta)
    }
    
    meta.content = content
  }

  // Map category to schema.org category
  private mapCategoryToSchema(category: string): string {
    const categoryMap: Record<string, string> = {
      'city': 'https://schema.org/Vehicle',
      'mountain': 'https://schema.org/Vehicle',
      'commute': 'https://schema.org/Vehicle',
      'touring': 'https://schema.org/Vehicle',
      'cargo': 'https://schema.org/Vehicle',
      'folding': 'https://schema.org/Vehicle',
      'fat_bike': 'https://schema.org/Vehicle',
      'road': 'https://schema.org/Vehicle',
      'hybrid': 'https://schema.org/Vehicle'
    }
    
    return categoryMap[category] || 'https://schema.org/Product'
  }

  // Generate page-specific SEO config
  generatePageSEO(page: string, data?: any): SEOConfig {
    const configs: Record<string, SEOConfig> = {
      home: {
        title: 'E-Bike Platform - De grootste e-bike vergelijkingssite',
        description: 'Vind de perfecte e-bike voor jouw behoeften. Vergelijk prijzen, specificaties en reviews van honderden e-bikes van topmerken.',
        keywords: ['e-bike', 'elektrische fiets', 'fiets vergelijken', 'e-bike kopen', 'elektrische fietsen'],
        type: 'website'
      },
      ebikes: {
        title: 'Alle E-Bikes - Vergelijk en vind jouw perfecte e-bike',
        description: 'Bekijk alle e-bikes in onze database. Filter op merk, prijs, categorie en meer om de perfecte e-bike te vinden.',
        keywords: ['e-bike overzicht', 'alle e-bikes', 'e-bike database', 'elektrische fietsen vergelijken'],
        type: 'website'
      },
      'ebike-detail': {
        title: `${data?.model_name || 'E-Bike'} - ${data?.brand || 'Merk'} | E-Bike Platform`,
        description: data?.description || `Bekijk de ${data?.model_name || 'e-bike'} van ${data?.brand || 'dit merk'}. Prijzen, specificaties en reviews.`,
        keywords: [
          data?.model_name?.toLowerCase(),
          data?.brand?.toLowerCase(),
          'e-bike',
          'elektrische fiets',
          data?.category
        ].filter(Boolean),
        image: data?.image_url,
        type: 'product'
      },
      comparison: {
        title: 'E-Bike Vergelijking - Vergelijk e-bikes naast elkaar',
        description: 'Vergelijk e-bikes naast elkaar. Bekijk specificaties, prijzen en reviews van verschillende e-bikes.',
        keywords: ['e-bike vergelijking', 'e-bikes vergelijken', 'elektrische fiets vergelijking'],
        type: 'website'
      },
      reviews: {
        title: 'E-Bike Reviews - Echte ervaringen van gebruikers',
        description: 'Lees echte reviews van e-bike gebruikers. Ontdek wat anderen vinden van hun e-bike.',
        keywords: ['e-bike reviews', 'elektrische fiets reviews', 'e-bike ervaringen'],
        type: 'website'
      },
      community: {
        title: 'E-Bike Community - Vraag en deel je ervaringen',
        description: 'Word onderdeel van de e-bike community. Stel vragen, deel ervaringen en help andere e-bike liefhebbers.',
        keywords: ['e-bike community', 'e-bike forum', 'elektrische fiets community'],
        type: 'website'
      }
    }

    return configs[page] || configs.home
  }

  // Apply SEO config to page
  applySEO(config: SEOConfig): void {
    this.updateTitle(config.title)
    this.updateDescription(config.description)
    this.updateKeywords(config.keywords)
    
    this.updateOpenGraph({
      title: config.title,
      description: config.description,
      image: config.image,
      url: config.url || window.location.href,
      type: config.type
    })
    
    this.updateTwitterCard({
      title: config.title,
      description: config.description,
      image: config.image,
      card: 'summary_large_image'
    })
    
    if (config.structuredData) {
      this.addStructuredData(config.structuredData)
    }
  }
}

export const seoOptimizer = SEOOptimizer.getInstance()
