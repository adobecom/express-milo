import { expect, test } from '@playwright/test';
import { features } from './blog-posts-v2.spec.cjs';
import BlogPostsV2 from './blog-posts-v2.page.cjs';

let blogPostsV2;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Blog Posts V2 block tests', () => {
  test.beforeEach(async ({ page }) => {
    blogPostsV2 = new BlogPostsV2(page);
  });

  // Test basic functionality
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
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

    await test.step('Verify blog card structure', async () => {
      const hasRequiredElements = await blogPostsV2.verifyCardStructure();
      expect(hasRequiredElements).toBe(true);
    });
  });

  // Test date display functionality
  test('@blog-posts-v2 date display,@express @smoke @regression @blog-posts-v2', async ({ baseURL }) => {
    const testPage = `${baseURL}${features[0].path}`;

    await test.step('Navigate to test page', async () => {
      await blogPostsV2.gotoURL(testPage);
    });

    await test.step('Verify dates are displayed on cards', async () => {
      await blogPostsV2.waitForBlogCards();
      const datesVisible = await blogPostsV2.verifyDatesAreVisible();
      expect(datesVisible).toBe(true);
    });

    await test.step('Verify date formatting', async () => {
      const datesFormatted = await blogPostsV2.verifyDateFormatting();
      expect(datesFormatted).toBe(true);
    });

    await test.step('Verify date styling with CSS tokens', async () => {
      const dateStyles = await blogPostsV2.getDateStyles();

      // Verify color uses CSS token (computed value should match token)
      expect(dateStyles.color).toBeTruthy();

      // Verify font-size uses CSS token (14px)
      expect(dateStyles.fontSize).toBe('14px');

      // Verify line-height uses CSS token (130%)
      expect(dateStyles.lineHeight).toMatch(/1\.3|130%/);

      // Verify font-weight is 400
      expect(dateStyles.fontWeight).toBe('400');
    });
  });

  // Test responsive layout
  test('@blog-posts-v2 responsive layout,@express @smoke @regression @blog-posts-v2', async ({ baseURL }) => {
    const testPage = `${baseURL}${features[0].path}`;

    await test.step('Navigate to test page', async () => {
      await blogPostsV2.gotoURL(testPage);
    });

    await test.step('Test mobile layout', async () => {
      await blogPostsV2.setViewportSize(375, 667); // Mobile
      await blogPostsV2.waitForBlogCards();

      const layout = await blogPostsV2.getCardsLayout();
      expect(layout.direction).toBe('column'); // Mobile should stack vertically
    });

    await test.step('Test desktop layout', async () => {
      await blogPostsV2.setViewportSize(1024, 768); // Desktop
      await blogPostsV2.waitForBlogCards();

      const layout = await blogPostsV2.getCardsLayout();
      expect(layout.direction).toBe('row'); // Desktop should be horizontal
    });

    await test.step('Test tablet layout', async () => {
      await blogPostsV2.setViewportSize(768, 1024); // Tablet
      await blogPostsV2.waitForBlogCards();

      const layout = await blogPostsV2.getCardsLayout();
      expect(layout.direction).toBe('row'); // Tablet should be horizontal
    });
  });

  // Test card equal heights
  test('@blog-posts-v2 equal card heights,@express @smoke @regression @blog-posts-v2', async ({ baseURL }) => {
    const testPage = `${baseURL}${features[0].path}`;

    await test.step('Navigate to test page', async () => {
      await blogPostsV2.gotoURL(testPage);
    });

    await test.step('Verify cards have equal heights on desktop', async () => {
      await blogPostsV2.setViewportSize(1024, 768); // Desktop
      await blogPostsV2.waitForBlogCards();

      const cardCount = await blogPostsV2.getBlogCardCount();
      if (cardCount > 1) {
        const heightsEqual = await blogPostsV2.verifyEqualCardHeights();
        expect(heightsEqual).toBe(true);
      }
    });

    await test.step('Verify flex layout for equal heights', async () => {
      const containerStyles = await blogPostsV2.getCardsContainerStyles();
      expect(containerStyles.display).toBe('flex');
      expect(containerStyles.alignItems).toBe('stretch');
    });
  });

  // Test gray background
  test('@blog-posts-v2 section background,@express @smoke @regression @blog-posts-v2', async ({ baseURL }) => {
    const testPage = `${baseURL}${features[0].path}`;

    await test.step('Navigate to test page', async () => {
      await blogPostsV2.gotoURL(testPage);
    });

    await test.step('Verify full-width gray background', async () => {
      const sectionBg = await blogPostsV2.getSectionBackgroundStyles();

      // Should have gray background via ::before pseudo-element
      expect(sectionBg.hasGrayBackground).toBe(true);

      // Should extend full viewport width
      expect(sectionBg.isFullWidth).toBe(true);
    });
  });

  // Test card interactions
  test('@blog-posts-v2 card interactions,@express @smoke @regression @blog-posts-v2', async ({ baseURL }) => {
    const testPage = `${baseURL}${features[0].path}`;

    await test.step('Navigate to test page', async () => {
      await blogPostsV2.gotoURL(testPage);
    });

    await test.step('Verify card hover effects', async () => {
      await blogPostsV2.waitForBlogCards();

      const firstCard = await blogPostsV2.getFirstCard();
      await firstCard.hover();

      // Verify hover shadow effect
      const hoverStyles = await blogPostsV2.getCardHoverStyles(firstCard);
      expect(hoverStyles.boxShadow).toBeTruthy();
      expect(hoverStyles.boxShadow).not.toBe('none');
    });

    await test.step('Verify card click behavior', async () => {
      const firstCard = await blogPostsV2.getFirstCard();
      const href = await firstCard.getAttribute('href');

      // Cards should be clickable links
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/blog\//);
    });
  });

  // Test accessibility
  test('@blog-posts-v2 accessibility,@express @smoke @regression @blog-posts-v2', async ({ baseURL }) => {
    const testPage = `${baseURL}${features[0].path}`;

    await test.step('Navigate to test page', async () => {
      await blogPostsV2.gotoURL(testPage);
    });

    await test.step('Verify heading structure', async () => {
      const headingStructure = await blogPostsV2.verifyHeadingStructure();
      expect(headingStructure.hasH3Titles).toBe(true);
      expect(headingStructure.titlesCount).toBeGreaterThan(0);
    });

    await test.step('Verify image alt attributes', async () => {
      const imagesHaveAlt = await blogPostsV2.verifyImageAltAttributes();
      expect(imagesHaveAlt).toBe(true);
    });

    await test.step('Verify keyboard navigation', async () => {
      const firstCard = await blogPostsV2.getFirstCard();
      await firstCard.focus();

      // Should be focusable
      const isFocused = await firstCard.evaluate((el) => el === document.activeElement);
      expect(isFocused).toBe(true);
    });
  });
});
