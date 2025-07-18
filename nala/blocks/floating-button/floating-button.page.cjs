export default class FloatingButton {
  constructor(page) {
    this.page = page;
    this.section = page.locator('.section').nth(9);
    this.floatingButton = page.locator('.floating-button');
  }
}
