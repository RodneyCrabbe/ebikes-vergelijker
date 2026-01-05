#!/usr/bin/env node

import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:5195';

async function testGiantImages() {
  console.log('🚀 Starting Puppeteer test...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' || text.includes('image') || text.includes('Giant')) {
        console.log(`[${type.toUpperCase()}] ${text}`);
      }
    });
    
    // Log failed requests
    page.on('requestfailed', request => {
      const url = request.url();
      if (url.includes('Giant') || url.includes('img')) {
        console.log(`❌ Request failed: ${url}`);
      }
    });
    
    console.log(`📄 Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check for Giant products
    console.log('\n🔍 Checking for Giant products...');
    
    // Try to find Giant product cards
    const giantProducts = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[class*="card"], [class*="product"]'));
      const results = [];
      
      cards.forEach((card, index) => {
        const text = card.textContent || '';
        if (text.includes('Giant') && (text.includes('Explore') || text.includes('Trance'))) {
          const img = card.querySelector('img');
          const imgSrc = img ? img.src : 'no image found';
          const imgComplete = img ? img.complete : false;
          const imgNaturalWidth = img ? img.naturalWidth : 0;
          
          results.push({
            index,
            text: text.substring(0, 100),
            imgSrc,
            imgComplete,
            imgNaturalWidth,
            hasImage: imgNaturalWidth > 0
          });
        }
      });
      
      return results;
    });
    
    console.log(`Found ${giantProducts.length} Giant product cards:\n`);
    giantProducts.forEach((product, i) => {
      console.log(`Product ${i + 1}:`);
      console.log(`  Text: ${product.text.substring(0, 50)}...`);
      console.log(`  Image Src: ${product.imgSrc}`);
      console.log(`  Image Complete: ${product.imgComplete}`);
      console.log(`  Image Width: ${product.imgNaturalWidth}px`);
      console.log(`  Has Image: ${product.hasImage ? '✅' : '❌'}\n`);
    });
    
    // Test direct image loading
    console.log('\n🖼️  Testing direct image URLs...\n');
    const imageTests = [
      '/img/Giant Explore E+/GIANT_Explore_E_System-8744-2048x1365.jpg.webp',
      '/img/Giant Explore E+ 1/MY23ExploreEplus1DD_ColorAMistyForest.jpg',
      '/img/Giant Trance E+ 3/MY22TranceXEplus3Pro29_ColorABlackDiamond.jpg'
    ];
    
    for (const imgPath of imageTests) {
      const fullUrl = `${BASE_URL}${imgPath}`;
      console.log(`Testing: ${imgPath}`);
      
      const response = await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 5000 }).catch(() => null);
      
      if (response && response.status() === 200) {
        console.log(`  ✅ Image loads successfully (${response.status()})\n`);
      } else {
        console.log(`  ❌ Image failed to load\n`);
      }
    }
    
    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'giant-products-test.png', fullPage: true });
    console.log('✅ Screenshot saved to giant-products-test.png\n');
    
    // Check JSON data
    console.log('📊 Checking JSON data...');
    const jsonData = await page.evaluate(async () => {
      try {
        const response = await fetch('/ebikes-data.json');
        const data = await response.json();
        const giantProducts = data.filter(e => 
          e.brand === 'Giant' && 
          (e.model_name === 'Explore E+' || e.model_name === 'Explore E+ 1' || e.model_name === 'Trance E+ 3')
        );
        return giantProducts.map(e => ({
          model: e.model_name,
          imageUrl: e.image_url,
          imagesCount: e.images ? e.images.length : 0,
          firstImage: e.images && e.images.length > 0 ? e.images[0] : null
        }));
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('JSON Data Results:');
    if (jsonData.error) {
      console.log(`  ❌ Error: ${jsonData.error}\n`);
    } else {
      jsonData.forEach(product => {
        console.log(`  ${product.model}:`);
        console.log(`    Image URL: ${product.imageUrl}`);
        console.log(`    Images: ${product.imagesCount}`);
        console.log(`    First: ${product.firstImage}\n`);
      });
    }
    
    console.log('✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.error('\n⚠️  Make sure the dev server is running: npm run dev');
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testGiantImages().catch(console.error);


