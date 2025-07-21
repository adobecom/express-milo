// eslint-disable-next-line import/no-relative-packages
import { initTemplatesAsAService } from './library/dist/templates-as-a-service.min.es.js';
import { getLibs } from '../../scripts/utils.js';

let createTag;
let loadStyle;
let getConfig;

export default async function init(el) {
  ({ createTag, loadStyle, getConfig } = await import(`${getLibs()}/utils/utils.js`));
  await new Promise((resolve) => {
    loadStyle(`${getConfig().codeRoot}/blocks/templates-as-a-service/library/dist/templates-as-a-service.css`, () => {
      resolve();
    });
  });
  el.append(createTag('div', { id: 'taas-root' }));
  initTemplatesAsAService('taas-root');
}
