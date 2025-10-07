import { getLibs } from '../../../scripts/utils.js';
import { buildRealViewImageUrl } from '../utilities/utility-functions.js';

let createTag;

export default async function createCustomizationInputs(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const customizationInputsContainer = createTag('div', { class: 'pdpx-customization-inputs-container' });
  return customizationInputsContainer;
}
