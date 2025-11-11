import { html } from '../../vendor/htm-preact.js';
import { useStore } from '../store-context.js';

function updateImageUrl(url, maxDim = 54) {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('max_dim', String(maxDim));
    return urlObj.toString();
  } catch {
    return url;
  }
}

function flattenOptionGroups(selector) {
  if (!selector.optionGroups || !Array.isArray(selector.optionGroups)) {
    return [];
  }
  return selector.optionGroups.flatMap((group) =>
    (group.options || []).map((option) => ({ ...option, groupTitle: group.title }))
  );
}

export function ThumbnailSelector({ attribute, onRequestDrawer }) {
  const { actions } = useStore();
  const { selector, selectedOptionValue, title, helpLink } = attribute;
  const allOptions = flattenOptionGroups(selector);
  const selectedOption = allOptions.find((option) => option.value === selectedOptionValue) || allOptions[0];
  const selectedOptionTitle = selectedOption?.title || '';

  if (!allOptions.length) {
    return null;
  }

  const isMiniPill = attribute.name === 'color' || attribute.name === 'media';
  const hasDrawerLink =
    typeof onRequestDrawer === 'function' && helpLink?.type === 'dialog' && helpLink.dialogType;

  const handleOptionClick = (option) => {
    if (option.value !== selectedOptionValue) {
      actions.selectOption(attribute.name, option.value);
    }
  };

  const triggerDrawer = () => {
    if (hasDrawerLink) {
      onRequestDrawer({ type: helpLink.dialogType, payload: { attribute, helpLink } });
    }
  };

  if (isMiniPill) {
    return html`
      <div class="pdpx-pill-selector-container">
        <div class="pdpx-pill-selector-label-container">
          <div class="pdpx-pill-selector-label-name-container">
            <span class="pdpx-pill-selector-label-label">${title}:</span>
            <span class="pdpx-pill-selector-label-name">${selectedOptionTitle}</span>
          </div>
          ${hasDrawerLink && html`
            <button
              class="pdpx-pill-selector-label-compare-link"
              type="button"
              onClick=${triggerDrawer}
            >
              ${helpLink.label}
            </button>
          `}
        </div>
        <div class="pdpx-mini-pill-selector-options-container">
          <select class="pdpx-hidden-select-input" name="${attribute.name}" id="${attribute.name}">
            ${allOptions.map((option) => html`
              <option key="${option.value}" value="${option.value}" selected="${option.value === selectedOptionValue}">
                ${option.title}
              </option>
            `)}
          </select>
          ${allOptions.map((option) => {
            const thumbnailUrl = updateImageUrl(option.imageUrl, 48);
            const isSelected = option.value === selectedOptionValue;
            return html`
              <div key="${option.value}" class="pdpx-mini-pill-container">
                <button
                  class="pdpx-mini-pill-image-container ${isSelected ? 'selected' : ''}"
                  type="button"
                  data-name="${option.value}"
                  data-title="${option.title}"
                  onClick=${() => handleOptionClick(option)}
                >
                  <img class="pdpx-mini-pill-image" src="${thumbnailUrl}" alt="${option.title}" />
                </button>
                <div class="pdpx-mini-pill-text-container">
                  ${option.priceDelta && html`<span class="pdpx-mini-pill-price">${option.priceDelta}</span>`}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  return html`
    <div class="pdpx-pill-selector-container">
      <span class="pdpx-pill-selector-label">${title}</span>
      <div class="pdpx-pill-selector-options-container">
        <select class="pdpx-hidden-select-input" name="${attribute.name}" id="${attribute.name}">
          ${allOptions.map((option) => html`
            <option key="${option.value}" value="${option.value}" selected="${option.value === selectedOptionValue}">
              ${option.title}
            </option>
          `)}
        </select>
        ${selector.optionGroups?.map((group) => html`
          <div key="${group.title || 'group'}">
            ${group.title && html`<div class="pdpx-option-group-title">${group.title}</div>`}
            ${(group.options || []).map((option) => {
              const thumbnailUrl = updateImageUrl(option.imageUrl);
              const isSelected = option.value === selectedOptionValue;
              return html`
                <button
                  key="${option.value}"
                  class="pdpx-pill-container ${isSelected ? 'selected' : ''}"
                  type="button"
                  data-name="${option.value}"
                  onClick=${() => handleOptionClick(option)}
                >
                  <div class="pdpx-pill-image-container">
                    <img class="pdpx-pill-image" src="${thumbnailUrl}" alt="${option.title}" />
                  </div>
                  <div class="pdpx-pill-text-container">
                    <span class="pdpx-pill-text-name">${option.title}</span>
                    ${option.priceDelta && html`
                      <span class="pdpx-pill-text-price">${option.priceDelta}</span>
                    `}
                  </div>
                </button>
              `;
            })}
          </div>
        `)}
      </div>
      ${selector.preview && html`
        <div class="pdpx-preview-container">
          <img src="${updateImageUrl(selector.preview.imageUrl, 192)}" alt="${selector.preview.optionTitle}" />
          <div dangerouslySetInnerHTML=${{ __html: selector.preview.descriptionHTML }} />
        </div>
      `}
    </div>
  `;
}
