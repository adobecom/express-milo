module.exports = class TemplateX {
  constructor(page) {
    this.page = page;
    this.block = page.locator('.template-x').first();
    this.toolbar = this.block.locator('.api-templates-toolbar');
    this.searchInput = this.toolbar.locator('input[type="search"]');
    this.filterButtons = this.toolbar.locator('.filter-button');
    this.sortDropdown = this.toolbar.locator('.sort-dropdown');
    this.viewToggle = this.toolbar.locator('.view-toggle');
    this.templates = this.block.locator('.template');
    this.loadMoreButton = this.block.locator('.load-more-button');
    this.masonryContainer = this.block.locator('.flex-masonry, .masonry');
  }

  async gotoURL(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTemplateCount() {
    return this.templates.count();
  }

  async searchTemplates(query) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async clickFilter(filterName) {
    const filter = this.filterButtons.filter({ hasText: filterName });
    await filter.click();
  }

  async selectSort(sortOption) {
    await this.sortDropdown.click();
    await this.page.locator(`text=${sortOption}`).click();
  }

  async toggleView(viewType) {
    const viewButton = this.viewToggle.locator(`[data-view="${viewType}"]`);
    await viewButton.click();
  }

  async loadMore() {
    if (await this.loadMoreButton.isVisible()) {
      await this.loadMoreButton.click();
    }
  }

  async getTemplate(index) {
    return this.templates.nth(index);
  }

  async clickTemplate(index) {
    const template = await this.getTemplate(index);
    await template.click();
  }

  async hoverTemplate(index) {
    const template = await this.getTemplate(index);
    await template.hover();
  }

  async isMasonryLayout() {
    return this.masonryContainer.isVisible();
  }
};
