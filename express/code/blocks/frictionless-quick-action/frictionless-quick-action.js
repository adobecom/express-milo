import { transformLinkToAnimation } from '../../scripts/utils/media.js';
import { getLibs, getIconElementDeprecated, decorateButtonsDeprecated } from '../../scripts/utils.js';
import { buildFreePlanWidget } from '../../scripts/widgets/free-plan.js';
import { sendFrictionlessEventToAdobeAnaltics } from '../../scripts/instrument.js';
import {
  QA_CONFIGS,
  EXPERIMENTAL_VARIANTS,
  fadeIn,
  fadeOut,
  createDocConfig,
  createContainerConfig,
  selectElementByTagPrefix,
  createSDKConfig,
  createDefaultExportConfig,
  executeQuickAction,
  getErrorMsg,
} from '../../scripts/utils/frictionless-utils.js';

let createTag;
let getConfig;
let getMetadata;
let loadScript;
let globalNavSelector;
const selectedVideoLanguage = 'en-us'; // Default to English (US)

let ccEverywhere;
let quickActionContainer;
let uploadContainer;

function frictionlessQAExperiment(
  quickAction,
  docConfig,
  appConfig,
  exportConfig,
  contConfig,
) {
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('variant');
  const variant = urlVariant || quickAction;
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

let timeoutId = null;
function showErrorToast(block, msg) {
  let toast = block.querySelector('.error-toast');
  const hideToast = () => toast.classList.add('hide');
  if (!toast) {
    toast = createTag('div', { class: 'error-toast hide' });
    toast.prepend(getIconElementDeprecated('error'));
    const close = createTag(
      'button',
      {},
      getIconElementDeprecated('close-white'),
    );
    close.addEventListener('click', hideToast);
    toast.append(close);
    block.append(toast);
  }
  toast.textContent = msg;
  toast.classList.remove('hide');
  clearTimeout(timeoutId);
  timeoutId = setTimeout(hideToast, 6000);
}

// eslint-disable-next-line default-param-last
export function runQuickAction(quickActionId, data, block) {
  // TODO: need the button labels from the placeholders sheet if the SDK default doens't work.
  const exportConfig = createDefaultExportConfig();

  const id = `${quickActionId}-container`;
  quickActionContainer = createTag('div', { id, class: 'quick-action-container' });
  block.append(quickActionContainer);
  const divs = block.querySelectorAll(':scope > div');
  if (divs[1]) [, uploadContainer] = divs;
  fadeOut(uploadContainer);

  const contConfig = createContainerConfig(quickActionId);
  const docConfig = createDocConfig(data, 'image');
  const videoDocConfig = createDocConfig(data, 'video');

  const appConfig = {
    metaData: {
      isFrictionlessQa: 'true',
      ...(quickActionId === 'caption-video' && { videoLanguage: selectedVideoLanguage }),
    },
    receiveQuickActionErrors: true,
    callbacks: {
      onIntentChange: () => {
        quickActionContainer?.remove();
        fadeIn(uploadContainer);
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
      onError: (error) => {
        // eslint-disable-next-line no-underscore-dangle
        showErrorToast(block, `${error._customData} Please try again.`);
        quickActionContainer?.remove();
        fadeIn(uploadContainer);
      },
    },
  };

  const urlParams = new URLSearchParams(window.location.search);
  const variant = urlParams.get('variant');
  const isStage = urlParams.get('hzenv') === 'stage';

  if (!ccEverywhere) return;

  // Handle experimental variants for remove-background
  if (quickActionId === 'remove-background' && variant && isStage) {
    frictionlessQAExperiment(
      variant,
      docConfig,
      appConfig,
      exportConfig,
      contConfig,
    );
    return;
  }

  // Handle experimental variants
  if (EXPERIMENTAL_VARIANTS.includes(quickActionId)) {
    frictionlessQAExperiment(
      quickActionId,
      docConfig,
      appConfig,
      exportConfig,
      contConfig,
    );
    return;
  }

  // Execute the quick action using the helper function
  executeQuickAction(
    ccEverywhere,
    quickActionId,
    docConfig,
    appConfig,
    exportConfig,
    contConfig,
    videoDocConfig,
  );
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

  await loadScript(CDN_URL);
  if (!window.CCEverywhere) {
    return;
  }

  if (!ccEverywhere) {
    const ccEverywhereConfig = createSDKConfig(getConfig, urlParams);
    ccEverywhere = await window.CCEverywhere.initialize(...Object.values(ccEverywhereConfig));
  }

  runQuickAction(quickAction, data, block);
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
  const msg = await getErrorMsg(file, quickAction, replaceKey, getConfig);
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
  const cta = dropzone.querySelector('a.button, a.con-button');
  const gtcText = dropzone.querySelector('p:last-child');
  const actionColumn = createTag('div');
  const dropzoneContainer = createTag('div', { class: 'dropzone-container' });

  if (animation && animation.href.includes('.mp4')) {
    animationContainer.append(transformLinkToAnimation(animation));
  }

  if (cta) cta.classList.add('xlarge');
  dropzone.classList.add('dropzone');

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
      fadeIn(uploadContainer);
      document.body.dataset.suppressfloatingcta = 'false';
    }
  }, { passive: true });

  if (EXPERIMENTAL_VARIANTS.includes(quickAction)) {
    block.dataset.frictionlesstype = 'remove-background';
  } else {
    block.dataset.frictionlesstype = quickAction;
  }

  block.dataset.frictionlessgroup = QA_CONFIGS[quickAction].group ?? 'image';

  if (['on', 'yes'].includes(getMetadata('marquee-inject-logo')?.toLowerCase())) {
    const logo = getIconElementDeprecated('adobe-express-logo');
    logo.classList.add('express-logo');
    block.prepend(logo);
  }

  sendFrictionlessEventToAdobeAnaltics(block);
}
