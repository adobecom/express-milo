import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([import('../../../express/code/scripts/utils.js'), import('../../../express/code/scripts/scripts.js')]);
const { getLibs } = imports[0];
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = {};
  mod.setConfig(conf);
});
const [{ default: decorate }] = await Promise.all([import('../../../express/code/blocks/hover-cards/hover-cards.js')]);
document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('hover-cards', () => {
  let block;
  before(async () => {
    block = document.querySelector('.hover-cards');
    await decorate(block);
  });
  it('has correct structures', async () => {
    expect(block.querySelector('.heading-container')).to.exist;
    expect(block.querySelector('.cards-container.gallery')).to.exist;
    const cards = [...block.querySelectorAll('.gallery--item')];
    expect(cards.length === 2).to.be.true;
    for (const card of cards) {
      expect(card.querySelector('.bg-pic')).to.exist;
      expect(card.querySelector('.button')).to.exist;
    }
  });
});
