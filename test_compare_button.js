const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();

  // Listen to console messages
  page.on('console', msg => {
    console.log(`CONSOLE ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  // Listen to page errors
  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  try {
    console.log('Navigating to e-bikes page...');
    await page.goto('http://127.0.0.1:5173/e-bikes', { waitUntil: 'networkidle2' });
    
    console.log('Waiting for page to load...');
    await page.waitForSelector('.grid', { timeout: 10000 });
    
    console.log('Looking for compare buttons...');
    const compareButtons = await page.$$('button[title*="vergelijking"], button:has-text("Vergelijk")');
    console.log(`Found ${compareButtons.length} compare buttons`);
    
    if (compareButtons.length > 0) {
      console.log('Clicking first compare button...');
      await compareButtons[0].click();
      
      // Wait a moment to see if anything happens
      await page.waitForTimeout(2000);
      
      // Check if comparison count changed
      const comparisonBar = await page.$('.fixed.bottom-0');
      if (comparisonBar) {
        console.log('Comparison bar is visible');
        const comparisonText = await comparisonBar.textContent();
        console.log('Comparison bar text:', comparisonText);
      } else {
        console.log('No comparison bar found');
      }
    } else {
      console.log('No compare buttons found');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'compare_button_test.png', fullPage: true });
    console.log('Screenshot saved as compare_button_test.png');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();
