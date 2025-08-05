import { getLibs, getIconElementDeprecated, createTag } from '../../scripts/utils.js';

async function formatDynamicCartLink(a) {
  try {
    const pattern = /.*commerce.*adobe\.com.*/gm;
    if (!pattern.test(a.href)) return a;
    a.style.visibility = 'hidden';
    const {
      fetchPlanOnePlans,
      buildUrl,
    } = await import('../../scripts/utils/pricing.js');
    const { getConfig } = await import(`${getLibs()}/utils/utils.js`);
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
  headline.classList.add('headline');
  const ctas = headline.querySelectorAll('a');
  if (!ctas.length) {
    headline.classList.add('no-cta');
    return headline;
  }
  ctas[0].parentElement.classList.add('ctas');
  ctas.forEach((cta) => {
    cta.classList.add('button');
  });
  ctas[0].classList.add('primaryCTA');
  return headline;
}

function decorateHeadlineAsync(headline) {
  // Enhanced version with pricing for deferred loading
  const ctas = headline.querySelectorAll('a');
  ctas.forEach((cta) => {
    formatDynamicCartLink(cta);
  });
}

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const [headline] = [rows[0]];

  // Create LCP structure immediately - PURE TEXT ONLY for fastest LCP
  const foreground = createTag('div', { class: 'foreground' });
  const logo = getIconElementDeprecated('adobe-express-logo');
  logo.classList.add('express-logo');

  // Core text decoration happens immediately
  headline.classList.add('headline');
  decorateHeadline(headline); // Basic headline decoration only

  // Insert LCP structure immediately - ZERO IMAGES
  foreground.append(logo, headline);
  el.append(foreground);

  // Postpone headline dynamic pricing until browser is idle
  if (headline.querySelectorAll('a').length) {
    const idleCb = (cb) => (
      window.requestIdleCallback
        ? window.requestIdleCallback(cb, { timeout: 3000 })
        : setTimeout(cb, 3000)
    );
    idleCb(() => {
      decorateHeadlineAsync(headline);
    });
  }
}
