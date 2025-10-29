import { getLibs, getIconElementDeprecated } from '../../../scripts/utils.js';
import updateAllDynamicElements from '../utilities/event-handlers.js';

let createTag;
let loadStyle;
let getConfig;

/**
 * Updates the paper selection UI when a thumbnail is clicked or state is synced
 * @param {HTMLElement} drawerBody - The drawer body element
 * @param {HTMLElement} selectedThumb - The selected thumbnail element
 * @param {Object} cachedElements - Cached DOM elements for performance
 * @param {Object} footerElements - Optional cached footer elements
 * @returns {boolean} Success status
 */
function updatePaperSelectionUI(drawerBody, selectedThumb, cachedElements, footerElements = null) {
  try {
    if (!drawerBody || !selectedThumb) {
      console.warn('Missing required elements for paper selection update');
      return false;
    }

    // Update selected state on thumbnails
    const carousel = drawerBody.querySelector('.paper-selection-carousel');
    if (carousel) {
      carousel.querySelectorAll('.paper-selection-thumb').forEach((thumb) => {
        thumb.classList.remove('selected');
      });
      selectedThumb.classList.add('selected');
    }

    // Store the currently selected paper name
    const { paperName } = selectedThumb.dataset;
    if (paperName) {
      drawerBody.dataset.selectedPaperName = paperName;
    }

    // Update hero image (use larger heroImage, not thumbnail)
    if (cachedElements?.heroImage) {
      const heroImageSrc = selectedThumb.dataset.heroImage;
      const fallbackSrc = selectedThumb.querySelector('img')?.src;
      cachedElements.heroImage.src = heroImageSrc || fallbackSrc || '';
      cachedElements.heroImage.alt = selectedThumb.dataset.paperTitle || paperName || '';
    }

    // Update paper name (display title)
    if (cachedElements?.paperName) {
      cachedElements.paperName.textContent = selectedThumb.dataset.paperTitle || '';
    }

    // Update type name (display title)
    if (cachedElements?.paperTypeLabel) {
      const typeName = cachedElements.paperTypeLabel.querySelector('.paper-selection-type-name');
      if (typeName) {
        typeName.textContent = selectedThumb.dataset.paperTitle || '';
      }
    }

    // Update description
    if (cachedElements?.description) {
      cachedElements.description.innerHTML = selectedThumb.dataset.description || '';
    }

    // Update specs
    if (cachedElements?.specsRow) {
      try {
        const specs = JSON.parse(selectedThumb.dataset.specs || '[]');
        cachedElements.specsRow.innerHTML = '';
        specs.forEach((spec) => {
          const specPill = createTag('div', { class: 'paper-selection-spec-pill' });
          specPill.append(getIconElementDeprecated('checkmark'), spec);
          cachedElements.specsRow.append(specPill);
        });
      } catch (error) {
        console.error('Failed to parse specs JSON:', error);
      }
    }

    // Update recommended badge
    if (cachedElements?.titleRow) {
      const existingBadge = cachedElements.titleRow.querySelector('.paper-selection-recommended');
      const isRecommended = selectedThumb.dataset.recommended === 'true';
      if (isRecommended && !existingBadge) {
        const badge = createTag('span', { class: 'paper-selection-recommended' }, 'Recommended');
        cachedElements.titleRow.append(badge);
      } else if (!isRecommended && existingBadge) {
        existingBadge.remove();
      }
    }

    // Update footer info (use thumbnail for footer)
    if (footerElements) {
      const thumbImg = selectedThumb.querySelector('img');
      const thumbPrice = selectedThumb.querySelector('.paper-selection-thumb-price');
      if (footerElements.image && thumbImg) {
        footerElements.image.src = thumbImg.src;
      }
      if (footerElements.name) {
        footerElements.name.textContent = selectedThumb.dataset.paperTitle || '';
      }
      if (footerElements.price && thumbPrice) {
        footerElements.price.textContent = thumbPrice.textContent;
      }
    }

    // Scroll selected thumbnail into view
    selectedThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    return true;
  } catch (error) {
    console.error('Failed to update paper selection UI:', error);
    return false;
  }
}

// TODO: use api
const mockData = [
  {
    key: 'signature-matte',
    name: 'Signature Matte',
    recommended: true,
    description: `Lorem ipsum dolor sit amet consectetur. Nulla ultricies aliquet ut rutrum nulla sed orci. Et feugiat est euismod nibh mi neque est posuere. Facilisi quis ac lectus ornare cursus commodo. Lacus est lacus pellentesque risus in odio tristique interdum. Ut consequat risus faucibus odio luctus ac. Porta quisque mi tortor nunc convallis. At in vel tristique in morbi auctor. Egestas urna ac at bibendum adipiscing non. Eget turpis metus risus convallis aenean ipsum. A nibh gravida arcu odio. Varius lobortis imperdiet lacus quam ornare. Volutpat dictumst lectus hac maecenas pretium gravida. Ultrices tristique sit semper vestibulum.
Diam consectetur volutpat lobortis non iaculis blandit. In quis suscipit maecenas mattis eros. Id dolor urna morbi nulla varius tortor dui pulvinar malesuada. Id et laoreet enim sed. Semper cursus aliquam nisl in elementum. Eu aliquam volutpat amet amet convallis varius a faucibus.
Rutrum in dui sapien adipiscing ullamcorper volutpat viverra ut pretium. Quam aenean venenatis quam tincidunt. Nec congue ultricies volutpat tincidunt auctor. Placerat at lectus gravida massa scelerisque. Purus venenatis sed commodo platea amet vitae porttitor tortor metus. Placerat nunc sed in ut lacus amet leo magnis volutpat. Pellentesque nec in ornare dis urna magnis suscipit. Pulvinar tempus iaculis mattis dolor placerat bibendum. Ac urna tincidunt ut tincidunt pharetra. Lorem eu pellentesque ut tellus. Eget quis justo sagittis sed laoreet pulvinar vitae suscipit. Amet nulla neque lorem in faucibus potenti elementum maecenas. Duis eget libero sollicitudin purus nam. Tincidunt vitae pellentesque imperdiet hac vestibulum dui sit id.
Risus risus neque sollicitudin sapien. Neque egestas in quam a. Nec mauris consectetur ut nisi eget lorem massa vitae. Ultrices diam vel felis arcu diam. Sed quam vel vulputate in sem.`,
    labels: ['17.5pt thickness', '120lb weight', '324 GSM'],
    price: '+US$0.00',
    imgSrc: './media_17cf7f6474fe12727dc188525b547cbce53115d4f.png?width=750&format=png&optimize=medium',
  },
];

function createDrawerHead(drawerLabel, drawer, curtain) {
  const drawerHead = createTag('div', { class: 'drawer-head' });
  const closeButton = createTag('button', { 'aria-label': 'close' }, getIconElementDeprecated('close-black'));

  closeButton.addEventListener('click', () => {
    drawer.classList.add('hidden');
    curtain.classList.add('hidden');
    document.body.classList.remove('disable-scroll');
  });

  drawerHead.append(createTag('div', { class: 'drawer-head-label' }, drawerLabel), closeButton);
  return drawerHead;
}

function createDrawerBody({ name, recommended, labels, imgSrc, description }) {
  const drawerBody = createTag('div', { class: 'drawer-body' });
  drawerBody.append(createTag('img', { class: 'hero', src: imgSrc, alt: name }));
  const titleRow = createTag('div', { class: 'title-row' });
  const recommendTag = createTag('span', { class: ['recommended', recommended ? null : 'hidden'].filter(Boolean).join() }, 'Recommended'); // TODO: localize
  titleRow.append(createTag('span', { class: 'name' }, name), recommendTag);
  drawerBody.append(titleRow);
  const labelRow = createTag('div', { class: 'label-row' });
  labels.forEach((label) => {
    const pill = createTag('div', { class: 'label-pill' });
    pill.append(getIconElementDeprecated('checkmark'), label);
    labelRow.append(pill);
  });
  drawerBody.append(labelRow);
  drawerBody.append(createTag('p', { class: 'description' }, description));
  // const onChange = () => {};
  return drawerBody;
}

function createDrawerFoot({ imgSrc, name, price }) {
  const drawerFoot = createTag('div', { class: 'drawer-foot' });
  const selectButton = createTag('button', { class: 'select' }, 'Select'); // TODO: localize
  const infoContainer = createTag('div', { class: 'info-container' });
  const infoText = createTag('div', { class: 'info-text' });
  infoText.append(createTag('div', { class: 'info-name' }, name));
  infoText.append(createTag('div', { class: 'info-price' }, price));
  infoContainer.append(createTag('img', { src: imgSrc, alt: name }), infoText);
  drawerFoot.append(infoContainer, selectButton);
  return drawerFoot;
}

function createDropletIcon(iconName) {
  const droplet = createTag('span', {
    'aria-hidden': 'true',
    class: 'comparison-droplet',
  });
  droplet.appendChild(getIconElementDeprecated(iconName));
  return droplet;
}

function createColorProcess(colorCount, iconNames) {
  const processDiv = createTag('div', { class: 'comparison-color-process' });
  const dropletsSpan = createTag('span', { class: 'comparison-droplets' });
  iconNames.forEach((iconName) => {
    dropletsSpan.append(createDropletIcon(iconName));
  });
  processDiv.append(dropletsSpan);
  processDiv.append(`\u00A0${colorCount} color process`);
  return processDiv;
}

function createDrawerBodyComparison(data) {
  // Static/read-only comparison drawer
  const drawerBody = createTag('div', { 
    class: 'drawer-body drawer-body--comparison',
  });

  // Left column (Classic - 4 Color)
  const leftColumn = createTag('div', { 
    class: 'comparison-column', 
    'data-option': 'left',
  });
  const leftImage = createTag('img', { class: 'comparison-image', src: data.left.imageUrl, alt: data.left.title });
  const leftContent = createTag('div', { class: 'comparison-content' });
  leftContent.innerHTML = `
    <h3 class="comparison-heading">${data.left.title}</h3>
    <div class="comparison-price">+US$0.00 per shirt</div>
    <div class="comparison-description">${data.left.description}</div>
  `;
  const leftColorProcess = createColorProcess('4', [
    'droplet-cyan',
    'droplet-magenta',
    'droplet-yellow',
    'droplet-black',
  ]);
  leftColumn.append(leftImage, leftContent, leftColorProcess);

  // Right column (Vivid - 5 Color)
  const rightColumn = createTag('div', { class: 'comparison-column', 'data-option': 'right' });
  const rightImage = createTag('img', { class: 'comparison-image', src: data.right.imageUrl, alt: data.right.title });
  const rightContent = createTag('div', { class: 'comparison-content' });
  rightContent.innerHTML = `
    <h3 class="comparison-heading">${data.right.title}</h3>
    <div class="comparison-price">+US$0.00 per shirt</div>
    <div class="comparison-description">${data.right.description}</div>
  `;
  const rightColorProcess = createColorProcess('5', [
    'droplet-cyan',
    'droplet-magenta',
    'droplet-yellow',
    'droplet-black',
    'droplet-white',
  ]);
  rightColumn.append(rightImage, rightContent, rightColorProcess);

  drawerBody.append(leftColumn, rightColumn);
  return drawerBody;
}

function createDrawerBodySizeChart(data, currentUnit = 'IN') {
  const drawerBody = createTag('div', { class: 'drawer-body drawer-body--size-chart' });

  const productName = createTag('h2', { class: 'size-chart-product-name' }, data.productName);
  drawerBody.append(productName);

  const tableContainer = createTag('div', { class: 'size-chart-table-container' });
  const tablesGrid = createTag('div', { class: 'size-chart-tables' });

  // Body measurements table
  const bodySection = createTag('div', { class: 'size-chart-table-section' });
  const bodyTable = createTag('table', { class: 'size-chart-table' });
  bodyTable.innerHTML = `
    <thead>
      <tr>
        <th class="size-chart-table-header">Body (${currentUnit})</th>
        <th>Chest</th>
        <th>Waist</th>
      </tr>
    </thead>
    <tbody>
      ${data.sizes[currentUnit].map((size) => `
        <tr>
          <td>${size.name}</td>
          <td>${size.body.chest}</td>
          <td>${size.body.waist}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  bodySection.append(bodyTable);

  // Garment measurements table
  const garmentSection = createTag('div', { class: 'size-chart-table-section' });
  const garmentTable = createTag('table', { class: 'size-chart-table' });
  garmentTable.innerHTML = `
    <thead>
      <tr>
        <th class="size-chart-table-header">Garment (${currentUnit})</th>
        <th>Chest</th>
        <th>Waist</th>
      </tr>
    </thead>
    <tbody>
      ${data.sizes[currentUnit].map((size) => `
        <tr>
          <td>${size.name}</td>
          <td>${size.garment.width}</td>
          <td>${size.garment.length}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  garmentSection.append(garmentTable);

  tablesGrid.append(bodySection, garmentSection);
  tableContainer.append(tablesGrid);
  drawerBody.append(tableContainer);

  // Unit toggle
  const unitToggle = createTag('div', { class: 'size-chart-unit-toggle' });
  const inButton = createTag('button', {
    class: `size-chart-unit-button ${currentUnit === 'IN' ? 'active' : ''}`,
    type: 'button',
  }, 'IN');
  const cmButton = createTag('button', {
    class: `size-chart-unit-button ${currentUnit === 'CM' ? 'active' : ''}`,
    type: 'button',
  }, 'CM');

  // Unit toggle handler - recreate drawer body with new unit
  const handleUnitToggle = (newUnit) => {
    const newDrawerBody = createDrawerBodySizeChart(data, newUnit);
    drawerBody.replaceWith(newDrawerBody);
  };

  inButton.addEventListener('click', () => handleUnitToggle('IN'));
  cmButton.addEventListener('click', () => handleUnitToggle('CM'));
  unitToggle.append(inButton, cmButton);
  drawerBody.append(unitToggle);

  // Instructions
  const instructions = createTag('div', { class: 'size-chart-instructions' });
  const bodyInstructions = createTag('div', { class: 'size-chart-instruction-section' });
  bodyInstructions.innerHTML = `
    <h3>Body</h3>
    <p class="size-chart-instruction-text">Measure under your arms around the fullest part of your chest</p>
    <p class="size-chart-instruction-text">Measure around your natural waistline at the narrowest point</p>
  `;
  const garmentInstructions = createTag('div', { class: 'size-chart-instruction-section' });
  garmentInstructions.innerHTML = `
    <h3>Garment</h3>
    <p class="size-chart-instruction-text">Measure garment from arm hole to arm hole</p>
    <p class="size-chart-instruction-text">Measure garment from the seam at the neck to the bottom of the garment</p>
  `;

  // Fit
  const fitSection = createTag('div', { class: 'size-chart-instruction-section' });
  fitSection.innerHTML = `
    <h3>Fit</h3>
    <p class="size-chart-instruction-text">${data.fit}</p>
  `;

  instructions.append(bodyInstructions, garmentInstructions, fitSection);
  drawerBody.append(instructions);

  return drawerBody;
}

function createDrawerBodyPaperSelection(data) {
  const drawerBody = createTag('div', { class: 'drawer-body drawer-body--paper-selection' });

  // Store currently selected paper name on the drawerBody for later access
  drawerBody.dataset.selectedPaperName = data.selectedPaper.name;

  // Hero image
  const heroImage = createTag('img', {
    class: 'paper-selection-hero',
    src: data.selectedPaper.heroImage,
    alt: data.selectedPaper.name,
  });
  drawerBody.append(heroImage);

  // Paper name + recommended badge
  const titleRow = createTag('div', { class: 'paper-selection-title-row' });
  const paperName = createTag('h3', { class: 'paper-selection-name' }, data.selectedPaper.name);
  titleRow.append(paperName);
  if (data.selectedPaper.recommended) {
    const recommendedBadge = createTag('span', { class: 'paper-selection-recommended' }, 'Recommended');
    titleRow.append(recommendedBadge);
  }
  drawerBody.append(titleRow);

  // Specs (thickness, weight, GSM) with checkmarks
  if (data.selectedPaper.specs && data.selectedPaper.specs.length > 0) {
    const specsRow = createTag('div', { class: 'paper-selection-specs' });
    data.selectedPaper.specs.forEach((spec) => {
      const specPill = createTag('div', { class: 'paper-selection-spec-pill' });
      specPill.append(getIconElementDeprecated('checkmark'), spec);
      specsRow.append(specPill);
    });
    drawerBody.append(specsRow);
  }

  // Paper type label
  const paperTypeLabel = createTag('div', { class: 'paper-selection-type-label' });
  paperTypeLabel.innerHTML = `Paper type: <span class="paper-selection-type-name">${data.selectedPaper.typeName}</span>`;
  drawerBody.append(paperTypeLabel);

  // Paper thumbnails carousel with simple scroll arrows
  const carouselContainer = createTag('div', { class: 'paper-selection-carousel-container' });
  
  // Left arrow
  const leftArrow = createTag('button', {
    class: 'paper-carousel-arrow paper-carousel-arrow-left',
    type: 'button',
    'aria-label': 'Scroll left',
  });
  leftArrow.innerHTML = '&lt;';
  
  // Scrollable wrapper
  const carouselWrapper = createTag('div', { class: 'paper-selection-carousel' });
  data.papers.forEach((paper, index) => {
    const isSelected = index === 0; // First paper is selected by default
    const paperThumb = createTag('button', {
      class: isSelected ? 'paper-selection-thumb selected' : 'paper-selection-thumb',
      type: 'button',
      'data-paper-name': paper.name,
      'data-paper-title': paper.title,
      'data-hero-image': paper.heroImage || paper.thumbnail,
      'data-description': paper.description || '',
      'data-specs': JSON.stringify(paper.specs || []),
      'data-recommended': paper.recommended || false,
    });
    const thumbImage = createTag('img', {
      class: 'paper-selection-thumb-image',
      src: paper.thumbnail,
      alt: paper.title || paper.name,
    });
    const thumbPrice = createTag('span', { class: 'paper-selection-thumb-price' }, paper.priceAdjustment);
    paperThumb.append(thumbImage, thumbPrice);
    carouselWrapper.append(paperThumb);
  });
  
  // Right arrow
  const rightArrow = createTag('button', {
    class: 'paper-carousel-arrow paper-carousel-arrow-right',
    type: 'button',
    'aria-label': 'Scroll right',
  });
  rightArrow.innerHTML = '&gt;';
  
  // Add scroll handlers
  leftArrow.addEventListener('click', () => {
    carouselWrapper.scrollBy({ left: -200, behavior: 'smooth' });
  });
  
  rightArrow.addEventListener('click', () => {
    carouselWrapper.scrollBy({ left: 200, behavior: 'smooth' });
  });
  
  carouselContainer.append(leftArrow, carouselWrapper, rightArrow);
  drawerBody.append(carouselContainer);

  // Description
  const description = createTag('div', { class: 'paper-selection-description' });
  description.innerHTML = data.selectedPaper.description;
  drawerBody.append(description);

  // Cache DOM elements for performance (after all elements are in DOM)
  const cachedElements = {
    heroImage,
    paperName,
    paperTypeLabel,
    description,
    specsRow: drawerBody.querySelector('.paper-selection-specs'),
    titleRow: drawerBody.querySelector('.paper-selection-title-row'),
  };

  // Use event delegation to avoid memory leaks
  carouselWrapper.addEventListener('click', (e) => {
    const clickedThumb = e.target.closest('.paper-selection-thumb');
    if (!clickedThumb) return;

    // Use shared update function with cached footer elements
    updatePaperSelectionUI(
      drawerBody,
      clickedThumb,
      cachedElements,
      carouselWrapper.footerElements,
    );
  });

  return drawerBody;
}

export default async function createDrawer({
  drawerLabel = 'Select paper type',
  data = mockData,
  selectedIndex = 0,
  template = 'default',
  productId = null,
}) {
  ({ createTag, loadStyle, getConfig } = await import(`${getLibs()}/utils/utils.js`));
  // temporarily separating css to avoid code conflicts
  const styleLoaded = new Promise((resolve) => {
    loadStyle(`${getConfig().codeRoot}/blocks/print-product-detail/createComponents/drawer.css`, () => {
      resolve();
    });
  });
  const curtain = createTag('div', { class: 'pdp-curtain hidden' });
  curtain.setAttribute('daa-ll', 'pdp-x-drawer-curtainClose');
  curtain.setAttribute('data-drawer-type', template);
  const drawer = createTag('div', { class: 'drawer hidden' });
  drawer.setAttribute('data-drawer-type', template);

  // Curtain closes the drawer when clicked
  curtain.addEventListener('click', () => {
    drawer.classList.add('hidden');
    curtain.classList.add('hidden');
    document.body.classList.remove('disable-scroll');
  });

  if (template === 'comparison') {
    // Static/read-only comparison drawer for informational purposes only
    const drawerBody = createDrawerBodyComparison(data);
    drawer.append(
      createDrawerHead(drawerLabel, drawer, curtain),
      drawerBody,
    );
  } else if (template === 'size-chart') {
    drawer.append(
      createDrawerHead(drawerLabel, drawer, curtain),
      createDrawerBodySizeChart(data),
    );
  } else if (template === 'paper-selection') {
    const drawerBody = createDrawerBodyPaperSelection(data);
    const drawerFoot = createDrawerFoot(data.selectedPaper);
    drawer.append(
      createDrawerHead(drawerLabel, drawer, curtain),
      drawerBody,
      drawerFoot,
    );

    // Cache footer elements for performance
    const footerElements = {
      image: drawerFoot.querySelector('img'),
      name: drawerFoot.querySelector('.info-name'),
      price: drawerFoot.querySelector('.info-price'),
    };

    // Update carousel click handler to use cached footer elements
    const carousel = drawerBody.querySelector('.paper-selection-carousel');
    if (carousel) {
      carousel.footerElements = footerElements;
    }

    // Add Select button handler for paper selection
    const selectButton = drawerFoot.querySelector('.select');
    if (selectButton) {
      selectButton.addEventListener('click', async () => {
        const { selectedPaperName } = drawerBody.dataset;

        // Update the hidden select input in the form
        const mediaSelect = document.getElementById('media');

        if (mediaSelect && selectedPaperName) {
          // Update the select value FIRST
          mediaSelect.value = selectedPaperName;

          // Also update the visual mini pill selector
          const miniPillContainer = mediaSelect.closest('.pdpx-pill-selector-container');

          if (miniPillContainer) {
            // Update selected thumbnail
            const allThumbs = miniPillContainer.querySelectorAll('.pdpx-mini-pill-image-container');
            allThumbs.forEach((thumb) => {
              if (thumb.dataset.name === selectedPaperName) {
                thumb.classList.add('selected');
                // Update the label text
                const labelName = miniPillContainer.querySelector('.pdpx-pill-selector-label-name');
                if (labelName) {
                  labelName.textContent = thumb.dataset.title;
                }
              } else {
                thumb.classList.remove('selected');
              }
            });
          }

          // Trigger change event to update all dynamic elements and WAIT for it to complete
          const globalContainer = document.querySelector('.pdpx-global-container');
          const productId = globalContainer?.id || globalContainer?.dataset?.productId;

          if (productId) {
            // WAIT for the update to complete before closing drawer
            await updateAllDynamicElements(productId);
          }
        }
        
        // Close the drawer
        drawer.classList.add('hidden');
        curtain.classList.add('hidden');
        document.body.classList.remove('disable-scroll');
      });
    }
  } else {
    drawer.append(
      createDrawerHead(drawerLabel, drawer, curtain),
      createDrawerBody(data[selectedIndex]),
      createDrawerFoot(data[selectedIndex]),
    );
  }

  await styleLoaded;
  return { curtain, drawer };
}

// Export the shared update function for use in other components
export { updatePaperSelectionUI };
