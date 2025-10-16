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

function createDrawerHead(drawerLabel, toggle) {
  const drawerHead = createTag('div', { class: 'drawer-head' });
  const closeButton = createTag('button', { 'aria-label': 'close' }, getIconElementDeprecated('close-black')); // TODO: analytics
  closeButton.addEventListener('click', toggle);
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

export default async function createDrawer({
  drawerLabel = 'Select paper type',
  data = mockData,
  selectedIndex = 0,
}) {
  ({ createTag, loadStyle, getConfig } = await import(`${getLibs()}/utils/utils.js`));
  // temporarily separating css to avoid code conflicts
  const styleLoaded = new Promise((resolve) => {
    loadStyle(`${getConfig().codeRoot}/blocks/pdp-x-test-2/createComponents/drawer.css`, () => {
      resolve();
    });
  });
  const curtain = createTag('div', { class: 'pdp-curtain hidden' });
  curtain.setAttribute('daa-ll', 'pdp-x-drawer-curtainClose');
  const drawer = createTag('div', { class: 'drawer hidden' });
  const toggle = () => {
    document.body.classList.toggle('disable-scroll');
    curtain.classList.toggle('hidden');
    drawer.classList.toggle('hidden');
    // drawer.setAttribute('aria-hidden', drawer.classList.contains('hidden'));
  };
  curtain.addEventListener('click', toggle);
  drawer.append(
    createDrawerHead(drawerLabel, toggle),
    createDrawerBody(data[selectedIndex]),
    createDrawerFoot(data[selectedIndex]),
  );
  await styleLoaded;
  return { curtain, drawer, toggle };
}
