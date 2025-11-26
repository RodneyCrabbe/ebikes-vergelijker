/**
 * Link Click Testing Script
 * Tests if navigation links are clickable and working
 */
import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:5173';

class LinkClickTester {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🔍 Initializing Link Click Tester...');
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

  async testLinkClicks() {
    console.log('\n🧪 Testing Link Clicks...');
    
    try {
      // Load the homepage
      console.log('1. Loading homepage...');
      await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const initialUrl = this.page.url();
      console.log(`   Initial URL: ${initialUrl}`);
      
      // Test E-bikes link
      console.log('\n2. Testing E-bikes link click...');
      
      // Find the E-bikes link
      const eBikesLink = await this.page.$('a[href="/e-bikes"]');
      if (!eBikesLink) {
        console.log('   ❌ E-bikes link not found');
        return;
      }
      
      console.log('   ✅ E-bikes link found');
      
      // Check if link is visible
      const isVisible = await eBikesLink.isVisible();
      console.log(`   Visible: ${isVisible}`);
      
      // Get link properties
      const linkProps = await eBikesLink.evaluate(el => ({
        href: el.getAttribute('href'),
        textContent: el.textContent.trim(),
        tagName: el.tagName,
        className: el.className,
        style: el.style.cssText,
        disabled: el.disabled,
        onclick: el.onclick ? el.onclick.toString() : null
      }));
      
      console.log('   Link properties:', linkProps);
      
      // Check if link has any attributes that might affect clicking
      const hasClickAttributes = linkProps.onclick !== null;
      console.log(`   Has onclick attribute: ${hasClickAttributes}`);
      
      // Try clicking the link
      console.log('   Attempting to click E-bikes link...');
      
      // Add a click event listener to see if it fires
      await this.page.evaluate(() => {
        const link = document.querySelector('a[href="/e-bikes"]');
        if (link) {
          link.addEventListener('click', (e) => {
            console.log('🔵 Link click event fired!', e);
          });
        }
      });
      
      // Click the link
      await eBikesLink.click();
      
      // Wait for navigation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const finalUrl = this.page.url();
      console.log(`   Final URL after click: ${finalUrl}`);
      
      if (finalUrl.includes('/e-bikes')) {
        console.log('   ✅ Link click successful!');
      } else {
        console.log('   ❌ Link click failed - still on homepage');
        
        // Check if there are any JavaScript errors that might have prevented navigation
        const errors = await this.page.evaluate(() => {
          return window.console.errors || [];
        });
        
        if (errors.length > 0) {
          console.log('   JavaScript errors found:', errors);
        }
      }
      
    } catch (error) {
      console.log(`❌ Link click test failed: ${error.message}`);
    }
  }

  async runTest() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     LINK CLICK TESTING                                ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    try {
      await this.init();
      await this.testLinkClicks();
      
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
const tester = new LinkClickTester();
tester.runTest().catch(console.error);
