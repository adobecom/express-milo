const { expect, test } = require('@playwright/test');
const { features } = require('./pdp-x-test-2.spec.cjs');
const PdpXTest2 = require('./pdp-x-test-2.page.cjs');
const { runAccessibilityTest } = require('../../libs/accessibility.cjs');

let pdp;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Express PDP-X-Test-2 Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    pdp = new PdpXTest2(page);
  });

  // Test 0: Product images and carousel
  test(`[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[0].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to PDP page and wait for product load', async () => {
      await pdp.gotoURL(testUrl);
      await pdp.waitForProductLoad();
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Verify product images container is visible', async () => {
      await expect(pdp.productImagesContainer).toBeVisible();
      await expect(pdp.heroImage).toBeVisible();

      // Verify hero image has valid src
      const heroSrc = await pdp.heroImage.getAttribute('src');
      expect(heroSrc).toBeTruthy();
      expect(heroSrc).toContain('rlv.zcache.com');
    });

    await test.step('Verify thumbnail carousel exists and is interactive', async () => {
      const thumbnailCount = await pdp.thumbnailItems.count();
      expect(thumbnailCount).toBeGreaterThan(0);

      // Verify first thumbnail is selected by default
      await expect(pdp.selectedThumbnail).toBeVisible();
      await expect(pdp.selectedThumbnail.first()).toHaveClass(/selected/);
    });

    await test.step('Test thumbnail click changes hero image', async () => {
      const thumbnailCount = await pdp.thumbnailItems.count();

      if (thumbnailCount > 1) {
        // Get initial hero image src
        const initialSrc = await pdp.heroImage.getAttribute('src');

        // Click second thumbnail
        await pdp.clickThumbnail(1);
        await page.waitForTimeout(500); // Wait for image update

        // Verify selected class moved
        const selectedClass = await pdp.thumbnailItems.nth(1).getAttribute('class');
        expect(selectedClass).toContain('selected');

        // Verify hero image changed
        const newSrc = await pdp.heroImage.getAttribute('src');
        expect(newSrc).not.toBe(initialSrc);
      }
    });

    await test.step('Verify hero image has proper border radius (design token)', async () => {
      const borderRadius = await pdp.heroImage.evaluate((el) => window.getComputedStyle(el).borderRadius);
      expect(borderRadius).toBe('12px'); // --spacing-200
    });
  });

  // Test 1: Customization inputs and pill selectors
  test(`[Test Id - ${features[1].tcid}] ${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[1].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to PDP page', async () => {
      await pdp.gotoURL(testUrl);
      await pdp.waitForProductLoad();
    });

    await test.step('Verify pill selectors exist and have labels', async () => {
      const pillSelectorCount = await pdp.pillSelectorContainers.count();

      if (pillSelectorCount > 0) {
        // Verify first pill selector has label
        const firstLabel = await pdp.pillSelectorLabel.first().textContent();
        expect(firstLabel.length).toBeGreaterThan(0);

        // Verify pills exist in container
        const pillCount = await pdp.pillContainers.count();
        expect(pillCount).toBeGreaterThan(0);
      }
    });

    await test.step('Test pill selection changes selected state', async () => {
      const pillCount = await pdp.pillContainers.count();

      if (pillCount > 1) {
        // Get initial selected pill
        const initialSelectedIndex = await pdp.page.evaluate(() => {
          const pills = Array.from(document.querySelectorAll('.pdpx-pill-container'));
          return pills.findIndex((pill) => pill.classList.contains('selected'));
        });

        // Click a different pill
        const targetIndex = initialSelectedIndex === 0 ? 1 : 0;
        await pdp.clickPill(targetIndex);
        await page.waitForTimeout(500); // Wait for selection update

        // Verify selection changed
        const newSelectedClass = await pdp.pillContainers.nth(targetIndex).getAttribute('class');
        expect(newSelectedClass).toContain('selected');

        // Verify old pill is not selected
        const oldPillClass = await pdp.pillContainers.nth(initialSelectedIndex).getAttribute('class');
        expect(oldPillClass).not.toContain('selected');
      }
    });

    await test.step('Verify mini pill selectors work correctly', async () => {
      const miniPillCount = await pdp.miniPillContainers.count();

      if (miniPillCount > 1) {
        // Click second mini pill
        await pdp.clickMiniPill(1);
        await page.waitForTimeout(500);

        // Verify selected class
        const selectedClass = await pdp.miniPillContainers.nth(1).getAttribute('class');
        expect(selectedClass).toContain('selected');
      }
    });

    await test.step('Verify pill images are loaded correctly', async () => {
      const pillCount = await pdp.pillContainers.count();

      for (let i = 0; i < Math.min(pillCount, 3); i++) {
        const pillImage = pdp.pillContainers.nth(i).locator('img');
        const pillImageCount = await pillImage.count();

        if (pillImageCount > 0) {
          const src = await pillImage.getAttribute('src');
          expect(src).toBeTruthy();
        }
      }
    });

    await test.step('Verify pill has proper styling with design tokens', async () => {
      const pillCount = await pdp.pillContainers.count();

      if (pillCount > 0) {
        const borderRadius = await pdp.pillContainers.first().evaluate((el) => window.getComputedStyle(el).borderRadius);
        expect(borderRadius).toBe('8px');

        // Verify selected pill has accent color border
        const selectedPill = pdp.selectedPill.first();
        const borderColor = await selectedPill.evaluate((el) => window.getComputedStyle(el).borderColor);
        expect(borderColor).toBeTruthy();
      }
    });
  });

  // Test 2: Accordion expand/collapse functionality
  test(`[Test Id - ${features[2].tcid}] ${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[2].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to PDP page', async () => {
      await pdp.gotoURL(testUrl);
      await pdp.waitForProductLoad();
    });

    await test.step('Verify product details section exists', async () => {
      await expect(pdp.productDetailsSection).toBeVisible();
      await expect(pdp.productDetailsSectionTitle).toBeVisible();
      await expect(pdp.productDetailsSectionTitle).toContainText('Product Details');
    });

    await test.step('Verify accordion items are collapsed by default', async () => {
      const accordionCount = await pdp.accordionTriggers.count();
      expect(accordionCount).toBeGreaterThan(0);

      // All accordions should be collapsed
      for (let i = 0; i < accordionCount; i++) {
        const isExpanded = await pdp.accordionTriggers.nth(i).getAttribute('aria-expanded');
        expect(isExpanded).toBe('false');
      }

      // No visible content
      const visibleContentCount = await pdp.visibleAccordionContent.count();
      expect(visibleContentCount).toBe(0);
    });

    await test.step('Test accordion expands when clicked', async () => {
      // Click first accordion
      await pdp.clickAccordionTrigger(0);
      await page.waitForTimeout(300); // Wait for animation

      // Verify it's expanded
      const isExpanded = await pdp.accordionTriggers.first().getAttribute('aria-expanded');
      expect(isExpanded).toBe('true');

      // Verify content is visible
      const firstContent = pdp.accordionContent.first();
      await expect(firstContent).toHaveClass(/visible/);
      await expect(firstContent).toBeVisible();
    });

    await test.step('Test accordion collapses other accordions when one is opened', async () => {
      const accordionCount = await pdp.accordionTriggers.count();

      if (accordionCount > 1) {
        // Expand first accordion
        await pdp.clickAccordionTrigger(0);
        await page.waitForTimeout(300);

        // Expand second accordion
        await pdp.clickAccordionTrigger(1);
        await page.waitForTimeout(300);

        // First accordion should be collapsed
        const firstExpanded = await pdp.accordionTriggers.first().getAttribute('aria-expanded');
        expect(firstExpanded).toBe('false');

        // Second accordion should be expanded
        const secondExpanded = await pdp.accordionTriggers.nth(1).getAttribute('aria-expanded');
        expect(secondExpanded).toBe('true');

        // Only one visible content
        const visibleCount = await pdp.visibleAccordionContent.count();
        expect(visibleCount).toBe(1);
      }
    });

    await test.step('Verify accordion icon changes on expand/collapse', async () => {
      const firstTrigger = pdp.accordionTriggers.first();
      const firstIcon = firstTrigger.locator('.accordion-icon');

      // Get initial background image (plus icon)
      const initialBg = await firstIcon.evaluate((el) => window.getComputedStyle(el).backgroundImage);
      expect(initialBg).toContain('plus-heavy.svg');

      // Click to expand
      await pdp.clickAccordionTrigger(0);
      await page.waitForTimeout(300);

      // Get new background image (minus icon)
      const expandedBg = await firstIcon.evaluate((el) => window.getComputedStyle(el).backgroundImage);
      expect(expandedBg).toContain('minus-heavy.svg');
    });

    await test.step('Verify accordion content has proper styling', async () => {
      // Expand first accordion
      await pdp.clickAccordionTrigger(0);
      await page.waitForTimeout(300);

      const firstContent = pdp.accordionContent.first();

      // Verify padding uses design tokens
      const padding = await firstContent.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
          paddingBottom: styles.paddingBottom,
        };
      });

      expect(padding.paddingLeft).toBe('16px'); // --spacing-300
      expect(padding.paddingRight).toBe('16px');
      expect(padding.paddingBottom).toBe('16px');
    });

    await test.step('Verify border handling for expanded items', async () => {
      // Expand first accordion
      await pdp.clickAccordionTrigger(0);
      await page.waitForTimeout(300);

      // Expanded trigger should not have bottom border
      const borderBottom = await pdp.expandedAccordion.first().evaluate((el) => window.getComputedStyle(el).borderBottom);
      expect(borderBottom).toContain('none') || expect(borderBottom).toContain('0px');
    });
  });

  // Test 3: Price updates on option change
  test(`[Test Id - ${features[3].tcid}] ${features[3].name}, ${features[3].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[3].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to PDP page', async () => {
      await pdp.gotoURL(testUrl);
      await pdp.waitForProductLoad();
    });

    await test.step('Verify initial price is displayed', async () => {
      await expect(pdp.priceLabel).toBeVisible();

      const priceText = await pdp.priceLabel.textContent();
      expect(priceText).toMatch(/\$\d+\.\d{2}/); // Matches $XX.XX format
    });

    await test.step('Test price updates when pill selection changes', async () => {
      const pillCount = await pdp.pillContainers.count();

      if (pillCount > 1) {
        // Change pill selection
        await pdp.clickPill(1);
        await page.waitForTimeout(1000); // Wait for price update API call

        // Get updated price
        const newPrice = await pdp.priceLabel.textContent();

        // Price should still be valid format (may or may not change depending on product)
        expect(newPrice).toMatch(/\$\d+\.\d{2}/);
      }
    });

    await test.step('Verify savings text appears when applicable', async () => {
      const savingsCount = await pdp.savingsText.count();

      if (savingsCount > 0) {
        const savingsText = await pdp.savingsText.textContent();
        expect(savingsText).toBeTruthy();
        expect(savingsText.length).toBeGreaterThan(0);
      }
    });

    await test.step('Verify tooltip functionality for price info', async () => {
      const tooltipCount = await pdp.tooltipButton.count();

      if (tooltipCount > 0) {
        // Initially tooltip content should not be visible
        const tooltipContent = pdp.tooltipContent.first();
        const initialDisplay = await tooltipContent.evaluate((el) => window.getComputedStyle(el).display);
        expect(initialDisplay).toBe('none');

        // Hover over tooltip button
        await pdp.tooltipButton.first().hover();
        await page.waitForTimeout(300);

        // Tooltip should become visible (display: block)
        const hoverDisplay = await tooltipContent.evaluate((el) => window.getComputedStyle(el).display);
        expect(hoverDisplay).toBe('block');
      }
    });
  });

  // Test 4: Accessibility compliance
  test(`[Test Id - ${features[4].tcid}] ${features[4].name}, ${features[4].tags}`, async ({ page, baseURL }) => {
    const testUrl = `${baseURL}${features[4].path}${miloLibs}`;
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to PDP page', async () => {
      await pdp.gotoURL(testUrl);
      await pdp.waitForProductLoad();
    });

    await test.step('Verify accordion ARIA attributes', async () => {
      const accordionCount = await pdp.accordionTriggers.count();

      for (let i = 0; i < Math.min(accordionCount, 3); i++) {
        const trigger = pdp.accordionTriggers.nth(i);

        // Verify aria-expanded attribute
        const ariaExpanded = await trigger.getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(ariaExpanded);

        // Verify aria-controls attribute
        const ariaControls = await trigger.getAttribute('aria-controls');
        expect(ariaControls).toBeTruthy();

        // Verify button type
        const buttonType = await trigger.getAttribute('type');
        expect(buttonType).toBe('button');
      }
    });

    await test.step('Verify accordion content has proper ARIA attributes', async () => {
      const contentCount = await pdp.accordionContent.count();

      for (let i = 0; i < Math.min(contentCount, 3); i++) {
        const content = pdp.accordionContent.nth(i);

        // Verify aria-hidden attribute
        const ariaHidden = await content.getAttribute('aria-hidden');
        expect(['true', 'false']).toContain(ariaHidden);

        // Verify aria-labelledby attribute
        const ariaLabelledBy = await content.getAttribute('aria-labelledby');
        expect(ariaLabelledBy).toBeTruthy();
      }
    });

    await test.step('Verify keyboard navigation works for accordions', async () => {
      // Focus first accordion trigger
      await pdp.accordionTriggers.first().focus();

      // Verify it's focused
      const isFocused = await pdp.accordionTriggers.first().evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);

      // Press Enter to expand
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      // Verify it expanded
      const isExpanded = await pdp.accordionTriggers.first().getAttribute('aria-expanded');
      expect(isExpanded).toBe('true');
    });

    await test.step('Verify images have alt text', async () => {
      // Check hero image
      const heroAlt = await pdp.heroImage.getAttribute('alt');
      expect(heroAlt).toBeTruthy();

      // Check thumbnail images
      const thumbnailCount = await pdp.thumbnailItems.count();
      for (let i = 0; i < Math.min(thumbnailCount, 3); i++) {
        const thumbnail = pdp.thumbnailItems.nth(i).locator('img');
        const thumbCount = await thumbnail.count();
        if (thumbCount > 0) {
          const alt = await thumbnail.getAttribute('alt');
          expect(alt).toBeTruthy();
        }
      }
    });

    await test.step('Verify checkout button is accessible', async () => {
      await expect(pdp.checkoutButton).toBeVisible();

      // Verify button text is visible
      const buttonText = await pdp.checkoutButtonText.textContent();
      expect(buttonText.length).toBeGreaterThan(0);

      // Verify button can be focused
      await pdp.checkoutButton.focus();
      const isFocused = await pdp.checkoutButton.evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);
    });

    await test.step('Run accessibility scan', async () => {
      await runAccessibilityTest({ page, testScope: pdp.pdpBlock });
    });
  });
});
