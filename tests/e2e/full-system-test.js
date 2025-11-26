/**
 * Complete E2E System Test
 * Tests all critical user flows and system health
 */
import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:5173';
const SUPABASE_URL = 'http://127.0.0.1:54321';
const TIMEOUT = 30000;

class SystemTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
  }

  async init() {
    console.log('🚀 Initializing Puppeteer...');
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set viewport
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 Console Error:', msg.text());
      }
    });
    
    // Handle page errors
    this.page.on('pageerror', error => {
      console.log('🔴 Page Error:', error.message);
    });
  }

  async test(name, testFn) {
    console.log(`\n🧪 Testing: ${name}...`);
    try {
      const result = await testFn();
      console.log(`   ✅ PASSED: ${name}`);
      this.results.push({ name, status: 'PASSED', result });
      return result;
    } catch (error) {
      console.log(`   ❌ FAILED: ${name} - ${error.message}`);
      this.results.push({ name, status: 'FAILED', error: error.message });
      throw error;
    }
  }

  async checkBackendHealth() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ebikes?select=count`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }
    
    const data = await response.json();
    return `Found ${data.length} e-bikes in database`;
  }

  async checkHomepageLoads() {
    await this.page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: TIMEOUT });
    
    // Check if page loaded properly
    const title = await this.page.title();
    if (!title || title.includes('localhost')) {
      throw new Error('Page did not load properly - title: ' + title);
    }
    
    // Check for Vue app
    const appElement = await this.page.$('#app');
    if (!appElement) {
      throw new Error('Vue app element not found');
    }
    
    return `Page loaded with title: ${title}`;
  }

  async checkEBikesVisible() {
    // Wait for e-bikes to load
    await this.page.waitForSelector('[data-testid="ebike-card"], .ebike-card, .group', { timeout: 10000 });
    
    // Count e-bike elements
    const ebikeElements = await this.page.$$('[data-testid="ebike-card"], .ebike-card, .group');
    
    if (ebikeElements.length === 0) {
      // Try alternative selectors
      const altElements = await this.page.$$('.group.bg-white.rounded-3xl');
      if (altElements.length === 0) {
        throw new Error('No e-bike cards found on homepage');
      }
      return `Found ${altElements.length} e-bike cards (alternative selector)`;
    }
    
    return `Found ${ebikeElements.length} e-bike cards`;
  }

  async checkNavigation() {
    // Test navigation to e-bikes page
    const eBikesLink = await this.page.$('a[href="/e-bikes"]');
    if (!eBikesLink) {
      throw new Error('E-bikes navigation link not found');
    }
    
    await eBikesLink.click();
    await this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/e-bikes')) {
      throw new Error(`Navigation failed - current URL: ${currentUrl}`);
    }
    
    return `Successfully navigated to e-bikes page: ${currentUrl}`;
  }

  async checkLoginPage() {
    // Navigate to login page
    await this.page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0', timeout: TIMEOUT });
    
    // Check for login form elements
    const emailInput = await this.page.$('input[type="email"], input[name="email"]');
    const passwordInput = await this.page.$('input[type="password"], input[name="password"]');
    
    if (!emailInput || !passwordInput) {
      throw new Error('Login form elements not found');
    }
    
    return 'Login page loaded with form elements';
  }

  async checkAppointmentPage() {
    // Navigate to appointment page
    await this.page.goto(`${BASE_URL}/afspraak`, { waitUntil: 'networkidle0', timeout: TIMEOUT });
    
    // Check for appointment form
    const form = await this.page.$('form');
    if (!form) {
      throw new Error('Appointment form not found');
    }
    
    return 'Appointment page loaded with form';
  }

  async checkConsoleErrors() {
    const errors = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any async errors
    await this.page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('   ⚠️  Console errors found:', errors);
    }
    
    return `Found ${errors.length} console errors`;
  }

  async runAllTests() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     E-BIKE PLATFORM - COMPLETE SYSTEM TEST            ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    try {
      await this.init();
      
      await this.test('Backend Health Check', () => this.checkBackendHealth());
      await this.test('Homepage Loads', () => this.checkHomepageLoads());
      await this.test('E-bikes Visible', () => this.checkEBikesVisible());
      await this.test('Navigation Works', () => this.checkNavigation());
      await this.test('Login Page', () => this.checkLoginPage());
      await this.test('Appointment Page', () => this.checkAppointmentPage());
      await this.test('Console Errors', () => this.checkConsoleErrors());
      
      console.log('\n🎉 ALL TESTS PASSED!');
      console.log('\n📊 Test Results:');
      this.results.forEach(result => {
        console.log(`   ${result.status === 'PASSED' ? '✅' : '❌'} ${result.name}`);
      });
      
    } catch (error) {
      console.log('\n❌ TESTS FAILED!');
      console.log('Error:', error.message);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the tests
const tester = new SystemTester();
tester.runAllTests().catch(console.error);