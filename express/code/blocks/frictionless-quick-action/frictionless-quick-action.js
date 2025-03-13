import {
  addAnimationToggle,
  transformLinkToAnimation,
} from '../../scripts/utils/media.js';
import { getLibs, getIconElementDeprecated, decorateButtonsDeprecated } from '../../scripts/utils.js';
import { buildFreePlanWidget } from '../../scripts/widgets/free-plan.js';
import { sendFrictionlessEventToAdobeAnaltics } from '../../scripts/instrument.js';

let createTag; let getConfig;
let getMetadata;
let loadScript; let globalNavSelector;

let ccEverywhere;
let quickActionContainer;
let uploadContainer;

const JPG = 'jpg';
const JPEG = 'jpeg';
const PNG = 'png';
const WEBP = 'webp';
export const getBaseImgCfg = (...types) => ({
  group: 'image',
  max_size: 40 * 1024 * 1024,
  accept: types.map((type) => `.${type}`).join(', '),
  input_check: (input) => types.map((type) => `image/${type}`).includes(input),
});
export const getBaseVideoCfg = (...types) => ({
  group: 'video',
  max_size: 1024 * 1024 * 1024,
  accept: types.map((type) => `.${type}`).join(', '),
  input_check: (input) => types.map((type) => `video/${type}`).includes(input),
});
const QA_CONFIGS = {
  'convert-to-jpg': { ...getBaseImgCfg(PNG, WEBP) },
  'convert-to-png': { ...getBaseImgCfg(JPG, JPEG, WEBP) },
  'convert-to-svg': { ...getBaseImgCfg(JPG, JPEG, PNG) },
  'crop-image': { ...getBaseImgCfg(JPG, JPEG, PNG) },
  'resize-image': { ...getBaseImgCfg(JPG, JPEG, PNG, WEBP) },
  'remove-background': { ...getBaseImgCfg(JPG, JPEG, PNG) },
  'generate-qr-code': {
    ...getBaseImgCfg(JPG, JPEG, PNG),
    input_check: () => true,
  },
  'qa-in-product-variant1': { ...getBaseImgCfg(JPG, JPEG, PNG) },
  'qa-in-product-variant2': { ...getBaseImgCfg(JPG, JPEG, PNG) },
  'qa-in-product-control': { ...getBaseImgCfg(JPG, JPEG, PNG) },
  'qa-nba': { ...getBaseImgCfg(JPG, JPEG, PNG) },
};

function fade(element, action) {
  if (action === 'in') {
    element.classList.remove('hidden');
    setTimeout(() => {
      element.classList.remove('transparent');
    }, 10);
  } else if (action === 'out') {
    element.classList.add('transparent');
    setTimeout(() => {
      element.classList.add('hidden');
    }, 200);
  }
}

function selectElementByTagPrefix(p) {
  const allEls = document.body.querySelectorAll(':scope > *');
  return Array.from(allEls).find((e) => e.tagName.toLowerCase().startsWith(p.toLowerCase()));
}

function frictionlessQAExperiment(quickAction, docConfig, appConfig, exportConfig, contConfig) {
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('variant');
  const isStage = urlParams.get('hzenv') === 'stage';
  const variant = isStage && urlVariant ? urlVariant : quickAction;
  document.body.dataset.frictionlesstype = 'remove-background';
  document.body.dataset.variant = variant;
  appConfig.metaData.variant = variant;
  appConfig.metaData.entryPoint = 'seo-quickaction-image-upload';
  switch (variant) {
    case 'qa-nba':
      ccEverywhere.quickAction.removeBackground(docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'qa-in-product-control':
      ccEverywhere.quickAction.removeBackground(docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'qa-in-product-variant1':
      appConfig.metaData.isFrictionlessQa = false;
      document.querySelector(`${globalNavSelector}.ready`).style.display = 'none';
      ccEverywhere.editor.createWithAsset(docConfig, appConfig, exportConfig, {
        ...contConfig,
        mode: 'modal',
      });
      break;
    case 'qa-in-product-variant2':
      appConfig.metaData.isFrictionlessQa = false;
      document.querySelector(`${globalNavSelector}.ready`).style.display = 'none';
      ccEverywhere.editor.createWithAsset(docConfig, appConfig, exportConfig, {
        ...contConfig,
        mode: 'modal',
      });
      break;
    default:
      break;
  }
}

// eslint-disable-next-line default-param-last
export function runQuickAction(quickAction, data, block) {
  // TODO: need the button labels from the placeholders sheet if the SDK default doens't work.
  const exportConfig = [
    {
      id: 'download-button',
      // label: 'Download',
      action: { target: 'download' },
      style: { uiType: 'button' },
      buttonStyle: {
        variant: 'secondary',
        treatment: 'fill',
        size: 'xl',
      },
    },
    {
      id: 'edit-in-express',
      // label: 'Edit in Adobe Express for free',
      action: { target: 'express' },
      style: { uiType: 'button' },
      buttonStyle: {
        variant: 'primary',
        treatment: 'fill',
        size: 'xl',
      },
    },
  ];

  const id = `${quickAction}-container`;
  quickActionContainer = createTag('div', { id, class: 'quick-action-container' });
  block.append(quickActionContainer);
  const divs = block.querySelectorAll(':scope > div');
  if (divs[1]) [, uploadContainer] = divs;
  fade(uploadContainer, 'out');

  const contConfig = {
    mode: 'inline',
    parentElementId: `${quickAction}-container`,
    backgroundColor: 'transparent',
    hideCloseButton: true,
    padding: 0,
  };

  const docConfig = {
    asset: {
      data,
      dataType: 'base64',
      type: 'image',
    },
  };

  const appConfig = {
    metaData: { isFrictionlessQa: 'true' },
    receiveQuickActionErrors: false,
    callbacks: {
      onIntentChange: () => {
        quickActionContainer?.remove();
        fade(uploadContainer, 'in');
        document.body.classList.add('editor-modal-loaded');
        window.history.pushState({ hideFrictionlessQa: true }, '', '');
        return {
          containerConfig: {
            mode: 'modal',
            zIndex: 999,
          },
        };
      },
      onCancel: () => {
        window.history.back();
      },
    },
  };

  const urlParams = new URLSearchParams(window.location.search);
  const variant = urlParams.get('variant');
  const isStage = urlParams.get('hzenv') === 'stage';

  if (!ccEverywhere) return;
  switch (quickAction) {
    case 'convert-to-jpg':
      ccEverywhere.quickAction.convertToJPEG(docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'convert-to-png':
      ccEverywhere.quickAction.convertToPNG(docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'convert-to-svg':
      exportConfig.pop();
      ccEverywhere.quickAction.convertToSVG(docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'crop-image':
      ccEverywhere.quickAction.cropImage(docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'resize-image':
      ccEverywhere.quickAction.resizeImage(docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'remove-background':

      if (variant && isStage) {
        frictionlessQAExperiment(variant, docConfig, appConfig, exportConfig, contConfig);
        break;
      }

      ccEverywhere.quickAction.removeBackground(docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'generate-qr-code':
      ccEverywhere.quickAction.generateQRCode({}, appConfig, exportConfig, contConfig);
      break;
    // Experiment code, remove after done
    case 'qa-nba':
      frictionlessQAExperiment(quickAction, docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'qa-in-product-control':
      frictionlessQAExperiment(quickAction, docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'qa-in-product-variant1':
      frictionlessQAExperiment(quickAction, docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'qa-in-product-variant2':
      frictionlessQAExperiment(quickAction, docConfig, appConfig, exportConfig, contConfig);
      break;
    default: break;
  }
}

// eslint-disable-next-line default-param-last
async function startSDK(data = '', quickAction, block) {
  const urlParams = new URLSearchParams(window.location.search);
  const urlOverride = urlParams.get('sdk-override');
  let valid = false;
  if (urlOverride) {
    try {
      if (new URL(urlOverride).host === 'dev.cc-embed.adobe.com') valid = true;
    } catch (e) {
      window.lana.log('Invalid SDK URL');
    }
  }
  const CDN_URL = valid ? urlOverride : 'https://cc-embed.adobe.com/sdk/1p/v4/CCEverywhere.js';
  const clientId = 'AdobeExpressWeb';

  await loadScript(CDN_URL);
  if (!window.CCEverywhere) {
    return;
  }

  if (!ccEverywhere) {
    let { ietf } = getConfig().locale;
    const country = urlParams.get('country');
    if (country) ietf = getConfig().locales[country]?.ietf;
    if (ietf === 'zh-Hant-TW') ietf = 'tw-TW';
    else if (ietf === 'zh-Hans-CN') ietf = 'cn-CN';
    // query parameter URL for overriding the cc everywhere
    // iframe source URL, used for testing new experiences
    const isStageEnv = urlParams.get('hzenv') === 'stage';
    const baseQA = new URLSearchParams(window.location.search).get('base-qa');
    const ccEverywhereConfig = {
      hostInfo: {
        clientId,
        appName: 'express',
      },
      configParams: {
        locale: ietf?.replace('-', '_'),
        env: isStageEnv ? 'stage' : 'prod',
        urlOverride: isStageEnv ? baseQA : undefined,
      },
      authOption: () => ({ mode: 'delayed' }),
    };

    ccEverywhere = await window.CCEverywhere.initialize(...Object.values(ccEverywhereConfig));
  }

  runQuickAction(quickAction, data, block);
}

let timeoutId = null;
function showErrorToast(block, msg) {
  let toast = block.querySelector('.error-toast');
  const hideToast = () => toast.classList.add('hide');
  if (!toast) {
    toast = createTag('div', { class: 'error-toast hide' });
    toast.prepend(getIconElementDeprecated('error'));
    const close = createTag('button', {}, getIconElementDeprecated('close-white'));
    close.addEventListener('click', hideToast);
    toast.append(close);
    block.append(toast);
  }
  toast.textContent = msg;
  toast.classList.remove('hide');
  clearTimeout(timeoutId);
  timeoutId = setTimeout(hideToast, 6000);
}

async function startSDKWithUnconvertedFile(file, quickAction, block) {
  if (!file) return;
  const maxSize = QA_CONFIGS[quickAction].max_size ?? 40 * 1024 * 1024;
  if (QA_CONFIGS[quickAction].input_check(file.type) && file.size <= maxSize) {
    const reader = new FileReader();
    reader.onloadend = () => {
      window.history.pushState({ hideFrictionlessQa: true }, '', '');
      startSDK(reader.result, quickAction, block);
    };

    // Read the file as a data URL (Base64)
    reader.readAsDataURL(file);
    return;
  }
  const { replaceKey } = await import(`${getLibs()}/features/placeholders.js`);
  let msg;
  if (!QA_CONFIGS[quickAction].input_check(file.type)) {
    msg = await replaceKey('file-type-not-supported', getConfig());
  } else {
    msg = await replaceKey('file-size-not-supported', getConfig());
  }
  showErrorToast(block, msg);
}

export default async function decorate(block) {
  const [utils, gNavUtils] = await Promise.all([import(`${getLibs()}/utils/utils.js`),
    import(`${getLibs()}/blocks/global-navigation/utilities/utilities.js`),
    decorateButtonsDeprecated(block)]);
  ({ createTag, getMetadata, loadScript, getConfig } = utils);
  globalNavSelector = gNavUtils?.selectors.globalNav;

  const rows = Array.from(block.children);
  rows[1].classList.add('fqa-container');
  const quickActionRow = rows.filter((r) => r.children && r.children[0].textContent.toLowerCase().trim() === 'quick-action');
  const quickAction = quickActionRow?.[0].children[1]?.textContent;
  if (!quickAction) {
    throw new Error('Invalid Quick Action Type.');
  }
  quickActionRow[0].remove();

  const actionAndAnimationRow = rows[1].children;
  const animationContainer = actionAndAnimationRow[0];
  const animation = animationContainer.querySelector('a');
  const dropzone = actionAndAnimationRow[1];
  const dropzoneBackground = createTag('div', { class: 'dropzone-bg' });
  const cta = dropzone.querySelector('a.button, a.con-button');
  const gtcText = dropzone.querySelector('p:last-child');
  const actionColumn = createTag('div');
  const dropzoneContainer = createTag('div', { class: 'dropzone-container' });

  if (animation && animation.href.includes('.mp4')) {
    transformLinkToAnimation(animation);
    addAnimationToggle(animationContainer);
  }
  if (cta) cta.classList.add('xlarge');
  dropzone.classList.add('dropzone');

  dropzone.prepend(dropzoneBackground);
  dropzone.before(actionColumn);
  dropzoneContainer.append(dropzone);
  actionColumn.append(dropzoneContainer, gtcText);
  const inputElement = createTag('input', { type: 'file', accept: QA_CONFIGS[quickAction].accept });
  inputElement.onchange = () => {
    const file = inputElement.files[0];
    startSDKWithUnconvertedFile(file, quickAction, block);
  };
  block.append(inputElement);

  dropzoneContainer.addEventListener('click', (e) => {
    e.preventDefault();
    if (quickAction === 'generate-qr-code') {
      startSDK('', quickAction, block);
    } else {
      inputElement.click();
    }
    document.body.dataset.suppressfloatingcta = 'true';
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight() {
    dropzoneContainer.classList.add('highlight');
  }

  function unhighlight() {
    dropzoneContainer.classList.remove('highlight');
  }

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropzoneContainer.addEventListener(eventName, highlight, false);
  });

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    dropzoneContainer.addEventListener(eventName, preventDefaults, false);
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropzoneContainer.addEventListener(eventName, unhighlight, false);
  });

  dropzoneContainer.addEventListener('drop', async (e) => {
    const dt = e.dataTransfer;
    const { files } = dt;

    await Promise.all(
      [...files].map((file) => startSDKWithUnconvertedFile(file, quickAction, block)),
    );
    document.body.dataset.suppressfloatingcta = 'true';
  }, false);

  const freePlanTags = await buildFreePlanWidget({ typeKey: 'branded', checkmarks: true });
  dropzone.append(freePlanTags);

  window.addEventListener('popstate', (e) => {
    const editorModal = selectElementByTagPrefix('cc-everywhere-container-');
    const correctState = e.state?.hideFrictionlessQa;
    const embedElsFound = quickActionContainer || editorModal;
    window.history.pushState({ hideFrictionlessQa: true }, '', '');
    if (correctState || embedElsFound) {
      quickActionContainer?.remove();
      editorModal?.remove();
      document.body.classList.remove('editor-modal-loaded');
      inputElement.value = '';
      fade(uploadContainer, 'in');
      document.body.dataset.suppressfloatingcta = 'false';
    }
  }, { passive: true });

  block.dataset.frictionlesstype = quickAction;
  block.dataset.frictionlessgroup = QA_CONFIGS[quickAction].group ?? 'image';

  if (['on', 'yes'].includes(getMetadata('marquee-inject-logo')?.toLowerCase())) {
    const logo = getIconElementDeprecated('adobe-express-logo');
    logo.classList.add('express-logo');
    block.prepend(logo);
  }

  sendFrictionlessEventToAdobeAnaltics(block);
}
