import { getLibs } from '../../../scripts/utils.js';

let createTag;

function extractSquareDimensionFromUrl(url) {
  try {
    const match = url.match(/_(\d+)\.(?:webp|jpe?g|png)$/i);
    if (match && match[1]) return Number(match[1]);
  } catch (e) {
    // ignore parse errors; sizing will fall back to CSS aspect-ratio
  }
  return undefined;
}

function buildSvcUrlWithMaxDim(src, maxDim, imageType) {
  try {
    const url = new URL(src);
    if (!url.pathname.startsWith('/svc/view')) return null;
    const params = url.searchParams;
    if (maxDim) params.set('max_dim', `${maxDim}`);
    if (imageType) params.set('image_type', imageType);
    return `${url.origin}${url.pathname}?${params.toString()}`;
  } catch (e) {
    return null;
  }
}

function buildSrcSet(src, breakpoints, imageType) {
  const parts = [];
  for (let i = 0; i < breakpoints.length; i += 1) {
    const w = breakpoints[i];
    const u = buildSvcUrlWithMaxDim(src, w, imageType) || src;
    parts.push(`${u} ${w}w`);
  }
  return parts.join(', ');
}

function createHeroPicture(src, alt, eager, width, height) {
  const picture = document.createElement('picture');
  const breakpoints = [420, 750, 1000];
  const sizesAttr = '(min-width: 1200px) 1000px, (min-width: 600px) 750px, 420px';
  const svcWebpSet = buildSrcSet(src, breakpoints, 'webp');
  const svcJpgSet = buildSrcSet(src, breakpoints, 'jpg');
  const source = document.createElement('source');
  source.type = 'image/webp';
  source.setAttribute('srcset', svcWebpSet);
  source.setAttribute('sizes', sizesAttr);
  picture.appendChild(source);
  const img = document.createElement('img');
  img.className = 'pdpx-product-hero-image';
  img.id = 'pdpx-product-hero-image';
  img.setAttribute('data-image-type', 'Front');
  img.loading = eager ? 'eager' : 'lazy';
  img.decoding = 'async';
  img.setAttribute('fetchpriority', eager ? 'high' : 'auto');
  if (width && height) {
    img.width = width;
    img.height = height;
  }
  img.setAttribute('srcset', svcJpgSet);
  img.setAttribute('sizes', sizesAttr);
  // choose a reasonable default src
  const defaultUrl = buildSvcUrlWithMaxDim(src, 750, 'jpg') || src;
  img.src = defaultUrl;
  picture.appendChild(img);
  return picture;
}

export default async function createProductImagesContainer(realViews, heroImage, heroImageType = 'Front') {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productImagesContainer = createTag('div', { class: 'pdpx-product-images-container', id: 'pdpx-product-images-container' });
  const productHeroImageContainer = createTag('div', { class: 'pdpx-product-hero-image-container' });

  const heroDim = extractSquareDimensionFromUrl(heroImage) || 644;
  const heroPicture = createHeroPicture(heroImage, '', true, heroDim, heroDim);
  const productHeroImage = heroPicture.querySelector('img');

  const imageThumbnailCarouselContainer = createTag('div', { class: 'pdpx-image-thumbnail-carousel-container', id: 'pdpx-image-thumbnail-carousel-container' });

  const realViewKeys = Object.keys(realViews || {});
  for (let i = 0; i < realViewKeys.length; i += 1) {
    const type = realViewKeys[i];
    const imageThumbnailCarouselItem = createTag('button', { class: 'pdpx-image-thumbnail-carousel-item', 'data-image-type': type });
    if (heroImageType === type) imageThumbnailCarouselItem.classList.add('selected');

    const imageURL = realViews[type];
    const imageThumbnailCarouselItemImage = createTag('img', { class: 'pdpx-image-thumbnail-carousel-item-image', 'data-image-type': type, src: imageURL, loading: 'lazy', decoding: 'async', width: '76', height: '76' });
    imageThumbnailCarouselItem.addEventListener('click', (element) => {
      imageThumbnailCarouselItem.classList.add('selected');
      imageThumbnailCarouselContainer.querySelectorAll('.pdpx-image-thumbnail-carousel-item').forEach((item) => {
        if (item !== element.currentTarget) item.classList.remove('selected');
      });
      const newSrc = element.currentTarget.querySelector('img').src;
      const pic = productHeroImage.parentElement;
      const webpSource = pic.querySelector('source[type="image/webp"]');
      try {
        const u = new URL(newSrc);
        if (u.pathname.startsWith('/svc/view')) {
          const sizesAttr = '(min-width: 1200px) 1000px, (min-width: 600px) 750px, 420px';
          const mk = (w, t) => {
            const p = new URL(newSrc);
            p.searchParams.set('max_dim', `${w}`);
            p.searchParams.set('image_type', t);
            return p.toString();
          };
          const jpgSet = `${mk(420, 'jpg')} 420w, ${mk(750, 'jpg')} 750w, ${mk(1000, 'jpg')} 1000w`;
          const webpSet = `${mk(420, 'webp')} 420w, ${mk(750, 'webp')} 750w, ${mk(1000, 'webp')} 1000w`;
          if (webpSource) {
            webpSource.setAttribute('srcset', webpSet);
            webpSource.setAttribute('sizes', sizesAttr);
          }
          productHeroImage.setAttribute('srcset', jpgSet);
          productHeroImage.setAttribute('sizes', sizesAttr);
          productHeroImage.src = mk(750, 'jpg');
        } else {
          if (webpSource) {
            webpSource.removeAttribute('srcset');
            webpSource.removeAttribute('sizes');
          }
          productHeroImage.removeAttribute('srcset');
          productHeroImage.removeAttribute('sizes');
          productHeroImage.src = newSrc;
        }
      } catch (e) {
        productHeroImage.src = newSrc;
      }
      productHeroImage.dataset.imageType = element.currentTarget.dataset.imageType;
    });
    imageThumbnailCarouselItem.appendChild(imageThumbnailCarouselItemImage);
    imageThumbnailCarouselContainer.appendChild(imageThumbnailCarouselItem);
  }
  productHeroImageContainer.appendChild(heroPicture);
  productImagesContainer.appendChild(productHeroImageContainer);
  productImagesContainer.appendChild(imageThumbnailCarouselContainer);
  return productImagesContainer;
}

export async function populateProductThumbnails(realViews, heroImageType = 'Front') {
  const container = document.getElementById('pdpx-image-thumbnail-carousel-container');
  const hero = document.getElementById('pdpx-product-hero-image');
  if (!container || !realViews) return;
  if (container.childElementCount > 0) return; // already populated

  const realViewKeys = Object.keys(realViews || {});
  for (let i = 0; i < realViewKeys.length; i += 1) {
    const type = realViewKeys[i];
    const item = document.createElement('button');
    item.className = 'pdpx-image-thumbnail-carousel-item';
    item.dataset.imageType = type;
    if (heroImageType === type) item.classList.add('selected');
    const img = document.createElement('img');
    img.className = 'pdpx-image-thumbnail-carousel-item-image';
    img.dataset.imageType = type;
    img.src = realViews[type];
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 76;
    img.height = 76;
    item.addEventListener('click', (el) => {
      item.classList.add('selected');
      container.querySelectorAll('.pdpx-image-thumbnail-carousel-item').forEach((it) => { if (it !== el.currentTarget) it.classList.remove('selected'); });
      const newSrc = el.currentTarget.querySelector('img').src;
      if (hero) {
        hero.src = newSrc;
        hero.dataset.imageType = el.currentTarget.dataset.imageType;
      }
    });
    item.appendChild(img);
    container.appendChild(item);
  }
}
