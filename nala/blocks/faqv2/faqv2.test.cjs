const { expect, test } = require('@playwright/test');
const WebUtil = require('../../libs/webutil.cjs');
const { features } = require('./faqv2.spec.cjs');
const Faqv2 = require('./faqv2.page.cjs');
const { runAccessibilityTest } = require('../../libs/accessibility.cjs');

let webUtil;
let faqv2;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express FAQv2 Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    faqv2 = new Faqv2(page);
  });

  // Test 0: FAQv2 Default
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to FAQv2 default block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify FAQv2 default block content/specs', async () => {
      await expect(faqv2.variants.default).toBeVisible();
      await expect(faqv2.defaultAccordion.first()).toBeVisible();
      await expect(faqv2.defaultHeader.first()).toContainText(data.question1);
      await expect(faqv2.toggleButton).toBeVisible();
      await expect(faqv2.toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    await test.step('Verify toggle button functionality', async () => {
      await faqv2.toggleButton.click();
      await expect(faqv2.toggleButton).toHaveAttribute('aria-expanded', 'true');

      // Click again to collapse
      await faqv2.toggleButton.click();
      await expect(faqv2.toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(faqv2.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(faqv2.faqv2).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('faqv2', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: faqv2.faqv2 });
    });
  });

  // Test 1: FAQv2 Expandable
  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const { data } = features[1];
    const testUrl = `${baseURL}${features[1].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to FAQv2 expandable block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify FAQv2 expandable block content/specs', async () => {
      await expect(faqv2.variants.expandable).toBeVisible();
      await expect(faqv2.accordionTitle).toContainText(data.h2Text);
      await expect(faqv2.expandableWrapper.first()).toBeVisible();
      await expect(faqv2.expandableHeader.first()).toContainText(data.question1);
      await expect(faqv2.toggleIcon.first()).toBeVisible();
    });

    await test.step('Verify first accordion opens by default', async () => {
      const firstContent = faqv2.expandableContent.first();
      await expect(firstContent).toHaveClass(/open/);

      const firstIcon = faqv2.toggleIcon.first();
      const iconSrc = await firstIcon.getAttribute('src');
      expect(iconSrc).toContain('minus-heavy.svg');
    });

    await test.step('Verify accordion toggle functionality', async () => {
      const secondHeader = faqv2.expandableHeader.nth(1);
      const secondContent = faqv2.expandableContent.nth(1);
      const firstContent = faqv2.expandableContent.first();

      // Click second accordion
      await secondHeader.click();

      // Wait for animation
      await page.waitForTimeout(500);

      // Second should be open, first should be closed
      await expect(secondContent).toHaveClass(/open/);
      await expect(firstContent).not.toHaveClass(/open/);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(faqv2.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(faqv2.faqv2).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('faqv2', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: faqv2.faqv2 });
    });
  });

  // Test 2: FAQv2 Longform
  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const { data } = features[2];
    const testUrl = `${baseURL}${features[2].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to FAQv2 longform block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify FAQv2 longform block content/specs', async () => {
      await expect(faqv2.variants.longform).toBeVisible();
      await expect(faqv2.longformHeaderContainer).toBeVisible();
      await expect(faqv2.accordionTitle).toContainText(data.h2Text);
      await expect(faqv2.expandableWrapper.first()).toBeVisible();
    });

    await test.step('Verify longform accordion functionality', async () => {
      const firstContent = faqv2.expandableContent.first();
      await expect(firstContent).toHaveClass(/open/);

      // Click to close
      await faqv2.expandableHeader.first().click();
      await page.waitForTimeout(500);
      await expect(firstContent).not.toHaveClass(/open/);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(faqv2.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(faqv2.faqv2).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('faqv2', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: faqv2.faqv2 });
    });
  });
});
