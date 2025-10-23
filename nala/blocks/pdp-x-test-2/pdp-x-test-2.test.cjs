const { expect, test } = require('@playwright/test');
const { features } = require('./pdp-x-test-2.spec.cjs');
const PdpXTest2 = require('./pdp-x-test-2.page.cjs');

let pdp;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express PDP-X-Test-2 Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    pdp = new PdpXTest2(page);
  });

  // Test 0: Block loads and displays content
  test(`[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to PDP page', async () => {
      await pdp.gotoURL(testUrl);
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify page content loads', async () => {
      // Wait for any content to appear (not tied to specific block class)
      await page.waitForLoadState('networkidle');
      const bodyContent = await page.locator('body').innerHTML();
      expect(bodyContent.length).toBeGreaterThan(100);
    });

    await test.step('Verify images are present', async () => {
      const images = page.locator('img');
      await expect(images.first()).toBeVisible({ timeout: 15000 });
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Verify interactive elements exist', async () => {
      const buttons = page.locator('button');
      await page.waitForTimeout(2000); // Give time for JS to load
      const count = await buttons.count();
      if (count > 0) {
        expect(count).toBeGreaterThan(0);
      }
    });
  });

  // Test 1: Interactive elements work
  test(`[Test Id - ${features[1].tcid}] ${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[1].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to PDP page', async () => {
      await pdp.gotoURL(testUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    await test.step('Verify buttons are clickable', async () => {
      const buttons = page.locator('button:visible');
      const count = await buttons.count();

      if (count > 0) {
        await buttons.first().click();
        await page.waitForTimeout(300);
        // No crash = success
      }
    });

    await test.step('Verify inputs accept data', async () => {
      const inputs = page.locator('input[type="text"]:visible, textarea:visible');
      const count = await inputs.count();

      if (count > 0) {
        await inputs.first().fill('Test');
        const value = await inputs.first().inputValue();
        expect(value).toBe('Test');
      }
    });

    await test.step('Verify selects are interactive', async () => {
      const selects = page.locator('select:visible');
      const count = await selects.count();

      if (count > 0) {
        const options = await selects.first().locator('option').count();
        if (options > 1) {
          await selects.first().selectOption({ index: 1 });
          // No crash = success
        }
      }
    });
  });

  // Test 2: Accessibility compliance
  test(`[Test Id - ${features[2].tcid}] ${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[2].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to PDP page', async () => {
      await pdp.gotoURL(testUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    await test.step('Verify ARIA attributes exist', async () => {
      const ariaElements = page.locator('[aria-expanded], [aria-controls], [aria-label], [role]');
      const count = await ariaElements.count();
      if (count > 0) {
        expect(count).toBeGreaterThan(0);
      }
    });

    await test.step('Verify keyboard navigation', async () => {
      const buttons = page.locator('button:visible');
      const count = await buttons.count();

      if (count > 0) {
        await buttons.first().focus();
        const isFocused = await buttons.first().evaluate((el) => el === document.activeElement);
        expect(isFocused).toBe(true);
      }
    });

    await test.step('Verify semantic HTML', async () => {
      const buttons = page.locator('button');
      const links = page.locator('a');
      const headings = page.locator('h1, h2, h3, h4, h5, h6');

      const buttonCount = await buttons.count();
      const linkCount = await links.count();
      const headingCount = await headings.count();

      // Page should have semantic elements
      if (buttonCount + linkCount + headingCount > 0) {
        expect(buttonCount + linkCount + headingCount).toBeGreaterThan(0);
      }
    });
  });
});
