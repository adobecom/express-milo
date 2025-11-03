import { addPrefetchLinks, extractTemplateId } from './utilities/utility-functions.js';
import { loadPreactBundle } from './lib/preact-deps.js';
import { getZazzleSignalStore } from './store/zazzle-store.js';

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
  block.appendChild(mountPoint);

  const [{ html, render }, { PDPApp }, store] = await Promise.all([
    loadPreactBundle(),
    import('./components/PDPApp.js'),
    getZazzleSignalStore(),
  ]);

  render(html`<${PDPApp} store=${store} templateId=${templateId} />`, mountPoint);
}
