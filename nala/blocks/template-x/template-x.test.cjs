/* eslint-disable no-console */
import { test, expect } from '@playwright/test';
import { features } from './template-x.spec.cjs';
import TemplateX from './template-x.page.cjs';

let templateX;

test.describe('Template X block tests', () => {
  test.beforeEach(async ({ page }) => {
    templateX = new TemplateX(page);
  });

  // TCID 0: Basic display and API integration
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ baseURL }) => {
    console.info(`Testing: ${baseURL}${features[0].path}`);
    const testPage = `${baseURL}${features[0].path}`;

    await test.step('Navigate to test page', async () => {
      await templateX.gotoURL(testPage);
      await templateX.page.waitForLoadState('networkidle');
      await templateX.page.waitForTimeout(3000);
    });

    await test.step('Verify block is loaded', async () => {
      await expect(templateX.block).toBeVisible();
      console.log('✅ Template-x block visible');
    });

    await test.step('Verify API integration and templates', async () => {
      const count = await templateX.getTemplateCount();
      console.log(`Found ${count} templates`);
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Verify toolbar elements', async () => {
      if (await templateX.toolbar.isVisible()) {
        console.log('✅ Toolbar visible');
      }
    });
  });

  // TCID 1: Search functionality
  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ baseURL }) => {
    console.info(`Testing: ${baseURL}${features[1].path}`);
    const testPage = `${baseURL}${features[1].path}`;

    await test.step('Navigate and load', async () => {
      await templateX.gotoURL(testPage);
      await templateX.page.waitForLoadState('networkidle');
      await templateX.page.waitForTimeout(3000);
    });

    await test.step('Test search input', async () => {
      if (await templateX.searchInput.isVisible()) {
        const initialCount = await templateX.getTemplateCount();
        await templateX.searchTemplates('logo');
        await templateX.page.waitForTimeout(2000);
        const afterSearchCount = await templateX.getTemplateCount();
        console.log(`Templates before: ${initialCount}, after search: ${afterSearchCount}`);
      }
    });

    await test.step('Test search clear', async () => {
      if (await templateX.searchInput.isVisible()) {
        await templateX.searchInput.clear();
        await templateX.page.keyboard.press('Enter');
        await templateX.page.waitForTimeout(2000);
        console.log('✅ Search cleared');
      }
    });
  });

  // TCID 2: Filter and sort
  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ baseURL }) => {
    console.info(`Testing: ${baseURL}${features[2].path}`);
    const testPage = `${baseURL}${features[2].path}`;

    await test.step('Navigate and load', async () => {
      await templateX.gotoURL(testPage);
      await templateX.page.waitForLoadState('networkidle');
      await templateX.page.waitForTimeout(3000);
    });

    await test.step('Test filter buttons', async () => {
      const filterCount = await templateX.filterButtons.count();
      console.log(`Found ${filterCount} filter buttons`);

      if (filterCount > 0) {
        const firstFilter = templateX.filterButtons.first();
        await firstFilter.click();
        await templateX.page.waitForTimeout(1000);
        console.log('✅ Filter clicked');
      }
    });

    await test.step('Test sort dropdown', async () => {
      if (await templateX.sortDropdown.isVisible()) {
        await templateX.sortDropdown.click();
        await templateX.page.waitForTimeout(500);
        console.log('✅ Sort dropdown opened');

        await templateX.page.keyboard.press('Escape');
      }
    });
  });

  // TCID 3: View toggle and masonry
  test(`[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`, async ({ baseURL }) => {
    console.info(`Testing: ${baseURL}${features[3].path}`);
    const testPage = `${baseURL}${features[3].path}`;

    await test.step('Navigate and load', async () => {
      await templateX.gotoURL(testPage);
      await templateX.page.waitForLoadState('networkidle');
      await templateX.page.waitForTimeout(3000);
    });

    await test.step('Test view toggle', async () => {
      if (await templateX.viewToggle.isVisible()) {
        const viewButtons = await templateX.viewToggle.locator('button').count();
        console.log(`Found ${viewButtons} view toggle buttons`);

        if (viewButtons > 0) {
          const firstView = templateX.viewToggle.locator('button').first();
          await firstView.click();
          await templateX.page.waitForTimeout(1000);
          console.log('✅ View toggled');
        }
      }
    });

    await test.step('Test masonry layout', async () => {
      const isMasonry = await templateX.isMasonryLayout();
      console.log(`Masonry layout: ${isMasonry}`);

      if (isMasonry) {
        await templateX.page.setViewportSize({ width: 1440, height: 900 });
        await templateX.page.waitForTimeout(1000);
        console.log('✅ Masonry responsive tested');
      }
    });
  });

  // TCID 4: Load more pagination
  test(`[Test Id - ${features[4].tcid}] ${features[4].name},${features[4].tags}`, async ({ baseURL }) => {
    console.info(`Testing: ${baseURL}${features[4].path}`);
    const testPage = `${baseURL}${features[4].path}`;

    await test.step('Navigate and load', async () => {
      await templateX.gotoURL(testPage);
      await templateX.page.waitForLoadState('networkidle');
      await templateX.page.waitForTimeout(3000);
    });

    await test.step('Test load more button', async () => {
      const initialCount = await templateX.getTemplateCount();
      console.log(`Initial templates: ${initialCount}`);

      if (await templateX.loadMoreButton.isVisible()) {
        await templateX.loadMore();
        await templateX.page.waitForTimeout(2000);

        const afterLoadCount = await templateX.getTemplateCount();
        console.log(`After load more: ${afterLoadCount}`);
        expect(afterLoadCount).toBeGreaterThanOrEqual(initialCount);
      }
    });

    await test.step('Test infinite scroll', async () => {
      await templateX.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await templateX.page.waitForTimeout(2000);
      console.log('✅ Scrolled to bottom');
    });
  });
});
