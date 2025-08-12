import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let getMetadata;
let getConfig;

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`)]).then(([utils]) => {
    ({ createTag, getMetadata, getConfig } = utils);
  });

  const h1 = block.querySelector('h1:first-of-type');
  if (h1) {
    const pWithLink = block.querySelector('p:has(a)');
    if (pWithLink) {
      pWithLink.classList.add('button-container');
      const link = pWithLink.querySelector('a');
      if (link) {
        link.classList.add('quick-link', 'button', 'accent');
      }
    }
  }

  if (block && ['on', 'yes'].includes(getMetadata('marquee-inject-logo')?.toLowerCase())) {
    const logo = getIconElementDeprecated('adobe-express-logo');
    const marquee = block.classList.contains('ax-marquee-dynamic-hero');
    logo.classList.add('express-logo');
    if (marquee) {
      block.prepend(logo);
    }
  }
}
