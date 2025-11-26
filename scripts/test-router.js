/**
 * Router Testing Script
 * Tests if Vue Router is working properly
 */
import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:5173';

class RouterTester {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🔍 Initializing Router Tester...');
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

  async testRouter() {
    console.log('\n🧪 Testing Vue Router...');
    
    try {
      // Load the page
      console.log('1. Loading page...');
      await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
      
      // Wait for Vue to be ready
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if Vue app is mounted
      console.log('\n2. Checking Vue app...');
      const appElement = await this.page.$('#app');
      if (appElement) {
        console.log('   ✅ App element found');
        
        const appContent = await appElement.evaluate(el => el.innerHTML);
        console.log(`   App content length: ${appContent.length} characters`);
        
        if (appContent.length < 100) {
          console.log('   ⚠️  App appears to be empty or not loaded');
        }
      } else {
        console.log('   ❌ App element not found');
      }
      
      // Check for Vue Router
      console.log('\n3. Checking Vue Router...');
      const routerInfo = await this.page.evaluate(() => {
        // Check if Vue is available
        if (typeof window.Vue === 'undefined' && typeof window.__VUE__ === 'undefined') {
          return { error: 'Vue not found' };
        }
        
        // Check for router in Vue app
        const app = document.querySelector('#app');
        if (app && app.__vue_app__) {
          const appInstance = app.__vue_app__;
          if (appInstance.config && appInstance.config.globalProperties.$router) {
            const router = appInstance.config.globalProperties.$router;
            return {
              currentRoute: router.currentRoute.value,
              routes: router.getRoutes().map(r => ({ path: r.path, name: r.name })),
              history: router.history
            };
          }
        }
        
        return { error: 'Router not found in Vue app' };
      });
      
      if (routerInfo.error) {
        console.log(`   ❌ ${routerInfo.error}`);
      } else {
        console.log('   ✅ Vue Router found');
        console.log(`   Current route: ${routerInfo.currentRoute.path}`);
        console.log(`   Available routes: ${routerInfo.routes.length}`);
        routerInfo.routes.slice(0, 5).forEach(route => {
          console.log(`     - ${route.path} (${route.name})`);
        });
      }
      
      // Test programmatic navigation
      console.log('\n4. Testing programmatic navigation...');
      const navigationResult = await this.page.evaluate(() => {
        const app = document.querySelector('#app');
        if (app && app.__vue_app__) {
          const router = app.__vue_app__.config.globalProperties.$router;
          if (router) {
            try {
              router.push('/e-bikes');
              return { success: true, currentRoute: router.currentRoute.value.path };
            } catch (error) {
              return { success: false, error: error.message };
            }
          }
        }
        return { success: false, error: 'Router not available' };
      });
      
      if (navigationResult.success) {
        console.log(`   ✅ Programmatic navigation successful: ${navigationResult.currentRoute}`);
      } else {
        console.log(`   ❌ Programmatic navigation failed: ${navigationResult.error}`);
      }
      
      // Check final URL
      const finalUrl = this.page.url();
      console.log(`\n5. Final URL: ${finalUrl}`);
      
    } catch (error) {
      console.log(`❌ Router test failed: ${error.message}`);
    }
  }

  async runTest() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     VUE ROUTER TESTING                                ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    try {
      await this.init();
      await this.testRouter();
      
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
const tester = new RouterTester();
tester.runTest().catch(console.error);
