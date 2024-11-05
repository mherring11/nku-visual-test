const { test, expect } = require('@playwright/test');
const fs = require('fs');
const resemble = require('resemblejs');

test.describe.serial('Visual Comparison of Two Sites', () => {

  // Test 1: Capture screenshots of both sites
  test('Capture screenshots of two sites', async ({ page }) => {
    test.setTimeout(30000);

    // Capture screenshot of the first site
    const firstUrl = 'https://live-risepoint-nku.pantheonsite.io/';
    await page.goto(firstUrl);
    console.log('Navigated to first site');
    await page.screenshot({ path: 'site1.png', fullPage: true });
    console.log('Captured screenshot of the first site');

    // Capture screenshot of the second site
    const secondUrl = 'https://onlinedegrees.nku.edu/';
    await page.goto(secondUrl);
    console.log('Navigated to second site');
    await page.screenshot({ path: 'site2.png', fullPage: true });
    console.log('Captured screenshot of the second site');

    console.log('Screenshots captured for both sites');
  });

  // Test 2: Compare the captured screenshots using resemblejs
  test('Compare screenshots of two sites', async () => {
    // Perform visual comparison using resemblejs
    const data = await new Promise((resolve) => {
      resemble('site1.png')
        .compareTo('site2.png')
        .ignoreColors() // Optional: ignore color differences if needed
        .onComplete((data) => {
          resolve(data);
        });
    });

    // Save the diff image for visual inspection
    fs.writeFileSync('diff.png', data.getBuffer());
    console.log('Saved diff image as diff.png');

    // Log and assert the mismatch percentage
    console.log(`Mismatch percentage: ${data.rawMisMatchPercentage}%`);
    expect(data.rawMisMatchPercentage).toBeLessThan(2); // Adjust the tolerance as needed

    console.log('Screenshots compared successfully with resemblejs');
  });
});
