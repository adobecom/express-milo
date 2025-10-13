import { getLibs } from '../../scripts/utils.js';

let createTag;

/**
 * Show loading skeleton while product data loads
 */
function showLoadingSkeleton(block) {
  block.innerHTML = `
    <div class="pdp-loading-skeleton">
      <div class="skeleton-image"></div>
      <div class="skeleton-details">
        <div class="skeleton-title"></div>
        <div class="skeleton-price"></div>
        <div class="skeleton-attributes"></div>
      </div>
    </div>
  `;
}

/**
 * Show error state with details
 */
function showErrorState(block, error) {
  block.innerHTML = `
    <div class="pdp-error">
      <h2>Unable to load product</h2>
      <p>Please try again later.</p>
      <details>
        <summary>Error details</summary>
        <pre>${error.message}</pre>
      </details>
    </div>
  `;
}

/**
 * Extracts configuration values from the block structure
 * @param {HTMLElement} block - The block element
 * @returns {Object} Configuration object with TD, taskID, shortcode, etc.
 */
function extractConfig(block) {
  const config = {};
  const rows = block.querySelectorAll(':scope > div');

  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();

      switch (key) {
        case 'td':
          config.templateId = value;
          break;
        case 'taskid':
          config.taskId = value;
          break;
        case 'shortcode':
          config.shortcode = value;
          break;
        case 'zazzleurl':
          config.zazzleUrl = value;
          break;
        default:
          config[key] = value;
      }
    }
  });

  return config;
}

/**
 * Load localized strings
 * @returns {Promise<Object>} Localized strings
 */
async function loadStrings() {
  try {
    const response = await fetch('/express/code/blocks/pdp-x/pdp-x-testing/template-sample-data/build-sample-strings-EN.js');
    const text = await response.text();
    // Extract JSON from the export default statement
    const jsonMatch = text.match(/JSON\.parse\('(.+)'\)/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return {};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('PDP-X: Failed to load strings:', error);
    return {};
  }
}

/**
 * Load pricing data
 * @param {Object} product - Product data for pricing calculation
 * @returns {Promise<Object>} Pricing data
 */
async function loadPricingData(product) {
  try {
    const response = await fetch('/express/code/blocks/pdp-x/pdp-x-testing/template-sample-data/sample-pricing-data.json');
    const data = await response.json();

    // eslint-disable-next-line no-console
    console.log('PDP-X: Pricing data loaded:', data);

    return data.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('PDP-X: Failed to load pricing data:', error);
    throw error;
  }
}

/**
 * Load shipping estimates (local)
 * @returns {Promise<Object>} Shipping estimates
 */
async function loadShippingEstimates() {
  try {
    const response = await fetch('/express/code/blocks/pdp-x/pdp-x-testing/template-sample-data/sample-shipping-estimates.json');
    const data = await response.json();

    return data.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('PDP-X: Failed to load shipping estimates:', error);
    return { estimates: [] };
  }
}

/**
 * Build URL for Product Template API (getProductFromTemplate)
 * @param {string} templateId - Template ID (URN format)
 * @returns {string} Complete API URL
 */
function buildProductTemplateApiUrl(templateId) {
  // eslint-disable-next-line no-console
  console.log('🔧 Building Product Template API URL...');
  // eslint-disable-next-line no-console
  console.log(`   📋 Parameters: td=${templateId}, client=js`);

  const params = new URLSearchParams({
    zcur: 'USD',
    lang: 'en',
    region: 'us',
    access_token: '20fbba871725d4506845a82bb678741bf', // ⚠️ EXPIRED TOKEN - needs fresh token from Zazzle
    td: templateId, // Template ID as URN
    client: 'js', // Note: js for this endpoint (not jsx as previously thought)
  });

  const url = `https://www.zazzle.com/svc/adobeexpress/getProductFromTemplate?${params.toString()}`;
  // eslint-disable-next-line no-console
  console.log('   ✅ Product Template URL built');
  return url;
}

/**
 * Build URL for Pricing API (product/pricing)
 * @param {string} templateId - Template ID (URN format)
 * @param {Object} productData - Product data for context (optional)
 * @returns {string} Complete API URL
 */
function buildPricingApiUrl(templateId, productData = null) {
  // eslint-disable-next-line no-console
  console.log('🔧 Building Pricing API URL...');

  const productId = extractProductIdFromUrn(templateId);
  if (!productId) {
    throw new Error(`Cannot extract product ID from URN: ${templateId}`);
  }

  // eslint-disable-next-line no-console
  console.log(`   📋 Parameters: pd=${productId}, dz=3f2b82c0-..., client=js`);

  // Build parameters in the exact order that works with Zazzle API
  const params = new URLSearchParams();
  params.set('zcur', 'USD');
  params.set('lang', 'en');
  params.set('region', 'us');
  params.set('access_token', '20fbba871725d4506845a82bb678741bf'); // ⚠️ EXPIRED TOKEN - needs fresh token from Zazzle
  params.set('dz', '3f2b82c0-a9f1-4321-9c42-8a3374a944d7'); // Design ID - would be dynamic in real implementation
  params.set('pd', productId); // Product ID (numeric)

  // Add product options (po parameter) BEFORE pt, qty, client - this is critical!
  const productOptions = buildProductOptions(templateId, productData);
  if (productOptions) {
    params.set('po', productOptions);
    // eslint-disable-next-line no-console
    console.log(`   📋 Product options (po): ${productOptions.substring(0, 50)}...`);
  }

  params.set('pt', 'zazzle_businesscard'); // Product type - would be dynamic in real implementation
  params.set('qty', '1');
  params.set('client', 'js');

  const url = `https://www.zazzle.com/svc/z3/product/pricing?${params.toString()}`;
  // eslint-disable-next-line no-console
  console.log('   ✅ Pricing URL built');
  return url;
}

/**
 * Build URL for Shipping Estimates API (shippingestimates/get)
 * @param {string} templateId - Template ID (URN format)
 * @param {Object} productData - Product data for context (optional)
 * @returns {string} Complete API URL
 */
function buildShippingApiUrl(templateId, productData = null) {
  // eslint-disable-next-line no-console
  console.log('🔧 Building Shipping API URL...');

  const productId = extractProductIdFromUrn(templateId);
  if (!productId) {
    throw new Error(`Cannot extract product ID from URN: ${templateId}`);
  }

  // eslint-disable-next-line no-console
  console.log(`   📋 Parameters: productId=${productId} (not pd!), client=js`);

  // Build parameters in the exact order that works with Zazzle API
  const params = new URLSearchParams();
  params.set('zcur', 'USD');
  params.set('lang', 'en');
  params.set('region', 'us');
  params.set('access_token', '20fbba871725d4506845a82bb678741bf'); // ⚠️ EXPIRED TOKEN - needs fresh token from Zazzle
  params.set('productId', productId); // Note: productId parameter (not pd)

  // Add product options (po parameter) BEFORE pt, qty, client - this is critical!
  const productOptions = buildProductOptions(templateId, productData);
  if (productOptions) {
    params.set('po', productOptions);
    // eslint-disable-next-line no-console
    console.log(`   📋 Product options (po): ${productOptions.substring(0, 50)}...`);
  }

  params.set('pt', 'zazzle_businesscard'); // Product type - would be dynamic in real implementation
  params.set('qty', '1');
  params.set('client', 'js');

  const url = `https://www.zazzle.com/svc/z3/shippingestimates/get?${params.toString()}`;
  // eslint-disable-next-line no-console
  console.log('   ✅ Shipping URL built');
  return url;
}

/**
 * Extract numeric product ID from URN
 * @param {string} urn - URN format: urn:aaid:sc:VA6C2:fd83f621-bdc5-5069-a9a5-b6c7a89709be
 * @returns {string|null} Numeric product ID
 */
function extractProductIdFromUrn(urn) {
  // This is a placeholder - in reality, you'd need to map URNs to product IDs
  // or get the product ID from the getProductFromTemplate response
  const urnToProductId = {
    'urn:aaid:sc:VA6C2:fd83f621-bdc5-5069-a9a5-b6c7a89709be': '256432838073857180',
  };

  return urnToProductId[urn] || null;
}

/**
 * Build product options string for API calls
 * @param {string} templateId - Template ID
 * @param {Object} productData - Product data
 * @returns {string} Product options string (not URL-encoded)
 */
function buildProductOptions(templateId, productData) {
  // Convert URN format: urn:aaid:sc:VA6C2:fd83f621-bdc5-5069-a9a5-b6c7a89709be
  // To: urn.aaid.sc.VA6C2.fd83f621_bdc5_5069_a9a5_b6c7a89709be
  const adobeProductId = templateId.replace(/:/g, '.').replace(/-/g, '_');

  const options = {
    style: '3.5x2',
    cornerstyle: 'normal',
    media: '175ptmatte',
    printquality: '4color',
    envelopes: 'none',
    'design.areas': '[zazzle_businesscard_business_front_front,zazzle_businesscard_business_back_back]',
    adobeproductid: adobeProductId,
  };

  // Convert to string - let URLSearchParams handle the encoding
  const optionsString = Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return optionsString;
}

/**
 * Load pricing data via live API
 * @param {string} templateId - Template ID for pricing calculation
 * @param {Object} productData - Product data for context
 * @returns {Promise<Object>} Pricing data
 */
async function loadPricingDataLive(templateId, productData = null) {
  // eslint-disable-next-line no-console
  console.log('🔄 Attempting to load LIVE pricing data...');

  try {
    const apiUrl = buildPricingApiUrl(templateId, productData);

    // eslint-disable-next-line no-console
    console.log('📡 Pricing API URL:', apiUrl);

    const response = await fetchThroughProxy(apiUrl);
    const data = await response.json();

    // eslint-disable-next-line no-console
    console.log('✅ LIVE pricing data loaded successfully:', data);

    return data.data || data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('❌ LIVE pricing API failed:', error.message);
    throw error;
  }
}

/**
 * Load shipping estimates via live API
 * @param {string} templateId - Template ID for shipping calculation
 * @param {Object} productData - Product data for context
 * @returns {Promise<Object>} Shipping estimates
 */
async function loadShippingEstimatesLive(templateId, productData = null) {
  // eslint-disable-next-line no-console
  console.log('🔄 Attempting to load LIVE shipping estimates...');

  try {
    const apiUrl = buildShippingApiUrl(templateId, productData);

    // eslint-disable-next-line no-console
    console.log('📡 Shipping API URL:', apiUrl);

    const response = await fetchThroughProxy(apiUrl);
    const data = await response.json();

    // eslint-disable-next-line no-console
    console.log('✅ LIVE shipping estimates loaded successfully:', data);

    return data.data || data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('❌ LIVE shipping API failed:', error.message);
    throw error;
  }
}

/**
 * Load localized strings via live API
 * @returns {Promise<Object>} Localized strings
 */
async function loadStringsLive() {
  // eslint-disable-next-line no-console
  console.log('🔄 Attempting to load LIVE localized strings...');

  try {
    // Use the correct Adobe Express strings URL
    const stringsUrl = 'https://w299ihl20.wxp.adobe-addons.com/distribute/private/JZnNGECCzfpgfcUmlgcNKgZKclyFP1YXLvq8rF3yfE9RI7inYDEPFaEGWDFv2ynr/0/w299ihl20/wxp-w299ihl20-version-1713829154591/strings/adobePdp.en-us.js';

    // eslint-disable-next-line no-console
    console.log('📡 Strings URL:', stringsUrl);

    const response = await fetchThroughProxy(stringsUrl);
    const text = await response.text();

    // eslint-disable-next-line no-console
    console.log('📡 Strings response length:', text.length, 'characters');
    // eslint-disable-next-line no-console
    console.log('📡 First 200 chars of strings response:', text.substring(0, 200));
    // eslint-disable-next-line no-console
    console.log('📡 Last 50 chars of full response:', text.substring(Math.max(0, text.length - 50)));

    // Create a clickable link to view the full response
    const dataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
    // eslint-disable-next-line no-console
    console.log('🔗 CLICK TO VIEW FULL STRINGS RESPONSE:', dataUrl);
    // eslint-disable-next-line no-console
    console.log('📋 Or copy this URL to browser:', dataUrl);

    // Parse the JavaScript module export using a more robust method
    // The format is: export default JSON.parse('...')
    // But the JSON inside might have escaped quotes that break simple regex

    try {
      // Method 1: Properly handle the JavaScript string literal
      if (text.startsWith('export default JSON.parse(')) {
        // Extract everything between the parentheses
        const startIdx = text.indexOf('JSON.parse(') + 'JSON.parse('.length;
        const endIdx = text.lastIndexOf(')');

        if (startIdx > 0 && endIdx > startIdx) {
          const jsonParseArg = text.substring(startIdx, endIdx);
          // eslint-disable-next-line no-console
          console.log('📡 Extracted JSON.parse argument length:', jsonParseArg.length);

          // The argument is a single-quoted string literal with escaped quotes
          // We need to properly parse it as a JavaScript string literal
          if (jsonParseArg.startsWith("'") && jsonParseArg.endsWith("'")) {
            // Remove the outer quotes and handle escaped characters
            let jsonString = jsonParseArg.slice(1, -1);

            // Replace escaped quotes and other escape sequences
            jsonString = jsonString
              .replace(/\\'/g, "'") // Escaped single quotes
              .replace(/\\"/g, '"') // Escaped double quotes
              .replace(/\\\\/g, '\\'); // Escaped backslashes

            const strings = JSON.parse(jsonString);
            // eslint-disable-next-line no-console
            console.log('✅ LIVE strings loaded successfully:', Object.keys(strings).length, 'strings');
            return strings;
          }
        }
      }

      // Method 2: Fallback to regex if the above doesn't work
      const jsonMatch = text.match(/JSON\.parse\('(.+)'\)/s);
      if (jsonMatch) {
        // eslint-disable-next-line no-console
        console.log('📡 Using fallback regex method...');
        const strings = JSON.parse(jsonMatch[1]);
        // eslint-disable-next-line no-console
        console.log('✅ LIVE strings loaded successfully (fallback):', Object.keys(strings).length, 'strings');
        return strings;
      }
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.log('❌ All parsing methods failed:', parseError.message);
      // eslint-disable-next-line no-console
      console.log('📡 Response format might be unexpected, using empty strings object');
      return {};
    }

    // eslint-disable-next-line no-console
    console.log('⚠️ Could not find JSON.parse pattern in response');
    throw new Error('Failed to parse strings response');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('❌ LIVE strings API failed:', error.message);
    throw error;
  }
}

/**
 * Fetch data through CORS proxy
 * @param {string} url - Target URL to fetch
 * @returns {Promise<Response>} Fetch response
 */
async function fetchThroughProxy(url) {
  const proxyUrl = `http://localhost:8081?url=${encodeURIComponent(url)}`;

  // eslint-disable-next-line no-console
  console.log('🔗 Fetching through proxy:', proxyUrl);

  try {
    const response = await fetch(proxyUrl);
    // eslint-disable-next-line no-console
    console.log('📡 Proxy response status:', response.status, response.ok ? '✅' : '❌');

    // If we get a response, check if it's a Zazzle API error
    if (response.ok) {
      const text = await response.text();
      // eslint-disable-next-line no-console
      console.log('📡 Raw response (first 200 chars):', text.substring(0, 200));

      if (text.includes('"success":false')) {
        // eslint-disable-next-line no-console
        console.log('⚠️  Zazzle API returned error:', text);
        throw new Error(`Zazzle API error: ${text}`);
      }
      // Return a new response with the text
      return new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('❌ Proxy fetch failed:', error.message);
    throw error;
  }
}

/**
 * Load product data - supports both local JSON and live API via proxy
 * @param {string} templateId - Template ID
 * @param {boolean} useLocalData - Whether to use local JSON files (default: true)
 * @returns {Promise<Object>} Product data
 */
async function loadProductData(templateId, useLocalData = true) {
  // eslint-disable-next-line no-console
  console.log('\n🚀 ========== PDP-X DATA LOADING ==========');
  // eslint-disable-next-line no-console
  console.log(`📋 Template ID: ${templateId}`);
  // eslint-disable-next-line no-console
  console.log(`🔧 Mode: ${useLocalData ? '🏠 LOCAL JSON FILES' : '🌐 LIVE ZAZZLE APIs'}`);
  // eslint-disable-next-line no-console
  console.log('==========================================\n');

  try {
    if (useLocalData) {
      // eslint-disable-next-line no-console
      console.log('📂 Loading LOCAL data sources...');

      // Determine which sample data to use
      const urlParams = new URLSearchParams(window.location.search);
      const useShirtData = urlParams.has('shirt') || document.querySelector('[data-use-shirt-data]');
      const sampleDataFile = useShirtData ? 'build-sample-2.json' : 'build-sample.json';
      // Use local JSON files for development/testing
      const [productData, pricingData, shippingData, strings] = await Promise.all([
        fetch(`/express/code/blocks/pdp-x/pdp-x-testing/template-sample-data/${sampleDataFile}`).then((r) => r.json()),
        loadPricingData(),
        loadShippingEstimates(),
        loadStrings(),
      ]);

      // eslint-disable-next-line no-console
      console.log('✅ LOCAL product data loaded');
      // eslint-disable-next-line no-console
      console.log('✅ LOCAL pricing data loaded');
      // eslint-disable-next-line no-console
      console.log('✅ LOCAL shipping data loaded');
      // eslint-disable-next-line no-console
      console.log('✅ LOCAL strings loaded');

      // Replace the basic pricing with the complete pricing data from sample-pricing-data.json
      productData.data.product.pricing = pricingData;

      // Add shipping and strings data
      productData.data.shipping = shippingData;
      productData.data.strings = strings;

      // eslint-disable-next-line no-console
      console.log('\n🎉 SUCCESS: Complete LOCAL product data assembled!');

      return productData.data;
    }
    // eslint-disable-next-line no-console
    console.log('🌐 Loading LIVE API data sources...');

    // Use live Zazzle APIs via CORS proxy
    const productApiUrl = buildProductTemplateApiUrl(templateId);

    // eslint-disable-next-line no-console
    console.log('📡 Product API URL:', productApiUrl);

    // Load APIs individually to handle partial failures better
    const results = await Promise.allSettled([
      fetchThroughProxy(productApiUrl),
      loadPricingDataLive(templateId),
      loadShippingEstimatesLive(templateId),
      loadStringsLive(),
    ]);

    // Extract results, using defaults for failed APIs
    const [productResult, pricingResult, shippingResult, stringsResult] = results;

    // eslint-disable-next-line no-console
    console.log('📊 API Results Summary:');
    // eslint-disable-next-line no-console
    console.log('   Product Template:', productResult.status === 'fulfilled' ? '✅' : '❌', productResult.status === 'rejected' ? productResult.reason.message : 'Success');
    // eslint-disable-next-line no-console
    console.log('   Pricing:', pricingResult.status === 'fulfilled' ? '✅' : '❌', pricingResult.status === 'rejected' ? pricingResult.reason.message : 'Success');
    // eslint-disable-next-line no-console
    console.log('   Shipping:', shippingResult.status === 'fulfilled' ? '✅' : '❌', shippingResult.status === 'rejected' ? shippingResult.reason.message : 'Success');
    // eslint-disable-next-line no-console
    console.log('   Strings:', stringsResult.status === 'fulfilled' ? '✅' : '❌', stringsResult.status === 'rejected' ? stringsResult.reason.message : 'Success');

    // Get successful data or use defaults
    const productResponse = productResult.status === 'fulfilled' ? productResult.value : null;
    const pricingData = pricingResult.status === 'fulfilled' ? pricingResult.value : { unitPrice: 0, volumeDiscountTiers: [] };
    const shippingData = shippingResult.status === 'fulfilled' ? shippingResult.value : { estimates: [] };
    const strings = stringsResult.status === 'fulfilled' ? stringsResult.value : {};

    // Handle product API response
    let productData;
    if (productResponse) {
      try {
        // eslint-disable-next-line no-console
        console.log('🔄 Processing product API response...');
        productData = await productResponse.json();
        // eslint-disable-next-line no-console
        console.log('✅ Product data parsed successfully');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('❌ Failed to parse product response:', error.message);
        productData = null;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('❌ No product response available');
      productData = null;
    }

    // If product API failed, use a minimal structure
    if (!productData || !productData.data) {
      // eslint-disable-next-line no-console
      console.log('🔧 Using fallback product structure...');
      productData = {
        data: {
          product: {
            title: 'Product',
            description: '',
            quantities: [1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 500],
            singularUnitLabel: 'pack of 100',
            pluralUnitLabel: 'packs of 100',
            attributes: {
              style: { title: 'Size', values: [{ title: 'Standard, 3.5" x 2.0"', isBestValue: true }] },
              cornerstyle: {
                title: 'Corner Style',
                values: [
                  { title: 'Squared', internalName: 'normal', isBestValue: true, priceDifferential: 0 },
                  { title: 'Rounded', internalName: 'allrounded', priceDifferential: 5.35 },
                ],
              },
              media: {
                title: 'Paper',
                values: [{ title: 'Signature Matte', isBestValue: true, priceDifferential: 0, descriptionBrief: '18 pt thickness / 120 lb weight<br>Light eggshell white, uncoated matte finish' }],
              },
            },
            realviews: [],
          },
        },
      };
    }

    // eslint-disable-next-line no-console
    console.log('✅ LIVE product data processed');

    // Merge all data sources
    productData.data.product.pricing = pricingData;
    productData.data.shipping = shippingData;
    productData.data.strings = strings;

    // Count successful APIs
    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const totalApis = results.length;

    // eslint-disable-next-line no-console
    console.log(`\n🎉 LIVE MODE: ${successCount}/${totalApis} APIs successful - Page rendered with available data!`);

    return productData.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('\n❌ CRITICAL ERROR: Failed to load product data');
    // eslint-disable-next-line no-console
    console.error('Error details:', error);
    throw error;
  }
}

/**
 * Build image URL from realview parameters
 * @param {Object} realviewParams - Realview parameters
 * @param {number} maxDim - Maximum dimension
 * @returns {string} Image URL
 */
function buildImageUrl(realviewParams, maxDim = 644) {
  const params = new URLSearchParams();

  Object.entries(realviewParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.set(key, value);
    }
  });

  // Override max_dim if specified
  params.set('max_dim', maxDim);

  return `https://rlv.zcache.com/svc/view?${params.toString()}`;
}

/**
 * Create image gallery component
 * @param {Object} productData - Product data from API
 * @returns {HTMLElement} Image gallery element
 */
function createImageGallery(productData) {
  const { product } = productData;
  const realviews = product.realviews || [];

  // Filter to get main product views (not design-only views)
  const mainViews = realviews.filter((rv) => rv.type === 'Product' && rv.canBePreferred);

  const gallery = createTag('section', {
    class: 'image-gallery',
    'aria-label': 'Product images',
  });

  // Hero image container
  const heroContainer = createTag('div', { class: 'hero-image-container' });
  const heroImageDiv = createTag('div', { class: 'hero-image' });

  const heroImg = createTag('img', {
    class: 'hero-img',
    alt: product.title || 'Product image',
    loading: 'eager',
    fetchpriority: 'high',
  });

  // Set initial image from preferred realview
  if (product.initialPrettyPreferredViewUrl) {
    heroImg.src = product.initialPrettyPreferredViewUrl;
  } else if (mainViews.length > 0) {
    heroImg.src = buildImageUrl(mainViews[0].realviewParams);
  }

  heroImageDiv.appendChild(heroImg);
  heroContainer.appendChild(heroImageDiv);
  gallery.appendChild(heroContainer);

  // Thumbnail gallery
  if (mainViews.length > 1) {
    const thumbnailGallery = createTag('div', {
      class: 'thumbnail-gallery',
      role: 'group',
      'aria-label': 'Product image thumbnails',
    });

    const thumbnailContainer = createTag('div', { class: 'thumbnail-container' });

    mainViews.forEach((realview, index) => {
      const button = createTag('button', {
        class: `thumbnail ${index === 0 ? 'selected' : ''}`,
        'aria-pressed': index === 0 ? 'true' : 'false',
        'aria-label': `View ${realview.title || `image ${index + 1}`}`,
        'data-realview-id': realview.id,
      });

      const thumbImg = createTag('img', {
        src: buildImageUrl(realview.realviewParams, 120),
        alt: `${realview.title || 'Product view'} thumbnail`,
        width: '76',
        height: '76',
        loading: 'lazy',
      });

      button.appendChild(thumbImg);

      // Add click handler
      button.addEventListener('click', () => {
        // Update hero image
        heroImg.src = buildImageUrl(realview.realviewParams);
        heroImg.alt = realview.title || 'Product image';

        // Update selected state
        thumbnailContainer.querySelectorAll('.thumbnail').forEach((thumb, i) => {
          thumb.classList.toggle('selected', i === index);
          thumb.setAttribute('aria-pressed', i === index ? 'true' : 'false');
        });
      });

      thumbnailContainer.appendChild(button);
    });

    thumbnailGallery.appendChild(thumbnailContainer);
    gallery.appendChild(thumbnailGallery);
  }

  return gallery;
}

/**
 * Create quantity selector
 * @param {Object} productData - Product data from API
 * @returns {HTMLElement} Quantity selector element
 */
function createQuantitySelector(productData) {
  const { product } = productData;
  const quantities = product.quantities || [1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 500];

  const container = createTag('div', { class: 'quantity-section' });

  const title = createTag('h2', { class: 'section-title' });
  title.textContent = 'Quantity';
  container.appendChild(title);

  const selectWrapper = createTag('div', { class: 'select-wrapper' });
  const select = createTag('select', {
    class: 'quantity-select',
    id: 'quantity-select',
  });

  quantities.forEach((qty) => {
    const option = createTag('option', { value: qty });
    const unitLabel = product.singularUnitLabel || 'item';
    const pluralLabel = product.pluralUnitLabel || 'items';

    // Build option text
    let optionText = `${qty} ${qty === 1 ? unitLabel : pluralLabel}`;

    // Use real volume discount tiers from pricing API
    const pricingData = productData.product.pricing;
    if (pricingData?.volumeDiscountTiers) {
      const volumeTier = pricingData.volumeDiscountTiers.find((tier) => qty >= tier.minQuantity && qty <= tier.maxQuantity);

      if (volumeTier?.hasDiscount && volumeTier.discount) {
        // Use localized string format
        const strings = productData.strings || {};
        const saveString = strings.zi_product_PDP_QuantitySelector_Save || '(Save {discount})';
        optionText += ` ${saveString.replace('{discount}', volumeTier.discount)}`;
      }
    }

    option.textContent = optionText;
    select.appendChild(option);
  });

  selectWrapper.appendChild(select);
  container.appendChild(selectWrapper);

  return { container, select };
}

/**
 * Create pricing display with comparison pricing
 * @param {Object} productData - Product data from API
 * @returns {HTMLElement} Pricing display element
 */
function createPricingDisplay(productData) {
  const { product } = productData;

  // Use the pricing data from sample-pricing-data.json
  const pricingData = product.pricing;
  const discountProductItem = pricingData?.discountProductItems?.[0];

  // Get actual prices from the pricing API data
  const comparisonPrice = discountProductItem?.price || pricingData?.unitPrice || 0;
  const actualPrice = discountProductItem?.priceAdjusted || comparisonPrice;

  const container = createTag('div', { class: 'pricing-section' });

  const priceDiv = createTag('div', { class: 'price-display' });
  const currentPrice = createTag('div', { class: 'current-price' });
  currentPrice.textContent = `$${actualPrice.toFixed(2)}`;

  // Add comparison pricing (strikethrough)
  const comparisonDiv = createTag('div', { class: 'comparison-pricing' });
  const strikethrough = createTag('div', { class: 'strikethrough-price' });
  strikethrough.textContent = `$${comparisonPrice.toFixed(2)}`;
  const compLabel = createTag('div', { class: 'comp-label' });
  compLabel.textContent = 'Comp. value';

  comparisonDiv.appendChild(strikethrough);
  comparisonDiv.appendChild(compLabel);

  priceDiv.appendChild(currentPrice);
  priceDiv.appendChild(comparisonDiv);

  // Note: Removed static promo label since savings are dynamic based on quantity

  container.appendChild(priceDiv);

  return { container, currentPrice };
}

/**
 * Create shipping info section
 * @param {Object} productData - Product data from API
 * @returns {HTMLElement} Shipping info element
 */
function createShippingInfo(productData) {
  const { shipping, strings } = productData;
  const container = createTag('div', { class: 'shipping-section' });

  const title = createTag('h2', { class: 'shipping-title' });
  title.innerHTML = `
    <svg class="shipping-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 3h10v8H2z" fill="currentColor"/>
    </svg>
    ${strings?.zi_product_ShippingEstimates_SeeShippingOptions || 'Shipping options'}
  `;

  const eta = createTag('span', { class: 'shipping-eta' });

  // Use real shipping estimates if available
  if (shipping?.estimates?.length > 0) {
    const standardShipping = shipping.estimates.find((est) => est.method === 'STANDARD');
    if (standardShipping) {
      const minDate = new Date(standardShipping.minDeliveryDate);
      const maxDate = new Date(standardShipping.maxDeliveryDate);
      const dateRange = formatDateRange(minDate, maxDate);

      const etaString = strings?.zi_product_ShippingEstimates_OrderToday_GetByDate || 'Order today and get it by {date}';
      eta.textContent = etaString.replace('{date}', dateRange);
    } else {
      eta.textContent = 'Order today and get it by Sep 22 - 25';
    }
  } else {
    eta.textContent = 'Order today and get it by Sep 22 - 25';
  }

  container.appendChild(title);
  container.appendChild(eta);

  return container;
}

/**
 * Format date range for shipping estimates
 * @param {Date} minDate - Minimum delivery date
 * @param {Date} maxDate - Maximum delivery date
 * @returns {string} Formatted date range
 */
function formatDateRange(minDate, maxDate) {
  const options = { month: 'short', day: 'numeric' };
  const minFormatted = minDate.toLocaleDateString('en-US', options);
  const maxFormatted = maxDate.toLocaleDateString('en-US', options);

  if (minFormatted === maxFormatted) {
    return minFormatted;
  }

  return `${minFormatted} - ${maxFormatted}`;
}

/**
 * Create about product section
 * @param {Object} productData - Product data from API
 * @returns {HTMLElement} About product element
 */
function createAboutProduct(productData) {
  const { product, strings } = productData;
  const container = createTag('div', { class: 'about-product' });

  const title = createTag('h2', { class: 'about-title' });
  title.textContent = strings?.zi_product_PDP_ProductDescription_Title || 'About this product';
  container.appendChild(title);

  // Size information
  const sizeInfo = createTag('div', { class: 'product-info' });
  const sizeValue = product.attributes?.style?.values?.[0];
  if (sizeValue) {
    const sizeDiv = createTag('div', { class: 'size-info' });
    sizeDiv.textContent = `Size: ${sizeValue.title}`;
    sizeInfo.appendChild(sizeDiv);

    if (sizeValue.description) {
      const sizeDesc = createTag('div', { class: 'size-description' });
      sizeDesc.innerHTML = sizeValue.description;
      sizeInfo.appendChild(sizeDesc);
    }
  }

  // Paper information
  const mediaValue = product.attributes?.media?.values?.find((v) => v.isBestValue);
  if (mediaValue) {
    const paperDiv = createTag('div', { class: 'paper-info' });
    paperDiv.textContent = `Paper: ${mediaValue.title}`;
    sizeInfo.appendChild(paperDiv);

    if (mediaValue.description) {
      const paperDesc = createTag('div', { class: 'paper-description-full' });
      paperDesc.innerHTML = mediaValue.description;
      sizeInfo.appendChild(paperDesc);
    }
  }

  container.appendChild(sizeInfo);

  return container;
}

/**
 * Create attribute selector
 * @param {string} attributeName - Attribute name (e.g., 'style', 'media')
 * @param {Object} attributeData - Attribute data from API
 * @param {Function} onChange - Change handler
 * @returns {HTMLElement} Attribute selector element
 */
function createAttributeSelector(attributeName, attributeData, onChange) {
  const container = createTag('div', { class: `attribute-selector ${attributeName}-selector` });

  const title = createTag('h3', { class: 'attribute-title' });
  title.textContent = attributeData.title || attributeName;
  container.appendChild(title);

  const values = attributeData.values || [];

  if (attributeName === 'media') {
    // Paper type - show with thumbnails and descriptions
    const paperGrid = createTag('div', { class: 'paper-grid' });

    // Group by standard/signature/premium
    const groups = {};
    values.forEach((value) => {
      const group = value.properties?.group || 'standard';
      if (!groups[group]) groups[group] = [];
      groups[group].push(value);
    });

    Object.entries(groups).forEach(([groupName, groupValues]) => {
      const groupDiv = createTag('div', { class: `paper-group ${groupName}` });
      const groupTitle = createTag('h4', { class: 'paper-group-title' });
      groupTitle.textContent = groupName.charAt(0).toUpperCase() + groupName.slice(1);
      groupDiv.appendChild(groupTitle);

      const optionsDiv = createTag('div', { class: 'paper-options' });

      groupValues.forEach((value) => {
        const option = createTag('label', {
          class: `paper-option ${value.isBestValue ? 'best-value' : ''}`,
          title: value.titleLong || value.title,
        });

        const radio = createTag('input', {
          type: 'radio',
          name: `${attributeName}-group`,
          value: value.internalName,
          checked: value.isBestValue ? 'checked' : null,
        });

        const preview = createTag('div', { class: 'paper-preview' });
        if (value.swatchParams) {
          const swatchImg = createTag('img', {
            src: buildImageUrl(value.swatchParams, 48),
            alt: value.title,
            width: '48',
            height: '48',
          });
          preview.appendChild(swatchImg);
        }

        const details = createTag('div', { class: 'paper-details' });
        const name = createTag('div', { class: 'paper-name' });
        name.textContent = value.title;

        const price = createTag('div', { class: 'paper-price' });
        if (value.priceDifferential > 0) {
          price.textContent = `+$${value.priceDifferential.toFixed(2)}`;
        } else {
          price.textContent = '+$0.00';
        }

        details.appendChild(name);
        details.appendChild(price);

        if (value.descriptionBrief) {
          const desc = createTag('div', { class: 'paper-description' });
          desc.innerHTML = value.descriptionBrief;
          details.appendChild(desc);
        }

        option.appendChild(radio);
        option.appendChild(preview);
        option.appendChild(details);

        radio.addEventListener('change', () => {
          if (radio.checked) {
            onChange(attributeName, value);
          }
        });

        optionsDiv.appendChild(option);
      });

      groupDiv.appendChild(optionsDiv);
      paperGrid.appendChild(groupDiv);
    });

    container.appendChild(paperGrid);
  } else if (attributeName === 'cornerstyle') {
    // Corner style - show with visual previews
    const cornerOptions = createTag('div', { class: 'corner-options' });

    values.forEach((value, index) => {
      const option = createTag('button', {
        class: `corner-option ${value.isBestValue ? 'selected' : ''}`,
        'aria-pressed': value.isBestValue ? 'true' : 'false',
        'data-value': value.internalName,
      });

      const preview = createTag('div', {
        class: `corner-preview ${value.internalName}`,
      });

      const details = createTag('div', { class: 'corner-details' });
      const name = createTag('span', { class: 'corner-name' });
      name.textContent = value.title;

      const price = createTag('span', { class: 'corner-price' });
      if (value.priceDifferential > 0) {
        price.textContent = `+$${value.priceDifferential.toFixed(2)}`;
      } else {
        price.textContent = '+$0.00';
      }

      details.appendChild(name);
      details.appendChild(price);

      option.appendChild(preview);
      option.appendChild(details);

      option.addEventListener('click', () => {
        // Update selected state
        cornerOptions.querySelectorAll('.corner-option').forEach((opt, i) => {
          opt.classList.toggle('selected', i === index);
          opt.setAttribute('aria-pressed', i === index ? 'true' : 'false');
        });

        onChange(attributeName, value);
      });

      cornerOptions.appendChild(option);
    });

    container.appendChild(cornerOptions);
  } else {
    // Default dropdown for other attributes
    const select = createTag('select', {
      class: `attribute-select ${attributeName}-select`,
      id: `${attributeName}-select`,
    });

    values.forEach((value) => {
      const option = createTag('option', {
        value: value.internalName,
        selected: value.isBestValue ? 'selected' : null,
      });

      let optionText = value.title;
      if (value.priceDifferential > 0) {
        optionText += ` (+$${value.priceDifferential.toFixed(2)})`;
      }

      option.textContent = optionText;
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      const selectedValue = values.find((v) => v.internalName === select.value);
      if (selectedValue) {
        onChange(attributeName, selectedValue);
      }
    });

    container.appendChild(select);
  }

  return container;
}

/**
 * Create CTA button
 * @param {Object} productData - Product data from API
 * @param {string} templateId - Template ID for Adobe Express
 * @returns {HTMLElement} CTA button element
 */
function createCTAButton(productData, templateId) {
  const ctaSection = createTag('div', { class: 'cta-section' });

  const button = createTag('button', {
    class: 'primary-cta',
    type: 'button',
  });

  const icon = createTag('div', { class: 'cta-icon' });
  icon.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M13.873 0a4.114 4.114 0 0 0-2.919 1.206l-9.36 9.367a2.011 2.011 0 0 0-.586 1.41L1 15.99a1 1 0 0 0 .998 1.002L6.013 17a2.01 2.01 0 0 0 1.42-.586l9.384-9.385A4.122 4.122 0 0 0 18 4.129 4.121 4.121 0 0 0 13.873 0Zm0 1.999c.586 0 2.128.458 2.128 2.125a2.15 2.15 0 0 1-.622 1.513l-.098.098-3.012-3.014.1-.1c.414-.414.96-.622 1.505-.622Zm-9.19 8.312 6.172-6.175 3.012 3.014-6.175 6.176a4.996 4.996 0 0 0-3.008-3.015ZM3 12a3.01 3.01 0 0 1 3 3H3v-3Z" fill="currentColor"/>
    </svg>
  `;

  const text = createTag('span', { class: 'cta-text' });
  text.textContent = 'Customize and print it';

  button.appendChild(icon);
  button.appendChild(text);

  // Add click handler to open Adobe Express
  button.addEventListener('click', () => {
    const adobeUrl = `https://w299ihl20.wxp.adobe-addons.com/distribute/private/JZnNGECCzfpgfcUmlgcNKgZKclyFP1YXLvq8rF3yfE9RI7inYDEPFaEGWDFv2ynr/0/w299ihl20/wxp-w299ihl20-version-1713829154591/adobePdp.html?TD=${encodeURIComponent(templateId)}`;
    window.open(adobeUrl, '_blank');
  });

  ctaSection.appendChild(button);

  // Add satisfaction guarantee
  const guarantee = createTag('div', { class: 'satisfaction-guarantee' });
  guarantee.innerHTML = `
    Printing through Zazzle with a promise of 
    <a href="https://www.zazzle.com/returns" target="_blank">100% satisfaction</a>
  `;
  ctaSection.appendChild(guarantee);

  return ctaSection;
}

/**
 * Check if option combination is valid based on dependencies and restrictions
 * @param {Object} productData - Product data
 * @param {Object} selections - Current selections
 * @param {string} attributeName - Attribute being changed
 * @param {Object} value - New value being selected
 * @returns {boolean} Whether the combination is valid
 */
function isValidOptionCombination(productData, selections, attributeName, value) {
  // Check for specific restrictions like "Not available for rounded corner option"
  if (attributeName === 'cornerstyle' && value.internalName === 'allrounded') {
    const selectedMedia = selections.media;
    if (selectedMedia && selectedMedia.description
        && selectedMedia.description.includes('Not available for rounded corner option')) {
      return false;
    }
  }

  if (attributeName === 'media' && value.description
      && value.description.includes('Not available for rounded corner option')) {
    const selectedCorner = selections.cornerstyle;
    if (selectedCorner && selectedCorner.internalName === 'allrounded') {
      return false;
    }
  }

  return true;
}

/**
 * Update option availability based on current selections
 * @param {Object} productData - Product data
 * @param {Object} selections - Current selections
 */
function updateOptionAvailability(productData, selections) {
  // Update corner style options based on paper selection
  const cornerOptions = document.querySelectorAll('.corner-option');
  cornerOptions.forEach((option) => {
    const { value } = option.dataset;
    const cornerValue = productData.product.attributes.cornerstyle.values
      .find((v) => v.internalName === value);

    if (cornerValue) {
      const isValid = isValidOptionCombination(productData, selections, 'cornerstyle', cornerValue);
      option.disabled = !isValid;
      option.classList.toggle('disabled', !isValid);

      if (!isValid && option.classList.contains('selected')) {
        // Auto-select alternative if current selection becomes invalid
        const validOption = document.querySelector('.corner-option:not(.disabled)');
        if (validOption) {
          validOption.click();
        }
      }
    }
  });

  // Update paper options based on corner selection
  const paperOptions = document.querySelectorAll('.paper-option input[type="radio"]');
  paperOptions.forEach((radio) => {
    const { value } = radio;
    const paperValue = productData.product.attributes.media.values
      .find((v) => v.internalName === value);

    if (paperValue) {
      const isValid = isValidOptionCombination(productData, selections, 'media', paperValue);
      radio.disabled = !isValid;
      radio.closest('.paper-option').classList.toggle('disabled', !isValid);

      if (!isValid && radio.checked) {
        // Auto-select alternative if current selection becomes invalid
        const validRadio = document.querySelector('.paper-option input[type="radio"]:not(:disabled)');
        if (validRadio) {
          validRadio.checked = true;
          validRadio.dispatchEvent(new Event('change'));
        }
      }
    }
  });
}

/**
 * Update pricing based on current selections
 * @param {Object} productData - Product data
 * @param {Object} selections - Current attribute selections
 * @param {HTMLElement} priceElement - Price display element
 */
function updatePricing(productData, selections, priceElement) {
  const { product, strings } = productData;

  // Use the business card pricing from build-sample.json, not the sample-pricing-data.json
  // The sample-pricing-data.json is for a different product (invitations at $2.40)
  let baseUnitPrice = product.pricing?.unitPrice || 0;

  // Add price differentials from selected options
  Object.entries(selections).forEach(([attributeName, selectedValue]) => {
    if (selectedValue && selectedValue.priceDifferential) {
      baseUnitPrice += selectedValue.priceDifferential;
    }
  });

  // Get quantity
  const quantitySelect = document.querySelector('.quantity-select');
  const quantity = quantitySelect ? parseInt(quantitySelect.value, 10) : 1;

  // Use real pricing data structure from sample-pricing-data.json
  const pricingData = product.pricing;

  // Find volume discount tier for current quantity
  const volumeTier = pricingData?.volumeDiscountTiers?.find((tier) => quantity >= tier.minQuantity && quantity <= tier.maxQuantity);

  // Calculate final price using real discount structure
  const discountPercent = volumeTier?.discountPercent || 0;

  // Apply discount to unit price first
  const discountedUnitPrice = baseUnitPrice * (1 - discountPercent);

  // Round UP the discounted unit price to nearest cent (Zazzle's customer-favorable rounding)
  const finalUnitPrice = Math.ceil(discountedUnitPrice * 100) / 100;

  // Multiply by quantity to get final price
  const finalPrice = finalUnitPrice * quantity;

  // Comparison price (without discount)
  const comparisonPrice = baseUnitPrice * quantity;

  // Format prices using currency formatter
  priceElement.textContent = formatCurrency(finalPrice);

  // Update comparison price
  const comparisonElement = document.querySelector('.strikethrough-price');
  if (comparisonElement) {
    comparisonElement.textContent = formatCurrency(comparisonPrice);
  }

  // Update comp value label with localized string
  const compLabel = document.querySelector('.comp-label');
  if (compLabel && strings) {
    compLabel.textContent = strings.zi_product_Price_CompValue || 'Comp. value';
  }
}

/**
 * Format currency using proper locale formatting
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Update product descriptions based on current selections
 * @param {Object} productData - Product data
 * @param {Object} selections - Current selections
 */
function updateProductDescriptions(productData, selections) {
  // Update paper description in about section
  const paperDescElement = document.querySelector('.paper-description-full');
  if (paperDescElement && selections.media) {
    paperDescElement.innerHTML = selections.media.description || '';
  }

  // Update paper info display
  const paperInfoElement = document.querySelector('.paper-info');
  if (paperInfoElement && selections.media) {
    paperInfoElement.textContent = `Paper: ${selections.media.title}`;
  }
}

/**
 * Update realview images based on current selections
 * @param {Object} productData - Product data
 * @param {Object} selections - Current selections
 */
function updateRealviewImages(productData, selections) {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  // Get currently selected thumbnail to preserve the view (Front, Back, etc.)
  const selectedThumbnail = document.querySelector('.thumbnail.selected');
  const currentRealviewId = selectedThumbnail?.dataset.realviewId;

  if (!currentRealviewId) return;

  // Find the current realview
  const currentRealview = productData.product.realviews?.find((rv) => rv.id === currentRealviewId);
  if (!currentRealview) return;

  // Build new realview params with current selections
  const updatedParams = { ...currentRealview.realviewParams };
  debugger;
  // Update params based on current selections
  if (selections.media?.internalName) {
    updatedParams.media = selections.media.internalName;
  }
  if (selections.cornerstyle?.internalName) {
    updatedParams.cornerstyle = selections.cornerstyle.internalName;
  }
  if (selections.printquality?.internalName) {
    updatedParams.printquality = selections.printquality.internalName;
  }
  if (selections.envelopes?.internalName) {
    updatedParams.envelopes = selections.envelopes.internalName;
  }

  // Update the hero image with new parameters while keeping the same view
  heroImg.src = buildImageUrl(updatedParams);

  // Update all thumbnails with new parameters
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach((thumb) => {
    const thumbRealviewId = thumb.dataset.realviewId;
    const thumbRealview = productData.product.realviews?.find((rv) => rv.id === thumbRealviewId);

    if (thumbRealview) {
      const thumbUpdatedParams = { ...thumbRealview.realviewParams };

      // Apply same selection updates to thumbnail
      if (selections.media?.internalName) {
        thumbUpdatedParams.media = selections.media.internalName;
      }
      if (selections.cornerstyle?.internalName) {
        thumbUpdatedParams.cornerstyle = selections.cornerstyle.internalName;
      }
      if (selections.printquality?.internalName) {
        thumbUpdatedParams.printquality = selections.printquality.internalName;
      }
      if (selections.envelopes?.internalName) {
        thumbUpdatedParams.envelopes = selections.envelopes.internalName;
      }

      const thumbImg = thumb.querySelector('img');
      if (thumbImg) {
        thumbImg.src = buildImageUrl(thumbUpdatedParams, 120);
      }
    }
  });
}

/**
 * Update design areas based on current selections
 * @param {Object} productData - Product data
 * @param {Object} selections - Current selections
 */
function updateDesignAreas(productData, selections) {
  // Design areas change based on corner style selection
  const currentCorner = selections.cornerstyle;
  if (currentCorner && currentCorner.properties && currentCorner.properties['design.areas']) {
    const designAreas = currentCorner.properties['design.areas'];
    // eslint-disable-next-line no-console
    console.log('Design areas updated:', designAreas);

    // This would be used by Adobe Express integration
    // Store the current design areas for when user clicks "Customize"
    if (window.pdpXState) {
      window.pdpXState.designAreas = designAreas;
    } else {
      window.pdpXState = { designAreas };
    }
  }
}

/**
 * Update stock status display
 * @param {Object} productData - Product data
 * @param {Object} selections - Current selections
 */
function updateStockStatus(productData, selections) {
  // Check stock status of current selections
  let allInStock = true;
  let hasShortTermIssues = false;

  Object.entries(selections).forEach(([attributeName, selectedValue]) => {
    if (selectedValue) {
      if (!selectedValue.isInStock) {
        allInStock = false;
      }
      if (!selectedValue.isInStockShortTerm) {
        hasShortTermIssues = true;
      }
    }
  });

  // Update CTA button based on stock status
  const ctaButton = document.querySelector('.primary-cta');
  if (ctaButton) {
    if (!allInStock) {
      ctaButton.disabled = true;
      ctaButton.textContent = 'Out of Stock';
      ctaButton.classList.add('out-of-stock');
    } else if (hasShortTermIssues) {
      ctaButton.classList.add('limited-stock');
      // Could add a warning about longer shipping times
    } else {
      ctaButton.disabled = false;
      ctaButton.querySelector('.cta-text').textContent = 'Customize and print it';
      ctaButton.classList.remove('out-of-stock', 'limited-stock');
    }
  }
}

/**
 * Comprehensive update of all dynamic elements
 * @param {Object} productData - Product data
 * @param {Object} selections - Current selections
 * @param {HTMLElement} priceElement - Price display element
 */
function updateAllDynamicElements(productData, selections, priceElement) {
  updateOptionAvailability(productData, selections);
  updatePricing(productData, selections, priceElement);
  updateProductDescriptions(productData, selections);
  updateRealviewImages(productData, selections);
  updateDesignAreas(productData, selections);
  updateStockStatus(productData, selections);
}

/**
 * Create product details section
 * @param {Object} productData - Product data from API
 * @returns {HTMLElement} Product details element
 */
function createProductDetails(productData) {
  const { product } = productData;

  const container = createTag('section', {
    class: 'product-details',
    'aria-label': 'Product configuration',
  });

  // Product header
  const header = createTag('div', { class: 'product-header' });

  const title = createTag('h1', { class: 'product-title' });
  title.textContent = product.title || 'Product';
  header.appendChild(title);

  // Product description
  if (product.description) {
    const desc = createTag('p', { class: 'product-description' });
    desc.textContent = product.description;
    header.appendChild(desc);
  }

  container.appendChild(header);

  return container;
}

/**
 * Render the complete page structure with given data
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} productData - Product data (can be full or minimal)
 * @param {string} templateId - Template ID for CTA button
 */
function renderFullPage(container, productData, templateId) {
  // Create image gallery
  const imageGallery = createImageGallery(productData);
  container.appendChild(imageGallery);

  // Create product details section
  const detailsSection = createTag('div', { class: 'product-details-section' });

  // Product header
  const productDetails = createProductDetails(productData);
  detailsSection.appendChild(productDetails);

  // Quantity and pricing
  const { container: quantityContainer, select: quantitySelect } = createQuantitySelector(productData);
  const { container: pricingContainer, currentPrice } = createPricingDisplay(productData);

  detailsSection.appendChild(quantityContainer);
  detailsSection.appendChild(pricingContainer);

  // Add shipping info
  const shippingInfo = createShippingInfo(productData);
  detailsSection.appendChild(shippingInfo);

  // Track current selections
  const currentSelections = {};

  // Create attribute selectors
  const attributes = productData.product.attributes || {};
  Object.entries(attributes).forEach(([attributeName, attributeData]) => {
    // Set default selection
    const defaultValue = attributeData.values?.find((v) => v.isBestValue)
      || attributeData.values?.[0];
    if (defaultValue) {
      currentSelections[attributeName] = defaultValue;
    }

    const selector = createAttributeSelector(attributeName, attributeData, (name, value) => {
      currentSelections[name] = value;
      updateAllDynamicElements(productData, currentSelections, currentPrice);
    });

    detailsSection.appendChild(selector);
  });

  // Add quantity change handler
  quantitySelect.addEventListener('change', () => {
    updateAllDynamicElements(productData, currentSelections, currentPrice);
  });

  // Add about product section
  const aboutProduct = createAboutProduct(productData);
  detailsSection.appendChild(aboutProduct);

  // Create CTA button
  const ctaButton = createCTAButton(productData, templateId);
  detailsSection.appendChild(ctaButton);

  container.appendChild(detailsSection);
}

/**
 * Main decoration function for the pdp-x block
 * @param {HTMLElement} block - The block element
 */
export default async function decorate(block) {
  // Initialize utilities
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));

  // Extract configuration from authored content
  const config = extractConfig(block);

  // Validate required configuration
  if (!config.templateId) {
    // eslint-disable-next-line no-console
    console.error('PDP-X: Template ID (TD) is required');
    block.innerHTML = '<p class="error">Error: Template ID is required</p>';
    return;
  }

  // Show loading skeleton
  showLoadingSkeleton(block);

  try {
    // Check if we should use live API (can be configured via URL parameter or config)
    const urlParams = new URLSearchParams(window.location.search);
    const useLiveAPI = urlParams.has('live') || config.useLiveAPI === 'true';

    // eslint-disable-next-line no-console
    console.log('\n🎛️  PDP-X Configuration:');
    // eslint-disable-next-line no-console
    console.log(`   📋 Template ID: ${config.templateId}`);
    // eslint-disable-next-line no-console
    console.log(`   🔗 URL has ?live param: ${urlParams.has('live')}`);
    // eslint-disable-next-line no-console
    console.log(`   ⚙️  Config useLiveAPI: ${config.useLiveAPI || 'not set'}`);
    // eslint-disable-next-line no-console
    console.log(`   🚀 Final mode: ${useLiveAPI ? '🌐 LIVE API (STRICT)' : '🏠 LOCAL JSON'}`);

    // Load product data (local JSON by default, live API if requested - live is always strict)
    const productData = await loadProductData(config.templateId, !useLiveAPI);

    // Clear loading state
    block.innerHTML = '';

    // Try to use plugin system, but fallback to original system if it fails
    try {
      const { default: registry } = await import('./core/product-handler-registry.js');
      const handler = await registry.getHandlerForProduct(productData);

      // eslint-disable-next-line no-console
      console.log(`🎨 Using ${handler.productType} handler for product type: ${productData.product?.productType || 'unknown'}`);

      // Render using the product handler
      await handler.renderProduct(block, productData, config.templateId);
    } catch (pluginError) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Plugin system failed, falling back to original system:', pluginError);
      // Fallback to original system
      const container = createTag('div', { class: 'pdp-x-container' });
      renderFullPage(container, productData, config.templateId);
      block.appendChild(container);
    }

    // Mark as loaded
    block.classList.add('pdp-x-loaded');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('PDP-X: Failed to load product:', error);

    // In live mode, render the full page with empty/default data where APIs failed
    const urlParams = new URLSearchParams(window.location.search);
    const isLiveMode = urlParams.has('live');

    if (isLiveMode) {
      // eslint-disable-next-line no-console
      console.log('🔧 Live mode: APIs failed, rendering page with default/empty data...');

      // Create the exact same page structure as local mode, but with minimal data
      block.innerHTML = '';
      const container = createTag('div', { class: 'pdp-x-container' });

      // Create default product data structure
      const defaultProductData = {
        product: {
          title: 'Product',
          description: '',
          quantities: [1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 500],
          singularUnitLabel: 'pack of 100',
          pluralUnitLabel: 'packs of 100',
          pricing: { unitPrice: 0 },
          attributes: {
            style: { title: 'Size', values: [{ title: 'Standard, 3.5" x 2.0"', isBestValue: true }] },
            cornerstyle: {
              title: 'Corner Style',
              values: [
                { title: 'Squared', internalName: 'normal', isBestValue: true, priceDifferential: 0 },
                { title: 'Rounded', internalName: 'allrounded', priceDifferential: 5.35 },
              ],
            },
            media: {
              title: 'Paper',
              values: [{ title: 'Signature Matte', isBestValue: true, priceDifferential: 0, descriptionBrief: '18 pt thickness / 120 lb weight<br>Light eggshell white, uncoated matte finish' }],
            },
          },
          realviews: [],
        },
        strings: {},
        shipping: { estimates: [] },
      };

      // Use plugin system even for error state
      try {
        const { default: registry } = await import('./core/product-handler-registry.js');
        const handler = await registry.getHandlerForProduct(defaultProductData);
        await handler.renderProduct(container, defaultProductData, config.templateId);
      } catch (handlerError) {
        // Final fallback to old system
        renderFullPage(container, defaultProductData, config.templateId);
      }
      block.appendChild(container);
    } else {
      showErrorState(block, error);
    }
  }
}

// Export pricing function for use by plugin system
window.pdpXUpdatePricing = updatePricing;
