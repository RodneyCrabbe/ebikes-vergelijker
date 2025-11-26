/**
 * Detailed Navigation Testing Script
 * Tests navigation specifically to identify why links redirect to homepage
 */
import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:5173';

class NavigationTester {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🔍 Initializing Navigation Tester...');
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

  async testNavigation() {
    console.log('\n🧪 Testing Navigation in Detail...');
    
    try {
      // Start at homepage
      console.log('1. Loading homepage...');
      await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
      
      const initialUrl = this.page.url();
      console.log(`   Initial URL: ${initialUrl}`);
      
      // Wait for page to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test E-bikes link specifically
      console.log('\n2. Testing E-bikes link...');
      
      // Find the E-bikes link
      const eBikesLink = await this.page.$('a[href="/e-bikes"]');
      if (!eBikesLink) {
        console.log('   ❌ E-bikes link not found');
        return;
      }
      
      console.log('   ✅ E-bikes link found');
      
      // Get link text and href
      const linkText = await eBikesLink.evaluate(el => el.textContent);
      const linkHref = await eBikesLink.evaluate(el => el.getAttribute('href'));
      console.log(`   Link text: "${linkText}"`);
      console.log(`   Link href: "${linkHref}"`);
      
      // Click the link and monitor what happens
      console.log('   Clicking E-bikes link...');
      
      const [response] = await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }),
        eBikesLink.click()
      ]);
      
      const finalUrl = this.page.url();
      console.log(`   Final URL: ${finalUrl}`);
      
      if (finalUrl.includes('/e-bikes')) {
        console.log('   ✅ Navigation successful!');
      } else if (finalUrl === initialUrl || finalUrl === `${BASE_URL}/` || finalUrl === `${BASE_URL}`) {
        console.log('   ❌ Navigation redirected back to homepage');
        
        // Check if there are any error messages on the page
        const errorMessages = await this.page.$$eval('*', elements => {
          return elements
            .filter(el => el.textContent && (
              el.textContent.includes('Error') ||
              el.textContent.includes('Er is iets misgegaan') ||
              el.textContent.includes('Failed to load')
            ))
            .map(el => el.textContent.trim())
            .slice(0, 5); // Limit to first 5 error messages
        });
        
        if (errorMessages.length > 0) {
          console.log('   Error messages found on page:');
          errorMessages.forEach(msg => console.log(`     - ${msg}`));
        }
        
        // Check if Vue router is working
        const routerInfo = await this.page.evaluate(() => {
          if (window.__VUE_ROUTER__) {
            return {
              currentRoute: window.__VUE_ROUTER__.currentRoute.value,
              history: window.__VUE_ROUTER__.history
            };
          }
          return null;
        });
        
        if (routerInfo) {
          console.log('   Router info:', routerInfo);
        } else {
          console.log('   ❌ Vue Router not found');
        }
        
      } else {
        console.log(`   ⚠️  Navigation went to unexpected URL: ${finalUrl}`);
      }
      
    } catch (error) {
      console.log(`❌ Navigation test failed: ${error.message}`);
    }
  }

  async runTest() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     DETAILED NAVIGATION TESTING                       ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    try {
      await this.init();
      await this.testNavigation();
      
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
const tester = new NavigationTester();
tester.runTest().catch(console.error);
