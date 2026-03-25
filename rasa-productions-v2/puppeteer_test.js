const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('requestfailed', request => {
        console.log('FAILED:', request.url());
    });
    page.on('response', response => {
        if (!response.ok()) console.log('ERROR ' + response.status() + ':', response.url());
    });
    await page.goto('https://rasaproductions.rajarathnareddy.com/contact', { waitUntil: 'networkidle2' });

    // hovering over the link preloads the payload in Next.js
    await page.hover('a[href="/music"]');
    await new Promise(r => setTimeout(r, 2000));

    await browser.close();
})();
