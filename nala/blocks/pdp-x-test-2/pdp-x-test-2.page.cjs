const { features } = require('./pdp-x-test-2.spec.cjs');

class PdpXTest2 {
  constructor(page) {
    this.page = page;
    // Feature definitions (kept for compatibility)
    this.features = features;
  }

  /**
   * Navigate to URL and wait for page load
   */
  async gotoURL(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = PdpXTest2;
