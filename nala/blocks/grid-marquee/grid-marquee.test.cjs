/* eslint-disable no-plusplus */
import { expect, test } from '@playwright/test';
import { features } from './grid-marquee.spec.cjs';
import GridMarquee from './grid-marquee.page.cjs';

let gridMarquee;

test.describe('grid-marquee test suite', () => {
  test.beforeEach(async ({ page }) => {
    gridMarquee = new GridMarquee(page);
  });

  features[0].path.forEach((path) => {
    test(`[Test Id - ${features[0].tcid}] ${features[0].name}, path: ${path}, test logo and headline`, async ({ baseURL, page }) => {
      const testPage = `${baseURL}${path}`;
      console.log(testPage);
      await gridMarquee.gotoURL(testPage);
      await page.waitForSelector('.global-footer');

      await test.step('validate elements in block', async () => {
        await expect(gridMarquee.expressLogo).toBeVisible();
        await expect(gridMarquee.heading).toBeVisible();
        const heading = await gridMarquee.heading.innerText();
        expect(heading.length).toBeTruthy();
        const paragraphCount = gridMarquee.headlineText.count();
        for (let i = 0; i < paragraphCount; i++) {
          await expect(gridMarquee.headlineText).nth(i).toBeVisible();
          const text = await gridMarquee.headlineText.nth(i).innerText();
          expect(text.length).toBeTruthy();
        }
        await expect(gridMarquee.ctas).toBeVisible();
        await expect(gridMarquee.ctaButton.nth(0)).toBeVisible();
        await expect(gridMarquee.ctaButton.nth(1)).toBeVisible();
      });

      await test.step('ensure only one h1 on page', async () => {
        const allH1s = page.locator('h1');
        const count = await allH1s.count();
        expect(count).toBeLessThan(2);
      });

      await test.step('test cta button clicks', async () => {
        await gridMarquee.ctaButton.nth(0).click();
        expect(page.url).not.toBe(testPage);
        await gridMarquee.gotoURL(testPage);
        await gridMarquee.ctaButton.nth(1).click();
        expect(page.url).not.toBe(testPage);
      });
    });
  });

  features[1].path.forEach((path) => {
    test(`[Test Id - ${features[1].tcid}] ${features[1].name}, path: ${path}, test cards`, async ({ baseURL, page }) => {
      const testPage = `${baseURL}${path}`;
      await gridMarquee.gotoURL(testPage);
      await page.waitForSelector('.global-footer');

      let cardCount;
      await test.step('validate elements in block ', async () => {
        await expect(gridMarquee.cardsContainer).toBeVisible();
        cardCount = await gridMarquee.card.count();
        expect(cardCount).not.toEqual(0);
      });

      await test.step('validate image click ', async () => {
        await gridMarquee.cardImage.nth(0).hover();
        await gridMarquee.cardImage.nth(0).click();
        expect(page.url).not.toBe(testPage);
        await gridMarquee.gotoURL(testPage);
      });

      await test.step('validate drawer operations ', async () => {
        if (cardCount) {
          await expect(gridMarquee.cardImage.nth(0)).toBeVisible();
          await gridMarquee.cardImage.nth(0).hover();
          await expect(gridMarquee.cardDrawer.nth(0)).toBeVisible();
        }

        await gridMarquee.cardImage.nth(0).hover();
        await gridMarquee.cardDrawerLink.nth(0).click();
        expect(page.url).not.toBe(testPage);
        await gridMarquee.gotoURL(testPage);
      });
    });
  });

  features[2].path.forEach((path) => {
    test(`[Test Id - ${features[2].tcid}] ${features[2].name}, path: ${path}, test ratings block`, async ({ baseURL, page }) => {
      const testPage = `${baseURL}${path}`;
      await gridMarquee.gotoURL(testPage);
      await page.waitForSelector('.global-footer');
      await test.step('validate elements in block ', async () => {
        expect(await gridMarquee.ratings).toBeVisible();
        expect(await gridMarquee.appStoreButton).toBeVisible();
        expect(await gridMarquee.googlePlayButton).toBeVisible();
        const appStoreRating = await gridMarquee.appStoreButton.innerText();
        const googlePlayRating = await gridMarquee.googlePlayButton.innerText();
        expect(appStoreRating).toBeTruthy();
        expect(googlePlayRating).toBeTruthy();
      });

      await test.step('validate button click ', async () => {
        await gridMarquee.appStoreButton.click();
        expect(page.url).not.toBe(testPage);
        await gridMarquee.gotoURL(testPage);
        await gridMarquee.googlePlayButton.click();
        expect(page.url).not.toBe(testPage);
      });
    });
  });

  features[3].path.forEach((path) => {
    test(`[Test Id - ${features[3].tcid}] ${features[3].name}, path: ${path}, test z-index fix`, async ({ baseURL, page }) => {
      const testPage = `${baseURL}${path}`;
      await gridMarquee.gotoURL(testPage);
      await page.waitForSelector('.global-footer');

      await test.step('validate z-index values for drawer elements', async () => {
        // First, hover over a card to make the drawer visible
        await gridMarquee.cardImage.nth(0).hover();

        // Wait for drawer to be visible
        await expect(gridMarquee.cardDrawer.nth(0)).toBeVisible();

        // Get the title row and video elements
        const titleRow = gridMarquee.cardDrawer.nth(0).locator('.title-row');
        const video = gridMarquee.cardDrawer.nth(0).locator('video');

        // Check if elements exist
        if (await titleRow.count() > 0 && await video.count() > 0) {
          // Get computed styles
          const titleRowZIndex = await titleRow.evaluate((el) => window.getComputedStyle(el).zIndex);
          const videoZIndex = await video.evaluate((el) => window.getComputedStyle(el).zIndex);

          // Verify z-index values
          expect(titleRowZIndex).toBe('2');
          // Video z-index should be 0, but if CSS isn't loaded, it might be 'auto'
          expect(videoZIndex).toMatch(/^(0|auto)$/);
        }
      });

      await test.step('validate z-index hierarchy across all drawers', async () => {
        const cardCount = await gridMarquee.card.count();

        for (let i = 0; i < cardCount; i++) {
          // Hover over each card to make its drawer visible
          await gridMarquee.cardImage.nth(i).hover();

          const titleRow = gridMarquee.cardDrawer.nth(i).locator('.title-row');
          const video = gridMarquee.cardDrawer.nth(i).locator('video');

          if (await titleRow.count() > 0 && await video.count() > 0) {
            const titleRowZIndex = await titleRow.evaluate((el) => window.getComputedStyle(el).zIndex);
            const videoZIndex = await video.evaluate((el) => window.getComputedStyle(el).zIndex);

            // Verify z-index values
            expect(titleRowZIndex).toBe('2');
            expect(videoZIndex).toBe('0');
          }
        }
      });
    });
  });
});
