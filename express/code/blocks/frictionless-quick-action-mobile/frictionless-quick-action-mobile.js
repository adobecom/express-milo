import {
  createTag,
  getLibs,
  getMobileOperatingSystem,
  getIconElementDeprecated,
} from '../../scripts/utils.js';
import { transformLinkToAnimation } from '../../scripts/utils/media.js';
import {
  QA_CONFIGS,
  fadeIn,
  fadeOut,
  selectElementByTagPrefix,
  createContainerConfig,
  createDocConfig,
  createSDKConfig,
  createMobileExportConfig,
  executeQuickAction,
  getErrorMsg,
} from '../../scripts/utils/frictionless-utils.js';

let replaceKey; let getConfig;
let loadScript;

let ccEverywhere;
let quickActionContainer;
let uploadContainer;
let ui2SDK;
let ui2Landing;
const selectedVideoLanguage = 'en-us'; // Default to English (US)

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

async function getExportTexts() {
  const downloadKey = 'download-to-phone';
  const editKey = 'edit-in-adobe-express-for-free';
  let downloadText = await replaceKey(downloadKey, getConfig());
  if (downloadText === downloadKey.replaceAll('-', ' ')) downloadText = 'Download to Phone';
  let editText = await replaceKey(editKey, getConfig());
  if (editText === editKey.replaceAll('-', ' ')) editText = 'Edit in Adobe Express for free';
  return { downloadText, editText };
}

export async function runQuickAction(quickActionId, data, block) {
  const { downloadText, editText } = await getExportTexts();
  const exportConfig = await createMobileExportConfig(quickActionId, downloadText, editText);

  const id = `${quickActionId}-container`;
  quickActionContainer = createTag('div', { id, class: 'quick-action-container' });
  block.append(quickActionContainer);
  const divs = block.querySelectorAll(':scope > div');
  if (divs[1]) [, uploadContainer] = divs;

  ui2SDK();

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
        ui2Landing();
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
        ui2Landing();
      },
    },
  };

  if (!ccEverywhere) return;

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
  document.body.dataset.suppressfloatingcta = 'true';
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
  const msg = await getErrorMsg(file, quickAction, replaceKey, getConfig);
  showErrorToast(block, msg);
}

async function injectFreePlan(container) {
  const { buildFreePlanWidget } = await import('../../scripts/widgets/free-plan.js');
  const freePlan = await buildFreePlanWidget({ typeKey: 'features', checkmarks: true });
  container.append(freePlan);
  return container;
}

function decorateExtra(extraContainer) {
  const wrapper = extraContainer.querySelector('div');
  while (wrapper?.firstChild) {
    extraContainer.append(wrapper.firstChild);
  }
  wrapper.remove();
  const legalText = extraContainer.querySelector('p:last-of-type');
  legalText.classList.add('legal');
  const freePlanContainer = createTag('div', { class: 'free-plan-container' });
  injectFreePlan(freePlanContainer);
  legalText.before(freePlanContainer);
}

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
    ({ getConfig, loadScript } = utils);
    ({ replaceKey } = placeholders);
  });
  const rows = Array.from(block.children);
  const [quickActionRow] = rows.filter((row) => row.children[0]?.textContent?.toLowerCase()?.trim() === 'quick-action');
  quickActionRow?.remove();
  // TODO: remove fallback row once authoring is done
  const [fallbackRow] = rows.filter((row) => row.children[0]?.textContent?.toLowerCase()?.trim() === 'fallback');
  fallbackRow?.remove();
  if (fallbackRow && getMobileOperatingSystem() !== 'Android') {
    const fallbackBlock = fallbackRow.querySelector(':scope > div:last-child > div');
    block.replaceWith(fallbackBlock);
    return fallbackBlock;
  }
  const quickAction = quickActionRow.children[1]?.textContent;
  if (!(quickAction in QA_CONFIGS)) {
    throw new Error('Invalid Quick Action Type.');
  }

  const [headline, dropzoneContainer, extraContainer] = rows;
  const h1 = headline.querySelector('h1');
  const landingHeadlineText = h1.textContent;
  const postUploadHeadline = headline.querySelector('p');
  let postUploadHeadlineText;
  if (postUploadHeadline) {
    postUploadHeadlineText = postUploadHeadline.textContent;
    postUploadHeadline.remove();
  }
  headline.classList.add('headline');
  dropzoneContainer.classList.add('dropzone-container');
  extraContainer.classList.add('extra-container');
  decorateExtra(extraContainer);

  const logo = getIconElementDeprecated('adobe-express-logo');
  logo.classList.add('express-logo');
  block.prepend(logo);

  ui2SDK = () => {
    fadeOut(uploadContainer);
    fadeOut(extraContainer);
    logo.classList.add('hide');
    if (postUploadHeadlineText) {
      h1.textContent = postUploadHeadlineText;
      h1.classList.add('post-upload');
    }
  };
  ui2Landing = () => {
    fadeIn(uploadContainer);
    fadeIn(extraContainer);
    logo.classList.remove('hide');
    if (postUploadHeadlineText) {
      h1.textContent = landingHeadlineText;
      h1.classList.remove('post-upload');
    }
  };

  const dropzone = createTag('button', { class: 'dropzone hide', id: 'mobile-fqa-upload' });
  const [animationContainer, dropzoneContent] = dropzoneContainer.children;
  while (dropzoneContent.firstChild) dropzone.append(dropzoneContent.firstChild);
  dropzoneContent.replaceWith(dropzone);
  animationContainer.classList.add('animation-container');
  const animation = animationContainer.querySelector('a');
  const animationEnd = () => {
    dropzone.classList.remove('hide');
    animationContainer.classList.add('hide');
  };
  if (animation && animation.href.includes('.mp4')) {
    const video = transformLinkToAnimation(animation, false);
    video.addEventListener('ended', animationEnd);
  } else if (animationContainer.querySelector('picture')) {
    setTimeout(animationEnd, 3000);
  }
  const dropzoneText = createTag('div', { class: 'text' });
  while (dropzone.firstChild) {
    dropzoneText.append(dropzone.firstChild);
  }
  dropzone.classList.add('dropzone');
  dropzone.append(createTag('div', { class: 'border-wrapper' }, dropzoneText));
  const inputElement = createTag('input', { type: 'file', accept: QA_CONFIGS[quickAction].accept });
  inputElement.onchange = () => {
    const file = inputElement.files[0];
    startSDKWithUnconvertedFile(file, quickAction, block);
  };
  block.append(inputElement);

  dropzone.addEventListener('click', (e) => {
    e.preventDefault();
    dropzone.classList.remove('hide');
    animationContainer.classList.add('hide');
    if (quickAction === 'generate-qr-code') {
      startSDK('', quickAction, block);
    } else {
      inputElement.click();
    }
  });

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
      ui2Landing();
      document.body.dataset.suppressfloatingcta = 'false';
    }
  }, { passive: true });

  block.dataset.frictionlesstype = quickAction;
  block.dataset.frictionlessgroup = QA_CONFIGS[quickAction].group ?? 'image';

  import('../../scripts/instrument.js').then(({ sendFrictionlessEventToAdobeAnaltics }) => {
    sendFrictionlessEventToAdobeAnaltics(block);
  });
  return block;
}
