/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const [, { default: decorate, replacePromptTokenInUrl }] = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/prompt-marquee/prompt-marquee.js'),
]);

const base = await readFile({ path: './mocks/base.html' });

describe('Prompt Marquee block', () => {
  let originalLocationAssignHook;
  let originalMatchMedia;

  beforeEach(() => {
    window.isTestEnv = true;
    originalMatchMedia = window.matchMedia;
    window.matchMedia = (query) => ({
      matches: /min-width:\s*900px/.test(query),
      media: query,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    });
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1200,
    });
    originalLocationAssignHook = window._locationAssign;
    document.body.innerHTML = base;
  });

  afterEach(() => {
    if (typeof originalLocationAssignHook === 'function') {
      window._locationAssign = originalLocationAssignHook;
    } else {
      delete window._locationAssign;
    }
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    } else {
      delete window.matchMedia;
    }
    delete window.innerWidth;
    document.body.innerHTML = '';
  });

  it('decorates background row and columns', async () => {
    const block = document.getElementById('prompt-marquee-block');
    const originalRowCount = block.children.length;
    await decorate(block);

    expect(block.classList.contains('width-2-columns')).to.be.true;
    expect(block.children.length).to.equal(originalRowCount - 1);
    const background = block.style.getPropertyValue('--bg-image');
    expect(background).to.contain('url(');
    expect(background).to.contain('width=');

    const columns = block.querySelectorAll('.column');
    expect(columns.length).to.be.greaterThan(0);
    const pictureColumn = block.querySelector('.column-picture');
    expect(pictureColumn).to.exist;
    const img = pictureColumn.querySelector('img');
    expect(img.getAttribute('width')).to.equal('571');
    expect(img.getAttribute('loading')).to.equal('eager');
    expect(img.getAttribute('fetchpriority')).to.equal('high');
  });

  it('injects input and rewrites CTA using input value', async () => {
    const block = document.getElementById('prompt-marquee-block');
    await decorate(block);

    const cta = block.querySelector('a.button, a.con-button');
    expect(cta).to.exist;
    expect(cta.dataset.originalHref).to.equal('https://201167.prenv.projectx.corp.adobe.com/tools/logo-maker');

    const wrapper = block.querySelector('.prompt-marquee-input-wrapper');
    expect(wrapper).to.exist;
    const input = wrapper.querySelector('.prompt-marquee-input');
    expect(input).to.exist;

    input.value = 'My Business';
    let assignedUrl;
    window._locationAssign = (url) => { assignedUrl = url; };

    cta.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(assignedUrl).to.contain('acom-input=My+Business');
  });
});

describe('replacePromptTokenInUrl', () => {
  it('returns original url when prompt text missing', () => {
    const url = 'https://example.com/path';
    expect(replacePromptTokenInUrl(url)).to.equal(url);
    expect(replacePromptTokenInUrl(url, '')).to.equal(url);
  });

  it('replaces encoded prompt token', () => {
    const url = 'https://example.com/new?prompt=%7B%7Bprompt-text%7D%7D';
    const result = replacePromptTokenInUrl(url, 'winter forest');
    expect(result).to.equal('https://example.com/new?prompt=winter+forest');
  });

  it('replaces unencoded prompt token variants', () => {
    const url = 'https://example.com/new?prompt={{prompt text}}&alt={{prompt-text}}';
    const result = replacePromptTokenInUrl(url, 'space odyssey');
    expect(result).to.equal('https://example.com/new?prompt=space+odyssey&alt=space+odyssey');
  });
});
