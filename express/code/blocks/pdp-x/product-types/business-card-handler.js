/**
 * Business Card Product Handler
 * Handles zazzle_businesscard product type with existing logic
 */

import { BaseProductHandler } from '../core/base-product-handler.js';

export class BusinessCardHandler extends BaseProductHandler {
  constructor() {
    super();
    this.productType = 'zazzle_businesscard';
  }

  /**
   * Get business card specific configuration
   */
  getConfig() {
    return {
      ...super.getConfig(),
      supportedAttributes: ['style', 'size', 'color'],
      layout: 'standard',
      hasGroupedAttributes: false,
      designAreas: ['3.5', '2', '3.5', '2'], // Business card dimensions
    };
  }

  /**
   * Check if this handler can handle the product
   */
  canHandle(productData) {
    const product = this.getProduct(productData);
    return product.productType === 'zazzle_businesscard';
  }

  /**
   * Business card specific attribute handling
   */
  createAttributeSelector(attributeName, attributeData) {
    // Business cards use the standard attribute selector
    // No special grouping needed
    return super.createAttributeSelector(attributeName, attributeData);
  }

  /**
   * Business card specific pricing logic
   */
  updatePricing(productData, container) {
    const priceElement = container.querySelector('.price');
    if (!priceElement) return;

    // Get current selections
    const selections = this.getCurrentSelections(container);
    
    const product = this.getProduct(productData);
    
    // Calculate price based on selections
    let basePrice = product.pricing?.unitPrice || 0;
    
    // Add any size-based price adjustments
    if (selections.size) {
      const sizeAttribute = product.attributes?.size;
      const selectedSize = sizeAttribute?.values?.find(v => v.name === selections.size);
      if (selectedSize?.priceDifferential) {
        basePrice += selectedSize.priceDifferential;
      }
    }
    
    // Update display
    priceElement.textContent = this.formatCurrency(basePrice);
    
    console.log('💰 Business card pricing updated:', this.formatCurrency(basePrice));
  }

  /**
   * Business card specific image updates
   */
  updateImages(productData, container) {
    const selections = this.getCurrentSelections(container);
    const mainImage = container.querySelector('.product-image');
    
    if (!mainImage) return;
    
    const product = this.getProduct(productData);
    
    // Find matching realview based on selections
    const realviews = product.realviews || [];
    let targetRealview = realviews.find(rv => {
      const params = rv.realviewParams || {};
      return (!selections.style || params.style === selections.style) &&
             (!selections.color || params.color === selections.color) &&
             (!selections.size || params.size === selections.size);
    });
    
    // Fallback to preferred or first realview
    if (!targetRealview) {
      const preferredId = product.preferredRealviewId;
      targetRealview = realviews.find(rv => rv.id === preferredId) || realviews[0];
    }
    
    if (targetRealview) {
      mainImage.src = this.buildImageUrl(targetRealview.realviewParams, 644);
      console.log('🖼️ Business card image updated for selections:', selections);
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
    
    return selections;
  }

  /**
   * Business card specific validation
   */
  isValidOptionCombination(productData, selections, attributeName, value) {
    // Business cards have simple validation - most combinations are valid
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
    
    return true;
  }

  /**
   * Handle attribute changes with business card specific logic
   */
  handleAttributeChange(attributeName, value, productData, container) {
    console.log(`🔄 Business card attribute changed: ${attributeName} = ${value}`);
    
    // Validate the selection
    const selections = this.getCurrentSelections(container);
    selections[attributeName] = value;
    
    if (!this.isValidOptionCombination(productData, selections, attributeName, value)) {
      console.warn('⚠️ Invalid option combination for business card');
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
    // Business cards typically have good stock availability
    // This is a placeholder for more complex stock checking
    console.log('📦 Checking business card stock status for:', selections);
  }

  /**
   * Business card specific CTA handling
   */
  handleCTAClick(productData, templateId) {
    console.log('🎯 Business card CTA clicked for template:', templateId);
    
    // Get current selections
    const container = document.querySelector('.pdp-container');
    const selections = this.getCurrentSelections(container);
    
    // Build customize URL with selections
    const customizeUrl = this.buildCustomizeUrl(templateId, selections);
    console.log('🔗 Customize URL:', customizeUrl);
    
    // For demo, just log. In production, would redirect to design tool
    alert(`Business Card Customize URL: ${customizeUrl}`);
  }

  /**
   * Build customize URL for business cards
   */
  buildCustomizeUrl(templateId, selections) {
    const baseUrl = 'https://www.adobe.com/express/create/business-card';
    const params = new URLSearchParams();
    
    params.set('template', templateId);
    
    // Add selections as parameters
    Object.entries(selections).forEach(([key, value]) => {
      params.set(key, value);
    });
    
    return `${baseUrl}?${params.toString()}`;
  }
}
