import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.cjs';
import { runAccessibilityTest } from '../../libs/accessibility.cjs';
import { features } from './pricing-footer.spec.cjs';
import PricingFooter from './pricing-footer.page.cjs';

let pricingFooter;
let webUtil;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express pricing-footer block test suite', () => {
  test.beforeEach(async ({ page }) => {
    pricingFooter = new PricingFooter(page);
    webUtil = new WebUtil(page);
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testPage}`);

    await test.step('Go to pricing footer block test page', async () => {
      await pricingFooter.gotoURL(testPage);
      await expect(page).toHaveURL(testPage);
      await pricingFooter.scrollToBlock();
    });

    await test.step('Verify pricing footer structure', async () => {
      await expect(pricingFooter.block).toBeVisible();
      await expect(pricingFooter.block).toHaveClass(/pricing-footer/);
      await expect(pricingFooter.block).toHaveClass(/ax-grid-container/);
      await expect(pricingFooter.block).toHaveClass(/small-gap/);
      const columnCount = await pricingFooter.columns.count();
      expect(columnCount).toBeGreaterThan(0);
      expect(await pricingFooter.countEmptyColumns()).toBe(0);
    });

    await test.step('Verify card count matches merch cards', async () => {
      const merchCardCount = await pricingFooter.getMerchCardCount();
      expect(merchCardCount).toBeGreaterThan(0);
      await expect.poll(async () => pricingFooter.getCardCount()).toBeGreaterThan(0);
      const cardCount = await pricingFooter.getCardCount();
      expect(cardCount).toBe(merchCardCount);
    });

    await test.step('Verify max-width is applied', async () => {
      await expect.poll(async () => pricingFooter.getComputedMaxWidth()).not.toMatch(/^(none|0px)$/);
      const maxWidth = await pricingFooter.getComputedMaxWidth();
      expect(Number.parseFloat(maxWidth)).toBeGreaterThan(0);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(pricingFooter.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(pricingFooter.block).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('pricing-footer', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: pricingFooter.block });
    });
  });
});
