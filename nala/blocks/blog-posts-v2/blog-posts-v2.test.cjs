import { expect, test } from '@playwright/test';
import { features } from './blog-posts-v2.spec.cjs';
import BlogPostsV2 from './blog-posts-v2.page.cjs';

let blogPostsV2;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Blog Posts V2 block tests', () => {
  test.beforeEach(async ({ page }) => {
    blogPostsV2 = new BlogPostsV2(page);
  });

  // Test basic functionality - SKIPPED until test page is created
  test.skip(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to test page', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify block is loaded', async () => {
      await expect(blogPostsV2.blogPostsV2).toBeVisible();
    });

    await test.step('Verify blog cards are present', async () => {
      await blogPostsV2.waitForBlogCards();
      const cardCount = await blogPostsV2.getBlogCardCount();
      expect(cardCount).toBeGreaterThan(0);
    });
  });
});
