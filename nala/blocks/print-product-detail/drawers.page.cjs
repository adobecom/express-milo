const { features } = require('./drawers.spec.cjs');

class PrintProductDetailDrawers {
  constructor(page) {
    this.page = page;
    this.features = features;
    
    // Drawer selectors
    this.drawer = '.drawer';
    this.curtain = '.pdp-curtain';
    this.drawerHead = '.drawer-head';
    this.closeButton = 'button[aria-label="close"]';
    
    // T-shirt selectors
    this.learnMoreButton = '.pdpx-pill-selector-label-compare-link';
    this.sizeChartLink = '.pdpx-size-chart-link';
    this.comparisonDrawer = '.drawer-body--comparison';
    this.sizeChartDrawer = '.drawer-body--size-chart';
    
    // Business card selectors
    this.comparePaperTypesButton = 'button:has-text("Compare Paper Types")';
    this.paperDrawer = '.drawer-body--paper-selection';
    this.paperCarousel = '.paper-selection-carousel';
    this.carouselArrowLeft = '.paper-carousel-arrow-left';
    this.carouselArrowRight = '.paper-carousel-arrow-right';
    this.paperThumb = '.paper-selection-thumb';
    this.selectButton = '.drawer-foot .select';
  }

  async gotoURL(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async clickLearnMore() {
    await this.page.locator(this.learnMoreButton).first().click();
    await this.page.waitForTimeout(300);
  }

  async clickSizeChart() {
    await this.page.locator(this.sizeChartLink).click();
    await this.page.waitForTimeout(300);
  }

  async clickComparePaperTypes() {
    await this.page.locator(this.comparePaperTypesButton).click();
    await this.page.waitForTimeout(300);
  }

  async closeDrawer() {
    await this.page.locator(`${this.drawer} ${this.closeButton}`).click();
    await this.page.waitForTimeout(300);
  }

  async closeDrawerByCurtain() {
    await this.page.locator(this.curtain).click();
    await this.page.waitForTimeout(300);
  }

  async isDrawerVisible() {
    const drawer = this.page.locator(this.drawer);
    return await drawer.isVisible();
  }

  async isDrawerHidden() {
    const drawer = this.page.locator(this.drawer);
    const classList = await drawer.getAttribute('class');
    return classList?.includes('hidden');
  }

  async scrollCarouselLeft() {
    await this.page.locator(this.carouselArrowLeft).click();
    await this.page.waitForTimeout(300);
  }

  async scrollCarouselRight() {
    await this.page.locator(this.carouselArrowRight).click();
    await this.page.waitForTimeout(300);
  }

  async clickPaperThumb(index = 1) {
    await this.page.locator(this.paperThumb).nth(index).click();
    await this.page.waitForTimeout(300);
  }

  async clickSelectButton() {
    await this.page.locator(this.selectButton).click();
    await this.page.waitForTimeout(500);
  }

  async getActiveElement() {
    return await this.page.evaluate(() => document.activeElement.tagName);
  }

  async pressTa() {
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(100);
  }

  async pressShiftTab() {
    await this.page.keyboard.press('Shift+Tab');
    await this.page.waitForTimeout(100);
  }

  async pressEscape() {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
  }
}

module.exports = PrintProductDetailDrawers;

