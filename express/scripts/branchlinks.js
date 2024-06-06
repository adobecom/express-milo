import { getCachedMetadata, getLibs } from './utils.js';

const [{ getConfig }, placeholderMod] = await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]);

function getPlacement(btn) {
  const parentBlock = btn.closest('[daa-lh^="b"]');
  let placement = 'outside-blocks';

  if (parentBlock) {
    const blockName = parentBlock.classList[0];
    const sameBlocks = btn.closest('main')?.querySelectorAll(`.${blockName}`);

    if (sameBlocks && sameBlocks.length > 1) {
      sameBlocks.forEach((b, i) => {
        if (b === parentBlock) {
          placement = `${blockName}-${i + 1}`;
        }
      });
    } else {
      placement = blockName;
    }

    if (['template-x'].includes(blockName) && btn.classList.contains('placeholder')) {
      placement = 'blank-template-cta';
    }
  }

  return placement;
}

export default async function trackBranchParameters(links) {
  const rootUrl = new URL(window.location.href);
  const params = rootUrl.searchParams;
  const pageUrl = window.location.pathname;
  const { referrer } = window.document;

  const [
    searchTerm,
    canvasHeight,
    canvasWidth,
    canvasUnit,
    sceneline,
    taskID,
    assetCollection,
    category,
    searchCategory,
    loadPrintAddon,
    tab,
    action,
    prompt,
    sdid,
    mv,
    mv2,
    sKwcId,
    efId,
    promoId,
    trackingId,
    cgen,
  ] = [
    getCachedMetadata('branch-search-term'),
    getCachedMetadata('branch-canvas-height'),
    getCachedMetadata('branch-canvas-width'),
    getCachedMetadata('branch-canvas-unit'),
    getCachedMetadata('branch-sceneline'),
    getCachedMetadata('branch-task-id'),
    getCachedMetadata('branch-asset-collection'),
    getCachedMetadata('branch-category'),
    getCachedMetadata('branch-search-category'),
    getCachedMetadata('branch-loadprintaddon'),
    getCachedMetadata('branch-tab'),
    getCachedMetadata('branch-action'),
    getCachedMetadata('branch-prompt'),
    params.get('sdid'),
    params.get('mv'),
    params.get('mv2'),
    params.get('s_kwcid'),
    params.get('ef_id'),
    params.get('promoid'),
    params.get('trackingid'),
    params.get('cgen'),
  ];

  const promises = [];
  links.forEach((a) => {
    if (a.href && a.href.match('adobesparkpost.app.link')) {
      a.rel = 'nofollow';
      const btnUrl = new URL(a.href);
      const urlParams = btnUrl.searchParams;
      const setParams = (k, v) => {
        if (v) urlParams.set(k, encodeURIComponent(v));
      };
      if (urlParams.has('acomx-dno')) {
        urlParams.delete('acomx-dno');
        btnUrl.search = urlParams.toString();
        a.href = decodeURIComponent(btnUrl.toString());
        return;
      }
      const placement = getPlacement(a);

      const prom = placeholderMod.replaceKey('search-branch-links', getConfig()).then((searchBranchLink) => {
        const isSearchBranchLink = searchBranchLink?.replace(/\s/g, '').split(',').includes(`${btnUrl.origin}${btnUrl.pathname}`);
        if (isSearchBranchLink) {
          setParams('category', category || 'templates');
          setParams('taskID', taskID);
          setParams('assetCollection', assetCollection);

          if (searchCategory) {
            setParams('searchCategory', searchCategory);
          } else if (searchTerm) {
            setParams('q', searchTerm);
          }
          if (loadPrintAddon) setParams('loadPrintAddon', loadPrintAddon);
          setParams('tab', tab);
          setParams('action', action);
          setParams('prompt', prompt);
        }
      });
      promises.push(prom);

      setParams('referrer', referrer);
      setParams('url', pageUrl);
      setParams('height', canvasHeight);
      setParams('width', canvasWidth);
      setParams('unit', canvasUnit);
      setParams('sceneline', sceneline);
      setParams('sdid', sdid);
      setParams('mv', mv);
      setParams('mv2', mv2);
      setParams('efid', efId);
      setParams('promoid', promoId);
      setParams('trackingid', trackingId);
      setParams('cgen', cgen);
      setParams('placement', placement);

      if (sKwcId) {
        const sKwcIdParameters = sKwcId.split('!');

        if (typeof sKwcIdParameters[2] !== 'undefined' && sKwcIdParameters[2] === '3') {
          setParams('customer_placement', 'Google%20AdWords');
        }

        if (typeof sKwcIdParameters[8] !== 'undefined' && sKwcIdParameters[8] !== '') {
          setParams('keyword', sKwcIdParameters[8]);
        }
      }

      btnUrl.search = urlParams.toString();
      a.href = decodeURIComponent(btnUrl.toString());
    }
  });
  await Promise.all(promises);
}
