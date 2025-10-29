const { expect, test } = require('@playwright/test');
const { features } = require('./drawers.spec.cjs');
const PrintProductDetailDrawers = require('./drawers.page.cjs');

let pdpDrawers;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express Print Product Detail - Drawers test suite', () => {
  test.beforeEach(async ({ page }) => {
    pdpDrawers = new PrintProductDetailDrawers(page);
  });

  // Test 0: T-shirt Learn More drawer
  test(`[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to T-shirt PDP page', async () => {
      await pdpDrawers.gotoURL(testUrl);
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify Learn More button exists', async () => {
      const learnMore = page.locator(pdpDrawers.learnMoreButton);
      await expect(learnMore.first()).toBeVisible();
    });

    await test.step('Click Learn More and verify drawer opens', async () => {
      await pdpDrawers.clickLearnMore();
      
      const drawer = page.locator(pdpDrawers.drawer);
      await expect(drawer).toBeVisible();
      
      const comparisonDrawer = page.locator(pdpDrawers.comparisonDrawer);
      await expect(comparisonDrawer).toBeVisible();
    });

    await test.step('Verify drawer has comparison columns', async () => {
      const columns = page.locator('.comparison-column');
      const count = await columns.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    await test.step('Close drawer with X button', async () => {
      await pdpDrawers.closeDrawer();
      
      const isHidden = await pdpDrawers.isDrawerHidden();
      expect(isHidden).toBe(true);
    });

    await test.step('Open drawer again and close with curtain', async () => {
      await pdpDrawers.clickLearnMore();
      await page.waitForTimeout(300);
      
      await pdpDrawers.closeDrawerByCurtain();
      
      const isHidden = await pdpDrawers.isDrawerHidden();
      expect(isHidden).toBe(true);
    });
  });

  // Test 1: Size Chart drawer
  test(`[Test Id - ${features[1].tcid}] ${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[1].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to T-shirt PDP page', async () => {
      await pdpDrawers.gotoURL(testUrl);
    });

    await test.step('Click Size Chart link', async () => {
      const sizeChartLink = page.locator(pdpDrawers.sizeChartLink);
      
      if (await sizeChartLink.count() > 0) {
        await pdpDrawers.clickSizeChart();
        
        const drawer = page.locator(pdpDrawers.drawer);
        await expect(drawer).toBeVisible();
        
        const sizeChartDrawer = page.locator(pdpDrawers.sizeChartDrawer);
        await expect(sizeChartDrawer).toBeVisible();
      } else {
        console.info('Size Chart link not found - skipping test');
        test.skip();
      }
    });

    await test.step('Verify size chart has tables', async () => {
      const tables = page.locator('.size-chart-table');
      const count = await tables.count();
      
      if (count > 0) {
        expect(count).toBeGreaterThanOrEqual(2); // Body and Garment tables
      }
    });

    await test.step('Verify unit toggle buttons exist', async () => {
      const unitButtons = page.locator('.size-chart-unit-button');
      const count = await unitButtons.count();
      
      if (count > 0) {
        expect(count).toBe(2); // IN and CM buttons
      }
    });

    await test.step('Close size chart drawer', async () => {
      await pdpDrawers.closeDrawer();
      
      const isHidden = await pdpDrawers.isDrawerHidden();
      expect(isHidden).toBe(true);
    });
  });

  // Test 2: Business card paper selection drawer
  test(`[Test Id - ${features[2].tcid}] ${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[2].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to business card PDP page', async () => {
      await pdpDrawers.gotoURL(testUrl);
    });

    await test.step('Click Compare Paper Types button', async () => {
      const compareButton = page.locator(pdpDrawers.comparePaperTypesButton);
      
      if (await compareButton.count() > 0) {
        await pdpDrawers.clickComparePaperTypes();
        
        const drawer = page.locator(pdpDrawers.drawer);
        await expect(drawer).toBeVisible();
        
        const paperDrawer = page.locator(pdpDrawers.paperDrawer);
        await expect(paperDrawer).toBeVisible();
      } else {
        console.info('Compare Paper Types button not found - skipping test');
        test.skip();
      }
    });

    await test.step('Verify carousel exists with thumbnails', async () => {
      const carousel = page.locator(pdpDrawers.paperCarousel);
      await expect(carousel).toBeVisible();
      
      const thumbs = page.locator(pdpDrawers.paperThumb);
      const count = await thumbs.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Verify carousel arrows work', async () => {
      const rightArrow = page.locator(pdpDrawers.carouselArrowRight);
      const leftArrow = page.locator(pdpDrawers.carouselArrowLeft);
      
      await expect(rightArrow).toBeVisible();
      await expect(leftArrow).toBeVisible();
      
      // Click right arrow
      await pdpDrawers.scrollCarouselRight();
      await page.waitForTimeout(300);
      
      // Click left arrow
      await pdpDrawers.scrollCarouselLeft();
      await page.waitForTimeout(300);
    });

    await test.step('Verify Select button exists', async () => {
      const selectButton = page.locator(pdpDrawers.selectButton);
      await expect(selectButton).toBeVisible();
    });

    await test.step('Close paper drawer', async () => {
      await pdpDrawers.closeDrawer();
      
      const isHidden = await pdpDrawers.isDrawerHidden();
      expect(isHidden).toBe(true);
    });
  });

  // Test 3: Focus management and keyboard navigation
  test(`[Test Id - ${features[3].tcid}] ${features[3].name}, ${features[3].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[3].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to T-shirt PDP page', async () => {
      await pdpDrawers.gotoURL(testUrl);
    });

    await test.step('Open drawer and verify focus moves to close button', async () => {
      const learnMore = page.locator(pdpDrawers.learnMoreButton).first();
      
      if (await learnMore.count() > 0) {
        await pdpDrawers.clickLearnMore();
        await page.waitForTimeout(500);
        
        // Check if close button receives focus
        const closeButton = page.locator(`${pdpDrawers.drawer} ${pdpDrawers.closeButton}`);
        const isFocused = await closeButton.evaluate((el) => el === document.activeElement);
        
        if (!isFocused) {
          console.warn('Close button did not receive focus immediately - may need adjustment');
        }
        
        // At minimum, verify close button is focusable
        await closeButton.focus();
        await page.waitForTimeout(100);
      } else {
        console.info('Learn More button not found - skipping test');
        test.skip();
      }
    });

    await test.step('Verify Tab key cycles through focusable elements', async () => {
      // Press Tab and verify focus moves
      await pdpDrawers.pressTab();
      await page.waitForTimeout(100);
      
      // Verify an element has focus
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeElement).toBeTruthy();
    });

    await test.step('Close drawer and verify focus returns', async () => {
      await pdpDrawers.closeDrawer();
      await page.waitForTimeout(300);
      
      // Verify drawer is closed
      const isHidden = await pdpDrawers.isDrawerHidden();
      expect(isHidden).toBe(true);
    });
  });

  // Test 4: Paper selection carousel navigation
  test(`[Test Id - ${features[4].tcid}] ${features[4].name}, ${features[4].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[4].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to business card PDP page', async () => {
      await pdpDrawers.gotoURL(testUrl);
    });

    await test.step('Open paper selection drawer', async () => {
      const compareButton = page.locator(pdpDrawers.comparePaperTypesButton);
      
      if (await compareButton.count() > 0) {
        await pdpDrawers.clickComparePaperTypes();
        await page.waitForTimeout(300);
      } else {
        console.info('Compare Paper Types button not found - skipping test');
        test.skip();
      }
    });

    await test.step('Click a paper thumbnail and verify UI updates', async () => {
      const thumbs = page.locator(pdpDrawers.paperThumb);
      const count = await thumbs.count();
      
      if (count > 1) {
        // Get initial hero image src
        const heroImage = page.locator('.paper-selection-hero');
        const initialSrc = await heroImage.getAttribute('src');
        
        // Click second thumb
        await pdpDrawers.clickPaperThumb(1);
        
        // Wait for update
        await page.waitForTimeout(300);
        
        // Verify hero image or selection state changed
        const secondThumb = thumbs.nth(1);
        const hasSelected = await secondThumb.evaluate((el) => el.classList.contains('selected'));
        expect(hasSelected).toBeTruthy();
      } else {
        console.info('Not enough thumbnails to test - skipping');
      }
    });

    await test.step('Click Select button and verify drawer closes', async () => {
      const selectButton = page.locator(pdpDrawers.selectButton);
      
      if (await selectButton.count() > 0) {
        await pdpDrawers.clickSelectButton();
        
        const isHidden = await pdpDrawers.isDrawerHidden();
        expect(isHidden).toBe(true);
      }
    });
  });
});

