import { h } from 'https://esm.sh/preact@10';
import { useState } from 'https://esm.sh/preact@10/hooks';
import htm from 'https://esm.sh/htm@3';
import { toggleDrawer } from '../../utilities/event-handlers.js';

const html = htm.bind(h);

/**
 * Update max_dim parameter in URL to desired resolution
 */
function updateImageUrl(url, maxDim = 54) {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('max_dim', String(maxDim));
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Thumbnail selector component for attributes (pill and mini-pill styles)
 * @param {Object} props
 * @param {Object} props.attribute - Attribute data from SDK state
 * @param {Object} props.store - Zazzle PDP store instance
 */
export function ThumbnailSelector({ attribute, store }) {
  const { selector, selectedOptionValue, title, helpLink } = attribute;
  const [selectedOptionTitle, setSelectedOptionTitle] = useState(
    selector.options?.find(opt => opt.value === selectedOptionValue)?.title || ''
  );
  
  const handleOptionClick = (option) => {
    if (store && option.value !== selectedOptionValue) {
      store.selectOption(attribute.name, option.value);
      setSelectedOptionTitle(option.title);
    }
  };
  
  // Check if this should be a mini-pill (small thumbnails) based on option count or attribute name
  // Mini pills are typically for colors, pills are for styles/sizes
  const isMiniPill = attribute.name === 'color' || attribute.name === 'media';
  const hasCompareLink = helpLink?.type === 'dialog' && helpLink.dialogType === 'sizeChart';
  
  // Get all options from all groups (flatten)
  const allOptions = [];
  if (selector.optionGroups && Array.isArray(selector.optionGroups)) {
    selector.optionGroups.forEach(group => {
      if (group.options && Array.isArray(group.options)) {
        group.options.forEach(opt => {
          allOptions.push({ ...opt, groupTitle: group.title });
        });
      }
    });
  }
  
  if (allOptions.length === 0) {
    return null; // No options available
  }
  
  if (isMiniPill) {
    // Mini pill selector (small thumbnails, like colors)
    return html`
      <div class="pdpx-pill-selector-container">
        <div class="pdpx-pill-selector-label-container">
          <div class="pdpx-pill-selector-label-name-container">
            <span class="pdpx-pill-selector-label-label">${title}:</span>
            <span class="pdpx-pill-selector-label-name">${selectedOptionTitle || allOptions[0]?.title}</span>
          </div>
          ${hasCompareLink && html`
            <button 
              class="pdpx-pill-selector-label-compare-link" 
              type="button"
                  onClick=${toggleDrawer}
            >
              ${helpLink.label}
            </button>
          `}
        </div>
        <div class="pdpx-mini-pill-selector-options-container">
          <select class="pdpx-hidden-select-input" name="${attribute.name}" id="${attribute.name}">
            ${allOptions.map(opt => html`
              <option key="${opt.value}" value="${opt.value}" selected="${opt.value === selectedOptionValue}">
                ${opt.title}
              </option>
            `)}
          </select>
          ${allOptions.map(opt => {
            const thumbnailUrl = updateImageUrl(opt.imageUrl, 48);
            const isSelected = opt.value === selectedOptionValue;
            
            return html`
              <div key="${opt.value}" class="pdpx-mini-pill-container">
                <button 
                  class="pdpx-mini-pill-image-container ${isSelected ? 'selected' : ''}"
                  type="button"
                  data-name="${opt.value}"
                  data-title="${opt.title}"
                  onClick=${() => handleOptionClick(opt)}
                >
                  <img class="pdpx-mini-pill-image" src="${thumbnailUrl}" alt="${opt.title}" />
                </button>
                <div class="pdpx-mini-pill-text-container">
                  ${opt.priceDelta && html`
                    <span class="pdpx-mini-pill-price">${opt.priceDelta}</span>
                  `}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
  
  // Regular pill selector (larger thumbnails with text, like styles/sizes)
  return html`
    <div class="pdpx-pill-selector-container">
      <span class="pdpx-pill-selector-label">${title}</span>
      <div class="pdpx-pill-selector-options-container">
        <select class="pdpx-hidden-select-input" name="${attribute.name}" id="${attribute.name}">
          ${allOptions.map(opt => html`
            <option key="${opt.value}" value="${opt.value}" selected="${opt.value === selectedOptionValue}">
              ${opt.title}
            </option>
          `)}
        </select>
        ${selector.optionGroups.map(group => html`
          ${group.title && html`<div class="pdpx-option-group-title">${group.title}</div>`}
          ${group.options.map(opt => {
            const thumbnailUrl = updateImageUrl(opt.imageUrl, 54);
            const isSelected = opt.value === selectedOptionValue;
            
            return html`
              <button
                key="${opt.value}"
                class="pdpx-pill-container ${isSelected ? 'selected' : ''}"
                type="button"
                data-name="${opt.value}"
                onClick=${() => handleOptionClick(opt)}
              >
                <div class="pdpx-pill-image-container">
                  <img class="pdpx-pill-image" src="${thumbnailUrl}" alt="${opt.title}" />
                </div>
                <div class="pdpx-pill-text-container">
                  <span class="pdpx-pill-text-name">${opt.title}</span>
                  ${opt.priceDelta && html`
                    <span class="pdpx-pill-text-price">${opt.priceDelta}</span>
                  `}
                </div>
              </button>
            `;
          })}
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
