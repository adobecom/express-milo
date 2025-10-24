import { getLibs } from '../../../scripts/utils.js';

let createTag;

export default async function createProductDetailsSection(productDescriptions) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productDetailsSectionContainer = createTag('div', { class: 'pdpx-product-details-section-container' });
  const productDetailsSectionTitleContainer = createTag('div', { class: 'pdpx-product-details-section-title-container' });
  const productDetailsSectionTitle = createTag('span', { class: 'pdpx-product-details-section-title' }, 'Product Details');
  productDetailsSectionTitleContainer.appendChild(productDetailsSectionTitle);
  productDetailsSectionContainer.appendChild(productDetailsSectionTitleContainer);
  for (let i = 0; i < productDescriptions.length; i += 1) {
    const productDetailsSectionItemContainer = createTag('div', { class: 'pdpx-product-details-section-item-container collapsed' });
    const productDetailsSectionItemTitleContainer = createTag('span', { class: 'pdpx-product-details-section-item-title-container' });
    const productDetailsSectionItemTitle = createTag('span', { class: 'pdpx-product-details-section-item-title' }, productDescriptions[i].title);
    const productDetailsSectionItemIcon = createTag('div', { class: 'pdpx-product-details-section-item-icon' });
    const productDetailsSectionItemDescription = createTag('span', { class: 'pdpx-product-details-section-item-description' }, productDescriptions[i].description);
    productDetailsSectionItemTitleContainer.appendChild(productDetailsSectionItemTitle);
    productDetailsSectionItemTitleContainer.appendChild(productDetailsSectionItemIcon);
    productDetailsSectionItemContainer.appendChild(productDetailsSectionItemTitleContainer);
    productDetailsSectionItemContainer.appendChild(productDetailsSectionItemDescription);
    productDetailsSectionContainer.appendChild(productDetailsSectionItemContainer);
    productDetailsSectionItemContainer.addEventListener('click', () => {
      console.log('clicked');
      // add a class to the productDetailsSectionItemContentContainer
      productDetailsSectionItemContainer.classList.toggle('collapsed');
      productDetailsSectionItemContainer.classList.toggle('expanded');
    });
  }

  return productDetailsSectionContainer;
}

export function createCheckoutButton(productDetails) {
  const checkoutButtonContainer = createTag('div', { class: 'pdpx-checkout-button-container' });
  const checkoutButton = createTag('a', { class: 'pdpx-checkout-button', id: 'pdpx-checkout-button', href: `https://new.express.adobe.com/design/template/${productDetails.templateId}` });
  const CTAIcon = createTag('img', { class: 'pdpx-checkout-button-icon', src: '/express/code/icons/print-icon.svg' });
  const CTAText = createTag('span', { class: 'pdpx-checkout-button-text' }, 'Customize and print it');
  checkoutButton.appendChild(CTAIcon);
  checkoutButton.appendChild(CTAText);
  const checkoutButtonSubhead = createTag('div', { class: 'pdpx-checkout-button-subhead' });
  const checkoutButtonSubheadImage = createTag('img', { class: 'pdpx-checkout-button-subhead-image', src: '/express/code/icons/powered-by-zazzle.svg' });
  const checkoutButtonSubheadLink = createTag('a', { class: 'pdpx-checkout-button-subhead-link', href: 'https://www.zazzle.com/returns' }, 'Returns gauranteed');
  const checkoutButtonSubheadText = createTag('span', { class: 'pdpx-checkout-button-subhead-text' }, 'through 100% satisfaction promise.');
  checkoutButtonSubhead.appendChild(checkoutButtonSubheadImage);
  checkoutButtonSubhead.appendChild(checkoutButtonSubheadLink);
  checkoutButtonSubhead.appendChild(checkoutButtonSubheadText);
  checkoutButtonContainer.appendChild(checkoutButton);
  checkoutButtonContainer.appendChild(checkoutButtonSubhead);
  return checkoutButtonContainer;
}
