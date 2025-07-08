import { getIconElementDeprecated } from '../../scripts/utils.js';

export default async function init(el) {
  const logo = getIconElementDeprecated('adobe-express-logo');
  logo.classList.add('express-logo');
  el.innerHTML = '';
  el.appendChild(logo);
  return el;
}