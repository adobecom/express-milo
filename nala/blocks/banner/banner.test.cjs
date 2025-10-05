import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.cjs';
import { features } from './banner.spec.cjs';
import Banner from './banner.page.cjs';
import { runAccessibilityTest } from '../../libs/accessibility.cjs';

let webUtil;
let banner;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express Banner Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    banner = new Banner(page);
  });

  // Test 0 : Banner default
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to quotes block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify banner default block content/specs', async () => {
      await expect(banner.banner).toBeVisible();
      await expect(banner.defaultBannerHeading).toContainText(data.headingText);
      await expect(banner.defaultBannerButton).toContainText(data.buttonText);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(banner.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(banner.banner).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('banner', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: banner.banner });
    });
  });

  // Test 1 : Banner light
  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const { data } = features[1];
    const testUrl = `${baseURL}${features[1].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to banner light block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify banner light block content/specs', async () => {
      await expect(banner.variants.light).toBeVisible();
      await expect(banner.lightVariantHeading).toContainText(data.headingText);
      await expect(banner.lightVariantContent).toContainText(data.pText);
      await expect(banner.lightVariantButton).toContainText(data.buttonText);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(banner.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(banner.variants.light).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('banner', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: banner.variants.light });
    });
  });

  // Test 2 : Banner standout
  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const { data } = features[2];
    const testUrl = `${baseURL}${features[2].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to banner standout block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify banner standout block content/specs', async () => {
      await expect(banner.variants.standout).toBeVisible();
      await expect(banner.standoutVariantHeading).toContainText(data.headingText);
      await expect(banner.standoutVariantButton).toContainText(data.buttonText);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(banner.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(banner.variants.standout).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('banner', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: banner.variants.standout });
    });
  });

  // Test 3 : Banner cool
  test(`[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    const { data } = features[3];
    const testUrl = `${baseURL}${features[3].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to banner cool block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify banner cool block content/specs', async () => {
      await expect(banner.variants.cool).toBeVisible();
      await expect(banner.coolVariantHeading).toContainText(data.headingText);
      await expect(banner.coolVariantButton).toContainText(data.buttonText);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(banner.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(banner.variants.cool).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('banner', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: banner.variants.cool });
    });
  });
});
