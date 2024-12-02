import { getLibs } from '../../scripts/utils.js';
import getData from '../../scripts/utils/browse-api-controller.js';
import buildCarousel from '../../scripts/widgets/carousel.js';
import { titleCase } from '../../scripts/utils/string.js';
import { decorateButtonsDeprecated } from '../../scripts/utils/decorate.js';

let createTag;

function addColorSampler(colorHex, btn) {
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
  await Promise.all([import(`${getLibs()}/utils/utils.js`), decorateButtonsDeprecated(block)]).then(([utils]) => {
    ({ createTag } = utils);
  });

  block.style.visibility = 'hidden';

  const pills = await getData();
  if (!pills?.length) return;

  pills.forEach(({ canonicalName: colorName, metadata: { link, hexCode: colorHex } }) => {
    if (!colorName || !link || !colorHex) return;
    const buttonContainer = createTag(
      'p',
      { class: 'button-container' },
      createTag(
        'a',
        {
          class: 'button',
          title: colorName,
          href: link,
        },
        titleCase(colorName),
      ),
    );
    block.append(buttonContainer);

    colorHex && addColorSampler(colorHex, buttonContainer);
  });

  if (!block.children) return;

  const options = { centerAlign: true };
  await buildCarousel('.button-container', block, options);
  block.style.visibility = 'visible';
}
