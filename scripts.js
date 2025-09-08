/* ========================================
   HOLISTIC PSYCHOLOGICAL SERVICES - JS
   Simple & Professional Functionality
   ======================================== */

/* ========================================
   HEADER CONTROLLER
   ======================================== */
class HeaderController {
    constructor() {
        this.header = document.getElementById('header');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.lastScrollY = 0;
        
        this.init();
    }
    
    init() {
        this.setupScrollBehavior();
        this.setupNavigation();
        this.setupMobileMenu();
    }
    
    setupScrollBehavior() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;
            
            if (currentScrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            this.lastScrollY = currentScrollY;
        }, { passive: true });
    }
    
    setupNavigation() {
        // Smooth scrolling for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = this.header.offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Update active state
                        this.updateActiveNav(href);
                        
                        // Close mobile menu if open
                        this.closeMobileMenu();
                    }
                }
            });
        });
        
        // Scroll spy
        this.setupScrollSpy();
    }
    
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    this.updateActiveNav(`#${sectionId}`);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveNav(activeHref) {
        this.navLinks.forEach(link => {
            if (link.getAttribute('href') === activeHref) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setupMobileMenu() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target) && this.header.classList.contains('mobile-open')) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.header.classList.toggle('mobile-open');
    }
    
    closeMobileMenu() {
        this.header.classList.remove('mobile-open');
    }
}

/* ========================================
   HERO SLIDESHOW CONTROLLER
   ======================================== */
class HeroSlideshowController {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.indicators = document.querySelectorAll('.hero-controls .indicator');
        this.prevBtn = document.getElementById('prevSlide');
        this.nextBtn = document.getElementById('nextSlide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;
        this.autoplayDelay = 6000; // 6 seconds
        
        this.init();
    }
    
    init() {
        if (this.totalSlides === 0) return;
        
        this.setupControls();
        this.startAutoplay();
        this.setupPauseOnHover();
    }
    
    setupControls() {
        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isHeroInView()) {
                if (e.key === 'ArrowLeft') {
                    this.previousSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });
    }
    
    goToSlide(index) {
        // Update slides
        this.slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update indicators
        this.indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resumeAutoplay() {
        if (!this.autoplayInterval) {
            this.startAutoplay();
        }
    }
    
    setupPauseOnHover() {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', () => {
                this.pauseAutoplay();
            });
            
            hero.addEventListener('mouseleave', () => {
                this.resumeAutoplay();
            });
        }
        
        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.resumeAutoplay();
            }
        });
    }
    
    isHeroInView() {
        const hero = document.querySelector('.hero');
        if (!hero) return false;
        
        const rect = hero.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
}

/* ========================================
   SERVICES CAROUSEL CONTROLLER
   ======================================== */
class ServicesCarouselController {
    constructor() {
        this.track = document.getElementById('servicesTrack');
        this.cards = document.querySelectorAll('.service-card');
        this.indicators = document.querySelectorAll('.carousel-indicator');
        this.prevBtn = document.getElementById('prevService');
        this.nextBtn = document.getElementById('nextService');
        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        
        this.init();
    }
    
    init() {
        if (this.totalCards === 0) return;
        
        this.setupControls();
        this.updateCarousel();
    }
    
    setupControls() {
        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToCard(index);
            });
        });
        
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousCard();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextCard();
            });
        }
        
        // Touch/swipe support for mobile
        this.setupTouchControls();
    }
    
    goToCard(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    nextCard() {
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.updateCarousel();
    }
    
    previousCard() {
        this.currentIndex = this.currentIndex === 0 ? this.totalCards - 1 : this.currentIndex - 1;
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Move track
        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    setupTouchControls() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diff = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextCard();
                } else {
                    this.previousCard();
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }
}

/* ========================================
   CONTACT FORM CONTROLLER
   ======================================== */
class ContactFormController {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.setupFormSubmission();
        this.setupFormValidation();
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }
    
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
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
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        this.setFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }
    
    setFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.field-error');
        
        if (message) {
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'field-error';
                errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
                formGroup.appendChild(errorElement);
            }
            errorElement.textContent = message;
            field.style.borderColor = '#ef4444';
        } else {
            if (errorElement) {
                errorElement.remove();
            }
            field.style.borderColor = '';
        }
    }
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }
    
    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.delay(2000);
            
            // Show success message
            this.showMessage('Thank you for your message! We will contact you within 24 hours.', 'success');
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
        } finally {
            // Restore button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showMessage(message, type) {
        // Remove existing message
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        messageElement.textContent = message;
        
        const bgColor = type === 'success' ? '#10b981' : '#ef4444';
        messageElement.style.cssText = `
            background: ${bgColor};
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            text-align: center;
        `;
        
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/* ========================================
   SCROLL ANIMATIONS CONTROLLER
   ======================================== */
class ScrollAnimationsController {
    constructor() {
        this.animatedElements = [];
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.findAnimatedElements();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
    }
    
    findAnimatedElements() {
        // Elements to animate on scroll
        const selectors = [
            '.team-member',
            '.service-card',
            '.contact-item',
            '.stat-item',
            '.about-stats'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                // Set initial state
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.transitionDelay = `${index * 0.1}s`;
                
                this.observer.observe(element);
            });
        });
    }
    
    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */
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
   MAIN APPLICATION
   ======================================== */
class HolisticPsychologyApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }
    
    initializeApp() {
        try {
            console.log('Initializing Holistic Psychology App...');
            
            // Initialize all components
            this.components.header = new HeaderController();
            this.components.heroSlideshow = new HeroSlideshowController();
            this.components.servicesCarousel = new ServicesCarouselController();
            this.components.contactForm = new ContactFormController();
            this.components.scrollAnimations = new ScrollAnimationsController();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            this.isInitialized = true;
            console.log('✅ Holistic Psychology App initialized successfully');
            
            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('appInitialized', {
                detail: { components: this.components }
            }));
            
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            this.initializeFallback();
        }
    }
    
    setupGlobalEvents() {
        // Smooth scrolling for all internal links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                    Utils.smoothScrollTo(target, headerHeight + 20);
                }
            });
        });
        
        // Phone number click tracking
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Phone number clicked:', link.href);
                // Add analytics tracking here if needed
            });
        });
        
        // External link handling
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }
    
    initializeFallback() {
        console.log('🔄 Initializing fallback functionality...');
        
        // Basic mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const header = document.getElementById('header');
        
        if (mobileMenuBtn && header) {
            mobileMenuBtn.addEventListener('click', () => {
                header.classList.toggle('mobile-open');
            });
        }
        
        // Basic slideshow
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.hero-controls .indicator');
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            currentSlide = index;
        }
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Auto-advance slideshow
        if (slides.length > 1) {
            setInterval(() => {
                const nextSlide = (currentSlide + 1) % slides.length;
                showSlide(nextSlide);
            }, 6000);
        }
        
        // Basic form validation
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const requiredFields = contactForm.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = '#ef4444';
                        isValid = false;
                    } else {
                        field.style.borderColor = '';
                    }
                });
                
                if (isValid) {
                    alert('Thank you for your message! We will contact you soon.');
                    contactForm.reset();
                } else {
                    alert('Please fill in all required fields.');
                }
            });
        }
        
        console.log('✅ Fallback functionality initialized');
    }
    
    getComponent(name) {
        return this.components[name];
    }
    
    isReady() {
        return this.isInitialized;
    }
}

/* ========================================
   PERFORMANCE OPTIMIZATION
   ======================================== */
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.setupPerformanceObserver();
    }
    
    optimizeImages() {
        // Lazy loading for images
        const images = document.querySelectorAll('img');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        }
    }
    
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.entryType === 'navigation') {
                            console.log('Page load performance:', {
                                loadTime: entry.loadEventEnd - entry.loadEventStart,
                                domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                                firstPaint: entry.responseEnd - entry.requestStart
                            });
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['navigation'] });
            } catch (e) {
                console.log('Performance Observer not supported');
            }
        }
    }
}

/* ========================================
   ACCESSIBILITY ENHANCEMENTS
   ======================================== */
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
    }
    
    setupKeyboardNavigation() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main landmark
        const main = document.querySelector('.main');
        if (main) {
            main.setAttribute('id', 'main');
            main.setAttribute('role', 'main');
        }
    }
    
    setupFocusManagement() {
        // Visible focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .js-focus-visible :focus:not(.focus-visible) {
                outline: none;
            }
            
            .js-focus-visible .focus-visible {
                outline: 2px solid #00d884;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
        
        // Add focus-visible polyfill class
        document.body.classList.add('js-focus-visible');
    }
    
    setupAriaLabels() {
        // Add aria-labels to buttons without text
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            const text = button.textContent.trim();
            if (!text) {
                const icon = button.querySelector('i');
                if (icon) {
                    const classList = Array.from(icon.classList);
                    const iconName = classList.find(cls => cls.includes('arrow') || cls.includes('phone') || cls.includes('menu'));
                    if (iconName) {
                        button.setAttribute('aria-label', this.getAriaLabelFromIcon(iconName));
                    }
                }
            }
        });
    }
    
    getAriaLabelFromIcon(iconClass) {
        const iconMap = {
            'arrow-left': 'Previous',
            'arrow-right': 'Next',
            'phone': 'Call',
            'menu': 'Menu'
        };
        
        for (const [key, label] of Object.entries(iconMap)) {
            if (iconClass.includes(key)) {
                return label;
            }
        }
        
        return 'Button';
    }
}

/* ========================================
   INITIALIZATION
   ======================================== */

// Initialize the application
const app = new HolisticPsychologyApp();

// Initialize performance and accessibility enhancements
const performanceOptimizer = new PerformanceOptimizer();
const accessibilityEnhancer = new AccessibilityEnhancer();

// Global API for external access
window.HolisticApp = app;
window.Utils = Utils;

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

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// Log successful initialization
console.log('✨ Holistic Psychology Services website loaded successfully');

/* ========================================
   EXPORT FOR MODULE SYSTEMS
   ======================================== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HolisticPsychologyApp,
        HeaderController,
        HeroSlideshowController,
        ServicesCarouselController,
        ContactFormController,
        ScrollAnimationsController,
        Utils
    };
}
