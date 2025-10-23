import { getLibs } from '../../scripts/utils.js';
import fetchAPIData from './fetchData/fetchProductDetails.js';
import extractProductDescriptionsFromBlock, { normalizeProductDetailObject } from './utilities/data-formatting.js';
import { extractProductId } from './utilities/utility-functions.js';
import createProductInfoHeadingSection from './createComponents/createProductInfoHeadingSection.js';
import createProductImagesContainer, { populateProductThumbnails } from './createComponents/createProductImagesContainer.js';
import createCustomizationInputs from './createComponents/createCustomizationInputs.js';
import createProductDetailsSection, { createCheckoutButton } from './createComponents/createProductDetailsSection.js';
import createDrawer from './createComponents/createDrawer.js';

let createTag;

async function createProductInfoContainer(productDetails, productDescriptions, drawer, minimal = false) {
  const productInfoSectionWrapperContainer = createTag('div', { class: 'pdpx-product-info-section-wrapper-container' });
  const productInfoSectionWrapper = createTag('div', { class: 'pdpx-product-info-section-wrapper' });
  const productInfoContainer = createTag('div', { class: 'pdpx-product-info-container' });
  const productInfoHeadingSection = await createProductInfoHeadingSection(productDetails);
  productInfoContainer.appendChild(productInfoHeadingSection);
  if (!minimal) {
    const customizationInputs = await createCustomizationInputs(productDetails);
    productInfoContainer.appendChild(customizationInputs);
    const productDetailsSection = await createProductDetailsSection(productDescriptions);
    productInfoContainer.appendChild(productDetailsSection);
  }
  productInfoSectionWrapper.appendChild(productInfoContainer);
  if (!minimal) {
    const checkoutButton = createCheckoutButton();
    productInfoSectionWrapper.appendChild(checkoutButton);
  }
  if (drawer) {
    productInfoSectionWrapper.appendChild(drawer);
  }
  productInfoSectionWrapperContainer.appendChild(productInfoHeadingSection);
  productInfoSectionWrapperContainer.appendChild(productInfoSectionWrapper);
  return productInfoSectionWrapperContainer;
}

async function createGlobalContainer(block, productDetails, productDescriptions, minimal = false) {
  const globalContainer = createTag('div', { class: 'pdpx-global-container' });
  const productImagesContainer = await createProductImagesContainer(productDetails.realViews, productDetails.heroImage);
  const productInfoSectionWrapper = await createProductInfoContainer(productDetails, productDescriptions, null, minimal);
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoSectionWrapper);
  block.appendChild(globalContainer);
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productId = await extractProductId(block);

  // Early head hints before any fetches
  const head = document.head || document.getElementsByTagName('head')[0];
  const ensureLinkOnce = (attrs) => {
    const exists = head.querySelector(`link[rel="${attrs.rel}"][href="${attrs.href}"]`);
    if (exists) return exists;
    const el = document.createElement('link');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    head.appendChild(el);
    return el;
  };
  ensureLinkOnce({ rel: 'dns-prefetch', href: 'https://www.zazzle.com' });
  ensureLinkOnce({ rel: 'dns-prefetch', href: 'https://rlv.zcache.com' });
  ensureLinkOnce({ rel: 'preconnect', href: 'https://www.zazzle.com' });
  ensureLinkOnce({ rel: 'preconnect', href: 'https://rlv.zcache.com', crossorigin: '' });

  // Kick off all requests in parallel
  const quantity = 1;
  const sampleShippingParameters = { qty: quantity };
  const getproductPromise = fetchAPIData(productId, null, 'getproduct');
  const renditionsPromise = fetchAPIData(productId, null, 'getproductrenditions');
  // Defer non-critical fetches to idle to reduce contention
  let pricePromise;
  let reviewsPromise;
  let shippingPromise;
  const scheduleNonCritical = () => {
    pricePromise = pricePromise || fetchAPIData(productId, null, 'getproductpricing');
    reviewsPromise = reviewsPromise || fetchAPIData(productId, null, 'getreviews');
    shippingPromise = shippingPromise || fetchAPIData(productId, sampleShippingParameters, 'getshippingestimates');
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(scheduleNonCritical);
  } else {
    setTimeout(scheduleNonCritical, 0);
  }

  // Render hero/title ASAP using getproduct (+ renditions when available)
  const product = await getproductPromise;
  const productDescriptions = await extractProductDescriptionsFromBlock(block);

  // Attempt to get renditions quickly but don't block rendering
  let renditions = null;
  try { renditions = await Promise.race([renditionsPromise, new Promise((resolve) => setTimeout(() => resolve(null), 250))]); } catch (e) { renditions = null; }

  const minimalDetails = {
    id: product?.product?.id,
    heroImage: product?.product?.initialPrettyPreferredViewUrl,
    productTitle: product?.product?.title,
    unitPrice: 0,
    productPrice: 0,
    strikethroughPrice: 0,
    discountAvailable: false,
    discountString: '',
    deliveryEstimateStringText: '',
    deliveryEstimateMinDate: null,
    deliveryEstimateMaxDate: null,
    realViews: renditions?.realviewUrls || {},
    productType: product?.product?.productType,
    quantities: product?.product?.quantities || [],
    pluralUnitLabel: product?.product?.pluralUnitLabel,
    averageRating: 0,
    totalReviews: 0,
    tooltipTitle: '',
    tooltipDescription1: '',
    tooltipDescription2: '',
  };

  block.innerHTML = '';
  await createGlobalContainer(block, minimalDetails, productDescriptions, true);

  // Preconnect to image + API hosts and preload hero image
  if (minimalDetails.heroImage) {
    const pre = ensureLinkOnce({ rel: 'preload', as: 'image', href: minimalDetails.heroImage, fetchpriority: 'high', imagesizes: '(min-width: 1200px) 1000px, (min-width: 600px) 750px, 420px' });
    // If the hero supports /svc/view we can add imagesrcset for better fetch selection
    try {
      const u = new URL(minimalDetails.heroImage);
      if (u.pathname.startsWith('/svc/view')) {
        const mk = (w) => { const p = new URL(minimalDetails.heroImage); p.searchParams.set('max_dim', `${w}`); p.searchParams.set('image_type', 'jpg'); return p.toString(); };
        pre.setAttribute('imagesrcset', `${mk(420)} 420w, ${mk(750)} 750w, ${mk(1000)} 1000w`);
      }
    } catch (e) { /* ignore */ }
  }

  // Hydrate full details once all settle
  // Ensure non-critical fetches are scheduled before awaiting
  scheduleNonCritical();
  // Wait for renditions; non-critical may still be pending
  const productRenditions = await renditionsPromise.catch(() => null);
  // If we now have realview URLs, swap hero to tuned /svc/view and update preload
  if (productRenditions?.realviewUrls?.Front) {
    try {
      const heroImg = block.querySelector('#pdpx-product-hero-image');
      const base = new URL(productRenditions.realviewUrls.Front);
      if (base.pathname.startsWith('/svc/view')) {
        const mk = (w, type) => { const p = new URL(base); p.searchParams.set('max_dim', `${w}`); p.searchParams.set('image_type', type); return p.toString(); };
        const sizes = '(min-width: 1200px) 1000px, (min-width: 600px) 750px, 420px';
        const picture = heroImg.closest('picture');
        const webpSource = picture?.querySelector('source[type="image/webp"]');
        if (webpSource) {
          webpSource.setAttribute('srcset', `${mk(420, 'webp')} 420w, ${mk(750, 'webp')} 750w, ${mk(1000, 'webp')} 1000w`);
          webpSource.setAttribute('sizes', sizes);
        }
        heroImg.setAttribute('srcset', `${mk(420, 'jpg')} 420w, ${mk(750, 'jpg')} 750w, ${mk(1000, 'jpg')} 1000w`);
        heroImg.setAttribute('sizes', sizes);
        heroImg.src = mk(750, 'jpg');
        const headPre = ensureLinkOnce({ rel: 'preload', as: 'image', href: mk(750, 'jpg'), fetchpriority: 'high', imagesizes: sizes, imagesrcset: `${mk(420, 'jpg')} 420w, ${mk(750, 'jpg')} 750w, ${mk(1000, 'jpg')} 1000w` });
        headPre.setAttribute('href', mk(750, 'jpg'));
      }
    } catch (e) { /* ignore */ }
  }
  // Await non-critical results
  const [productPrice, productReviews, productShippingEstimates] = await Promise.all([
    pricePromise.catch(() => null),
    reviewsPromise.catch(() => null),
    shippingPromise.catch(() => null),
  ]);

  const productDetailsFormatted = await normalizeProductDetailObject(
    product,
    productPrice,
    productReviews,
    productRenditions,
    productShippingEstimates,
    quantity,
  );

  // Update hero thumbnails lazily (in case not present yet)
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => populateProductThumbnails(productDetailsFormatted.realViews));
  } else {
    setTimeout(() => populateProductThumbnails(productDetailsFormatted.realViews), 0);
  }

  // Replace heading/price/details with full content
  const hydrate = async () => {
    const container = block.querySelector('.pdpx-product-info-section-wrapper-container');
    if (container) {
      const { curtain, drawer } = await createDrawer(block);
      const fullHeading = await createProductInfoHeadingSection(productDetailsFormatted);
      const detailsSection = await createProductDetailsSection(await extractProductDescriptionsFromBlock(block));
      const infoWrapper = block.querySelector('.pdpx-product-info-section-wrapper');
      if (infoWrapper) {
        infoWrapper.innerHTML = '';
        infoWrapper.appendChild(fullHeading);
        const customizationInputs = await createCustomizationInputs(productDetailsFormatted);
        infoWrapper.appendChild(customizationInputs);
        infoWrapper.appendChild(detailsSection);
        const checkoutButton = createCheckoutButton();
        infoWrapper.appendChild(checkoutButton);
        infoWrapper.appendChild(drawer);
        document.body.append(curtain);
      }
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(hydrate);
  } else {
    setTimeout(hydrate, 0);
  }

  // Dev-only: LCP logging (always on in dev builds; harmless in prod)
  window.addEventListener('load', () => {
    setTimeout(() => {
      const entries = performance.getEntriesByType('largest-contentful-paint');
      const last = entries[entries.length - 1];
      // eslint-disable-next-line no-console
      console.log('[PDP] LCP', last?.startTime, last);
    }, 0);
  });
}
