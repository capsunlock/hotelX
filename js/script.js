// Polyfill for older browsers
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Smooth scroll function with fallback
function smoothScrollTo(targetId) {
  const element = document.querySelector(targetId);
  if (!element) return;
  
  const navHeight = document.querySelector('nav')?.offsetHeight || 0;
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
  
  // Use native smooth scroll if available
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  } else {
    // Fallback for older browsers
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = progress * (2 - progress); // easeOutQuad
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  }
}

// Main application class to manage event listeners and cleanup
class HotelWebsite {
  constructor() {
    this.listeners = [];
    this.observer = null;
    this.slideshowInterval = null;
    this.resizeTimer = null;
    this.currentSlideIndex = 0;
    this.isPaused = false;
    
    // Cache DOM elements
    this.elements = {};
    this.cacheElements();
    
    // Initialize only if all required elements exist
    if (this.checkRequiredElements()) {
      this.init();
    }
  }
  
  cacheElements() {
    // Mobile menu elements
    this.elements.mobileMenuButton = document.getElementById('mobile-menu-button');
    this.elements.closeMenuButton = document.getElementById('close-menu-button');
    this.elements.mobileMenuContainer = document.getElementById('mobile-menu-container');
    this.elements.backdrop = document.getElementById('backdrop');
    
    // Theme switcher elements
    this.elements.body = document.body;
    this.elements.nav = document.querySelector('nav');
    this.elements.desktopThemeSwitcher = document.getElementById('theme-switcher-desktop');
    this.elements.mobileThemeSwitcher = document.getElementById('theme-switcher-mobile');
    this.elements.mobileMoonIcon = document.getElementById('moon-icon-mobile');
    this.elements.mobileSunIcon = document.getElementById('sun-icon-mobile');
    this.elements.desktopMoonIcon = document.getElementById('moon-icon');
    this.elements.desktopSunIcon = document.getElementById('sun-icon');
    this.elements.navTitle = document.querySelector('.nav-title');
    
    // Gallery elements
    this.elements.showMoreBtn = document.getElementById('show-more-btn');
    this.elements.hiddenImages = document.querySelectorAll('.more-gallery-item');
    this.elements.galleryGrid = document.getElementById('gallery-grid');
    
    // Slideshow elements
    this.elements.slideshowContainer = document.getElementById('slideshow-container');
    this.elements.dots = document.querySelectorAll('.dot');
    this.elements.navLinks = document.querySelectorAll('.nav-link');
    this.elements.sections = document.querySelectorAll('.slideshow-section');
    this.elements.heroSection = document.querySelector('header');
  }
  
  checkRequiredElements() {
    // Check if essential elements exist
    const essentialElements = [
      this.elements.body,
      this.elements.slideshowContainer,
      this.elements.sections
    ];
    
    return essentialElements.every(el => el !== null && el !== undefined);
  }
  
  init() {
    this.setupMobileMenu();
    this.setupThemeSwitcher();
    this.setupGallery();
    this.setupSlideshow();
    this.setupNavigation();
    this.setupResizeHandler();
    
    // Initial setup
    this.updateSlideshow(0);
  }
  
  // Add event listener with tracking for cleanup
  addEventListener(element, event, handler, options = false) {
    if (!element) return;
    
    element.addEventListener(event, handler, options);
    this.listeners.push({ element, event, handler, options });
  }

  handleFocusTrap(e) {
    if (e.key !== 'Tab') {
      return;
    }

    const { mobileMenuContainer } = this.elements;
    const focusableElements = mobileMenuContainer.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled])'
    );

    // Add this check to prevent errors
    if (focusableElements.length === 0) {
        e.preventDefault(); // Prevent tabbing away if there's nothing to focus on
        return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) { // If Shift + Tab
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else { // If Tab
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  }
  
  // Inside the setupMobileMenu method
  setupMobileMenu() {
    const { mobileMenuButton, closeMenuButton, mobileMenuContainer, backdrop } = this.elements;
    
    // Bind the context of 'this' for the event listener
    this.boundHandleFocusTrap = this.handleFocusTrap.bind(this);

    if (mobileMenuButton && closeMenuButton && mobileMenuContainer && backdrop) {
      const openMenu = () => {
        mobileMenuContainer.classList.add('open');
        backdrop.classList.remove('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        // Add the event listener when the menu opens
        document.addEventListener('keydown', this.boundHandleFocusTrap);
        // Focus the first element in the menu
        mobileMenuContainer.querySelector('button, a').focus();
      };
      
      const closeMenu = () => {
        mobileMenuContainer.classList.remove('open');
        backdrop.classList.add('hidden');
        mobileMenuButton?.setAttribute('aria-expanded', 'false');
        // Remove the event listener when the menu closes
        document.removeEventListener('keydown', this.boundHandleFocusTrap);
        // Return focus to the menu button
        mobileMenuButton?.focus();
      };
      
      this.addEventListener(mobileMenuButton, 'click', openMenu);
      this.addEventListener(closeMenuButton, 'click', closeMenu);
      this.addEventListener(backdrop, 'click', closeMenu);
    }
  }
  
  setupThemeSwitcher() {
    const { 
      body, nav, desktopThemeSwitcher, mobileThemeSwitcher,
      mobileMoonIcon, mobileSunIcon, desktopMoonIcon, desktopSunIcon,
      navTitle, mobileMenuContainer
    } = this.elements;
    
    if (!desktopThemeSwitcher || !mobileThemeSwitcher) return;
    
    const toggleTheme = () => {
      const isLight = body.dataset.theme === 'light';
      const newTheme = isLight ? 'dark' : 'light';
      
      body.dataset.theme = newTheme;
      
      // Update aria-pressed for accessibility
      if (desktopThemeSwitcher) {
        desktopThemeSwitcher.setAttribute('aria-pressed', (!isLight).toString());
      }
      if (mobileThemeSwitcher) {
        mobileThemeSwitcher.setAttribute('aria-pressed', (!isLight).toString());
      }
      
      // Toggle icons
      if (mobileMoonIcon && mobileSunIcon) {
        mobileMoonIcon.classList.toggle('hidden', !isLight);
        mobileSunIcon.classList.toggle('hidden', isLight);
      }
      if (desktopMoonIcon && desktopSunIcon) {
        desktopMoonIcon.classList.toggle('hidden', !isLight);
        desktopSunIcon.classList.toggle('hidden', isLight);
      }
      
      // Store preference in localStorage if available
      try {
        if (window.localStorage) {
          localStorage.setItem('theme', newTheme);
        }
      } catch (e) {
        // localStorage not available
      }
    };
    
    // Load saved theme preference
    try {
      if (window.localStorage) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          body.dataset.theme = savedTheme;
          if (savedTheme === 'light') {
            toggleTheme(); // Sync icon states
            body.dataset.theme = 'light'; // Reset to light after toggle
          }
        }
      }
    } catch (e) {
      // localStorage not available
    }
    
    this.addEventListener(desktopThemeSwitcher, 'click', toggleTheme);
    this.addEventListener(mobileThemeSwitcher, 'click', toggleTheme);
  }
  
  setupGallery() {
    const { showMoreBtn, hiddenImages, galleryGrid } = this.elements;
    
    if (!showMoreBtn) return;
    
    const showMore = () => {
      if (hiddenImages) {
        hiddenImages.forEach(image => {
          image.classList.remove('hidden');
        });
      }
      showMoreBtn.classList.add('hidden');
      
      // Use ResizeObserver if available, otherwise use RAF
      if (window.ResizeObserver && galleryGrid) {
        const resizeObserver = new ResizeObserver(() => {
          this.adjustContainerHeight();
          resizeObserver.disconnect();
        });
        resizeObserver.observe(galleryGrid);
      } else {
        // Fallback using requestAnimationFrame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.adjustContainerHeight();
          });
        });
      }
    };
    
    this.addEventListener(showMoreBtn, 'click', showMore);
  }
  
  setupSlideshow() {
    const { slideshowContainer, dots, sections, heroSection } = this.elements;
    
    if (!slideshowContainer || !sections || sections.length === 0) return;
    
    // Add click listeners to dots
    if (dots) {
      dots.forEach(dot => {
        this.addEventListener(dot, 'click', (event) => {
          const index = parseInt(event.target.dataset.index, 10);
          if (!isNaN(index)) {
            this.updateSlideshow(index);
            this.startSlideshow();
          }
        });
      });
    }
    
    // Setup Intersection Observer with better configuration
    if (heroSection && 'IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px', // Trigger when hero is 20% visible
        threshold: [0, 0.25, 0.5, 0.75, 1]
      };
      
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0.25) {
            this.startSlideshow();
          } else {
            this.stopSlideshow();
          }
        });
      }, observerOptions);
      
      this.observer.observe(heroSection);
    } else {
      // Fallback: start slideshow immediately
      this.startSlideshow();
    }
    
    // Pause/Resume on hover
    this.addEventListener(slideshowContainer, 'mouseenter', () => {
      this.isPaused = true;
    });
    
    this.addEventListener(slideshowContainer, 'mouseleave', () => {
      this.isPaused = false;
    });
  }
  
  setupNavigation() {
    const { navLinks, mobileMenuContainer, backdrop } = this.elements;
    
    if (!navLinks) return;
    
    navLinks.forEach(link => {
      this.addEventListener(link, 'click', (event) => {
        event.preventDefault();
        
        const index = parseInt(link.dataset.index, 10);
        const href = link.getAttribute('href');
        
        // Handle slideshow navigation
        if (!isNaN(index) && index < 3) {
          this.updateSlideshow(index);
          this.startSlideshow();
        }
        
        // Handle smooth scrolling to sections
        if (href && href.startsWith('#')) {
          smoothScrollTo(href);
        }
        
        // Close mobile menu if open
        if (link.closest('#mobile-menu-container')) {
          mobileMenuContainer?.classList.remove('open');
          backdrop?.classList.add('hidden');
          const mobileMenuButton = document.getElementById('mobile-menu-button');
          if (mobileMenuButton) {
            mobileMenuButton.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
  }
  
  setupResizeHandler() {
    // Debounced resize handler
    const handleResize = debounce(() => {
      this.adjustContainerHeight();
    }, 150);
    
    this.addEventListener(window, 'resize', handleResize);
  }
  
  adjustContainerHeight() {
    const { sections, slideshowContainer } = this.elements;
    
    if (!sections || !slideshowContainer || !sections[this.currentSlideIndex]) return;
    
    const activeSectionHeight = sections[this.currentSlideIndex].offsetHeight;
    slideshowContainer.style.height = `${activeSectionHeight}px`;
  }
  
  updateSlideshow(index) {
    const { sections, slideshowContainer, dots, navLinks } = this.elements;
    
    if (!sections || !slideshowContainer) return;
    
    // Ensure the index is within the valid range
    this.currentSlideIndex = (index + sections.length) % sections.length;
    const offset = this.currentSlideIndex * -100;
    slideshowContainer.style.transform = `translateX(${offset}vw)`;
    
    // Adjust the container's height
    this.adjustContainerHeight();
    
    // Update dot highlights and aria-selected
    if (dots) {
      dots.forEach((dot) => {
        const dotIndex = parseInt(dot.dataset.index, 10);
        const isActive = dotIndex === this.currentSlideIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive.toString());
      });
    }
    
    // Update nav link glows
    if (navLinks) {
      navLinks.forEach((link) => {
        const linkIndex = parseInt(link.dataset.index, 10);
        link.classList.toggle('nav-link-glow', linkIndex === this.currentSlideIndex);
      });
    }
  }
  
  startSlideshow() {
    this.stopSlideshow(); // Clear existing interval
    
    this.slideshowInterval = setInterval(() => {
      if (!this.isPaused) {
        this.updateSlideshow(this.currentSlideIndex + 1);
      }
    }, 36000);
  }
  
  stopSlideshow() {
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
      this.slideshowInterval = null;
    }
  }
  
  // Cleanup method to remove all event listeners
  destroy() {
    // Remove all tracked event listeners
    this.listeners.forEach(({ element, event, handler, options }) => {
      if (element) {
        element.removeEventListener(event, handler, options);
      }
    });
    this.listeners = [];
    
    // Stop slideshow
    this.stopSlideshow();
    
    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    // Clear resize timer
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }
  }
}

// Global instance
let hotelWebsite = null;

// Initialize when DOM is ready
function initWebsite() {
  // Clean up existing instance if it exists (for SPAs)
  if (hotelWebsite) {
    hotelWebsite.destroy();
  }
  
  hotelWebsite = new HotelWebsite();
  
  // Expose destroy method globally for SPA cleanup
  window.destroyHotelWebsite = () => {
    if (hotelWebsite) {
      hotelWebsite.destroy();
      hotelWebsite = null;
    }
  };
}

// Initialize based on document ready state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWebsite);
} else {
  // DOM is already ready
  initWebsite();
}

// Cleanup on page unload (for SPAs)
window.addEventListener('beforeunload', () => {
  if (hotelWebsite) {
    hotelWebsite.destroy();
  }
}); 