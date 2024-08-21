import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';

const { default: decorate, windowHelper } = await import(
  '../../../../express/blocks/gen-ai-cards/gen-ai-cards.js'
);
const testBody = await readFile({ path: './mocks/body.html' });

describe('Gen AI Cards', () => {
  let blocks;
  before(async () => {
    window.isTestEnv = true;
    document.body.innerHTML = testBody;
    window.placeholders = { 'search-branch-links': 'https://adobesparkpost.app.link/c4bWARQhWAb' };
    blocks = [...document.querySelectorAll('.gen-ai-cards')];
    await Promise.all(blocks.map((bl) => decorate(bl)));
  });
  afterEach(() => {
    window.placeholders = undefined;
  });

  it('should have all things', async () => {
    for (const block of blocks) {
      expect(block).to.exist;
      expect(block.querySelector('.gen-ai-cards-heading-section')).to.exist;
      const cards = block.querySelector('.carousel-container .carousel-platform');
      expect(cards).to.exist;
      expect(cards.querySelectorAll('.card').length).to.equal(5);
      expect(cards.querySelector('.card').classList.contains('gen-ai-action')).to.be.true;
      expect(cards.querySelectorAll('.card')[1].classList.contains('gen-ai-action')).to.be.false;
      expect(cards.querySelectorAll('.card')[2].classList.contains('gen-ai-action')).to.be.true;
      expect(cards.querySelectorAll('.card')[3].classList.contains('gen-ai-action')).to.be.true;
    }
  });

  it('should have all cards with proper children', async () => {
    for (const block of blocks) {
      const cards = block.querySelector('.carousel-container .carousel-platform');
      for (const card of cards.querySelectorAll('.card')) {
        expect(card.querySelector('.text-wrapper .cta-card-desc')).to.exist;
        expect(card.querySelector('.text-wrapper .cta-card-title')).to.exist;
        expect(card.querySelector('.media-wrapper picture')).to.exist;
      }
      for (const card of cards.querySelectorAll('.card:not(.gen-ai-action)')) {
        const cta = card.querySelector('.links-wrapper a');
        expect(cta).to.exist;
        expect(cta.textContent).to.exist;
        expect(cta.href).to.exist;
      }
      for (const card of cards.querySelectorAll('.card.gen-ai-action')) {
        const form = card.querySelector('.gen-ai-input-form');
        expect(form).to.exist;
        const input = form.querySelector('input');
        const button = form.querySelector('button');
        expect(input).to.exist;
        expect(button).to.exist;
        expect(input.placeholder).to.exist;
        expect(button.textContent).to.exist;
        expect(button.classList.contains('gen-ai-submit')).to.be.true;
      }
    }
  });

  function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  it('should toggle submit button disabled based on input content', async () => {
    for (const block of blocks) {
      const cards = block.querySelector('.carousel-container .carousel-platform');
      const card = cards.querySelector('.card.gen-ai-action');
      const form = card.querySelector('.gen-ai-input-form');
      const input = form.querySelector('input');
      const button = form.querySelector('button');
      const stub = sinon.stub(windowHelper, 'redirect');
      expect(button.disabled).to.be.true;
      const enterEvent = new KeyboardEvent('keyup', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(enterEvent);
      expect(button.disabled).to.be.true;
      expect(stub.called).to.be.false;
      form.dispatchEvent(new Event('submit'));
      expect(stub.called).to.be.false;

      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      expect(button.disabled).to.be.false;

      input.value = '';
      input.dispatchEvent(new Event('input'));
      expect(button.disabled).to.be.true;
      input.value = 'fakeInput';
      input.dispatchEvent(enterEvent);
      expect(stub.called).to.be.true;
      expect(decodeHTMLEntities(stub.firstCall.args[0])).to.equal(
        decodeHTMLEntities('https://new.express.adobe.com/new?category=media&#x26;prompt=fakeInput&#x26;action=text+to+image&#x26;width=1080&#x26;height=1080'),
      );

      stub.restore();
    }
  });
});
