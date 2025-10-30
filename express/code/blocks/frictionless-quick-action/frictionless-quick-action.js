import { transformLinkToAnimation } from '../../scripts/utils/media.js';
import { getLibs, getIconElementDeprecated, decorateButtonsDeprecated } from '../../scripts/utils.js';
import { buildFreePlanWidget } from '../../scripts/widgets/free-plan.js';
import { sendFrictionlessEventToAdobeAnaltics } from '../../scripts/instrument.js';
import { createLocaleDropdownWrapper } from '../../scripts/widgets/frictionless-locale-dropdown.js';
import {
  QA_CONFIGS,
  EXPERIMENTAL_VARIANTS,
  fadeIn,
  fadeOut,
  createDocConfig,
  createMergeVideosDocConfig,
  createContainerConfig,
  selectElementByTagPrefix,
  createDefaultExportConfig,
  executeQuickAction,
  processFilesForQuickAction,
  loadAndInitializeCCEverywhere,
  getErrorMsg,
  initProgressBar,
  FRICTIONLESS_UPLOAD_QUICK_ACTIONS,
  EXPRESS_ROUTE_PATHS,
  isSafari,
  EXPERIMENTAL_VARIANTS_PROMOID_MAP,
} from '../../scripts/utils/frictionless-utils.js';

let createTag;
let getConfig;
let getMetadata;
let selectedVideoLanguage = 'en-us'; // Default to English (US)
let replaceKey;

let ccEverywhere;
let quickActionContainer;
let uploadContainer;
let uploadService;
let fqaContainer;
let uploadEvents;
let frictionlessTargetBaseUrl;
let progressBar;

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
  appConfig.metaData.promoid = EXPERIMENTAL_VARIANTS_PROMOID_MAP[variant];
  appConfig.metaData.mv = 'other';
  appConfig.metaData.entryPoint = 'seo-quickaction-image-upload';
  switch (variant) {
    case 'qa-nba':
      ccEverywhere.quickAction.removeBackground(docConfig, appConfig, exportConfig, contConfig);
      break;
    case 'qa-in-product-control':
      ccEverywhere.quickAction.removeBackground(docConfig, appConfig, exportConfig, contConfig);
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
  const docConfig = createDocConfig(data[0], 'image');
  const videoDocConfig = quickActionId === 'merge-videos' ? createMergeVideosDocConfig(data) : createDocConfig(data[0], 'video');

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
async function startSDK(data = [''], quickAction, block) {
  if (!ccEverywhere) {
    ccEverywhere = await loadAndInitializeCCEverywhere(getConfig);
  }
  runQuickAction(quickAction, data, block);
}

function resetUploadUI() {
  progressBar.remove();
  fadeIn(fqaContainer);
}

/* c8 ignore next 15 */
function createUploadStatusListener(uploadStatusEvent) {
  const listener = (e) => {
    const isUploadProgressLessThanVisual = e.detail.progress < progressBar.getProgress();
    const progress = isUploadProgressLessThanVisual ? progressBar.getProgress() : e.detail.progress;

    /**
     * The reason for doing this is because assetId takes a while to resolve
     * and progress completes to 100 before assetId is resolved. This can cause
     * a confusion in experience where user might think the upload is stuck.
     */
    if (progress > 95) {
      progressBar.setProgress(95);
    } else {
      progressBar.setProgress(progress);
    }

    if (['completed', 'failed'].includes(e.detail.status)) {
      if (e.detail.status === 'failed') {
        setTimeout(() => {
          resetUploadUI();
        }, 200);
      }
      window.removeEventListener(uploadStatusEvent, listener);
    }
  };
  window.addEventListener(uploadStatusEvent, listener);
}

/* c8 ignore next 12 */
async function validateTokenAndReturnService(existingService) {
  const freshToken = window?.adobeIMS?.getAccessToken()?.token;
  if (freshToken && freshToken !== existingService.getConfig().authConfig.token) {
    existingService.updateConfig({
      authConfig: {
        ...uploadService.getConfig().authConfig,
        token: freshToken,
      },
    });
  }
  return existingService;
}

/* c8 ignore next 9 */
async function initializeUploadService() {
  if (uploadService) return validateTokenAndReturnService(uploadService);
  // eslint-disable-next-line import/no-relative-packages
  const { initUploadService, UPLOAD_EVENTS } = await import('../../scripts/upload-service/dist/upload-service.min.es.js');
  const { env } = getConfig();
  uploadService = await initUploadService({ environment: env.name });
  uploadEvents = UPLOAD_EVENTS;
  return uploadService;
}

/* c8 ignore next 7 */
async function setupUploadUI(block) {
  const progressBarElement = await initProgressBar(replaceKey, getConfig);
  fqaContainer = block.querySelector('.fqa-container');
  fadeOut(fqaContainer);
  block.insertBefore(progressBarElement, fqaContainer);
  return progressBarElement;
}

/* c8 ignore next 13 */
async function uploadAssetToStorage(file) {
  const service = await initializeUploadService();
  createUploadStatusListener(uploadEvents.UPLOAD_STATUS);

  const { asset } = await service.uploadAsset({
    file,
    fileName: file.name,
    contentType: file.type,
  });

  progressBar.setProgress(100);
  return asset.assetId;
}

/* c8 ignore next 14 */
async function performStorageUpload(files, block) {
  try {
    progressBar = await setupUploadUI(block);
    return await uploadAssetToStorage(files[0]);
  } catch (error) {
    if (error.code === 'UPLOAD_FAILED') {
      const message = await replaceKey('upload-media-error', getConfig());
      showErrorToast(block, message);
    } else {
      showErrorToast(block, error.message);
    }
    return null;
  }
}

async function startAssetDecoding(file, controller) {
  const { getAssetDimensions, decodeWithTimeout } = await import('../../scripts/utils/assetDecoder.js');

  return decodeWithTimeout(getAssetDimensions(file, {
    signal: controller.signal,
  }).catch((error) => {
    window.lana?.log('Asset decode failed');
    window.lana?.log(error);
    return null;
  }), 5000);
}

async function raceUploadAndDecode(uploadPromise, decodePromise) {
  return Promise.race([
    uploadPromise
      .then((result) => ({ type: 'upload', value: result }))
      .catch((error) => ({ type: 'upload', error })),
    decodePromise
      .then((result) => ({ type: 'decode', value: result }))
      .catch((error) => ({ type: 'decode', error })),
  ]);
}

async function handleUploadFirst(assetId, gracePeriodDecodePromise, gracePeriodController) {
  if (!assetId) {
    gracePeriodController.abort('Upload failed');
    return { assetId: null, dimensions: null };
  }

  const dimensions = await Promise.race([
    gracePeriodDecodePromise,
    new Promise((resolve) => {
      setTimeout(() => resolve(null), 1000);
    }),
  ]);

  if (dimensions === null) {
    gracePeriodController.abort('Grace period expired, proceeding without dimensions');
  }

  return { assetId, dimensions };
}

async function handleDecodeFirst(dimensions, uploadPromise, initialDecodeController) {
  const assetId = await uploadPromise;

  if (!assetId) {
    initialDecodeController.abort('Upload failed');
    return { assetId: null, dimensions: null };
  }

  return { assetId, dimensions };
}

/**
 * Builds search parameters for editor URL based on route path and editor type
 * @param {string} pathname - The URL pathname to determine parameter set
 * @param {string} assetId - The frictionless upload asset ID
 * @param {boolean} quickAction - The quick action ID.
 * @param {Object} dimensions - Asset dimensions with width and height properties
 * @returns {Object} Search parameters object
 */
/* c8 ignore next */
function buildSearchParamsForEditorUrl(pathname, assetId, quickAction, dimensions) {
  const baseSearchParams = {
    frictionlessUploadAssetId: assetId,
  };

  let routeSpecificParams = {};
  let pageSpecificParams = {};

  switch (pathname) {
    case EXPRESS_ROUTE_PATHS.focusedEditor: {
      routeSpecificParams = {
        skipUploadStep: true,
      };
      break;
    }
    case EXPRESS_ROUTE_PATHS.loggedOutEditor:
    default: {
      const isVideoEditor = quickAction === FRICTIONLESS_UPLOAD_QUICK_ACTIONS.videoEditor;
      routeSpecificParams = {
        category: 'media',
        tab: isVideoEditor ? 'videos' : 'photos',
        width: dimensions?.width,
        height: dimensions?.height,
        ...(isVideoEditor && {
          sceneline: true,
          isVideoMaker: true,
        }),
      };
      break;
    }
  }

  if (EXPERIMENTAL_VARIANTS.includes(quickAction)) {
    pageSpecificParams = {
      variant: quickAction,
      promoid: EXPERIMENTAL_VARIANTS_PROMOID_MAP[quickAction],
      mv: 'other',
    };
  }

  /**
   * This block has been added to support the url path via query param.
   * This is because on express side we validate the url path for SEO
   * pages that need to be validated for the download flow in express to work.
   * This works fine in prod, but fails for draft pages. This block helps
   * in testing the download flow in express to work for draft pages, i.e.,
   * pages not whitelisted for download flow on express side.
   */
  const urlParams = new URLSearchParams(window.location.search);
  const urlPathViaQueryParam = urlParams.has('hzUrlPath');
  if (urlPathViaQueryParam) {
    routeSpecificParams.url = urlParams.get('hzUrlPath');
  }

  return {
    ...baseSearchParams,
    ...routeSpecificParams,
    ...pageSpecificParams,
  };
}

/**
 * Applies search parameters to URL, filtering out null, undefined, and empty values
 * @param {URL} url - The URL object to modify
 * @param {Object} searchParams - Object containing search parameters to apply
 */
export function applySearchParamsToUrl(url, searchParams) {
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
}

async function buildEditorUrl(quickAction, assetId, dimensions) {
  const { getTrackingAppendedURL } = await import('../../scripts/branchlinks.js');
  let url = new URL(await getTrackingAppendedURL(frictionlessTargetBaseUrl));
  const isImageEditor = quickAction === FRICTIONLESS_UPLOAD_QUICK_ACTIONS.imageEditor;

  if (isImageEditor && url.pathname === EXPRESS_ROUTE_PATHS.focusedEditor) {
    url = new URL(frictionlessTargetBaseUrl);
  }

  const searchParams = buildSearchParamsForEditorUrl(
    url.pathname,
    assetId,
    quickAction,
    dimensions,
  );

  applySearchParamsToUrl(url, searchParams);

  return url;
}

/* c8 ignore next 38 */
async function performUploadAction(files, block, quickAction) {
  const initialDecodeController = new AbortController();

  const initialDecodePromise = startAssetDecoding(files[0], initialDecodeController);
  const uploadPromise = performStorageUpload(files, block);

  const firstToComplete = await raceUploadAndDecode(uploadPromise, initialDecodePromise);

  let result;
  if (firstToComplete.type === 'upload') {
    if (firstToComplete.error) {
      return;
    }

    const gracePeriodController = new AbortController();
    const gracePeriodDecodePromise = startAssetDecoding(files[0], gracePeriodController);
    result = await handleUploadFirst(
      firstToComplete.value,
      gracePeriodDecodePromise,
      gracePeriodController,
    );

    initialDecodeController.abort('Upload completed first, switching to grace period decode');
  } else {
    if (firstToComplete.error) {
      initialDecodeController.abort('Decode failed');
      return;
    }

    result = await handleDecodeFirst(firstToComplete.value, uploadPromise, initialDecodeController);
  }

  if (!result.assetId) return;

  const url = await buildEditorUrl(quickAction, result.assetId, result.dimensions);

  /**
 * In Safari, due to backward cache, when a user navigates back to the upload page
 * from the editor, the upload UI is not reset. This creates an issue, where the user
 * does not see the upload UI and instead sees the upload progress bar. So we reset
 * the upload UI on safari just before navigating to the editor.
 */
  if (isSafari()) {
    resetUploadUI();
  }

  window.location.href = url.toString();
}

async function startSDKWithUnconvertedFiles(files, quickAction, block) {
  let data = await processFilesForQuickAction(files, quickAction);
  if (!data[0]) {
    const msg = await getErrorMsg(files, quickAction, replaceKey, getConfig);
    showErrorToast(block, msg);
    return;
  }

  if (data.some((item) => !item)) {
    const msg = await getErrorMsg(files, quickAction, replaceKey, getConfig);
    showErrorToast(block, msg);
    data = data.filter((item) => item);
  }

  // here update the variant to the url variant if it exists
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('variant');
  const variant = urlVariant || quickAction;

  const frictionlessAllowedQuickActions = Object.values(FRICTIONLESS_UPLOAD_QUICK_ACTIONS);
  if (frictionlessAllowedQuickActions.includes(variant)) {
    await performUploadAction(files, block, variant);
    return;
  }

  startSDK(data, quickAction, block);
}

function createCaptionLocaleDropdown() {
  const { wrapper } = createLocaleDropdownWrapper({
    defaultValue: 'en-us',
    onChange: (code) => {
      selectedVideoLanguage = code;
    },
  });
  return wrapper;
}

export function createStep(number, content) {
  const step = createTag('div', { class: 'step', 'data-step': number });
  const stepNumber = createTag('div', { class: 'step-number' }, number);
  step.append(stepNumber, content);
  return step;
}

export default async function decorate(block) {
  const [utils, placeholders] = await Promise.all([import(`${getLibs()}/utils/utils.js`),
    import(`${getLibs()}/features/placeholders.js`),
    decorateButtonsDeprecated(block)]);

  ({ createTag, getMetadata, getConfig } = utils);
  ({ replaceKey } = placeholders);

  const rows = Array.from(block.children);
  rows[1].classList.add('fqa-container');
  const quickActionRow = rows.filter(
    (r) => r.children
      && r.children[0].textContent.toLowerCase().trim() === 'quick-action',
  );
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
  cta.addEventListener('click', (e) => e.preventDefault(), false);
  // Fetch the base url for editor entry from upload cta and save it for later use.
  frictionlessTargetBaseUrl = cta.href;
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('variant');
  const variant = urlVariant || quickAction;
  if (variant === FRICTIONLESS_UPLOAD_QUICK_ACTIONS.removeBackgroundVariant1
    || variant === FRICTIONLESS_UPLOAD_QUICK_ACTIONS.removeBackgroundVariant2) {
    const isStage = urlParams.get('hzenv') === 'stage';
    frictionlessTargetBaseUrl = isStage
      ? 'https://stage.projectx.corp.adobe.com/new'
      : 'https://express.adobe.com/new';
  }

  const dropzoneHint = dropzone.querySelector('p:first-child');
  const gtcText = dropzone.querySelector('p:last-child');
  const actionColumn = createTag('div');
  const dropzoneContainer = createTag('div', { class: 'dropzone-container' });


  if (animation && animation.href.includes('.mp4')) {
    animationContainer.append(transformLinkToAnimation(animation));
  }

  const captionVideoDropzoneActionColumn = createTag('div', { class: 'caption-video-dropzone-action-column' });
  // Add locale dropdown for caption-video
  if (quickAction === 'caption-video') {
    const localeDropdownWrapper = createCaptionLocaleDropdown();
    const step1 = createStep('1', localeDropdownWrapper);
    actionColumn.append(step1);

    const dropzoneHintClone = dropzoneHint.cloneNode(true);
    dropzoneHintClone.classList.add('caption-video-dropzone-hint');
    captionVideoDropzoneActionColumn.append(dropzoneHintClone);
    dropzoneHint.classList.add('hidden');
  }

  if (cta) cta.classList.add('xlarge');
  dropzone.classList.add('dropzone');

  dropzone.before(actionColumn);
  dropzoneContainer.append(dropzone);

  if (quickAction === 'caption-video') {
    captionVideoDropzoneActionColumn.append(dropzoneContainer, gtcText);
    const step2 = createStep('2', captionVideoDropzoneActionColumn);
    actionColumn.append(step2);
  } else {
    actionColumn.append(dropzoneContainer, gtcText);
  }

  const inputElement = createTag('input', {
    type: 'file',
    accept: QA_CONFIGS[quickAction].accept,
    ...(quickAction === 'merge-videos' && { multiple: true }),
  });
  inputElement.onchange = () => {
    if (quickAction === 'merge-videos' && inputElement.files.length > 1) {
      startSDKWithUnconvertedFiles(inputElement.files, quickAction, block);
    } else {
      const file = inputElement.files[0];
      startSDKWithUnconvertedFiles([file], quickAction, block);
    }
  };
  block.append(inputElement);

  dropzoneContainer.addEventListener('click', (e) => {
    e.preventDefault();
    if (quickAction === 'generate-qr-code') {
      startSDK([''], quickAction, block);
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
    if (quickAction === 'merge-videos' && files.length > 1) {
      startSDKWithUnconvertedFiles(files, quickAction, block);
    } else {
      await Promise.all(
        [...files].map((file) => startSDKWithUnconvertedFiles([file], quickAction, block)),
      );
    }

    document.body.dataset.suppressfloatingcta = 'true';
  }, false);

  const freePlanTags = await buildFreePlanWidget({
    typeKey: 'branded',
    checkmarks: true,
  });
  dropzone.append(freePlanTags);

  // Load Easy Upload Experiment for enabled quick actions if experiment is on.
  let easyUpload = null;
  if (new EasyUpload().isExperimentEnabled(quickAction)) {
    easyUpload = new EasyUpload();
    try {
      // Load QR code styling library
      await easyUpload.generateQRCode();
    } catch (error) {
      console.error('Failed to load QR code library:', error);
    }
  }

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

      // Cleanup easy upload resources
      if (easyUpload) {
        easyUpload.cleanup();
      }
    }
  }, { passive: true });

  if (EXPERIMENTAL_VARIANTS.includes(quickAction)) {
    block.dataset.frictionlesstype = 'remove-background';
  } else {
    block.dataset.frictionlesstype = quickAction;
  }

  block.dataset.frictionlessgroup = QA_CONFIGS[quickAction].group ?? 'image';

  if (
    ['on', 'yes'].includes(getMetadata('marquee-inject-logo')?.toLowerCase())
  ) {
    const logo = getIconElementDeprecated('adobe-express-logo');
    logo.classList.add('express-logo');
    block.prepend(logo);
  }

  sendFrictionlessEventToAdobeAnaltics(block);
}


/**
   * Generate URL Shortener configuration based on environment
   * @returns {object} Configuration object with serviceUrl, apiKey, and enabled flag
   */
function getUrlShortenerConfig() {
  const { env } = getConfig();
  const envName = env.name;

  // URL shortener service endpoint
  const serviceUrlMap = {
    prod: 'https://go.adobe.io',
    stage: 'https://go-stage.adobe.io',
    local: 'https://go-stage.adobe.io',
  };

  // API key for URL shortener service
  const apiKeyMap = {
    prod: 'quickactions_hz_webapp',
    stage: 'hz-dynamic-url-service',
    local: 'hz-dynamic-url-service',
  };

  const serviceUrl = serviceUrlMap[envName] || serviceUrlMap.stage;
  const apiKey = apiKeyMap[envName] || apiKeyMap.stage;

  return {
    serviceUrl,
    apiKey // Enable URL shortening
  };
}

/**
 * Generate UUID v4
 * @returns {string} UUID
 */
function generateUUID() {
  return crypto.randomUUID();
}

/**
 * ACP Storage Helper - Manages file upload and download operations with Adobe Content Platform
 */
class AcpStorageHelper {
  constructor() {
    this.uploadService = null;
    this.asset = null;
    this.uploadAsset = null;
    this.pollingInterval = null;
    this.versionReadyPromise = null;

    // Constants
    this.MAX_FILE_SIZE = 60000000; // 60 MB
    this.TRANSFER_DOCUMENT = 'application/vnd.adobecloud.bulk-transfer+json';
    this.CONTENT_TYPE = 'application/octet-stream';
    this.SECOND_IN_MS = 1000;
    this.MAX_POLLING_ATTEMPTS = 100;
    this.POLLING_TIMEOUT_MS = 100000;

    // Link relation constants
    this.LINK_REL = {
      BLOCK_UPLOAD_INIT: 'http://ns.adobe.com/adobecloud/rel/block/upload/init',
      BLOCK_TRANSFER: 'http://ns.adobe.com/adobecloud/rel/block/transfer',
      BLOCK_FINALIZE: 'http://ns.adobe.com/adobecloud/rel/block/finalize',
      SELF: 'self',
      RENDITION: 'http://ns.adobe.com/adobecloud/rel/rendition',
    };

    console.log('AcpStorageHelper initialized');
  }

  /**
   * Get authentication token from Adobe IMS
   */
  async getAuthToken() {
    if (!window?.adobeIMS?.isSignedInUser()) {
      throw new Error('User not signed in');
    }
    const token = window.adobeIMS.getAccessToken()?.token;
    if (!token) {
      throw new Error('Failed to retrieve authentication token');
    }
    return token;
  }

  /**
   * Extract link href from asset links
   */
  getLinkHref(links, relation) {
    if (!links || !links[relation]) {
      return null;
    }
    return links[relation].href;
  }


  /**
   * Initialize block upload for the asset
   */
  async initializeBlockUpload(asset) {
    console.log('Initializing block upload', {
      assetId: asset.assetId,
      repositoryId: asset.repositoryId,
    });

    try {
      const authToken = await this.getAuthToken();
      const apiKey = this.getApiKey();

      // Extract block upload URL from asset links
      const blockUploadUrl = this.getLinkHref(asset._links, this.LINK_REL.BLOCK_UPLOAD_INIT);
      if (!blockUploadUrl) {
        throw new Error('Block upload URL not found in asset links');
      }

      const blockUploadData = {
        'repo:size': this.MAX_FILE_SIZE,
        'repo:blocksize': this.MAX_FILE_SIZE,
        'repo:reltype': 'primary',
        'dc:format': this.CONTENT_TYPE,
      };

      const response = await fetch(`${blockUploadUrl}?includes=all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': this.TRANSFER_DOCUMENT,
          'x-api-key': apiKey,
        },
        body: JSON.stringify(blockUploadData),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Block upload initialization failed: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const uploadAsset = await response.json();
      this.uploadAsset = uploadAsset;

      console.log('Block upload initialized successfully', {
        hasLinks: !!uploadAsset._links,
      });

      return uploadAsset;
    } catch (error) {
      console.error('Failed to initialize block upload:', error);
      throw error;
    }
  }

  /**
   * Extract upload URL from transfer document
   */
  extractUploadUrl(uploadAsset) {
    const uploadUrl = this.getLinkHref(uploadAsset._links, this.LINK_REL.BLOCK_TRANSFER);
    if (!uploadUrl) {
      throw new Error('Block transfer URL not found in upload asset links');
    }
    return uploadUrl;
  }

  /**
   * Generate presigned upload URL
   */
  async generateUploadUrl() {
    console.log('Generating upload URL for mobile client');

    try {
      this.uploadService = await initializeUploadService();
      this.asset = await this.uploadService.createTemporaryAsset(this.CONTENT_TYPE);
      this.uploadAsset = await this.initializeBlockUpload(this.asset);

      const uploadUrl = this.extractUploadUrl(this.uploadAsset);

      console.log('Upload URL generated successfully', {
        assetId: this.asset.assetId,
        hasUploadUrl: !!uploadUrl,
      });

      return uploadUrl;
    } catch (error) {
      console.error('Failed to generate upload URL:', error);
      throw error;
    }
  }

  /**
   * Finalize the upload
   */
  async finalizeUpload() {
    if (!this.uploadAsset) {
      throw new Error('No upload asset available for finalization');
    }

    console.log('Finalizing upload');

    try {
      const authToken = await this.getAuthToken();
      const apiKey = this.getApiKey();

      const finalizeUrl = this.getLinkHref(this.uploadAsset._links, this.LINK_REL.BLOCK_FINALIZE);
      if (!finalizeUrl) {
        throw new Error('Block finalize URL not found in upload asset links');
      }

      const response = await fetch(finalizeUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': this.TRANSFER_DOCUMENT,
          'x-api-key': apiKey,
        },
        body: JSON.stringify(this.uploadAsset),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Block upload finalization failed: ${response.status} ${response.statusText}. ${errorText}`);
      }

      console.log('Upload finalized successfully');
    } catch (error) {
      console.error('Failed to finalize upload:', error);
      throw error;
    }
  }

  /**
   * Wait for asset version to be ready
   */
  async waitForAssetVersionReady() {
    return new Promise((resolve, reject) => {
      this.versionReadyPromise = { resolve, reject };
      let pollAttempts = 0;

      const timeoutId = setTimeout(() => {
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
        }
        reject(new Error(`Polling timeout: Asset version not ready after ${this.POLLING_TIMEOUT_MS}ms`));
      }, this.POLLING_TIMEOUT_MS);

      this.pollingInterval = setInterval(async () => {
        try {
          pollAttempts++;
          console.log('Polling for asset version', {
            assetId: this.asset?.assetId,
            attempt: pollAttempts,
          });

          const version = await this.uploadService.getAssetVersion(this.asset);
          const success = version === '1';

          if (success) {
            clearInterval(this.pollingInterval);
            clearTimeout(timeoutId);
            console.log('Asset version ready', {
              assetId: this.asset?.assetId,
              attempts: pollAttempts,
            });
            resolve();
          } else if (pollAttempts >= this.MAX_POLLING_ATTEMPTS) {
            clearInterval(this.pollingInterval);
            clearTimeout(timeoutId);
            reject(new Error(`Max polling attempts reached (${this.MAX_POLLING_ATTEMPTS}). Asset version: ${version}`));
          }
        } catch (error) {
          clearInterval(this.pollingInterval);
          clearTimeout(timeoutId);
          console.error('Error during version polling:', error);
          reject(error);
        }
      }, this.SECOND_IN_MS);
    });
  }

  /**
   * Detect file type from content string
   */
  detectFileType(typeString) {
    const lowerTypeString = typeString.toLowerCase();

    // Image types
    if (lowerTypeString.includes('png')) return 'image/png';
    if (lowerTypeString.includes('jpg') || lowerTypeString.includes('jpeg') || lowerTypeString.includes('jfif') || lowerTypeString.includes('exif')) return 'image/jpeg';
    if (lowerTypeString.includes('gif')) return 'image/gif';
    if (lowerTypeString.includes('webp')) return 'image/webp';
    if (lowerTypeString.includes('svg')) return 'image/svg+xml';
    if (lowerTypeString.includes('bmp')) return 'image/bmp';
    if (lowerTypeString.includes('heic')) return 'image/heic';

    // Video types
    if (lowerTypeString.includes('mp4')) return 'video/mp4';
    if (lowerTypeString.includes('mov')) return 'video/quicktime';
    if (lowerTypeString.includes('avi')) return 'video/x-msvideo';
    if (lowerTypeString.includes('webm')) return 'video/webm';

    // Default to JPEG for images
    return 'image/jpeg';
  }

  /**
   * Retrieve uploaded file
   */
  async retrieveUploadedFile() {
    console.log('Retrieving uploaded file', { assetId: this.asset?.assetId });

    try {
      await this.waitForAssetVersionReady();

      if (this.versionReadyPromise?.isRejected) {
        throw new Error("Asset version not ready");
      }

      const blob = await this.uploadService.downloadAssetContent(this.asset);
      const typeString = await blob.slice(0, 50).text();
      const detectedType = this.detectFileType(typeString);
      const fileName = `upload_${Date.now()}_${generateUUID().substring(0, 8)}`;

      const file = new File([blob], fileName, { type: detectedType });

      console.log('File retrieved successfully', {
        assetId: this.asset?.assetId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      return file;
    } catch (error) {
      console.error('Failed to retrieve uploaded file:', error);
      throw error;
    }
  }

  /**
   * Dispose and cleanup resources
   */
  async dispose() {
    console.log('Disposing AcpStorageHelper resources', {
      assetId: this.asset?.assetId,
      hasPollingInterval: !!this.pollingInterval,
    });

    try {
      await this.uploadService.deleteAsset(this.asset);
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }

      this.asset = null;
      this.uploadAsset = null;
      this.versionReadyPromise = null;

      console.log('AcpStorageHelper disposal completed');
    } catch (error) {
      console.error('Error during disposal:', error);
    }
  }
}

/**
 * Service for shortening URLs using Adobe's dynamic URL service
 */
class UrlShortenerService {
  constructor(config) {
    this.config = config;
    this.logger = console; // Using console for logging in browser
    this.logger.info('UrlShortenerService initialized');
  }

  /**
   * Get the shortener URL from the config
   */
  get shortenerUrl() {
    return this.config.serviceUrl;
  }

  /**
   * Get the API key from the config
   */
  get apiKey() {
    return this.config.apiKey;
  }

  /**
   * Get IMS access token
   */
  async getAccessToken() {
    if (window?.adobeIMS?.isSignedInUser()) {
      return window.adobeIMS.getAccessToken()?.token;
    }
    throw new Error('User not signed in');
  }

  /**
   * Fetch a request to the shortener service
   * @param {string} endpoint - The endpoint to fetch
   * @param {string} method - The HTTP method to use
   * @param {object} payload - The payload to send
   * @returns {Promise<{success: boolean, data?: string, error?: string}>}
   */
  async fetchRequest(endpoint, method, payload) {
    try {
      const accessToken = await this.getAccessToken();
      const url = new URL(`${this.shortenerUrl}${endpoint}`);

      const response = await fetch(url.toString(), {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.status === 'success'
        ? { success: true, data: data.data }
        : { success: false, error: 'Unexpected response format' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate a short URL
   * @param {string} url - The URL to shorten
   * @param {string} timeZone - The time zone to use
   * @param {string} metaData - The metadata to send
   * @returns {Promise<{success: boolean, data?: string, error?: string}>}
   */
  generateShortUrl(url, timeZone, metaData) {
    return this.fetchRequest('/v1/short-links/', 'POST', {
      url,
      timeZone,
      metaData,
    });
  }
}

class EasyUpload {
  constructor() {
    this.enabledQuickActions = ['remove-background', 'resize-image', 'crop-image', 'convert-to-jpg', 'convert-to-png'];
    this.qrCode = null;
    this.qrCodeContainer = null;
    this.confirmButton = null;
    this.acpStorageHelper = null;
    this.qrRefreshInterval = null;
    this.isUploadFinalizing = false;

    // Initialize URL Shortener Service
    const urlShortenerConfig = getUrlShortenerConfig();
    this.urlShortenerService = new UrlShortenerService(urlShortenerConfig);

    // Constants
    this.QR_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
    this.QR_CODE_CONFIG = {
      width: 200,
      height: 200,
      type: 'canvas',
      data: '',
      dotsOptions: {
        color: '#000000',
        type: 'rounded',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10,
      },
    };

    // Bind cleanup to window unload
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  isExperimentEnabled(quickAction) {
    return this.enabledQuickActions.includes(quickAction);
  }

  loadQRCodeLibrary() {
    return new Promise((resolve, reject) => {
      if (window.QRCodeStyling) {
        resolve(window.QRCodeStyling);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qr-code-styling@1.9.2/lib/qr-code-styling.js';
      script.onload = () => resolve(window.QRCodeStyling);
      script.onerror = () => reject(new Error('Failed to load QR code library'));
      document.head.appendChild(script);
    });
  }

  async generateUploadUrl() {
    try {
      // Initialize ACP Storage Helper
      if (!this.acpStorageHelper) {
        this.acpStorageHelper = new AcpStorageHelper();
      }

      // Generate presigned upload URL
      const presignedUrl = await this.acpStorageHelper.generateUploadUrl();

      // Build mobile upload URL
      return this.buildMobileUploadUrl(presignedUrl);
    } catch (error) {
      console.error('Failed to generate upload URL:', error);
      throw error;
    }
  }

  buildMobileUploadUrl(presignedUrl) {
    const { env } = getConfig();
    const host = env.name === 'prod'
      ? 'express.adobe.com'
      : 'express-stage.adobe.com';

    const url = new URL(`https://${host}/uploadFromOtherDevice`);
    url.searchParams.set('upload_url', presignedUrl);

    return url.toString();
  }

  async shortenUrl(longUrl) {
    if (!this.urlShortenerService) {
      console.log('URL Shortener Service not enabled, using original URL');
      return longUrl;
    }

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const metaData = 'easy-upload-qr-code';

      console.log('Attempting to shorten URL', {
        originalUrlLength: longUrl.length,
        timeZone,
        metaData,
      });

      const response = await this.urlShortenerService.generateShortUrl(
        longUrl,
        timeZone,
        metaData,
      );

      if (response.success && response.data) {
        console.log('URL shortened successfully', {
          shortUrl: response.data,
          originalLength: longUrl.length,
          shortLength: response.data.length,
        });
        return response.data;
      }

      console.warn('Failed to shorten URL, using original', {
        error: response.error,
      });
      return longUrl;
    } catch (error) {
      console.error('Error shortening URL, using original', {
        error: error instanceof Error ? error.message : String(error),
      });
      return longUrl;
    }
  }

  async displayQRCode(uploadUrl) {
    const QRCodeStyling = await this.loadQRCodeLibrary();

    if (!this.qrCode) {
      this.qrCode = new QRCodeStyling({
        ...this.QR_CODE_CONFIG,
        data: uploadUrl,
      });
    } else {
      this.qrCode.update({
        ...this.QR_CODE_CONFIG,
        data: uploadUrl,
      });
    }

    // Create a container for the QR code
    const buttonContainer = dropzone.querySelector('.button-container');
    if (buttonContainer && !this.qrCodeContainer) {
      this.qrCodeContainer = createTag('div', { class: 'qr-code-container' });
      buttonContainer.appendChild(this.qrCodeContainer);
    }

    if (this.qrCodeContainer) {
      this.qrCodeContainer.innerHTML = '';
      this.qrCode.append(this.qrCodeContainer);
    }
  }

  async initializeQRCode() {
    try {
      const uploadUrl = await this.generateUploadUrl();
      const finalUrl = await this.shortenUrl(uploadUrl);
      await this.displayQRCode(finalUrl);

      // Set up refresh interval
      this.scheduleQRRefresh();
    } catch (error) {
      console.error('Failed to initialize QR code:', error);
      throw error;
    }
  }

  scheduleQRRefresh() {
    // Clear existing interval
    if (this.qrRefreshInterval) {
      clearTimeout(this.qrRefreshInterval);
    }

    // Schedule next refresh
    this.qrRefreshInterval = setTimeout(() => {
      this.refreshQRCode();
    }, this.QR_REFRESH_INTERVAL);
  }

  async refreshQRCode() {
    try {
      console.log('Refreshing QR code...');
      await this.initializeQRCode();
    } catch (error) {
      console.error('Failed to refresh QR code:', error);
    }
  }

  async handleConfirmImport() {
    if (this.isUploadFinalizing) return;

    this.isUploadFinalizing = true;
    this.updateConfirmButtonState(true);

    try {
      if (!this.acpStorageHelper) {
        throw new Error('ACP Storage Helper not initialized');
      }

      // Finalize the upload first
      await this.acpStorageHelper.finalizeUpload();

      // Retrieve the uploaded file
      const file = await this.retrieveUploadedFile();

      if (file) {
        // Process the file (trigger the standard upload flow)
        await startSDKWithUnconvertedFiles([file], quickAction, block);

        // // Refresh QR code for next upload
        // await this.refreshQRCode();
      } else {
        console.warn('No file was uploaded');
        showErrorToast(block, 'No file detected. Please upload a file from your mobile device.');
      }
    } catch (error) {
      console.error('Failed to confirm import:', error);
      showErrorToast(block, 'Failed to import file. Please try again.');
    } finally {
      this.isUploadFinalizing = false;
      this.updateConfirmButtonState(false);
    }
  }

  async retrieveUploadedFile() {
    try {
      if (!this.acpStorageHelper) {
        throw new Error('ACP Storage Helper not available');
      }

      // Retrieve uploaded file using ACP Storage Helper
      const file = await this.acpStorageHelper.retrieveUploadedFile();

      return file;
    } catch (error) {
      console.error('Failed to retrieve uploaded file:', error);
      throw error;
    }
  }

  updateConfirmButtonState(disabled) {
    if (this.confirmButton) {
      if (disabled) {
        this.confirmButton.classList.add('disabled');
        this.confirmButton.setAttribute('aria-disabled', 'true');
      } else {
        this.confirmButton.classList.remove('disabled');
        this.confirmButton.removeAttribute('aria-disabled');
      }
    }
  }

  createConfirmButton() {
    const confirmButton = createTag('a', {
      href: '#',
      class: 'button accent xlarge confirm-import-button',
      title: 'Confirm Import'
    }, 'Confirm Import');

    confirmButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleConfirmImport();
    });

    this.confirmButton = confirmButton;
    return confirmButton;
  }

  async generateQRCode() {
    try {
      await this.initializeQRCode();

      // Add Confirm Import button
      const buttonContainer = dropzone.querySelector('.button-container');
      if (buttonContainer) {
        const confirmButton = this.createConfirmButton();
        buttonContainer.appendChild(confirmButton);
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      throw error;
    }
  }

  async cleanup() {
    // Clear refresh interval
    if (this.qrRefreshInterval) {
      clearTimeout(this.qrRefreshInterval);
      this.qrRefreshInterval = null;
    }

    // Dispose ACP Storage Helper
    if (this.acpStorageHelper) {
      await this.acpStorageHelper.dispose();
      this.acpStorageHelper = null;
    }

    // Clear references
    this.qrCode = null;
    this.qrCodeContainer = null;
    this.confirmButton = null;

    console.log('EasyUpload resources cleaned up');
  }
}
