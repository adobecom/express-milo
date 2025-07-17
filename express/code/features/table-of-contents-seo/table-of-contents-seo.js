/* eslint-disable import/named, import/extensions */
import { getLibs } from '../../scripts/utils.js';

let createTag; let getMetadata;

function buildMetadataConfigObject() {
  const title = getMetadata('toc-title');
  const showContentNumbers = getMetadata('toc-content-numbers');
  const contents = [];
  let i = 1;
  let content = getMetadata(`content-${i}`);

  while (content) {
    const abbreviatedContent = getMetadata(`content-${i}-short`);
    if (abbreviatedContent) {
      contents.push({ [`content-${i}-short`]: abbreviatedContent });
    }
    contents.push({ [`content-${i}`]: content });
    i += 1;
    content = getMetadata(`content-${i}`);
  }

  const config = contents.reduce((acc, el) => ({
    ...acc,
    ...el,
  }), { title, 'toc-content-numbers': showContentNumbers });

  return config;
}

export default async function setTOCSEO() {
  ({ createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`));
  const config = buildMetadataConfigObject();
  console.log('config', config);

  const toc = createTag('div', {
    class: 'toc toc-container',
  });

  const title = createTag('div', { class: 'toc-title' });
  title.textContent = 'Table of Contents';
  toc.appendChild(title);

  const tocContent = createTag('div', { class: 'toc-content' });

  Object.keys(config).forEach((key) => {
    if (key.startsWith('content-') && !key.endsWith('-short')) {
      const link = createTag('a', { href: `#${key}` });
      link.textContent = config[key];
      tocContent.appendChild(link);
    }
  });

  toc.appendChild(tocContent);

  toc.addEventListener('click', () => {
    toc.classList.toggle('open');
  });

  const firstSection = document.querySelector('main .section');
  firstSection.insertAdjacentElement('afterend', toc);
}
