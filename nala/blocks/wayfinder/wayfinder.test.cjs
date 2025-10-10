import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.cjs';
import { features } from './wayfinder.spec.cjs';
import IconList from './wayfinder.page.cjs';
import { runAccessibilityTest } from '../../libs/accessibility.cjs';

let webUtil;
let wayfinder;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express Wayfinder Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    wayfinder = new IconList(page);
  });

  // Test 0 : Wayfinder default
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    const testPage = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testPage}`);

    await test.step('Go to icon-list block test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testPage);
    });

    await test.step('Verify wayfinder default block content/specs', async () => {
      await expect(wayfinder.wayfinder).toBeVisible();
      await expect(wayfinder.defaultContent1).toContainText(data.p1Text);
      await expect(wayfinder.defaultContent2).toContainText(data.p2Text);
      await expect(wayfinder.defaultButton1).toContainText(data.button1Text);
      await expect(wayfinder.defaultButton2).toContainText(data.button2Text);
      await expect(wayfinder.defaultButton3).toContainText(data.button3Text);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(wayfinder.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(wayfinder.wayfinder).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('wayfinder', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: wayfinder.wayfinder });
    });

    await test.step('Validate button click', async () => {
      await wayfinder.defaultButton1.click();
      await expect(page).not.toHaveURL(`${testPage}`);
    });
  });

  // Test 1 : Wayfinder borderless
  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const { data } = features[1];
    const testPage = `${baseURL}${features[1].path}${miloLibs}`;
    console.info(`[Test Page]: ${testPage}`);

    await test.step('Go to wayfinder borderless test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testPage);
    });

    await test.step('Verify wayfinder borderless block content/specs', async () => {
      await expect(wayfinder.variants.borderless).toBeVisible();
      await expect(wayfinder.borderlessVariantContent).toContainText(data.content);
      await expect(wayfinder.borderlessVariantButton1).toContainText(data.button1Text);
      await expect(wayfinder.borderlessVariantButton2).toContainText(data.button2Text);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(wayfinder.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(wayfinder.variants.borderless).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('wayfinder', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: wayfinder.variants.borderless });
    });

    await test.step('Validate button click', async () => {
      await page.waitForLoadState('networkidle');
      const [newTab] = await Promise.all([
        page.waitForEvent('popup'),
        await wayfinder.borderlessVariantButton1.click(),
      ]);
      expect(newTab.url).not.toBe(testPage);
      await newTab.close();
    });
  });
});
