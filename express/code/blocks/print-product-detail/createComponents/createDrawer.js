import { getLibs, getIconElementDeprecated } from '../../../scripts/utils.js';

let createTag;
let loadStyle;
let getConfig;

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
  const drawerBody = createTag('div', { class: 'drawer-body drawer-body--comparison' });

  // Left column (Classic - 4 Color)
  const leftColumn = createTag('div', { class: 'comparison-column' });
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
  const rightColumn = createTag('div', { class: 'comparison-column' });
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

export default async function createDrawer({
  drawerLabel = 'Select paper type',
  data = mockData,
  selectedIndex = 0,
  template = 'default',
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
  const drawer = createTag('div', { class: 'drawer hidden' });

  // Curtain closes the drawer when clicked
  curtain.addEventListener('click', () => {
    drawer.classList.add('hidden');
    curtain.classList.add('hidden');
    document.body.classList.remove('disable-scroll');
  });

  if (template === 'comparison') {
    drawer.append(
      createDrawerHead(drawerLabel, drawer, curtain),
      createDrawerBodyComparison(data),
    );
  } else if (template === 'size-chart') {
    drawer.append(
      createDrawerHead(drawerLabel, drawer, curtain),
      createDrawerBodySizeChart(data),
    );
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
