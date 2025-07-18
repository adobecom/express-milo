import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.cjs';
import { features } from './floating-button.spec.cjs';
import FloatingButton from './floating-button.page.cjs';
import { runAccessibilityTest } from '../../libs/accessibility.cjs';

let webUtil;
let floatingButton;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express Floating Button Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    floatingButton = new FloatingButton(page);
  });

  // Test 0 : Floating Button
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to floating-button block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify floating-button block content/specs', async () => {
      await expect(floatingButton.floatingButton).toBeVisible();
      await expect(floatingButton.floatingButton).toContainText(data.buttonText);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(floatingButton.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(8));
      await expect(floatingButton.floatingButton).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('floating-button', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: floatingButton.floatingButton });
    });
  });
});
