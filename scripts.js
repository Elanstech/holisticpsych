/* ==========================================================================
   HOLISTIC PSYCHOLOGICAL SERVICES - OPTIMIZED JAVASCRIPT
   Modern, Performance-Focused, Modular Architecture
   ========================================================================== */

/* ==========================================================================
   1. Configuration & Global State
   ========================================================================== */
const CONFIG = {
    // Animation settings
    animations: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 100
    },
    
    // Scroll settings
    scroll: {
        offset: 100,
        threshold: 0.1
    },
    
    // Breakpoints
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },
    
    // Hero settings
    hero: {
        backgroundTransitionDuration: 5000, // 5 seconds
        overlayOpacity: 0.4, // Controllable overlay opacity
        zoomScale: 1.1,
        transitionDuration: 2000
    },
    
    // FAB settings
    fab: {
        showDelay: 1000
    }
};

// Global state management
const STATE = {
    isScrolled: false,
    isMobileMenuOpen: false,
    currentSection: 'home',
    observers: new Map(),
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    heroBackgroundIndex: 0,
    heroBackgroundInterval: null,
    isContactFabOpen: false,
    scrollPosition: 0,
    isInitialized: false
};

/* ==========================================================================
   2. Utility Functions
   ========================================================================== */
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static isMobile() {
        return window.innerWidth < CONFIG.breakpoints.mobile;
    }

    static isTablet() {
        return window.innerWidth < CONFIG.breakpoints.tablet;
    }

    static isDesktop() {
        return window.innerWidth >= CONFIG.breakpoints.desktop;
    }

    static getOffsetTop(element) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.pageYOffset;
    }

    static smoothScrollTo(target) {
        const targetPosition = Utils.getOffsetTop(target) - CONFIG.scroll.offset;
        
        if (STATE.isReducedMotion) {
            window.scrollTo(0, targetPosition);
            return;
        }
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    static smoothScrollToTop() {
        if (STATE.isReducedMotion) {
            window.scrollTo(0, 0);
            return;
        }
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    static announceToScreenReader(message) {
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
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    static animateElement(element, className = 'fade-in', delay = 0) {
        if (STATE.isReducedMotion) {
            element.classList.add('visible');
            return;
        }
        
        setTimeout(() => {
            element.classList.add(className);
            element.classList.add('visible');
        }, delay);
    }

    static staggerAnimations(elements, className = 'fade-in', staggerDelay = CONFIG.animations.stagger) {
        elements.forEach((element, index) => {
            const delay = STATE.isReducedMotion ? 0 : index * staggerDelay;
            Utils.animateElement(element, className, delay);
        });
    }
}

/* ==========================================================================
   3. Header & Navigation System
   ========================================================================== */
class HeaderController {
    constructor() {
        this.header = document.getElementById('header');
        this.isScrolled = false;
        this.scrollThreshold = 50;
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        this.bindEvents();
        this.checkScrollPosition();
        
        console.log('✅ Header controller initialized');
    }
    
    bindEvents() {
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 16));
        
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
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
    
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = Utils.getOffsetTop(section) - CONFIG.scroll.offset;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.pageYOffset;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection && currentSection !== STATE.currentSection) {
            STATE.currentSection = currentSection;
            
            this.navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                link.classList.toggle('active', linkHref === `#${currentSection}`);
            });
        }
    }
    
    checkScrollPosition() {
        this.handleScroll();
    }
}

/* ==========================================================================
   4. Mobile Menu System
   ========================================================================== */
class MobileMenuController {
    constructor() {
        this.isOpen = false;
        this.isAnimating = false;
        
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.menuPanel = document.getElementById('mobileMenuPanel');
        this.menuOverlay = document.getElementById('mobileMenuOverlay');
        this.menuClose = document.getElementById('mobileMenuClose');
        this.scrollHamburger = document.getElementById('scrollHamburgerToggle');
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
        
        console.log('✅ Mobile menu controller initialized');
    }
    
    bindEvents() {
        // Mobile toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        // Scroll hamburger
        if (this.scrollHamburger) {
            this.scrollHamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }
        
        // Close menu
        if (this.menuClose) {
            this.menuClose.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Close on overlay click
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Handle mobile nav links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e, link);
            });
        });
        
        // Handle desktop nav links
        this.desktopNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    Utils.smoothScrollTo(targetSection);
                    this.updateActiveStates(targetId);
                }
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
            if (window.innerWidth > CONFIG.breakpoints.desktop && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Prevent scroll on touch move when menu is open
        if (this.menuPanel) {
            this.menuPanel.addEventListener('touchmove', (e) => {
                e.stopPropagation();
            });
        }
        
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('touchmove', (e) => {
                e.preventDefault();
            });
        }
    }
    
    setupAccessibility() {
        // Set initial ARIA attributes
        if (this.menuToggle) {
            this.menuToggle.setAttribute('aria-expanded', 'false');
            this.menuToggle.setAttribute('aria-controls', 'mobileMenuPanel');
        }
        
        if (this.scrollHamburger) {
            this.scrollHamburger.setAttribute('aria-expanded', 'false');
            this.scrollHamburger.setAttribute('aria-controls', 'mobileMenuPanel');
        }
        
        if (this.menuPanel) {
            this.menuPanel.setAttribute('aria-labelledby', 'mobileMenuToggle');
            this.menuPanel.setAttribute('role', 'dialog');
            this.menuPanel.setAttribute('aria-modal', 'true');
        }
        
        this.setupFocusTrap();
    }
    
    setupFocusTrap() {
        if (!this.menuPanel) return;
        
        const focusableElements = this.menuPanel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        this.firstFocusable = focusableElements[0];
        this.lastFocusable = focusableElements[focusableElements.length - 1];
        
        this.menuPanel.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isOpen) {
                if (e.shiftKey) {
                    if (document.activeElement === this.firstFocusable) {
                        e.preventDefault();
                        this.lastFocusable?.focus();
                    }
                } else {
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
        STATE.isMobileMenuOpen = true;
        
        // Prevent body scroll
        this.body.classList.add('menu-open');
        this.body.style.overflow = 'hidden';
        
        // Update toggle button states
        if (this.menuToggle) {
            this.menuToggle.classList.add('active');
            this.menuToggle.setAttribute('aria-expanded', 'true');
        }
        
        if (this.scrollHamburger) {
            this.scrollHamburger.classList.add('active');
            this.scrollHamburger.setAttribute('aria-expanded', 'true');
        }
        
        // Show overlay
        if (this.menuOverlay) {
            this.menuOverlay.classList.add('active');
        }
        
        // Show panel with delay for smooth animation
        if (this.menuPanel) {
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
        }
        
        // Focus management
        setTimeout(() => {
            this.isAnimating = false;
            if (this.menuClose) {
                this.menuClose.focus();
            }
            Utils.announceToScreenReader('Mobile menu opened');
        }, 400);
    }
    
    closeMenu() {
        if (!this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = false;
        STATE.isMobileMenuOpen = false;
        
        // Update toggle button states
        if (this.menuToggle) {
            this.menuToggle.classList.remove('active');
            this.menuToggle.setAttribute('aria-expanded', 'false');
        }
        
        if (this.scrollHamburger) {
            this.scrollHamburger.classList.remove('active');
            this.scrollHamburger.setAttribute('aria-expanded', 'false');
        }
        
        // Hide panel
        if (this.menuPanel) {
            this.menuPanel.classList.remove('active');
        }
        
        // Hide overlay with delay
        setTimeout(() => {
            if (this.menuOverlay) {
                this.menuOverlay.classList.remove('active');
            }
        }, 100);
        
        // Re-enable body scroll
        setTimeout(() => {
            this.body.classList.remove('menu-open');
            this.body.style.overflow = '';
            this.isAnimating = false;
            
            // Return focus to toggle button
            if (this.menuToggle && Utils.isMobile()) {
                this.menuToggle.focus();
            } else if (this.scrollHamburger && Utils.isDesktop()) {
                this.scrollHamburger.focus();
            }
            Utils.announceToScreenReader('Mobile menu closed');
        }, 400);
    }
    
    handleNavClick(event, link) {
        event.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            this.updateActiveStates(targetId);
            this.closeMenu();
            
            setTimeout(() => {
                Utils.smoothScrollTo(targetSection);
            }, 200);
        }
    }
    
    updateActiveStates(activeHref) {
        this.mobileNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === activeHref);
        });
        
        this.desktopNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === activeHref);
        });
    }
    
    syncActiveStates() {
        const activeDesktopLink = document.querySelector('.desktop-nav .nav-link.active');
        if (activeDesktopLink) {
            const activeHref = activeDesktopLink.getAttribute('href');
            this.updateActiveStates(activeHref);
        }
    }
}

/* ==========================================================================
   5. Hero Section Controller with Enhanced Background System
   ========================================================================== */
class HeroController {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.backgroundImages = document.querySelectorAll('.hero-bg-image');
        this.heroOverlay = document.getElementById('heroOverlay');
        this.logoContainer = document.querySelector('.hero-logo-container');
        this.logoImage = document.querySelector('.hero-logo');
        this.heroButtons = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary');
        
        this.currentImageIndex = 0;
        this.backgroundInterval = null;
        this.isReducedMotion = STATE.isReducedMotion;
        
        this.init();
    }
    
    init() {
        if (!this.heroSection) return;
        
        this.initializeLogoLoading();
        this.initializeBackgroundSystem();
        this.initializeOverlayControl();
        this.initializeLogoInteractions();
        this.initializeButtonEffects();
        this.handleVisibilityChange();
        this.handleMotionPreference();
        
        console.log('✅ Hero section initialized with enhanced background system');
    }
    
    initializeLogoLoading() {
        if (!this.logoImage || !this.logoContainer) return;
        
        console.log('🔄 Loading logo...');
        
        this.logoContainer.style.opacity = '1';
        this.logoContainer.style.visibility = 'visible';
        
        const handleLogoSuccess = () => {
            console.log('✅ Logo loaded successfully');
            this.logoImage.style.opacity = '1';
            this.logoImage.style.visibility = 'visible';
            
            if (!this.isReducedMotion) {
                this.logoContainer.style.animation = 'logoFloat 6s ease-in-out infinite';
            }
        };
        
        const handleLogoError = () => {
            console.warn('⚠️ Logo failed to load, showing fallback');
            
            const fallback = document.createElement('div');
            fallback.style.cssText = `
                width: 200px;
                height: 200px;
                background: var(--gradient-primary);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: var(--font-heading);
                font-size: 2rem;
                font-weight: 700;
                text-align: center;
                line-height: 1.2;
            `;
            fallback.innerHTML = 'Holistic<br>Psych<br>Services';
            
            this.logoImage.style.display = 'none';
            this.logoContainer.appendChild(fallback);
        };
        
        if (this.logoImage.complete) {
            if (this.logoImage.naturalHeight !== 0) {
                handleLogoSuccess();
            } else {
                handleLogoError();
            }
        } else {
            this.logoImage.addEventListener('load', handleLogoSuccess, { once: true });
            this.logoImage.addEventListener('error', handleLogoError, { once: true });
            
            setTimeout(() => {
                if (this.logoImage.naturalHeight === 0) {
                    handleLogoError();
                }
            }, 3000);
        }
        
        setTimeout(() => {
            this.logoContainer.style.opacity = '1';
            this.logoContainer.style.visibility = 'visible';
            this.logoImage.style.opacity = '1';
            this.logoImage.style.visibility = 'visible';
        }, 100);
    }
    
    initializeBackgroundSystem() {
        if (this.backgroundImages.length === 0 || this.isReducedMotion) return;
        
        // Show first image immediately
        this.backgroundImages[0].classList.add('active');
        this.currentImageIndex = 0;
        
        // Start rotation interval
        this.backgroundInterval = setInterval(() => {
            this.rotateBackgroundImage();
        }, CONFIG.hero.backgroundTransitionDuration);
        
        console.log('🔄 Background rotation started (5-second intervals with zoom)');
    }
    
    rotateBackgroundImage() {
        if (this.isReducedMotion) return;
        
        const currentImage = this.backgroundImages[this.currentImageIndex];
        
        // Remove active class from current image
        currentImage.classList.remove('active');
        
        // Move to next image
        this.currentImageIndex = (this.currentImageIndex + 1) % this.backgroundImages.length;
        const nextImage = this.backgroundImages[this.currentImageIndex];
        
        // Add active class to next image (triggers zoom and fade)
        nextImage.classList.add('active');
        
        console.log(`🖼️ Switched to background ${this.currentImageIndex + 1} with zoom effect`);
    }
    
    initializeOverlayControl() {
        if (!this.heroOverlay) return;
        
        // Set initial overlay opacity from CSS variable
        const overlayOpacity = getComputedStyle(document.documentElement)
            .getPropertyValue('--hero-overlay-opacity') || CONFIG.hero.overlayOpacity;
        
        // Apply overlay styles
        this.heroOverlay.style.background = `linear-gradient(135deg, 
            rgba(0, 216, 132, ${overlayOpacity}) 0%, 
            rgba(14, 165, 233, ${overlayOpacity * 0.8}) 50%,
            rgba(139, 92, 246, ${overlayOpacity * 0.6}) 100%)`;
        
        console.log(`🎨 Hero overlay set to ${overlayOpacity} opacity`);
    }
    
    setOverlayOpacity(opacity) {
        if (!this.heroOverlay) return;
        
        const clampedOpacity = Math.max(0, Math.min(1, opacity));
        
        // Update CSS variable
        document.documentElement.style.setProperty('--hero-overlay-opacity', clampedOpacity);
        
        // Update overlay background
        this.heroOverlay.style.background = `linear-gradient(135deg, 
            rgba(0, 216, 132, ${clampedOpacity}) 0%, 
            rgba(14, 165, 233, ${clampedOpacity * 0.8}) 50%,
            rgba(139, 92, 246, ${clampedOpacity * 0.6}) 100%)`;
        
        console.log(`🎨 Hero overlay opacity updated to ${clampedOpacity}`);
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
        
        this.logoContainer.addEventListener('click', () => {
            if (this.isReducedMotion) return;
            
            this.logoContainer.style.animation = 'none';
            this.logoContainer.offsetHeight;
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
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: 0;
                height: 0;
                left: ${x}px;
                top: ${y}px;
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
                this.addRippleStyles();
            }
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 800);
        });
    }
    
    addRippleStyles() {
        const style = document.createElement('style');
        style.id = 'hero-ripple-animation';
        style.textContent = `
            @keyframes heroRipple {
                to {
                    width: 100px;
                    height: 100px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    addButtonHoverEnhancement(button) {
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
                console.log('⏸️ Background rotation paused (page hidden)');
            } else if (!document.hidden && !this.isReducedMotion) {
                this.initializeBackgroundSystem();
                console.log('▶️ Background rotation resumed (page visible)');
            }
        });
    }
    
    handleMotionPreference() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            STATE.isReducedMotion = e.matches;
            
            if (this.isReducedMotion && this.backgroundInterval) {
                clearInterval(this.backgroundInterval);
                console.log('⏸️ Background rotation paused (reduced motion)');
            } else if (!this.isReducedMotion) {
                this.initializeBackgroundSystem();
                console.log('▶️ Background rotation enabled (motion allowed)');
            }
        });
    }
    
    // Public methods
    nextBackground() {
        this.rotateBackgroundImage();
    }
    
    toggleBackgroundRotation() {
        if (this.backgroundInterval) {
            clearInterval(this.backgroundInterval);
            this.backgroundInterval = null;
            console.log('🔄 Background rotation paused');
        } else {
            this.initializeBackgroundSystem();
            console.log('▶️ Background rotation resumed');
        }
    }
    
    destroy() {
        if (this.backgroundInterval) {
            clearInterval(this.backgroundInterval);
        }
        
        this.heroButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        if (this.logoContainer) {
            this.logoContainer.replaceWith(this.logoContainer.cloneNode(true));
        }
        
        console.log('🧹 Hero controller destroyed');
    }
}

/* ==========================================================================
   6. Section Animation Controller
   ========================================================================== */
class SectionAnimationController {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.init();
    }
    
    init() {
        this.initializeAboutAnimations();
        this.initializeServicesAnimations();
        this.initializeTeamAnimations();
        this.initializeReviewsAnimations();
        this.initializeContactAnimations();
        
        console.log('✅ Section animations initialized');
    }
    
    initializeAboutAnimations() {
        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const valueItems = entry.target.querySelectorAll('.value-item');
                    const leaderProfiles = entry.target.querySelectorAll('.leader-profile');
                    const missionCard = entry.target.querySelector('.mission-card');
                    const statsCard = entry.target.querySelector('.team-stats-card');
                    
                    if (missionCard) {
                        Utils.animateElement(missionCard, 'fade-in', 0);
                    }
                    
                    setTimeout(() => {
                        Utils.staggerAnimations(valueItems, 'fade-in', 150);
                    }, 200);
                    
                    setTimeout(() => {
                        Utils.staggerAnimations(leaderProfiles, 'fade-in', 100);
                    }, 400);
                    
                    if (statsCard) {
                        setTimeout(() => {
                            Utils.animateElement(statsCard, 'fade-in', 0);
                        }, 600);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(aboutSection);
        STATE.observers.set('about', observer);
    }
    
    initializeServicesAnimations() {
        const servicesSection = document.querySelector('.services');
        if (!servicesSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const serviceCards = entry.target.querySelectorAll('.service-card');
                    const ctaSection = entry.target.querySelector('.services-cta');
                    
                    Utils.staggerAnimations(serviceCards, 'fade-in', 200);
                    
                    if (ctaSection) {
                        setTimeout(() => {
                            Utils.animateElement(ctaSection, 'fade-in', 0);
                        }, serviceCards.length * 200 + 400);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(servicesSection);
        STATE.observers.set('services', observer);
    }
    
    initializeTeamAnimations() {
        const teamSection = document.querySelector('.team');
        if (!teamSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const teamCards = entry.target.querySelectorAll('.team-card');
                    Utils.staggerAnimations(teamCards, 'fade-in', 250);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(teamSection);
        STATE.observers.set('team', observer);
    }
    
    initializeReviewsAnimations() {
        const reviewsSection = document.querySelector('.reviews');
        if (!reviewsSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const heroReview = entry.target.querySelector('.hero-review');
                    const reviewCards = entry.target.querySelectorAll('.review-card');
                    const statItems = entry.target.querySelectorAll('.review-stats .stat-item');
                    
                    if (heroReview) {
                        Utils.animateElement(heroReview, 'fade-in', 0);
                    }
                    
                    setTimeout(() => {
                        Utils.staggerAnimations(reviewCards, 'fade-in', 200);
                    }, 300);
                    
                    setTimeout(() => {
                        Utils.staggerAnimations(statItems, 'fade-in', 150);
                        setTimeout(() => {
                            this.animateStatNumbers(statItems);
                        }, 500);
                    }, 600 + (reviewCards.length * 200));
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(reviewsSection);
        STATE.observers.set('reviews', observer);
    }
    
    initializeContactAnimations() {
        const contactSection = document.querySelector('.contact');
        if (!contactSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const contactCards = entry.target.querySelectorAll('.contact-card');
                    const formContainer = entry.target.querySelector('.contact-form-container');
                    
                    Utils.staggerAnimations(contactCards, 'slide-left', 150);
                    
                    if (formContainer) {
                        setTimeout(() => {
                            Utils.animateElement(formContainer, 'slide-right', 0);
                        }, 300);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(contactSection);
        STATE.observers.set('contact', observer);
    }
    
    animateStatNumbers(statItems) {
        if (STATE.isReducedMotion) return;
        
        statItems.forEach(item => {
            const numberElement = item.querySelector('.stat-number');
            if (!numberElement) return;
            
            const finalValue = numberElement.textContent;
            const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
            
            if (isNaN(numericValue)) return;
            
            let currentValue = 0;
            const increment = numericValue / 30;
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
    }
}

/* ==========================================================================
   7. Contact Form Controller
   ========================================================================== */
class ContactFormController {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.inputs = null;
        this.submitButton = null;
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.inputs = this.form.querySelectorAll('input, select, textarea');
        this.submitButton = this.form.querySelector('.btn-submit');
        
        this.bindEvents();
        
        console.log('✅ Contact form controller initialized');
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.removeFieldError(input));
            
            input.addEventListener('focus', (e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 216, 132, 0.2)';
            });
            
            input.addEventListener('blur', (e) => {
                e.target.style.transform = '';
                e.target.style.boxShadow = '';
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        this.removeFieldError(field);
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (cleanPhone.length > 0 && !phoneRegex.test(cleanPhone)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
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
    }
    
    removeFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.style.borderColor = '';
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    showFormMessage(message, type = 'success') {
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
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
        
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        Utils.announceToScreenReader(message);
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }
        }, 5000);
        
        messageElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            this.showFormMessage('Please correct the errors above.', 'error');
            return;
        }
        
        const originalText = this.submitButton.innerHTML;
        this.submitButton.innerHTML = `
            <span style="opacity: 0.8;">Sending...</span>
            <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin-left: 8px;"></div>
        `;
        this.submitButton.disabled = true;
        
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
            const formData = new FormData(this.form);
            const formObject = Object.fromEntries(formData);
            
            console.log('Form submitted:', formObject);
            
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showFormMessage(
                'Thank you for your message! We will contact you within 24 hours to discuss your needs and schedule a consultation.',
                'success'
            );
            
            this.form.reset();
            
            this.inputs.forEach(input => this.removeFieldError(input));
            
            console.log('Contact form submitted successfully');
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage(
                'We apologize, but there was an error sending your message. Please try again or call us directly at (646) 971-7325.',
                'error'
            );
        } finally {
            this.submitButton.innerHTML = originalText;
            this.submitButton.disabled = false;
        }
    }
}

/* ==========================================================================
   8. Floating Action Buttons Controller
   ========================================================================== */
class FloatingActionsController {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTop');
        this.contactFab = document.getElementById('contactFab');
        this.contactOptions = document.getElementById('contactOptions');
        this.isContactFabOpen = false;
        
        this.init();
    }
    
    init() {
        this.initializeBackToTop();
        this.initializeContactFAB();
        this.showFABs();
        
        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateBackToTopButton();
        }, 16));
        
        console.log('✅ Floating actions controller initialized');
    }
    
    initializeBackToTop() {
        if (!this.backToTopBtn) return;
        
        this.backToTopBtn.addEventListener('click', () => {
            Utils.smoothScrollToTop();
            Utils.announceToScreenReader('Scrolled to top of page');
        });
        
        this.backToTopBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                Utils.smoothScrollToTop();
            }
        });
    }
    
    initializeContactFAB() {
        if (!this.contactFab || !this.contactOptions) return;
        
        const toggleContactOptions = () => {
            this.isContactFabOpen = !this.isContactFabOpen;
            STATE.isContactFabOpen = this.isContactFabOpen;
            
            this.contactFab.classList.toggle('active', this.isContactFabOpen);
            this.contactOptions.classList.toggle('active', this.isContactFabOpen);
            
            this.contactFab.setAttribute('aria-expanded', this.isContactFabOpen.toString());
            
            const message = this.isContactFabOpen ? 'Contact options opened' : 'Contact options closed';
            Utils.announceToScreenReader(message);
        };
        
        const closeContactOptions = () => {
            if (this.isContactFabOpen) {
                this.isContactFabOpen = false;
                STATE.isContactFabOpen = false;
                this.contactFab.classList.remove('active');
                this.contactOptions.classList.remove('active');
                this.contactFab.setAttribute('aria-expanded', 'false');
            }
        };
        
        this.contactFab.addEventListener('click', toggleContactOptions);
        
        this.contactFab.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleContactOptions();
            } else if (event.key === 'Escape') {
                closeContactOptions();
            }
        });
        
        document.addEventListener('click', (event) => {
            if (this.isContactFabOpen && 
                !this.contactFab.contains(event.target) && 
                !this.contactOptions.contains(event.target)) {
                closeContactOptions();
            }
        });
        
        const contactOptionLinks = this.contactOptions.querySelectorAll('.contact-option');
        contactOptionLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const optionType = link.classList.contains('phone') ? 'phone' :
                                  link.classList.contains('email') ? 'email' :
                                  link.classList.contains('instagram') ? 'instagram' :
                                  link.classList.contains('review') ? 'review' : 'unknown';
                
                console.log(`Contact option clicked: ${optionType}`);
                
                if (optionType !== 'review' && optionType !== 'instagram') {
                    setTimeout(closeContactOptions, 300);
                }
                
                const actionMessages = {
                    phone: 'Calling phone number',
                    email: 'Opening email client',
                    instagram: 'Opening Instagram page',
                    review: 'Opening Google reviews'
                };
                
                Utils.announceToScreenReader(actionMessages[optionType] || 'Contact option selected');
            });
        });
        
        this.contactFab.setAttribute('aria-expanded', 'false');
        this.contactFab.setAttribute('aria-haspopup', 'true');
    }
    
    updateBackToTopButton() {
        if (!this.backToTopBtn) return;
        
        const shouldShow = STATE.scrollPosition > 300;
        this.backToTopBtn.classList.toggle('visible', shouldShow);
    }
    
    showFABs() {
        setTimeout(() => {
            const floatingActions = document.querySelector('.floating-actions');
            if (floatingActions) {
                floatingActions.style.opacity = '1';
                floatingActions.style.visibility = 'visible';
            }
        }, CONFIG.fab.showDelay);
    }
}

/* ==========================================================================
   9. Interactive Elements Controller
   ========================================================================== */
class InteractiveElementsController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initializeServiceCardInteractions();
        this.initializeTeamCardInteractions();
        this.initializeReviewCardInteractions();
        this.initializeContactCardInteractions();
        this.initializeButtonRippleEffects();
        
        console.log('✅ Interactive elements controller initialized');
    }
    
    initializeServiceCardInteractions() {
        const serviceCards = document.querySelectorAll('.service-card');
        
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
    }
    
    initializeTeamCardInteractions() {
        const teamCards = document.querySelectorAll('.team-card');
        
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
    }
    
    initializeReviewCardInteractions() {
        const reviewCards = document.querySelectorAll('.review-card');
        
        reviewCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    const initial = card.querySelector('.client-initial');
                    const stars = card.querySelectorAll('.stars i');
                    
                    if (initial) {
                        initial.style.transform = 'scale(1.1) rotate(5deg)';
                        initial.style.background = 'var(--gradient-primary)';
                    }
                    
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
    }
    
    initializeContactCardInteractions() {
        const contactCards = document.querySelectorAll('.contact-card');
        
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
    }
    
    initializeButtonRippleEffects() {
        const buttons = document.querySelectorAll('.service-btn, .btn-cta-primary, .btn-cta-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (STATE.isReducedMotion) return;
                
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
                    animation: buttonRipple 0.6s ease-out;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                if (!document.querySelector('#button-ripple-animation')) {
                    const style = document.createElement('style');
                    style.id = 'button-ripple-animation';
                    style.textContent = `
                        @keyframes buttonRipple {
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
    }
}

/* ==========================================================================
   10. Performance & Accessibility Controller
   ========================================================================== */
class PerformanceController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initializeLazyLoading();
        this.initializeAccessibility();
        this.initializeErrorHandling();
        this.initializePerformanceOptimizations();
        
        console.log('✅ Performance controller initialized');
    }
    
    initializeLazyLoading() {
        const images = document.querySelectorAll('img[src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
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
                if (!img.classList.contains('hero-logo')) {
                    imageObserver.observe(img);
                }
            });
        }
    }
    
    initializeAccessibility() {
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
        
        // Create live region for announcements
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
    }
    
    initializeErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript Error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
        });
    }
    
    initializePerformanceOptimizations() {
        // Debounce resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                console.log('Layout recalculated after resize');
            }, 250);
        });
        
        // Preload critical resources
        const criticalImages = ['logo copy.png'];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }
}

/* ==========================================================================
   11. Main Application Controller
   ========================================================================== */
class HolisticPsychServicesApp {
    constructor() {
        this.controllers = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Holistic Psychological Services website...');
        
        // Initialize controllers in order
        this.controllers.performance = new PerformanceController();
        this.controllers.header = new HeaderController();
        this.controllers.mobileMenu = new MobileMenuController();
        this.controllers.hero = new HeroController();
        this.controllers.sectionAnimations = new SectionAnimationController();
        this.controllers.contactForm = new ContactFormController();
        this.controllers.floatingActions = new FloatingActionsController();
        this.controllers.interactiveElements = new InteractiveElementsController();
        
        // Mark app as initialized
        document.body.classList.add('app-initialized');
        STATE.isInitialized = true;
        this.isInitialized = true;
        
        // Setup cleanup
        this.setupCleanup();
        
        // Handle motion preference changes
        this.handleMotionPreferenceChanges();
        
        console.log('✅ Holistic Psychological Services website initialized successfully!');
    }
    
    setupCleanup() {
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    handleMotionPreferenceChanges() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            STATE.isReducedMotion = e.matches;
            console.log(`Motion preference: ${STATE.isReducedMotion ? 'reduced' : 'normal'}`);
            
            if (STATE.isReducedMotion && this.controllers.hero) {
                this.controllers.hero.destroy();
            }
        });
    }
    
    pause() {
        if (this.controllers.hero && this.controllers.hero.backgroundInterval) {
            clearInterval(this.controllers.hero.backgroundInterval);
            this.controllers.hero.backgroundInterval = null;
            console.log('⏸️ App paused (page hidden)');
        }
    }
    
    resume() {
        if (this.controllers.hero && !this.controllers.hero.backgroundInterval && !STATE.isReducedMotion) {
            this.controllers.hero.initializeBackgroundSystem();
            console.log('▶️ App resumed (page visible)');
        }
    }
    
    cleanup() {
        // Clear hero background interval
        if (this.controllers.hero && this.controllers.hero.backgroundInterval) {
            clearInterval(this.controllers.hero.backgroundInterval);
        }
        
        // Clear all observers
        STATE.observers.forEach(observer => {
            observer.disconnect();
        });
        STATE.observers.clear();
        
        console.log('🧹 App cleanup completed');
    }
    
    // Public API methods
    setHeroOverlayOpacity(opacity) {
        if (this.controllers.hero) {
            this.controllers.hero.setOverlayOpacity(opacity);
        }
    }
    
    toggleHeroBackgroundRotation() {
        if (this.controllers.hero) {
            this.controllers.hero.toggleBackgroundRotation();
        }
    }
    
    nextHeroBackground() {
        if (this.controllers.hero) {
            this.controllers.hero.nextBackground();
        }
    }
    
    getState() {
        return { ...STATE };
    }
    
    getConfig() {
        return { ...CONFIG };
    }
}

/* ==========================================================================
   12. Event Listeners & Bootstrap
   ========================================================================== */

// Initialize app when DOM is ready
function initializeApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.holisticApp = new HolisticPsychServicesApp();
        });
    } else {
        window.holisticApp = new HolisticPsychServicesApp();
    }
}

// Handle window focus/blur for performance
window.addEventListener('focus', () => {
    if (window.holisticApp && window.holisticApp.controllers.hero && !STATE.isReducedMotion) {
        window.holisticApp.resume();
    }
});

window.addEventListener('blur', () => {
    if (window.holisticApp) {
        window.holisticApp.pause();
    }
});

// Handle resize events for responsive behavior
window.addEventListener('resize', Utils.debounce(() => {
    // Update mobile/desktop states
    const wasMobile = STATE.isMobile;
    const isNowMobile = Utils.isMobile();
    
    if (wasMobile !== isNowMobile) {
        console.log(`Device type changed: ${isNowMobile ? 'mobile' : 'desktop'}`);
        
        // Close mobile menu if switching to desktop
        if (!isNowMobile && STATE.isMobileMenuOpen && window.holisticApp && window.holisticApp.controllers.mobileMenu) {
            window.holisticApp.controllers.mobileMenu.closeMenu();
        }
    }
    
    STATE.isMobile = isNowMobile;
}, 250));

/* ==========================================================================
   13. Global API & Developer Tools
   ========================================================================== */

// Export for external use
window.HolisticPsychServices = {
    STATE,
    CONFIG,
    Utils,
    
    // Main app instance (will be available after initialization)
    app: null,
    
    // Utility functions
    smoothScrollTo: Utils.smoothScrollTo,
    smoothScrollToTop: Utils.smoothScrollToTop,
    announceToScreenReader: Utils.announceToScreenReader,
    
    // Animation utilities
    animateElement: Utils.animateElement,
    staggerAnimations: Utils.staggerAnimations,
    
    // Device detection
    isMobile: Utils.isMobile,
    isTablet: Utils.isTablet,
    isDesktop: Utils.isDesktop,
    
    // Performance utilities
    debounce: Utils.debounce,
    throttle: Utils.throttle
};

/* ==========================================================================
   14. Development & Debug Tools
   ========================================================================== */

// Development mode helpers (remove in production)
if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1') {
    
    // Add development console commands
    window.dev = {
        // State inspection
        state: () => console.log('Current State:', STATE),
        config: () => console.log('Configuration:', CONFIG),
        observers: () => console.log('Active Observers:', STATE.observers),
        
        // Motion controls
        toggleReducedMotion: () => {
            STATE.isReducedMotion = !STATE.isReducedMotion;
            console.log(`Reduced motion: ${STATE.isReducedMotion ? 'enabled' : 'disabled'}`);
        },
        
        // Hero controls
        hero: {
            setOverlay: (opacity) => {
                if (window.holisticApp) {
                    window.holisticApp.setHeroOverlayOpacity(opacity);
                }
            },
            nextBackground: () => {
                if (window.holisticApp) {
                    window.holisticApp.nextHeroBackground();
                    console.log('Switched to next background');
                }
            },
            toggleRotation: () => {
                if (window.holisticApp) {
                    window.holisticApp.toggleHeroBackgroundRotation();
                    console.log('Toggled background rotation');
                }
            },
            pauseBackgrounds: () => {
                if (window.holisticApp && window.holisticApp.controllers.hero) {
                    window.holisticApp.controllers.hero.destroy();
                    console.log('Background rotation paused');
                }
            },
            resumeBackgrounds: () => {
                if (window.holisticApp && window.holisticApp.controllers.hero) {
                    window.holisticApp.controllers.hero.initializeBackgroundSystem();
                    console.log('Background rotation resumed');
                }
            }
        },
        
        // Menu controls
        menu: {
            open: () => {
                if (window.holisticApp && window.holisticApp.controllers.mobileMenu) {
                    window.holisticApp.controllers.mobileMenu.openMenu();
                }
            },
            close: () => {
                if (window.holisticApp && window.holisticApp.controllers.mobileMenu) {
                    window.holisticApp.controllers.mobileMenu.closeMenu();
                }
            },
            toggle: () => {
                if (window.holisticApp && window.holisticApp.controllers.mobileMenu) {
                    window.holisticApp.controllers.mobileMenu.toggleMenu();
                }
            }
        },
        
        // Section controls
        sections: {
            animateAll: () => {
                document.querySelectorAll('.fade-in, .slide-left, .slide-right').forEach(el => {
                    el.classList.add('visible');
                });
                console.log('All section animations triggered');
            },
            resetAnimations: () => {
                document.querySelectorAll('.fade-in, .slide-left, .slide-right').forEach(el => {
                    el.classList.remove('visible');
                });
                console.log('All section animations reset');
            }
        },
        
        // Performance tools
        performance: {
            observers: () => console.log('Active Observers:', STATE.observers.size),
            memory: () => {
                if (performance.memory) {
                    console.log('Memory usage:', {
                        used: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
                        total: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
                        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB'
                    });
                } else {
                    console.log('Memory API not available');
                }
            },
            timing: () => {
                const timing = performance.timing;
                const navigationStart = timing.navigationStart;
                console.log('Page Load Timing:', {
                    'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart + 'ms',
                    'TCP Connection': timing.connectEnd - timing.connectStart + 'ms',
                    'Request': timing.responseStart - timing.requestStart + 'ms',
                    'Response': timing.responseEnd - timing.responseStart + 'ms',
                    'DOM Processing': timing.domComplete - timing.domLoading + 'ms',
                    'Total Load Time': timing.loadEventEnd - navigationStart + 'ms'
                });
            }
        },
        
        // Utility functions
        utils: {
            scrollTo: (selector) => {
                const element = document.querySelector(selector);
                if (element) {
                    Utils.smoothScrollTo(element);
                    console.log(`Scrolled to ${selector}`);
                } else {
                    console.warn(`Element not found: ${selector}`);
                }
            },
            highlight: (selector) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.outline = '3px solid red';
                    setTimeout(() => {
                        el.style.outline = '';
                    }, 2000);
                });
                console.log(`Highlighted ${elements.length} elements: ${selector}`);
            },
            showGridOverlay: () => {
                const overlay = document.createElement('div');
                overlay.id = 'dev-grid-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 23px,
                        rgba(255, 0, 0, 0.1) 24px
                    ),
                    repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 23px,
                        rgba(255, 0, 0, 0.1) 24px
                    );
                    pointer-events: none;
                    z-index: 10000;
                `;
                document.body.appendChild(overlay);
                
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.remove();
                    }
                }, 5000);
                
                console.log('Grid overlay shown for 5 seconds');
            }
        },
        
        // Test functions
        test: {
            animations: () => {
                console.log('Testing animations...');
                const testElement = document.createElement('div');
                testElement.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: 100px;
                    height: 100px;
                    background: var(--primary-green);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10000;
                `;
                document.body.appendChild(testElement);
                
                Utils.animateElement(testElement, 'fade-in');
                
                setTimeout(() => {
                    testElement.remove();
                }, 2000);
            },
            
            responsiveness: () => {
                console.log('Current breakpoint info:', {
                    windowWidth: window.innerWidth,
                    isMobile: Utils.isMobile(),
                    isTablet: Utils.isTablet(),
                    isDesktop: Utils.isDesktop(),
                    mobileBp: CONFIG.breakpoints.mobile,
                    tabletBp: CONFIG.breakpoints.tablet,
                    desktopBp: CONFIG.breakpoints.desktop
                });
            },
            
            accessibility: () => {
                const issues = [];
                
                // Check for images without alt text
                const images = document.querySelectorAll('img:not([alt])');
                if (images.length > 0) {
                    issues.push(`${images.length} images without alt text`);
                }
                
                // Check for buttons without aria-label or text
                const buttons = document.querySelectorAll('button');
                buttons.forEach((btn, index) => {
                    if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
                        issues.push(`Button ${index + 1} has no accessible text`);
                    }
                });
                
                // Check for headings hierarchy
                const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                let lastLevel = 0;
                headings.forEach((heading, index) => {
                    const level = parseInt(heading.tagName[1]);
                    if (level > lastLevel + 1) {
                        issues.push(`Heading level skip at heading ${index + 1} (${heading.tagName})`);
                    }
                    lastLevel = level;
                });
                
                if (issues.length === 0) {
                    console.log('✅ No obvious accessibility issues found');
                } else {
                    console.warn('⚠️ Accessibility issues found:', issues);
                }
            }
        }
    };
    
    console.log('🔧 Development mode active. Use window.dev for debugging.');
    console.log('Available commands:');
    console.log('  window.dev.state() - View current state');
    console.log('  window.dev.hero.setOverlay(0.3) - Set hero overlay opacity');
    console.log('  window.dev.hero.nextBackground() - Switch background');
    console.log('  window.dev.test.animations() - Test animations');
    console.log('  window.dev.utils.scrollTo("#about") - Scroll to section');
}

/* ==========================================================================
   15. Initialize Application
   ========================================================================== */

// Start the application
initializeApp();

// Set reference to app instance when it's created
document.addEventListener('DOMContentLoaded', () => {
    if (window.holisticApp) {
        window.HolisticPsychServices.app = window.holisticApp;
    }
});

/* ==========================================================================
   16. Export Statement (for module systems)
   ========================================================================== */

// For environments that support modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HolisticPsychServicesApp,
        Utils,
        CONFIG,
        STATE
    };
}

// For AMD/RequireJS
if (typeof define === 'function' && define.amd) {
    define('holistic-psych-services', [], function() {
        return {
            HolisticPsychServicesApp,
            Utils,
            CONFIG,
            STATE
        };
    });
}

console.log('📋 Holistic Psychological Services JavaScript loaded and ready');

/* ==========================================================================
   END OF FILE
   ========================================================================== */
