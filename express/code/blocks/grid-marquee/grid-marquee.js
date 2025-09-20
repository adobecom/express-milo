import { getLibs, getMobileOperatingSystem, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let getConfig;

let currDrawer = null;
let largeMQ;
let mediumMQ;
let reduceMotionMQ;

const APPLE = 'apple';
const GOOGLE = 'google';

// Phase 1: Defer non-critical initialization
function initializeMediaQueries() {
  if (!largeMQ) largeMQ = window.matchMedia('(min-width: 1280px)');
  if (!mediumMQ) mediumMQ = window.matchMedia('(min-width: 768px)');
  if (!reduceMotionMQ) reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
}

function drawerOff() {
  if (!currDrawer) return;
  currDrawer.closest('.card').setAttribute('aria-expanded', false);
  currDrawer.classList.add('hide');

  const video = currDrawer.querySelector('video');
  if (video) {
    video.pause()?.catch(() => { });
  }

  currDrawer = null;
  initializeMediaQueries();
  if (!largeMQ.matches) document.body.classList.remove('disable-scroll');
}
function drawerOn(drawer) {
  drawerOff();
  drawer.closest('.card').setAttribute('aria-expanded', true);
  drawer.classList.remove('hide');
  const video = drawer.querySelector('video');
  initializeMediaQueries();
  
  // Load video only when drawer opens (event-driven loading)
  if (video) {
    if (video.dataset.src && !video.src) {
      video.src = video.dataset.src;
      video.load();
    }
    if (!reduceMotionMQ.matches) {
      video.muted = true;
      video.play().catch(() => { });
    }
  }
  
  currDrawer = drawer;
  if (!largeMQ.matches) document.body.classList.add('disable-scroll');
}
document.addEventListener('click', (e) => {
  if (currDrawer && !currDrawer.closest('.card').contains(e.target)) {
    drawerOff();
  }
});
let isTouch;
const iconRegex = /icon-\s*([^\s]+)/;
function decorateDrawer(videoSrc, poster, titleText, panels, panelsFrag, drawer) {
  const titleRow = createTag('div', { class: 'title-row' });
  const content = createTag('div', { class: 'content' });
  const closeButton = createTag('button', { 'aria-label': 'close' }, getIconElementDeprecated('close-black'));
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    drawerOff();
  });
  titleRow.append(createTag('strong', { class: 'drawer-title' }, titleText), closeButton);

  const icons = panelsFrag.querySelectorAll('.icon');
  const anchors = [...panelsFrag.querySelectorAll('a')];

  const fragment = document.createDocumentFragment();

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

    fragment.append(anchor);
  });

  const video = createTag('video', {
    playsinline: '',
    muted: '',
    loop: '',
    preload: 'none',
    title: titleText,
    poster,
    'data-src': videoSrc,
    loading: 'lazy',
  });
  const videoWrapper = createTag('button', { class: 'video-container' }, video);

  // Video loading is event-driven - only load when drawer opens
  // No intersection observer needed since video is hidden until drawer opens

  // link video to first anchor
  videoWrapper.addEventListener('click', () => anchors[0]?.click());
  videoWrapper.setAttribute('title', anchors[0]?.title);

  panelsFrag.append(fragment);

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

// Phase 1: Defer non-critical cart link formatting
async function formatDynamicCartLink(a) {
  try {
    const pattern = /.*commerce.*adobe\.com.*/gm;
    if (!pattern.test(a.href)) return a;

    // Show link immediately, update in background
    a.style.visibility = 'visible';

    // Use requestIdleCallback for non-critical pricing updates
    const updateLink = async () => {
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
    };

    if (window.requestIdleCallback) {
      requestIdleCallback(updateLink, { timeout: 2000 });
    } else {
      setTimeout(updateLink, 100);
    }
  } catch (error) {
    window.lana?.log(`Failed to fetch prices for page plan: ${error}`);
  }
  return a;
}

function decorateHeadline(headline) {
  headline.classList.add('headline');
  const ctas = headline.querySelectorAll('a');
  if (!ctas.length) {
    headline.classList.add('no-cta');
    return headline;
  }
  ctas[0].parentElement.classList.add('ctas');
  ctas.forEach((cta) => {
    cta.classList.add('button');
    formatDynamicCartLink(cta);
  });
  ctas[0].classList.add('primaryCTA');
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

// Phase 1: Critical path - essential DOM structure
async function phase1CriticalPath(el) {
  ({ createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`));

  const rows = [...el.querySelectorAll(':scope > div')];
  const [headline, background, items, foreground] = [rows[0], rows[1], rows.slice(2), createTag('div', { class: 'foreground' })];

  // Essential DOM structure only
  const logo = getIconElementDeprecated('adobe-express-logo');
  logo.classList.add('express-logo');
  const cards = items.map((item) => toCard(item));
  const cardsContainer = createTag('div', { class: 'cards-container' }, cards.map(({ card }) => card));

  // Clean up empty elements
  [...cardsContainer.querySelectorAll('p:empty')].forEach((p) => p.remove());

  foreground.append(logo, decorateHeadline(headline), cardsContainer);
  background.classList.add('background');
  el.append(foreground);

  return { cards, el };
}

// Phase 2: Non-critical enhancements
async function phase2NonCritical(el) {
  const { replaceKey } = await import(`${getLibs()}/features/placeholders.js`);

  // Defer ratings loading
  if (el.classList.contains('ratings')) {
    const [ratingPlaceholder,
      starsPlaceholder,
      playStoreLabelPlaceholder,
      appleStoreLabelPlaceholder] = await Promise.all([
      replaceKey('app-store-ratings', getConfig()),
      replaceKey('app-store-stars', getConfig()),
      replaceKey('app-store-ratings-play-store', getConfig()),
      replaceKey('app-store-ratings-apple-store', getConfig()),
    ]);

    const ratings = await makeRatings(
      ratingPlaceholder,
      starsPlaceholder,
      playStoreLabelPlaceholder,
      appleStoreLabelPlaceholder,
    );
    el.querySelector('.foreground').append(ratings);
  }
}

// Phase 3: Interaction readiness
function phase3InteractionReadiness(el, cards) {
  initializeMediaQueries();

  // Optimized intersection observer
  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      observer.unobserve(el);

      // Use requestIdleCallback for non-critical card initialization
      if (window.requestIdleCallback) {
        requestIdleCallback(() => {
          cards.forEach((card) => card.lazyCB());
        });
      } else {
        setTimeout(() => {
          cards.forEach((card) => card.lazyCB());
        }, 0);
      }
    }
  }, {
    rootMargin: '100px',
    threshold: 0.1,
  });

  observer.observe(el);

  // Defer event listeners
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      largeMQ.addEventListener('change', () => {
        isTouch = false;
        drawerOff();
      });
      mediumMQ.addEventListener('change', () => {
        drawerOff();
      });
    });
  } else {
    setTimeout(() => {
      largeMQ.addEventListener('change', () => {
        isTouch = false;
        drawerOff();
      });
      mediumMQ.addEventListener('change', () => {
        drawerOff();
      });
    }, 0);
  }
}

export default async function init(el) {
  // Phase 1: Critical path
  const { cards } = await phase1CriticalPath(el);

  // Phase 2: Non-critical (deferred)
  if (window.requestIdleCallback) {
    requestIdleCallback(() => phase2NonCritical(el));
  } else {
    setTimeout(() => phase2NonCritical(el), 0);
  }

  // Phase 3: Interaction readiness
  phase3InteractionReadiness(el, cards);
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currDrawer) {
    e.preventDefault();
    drawerOff();
  }
});
