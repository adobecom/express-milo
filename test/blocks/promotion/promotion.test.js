/* eslint-env mocha */
import { expect } from '@esm-bundle/chai';

describe('Promotion Block (Deprecated)', () => {
  let decorate;

  before(async () => {
    const module = await import('../../../express/code/blocks/promotion/promotion.js');
    decorate = module.default;
  });

  it('should be a function', () => {
    expect(decorate).to.be.a('function');
  });

  it('should remove the block element', async () => {
    const block = document.createElement('div');
    block.className = 'promotion';
    document.body.appendChild(block);

    // Verify block exists
    expect(document.querySelector('.promotion')).to.exist;

    // Call decorate
    await decorate(block);

    // Verify block was removed
    expect(document.querySelector('.promotion')).to.not.exist;
  });

  it('should handle null/undefined block gracefully', async () => {
    expect(() => decorate(null)).to.not.throw();
    expect(() => decorate(undefined)).to.not.throw();
  });

  it('should handle block without remove method', async () => {
    const mockBlock = {};
    expect(() => decorate(mockBlock)).to.not.throw();
  });
});
