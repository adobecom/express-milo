import { getLibs, getMobileOperatingSystem, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag;
let getConfig;

const APPLE ='apple'
const GOOGLE = 'google' 

async function makeRating(store) {
    const { replaceKey } = await import(`${getLibs()}/features/placeholders.js`);

    const [ratingPlaceholder, starsPlaceholder, playStorePlaceholder, appleStorePlaeholder] = await Promise.all(
      [
        await replaceKey('app-store-ratings', getConfig()),
        await replaceKey('app-store-stars', getConfig()),
        await replaceKey('app-store-ratings-play-store', getConfig()),
        await replaceKey('app-store-ratings-apple-store', getConfig()) 
      ]
    )
    const ratings = ratingPlaceholder?.split(';') || []; 
    const link = ratings[2]?.trim();
    if (!link) {
      return null;
    }

    const storeTypeIndex = [APPLE, GOOGLE].indexOf(store);
    const [score, cnt] = ratings[storeTypeIndex].split(',').map((str) => str.trim());
    const ariaLabel = store === APPLE ? appleStorePlaeholder : playStorePlaceholder
    const storeLink = createTag('a', { href: link ,
     }, getIconElementDeprecated(`${store}-store`));  
     storeLink.setAttribute('aria-label', ariaLabel)
    const { default: trackBranchParameters } = await import('../../scripts/branchlinks.js');
    await trackBranchParameters([storeLink]);
    const star =  getIconElementDeprecated('star')
    star.setAttribute('alt', starsPlaceholder)
    star.setAttribute('role', 'img')
    star.setAttribute('aria-hidden', 'true')
    return createTag('div', { class: 'ratings-container' }, [score, star, cnt, storeLink]);
  }
  
  function makeRatings() {
    const ratings = createTag('div', { class: 'ratings' });
    const userAgent = getMobileOperatingSystem();
    const cb = (el) => el && ratings.append(el);
    // eslint-disable-next-line chai-friendly/no-unused-expressions
    userAgent !== 'iOS' && makeRating('google').then(cb);
    // eslint-disable-next-line chai-friendly/no-unused-expressions
    userAgent !== 'Android' && makeRating('apple').then(cb);
   
    return ratings;
  }
  
  export default async function decorate(block) {
    ({ createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`));
    block.append(makeRatings());
  }