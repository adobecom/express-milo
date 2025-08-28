/* eslint-disable no-plusplus */
import { expect, test } from '@playwright/test';
import { features } from './ax-marquee.spec.cjs';
import AxMarquee from './ax-marquee.page.cjs';

let axMarquee;

test.describe('ax-marquee test suite', () => {
  test.beforeEach(async ({ page }) => {
    axMarquee = new AxMarquee(page);
  });

  features[0].path.forEach((path) => {
    test(`${features[0].name}, path: ${path}, test marquee short variant`, async ({ baseURL, page }) => {
      const testPage = `${baseURL}${path}`;
      await axMarquee.gotoURL(testPage);

      await test.step('validate elements in block', async () => {
        await page.waitForLoadState('domcontentloaded');
        await expect(axMarquee.axmarquee).toBeVisible();
        await expect(axMarquee.mainHeading).toBeVisible();
        const heading = await axMarquee.mainHeading.innerText();
        expect(heading.length).toBeTruthy();
        const paragraphCount = axMarquee.text.count();
        for (let i = 0; i < paragraphCount; i++) {
          await expect(axMarquee.text).nth(i).toBeVisible();
          const text = await axMarquee.text.nth(i).innerText();
          expect(text.length).toBeTruthy();
        }
        await expect(axMarquee.ctaButton).toBeVisible();
      });

      await test.step('test button click', async () => {
        await axMarquee.ctaButton.click();
        expect(page.url).not.toBe(testPage);
      });
    });
  });

  features[1].path.forEach((path) => {
    test(`${features[1].name}, path: ${path}, test marquee with animation`, async ({ baseURL, page, browserName }) => {
      const testPage = `${baseURL}${path}`;
      await axMarquee.gotoURL(testPage);
      await page.waitForSelector('.ax-marquee .marquee-foreground');

      await test.step('validate elements in block ', async () => {
        await page.waitForLoadState('domcontentloaded');
        await expect(axMarquee.axmarquee).toBeVisible();
        await expect(axMarquee.mainHeading).toBeVisible();
        const heading = await axMarquee.mainHeading.innerText();
        expect(heading.length).toBeTruthy();
        const paragraphCount = axMarquee.text.count();
        for (let i = 0; i < paragraphCount; i++) {
          await expect(axMarquee.text).nth(i).toBeVisible();
          const text = await axMarquee.text.nth(i).innerText();
          expect(text.length).toBeTruthy();
        }
        await expect(axMarquee.video).toBeVisible();
      });

      await test.step('validate elements in block ', async () => {
        // Animation not loading in Chrome for test script.
        if (browserName !== 'chromium') {
          await axMarquee.reduceMotionWrapper.waitFor(3000);
          await expect(axMarquee.reduceMotionPlayVideoBtn).not.toBeVisible();
          await expect(axMarquee.reduceMotionPauseVideoBtn).toBeVisible();
          await axMarquee.reduceMotionPauseVideoBtn.hover();
          await expect(axMarquee.reduceMotionPauseVideoTxt).toBeVisible();
          await axMarquee.reduceMotionPauseVideoBtn.click();
          await page.waitForLoadState();
          await expect(axMarquee.reduceMotionPlayVideoBtn).toBeVisible();
        }
      });
    });
  });
});
