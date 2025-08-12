import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

let getMetadata;

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`)]).then(([utils]) => {
    ({ getMetadata } = utils);
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

    const isHeroTop = block.classList.contains('hero-top');

    if (isHeroTop) {
      const headerElement = block.querySelector('h1');
      headerElement?.parentElement?.insertBefore(logo, headerElement);
    } else {
      const headerElement = block.querySelector('h1');
      headerElement?.parentElement?.insertBefore(logo, headerElement);
    }
  }
}
