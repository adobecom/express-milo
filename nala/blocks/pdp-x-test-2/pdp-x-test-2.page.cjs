class PdpXTest2 {
  constructor(page) {
    this.page = page;

    // Main container
    this.pdpBlock = this.page.locator('.pdp-x-test-2');
    this.globalContainer = this.page.locator('.pdpx-global-container');

    // Product images section
    this.productImagesContainer = this.page.locator('.pdpx-product-images-container');
    this.heroImage = this.page.locator('.pdpx-product-hero-image');
    this.thumbnailCarousel = this.page.locator('.pdpx-image-thumbnail-carousel-container');
    this.thumbnailItems = this.page.locator('.pdpx-image-thumbnail-carousel-item');
    this.selectedThumbnail = this.page.locator('.pdpx-image-thumbnail-carousel-item.selected');

    // Product info heading
    this.productTitle = this.page.locator('.pdpx-product-title');
    this.priceLabel = this.page.locator('.pdpx-price-label');
    this.comparePriceLabel = this.page.locator('.pdpx-compare-price-label');
    this.savingsText = this.page.locator('.pdpx-savings-text');
    this.deliveryEstimatePill = this.page.locator('.pdpx-delivery-estimate-pill');
    this.starRatings = this.page.locator('.pdpx-star-ratings-container');

    // Customization inputs - Pill selectors
    this.pillSelectorContainers = this.page.locator('.pdpx-pill-selector-container');
    this.pillSelectorLabel = this.page.locator('.pdpx-pill-selector-label-label');
    this.pillContainers = this.page.locator('.pdpx-pill-container');
    this.selectedPill = this.page.locator('.pdpx-pill-container.selected');

    // Customization inputs - Mini pill selectors
    this.miniPillContainers = this.page.locator('.pdpx-mini-pill-image-container');
    this.selectedMiniPill = this.page.locator('.pdpx-mini-pill-image-container.selected');

    // Customization inputs - Standard selectors
    this.standardSelectors = this.page.locator('.pdpx-standard-selector');

    // Product details accordion
    this.productDetailsSection = this.page.locator('.pdpx-product-details-section');
    this.productDetailsSectionTitle = this.page.locator('.pdpx-product-details-section-title');
    this.accordionTriggers = this.page.locator('.accordion-trigger');
    this.accordionIcons = this.page.locator('.accordion-icon');
    this.accordionContent = this.page.locator('.descr-details');
    this.visibleAccordionContent = this.page.locator('.descr-details.visible');
    this.expandedAccordion = this.page.locator('.accordion-trigger[aria-expanded="true"]');

    // Checkout button
    this.checkoutButton = this.page.locator('.pdpx-checkout-button');
    this.checkoutButtonText = this.page.locator('.pdpx-checkout-button-text');
    this.checkoutButtonSubhead = this.page.locator('.pdpx-checkout-button-subhead');

    // Drawer
    this.drawer = this.page.locator('.drawer');
    this.curtain = this.page.locator('.pdp-curtain');

    // Tooltip
    this.tooltipContainer = this.page.locator('.pdpx-compare-price-info-icon-container');
    this.tooltipButton = this.page.locator('.pdpx-compare-price-info-icon-button');
    this.tooltipContent = this.page.locator('.pdpx-info-tooltip-content');
  }

  async gotoURL(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForProductLoad() {
    await this.page.waitForSelector('.pdpx-product-title', { timeout: 10000 });
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async clickThumbnail(index) {
    await this.thumbnailItems.nth(index).click();
  }

  async clickPill(index) {
    await this.pillContainers.nth(index).click();
  }

  async clickMiniPill(index) {
    await this.miniPillContainers.nth(index).click();
  }

  async clickAccordionTrigger(index) {
    await this.accordionTriggers.nth(index).click();
  }

  async selectStandardOption(selectorIndex, optionValue) {
    await this.standardSelectors.nth(selectorIndex).selectOption(optionValue);
  }
}

module.exports = PdpXTest2;

