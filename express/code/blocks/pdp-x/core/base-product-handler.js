/**
 * Base Product Handler - Contains shared logic for all product types
 * This extracts the current business card logic into a reusable base class
 */

// Import utilities - we'll initialize these when needed
let createTag;

class BaseProductHandler {
  constructor() {
    this.productType = 'base';
  }

  /**
   * Get product data from either data structure format
   */
  static getProduct(productData) {
    return productData.product || productData.data?.product || {};
  }

  /**
   * Get shipping data from either data structure format
   */
  static getShipping(productData) {
    return productData.shipping || productData.data?.shipping || {};
  }

  /**
   * Get strings data from either data structure format
   */
  static getStrings(productData) {
    return productData.strings || productData.data?.strings || {};
  }

  /**
   * Build image URL from realview/swatch parameters
   */
  static buildImageUrl(params, maxDim = 644) {
    if (!params || typeof params !== 'object') {
      return '';
    }

    const baseUrl = 'https://rlv.zcache.com/svc/view';
    const urlParams = new URLSearchParams();

    // Default parameters
    urlParams.set('zcur', 'USD');
    urlParams.set('lang', 'en');
    urlParams.set('region', 'us');
    urlParams.set('rlvnet', '1');
    urlParams.set('max_dim', maxDim.toString());

    // Add all provided parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        urlParams.set(key, value.toString());
      }
    });

    return `${baseUrl}?${urlParams.toString()}`;
  }

  /**
   * Get product-specific configuration
   */
  static getConfig() {
    return {
      supportedAttributes: ['style', 'size', 'color'],
      layout: 'standard',
      hasGroupedAttributes: false,
    };
  }

  /**
   * Detect if this handler can handle the given product data
   */
  static canHandle() {
    return true; // Base handler is the fallback
  }

  /**
   * Create the main product UI structure
   */
  async renderProduct(container, productData, templateId) {
    // Initialize utilities if not already done
    if (!createTag) {
      const { getLibs } = await import('../../../scripts/utils.js');
      ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
    }

    // Store product data for use in event handlers
    this.currentProductData = productData;

    // Log rendering for debugging
    // console.log(`🎨 Rendering ${this.productType} product`);

    // Create main container
    const productContainer = document.createElement('div');
    productContainer.className = 'pdp-container';

    // Create sections
    const imageSection = BaseProductHandler.createImageSection(productData);
    const detailsSection = this.createDetailsSection(productData, templateId);

    productContainer.appendChild(imageSection);
    productContainer.appendChild(detailsSection);

    container.appendChild(productContainer);

    // Initialize interactions
    this.initializeInteractions(productData, productContainer);

    return productContainer;
  }

  /**
   * Create image gallery section
   */
  static createImageSection(productData) {
    const section = document.createElement('div');
    section.className = 'pdp-image-section';

    const gallery = BaseProductHandler.createImageGallery(productData);
    section.appendChild(gallery);

    return section;
  }

  /**
   * Create product details section
   */
  createDetailsSection(productData, templateId) {
    const section = document.createElement('div');
    section.className = 'pdp-details-section';

    // Product info
    const info = this.createProductInfo(productData);
    section.appendChild(info);

    // Quantity selector
    const quantity = BaseProductHandler.createQuantitySelector(productData);
    section.appendChild(quantity);

    // Shipping info
    const shipping = BaseProductHandler.createShippingInfo(productData);
    section.appendChild(shipping);

    // Attributes
    const attributes = BaseProductHandler.createAttributesSection(productData);
    section.appendChild(attributes);

    // About product
    const about = BaseProductHandler.createAboutProduct(productData);
    section.appendChild(about);

    // CTA
    const cta = BaseProductHandler.createCTAButton(productData, templateId);
    section.appendChild(cta);

    return section;
  }

  /**
   * Create image gallery (standard implementation)
   */
  static createImageGallery(productData) {
    const gallery = document.createElement('div');
    gallery.className = 'image-gallery';

    // Main image
    const mainImage = document.createElement('div');
    mainImage.className = 'main-image';

    const img = document.createElement('img');
    img.className = 'product-image';
    const product = BaseProductHandler.getProduct(productData);
    img.alt = product.title || 'Product Image';

    // Use preferred realview or first available
    const preferredRealview = product.preferredRealviewId;
    const realviews = product.realviews || [];
    const initialRealview = realviews.find((rv) => rv.id === preferredRealview) || realviews[0];

    if (initialRealview) {
      const imageUrl = BaseProductHandler.buildImageUrl(initialRealview.realviewParams, 644);
      img.src = imageUrl;
    }

    mainImage.appendChild(img);
    gallery.appendChild(mainImage);

    // Thumbnail selector
    if (realviews.length > 1) {
      const thumbnails = BaseProductHandler.createThumbnails(realviews);
      gallery.appendChild(thumbnails);
    }

    return gallery;
  }

  /**
   * Create thumbnail selector
   */
  static createThumbnails(realviews) {
    const container = document.createElement('div');
    container.className = 'image-thumbnails';

    realviews.forEach((realview, index) => {
      const thumb = document.createElement('button');
      thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
      thumb.setAttribute('data-realview-id', realview.id);

      const img = document.createElement('img');
      img.src = BaseProductHandler.buildImageUrl(realview.realviewParams, 120);
      img.alt = realview.title || `View ${index + 1}`;

      thumb.appendChild(img);
      container.appendChild(thumb);
    });

    return container;
  }

  /**
   * Create product info section
   */
  createProductInfo(productData) {
    const container = document.createElement('div');
    container.className = 'product-info';

    const product = BaseProductHandler.getProduct(productData);

    // Title
    const title = document.createElement('h1');
    title.className = 'product-title';
    title.textContent = product.title || 'Product Title';
    container.appendChild(title);

    // Pricing
    const pricing = this.createPricingDisplay(productData);
    container.appendChild(pricing);

    return container;
  }

  /**
   * Create pricing display
   */
  createPricingDisplay(productData) {
    const container = document.createElement('div');
    container.className = 'pricing-display';

    const price = document.createElement('div');
    price.className = 'price';

    const product = BaseProductHandler.getProduct(productData);
    const basePrice = product.pricing?.unitPrice || 0;
    price.textContent = this.formatCurrency(basePrice);

    container.appendChild(price);
    return container;
  }

  /**
   * Create quantity selector
   */
  static createQuantitySelector(productData) {
    const container = document.createElement('div');
    container.className = 'quantity-section';

    const label = document.createElement('h2');
    label.textContent = 'Quantity';
    container.appendChild(label);

    const selector = document.createElement('select');
    selector.className = 'quantity-selector';
    selector.setAttribute('data-attribute', 'quantity');

    const product = BaseProductHandler.getProduct(productData);
    const quantities = product.quantities || [1, 2, 3, 4, 5];
    quantities.forEach((qty) => {
      const option = document.createElement('option');
      option.value = qty;
      option.textContent = `${qty} ${qty === 1 ? product.singularUnitLabel || 'item' : product.pluralUnitLabel || 'items'}`;
      selector.appendChild(option);
    });

    container.appendChild(selector);
    return container;
  }

  /**
   * Create shipping info
   */
  static createShippingInfo(productData) {
    const container = document.createElement('div');
    container.className = 'shipping-info';

    const title = document.createElement('h2');
    title.innerHTML = '<span class="truck-icon">🚚</span> Shipping options';
    container.appendChild(title);

    const eta = document.createElement('span');
    eta.className = 'shipping-eta';

    const shipping = BaseProductHandler.getShipping(productData);
    if (shipping.estimates?.length > 0) {
      const estimate = shipping.estimates[0];
      eta.textContent = `Order today and get it by ${BaseProductHandler.formatDateRange(estimate.minDate, estimate.maxDate)}`;
    } else {
      eta.textContent = 'Shipping estimates will be calculated at checkout';
    }

    container.appendChild(eta);
    return container;
  }

  /**
   * Create attributes section - can be overridden by product types
   */
  static createAttributesSection(productData) {
    const container = document.createElement('div');
    container.className = 'attributes-section';

    const product = BaseProductHandler.getProduct(productData);
    const attributes = product.attributes || {};

    Object.entries(attributes).forEach(([name, attributeData]) => {
      if (BaseProductHandler.shouldShowAttribute(name, attributeData)) {
        const attributeSelector = BaseProductHandler.createAttributeSelector(name, attributeData);
        container.appendChild(attributeSelector);
      }
    });

    return container;
  }

  /**
   * Determine if attribute should be shown
   */
  static shouldShowAttribute(name, attributeData) {
    // Skip quantity as it's handled separately
    return name !== 'quantity' && attributeData.values && attributeData.values.length > 1;
  }

  /**
   * Create individual attribute selector - can be overridden
   */
  static createAttributeSelector(attributeName, attributeData) {
    const container = document.createElement('div');
    container.className = `attribute-selector attribute-${attributeName}`;

    // Label
    const label = document.createElement('label');
    label.textContent = attributeData.title || attributeName;
    label.setAttribute('for', `attribute-${attributeName}`);
    container.appendChild(label);

    // Current selection display
    const currentValue = attributeData.value || attributeData.values[0]?.name;
    const currentDisplay = document.createElement('div');
    currentDisplay.className = 'current-selection';
    const foundValue = attributeData.values.find((v) => v.name === currentValue);
    currentDisplay.textContent = foundValue?.title || currentValue;
    container.appendChild(currentDisplay);

    // Options container
    const optionsContainer = BaseProductHandler.createAttributeOptions(
      attributeName,
      attributeData,
    );
    container.appendChild(optionsContainer);

    return container;
  }

  /**
   * Create attribute options (thumbnails, dropdown, etc.)
   */
  static createAttributeOptions(attributeName, attributeData) {
    const container = document.createElement('div');
    container.className = 'attribute-options';

    // For now, create thumbnails for all attributes
    // Product-specific handlers can override this
    attributeData.values.forEach((value) => {
      const option = document.createElement('button');
      option.className = `attribute-option ${value.name === attributeData.value ? 'selected' : ''}`;
      option.setAttribute('data-attribute', attributeName);
      option.setAttribute('data-value', value.name);
      option.title = value.title || value.name;

      // Add thumbnail if available
      if (value.swatchParams || value.realviewParams) {
        const img = document.createElement('img');
        const params = value.swatchParams || value.realviewParams;
        img.src = BaseProductHandler.buildImageUrl(params, 48);
        img.alt = value.title || value.name;
        option.appendChild(img);
      } else {
        option.textContent = value.title || value.name;
      }

      container.appendChild(option);
    });

    return container;
  }

  /**
   * Create about product section
   */
  static createAboutProduct(productData) {
    const container = document.createElement('div');
    container.className = 'about-product';

    const title = document.createElement('h2');
    title.textContent = 'About this product';
    container.appendChild(title);

    const description = document.createElement('div');
    description.className = 'product-description';

    const product = BaseProductHandler.getProduct(productData);
    if (product.attributeDescription) {
      description.innerHTML = product.attributeDescription;
    } else {
      description.textContent = 'Product details will be available soon.';
    }

    container.appendChild(description);
    return container;
  }

  /**
   * Create CTA button
   */
  static createCTAButton(productData, templateId) {
    const container = document.createElement('div');
    container.className = 'cta-section';

    const button = document.createElement('button');
    button.className = 'cta-button primary';
    button.innerHTML = '<span class="edit-icon">✏️</span> Customize and print it';

    button.addEventListener('click', () => {
      BaseProductHandler.handleCTAClick(productData, templateId);
    });

    container.appendChild(button);

    const satisfaction = document.createElement('div');
    satisfaction.className = 'satisfaction-guarantee';
    satisfaction.innerHTML = 'Printing through Zazzle with a promise of <a href="#" target="_blank">100% satisfaction</a>';
    container.appendChild(satisfaction);

    return container;
  }

  /**
   * Handle CTA button click
   */
  static handleCTAClick() {
    // Log CTA click for debugging
    // console.log('🎯 CTA clicked for template:', templateId);
    // This would typically redirect to the design tool
    // For demo purposes, just log
  }

  /**
   * Initialize interactions and event listeners
   */
  initializeInteractions(productData, container) {
    // Thumbnail clicks
    const thumbnails = container.querySelectorAll('.thumbnail');
    const mainImage = container.querySelector('.product-image');

    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        // Update active thumbnail
        thumbnails.forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');

        // Update main image
        const realviewId = thumb.getAttribute('data-realview-id');
        const product = BaseProductHandler.getProduct(productData);
        const realview = product.realviews?.find((rv) => rv.id === realviewId);
        if (realview && mainImage) {
          mainImage.src = BaseProductHandler.buildImageUrl(realview.realviewParams, 644);
        }
      });
    });

    // Attribute option clicks
    const attributeOptions = container.querySelectorAll('.attribute-option');
    attributeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const attributeName = option.getAttribute('data-attribute');
        const value = option.getAttribute('data-value');

        // Update selection
        const siblings = container.querySelectorAll(`[data-attribute="${attributeName}"]`);
        siblings.forEach((s) => s.classList.remove('selected'));
        option.classList.add('selected');

        // Update current selection display
        const currentDisplay = option.closest('.attribute-selector').querySelector('.current-selection');
        if (currentDisplay) {
          currentDisplay.textContent = option.title || value;
        }

        // Handle attribute change
        this.handleAttributeChange(attributeName, value, productData, container);
      });
    });
  }

  /**
   * Handle attribute selection changes
   */
  handleAttributeChange(attributeName, value, productData, container) {
    // Log attribute change for debugging
    // console.log(`🔄 Attribute changed: ${attributeName} = ${value}`);

    // Update pricing if needed
    this.updatePricing(productData, container);

    // Update images if needed
    BaseProductHandler.updateImages(productData, container);
  }

  /**
   * Get current attribute selections from the UI
   */
  getCurrentSelections(container) {
    const selections = {};

    // Get selections from attribute selectors
    const attributeSelectors = container.querySelectorAll('.attribute-selector');
    attributeSelectors.forEach((selector) => {
      const attributeName = selector.dataset.attribute;
      if (!attributeName) return;

      // Check for selected option (multiple selector types)
      let selectedValue = null;

      // Check for traditional attribute options
      const selectedOption = selector.querySelector('.attribute-option.selected');
      if (selectedOption) {
        selectedValue = selectedOption.dataset.value;
      }

      // Check for radio inputs (dropdowns, etc.)
      const checkedRadio = selector.querySelector('input:checked');
      if (checkedRadio && !selectedValue) {
        selectedValue = checkedRadio.value;
      }

      // Check for Zazzle-style color selectors
      const selectedZazzleItem = selector.querySelector('.zazzle-fd379ad71c9e640b-item__selected input');
      if (selectedZazzleItem && !selectedValue) {
        selectedValue = selectedZazzleItem.value;
      }

      if (selectedValue) {
        // Find the full attribute value object
        const product = BaseProductHandler.getProduct(this.currentProductData || {});
        const attributeData = product.attributes?.[attributeName];
        const valueObj = attributeData?.values?.find((v) => v.name === selectedValue);
        selections[attributeName] = valueObj || { name: selectedValue };
      }
    });

    return selections;
  }

  /**
   * Update pricing based on current selections - integrates with main pricing system
   */
  updatePricing(productData, container) {
    const priceElement = container.querySelector('.price');
    if (!priceElement) return;

    // Get current selections from the UI
    const selections = this.getCurrentSelections(container);

    // Use the main pricing function from pdp-x.js
    if (window.pdpXUpdatePricing) {
      window.pdpXUpdatePricing(productData, selections, priceElement);
    } else {
      // Fallback to simple pricing if main function not available
      const product = BaseProductHandler.getProduct(productData);
      let basePrice = product.pricing?.unitPrice || 0;

      // Add price differentials from selected options
      Object.values(selections).forEach((selectedValue) => {
        if (selectedValue && selectedValue.priceDifferential) {
          basePrice += selectedValue.priceDifferential;
        }
      });

      priceElement.textContent = BaseProductHandler.formatCurrency(basePrice);
    }
  }

  /**
   * Update images based on current selections
   */
  static updateImages() {
    // Base implementation - product-specific handlers can override
    // console.log('🖼️ Updating images for attribute changes');
  }

  /**
   * Utility: Format currency
   */
  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  /**
   * Utility: Format date range
   */
  static formatDateRange(minDate, maxDate) {
    if (!minDate || !maxDate) return 'Date range unavailable';

    const min = new Date(minDate);
    const max = new Date(maxDate);

    const formatOptions = { month: 'short', day: 'numeric' };
    return `${min.toLocaleDateString('en-US', formatOptions)} - ${max.toLocaleDateString('en-US', formatOptions)}`;
  }
}

export default BaseProductHandler;
