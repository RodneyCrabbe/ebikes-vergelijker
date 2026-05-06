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
  private baseUrl = 'https://ebikesvergelijker.nl'
  private siteName = 'E-bikes Vergelijker'
  private defaultImage = 'https://ebikesvergelijker.nl/og-image.jpg'

  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer()
    }
    return SEOOptimizer.instance
  }

  // Update page title
  updateTitle(title: string, siteName = this.siteName): void {
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

  updateCanonical(url: string): void {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement

    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }

    canonical.href = url
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
          name: this.siteName
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
      name: this.siteName,
      url: this.baseUrl,
      logo: `${this.baseUrl}/logo.png`,
      description: 'Nederlandse vergelijkingssite voor elektrische fietsen, fatbikes, bakfietsen en e-bike koopadvies.',
      availableLanguage: ['Dutch']
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
        title: 'E-bike vergelijken en kopen',
        description: 'Vergelijk elektrische fietsen op prijs, actieradius, motor, accu en reviews. Vind snel de e-bike die past bij woon-werk, stad, gezin of recreatie.',
        keywords: ['e-bike vergelijken', 'elektrische fiets vergelijken', 'e-bike kopen', 'beste e-bike', 'elektrische fietsen'],
        type: 'website'
      },
      ebikes: {
        title: 'Alle e-bikes vergelijken',
        description: 'Bekijk en filter e-bikes op merk, prijs, actieradius, accucapaciteit, motorpositie en fietstype. Vergelijk modellen naast elkaar.',
        keywords: ['alle e-bikes', 'e-bike overzicht', 'elektrische fietsen vergelijken', 'e-bike database'],
        type: 'website'
      },
      'ebike-detail': {
        title: `${data?.brand || 'E-bike'} ${data?.model_name || 'model'} vergelijken`,
        description: data?.description || `Bekijk specificaties, prijs, actieradius en afbeeldingen van de ${data?.brand || ''} ${data?.model_name || 'e-bike'}.`,
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
        title: 'E-bikes naast elkaar vergelijken',
        description: 'Vergelijk geselecteerde e-bikes naast elkaar op prijs, accu, actieradius, motor, gewicht en praktische specificaties.',
        keywords: ['e-bike vergelijking', 'e-bikes vergelijken', 'elektrische fiets vergelijking'],
        type: 'website'
      },
      reviews: {
        title: 'E-bike reviews en ervaringen',
        description: 'Lees ervaringen met elektrische fietsen en ontdek waar je op moet letten bij comfort, accu, motor, onderhoud en dagelijks gebruik.',
        keywords: ['e-bike reviews', 'elektrische fiets reviews', 'e-bike ervaringen'],
        type: 'website'
      },
      community: {
        title: 'E-bike community',
        description: 'Stel vragen over elektrische fietsen, deel ervaringen en leer van andere e-bike rijders.',
        keywords: ['e-bike community', 'e-bike forum', 'elektrische fiets community'],
        type: 'website'
      },
      about: {
        title: 'Over E-bikes Vergelijker',
        description: 'Lees hoe E-bikes Vergelijker helpt bij het kiezen van een elektrische fiets met filters, vergelijkingen en koopadvies.',
        keywords: ['over e-bikes vergelijker', 'e-bike koopadvies', 'elektrische fiets hulp'],
        type: 'website'
      },
      contact: {
        title: 'Contact',
        description: 'Neem contact op met E-bikes Vergelijker voor vragen over elektrische fietsen, vergelijkingen of het platform.',
        keywords: ['contact e-bikes vergelijker', 'e-bike vragen'],
        type: 'website'
      },
      topical: {
        title: data?.title || 'E-bike selectie',
        description: data?.description || 'Bekijk een samengestelde selectie elektrische fietsen op basis van gebruik, budget of specificaties.',
        keywords: [
          data?.title?.toLowerCase(),
          data?.template?.toLowerCase(),
          'e-bike vergelijken',
          'elektrische fiets'
        ].filter(Boolean),
        url: data?.slug ? `${this.baseUrl}${data.slug}` : undefined,
        type: 'website',
        structuredData: data ? {
          '@context': 'https://schema.org',
          '@graph': [
            this.generateOrganizationStructuredData(),
            {
              '@type': 'CollectionPage',
              name: data.title,
              description: data.description,
              url: `${this.baseUrl}${data.slug}`,
              about: data.criteria?.map((criterion: string) => ({
                '@type': 'Thing',
                name: criterion
              })) || []
            },
            this.generateBreadcrumbStructuredData([
              { name: 'Home', url: '/' },
              { name: data.title, url: data.slug }
            ])
          ]
        } : undefined
      }
    }

    return configs[page] || configs.home
  }

  // Apply SEO config to page
  applySEO(config: SEOConfig): void {
    this.updateTitle(config.title)
    this.updateDescription(config.description)
    this.updateKeywords(config.keywords)

    const canonicalUrl = config.url || window.location.href.split('#')[0]
    const image = config.image || this.defaultImage
    this.updateCanonical(canonicalUrl)
    
    this.updateOpenGraph({
      title: config.title,
      description: config.description,
      image,
      url: canonicalUrl,
      type: config.type
    })
    
    this.updateTwitterCard({
      title: config.title,
      description: config.description,
      image,
      card: 'summary_large_image'
    })
    
    if (config.structuredData) {
      this.addStructuredData(config.structuredData)
    }
  }
}

export const seoOptimizer = SEOOptimizer.getInstance()
