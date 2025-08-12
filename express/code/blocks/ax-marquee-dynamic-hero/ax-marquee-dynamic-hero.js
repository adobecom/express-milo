import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let getMetadata;
let getConfig;

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`)]).then(([utils]) => {
    ({ createTag, getMetadata, getConfig } = utils);
  });

  // Add button-container class to p tag after h1 and add classes to the link
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
    logo.classList.add('express-logo');

    const isMarquee = block.classList.contains('ax-marquee-dynamic-hero');
    const isHeroTop = block.classList.contains('hero-top');

    if (isMarquee) {
      const targetElement = isHeroTop ? block.querySelector('div:has(picture)') : block;
      targetElement?.appendChild(logo);
    }
  }
}
