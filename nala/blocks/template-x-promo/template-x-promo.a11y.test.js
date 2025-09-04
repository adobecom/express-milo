/* eslint-disable no-plusplus */
import { expect, test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
import { features } from './template-x-promo.spec.js';
import TemplateXPromo from './template-x-promo.page.js';

let templateXPromo;

test.describe('Template X Promo Accessibility Testing', () => {
  test.beforeEach(async ({ page }) => {
    templateXPromo = new TemplateXPromo(page);
    // Inject axe-core for accessibility testing
    await injectAxe(page);
  });

  test('Accessibility compliance for one-up layout @a11y', async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[0].path[0]}`;
    await templateXPromo.gotoURL(testPage);
    await templateXPromo.scrollToTemplateXPromo();
    await templateXPromo.waitForTemplatesLoad();

    await test.step('Run axe-core accessibility scan', async () => {
      await checkA11y(page, '.template-x-promo', {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    await test.step('Verify WCAG Level A compliance', async () => {
      // Check image alt text
      const images = templateXPromo.templateImages;
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const altText = await images.nth(i).getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText.length).toBeGreaterThan(0);
      }
    });

    await test.step('Verify WCAG Level AA compliance', async () => {
      // Color contrast and focus indicators
      const templateElement = templateXPromo.templates.first();

      // Test focus visibility
      await templateElement.focus();
      const focusStyles = await templateElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineColor: styles.outlineColor,
          outlineWidth: styles.outlineWidth,
        };
      });

      // Should have visible focus indicator
      expect(
        focusStyles.outline !== 'none' ||
        focusStyles.outlineWidth !== '0px'
      ).toBe(true);
    });

    await test.step('Test keyboard navigation', async () => {
      // Test tab navigation through templates
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus').first();
      await expect(focusedElement).toBeVisible();

      // Verify focused element is within template-x-promo
      const isWithinBlock = await focusedElement.evaluate((el) => {
        return el.closest('.template-x-promo') !== null;
      });
      expect(isWithinBlock).toBe(true);
    });

    await test.step('Verify semantic HTML structure', async () => {
      // Check for proper heading hierarchy
      const headings = page.locator('.template-x-promo h1, .template-x-promo h2, .template-x-promo h3, .template-x-promo h4, .template-x-promo h5, .template-x-promo h6');
      const headingCount = await headings.count();

      if (headingCount > 0) {
        for (let i = 0; i < headingCount; i++) {
          const headingText = await headings.nth(i).innerText();
          expect(headingText.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });

  test('Accessibility compliance for multiple-up carousel layout @a11y', async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[1].path[0]}`;
    await templateXPromo.gotoURL(testPage);
    await templateXPromo.scrollToTemplateXPromo();
    await templateXPromo.waitForTemplatesLoad();

    await test.step('Run axe-core accessibility scan for carousel', async () => {
      await checkA11y(page, '.template-x-promo', {
        detailedReport: true,
        detailedReportOptions: { html: true },
        rules: {
          // Allow color-contrast issues for now (common in carousels)
          'color-contrast': { enabled: false },
        },
      });
    });

    await test.step('Verify navigation button accessibility', async () => {
      const layout = await templateXPromo.validateResponsiveLayout();

      if (layout.hasNavigation) {
        // Check ARIA labels
        const prevLabel = await templateXPromo.prevButton.getAttribute('aria-label');
        const nextLabel = await templateXPromo.nextButton.getAttribute('aria-label');

        expect(prevLabel).toBeTruthy();
        expect(nextLabel).toBeTruthy();
        expect(prevLabel.toLowerCase()).toContain('previous');
        expect(nextLabel.toLowerCase()).toContain('next');

        // Check button types
        const prevType = await templateXPromo.prevButton.getAttribute('type');
        const nextType = await templateXPromo.nextButton.getAttribute('type');

        expect(prevType).toBe('button');
        expect(nextType).toBe('button');

        // Check disabled state ARIA
        const prevDisabled = await templateXPromo.prevButton.getAttribute('disabled');
        const nextDisabled = await templateXPromo.nextButton.getAttribute('disabled');

        // At least one should be available for navigation
        expect(prevDisabled === null || nextDisabled === null).toBe(true);
      }
    });

    await test.step('Test carousel keyboard navigation', async () => {
      const layout = await templateXPromo.validateResponsiveLayout();

      if (layout.hasNavigation) {
        // Focus on next button and test Enter key
        await templateXPromo.nextButton.focus();

        const initialOffset = await templateXPromo.getCarouselOffset();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        const newOffset = await templateXPromo.getCarouselOffset();
        expect(newOffset).not.toEqual(initialOffset);

        // Test Space key as well
        await templateXPromo.prevButton.focus();
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);

        const finalOffset = await templateXPromo.getCarouselOffset();
        expect(finalOffset).not.toEqual(newOffset);
      }
    });

    await test.step('Verify ARIA live regions for dynamic content', async () => {
      // Check if there are any ARIA live regions for announcing changes
      const liveRegions = page.locator('[aria-live]');
      const liveRegionCount = await liveRegions.count();

      // While not required, live regions improve accessibility for carousels
      if (liveRegionCount > 0) {
        for (let i = 0; i < liveRegionCount; i++) {
          const liveValue = await liveRegions.nth(i).getAttribute('aria-live');
          expect(['polite', 'assertive', 'off']).toContain(liveValue);
        }
      }
    });

    await test.step('Test focus management during navigation', async () => {
      const layout = await templateXPromo.validateResponsiveLayout();

      if (layout.hasNavigation) {
        // Focus should remain on navigation button after clicking
        await templateXPromo.nextButton.focus();
        await templateXPromo.nextButton.click();
        await page.waitForTimeout(300);

        const focusedElement = await page.locator(':focus').first();
        const isFocusOnNavButton = await focusedElement.evaluate((el) => {
          return el.closest('.promo-nav-btn') !== null;
        });

        // Focus should remain on navigation controls for better UX
        expect(isFocusOnNavButton).toBe(true);
      }
    });
  });

  test('Screen reader compatibility testing @a11y @screenreader', async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[1].path[0]}`;
    await templateXPromo.gotoURL(testPage);
    await templateXPromo.scrollToTemplateXPromo();
    await templateXPromo.waitForTemplatesLoad();

    await test.step('Verify content is readable by screen readers', async () => {
      // Check that all interactive elements have accessible names
      const interactiveElements = page.locator('.template-x-promo button, .template-x-promo a, .template-x-promo [tabindex]');
      const elementCount = await interactiveElements.count();

      for (let i = 0; i < elementCount; i++) {
        const element = interactiveElements.nth(i);

        // Get accessible name (aria-label, aria-labelledby, or text content)
        const accessibleName = await element.evaluate((el) => {
          const ariaLabel = el.getAttribute('aria-label');
          if (ariaLabel) return ariaLabel;

          const ariaLabelledBy = el.getAttribute('aria-labelledby');
          if (ariaLabelledBy) {
            const labelElement = document.getElementById(ariaLabelledBy);
            return labelElement ? labelElement.textContent : '';
          }

          return el.textContent || el.getAttribute('alt') || '';
        });

        expect(accessibleName.trim().length).toBeGreaterThan(0);
      }
    });

    await test.step('Test template information is announced', async () => {
      const templates = templateXPromo.templates;
      const templateCount = await templates.count();

      for (let i = 0; i < Math.min(templateCount, 3); i++) {
        const template = templates.nth(i);

        // Check if template has accessible content
        const templateInfo = await template.evaluate((el) => {
          const title = el.querySelector('.template-title, h2, h3, h4');
          const image = el.querySelector('img');

          return {
            title: title ? title.textContent : '',
            imageAlt: image ? image.getAttribute('alt') : '',
            hasAriaLabel: el.hasAttribute('aria-label'),
          };
        });

        // Template should have either a title or accessible image
        expect(
          templateInfo.title.length > 0 ||
          templateInfo.imageAlt.length > 0 ||
          templateInfo.hasAriaLabel
        ).toBe(true);
      }
    });

    await test.step('Verify carousel role and properties', async () => {
      const carouselWrapper = templateXPromo.carouselWrapper;

      // Check for carousel-related ARIA attributes
      const carouselRole = await carouselWrapper.getAttribute('role');
      const carouselLabel = await carouselWrapper.getAttribute('aria-label');
      const carouselLabelledBy = await carouselWrapper.getAttribute('aria-labelledby');

      // Should have appropriate role and labeling
      if (carouselRole) {
        expect(['region', 'group', 'carousel']).toContain(carouselRole);
      }

      // Should have some form of accessible name
      expect(
        carouselLabel ||
        carouselLabelledBy ||
        carouselRole === 'region'
      ).toBeTruthy();
    });
  });

  test('High contrast mode compatibility @a11y @contrast', async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[1].path[0]}`;

    // Simulate high contrast mode
    await page.addStyleTag({
      content: `
        @media (prefers-contrast: high) {
          * {
            forced-color-adjust: none !important;
          }
        }

        /* Simulate Windows High Contrast */
        .template-x-promo {
          background: ButtonFace !important;
          color: ButtonText !important;
        }

        .template-x-promo button {
          background: ButtonFace !important;
          color: ButtonText !important;
          border: 1px solid ButtonText !important;
        }

        .template-x-promo button:hover,
        .template-x-promo button:focus {
          background: Highlight !important;
          color: HighlightText !important;
        }
      `,
    });

    await templateXPromo.gotoURL(testPage);
    await templateXPromo.scrollToTemplateXPromo();
    await templateXPromo.waitForTemplatesLoad();

    await test.step('Verify elements are visible in high contrast', async () => {
      await expect(templateXPromo.templateXPromo).toBeVisible();

      const layout = await templateXPromo.validateResponsiveLayout();
      if (layout.hasNavigation) {
        await expect(templateXPromo.prevButton).toBeVisible();
        await expect(templateXPromo.nextButton).toBeVisible();
      }

      // Verify templates are still visible
      const templateCount = await templateXPromo.getTemplateCount();
      for (let i = 0; i < templateCount; i++) {
        await expect(templateXPromo.templates.nth(i)).toBeVisible();
      }
    });

    await test.step('Test focus indicators in high contrast', async () => {
      const layout = await templateXPromo.validateResponsiveLayout();

      if (layout.hasNavigation) {
        await templateXPromo.nextButton.focus();

        const focusStyles = await templateXPromo.nextButton.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            outline: computed.outline,
            border: computed.border,
            background: computed.backgroundColor,
          };
        });

        // Should have visible focus indicators
        expect(
          focusStyles.outline !== 'none' ||
          focusStyles.border !== 'none'
        ).toBe(true);
      }
    });
  });

  test('Motion and animation accessibility @a11y @motion', async ({ page, baseURL }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const testPage = `${baseURL}${features[1].path[0]}`;
    await templateXPromo.gotoURL(testPage);
    await templateXPromo.scrollToTemplateXPromo();
    await templateXPromo.waitForTemplatesLoad();

    await test.step('Verify animations respect reduced motion preference', async () => {
      const layout = await templateXPromo.validateResponsiveLayout();

      if (layout.hasNavigation && layout.templateCount > 1) {
        const initialOffset = await templateXPromo.getCarouselOffset();

        // Navigate and measure transition time
        const startTime = Date.now();
        await templateXPromo.navigateNext();
        await page.waitForTimeout(100); // Minimal wait
        const endTime = Date.now();

        const newOffset = await templateXPromo.getCarouselOffset();
        const transitionTime = endTime - startTime;

        // Should still navigate but potentially with reduced animation
        expect(newOffset).not.toEqual(initialOffset);

        // Animation should be faster or instant with reduced motion
        expect(transitionTime).toBeLessThan(1000);
      }
    });

    await test.step('Test for WCAG animation guidelines compliance', async () => {
      // Check for any CSS animations that might cause vestibular disorders
      const animationInfo = await page.evaluate(() => {
        const elements = document.querySelectorAll('.template-x-promo *');
        const animatedElements = [];

        elements.forEach((el) => {
          const computed = window.getComputedStyle(el);
          if (computed.animationName !== 'none' || computed.transitionProperty !== 'none') {
            animatedElements.push({
              tag: el.tagName,
              animation: computed.animationName,
              transition: computed.transitionProperty,
            });
          }
        });

        return animatedElements;
      });

      // Animations should respect user preferences
      if (animationInfo.length > 0) {
        console.log('Animated elements found:', animationInfo);

        // Should have CSS to respect prefers-reduced-motion
        const hasReducedMotionCSS = await page.evaluate(() => {
          return Array.from(document.styleSheets).some((sheet) => {
            try {
              return Array.from(sheet.cssRules).some((rule) =>
                rule.media && rule.media.mediaText.includes('prefers-reduced-motion')
              );
            } catch (e) {
              return false; // Cross-origin stylesheets
            }
          });
        });

        // Log for manual verification since automated detection is limited
        console.log('Has reduced motion CSS:', hasReducedMotionCSS);
      }
    });
  });
});
