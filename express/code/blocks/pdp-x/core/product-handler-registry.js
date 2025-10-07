/**
 * Product Handler Registry
 * Manages registration and dynamic loading of product type handlers
 */

import { BaseProductHandler } from './base-product-handler.js';

class ProductHandlerRegistry {
  constructor() {
    this.handlers = new Map();
    this.loadedHandlers = new Map();
  }

  /**
   * Register a product handler
   */
  register(productType, handlerLoader) {
    this.handlers.set(productType, handlerLoader);
    console.log(`📝 Registered handler for product type: ${productType}`);
  }

  /**
   * Get handler for a product type (with dynamic loading)
   */
  async getHandler(productType) {
    // Check if already loaded
    if (this.loadedHandlers.has(productType)) {
      return this.loadedHandlers.get(productType);
    }

    // Check if registered
    if (this.handlers.has(productType)) {
      console.log(`🔄 Loading handler for product type: ${productType}`);

      try {
        const handlerLoader = this.handlers.get(productType);
        const HandlerClass = await handlerLoader();
        const handler = new HandlerClass();

        // Cache the loaded handler
        this.loadedHandlers.set(productType, handler);

        console.log(`✅ Loaded handler for product type: ${productType}`);
        return handler;
      } catch (error) {
        console.error(`❌ Failed to load handler for ${productType}:`, error);
        return this.getFallbackHandler();
      }
    }

    // Return fallback handler
    console.log(`⚠️ No handler registered for product type: ${productType}, using fallback`);
    return this.getFallbackHandler();
  }

  /**
   * Get fallback handler (BaseProductHandler)
   */
  getFallbackHandler() {
    if (!this.loadedHandlers.has('fallback')) {
      this.loadedHandlers.set('fallback', new BaseProductHandler());
    }
    return this.loadedHandlers.get('fallback');
  }

  /**
   * Detect product type from product data
   */
  detectProductType(productData) {
    // Primary detection: use productType field (check multiple possible locations)
    if (productData?.product?.productType) {
      return productData.product.productType;
    }

    // Check if it's in the root data structure (existing format)
    if (productData?.data?.product?.productType) {
      return productData.data.product.productType;
    }

    // Fallback detection: analyze product structure
    const designAreasSizes = productData?.designAreasSizes || productData?.data?.designAreasSizes;
    if (designAreasSizes) {
      const sizes = designAreasSizes;

      // Business card dimensions
      if (sizes === '[3.5,2,3.5,2]') {
        return 'zazzle_businesscard';
      }

      // Shirt dimensions
      if (sizes === '[10,12,10,12]') {
        return 'zazzle_shirt';
      }
    }

    // Final fallback
    console.warn('⚠️ Could not detect product type, using base handler');
    return 'base';
  }

  /**
   * Get appropriate handler for product data
   */
  async getHandlerForProduct(productData) {
    const productType = this.detectProductType(productData);
    return await this.getHandler(productType);
  }

  /**
   * Clear all loaded handlers (for testing/cleanup)
   */
  clear() {
    this.loadedHandlers.clear();
    console.log('🧹 Cleared all loaded handlers');
  }

  /**
   * Get registry status for debugging
   */
  getStatus() {
    return {
      registered: Array.from(this.handlers.keys()),
      loaded: Array.from(this.loadedHandlers.keys()),
    };
  }
}

// Create singleton instance
const registry = new ProductHandlerRegistry();

// Register known product types with dynamic imports
registry.register('zazzle_businesscard', async () => {
  const { BusinessCardHandler } = await import('../product-types/business-card-handler.js');
  return BusinessCardHandler;
});

registry.register('zazzle_shirt', async () => {
  const { ShirtHandler } = await import('../product-types/shirt-handler.js');
  return ShirtHandler;
});

// Export singleton
export default registry;
