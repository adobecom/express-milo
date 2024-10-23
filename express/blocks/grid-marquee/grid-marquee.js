import { getLibs, yieldToMain } from '../../scripts/utils.js';
const { createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`);
import { getIconElementDeprecated } from '../../scripts/utils/icons.js';

let currDrawer = null;
const desktopMQ = window.matchMedia('(min-width: 1200px)');
const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }

  return 'unknown';
}

function drawerOff() {
  if (!currDrawer) return;
  currDrawer.closest('.card').setAttribute('aria-expanded', false);
  currDrawer.setAttribute('aria-hidden', true);
  currDrawer.querySelector('video')?.pause()?.catch(() => {});
  currDrawer = null;
}
function drawerOn(drawer) {
  drawerOff();
  drawer.closest('.card').setAttribute('aria-expanded', true);
  drawer.setAttribute('aria-hidden', false);
  const video = drawer.querySelector('video');
  if (video && !reduceMotionMQ.matches) {
    video.muted = true;
    video.play().catch(() => {});
  }
  currDrawer = drawer;
}
document.addEventListener('click', (e) => {
  currDrawer && !currDrawer.closest('.card').contains(e.target) && drawerOff();
});
let isTouch;
const iconRegex = /icon-(.+)/;
async function decorateDrawer(video, poster, titleText, panels, panelsFrag, drawer) {
  const titleRow = createTag('div', { class: 'title-row' });
  const content = createTag('div', { class: 'content' });
  const closeButton = createTag('button', { 'aria-label': 'close' }, getIconElementDeprecated('close-black'));
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    drawerOff();
  });
  titleRow.append(createTag('strong', { class: 'drawer-title' }, titleText), closeButton);
  await yieldToMain();
  video.setAttribute('muted', true);
  video.setAttribute('loop', true);
  video.setAttribute('preload', 'metadata');
  video.setAttribute('title', titleText);
  video.setAttribute('poster', poster);
  video.removeAttribute('controls');
  const videoWrapper = createTag('div', { class: 'video-container' }, video);

  const icons = panelsFrag.querySelectorAll('.icon');
  const anchors = [...panelsFrag.querySelectorAll('a')];
  anchors.forEach((anchor, i) => {
    anchor.classList.add('drawer-cta');
    const icon = icons[i];
    const match = icon && iconRegex.exec(icon.className);
    if (match?.[1]) {
      icon.append(getIconElementDeprecated(match[1]));
    }
    anchor?.prepend(icon);
  });
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
    panel.setAttribute('aria-hidden', i > 0);
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
        p.setAttribute('aria-hidden', p !== panel);
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
  const video = face.querySelector('video');
  const card = createTag('button', {
    class: 'card',
    'aria-controls': `drawer-${titleText}`,
    'aria-expanded': false,
    'aria-label': titleText,
  }, [face, drawer]);

  face.classList.add('face');
  addCardInteractions(card, drawer);
  const lazyCB = () => decorateDrawer(video, face.querySelector('img').src, titleText, panels, panelsFrag, drawer);
  drawer.classList.add('drawer');
  drawer.setAttribute('aria-hidden', true);
  drawer.id = `drawer-${titleText}`;
  return { card, lazyCB };
}

function decorateHeadline(headline) {
  const ctas = headline.querySelectorAll('a');
  if (!ctas.length) return headline;
  ctas[0].parentElement.classList.add('ctas');
  ctas.forEach((cta) => cta.classList.add('button'));
  ctas[0].classList.add('primaryCTA');
  headline.classList.add('headline');
  return headline;
}

async function makeRating(store) {
  const { replaceKey } = await import(`${getLibs()}/features/placeholders.js`);
  const ratings = (await replaceKey('app-store-ratings', getConfig()))?.split(';') || [];
  const link = ratings[2]?.trim();
  if (!link) {
    return null;
  }
  const [score, cnt] = ratings[['apple', 'google'].indexOf(store)].split(',').map((str) => str.trim());
  const storeLink = createTag('a', { href: link }, getIconElementDeprecated(`${store}-store`));
  const { default: trackBranchParameters } = await import('../../scripts/branchlinks.js');
  await trackBranchParameters([storeLink]);
  return createTag('div', { class: 'ratings-container' }, [score, getIconElementDeprecated('star'), cnt, storeLink]);
}

function makeRatings() {
  const ratings = createTag('div', { class: 'ratings' });
  const userAgent = getMobileOperatingSystem();
  const cb = (el) => el && ratings.append(el);
  userAgent !== 'Android' && makeRating('apple').then(cb);
  userAgent !== 'iOS' && makeRating('google').then(cb);
  return ratings;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const [headline, background, items, foreground] = [rows[0], rows[1], rows.slice(2), createTag('div', { class: 'foreground' })];
  const logo = getIconElementDeprecated('adobe-express-logo');
  logo.classList.add('express-logo');
  const cards = items.map((item) => toCard(item));
  const cardsContainer = createTag('div', { class: 'cards-container' }, cards.map(({ card }) => card));
  foreground.append(logo, decorateHeadline(headline), cardsContainer, ...(el.classList.contains('ratings') ? [makeRatings()] : []));
  background.classList.add('background');
  el.append(foreground);
  new IntersectionObserver((entries, ob) => {
    ob.unobserve(el);
    cards.forEach((card) => card.lazyCB());
  }).observe(el);
  desktopMQ.addEventListener('change', () => {
    isTouch = false;
    drawerOff();
  });
}
