/**
 * Debug Errors Script
 * Investigates specific JavaScript errors causing navigation issues
 */
import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:5173';

class ErrorDebugger {
  constructor() {
    this.browser = null;
    this.page = null;
    this.errors = [];
  }

  async init() {
    console.log('🔍 Initializing Error Debugger...');
    this.browser = await puppeteer.launch({
      headless: false,
      devtools: true, // Open devtools to see errors
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
        this.errors.push({ type: 'console', message: text });
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
      this.errors.push({ type: 'page', message: error.message, stack: error.stack });
    });
    
    // Capture request failures
    this.page.on('requestfailed', request => {
      console.log(`🔴 Request Failed: ${request.url()} - ${request.failure()?.errorText}`);
      this.errors.push({ 
        type: 'request', 
        url: request.url(), 
        error: request.failure()?.errorText 
      });
    });
  }

  async debugPage(url, name) {
    console.log(`\n🔍 Debugging: ${name} (${url})`);
    this.errors = [];
    
    try {
      await this.page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      
      // Wait a bit for any async errors
      await this.page.waitForTimeout(3000);
      
      // Check for error boundary
      const errorBoundary = await this.page.$('[data-testid="error-boundary"], .error-boundary');
      if (errorBoundary) {
        const errorText = await errorBoundary.evaluate(el => el.textContent);
        console.log(`🔴 Error Boundary Active: ${errorText}`);
        this.errors.push({ type: 'error-boundary', message: errorText });
      }
      
      // Check for Vue app mounting
      const appElement = await this.page.$('#app');
      if (appElement) {
        const appContent = await appElement.evaluate(el => el.innerHTML);
        if (appContent.length < 100) {
          console.log(`⚠️  Vue app appears empty or not mounted properly`);
        }
      }
      
      console.log(`   Errors found: ${this.errors.length}`);
      return this.errors;
      
    } catch (error) {
      console.log(`❌ Failed to debug ${name}: ${error.message}`);
      return [{ type: 'debug-error', message: error.message }];
    }
  }

  async debugNavigation() {
    console.log('\n🔍 Debugging Navigation...');
    
    try {
      // Start at homepage
      await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
      
      // Try to navigate to e-bikes page
      console.log('   Attempting navigation to /e-bikes...');
      const eBikesLink = await this.page.$('a[href="/e-bikes"]');
      
      if (eBikesLink) {
        // Click and monitor for errors
        await Promise.all([
          this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }),
          eBikesLink.click()
        ]);
        
        const currentUrl = this.page.url();
        console.log(`   Current URL after click: ${currentUrl}`);
        
        // Check if we're back at homepage (indicates error)
        if (currentUrl === `${BASE_URL}/` || currentUrl === `${BASE_URL}`) {
          console.log('   ⚠️  Navigation redirected back to homepage - likely due to error');
        }
      } else {
        console.log('   ❌ E-bikes link not found');
      }
      
    } catch (error) {
      console.log(`❌ Navigation debug failed: ${error.message}`);
    }
  }

  async runDebug() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     ERROR DEBUGGING SESSION                           ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    try {
      await this.init();
      
      // Debug specific problematic pages
      await this.debugPage(`${BASE_URL}/`, 'Homepage');
      await this.debugPage(`${BASE_URL}/e-bikes`, 'E-bikes List');
      await this.debugNavigation();
      
      console.log('\n📊 ERROR SUMMARY:');
      console.log('═'.repeat(50));
      
      const errorTypes = {};
      this.errors.forEach(error => {
        errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
      });
      
      Object.entries(errorTypes).forEach(([type, count]) => {
        console.log(`${type}: ${count} errors`);
      });
      
      if (this.errors.length === 0) {
        console.log('🎉 No errors found!');
      } else {
        console.log(`\n⚠️  Found ${this.errors.length} total errors`);
        console.log('Check the detailed output above for specific issues.');
      }
      
    } catch (error) {
      console.log('\n❌ DEBUGGING FAILED!');
      console.log('Error:', error.message);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the debug session
const errorDebugger = new ErrorDebugger();
errorDebugger.runDebug().catch(console.error);
