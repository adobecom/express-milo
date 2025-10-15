export default class PricingFooter {
  constructor(page) {
    this.page = page;
    this.wrapper = page.locator('.pricing-footer-wrapper');
    this.block = this.wrapper.locator('.pricing-footer');
    this.columns = this.block.locator(':scope > div');
    this.section = this.wrapper.locator('xpath=ancestor::div[contains(@class,"section")]').first();
    this.merchCards = this.wrapper.locator('.content merch-card');
    this.globalFooter = page.locator('.global-footer');
  }

  async gotoURL(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.globalFooter.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  async scrollToBlock() {
    await this.block.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.block.scrollIntoViewIfNeeded();
  }

  async countEmptyColumns() {
    return this.columns.evaluateAll((nodes) => nodes.filter((node) => !node.textContent.trim()).length);
  }

  async getCardCount() {
    return this.block.evaluate((node) => {
      const cardClass = Array.from(node.classList).find((cls) => cls.startsWith('card-count-'));
      if (!cardClass) return 0;
      const [, , count] = cardClass.split('-');
      return Number.parseInt(count, 10);
    });
  }

  async getMerchCardCount() {
    return this.merchCards.count();
  }

  async getComputedMaxWidth() {
    return this.block.evaluate((node) => window.getComputedStyle(node).maxWidth);
  }
}
