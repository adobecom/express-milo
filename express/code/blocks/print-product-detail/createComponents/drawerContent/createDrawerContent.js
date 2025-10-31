import { getLibs, getIconElementDeprecated } from '../../../../scripts/utils.js';
import createMiniPillOptionsSelector from '../customizationInputs/createMiniPillOptionsSelector.js';

let createTag;

export async function closeDrawer() {
  const curtain = document.querySelector('.pdp-curtain');
  const drawer = document.querySelector('.drawer');
  curtain.classList.add('hidden');
  drawer.classList.add('hidden');
  document.body.classList.remove('disable-scroll');
}

export async function createDrawer() {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const curtain = createTag('div', { class: 'pdp-curtain hidden' });
  curtain.setAttribute('daa-ll', 'pdp-x-drawer-curtainClose');
  const drawer = createTag('div', { class: 'drawer hidden', id: 'pdp-x-drawer' });
  curtain.addEventListener('click', closeDrawer);
  return { curtain, drawer };
}

export function createDrawerHead(drawerLabel) {
  const drawerHead = createTag('div', { class: 'drawer-head' });
  const closeButton = createTag('button', { 'aria-label': 'close' }, getIconElementDeprecated('close-black')); // TODO: analytics
  closeButton.addEventListener('click', closeDrawer);
  drawerHead.append(createTag('div', { class: 'drawer-head-label' }, drawerLabel), closeButton);
  return drawerHead;
}

export default async function createDrawerContentSizeChart(productDetails, drawerContainer) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const drawerHead = createDrawerHead('Printing Process');
  const drawerBody = createTag('div', { class: 'drawer-body' });
  const sizeChartContainer = createTag('div', { class: 'pdpx-size-chart-container drawer-body--size-chart' });
  sizeChartContainer.innerHTML = `<h2 class="size-chart-product-name">Bella+Canvas Tri-blend T-Shirt</h2><div class="size-chart-table-container"><div class="size-chart-tables"><div class="size-chart-table-section"><table class="size-chart-table">
    <thead>
      <tr>
        <th class="size-chart-table-header">Body (IN)</th>
        <th>Chest</th>
        <th>Waist</th>
      </tr>
    </thead>
    <tbody>
      
        <tr>
          <td>Adult S</td>
          <td>34-37</td>
          <td>30-32</td>
        </tr>
      
        <tr>
          <td>Adult M</td>
          <td>38-41</td>
          <td>32-34</td>
        </tr>
      
        <tr>
          <td>Adult L</td>
          <td>42-45</td>
          <td>34-36</td>
        </tr>
      
        <tr>
          <td>Adult XL</td>
          <td>46-49</td>
          <td>36-38</td>
        </tr>
      
        <tr>
          <td>Adult 2XL</td>
          <td>50-53</td>
          <td>38-40</td>
        </tr>
      
    </tbody>
  </table></div><div class="size-chart-table-section"><table class="size-chart-table">
    <thead>
      <tr>
        <th class="size-chart-table-header">Garment (IN)</th>
        <th>Chest</th>
        <th>Waist</th>
      </tr>
    </thead>
    <tbody>
      
        <tr>
          <td>Adult S</td>
          <td>18</td>
          <td>28</td>
        </tr>
      
        <tr>
          <td>Adult M</td>
          <td>20</td>
          <td>29</td>
        </tr>
      
        <tr>
          <td>Adult L</td>
          <td>22</td>
          <td>30</td>
        </tr>
      
        <tr>
          <td>Adult XL</td>
          <td>24</td>
          <td>31</td>
        </tr>
      
        <tr>
          <td>Adult 2XL</td>
          <td>26</td>
          <td>32</td>
        </tr>
      
    </tbody>
  </table></div></div></div><div class="size-chart-unit-toggle"><button class="size-chart-unit-button active" type="button">IN</button><button class="size-chart-unit-button " type="button">CM</button></div><div class="size-chart-instructions"><div class="size-chart-instruction-section">
    <h3>Body</h3>
    <p class="size-chart-instruction-text">Measure under your arms around the fullest part of your chest</p>
    <p class="size-chart-instruction-text">Measure around your natural waistline at the narrowest point</p>
  </div><div class="size-chart-instruction-section">
    <h3>Garment</h3>
    <p class="size-chart-instruction-text">Measure garment from arm hole to arm hole</p>
    <p class="size-chart-instruction-text">Measure garment from the seam at the neck to the bottom of the garment</p>
  </div><div class="size-chart-instruction-section">
    <h3>Fit</h3>
    <p class="size-chart-instruction-text">Standard</p>
  </div></div>`;
  drawerBody.appendChild(sizeChartContainer);
  drawerContainer.append(drawerHead, drawerBody);
}

export async function createDrawerContentPrintingProcess(productDetails, drawerContainer) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const drawerHead = createDrawerHead('Printing Process');
  const drawerBody = createTag('div', { class: 'drawer-body' });

  const printingProcessOptionsContainer = createTag('div', { class: 'pdpx-printing-process-options-container' });
  const classicPrintingOptionsContainer = createTag('div', { class: 'pdpx-printing-process-option-container' });
  const classicPrintingImageContainer = createTag('div', { class: 'pdpx-printing-process-option-image-container' });
  const classicPrintingInfoContainer = createTag('div', { class: 'pdpx-printing-process-option-info-container' });
  const classicPrintingColorLockup = createTag('div', { class: 'pdpx-printing-process-option-color-lockup' });
  classicPrintingColorLockup.append(getIconElementDeprecated('cmyk_droplet_cyan'), getIconElementDeprecated('cmyk_droplet_magenta'), getIconElementDeprecated('cmyk_droplet_yellow'), getIconElementDeprecated('cmyk_droplet_black'), productDetails.classicPrintingSummary);

  classicPrintingInfoContainer.appendChild(createTag('span', { class: 'pdpx-printing-process-option-info-title' }, productDetails.classicPrintingTitle));
  classicPrintingInfoContainer.appendChild(createTag('p', { class: 'pdpx-printing-process-option-info-description' }, productDetails.classicPrintingDescription));
  classicPrintingInfoContainer.appendChild(classicPrintingColorLockup);
  classicPrintingImageContainer.appendChild(createTag('img', { class: 'pdpx-printing-process-option-image', src: 'https://asset.zcache.com/assets/graphics/pd/productAttributeHelp/underbasePrintProcess/Classic.jpg', alt: 'Classic Printing' }));
  classicPrintingOptionsContainer.append(classicPrintingImageContainer, classicPrintingInfoContainer);

  const vividPrintingOptionsContainer = createTag('div', { class: 'pdpx-printing-process-option-container' });
  const vividPrintingImageContainer = createTag('div', { class: 'pdpx-printing-process-option-image-container' });
  const vividPrintingInfoContainer = createTag('div', { class: 'pdpx-printing-process-option-info-container' });
  const vividPrintingColorLockup = createTag('div', { class: 'pdpx-printing-process-option-color-lockup' });
  vividPrintingColorLockup.append(getIconElementDeprecated('cmyk_droplet_cyan'), getIconElementDeprecated('cmyk_droplet_magenta'), getIconElementDeprecated('cmyk_droplet_yellow'), getIconElementDeprecated('cmyk_droplet_black'), getIconElementDeprecated('cmyk_droplet_white'), productDetails.vividPrintingSummary);
  vividPrintingInfoContainer.appendChild(createTag('span', { class: 'pdpx-printing-process-option-info-title' }, productDetails.vividPrintingTitle));
  vividPrintingInfoContainer.appendChild(createTag('p', { class: 'pdpx-printing-process-option-info-description' }, productDetails.vividPrintingDescription));
  vividPrintingInfoContainer.appendChild(vividPrintingColorLockup);
  vividPrintingImageContainer.appendChild(createTag('img', { class: 'pdpx-printing-process-option-image', src: 'https://asset.zcache.com/assets/graphics/pd/productAttributeHelp/underbasePrintProcess/Vivid.jpg', alt: 'Vivid Printing' }));
  vividPrintingOptionsContainer.append(vividPrintingImageContainer, vividPrintingInfoContainer);

  printingProcessOptionsContainer.append(classicPrintingOptionsContainer, vividPrintingOptionsContainer);
  drawerBody.appendChild(printingProcessOptionsContainer);
  drawerContainer.append(drawerHead, drawerBody);
}

export async function createDrawerContentPaperType(customizationOptions, labelText, hiddenSelectInputName, CTALinkText, productDetails, defaultValue, drawerType, drawerContainer) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const drawerHead = createDrawerHead('Select Paper Type');
  const drawerBody = createTag('div', { class: 'drawer-body' });
  const defaultValueSafe = defaultValue || customizationOptions[0].name;
  const defaultValueOption = customizationOptions.find((option) => option.name === defaultValueSafe);
  const defaultValueImageSrc = new URL(defaultValueOption.thumbnail);
  defaultValueImageSrc.searchParams.set('max_dim', '1000');
  const defaultValueImageSrcLarge = defaultValueImageSrc.toString();
  const heroImageAlt = '';
  const heroImageContainer = createTag('div', { class: 'pdpx-drawer-hero-image-container' });
  const heroImage = createTag('img', { class: 'pdpx-drawer-hero-image', src: defaultValueImageSrcLarge, alt: heroImageAlt });
  heroImageContainer.appendChild(heroImage);
  const titleRow = createTag('div', { class: 'pdpx-drawer-title-row' });
  const drawerTitle = createTag('span', { class: 'pdpx-drawer-title' }, defaultValueOption.title);
  titleRow.appendChild(drawerTitle);
  if (defaultValueSafe === '175ptmatte') {
    const recommendedBadge = createTag('span', { class: 'pdpx-recommended-badge' }, 'Recommended');
    titleRow.appendChild(recommendedBadge);
  }
  const pillsContainer = createTag('div', { class: 'pdpx-drawer-pills-container' });
  const specs = [
    defaultValueOption.thickness,
    defaultValueOption.weight,
    defaultValueOption.gsm,
  ].filter(Boolean);
  specs.forEach((spec) => {
    const pill = createTag('div', { class: 'pdpx-drawer-pill' });
    const pillIcon = getIconElementDeprecated('circle-check-mark');
    const pillText = createTag('span', { class: 'pdpx-drawer-pill-text' }, spec);
    pill.append(pillIcon, pillText);
    pillsContainer.appendChild(pill);
  });
  const paperTypeSelectorContainer = await createMiniPillOptionsSelector(customizationOptions, labelText, hiddenSelectInputName, null, productDetails, defaultValue, drawerType);
  const description = createTag('div', { class: 'pdpx-drawer-description' }, defaultValueOption.description);
  const drawerFoot = createTag('div', { class: 'drawer-foot' });
  const infoContainer = createTag('div', { class: 'pdpx-drawer-foot-info-container' });
  const infoText = createTag('div', { class: 'pdpx-drawer-foot-info-text' });
  infoText.append(createTag('div', { class: 'pdpx-drawer-foot-info-name' }, defaultValueOption.title));
  infoText.append(createTag('div', { class: 'pdpx-drawer-foot-info-price' }, defaultValueOption.priceAdjustment));
  infoContainer.append(createTag('img', { src: defaultValueOption.thumbnail, alt: heroImageAlt }), infoText);
  drawerFoot.appendChild(infoContainer);
  const selectButton = createTag('button', { class: 'pdpx-drawer-foot-select-button' }, 'Select');
  selectButton.addEventListener('click', async () => {
    closeDrawer();
  });
  drawerFoot.appendChild(selectButton);
  drawerContainer.appendChild(drawerHead);
  drawerBody.appendChild(heroImageContainer);
  drawerBody.appendChild(titleRow);
  drawerBody.appendChild(pillsContainer);
  drawerBody.appendChild(paperTypeSelectorContainer);
  drawerBody.appendChild(description);
  drawerContainer.appendChild(drawerBody);
  drawerContainer.appendChild(drawerFoot);
}
