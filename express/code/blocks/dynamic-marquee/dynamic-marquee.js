import { getLibs, getIconElementDeprecated, readBlockConfig } from '../../scripts/utils.js';
import { normalizeHeadings } from '../../scripts/utils/decorate.js';

let createTag;

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`)]).then(([utils]) => {
    ({ createTag } = utils);
  });

  // Check for dynamic marquee variant classes
  const dynamicMarqueeVariants = [
    'tall',
    'medium',
    'short',
  ];

  let detectedVariant = null;

  for (const className of dynamicMarqueeVariants) {
    if (block.classList.contains(className)) {
      detectedVariant = className;
      break;
    }
  }

  // Load CSS immediately if variant detected
  if (detectedVariant) {
    const cssFileName = `dynamic-marquee-${detectedVariant}.css`;
    const cssPath = `/express/code/blocks/dynamic-marquee/${cssFileName}`;

    if (!document.querySelector(`link[href*="${cssFileName}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      document.head.appendChild(link);
    }

    normalizeHeadings(block, ['h2', 'h3', 'h4']);
  }

  // Check section metadata for inject-logo setting
  const section = block.closest('.section');
  const sectionMetadata = section?.querySelector('.section-metadata');
  let shouldInjectLogo = false;

  if (sectionMetadata) {
    const meta = readBlockConfig(sectionMetadata);
    shouldInjectLogo = ['on', 'yes'].includes(meta['inject-logo']?.toLowerCase());
  }

  if (shouldInjectLogo) {
    const logo = getIconElementDeprecated('adobe-express-logo');
    logo.classList.add('express-logo');
    block.querySelector('H2')?.prepend(logo);
  }
}
