

Not c# 🚀 Express Milo Performance Optimization Plan

## 📊 Current Performance Status

### Lighthouse Metrics (Latest)
- **Performance Score**: 67-76 (targeting 80+)
- **LCP**: 5.1-6.0s (targeting 4s)
- **FCP**: 2.3-3.5s (targeting 2s)
- **Element Render Delay**: 1,480-1,990ms (targeting <1s)
- **Critical Path Latency**: 2,608-4,175ms (targeting <3s)
- **TBT**: 10ms (good)
- **CLS**: 0-0.001 (good)

### Resource Savings Needed
- **Image Delivery**: 292KB savings needed
- **Unused JavaScript**: 220KB savings needed
- **Total Target Savings**: 512KB+

---

## 🎯 Phase 1: Critical Issues (Immediate - Next 2 Hours)

### 1.1 Fix Element Render Delay (Priority: CRITICAL)

**Current Issue**: Text not rendering immediately after font load (1,990ms delay)

**Root Cause**: Font loading blocking text visibility

**Implementation Steps**:

1. **Immediate Text Visibility CSS**
```css
/* Force immediate text visibility to prevent render delay */
.section:first-child { 
  visibility: visible !important; 
  opacity: 1 !important; 
}
.section:first-child * { 
  visibility: visible !important; 
  opacity: 1 !important; 
}

/* Critical LCP elements - immediate font rendering */
.section:first-child h1, .section:first-child h2, .section:first-child p, 
.headline h1, #free-logo-maker {
  font-family: 'adobe-clean', 'Adobe Clean', 'Trebuchet MS', 'Arial', sans-serif !important;
  font-weight: 700;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeSpeed;
  font-display: swap;
  visibility: visible !important;
  opacity: 1 !important;
}
```

2. **Font Loading Optimization**
```javascript
// Load TypeKit CSS immediately for Adobe Clean font
const typekitCSS = document.createElement('link');
typekitCSS.rel = 'stylesheet';
typekitCSS.href = 'https://use.typekit.net/jdq5hay.css';
typekitCSS.crossOrigin = 'anonymous';
document.head.appendChild(typekitCSS);

// Inline font-face declarations with immediate fallbacks
const fontLoadingCSS = `
  @font-face {
    font-family: 'adobe-clean';
    font-display: swap;
    font-weight: 300 900;
    src: local('Adobe Clean'), local('AdobeClean'), local('Arial'), local('Helvetica'), sans-serif;
  }
`;
```

3. **Text Rendering Optimization**
```css
/* Apply fonts immediately to prevent render delay */
body, h1, h2, h3, h4, h5, h6, p, a, button, span, div {
  font-family: 'adobe-clean', 'Adobe Clean', 'Trebuchet MS', 'Arial', sans-serif !important;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeSpeed;
}
```

**Success Criteria**: Element render delay <1s

---

### 1.2 Optimize Critical Path Latency (Priority: CRITICAL)

**Current Issue**: Critical path latency 4,175ms (targeting <3s)

**Root Cause**: Render-blocking resources and inefficient loading sequence

**Implementation Steps**:

1. **Dynamic Critical CSS Generation**
```javascript
function generateDynamicCriticalCSS(firstBlock) {
  if (!firstBlock) return '';
  
  const blockName = firstBlock.getAttribute('data-block-name') || 
                   firstBlock.className.split(' ')[0];
  const isMobile = window.innerWidth < 768;
  
  let criticalCSS = `/* Dynamic Critical CSS for ${blockName} */`;
  
  // Base critical CSS
  criticalCSS += `
    .section:first-child { 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
    }
    h1, h2, h3, h4, h5, h6 { 
      font-weight: 700; 
      line-height: 1.2; 
      margin: 0; 
    }
    .button, a.button { 
      display: inline-block; 
      padding: 12px 24px; 
      background: #0066cc; 
      color: white; 
      text-decoration: none; 
      border-radius: 4px; 
    }
  `;
  
  // Block-specific CSS
  criticalCSS += getBlockCriticalCSS(blockName, isMobile);
  
  // Responsive CSS
  criticalCSS += getResponsiveCriticalCSS(isMobile);
  
  return criticalCSS;
}
```

2. **Block-Specific Critical CSS**
```javascript
function getBlockCriticalCSS(blockName, isMobile) {
  const blockCSS = {
    'ax-columns': `
      .ax-columns { 
        display: flex; 
        flex-direction: ${isMobile ? 'column' : 'row'}; 
        gap: 20px; 
        align-items: center; 
      }
      .ax-columns .column { 
        flex: 1; 
        text-align: ${isMobile ? 'center' : 'left'}; 
      }
    `,
    'ax-marquee': `
      .ax-marquee { 
        position: relative; 
        min-height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      }
      .ax-marquee h1 { 
        color: white; 
        text-align: center; 
        font-size: ${isMobile ? '2rem' : '3rem'}; 
      }
    `,
    'template-list': `
      .template-list { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
        gap: 20px; 
        padding: 20px; 
      }
      .template-card { 
        border-radius: 8px; 
        overflow: hidden; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
      }
    `
  };
  
  return blockCSS[blockName] || '';
}
```

3. **Resource Loading Optimization**
```javascript
// Defer non-critical scripts
function optimizeJavaScriptLoading() {
  const nonCriticalScripts = [
    'quotes.js', 'template-x.js', 'ratings.js', 'carousel.js', 
    'masonry.js', 'steps.js', 'link-list.js', 'banner.js', 
    'faq.js', 'blog-posts.js', 'cards.js', 'promotion.js', 
    'mobile-fork-button.js', 'floating-cta.js'
  ];
  
  const currentPath = window.location.pathname;
  const isLogoPage = currentPath.includes('/create/logo');
  
  if (isLogoPage) {
    // Remove unused scripts on logo pages
    nonCriticalScripts.forEach(scriptName => {
      const scripts = document.querySelectorAll(`script[src*="${scriptName}"]`);
      scripts.forEach(script => {
        if (script.src && !script.dataset.critical) {
          script.remove();
          console.log(`✅ Removed unused script: ${scriptName}`);
        }
      });
    });
  }
  
  // Defer remaining non-critical scripts
  const remainingScripts = document.querySelectorAll('script[src*="blocks/"]:not([data-critical])');
  remainingScripts.forEach(script => {
    if (script.src && !script.dataset.deferred) {
      script.defer = true;
      script.async = true;
      script.dataset.deferred = 'true';
    }
  });
}
```

**Success Criteria**: Critical path latency <3s

---

### 1.3 Complete Image Optimization (Priority: HIGH)

**Current Issue**: 292KB image savings needed

**Specific Problems**:
- Avatar images: 589x598px displayed as 42x47px
- Template images: 500x500px displayed as 4x4px
- Template previews: 500x500px displayed as 165x165px

**Implementation Steps**:

1. **Dynamic Image Optimization Function**
```javascript
function optimizeTemplateImages() {
  // Optimize avatar images
  const avatarImages = document.querySelectorAll('.quotes .author-avatar, .avatar img, .profile-img, img[src*="media_"]');
  avatarImages.forEach((img) => {
    if (img.src && img.src.includes('media_')) {
      const url = new URL(img.src);
      const currentWidth = url.searchParams.get('width');
      
      if (currentWidth === '589' || currentWidth === '750') {
        // Optimize for 42px display (84px for retina)
        url.searchParams.set('width', '84');
        url.searchParams.set('height', '84');
        url.searchParams.set('format', 'webp');
        url.searchParams.set('optimize', 'high');
        url.searchParams.set('quality', '75');
        
        img.src = url.toString();
        img.style.width = '42px';
        img.style.height = '42px';
        img.dataset.optimized = 'true';
      }
    }
  });
  
  // Optimize template images
  const templateImages = document.querySelectorAll('.template-list img, .template-card img, .template-preview img, img[src*="adobeprojectm.com"]');
  templateImages.forEach((img) => {
    if (img.src && img.src.includes('adobeprojectm.com')) {
      const url = new URL(img.src);
      const currentWidth = url.searchParams.get('width');
      
      if (currentWidth === '500') {
        const computedStyle = window.getComputedStyle(img);
        const displayWidth = parseInt(computedStyle.width);
        
        if (displayWidth <= 10) {
          // 4x4 display - optimize to 8x8 (2x retina)
          url.searchParams.set('width', '8');
          url.searchParams.set('height', '8');
        } else if (displayWidth <= 200) {
          // 165x165 display - optimize to 330x330 (2x retina)
          url.searchParams.set('width', '330');
          url.searchParams.set('height', '330');
        }
        
        url.searchParams.set('format', 'webp');
        url.searchParams.set('optimize', 'high');
        url.searchParams.set('quality', '75');
        
        img.src = url.toString();
        img.dataset.optimized = 'true';
      }
    }
  });
  
  // Optimize all oversized images
  const allImages = document.querySelectorAll('img[src*="media_"], img[src*="adobeprojectm.com"]');
  allImages.forEach((img) => {
    if (img.src && !img.dataset.optimized) {
      const url = new URL(img.src);
      const currentWidth = url.searchParams.get('width');
      
      if (currentWidth && parseInt(currentWidth) > 200) {
        const newWidth = Math.min(parseInt(currentWidth), 400);
        url.searchParams.set('width', newWidth.toString());
        url.searchParams.set('format', 'webp');
        url.searchParams.set('optimize', 'high');
        url.searchParams.set('quality', '75');
        
        img.src = url.toString();
        img.dataset.optimized = 'true';
      }
    }
  });
}
```

2. **Image Loading Strategy**
```javascript
// Run optimization on DOM ready
document.addEventListener('DOMContentLoaded', optimizeTemplateImages);

// Also run immediately for already loaded images
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', optimizeTemplateImages);
} else {
  optimizeTemplateImages();
}
```

3. **Lazy Loading Implementation**
```javascript
// Implement lazy loading for non-critical images
function implementLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}
```

**Success Criteria**: 292KB image savings achieved

---

## 🎯 Phase 2: Performance Stabilization (Next 4 Hours)

### 2.1 JavaScript Optimization (Priority: HIGH)

**Current Issue**: 220KB unused JavaScript savings needed

**Implementation Steps**:

1. **Page-Specific Script Loading**
```javascript
function loadPageSpecificScripts() {
  const currentPath = window.location.pathname;
  const scriptsToLoad = [];
  
  // Logo page scripts
  if (currentPath.includes('/create/logo')) {
    scriptsToLoad.push('template-list.js', 'template-search-api-v3.js');
  }
  
  // Feature page scripts
  if (currentPath.includes('/feature/')) {
    scriptsToLoad.push('feature-grid.js', 'ratings.js');
  }
  
  // Blog page scripts
  if (currentPath.includes('/blog/')) {
    scriptsToLoad.push('blog-posts.js', 'cards.js');
  }
  
  // Load only required scripts
  scriptsToLoad.forEach(scriptName => {
    const script = document.createElement('script');
    script.src = `${miloLibs}/blocks/${scriptName}`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
  });
}
```

2. **Dynamic Script Dependency Analysis**
```javascript
const scriptDependencies = {
  'template-list': ['template-search-api-v3', 'template-rendering'],
  'quotes': ['ratings'],
  'carousel': ['load-carousel'],
  'masonry': ['load-carousel']
};

function loadScriptWithDependencies(scriptName) {
  const dependencies = scriptDependencies[scriptName] || [];
  
  // Load dependencies first
  dependencies.forEach(dep => {
    if (!document.querySelector(`script[src*="${dep}"]`)) {
      loadScriptWithDependencies(dep);
    }
  });
  
  // Load the script
  const script = document.createElement('script');
  script.src = `${miloLibs}/blocks/${scriptName}`;
  script.defer = true;
  script.async = true;
  document.head.appendChild(script);
}
```

3. **Script Loading Optimization**
```javascript
function optimizeScriptLoading() {
  // Remove unused scripts
  const unusedScripts = [
    'quotes.js', 'template-x.js', 'ratings.js', 'carousel.js',
    'masonry.js', 'steps.js', 'link-list.js', 'banner.js',
    'faq.js', 'blog-posts.js', 'cards.js', 'promotion.js',
    'mobile-fork-button.js', 'floating-cta.js'
  ];
  
  const currentPath = window.location.pathname;
  const isLogoPage = currentPath.includes('/create/logo');
  
  if (isLogoPage) {
    unusedScripts.forEach(scriptName => {
      const scripts = document.querySelectorAll(`script[src*="${scriptName}"]`);
      scripts.forEach(script => {
        if (script.src && !script.dataset.critical) {
          script.remove();
          console.log(`✅ Removed unused script: ${scriptName}`);
        }
      });
    });
  }
  
  // Defer remaining scripts
  const remainingScripts = document.querySelectorAll('script[src*="blocks/"]:not([data-critical])');
  remainingScripts.forEach(script => {
    if (script.src && !script.dataset.deferred) {
      script.defer = true;
      script.async = true;
      script.dataset.deferred = 'true';
    }
  });
}
```

**Success Criteria**: 220KB JavaScript savings

---

### 2.2 Dynamic Critical CSS Refinement (Priority: HIGH)

**Current Issue**: CSS not always applied correctly

**Implementation Steps**:

1. **Enhanced CSS Generation**
```javascript
function generateEnhancedCriticalCSS(firstBlock) {
  if (!firstBlock) return '';
  
  const blockName = firstBlock.getAttribute('data-block-name') || 
                   firstBlock.className.split(' ')[0];
  const isMobile = window.innerWidth < 768;
  
  let criticalCSS = `/* Enhanced Critical CSS for ${blockName} */`;
  
  // Base critical CSS with better specificity
  criticalCSS += `
    /* Reset and base styles */
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: 'adobe-clean', sans-serif; }
    
    /* First section optimization */
    .section:first-child { 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    /* Typography optimization */
    h1, h2, h3, h4, h5, h6 { 
      font-weight: 700; 
      line-height: 1.2; 
      margin: 0; 
      color: #000 !important;
      background: transparent !important;
      text-rendering: optimizeSpeed;
    }
    
    p, span, div { 
      color: #333 !important; 
      background: transparent !important; 
    }
    
    /* Button optimization */
    .button, a.button { 
      display: inline-block; 
      padding: 12px 24px; 
      background: #0066cc !important; 
      color: white !important; 
      text-decoration: none; 
      border-radius: 4px; 
      border: none;
      cursor: pointer;
    }
  `;
  
  // Block-specific CSS with better targeting
  criticalCSS += getEnhancedBlockCSS(blockName, isMobile);
  
  // Responsive CSS
  criticalCSS += getResponsiveCriticalCSS(isMobile);
  
  return criticalCSS;
}
```

2. **Block-Specific CSS Enhancement**
```javascript
function getEnhancedBlockCSS(blockName, isMobile) {
  const blockCSS = {
    'ax-columns': `
      .ax-columns { 
        display: flex; 
        flex-direction: ${isMobile ? 'column' : 'row'}; 
        gap: 20px; 
        align-items: center; 
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .ax-columns .column { 
        flex: 1; 
        text-align: ${isMobile ? 'center' : 'left'}; 
      }
      .ax-columns h1 { 
        font-size: ${isMobile ? '2rem' : '3rem'}; 
        margin-bottom: 1rem;
      }
      .ax-columns p { 
        font-size: ${isMobile ? '1rem' : '1.2rem'}; 
        margin-bottom: 2rem;
      }
    `,
    'ax-marquee': `
      .ax-marquee { 
        position: relative; 
        min-height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        color: white;
        text-align: center;
      }
      .ax-marquee h1 { 
        color: white !important; 
        text-align: center; 
        font-size: ${isMobile ? '2rem' : '3rem'}; 
        margin-bottom: 1rem;
      }
      .ax-marquee p { 
        color: white !important; 
        font-size: ${isMobile ? '1rem' : '1.2rem'}; 
        margin-bottom: 2rem;
      }
    `,
    'template-list': `
      .template-list { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
        gap: 20px; 
        padding: 20px; 
        max-width: 1200px;
        margin: 0 auto;
      }
      .template-card { 
        border-radius: 8px; 
        overflow: hidden; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        transition: transform 0.2s ease;
      }
      .template-card:hover { 
        transform: translateY(-2px); 
      }
      .template-card img { 
        width: 100%; 
        height: auto; 
        display: block; 
      }
    `
  };
  
  return blockCSS[blockName] || '';
}
```

3. **CSS Application Strategy**
```javascript
function applyCriticalCSS(css) {
  // Remove existing critical CSS
  const existingStyle = document.getElementById('critical-css');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create new style element
  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = css;
  
  // Insert at the beginning of head for priority
  document.head.insertBefore(style, document.head.firstChild);
  
  console.log('🚀 Express Milo: Enhanced critical CSS applied');
}
```

**Success Criteria**: Consistent CSS application, no render blocking

---

### 2.3 Font Loading Optimization (Priority: MEDIUM)

**Current Issue**: Font-related render delays

**Implementation Steps**:

1. **Font Preloading Strategy**
```javascript
function implementFontPreloading() {
  // Preload critical fonts
  const fontPreloads = [
    'https://use.typekit.net/jdq5hay.css',
    'https://p.typekit.net/p.css?s=jdq5hay&fvd=n3&v=3',
    'https://p.typekit.net/p.css?s=jdq5hay&fvd=n4&v=3',
    'https://p.typekit.net/p.css?s=jdq5hay&fvd=n7&v=3'
  ];
  
  fontPreloads.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = fontUrl;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}
```

2. **Font Fallback Chain**
```css
/* Font fallback chain for immediate rendering */
@font-face {
  font-family: 'adobe-clean';
  font-display: swap;
  font-weight: 300 900;
  src: local('Adobe Clean'), 
       local('AdobeClean'), 
       local('Arial'), 
       local('Helvetica'), 
       local('Trebuchet MS'), 
       sans-serif;
}

/* Apply fonts with fallbacks */
body, h1, h2, h3, h4, h5, h6, p, a, button, span, div {
  font-family: 'adobe-clean', 'Adobe Clean', 'Trebuchet MS', 'Arial', sans-serif !important;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeSpeed;
}
```

3. **Font Loading Detection**
```javascript
function detectFontLoading() {
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      console.log('✅ All fonts loaded');
      // Apply font-loaded class for additional styling
      document.body.classList.add('fonts-loaded');
    });
  }
  
  // Fallback timeout
  setTimeout(() => {
    document.body.classList.add('fonts-loaded');
  }, 3000);
}
```

**Success Criteria**: No font-related render delays

---

## 🎯 Phase 3: Performance Enhancement (Next 6 Hours)

### 3.1 Resource Hints Implementation (Priority: MEDIUM)

**Target**: Improve resource loading efficiency

**Implementation Steps**:

1. **Preconnect Hints**
```javascript
function addPreconnectHints() {
  const preconnectOrigins = [
    'https://sstats.adobe.com',
    'https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws',
    'https://dcs.adobedc.net',
    'https://www.adobe.com',
    'https://geo2.adobe.com',
    'https://main--milo--adobecom.aem.live',
    'https://use.typekit.net',
    'https://p.typekit.net'
  ];
  
  preconnectOrigins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}
```

2. **DNS Prefetch Hints**
```javascript
function addDNSPrefetchHints() {
  const dnsPrefetchOrigins = [
    'https://design-assets.adobeprojectm.com',
    'https://adobeprojectm.com',
    'https://express.adobe.com'
  ];
  
  dnsPrefetchOrigins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = origin;
    document.head.appendChild(link);
  });
}
```

3. **Preload Critical Resources**
```javascript
function preloadCriticalResources() {
  const criticalResources = [
    { href: 'https://use.typekit.net/jdq5hay.css', as: 'style' },
    { href: '/scripts/scripts.js', as: 'script' },
    { href: '/scripts/utils.js', as: 'script' }
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.as === 'style') {
      link.onload = function() {
        this.rel = 'stylesheet';
      };
    }
    document.head.appendChild(link);
  });
}
```

**Success Criteria**: Faster resource loading, better LCP

---

### 3.2 Service Worker Implementation (Priority: MEDIUM)

**Target**: Better caching and offline support

**Implementation Steps**:

1. **Service Worker Registration**
```javascript
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed:', error);
      });
  }
}
```

2. **Service Worker Implementation**
```javascript
// sw.js
const CACHE_NAME = 'express-milo-v1';
const urlsToCache = [
  '/',
  '/scripts/scripts.js',
  '/scripts/utils.js',
  '/styles/styles.css',
  'https://use.typekit.net/jdq5hay.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

3. **Cache Strategy Implementation**
```javascript
function implementCacheStrategy() {
  // Cache static assets
  const staticAssets = [
    '/scripts/scripts.js',
    '/scripts/utils.js',
    '/styles/styles.css'
  ];
  
  staticAssets.forEach(asset => {
    fetch(asset)
      .then(response => response.clone())
      .then(response => {
        if ('caches' in window) {
          caches.open('express-milo-static').then(cache => {
            cache.put(asset, response);
          });
        }
      });
  });
}
```

**Success Criteria**: Better caching, improved repeat visits

---

### 3.3 Third-Party Script Optimization (Priority: LOW)

**Target**: Reduce external dependencies

**Implementation Steps**:

1. **Third-Party Script Audit**
```javascript
function auditThirdPartyScripts() {
  const scripts = document.querySelectorAll('script[src]');
  const thirdPartyScripts = [];
  
  scripts.forEach(script => {
    const src = script.src;
    if (!src.includes(window.location.hostname)) {
      thirdPartyScripts.push({
        src: src,
        loaded: script.loaded,
        blocking: !script.async && !script.defer
      });
    }
  });
  
  console.log('Third-party scripts:', thirdPartyScripts);
  return thirdPartyScripts;
}
```

2. **Lazy Loading for Non-Critical Scripts**
```javascript
function lazyLoadThirdPartyScripts() {
  const nonCriticalScripts = [
    'https://sstats.adobe.com',
    'https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws'
  ];
  
  nonCriticalScripts.forEach(scriptUrl => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    
    // Load after page load
    window.addEventListener('load', () => {
      document.head.appendChild(script);
    });
  });
}
```

3. **Error Handling for External Services**
```javascript
function handleExternalServiceErrors() {
  window.addEventListener('error', (event) => {
    if (event.filename && (
      event.filename.includes('publish-permissions-config') ||
      event.filename.includes('UniversalNav') ||
      event.filename.includes('RnR') ||
      event.filename.includes('lana.js')
    )) {
      event.preventDefault();
      console.warn('External service error (ignored):', event.filename);
    }
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && (
      event.reason.message.includes('404') ||
      event.reason.message.includes('403') ||
      event.reason.message.includes('ORB')
    )) {
      event.preventDefault();
      console.warn('External service network error (ignored):', event.reason.message);
    }
  });
}
```

**Success Criteria**: Reduced external dependencies

---

## 🎯 Phase 4: Monitoring & Validation (Ongoing)

### 4.1 Performance Monitoring (Priority: HIGH)

**Target**: Continuous performance tracking

**Implementation Steps**:

1. **Lighthouse CI Setup**
```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v7
        with:
          urls: |
            https://mwpw-181668--express-milo--adobecom.aem.live/express/create/logo
          configPath: './lighthouse-ci.json'
```

2. **Performance Budgets**
```json
{
  "budget": [
    {
      "path": "/*",
      "timings": [
        {
          "metric": "first-contentful-paint",
          "budget": 2000
        },
        {
          "metric": "largest-contentful-paint",
          "budget": 4000
        }
      ],
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 500
        },
        {
          "resourceType": "image",
          "budget": 1000
        }
      ]
    }
  ]
}
```

3. **RUM Monitoring**
```javascript
function implementRUMMonitoring() {
  // Core Web Vitals monitoring
  function measureWebVitals() {
    // LCP measurement
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // FCP measurement
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0];
      console.log('FCP:', firstEntry.startTime);
    }).observe({ entryTypes: ['paint'] });
    
    // CLS measurement
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }
  
  measureWebVitals();
}
```

**Success Criteria**: Continuous performance visibility

---

### 4.2 Cross-Browser Testing (Priority: MEDIUM)

**Target**: Consistent performance across browsers

**Implementation Steps**:

1. **Browser Compatibility Testing**
```javascript
function testBrowserCompatibility() {
  const features = {
    'IntersectionObserver': 'IntersectionObserver' in window,
    'ServiceWorker': 'serviceWorker' in navigator,
    'Fonts': 'fonts' in document,
    'PerformanceObserver': 'PerformanceObserver' in window
  };
  
  console.log('Browser features:', features);
  return features;
}
```

2. **Fallback Implementations**
```javascript
function implementFallbacks() {
  // IntersectionObserver fallback
  if (!('IntersectionObserver' in window)) {
    // Load all images immediately
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
  
  // ServiceWorker fallback
  if (!('serviceWorker' in navigator)) {
    // Use regular caching
    implementCacheStrategy();
  }
}
```

3. **Mobile Device Testing**
```javascript
function optimizeForMobile() {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Reduce image sizes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src && img.src.includes('width=')) {
        const url = new URL(img.src);
        const currentWidth = url.searchParams.get('width');
        if (currentWidth && parseInt(currentWidth) > 400) {
          url.searchParams.set('width', '400');
          img.src = url.toString();
        }
      }
    });
    
    // Simplify animations
    document.body.classList.add('mobile-optimized');
  }
}
```

**Success Criteria**: Consistent performance across browsers

---

## 📊 Success Metrics & Targets

### Performance Targets
- **Performance Score**: 80+ (currently 67-76)
- **LCP**: 4s (currently 5.1-6.0s)
- **FCP**: 2s (currently 2.3-3.5s)
- **Element Render Delay**: <1s (currently 1,480-1,990ms)
- **Critical Path Latency**: <3s (currently 2,608-4,175ms)

### Resource Savings Targets
- **Image Delivery**: 292KB (partially achieved)
- **Unused JavaScript**: 220KB (partially achieved)
- **Total Savings**: 512KB+ (partially achieved)

---

## 🚀 Implementation Timeline

### Hour 1-2: Critical Fixes
1. Fix element render delay
2. Optimize critical path
3. Complete image optimization

### Hour 3-4: JavaScript & CSS
1. Complete JavaScript optimization
2. Refine dynamic critical CSS
3. Test performance improvements

### Hour 5-6: Enhancement
1. Implement resource hints
2. Add service worker
3. Optimize third-party scripts

### Hour 7-8: Validation
1. Cross-browser testing
2. Performance monitoring setup
3. Final optimization tweaks

---

## 🔧 Tools & Resources

### Testing Tools
- Lighthouse (Chrome DevTools)
- PageSpeed Insights
- WebPageTest
- Chrome Performance Panel

### Optimization Tools
- Image optimization scripts
- CSS minification
- JavaScript bundling
- Service worker tools

### Monitoring Tools
- Lighthouse CI
- Performance budgets
- RUM monitoring
- Grafana dashboards

---

## 📊 Risk Mitigation

### High Risk
- **Breaking functionality** → Test thoroughly after each change
- **Performance regression** → Monitor metrics continuously
- **Cross-browser issues** → Test on multiple browsers

### Medium Risk
- **CSS conflicts** → Use specific selectors
- **JavaScript errors** → Add error handling
- **Image loading issues** → Implement fallbacks

### Low Risk
- **Minor visual changes** → Document changes
- **Cache issues** → Implement proper invalidation

---

## 🎉 Expected Outcomes

### Immediate (Phase 1)
- Element render delay <1s
- Critical path latency <3s
- 292KB image savings

### Short Term (Phase 2)
- Performance score 80+
- LCP <4s
- 220KB JavaScript savings

### Long Term (Phase 3-4)
- Consistent 80+ performance scores
- Reliable performance across browsers
- Continuous performance monitoring

---

## 📝 Implementation Checklist

### Phase 1: Critical Issues
- [ ] Fix element render delay
- [ ] Optimize critical path latency
- [ ] Complete image optimization
- [ ] Test performance improvements

### Phase 2: Performance Stabilization
- [ ] Complete JavaScript optimization
- [ ] Refine dynamic critical CSS
- [ ] Optimize font loading
- [ ] Test across page types

### Phase 3: Performance Enhancement
- [ ] Implement resource hints
- [ ] Add service worker
- [ ] Optimize third-party scripts
- [ ] Test performance gains

### Phase 4: Monitoring & Validation
- [ ] Set up performance monitoring
- [ ] Cross-browser testing
- [ ] Performance budget implementation
- [ ] Final optimization tweaks

---

This comprehensive plan provides a structured approach to achieving our performance targets! 🚀
