import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { delay } from '../../helpers/waitfor.js';

const imports = await Promise.all([import('../../../express/code/scripts/utils.js'), import('../../../express/code/scripts/scripts.js')]);
const { getLibs } = imports[0];
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = {};
  mod.setConfig(conf);
});
const [{ default: decorate }] = await Promise.all([import('../../../express/code/blocks/grid-marquee/grid-marquee.js')]);
document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('grid-marquee', () => {
  let block;
  const oldIO = window.IntersectionObserver;
  const cbs = [];
  before(async () => {
    window.placeholders = {
      'app-store-ratings':
        '4.9, 233.8k ratings; 4.6, 117k ratings; https://adobesparkpost.app.link/GJrBPFUWBBb',
        'app-store-stars' : "test",
       'app-store-ratings-play-store' : "test",
        'app-store-ratings-apple-store': "test",
    };
    const mockIntersectionObserver = class {
      items = [];

      constructor(cb) {
        cbs.push(cb);
      }

      observe(item) {
        this.items.push(item);
      }
    };
    window.IntersectionObserver = mockIntersectionObserver;
    block = document.querySelector('.grid-marquee');
    await decorate(block);
  });
  after(() => {
    window.IntersectionObserver = oldIO;
  });
  it('has a background image', async () => {
    const background = block.querySelector('.background');
    expect(background).to.exist;
    expect(background.querySelector('img')).to.exist;
  });
  it('has a foreground', () => {
    const foreground = block.querySelector('.foreground');
    expect(foreground).to.exist;
    expect(foreground.querySelector('.headline')).to.exist;
    expect(foreground.querySelector('.cards-container')).to.exist;
  });
  it('decorates cards', () => {
    const cardsContainer = block.querySelector('.cards-container');
    const cards = [...cardsContainer.querySelectorAll('.card')];
    cards.forEach((card) => {
      expect(card.querySelector('.face')).to.exist;
    });
  });
  it('creates drawer when in view', async () => {
    expect(block.querySelector('.drawer .content')).to.not.exist;
    cbs[0]([{ target: block, isIntersecting: true }], { unobserve: () => {} });
    await delay(310);
    expect(block.querySelectorAll('.drawer .content').length).to.equal(4);

    const drawers = [...block.querySelectorAll('.drawer')];
    drawers.forEach((drawer) => {
      expect(drawer.querySelector('.title-row')).to.exist;
      expect(drawer.querySelector('.video-container')).to.exist;
      expect(drawer.querySelector('.panel')).to.exist;
    });
  });
  it('expands drawer when interacted', () => {
    const card = block.querySelector('.card');
    const drawer = block.querySelector('.drawer');
    expect(card.getAttribute('aria-expanded')).to.equal('false');
    expect(drawer.classList.contains('hide')).to.be.true;
    card.click();
    expect(drawer.classList.contains('hide')).to.be.false;
    expect(card.getAttribute('aria-expanded')).to.equal('true');
    card.click();
  });
  it('collapses and expands drawer', () => {
    const card = block.querySelector('.card');
    const drawer = block.querySelector('.drawer');
    card.click();
    expect(drawer.classList.contains('hide')).to.be.false;
    expect(card.getAttribute('aria-expanded')).to.equal('true');
    card.querySelector("button[aria-label='close']").click();
    expect(drawer.classList.contains('hide')).to.be.true;
    expect(card.getAttribute('aria-expanded')).to.equal('false');
    card.click();
    expect(drawer.classList.contains('hide')).to.be.false;
    expect(card.getAttribute('aria-expanded')).to.equal('true');
    block.querySelector('.headline').click();
    expect(drawer.classList.contains('hide')).to.be.true;
    expect(card.getAttribute('aria-expanded')).to.equal('false');

    card.dispatchEvent(new Event('mouseenter'));
    expect(drawer.classList.contains('hide')).to.be.false;
    expect(card.getAttribute('aria-expanded')).to.equal('true');
    card.querySelector("button[aria-label='close']").click();
  });
  it('splits card content by tabs when more than 1 col is authored', () => {
    const card = block.querySelectorAll('.card')[1];
    const drawer = block.querySelectorAll('.drawer')[1];
    card.click();
    const tablist = drawer.querySelector("[role='tablist']");
    expect(tablist).to.exist;
    const tabs = tablist.querySelectorAll("button[role='tab']");
    expect(tabs.length).to.equal(2);
    const panels = drawer.querySelectorAll("[role='tabpanel']");
    expect(panels.length).to.equal(2);
    expect(tabs[0].getAttribute('aria-selected')).to.equal('true');
    expect(tabs[1].getAttribute('aria-selected')).to.equal('false');
    expect(panels[0].classList.contains('hide')).to.be.false;
    expect(panels[1].classList.contains('hide')).to.be.true;
    tabs[0].click();
    expect(tabs[0].getAttribute('aria-selected')).to.equal('true');
    expect(tabs[1].getAttribute('aria-selected')).to.equal('false');
    expect(panels[0].classList.contains('hide')).to.be.false;
    expect(panels[1].classList.contains('hide')).to.be.true;
    tabs[1].click();
    expect(tabs[0].getAttribute('aria-selected')).to.equal('false');
    expect(tabs[1].getAttribute('aria-selected')).to.equal('true');
    expect(panels[0].classList.contains('hide')).to.be.true;
    expect(panels[1].classList.contains('hide')).to.be.false;
  });
  it('displays ratings for ratings variant', () => {
    expect(block.querySelector('.ratings img')).to.exist;
  });
});
