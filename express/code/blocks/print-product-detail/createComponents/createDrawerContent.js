import { getLibs } from '../../../scripts/utils.js';

let createTag;

export default async function createDrawerContentSizeChart() {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const sizeChartContainer = createTag('div', { class: 'pdpx-size-chart-container' });
  const sizeChartTitle = createTag('h2', { class: 'pdpx-size-chart-title' }, 'Size Chart');
  sizeChartContainer.appendChild(sizeChartTitle);
  return sizeChartContainer;
}

export async function createDrawerContentPrintingProcess() {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const printingProcessContainer = createTag('div', { class: 'pdpx-printing-process-container' });
  const printingProcessTitle = createTag('h2', { class: 'pdpx-printing-process-title' }, 'Printing Process');
  printingProcessContainer.appendChild(printingProcessTitle);
  return printingProcessContainer;
}
