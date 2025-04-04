import { getLibs, yieldToMain, getMobileOperatingSystem, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let getConfig;

let currDrawer = null;
const largeMQ = window.matchMedia('(min-width: 1280px)');
const mediumMQ = window.matchMedia('(min-width: 768px)');
const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

const APPLE = 'apple';
const GOOGLE = 'google';

function drawerOff() {
  if (!currDrawer) return;
  currDrawer.closest('.card').setAttribute('aria-expanded', false);
  currDrawer.classList.add('hide');
  currDrawer.querySelector('video')?.pause()?.catch(() => { });
  currDrawer = null;
  if (!largeMQ.matches) document.body.classList.remove('disable-scroll');
}
function drawerOn(drawer) {
  drawerOff();
  drawer.closest('.card').setAttribute('aria-expanded', true);
  drawer.classList.remove('hide');
  const video = drawer.querySelector('video');
  if (video && !reduceMotionMQ.matches) {
    video.muted = true;
    video.play().catch(() => { });
  }
  currDrawer = drawer;
  if (!largeMQ.matches) document.body.classList.add('disable-scroll');
}
document.addEventListener('click', (e) => currDrawer && !currDrawer.closest('.card').contains(e.target) && drawerOff());
let isTouch;
const iconRegex = /icon-\s*([^\s]+)/;
async function decorateDrawer(videoSrc, poster, titleText, panels, panelsFrag, drawer) {
  const titleRow = createTag('div', { class: 'title-row' });
  const content = createTag('div', { class: 'content' });
  const closeButton = createTag('button', { 'aria-label': 'close' }, getIconElementDeprecated('close-black'));
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    drawerOff();
  });
  titleRow.append(createTag('strong', { class: 'drawer-title' }, titleText), closeButton);
  await yieldToMain();

  const icons = panelsFrag.querySelectorAll('.icon');
  const anchors = [...panelsFrag.querySelectorAll('a')];
  anchors.forEach((anchor, i) => {
    const parent = anchor.parentElement;
    if (parent.tagName === 'P') {
      parent.classList.add('drawer-cta-wrapper');
    }
    anchor.classList.add('drawer-cta');
    const icon = icons[i];
    const match = icon && iconRegex.exec(icon.className);
    if (match?.[1]) {
      icon.append(getIconElementDeprecated(match[1]));
    }
    const anchorText = anchor.textContent.trim();
    anchor.textContent = '';
    anchor.title = anchor.title || anchorText;
    anchor.append(createTag('div', { class: 'text-group' }, [icon, anchorText]));

    const mLabel = parent.querySelector('em');
    const dLabel = parent.querySelector('strong');
    const [toStay, toGo] = document.body.dataset?.device === 'mobile' ? [mLabel, dLabel] : [dLabel, mLabel];
    toStay?.contains(toGo) && toGo.replaceWith(...toGo.childNodes);
    toGo?.remove();
    if (toStay) {
      toStay.classList.add('grid-marquee-label');
      anchor.append(toStay);
    }
  });

  const video = createTag('video', {
    playsinline: '',
    muted: '',
    loop: '',
    preload: 'metadata',
    title: titleText,
    poster,
  }, `<source src="${videoSrc}" type="video/mp4">`);
  const videoWrapper = createTag('button', { class: 'video-container' }, video);
  // link video to first anchor
  videoWrapper.addEventListener('click', () => anchors[0]?.click());
  videoWrapper.setAttribute('title', anchors[0]?.title);

  content.append(titleRow, videoWrapper, panelsFrag);
  drawer.append(content);
  if (panels.length <= 1) {
    return;
  }

  const tabList = createTag('div', { role: 'tablist' });
  let activeTab = null;
  panels.forEach((panel, i) => {
    panel.role = 'tabpanel';
    const tabHead = panel.querySelector('p');
    const tabName = tabHead.textContent;
    const id = `${titleText}-${tabName}`;
    tabHead.remove();
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.id = `panel-${id}`;
    i > 0 && panel.classList.add('hide');
    const tab = createTag('button', {
      role: 'tab',
      'aria-selected': i === 0,
      'aria-controls': `panel-${id}`,
      id: `tab-${id}`,
    }, tabName);
    activeTab ||= tab;
    tab.addEventListener('click', () => {
      activeTab.setAttribute('aria-selected', false);
      tab.setAttribute('aria-selected', true);
      panels.forEach((p) => {
        p === panel ? p.classList.remove('hide') : p.classList.add('hide');
      });
      activeTab = tab;
    });
    tabList.append(tab);
  });

  panels[0].before(tabList);
}
function addCardInteractions(card, drawer) {
  card.addEventListener('click', (e) => {
    if (currDrawer && e.target !== card && !card.contains(e.target)) return;
    e.stopPropagation();
    drawerOn(drawer);
  });
  card.addEventListener('touchstart', () => {
    isTouch = true;
  });
  card.addEventListener('mouseenter', () => {
    if (isTouch) return; // touchstart->mouseenter->click
    drawerOn(drawer);
  });
  card.addEventListener('mouseleave', () => {
    drawerOff();
  });
}
function toCard(drawer) {
  const titleText = drawer.querySelector('strong').textContent.trim();
  const [face, ...panels] = [...drawer.querySelectorAll(':scope > div')];
  const panelsFrag = new DocumentFragment();
  panelsFrag.append(...panels);
  panels.forEach((panel) => panel.classList.add('panel'));
  const videoAnchor = face.querySelector('a');
  videoAnchor?.remove();
  const card = createTag('button', {
    class: 'card',
    'aria-controls': `drawer-${titleText}`,
    'aria-expanded': false,
    'aria-label': titleText,
  }, [face, drawer]);

  face.classList.add('face');
  addCardInteractions(card, drawer);
  const lazyCB = () => decorateDrawer(videoAnchor.href, face.querySelector('img').src, titleText, panels, panelsFrag, drawer);
  drawer.classList.add('drawer', 'hide');
  drawer.id = `drawer-${titleText}`;
  return { card, lazyCB };
}

async function formatDynamicCartLink(a) {
  try {
    const pattern = /.*commerce.*adobe\.com.*/gm;
    if (!pattern.test(a.href)) return a;
    a.style.visibility = 'hidden';
    const {
      fetchPlanOnePlans,
      buildUrl,
    } = await import('../../scripts/utils/pricing.js');
    const {
      url,
      country,
      language,
      offerId,
    } = await fetchPlanOnePlans(a.href);
    const newTrialHref = buildUrl(url, country, language, getConfig, offerId);
    a.href = newTrialHref;
  } catch (error) {
    window.lana.log(`Failed to fetch prices for page plan: ${error}`);
  }
  a.style.visibility = 'visible';
  return a;
}

function decorateHeadline(headline) {
  const ctas = headline.querySelectorAll('a');
  if (!ctas.length) return headline;
  ctas[0].parentElement.classList.add('ctas');
  ctas.forEach((cta) => {
    cta.classList.add('button');
    formatDynamicCartLink(cta);
  });
  ctas[0].classList.add('primaryCTA');
  headline.classList.add('headline');
  return headline;
}

async function makeRating(
  store,
  ratingPlaceholder,
  starsPlaceholder,
  playStoreLabelPlaceholder,
  appleStoreLabelPlaceholder,
) {
  const ratings = ratingPlaceholder?.split(';') || [];
  const link = ratings[2]?.trim();
  if (!link) {
    return null;
  }

  const storeTypeIndex = [APPLE, GOOGLE].indexOf(store);
  const [score, cnt] = ratings[storeTypeIndex].split(',').map((str) => str.trim());
  const ariaLabel = store === APPLE ? appleStoreLabelPlaceholder : playStoreLabelPlaceholder;
  const storeLink = createTag('a', {
    href: link,
  }, getIconElementDeprecated(`${store}-store`));
  storeLink.setAttribute('aria-label', ariaLabel);
  const { default: trackBranchParameters } = await import('../../scripts/branchlinks.js');
  await trackBranchParameters([storeLink]);

  const star = getIconElementDeprecated('star');
  star.setAttribute('role', 'img');
  star.setAttribute('aria-label', starsPlaceholder);
  return createTag('div', { class: 'ratings-container' }, [score, star, cnt, storeLink]);
}

async function makeRatings(
  ratingPlaceholder,
  starsPlaceholder,
  playStoreLabelPlaceholder,
  appleStoreLabelPlaceholder,
) {
  const ratings = createTag('div', { class: 'ratings' });
  const userAgent = getMobileOperatingSystem();
  if (userAgent !== 'Android') {
    const appleElement = await makeRating(
      'apple',
      ratingPlaceholder,
      starsPlaceholder,
      playStoreLabelPlaceholder,
      appleStoreLabelPlaceholder,
    );
    appleElement && ratings.append(appleElement);
  }
  if (userAgent !== 'iOS') {
    const googleElement = await makeRating(
      'google',
      ratingPlaceholder,
      starsPlaceholder,
      playStoreLabelPlaceholder,
      appleStoreLabelPlaceholder,
    );
    googleElement && ratings.append(googleElement);
  }
  return ratings;
}

export default async function init(el) {
  ({ createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`));
  const { replaceKey } = await import(`${getLibs()}/features/placeholders.js`);
  const [ratingPlaceholder,
    starsPlaceholder,
    playStoreLabelPlaceholder,
    appleStoreLabelPlaceholder] = await Promise.all(
      [
        replaceKey('app-store-ratings', getConfig()),
        replaceKey('app-store-stars', getConfig()),
        replaceKey('app-store-ratings-play-store', getConfig()),
        replaceKey('app-store-ratings-apple-store', getConfig()),
      ],
    ); 
  const rows = [...el.querySelectorAll(':scope > div')];
  const [headline, background, items, foreground] = [rows[0], rows[1], rows.slice(2), createTag('div', { class: 'foreground' })];
  const logo = getIconElementDeprecated('adobe-express-logo');
  logo.classList.add('express-logo');
  const cards = items.map((item) => toCard(item));
  const cardsContainer = createTag('div', { class: 'cards-container' }, cards.map(({ card }) => card));
  [...cardsContainer.querySelectorAll('p:empty')].forEach((p) => p.remove());
  foreground.append(logo, decorateHeadline(headline), cardsContainer, ...(el.classList.contains('ratings') ? [await makeRatings(
    ratingPlaceholder,
    starsPlaceholder,
    playStoreLabelPlaceholder,
    appleStoreLabelPlaceholder,
  )] : []));
  background.classList.add('background');
  el.append(foreground);
  new IntersectionObserver((entries, ob) => {
    ob.unobserve(el);
    cards.forEach((card) => card.lazyCB());
  }).observe(el);
  largeMQ.addEventListener('change', () => {
    isTouch = false;
    drawerOff();
  });
  mediumMQ.addEventListener('change', () => {
    drawerOff();
  });
}
