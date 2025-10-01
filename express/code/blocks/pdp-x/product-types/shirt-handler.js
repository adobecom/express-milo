/**
 * Shirt Product Handler
 * Handles zazzle_shirt product type with grouped color attributes and design shade logic
 */

import { BaseProductHandler } from '../core/base-product-handler.js';

export class ShirtHandler extends BaseProductHandler {
  constructor() {
    super();
    this.productType = 'zazzle_shirt';
  }

  /**
   * Get shirt specific configuration
   */
  getConfig() {
    return {
      ...super.getConfig(),
      supportedAttributes: ['style', 'size', 'color'],
      layout: 'shirt-layout',
      hasGroupedAttributes: true,
      designAreas: ['10', '12', '10', '12'], // Shirt dimensions
      colorGroups: ['light', 'dark'],
    };
  }

  /**
   * Check if this handler can handle the product
   */
  canHandle(productData) {
    return productData.product?.productType === 'zazzle_shirt';
  }

  /**
   * Shirt specific attribute handling - override for grouped colors
   */
  createAttributeSelector(attributeName, attributeData) {
    if (attributeName === 'color') {
      return this.createGroupedColorSelector(attributeData);
    }
    
    // Use base implementation for other attributes
    return super.createAttributeSelector(attributeName, attributeData);
  }

  /**
   * Create grouped color selector for shirts - matches Zazzle's exact structure
   */
  createGroupedColorSelector(attributeData) {
    const container = document.createElement('div');
    container.className = 'attribute-selector attribute-color';
    container.setAttribute('data-attribute', 'color');
    
    // Label
    const label = document.createElement('label');
    label.className = 'spectrum-Heading spectrum-Heading--sizeXS';
    label.textContent = attributeData.title || 'Color & print process';
    container.appendChild(label);
    
    // Current selection display
    const currentValue = attributeData.value || attributeData.values?.[0]?.name;
    const currentDisplay = document.createElement('div');
    const currentValueObj = attributeData.values?.find(v => v.name === currentValue);
    currentDisplay.textContent = currentValueObj?.title || currentValue || 'White';
    container.appendChild(currentDisplay);
    
    // Group colors by design shade
    const lightColors = this.filterColorsByShade(attributeData.values || [], 'light');
    const darkColors = this.filterColorsByShade(attributeData.values || [], 'dark');
    
    // Light colors group (Classic printing)
    if (lightColors.length > 0) {
      const lightGroup = this.createColorGroup(
        'light',
        'Classic printing: no underbase',
        lightColors,
        currentValue
      );
      container.appendChild(lightGroup);
    }
    
    // Dark colors group (Vivid printing)
    if (darkColors.length > 0) {
      const darkGroup = this.createColorGroup(
        'dark',
        'Vivid printing: white underbase',
        darkColors,
        currentValue
      );
      container.appendChild(darkGroup);
    }
    
    return container;
  }

  /**
   * Create a color group (light or dark)
   */
  createColorGroup(shade, title, colors, selectedValue) {
    const group = document.createElement('div');
    group.className = 'zazzle-_982ea235e0ec1696-selector__thumbnails_group';
    
    // Group title (matches Zazzle's structure)
    const groupTitle = document.createElement('div');
    groupTitle.textContent = title;
    group.appendChild(groupTitle);
    
    // Fieldset for radio group (matches Zazzle's structure)
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'zazzle-fd379ad71c9e640b-root zazzle-_982ea235e0ec1696-selector__thumbnails';
    fieldset.setAttribute('role', 'radiogroup');
    
    colors.forEach((color, index) => {
      const label = document.createElement('label');
      label.className = `zazzle-fd379ad71c9e640b-item zazzle-fd379ad71c9e640b-item__withSelectedInsetBorder zazzle-_982ea235e0ec1696-selector__thumbnails_item`;
      label.setAttribute('aria-label', color.title || color.name);
      label.setAttribute('title', color.title || color.name);
      
      // Add selected class if this is the current selection
      if (color.name === selectedValue) {
        label.classList.add('zazzle-fd379ad71c9e640b-item__selected');
      }
      
      // Radio input (hidden but functional)
      const radio = document.createElement('input');
      radio.className = 'zazzle-fd379ad71c9e640b-radio';
      radio.type = 'radio';
      radio.name = `ImageRadioGroup-color-${shade}`;
      radio.value = color.name;
      radio.checked = color.name === selectedValue;
      
      // Color swatch image
      const img = document.createElement('img');
      img.className = 'zazzle-fd379ad71c9e640b-image';
      img.alt = '';
      
      // Use swatchParams if available, otherwise build URL manually
      if (color.swatchParams && Object.keys(color.swatchParams).length > 0) {
        img.src = this.buildImageUrl(color.swatchParams, 48);
        // Add srcset for retina displays
        img.srcset = `${this.buildImageUrl(color.swatchParams, 48)} 1x, ${this.buildImageUrl(color.swatchParams, 96)} 2x`;
      } else {
        // Fallback: build URL manually using color name
        const fallbackParams = {
          realview: '113612864769037536',
          style: 'triblend_shortsleeve3413',
          color: color.name,
        };
        img.src = this.buildImageUrl(fallbackParams, 48);
        img.srcset = `${this.buildImageUrl(fallbackParams, 48)} 1x, ${this.buildImageUrl(fallbackParams, 96)} 2x`;
      }
      
      // Add click event listener
      label.addEventListener('click', (e) => {
        // Update radio state
        fieldset.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        radio.checked = true;
        
        // Update visual selection
        fieldset.querySelectorAll('.zazzle-fd379ad71c9e640b-item').forEach(item => {
          item.classList.remove('zazzle-fd379ad71c9e640b-item__selected');
        });
        label.classList.add('zazzle-fd379ad71c9e640b-item__selected');
        
        // Update current selection display
        const container = group.closest('.attribute-selector');
        const currentDisplay = container.querySelector('div:nth-child(2)'); // The display div
        if (currentDisplay) {
          currentDisplay.textContent = color.title || color.name;
        }
        
        // Update main product image and pricing
        this.updateMainImage(color, container);
        
        // Update pricing using the main system
        this.handleAttributeChange('color', color, this.currentProductData, container.closest('.pdp-x'));
        
        console.log(`🎨 Selected ${shade} color: ${color.name} (${color.title})`);
      });
      
      label.appendChild(radio);
      label.appendChild(img);
      fieldset.appendChild(label);
    });
    
    group.appendChild(fieldset);
    return group;
  }

  /**
   * Update main product image when color changes
   */
  updateMainImage(color, container) {
    const mainImage = container.closest('.pdp-x').querySelector('.product-image');
    if (!mainImage) return;
    
    // Find the best matching realview for this color
    const product = this.getProduct(this.currentProductData || {});
    const realviews = product.realviews || [];
    
    // Look for realview that matches the selected color
    let targetRealview = realviews.find(rv => {
      const params = rv.realviewParams || {};
      return params.color === color.name;
    });
    
    // Fallback to first realview if no exact match
    if (!targetRealview && realviews.length > 0) {
      targetRealview = realviews[0];
    }
    
    if (targetRealview) {
      // Update the main image with the new color
      const newImageUrl = this.buildImageUrl(targetRealview.realviewParams, 644);
      mainImage.src = newImageUrl;
      
      // Update srcset for retina displays
      mainImage.srcset = `${newImageUrl} 1x, ${this.buildImageUrl(targetRealview.realviewParams, 1024)} 2x`;
      
      console.log(`🖼️ Updated main image for color: ${color.name}`);
    }
  }
  

  /**
   * Handle color change specifically for shirts
   */
  handleColorChange(colorValue, container) {
    console.log('🎨 Shirt color changed to:', colorValue.name);
    
    // Update the main product image
    const mainImage = container.querySelector('.product-image');
    if (mainImage && colorValue.realviewParams) {
      const imageUrl = this.buildImageUrl(colorValue.realviewParams, 644);
      mainImage.src = imageUrl;
      console.log('🖼️ Updated main image for color:', colorValue.name);
    }
    
    // Update pricing if color affects price
    this.updatePricing({ data: { product: container.productData } }, container);
  }

  /**
   * Filter colors by design shade
   */
  filterColorsByShade(colors, targetShade) {
    return colors.filter(color => {
      // Use the actual design.shade property from the data
      const shade = color.properties && color.properties['design.shade'];
      return shade === targetShade;
    });
  }

  /**
   * Get design shade from color data
   */
  getDesignShadeFromColor(colorName, colorData = null) {
    if (colorData && colorData.properties && colorData.properties['design.shade']) {
      return colorData.properties['design.shade'];
    }
    // Fallback: Colors ending with '_da' are dark shade (with underbase)
    return colorName.endsWith('_da') ? 'dark' : 'light';
  }

  /**
   * Get CSS color from color name (fallback)
   */
  getColorFromName(colorName) {
    const colorMap = {
      white: '#ffffff',
      black: '#000000',
      grey: '#808080',
      blue: '#0066cc',
      red: '#cc0000',
      green: '#00cc00',
      yellow: '#ffcc00',
      // Add more as needed
    };
    
    // Remove _da suffix for lookup
    const baseName = colorName.replace('_da', '');
    return colorMap[baseName] || '#cccccc';
  }

  /**
   * Shirt specific pricing logic
   */
  updatePricing(productData, container) {
    const priceElement = container.querySelector('.price');
    if (!priceElement) return;

    const selections = this.getCurrentSelections(container);
    const product = this.getProduct(productData);
    
    // Calculate price based on selections
    let basePrice = product.pricing?.unitPrice || 0;
    
    // Add size-based price adjustments (shirts often have 2XL+ upcharges)
    if (selections.size) {
      const sizeAttribute = product.attributes?.size;
      const selectedSize = sizeAttribute?.values?.find(v => v.name === selections.size);
      if (selectedSize?.priceDifferential) {
        basePrice += selectedSize.priceDifferential;
      }
    }
    
    // Update display
    priceElement.textContent = this.formatCurrency(basePrice);
    
    console.log('💰 Shirt pricing updated:', this.formatCurrency(basePrice));
  }

  /**
   * Shirt specific image updates
   */
  updateImages(productData, container) {
    const selections = this.getCurrentSelections(container);
    const mainImage = container.querySelector('.product-image');
    
    if (!mainImage) return;
    
    const product = this.getProduct(productData);
    const realviews = product.realviews || [];
    
    // For shirts, we need to match style, color, and size
    let targetRealview = realviews.find(rv => {
      const params = rv.realviewParams || {};
      return (!selections.style || params.style === selections.style) &&
             (!selections.color || params.color === selections.color) &&
             (!selections.size || params.size === selections.size);
    });
    
    // Fallback logic for shirts
    if (!targetRealview) {
      // Try without size (size doesn't always affect the main image)
      targetRealview = realviews.find(rv => {
        const params = rv.realviewParams || {};
        return (!selections.style || params.style === selections.style) &&
               (!selections.color || params.color === selections.color);
      });
    }
    
    // Final fallback to preferred or first realview
    if (!targetRealview) {
      const preferredId = product.preferredRealviewId;
      targetRealview = realviews.find(rv => rv.id === preferredId) || realviews[0];
    }
    
    if (targetRealview) {
      // Build image URL with updated color
      const updatedParams = { ...targetRealview.realviewParams };
      if (selections.color) {
        updatedParams.color = selections.color;
      }
      
      mainImage.src = this.buildImageUrl(updatedParams, 644);
      console.log('🖼️ Shirt image updated for selections:', selections);
    }
  }

  /**
   * Get current attribute selections from the UI
   */
  getCurrentSelections(container) {
    const selections = {};
    
    const selectedOptions = container.querySelectorAll('.attribute-option.selected');
    selectedOptions.forEach(option => {
      const attributeName = option.getAttribute('data-attribute');
      const value = option.getAttribute('data-value');
      if (attributeName && value) {
        selections[attributeName] = value;
      }
    });
    
    // Also get quantity
    const quantitySelector = container.querySelector('.quantity-selector');
    if (quantitySelector) {
      selections.quantity = quantitySelector.value;
    }
    
    return selections;
  }

  /**
   * Shirt specific validation
   */
  isValidOptionCombination(productData, selections, attributeName, value) {
    const product = this.getProduct(productData);
    const attributes = product.attributes || {};
    const attributeData = attributes[attributeName];
    
    if (!attributeData) return false;
    
    // Check if the value exists
    const valueExists = attributeData.values?.some(v => v.name === value);
    if (!valueExists) return false;
    
    // Check stock status
    const selectedValue = attributeData.values.find(v => v.name === value);
    if (selectedValue && !selectedValue.isInStock) return false;
    
    // Shirt-specific validation: check design shade compatibility
    if (attributeName === 'color') {
      const shade = this.getDesignShadeFromColor(value, selectedValue);
      console.log(`🎨 Color ${value} has shade: ${shade}`);
    }
    
    return true;
  }

  /**
   * Handle attribute changes with shirt specific logic
   */
  handleAttributeChange(attributeName, value, productData, container) {
    console.log(`🔄 Shirt attribute changed: ${attributeName} = ${value}`);
    
    const product = this.getProduct(productData);
    
    // For color changes, update the current selection display with shade info
    if (attributeName === 'color') {
      const currentDisplay = container.querySelector('.attribute-color .current-selection');
      const selectedColor = product.attributes?.color?.values?.find(v => v.name === value);
      
      if (currentDisplay && selectedColor) {
        const shade = this.getDesignShadeFromColor(value, selectedColor);
        const shadeText = shade === 'dark' ? ' (Vivid Printing)' : ' (Classic Printing)';
        currentDisplay.textContent = selectedColor.title + shadeText;
      }
    }
    
    // Validate the selection
    const selections = this.getCurrentSelections(container);
    selections[attributeName] = value;
    
    if (!this.isValidOptionCombination(productData, selections, attributeName, value)) {
      console.warn('⚠️ Invalid option combination for shirt');
      return;
    }
    
    // Update dependent elements
    this.updatePricing(productData, container);
    this.updateImages(productData, container);
    this.updateStockStatus(productData, container, selections);
  }

  /**
   * Update stock status display
   */
  updateStockStatus(productData, container, selections) {
    console.log('📦 Checking shirt stock status for:', selections);
    
    // Shirts might have size/color combinations that are out of stock
    // This would check against the attribute dependency graph
  }

  /**
   * Shirt specific CTA handling
   */
  handleCTAClick(productData, templateId) {
    console.log('🎯 Shirt CTA clicked for template:', templateId);
    
    const container = document.querySelector('.pdp-container');
    const selections = this.getCurrentSelections(container);
    
    // Build customize URL with selections
    const customizeUrl = this.buildCustomizeUrl(templateId, selections);
    console.log('🔗 Customize URL:', customizeUrl);
    
    // For demo, just log. In production, would redirect to design tool
    alert(`Shirt Customize URL: ${customizeUrl}`);
  }

  /**
   * Build customize URL for shirts
   */
  buildCustomizeUrl(templateId, selections) {
    const baseUrl = 'https://www.adobe.com/express/create/t-shirt';
    const params = new URLSearchParams();
    
    params.set('template', templateId);
    
    // Add selections as parameters
    Object.entries(selections).forEach(([key, value]) => {
      params.set(key, value);
    });
    
    // Add design shade info
    if (selections.color) {
      const shade = this.getDesignShadeFromColor(selections.color);
      params.set('design_shade', shade);
    }
    
    return `${baseUrl}?${params.toString()}`;
  }
}
