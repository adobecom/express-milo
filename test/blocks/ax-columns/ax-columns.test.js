/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([import('../../../express/scripts/scripts.js'), import('../../../express/blocks/ax-columns/ax-columns.js')]);
const { default: decorate } = imports[1];

const body = await readFile({ path: './mocks/body.html' });
const buttonLight = await readFile({ path: './mocks/button-light.html' });
const color = await readFile({ path: './mocks/color.html' });
const fullsize = await readFile({ path: './mocks/fullsize.html' });
const highlight = await readFile({ path: './mocks/highlight.html' });
const icon = await readFile({ path: './mocks/icon.html' });
const iconWithSibling = await readFile({ path: './mocks/icon-with-sibling.html' });
const iconList = await readFile({ path: './mocks/icon-list.html' });
const notHighlight = await readFile({ path: './mocks/not-highlight.html' });
const numbered30 = await readFile({ path: './mocks/numbered-30.html' });
const offer = await readFile({ path: './mocks/offer.html' });
const offerIcon = await readFile({ path: './mocks/offer-icon.html' });
const picture = await readFile({ path: './mocks/picture.html' });
const video = await readFile({ path: './mocks/video.html' });

describe('Columns', () => {
  before(() => {
    window.isTestEnv = true;
  });

  it('Columns exists', () => {
    document.body.innerHTML = body;
    const columns = document.querySelector('.columns');
    decorate(columns);
    expect(columns).to.exist;
  });

  it('ElementsMinHeight should be 0', (done) => {
    document.body.innerHTML = fullsize;
    const columns = document.querySelector('.columns.fullsize');
    decorate(columns);
    const h3s = columns.querySelectorAll('h3');

    // setTimeout is needed because of the intersect observer
    setTimeout(() => {
      h3s.forEach((h3) => {
        expect(h3.style.minHeight).to.not.equal('0');
      });
      done();
    }, 1);
  });

  it('Should render a numbered column', () => {
    document.body.innerHTML = numbered30;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const columnNumber = columns.querySelector('.num');
    expect(columnNumber.textContent).to.be.equal('01/30 —');
  });

  it('Should render an offer column & have only 1 row', () => {
    document.body.innerHTML = offer;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const rows = Array.from(columns.children);
    expect(rows.length).to.be.equal(1);
  });

  it('Should transform primary color to bg color and secondary color to fill', () => {
    document.body.innerHTML = color;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const imgWrapper = columns.querySelector('.img-wrapper');
    expect(imgWrapper.style.backgroundColor).to.be.equal('rgb(255, 87, 51)');
    expect(imgWrapper.style.fill).to.be.equal('rgb(52, 210, 228)');
  });

  it('Should render an offer column and decorate icons', () => {
    document.body.innerHTML = offerIcon;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const title = columns.querySelector('h1');
    const titleIcon = columns.querySelector('.columns-offer-icon');
    expect(title).to.exist;
    expect(titleIcon).to.exist;
  });

  it('Should render a column and decorate icons', () => {
    document.body.innerHTML = icon;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const iconDecorate = columns.querySelector('.brand');
    const iconParent = columns.children[0];
    expect(iconDecorate).to.exist;
    expect(iconParent.classList.contains('has-brand')).to.be.true;
  });

  it('Should render a column and decorate icons with sibling', () => {
    document.body.innerHTML = iconWithSibling;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const columnsIcon = columns.querySelector('.columns-iconlist');
    expect(columnsIcon).to.exist;
  });

  it('Should contain right classes if column video has highlight', () => {
    document.body.innerHTML = highlight;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const highlightRow = columns.querySelector('#hightlight-row');
    highlightRow.click();
    highlightRow.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

    const sibling = columns.querySelector('.column-picture');
    const columnVideo = columns.querySelector('.column-video');
    expect(sibling).to.exist;
    expect(columnVideo).to.exist;
  });

  it('Icon list should be wrapped in a column-iconlist div', () => {
    document.body.innerHTML = iconList;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const childrenLength = columns.children.length;
    const iconListDiv = columns.querySelector('.columns-iconlist');
    expect(childrenLength).to.not.equal(0);
    expect(iconListDiv).to.exist;
  });

  it('Embed vidoes if href includes youtu or vimeo', () => {
    document.body.innerHTML = video;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const links = document.querySelectorAll('.button-container > a');
    links.forEach((link) => {
      expect(link.href).to.include('youtu');
      expect(link.href).to.include('vimeo');
    });
  });

  it('Picture should be wrapped in a div if it exists', () => {
    document.body.innerHTML = picture;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const picDiv = columns.querySelector('picture');
    const parent = picDiv.parentElement;
    expect(parent.tagName).to.equal('DIV');
  });

  it('Should replace accent to primary if button contains classList light', () => {
    document.body.innerHTML = buttonLight;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const button = columns.querySelector('.button');
    expect(button.classList.contains('light')).to.be.true;
    expect(button.classList.contains('primary')).to.be.true;
  });

  it('P should be removed if empty', () => {
    document.body.innerHTML = buttonLight;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const p = columns.querySelectorAll('p');
    expect(p.length).to.equal(1);
  });

  it('Powered by classList should be added if innerText matches/has Powered By', () => {
    document.body.innerHTML = buttonLight;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const poweredBy = columns.querySelector('.powered-by');
    expect(poweredBy).to.exist;
  });

  it('Invert buttons in regular columns inside columns-highlight-container', () => {
    document.body.innerHTML = notHighlight;
    const columns = document.querySelector('.columns');
    decorate(columns);

    const button = columns.querySelector('.button');
    expect(button.classList.contains('dark')).to.be.true;
  });
});
