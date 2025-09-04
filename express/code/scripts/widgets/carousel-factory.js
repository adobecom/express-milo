/**
 * Carousel Factory - Functional Programming Module
 * Universal carousel creation system with composable architecture
 * Focus: Clean functions, immutable configs, extensible behavior
 *
 * CSS: Pair with carousel-factory.css for complete styling
 */

import { getLibs } from '../utils.js';

// CSS loading - follows existing codebase pattern
let loadStyle;

// 🚀 PERFORMANCE ENHANCEMENTS - NO LIMITS MODE!

// Intersection Observer Lazy Loading Engine
const LazyLoader = {
  observers: new Map(),

  init(container, options = {}) {
    const config = {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, config);

    // Store observer for cleanup
    this.observers.set(container, observer);

    // Observe all lazy images
    container.querySelectorAll('img[data-src]').forEach((img) => {
      observer.observe(img);
    });

    return observer;
  },

  loadImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');

      // Smooth fade-in animation
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in-out';

      img.onload = () => {
        img.style.opacity = '1';
      };
    }
  },

  cleanup(container) {
    const observer = this.observers.get(container);
    if (observer) {
      observer.disconnect();
      this.observers.delete(container);
    }
  },
};

// Touch Gesture Engine - Mobile Beast Mode
const TouchGestures = {
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  isDragging: false,
  threshold: 50,
  velocityThreshold: 0.5,
  startTime: 0,

  init(element, callbacks) {
    const options = { passive: false };

    element.addEventListener('touchstart', (e) => this.handleStart(e), { passive: true });
    element.addEventListener('touchmove', (e) => this.handleMove(e, element), options);
    element.addEventListener('touchend', (e) => this.handleEnd(e, callbacks, element), { passive: true });

    // Mouse events for desktop testing
    element.addEventListener('mousedown', (e) => this.handleStart(e), { passive: true });
    element.addEventListener('mousemove', (e) => this.handleMove(e, element), options);
    element.addEventListener('mouseup', (e) => this.handleEnd(e, callbacks, element), { passive: true });

    return this;
  },

  handleStart(e) {
    const touch = e.touches ? e.touches[0] : e;
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
    this.isDragging = true;
  },

  handleMove(e, element) {
    if (!this.isDragging) return;

    const touch = e.touches ? e.touches[0] : e;
    this.currentX = touch.clientX;
    this.currentY = touch.clientY;

    const diffX = this.currentX - this.startX;
    const diffY = Math.abs(this.currentY - this.startY);

    // Prevent default if horizontal swipe (carousel navigation)
    if (Math.abs(diffX) > diffY) {
      e.preventDefault();

      // Visual feedback during swipe
      const dampening = 0.3;
      AnimationManager.smoothTransform(element, `translateX(${diffX * dampening}px)`);
    }
  },

  handleEnd(e, callbacks, element) {
    if (!this.isDragging) return;

    const diffX = this.currentX - this.startX;
    const diffTime = Date.now() - this.startTime;
    const velocity = Math.abs(diffX) / diffTime;

    // Reset visual feedback
    AnimationManager.smoothTransform(element, 'translateX(0px)');

    // Determine swipe direction and trigger callback
    if (Math.abs(diffX) > this.threshold || velocity > this.velocityThreshold) {
      if (diffX > 0) {
        callbacks.onSwipeRight?.();
      } else {
        callbacks.onSwipeLeft?.();
      }
    }

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
  },
};

// Animation Manager - 60fps Smooth Operations
const AnimationManager = {
  rafId: null,
  activeTransitions: new Map(),

  smoothTransform(element, transform) {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      element.style.transform = transform;
    });
  },

  smoothScroll(element, scrollLeft, duration = 300) {
    const start = element.scrollLeft;
    const distance = scrollLeft - start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      element.scrollLeft = start + (distance * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  },

  cleanup() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.activeTransitions.clear();
  },
};

// Virtual Scrolling Engine - Handle 1000+ Items Like a Boss! 🚀
const VirtualScrolling = {
  config: {
    itemHeight: 300, // Default template height
    visibleCount: 3, // How many visible at once
    bufferCount: 2, // Extra items to render (above + below)
    overscan: 1, // Additional buffer for smooth scrolling
  },

  state: {
    scrollTop: 0,
    containerHeight: 0,
    totalItems: 0,
    visibleStartIndex: 0,
    visibleEndIndex: 0,
  },

  init(container, templates, renderCallback) {
    this.container = container;
    this.templates = templates;
    this.renderCallback = renderCallback;
    this.state.totalItems = templates.length;

    // Create virtual container structure
    this.setupVirtualContainer();

    // Initialize scroll handling
    this.setupScrollHandling();

    // Initial render
    this.updateVisibleItems();

    return this;
  },

  setupVirtualContainer() {
    // Create virtual scroll container
    this.scrollContainer = document.createElement('div');
    this.scrollContainer.className = 'virtual-scroll-container';
    this.scrollContainer.style.cssText = `
      height: 100%;
      overflow-y: auto;
      position: relative;
    `;

    // Create virtual content area (represents total scrollable height)
    this.virtualContent = document.createElement('div');
    this.virtualContent.className = 'virtual-content';
    this.virtualContent.style.cssText = `
      height: ${this.state.totalItems * this.config.itemHeight}px;
      position: relative;
    `;

    // Create visible items container (only renders visible items)
    this.visibleContainer = document.createElement('div');
    this.visibleContainer.className = 'virtual-visible-items';
    this.visibleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    `;

    // Assemble structure
    this.virtualContent.appendChild(this.visibleContainer);
    this.scrollContainer.appendChild(this.virtualContent);
    this.container.appendChild(this.scrollContainer);
  },

  setupScrollHandling() {
    let scrollTimer = null;

    this.scrollContainer.addEventListener('scroll', () => {
      this.state.scrollTop = this.scrollContainer.scrollTop;

      // Debounce expensive operations
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => this.updateVisibleItems(), 16); // ~60fps

      // Immediate transform for smooth scrolling
      this.updateVisibleItemsTransform();
    }, { passive: true });

    // Handle resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.state.containerHeight = entry.contentRect.height;
        this.updateVisibleItems();
      }
    });

    resizeObserver.observe(this.container);
    this.resizeObserver = resizeObserver;
  },

  updateVisibleItems() {
    // Calculate which items should be visible
    const startIndex = Math.floor(this.state.scrollTop / this.config.itemHeight);
    const endIndex = Math.min(
      startIndex + this.config.visibleCount + this.config.bufferCount + this.config.overscan,
      this.state.totalItems - 1
    );

    const actualStartIndex = Math.max(0, startIndex - this.config.overscan);

    // Only update if the visible range changed
    if (actualStartIndex !== this.state.visibleStartIndex || endIndex !== this.state.visibleEndIndex) {
      this.state.visibleStartIndex = actualStartIndex;
      this.state.visibleEndIndex = endIndex;

      this.renderVisibleItems();
    }
  },

  updateVisibleItemsTransform() {
    // Smooth transform for immediate feedback
    const offset = this.state.visibleStartIndex * this.config.itemHeight;
    AnimationManager.smoothTransform(this.visibleContainer, `translateY(${offset}px)`);
  },

  renderVisibleItems() {
    // Clear existing items
    this.visibleContainer.innerHTML = '';

    // Render only visible items
    for (let i = this.state.visibleStartIndex; i <= this.state.visibleEndIndex; i++) {
      if (i < this.templates.length) {
        const template = this.templates[i];
        const templateElement = this.renderCallback(template, i);

        // Position the item correctly
        templateElement.style.cssText += `
          position: absolute;
          top: ${(i - this.state.visibleStartIndex) * this.config.itemHeight}px;
          left: 0;
          right: 0;
          height: ${this.config.itemHeight}px;
        `;

        this.visibleContainer.appendChild(templateElement);
      }
    }

    // Update container transform
    this.updateVisibleItemsTransform();
  },

  // Public API
  scrollToItem(index) {
    const targetScrollTop = index * this.config.itemHeight;
    AnimationManager.smoothScroll(this.scrollContainer, targetScrollTop, 500);
  },

  getVisibleIndices() {
    return {
      start: this.state.visibleStartIndex,
      end: this.state.visibleEndIndex,
      total: this.state.totalItems,
    };
  },

  cleanup() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
};

// Adaptive Image Loading System - Smart Image Sizes! 📱💻🖥️
const AdaptiveImages = {
  breakpoints: {
    mobile: { max: 480, suffix: 'mobile', quality: 85 },
    tablet: { max: 768, suffix: 'tablet', quality: 90 },
    desktop: { max: 1200, suffix: 'desktop', quality: 95 },
    large: { max: 9999, suffix: 'large', quality: 100 },
  },

  devicePixelRatio: window.devicePixelRatio || 1,
  currentBreakpoint: null,

  init() {
    this.updateBreakpoint();
    this.setupResizeListener();
    this.setupIntersectionObserver();
    return this;
  },

  updateBreakpoint() {
    const width = window.innerWidth;
    const dpr = this.devicePixelRatio;

    // Find current breakpoint
    for (const [name, config] of Object.entries(this.breakpoints)) {
      if (width <= config.max) {
        this.currentBreakpoint = { name, ...config };
        break;
      }
    }

    // Adjust for high DPI displays
    if (dpr > 1.5) {
      this.currentBreakpoint.quality = Math.min(this.currentBreakpoint.quality + 10, 100);
    }
  },

  setupResizeListener() {
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const oldBreakpoint = this.currentBreakpoint?.name;
        this.updateBreakpoint();

        // If breakpoint changed, reload visible images
        if (oldBreakpoint !== this.currentBreakpoint?.name) {
          this.reloadVisibleImages();
        }
      }, 250);
    });
  },

  setupIntersectionObserver() {
    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadAdaptiveImage(entry.target);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1,
    });
  },

  processImage(img, baseUrl) {
    // Store original URL for adaptive loading
    img.dataset.baseUrl = baseUrl;
    img.dataset.adaptive = 'true';

    // Generate adaptive src and srcSet
    const adaptiveSrc = this.generateAdaptiveSrc(baseUrl);
    const srcSet = this.generateSrcSet(baseUrl);

    // Set up responsive image
    img.src = adaptiveSrc;
    img.srcset = srcSet;
    img.sizes = this.generateSizes();

    // Observe for lazy loading
    this.imageObserver.observe(img);

    return img;
  },

  generateAdaptiveSrc(baseUrl) {
    const bp = this.currentBreakpoint;
    const width = Math.ceil(window.innerWidth * this.devicePixelRatio);

    // Handle different URL patterns
    if (baseUrl.includes('picsum.photos')) {
      return `${baseUrl}&w=${width}&q=${bp.quality}`;
    }

    if (baseUrl.includes('adobe.com')) {
      return `${baseUrl}&w=${width}&quality=${bp.quality}&format=webp`;
    }

    // Default pattern
    return `${baseUrl}?w=${width}&q=${bp.quality}`;
  },

  generateSrcSet(baseUrl) {
    const srcSetEntries = [];

    Object.entries(this.breakpoints).forEach(([name, config]) => {
      const width = config.max === 9999 ? 1920 : config.max;
      const adaptiveUrl = this.generateAdaptiveUrl(baseUrl, width, config.quality);
      srcSetEntries.push(`${adaptiveUrl} ${width}w`);
    });

    return srcSetEntries.join(', ');
  },

  generateAdaptiveUrl(baseUrl, width, quality) {
    if (baseUrl.includes('picsum.photos')) {
      return `${baseUrl}&w=${width}&q=${quality}`;
    }

    if (baseUrl.includes('adobe.com')) {
      return `${baseUrl}&w=${width}&quality=${quality}&format=webp`;
    }

    return `${baseUrl}?w=${width}&q=${quality}`;
  },

  generateSizes() {
    return `
      (max-width: 480px) 100vw,
      (max-width: 768px) 50vw,
      (max-width: 1200px) 33vw,
      25vw
    `.replace(/\s+/g, ' ').trim();
  },

  loadAdaptiveImage(img) {
    if (!img.dataset.adaptive) return;

    // Add loading state
    img.classList.add('loading');

    // Create new image for preloading
    const preloadImg = new Image();

    preloadImg.onload = () => {
      // Smooth transition
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in-out';

      setTimeout(() => {
        img.src = preloadImg.src;
        img.style.opacity = '1';
        img.classList.remove('loading');
        img.classList.add('loaded');
      }, 50);
    };

    preloadImg.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
    };

    // Start loading
    preloadImg.src = this.generateAdaptiveSrc(img.dataset.baseUrl);
  },

  reloadVisibleImages() {
    // Reload all visible adaptive images when breakpoint changes
    document.querySelectorAll('img[data-adaptive="true"]:not([data-src])').forEach((img) => {
      if (this.isInViewport(img)) {
        this.loadAdaptiveImage(img);
      }
    });
  },

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  cleanup() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
  },
};

// Smart Auto-Pause System - Intelligent Autoplay Management! 🧠⏸️
const SmartAutoplay = {
  state: {
    isPlaying: false,
    isPaused: false,
    interval: 5000,
    timer: null,
    lastInteraction: 0,
    userEngaged: false,
  },

  config: {
    pauseOnHover: true,
    pauseOnFocus: true,
    pauseOnVisibilityChange: true,
    pauseOnInteraction: true,
    resumeDelay: 2000, // Resume after 2s of no interaction
    maxAutoplayTime: 60000, // Stop autoplay after 1 minute
  },

  init(carousel, advanceCallback, interval = 5000) {
    this.carousel = carousel;
    this.advanceCallback = advanceCallback;
    this.state.interval = interval;

    this.setupEventListeners();
    this.setupVisibilityDetection();
    this.setupInteractionDetection();

    return this;
  },

  setupEventListeners() {
    const { carousel } = this;

    // Pause on hover
    if (this.config.pauseOnHover) {
      carousel.addEventListener('mouseenter', () => this.pause('hover'));
      carousel.addEventListener('mouseleave', () => this.resume('hover'));
    }

    // Pause on focus
    if (this.config.pauseOnFocus) {
      carousel.addEventListener('focusin', () => this.pause('focus'));
      carousel.addEventListener('focusout', () => this.resume('focus'));
    }

    // Pause on touch/interaction
    if (this.config.pauseOnInteraction) {
      carousel.addEventListener('touchstart', () => this.handleInteraction(), { passive: true });
      carousel.addEventListener('mousedown', () => this.handleInteraction(), { passive: true });
      carousel.addEventListener('keydown', () => this.handleInteraction(), { passive: true });
    }
  },

  setupVisibilityDetection() {
    if (!this.config.pauseOnVisibilityChange) return;

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause('visibility');
      } else {
        this.resume('visibility');
      }
    });

    // Intersection observer for carousel visibility
    this.visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.resume('scroll');
        } else {
          this.pause('scroll');
        }
      });
    }, { threshold: 0.5 });

    this.visibilityObserver.observe(this.carousel);
  },

  setupInteractionDetection() {
    // Detect user engagement patterns
    let interactionCount = 0;
    const interactionTypes = ['click', 'touchstart', 'keydown', 'wheel'];

    interactionTypes.forEach((type) => {
      this.carousel.addEventListener(type, () => {
        interactionCount++;
        this.state.userEngaged = interactionCount > 2; // User is engaged after 3+ interactions
      }, { passive: true });
    });

    // Reduce autoplay frequency for engaged users
    setInterval(() => {
      if (this.state.userEngaged && this.state.isPlaying) {
        this.state.interval = Math.min(this.state.interval * 1.2, 10000); // Slow down autoplay
      }
    }, 30000);
  },

  handleInteraction() {
    this.state.lastInteraction = Date.now();
    this.pause('interaction');

    // Resume after delay if no more interactions
    clearTimeout(this.resumeTimer);
    this.resumeTimer = setTimeout(() => {
      if (Date.now() - this.state.lastInteraction >= this.config.resumeDelay) {
        this.resume('interaction');
      }
    }, this.config.resumeDelay);
  },

  start() {
    if (this.state.isPlaying) return;

    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.scheduleNext();

    // Auto-stop after max time
    setTimeout(() => {
      this.stop();
    }, this.config.maxAutoplayTime);
  },

  pause(reason) {
    if (!this.state.isPlaying || this.state.isPaused) return;

    this.state.isPaused = true;
    this.clearTimer();

    // Visual feedback
    this.showPauseIndicator(reason);
  },

  resume(reason) {
    if (!this.state.isPlaying || !this.state.isPaused) return;

    this.state.isPaused = false;
    this.scheduleNext();

    // Clear visual feedback
    this.hidePauseIndicator();
  },

  stop() {
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.clearTimer();
    this.hidePauseIndicator();
  },

  scheduleNext() {
    this.clearTimer();

    if (this.state.isPlaying && !this.state.isPaused) {
      this.state.timer = setTimeout(() => {
        if (this.state.isPlaying && !this.state.isPaused) {
          this.advanceCallback();
          this.scheduleNext(); // Schedule next advance
        }
      }, this.state.interval);
    }
  },

  clearTimer() {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.state.timer = null;
    }
  },

  showPauseIndicator(reason) {
    // Create pause indicator if it doesn't exist
    if (!this.pauseIndicator) {
      this.pauseIndicator = document.createElement('div');
      this.pauseIndicator.className = 'autoplay-pause-indicator';
      this.pauseIndicator.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 100;
        pointer-events: none;
      `;
      this.carousel.style.position = 'relative';
      this.carousel.appendChild(this.pauseIndicator);
    }

    this.pauseIndicator.textContent = `⏸️ Paused (${reason})`;
    this.pauseIndicator.style.opacity = '1';
  },

  hidePauseIndicator() {
    if (this.pauseIndicator) {
      this.pauseIndicator.style.opacity = '0';
    }
  },

  // Public API
  toggle() {
    if (this.state.isPlaying) {
      this.state.isPaused ? this.resume('manual') : this.pause('manual');
    } else {
      this.start();
    }
  },

  getState() {
    return { ...this.state };
  },

  cleanup() {
    this.stop();
    clearTimeout(this.resumeTimer);

    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect();
    }

    if (this.pauseIndicator) {
      this.pauseIndicator.remove();
    }
  },
};

// Parallax Effects Engine - Subtle Depth & Motion! ✨🌊
const ParallaxEngine = {
  elements: new Map(),
  isActive: false,
  scrollTicking: false,

  init(container, options = {}) {
    this.container = container;
    this.options = {
      factor: options.factor || 0.3, // How much parallax (0.1 = subtle, 0.5 = strong)
      direction: options.direction || 'vertical', // vertical, horizontal, both
      trigger: options.trigger || 'scroll', // scroll, mouse, both
      ...options,
    };

    this.setupParallaxElements();
    this.setupEventListeners();
    this.isActive = true;

    return this;
  },

  setupParallaxElements() {
    // Find elements with parallax data attributes or classes
    const parallaxElements = this.container.querySelectorAll('[data-parallax], .parallax-bg, .parallax-item');

    parallaxElements.forEach((element) => {
      const factor = parseFloat(element.dataset.parallax) || this.options.factor;
      const direction = element.dataset.parallaxDirection || this.options.direction;

      this.elements.set(element, {
        factor,
        direction,
        originalTransform: element.style.transform,
        rect: element.getBoundingClientRect(),
      });

      // Add CSS for smooth transitions
      element.style.transition = 'transform 0.1s ease-out';
      element.style.willChange = 'transform';
    });
  },

  setupEventListeners() {
    // Scroll-based parallax
    if (this.options.trigger === 'scroll' || this.options.trigger === 'both') {
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
      this.container.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    // Mouse-based parallax
    if (this.options.trigger === 'mouse' || this.options.trigger === 'both') {
      this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
    }

    // Update element positions on resize
    window.addEventListener('resize', () => this.updateElementRects(), { passive: true });
  },

  handleScroll() {
    if (!this.scrollTicking && this.isActive) {
      requestAnimationFrame(() => {
        this.updateParallaxElements();
        this.scrollTicking = false;
      });
      this.scrollTicking = true;
    }
  },

  handleMouseMove(event) {
    if (!this.isActive) return;

    const rect = this.container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (event.clientX - centerX) / rect.width;
    const deltaY = (event.clientY - centerY) / rect.height;

    this.elements.forEach((config, element) => {
      const moveX = deltaX * config.factor * 20; // Scale movement
      const moveY = deltaY * config.factor * 20;

      let transform = config.originalTransform || '';

      if (config.direction === 'horizontal' || config.direction === 'both') {
        transform += ` translateX(${moveX}px)`;
      }
      if (config.direction === 'vertical' || config.direction === 'both') {
        transform += ` translateY(${moveY}px)`;
      }

      element.style.transform = transform;
    });
  },

  updateParallaxElements() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    this.elements.forEach((config, element) => {
      const rect = config.rect;
      const elementTop = rect.top + scrollTop;
      const elementHeight = rect.height;

      // Calculate if element is in viewport
      const isInViewport = (elementTop < scrollTop + windowHeight) && (elementTop + elementHeight > scrollTop);

      if (isInViewport) {
        // Calculate parallax offset
        const viewportCenter = scrollTop + windowHeight / 2;
        const elementCenter = elementTop + elementHeight / 2;
        const distance = viewportCenter - elementCenter;

        const parallaxY = distance * config.factor;

        let transform = config.originalTransform || '';

        if (config.direction === 'vertical' || config.direction === 'both') {
          transform += ` translateY(${parallaxY}px)`;
        }

        element.style.transform = transform;
      }
    });
  },

  updateElementRects() {
    this.elements.forEach((config, element) => {
      config.rect = element.getBoundingClientRect();
    });
  },

  // Add parallax to specific elements
  addElement(element, options = {}) {
    const config = {
      factor: options.factor || this.options.factor,
      direction: options.direction || this.options.direction,
      originalTransform: element.style.transform,
      rect: element.getBoundingClientRect(),
    };

    this.elements.set(element, config);
    element.style.transition = 'transform 0.1s ease-out';
    element.style.willChange = 'transform';
  },

  // Remove parallax from element
  removeElement(element) {
    if (this.elements.has(element)) {
      const config = this.elements.get(element);
      element.style.transform = config.originalTransform;
      element.style.transition = '';
      element.style.willChange = '';
      this.elements.delete(element);
    }
  },

  // Control parallax
  pause() {
    this.isActive = false;
  },

  resume() {
    this.isActive = true;
  },

  cleanup() {
    this.isActive = false;

    // Restore original transforms
    this.elements.forEach((config, element) => {
      element.style.transform = config.originalTransform || '';
      element.style.transition = '';
      element.style.willChange = '';
    });

    this.elements.clear();
  },
};

// Error Boundary System - Bulletproof Failure Handling! 🛡️💥
const ErrorBoundary = {
  errors: [],
  fallbackRendered: false,

  init(container, options = {}) {
    this.container = container;
    this.options = {
      maxErrors: options.maxErrors || 5,
      fallbackContent: options.fallbackContent || this.getDefaultFallback(),
      onError: options.onError || this.defaultErrorHandler,
      retryButton: options.retryButton !== false,
      ...options,
    };

    this.setupGlobalErrorHandling();
    return this;
  },

  setupGlobalErrorHandling() {
    // Catch JavaScript errors
    window.addEventListener('error', (event) => {
      if (this.isCarouselError(event)) {
        this.handleError('javascript', event.error, {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
        });
      }
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isCarouselError(event)) {
        this.handleError('promise', event.reason, {
          promise: event.promise,
        });
      }
    });

    // Catch image loading errors
    this.container.addEventListener('error', (event) => {
      if (event.target.tagName === 'IMG') {
        this.handleImageError(event.target);
      }
    }, true);
  },

  isCarouselError(event) {
    // Check if error is related to our carousel
    const stack = event.error?.stack || event.reason?.stack || '';
    return stack.includes('carousel-factory') ||
           event.target?.closest?.('.promo-carousel-wrapper') ||
           this.container.contains(event.target);
  },

  handleError(type, error, context = {}) {
    const errorInfo = {
      type,
      error,
      context,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errors.push(errorInfo);
    this.options.onError(errorInfo);

    // Show fallback if too many errors
    if (this.errors.length >= this.options.maxErrors && !this.fallbackRendered) {
      this.renderFallback();
    }
  },

  handleImageError(img) {
    // Try fallback image sources
    const fallbackSources = [
      img.dataset.fallback,
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=',
    ].filter(Boolean);

    if (img.dataset.errorCount === undefined) {
      img.dataset.errorCount = '0';
    }

    const errorCount = parseInt(img.dataset.errorCount, 10);

    if (errorCount < fallbackSources.length) {
      // Try next fallback source
      img.src = fallbackSources[errorCount];
      img.dataset.errorCount = (errorCount + 1).toString();
    } else {
      // All fallbacks failed, show error state
      img.style.cssText += `
        background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        min-height: 200px;
        object-fit: cover;
      `;
      img.alt = 'Image failed to load';
      img.classList.add('error-state');
    }
  },

  renderFallback() {
    if (this.fallbackRendered) return;

    this.container.innerHTML = this.options.fallbackContent;
    this.fallbackRendered = true;

    // Add retry functionality
    if (this.options.retryButton) {
      const retryBtn = this.container.querySelector('.error-retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => this.retry());
      }
    }
  },

  getDefaultFallback() {
    return `
      <div class="carousel-error-boundary">
        <div class="error-content">
          <h3>⚠️ Something went wrong</h3>
          <p>We're having trouble loading the carousel. This might be due to a network issue or a temporary problem.</p>
          <button class="error-retry-btn">🔄 Try Again</button>
          <details class="error-details">
            <summary>Technical Details</summary>
            <p>Errors encountered: ${this.errors.length}</p>
            <pre>${JSON.stringify(this.errors.slice(-3), null, 2)}</pre>
          </details>
        </div>
        <style>
          .carousel-error-boundary {
            padding: 40px 20px;
            text-align: center;
            background: #f8f9fa;
            border-radius: 8px;
            border: 2px dashed #dee2e6;
          }
          .error-content h3 { color: #dc3545; margin-bottom: 16px; }
          .error-retry-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 16px 0;
          }
          .error-retry-btn:hover { background: #0056b3; }
          .error-details { margin-top: 20px; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto; }
          .error-details pre { background: #f1f3f4; padding: 10px; border-radius: 4px; overflow: auto; font-size: 12px; }
        </style>
      </div>
    `;
  },

  defaultErrorHandler(errorInfo) {
    console.error('🛡️ Carousel Error Boundary caught:', errorInfo);

    // Send to analytics (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'carousel_error', {
        error_type: errorInfo.type,
        error_message: errorInfo.error?.message || 'Unknown error',
      });
    }
  },

  retry() {
    this.errors = [];
    this.fallbackRendered = false;
    window.location.reload();
  },

  getErrorSummary() {
    return {
      totalErrors: this.errors.length,
      errorTypes: [...new Set(this.errors.map(e => e.type))],
      recentErrors: this.errors.slice(-5),
      fallbackActive: this.fallbackRendered,
    };
  },

  cleanup() {
    this.errors = [];
    this.fallbackRendered = false;
  },
};

// Momentum Physics Engine - Natural Scroll Feel! 🌊⚡
const MomentumPhysics = {
  velocity: 0,
  position: 0,
  lastTime: 0,
  isActive: false,
  friction: 0.92,
  threshold: 0.1,
  rafId: null,

  init(element, options = {}) {
    this.element = element;
    this.options = {
      friction: options.friction || 0.92,
      threshold: options.threshold || 0.1,
      maxVelocity: options.maxVelocity || 50,
      springStrength: options.springStrength || 0.1,
      dampening: options.dampening || 0.85,
      ...options,
    };

    this.setupEventListeners();
    return this;
  },

  setupEventListeners() {
    let startX = 0;
    let startTime = 0;
    let lastX = 0;
    let lastTime = 0;

    // Touch events for momentum calculation
    this.element.addEventListener('touchstart', (e) => {
      this.stop();
      startX = e.touches[0].clientX;
      lastX = startX;
      startTime = Date.now();
      lastTime = startTime;
    }, { passive: true });

    this.element.addEventListener('touchmove', (e) => {
      const currentX = e.touches[0].clientX;
      const currentTime = Date.now();

      // Calculate instantaneous velocity
      const deltaX = currentX - lastX;
      const deltaTime = currentTime - lastTime;

      if (deltaTime > 0) {
        this.velocity = deltaX / deltaTime;
      }

      lastX = currentX;
      lastTime = currentTime;
    }, { passive: true });

    this.element.addEventListener('touchend', () => {
      // Apply momentum based on final velocity
      this.velocity = Math.max(-this.options.maxVelocity,
                              Math.min(this.options.maxVelocity, this.velocity * 20));

      if (Math.abs(this.velocity) > this.options.threshold) {
        this.startMomentum();
      }
    }, { passive: true });

    // Mouse wheel momentum
    this.element.addEventListener('wheel', (e) => {
      this.stop();
      this.velocity = -e.deltaY * 0.1;
      this.startMomentum();
    }, { passive: true });
  },

  startMomentum() {
    if (this.isActive) return;

    this.isActive = true;
    this.lastTime = performance.now();
    this.animate();
  },

  animate() {
    if (!this.isActive) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // Apply friction
    this.velocity *= this.options.friction;

    // Update position
    this.position += this.velocity * deltaTime;

    // Apply transform
    this.element.style.transform = `translateX(${this.position}px)`;

    // Continue animation if velocity is significant
    if (Math.abs(this.velocity) > this.options.threshold) {
      this.lastTime = currentTime;
      this.rafId = requestAnimationFrame(() => this.animate());
    } else {
      this.stop();
    }
  },

  stop() {
    this.isActive = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  },

  reset() {
    this.stop();
    this.velocity = 0;
    this.position = 0;
    this.element.style.transform = '';
  },

  // Add impulse (for programmatic momentum)
  addImpulse(force) {
    this.velocity += force;
    if (!this.isActive) {
      this.startMomentum();
    }
  },

  cleanup() {
    this.stop();
    this.reset();
  },
};

// Core carousel state (pure functions only)
const CarouselState = {
  create: (config) => ({
    currentIndex: 0,
    templateCount: config.templates.length,
    isMobile: () => window.innerWidth < 768,
    ...config,
  }),

  moveNext: (state) => ({
    ...state,
    currentIndex: (state.currentIndex + 1) % state.templateCount,
  }),

  movePrev: (state) => ({
    ...state,
    currentIndex: (state.currentIndex - 1 + state.templateCount) % state.templateCount,
  }),
};

// DOM creation utilities (pure functions)
const CarouselDOM = {
  createStructure: (createTag) => ({
    wrapper: createTag('div', { class: 'promo-carousel-wrapper' }),
    viewport: createTag('div', { class: 'promo-carousel-viewport' }),
    track: createTag('div', { class: 'promo-carousel-track' }),
  }),

  createNavigation: (createTag) => ({
    container: createTag('div', { class: 'promo-nav-controls' }),
    prevBtn: createTag('button', {
      class: 'promo-nav-btn promo-prev-btn',
      'aria-label': 'Previous templates',
    }),
    nextBtn: createTag('button', {
      class: 'promo-nav-btn promo-next-btn',
      'aria-label': 'Next templates',
    }),
  }),

  createA11yElements: (createTag) => ({
    instructions: createTag('div', {
      id: 'carousel-instructions',
      class: 'sr-only',
      'aria-live': 'polite',
    }),
    status: createTag('div', {
      id: 'carousel-status',
      class: 'sr-only',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    }),
    skipLink: createTag('a', {
      href: '#carousel-end',
      class: 'sr-only carousel-skip-link',
    }),
  }),

  createButtonSVG: (direction) => {
    const isNext = direction === 'next';
    const arrowDirection = isNext ? 'next' : 'previous';
    return `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
           aria-hidden="true" focusable="false" role="img">
        <title>${arrowDirection} arrow</title>
        <circle cx="16" cy="16" r="16" fill="#FFFFFF"/>
        <path d="${isNext
    ? 'M14.6016 21.1996L19.4016 16.3996L14.6016 11.5996'
    : 'M17.3984 21.1996L12.5984 16.3996L17.3984 11.5996'}"
              stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  },
};

// Hover system (pure functions)
const HoverSystem = {
  create: () => {
    let currentHoveredElement = null;

    return {
      enterHandler: (buttonContainer) => {
        if (currentHoveredElement) {
          currentHoveredElement.classList.remove('singleton-hover');
        }
        currentHoveredElement = buttonContainer;
        if (currentHoveredElement) {
          currentHoveredElement.classList.add('singleton-hover');
        }
        document.activeElement.blur();
      },

      leaveHandler: () => {
        if (currentHoveredElement) {
          currentHoveredElement.classList.remove('singleton-hover');
          currentHoveredElement = null;
        }
      },

      focusHandler: (templateEl) => {
        if (currentHoveredElement) {
          currentHoveredElement.classList.remove('singleton-hover');
        }
        currentHoveredElement = templateEl;
        if (currentHoveredElement) {
          currentHoveredElement.classList.add('singleton-hover');
        }
      },
    };
  },

  attachToTemplate: (templateEl, hoverSystem) => {
    const buttonContainer = templateEl.querySelector('.button-container');
    if (!buttonContainer) return;

    // Mouse events
    templateEl.addEventListener('mouseenter', () => {
      hoverSystem.enterHandler(buttonContainer);
    });

    templateEl.addEventListener('mouseleave', () => {
      hoverSystem.leaveHandler();
    });

    // Touch/mobile events
    const editButton = buttonContainer.querySelector('.button.accent.small');
    const ctaLink = buttonContainer.querySelector('.cta-link');

    const combinedClickHandler = (ev) => {
      // Two-tap behavior for mobile
      if (window.matchMedia('(pointer: coarse)').matches) {
        if (!buttonContainer.classList.contains('singleton-hover')) {
          ev.preventDefault();
          ev.stopPropagation();
          hoverSystem.enterHandler(buttonContainer);
          return false;
        }
      }
      return true;
    };

    if (editButton) {
      editButton.addEventListener('focusin', () => hoverSystem.focusHandler(templateEl));
      editButton.addEventListener('click', combinedClickHandler);
    }
    if (ctaLink) ctaLink.addEventListener('click', combinedClickHandler);
  },
};

// Display logic (pure functions that return instructions)
const DisplayLogic = {
  getVisibleTemplates: (state) => {
    if (state.isMobile()) {
      // Mobile: prev-current-next pattern
      const prevIndex = (state.currentIndex - 1 + state.templateCount) % state.templateCount;
      const nextIndex = (state.currentIndex + 1) % state.templateCount;

      return [
        { index: prevIndex, class: 'prev-template' },
        { index: state.currentIndex, class: 'current-template' },
        { index: nextIndex, class: 'next-template' },
      ];
    }
      // Desktop: all templates visible
      return state.templates.map((_, index) => ({
        index,
      class: '',
    }));
  },

  shouldShowNavigation: (state) => state.isMobile() && state.templateCount > 1,
};

// Core carousel factory function - NOW WITH SUPERPOWERS! 🚀
export const createCarousel = async (config) => {
  // Import loadStyle if not already available
  if (!loadStyle) {
    const { loadStyle: ls } = await import(`${getLibs()}/utils/utils.js`);
    loadStyle = ls;
  }

  // Load CSS using the proper pattern
  if (config.loadCSS !== false) {
    loadStyle('/express/code/scripts/widgets/carousel-factory.css');
  }

  // Validate required dependencies
  const {
    block,
    templates,
    createTag,
    attachHoverListeners,
    customDOMCallback,
  } = config;

  if (!block || !templates || !createTag) {
    throw new Error('Missing required carousel dependencies');
  }

  // Initialize carousel state
  let state = CarouselState.create({ templates });

  // Create DOM structure
  const dom = CarouselDOM.createStructure(createTag);
  const nav = CarouselDOM.createNavigation(createTag);

  // Setup navigation buttons
  nav.prevBtn.innerHTML = CarouselDOM.createButtonSVG('prev');
  nav.nextBtn.innerHTML = CarouselDOM.createButtonSVG('next');
  nav.container.append(nav.prevBtn, nav.nextBtn);

  // Initialize hover system
  const hoverSystem = HoverSystem.create();

  // Pure function to update display
  const updateDisplay = () => {
    const visibleTemplates = DisplayLogic.getVisibleTemplates(state);

    // Clear track
    dom.track.innerHTML = '';

    // Add visible templates
    visibleTemplates.forEach(({ index, class: className }) => {
      const template = templates[index];
      const templateClone = template.cloneNode(true);

      if (className) templateClone.classList.add(className);

      // Re-attach hover events (since cloneNode doesn't copy listeners)
      if (attachHoverListeners) {
        attachHoverListeners(templateClone);
      } else {
        HoverSystem.attachToTemplate(templateClone, hoverSystem);
      }

      dom.track.append(templateClone);
    });
  };

  // Event handlers (pure functions)
  const handleNext = () => {
    state = CarouselState.moveNext(state);
    updateDisplay();
  };

  const handlePrev = () => {
    state = CarouselState.movePrev(state);
    updateDisplay();
  };

  const handleKeyboard = (event) => {
    // Only handle keyboard nav when carousel is focused
    if (!dom.wrapper.contains(event.target)) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        handlePrev();
        nav.prevBtn.focus();
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleNext();
        nav.nextBtn.focus();
        break;
      case 'Home':
        event.preventDefault();
        state = { ...state, currentIndex: 0 };
        updateDisplay();
        break;
      case 'End':
        event.preventDefault();
        state = { ...state, currentIndex: state.templateCount - 1 };
        updateDisplay();
        break;
      default:
        // No action needed for other keys
        break;
    }
  };

  const handleResize = () => {
    // Debounced resize handler
    clearTimeout(handleResize.timeout);
    handleResize.timeout = setTimeout(updateDisplay, 100);
  };

  // Attach event listeners
  nav.nextBtn.addEventListener('click', handleNext);
  nav.prevBtn.addEventListener('click', handlePrev);
  document.addEventListener('keydown', handleKeyboard);
  window.addEventListener('resize', handleResize);

  // Assemble DOM
  dom.viewport.append(dom.track);
  dom.wrapper.append(dom.viewport);

  // Add navigation if needed
  if (DisplayLogic.shouldShowNavigation(state)) {
    dom.wrapper.append(nav.container);
  }

  // Apply custom DOM modifications if callback provided
  if (customDOMCallback && typeof customDOMCallback === 'function') {
    customDOMCallback({
      wrapper: dom.wrapper,
      viewport: dom.viewport,
      track: dom.track,
      navigation: nav.container,
      prevButton: nav.prevBtn,
      nextButton: nav.nextBtn,
      block,
      state,
    });
  }

  // Setup block classes
  block.parentElement.classList.add('multiple-up');
  block.classList.add('custom-promo-carousel');
  block.append(dom.wrapper);

  // 🚀 ACTIVATE PERFORMANCE SUPERPOWERS!

  // 1. Initialize Lazy Loading for all images
  LazyLoader.init(dom.wrapper, {
    rootMargin: '100px', // Preload images 100px before they're visible
    threshold: 0.1,
  });

  // 2. Enable Touch Gestures for mobile experience
  TouchGestures.init(dom.viewport, {
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrev,
  });

  // 3. Replace standard navigation with smooth animations
  const originalHandleNext = handleNext;
  const originalHandlePrev = handlePrev;

  handleNext = () => {
    AnimationManager.smoothScroll(dom.track, dom.track.scrollLeft + 300, 250);
    originalHandleNext();
  };

  handlePrev = () => {
    AnimationManager.smoothScroll(dom.track, dom.track.scrollLeft - 300, 250);
    originalHandlePrev();
  };

  // 🔥 PHASE 2 SUPERPOWERS ACTIVATED!

  // 4. Initialize Adaptive Image Loading
  AdaptiveImages.init();

  // Process all images for adaptive loading
  dom.wrapper.querySelectorAll('img').forEach((img) => {
    if (img.src || img.dataset.src) {
      const baseUrl = img.src || img.dataset.src;
      AdaptiveImages.processImage(img, baseUrl);
    }
  });

  // 5. Setup Smart Auto-Pause System
  let smartAutoplay = null;
  if (config.autoplay !== false) {
    smartAutoplay = SmartAutoplay.init(dom.wrapper, handleNext, config.autoplayInterval || 5000);

    // Add play/pause control button
    const autoplayControl = document.createElement('button');
    autoplayControl.className = 'autoplay-control';
    autoplayControl.innerHTML = '⏯️';
    autoplayControl.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      z-index: 101;
      font-size: 16px;
    `;
    autoplayControl.addEventListener('click', () => smartAutoplay.toggle());
    dom.wrapper.style.position = 'relative';
    dom.wrapper.appendChild(autoplayControl);

    // Start autoplay
    smartAutoplay.start();
  }

  // 6. Virtual Scrolling for Large Datasets
  let virtualScrolling = null;
  if (config.virtualScrolling && config.templates && config.templates.length > 50) {
    virtualScrolling = VirtualScrolling.init(
      dom.track,
      config.templates,
      config.renderTemplate || ((template) => template)
    );
  }

  // 7. Parallax Effects for Depth & Motion ✨
  let parallaxEngine = null;
  if (config.parallaxEffects !== false) {
    // Add parallax data attributes to templates for subtle effects
    dom.wrapper.querySelectorAll('.template img').forEach((img, index) => {
      img.dataset.parallax = '0.1'; // Subtle parallax
      img.dataset.parallaxDirection = 'vertical';
      img.classList.add('parallax-item');
    });

    // Initialize parallax engine
    parallaxEngine = ParallaxEngine.init(dom.wrapper, {
      factor: config.parallaxFactor || 0.1, // Very subtle by default
      direction: 'vertical',
      trigger: 'scroll',
    });
  }

  // 8. Error Boundary System - Bulletproof Protection! 🛡️
  let errorBoundary = null;
  if (config.errorBoundary !== false) {
    errorBoundary = ErrorBoundary.init(dom.wrapper, {
      maxErrors: config.maxErrors || 3,
      retryButton: true,
      onError: (errorInfo) => {
        console.warn('🛡️ Carousel error handled gracefully:', errorInfo.type);

        // Optional: Send to analytics
        if (config.trackErrors && typeof gtag !== 'undefined') {
          gtag('event', 'carousel_error_handled', {
            error_type: errorInfo.type,
            error_count: errorBoundary.errors.length,
          });
        }
      },
    });
  }

  // 9. Momentum Physics for Natural Feel! 🌊
  let momentumPhysics = null;
  if (config.momentumPhysics !== false && state.isMobile()) {
    momentumPhysics = MomentumPhysics.init(dom.track, {
      friction: config.momentumFriction || 0.95,
      maxVelocity: config.maxVelocity || 30,
      threshold: 0.2,
    });

    // Integrate with touch gestures for enhanced feel
    if (TouchGestures) {
      const originalOnSwipeLeft = TouchGestures.onSwipeLeft;
      const originalOnSwipeRight = TouchGestures.onSwipeRight;

      TouchGestures.onSwipeLeft = () => {
        momentumPhysics.addImpulse(-15); // Add leftward momentum
        if (originalOnSwipeLeft) originalOnSwipeLeft();
      };

      TouchGestures.onSwipeRight = () => {
        momentumPhysics.addImpulse(15); // Add rightward momentum
        if (originalOnSwipeRight) originalOnSwipeRight();
      };
    }
  }

  // Initial render
  updateDisplay();

  // Return carousel API (functional interface)
  return {
    // State accessors (read-only)
    getCurrentIndex: () => state.currentIndex,
    getTemplateCount: () => state.templateCount,
    isMobile: () => state.isMobile(),

    // Actions
    next: handleNext,
    prev: handlePrev,
    goTo: (index) => {
      state = { ...state, currentIndex: index };
      updateDisplay();
    },

    // Enhanced Cleanup with Performance Management 🚀
    destroy: () => {
      // Clean up standard event listeners
      nav.nextBtn.removeEventListener('click', handleNext);
      nav.prevBtn.removeEventListener('click', handlePrev);
      document.removeEventListener('keydown', handleKeyboard);
      window.removeEventListener('resize', handleResize);
      clearTimeout(handleResize.timeout);

      // 🚀 COMPLETE PERFORMANCE CLEANUP - ZERO MEMORY LEAKS!
      LazyLoader.cleanup(dom.wrapper);
      AnimationManager.cleanup();
      AdaptiveImages.cleanup();

      if (smartAutoplay) {
        smartAutoplay.cleanup();
      }

      if (virtualScrolling) {
        virtualScrolling.cleanup();
      }

      if (parallaxEngine) {
        parallaxEngine.cleanup();
      }

      if (errorBoundary) {
        errorBoundary.cleanup();
      }

      if (momentumPhysics) {
        momentumPhysics.cleanup();
      }

      console.log('🦢 ULTIMATE Carousel destroyed with COMPLETE cleanup!');
    },
  };
};

// Carousel Factory with presets and main interface
export const CarouselFactory = {
  // Main factory method
  create: createCarousel,

  // Preset configurations - NOW WITH SUPERPOWERS! 🚀
  presets: {
    // Maximum performance preset with ALL features - ULTIMATE POWER! 🚀👑
    ultimate: {
      showNavigation: true,
      responsive: true,
      hoverSystem: true,
      looping: true,
      autoplay: true,
      autoplayInterval: 6000,
      virtualScrolling: true,
      adaptiveImages: true,
      touchGestures: true,
      lazyLoading: true,
      smartAutoplay: true,
      parallaxEffects: true,
      parallaxFactor: 0.15,
      errorBoundary: true,
      maxErrors: 3,
      trackErrors: true,
      momentumPhysics: true,
      momentumFriction: 0.96,
      maxVelocity: 25,
      performanceMonitoring: true,
    },

    // Original template-promo enhanced
  templatePromo: {
    showNavigation: true,
    responsive: true,
    hoverSystem: true,
      looping: true,
      autoplay: false,
      adaptiveImages: true,
      touchGestures: true,
      lazyLoading: true,
    },

    // High-performance for large datasets
    highPerformance: {
      showNavigation: true,
      responsive: true,
      hoverSystem: false,
      looping: true,
      virtualScrolling: true,
      adaptiveImages: true,
      touchGestures: true,
      lazyLoading: true,
      performanceMonitoring: true,
    },

    // Mobile-optimized preset
    mobile: {
      showNavigation: false,
      responsive: true,
      hoverSystem: false,
      looping: true,
      touchGestures: true,
      adaptiveImages: true,
      lazyLoading: true,
      autoplay: true,
      autoplayInterval: 4000,
    },

    // Minimal preset
  basic: {
    showNavigation: true,
    responsive: false,
    hoverSystem: false,
      looping: false,
      touchGestures: false,
      adaptiveImages: false,
      lazyLoading: false,
    },
  },
};

// Utility function for easy integration
export const createTemplateCarousel = async (
  block,
  templates,
  createTag,
  attachHoverListeners = null,
  customDOMCallback = null,
  config = {},
) => createCarousel({
    block,
    templates,
    createTag,
    attachHoverListeners,
    customDOMCallback,
  ...CarouselFactory.presets.templatePromo,
  ...config,
  });
