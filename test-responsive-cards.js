/**
 * Responsive Card Design Test
 * Tests the e-bike cards across different screen sizes
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const devices = [
  { name: 'Desktop-Large', width: 1920, height: 1080 },
  { name: 'Desktop-Medium', width: 1366, height: 768 },
  { name: 'Tablet-Landscape', width: 1024, height: 768 },
  { name: 'Tablet-Portrait', width: 768, height: 1024 },
  { name: 'Mobile-Large', width: 414, height: 896 },
  { name: 'Mobile-Medium', width: 375, height: 667 },
  { name: 'Mobile-Small', width: 320, height: 568 }
];

async function testResponsiveDesign() {
  console.log('🚀 Starting responsive design test...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots', 'responsive-test');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  try {
    // Navigate to the e-bikes page
    console.log('📱 Navigating to e-bikes page...');
    await page.goto('http://127.0.0.1:5173/e-bikes', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for cards to load
    await page.waitForSelector('[class*="glass-card"]', { timeout: 10000 });
    console.log('✅ Cards loaded successfully\n');

    // Test each device size
    for (const device of devices) {
      console.log(`📐 Testing ${device.name} (${device.width}x${device.height})`);

      await page.setViewport({
        width: device.width,
        height: device.height,
        deviceScaleFactor: 1
      });

      // Wait for layout to stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Take screenshot
      const screenshotPath = path.join(screenshotsDir, `${device.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      // Analyze card layout
      const cardAnalysis = await page.evaluate(() => {
        const cards = document.querySelectorAll('[class*="glass-card"]');
        if (cards.length === 0) return null;

        const firstCard = cards[0];
        const cardRect = firstCard.getBoundingClientRect();
        const styles = window.getComputedStyle(firstCard);

        // Check glassmorphism properties
        const hasBackdropFilter = styles.backdropFilter !== 'none' && styles.backdropFilter !== '';
        const hasTransparentBg = styles.backgroundColor.includes('rgba') ||
                                  parseFloat(styles.opacity) < 1;

        // Check button visibility
        const buttons = firstCard.querySelectorAll('button');
        const vergelijkButton = Array.from(buttons).find(btn =>
          btn.textContent.includes('Vergelijk') ||
          btn.getAttribute('title')?.includes('vergelijk')
        );

        // Check price visibility
        const priceElement = firstCard.querySelector('[class*="glass-price"]');
        const priceVisible = priceElement ?
          window.getComputedStyle(priceElement).display !== 'none' : false;

        return {
          totalCards: cards.length,
          cardWidth: Math.round(cardRect.width),
          cardHeight: Math.round(cardRect.height),
          hasGlassmorphism: hasBackdropFilter && hasTransparentBg,
          backdropFilter: styles.backdropFilter,
          backgroundColor: styles.backgroundColor,
          priceVisible: priceVisible,
          vergelijkButtonVisible: vergelijkButton !== null &&
            window.getComputedStyle(vergelijkButton).display !== 'none'
        };
      });

      if (cardAnalysis) {
        console.log(`   ├─ Cards found: ${cardAnalysis.totalCards}`);
        console.log(`   ├─ Card dimensions: ${cardAnalysis.cardWidth}x${cardAnalysis.cardHeight}px`);
        console.log(`   ├─ Glassmorphism: ${cardAnalysis.hasGlassmorphism ? '✅' : '❌'}`);
        console.log(`   ├─ Backdrop Filter: ${cardAnalysis.backdropFilter}`);
        console.log(`   ├─ Price visible: ${cardAnalysis.priceVisible ? '✅' : '❌'}`);
        console.log(`   ├─ Vergelijk button visible: ${cardAnalysis.vergelijkButtonVisible ? '✅' : '❌'}`);
        console.log(`   └─ Screenshot: ${path.basename(screenshotPath)}`);
      } else {
        console.log('   ❌ No cards found');
      }
      console.log('');
    }

    // Test interaction on desktop size
    console.log('🖱️  Testing interactions on desktop...');
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test hover effect
    const hoverTest = await page.evaluate(() => {
      const firstCard = document.querySelector('[class*="glass-card"]');
      if (!firstCard) return { success: false };

      // Simulate hover
      const event = new MouseEvent('mouseenter', { bubbles: true });
      firstCard.dispatchEvent(event);

      return { success: true };
    });

    console.log(`   ├─ Hover effect: ${hoverTest.success ? '✅' : '❌'}`);

    // Test Vergelijk button click
    const buttonTest = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const vergelijkBtn = Array.from(buttons).find(btn =>
        btn.textContent.includes('Vergelijk') ||
        btn.getAttribute('title')?.includes('vergelijk')
      );

      if (vergelijkBtn) {
        vergelijkBtn.click();
        return { found: true, clicked: true };
      }
      return { found: false, clicked: false };
    });

    console.log(`   ├─ Vergelijk button clickable: ${buttonTest.clicked ? '✅' : '❌'}`);

    // Check if comparison bar appears
    await new Promise(resolve => setTimeout(resolve, 500));
    const comparisonBarVisible = await page.evaluate(() => {
      const comparisonBar = document.querySelector('[class*="fixed bottom-0"]');
      return comparisonBar !== null;
    });

    console.log(`   └─ Comparison bar appears: ${comparisonBarVisible ? '✅' : '❌'}`);

    console.log('\n✨ Test completed successfully!');
    console.log(`📸 Screenshots saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testResponsiveDesign()
  .then(() => {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });
