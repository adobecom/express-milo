/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import sinon from 'sinon';
import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([
  import('../../../express/scripts/scripts.js'),
  import('../../../express/blocks/hero-color/hero-color.js'),
]);
const { default: decorate, resizeSvg } = imports[1];
document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const clock = sinon.useFakeTimers({ shouldAdvanceTime: true });

describe('Hero Color', () => {
  before(() => {
    window.isTestEnv = true;
    const heroColor = document.querySelector('.hero-color');
    decorate(heroColor);
  });

  after(() => {
    clock.restore();
  });

  it('Should have the correct elements', () => {
    expect(document.querySelector('.hero-color')).to.exist;
    expect(document.querySelector('.color-svg')).to.exist;
    expect(document.querySelector('h1')).to.exist;
    expect(document.querySelector('p')).to.exist;
    expect(document.querySelector('.button')).to.exist;
  });

  it('Should have a primary and secondary color', () => {
    const svgContainer = document.querySelector('.svg-container');
    const svgImg = document.querySelector('.color-svg-img');
    const primaryColor = svgContainer.style.backgroundColor;
    const secondaryColor = svgImg.style.fill;

    expect(primaryColor).to.exist;
    expect(secondaryColor).to.exist;
  });

  it('Should resize svg on load', async () => {
    await clock.nextAsync();
    const svg = document.querySelector('.color-svg-img');
    expect(Array.from(svg.classList)).to.not.contain('hidden-svg');
    expect(svg.style.height).to.equal('150px');
  });

  it('Svg height should be changed after screen is resized', () => {
    const svg = document.querySelector('.color-svg-img');
    resizeSvg({ matches: true });
    expect(svg.style.height).to.equal('150px');
    resizeSvg({ matches: false });
    expect(svg.style.height).to.equal('200px');
  });
});
