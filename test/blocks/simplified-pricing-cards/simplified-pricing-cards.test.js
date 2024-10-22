import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { mockRes } from '../test-utilities.js';
import sinon from 'sinon'; 

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };

const  { getLibs } = await import('../../../express/scripts/utils.js');
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = { locales };
  mod.setConfig(conf);
});

const { default: decorate } = await import('../../../../express/blocks/simplified-pricing-cards/simplified-pricing-cards.js');
document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const MOCK_JSON = JSON.parse(await readFile({path : "./mocks/mock_offers_one.json"}))


describe('Pricing Cards', () => {
  let blocks;
  let cardCnts; 

  before(async () => {
    window.isTestEnv = true;
    blocks = Array.from(document.querySelectorAll('.simplified-pricing-cards'));
    window.fetch = sinon.stub().callsFake(() => mockRes({
      payload:  MOCK_JSON,
    }));
    await Promise.all(blocks.map((block) => decorate(block)));

  });

  afterEach(() => {
    // Restore the original functionality after each test
  });

  it('Pricing Cards exists', () => {
    expect(blocks.every((block) => !!block.querySelector('div.card'))).to.be.true;
  });

  it(`Card counts to be ${cardCnts}`, () => {
    const cards = document.querySelectorAll('.card');
    expect(cards.length).to.equal(4);
  });

  it('Cards contain necessary elements', () => {
    blocks.forEach((block) => {
      const cardContainer = block.querySelector('div.card-wrapper');
      expect(cardContainer).to.exist;
      const cards = cardContainer.querySelectorAll('.card');

      cards.forEach((card) => {
        expect(card.querySelector('.card-header')).to.exist;
        expect(card.querySelector('.plan-explanation')).to.exist;
        expect(card.querySelector('.pricing-area')).to.exist;
        expect(card.querySelector('.card-cta-group')).to.exist;
      });

      expect(block.querySelectorAll('.compare-all-button')).to.exist;
    });
  });

  it('Special and gradient promo classes are added', () => {
    expect(document.querySelectorAll('.gradient-promo')).to.have.lengthOf.at.least(2);
  });
});
