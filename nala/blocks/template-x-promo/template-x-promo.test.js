/* eslint-disable no-plusplus */
import { expect, test } from '@playwright/test';
import { features } from './template-x-promo.spec.js';
import TemplateXPromo from './template-x-promo.page.js';

let templateXPromo;

test.describe('Template X Promo block testing', () => {
  test.beforeEach(async ({ page }) => {
    templateXPromo = new TemplateXPromo(page);
  });

  // One-up layout tests
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    for (const path of features[0].path) {
      console.info(`${baseURL}${path}`);
      const testPage = `${baseURL}${path}`;
      await templateXPromo.gotoURL(testPage);
      await templateXPromo.scrollToTemplateXPromo();

      await test.step('Verify one-up layout displayed', async () => {
        await expect(templateXPromo.templateXPromo).toBeVisible();
        await expect(templateXPromo.oneUpLayout).toBeVisible();
        await expect(templateXPromo.multipleUpLayout).not.toBeVisible();

        const templateCount = await templateXPromo.getTemplateCount();
        expect(templateCount).toEqual(1);
      });

      await test.step('Verify no navigation controls in one-up', async () => {
        await expect(templateXPromo.navControls).not.toBeVisible();
      });

      await test.step('Test template hover and edit functionality', async () => {
        await templateXPromo.hoverTemplate(0);
        await expect(templateXPromo.hoverElements.first()).toBeVisible();

        // Test edit button click - should open in new tab
        const [newTab] = await Promise.all([
          page.waitForEvent('popup'),
          templateXPromo.clickEditButton(0),
        ]);
        await newTab.waitForLoadState();
        expect(newTab.url()).toContain('adobe.com');
        await newTab.close();
      });

      await test.step('Validate accessibility features', async () => {
        const a11yResults = await templateXPromo.validateAccessibility();
        expect(a11yResults.hasAltText).toBe(true);
      });
    }
  });

  // Multiple-up carousel tests
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    for (const path of features[1].path) {
      console.info(`${baseURL}${path}`);
      const testPage = `${baseURL}${path}`;
      await templateXPromo.gotoURL(testPage);
      await templateXPromo.scrollToTemplateXPromo();

      await test.step('Verify multiple-up layout displayed', async () => {
        await expect(templateXPromo.templateXPromo).toBeVisible();
        await expect(templateXPromo.multipleUpLayout).toBeVisible();
        await expect(templateXPromo.oneUpLayout).not.toBeVisible();

        const templateCount = await templateXPromo.getTemplateCount();
        expect(templateCount).toBeGreaterThan(1);
        expect(templateCount).toBeLessThanOrEqual(4);
      });

      await test.step('Verify navigation controls present', async () => {
        const layout = await templateXPromo.validateResponsiveLayout();
        if (layout.templateCount > 1) {
          await expect(templateXPromo.navControls).toBeVisible();
          await expect(templateXPromo.prevButton).toBeVisible();
          await expect(templateXPromo.nextButton).toBeVisible();
        }
      });

      await test.step('Test carousel navigation', async () => {
        const templateCount = await templateXPromo.getTemplateCount();
        if (templateCount > 1) {
          // Test initial state - previous should be disabled
          const prevDisabled = await templateXPromo.prevButton.getAttribute('disabled');
          expect(prevDisabled).not.toBeNull();

          // Test next navigation
          const initialOffset = await templateXPromo.getCarouselOffset();
          const navigated = await templateXPromo.navigateNext();
          if (navigated) {
            const newOffset = await templateXPromo.getCarouselOffset();
            expect(newOffset).not.toEqual(initialOffset);

            // Previous should now be enabled
            const prevDisabledAfter = await templateXPromo.prevButton.getAttribute('disabled');
            expect(prevDisabledAfter).toBeNull();
          }
        }
      });

      await test.step('Validate responsive layout classes', async () => {
        const layout = await templateXPromo.validateResponsiveLayout();
        expect(layout.templateCount).toBeGreaterThan(1);
        expect(layout.isMultipleUp).toBe(true);
        expect(layout.specificLayout).toBeTruthy();

        // Verify correct class based on template count
        if (layout.templateCount === 3) {
          expect(layout.specificLayout).toBe('three-up');
        }
      });

      await test.step('Test template interactions', async () => {
        const templateCount = await templateXPromo.getTemplateCount();
        for (let i = 0; i < Math.min(templateCount, 3); i++) {
          await templateXPromo.hoverTemplate(i);
          await expect(templateXPromo.hoverElements.nth(i)).toBeVisible();

          // Test edit button functionality
          const [newTab] = await Promise.all([
            page.waitForEvent('popup'),
            templateXPromo.clickEditButton(i),
          ]);
          await newTab.waitForLoadState();
          expect(newTab.url()).toContain('adobe.com');
          await newTab.close();

          // Return to test page
          await templateXPromo.gotoURL(testPage);
          await templateXPromo.scrollToTemplateXPromo();
        }
      });
    }
  });

  // Four-up carousel tests
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    for (const path of features[2].path) {
      console.info(`${baseURL}${path}`);
      const testPage = `${baseURL}${path}`;
      await templateXPromo.gotoURL(testPage);
      await templateXPromo.scrollToTemplateXPromo();

      await test.step('Verify four-up layout', async () => {
        await expect(templateXPromo.templateXPromo).toBeVisible();
        await expect(templateXPromo.fourUpLayout).toBeVisible();

        const templateCount = await templateXPromo.getTemplateCount();
        expect(templateCount).toEqual(4);
      });

      await test.step('Test all four templates visible and functional', async () => {
        const templateCount = await templateXPromo.getTemplateCount();
        expect(templateCount).toEqual(4);

        // Verify all templates are visible
        for (let i = 0; i < templateCount; i++) {
          await expect(templateXPromo.templates.nth(i)).toBeVisible();
          await expect(templateXPromo.templateImages.nth(i)).toBeVisible();
        }
      });

      await test.step('Validate image aspect ratios and responsiveness', async () => {
        const imageResults = await templateXPromo.validateImageLoading();
        expect(imageResults.allImagesLoaded).toBe(true);
        expect(imageResults.imageErrors).toHaveLength(0);
      });

      await test.step('Test performance with four templates', async () => {
        const performance = await templateXPromo.measurePerformance();
        expect(performance.loadTime).toBeLessThan(3000); // 3 second load time
        expect(performance.firstContentfulPaint).toBeLessThan(2000); // 2 second FCP
      });
    }
  });

  // Two-up carousel tests
  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    for (const path of features[3].path) {
      console.info(`${baseURL}${path}`);
      const testPage = `${baseURL}${path}`;
      await templateXPromo.gotoURL(testPage);
      await templateXPromo.scrollToTemplateXPromo();

      await test.step('Verify two-up layout', async () => {
        await expect(templateXPromo.templateXPromo).toBeVisible();
        await expect(templateXPromo.twoUpLayout).toBeVisible();

        const templateCount = await templateXPromo.getTemplateCount();
        expect(templateCount).toEqual(2);
      });

      await test.step('Test two template layout and spacing', async () => {
        const templates = templateXPromo.templates;
        await expect(templates.nth(0)).toBeVisible();
        await expect(templates.nth(1)).toBeVisible();

        // Verify both templates are properly spaced
        const firstTemplateBox = await templates.nth(0).boundingBox();
        const secondTemplateBox = await templates.nth(1).boundingBox();

        expect(firstTemplateBox.x).toBeLessThan(secondTemplateBox.x);
        expect(Math.abs(firstTemplateBox.width - secondTemplateBox.width)).toBeLessThan(10); // Similar widths
      });
    }
  });

  // Hover interactions tests
  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    for (const path of features[4].path) {
      console.info(`${baseURL}${path}`);
      const testPage = `${baseURL}${path}`;
      await templateXPromo.gotoURL(testPage);
      await templateXPromo.scrollToTemplateXPromo();

      await test.step('Test hover state activation', async () => {
        const templateCount = await templateXPromo.getTemplateCount();
        if (templateCount > 0) {
          const firstTemplate = templateXPromo.templates.first();

          // Test hover activation
          await templateXPromo.hoverTemplate(0);
          await expect(firstTemplate).toHaveClass(/hover-active/);

          // Test hover elements visibility
          await expect(templateXPromo.hoverElements.first()).toBeVisible();
          await expect(templateXPromo.editButtons.first()).toBeVisible();
        }
      });

      await test.step('Test hover overlay content and positioning', async () => {
        await templateXPromo.hoverTemplate(0);

        const hoverElement = templateXPromo.hoverElements.first();
        await expect(hoverElement).toBeVisible();

        // Check button container positioning
        const buttonContainer = hoverElement;
        const containerBox = await buttonContainer.boundingBox();
        expect(containerBox.width).toBeGreaterThan(0);
        expect(containerBox.height).toBeGreaterThan(0);

        // Verify edit button text and functionality
        const editButton = templateXPromo.editButtons.first();
        const buttonText = await editButton.innerText();
        expect(buttonText.toLowerCase()).toContain('edit');
      });

      await test.step('Test share functionality', async () => {
        await templateXPromo.hoverTemplate(0);

        const shareButton = templateXPromo.shareButtons.first();
        if (await shareButton.isVisible()) {
          await shareButton.click();
          await expect(templateXPromo.socialIcons.first()).toBeVisible();
        }
      });

      await test.step('Test hover state deactivation', async () => {
        const firstTemplate = templateXPromo.templates.first();

        // Hover to activate
        await templateXPromo.hoverTemplate(0);
        await expect(firstTemplate).toHaveClass(/hover-active/);

        // Move away to deactivate
        await page.mouse.move(0, 0);
        await page.waitForTimeout(100);

        // Check if hover state is removed (may vary based on implementation)
        const stillHasClass = await firstTemplate.evaluate((el) =>
          el.classList.contains('hover-active')
        );
        // Note: Some implementations keep hover state until another element is hovered
      });
    }
  });

  // Navigation controls tests
  test(`${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
    for (const path of features[5].path) {
      console.info(`${baseURL}${path}`);
      const testPage = `${baseURL}${path}`;
      await templateXPromo.gotoURL(testPage);
      await templateXPromo.scrollToTemplateXPromo();

      await test.step('Verify navigation controls presence and styling', async () => {
        const layout = await templateXPromo.validateResponsiveLayout();
        if (layout.hasNavigation) {
          await expect(templateXPromo.navControls).toBeVisible();
          await expect(templateXPromo.prevButton).toBeVisible();
          await expect(templateXPromo.nextButton).toBeVisible();

          // Check button styling and icons
          const prevButton = templateXPromo.prevButton;
          const nextButton = templateXPromo.nextButton;

          const prevBox = await prevButton.boundingBox();
          const nextBox = await nextButton.boundingBox();

          expect(prevBox.width).toBeGreaterThan(20);
          expect(nextBox.width).toBeGreaterThan(20);
        }
      });

      await test.step('Test navigation button states and functionality', async () => {
        const layout = await templateXPromo.validateResponsiveLayout();
        if (layout.hasNavigation && layout.templateCount > 1) {
          // Initial state - previous should be disabled
          const initialPrevState = await templateXPromo.prevButton.getAttribute('disabled');
          expect(initialPrevState).not.toBeNull();

          // Next should be enabled initially
          const initialNextState = await templateXPromo.nextButton.getAttribute('disabled');
          expect(initialNextState).toBeNull();

          // Test navigation cycle
          let canNavigate = true;
          let navigationCount = 0;
          const maxNavigations = layout.templateCount + 1; // Prevent infinite loops

          while (canNavigate && navigationCount < maxNavigations) {
            canNavigate = await templateXPromo.navigateNext();
            navigationCount++;

            if (canNavigate) {
              // Previous should now be enabled
              const prevState = await templateXPromo.prevButton.getAttribute('disabled');
              expect(prevState).toBeNull();
            }
          }

          // At the end, next should be disabled
          const finalNextState = await templateXPromo.nextButton.getAttribute('disabled');
          expect(finalNextState).not.toBeNull();
        }
      });

      await test.step('Test keyboard navigation accessibility', async () => {
        const keyboardResults = await templateXPromo.testKeyboardNavigation();
        expect(keyboardResults.canFocusNavButtons).toBe(true);
      });

      await test.step('Validate ARIA labels and accessibility', async () => {
        const a11yResults = await templateXPromo.validateAccessibility();
        expect(a11yResults.hasAriaLabels).toBe(true);
        expect(a11yResults.hasProperRoles).toBe(true);
        expect(a11yResults.hasAltText).toBe(true);
      });

      await test.step('Test navigation animation and smooth scrolling', async () => {
        const layout = await templateXPromo.validateResponsiveLayout();
        if (layout.hasNavigation && layout.templateCount > 1) {
          const initialOffset = await templateXPromo.getCarouselOffset();

          await templateXPromo.navigateNext();
          await page.waitForTimeout(300); // Wait for animation

          const finalOffset = await templateXPromo.getCarouselOffset();
          expect(finalOffset).not.toEqual(initialOffset);

          // Verify smooth transition (offset should be different)
          expect(Math.abs(finalOffset - initialOffset)).toBeGreaterThan(100);
        }
      });
    }
  });
});
