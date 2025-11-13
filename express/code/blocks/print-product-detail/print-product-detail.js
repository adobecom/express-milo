import { getLibs } from '../../scripts/utils.js';
import { addPrefetchLinks, extractTemplateId } from './utilities/utility-functions.js';

function normalizeLocale(ietf) {
  const SUPPORTED_REGIONS = new Set(['at', 'br', 'us', 'au', 'ca', 'gb', 'nz', 'de', 'ch', 'es', 'fr', 'be', 'jp', 'kr', 'nl', 'pt', 'se']);
  const SUPPORTED_LANGUAGES = new Set(['en', 'de', 'es', 'fr', 'ja', 'ko', 'nl', 'pt', 'sv']);
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

async function createZazzleStore() {
  const { createZazzlePDPStore } = await import('./sdk/index.js');

  const { getConfig } = await import(`${getLibs()}/utils/utils.js`);
  const { locale } = getConfig();
  const { language, region } = normalizeLocale(locale?.ietf);

  const sdkStore = createZazzlePDPStore({ language, region });

  return {
    env: sdkStore.env,
    sdk: sdkStore,
  };
}

export default async function decorate(block) {
  await addPrefetchLinks();

  const templateId = extractTemplateId(block);

  if (!templateId) {
    // eslint-disable-next-line no-console
    console.error('print-product-detail: No template ID found in block');
    return;
  }

  block.innerHTML = '';

  const mountPoint = document.createElement('div');
  block.append(mountPoint);

  const [{ html, render }, { default: PDPApp }, store] = await Promise.all([
    import('../../scripts/vendors/htm-preact.js'),
    import('./components/PDPApp.js'),
    createZazzleStore(),
  ]);

  render(html`<${PDPApp} sdkStore=${store.sdk} templateId=${templateId} />`, mountPoint);
}
