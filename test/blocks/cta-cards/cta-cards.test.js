import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([import('../../../express/code/scripts/utils.js'), import('../../../express/code/scripts/scripts.js')]);
const { getLibs } = imports[0];
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = {};
  mod.setConfig(conf);
});
const [{ default: decorate }] = await Promise.all([import('../../../express/code/blocks/cta-cards/cta-cards.js')]);
document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('cta-cards', () => {
  let block;
  before(async () => {
    block = document.querySelector('.cta-cards');
    await decorate(block);
  });
  it('has correct structures', async () => {
    expect(block.querySelector('.heading-container')).to.exist;
    expect(block.querySelector('.cards-container.gallery')).to.exist;
    const cards = [...block.querySelectorAll('.gallery--item')];
    expect(cards.length === 4).to.be.true;
    for (const card of cards) {
      expect(card.querySelector('.button')).to.exist;
    }
  });
});
