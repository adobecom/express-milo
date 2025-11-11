import { getLibs } from '../../../scripts/utils.js';

const SUPPORTED_REGIONS = new Set(['at', 'br', 'us', 'au', 'ca', 'gb', 'nz', 'de', 'ch', 'es', 'fr', 'be', 'jp', 'kr', 'nl', 'pt', 'se']);
const SUPPORTED_LANGUAGES = new Set(['en', 'de', 'es', 'fr', 'ja', 'ko', 'nl', 'pt', 'sv']);

let storePromise;

function normalizeLocale(ietf) {
  if (!ietf) {
    return { language: 'en', region: 'us' };
  }

  const [languageRaw = 'en', regionRaw = 'us'] = ietf.split('-');
  const language = languageRaw.toLowerCase();
  const region = regionRaw.toLowerCase();

  return {
    language: SUPPORTED_LANGUAGES.has(language) ? language : 'en',
    region: SUPPORTED_REGIONS.has(region) ? region : 'us',
  };
}

async function createStore() {
  const { createZazzlePDPStore } = await import('../sdk/index.js');

  const { getConfig } = await import(`${getLibs()}/utils/utils.js`);
  const { locale } = getConfig();
  const { language, region } = normalizeLocale(locale?.ietf);

  const sdkStore = createZazzlePDPStore({ language, region });

  return {
    env: sdkStore.env,
    sdk: sdkStore,
  };
}

export default async function getZazzleStore() {
  if (!storePromise) {
    storePromise = createStore();
  }
  return storePromise;
}
