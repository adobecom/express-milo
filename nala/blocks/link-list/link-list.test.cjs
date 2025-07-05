import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.cjs';
import { features } from './link-list.spec.cjs';
import LinkList from './link-list.page.cjs';
import { runAccessibilityTest } from '../../libs/accessibility.cjs';

let webUtil;
let linkList;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express Link List Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    linkList = new LinkList(page);
  });

  // Test 0 : Link List centered
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to link-list block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify link-list.centered block content/specs', async () => {
      await expect(linkList.variants.centered).toBeVisible();
      await expect(linkList.centeredVariantHeading).toContainText(data.h3Text);
      await expect(linkList.centeredVariantButton1).toContainText(data.button1Text);
      await expect(linkList.centeredVariantButton2).toContainText(data.button2Text);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(linkList.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(linkList.variants.centered).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('link-list', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: linkList.variants.center });
    });
  });

    // Test 1 : Link List large
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const { data } = features[1];
    const testUrl = `${baseURL}${features[1].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to link-list block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify link-list.large block content/specs', async () => {
      await expect(linkList.variants.large).toBeVisible();
      await expect(linkList.largeVariantButton1).toContainText(data.button1Text);
      await expect(linkList.largeVariantButton2).toContainText(data.button2Text);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(linkList.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(linkList.variants.large).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('link-list', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: linkList.variants.large });
    });
  });

    // Test 2 : Link List shaded
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const { data } = features[2];
    const testUrl = `${baseURL}${features[2].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to link-list block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify link-list.shaded block content/specs', async () => {
      await expect(linkList.variants.shaded).toBeVisible();
      await expect(linkList.shadedVariantButton1).toContainText(data.button1Text);
      await expect(linkList.shadedVariantButton2).toContainText(data.button2Text);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(linkList.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(linkList.variants.shaded).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('link-list', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: linkList.variants.shaded });
    });
  });

    // Test 3 : Link List leftalign
  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    const { data } = features[3];
    const testUrl = `${baseURL}${features[3].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to link-list block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify link-list.leftalign block content/specs', async () => {
      await expect(linkList.variants.leftalign).toBeVisible();
      await expect(linkList.leftalignVariantHeading).toContainText(data.h3Text);
      await expect(linkList.leftalignVariantButton1).toContainText(data.button1Text);
      await expect(linkList.leftalignVariantButton2).toContainText(data.button2Text);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(linkList.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(linkList.variants.leftalign).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('link-list', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: linkList.variants.leftalign });
    });
  });
});