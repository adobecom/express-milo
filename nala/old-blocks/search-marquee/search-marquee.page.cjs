class SearchMarquee {
  constructor(page) {
    this.page = page;

    // Main block selectors - scope to first search-marquee to avoid strict mode violations
    this.searchMarquee = page.locator('.search-marquee').first();
    this.searchBarWrapper = this.searchMarquee.locator('.search-bar-wrapper');
    this.searchForm = this.searchMarquee.locator('.search-form');
    this.searchBar = this.searchMarquee.locator('input.search-bar');
    this.searchDropdown = this.searchMarquee.locator('.search-dropdown-container');

    // Search functionality elements
    this.clearButton = this.searchMarquee.locator('.icon-search-clear');
    this.trendsContainer = this.searchMarquee.locator('.trends-container');
    this.suggestionsContainer = this.searchMarquee.locator('.suggestions-container');
    this.suggestionsList = this.searchMarquee.locator('.suggestions-list');
  }

  async gotoURL(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForSearchBar() {
    await this.searchBar.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async isSearchFormVisible() {
    return this.searchForm.isVisible();
  }

  async getSearchBarPlaceholder() {
    const count = await this.searchBar.count();
    if (count === 0) return null;
    return this.searchBar.getAttribute('placeholder');
  }

  async getSearchBarEnterKeyHint() {
    const count = await this.searchBar.count();
    if (count === 0) return null;
    return this.searchBar.getAttribute('enterkeyhint');
  }

  async isSearchBarWrapperVisible() {
    return this.searchBarWrapper.isVisible();
  }

  async hasSearchBarWrapperShowClass() {
    return this.searchBarWrapper.evaluate((el) => el.classList.contains('show'));
  }

  async typeInSearchBar(text) {
    await this.searchBar.fill(text);
  }

  async clickSearchBar() {
    await this.searchBar.click();
  }

  async isSearchDropdownVisible() {
    return this.searchDropdown.isVisible();
  }

  async isClearButtonVisible() {
    return this.clearButton.isVisible();
  }
}

module.exports = SearchMarquee;
