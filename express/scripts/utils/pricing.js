import { getLibs } from '../utils.js';

const { getConfig } = await import(`${getLibs()}/utils/utils.js`);

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

function normCountry(country) {
  return (country.toLowerCase() === 'uk' ? 'gb' : country.toLowerCase()).split('_')[0];
}

// eslint-disable-next-line import/prefer-default-export
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
