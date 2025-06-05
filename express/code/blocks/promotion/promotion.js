import { getLibs, toClassName, fixIcons, decorateButtonsDeprecated } from '../../scripts/utils.js';
import {
  normalizeHeadings,
} from '../../scripts/utils/decorate.js';
import { createOptimizedPicture } from '../../scripts/utils/media.js';

let createTag; let getConfig;

const PROMOTION_FOLDER = 'express/promotions';

async function fetchPromotion(name) {
  const { prefix } = getConfig().locale;
  const promoURL = `${prefix}/${PROMOTION_FOLDER}/${toClassName(name)}.plain.html`;
  const resp = await fetch(promoURL);
  if (resp.ok) {
    const html = await resp.text();
    return html;
  }
  return null;
}

export default async function decorate($block) {
  $block.remove();
}
