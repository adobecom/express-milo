import { getLibs } from '../../../scripts/utils.js';
import { formatProductDescriptions } from '../fetchData/fetchProductDetails.js';
import BlockMediator from '../../../scripts/block-mediator.min.js';
import axAccordionDecorate from '../../ax-accordion/ax-accordion.js';

let createTag;

export default async function createProductDetailsSection(productDescriptions) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));

  const productDetailsSectionContainer = createTag('div', { class: 'pdpx-product-details-section' });

  const productDetailsSectionTitleContainer = createTag('div', { class: 'pdpx-product-details-section-title-container' });
  const productDetailsSectionTitle = createTag('span', { class: 'pdpx-product-details-section-title' }, 'Product Details');
  productDetailsSectionTitleContainer.appendChild(productDetailsSectionTitle);
  productDetailsSectionContainer.appendChild(productDetailsSectionTitleContainer);

  const accordionBlock = createTag('div', { class: 'ax-accordion pdpx-product-details-accordion' });

  const mapToAccordionFormat = (descriptions) => descriptions.map((item) => ({
    title: item.title,
    content: item.description,
  }));

  accordionBlock.accordionData = mapToAccordionFormat(productDescriptions);

  await axAccordionDecorate(accordionBlock);

  productDetailsSectionContainer.appendChild(accordionBlock);

  const formFieldToAccordionTitle = {
    media: 'Paper',
    cornerstyle: 'Corner Style',
    style: 'Size',
    qty: null,
  };

  BlockMediator.subscribe('product:updated', (e) => {
    const { productDetails, formData } = e.newValue;
    const oldFormData = e.oldValue?.formData || {};

    let changedField = null;
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== oldFormData[key]) {
        changedField = key;
      }
    });

    const updatedDescriptions = formatProductDescriptions(productDetails, formData);
    const mappedData = mapToAccordionFormat(updatedDescriptions);

    const forceExpandTitle = changedField ? formFieldToAccordionTitle[changedField] : null;

    accordionBlock.updateAccordion(mappedData, forceExpandTitle);
  });

  return productDetailsSectionContainer;
}

export async function createCheckoutButton(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const checkoutButtonContainer = createTag('div', { class: 'pdpx-checkout-button-container' });
  const checkoutButton = createTag('a', { class: 'pdpx-checkout-button', id: 'pdpx-checkout-button', href: `https://new.express.adobe.com/design/template/${productDetails.templateId}` });
  const CTAIcon = createTag('img', { class: 'pdpx-checkout-button-icon', src: '/express/code/icons/print-icon.svg' });
  const CTAText = createTag('span', { class: 'pdpx-checkout-button-text' }, 'Customize and print it');
  checkoutButton.appendChild(CTAIcon);
  checkoutButton.appendChild(CTAText);
  const checkoutButtonSubhead = createTag('div', { class: 'pdpx-checkout-button-subhead' });
  const checkoutButtonSubheadImage = createTag('img', { class: 'pdpx-checkout-button-subhead-image', src: '/express/code/icons/powered-by-zazzle.svg' });
  const checkoutButtonSubheadLink = createTag('a', { class: 'pdpx-checkout-button-subhead-link', href: 'https://www.zazzle.com/returns' }, 'Returns guaranteed');
  const checkoutButtonSubheadText = createTag('span', { class: 'pdpx-checkout-button-subhead-text' }, 'through 100% satisfaction promise.');
  checkoutButtonSubhead.appendChild(checkoutButtonSubheadImage);
  checkoutButtonSubhead.appendChild(checkoutButtonSubheadLink);
  checkoutButtonSubhead.appendChild(checkoutButtonSubheadText);
  checkoutButtonContainer.appendChild(checkoutButton);
  checkoutButtonContainer.appendChild(checkoutButtonSubhead);
  return checkoutButtonContainer;
}
