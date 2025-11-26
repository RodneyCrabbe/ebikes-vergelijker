import { EBike } from '../types/ebike'

export interface SitemapPage {
  url: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export class SitemapGenerator {
  private baseUrl = 'https://ebike-platform.com'

  generateSitemap(pages: SitemapPage[]): string {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => this.generateUrlEntry(page)).join('\n')}
</urlset>`

    return sitemap
  }

  generateStaticPages(): SitemapPage[] {
    const now = new Date().toISOString().split('T')[0]
    
    return [
      {
        url: '/',
        lastmod: now,
        changefreq: 'daily',
        priority: 1.0
      },
      {
        url: '/ebikes',
        lastmod: now,
        changefreq: 'daily',
        priority: 0.9
      },
      {
        url: '/vergelijken',
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        url: '/reviews',
        lastmod: now,
        changefreq: 'daily',
        priority: 0.8
      },
      {
        url: '/community',
        lastmod: now,
        changefreq: 'daily',
        priority: 0.7
      },
      {
        url: '/over-ons',
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.5
      },
      {
        url: '/contact',
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.5
      },
      {
        url: '/privacy',
        lastmod: now,
        changefreq: 'yearly',
        priority: 0.3
      },
      {
        url: '/voorwaarden',
        lastmod: now,
        changefreq: 'yearly',
        priority: 0.3
      }
    ]
  }

  generateEBikePages(ebikes: EBike[]): SitemapPage[] {
    const now = new Date().toISOString().split('T')[0]
    
    return ebikes.map(ebike => ({
      url: `/ebike/${ebike.id}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    }))
  }

  generateCategoryPages(): SitemapPage[] {
    const now = new Date().toISOString().split('T')[0]
    const categories = [
      'city', 'mountain', 'commute', 'touring', 'cargo', 
      'folding', 'fat_bike', 'road', 'hybrid'
    ]
    
    return categories.map(category => ({
      url: `/ebikes?categorie=${category}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    }))
  }

  generateBrandPages(brands: string[]): SitemapPage[] {
    const now = new Date().toISOString().split('T')[0]
    
    return brands.map(brand => ({
      url: `/ebikes?merk=${encodeURIComponent(brand)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.6
    }))
  }

  generatePriceRangePages(): SitemapPage[] {
    const now = new Date().toISOString().split('T')[0]
    const priceRanges = [
      { min: 0, max: 1000, label: 'onder-1000' },
      { min: 1000, max: 2000, label: '1000-2000' },
      { min: 2000, max: 3000, label: '2000-3000' },
      { min: 3000, max: 5000, label: '3000-5000' },
      { min: 5000, max: 10000, label: '5000-plus' }
    ]
    
    return priceRanges.map(range => ({
      url: `/ebikes?prijs=${range.label}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.5
    }))
  }

  generateAllPages(ebikes: EBike[], brands: string[]): SitemapPage[] {
    return [
      ...this.generateStaticPages(),
      ...this.generateEBikePages(ebikes),
      ...this.generateCategoryPages(),
      ...this.generateBrandPages(brands),
      ...this.generatePriceRangePages()
    ]
  }

  private generateUrlEntry(page: SitemapPage): string {
    return `  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  }

  // Generate robots.txt content
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${this.baseUrl}/sitemap.xml
Sitemap: ${this.baseUrl}/sitemap-ebikes.xml
Sitemap: ${this.baseUrl}/sitemap-categories.xml
Sitemap: ${this.baseUrl}/sitemap-brands.xml

# Disallow private areas
Disallow: /admin/
Disallow: /api/
Disallow: /profiel/
Disallow: /notifications/
Disallow: /dealer/
Disallow: /subscription/

# Allow important pages
Allow: /ebikes
Allow: /reviews
Allow: /community
Allow: /vergelijken

# Crawl delay
Crawl-delay: 1`
  }

  // Generate sitemap index
  generateSitemapIndex(sitemaps: Array<{url: string, lastmod: string}>): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${this.baseUrl}${sitemap.url}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`
  }
}

export const sitemapGenerator = new SitemapGenerator()
