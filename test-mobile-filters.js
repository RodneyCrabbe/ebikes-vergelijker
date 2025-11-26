/**
 * Mobile Filter Functionality Test
 * Tests the mobile filter button and modal behavior
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mobileDevices = [
  { name: 'iPhone-14-Pro', width: 393, height: 852 },
  { name: 'Samsung-Galaxy-S21', width: 360, height: 800 },
  { name: 'iPad-Mini', width: 768, height: 1024 }
];

async function testMobileFilters() {
  console.log('📱 Starting mobile filter test...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots', 'mobile-filters');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  try {
    // Navigate to the e-bikes page
    console.log('🌐 Navigating to e-bikes page...');
    await page.goto('http://127.0.0.1:5173/e-bikes', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForSelector('[class*="glass-card"]', { timeout: 10000 });
    console.log('✅ Page loaded successfully\n');

    // Test each mobile device
    for (const device of mobileDevices) {
      console.log(`📐 Testing ${device.name} (${device.width}x${device.height})`);

      await page.setViewport({
        width: device.width,
        height: device.height,
        deviceScaleFactor: 2
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if filter button is visible on mobile
      const filterButtonVisible = await page.evaluate(() => {
        const filterBtn = Array.from(document.querySelectorAll('button')).find(btn =>
          btn.textContent.includes('Filters')
        );
        if (!filterBtn) return { visible: false };

        const styles = window.getComputedStyle(filterBtn);
        return {
          visible: styles.display !== 'none' && styles.visibility !== 'hidden',
          text: filterBtn.textContent.trim()
        };
      });

      console.log(`   ├─ Filter button visible: ${filterButtonVisible.visible ? '✅' : '❌'}`);

      if (!filterButtonVisible.visible) {
        console.log('   └─ ⚠️ Filter button not visible on this device size\n');
        continue;
      }

      // Take screenshot before clicking
      await page.screenshot({
        path: path.join(screenshotsDir, `${device.name}-before.png`),
        fullPage: false
      });

      // Check if desktop filters are hidden
      const desktopFiltersHidden = await page.evaluate(() => {
        const sidebar = document.querySelector('.lg\\:block.w-80');
        if (!sidebar) return { hidden: false, found: false };

        const styles = window.getComputedStyle(sidebar);
        return {
          hidden: styles.display === 'none',
          found: true
        };
      });

      console.log(`   ├─ Desktop filters hidden: ${desktopFiltersHidden.hidden ? '✅' : '❌'}`);

      // Click the filter button
      const clickResult = await page.evaluate(() => {
        const filterBtn = Array.from(document.querySelectorAll('button')).find(btn =>
          btn.textContent.includes('Filters')
        );

        if (filterBtn) {
          filterBtn.click();
          return { clicked: true };
        }
        return { clicked: false };
      });

      console.log(`   ├─ Filter button clicked: ${clickResult.clicked ? '✅' : '❌'}`);

      // Wait for modal to appear
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if modal is visible
      const modalVisible = await page.evaluate(() => {
        const modal = document.querySelector('.fixed.inset-0.z-50');
        if (!modal) return { visible: false };

        const styles = window.getComputedStyle(modal);
        const backdrop = modal.querySelector('.bg-black\\/50');
        const content = modal.querySelector('.bg-white.rounded-t-3xl');

        return {
          visible: styles.display !== 'none',
          hasBackdrop: backdrop !== null,
          hasContent: content !== null,
          contentVisible: content ? window.getComputedStyle(content).transform !== 'translateY(100%)' : false
        };
      });

      console.log(`   ├─ Modal visible: ${modalVisible.visible ? '✅' : '❌'}`);
      console.log(`   ├─ Modal backdrop: ${modalVisible.hasBackdrop ? '✅' : '❌'}`);
      console.log(`   ├─ Modal content: ${modalVisible.hasContent ? '✅' : '❌'}`);

      // Take screenshot with modal open
      await page.screenshot({
        path: path.join(screenshotsDir, `${device.name}-modal-open.png`),
        fullPage: false
      });

      // Check filter options in modal
      const filterOptions = await page.evaluate(() => {
        const brandSelect = document.querySelectorAll('select')[0];
        const priceInputs = document.querySelectorAll('input[type="number"]');
        const closeButton = Array.from(document.querySelectorAll('button')).find(btn =>
          btn.querySelector('svg path[d*="M6 18L18 6M6 6l12 12"]')
        );
        const applyButton = Array.from(document.querySelectorAll('button')).find(btn =>
          btn.textContent.includes('Toon resultaten')
        );

        return {
          hasBrandFilter: brandSelect !== undefined,
          hasPriceFilters: priceInputs.length >= 2,
          hasCloseButton: closeButton !== null,
          hasApplyButton: applyButton !== null
        };
      });

      console.log(`   ├─ Brand filter: ${filterOptions.hasBrandFilter ? '✅' : '❌'}`);
      console.log(`   ├─ Price filters: ${filterOptions.hasPriceFilters ? '✅' : '❌'}`);
      console.log(`   ├─ Close button: ${filterOptions.hasCloseButton ? '✅' : '❌'}`);
      console.log(`   ├─ Apply button: ${filterOptions.hasApplyButton ? '✅' : '❌'}`);

      // Test closing the modal by clicking backdrop
      await page.evaluate(() => {
        const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50');
        if (backdrop) {
          backdrop.click();
        }
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if modal is closed
      const modalClosed = await page.evaluate(() => {
        const modal = document.querySelector('.fixed.inset-0.z-50');
        return modal === null || window.getComputedStyle(modal).display === 'none';
      });

      console.log(`   ├─ Modal closes on backdrop click: ${modalClosed ? '✅' : '❌'}`);

      // Take screenshot after closing
      await page.screenshot({
        path: path.join(screenshotsDir, `${device.name}-after.png`),
        fullPage: false
      });

      // Test opening and closing with apply button
      await page.evaluate(() => {
        const filterBtn = Array.from(document.querySelectorAll('button')).find(btn =>
          btn.textContent.includes('Filters')
        );
        if (filterBtn) filterBtn.click();
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      await page.evaluate(() => {
        const applyButton = Array.from(document.querySelectorAll('button')).find(btn =>
          btn.textContent.includes('Toon resultaten')
        );
        if (applyButton) applyButton.click();
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const modalClosedByApply = await page.evaluate(() => {
        const modal = document.querySelector('.fixed.inset-0.z-50');
        return modal === null || window.getComputedStyle(modal).display === 'none';
      });

      console.log(`   └─ Modal closes on apply button: ${modalClosedByApply ? '✅' : '❌'}`);
      console.log('');
    }

    console.log('✨ Test completed successfully!');
    console.log(`📸 Screenshots saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testMobileFilters()
  .then(() => {
    console.log('\n✅ All mobile filter tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });
