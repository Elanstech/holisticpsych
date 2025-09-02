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
        if (typeof window.RefinedHeaderController !== 'undefined') {
            // Header is already initialized in the original code
        }
        
        // Add any other component initializations here
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 100);
});

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
        
        // Animation timing
        this.menuAnimationDuration = 500;
        this.staggerDelay = 100;
        
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        this.setupScrollBehavior();
        this.setupNavigationIndicator();
        this.setupModernMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollSpy();
        this.setupEnhancedEffects();
        
        // Set initial nav indicator position
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
        
        // Add scrolled class for visual changes
        if (currentScrollY > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Smooth hide/show header on scroll
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
            // Scrolling down
            if (!this.isScrollingDown && !this.isMobileMenuOpen) {
                this.isScrollingDown = true;
                this.hideHeader();
            }
        } else {
            // Scrolling up
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
                
                // Update active states
                this.setActiveNavigation(index);
                
                // Smooth scroll to section
                const target = dot.getAttribute('href');
                this.scrollToSection(target);
            });
            
            // Enhanced hover effects with micro-interactions
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
        
        const positions = [8, 64, 120, 176, 232]; // Adjusted for new spacing
        const position = positions[index] || 8;
        
        this.navIndicator.style.left = position + 'px';
        this.navTrack.setAttribute('data-active', index);
        
        // Add smooth scale animation
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
        
        // Mobile trigger click
        this.modernMenuTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleModernMobileMenu();
        });
        
        // Modern close button
        if (this.modernCloseBtn) {
            this.modernCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModernMobileMenu();
            });
        }
        
        // Backdrop click to close
        if (this.overlayBackdrop) {
            this.overlayBackdrop.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModernMobileMenu();
            });
        }
        
        // Mobile navigation links
        this.mobileNavLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                    this.closeModernMobileMenu();
                    
                    // Update desktop nav indicator
                    this.updateDesktopNavFromMobile(href);
                }
            });
            
            // Enhanced hover effects
            link.addEventListener('mouseenter', () => {
                this.addMobileLinkHover(link);
            });
            
            link.addEventListener('mouseleave', () => {
                this.removeMobileLinkHover(link);
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeModernMobileMenu();
            }
        });
        
        // Close on window resize (desktop)
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
        
        // Update trigger state
        this.modernMenuTrigger.classList.add('active');
        
        // Show overlay
        this.modernMobileOverlay.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Keep header visible
        this.header.style.transform = 'translateX(-50%) translateY(0)';
        this.header.style.opacity = '1';
        this.isScrollingDown = false;
        
        // Staggered animation for mobile links
        this.animateMobileLinksIn();
        
        // Add subtle haptic feedback (if supported)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        console.log('🎯 Modern mobile menu opened');
    }
    
    closeModernMobileMenu() {
        if (!this.isMobileMenuOpen) return;
        
        this.isMobileMenuOpen = false;
        
        // Update trigger state
        this.modernMenuTrigger.classList.remove('active');
        
        // Hide overlay
        this.modernMobileOverlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Reset mobile links animation
        this.animateMobileLinksOut();
        
        console.log('🎯 Modern mobile menu closed');
    }
    
    animateMobileLinksIn() {
        this.mobileNavLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, index * this.staggerDelay);
        });
    }
    
    animateMobileLinksOut() {
        this.mobileNavLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(50px)';
            link.style.transitionDelay = '0s';
        });
    }
    
    addMobileLinkHover(link) {
        const icon = link.querySelector('.nav-link-icon');
        const arrow = link.querySelector('.nav-link-arrow');
        
        if (icon) {
            icon.style.transform = 'scale(1.1)';
        }
        if (arrow) {
            arrow.style.transform = 'translateX(4px)';
        }
    }
    
    removeMobileLinkHover(link) {
        const icon = link.querySelector('.nav-link-icon');
        const arrow = link.querySelector('.nav-link-arrow');
        
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
        if (arrow) {
            arrow.style.transform = 'translateX(0)';
        }
    }
    
    setupSmoothScrolling() {
        // Handle all navigation links
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
        
        // Smooth scroll with easing
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
    
    setupEnhancedEffects() {
        // Logo hover enhancement
        const logoContainer = document.querySelector('.logo-container');
        if (logoContainer) {
            logoContainer.addEventListener('mouseenter', () => {
                this.addLogoHoverEffect();
            });
            
            logoContainer.addEventListener('mouseleave', () => {
                this.removeLogoHoverEffect();
            });
        }
        
        // Phone bubble interactions
        const phoneBubble = document.querySelector('.phone-bubble');
        if (phoneBubble) {
            phoneBubble.addEventListener('mouseenter', () => {
                this.triggerShimmerEffect(phoneBubble);
            });
        }
        
        // CTA button interactions
        const ctaButton = document.querySelector('.cta-floating');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                this.triggerWaveEffect(ctaButton);
            });
        }
        
        // Add parallax effect to header
        this.setupHeaderParallax();
    }
    
    addLogoHoverEffect() {
        const logo = document.querySelector('.header-logo');
        const shimmer = document.querySelector('.logo-shimmer');
        
        if (logo) {
            logo.style.transform = 'scale(1.05) rotate(2deg)';
            logo.style.filter = 'brightness(1.1) saturate(1.2)';
        }
    }
    
    removeLogoHoverEffect() {
        const logo = document.querySelector('.header-logo');
        
        if (logo) {
            logo.style.transform = 'scale(1) rotate(0deg)';
            logo.style.filter = 'brightness(1) saturate(1)';
        }
    }
    
    triggerShimmerEffect(element) {
        const shimmer = element.querySelector('.bubble-shimmer');
        if (shimmer) {
            shimmer.style.left = '-100%';
            setTimeout(() => {
                shimmer.style.left = '100%';
            }, 100);
        }
    }
    
    triggerWaveEffect(element) {
        const waves = element.querySelector('.cta-waves');
        if (waves) {
            waves.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                waves.style.transform = 'translateX(100%)';
            }, 50);
            setTimeout(() => {
                waves.style.transform = 'translateX(-100%)';
            }, 600);
        }
    }
    
    setupHeaderParallax() {
        let ticking = false;
        
        const parallaxScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const parallax = scrolled * 0.1;
                    
                    // Subtle parallax effect on header glow
                    const headerGlow = document.querySelector('.header-glow');
                    if (headerGlow) {
                        headerGlow.style.transform = `translateY(${parallax}px)`;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', parallaxScroll, { passive: true });
    }
    
    // Public API methods
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
        // Clean up event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeydown);
        
        console.log('🗑️ Refined Header Controller destroyed');
    }
}

class HeaderUtilities {
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
    
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    static addRippleEffect(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

let refinedHeaderController;

// Initialize when DOM is ready
function initializeRefinedHeader() {
    refinedHeaderController = new RefinedHeaderController();
    
    // Add CSS for ripple animation if not present
    if (!document.querySelector('#ripple-animation-css')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation-css';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Check if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRefinedHeader);
} else {
    initializeRefinedHeader();
}

// Global API for external access
window.RefinedHeaderController = {
    getInstance: () => refinedHeaderController,
    showHeader: () => refinedHeaderController?.forceShowHeader(),
    hideHeader: () => refinedHeaderController?.forceHideHeader(),
    setActiveNav: (index) => refinedHeaderController?.setActiveNavigation(index),
    getActiveNav: () => refinedHeaderController?.getActiveNavIndex() || 0,
    isMobileMenuOpen: () => refinedHeaderController?.isMobileMenuActive() || false
};

// Smooth scroll utility function
function smoothScrollToSection(target, offset = 100) {
    if (refinedHeaderController) {
        refinedHeaderController.scrollToSection(target);
    }
}

// Header visibility control
function toggleRefinedHeaderVisibility(show = true) {
    if (refinedHeaderController) {
        if (show) {
            refinedHeaderController.forceShowHeader();
        } else {
            refinedHeaderController.forceHideHeader();
        }
    }
}

// Graceful error handling
window.addEventListener('error', (event) => {
    if (event.error && event.error.message.includes('header')) {
        console.warn('Header error handled gracefully:', event.error);
    }
});

// Performance monitoring
const headerPerformanceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
        if (entry.name.includes('header') && entry.duration > 100) {
            console.warn(`Header operation took ${entry.duration}ms:`, entry.name);
        }
    });
});

// Start observing performance
if (typeof PerformanceObserver !== 'undefined') {
    headerPerformanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
}

console.log('✨ Refined Header System loaded successfully');


/* ========================================
   HERO SLIDESHOW CONTROLLER
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
        this.floatingElements = document.querySelectorAll('.wellness-element');
        this.serviceItems = document.querySelectorAll('.service-item');
        this.scrollInvitation = document.querySelector('.scroll-invitation');
        
        // State management
        this.currentSlide = 0;
        this.totalSlides = this.heroSlides.length;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 6000; // 6 seconds
        this.isTransitioning = false;
        this.isMobile = window.innerWidth <= 1024;
        
        // Performance optimization
        this.rafId = null;
        this.resizeTimeout = null;
        
        this.init();
    }
    
    init() {
        if (!this.heroSection) return;
        
        this.setupSlideshow();
        this.setupEventListeners();
        this.setupFloatingAnimations();
        this.setupServiceAnimations();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.startAutoPlay();
        
        console.log('✨ Enhanced Hero Controller initialized');
    }
    
    setupSlideshow() {
        if (this.totalSlides === 0) return;
        
        // Initialize first slide
        this.setActiveSlide(0, false);
        
        // Setup navigation dots
        this.slideDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSlide(index);
            });
            
            // Keyboard accessibility
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                }
            });
        });
        
        // Touch/swipe support for mobile
        this.setupTouchNavigation();
    }
    
    setupTouchNavigation() {
        if (!this.heroSection) return;
        
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        let threshold = 100; // Minimum distance for swipe
        let restraint = 100; // Maximum vertical distance
        
        this.heroSection.addEventListener('touchstart', (e) => {
            const touchObj = e.changedTouches[0];
            startX = touchObj.pageX;
            startY = touchObj.pageY;
        }, { passive: true });
        
        this.heroSection.addEventListener('touchend', (e) => {
            const touchObj = e.changedTouches[0];
            distX = touchObj.pageX - startX;
            distY = touchObj.pageY - startY;
            
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        }, { passive: true });
    }
    
    setupEventListeners() {
        // Keyboard navigation
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
                case ' ':
                    if (e.target === document.body) {
                        e.preventDefault();
                        this.toggleAutoPlay();
                    }
                    break;
            }
        });
        
        // Pause on hover
        if (this.heroSection) {
            this.heroSection.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });
            
            this.heroSection.addEventListener('mouseleave', () => {
                this.resumeAutoPlay();
            });
        }
        
        // Responsive handling
        window.addEventListener('resize', this.debounce(() => {
            const newIsMobile = window.innerWidth <= 1024;
            if (newIsMobile !== this.isMobile) {
                this.isMobile = newIsMobile;
                this.handleResponsiveChange();
            }
        }, 250));
        
        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.resumeAutoPlay();
            }
        });
    }
    
    handleResponsiveChange() {
        // Reset slideshow for new layout
        this.setActiveSlide(this.currentSlide, false);
        
        // Refresh floating animations
        if (!this.isMobile) {
            this.setupFloatingAnimations();
        }
    }
    
    setupFloatingAnimations() {
        if (this.isMobile || !this.floatingElements.length) return;
        
        this.floatingElements.forEach((element, index) => {
            // Reset any existing animations
            element.style.animation = 'none';
            
            // Add enhanced floating animation with stagger
            setTimeout(() => {
                element.style.animation = `floatElement ${6 + index * 2}s ease-in-out infinite`;
                element.style.animationDelay = `${index * 1.5}s`;
            }, 100);
        });
    }
    
    setupServiceAnimations() {
        if (!this.serviceItems.length) return;
        
        // Staggered entrance animations
        this.serviceItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 500 + (index * 150));
        });
        
        // Enhanced hover effects
        this.serviceItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.addServiceHoverEffect(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.removeServiceHoverEffect(item);
            });
        });
    }
    
    addServiceHoverEffect(item) {
        const icon = item.querySelector('.service-icon');
        const content = item.querySelector('.service-content');
        
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        if (content) {
            content.style.transform = 'translateY(-2px)';
        }
    }
    
    removeServiceHoverEffect(item) {
        const icon = item.querySelector('.service-icon');
        const content = item.querySelector('.service-content');
        
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
        
        if (content) {
            content.style.transform = 'translateY(0)';
        }
    }
    
    setupScrollAnimations() {
        if (!this.scrollInvitation) return;
        
        // Animate scroll invitation on load
        setTimeout(() => {
            this.scrollInvitation.style.opacity = '1';
            this.scrollInvitation.style.transform = 'translateX(-50%) translateY(0)';
        }, 2000);
        
        // Hide scroll invitation on scroll
        window.addEventListener('scroll', this.throttle(() => {
            const scrollY = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrollY / 300));
            
            if (this.scrollInvitation) {
                this.scrollInvitation.style.opacity = opacity;
            }
        }, 16));
    }
    
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -10% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.onHeroVisible();
                } else {
                    this.onHeroHidden();
                }
            });
        }, observerOptions);
        
        if (this.heroSection) {
            observer.observe(this.heroSection);
        }
    }
    
    onHeroVisible() {
        if (!this.isAutoPlaying) {
            this.startAutoPlay();
        }
    }
    
    onHeroHidden() {
        this.pauseAutoPlay();
    }
    
    goToSlide(index, animate = true) {
        if (this.isTransitioning || index === this.currentSlide || index < 0 || index >= this.totalSlides) {
            return;
        }
        
        this.setActiveSlide(index, animate);
    }
    
    setActiveSlide(index, animate = true) {
        if (index < 0 || index >= this.totalSlides) return;
        
        this.isTransitioning = true;
        
        // Update desktop slides
        this.heroSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        // Update mobile slides
        this.mobileSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        // Update navigation dots
        this.slideDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-selected', i === index);
        });
        
        this.currentSlide = index;
        
        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, animate ? 1500 : 100);
        
        // Trigger slide change events
        this.onSlideChange(index);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }
    
    onSlideChange(index) {
        // Add any slide-specific animations here
        this.triggerSlideAnimations(index);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('heroSlideChange', {
            detail: { 
                currentSlide: index,
                totalSlides: this.totalSlides
            }
        }));
    }
    
    triggerSlideAnimations(index) {
        // Add slide-specific entrance animations
        const currentSlide = this.heroSlides[index];
        if (!currentSlide) return;
        
        // Animate collage items with stagger
        const collageItems = currentSlide.querySelectorAll('.collage-item');
        collageItems.forEach((item, i) => {
            item.style.transform = 'translateY(20px) scale(0.95)';
            item.style.opacity = '0.7';
            
            setTimeout(() => {
                item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.transform = 'translateY(0) scale(1)';
                item.style.opacity = '1';
            }, i * 200);
        });
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval || this.totalSlides <= 1) return;
        
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            if (!this.isTransitioning && this.isInViewport()) {
                this.nextSlide();
            }
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying && !this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }
    
    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.isAutoPlaying = false;
            this.pauseAutoPlay();
        } else {
            this.isAutoPlaying = true;
            this.startAutoPlay();
        }
    }
    
    isInViewport() {
        if (!this.heroSection) return false;
        
        const rect = this.heroSection.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    // Utility methods
    debounce(func, wait) {
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
    
    throttle(func, limit) {
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
    
    // Public API methods
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
        // Clean up intervals and event listeners
        this.pauseAutoPlay();
        
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        console.log('🗑️ Enhanced Hero Controller destroyed');
    }
}

/* ========================================
   HERO ACCESSIBILITY ENHANCEMENTS
   ======================================== */
class HeroAccessibilityController {
    constructor(heroController) {
        this.heroController = heroController;
        this.init();
    }
    
    init() {
        this.setupAriaLabels();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupReducedMotionSupport();
    }
    
    setupAriaLabels() {
        const heroSection = document.querySelector('.enhanced-hero');
        if (heroSection) {
            heroSection.setAttribute('role', 'region');
            heroSection.setAttribute('aria-label', 'Hero slideshow showcasing our services');
        }
        
        const slideDots = document.querySelectorAll('.slide-dot');
        slideDots.forEach((dot, index) => {
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.setAttribute('tabindex', '0');
        });
    }
    
    setupKeyboardNavigation() {
        const slideDots = document.querySelectorAll('.slide-dot');
        
        slideDots.forEach((dot, index) => {
            dot.addEventListener('focus', () => {
                dot.style.outline = '2px solid var(--primary-green)';
                dot.style.outlineOffset = '2px';
            });
            
            dot.addEventListener('blur', () => {
                dot.style.outline = 'none';
            });
        });
    }
    
    setupScreenReaderSupport() {
        // Announce slide changes to screen readers
        document.addEventListener('heroSlideChange', (event) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = `Showing slide ${event.detail.currentSlide + 1} of ${event.detail.totalSlides}`;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        });
    }
    
    setupReducedMotionSupport() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Disable autoplay for users who prefer reduced motion
            if (this.heroController) {
                this.heroController.isAutoPlaying = false;
                this.heroController.pauseAutoPlay();
            }
            
            // Reduce animation durations
            const style = document.createElement('style');
            style.textContent = `
                .enhanced-hero * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

/* ========================================
   HERO PERFORMANCE MONITOR
   ======================================== */
class HeroPerformanceMonitor {
    constructor() {
        this.metrics = {
            slideTransitions: 0,
            averageTransitionTime: 0,
            totalTime: 0,
            errors: 0
        };
        
        this.init();
    }
    
    init() {
        this.monitorSlideTransitions();
        this.monitorImageLoading();
        this.monitorAnimationPerformance();
    }
    
    monitorSlideTransitions() {
        document.addEventListener('heroSlideChange', (event) => {
            const startTime = performance.now();
            
            setTimeout(() => {
                const endTime = performance.now();
                const transitionTime = endTime - startTime;
                
                this.metrics.slideTransitions++;
                this.metrics.totalTime += transitionTime;
                this.metrics.averageTransitionTime = this.metrics.totalTime / this.metrics.slideTransitions;
                
                // Log performance if transition is slow
                if (transitionTime > 100) {
                    console.warn(`Slow hero transition: ${transitionTime}ms`);
                }
            }, 1500);
        });
    }
    
    monitorImageLoading() {
        const images = document.querySelectorAll('.enhanced-hero img');
        let loadedImages = 0;
        const totalImages = images.length;
        
        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    
                    if (loadedImages === totalImages) {
                        console.log('✅ All hero images loaded successfully');
                    }
                });
                
                img.addEventListener('error', () => {
                    this.metrics.errors++;
                    console.error('❌ Hero image failed to load:', img.src);
                });
            }
        });
    }
    
    monitorAnimationPerformance() {
        // Monitor for dropped frames during animations
        let lastTime = performance.now();
        let frameCount = 0;
        
        const checkFrameRate = () => {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime > 16.67) { // More than 60fps
                frameCount++;
                
                if (frameCount > 10) {
                    console.warn('Hero animations may be dropping frames');
                    frameCount = 0;
                }
            }
            
            lastTime = currentTime;
            requestAnimationFrame(checkFrameRate);
        };
        
        requestAnimationFrame(checkFrameRate);
    }
    
    getMetrics() {
        return { ...this.metrics };
    }
}

/* ========================================
   INITIALIZATION & INTEGRATION
   ======================================== */

let enhancedHeroController;
let heroAccessibilityController;
let heroPerformanceMonitor;

function initializeEnhancedHero() {
    try {
        // Initialize main hero controller
        enhancedHeroController = new EnhancedHeroController();
        
        // Initialize accessibility enhancements
        heroAccessibilityController = new HeroAccessibilityController(enhancedHeroController);
        
        // Initialize performance monitoring
        heroPerformanceMonitor = new HeroPerformanceMonitor();
        
        console.log('✅ Enhanced Hero System initialized successfully');
        
        // Dispatch initialization event
        document.dispatchEvent(new CustomEvent('heroInitialized', {
            detail: {
                controller: enhancedHeroController,
                accessibility: heroAccessibilityController,
                performance: heroPerformanceMonitor
            }
        }));
        
    } catch (error) {
        console.error('❌ Error initializing Enhanced Hero System:', error);
        
        // Fallback initialization
        initializeBasicHero();
    }
}

function initializeBasicHero() {
    console.log('🔄 Initializing basic hero fallback');
    
    // Basic slideshow functionality
    const slides = document.querySelectorAll('.hero-slide, .mobile-slide');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Basic auto-advance
    setInterval(() => {
        const nextSlide = (currentSlide + 1) % slides.length;
        showSlide(nextSlide);
    }, 6000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedHero);
} else {
    initializeEnhancedHero();
}

// Global API for external access
window.EnhancedHeroController = {
    getInstance: () => enhancedHeroController,
    goToSlide: (index) => enhancedHeroController?.goToSlide(index),
    nextSlide: () => enhancedHeroController?.nextSlide(),
    previousSlide: () => enhancedHeroController?.previousSlide(),
    toggleAutoPlay: () => enhancedHeroController?.toggleAutoPlay(),
    getCurrentSlide: () => enhancedHeroController?.getCurrentSlide() || 0,
    getTotalSlides: () => enhancedHeroController?.getTotalSlides() || 0,
    getMetrics: () => heroPerformanceMonitor?.getMetrics() || {},
    isAutoPlaying: () => enhancedHeroController?.isAutoPlayActive() || false
};

// Error handling
window.addEventListener('error', (event) => {
    if (event.error && event.error.message.includes('hero')) {
        console.warn('Hero error handled gracefully:', event.error);
        
        // Attempt recovery
        if (!enhancedHeroController) {
            setTimeout(initializeBasicHero, 1000);
        }
    }
});

// Performance monitoring for the entire hero system
if (typeof PerformanceObserver !== 'undefined') {
    const heroPerformanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            if (entry.name.includes('hero') && entry.duration > 50) {
                console.warn(`Hero operation took ${entry.duration}ms:`, entry.name);
            }
        });
    });
    
    heroPerformanceObserver.observe({ entryTypes: ['measure'] });
}

console.log('✨ Enhanced Hero System loaded and ready');

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
            this.components.header = new RefinedHeaderController();
            this.components.heroSlideshow = new EnhancedHeroController();
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
    if (RefinedHeaderController) {
        if (show) {
            RefinedHeaderController.showHeader();
        } else {
            RefinedHeaderController.hideHeader();
        }
    }
}

// Set active navigation programmatically
function setActiveNavigation(index) {
    if (RefinedHeaderController) {
        RefinedHeaderController.setActiveNav(index);
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
        RefinedHeaderController,
        EnhancedHeroController,
        ScrollAnimationsController,
        ContactFormHandler,
        UtilityFunctions
    };
}
