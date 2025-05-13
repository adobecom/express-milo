import { getLibs } from '../../scripts/utils.js';

let createTag;

export default async function init(el) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
}
