export default class TemplateXPromo {
  constructor(page) {
    this.page = page;

    // Main block containers
    this.templateXPromo = page.locator('.template-x-promo');
    this.carouselWrapper = this.templateXPromo.locator('.promo-carousel-wrapper');
    this.carouselViewport = this.carouselWrapper.locator('.promo-carousel-viewport');
    this.carouselTrack = this.carouselViewport.locator('.promo-carousel-track');

    // Template elements
    this.templates = this.carouselTrack.locator('.template');
    this.templateImages = this.templates.locator('.image-wrapper img');
    this.templateTitles = this.templates.locator('.template-title');

    // Navigation controls
    this.navControls = this.templateXPromo.locator('.promo-nav-controls');
    this.prevButton = this.navControls.locator('.promo-nav-btn[aria-label*="Previous"]');
    this.nextButton = this.navControls.locator('.promo-nav-btn[aria-label*="Next"]');

    // Hover elements
    this.hoverElements = this.templates.locator('.button-container');
    this.editButtons = this.hoverElements.locator('.con-button');
    this.shareButtons = this.hoverElements.locator('.share-button');
    this.socialIcons = this.hoverElements.locator('.social-share-icons');
    this.mediaWrappers = this.templates.locator('.media-wrapper');

    // Layout classes
    this.oneUpLayout = page.locator('.template-x-promo.one-up');
    this.multipleUpLayout = page.locator('.template-x-promo.multiple-up');
    this.twoUpLayout = page.locator('.template-x-promo.two-up');
    this.threeUpLayout = page.locator('.template-x-promo.three-up');
    this.fourUpLayout = page.locator('.template-x-promo.four-up');

    // Global elements
    this.globalFooter = page.locator('.global-footer');
  }

  async gotoURL(url) {
    await this.page.goto(url);
    await this.globalFooter.waitFor();
  }

  async scrollToTemplateXPromo() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.templateXPromo.scrollIntoViewIfNeeded({ timeout: 2000 });
  }

  async waitForTemplatesLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.templates.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async getTemplateCount() {
    await this.waitForTemplatesLoad();
    return await this.templates.count();
  }

  async clickTemplate(index = 0) {
    await this.waitForTemplatesLoad();
    const template = this.templates.nth(index);
    await template.scrollIntoViewIfNeeded();
    await template.click();
  }

  async hoverTemplate(index = 0) {
    await this.waitForTemplatesLoad();
    const template = this.templates.nth(index);
    await template.scrollIntoViewIfNeeded();
    await template.hover();
  }

  async clickEditButton(templateIndex = 0) {
    await this.hoverTemplate(templateIndex);
    const editButton = this.editButtons.nth(templateIndex);
    await editButton.waitFor({ state: 'visible', timeout: 5000 });
    await editButton.click();
  }

  async clickShareButton(templateIndex = 0) {
    await this.hoverTemplate(templateIndex);
    const shareButton = this.shareButtons.nth(templateIndex);
    await shareButton.waitFor({ state: 'visible', timeout: 5000 });
    await shareButton.click();
  }

  async navigateNext() {
    await this.nextButton.waitFor({ state: 'visible' });
    const isDisabled = await this.nextButton.getAttribute('disabled');
    if (isDisabled === null) {
      await this.nextButton.click();
      await this.page.waitForTimeout(500); // Wait for animation
    }
    return isDisabled === null;
  }

  async navigatePrevious() {
    await this.prevButton.waitFor({ state: 'visible' });
    const isDisabled = await this.prevButton.getAttribute('disabled');
    if (isDisabled === null) {
      await this.prevButton.click();
      await this.page.waitForTimeout(500); // Wait for animation
    }
    return isDisabled === null;
  }

  async getCarouselOffset() {
    const track = this.carouselTrack;
    const transform = await track.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.transform;
    });

    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix.*\((.+)\)/);
      if (matrix) {
        const values = matrix[1].split(', ');
        return parseFloat(values[4]) || 0; // translateX value
      }
    }
    return 0;
  }

  async validateAccessibility() {
    const results = {
      hasAriaLabels: true,
      hasProperRoles: true,
      hasKeyboardSupport: true,
      hasAltText: true,
    };

    // Check navigation button aria-labels
    if (await this.navControls.isVisible()) {
      const prevLabel = await this.prevButton.getAttribute('aria-label');
      const nextLabel = await this.nextButton.getAttribute('aria-label');
      results.hasAriaLabels = prevLabel && nextLabel;
    }

    // Check image alt text
    const imageCount = await this.templateImages.count();
    for (let i = 0; i < imageCount; i++) {
      const altText = await this.templateImages.nth(i).getAttribute('alt');
      if (!altText) {
        results.hasAltText = false;
        break;
      }
    }

    // Check button types
    if (await this.navControls.isVisible()) {
      const prevType = await this.prevButton.getAttribute('type');
      const nextType = await this.nextButton.getAttribute('type');
      results.hasProperRoles = prevType === 'button' && nextType === 'button';
    }

    return results;
  }

  async validateResponsiveLayout() {
    const templateCount = await this.getTemplateCount();
    const layout = {
      templateCount,
      isOneUp: false,
      isMultipleUp: false,
      specificLayout: null,
      hasNavigation: false,
    };

    // Check layout classes
    layout.isOneUp = await this.oneUpLayout.isVisible();
    layout.isMultipleUp = await this.multipleUpLayout.isVisible();
    layout.hasNavigation = await this.navControls.isVisible();

    // Check specific layout classes
    if (await this.twoUpLayout.isVisible()) layout.specificLayout = 'two-up';
    if (await this.threeUpLayout.isVisible()) layout.specificLayout = 'three-up';
    if (await this.fourUpLayout.isVisible()) layout.specificLayout = 'four-up';

    return layout;
  }

  async validateImageLoading() {
    const results = {
      allImagesLoaded: true,
      hasLazyLoading: false,
      imageErrors: [],
    };

    const imageCount = await this.templateImages.count();

    for (let i = 0; i < imageCount; i++) {
      const image = this.templateImages.nth(i);

      // Check if image has loaded
      const naturalWidth = await image.evaluate((img) => img.naturalWidth);
      if (naturalWidth === 0) {
        results.allImagesLoaded = false;
        results.imageErrors.push(`Image ${i} failed to load`);
      }

      // Check for lazy loading attributes
      const dataSrc = await image.getAttribute('data-src');
      const loading = await image.getAttribute('loading');
      if (dataSrc || loading === 'lazy') {
        results.hasLazyLoading = true;
      }
    }

    return results;
  }

  async testKeyboardNavigation() {
    const results = {
      canFocusNavButtons: false,
      canNavigateWithKeys: false,
      canFocusTemplates: false,
    };

    // Test navigation button focus
    if (await this.navControls.isVisible()) {
      await this.nextButton.focus();
      const isFocused = await this.nextButton.evaluate((el) => document.activeElement === el);
      results.canFocusNavButtons = isFocused;

      // Test keyboard navigation
      const initialOffset = await this.getCarouselOffset();
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(500);
      const newOffset = await this.getCarouselOffset();
      results.canNavigateWithKeys = initialOffset !== newOffset;
    }

    // Test template focus
    const firstTemplate = this.templates.first();
    if (await firstTemplate.isVisible()) {
      await firstTemplate.focus();
      const isFocused = await firstTemplate.evaluate((el) => document.activeElement === el);
      results.canFocusTemplates = isFocused;
    }

    return results;
  }

  async measurePerformance() {
    const performance = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');

      return {
        loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    return performance;
  }
}
