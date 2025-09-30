import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.cjs';
import { features } from './prompt-marquee.spec.cjs';
import PromptMarquee from './prompt-marquee.page.cjs';
import { runAccessibilityTest } from '../../libs/accessibility.cjs';

let webUtil;
let promptMarquee;

const miloLibs = process.env.MILO_LIBS || '';

const encodeForPromptParam = (value) => encodeURIComponent(value).replace(/%20/g, '+');

test.describe('Express Prompt Marquee block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    promptMarquee = new PromptMarquee(page);
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;

    await test.step('Go to prompt marquee block test page', async () => {
      await page.addInitScript(() => {
        const originalAssign = window.location.assign;
        window.__nalaOriginalAssign = originalAssign;
        window.__nalaCapturedAssign = [];
        window.location.assign = (url) => {
          window.__nalaCapturedAssign.push(url);
        };
      });

      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify prompt marquee block content/specs', async () => {
      await expect(promptMarquee.block).toBeVisible();
      await expect(promptMarquee.heading.first()).toBeVisible();
      await expect(promptMarquee.heading.first()).toHaveText(/\S+/);

      const columnCount = await promptMarquee.columns.count();
      expect(columnCount).toBeGreaterThan(0);

      const placeholder = await promptMarquee.input.getAttribute('placeholder');
      expect(placeholder).toBe(data.placeholderText);

      const wrapperPlaceholder = await promptMarquee.inputWrapper.getAttribute('data-placeholder');
      expect(wrapperPlaceholder).toBe(data.placeholderText);

      await expect(promptMarquee.ctaContainer).toBeVisible();
      await expect(promptMarquee.ctaButton.first()).toBeVisible();
    });

    await test.step('Verify CTA click rewrites URL using prompt input', async () => {
      const baseHref = await promptMarquee.ctaButton.first().getAttribute('href');
      expect(baseHref).toBeTruthy();

      const expectedBaseUrl = await page.evaluate((href) => new URL(href, window.location.href).toString(), baseHref);

      await promptMarquee.input.fill(data.inputValue);
      await promptMarquee.ctaButton.first().click();

      let navUrls = await page.evaluate(() => window.__nalaCapturedAssign || []);
      expect(navUrls.length).toBeGreaterThan(0);
      const lastNavWithPrompt = navUrls[navUrls.length - 1];
      expect(lastNavWithPrompt).toContain(`${data.queryParam}=${encodeForPromptParam(data.inputValue)}`);

      await page.evaluate(() => { window.__nalaCapturedAssign = []; });
      await promptMarquee.input.fill('');
      await promptMarquee.ctaButton.first().click();

      navUrls = await page.evaluate(() => window.__nalaCapturedAssign || []);
      expect(navUrls.length).toBeGreaterThan(0);
      const lastNavWithoutPrompt = navUrls[navUrls.length - 1];
      expect(lastNavWithoutPrompt).toBe(expectedBaseUrl);

      await page.evaluate(() => {
        if (window.__nalaOriginalAssign) {
          window.location.assign = window.__nalaOriginalAssign;
          delete window.__nalaOriginalAssign;
        }
      });
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(promptMarquee.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(promptMarquee.block).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('prompt-marquee', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: promptMarquee.block });
    });
  });
});
