import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.cjs';
import { features } from './long-text-v2.spec.cjs';
import LongTextV2 from './long-text-v2.page.cjs';
import { runAccessibilityTest } from '../../libs/accessibility.cjs';

let webUtil;
let longTextV2;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express Long Text V2 Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    longTextV2 = new LongTextV2(page);
  });

  // Test 0: Basic content structure
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to long-text-v2 block test page', async () => {
      await longTextV2.gotoURL(testUrl);
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify long-text-v2 block content/specs', async () => {
      await longTextV2.waitForContent();
      await expect(longTextV2.longTextV2).toBeVisible();
      
      // Verify semantic structure
      const structure = await longTextV2.getContentStructure();
      expect(structure.hasSemanticStructure).toBe(true);
      expect(structure.h2Count).toBeGreaterThanOrEqual(data.h2Count);
      expect(structure.pCount).toBeGreaterThanOrEqual(data.pCount);
      
      // Verify articles contain h2 and p elements
      for (let i = 0; i < structure.articleCount; i += 1) {
        const article = structure.articles[i];
        expect(article.hasH2).toBe(true);
        expect(article.hasP).toBe(true);
        expect(article.h2Text).toBeTruthy();
        expect(article.pText).toBeTruthy();
      }
    });

    await test.step('Verify design tokens are applied', async () => {
      const tokens = await longTextV2.getDesignTokens();
      
      // Verify h2 styling
      expect(tokens.h2Color).toBeTruthy();
      expect(tokens.h2FontSize).toBeTruthy();
      expect(tokens.h2FontWeight).toBeTruthy();
      expect(tokens.h2LineHeight).toBeTruthy();
      
      // Verify paragraph styling
      expect(tokens.pColor).toBeTruthy();
      expect(tokens.pFontSize).toBeTruthy();
      expect(tokens.pFontWeight).toBeTruthy();
      expect(tokens.pLineHeight).toBeTruthy();
    });

    await test.step('Verify analytics attributes', async () => {
      await expect(longTextV2.section).toHaveAttribute('daa-lh', await webUtil.getSectionDaalh(1));
      await expect(longTextV2.longTextV2).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('long-text-v2', 1));
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: longTextV2.longTextV2 });
    });
  });

  // Test 1: Single section
  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const { data } = features[1];
    const testUrl = `${baseURL}${features[1].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to long-text-v2 single section test page', async () => {
      await longTextV2.gotoURL(testUrl);
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify single section structure', async () => {
      await longTextV2.waitForContent();
      await expect(longTextV2.longTextV2).toBeVisible();
      
      const structure = await longTextV2.getContentStructure();
      expect(structure.h2Count).toBe(data.h2Count);
      expect(structure.pCount).toBe(data.pCount);
      expect(structure.articleCount).toBe(1);
      
      // Verify single article has both h2 and p
      const article = structure.articles[0];
      expect(article.hasH2).toBe(true);
      expect(article.hasP).toBe(true);
    });

    await test.step('Verify semantic HTML structure', async () => {
      const structure = await longTextV2.getContentStructure();
      expect(structure.hasSemanticStructure).toBe(true);
      
      // Verify proper heading hierarchy
      const hasProperHierarchy = await longTextV2.hasProperHeadingHierarchy();
      expect(hasProperHierarchy).toBe(true);
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: longTextV2.longTextV2 });
    });
  });

  // Test 2: Plain variant
  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const { data } = features[2];
    const testUrl = `${baseURL}${features[2].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to long-text-v2 plain variant test page', async () => {
      await longTextV2.gotoURL(testUrl);
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify plain variant structure', async () => {
      await longTextV2.waitForContent();
      await expect(longTextV2.longTextV2).toBeVisible();
      
      // Verify plain class is applied
      const isPlain = await longTextV2.isPlainVariant();
      expect(isPlain).toBe(data.hasPlainClass);
      
      // Verify wrapper exists
      const hasWrapper = await longTextV2.hasWrapper();
      expect(hasWrapper).toBe(data.hasWrapper);
      
      const structure = await longTextV2.getContentStructure();
      expect(structure.h2Count).toBeGreaterThanOrEqual(data.h2Count);
      expect(structure.pCount).toBeGreaterThanOrEqual(data.pCount);
    });

    await test.step('Verify plain variant styling', async () => {
      // Check if plain variant has different styling
      const tokens = await longTextV2.getDesignTokens();
      expect(tokens.h2Color).toBeTruthy();
      expect(tokens.pColor).toBeTruthy();
      
      // Verify plain variant specific elements
      const plainH1 = await longTextV2.plainH1.count();
      const plainH2 = await longTextV2.plainH2.count();
      const plainH3 = await longTextV2.plainH3.count();
      
      console.log(`Plain variant headings - H1: ${plainH1}, H2: ${plainH2}, H3: ${plainH3}`);
    });

    await test.step('Verify accessibility', async () => {
      await runAccessibilityTest({ page, testScope: longTextV2.longTextV2 });
    });
  });

  // Test 3: Accessibility
  test(`[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    const { data } = features[3];
    const testUrl = `${baseURL}${features[3].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to long-text-v2 accessibility test page', async () => {
      await longTextV2.gotoURL(testUrl);
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify semantic HTML structure', async () => {
      await longTextV2.waitForContent();
      
      const structure = await longTextV2.getContentStructure();
      expect(structure.hasSemanticStructure).toBe(data.hasSemanticHTML);
      
      // Verify proper heading hierarchy
      const hasProperHierarchy = await longTextV2.hasProperHeadingHierarchy();
      expect(hasProperHierarchy).toBe(data.hasProperHeadings);
    });

    await test.step('Verify keyboard navigation', async () => {
      const isKeyboardNavigable = await longTextV2.isKeyboardNavigable();
      expect(isKeyboardNavigable).toBe(data.keyboardNavigable);
      
      // Test tab navigation
      await longTextV2.focusH2(0);
      const focusedElement = await longTextV2.getFocusedElement();
      expect(await focusedElement.count()).toBeGreaterThan(0);
      
      await longTextV2.pressKey('Tab');
      const nextFocusedElement = await longTextV2.getFocusedElement();
      expect(await nextFocusedElement.count()).toBeGreaterThan(0);
    });

    await test.step('Verify accessibility attributes', async () => {
      const a11yAttrs = await longTextV2.getAccessibilityAttributes();
      
      // Check for proper roles and attributes
      expect(a11yAttrs.h2Role).toBeTruthy();
      expect(a11yAttrs.pRole).toBeTruthy();
      
      console.log('Accessibility attributes:', a11yAttrs);
    });

    await test.step('Verify screen reader compatibility', async () => {
      // Test that content is properly structured for screen readers
      const structure = await longTextV2.getContentStructure();
      expect(structure.articles.length).toBeGreaterThan(0);
      
      // Each article should have meaningful content
      for (const article of structure.articles) {
        expect(article.h2Text).toBeTruthy();
        expect(article.pText).toBeTruthy();
        expect(article.h2Text.length).toBeGreaterThan(0);
        expect(article.pText.length).toBeGreaterThan(0);
      }
    });

    await test.step('Verify accessibility with automated tools', async () => {
      await runAccessibilityTest({ page, testScope: longTextV2.longTextV2 });
    });
  });

  // Test 4: Responsive behavior
  test(`[Test Id - responsive] Long Text V2 responsive behavior,@long-text-v2 @responsive @express @smoke @regression`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Go to long-text-v2 responsive test page', async () => {
      await longTextV2.gotoURL(testUrl);
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Test mobile viewport (375px)', async () => {
      await longTextV2.setViewportSize(375, 667);
      const responsive = await longTextV2.getResponsiveBehavior();
      expect(responsive.isMobile).toBe(true);
      
      // Verify content is still accessible on mobile
      await longTextV2.waitForContent();
      const structure = await longTextV2.getContentStructure();
      expect(structure.hasSemanticStructure).toBe(true);
    });

    await test.step('Test tablet viewport (768px)', async () => {
      await longTextV2.setViewportSize(768, 1024);
      const responsive = await longTextV2.getResponsiveBehavior();
      expect(responsive.isTablet).toBe(true);
      
      // Verify content structure is maintained
      const structure = await longTextV2.getContentStructure();
      expect(structure.hasSemanticStructure).toBe(true);
    });

    await test.step('Test desktop viewport (1200px)', async () => {
      await longTextV2.setViewportSize(1200, 800);
      const responsive = await longTextV2.getResponsiveBehavior();
      expect(responsive.isDesktop).toBe(true);
      
      // Verify content structure is maintained
      const structure = await longTextV2.getContentStructure();
      expect(structure.hasSemanticStructure).toBe(true);
    });
  });
});
