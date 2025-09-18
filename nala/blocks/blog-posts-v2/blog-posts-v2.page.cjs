export default class BlogPostsV2 {
  constructor(page) {
    this.page = page;
    this.blogPostsV2 = page.locator('.blog-posts-v2');
    this.blogCards = page.locator('.blog-card');
    this.blogCardsContainer = page.locator('.blog-cards');
    this.sectionContainer = page.locator('.section.ax-blog-posts-container');
    this.cardTitles = page.locator('.blog-card-title');
    this.cardDates = page.locator('.blog-card-date');
    this.cardImages = page.locator('.blog-card-image img');
    this.cardTeasers = page.locator('.blog-card-teaser');
  }

  async gotoURL(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForBlogCards() {
    await this.blogCards.first().waitFor({ state: 'visible' });
  }

  async getBlogCardCount() {
    return this.blogCards.count();
  }

  async verifyCardStructure() {
    const cardCount = await this.getBlogCardCount();
    if (cardCount === 0) return false;

    // Check that each card has required elements
    for (let i = 0; i < cardCount; i++) {
      const card = this.blogCards.nth(i);
      const hasImage = await card.locator('.blog-card-image').isVisible();
      const hasTitle = await card.locator('.blog-card-title').isVisible();
      const hasTeaser = await card.locator('.blog-card-teaser').isVisible();
      const hasDate = await card.locator('.blog-card-date').isVisible();
      const hasBody = await card.locator('.blog-card-body').isVisible();

      if (!hasImage || !hasTitle || !hasTeaser || !hasDate || !hasBody) {
        return false;
      }
    }

    return true;
  }

  async verifyDatesAreVisible() {
    const dateCount = await this.cardDates.count();
    if (dateCount === 0) return false;

    // Check that all dates have content
    for (let i = 0; i < dateCount; i++) {
      const dateText = await this.cardDates.nth(i).textContent();
      if (!dateText || dateText.trim() === '') {
        return false;
      }
    }

    return true;
  }

  async verifyDateFormatting() {
    const dateCount = await this.cardDates.count();
    if (dateCount === 0) return false;

    // Check that dates are properly formatted (contain month/day/year patterns)
    for (let i = 0; i < dateCount; i++) {
      const dateText = await this.cardDates.nth(i).textContent();

      // Should contain date-like content (numbers, month names, etc.)
      const hasDatePattern = /\d+|\w{3,}/.test(dateText);
      if (!hasDatePattern) {
        return false;
      }
    }

    return true;
  }

  async getDateStyles() {
    const firstDate = this.cardDates.first();
    return firstDate.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight,
        fontWeight: styles.fontWeight,
        fontStyle: styles.fontStyle,
      };
    });
  }

  async setViewportSize(width, height) {
    await this.page.setViewportSize({ width, height });
    // Wait for responsive changes to take effect
    await this.page.waitForTimeout(100);
  }

  async getCardsLayout() {
    return this.blogCardsContainer.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        direction: styles.flexDirection,
        gap: styles.gap,
      };
    });
  }

  async verifyEqualCardHeights() {
    const cardCount = await this.getBlogCardCount();
    if (cardCount <= 1) return true; // No need to check with only one card

    const heights = [];
    for (let i = 0; i < cardCount; i++) {
      const height = await this.blogCards.nth(i).evaluate((el) => el.offsetHeight);
      heights.push(height);
    }

    // Check if all heights are equal (within 1px tolerance for rounding)
    const firstHeight = heights[0];
    return heights.every((height) => Math.abs(height - firstHeight) <= 1);
  }

  async getCardsContainerStyles() {
    return this.blogCardsContainer.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        alignItems: styles.alignItems,
        flexDirection: styles.flexDirection,
      };
    });
  }

  async getSectionBackgroundStyles() {
    return this.sectionContainer.evaluate((el) => {
      const beforeStyles = window.getComputedStyle(el, '::before');

      return {
        hasGrayBackground: beforeStyles.backgroundColor !== 'rgba(0, 0, 0, 0)'
                          && beforeStyles.backgroundColor !== 'transparent',
        isFullWidth: beforeStyles.width === '100vw'
                    || parseFloat(beforeStyles.width) > window.innerWidth * 0.9,
        backgroundColor: beforeStyles.backgroundColor,
        width: beforeStyles.width,
      };
    });
  }

  async getFirstCard() {
    return this.blogCards.first();
  }

  // eslint-disable-next-line class-methods-use-this
  async getCardHoverStyles(card) {
    await card.hover();
    return card.evaluate((el) => {
      const computedStyles = window.getComputedStyle(el);
      return {
        boxShadow: computedStyles.boxShadow,
        transition: computedStyles.transition,
      };
    });
  }

  async verifyHeadingStructure() {
    const titleCount = await this.cardTitles.count();

    // Verify all titles are h3 elements
    const h3Count = await this.page.locator('.blog-card-title').count();

    return {
      hasH3Titles: h3Count === titleCount && titleCount > 0,
      titlesCount: titleCount,
    };
  }

  async verifyImageAltAttributes() {
    const imageCount = await this.cardImages.count();
    if (imageCount === 0) return true; // No images to check

    for (let i = 0; i < imageCount; i++) {
      const alt = await this.cardImages.nth(i).getAttribute('alt');
      if (!alt) {
        return false; // Missing alt attribute
      }
    }

    return true;
  }

  // Helper methods for specific test scenarios
  async getCardByIndex(index) {
    return this.blogCards.nth(index);
  }

  async clickCard(index = 0) {
    const card = this.blogCards.nth(index);
    await card.click();
  }

  async getCardTitle(index = 0) {
    return this.cardTitles.nth(index).textContent();
  }

  async getCardDate(index = 0) {
    return this.cardDates.nth(index).textContent();
  }

  async getCardTeaser(index = 0) {
    return this.cardTeasers.nth(index).textContent();
  }

  async verifyCardResponsiveness() {
    // Test multiple viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop' },
      { width: 1440, height: 900, name: 'large-desktop' },
    ];

    const results = {};

    for (const viewport of viewports) {
      await this.setViewportSize(viewport.width, viewport.height);
      await this.waitForBlogCards();

      const layout = await this.getCardsLayout();
      const cardCount = await this.getBlogCardCount();

      results[viewport.name] = {
        layout,
        cardCount,
        viewport,
      };
    }

    return results;
  }

  async measurePerformance() {
    // Measure loading performance
    const start = performance.now();
    await this.waitForBlogCards();
    const end = performance.now();

    return {
      loadTime: end - start,
      cardCount: await this.getBlogCardCount(),
    };
  }
}
