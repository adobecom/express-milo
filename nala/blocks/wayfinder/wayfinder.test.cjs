import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.cjs';
import { features } from './wayfinder.spec.cjs';
import Wayfinder from './wayfinder.page.cjs';
import { runAccessibilityTest } from '../../libs/accessibility.cjs';

let webUtil;
let wayfinder;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express Wayfinder Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    wayfinder = new Wayfinder(page);
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
      await expect(wayfinder.defaultPText.nth(0)).toContainText(data.p1Text);
      await expect(wayfinder.defaultPText.nth(1)).toContainText(data.p2Text);
      await expect(wayfinder.defaultButton.nth(0)).toContainText(data.button1Text);
      await expect(wayfinder.defaultButton.nth(1)).toContainText(data.button2Text);
      await expect(wayfinder.defaultButton.nth(2)).toContainText(data.button3Text);
      await expect(wayfinder.defaultButton).toHaveCount(data.buttonCount);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(wayfinder.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(wayfinder.wayfinder).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('wayfinder', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: wayfinder.wayfinder });
    });

    await test.step('Validate button click', async () => {
      await wayfinder.defaultButton.nth(0).click();
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
      await expect(wayfinder.borderlessVariantButton.nth(0)).toContainText(data.button1Text);
      await expect(wayfinder.borderlessVariantButton.nth(1)).toContainText(data.button2Text);
      await expect(wayfinder.borderlessVariantButton).toHaveCount(data.buttonCount);
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
        await wayfinder.borderlessVariantButton.nth(0).click(),
      ]);
      expect(newTab.url).not.toBe(testPage);
      await newTab.close();
    });
  });

  // Test 2 : Wayfinder dark
  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const { data } = features[2];
    const testPage = `${baseURL}${features[2].path}${miloLibs}`;
    console.info(`[Test Page]: ${testPage}`);

    await test.step('Go to wayfinder dark test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testPage);
    });

    await test.step('Verify wayfinder dark block content/specs', async () => {
      await expect(wayfinder.variants.dark).toBeVisible();
      await expect(wayfinder.darkVariantPText.nth(0)).toContainText(data.p1Text);
      await expect(wayfinder.darkVariantPText.nth(1)).toContainText(data.p2Text);
      await expect(wayfinder.darkVariantButton.nth(0)).toContainText(data.button1Text);
      await expect(wayfinder.darkVariantButton.nth(1)).toContainText(data.button2Text);
      await expect(wayfinder.darkVariantButton.nth(2)).toContainText(data.button3Text);
      await expect(wayfinder.darkVariantButton).toHaveCount(data.buttonCount);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(wayfinder.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(wayfinder.variants.dark).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('wayfinder', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: wayfinder.variants.dark });
    });

    await test.step('Validate button click', async () => {
      await wayfinder.darkVariantButton.nth(0).click();
      await expect(page).not.toHaveURL(`${testPage}`);
    });
  });

  // Test 3 : Wayfinder gradient
  test(`[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    const { data } = features[3];
    const testPage = `${baseURL}${features[3].path}${miloLibs}`;
    console.info(`[Test Page]: ${testPage}`);

    await test.step('Go to wayfinder gradient test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testPage);
    });

    await test.step('Verify wayfinder gradient block content/specs', async () => {
      await expect(wayfinder.variants.gradient).toBeVisible();
      await expect(wayfinder.gradientVariantPText.nth(0)).toContainText(data.p1Text);
      await expect(wayfinder.gradientVariantPText.nth(1)).toContainText(data.p2Text);
      await expect(wayfinder.gradientVariantButton.nth(0)).toContainText(data.button1Text);
      await expect(wayfinder.gradientVariantButton.nth(1)).toContainText(data.button2Text);
      await expect(wayfinder.gradientVariantButton).toHaveCount(data.buttonCount);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(wayfinder.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(wayfinder.variants.gradient).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('wayfinder', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: wayfinder.variants.gradient });
    });

    await test.step('Validate button click', async () => {
      await wayfinder.gradientVariantButton.nth(0).click();
      await expect(page).not.toHaveURL(`${testPage}`);
    });
  });

  // Test 4 : Wayfinder light
  test(`[Test Id - ${features[4].tcid}] ${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    const { data } = features[4];
    const testPage = `${baseURL}${features[4].path}${miloLibs}`;
    console.info(`[Test Page]: ${testPage}`);

    await test.step('Go to wayfinder light test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testPage);
    });

    await test.step('Verify wayfinder light block content/specs', async () => {
      await expect(wayfinder.variants.light).toBeVisible();
      await expect(wayfinder.lightVariantPText.nth(0)).toContainText(data.p1Text);
      await expect(wayfinder.lightVariantPText.nth(1)).toContainText(data.p2Text);
      await expect(wayfinder.lightVariantButton.nth(0)).toContainText(data.button1Text);
      await expect(wayfinder.lightVariantButton.nth(1)).toContainText(data.button2Text);
      await expect(wayfinder.lightVariantButton).toHaveCount(data.buttonCount);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(wayfinder.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(wayfinder.variants.light).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('wayfinder', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: wayfinder.variants.light });
    });

    await test.step('Validate button click', async () => {
      await wayfinder.lightVariantButton.nth(0).click();
      await expect(page).not.toHaveURL(`${testPage}`);
    });
  });
});
