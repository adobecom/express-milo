export function formatUrlForEnvironment(url) {
  if (window.location.hostname === 'localhost') {
    return `http://localhost:3001?url=${encodeURIComponent(url)}`;
  }
  const URLFormatted = url;
  return URLFormatted;
}

export default async function fetchAPIData(productId, parameters, endpoint) {
  const urlParams = new URLSearchParams(window.location.search);
  const region = urlParams.get('region');
  const topLevelDomain = region === 'uk' ? 'co.uk' : 'com';
  const parametersString = parameters ? Object.entries(parameters).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&') : '';

  const base = `https://www.zazzle.${topLevelDomain}/svc/partner/adobeexpress/v1/${endpoint}?productId=${productId}`;
  const separator = parametersString ? '&' : '';
  const url = `${base}${separator}${parametersString}`;

  let apiDataFetch;
  try {
    apiDataFetch = await fetch(formatUrlForEnvironment(url));
  } catch (error) {
    console.info(error);
  }
  const apiDataJSON = await apiDataFetch.json();
  const apiData = apiDataJSON.data;
  return apiData;
}
export async function fetchUIStrings() {
  const apiDataFetch = await fetch('/express/code/blocks/print-product-detail/sample_data/UIStrings.json');
  const apiDataJSON = await apiDataFetch.json();
  return apiDataJSON;
}
