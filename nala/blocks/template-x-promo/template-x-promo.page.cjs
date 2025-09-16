export default class TemplateXPromo {
  constructor(page) {
    this.page = page;

    // Main block selectors
    this.templateXPromo = page.locator('.template-x-promo').nth(0);
    this.carouselWrapper = page.locator('.promo-carousel-wrapper');
    this.carouselViewport = page.locator('.promo-carousel-viewport');
    this.carouselTrack = page.locator('.promo-carousel-track');

    // Templates
    this.templates = page.locator('.template');
    this.templateImages = page.locator('.template img');
    this.templateTitles = page.locator('.template .template-title');

    // Navigation
    this.prevButton = page.locator('.promo-prev-btn');
    this.nextButton = page.locator('.promo-next-btn');
    this.navControls = page.locator('.promo-nav-controls');

    // Hover overlays
    this.buttonContainers = page.locator('.button-container');
    this.editButtons = page.locator('.button-container a.button');
    this.shareButtons = page.locator('.share-icon-wrapper');

    // A11y elements
    this.carouselStatus = page.locator('#carousel-status');

    // Global elements
    this.globalFooter = page.locator('.global-footer');
  }

  async gotoURL(url) {
    await this.page.goto(url);
    await this.globalFooter.waitFor();
  }

  async waitForTemplates() {
    // First check if the block exists at all
    const blockExists = await this.templateXPromo.count() > 0;
    if (!blockExists) {
      throw new Error('Template-x-promo block not found on page');
    }
    
    // Wait for the main block to be visible first
    await this.templateXPromo.waitFor();
    
    // Wait for the block to be decorated by JavaScript
    await this.templateXPromo.waitFor({ state: 'attached' });
    await this.page.waitForFunction(
      () => document.querySelector('.template-x-promo')?.hasAttribute('data-decorated'),
      { timeout: 30000 }
    );
    
    // Wait for network to be idle (API calls completed)
    await this.page.waitForLoadState('networkidle');
    
    // Give additional time for DOM updates after API calls
    await this.page.waitForTimeout(2000);
    
    // Check if it's a carousel layout
    const isCarousel = await this.carouselWrapper.isVisible();
    
    if (isCarousel) {
      // Wait for carousel structure
      await this.carouselTrack.waitFor();
    }
    
    // Wait for templates to be created (with longer timeout for API calls)
    try {
      await this.templates.first().waitFor({ timeout: 20000 });
      await this.templateImages.first().waitFor({ timeout: 20000 });
    } catch (error) {
      // If templates don't load, check if there are any images in the block
      const hasImages = await this.templateImages.count() > 0;
      if (!hasImages) {
        // Debug: log what we actually found
        const templateCount = await this.templates.count();
        const imageCount = await this.templateImages.count();
        const blockHTML = await this.templateXPromo.innerHTML();
        console.log(`Debug: Found ${templateCount} templates, ${imageCount} images`);
        console.log(`Block HTML: ${blockHTML.substring(0, 500)}...`);
        throw new Error(`No template images found after waiting for block to load. Found ${templateCount} templates, ${imageCount} images`);
      }
    }
  }

  async getTemplateCount() {
    return this.templates.count();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickPrev() {
    await this.prevButton.click();
  }

  async hoverTemplate(index = 0) {
    await this.templates.nth(index).hover();
  }

  async isCarouselVisible() {
    return this.carouselWrapper.isVisible();
  }

  async areNavigationButtonsVisible() {
    return this.navControls.isVisible();
  }
}
