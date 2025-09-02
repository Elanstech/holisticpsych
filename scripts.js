/* ========================================
   HOLISTIC PSYCHOLOGICAL SERVICES - JS
   Manhattan Mental Health & Wellness
   ======================================== */

/* ========================================
   PRELOADER CONTROLLER
   ======================================== */
class PreloaderController {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingTitle = document.querySelector('.loading-title');
        this.loadingSubtitle = document.querySelector('.loading-subtitle');
        this.particlesContainer = document.getElementById('particles-bg');
        
        this.loadingMessages = [
            'Creating a safe space...',
            'Preparing your journey...',
            'Nurturing growth and healing...',
            'Welcome to holistic wellness...'
        ];
        
        this.currentMessageIndex = 0;
        this.isLoaded = false;
        
        this.init();
    }
    
    init() {
        this.initParticles();
        this.startLoadingSequence();
        this.simulateProgress();
        
        // Auto-hide after window load
        window.addEventListener('load', () => {
            setTimeout(() => this.hidePreloader(), 800);
        });
        
        // Fallback hide after 5 seconds
        setTimeout(() => {
            if (!this.isLoaded) {
                this.hidePreloader();
            }
        }, 5000);
    }
    
    initParticles() {
        if (typeof particlesJS !== 'undefined' && this.particlesContainer) {
            particlesJS('particles-bg', {
                particles: {
                    number: {
                        value: 30,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: ["#22c55e", "#06b6d4", "#8b5cf6"]
                    },
                    shape: {
                        type: "circle",
                        stroke: {
                            width: 0,
                            color: "#000000"
                        }
                    },
                    opacity: {
                        value: 0.3,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 2,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#22c55e",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: true,
                            mode: "repulse"
                        },
                        onclick: {
                            enable: true,
                            mode: "push"
                        },
                        resize: true
                    }
                },
                retina_detect: true
            });
        }
    }
    
    startLoadingSequence() {
        const changeMessage = () => {
            if (this.currentMessageIndex < this.loadingMessages.length && !this.isLoaded) {
                if (this.loadingSubtitle) {
                    this.loadingSubtitle.style.opacity = '0';
                    
                    setTimeout(() => {
                        this.loadingSubtitle.textContent = this.loadingMessages[this.currentMessageIndex];
                        this.loadingSubtitle.style.opacity = '1';
                        this.currentMessageIndex++;
                    }, 300);
                }
                
                setTimeout(changeMessage, 1200);
            }
        };
        
        setTimeout(changeMessage, 500);
    }
    
    simulateProgress() {
        if (!this.progressFill) return;
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                setTimeout(() => this.hidePreloader(), 500);
            }
            
            this.progressFill.style.width = progress + '%';
        }, 200);
    }
    
    hidePreloader() {
        if (this.isLoaded || !this.preloader) return;
        
        this.isLoaded = true;
        
        // GSAP animation if available
        if (typeof gsap !== 'undefined') {
            gsap.to(this.preloader, {
                duration: 0.8,
                opacity: 0,
                y: -50,
                ease: "power2.inOut",
                onComplete: () => {
                    this.preloader.style.display = 'none';
                }
            });
        } else {
            this.preloader.classList.add('loaded');
            setTimeout(() => {
                this.preloader.style.display = 'none';
            }, 500);
        }
        
        // Initialize other components after preloader
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('preloaderComplete'));
        }, 300);
    }
}

/* ========================================
   HEADER CONTROLLER
   ======================================== */
class HeaderController {
    constructor() {
        this.header = document.getElementById('header');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileNav = document.getElementById('mobileNav');
        this.mobileNavClose = document.getElementById('mobileNavClose');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        this.lastScrollY = 0;
        this.isScrollingDown = false;
        this.isMobileMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupScrollBehavior();
        this.setupNavigation();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
        
        // Mobile menu close
        if (this.mobileNavClose) {
            this.mobileNavClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen && 
                !this.mobileNav.contains(e.target) && 
                !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
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
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            // Scrolling down
            if (!this.isScrollingDown) {
                this.isScrollingDown = true;
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.header, { y: -80, duration: 0.3 });
                } else {
                    this.header.style.transform = 'translateY(-80px)';
                }
            }
        } else {
            // Scrolling up
            if (this.isScrollingDown) {
                this.isScrollingDown = false;
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.header, { y: 0, duration: 0.3 });
                } else {
                    this.header.style.transform = 'translateY(0)';
                }
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.navigateToSection(href);
                    
                    // Close mobile menu if open
                    if (this.isMobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                    
                    // Update active link
                    this.updateActiveLink(link);
                }
            });
        });
        
        // Update active link on scroll
        this.setupScrollSpy();
    }
    
    navigateToSection(target) {
        const targetElement = document.querySelector(target);
        if (targetElement) {
            const headerHeight = this.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.updateActiveLink(document.querySelector(`[href="#${sectionId}"]`));
                }
            });
        }, { passive: true });
    }
    
    updateActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
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
        this.mobileMenuToggle.classList.add('active');
        this.mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        const menuItems = this.mobileNav.querySelectorAll('.mobile-nav-link, .mobile-phone, .mobile-cta');
        menuItems.forEach((item, index) => {
            if (typeof gsap !== 'undefined') {
                gsap.from(item, {
                    x: 50,
                    opacity: 0,
                    duration: 0.3,
                    delay: index * 0.1
                });
            }
        });
    }
    
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        this.mobileMenuToggle.classList.remove('active');
        this.mobileNav.classList.remove('active');
        document.body.style.overflow = '';
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
            this.components.preloader = new PreloaderController();
            
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
            this.components.header = new HeaderController();
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
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        
        if (mobileToggle && mobileNav) {
            mobileToggle.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
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
            const preloader = document.getElementById('preloader');
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
        PreloaderController,
        HeaderController,
        HeroSlideshowController,
        ScrollAnimationsController,
        ContactFormHandler,
        UtilityFunctions
    };
}
