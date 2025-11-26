/**
 * Comprehensive Page Testing Script
 * Tests all pages and identifies issues
 */
import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:5173';
const PAGES = [
  { name: 'Homepage', url: '/' },
  { name: 'E-bikes List', url: '/e-bikes' },
  { name: 'Login', url: '/login' },
  { name: 'Register', url: '/registreer' },
  { name: 'Appointment', url: '/afspraak' },
  { name: 'Reviews', url: '/reviews' },
  { name: 'Community', url: '/community' },
  { name: 'About', url: '/over-ons' },
  { name: 'Contact', url: '/contact' },
  { name: 'Profile', url: '/profiel' },
  { name: 'Notifications', url: '/notifications' },
  { name: 'Newsletter', url: '/nieuwsbrief' },
  { name: 'Cookie Policy', url: '/cookiebeleid' }
];

class PageTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
  }

  async init() {
    console.log('🚀 Initializing Page Tester...');
    this.browser = await puppeteer.launch({
      headless: false,
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Capture console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`🔴 Console Error: ${msg.text()}`);
      }
    });
    
    this.page.on('pageerror', error => {
      console.log(`🔴 Page Error: ${error.message}`);
    });
  }

  async testPage(pageInfo) {
    const { name, url } = pageInfo;
    const fullUrl = `${BASE_URL}${url}`;
    
    console.log(`\n🧪 Testing: ${name} (${fullUrl})`);
    
    try {
      // Navigate to page
      await this.page.goto(fullUrl, { 
        waitUntil: 'networkidle0', 
        timeout: 15000 
      });
      
      // Check if page loaded
      const title = await this.page.title();
      const currentUrl = this.page.url();
      
      // Check for common error indicators (more specific)
      const errorIndicators = await this.page.$$eval('*', elements => {
        return elements.some(el => 
          el.textContent?.includes('404') || 
          el.textContent?.includes('Not Found') ||
          el.textContent?.includes('Er is iets misgegaan') ||
          el.textContent?.includes('localhost page can\'t be found') ||
          el.textContent?.includes('Failed to load resource')
        );
      });
      
      // Check if Vue app is mounted
      const appElement = await this.page.$('#app');
      const hasContent = appElement ? await appElement.evaluate(el => el.innerHTML.length > 100) : false;
      
      if (errorIndicators) {
        throw new Error('Page shows error indicators');
      }
      
      if (!appElement) {
        throw new Error('Vue app element not found');
      }
      
      if (!hasContent) {
        throw new Error('Page appears empty or not loaded');
      }
      
      console.log(`   ✅ PASSED: ${name} - Title: "${title}"`);
      return { name, status: 'PASSED', title, url: currentUrl };
      
    } catch (error) {
      console.log(`   ❌ FAILED: ${name} - ${error.message}`);
      return { name, status: 'FAILED', error: error.message, url: fullUrl };
    }
  }

  async testNavigation() {
    console.log('\n🧪 Testing: Navigation between pages');
    
    try {
      // Start at homepage
      await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
      
      // Test specific navigation links
      const testLinks = [
        { name: 'E-bikes', href: '/e-bikes' },
        { name: 'Reviews', href: '/reviews' },
        { name: 'About', href: '/over-ons' },
        { name: 'Contact', href: '/contact' }
      ];
      
      let workingLinks = 0;
      
      for (const linkInfo of testLinks) {
        try {
          console.log(`   Testing: ${linkInfo.name} (${linkInfo.href})`);
          
          // Find the link
          const link = await this.page.$(`a[href="${linkInfo.href}"]`);
          if (!link) {
            console.log(`   ❌ Link not found: ${linkInfo.href}`);
            continue;
          }
          
          // Click the link and wait for navigation
          console.log(`   Clicking link to ${linkInfo.href}...`);
          await link.click();
          
          // Wait a bit for the click to register
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Wait for navigation
          try {
            await this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
          } catch (error) {
            console.log(`   Navigation timeout: ${error.message}`);
          }
          
          // Check if we navigated correctly
          const currentUrl = this.page.url();
          console.log(`   Current URL after click: ${currentUrl}`);
          
          if (currentUrl.includes(linkInfo.href)) {
            workingLinks++;
            console.log(`   ✅ Link works: ${linkInfo.href}`);
          } else {
            console.log(`   ❌ Link failed: ${linkInfo.href} -> ${currentUrl}`);
          }
          
          // Go back to homepage for next test
          await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
          
        } catch (error) {
          console.log(`   ❌ Link error: ${linkInfo.name} - ${error.message}`);
        }
      }
      
      console.log(`   Navigation: ${workingLinks}/${testLinks.length} links working`);
      return { status: workingLinks > 0 ? 'PASSED' : 'FAILED', workingLinks };
      
    } catch (error) {
      console.log(`   ❌ FAILED: Navigation test - ${error.message}`);
      return { status: 'FAILED', error: error.message };
    }
  }

  async runAllTests() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     COMPREHENSIVE PAGE TESTING                        ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    try {
      await this.init();
      
      // Test all pages
      for (const pageInfo of PAGES) {
        const result = await this.testPage(pageInfo);
        this.results.push(result);
      }
      
      // Test navigation
      const navResult = await this.testNavigation();
      this.results.push({ name: 'Navigation', ...navResult });
      
      // Summary
      console.log('\n📊 TEST RESULTS SUMMARY:');
      console.log('═'.repeat(50));
      
      const passed = this.results.filter(r => r.status === 'PASSED').length;
      const failed = this.results.filter(r => r.status === 'FAILED').length;
      
      this.results.forEach(result => {
        const icon = result.status === 'PASSED' ? '✅' : '❌';
        console.log(`${icon} ${result.name}`);
        if (result.status === 'FAILED' && result.error) {
          console.log(`   Error: ${result.error}`);
        }
      });
      
      console.log('\n' + '═'.repeat(50));
      console.log(`📈 PASSED: ${passed} | FAILED: ${failed} | TOTAL: ${this.results.length}`);
      
      if (failed === 0) {
        console.log('\n🎉 ALL PAGES ARE WORKING!');
      } else {
        console.log(`\n⚠️  ${failed} pages need attention.`);
      }
      
    } catch (error) {
      console.log('\n❌ TESTING FAILED!');
      console.log('Error:', error.message);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the tests
const tester = new PageTester();
tester.runAllTests().catch(console.error);
