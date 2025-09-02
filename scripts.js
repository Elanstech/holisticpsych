/* ========================================
   HOLISTIC PSYCHOLOGICAL SERVICES - JS
   Manhattan Mental Health & Wellness
   ======================================== */

/* ========================================
   PRELOADER CONTROLLER
   ======================================== */
class SleekPreloader {
    constructor() {
        this.preloader = document.getElementById('sleekPreloader');
        this.progressFill = document.getElementById('progressFill');
        this.exitOverlay = document.querySelector('.exit-overlay');
        
        // Timing configuration
        this.duration = 2800; // Total duration
        this.minShowTime = 1500; // Minimum time to show preloader
        this.progressUpdateInterval = 50; // Smooth progress updates
        
        // State
        this.currentProgress = 0;
        this.startTime = Date.now();
        this.isComplete = false;
        this.progressInterval = null;
        
        this.init();
    }
    
    init() {
        if (!this.preloader) return;
        
        this.startProgressAnimation();
        this.setupEventListeners();
        this.setupAutoComplete();
    }
    
    startProgressAnimation() {
        let progress = 0;
        const increment = 100 / (this.duration / this.progressUpdateInterval);
        
        this.progressInterval = setInterval(() => {
            progress += increment * (0.8 + Math.random() * 0.4); // Slight randomness for organic feel
            progress = Math.min(progress, 100);
            
            this.updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(this.progressInterval);
                this.onProgressComplete();
            }
        }, this.progressUpdateInterval);
    }
    
    updateProgress(progress) {
        this.currentProgress = progress;
        
        if (this.progressFill) {
            this.progressFill.style.width = progress + '%';
        }
    }
    
    onProgressComplete() {
        // Small delay to show 100% completion
        setTimeout(() => {
            this.hidePreloader();
        }, 400);
    }
    
    setupEventListeners() {
        // Force hide on window load after minimum time
        window.addEventListener('load', () => {
            const elapsed = Date.now() - this.startTime;
            const remainingTime = Math.max(0, this.minShowTime - elapsed);
            
            setTimeout(() => {
                if (!this.isComplete) {
                    this.hidePreloader();
                }
            }, remainingTime);
        });
        
        // Hide on escape key (for debugging)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const elapsed = Date.now() - this.startTime;
                if (elapsed > this.minShowTime) {
                    this.hidePreloader();
                }
            }
        });
        
        // Prevent scrolling while preloader is active
        document.body.style.overflow = 'hidden';
    }
    
    setupAutoComplete() {
        // Fallback auto-hide after maximum duration
        setTimeout(() => {
            if (!this.isComplete) {
                this.hidePreloader();
            }
        }, this.duration + 800);
    }
    
    hidePreloader() {
        if (this.isComplete || !this.preloader) return;
        
        this.isComplete = true;
        
        // Clear any running intervals
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        // Trigger exit animation
        this.preloader.classList.add('exiting');
        
        // Complete the progress bar
        if (this.progressFill) {
            this.progressFill.style.width = '100%';
        }
        
        // Fade out after exit animation
        setTimeout(() => {
            this.preloader.classList.add('loaded');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Clean up after transition
            setTimeout(() => {
                this.cleanup();
            }, 800);
        }, 600);
        
        // Dispatch completion event
        document.dispatchEvent(new CustomEvent('preloaderComplete', {
            detail: { 
                duration: Date.now() - this.startTime,
                method: 'auto'
            }
        }));
    }
    
    forceHide() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        
        // Clear intervals
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        // Quick fade out
        this.preloader.style.transition = 'all 0.5s ease';
        this.preloader.classList.add('loaded');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        setTimeout(() => {
            this.cleanup();
        }, 500);
        
        document.dispatchEvent(new CustomEvent('preloaderComplete', {
            detail: { 
                duration: Date.now() - this.startTime,
                method: 'forced'
            }
        }));
    }
    
    cleanup() {
        if (this.preloader) {
            this.preloader.style.display = 'none';
        }
        
        // Clear any remaining intervals
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        console.log('✨ Sleek Preloader completed successfully');
    }
    
    // Public API methods
    getProgress() {
        return this.currentProgress;
    }
    
    isCompleted() {
        return this.isComplete;
    }
    
    getRemainingTime() {
        const elapsed = Date.now() - this.startTime;
        return Math.max(0, this.duration - elapsed);
    }
}

/* ========================================
   INITIALIZATION
   ======================================== */

let sleekPreloader;

// Initialize when DOM is ready
function initializeSleekPreloader() {
    sleekPreloader = new SleekPreloader();
}

// Check if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSleekPreloader);
} else {
    initializeSleekPreloader();
}

// Global API for external access
window.SleekPreloader = {
    getInstance: () => sleekPreloader,
    hide: () => sleekPreloader?.forceHide(),
    getProgress: () => sleekPreloader?.getProgress() || 0,
    isComplete: () => sleekPreloader?.isCompleted() || false
};

// Quick access function to hide preloader
function hideSleekPreloader() {
    if (sleekPreloader) {
        sleekPreloader.forceHide();
    }
}

// Performance monitoring
function getSleekPreloaderPerformance() {
    if (sleekPreloader) {
        return {
            progress: sleekPreloader.getProgress(),
            isComplete: sleekPreloader.isCompleted(),
            remainingTime: sleekPreloader.getRemainingTime()
        };
    }
    return null;
}

/* ========================================
   SMOOTH INTEGRATION WITH EXISTING CODE
   ======================================== */

// Listen for preloader completion to initialize other components
document.addEventListener('preloaderComplete', (event) => {
    console.log('Preloader completed:', event.detail);
    
    // Initialize other components after preloader
    setTimeout(() => {
        // Trigger any additional initialization
        if (typeof window.FloatingHeaderController !== 'undefined') {
            // Header is already initialized in the original code
        }
        
        // Add any other component initializations here
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 100);
});

/* ========================================
   ERROR HANDLING
   ======================================== */

// Graceful error handling
window.addEventListener('error', (event) => {
    console.warn('Preloader error, falling back to force hide:', event.error);
    if (sleekPreloader && !sleekPreloader.isCompleted()) {
        sleekPreloader.forceHide();
    }
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.warn('Preloader promise rejection:', event.reason);
    if (sleekPreloader && !sleekPreloader.isCompleted()) {
        setTimeout(() => {
            sleekPreloader.forceHide();
        }, 100);
    }
});

/* ========================================
   FLOATING HEADER CONTROLLER
   ======================================== */
class FloatingHeaderController {
    constructor() {
        this.header = document.getElementById('floatingHeader');
        this.navCapsule = document.getElementById('navCapsule');
        this.navTrack = this.navCapsule?.querySelector('.nav-track');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.navIndicator = document.querySelector('.nav-indicator');
        this.mobileTrigger = document.getElementById('mobileTrigger');
        this.mobileOverlay = document.getElementById('mobileOverlay');
        this.mobileClose = document.getElementById('mobileClose');
        this.mobileLinks = document.querySelectorAll('.mobile-link');
        
        this.lastScrollY = 0;
        this.isScrollingDown = false;
        this.isMobileMenuOpen = false;
        this.activeNavIndex = 0;
        
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        this.setupScrollBehavior();
        this.setupNavigationIndicator();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollSpy();
        this.setupGlowEffect();
        
        // Set initial nav indicator position
        this.updateNavIndicator(0);
    }
    
    setupScrollBehavior() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    handleScroll() {
        const currentScrollY = window.pageYOffset;
        
        // Add scrolled class for visual changes
        if (currentScrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
            // Scrolling down
            if (!this.isScrollingDown && !this.isMobileMenuOpen) {
                this.isScrollingDown = true;
                this.header.style.transform = 'translateX(-50%) translateY(-100px)';
                this.header.style.opacity = '0.7';
            }
        } else {
            // Scrolling up
            if (this.isScrollingDown) {
                this.isScrollingDown = false;
                this.header.style.transform = 'translateX(-50%) translateY(0)';
                this.header.style.opacity = '1';
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    setupNavigationIndicator() {
        if (!this.navDots.length || !this.navIndicator) return;
        
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active states
                this.navDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // Update indicator position
                this.updateNavIndicator(index);
                
                // Smooth scroll to section
                const target = dot.getAttribute('href');
                this.scrollToSection(target);
                
                this.activeNavIndex = index;
            });
            
            // Add hover effects
            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            dot.addEventListener('mouseleave', () => {
                dot.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    updateNavIndicator(index) {
        if (!this.navIndicator || !this.navTrack) return;
        
        const positions = [8, 60, 112, 164, 216]; // Position for each nav item
        const position = positions[index] || 8;
        
        this.navIndicator.style.left = position + 'px';
        this.navTrack.setAttribute('data-active', index);
        
        // Add a subtle animation
        this.navIndicator.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.navIndicator.style.transform = 'scale(1)';
        }, 200);
    }
    
    setupMobileMenu() {
        if (!this.mobileTrigger || !this.mobileOverlay) return;
        
        // Mobile trigger click
        this.mobileTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });
        
        // Mobile close button
        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
            });
        }
        
        // Mobile overlay click to close
        this.mobileOverlay.addEventListener('click', (e) => {
            if (e.target === this.mobileOverlay) {
                this.closeMobileMenu();
            }
        });
        
        // Mobile navigation links
        this.mobileLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                    this.closeMobileMenu();
                    
                    // Update desktop nav indicator
                    this.updateDesktopNavForMobile(href);
                }
            });
            
            // Staggered animation on menu open
            link.style.transitionDelay = (index * 0.1) + 's';
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Close on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMobileMenuOpen = true;
        this.mobileTrigger.classList.add('active');
        this.mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset header position when menu opens
        this.header.style.transform = 'translateX(-50%) translateY(0)';
        this.header.style.opacity = '1';
        this.isScrollingDown = false;
        
        // Animate mobile links
        this.mobileLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.transform = 'translateX(0)';
                link.style.opacity = '1';
            }, index * 100);
        });
    }
    
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        this.mobileTrigger.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset mobile links animation
        this.mobileLinks.forEach(link => {
            link.style.transform = 'translateX(50px)';
            link.style.opacity = '0';
            link.style.transitionDelay = '0s';
        });
    }
    
    setupSmoothScrolling() {
        // Handle all navigation links (both desktop and mobile)
        const allNavLinks = document.querySelectorAll('a[href^="#"]');
        
        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.length > 1) { // Not just "#"
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
    }
    
    scrollToSection(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const headerHeight = this.header.offsetHeight + 20; // Add some offset
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-20% 0px -60% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    this.updateActiveNavFromSection(sectionId);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveNavFromSection(sectionId) {
        const navLink = document.querySelector(`.nav-dot[href="#${sectionId}"]`);
        if (!navLink) return;
        
        // Find the index of the active nav item
        const navIndex = Array.from(this.navDots).indexOf(navLink);
        if (navIndex !== -1 && navIndex !== this.activeNavIndex) {
            // Update active states
            this.navDots.forEach(dot => dot.classList.remove('active'));
            navLink.classList.add('active');
            
            // Update indicator
            this.updateNavIndicator(navIndex);
            this.activeNavIndex = navIndex;
        }
    }
    
    updateDesktopNavForMobile(href) {
        const navLink = document.querySelector(`.nav-dot[href="${href}"]`);
        if (navLink) {
            const navIndex = Array.from(this.navDots).indexOf(navLink);
            if (navIndex !== -1) {
                this.navDots.forEach(dot => dot.classList.remove('active'));
                navLink.classList.add('active');
                this.updateNavIndicator(navIndex);
                this.activeNavIndex = navIndex;
            }
        }
    }
    
    setupGlowEffect() {
        // Add subtle glow effect on hover
        if (this.header) {
            let glowTimeout;
            
            this.header.addEventListener('mouseenter', () => {
                clearTimeout(glowTimeout);
                this.header.style.filter = 'drop-shadow(0 8px 32px rgba(34, 197, 94, 0.15))';
            });
            
            this.header.addEventListener('mouseleave', () => {
                glowTimeout = setTimeout(() => {
                    this.header.style.filter = '';
                }, 300);
            });
        }
        
        // Add ripple effect to CTA button
        const ctaButton = document.querySelector('.cta-floating');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                const ripple = ctaButton.querySelector('.cta-ripple');
                if (ripple) {
                    ripple.style.width = '0';
                    ripple.style.height = '0';
                    
                    setTimeout(() => {
                        ripple.style.width = '200px';
                        ripple.style.height = '200px';
                    }, 10);
                    
                    setTimeout(() => {
                        ripple.style.width = '0';
                        ripple.style.height = '0';
                    }, 600);
                }
            });
        }
        
        // Phone bubble glow effect
        const phoneBubble = document.querySelector('.phone-bubble');
        if (phoneBubble) {
            phoneBubble.addEventListener('mouseenter', () => {
                const glow = phoneBubble.querySelector('.bubble-glow');
                if (glow) {
                    glow.style.left = '-100%';
                    setTimeout(() => {
                        glow.style.left = '100%';
                    }, 50);
                }
            });
        }
    }
    
    // Public methods for external control
    showHeader() {
        this.header.style.transform = 'translateX(-50%) translateY(0)';
        this.header.style.opacity = '1';
        this.isScrollingDown = false;
    }
    
    hideHeader() {
        if (!this.isMobileMenuOpen) {
            this.header.style.transform = 'translateX(-50%) translateY(-100px)';
            this.header.style.opacity = '0.7';
            this.isScrollingDown = true;
        }
    }
    
    setActiveNav(index) {
        if (index >= 0 && index < this.navDots.length) {
            this.navDots.forEach(dot => dot.classList.remove('active'));
            this.navDots[index].classList.add('active');
            this.updateNavIndicator(index);
            this.activeNavIndex = index;
        }
    }
    
    destroy() {
        // Clean up event listeners if needed
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

/* ========================================
   HERO SLIDESHOW CONTROLLER
   ======================================== */
class HeroSlideshowController {
    constructor() {
        this.swiperContainer = document.querySelector('.hero-swiper');
        this.swiper = null;
        
        this.init();
    }
    
    init() {
        if (typeof Swiper !== 'undefined' && this.swiperContainer) {
            this.initSwiper();
        }
        
        this.setupFloatingAnimations();
    }
    
    initSwiper() {
        this.swiper = new Swiper('.hero-swiper', {
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            loop: true,
            speed: 1500,
            on: {
                slideChange: () => {
                    this.onSlideChange();
                }
            }
        });
    }
    
    onSlideChange() {
        // Add any slide change animations here
        if (typeof gsap !== 'undefined') {
            gsap.from('.hero-text', {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        }
    }
    
    setupFloatingAnimations() {
        const floatingLeaves = document.querySelectorAll('.floating-leaf');
        
        floatingLeaves.forEach((leaf, index) => {
            if (typeof gsap !== 'undefined') {
                gsap.to(leaf, {
                    y: -20,
                    x: 10,
                    rotation: 5,
                    duration: 3 + index,
                    ease: "power2.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: index * 0.5
                });
            }
        });
    }
}

/* ========================================
   SCROLL ANIMATIONS CONTROLLER
   ======================================== */
class ScrollAnimationsController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initAOS();
        this.setupCustomAnimations();
    }
    
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 0
            });
            
            // Refresh AOS on window resize
            window.addEventListener('resize', () => {
                AOS.refresh();
            });
        }
    }
    
    setupCustomAnimations() {
        // Intersection Observer for custom animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe animated elements
        const animatedElements = document.querySelectorAll('.info-card, .feature-item');
        animatedElements.forEach(el => observer.observe(el));
    }
    
    animateElement(element) {
        if (typeof gsap !== 'undefined') {
            gsap.from(element, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.2
            });
        } else {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
    }
}

/* ========================================
   UTILITIES
   ======================================== */
class UtilityFunctions {
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
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static smoothScrollTo(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    static getScrollPercent() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return (scrollTop / scrollHeight) * 100;
    }
    
    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

/* ========================================
   CONTACT FORM HANDLER
   ======================================== */
class ContactFormHandler {
    constructor() {
        this.phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        this.emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        
        this.init();
    }
    
    init() {
        this.setupPhoneTracking();
        this.setupEmailTracking();
    }
    
    setupPhoneTracking() {
        this.phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track phone clicks (for analytics)
                this.trackEvent('contact', 'phone_click', '(646) 971-7325');
            });
        });
    }
    
    setupEmailTracking() {
        this.emailLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track email clicks (for analytics)
                this.trackEvent('contact', 'email_click');
            });
        });
    }
    
    trackEvent(category, action, label = '') {
        // Google Analytics tracking (if implemented)
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        // Console log for development
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
    }
}

/* ========================================
   PERFORMANCE MONITOR
   ======================================== */
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        this.monitorPageLoad();
        this.monitorScrollPerformance();
    }
    
    monitorPageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                console.log(`Page loaded in ${loadTime}ms`);
                
                // Track in analytics if needed
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        name: 'page_load',
                        value: Math.round(loadTime)
                    });
                }
            }, 0);
        });
    }
    
    monitorScrollPerformance() {
        let scrollCount = 0;
        const throttledScroll = UtilityFunctions.throttle(() => {
            scrollCount++;
        }, 100);
        
        window.addEventListener('scroll', throttledScroll, { passive: true });
    }
}

/* ========================================
   MAIN APPLICATION
   ======================================== */
class HolisticPsychApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }
    
    initializeApp() {
        try {
            // Initialize preloader first
            this.components.preloader = new SleekPreloader();
            
            // Initialize other components after preloader
            document.addEventListener('preloaderComplete', () => {
                this.initializeMainComponents();
            });
            
            // Fallback initialization
            setTimeout(() => {
                if (!this.isInitialized) {
                    this.initializeMainComponents();
                }
            }, 3000);
            
        } catch (error) {
            console.error('Error initializing app:', error);
            this.initializeFallback();
        }
    }
    
    initializeMainComponents() {
        if (this.isInitialized) return;
        
        try {
            this.components.header = new FloatingHeaderController();
            this.components.heroSlideshow = new HeroSlideshowController();
            this.components.scrollAnimations = new ScrollAnimationsController();
            this.components.contactForm = new ContactFormHandler();
            this.components.performanceMonitor = new PerformanceMonitor();
            
            this.isInitialized = true;
            console.log('✅ Holistic Psychology App initialized successfully');
            
            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('appInitialized', {
                detail: { components: this.components }
            }));
            
        } catch (error) {
            console.error('Error initializing main components:', error);
            this.initializeFallback();
        }
    }
    
    initializeFallback() {
        // Basic functionality without external libraries
        console.log('🔄 Initializing fallback functionality');
        
        // Basic mobile menu
        const mobileToggle = document.getElementById('mobileTrigger');
        const mobileOverlay = document.getElementById('mobileOverlay');
        
        if (mobileToggle && mobileOverlay) {
            mobileToggle.addEventListener('click', () => {
                mobileOverlay.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
        
        // Basic smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Hide preloader
        setTimeout(() => {
            const preloader = document.getElementById('shinePreloader');
            if (preloader) {
                preloader.style.display = 'none';
            }
        }, 2000);
    }
    
    getComponent(name) {
        return this.components[name];
    }
}

/* ========================================
   INITIALIZATION
   ======================================== */

// Initialize when DOM is ready
let floatingHeaderController;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        floatingHeaderController = new FloatingHeaderController();
    });
} else {
    floatingHeaderController = new FloatingHeaderController();
}

// Make it globally accessible for debugging
window.FloatingHeaderController = FloatingHeaderController;
window.floatingHeaderController = floatingHeaderController;

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Smooth scroll utility
function smoothScrollTo(target, offset = 100) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Header visibility control
function toggleHeaderVisibility(show = true) {
    if (floatingHeaderController) {
        if (show) {
            floatingHeaderController.showHeader();
        } else {
            floatingHeaderController.hideHeader();
        }
    }
}

// Set active navigation programmatically
function setActiveNavigation(index) {
    if (floatingHeaderController) {
        floatingHeaderController.setActiveNav(index);
    }
}

// Initialize the application
const app = new HolisticPsychApp();

// Make components globally accessible for debugging
window.HolisticApp = app;
window.UtilityFunctions = UtilityFunctions;

// Additional CSS animations for fallback
if (!window.CSS || !CSS.supports('animation', 'fadeInUp')) {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
        
        .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-pulse {
            animation: pulse 2s infinite;
        }
        
        .animate-slideInRight {
            animation: slideInRight 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

/* ========================================
   EXPORT FOR MODULE SYSTEMS
   ======================================== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HolisticPsychApp,
        SleekPreloader,
        FloatingHeaderController,
        HeroSlideshowController,
        ScrollAnimationsController,
        ContactFormHandler,
        UtilityFunctions
    };
}
