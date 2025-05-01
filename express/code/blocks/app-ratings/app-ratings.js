import { getLibs, getMobileOperatingSystem, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag;
let getConfig;

const APPLE = 'apple';
const GOOGLE = 'google';

/**
 * Creates a ratings container for a specific store (Apple or Google)
 * @param {string} store - 'apple' or 'google'
 * @param {string} ratingPlaceholder - Placeholder string for ratings (e.g., '4.8, 1M; 4.7, 2M; https://store.link')
 * @param {string} starsPlaceholder - Placeholder for the aria-label of the star icon
 * @param {string} playStoreLabelPlaceholder - Placeholder for Play Store link aria-label
 * @param {string} appleStoreLabelPlaceholder - Placeholder for Apple Store link aria-label
 * @param {string} customURL - Optional custom URL for the store link
 * @returns {Promise<HTMLElement|null>} The ratings container
 *  element or null if no link is available
 */
async function makeRating(
  store,
  ratingPlaceholder,
  starsPlaceholder,
  playStoreLabelPlaceholder,
  appleStoreLabelPlaceholder,
  customURL,
) {
  const ratings = ratingPlaceholder?.split(';') || [];
  const link = customURL || ratings[2]?.trim();
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

/**
 * Creates the ratings block for both Apple and Google stores, depending on device
 * @param {string} ratingPlaceholder
 * @param {string} starsPlaceholder
 * @param {string} playStoreLabelPlaceholder
 * @param {string} appleStoreLabelPlaceholder
 * @param {string} customURL
 * @returns {Promise<HTMLElement>} The ratings block element
 */
async function makeRatings(
  ratingPlaceholder,
  starsPlaceholder,
  playStoreLabelPlaceholder,
  appleStoreLabelPlaceholder,
  customURL,
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
      customURL,
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
      customURL,
    );
    googleElement && ratings.append(googleElement);
  }
  return ratings;
}

/**
 * Main decorator function for the app ratings block
 * Dynamically loads utilities, fetches placeholders, and renders the ratings UI
 * @param {HTMLElement} block - The app ratings block element
 */
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

  let customURL;
  const customUrlElement = block.querySelector(':scope > div a');
  if (customUrlElement) {
    customURL =  customUrlElement.getAttribute('href');
  }

  block.append(await makeRatings(
    ratingPlaceholder,
    starsPlaceholder,
    playStoreLabelPlaceholder,
    appleStoreLabelPlaceholder,
    customURL
  ));

  if (customUrlElement) {
    customUrlElement.remove();
  }
}
