import { getLibs } from '../../scripts/utils.js';

const { getConfig } = await import(
  `${getLibs()}/utils/utils.js`
);

export function normCountry(country) {
  return (country.toLowerCase() === 'uk' ? 'gb' : country.toLowerCase()).split('_')[0];
}

function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export async function getCountry() {
  const urlParams = new URLSearchParams(window.location.search);
  let countryCode = urlParams.get('country') || getCookie('international');
  if (countryCode) {
    return normCountry(countryCode);
  }
  countryCode = sessionStorage.getItem('visitorCountry');
  if (countryCode) return countryCode;

  const fedsUserGeo = window.feds?.data?.location?.country;
  if (fedsUserGeo) {
    const normalized = normCountry(fedsUserGeo);
    sessionStorage.setItem('visitorCountry', normalized);
    return normalized;
  }

  const resp = await fetch('https://geo2.adobe.com/json/');
  if (resp.ok) {
    const { country } = await resp.json();
    const normalized = normCountry(country);
    sessionStorage.setItem('visitorCountry', normalized);
    return normalized;
  }

  const configCountry = getConfig().locale.region;
  return normCountry(configCountry);
}

const formatSalesPhoneNumber = (() => {
  let numbersMap;
  return async (tags, placeholder = '') => {
    if (tags.length <= 0) return;

    if (!numbersMap) {
      numbersMap = await fetch('/express/system/business-sales-numbers.json').then((r) => r.json());
    }

    if (!numbersMap?.data) return;
    const country = await getCountry() || 'us';
    tags.forEach((a) => {
      const r = numbersMap.data.find((d) => d.country === country);

      const decodedNum = r ? decodeURI(r.number.trim()) : decodeURI(a.href.replace('tel:', '').trim());

      a.textContent = placeholder ? a.textContent.replace(placeholder, decodedNum) : decodedNum;
      a.setAttribute('title', placeholder ? a.getAttribute('title').replace(placeholder, decodedNum) : decodedNum);
      a.href = `tel:${decodedNum}`;
    });
  };
})();

function normalizeHeadings(block, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((tag) => {
    const h = tag.tagName.toLowerCase();
    if (allowed.indexOf(h) === -1) {
      // current heading is not in the allowed list -> try first to "promote" the heading
      let level = parseInt(h.charAt(1), 10) - 1;
      while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
        level -= 1;
      }
      if (level === 0) {
        // did not find a match -> try to "downgrade" the heading
        while (allowed.indexOf(`h${level}`) === -1 && level < 7) {
          level += 1;
        }
      }
      if (level !== 7) {
        tag.outerHTML = `<h${level}>${tag.textContent.trim()}</h${level}>`;
      }
    }
  });
}

export default async function decorate(block) {
  normalizeHeadings(block, ['h2', 'h3']);
  const buttons = block.querySelectorAll('a.button');
  if (buttons.length > 1) {
    block.classList.add('multi-button');
  }
  // button on dark background
  buttons.forEach(($button) => {
    $button.classList.remove('primary');
    $button.classList.remove('secondary');

    if (block.classList.contains('light')) {
      $button.classList.remove('accent');
      $button.classList.add('large', 'primary', 'reverse');
    } else {
      $button.classList.add('accent', 'dark');
      if (block.classList.contains('multi-button')) {
        $button.classList.add('reverse');
      }
    }
  });

  const phoneNumberTags = block.querySelectorAll('a[title="{{business-sales-numbers}}"]');
  if (phoneNumberTags.length > 0) {
    await formatSalesPhoneNumber(phoneNumberTags);
  }
}
