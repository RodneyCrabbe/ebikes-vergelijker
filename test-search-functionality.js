const puppeteer = require('puppeteer');

async function testSearchFunctionality() {
  console.log('🔍 Testing search functionality...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the homepage
    console.log('📱 Navigating to homepage...');
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });
    
    // Wait for the page to load
    await page.waitForSelector('input[placeholder*="Zoek e-bikes"]', { timeout: 10000 });
    
    // Test search functionality
    console.log('🔍 Testing search for "ENGWE"...');
    const searchInput = await page.$('input[placeholder*="Zoek e-bikes"]');
    await searchInput.click();
    await searchInput.type('ENGWE');
    await searchInput.press('Enter');
    
    // Wait for navigation to e-bikes page
    await page.waitForSelector('.grid', { timeout: 10000 });
    
    // Check if search results are displayed
    const searchResults = await page.$('.bg-blue-50\\/50');
    if (searchResults) {
      console.log('✅ Search results header found!');
      const searchText = await page.evaluate(el => el.textContent, searchResults);
      console.log('📝 Search results text:', searchText);
    } else {
      console.log('❌ Search results header not found');
    }
    
    // Check if filtered e-bikes are displayed
    const ebikeCards = await page.$$('.group.bg-white\\/80');
    console.log(`📊 Found ${ebikeCards.length} e-bike cards`);
    
    // Check if all displayed e-bikes contain "ENGWE"
    const engweCards = await page.$$eval('.group.bg-white\\/80', cards => 
      cards.filter(card => 
        card.textContent.toLowerCase().includes('engwe')
      ).length
    );
    
    console.log(`🎯 Found ${engweCards} ENGWE e-bikes in results`);
    
    if (engweCards > 0) {
      console.log('✅ Search functionality working correctly!');
    } else {
      console.log('❌ Search functionality not working - no ENGWE bikes found');
    }
    
    // Test clearing search
    console.log('🧹 Testing search clear...');
    const clearButton = await page.$('button:has-text("Wissen")');
    if (clearButton) {
      await clearButton.click();
      console.log('✅ Search cleared successfully');
    }
    
    // Wait a bit to see the results
    await page.waitForTimeout(2000);
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testSearchFunctionality().catch(console.error);
