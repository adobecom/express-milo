export default class Wayfinder {
  constructor(page, nth = 0) {
    this.page = page;
    this.nth = nth;
    // section and link-list wrapper
    this.section = page.locator('.section').nth(nth);
    this.wayfinder = page.locator('.wayfinder').nth(nth);

    // Variant locators
    this.variants = {
      borderless: page.locator('.wayfinder.borderless').nth(nth),
      dark: page.locator('.wayfinder.dark').nth(nth),
      gradient: page.locator('.wayfinder.gradient').nth(nth),
      light: page.locator('.wayfinder.light').nth(nth),
    };

    // Default details
    this.defaultContent1 = this.wayfinder.locator('p').nth(0);
    this.defaultContent2 = this.wayfinder.locator('p').nth(1);
    this.defaultButton1 = this.wayfinder.locator('a').nth(0);
    this.defaultButton2 = this.wayfinder.locator('a').nth(1);
    this.defaultButton3 = this.wayfinder.locator('a').nth(2);

    // Borderless variant details
    this.borderlessVariantContent = this.variants.borderless.locator('div').nth(1);
    this.borderlessVariantButton1 = this.variants.borderless.locator('a').nth(0);
    this.borderlessVariantButton2 = this.variants.borderless.locator('a').nth(1);

    // Dark variant details
    this.darkVariantContent1 = this.variants.dark.locator('p').nth(0);
    this.darkVariantContent2 = this.variants.dark.locator('p').nth(1);
    this.darkVariantButton1 = this.variants.dark.locator('a').nth(0);
    this.darkVariantButton2 = this.variants.dark.locator('a').nth(1);
    this.darkVariantButton3 = this.variants.dark.locator('a').nth(2);

    // Gradient variant details
    this.gradientVariantContent1 = this.variants.gradient.locator('p').nth(0);
    this.gradientVariantContent2 = this.variants.gradient.locator('p').nth(1);
    this.gradientVariantButton1 = this.variants.gradient.locator('a').nth(0);
    this.gradientVariantButton2 = this.variants.gradient.locator('a').nth(1);

    // Light variant details
    this.lightVariantContent1 = this.variants.light.locator('p').nth(0);
    this.lightVariantContent2 = this.variants.light.locator('p').nth(1);
    this.lightVariantButton1 = this.variants.light.locator('a').nth(0);
    this.lightVariantButton2 = this.variants.light.locator('a').nth(1);
    this.lightVariantButton3 = this.variants.light.locator('a').nth(2);
  }
}
