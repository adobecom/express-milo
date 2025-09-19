/* eslint-env mocha */
import { expect } from '@esm-bundle/chai';

describe('Wayfinder Block', () => {
  let decorate;

  before(async () => {
    const module = await import('../../../express/code/blocks/wayfinder/wayfinder.js');
    decorate = module.default;
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should be a function', () => {
    expect(decorate).to.be.a('function');
  });

  it('should add classes and attributes to rows', () => {
    const block = document.createElement('div');
    block.className = 'wayfinder';
    block.innerHTML = `
      <div>Main Text Content</div>
      <div><a href="#test">Test Button</a></div>
    `;

    decorate(block);

    const rows = block.querySelectorAll(':scope > div');
    expect(rows[0]).to.have.class('text-row');
    expect(rows[1]).to.have.class('cta-row');
    expect(rows[1]).to.have.attribute('role', 'group');
    expect(rows[1]).to.have.attribute('aria-label', 'Main Text Content');
  });

  it('should add button classes and role to links', () => {
    const block = document.createElement('div');
    block.innerHTML = `
      <div>Text</div>
      <div>
        <a href="#test1">Button 1</a>
        <a href="#test2">Button 2</a>
      </div>
    `;

    decorate(block);

    const links = block.querySelectorAll('a');
    links.forEach((link) => {
      expect(link).to.have.class('button');
      expect(link).to.have.attribute('role', 'button');
    });
  });

  it('should handle linear-gradient background', () => {
    const block = document.createElement('div');
    block.innerHTML = `
      <div>Text</div>
      <div><a href="#test">Button</a></div>
      <div>linear-gradient(45deg, red, blue)</div>
    `;

    decorate(block);

    expect(block.style.background).to.equal('linear-gradient(45deg, red, blue)');
    expect(block.querySelectorAll(':scope > div')).to.have.length(2); // Last row removed
  });

  it('should handle radial-gradient background', () => {
    const block = document.createElement('div');
    block.innerHTML = `
      <div>Text</div>
      <div><a href="#test">Button</a></div>
      <div>radial-gradient(circle, red, blue)</div>
    `;

    decorate(block);

    expect(block.style.background).to.equal('radial-gradient(circle, red, blue)');
    expect(block.querySelectorAll(':scope > div')).to.have.length(2);
  });

  it('should handle hex color background', () => {
    const block = document.createElement('div');
    block.innerHTML = `
      <div>Text</div>
      <div><a href="#test">Button</a></div>
      <div>#ff0000</div>
    `;

    decorate(block);

    expect(block.style.backgroundColor).to.equal('rgb(255, 0, 0)'); // Normalized by browser
    expect(block.querySelectorAll(':scope > div')).to.have.length(2);
  });

  it('should handle rgb color background', () => {
    const block = document.createElement('div');
    block.innerHTML = `
      <div>Text</div>
      <div><a href="#test">Button</a></div>
      <div>rgb(255, 0, 0)</div>
    `;

    decorate(block);

    expect(block.style.backgroundColor).to.equal('rgb(255, 0, 0)');
    expect(block.querySelectorAll(':scope > div')).to.have.length(2);
  });

  it('should handle named color background', () => {
    const block = document.createElement('div');
    block.innerHTML = `
      <div>Text</div>
      <div><a href="#test">Button</a></div>
      <div>red</div>
    `;

    decorate(block);

    expect(block.style.backgroundColor).to.equal('red');
    expect(block.querySelectorAll(':scope > div')).to.have.length(2);
  });

  it('should not remove last row if it does not match background pattern', () => {
    const block = document.createElement('div');
    block.innerHTML = `
      <div>Text</div>
      <div><a href="#test">Button</a></div>
      <div>Not a valid background</div>
    `;

    decorate(block);

    expect(block.style.background).to.equal('');
    expect(block.style.backgroundColor).to.equal('');
    expect(block.querySelectorAll(':scope > div')).to.have.length(3); // All rows kept
  });

  it('should handle block with only two rows (no background)', () => {
    const block = document.createElement('div');
    block.innerHTML = `
      <div>Text Content</div>
      <div><a href="#test">Button</a></div>
    `;

    decorate(block);

    const rows = block.querySelectorAll(':scope > div');
    expect(rows[0]).to.have.class('text-row');
    expect(rows[1]).to.have.class('cta-row');
    expect(rows[1]).to.have.attribute('aria-label', 'Text Content');
    expect(block.querySelectorAll('a')[0]).to.have.class('button');
  });

  it('should handle empty text content gracefully', () => {
    const block = document.createElement('div');
    block.innerHTML = `
      <div>   </div>
      <div><a href="#test">Button</a></div>
    `;

    decorate(block);

    const rows = block.querySelectorAll(':scope > div');
    expect(rows[1]).to.have.attribute('aria-label', ''); // Empty after trim
  });
});
