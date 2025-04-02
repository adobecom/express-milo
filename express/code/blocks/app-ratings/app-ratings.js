import { getLibs, getMobileOperatingSystem, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag;
let getConfig;

const APPLE = 'apple';
const GOOGLE = 'google';

async function makeRating(store) {
  const { replaceKey } = await import(`${getLibs()}/features/placeholders.js`);

  const [ratingPlaceholder,
    starsPlaceholder,
    playStorePlaceholder,
    appleStorePlaeholder] = await Promise.all(
    [
      await replaceKey('app-store-ratings', getConfig()),
      await replaceKey('app-store-stars', getConfig()),
      await replaceKey('app-store-ratings-play-store', getConfig()),
      await replaceKey('app-store-ratings-apple-store', getConfig()),
    ],
  );
  const ratings = ratingPlaceholder?.split(';') || [];
  const link = ratings[2]?.trim();
  if (!link) {
    return null;
  }

  const storeTypeIndex = [APPLE, GOOGLE].indexOf(store);
  const [score, cnt] = ratings[storeTypeIndex].split(',').map((str) => str.trim());
  const ariaLabel = store === APPLE ? appleStorePlaeholder : playStorePlaceholder;
  const storeLink = createTag('a', { href: link,
  }, getIconElementDeprecated(`${store}-store`));
  storeLink.setAttribute('aria-label', ariaLabel);
  const { default: trackBranchParameters } = await import('../../scripts/branchlinks.js');
  await trackBranchParameters([storeLink]);

  const ratingsContainerAria = score + " " + starsPlaceholder + " " + cnt; 

  const star = getIconElementDeprecated('star');
  star.setAttribute('aria-label', starsPlaceholder);
  star.setAttribute('role', 'img');
  star.setAttribute('aria-hidden' , 'true')
  const b = createTag('div', { class: 'ratings-container'}, [score, star, cnt]);
  b.setAttribute('role', 'status')
  b.setAttribute('aria-label', ratingsContainerAria);
  const a = createTag('div' , { class :"ratings-container"}, [b, storeLink])
  return a
}

async function makeRatings() {
  const ratings = createTag('div', { class: 'ratings' });
  const userAgent = getMobileOperatingSystem();
  if (userAgent !== 'Android') {
    const appleElement = await makeRating('apple');
    appleElement && ratings.append(appleElement);
  }
  if (userAgent !== 'iOS') {
    const googleElement = await makeRating('google');
    googleElement && ratings.append(googleElement);
  }
  return ratings;
}

export default async function decorate(block) {
  ({ createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`));
  block.append(await makeRatings());
}
