/* ==========================================================================
   HOLISTIC PSYCHOLOGICAL SERVICES - COMPLETE ORGANIZED JAVASCRIPT
   Modern, Sleek, Minimalistic Interactions with Enhanced Features
   ========================================================================== */

/* ==========================================================================
   1. Global Variables & Configuration
   ========================================================================== */

// Configuration object
const CONFIG = {
    animations: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 100
    },
    scroll: {
        offset: 100,
        threshold: 0.1
    },
    mobile: {
        breakpoint: 768
    },
    hero: {
        backgroundTransitionDuration: 8000, // 8 seconds between background changes
        backgroundImages: 3
    },
    fab: {
        showDelay: 1000
    }
};

// Global state
const STATE = {
    isScrolled: false,
    isMobileMenuOpen: false,
    currentSection: 'home',
    observers: new Map(),
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    heroBackgroundIndex: 0,
    heroBackgroundInterval: null,
    isContactFabOpen: false,
    scrollPosition: 0
};

/* ==========================================================================
   2. Utility Functions
   ========================================================================== */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
const isMobile = () => window.innerWidth < CONFIG.mobile.breakpoint;

/**
 * Get element's offset top
 * @param {Element} element - Target element
 * @returns {number} Offset top value
 */
const getOffsetTop = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top + window.pageYOffset;
};

/**
 * Smooth scroll to element
 * @param {Element} target - Target element
 */
const smoothScrollTo = (target) => {
    const targetPosition = getOffsetTop(target) - 100;
    
    if (STATE.isReducedMotion) {
        window.scrollTo(0, targetPosition);
        return;
    }
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
};

/**
 * Smooth scroll to top
 */
const smoothScrollToTop = () => {
    if (STATE.isReducedMotion) {
        window.scrollTo(0, 0);
        return;
    }
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

/**
 * Add animation class with delay
 * @param {Element} element - Target element
 * @param {string} className - Animation class name
 * @param {number} delay - Delay in milliseconds
 */
const animateElement = (element, className = 'fade-in', delay = 0) => {
    if (STATE.isReducedMotion) {
        element.classList.add('visible');
        return;
    }
    
    setTimeout(() => {
        element.classList.add(className);
        element.classList.add('visible');
    }, delay);
};

/**
 * Stagger animations for multiple elements
 * @param {NodeList} elements - Elements to animate
 * @param {string} className - Animation class name
 * @param {number} staggerDelay - Delay between elements
 */
const staggerAnimations = (elements, className = 'fade-in', staggerDelay = CONFIG.animations.stagger) => {
    elements.forEach((element, index) => {
        const delay = STATE.isReducedMotion ? 0 : index * staggerDelay;
        animateElement(element, className, delay);
    });
};

/* ==========================================================================
   3. Header & Navigation - Complete Mobile Menu System
   ========================================================================== */

/**
 * Mobile Menu Controller Class
 */
class MobileMenuController {
    constructor() {
        this.isOpen = false;
        this.isAnimating = false;
        
        // Get DOM elements
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.menuPanel = document.getElementById('mobileMenuPanel');
        this.menuOverlay = document.getElementById('mobileMenuOverlay');
        this.menuClose = document.getElementById('mobileMenuClose');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
        this.body = document.body;
        
        this.init();
    }
    
    init() {
        if (!this.menuToggle || !this.menuPanel || !this.menuOverlay) {
            console.warn('Mobile menu elements not found');
            return;
        }
        
        this.bindEvents();
        this.setupAccessibility();
        this.syncActiveStates();
        
        console.log('✅ Modern mobile menu initialized');
    }
    
    bindEvents() {
        // Toggle menu
        this.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // Close menu
        this.menuClose?.addEventListener('click', () => {
            this.closeMenu();
        });
        
        // Close on overlay click
        this.menuOverlay.addEventListener('click', () => {
            this.closeMenu();
        });
        
        // Handle mobile nav links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e, link);
            });
        });
        
        // Handle desktop nav links (sync mobile menu state)
        this.desktopNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.updateActiveStates(link.getAttribute('href'));
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991 && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Prevent scroll on touch move when menu is open
        this.menuPanel.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        });
        
        this.menuOverlay.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
    }
    
    setupAccessibility() {
        // Set initial ARIA attributes
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-controls', 'mobileMenuPanel');
        this.menuPanel.setAttribute('aria-labelledby', 'mobileMenuToggle');
        this.menuPanel.setAttribute('role', 'dialog');
        this.menuPanel.setAttribute('aria-modal', 'true');
        
        // Add focus trap when menu is open
        this.setupFocusTrap();
    }
    
    setupFocusTrap() {
        const focusableElements = this.menuPanel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        this.firstFocusable = focusableElements[0];
        this.lastFocusable = focusableElements[focusableElements.length - 1];
        
        this.menuPanel.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isOpen) {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === this.firstFocusable) {
                        e.preventDefault();
                        this.lastFocusable?.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === this.lastFocusable) {
                        e.preventDefault();
                        this.firstFocusable?.focus();
                    }
                }
            }
        });
    }
    
    toggleMenu() {
        if (this.isAnimating) return;
        
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        if (this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = true;
        
        // Prevent body scroll
        this.body.classList.add('menu-open');
        this.body.style.overflow = 'hidden';
        
        // Update toggle button state
        this.menuToggle.classList.add('active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        
        // Show overlay
        this.menuOverlay.classList.add('active');
        
        // Show panel with delay for smooth animation
        requestAnimationFrame(() => {
            this.menuPanel.classList.add('active');
            
            // Reset nav link animations
            this.mobileNavLinks.forEach((link, index) => {
                link.style.animation = 'none';
                link.offsetHeight; // Trigger reflow
                link.style.animation = `slideInFromRight 0.5s ease forwards`;
                link.style.animationDelay = `${0.1 + (index * 0.05)}s`;
            });
        });
        
        // Focus management
        setTimeout(() => {
            this.isAnimating = false;
            this.menuClose?.focus();
            this.announceToScreenReader('Mobile menu opened');
        }, 400);
    }
    
    closeMenu() {
        if (!this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = false;
        
        // Update toggle button state
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        
        // Hide panel
        this.menuPanel.classList.remove('active');
        
        // Hide overlay with delay
        setTimeout(() => {
            this.menuOverlay.classList.remove('active');
        }, 100);
        
        // Re-enable body scroll
        setTimeout(() => {
            this.body.classList.remove('menu-open');
            this.body.style.overflow = '';
            this.isAnimating = false;
            
            // Return focus to toggle button
            this.menuToggle.focus();
            this.announceToScreenReader('Mobile menu closed');
        }, 400);
    }
    
    handleNavClick(event, link) {
        event.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Update active states
            this.updateActiveStates(targetId);
            
            // Close menu
            this.closeMenu();
            
            // Scroll to section with delay to allow menu close animation
            setTimeout(() => {
                smoothScrollTo(targetSection);
            }, 200);
        }
    }
    
    updateActiveStates(activeHref) {
        // Update mobile nav links
        this.mobileNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === activeHref);
        });
        
        // Update desktop nav links
        this.desktopNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === activeHref);
        });
    }
    
    syncActiveStates() {
        // Find currently active desktop link
        const activeDesktopLink = document.querySelector('.desktop-nav .nav-link.active');
        if (activeDesktopLink) {
            const activeHref = activeDesktopLink.getAttribute('href');
            this.updateActiveStates(activeHref);
        }
    }
    
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

/**
 * Enhanced Header Controller
 */
class HeaderController {
    constructor() {
        this.header = document.getElementById('header');
        this.isScrolled = false;
        this.scrollThreshold = 50;
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        this.bindEvents();
        this.checkScrollPosition();
        
        console.log('✅ Header controller initialized');
    }
    
    bindEvents() {
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 16));
        
        window.addEventListener('resize', debounce(() => {
            this.handleResize();
        }, 250));
        
        // Handle navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });
    }
    
    handleScroll() {
        const scrolled = window.scrollY > this.scrollThreshold;
        STATE.scrollPosition = window.scrollY;
        
        if (scrolled !== this.isScrolled) {
            this.isScrolled = scrolled;
            this.header.classList.toggle('scrolled', scrolled);
        }
        
        this.updateActiveNavigation();
    }
    
    handleResize() {
        this.checkScrollPosition();
    }
    
    handleNavClick(event, link) {
        event.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            smoothScrollTo(targetSection);
            this.updateActiveNavLink(link);
        }
    }
    
    updateActiveNavLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink?.classList.add('active');
    }
    
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = getOffsetTop(section) - CONFIG.scroll.offset;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.pageYOffset;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection && currentSection !== STATE.currentSection) {
            STATE.currentSection = currentSection;
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
            this.updateActiveNavLink(activeLink);
        }
    }
    
    checkScrollPosition() {
        this.handleScroll();
    }
}

/**
 * Initialize Header System
 */
const initializeHeader = () => {
    new MobileMenuController();
    new HeaderController();
    
    console.log('✅ Complete header system initialized');
};

/* ==========================================================================
   4. Hero Section - Clean Logo Design & Background Rotation
   ========================================================================== */

/**
 * Hero Controller Class - Updated with Clean Logo Design
 */
class HeroController {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.backgroundImages = document.querySelectorAll('.hero-bg-image');
        this.logoContainer = document.querySelector('.hero-logo-container');
        this.logoImage = document.querySelector('.hero-logo');
        this.heroButtons = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary');
        
        this.currentImageIndex = 0;
        this.backgroundInterval = null;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (!this.heroSection) return;
        
        this.initializeBackgroundRotation();
        this.initializeLogoInteractions();
        this.initializeButtonEffects();
        this.initializeLogoLoading();
        this.handleVisibilityChange();
        this.handleMotionPreference();
        
        console.log('✅ Hero section initialized with clean logo design');
    }
    
    initializeLogoLoading() {
        if (!this.logoImage) return;
        
        // Set initial state for smooth loading
        this.logoImage.style.opacity = '0';
        this.logoImage.style.transition = 'opacity 0.5s ease';
        
        // Handle successful load
        this.logoImage.addEventListener('load', () => {
            console.log('✅ Logo loaded successfully');
            this.logoImage.style.opacity = '1';
        });
        
        // If image is already cached and loaded
        if (this.logoImage.complete && this.logoImage.naturalHeight !== 0) {
            this.logoImage.style.opacity = '1';
        }
        
        // Add error handling that doesn't hide the logo
        this.logoImage.addEventListener('error', () => {
            console.warn('Logo image failed to load, but keeping container visible');
            // Don't hide the logo - just log the error
            // The container will remain visible with its background
        });
    }
    
    initializeBackgroundRotation() {
        if (this.backgroundImages.length === 0 || this.isReducedMotion) return;
        
        // Show first image immediately
        this.backgroundImages[0].classList.add('active');
        this.currentImageIndex = 0;
        
        // Start rotation interval (8 seconds)
        this.backgroundInterval = setInterval(() => {
            this.rotateBackgroundImage();
        }, CONFIG.hero.backgroundTransitionDuration);
    }
    
    rotateBackgroundImage() {
        if (this.isReducedMotion) return;
        
        // Hide current image
        this.backgroundImages[this.currentImageIndex].classList.remove('active');
        
        // Move to next image
        this.currentImageIndex = (this.currentImageIndex + 1) % this.backgroundImages.length;
        
        // Show next image with smooth transition
        this.backgroundImages[this.currentImageIndex].classList.add('active');
    }
    
    initializeLogoInteractions() {
        if (!this.logoContainer || this.isReducedMotion) return;
        
        let isHovered = false;
        
        const handleMouseEnter = () => {
            if (!isHovered) {
                isHovered = true;
                this.logoContainer.style.transform = 'scale(1.05) rotate(2deg)';
                this.logoContainer.style.filter = 'brightness(1.1)';
            }
        };
        
        const handleMouseLeave = () => {
            if (isHovered) {
                isHovered = false;
                this.logoContainer.style.transform = '';
                this.logoContainer.style.filter = '';
            }
        };
        
        this.logoContainer.addEventListener('mouseenter', handleMouseEnter);
        this.logoContainer.addEventListener('mouseleave', handleMouseLeave);
        
        // Logo click animation
        this.logoContainer.addEventListener('click', () => {
            if (this.isReducedMotion) return;
            
            this.logoContainer.style.animation = 'none';
            this.logoContainer.offsetHeight; // Trigger reflow
            this.logoContainer.style.animation = 'logoFloat 6s ease-in-out infinite';
        });
    }
    
    initializeButtonEffects() {
        this.heroButtons.forEach(button => {
            this.addButtonRippleEffect(button);
            this.addButtonHoverEnhancement(button);
        });
    }
    
    addButtonRippleEffect(button) {
        button.addEventListener('click', (e) => {
            if (this.isReducedMotion) return;
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 1.5;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: 0;
                height: 0;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
                transform: translate(-50%, -50%);
                animation: heroRipple 0.8s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            // Add ripple animation if not exists
            if (!document.querySelector('#hero-ripple-animation')) {
                this.addRippleStyles(size);
            }
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 800);
        });
    }
    
    addRippleStyles(size) {
        const style = document.createElement('style');
        style.id = 'hero-ripple-animation';
        style.textContent = `
            @keyframes heroRipple {
                to {
                    width: ${size}px;
                    height: ${size}px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    addButtonHoverEnhancement(button) {
        // Subtle hover effect enhancement
        button.addEventListener('mouseenter', () => {
            if (this.isReducedMotion) return;
            
            button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transition = 'all 0.3s ease';
        });
    }
    
    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.backgroundInterval) {
                clearInterval(this.backgroundInterval);
            } else if (!document.hidden && !this.isReducedMotion) {
                this.initializeBackgroundRotation();
            }
        });
    }
    
    handleMotionPreference() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            
            if (this.isReducedMotion && this.backgroundInterval) {
                clearInterval(this.backgroundInterval);
            } else if (!this.isReducedMotion) {
                this.initializeBackgroundRotation();
            }
        });
    }
    
    // Public method to manually trigger background rotation
    nextBackground() {
        this.rotateBackgroundImage();
    }
    
    // Public method to pause/resume background rotation
    toggleBackgroundRotation() {
        if (this.backgroundInterval) {
            clearInterval(this.backgroundInterval);
            this.backgroundInterval = null;
        } else {
            this.initializeBackgroundRotation();
        }
    }
    
    // Cleanup method
    destroy() {
        if (this.backgroundInterval) {
            clearInterval(this.backgroundInterval);
        }
        
        // Remove event listeners
        this.heroButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        if (this.logoContainer) {
            this.logoContainer.replaceWith(this.logoContainer.cloneNode(true));
        }
    }
}

/**
 * Enhanced Intersection Observer for Hero Animations
 */
class HeroAnimationObserver {
    constructor() {
        this.heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-location, .btn-hero-primary, .btn-hero-secondary');
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (this.isReducedMotion) {
            // Show all elements immediately if reduced motion is preferred
            this.heroElements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.heroElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            observer.observe(element);
        });
    }
}

/**
 * Initialize hero section with all features
 */
const initializeHero = () => {
    // Initialize hero controller
    const heroController = new HeroController();
    
    // Initialize animation observer
    const animationObserver = new HeroAnimationObserver();
    
    // Make hero controller globally accessible
    window.heroController = heroController;
    
    // Cleanup interval when page is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && STATE.heroBackgroundInterval) {
            clearInterval(STATE.heroBackgroundInterval);
        } else if (!document.hidden) {
            if (window.heroController && !window.heroController.isReducedMotion) {
                window.heroController.initializeBackgroundRotation();
            }
        }
    });
    
    console.log('✅ Hero section with clean logo design initialized');
};

/* ==========================================================================
   5. About Section - Animations, Interactions, Mobile Responsive
   ========================================================================== */

/**
 * Initialize about section with all features
 */
const initializeAbout = () => {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;
    
    // About Section Scroll Animations
    const initializeAboutAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const valueItems = entry.target.querySelectorAll('.value-item');
                    const leaderProfiles = entry.target.querySelectorAll('.leader-profile');
                    const missionCard = entry.target.querySelector('.mission-card');
                    const statsCard = entry.target.querySelector('.team-stats-card');
                    
                    // Animate mission card first
                    if (missionCard) {
                        animateElement(missionCard, 'fade-in', 0);
                    }
                    
                    // Then animate value items
                    setTimeout(() => {
                        staggerAnimations(valueItems, 'fade-in', 150);
                    }, 200);
                    
                    // Animate leader profiles
                    setTimeout(() => {
                        staggerAnimations(leaderProfiles, 'fade-in', 100);
                    }, 400);
                    
                    // Finally animate stats card
                    if (statsCard) {
                        setTimeout(() => {
                            animateElement(statsCard, 'fade-in', 0);
                        }, 600);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(aboutSection);
        STATE.observers.set('about', observer);
    };
    
    // About Interactive Elements
    const initializeAboutInteractions = () => {
        // Value item hover effects
        const valueItems = aboutSection.querySelectorAll('.value-item');
        valueItems.forEach(item => {
            let isHovered = false;
            
            item.addEventListener('mouseenter', () => {
                if (!isHovered && !STATE.isReducedMotion) {
                    isHovered = true;
                    const icon = item.querySelector('.value-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1.1) rotate(5deg)';
                    }
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (isHovered) {
                    isHovered = false;
                    const icon = item.querySelector('.value-icon');
                    if (icon) {
                        icon.style.transform = '';
                    }
                }
            });
        });
        
        // Leader profile interactions
        const leaderProfiles = aboutSection.querySelectorAll('.leader-profile');
        leaderProfiles.forEach(profile => {
            profile.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    const image = profile.querySelector('.leader-image img');
                    const badge = profile.querySelector('.leader-badge');
                    
                    if (image) {
                        image.style.transform = 'scale(1.1)';
                    }
                    if (badge) {
                        badge.style.transform = 'scale(1.2) rotate(10deg)';
                    }
                }
            });
            
            profile.addEventListener('mouseleave', () => {
                const image = profile.querySelector('.leader-image img');
                const badge = profile.querySelector('.leader-badge');
                
                if (image) {
                    image.style.transform = '';
                }
                if (badge) {
                    badge.style.transform = '';
                }
            });
        });
        
        // Stats animation on hover
        const statItems = aboutSection.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    const icon = item.querySelector('.stat-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1.1) rotateY(10deg)';
                    }
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('.stat-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    };
    
    // About Mobile Responsive Features
    const initializeAboutMobile = () => {
        const handleResize = debounce(() => {
            const leaderProfiles = aboutSection.querySelectorAll('.leader-profile');
            
            if (isMobile()) {
                // Stack leader profiles vertically on mobile
                leaderProfiles.forEach(profile => {
                    profile.classList.add('mobile-stacked');
                });
            } else {
                leaderProfiles.forEach(profile => {
                    profile.classList.remove('mobile-stacked');
                });
            }
        }, 250);
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    };
    
    // Initialize all about features
    initializeAboutAnimations();
    initializeAboutInteractions();
    initializeAboutMobile();
    
    console.log('✅ About section with all features initialized');
};

/* ==========================================================================
   6. Services Section - Animations, Interactions, Mobile Responsive
   ========================================================================== */

/**
 * Initialize services section with all features
 */
const initializeServices = () => {
    const servicesSection = document.querySelector('.services');
    if (!servicesSection) return;
    
    // Services Section Scroll Animations
    const initializeServicesAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const serviceCards = entry.target.querySelectorAll('.service-card');
                    const ctaSection = entry.target.querySelector('.services-cta');
                    
                    // Animate service cards
                    staggerAnimations(serviceCards, 'fade-in', 200);
                    
                    // Animate CTA section after cards
                    if (ctaSection) {
                        setTimeout(() => {
                            animateElement(ctaSection, 'fade-in', 0);
                        }, serviceCards.length * 200 + 400);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(servicesSection);
        STATE.observers.set('services', observer);
    };
    
    // Services Interactive Elements
    const initializeServicesInteractions = () => {
        const serviceCards = servicesSection.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            let isHovered = false;
            
            const handleMouseEnter = () => {
                if (!isHovered && !STATE.isReducedMotion) {
                    isHovered = true;
                    const icon = card.querySelector('.service-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1.1) rotate(5deg)';
                    }
                    
                    const features = card.querySelectorAll('.service-features li');
                    features.forEach((feature, index) => {
                        setTimeout(() => {
                            feature.style.transform = 'translateX(5px)';
                        }, index * 50);
                    });
                }
            };
            
            const handleMouseLeave = () => {
                if (isHovered) {
                    isHovered = false;
                    const icon = card.querySelector('.service-icon');
                    if (icon) {
                        icon.style.transform = '';
                    }
                    
                    const features = card.querySelectorAll('.service-features li');
                    features.forEach(feature => {
                        feature.style.transform = '';
                    });
                }
            };
            
            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
        
        // Service buttons with ripple effect
        const serviceButtons = servicesSection.querySelectorAll('.service-btn, .btn-cta-primary, .btn-cta-secondary');
        serviceButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (STATE.isReducedMotion) return;
                
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 1.5;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    width: 0;
                    height: 0;
                    left: ${e.clientX - rect.left}px;
                    top: ${e.clientY - rect.top}px;
                    transform: translate(-50%, -50%);
                    animation: servicesRipple 0.6s ease-out;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                // Add ripple animation if not exists
                if (!document.querySelector('#services-ripple-animation')) {
                    const style = document.createElement('style');
                    style.id = 'services-ripple-animation';
                    style.textContent = `
                        @keyframes servicesRipple {
                            to {
                                width: ${size}px;
                                height: ${size}px;
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });
        });
    };
    
    // Services Mobile Responsive Features
    const initializeServicesMobile = () => {
        const handleResize = debounce(() => {
            const servicesGrid = servicesSection.querySelector('.services-grid');
            const ctaButtons = servicesSection.querySelector('.cta-buttons');
            
            if (isMobile()) {
                // Optimize for mobile
                servicesGrid?.classList.add('mobile-optimized');
                ctaButtons?.classList.add('mobile-stacked');
            } else {
                servicesGrid?.classList.remove('mobile-optimized');
                ctaButtons?.classList.remove('mobile-stacked');
            }
        }, 250);
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    };
    
    // Initialize all services features
    initializeServicesAnimations();
    initializeServicesInteractions();
    initializeServicesMobile();
    
    console.log('✅ Services section with all features initialized');
};

/* ==========================================================================
   7. Team Section - Animations, Interactions, Mobile Responsive
   ========================================================================== */

/**
 * Initialize team section with all features
 */
const initializeTeam = () => {
    const teamSection = document.querySelector('.team');
    if (!teamSection) return;
    
    // Team Section Scroll Animations
    const initializeTeamAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const teamCards = entry.target.querySelectorAll('.team-card');
                    staggerAnimations(teamCards, 'fade-in', 250);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(teamSection);
        STATE.observers.set('team', observer);
    };
    
    // Team Interactive Elements
    const initializeTeamInteractions = () => {
        const teamCards = teamSection.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    const badge = card.querySelector('.experience-badge');
                    const image = card.querySelector('.team-image');
                    const credentials = card.querySelectorAll('.credential');
                    
                    if (badge) {
                        badge.style.transform = 'scale(1.1) rotate(-5deg)';
                    }
                    if (image) {
                        image.style.transform = 'scale(1.05)';
                    }
                    
                    // Animate credentials
                    credentials.forEach((cred, index) => {
                        setTimeout(() => {
                            cred.style.transform = 'translateY(-2px)';
                        }, index * 100);
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const badge = card.querySelector('.experience-badge');
                const image = card.querySelector('.team-image');
                const credentials = card.querySelectorAll('.credential');
                
                if (badge) {
                    badge.style.transform = '';
                }
                if (image) {
                    image.style.transform = '';
                }
                
                credentials.forEach(cred => {
                    cred.style.transform = '';
                });
            });
        });
    };
    
    // Team Mobile Responsive Features
    const initializeTeamMobile = () => {
        const handleResize = debounce(() => {
            const teamGrid = teamSection.querySelector('.team-grid');
            
            if (isMobile()) {
                teamGrid?.classList.add('mobile-single-column');
            } else {
                teamGrid?.classList.remove('mobile-single-column');
            }
        }, 250);
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    };
    
    // Initialize all team features
    initializeTeamAnimations();
    initializeTeamInteractions();
    initializeTeamMobile();
    
    console.log('✅ Team section with all features initialized');
};

/* ==========================================================================
   8. Reviews Section - Animations, Stats Counter, Mobile Responsive
   ========================================================================== */

/**
 * Initialize reviews section with all features
 */
const initializeReviews = () => {
    const reviewsSection = document.querySelector('.reviews');
    if (!reviewsSection) return;
    
    // Animate stat numbers with counting effect
    const animateStatNumbers = (statItems) => {
        if (STATE.isReducedMotion) return;
        
        statItems.forEach(item => {
            const numberElement = item.querySelector('.stat-number');
            if (!numberElement) return;
            
            const finalValue = numberElement.textContent;
            const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
            
            if (isNaN(numericValue)) return;
            
            let currentValue = 0;
            const increment = numericValue / 30; // 30 steps
            const suffix = finalValue.replace(numericValue.toString(), '');
            
            const updateCounter = () => {
                currentValue += increment;
                
                if (currentValue >= numericValue) {
                    numberElement.textContent = finalValue;
                    return;
                }
                
                const displayValue = Math.floor(currentValue);
                numberElement.textContent = displayValue + suffix;
                requestAnimationFrame(updateCounter);
            };
            
            updateCounter();
        });
    };
    
    // Reviews Section Scroll Animations
    const initializeReviewsAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const heroReview = entry.target.querySelector('.hero-review');
                    const reviewCards = entry.target.querySelectorAll('.review-card');
                    const statItems = entry.target.querySelectorAll('.review-stats .stat-item');
                    
                    // Animate hero review first
                    if (heroReview) {
                        animateElement(heroReview, 'fade-in', 0);
                    }
                    
                    // Then animate review cards
                    setTimeout(() => {
                        staggerAnimations(reviewCards, 'fade-in', 200);
                    }, 300);
                    
                    // Finally animate stats with counters
                    setTimeout(() => {
                        staggerAnimations(statItems, 'fade-in', 150);
                        // Animate stat numbers
                        setTimeout(() => {
                            animateStatNumbers(statItems);
                        }, 500);
                    }, 600 + (reviewCards.length * 200));
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(reviewsSection);
        STATE.observers.set('reviews', observer);
    };
    
    // Reviews Interactive Elements
    const initializeReviewsInteractions = () => {
        const reviewCards = reviewsSection.querySelectorAll('.review-card');
        
        reviewCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    const initial = card.querySelector('.client-initial');
                    const stars = card.querySelectorAll('.stars i');
                    
                    if (initial) {
                        initial.style.transform = 'scale(1.1) rotate(5deg)';
                        initial.style.background = 'var(--gradient-primary)';
                    }
                    
                    // Animate stars
                    stars.forEach((star, index) => {
                        setTimeout(() => {
                            star.style.transform = 'scale(1.2)';
                        }, index * 50);
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const initial = card.querySelector('.client-initial');
                const stars = card.querySelectorAll('.stars i');
                
                if (initial) {
                    initial.style.transform = '';
                    initial.style.background = '';
                }
                
                stars.forEach(star => {
                    star.style.transform = '';
                });
            });
        });
        
        // Hero review interactions
        const heroReview = reviewsSection.querySelector('.hero-review');
        if (heroReview) {
            const authorAvatar = heroReview.querySelector('.author-avatar');
            const ratingStars = heroReview.querySelectorAll('.rating i');
            
            heroReview.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    if (authorAvatar) {
                        authorAvatar.style.transform = 'scale(1.1)';
                    }
                    
                    ratingStars.forEach((star, index) => {
                        setTimeout(() => {
                            star.style.transform = 'rotate(360deg) scale(1.2)';
                        }, index * 100);
                    });
                }
            });
            
            heroReview.addEventListener('mouseleave', () => {
                if (authorAvatar) {
                    authorAvatar.style.transform = '';
                }
                
                ratingStars.forEach(star => {
                    star.style.transform = '';
                });
            });
        }
    };
    
    // Reviews Mobile Responsive Features
    const initializeReviewsMobile = () => {
        const handleResize = debounce(() => {
            const reviewsGrid = reviewsSection.querySelector('.reviews-grid');
            const reviewStats = reviewsSection.querySelector('.review-stats');
            
            if (isMobile()) {
                reviewsGrid?.classList.add('mobile-single-column');
                reviewStats?.classList.add('mobile-optimized');
            } else {
                reviewsGrid?.classList.remove('mobile-single-column');
                reviewStats?.classList.remove('mobile-optimized');
            }
        }, 250);
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    };
    
    // Initialize all reviews features
    initializeReviewsAnimations();
    initializeReviewsInteractions();
    initializeReviewsMobile();
    
    console.log('✅ Reviews section with all features initialized');
};

/* ==========================================================================
   9. Contact Section - Form Handling, Validation, Animations, Mobile
   ========================================================================== */

/**
 * Initialize contact section with all features
 */
const initializeContact = () => {
    const contactSection = document.querySelector('.contact');
    const form = document.getElementById('contactForm');
    
    if (!contactSection) return;
    
    // Contact Form Handling
    const initializeContactForm = () => {
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select, textarea');
        const submitButton = form.querySelector('.btn-submit');
        
        // Form validation
        const validateField = (field) => {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';
            
            // Remove existing error
            removeFieldError(field);
            
            // Required field validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            
            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }
            
            // Phone validation (optional but if provided, should be valid)
            if (field.type === 'tel' && value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
                if (cleanPhone.length > 0 && !phoneRegex.test(cleanPhone)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
            }
            
            if (!isValid) {
                showFieldError(field, errorMessage);
            }
            
            return isValid;
        };
        
        // Show field error
        const showFieldError = (field, message) => {
            const formGroup = field.closest('.form-group');
            const errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
                animation: fadeInUp 0.3s ease;
            `;
            
            formGroup.appendChild(errorElement);
            field.style.borderColor = '#ef4444';
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', errorElement.id = `error-${field.name}`);
        };
        
        // Remove field error
        const removeFieldError = (field) => {
            const formGroup = field.closest('.form-group');
            const errorElement = formGroup.querySelector('.field-error');
            
            if (errorElement) {
                errorElement.remove();
            }
            
            field.style.borderColor = '';
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        };
        
        // Validate entire form
        const validateForm = () => {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        };
        
        // Show form message
        const showFormMessage = (message, type = 'success') => {
            // Remove existing message
            const existingMessage = form.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Create new message
            const messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            messageElement.textContent = message;
            
            const bgColor = type === 'success' ? 'var(--primary-green)' : '#ef4444';
            messageElement.style.cssText = `
                background: ${bgColor};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: var(--radius-lg);
                margin-bottom: 1.5rem;
                text-align: center;
                font-weight: 500;
                animation: fadeInUp 0.5s ease;
                box-shadow: var(--shadow-md);
            `;
            
            form.insertBefore(messageElement, form.firstChild);
            
            // Announce to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader(message);
            }
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        messageElement.remove();
                    }, 300);
                }
            }, 5000);
            
            // Scroll to message
            messageElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        };
        
        // Handle form submission
        const handleSubmit = async (event) => {
            event.preventDefault();
            
            if (!validateForm()) {
                showFormMessage('Please correct the errors above.', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = `
                <span style="opacity: 0.8;">Sending...</span>
                <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            `;
            submitButton.disabled = true;
            
            // Add CSS for loading animation if not exists
            if (!document.querySelector('#contact-loading-animation')) {
                const style = document.createElement('style');
                style.id = 'contact-loading-animation';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes fadeOut {
                        to { opacity: 0; transform: translateY(-10px); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            try {
                // Collect form data
                const formData = new FormData(form);
                const formObject = Object.fromEntries(formData);
                
                // Log form submission (replace with actual API call)
                console.log('Form submitted:', formObject);
                
                // Simulate form submission (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                showFormMessage(
                    'Thank you for your message! We will contact you within 24 hours to discuss your needs and schedule a consultation.',
                    'success'
                );
                
                // Reset form
                form.reset();
                
                // Clear any remaining errors
                inputs.forEach(input => removeFieldError(input));
                
                // Track successful submission
                console.log('Contact form submitted successfully');
                
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage(
                    'We apologize, but there was an error sending your message. Please try again or call us directly at (646) 971-7325.',
                    'error'
                );
            } finally {
                // Restore button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        };
        
        // Event listeners
        form.addEventListener('submit', handleSubmit);
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => removeFieldError(input));
            
            // Enhanced focus effects
            input.addEventListener('focus', (e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 216, 132, 0.2)';
            });
            
            input.addEventListener('blur', (e) => {
                e.target.style.transform = '';
                e.target.style.boxShadow = '';
            });
        });
    };
    
    // Contact Section Animations
    const initializeContactAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const contactCards = entry.target.querySelectorAll('.contact-card');
                    const formContainer = entry.target.querySelector('.contact-form-container');
                    
                    // Animate contact cards
                    staggerAnimations(contactCards, 'slide-left', 150);
                    
                    // Animate form container
                    if (formContainer) {
                        setTimeout(() => {
                            animateElement(formContainer, 'slide-right', 0);
                        }, 300);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(contactSection);
        STATE.observers.set('contact', observer);
    };
    
    // Contact Interactive Elements
    const initializeContactInteractions = () => {
        const contactCards = contactSection.querySelectorAll('.contact-card');
        
        contactCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    const icon = card.querySelector('.card-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1.1) rotate(5deg)';
                    }
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.card-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    };
    
    // Contact Mobile Responsive Features
    const initializeContactMobile = () => {
        const handleResize = debounce(() => {
            const contactContent = contactSection.querySelector('.contact-content');
            
            if (isMobile()) {
                contactContent?.classList.add('mobile-stacked');
            } else {
                contactContent?.classList.remove('mobile-stacked');
            }
        }, 250);
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    };
    
    // Initialize all contact features
    initializeContactForm();
    initializeContactAnimations();
    initializeContactInteractions();
    initializeContactMobile();
    
    console.log('✅ Contact section with all features initialized');
};

/* ==========================================================================
   10. Footer - Mobile Responsive Features
   ========================================================================== */

/**
 * Initialize footer with responsive features
 */
const initializeFooter = () => {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    // Footer Social Links Interactions
    const initializeFooterInteractions = () => {
        const socialLinks = footer.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    link.style.transform = 'translateY(-3px) scale(1.1)';
                }
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
            });
        });
        
        // Footer links hover effects
        const footerLinks = footer.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    link.style.transform = 'translateX(5px)';
                }
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
            });
        });
    };
    
    // Footer Mobile Responsive Features
    const initializeFooterMobile = () => {
        const handleResize = debounce(() => {
            const footerContent = footer.querySelector('.footer-content');
            const footerBottomContent = footer.querySelector('.footer-bottom-content');
            
            if (isMobile()) {
                footerContent?.classList.add('mobile-stacked');
                footerBottomContent?.classList.add('mobile-centered');
            } else {
                footerContent?.classList.remove('mobile-stacked');
                footerBottomContent?.classList.remove('mobile-centered');
            }
        }, 250);
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    };
    
    // Initialize footer features
    initializeFooterInteractions();
    initializeFooterMobile();
    
    console.log('✅ Footer with responsive features initialized');
};

/* ==========================================================================
   11. Floating Action Buttons - Complete System
   ========================================================================== */

/**
 * Initialize back to top button
 */
const initializeBackToTopButton = () => {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Handle back to top click
    backToTopBtn.addEventListener('click', () => {
        smoothScrollToTop();
        
        // Announce to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Scrolled to top of page');
        }
    });
    
    // Add keyboard support
    backToTopBtn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            smoothScrollToTop();
        }
    });
    
    console.log('✅ Back to top button initialized');
};

/**
 * Update back to top button visibility
 */
const updateBackToTopButton = () => {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    const shouldShow = STATE.scrollPosition > 300;
    backToTopBtn.classList.toggle('visible', shouldShow);
};

/**
 * Initialize contact FAB
 */
const initializeContactFAB = () => {
    const contactFab = document.getElementById('contactFab');
    const contactOptions = document.getElementById('contactOptions');
    
    if (!contactFab || !contactOptions) return;
    
    // Toggle contact options
    const toggleContactOptions = () => {
        STATE.isContactFabOpen = !STATE.isContactFabOpen;
        contactFab.classList.toggle('active', STATE.isContactFabOpen);
        contactOptions.classList.toggle('active', STATE.isContactFabOpen);
        
        // Update ARIA attributes
        contactFab.setAttribute('aria-expanded', STATE.isContactFabOpen.toString());
        
        // Announce to screen readers
        if (window.announceToScreenReader) {
            const message = STATE.isContactFabOpen ? 'Contact options opened' : 'Contact options closed';
            window.announceToScreenReader(message);
        }
    };
    
    // Close contact options
    const closeContactOptions = () => {
        if (STATE.isContactFabOpen) {
            STATE.isContactFabOpen = false;
            contactFab.classList.remove('active');
            contactOptions.classList.remove('active');
            contactFab.setAttribute('aria-expanded', 'false');
        }
    };
    
    // Handle FAB click
    contactFab.addEventListener('click', toggleContactOptions);
    
    // Handle keyboard navigation
    contactFab.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleContactOptions();
        } else if (event.key === 'Escape') {
            closeContactOptions();
        }
    });
    
    // Close when clicking outside
    document.addEventListener('click', (event) => {
        if (STATE.isContactFabOpen && 
            !contactFab.contains(event.target) && 
            !contactOptions.contains(event.target)) {
            closeContactOptions();
        }
    });
    
    // Handle contact option clicks with analytics tracking
    const contactOptionLinks = contactOptions.querySelectorAll('.contact-option');
    contactOptionLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const optionType = link.classList.contains('phone') ? 'phone' :
                              link.classList.contains('email') ? 'email' :
                              link.classList.contains('instagram') ? 'instagram' :
                              link.classList.contains('review') ? 'review' : 'unknown';
            
            // Track the interaction (you can integrate with your analytics here)
            console.log(`Contact option clicked: ${optionType}`);
            
            // Close options after click (except for review which opens in new tab)
            if (optionType !== 'review' && optionType !== 'instagram') {
                setTimeout(closeContactOptions, 300);
            }
            
            // Announce to screen readers
            if (window.announceToScreenReader) {
                const actionMessages = {
                    phone: 'Calling phone number',
                    email: 'Opening email client',
                    instagram: 'Opening Instagram page',
                    review: 'Opening Google reviews'
                };
                window.announceToScreenReader(actionMessages[optionType] || 'Contact option selected');
            }
        });
    });
    
    // Set initial ARIA attributes
    contactFab.setAttribute('aria-expanded', 'false');
    contactFab.setAttribute('aria-haspopup', 'true');
    
    console.log('✅ Contact FAB initialized');
};

/**
 * Initialize all floating action buttons
 */
const initializeFloatingActions = () => {
    // Show FABs after a delay
    setTimeout(() => {
        const floatingActions = document.querySelector('.floating-actions');
        if (floatingActions) {
            floatingActions.style.opacity = '1';
            floatingActions.style.visibility = 'visible';
        }
    }, CONFIG.fab.showDelay);
    
    initializeBackToTopButton();
    initializeContactFAB();
    
    // Handle scroll to update back to top button
    window.addEventListener('scroll', throttle(() => {
        updateBackToTopButton();
    }, 16));
    
    console.log('✅ Floating actions system initialized');
};

/* ==========================================================================
   12. Accessibility Enhancements
   ========================================================================== */

/**
 * Initialize accessibility features
 */
const initializeAccessibility = () => {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 8px;
        background: var(--primary-green);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 9999;
        font-weight: 600;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '8px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if not exists
    const main = document.querySelector('main') || document.querySelector('.main');
    if (main && !main.id) {
        main.id = 'main';
    }
    
    // Add proper ARIA labels
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (!section.getAttribute('aria-label') && !section.querySelector('h1, h2, h3')) {
            section.setAttribute('aria-label', `Section ${index + 1}`);
        }
    });
    
    // Announce dynamic content changes
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
    
    // Store reference for other functions to use
    window.announceToScreenReader = (message) => {
        liveRegion.textContent = message;
    };
    
    console.log('✅ Accessibility features initialized');
};

/* ==========================================================================
   13. Performance Optimizations
   ========================================================================== */

/**
 * Initialize performance optimizations
 */
const initializePerformanceOptimizations = () => {
    // Lazy load images
    const images = document.querySelectorAll('img[src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add fade-in effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    const preloadCriticalResources = () => {
        const criticalImages = [
            'logo copy.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    };
    
    // Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate any layout-dependent features
            if (STATE.isMobileMenuOpen && !isMobile()) {
                // This is handled by MobileMenuController
            }
        }, 250);
    });
    
    // Initialize critical resource preloading
    preloadCriticalResources();
    
    console.log('✅ Performance optimizations initialized');
};

/* ==========================================================================
   14. Error Handling
   ========================================================================== */

/**
 * Initialize error handling
 */
const initializeErrorHandling = () => {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('JavaScript Error:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
        
        // You could send this to an error reporting service
        // reportError(event);
    });
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        
        // You could send this to an error reporting service
        // reportError(event);
    });
    
    console.log('✅ Error handling initialized');
};

/* ==========================================================================
   15. Main Initialization & Bootstrap
   ========================================================================== */

/**
 * Initialize all functionality when DOM is loaded
 */
const initializeApp = () => {
    console.log('🚀 Initializing Holistic Psychological Services website...');
    
    // Core functionality - order matters
    initializeHeader();           // Header & Mobile Menu System
    initializeHero();            // Hero with Clean Logo & Background Rotation
    initializeAbout();           // About Section with Animations & Interactions
    initializeServices();        // Services with Animations & Interactions
    initializeTeam();            // Team with Animations & Interactions
    initializeReviews();         // Reviews with Stats Counter & Animations
    initializeContact();         // Contact Form & Validation & Animations
    initializeFooter();          // Footer with Responsive Features
    
    // Enhanced functionality
    initializeFloatingActions(); // Back to Top & Contact FAB
    initializeAccessibility();   // Accessibility Features
    initializePerformanceOptimizations(); // Performance Features
    initializeErrorHandling();   // Error Handling
    
    // Mark app as initialized
    document.body.classList.add('app-initialized');
    
    // Initial setup for floating actions visibility
    const floatingActions = document.querySelector('.floating-actions');
    if (floatingActions) {
        floatingActions.style.opacity = '0';
        floatingActions.style.visibility = 'hidden';
        floatingActions.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    }
    
    console.log('✅ Holistic Psychological Services website initialized successfully!');
};

/**
 * Cleanup function for when page unloads
 */
const cleanup = () => {
    // Clear background rotation interval
    if (STATE.heroBackgroundInterval) {
        clearInterval(STATE.heroBackgroundInterval);
    }
    
    // Clear all observers
    STATE.observers.forEach(observer => {
        observer.disconnect();
    });
    STATE.observers.clear();
    
    // Remove event listeners if needed
    // (Most will be automatically cleaned up)
    
    console.log('🧹 Cleanup completed');
};

/* ==========================================================================
   16. Event Listeners & Bootstrap
   ========================================================================== */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM already loaded
    initializeApp();
}

// Cleanup when page unloads
window.addEventListener('beforeunload', cleanup);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause background rotation
        if (STATE.heroBackgroundInterval) {
            clearInterval(STATE.heroBackgroundInterval);
        }
    } else {
        // Page is visible, resume background rotation
        if (window.heroController && !window.heroController.isReducedMotion) {
            window.heroController.initializeBackgroundRotation();
        }
    }
});

// Handle reduced motion preference changes
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
mediaQuery.addEventListener('change', (e) => {
    STATE.isReducedMotion = e.matches;
    console.log(`Reduced motion: ${STATE.isReducedMotion ? 'enabled' : 'disabled'}`);
    
    // Pause/resume background rotation based on motion preference
    if (STATE.isReducedMotion && window.heroController) {
        window.heroController.destroy();
    }
});

// Handle window resize for hero section
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(window.heroResizeTimeout);
    window.heroResizeTimeout = setTimeout(() => {
        console.log('Hero resize handled');
    }, 250);
});

// Export for potential external use
window.HolisticPsychServices = {
    STATE,
    CONFIG,
    utils: {
        debounce,
        throttle,
        isMobile,
        smoothScrollTo,
        smoothScrollToTop
    },
    animations: {
        animateElement,
        staggerAnimations
    },
    classes: {
        MobileMenuController,
        HeaderController,
        HeroController
    }
};

/* ==========================================================================
   17. Development Helpers (Remove in production)
   ========================================================================== */

// Development mode helpers
if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    // Add development console commands
    window.dev = {
        state: () => console.log('Current State:', STATE),
        config: () => console.log('Configuration:', CONFIG),
        observers: () => console.log('Active Observers:', STATE.observers),
        toggleReducedMotion: () => {
            STATE.isReducedMotion = !STATE.isReducedMotion;
            console.log(`Reduced motion: ${STATE.isReducedMotion ? 'enabled' : 'disabled'}`);
        },
        pauseBackgrounds: () => {
            if (window.heroController) {
                window.heroController.destroy();
                console.log('Background rotation paused');
            }
        },
        resumeBackgrounds: () => {
            if (window.heroController) {
                window.heroController.initializeBackgroundRotation();
                console.log('Background rotation resumed');
            }
        },
        hero: {
            nextBackground: () => {
                if (window.heroController) {
                    window.heroController.nextBackground();
                    console.log('Switched to next background');
                }
            },
            toggleRotation: () => {
                if (window.heroController) {
                    window.heroController.toggleBackgroundRotation();
                    console.log('Toggled background rotation');
                }
            }
        },
        sections: {
            hero: () => initializeHero(),
            about: () => initializeAbout(),
            services: () => initializeServices(),
            team: () => initializeTeam(),
            reviews: () => initializeReviews(),
            contact: () => initializeContact()
        }
    };
    
    console.log('🔧 Development mode active. Use window.dev for debugging.');
}
