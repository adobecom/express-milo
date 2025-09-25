export default class LongTextV2 {
  constructor(page, nth = 0) {
    this.page = page;
    this.nth = nth;

    // Section and wrapper selectors
    this.section = page.locator('.section').nth(nth);
    this.longTextV2Wrapper = page.locator('.long-text-v2-wrapper').nth(nth);
    this.longTextV2 = page.locator('.long-text-v2').nth(nth);

    // Variant selectors
    this.variants = {
      plain: page.locator('.long-text-v2.plain').nth(nth),
      center: page.locator('.long-text-v2.center').nth(nth),
    };

    // Content selectors
    this.articles = this.longTextV2.locator('article');
    this.h2Elements = this.longTextV2.locator('h2');
    this.paragraphs = this.longTextV2.locator('p');

    // Plain variant specific selectors
    this.plainH1 = this.variants.plain.locator('h1');
    this.plainH2 = this.variants.plain.locator('h2');
    this.plainH3 = this.variants.plain.locator('h3');
    this.plainParagraphs = this.variants.plain.locator('p');

    // Responsive selectors
    this.mobileViewport = page.locator('body');
    this.desktopViewport = page.locator('body');
  }

  async gotoURL(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForContent() {
    // Wait for the page to load first
    await this.page.waitForLoadState('domcontentloaded');

    // Check if long-text-v2 block exists, if not, wait a bit more
    const longTextV2Exists = await this.longTextV2.count() > 0;
    if (!longTextV2Exists) {
      console.log('long-text-v2 block not found, waiting for content...');
      await this.page.waitForTimeout(2000);
    }

    // If still not found, check what blocks are actually present
    const allBlocks = await this.page.locator('[class*="long-text"]').count();
    console.log(`Found ${allBlocks} blocks with "long-text" in class name`);

    if (allBlocks > 0) {
      const blockClasses = await this.page.locator('[class*="long-text"]').allTextContents();
      console.log('Available long-text blocks:', blockClasses);
    }

    // Try to wait for any long-text block
    const anyLongTextBlock = this.page.locator('[class*="long-text"]').first();
    if (await anyLongTextBlock.count() > 0) {
      await anyLongTextBlock.waitFor();
    }
  }

  async getArticleCount() {
    return this.articles.count();
  }

  async getH2Count() {
    return this.h2Elements.count();
  }

  async getParagraphCount() {
    return this.paragraphs.count();
  }

  async getH2Text(index = 0) {
    return this.h2Elements.nth(index).textContent();
  }

  async getParagraphText(index = 0) {
    return this.paragraphs.nth(index).textContent();
  }

  async hasSemanticStructure() {
    const articleCount = await this.getArticleCount();
    const h2Count = await this.getH2Count();
    return articleCount > 0 && h2Count > 0;
  }

  async isPlainVariant() {
    return this.variants.plain.isVisible();
  }

  async hasWrapper() {
    return this.longTextV2Wrapper.isVisible();
  }

  async getArticleStructure(index = 0) {
    const article = this.articles.nth(index);
    const h2 = article.locator('h2');
    const p = article.locator('p');

    return {
      hasH2: await h2.isVisible(),
      hasP: await p.isVisible(),
      h2Text: await h2.textContent(),
      pText: await p.textContent(),
    };
  }

  async getDesignTokens() {
    const h2 = this.h2Elements.first();
    const p = this.paragraphs.first();

    return {
      h2Color: await h2.evaluate((el) => getComputedStyle(el).color),
      h2FontSize: await h2.evaluate((el) => getComputedStyle(el).fontSize),
      h2FontWeight: await h2.evaluate((el) => getComputedStyle(el).fontWeight),
      h2LineHeight: await h2.evaluate((el) => getComputedStyle(el).lineHeight),
      pColor: await p.evaluate((el) => getComputedStyle(el).color),
      pFontSize: await p.evaluate((el) => getComputedStyle(el).fontSize),
      pFontWeight: await p.evaluate((el) => getComputedStyle(el).fontWeight),
      pLineHeight: await p.evaluate((el) => getComputedStyle(el).lineHeight),
    };
  }

  async getResponsiveBehavior() {
    const currentViewport = this.page.viewportSize();

    return {
      width: currentViewport.width,
      height: currentViewport.height,
      isMobile: currentViewport.width <= 767,
      isTablet: currentViewport.width > 767 && currentViewport.width <= 1024,
      isDesktop: currentViewport.width > 1024,
    };
  }

  async setViewportSize(width, height) {
    await this.page.setViewportSize({ width, height });
    await this.page.waitForTimeout(500); // Wait for responsive changes
  }

  async getAccessibilityAttributes() {
    const h2 = this.h2Elements.first();
    const p = this.paragraphs.first();

    return {
      h2Role: await h2.getAttribute('role'),
      h2AriaLabel: await h2.getAttribute('aria-label'),
      h2TabIndex: await h2.getAttribute('tabindex'),
      pRole: await p.getAttribute('role'),
      pAriaLabel: await p.getAttribute('aria-label'),
      pTabIndex: await p.getAttribute('tabindex'),
    };
  }

  async focusH2(index = 0) {
    await this.h2Elements.nth(index).focus();
  }

  async focusParagraph(index = 0) {
    await this.paragraphs.nth(index).focus();
  }

  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  async getFocusedElement() {
    return this.page.locator(':focus');
  }

  async isKeyboardNavigable() {
    const h2 = this.h2Elements.first();
    const p = this.paragraphs.first();

    await h2.focus();
    const h2Focused = await this.getFocusedElement().count() > 0;

    await p.focus();
    const pFocused = await this.getFocusedElement().count() > 0;

    return h2Focused && pFocused;
  }

  async hasProperHeadingHierarchy() {
    const h2Count = await this.getH2Count();

    // Check if we have proper heading hierarchy
    // Should have h2s
    return h2Count > 0;
  }

  async getContentStructure() {
    const articles = [];
    const articleCount = await this.getArticleCount();

    for (let i = 0; i < articleCount; i += 1) {
      const article = await this.getArticleStructure(i);
      articles.push(article);
    }

    return {
      articleCount,
      h2Count: await this.getH2Count(),
      pCount: await this.getParagraphCount(),
      articles,
      hasSemanticStructure: await this.hasSemanticStructure(),
    };
  }
}
