/* eslint-disable no-plusplus */
import { expect, test } from '@playwright/test';
import { features } from './template-x.spec.cjs';
import TemplateX from './template-x.page.cjs';

let templateX;

test.describe('template-x Block Test Suite', () => {
  // before each test block
  test.beforeEach(async ({ page }) => {
    templateX = new TemplateX(page);
  });

  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`${baseURL}${features[0].path}`);
    await test.step('Go to block test page', async () => {
      await page.goto(`${baseURL}${features[0].path}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}`);
      // await page.waitForTimeout(3000);
    });

    await test.step('Verify search icon is displayed ', async () => {
      await page.waitForLoadState();
      await templateX.searchBarWrapper.scrollIntoViewIfNeeded();
      await expect(templateX.searchBarWrapper).toBeVisible();
    });
  });
});
