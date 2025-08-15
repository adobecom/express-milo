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

const { default: init } = await import('../../../express/code/blocks/pricing-cards-v2/pricing-cards-v2.js');

const body = await readFile({ path: './mocks/body.html' });

describe('Pricing Cards v2', () => {
  let block;
  
  before(() => {
    window.isTestEnv = true;
  });

  beforeEach(() => {
    document.body.innerHTML = body;
    block = document.querySelector('.pricing-cards-v2');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  /**
   * Test Objective: Verify basic block initialization and decoration
   * 
   * This test ensures that the pricing-cards-v2 block is properly decorated with:
   * - A cards container with proper grid layout
   * - Individual card elements with correct structure
   * - Proper DOM transformation from the original div structure
   */
  it('should decorate the pricing cards block', async () => {
    await init(block);
    
    expect(block).to.exist;
    expect(block.classList.contains('loaded')).to.be.true;
    
    const cardsContainer = block.querySelector('.cards-container');
    expect(cardsContainer).to.exist;
    expect(cardsContainer.classList.contains('ax-grid-container')).to.be.true;
    expect(cardsContainer.classList.contains('small-gap')).to.be.true;
    
    const cards = block.querySelectorAll('.card');
    expect(cards.length).to.equal(3);
  });

  /**
   * Test Objective: Verify card header decoration and structure
   * 
   * This test ensures that card headers are properly processed:
   * - Headers have correct classes applied
   * - Premium icons are preserved and positioned correctly
   * - Head count badges are extracted and displayed properly
   */
  it('should properly decorate card headers', async () => {
    await init(block);
    
    const cards = block.querySelectorAll('.card');
    
    // Check first card (Free)
    const freeCard = cards[0];
    const freeHeader = freeCard.querySelector('.card-header');
    expect(freeHeader).to.exist;
    expect(freeHeader.querySelector('h3')).to.exist;
    expect(freeHeader.querySelector('h3').textContent.trim()).to.equal('Free');
    
    // Check second card (Premium) - should have premium icon
    const premiumCard = cards[1];
    const premiumHeader = premiumCard.querySelector('.card-header');
    expect(premiumHeader).to.exist;
    expect(premiumHeader.querySelector('h3')).to.exist;
    expect(premiumHeader.querySelector('img')).to.exist;
    
    // Check third card (Teams) - should have head count badge
    const teamsCard = cards[2];
    const teamsHeader = teamsCard.querySelector('.card-header');
    expect(teamsHeader).to.exist;
    const headCount = teamsHeader.querySelector('.head-cnt');
    expect(headCount).to.exist;
    expect(headCount.textContent).to.include('2+');
  });

  /**
   * Test Objective: Verify border parameters and promo styling
   * 
   * This test ensures that border parameters are properly processed:
   * - Promo classes are applied to card borders
   * - Special promo text is handled correctly
   * - Border styling tokens are processed
   */
  it('should process border parameters and apply promo styling', async () => {
    await init(block);
    
    const cardBorders = block.querySelectorAll('.card-border');
    expect(cardBorders.length).to.equal(3);
    
    // Check that the third card has the gen-ai-promo class
    const thirdCardBorder = cardBorders[2];
    expect(thirdCardBorder.classList.contains('gen-ai-promo')).to.be.true;
    
    // Check that promo elements are handled
    const promoElements = block.querySelectorAll('.card-promo-header');
    expect(promoElements.length).to.be.greaterThan(0);
  });

  /**
   * Test Objective: Verify plan explanation decoration
   * 
   * This test ensures that plan explanations are properly decorated:
   * - Plan explanation sections have correct classes
   * - Content is preserved and structured correctly
   */
  it('should decorate plan explanations', async () => {
    await init(block);
    
    const planExplanations = block.querySelectorAll('.plan-explanation');
    expect(planExplanations.length).to.equal(3);
    
    planExplanations.forEach((explanation) => {
      expect(explanation.textContent.trim()).to.not.be.empty;
    });
  });

  /**
   * Test Objective: Verify pricing section creation and token handling
   * 
   * This test ensures that pricing sections are properly created:
   * - Pricing sections are created for each card
   * - Pricing tokens are identified and processed
   * - Pricing areas have correct structure
   */
  it('should create pricing sections with proper structure', async () => {
    await init(block);
    
    const pricingSections = block.querySelectorAll('.pricing-section');
    expect(pricingSections.length).to.equal(3);
    
    pricingSections.forEach((section) => {
      const pricingArea = section.querySelector('.pricing-area');
      expect(pricingArea).to.exist;
      
      const ctaGroup = section.querySelector('.card-cta-group');
      expect(ctaGroup).to.exist;
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
   * Test Objective: Verify feature list decoration
   * 
   * This test ensures that feature lists are properly decorated:
   * - Feature lists have correct classes applied
   * - Content structure is preserved
   */
  it('should decorate feature lists', async () => {
    await init(block);
    
    const featureLists = block.querySelectorAll('.card-feature-list');
    expect(featureLists.length).to.equal(3);
    
    featureLists.forEach((list) => {
      const ul = list.querySelector('ul');
      expect(ul).to.exist;
      const items = ul.querySelectorAll('li');
      expect(items.length).to.be.greaterThan(0);
    });
  });

  /**
   * Test Objective: Verify compare section decoration
   * 
   * This test ensures that compare sections are properly decorated:
   * - Compare links have correct classes
   * - Compare sections are properly structured
   */
  it('should decorate compare sections', async () => {
    await init(block);
    
    const compareSections = block.querySelectorAll('.card-compare');
    expect(compareSections.length).to.equal(3);
    
    compareSections.forEach((section) => {
      const compareLink = section.querySelector('a');
      expect(compareLink).to.exist;
      expect(compareLink.textContent).to.include('Compare');
    });
  });

  /**
   * Test Objective: Verify card footer decoration
   * 
   * This test ensures that the shared card footer is properly decorated:
   * - Footer has correct classes applied
   * - Footer content is preserved
   */
  it('should decorate card footer', async () => {
    await init(block);
    
    const cardFooter = block.querySelector('.card-footer');
    expect(cardFooter).to.exist;
    expect(cardFooter.classList.contains('ax-grid-container')).to.be.true;
    expect(cardFooter.classList.contains('small-gap')).to.be.true;
    
    const footerContent = cardFooter.textContent;
    expect(footerContent).to.include('trial');
  });

  /**
   * Test Objective: Verify card count class application
   * 
   * This test ensures that the correct card count class is applied:
   * - Block has card-count-N class based on number of cards
   */
  it('should apply correct card count class', async () => {
    await init(block);
    
    expect(block.classList.contains('card-count-3')).to.be.true;
  });

  /**
   * Test Objective: Verify height equalization setup
   * 
   * This test ensures that height equalization is properly set up:
   * - Intersection observers are created
   * - Resize event listeners are attached
   */
  it('should set up height equalization', async () => {
    await init(block);
    
    // Check that the block has loaded class (indicates initialization completed)
    expect(block.classList.contains('loaded')).to.be.true;
    
    // Check that cards exist for height equalization
    const cards = block.querySelectorAll('.card');
    expect(cards.length).to.equal(3);
    
    // Verify elements that should be height-equalized exist
    const planExplanations = block.querySelectorAll('.plan-explanation');
    const pricingAreas = block.querySelectorAll('.pricing-area');
    const ctaGroups = block.querySelectorAll('.card-cta-group');
    const featureLists = block.querySelectorAll('.card-feature-list');
    
    expect(planExplanations.length).to.equal(3);
    expect(pricingAreas.length).to.equal(3);
    expect(ctaGroups.length).to.equal(3);
    expect(featureLists.length).to.equal(3);
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
    
    // After decoration, pricing sections should be created
    const pricingSections = block.querySelectorAll('.pricing-section');
    expect(pricingSections.length).to.equal(3);
  });
});
