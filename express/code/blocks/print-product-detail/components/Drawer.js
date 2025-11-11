import {
  html,
  useEffect,
  useState,
} from '../vendor/htm-preact.js';
import { useDrawer } from './drawer-context.js';
import { useStore } from './store-context.js';

function SizeChartTable({ sizeChart }) {
  if (!sizeChart?.sizeChart) {
    return html`<p class="pdpx-size-chart-empty">Size chart information is unavailable.</p>`;
  }

  const { measurementTypes = [], attributeValues = [] } = sizeChart.sizeChart;

  return html`
    <table class="pdpx-size-chart-table">
      <thead>
        <tr>
          <th class="size-chart-table-header">${sizeChart.title || 'Size'}</th>
          ${measurementTypes.map((type) => html`<th key="${type.key}">${type.label}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${attributeValues.map((row) => html`
          <tr key="${row.attributeValueId}">
            <td>${row.attributeValueLabel}</td>
            ${measurementTypes.map((type) => {
              const measurement = row.measurements?.find((entry) => entry.key === type.key);
              return html`<td key="${type.key}">${measurement?.displayValue || '—'}</td>`;
            })}
          </tr>
        `)}
      </tbody>
    </table>
  `;
}

function SizeChartContent({ onClose, payload }) {
  const { actions } = useStore();
  const [chart, setChart] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    actions.fetchSizeChart()
      .then((data) => {
        if (active) {
          setChart(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
        }
        window.reportError?.(err);
      });
    return () => {
      active = false;
    };
  }, [actions]);

  if (error) {
    return html`<div class="pdpx-size-chart-error">Unable to load size chart. Please try again later.</div>`;
  }

  if (!chart) {
    return html`<div class="pdpx-size-chart-loading" data-skeleton="true" style="height: 200px;"></div>`;
  }

  return html`
    <div class="pdpx-size-chart-container drawer-body--size-chart">
      ${chart.imageRealViewUrl && html`
        <div class="pdpx-drawer-hero-image-container">
          <img class="pdpx-drawer-hero-image" src="${chart.imageRealViewUrl}" alt="Size chart preview" />
        </div>
      `}
      <${SizeChartTable} sizeChart=${chart} />
      ${chart.modelInfo?.length && html`
        <div class="pdpx-size-chart-model-info">
          ${chart.modelInfo.map((info, index) => html`
            <div key="model-${index}" class="pdpx-size-chart-model">
              <h3>Model ${index + 1}</h3>
              <ul>
                ${(info.bodyMeasurements || []).map((measurement) => html`
                  <li key="body-${measurement.key}">${measurement.label}: ${measurement.displayValue}</li>
                `)}
              </ul>
            </div>
          `)}
        </div>
      `}
      ${chart.fitStyle && html`<p class="pdpx-size-chart-fit-style">Fit: ${chart.fitStyle}</p>`}
      <button class="pdpx-drawer-foot-select-button" type="button" onClick=${onClose}>Close</button>
    </div>
  `;
}

export function Drawer() {
  const { state, closeDrawer } = useDrawer();

  return html`
    <div>
      <div
        class="pdp-curtain ${state.open ? '' : 'hidden'}"
        onClick=${closeDrawer}
        role="presentation"
      ></div>
      <aside class="drawer ${state.open ? '' : 'hidden'}" id="pdp-x-drawer">
        <div class="drawer-head">
          <div class="drawer-head-label">
            ${state.type === 'sizeChart' ? (state.payload?.helpLink?.label || 'Size Chart') : ''}
          </div>
          <button type="button" aria-label="Close" onClick=${closeDrawer}>×</button>
        </div>
        <div class="drawer-body">
          ${state.type === 'sizeChart' && html`<${SizeChartContent} onClose=${closeDrawer} payload=${state.payload} />`}
          ${state.type !== 'sizeChart' && html`
            <div class="pdpx-drawer-placeholder">Additional information coming soon.</div>
          `}
        </div>
      </aside>
    </div>
  `;
}

