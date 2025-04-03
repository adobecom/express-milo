import { getLibs, getMobileOperatingSystem, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag;
let getConfig;

const APPLE = 'apple';
const GOOGLE = 'google';

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

export default async function decorate(block) {
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
  block.append(await makeRatings(
    ratingPlaceholder,
    starsPlaceholder,
    playStoreLabelPlaceholder,
    appleStoreLabelPlaceholder,
  ));
}
