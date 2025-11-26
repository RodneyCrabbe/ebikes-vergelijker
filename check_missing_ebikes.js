const puppeteer = require('puppeteer');

async function checkMissingEBikes() {
  console.log('🔍 Starting Puppeteer to check missing e-bikes...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for headless mode
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the e-bikes page
    console.log('📄 Navigating to e-bikes page...');
    await page.goto('http://127.0.0.1:5173/e-bikes', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Get all visible e-bike cards
    console.log('🔍 Extracting visible e-bike data...');
    const visibleEBikes = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="group"][class*="bg-white"][class*="rounded"]');
      const eBikes = [];
      
      cards.forEach((card, index) => {
        try {
          // Extract brand and model from the card
          const brandElement = card.querySelector('[class*="glass-badge"]');
          const modelElement = card.querySelector('h3, h2, [class*="font-bold"], [class*="text-lg"]');
          const priceElement = card.querySelector('[class*="text-green"], [class*="text-primary"], [class*="font-bold"]');
          
          const brand = brandElement ? brandElement.textContent.trim() : 'Unknown';
          const model = modelElement ? modelElement.textContent.trim() : 'Unknown';
          const price = priceElement ? priceElement.textContent.trim() : 'Unknown';
          
          // Check if image is visible
          const imgElement = card.querySelector('img');
          const hasImage = imgElement && imgElement.src && !imgElement.src.includes('placeholder') && !imgElement.src.includes('data:image/svg');
          
          eBikes.push({
            index: index + 1,
            brand: brand,
            model: model,
            price: price,
            hasImage: hasImage,
            imageSrc: imgElement ? imgElement.src : 'No image'
          });
        } catch (error) {
          console.log(`Error processing card ${index}:`, error);
        }
      });
      
      return eBikes;
    });
    
    console.log(`\n📊 Found ${visibleEBikes.length} visible e-bike cards:`);
    console.log('='.repeat(80));
    
    visibleEBikes.forEach((ebike, index) => {
      console.log(`${index + 1}. ${ebike.brand} ${ebike.model}`);
      console.log(`   Price: ${ebike.price}`);
      console.log(`   Has Image: ${ebike.hasImage ? '✅' : '❌'}`);
      console.log(`   Image Source: ${ebike.imageSrc}`);
      console.log('-'.repeat(40));
    });
    
    // Now let's check what e-bikes should be in our data
    console.log('\n🔍 Checking expected e-bikes from data...');
    
    // Read the data file to get all expected e-bikes
    const fs = require('fs');
    const dataPath = './src/data/ebikes.json';
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`\n📊 Expected ${data.length} e-bikes from data:`);
    console.log('='.repeat(80));
    
    data.forEach((ebike, index) => {
      console.log(`${index + 1}. ${ebike.brand} ${ebike.model_name}`);
      console.log(`   Price: €${ebike.price || 'N/A'}`);
      console.log(`   Has Images: ${ebike.images && ebike.images.length > 0 ? '✅' : '❌'}`);
      console.log(`   Image Count: ${ebike.images ? ebike.images.length : 0}`);
      console.log('-'.repeat(40));
    });
    
    // Find missing e-bikes
    const visibleBrands = visibleEBikes.map(e => `${e.brand} ${e.model}`.toLowerCase());
    const missingEBikes = data.filter(ebike => {
      const fullName = `${ebike.brand} ${ebike.model_name}`.toLowerCase();
      return !visibleBrands.some(visible => visible.includes(ebike.brand.toLowerCase()) && visible.includes(ebike.model_name.toLowerCase()));
    });
    
    console.log(`\n❌ Missing ${missingEBikes.length} e-bikes from the page:`);
    console.log('='.repeat(80));
    
    missingEBikes.forEach((ebike, index) => {
      console.log(`${index + 1}. ${ebike.brand} ${ebike.model_name}`);
      console.log(`   Price: €${ebike.price || 'N/A'}`);
      console.log(`   ID: ${ebike.id}`);
      console.log(`   Has Images: ${ebike.images && ebike.images.length > 0 ? '✅' : '❌'}`);
      console.log('-'.repeat(40));
    });
    
    // Take a screenshot for reference
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'missing-ebikes-screenshot.png', 
      fullPage: true 
    });
    
    console.log('\n✅ Analysis complete! Check missing-ebikes-screenshot.png for visual reference.');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  } finally {
    await browser.close();
  }
}

// Run the analysis
checkMissingEBikes().catch(console.error);
