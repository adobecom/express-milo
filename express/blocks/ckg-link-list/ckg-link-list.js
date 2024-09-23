import { getLibs } from '../../scripts/utils.js';
import { getDataWithContext } from '../../scripts/utils/browse-api-controller.js';
import buildCarousel from '../../scripts/widgets/carousel.js';
import { titleCase } from '../../scripts/utils/string.js';

const { createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`);

function addColorSampler(pill, colorHex, btn) {
  const colorDot = createTag('div', {
    class: 'color-dot',
    style: `background-color: ${colorHex}`,
  });

  const aTag = btn.querySelector('a');
  btn.style.backgroundColor = colorHex;
  aTag.classList.add('colorful');

  aTag.prepend(colorDot);
}

export default async function decorate(block) {
  const headerButton = document.querySelector('.hero-color-wrapper .text-container p:last-child');
  headerButton.classList.add('button-container');
  headerButton.querySelector('a').classList.add('button', 'accent', 'primaryCta', 'same-fcta');

  block.style.visibility = 'hidden';

  const payloadContext = { urlPath: block.textContent.trim() || window.location.pathname };
  const ckgResult = await getDataWithContext(payloadContext);
  if (!ckgResult) return;
  const pills = ckgResult?.queryResults?.[0]?.facets?.[0]?.buckets;
  const hexCodes = ckgResult?.queryResults?.[0].context?.application?.['metadata.color.hexCodes'];

  // const headerButton = document.querySelector('.hero-color-wrapper');

  if (!pills || !pills.length) return;

  pills.forEach((pill) => {
    const colorHex = hexCodes[pill.canonicalName];
    const { prefix } = getConfig().locale;
    if (pill.value.startsWith(`${prefix}/express/colors/search`)) {
      return;
    }

    const colorPath = pill.value;
    const colorName = pill.displayValue;
    const buttonContainer = createTag('p', { class: 'button-container' });
    const aTag = createTag('a', {
      class: 'button',
      title: colorName,
      href: colorPath,
    }, titleCase(colorName));

    buttonContainer.append(aTag);
    block.append(buttonContainer);

    if (colorHex) {
      addColorSampler(pill, colorHex, buttonContainer);
    }
  });

  if (!block.children) return;

  const options = { centerAlign: true };
  await buildCarousel('.button-container', block, options);
  block.style.visibility = 'visible';
}
