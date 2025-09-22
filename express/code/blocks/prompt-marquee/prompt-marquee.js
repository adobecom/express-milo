import decorateLogoMarquee from '../logo-marquee/logo-marquee.js';

export default async function decorate(block) {
  // Reuse existing implementation; add legacy class so imported CSS applies
  block.classList.add('logo-marquee');
  return decorateLogoMarquee(block);
}


