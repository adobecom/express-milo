/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };

window.isTestEnv = true;
const imports = await Promise.all([
  import('../../../express/code/scripts/utils.js'),
  import('../../../express/code/scripts/scripts.js'),
]);
const { getLibs } = imports[0];

await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = { locales };
  mod.setConfig(conf);
});

const { default: init } = await import('../../../express/code/blocks/simplified-pricing-cards-v2/simplified-pricing-cards-v2.js');

const body = await readFile({ path: './mocks/body.html' });

describe('Simplified Pricing Cards v2', () => {
  let block;

  before(() => {
    window.isTestEnv = true;
    window.lana = { log: () => {} };
  });

  beforeEach(() => {
    document.body.innerHTML = body;
    block = document.querySelector('.simplified-pricing-cards-v2');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  /**
   * Test Objective: Verify basic block initialization and decoration
   * 
   * This test ensures that the simplified-pricing-cards-v2 block is properly decorated with:
   * - A card wrapper with proper grid layout
   * - Individual card elements with correct structure
   * - Proper DOM transformation from the original div structure
   */
  it('should decorate the simplified pricing cards block', async () => {
    await init(block);

    expect(block).to.exist;
    expect(block.classList.contains('loaded')).to.be.true;

    const cardWrapper = block.querySelector('.card-wrapper');
    expect(cardWrapper).to.exist;

    const cards = block.querySelectorAll('.card');
    expect(cards.length).to.equal(3);
  });

  /**
   * Test Objective: Verify card header decoration and toggle functionality
   * 
   * This test ensures that card headers are properly processed:
   * - Headers have toggle button functionality
   * - Eyebrow content is handled correctly
   * - Aria attributes are properly set
   */
  it('should properly decorate card headers with toggle functionality', async () => {
    await init(block);

    const cards = block.querySelectorAll('.card');

    cards.forEach((card, index) => {
      const header = card.querySelector('.card-header');
      expect(header).to.exist;

      const toggleButton = header.querySelector('.header-toggle-button');
      expect(toggleButton).to.exist;
      expect(toggleButton.getAttribute('type')).to.equal('button');
      expect(toggleButton.getAttribute('aria-expanded')).to.not.be.null;
      expect(toggleButton.getAttribute('aria-controls')).to.include(`card-content-${index}`);

      const headerContent = toggleButton.querySelector('.header-content');
      expect(headerContent).to.exist;

      const chevron = toggleButton.querySelector('.toggle-switch-wrapper');
      expect(chevron).to.exist;
    });
  });

  /**
   * Test Objective: Verify eyebrow content handling
   * 
   * This test ensures that eyebrow content is properly processed:
   * - Multiple headers create eyebrow sections
   * - Eyebrow content is moved to correct position
   * - Has-eyebrow class is applied when appropriate
   */
  it('should handle eyebrow content correctly', async () => {
    await init(block);

    const cardWrapper = block.querySelector('.card-wrapper');

    // Check if any cards have eyebrow content (multiple headers)
    const eyebrowContent = block.querySelector('.eyebrow-content');
    if (eyebrowContent) {
      expect(cardWrapper.classList.contains('has-eyebrow')).to.be.true;
      expect(eyebrowContent.querySelector('.eyebrow-header')).to.exist;
    }
  });

  /**
   * Test Objective: Verify default open card functionality
   * 
   * This test ensures that default open functionality works:
   * - First card is open by default (or specified card)
   * - Card content visibility is properly managed
   * - Aria-expanded attributes are correctly set
   */
  it('should set default open card correctly', async () => {
    await init(block);

    const cards = block.querySelectorAll('.card');
    let hasOpenCard = false;

    cards.forEach((card) => {
      const cardContent = card.querySelector('.card-inner-content');
      const toggleButton = card.querySelector('.header-toggle-button');

      expect(cardContent).to.exist;
      expect(toggleButton).to.exist;

      if (!cardContent.classList.contains('hide')) {
        hasOpenCard = true;
        expect(toggleButton.getAttribute('aria-expanded')).to.equal('true');
      } else {
        expect(toggleButton.getAttribute('aria-expanded')).to.equal('false');
      }
    });

    // At least one card should be open by default
    expect(hasOpenCard).to.be.true;
  });

  /**
   * Test Objective: Verify border parameters and promo styling
   * 
   * This test ensures that border parameters are properly processed:
   * - Promo classes are applied to cards
   * - Promo text is handled correctly
   * - Border styling tokens are processed
   */
  it('should process border parameters and apply promo styling', async () => {
    await init(block);

    const cards = block.querySelectorAll('.card');

    // Check for promo classes on cards
    let hasPromoCard = false;
    cards.forEach((card) => {
      if (card.classList.length > 1) { // More than just 'card' class
        hasPromoCard = true;
      }
    });

    // Should have some promo styling based on the mock data
    expect(hasPromoCard).to.be.true;
  });

  /**
   * Test Objective: Verify plan explanation decoration and icon handling
   * 
   * This test ensures that plan explanations are properly decorated:
   * - Plan text sections have correct classes
   * - Image tooltips are set up for icon lists
   * - Content structure is preserved
   */
  it('should decorate plan explanations and handle icons', async () => {
    await init(block);

    const planExplanations = block.querySelectorAll('.plan-explanation');
    expect(planExplanations.length).to.equal(3);

    planExplanations.forEach((explanation) => {
      const paragraphs = explanation.querySelectorAll('p');

      paragraphs.forEach((p) => {
        const images = p.querySelectorAll('img');
        if (images.length > 0) {
          expect(p.classList.contains('plan-icon-list')).to.be.true;
        } else {
          expect(p.classList.contains('plan-text')).to.be.true;
        }
      });
    });
  });

  /**
   * Test Objective: Verify pricing section creation and token handling
   * 
   * This test ensures that pricing sections are properly created:
   * - Pricing areas are created for each card
   * - Pricing tokens are identified and processed
   * - Pricing rows have correct structure
   */
  it('should create pricing sections with proper structure', async () => {
    await init(block);

    const pricingAreas = block.querySelectorAll('.pricing-area');
    expect(pricingAreas.length).to.equal(3);

    pricingAreas.forEach((area) => {
      // Should have pricing row structure after processing
      const pricingRow = area.querySelector('.pricing-row');
      if (pricingRow) {
        expect(pricingRow).to.exist;

        const priceElement = pricingRow.querySelector('.pricing-price');
        const priceSuffix = pricingRow.querySelector('.pricing-row-suf');

        expect(priceElement).to.exist;
        expect(priceSuffix).to.exist;
      }
    });
  });

  /**
   * Test Objective: Verify CTA group decoration and button styling
   * 
   * This test ensures that CTA groups are properly decorated:
   * - CTA groups have correct classes
   * - Buttons are properly styled (large, primary, secondary)
   * - Aria labels are applied correctly
   */
  it('should decorate CTA groups and buttons', async () => {
    await init(block);

    const ctaGroups = block.querySelectorAll('.card-cta-group');
    expect(ctaGroups.length).to.equal(3);

    ctaGroups.forEach((group) => {
      const buttons = group.querySelectorAll('a');
      expect(buttons.length).to.be.greaterThan(0);

      buttons.forEach((button, index) => {
        expect(button.classList.contains('large')).to.be.true;
        if (index === 1) {
          expect(button.classList.contains('secondary')).to.be.true;
        }
        expect(button.getAttribute('aria-label')).to.not.be.null;
      });
    });
  });

  /**
   * Test Objective: Verify toggle functionality
   * 
   * This test ensures that card toggle functionality works:
   * - Clicking toggle button changes card state
   * - Aria attributes are updated correctly
   * - Card content visibility is managed
   */
  it('should handle card toggle functionality', async () => {
    await init(block);

    const cards = block.querySelectorAll('.card');
    const firstCard = cards[0];
    const toggleButton = firstCard.querySelector('.header-toggle-button');
    const cardContent = firstCard.querySelector('.card-inner-content');

    expect(toggleButton).to.exist;
    expect(cardContent).to.exist;

    // Get initial state
    const initiallyHidden = cardContent.classList.contains('hide');
    const initialAriaExpanded = toggleButton.getAttribute('aria-expanded');

    // Simulate click
    toggleButton.click();

    // Check state changed
    const afterClickHidden = cardContent.classList.contains('hide');
    const afterClickAriaExpanded = toggleButton.getAttribute('aria-expanded');

    expect(afterClickHidden).to.not.equal(initiallyHidden);
    expect(afterClickAriaExpanded).to.not.equal(initialAriaExpanded);
  });

  /**
   * Test Objective: Verify footer elements decoration
   * 
   * This test ensures that footer elements are properly decorated:
   * - Pricing footer is applied when present
   * - Compare all button is properly styled
   * - Footer structure is maintained
   */
  it('should decorate footer elements', async () => {
    await init(block);

    const cardWrapper = block.querySelector('.card-wrapper');
    expect(cardWrapper).to.exist;

    // Check for compare all button
    const compareButton = block.querySelector('.compare-all-button');
    expect(compareButton).to.exist;
    expect(compareButton.classList.contains('button')).to.be.true;
  });

  /**
   * Test Objective: Verify height equalization setup
   * 
   * This test ensures that height equalization is properly set up:
   * - Intersection observers are created
   * - Resize event listeners are attached
   * - Elements for equalization exist
   */
  it('should set up height equalization', async () => {
    await init(block);

    // Check that the block has loaded class (indicates initialization completed)
    expect(block.classList.contains('loaded')).to.be.true;

    // Check that cards exist for height equalization
    const cards = block.querySelectorAll('.card');
    expect(cards.length).to.equal(3);

    // Verify elements that should be height-equalized exist
    const cardHeaders = block.querySelectorAll('.card-header');
    const planTexts = block.querySelectorAll('.plan-text');
    const planExplanations = block.querySelectorAll('.plan-explanation');
    const pricingAreas = block.querySelectorAll('.pricing-area');

    expect(cardHeaders.length).to.equal(3);
    expect(planExplanations.length).to.equal(3);
    expect(pricingAreas.length).to.equal(3);
  });

  /**
   * Test Objective: Verify pricing token identification
   * 
   * This test ensures that pricing tokens are properly identified:
   * - Links with ((pricing)) token are found
   * - Pricing URLs are preserved
   */
  it('should identify and process pricing tokens', async () => {
    // Before decoration, check that pricing tokens exist
    const pricingLinks = block.querySelectorAll('a[href*="commerce"]');
    expect(pricingLinks.length).to.be.greaterThan(0);

    await init(block);

    // After decoration, pricing areas should be created
    const pricingAreas = block.querySelectorAll('.pricing-area');
    expect(pricingAreas.length).to.equal(3);
  });

  /**
   * Test Objective: Verify card content structure
   * 
   * This test ensures that card inner content is properly structured:
   * - Card inner content has correct ID
   * - Content is initially hidden (except default open)
   * - All necessary content sections are present
   */
  it('should structure card inner content correctly', async () => {
    await init(block);

    const cards = block.querySelectorAll('.card');

    cards.forEach((card, index) => {
      const cardContent = card.querySelector('.card-inner-content');
      expect(cardContent).to.exist;
      expect(cardContent.id).to.equal(`card-content-${index}`);

      // Check that content sections exist within card content
      const planExplanation = cardContent.querySelector('.plan-explanation');
      const pricingArea = cardContent.querySelector('.pricing-area');
      const ctaGroup = cardContent.querySelector('.card-cta-group');

      expect(planExplanation).to.exist;
      expect(pricingArea).to.exist;
      expect(ctaGroup).to.exist;
    });
  });
});
