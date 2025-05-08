import { getLibs } from '../../scripts/utils.js';

let createTag;

export default async function init(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  // block.classList.add('ax-grid-container');
  block.innerHTML = '';
  const fourThree = createTag('div', { class: 'ax-grid-container' });
  fourThree.append(createTag('div', { class: 'ax-grid-col-3 bar' }, '4*3'));
  fourThree.append(createTag('div', { class: 'ax-grid-col-3 bar' }, '4*3'));
  fourThree.append(createTag('div', { class: 'ax-grid-col-3 bar' }, '4*3'));
  fourThree.append(createTag('div', { class: 'ax-grid-col-3 bar' }, '4*3'));

  const fiveTwo = createTag('div', { class: 'ax-grid-container' });
  fiveTwo.append(createTag('div', { class: 'ax-grid-col-2 bar' }, '5*2'));
  fiveTwo.append(createTag('div', { class: 'ax-grid-col-2 bar' }, '5*2'));
  fiveTwo.append(createTag('div', { class: 'ax-grid-col-2 bar' }, '5*2'));
  fiveTwo.append(createTag('div', { class: 'ax-grid-col-2 bar' }, '5*2'));
  fiveTwo.append(createTag('div', { class: 'ax-grid-col-2 bar' }, '5*2'));

  const twoFour = createTag('div', { class: 'ax-grid-container' });
  twoFour.append(createTag('div', { class: 'ax-grid-col-4 bar' }, '2*4'));
  twoFour.append(createTag('div', { class: 'ax-grid-col-4 bar' }, '2*4'));

  block.append(
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-1 bar' }, '1 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-2 bar' }, '2 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-3 bar' }, '3 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-4 bar' }, '4 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-5 bar' }, '5 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-6 bar' }, '6 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-7 bar' }, '7 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-8 bar' }, '8 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-9 bar' }, '9 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-10 bar' }, '10 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-11 bar' }, '11 col')),
    createTag('div', { class: 'ax-grid-container' }, createTag('div', { class: 'ax-grid-col-12 bar' }, '12 col')),
    fourThree,
    fiveTwo,
    twoFour,
  );
}
