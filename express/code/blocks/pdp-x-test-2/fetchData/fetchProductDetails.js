function formatUrlForEnvironment(url, endpoint, productId, parametersString) {
  let topLevelDomain;
  // FOR DEVELOPMENT PURPOSES. NEED A BETTER LONG TERM STRATEGY TO IDENFITY TOP LEVEL DOMAINS
  const topLevelDomainSuffix = window.location.hostname.split('.').pop();
  if (topLevelDomainSuffix === 'uk') {
    topLevelDomain = 'co.uk';
  } else {
    // topLevelDomain = topLevelDomainSuffix;
    topLevelDomain = '.co.uk';
  }
  if (window.location.hostname === 'localhost') {
    return `http://localhost:3001?url=${url}`;
  }
  const URLFormatted = `https://www.zazzle${topLevelDomain}/svc/partner/adobeexpress/v1/${endpoint}?productId=${productId}&${parametersString}`;

  return URLFormatted;
}

export default async function fetchAPIData(productId, parameters, endpoint) {
  let apiDataFetch;
  let parametersString;
  let url;
  if (parameters) {
    parametersString = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  } else {
    parametersString = '';
  }
  url = `https://www.zazzle.co.uk/svc/partner/adobeexpress/v1/${endpoint}?productId=${productId}&${parametersString}`;
  try {
    apiDataFetch = await fetch(formatUrlForEnvironment(url, endpoint, productId, parametersString));
  } catch (error) {
    console.info(error);
  }

  const apiDataJSON = await apiDataFetch.json();
  const apiData = apiDataJSON.data;
  return apiData;
}
