import { getLibs } from '../../../scripts/utils.js';

const SIGNALS_IMPORT = new URL('../vendor/preact-signals/signals.module.js', import.meta.url).href;
const SUPPORTED_REGIONS = new Set(['at', 'br', 'us', 'au', 'ca', 'gb', 'nz', 'de', 'ch', 'es', 'fr', 'be', 'jp', 'kr', 'nl', 'pt', 'se']);
const SUPPORTED_LANGUAGES = new Set(['en', 'de', 'es', 'fr', 'ja', 'ko', 'nl', 'pt', 'sv']);

let storePromise;
let signalsPromise;

async function loadSignalsModule() {
  if (!signalsPromise) {
    signalsPromise = import(SIGNALS_IMPORT);
  }
  return signalsPromise;
}

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

function wrapActions(sourceStore, stateSignal) {
  const call = (fn) => async (...args) => {
    try {
      return await fn(...args);
    } finally {
      stateSignal.value = sourceStore.getSnapshot();
    }
  };

  return {
    fetchProduct: call(sourceStore.fetchProduct.bind(sourceStore)),
    fetchSizeChart: call(sourceStore.fetchSizeChart.bind(sourceStore)),
    selectOption: call(sourceStore.selectOption.bind(sourceStore)),
    selectQuantity: call(sourceStore.selectQuantity.bind(sourceStore)),
    selectRealview: call(sourceStore.selectRealview.bind(sourceStore)),
  };
}

async function createSignalBackedStore() {
  const [{ signal, computed, batch }, { createZazzlePDPStore }] = await Promise.all([
    loadSignalsModule(),
    import('../sdk/index.js'),
  ]);

  const { getConfig } = await import(`${getLibs()}/utils/utils.js`);
  const { locale } = getConfig();
  const { language, region } = normalizeLocale(locale?.ietf);

  const sdkStore = createZazzlePDPStore({ language, region });
  const stateSignal = signal(sdkStore.getSnapshot());

  sdkStore.subscribe(() => {
    batch(() => {
      stateSignal.value = sdkStore.getSnapshot();
    });
  });

  const actions = wrapActions(sdkStore, stateSignal);

  return {
    env: sdkStore.env,
    state: stateSignal,
    hasState: computed(() => stateSignal.value !== undefined),
    actions,
    sdk: sdkStore,
  };
}

export async function getZazzleSignalStore() {
  if (!storePromise) {
    storePromise = createSignalBackedStore();
  }
  return storePromise;
}

export async function loadSignals() {
  const module = await loadSignalsModule();
  return module;
}

