import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.cjs';
import { features } from './frictionless-qa-video.spec.cjs';
import FrictionlessQA from './frictionless-qa-video.page.cjs';
import { runAccessibilityTest } from '../../libs/accessibility.cjs';

let webUtil;
let frictionlessQA;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express Frictionless QA Video Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    frictionlessQA = new FrictionlessQA(page);
  });

  // Test 0 : Convert video to GIF
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to frictionless-qa-video(convert to GIF) block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify convert to GIF block content/specs', async () => {
      await expect(frictionlessQA.type.video_to_gif).toBeVisible();
      await expect(frictionlessQA.convertToGifHeading).toContainText(data.h1Text);
      await expect(frictionlessQA.convertToGifContent).toContainText(data.p1Text);
      await expect(frictionlessQA.convertToGifDropzoneText).toContainText(data.dropZoneText);
      await expect(frictionlessQA.convertToGifUploadButton).toContainText(data.buttonText);
      await expect(frictionlessQA.convertToGifTermsAndPolicy).toContainText(data.p2Text);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(frictionlessQA.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(frictionlessQA.frictionlessQaVideo).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('frictionless-quick-action', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: frictionlessQA.type.video_to_gif });
    });
  });

  // Test 1 : Resize video
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const { data } = features[1];
    const testUrl = `${baseURL}${features[1].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to frictionless-qa-video(resize video) block test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify resize video block content/specs', async () => {
      await expect(frictionlessQA.type.video_resize).toBeVisible();
      await expect(frictionlessQA.resizeVideoHeading).toContainText(data.h1Text);
      await expect(frictionlessQA.resizeVideoContent).toContainText(data.p1Text);
      await expect(frictionlessQA.resizeVideoDropzone).toContainText(data.dropZoneText);
      await expect(frictionlessQA.resizeVideoUploadButton).toContainText(data.buttonText);
      await expect(frictionlessQA.resizeVideoTermsAndPolicy).toContainText(data.p2Text);
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(frictionlessQA.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(frictionlessQA.frictionlessQaVideo).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('frictionless-quick-action', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: frictionlessQA.type.video_resize });
    });
  });
});
