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
            progress += increment * (0.8 + Math.random() * 0.4);
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
        setTimeout(() => {
            this.hidePreloader();
        }, 400);
    }
    
    setupEventListeners() {
        window.addEventListener('load', () => {
            const elapsed = Date.now() - this.startTime;
            const remainingTime = Math.max(0, this.minShowTime - elapsed);
            
            setTimeout(() => {
                if (!this.isComplete) {
                    this.hidePreloader();
                }
            }, remainingTime);
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const elapsed = Date.now() - this.startTime;
                if (elapsed > this.minShowTime) {
                    this.hidePreloader();
                }
            }
        });
        
        document.body.style.overflow = 'hidden';
    }
    
    setupAutoComplete() {
        setTimeout(() => {
            if (!this.isComplete) {
                this.hidePreloader();
            }
        }, this.duration + 800);
    }
    
    hidePreloader() {
        if (this.isComplete || !this.preloader) return;
        
        this.isComplete = true;
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        this.preloader.classList.add('exiting');
        
        if (this.progressFill) {
            this.progressFill.style.width = '100%';
        }
        
        setTimeout(() => {
            this.preloader.classList.add('loaded');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                this.cleanup();
            }, 800);
        }, 600);
        
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
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        this.preloader.style.transition = 'all 0.5s ease';
        this.preloader.classList.add('loaded');
        
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
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        console.log('✨ Sleek Preloader completed successfully');
    }
    
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
   FLOATING HEADER CONTROLLER
   ======================================== */
class RefinedHeaderController {
    constructor() {
        this.header = document.getElementById('floatingHeader');
        this.navCapsule = document.getElementById('navCapsule');
        this.navTrack = this.navCapsule?.querySelector('.nav-track');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.navIndicator = document.querySelector('.nav-indicator');
        
        // Modern mobile menu elements
        this.modernMenuTrigger = document.getElementById('modernMenuTrigger');
        this.modernMobileOverlay = document.getElementById('modernMobileOverlay');
        this.modernCloseBtn = document.getElementById('modernCloseBtn');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.overlayBackdrop = document.querySelector('.overlay-backdrop');
        
        // State management
        this.lastScrollY = 0;
        this.isScrollingDown = false;
        this.isMobileMenuOpen = false;
        this.activeNavIndex = 0;
        this.scrollThreshold = 50;
        
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        this.setupScrollBehavior();
        this.setupNavigationIndicator();
        this.setupModernMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollSpy();
        
        this.updateNavIndicator(0);
        
        console.log('✨ Refined Header Controller initialized');
    }
    
    setupScrollBehavior() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    handleScroll() {
        const currentScrollY = window.pageYOffset;
        
        if (currentScrollY > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
            if (!this.isScrollingDown && !this.isMobileMenuOpen) {
                this.isScrollingDown = true;
                this.hideHeader();
            }
        } else {
            if (this.isScrollingDown) {
                this.isScrollingDown = false;
                this.showHeader();
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    hideHeader() {
        this.header.style.transform = 'translateX(-50%) translateY(-120px)';
        this.header.style.opacity = '0.8';
    }
    
    showHeader() {
        this.header.style.transform = 'translateX(-50%) translateY(0)';
        this.header.style.opacity = '1';
    }
    
    setupNavigationIndicator() {
        if (!this.navDots.length || !this.navIndicator) return;
        
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                
                this.setActiveNavigation(index);
                
                const target = dot.getAttribute('href');
                this.scrollToSection(target);
            });
            
            dot.addEventListener('mouseenter', () => {
                this.addHoverEffect(dot);
            });
            
            dot.addEventListener('mouseleave', () => {
                this.removeHoverEffect(dot);
            });
        });
    }
    
    addHoverEffect(dot) {
        dot.style.transform = 'translateY(-3px) scale(1.1)';
        dot.style.filter = 'brightness(1.2)';
    }
    
    removeHoverEffect(dot) {
        if (!dot.classList.contains('active')) {
            dot.style.transform = 'translateY(0) scale(1)';
            dot.style.filter = 'brightness(1)';
        }
    }
    
    updateNavIndicator(index) {
        if (!this.navIndicator || !this.navTrack) return;
        
        const positions = [8, 64, 120, 176, 232];
        const position = positions[index] || 8;
        
        this.navIndicator.style.left = position + 'px';
        this.navTrack.setAttribute('data-active', index);
        
        this.navIndicator.style.transform = 'scale(1.15)';
        setTimeout(() => {
            this.navIndicator.style.transform = 'scale(1)';
        }, 200);
    }
    
    setActiveNavigation(index) {
        if (index >= 0 && index < this.navDots.length) {
            this.navDots.forEach(dot => dot.classList.remove('active'));
            this.navDots[index].classList.add('active');
            this.updateNavIndicator(index);
            this.activeNavIndex = index;
        }
    }
    
    setupModernMobileMenu() {
        if (!this.modernMenuTrigger || !this.modernMobileOverlay) return;
        
        this.modernMenuTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleModernMobileMenu();
        });
        
        if (this.modernCloseBtn) {
            this.modernCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModernMobileMenu();
            });
        }
        
        if (this.overlayBackdrop) {
            this.overlayBackdrop.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModernMobileMenu();
            });
        }
        
        this.mobileNavLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                    this.closeModernMobileMenu();
                    
                    this.updateDesktopNavFromMobile(href);
                }
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeModernMobileMenu();
            }
        });
        
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
                this.closeModernMobileMenu();
            }
        });
    }
    
    toggleModernMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeModernMobileMenu();
        } else {
            this.openModernMobileMenu();
        }
    }
    
    openModernMobileMenu() {
        this.isMobileMenuOpen = true;
        
        this.modernMenuTrigger.classList.add('active');
        this.modernMobileOverlay.classList.add('active');
        
        document.body.style.overflow = 'hidden';
        
        this.header.style.transform = 'translateX(-50%) translateY(0)';
        this.header.style.opacity = '1';
        this.isScrollingDown = false;
        
        this.animateMobileLinksIn();
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        console.log('🎯 Modern mobile menu opened');
    }
    
    closeModernMobileMenu() {
        if (!this.isMobileMenuOpen) return;
        
        this.isMobileMenuOpen = false;
        
        this.modernMenuTrigger.classList.remove('active');
        this.modernMobileOverlay.classList.remove('active');
        
        document.body.style.overflow = '';
        
        this.animateMobileLinksOut();
        
        console.log('🎯 Modern mobile menu closed');
    }
    
    animateMobileLinksIn() {
        this.mobileNavLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
    
    animateMobileLinksOut() {
        this.mobileNavLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(50px)';
            link.style.transitionDelay = '0s';
        });
    }
    
    setupSmoothScrolling() {
        const allNavLinks = document.querySelectorAll('a[href^="#"]');
        
        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.length > 1) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
    }
    
    scrollToSection(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const headerHeight = this.header.offsetHeight + 30;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        this.smoothScrollTo(targetPosition);
    }
    
    smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;
        
        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = easeInOutCubic(progress);
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
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
        
        const navIndex = Array.from(this.navDots).indexOf(navLink);
        if (navIndex !== -1 && navIndex !== this.activeNavIndex) {
            this.setActiveNavigation(navIndex);
        }
    }
    
    updateDesktopNavFromMobile(href) {
        const navLink = document.querySelector(`.nav-dot[href="${href}"]`);
        if (navLink) {
            const navIndex = Array.from(this.navDots).indexOf(navLink);
            if (navIndex !== -1) {
                this.setActiveNavigation(navIndex);
            }
        }
    }
    
    forceShowHeader() {
        this.showHeader();
        this.isScrollingDown = false;
    }
    
    forceHideHeader() {
        if (!this.isMobileMenuOpen) {
            this.hideHeader();
            this.isScrollingDown = true;
        }
    }
    
    getActiveNavIndex() {
        return this.activeNavIndex;
    }
    
    isMobileMenuActive() {
        return this.isMobileMenuOpen;
    }
    
    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeydown);
        
        console.log('🗑️ Refined Header Controller destroyed');
    }
}

/* ========================================
   ENHANCED HERO SECTION CONTROLLER
   ======================================== */
class EnhancedHeroController {
    constructor() {
        // Core elements
        this.heroSection = document.querySelector('.enhanced-hero');
        this.desktopSlideshow = document.querySelector('.hero-slideshow');
        this.mobileSlideshow = document.querySelector('.mobile-slideshow');
        this.heroSlides = document.querySelectorAll('.hero-slide');
        this.mobileSlides = document.querySelectorAll('.mobile-slide');
        this.slideDots = document.querySelectorAll('.slide-dot');
        this.slideNavigation = document.querySelector('.slide-navigation');
        
        // Animation elements
        this.serviceItems = document.querySelectorAll('.service-item');
        this.scrollInvitation = document.querySelector('.scroll-invitation');
        
        // State management
        this.currentSlide = 0;
        this.totalSlides = Math.max(this.heroSlides.length, this.mobileSlides.length);
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds
        this.isTransitioning = false;
        this.isMobile = window.innerWidth <= 1024;
        
        this.init();
    }
    
    init() {
        if (!this.heroSection) return;
        
        console.log('Initializing Enhanced Hero Controller...');
        console.log('Total slides found:', this.totalSlides);
        
        this.setupSlideshow();
        this.setupEventListeners();
        this.setupServiceAnimations();
        this.setupScrollAnimations();
        
        setTimeout(() => {
            this.startAutoPlay();
        }, 1000);
        
        console.log('✨ Enhanced Hero Controller initialized');
    }
    
    setupSlideshow() {
        if (this.totalSlides === 0) {
            console.warn('No slides found');
            return;
        }
        
        this.setActiveSlide(0, false);
        
        this.slideDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Dot clicked:', index);
                this.goToSlide(index);
            });
            
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
        });
        
        console.log('Slideshow setup complete');
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.isInViewport()) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
            }
        });
        
        if (this.heroSection && !this.isMobile) {
            this.heroSection.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });
            
            this.heroSection.addEventListener('mouseleave', () => {
                this.resumeAutoPlay();
            });
        }
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else if (this.isAutoPlaying) {
                this.resumeAutoPlay();
            }
        });
    }
    
    setupServiceAnimations() {
        if (!this.serviceItems.length) return;
        
        this.serviceItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    }
    
    setupScrollAnimations() {
        if (!this.scrollInvitation) return;
        
        setTimeout(() => {
            this.scrollInvitation.style.opacity = '1';
        }, 1500);
        
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    const opacity = Math.max(0, 1 - (scrollY / 200));
                    
                    if (this.scrollInvitation) {
                        this.scrollInvitation.style.opacity = opacity;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide || index < 0 || index >= this.totalSlides) {
            return;
        }
        
        console.log('Going to slide:', index);
        this.setActiveSlide(index, true);
    }
    
    setActiveSlide(index, animate = true) {
        if (index < 0 || index >= this.totalSlides) return;
        
        this.isTransitioning = true;
        
        this.heroSlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        this.mobileSlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        this.slideDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        this.currentSlide = index;
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
        
        console.log('Active slide set to:', index);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        console.log('Next slide:', nextIndex);
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        console.log('Previous slide:', prevIndex);
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval || this.totalSlides <= 1) return;
        
        console.log('Starting autoplay');
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            console.log('Pausing autoplay');
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying && !this.autoPlayInterval && this.totalSlides > 1) {
            console.log('Resuming autoplay');
            this.startAutoPlay();
        }
    }
    
    isInViewport() {
        if (!this.heroSection) return false;
        
        const rect = this.heroSection.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    isAutoPlayActive() {
        return this.isAutoPlaying && this.autoPlayInterval !== null;
    }
    
    destroy() {
        this.pauseAutoPlay();
        console.log('🗑️ Enhanced Hero Controller destroyed');
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
                this.trackEvent('contact', 'phone_click', '(646) 971-7325');
            });
        });
    }
    
    setupEmailTracking() {
        this.emailLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('contact', 'email_click');
            });
        });
    }
    
    trackEvent(category, action, label = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
    }
}

/* ========================================
   UTILITY FUNCTIONS
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
   MAIN APPLICATION
   ======================================== */
class HolisticPsychApp {
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
            this.components.preloader = new SleekPreloader();
            
            document.addEventListener('preloaderComplete', () => {
                this.initializeMainComponents();
            });
            
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
            this.components.header = new RefinedHeaderController();
            this.components.hero = new EnhancedHeroController();
            this.components.contactForm = new ContactFormHandler();
            
            this.isInitialized = true;
            console.log('✅ Holistic Psychology App initialized successfully');
            
            document.dispatchEvent(new CustomEvent('appInitialized', {
                detail: { components: this.components }
            }));
            
        } catch (error) {
            console.error('Error initializing main components:', error);
            this.initializeFallback();
        }
    }
    
    initializeFallback() {
        console.log('🔄 Initializing fallback functionality');
        
        const mobileToggle = document.getElementById('modernMenuTrigger');
        const mobileOverlay = document.getElementById('modernMobileOverlay');
        
        if (mobileToggle && mobileOverlay) {
            mobileToggle.addEventListener('click', () => {
                mobileOverlay.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
        
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        setTimeout(() => {
            const preloader = document.getElementById('sleekPreloader');
            if (preloader) {
                preloader.style.display = 'none';
            }
        }, 2000);
        
        // Basic slideshow fallback
        const heroSlides = document.querySelectorAll('.hero-slide');
        const mobileSlides = document.querySelectorAll('.mobile-slide');
        const dots = document.querySelectorAll('.slide-dot');
        let currentSlide = 0;
        const totalSlides = Math.max(heroSlides.length, mobileSlides.length);
        
        function showSlide(index) {
            heroSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            mobileSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
            console.log('Fallback slideshow - slide changed to:', index);
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                showSlide(index);
            });
        });
        
        if (totalSlides > 1) {
            setInterval(() => {
                const nextSlide = (currentSlide + 1) % totalSlides;
                showSlide(nextSlide);
            }, 4000);
        }
        
        console.log('✅ Fallback functionality initialized');
    }
    
    getComponent(name) {
        return this.components[name];
    }
}

/* ========================================
   INITIALIZATION
   ======================================== */

let sleekPreloader;
let refinedHeaderController;
let enhancedHeroController;

function initializeSleekPreloader() {
    sleekPreloader = new SleekPreloader();
}

function initializeRefinedHeader() {
    refinedHeaderController = new RefinedHeaderController();
}

function initializeEnhancedHero() {
    try {
        console.log('Initializing Enhanced Hero System...');
        enhancedHeroController = new EnhancedHeroController();
        
        window.EnhancedHeroController = {
            getInstance: () => enhancedHeroController,
            goToSlide: (index) => enhancedHeroController?.goToSlide(index),
            nextSlide: () => enhancedHeroController?.nextSlide(),
            previousSlide: () => enhancedHeroController?.previousSlide(),
            getCurrentSlide: () => enhancedHeroController?.getCurrentSlide() || 0,
            getTotalSlides: () => enhancedHeroController?.getTotalSlides() || 0,
        };
        
        console.log('✅ Enhanced Hero System initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing Enhanced Hero System:', error);
    }
}

// Check if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeSleekPreloader();
        initializeRefinedHeader();
        
        setTimeout(() => {
            initializeEnhancedHero();
        }, 500);
    });
} else {
    initializeSleekPreloader();
    initializeRefinedHeader();
    
    setTimeout(() => {
        initializeEnhancedHero();
    }, 500);
}

// Global API for external access
window.SleekPreloader = {
    getInstance: () => sleekPreloader,
    hide: () => sleekPreloader?.forceHide(),
    getProgress: () => sleekPreloader?.getProgress() || 0,
    isComplete: () => sleekPreloader?.isCompleted() || false
};

window.RefinedHeaderController = {
    getInstance: () => refinedHeaderController,
    showHeader: () => refinedHeaderController?.forceShowHeader(),
    hideHeader: () => refinedHeaderController?.forceHideHeader(),
    setActiveNav: (index) => refinedHeaderController?.setActiveNavigation(index),
    getActiveNav: () => refinedHeaderController?.getActiveNavIndex() || 0,
    isMobileMenuOpen: () => refinedHeaderController?.isMobileMenuActive() || false
};

// Utility functions
function smoothScrollToSection(target, offset = 100) {
    if (refinedHeaderController) {
        refinedHeaderController.scrollToSection(target);
    }
}

function toggleRefinedHeaderVisibility(show = true) {
    if (refinedHeaderController) {
        if (show) {
            refinedHeaderController.forceShowHeader();
        } else {
            refinedHeaderController.forceHideHeader();
        }
    }
}

function hideSleekPreloader() {
    if (sleekPreloader) {
        sleekPreloader.forceHide();
    }
}

// Initialize the application
const app = new HolisticPsychApp();

// Make components globally accessible for debugging
window.HolisticApp = app;
window.UtilityFunctions = UtilityFunctions;

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

console.log('✨ Holistic Psychology System loaded successfully');
