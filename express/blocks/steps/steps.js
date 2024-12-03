import { getLibs } from '../../scripts/utils.js';
import { fixIcons } from '../../scripts/utils/icons.js';

let createTag;

export function addBlockClasses(block, classNames) {
  const rows = Array.from(block.children);
  rows.forEach((row) => {
    classNames.forEach((className, i) => {
      row.children[i].className = className;
    });
  });
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  addBlockClasses(block, ['step-image', 'step-description']);
  fixIcons(block);

  const section = block.closest('.section');
  const heading = section.querySelector('h2, h3, h4');

  const includeSchema = block.classList.contains('schema');
  if (includeSchema) {
    // this is due to block loader setting full options container class name
    // reverse engineer the container name
    if (block.classList.contains('highlight')) {
      section.classList.add('steps-highlight-container');
    } else if (block.classList.contains('dark')) {
      section.classList.add('steps-dark-container');
    } else {
      section.classList.add('steps-container');
    }
  }

  const schema = {
    '@context': 'http://schema.org',
    '@type': 'HowTo',
    name: (heading && heading.textContent.trim()) || document.title,
    step: [],
  };

  block.querySelectorAll('.step-description').forEach((step, i) => {
    const h = step.querySelector('h3, h4, h5, h6');
    const p = step.querySelector('p');

    if (h && p) {
      schema.step.push({
        '@type': 'HowToStep',
        position: i + 1,
        name: h.textContent.trim(),
        itemListElement: {
          '@type': 'HowToDirection',
          text: p.textContent.trim(),
        },
      });
    }
  });

  if (includeSchema) {
    const $schema = createTag('script', { type: 'application/ld+json' });
    $schema.innerHTML = JSON.stringify(schema);
    const $head = document.head;
    $head.append($schema);
  }
}
