/**
 * Direct Navigation Testing Script
 * Tests navigating directly to URLs to see if the issue is with links or routing
 */
import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:5173';

class DirectNavigationTester {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🔍 Initializing Direct Navigation Tester...');
    this.browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Capture all console messages
    this.page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        console.log(`🔴 Console Error: ${text}`);
      } else if (type === 'warning') {
        console.log(`⚠️  Console Warning: ${text}`);
      } else {
        console.log(`ℹ️  Console ${type}: ${text}`);
      }
    });
    
    // Capture page errors
    this.page.on('pageerror', error => {
      console.log(`🔴 Page Error: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
    });
  }

  async testDirectNavigation() {
    console.log('\n🧪 Testing Direct Navigation...');
    
    const testUrls = [
      { url: '/e-bikes', name: 'E-bikes List' },
      { url: '/reviews', name: 'Reviews' },
      { url: '/over-ons', name: 'About' },
      { url: '/contact', name: 'Contact' }
    ];
    
    for (const test of testUrls) {
      console.log(`\n1. Testing direct navigation to ${test.name} (${test.url})...`);
      
      try {
        // Navigate directly to the URL
        await this.page.goto(`${BASE_URL}${test.url}`, { waitUntil: 'networkidle0' });
        
        // Wait for page to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const finalUrl = this.page.url();
        console.log(`   Final URL: ${finalUrl}`);
        
        if (finalUrl.includes(test.url)) {
          console.log(`   ✅ Successfully navigated to ${test.name}`);
          
          // Check if the page content is loaded
          const pageTitle = await this.page.title();
          console.log(`   Page title: ${pageTitle}`);
          
          // Check for specific content that should be on each page
          let hasExpectedContent = false;
          switch (test.url) {
            case '/e-bikes':
              hasExpectedContent = await this.page.$('h1') !== null;
              break;
            case '/reviews':
              hasExpectedContent = await this.page.$('h1') !== null;
              break;
            case '/over-ons':
              hasExpectedContent = await this.page.$('h1') !== null;
              break;
            case '/contact':
              hasExpectedContent = await this.page.$('h1') !== null;
              break;
          }
          
          if (hasExpectedContent) {
            console.log(`   ✅ Page content loaded correctly`);
          } else {
            console.log(`   ⚠️  Page content may not be loaded correctly`);
          }
          
        } else if (finalUrl === `${BASE_URL}/` || finalUrl === `${BASE_URL}`) {
          console.log(`   ❌ Redirected back to homepage`);
        } else {
          console.log(`   ⚠️  Unexpected redirect to: ${finalUrl}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error navigating to ${test.name}: ${error.message}`);
      }
    }
  }

  async runTest() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     DIRECT NAVIGATION TESTING                         ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    try {
      await this.init();
      await this.testDirectNavigation();
      
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

// Run the test
const tester = new DirectNavigationTester();
tester.runTest().catch(console.error);
