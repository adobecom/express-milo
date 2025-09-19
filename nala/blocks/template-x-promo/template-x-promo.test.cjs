/* eslint-disable no-console */
import { test, expect } from '@playwright/test';
import { features } from './template-x-promo.spec.cjs';
import TemplateXPromo from './template-x-promo.page.cjs';

let templateXPromo;

test.describe('Template X Promo block tests', () => {
  test.beforeEach(async ({ page }) => {
    templateXPromo = new TemplateXPromo(page);
  });

  // TCID 0: Real API integration
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ baseURL }) => {
    console.info(`Testing: ${baseURL}${features[0].path}`);
    const testPage = `${baseURL}${features[0].path}`;

    await test.step('Navigate to test page', async () => {
      await templateXPromo.gotoURL(testPage);
    });

    await test.step('Verify block is loaded', async () => {
      await expect(templateXPromo.templateXPromo).toBeVisible();
      // Verify the block has been decorated
      await expect(templateXPromo.templateXPromo).toHaveAttribute('data-decorated', 'true');
    });

    await test.step('Verify templates are present', async () => {
      await templateXPromo.waitForTemplates();
      const templateCount = await templateXPromo.getTemplateCount();
      expect(templateCount).toBeGreaterThan(0);
    });

    await test.step('Verify carousel navigation works', async () => {
      const isCarousel = await templateXPromo.isCarouselVisible();
      if (isCarousel) {
        await expect(templateXPromo.navControls).toBeVisible();
        await templateXPromo.clickNext();
        await templateXPromo.clickPrev();
      }
    });
  });
});
