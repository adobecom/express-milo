const BUNDLE_IMPORT = new URL('../vendor/htm-preact.js', import.meta.url).href;

let bundlePromise;

export async function loadPreactBundle() {
  if (!bundlePromise) {
    bundlePromise = import(BUNDLE_IMPORT);
  }
  return bundlePromise;
}
