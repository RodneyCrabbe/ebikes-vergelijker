const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();

    const consoleMessages = [];
    const failedRequests = [];
    const networkRequests = [];

    page.on('console', msg => {
        consoleMessages.push(`CONSOLE ${msg.type().toUpperCase()}: ${msg.text()}`);
        console.log(`CONSOLE ${msg.type().toUpperCase()}: ${msg.text()}`);
    });

    page.on('requestfailed', request => {
        const failure = request.failure();
        failedRequests.push(`FAILED REQUEST: ${request.url()} - ${failure ? failure.errorText : 'Unknown error'}`);
        console.log(`FAILED REQUEST: ${request.url()} - ${failure ? failure.errorText : 'Unknown error'}`);
    });

    page.on('response', async response => {
        const request = response.request();
        const status = response.status();
        const url = response.url();
        
        networkRequests.push(`RESPONSE: ${status} - ${url}`);
        
        if (!response.ok() && request.resourceType() === 'image') {
            failedRequests.push(`FAILED IMAGE LOAD (HTTP ${status}): ${url}`);
            console.log(`FAILED IMAGE LOAD (HTTP ${status}): ${url}`);
        }
    });

    const baseUrl = 'http://127.0.0.1:5173';
    
    console.log('Testing server availability...');
    try {
        await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
        console.log('✅ Server is responding');
    } catch (error) {
        console.log('❌ Server not responding:', error.message);
        await browser.close();
        return;
    }

    // Test the e-bike list page
    const ebikeListPage = `${baseUrl}/e-bikes`;
    console.log(`\nNavigating to ${ebikeListPage}`);
    try {
        await page.goto(ebikeListPage, { waitUntil: 'networkidle2', timeout: 15000 });
        await page.screenshot({ path: 'ebike_list_page.png', fullPage: true });
        console.log('✅ Screenshot of e-bike list page saved to ebike_list_page.png');
    } catch (error) {
        console.log('❌ Failed to load e-bike list page:', error.message);
    }

    // Test the e-bike detail page
    const ebikeDetailPage = `${baseUrl}/e-bikes/1`;
    console.log(`\nNavigating to ${ebikeDetailPage}`);
    try {
        await page.goto(ebikeDetailPage, { waitUntil: 'networkidle2', timeout: 15000 });
        await page.screenshot({ path: 'ebike_detail_page.png', fullPage: true });
        console.log('✅ Screenshot of e-bike detail page saved to ebike_detail_page.png');
    } catch (error) {
        console.log('❌ Failed to load e-bike detail page:', error.message);
    }

    // Test image loading directly
    console.log('\nTesting image loading...');
    const imageUrls = [
        '/img/Gazelle Ultimate C380 HMB/20230372A00_Gazelle_Ultimate_C380_HMB_500Wh.avif',
        '/img/Cannondale Tesoro Neo X 3/2455dd8c-f753-4fec-99a7-0e5b83f3f0a8.avif',
        '/img/Giant Explore E+ 1/MY23ExploreEplus1DD_ColorAMistyForest.jpg'
    ];

    for (const imageUrl of imageUrls) {
        const fullUrl = `${baseUrl}${imageUrl}`;
        console.log(`Testing image: ${fullUrl}`);
        try {
            const response = await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 5000 });
            if (response && response.ok()) {
                console.log(`✅ Image loaded successfully: ${imageUrl}`);
            } else {
                console.log(`❌ Image failed to load: ${imageUrl} (Status: ${response ? response.status() : 'No response'})`);
            }
        } catch (error) {
            console.log(`❌ Image failed to load: ${imageUrl} - ${error.message}`);
        }
    }

    console.log('\n--- Console Messages ---');
    consoleMessages.forEach(msg => console.log(msg));

    console.log('\n--- Failed Network Requests ---');
    failedRequests.forEach(req => console.log(req));

    console.log('\n--- All Network Requests ---');
    networkRequests.forEach(req => console.log(req));

    // Write logs to a file for easier review
    fs.writeFileSync('puppeteer_logs.txt', [
        '--- Console Messages ---',
        ...consoleMessages,
        '\n--- Failed Network Requests ---',
        ...failedRequests,
        '\n--- All Network Requests ---',
        ...networkRequests
    ].join('\n'));
    console.log('\n✅ Detailed logs saved to puppeteer_logs.txt');

    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will stay open for manual inspection. Press Ctrl+C to close.');
    
    // Wait for user input
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', async () => {
        await browser.close();
        process.exit(0);
    });

})().catch(err => {
    console.error('Puppeteer script failed:', err);
    process.exit(1);
});
