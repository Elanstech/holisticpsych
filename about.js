/* ==========================================================================
   ABOUT PAGE - JAVASCRIPT
   Holistic Psychological Services PLLC
   ========================================================================== */

'use strict';

/* ==========================================================================
   ABOUT PAGE CONTROLLER
   ========================================================================== */

class AboutPage {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.initCounterAnimations();
        this.initScrollEffects();
        this.initParallax();
        this.initImageLazyLoading();
        this.initSmoothScrolling();
        console.log('About page initialized successfully');
    }
    
    /* ==========================================================================
       COUNTER ANIMATIONS
       ========================================================================== */
    
    initCounterAnimations() {
        const stats = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        stats.forEach(stat => observer.observe(stat));
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const number = parseInt(text.replace(/[^\d]/g, ''));
        
        if (isNaN(number)) return;
        
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = number / steps;
        const stepDuration = duration / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            let display = Math.floor(current).toString();
            if (hasPlus) display += '+';
            if (hasPercent) display += '%';
            
            element.textContent = display;
        }, stepDuration);
    }
    
    /* ==========================================================================
       SCROLL EFFECTS
       ========================================================================== */
    
    initScrollEffects() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        
        // Hero scroll indicator fade
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        if (scrollIndicator) {
            const opacity = Math.max(0, 1 - (scrolled / 300));
            scrollIndicator.style.opacity = opacity;
        }
        
        // Fade in elements on scroll
        this.fadeInOnScroll();
    }
    
    fadeInOnScroll() {
        const elements = document.querySelectorAll('[data-fade-in]');
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    }
    
    /* ==========================================================================
       PARALLAX EFFECTS
       ========================================================================== */
    
    initParallax() {
        const parallaxElements = document.querySelectorAll('.mission-image img, .why-choose-image img');
        
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax(parallaxElements);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateParallax(elements) {
        const scrolled = window.pageYOffset;
        
        elements.forEach(element => {
            const parent = element.closest('section');
            if (!parent) return;
            
            const parentTop = parent.offsetTop;
            const parentHeight = parent.offsetHeight;
            
            // Only apply parallax when section is in view
            if (scrolled > parentTop - window.innerHeight && 
                scrolled < parentTop + parentHeight) {
                
                const offset = (scrolled - parentTop) * 0.15;
                element.style.transform = `translateY(${offset}px) scale(1.1)`;
            }
        });
    }
    
    /* ==========================================================================
       IMAGE LAZY LOADING
       ========================================================================== */
    
    initImageLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => this.loadImage(img));
        }
    }
    
    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        }
    }
    
    /* ==========================================================================
       SMOOTH SCROLLING
       ========================================================================== */
    
    initSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerOffset = 100;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/* ==========================================================================
   FOUNDER CARDS INTERACTIONS
   ========================================================================== */

class FounderCardsInteractions {
    constructor() {
        this.cards = document.querySelectorAll('.founder-card');
        this.init();
    }
    
    init() {
        if (this.cards.length === 0) return;
        
        this.cards.forEach(card => {
            this.addHoverEffects(card);
            this.addTouchEffects(card);
        });
    }
    
    addHoverEffects(card) {
        card.addEventListener('mouseenter', () => {
            this.highlightCard(card);
        });
        
        card.addEventListener('mouseleave', () => {
            this.unhighlightCard(card);
        });
    }
    
    addTouchEffects(card) {
        let touchStartY = 0;
        
        card.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        card.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = Math.abs(touchEndY - touchStartY);
            
            // If it's a tap (not a scroll), toggle highlight
            if (diff < 10) {
                if (card.classList.contains('touch-highlighted')) {
                    this.unhighlightCard(card);
                } else {
                    this.highlightCard(card);
                }
            }
        });
    }
    
    highlightCard(card) {
        card.classList.add('touch-highlighted');
        const specialtyTags = card.querySelectorAll('.specialty-tag');
        specialtyTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(-2px)';
            }, index * 50);
        });
    }
    
    unhighlightCard(card) {
        card.classList.remove('touch-highlighted');
        const specialtyTags = card.querySelectorAll('.specialty-tag');
        specialtyTags.forEach(tag => {
            tag.style.transform = '';
        });
    }
}

/* ==========================================================================
   VALUE CARDS ANIMATIONS
   ========================================================================== */

class ValueCardsAnimations {
    constructor() {
        this.cards = document.querySelectorAll('.value-card');
        this.init();
    }
    
    init() {
        if (this.cards.length === 0) return;
        
        this.cards.forEach((card, index) => {
            this.addInteractions(card, index);
        });
    }
    
    addInteractions(card, index) {
        card.addEventListener('mouseenter', () => {
            this.animateIcon(card);
        });
        
        // Staggered animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        
        observer.observe(card);
    }
    
    animateIcon(card) {
        const icon = card.querySelector('.value-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(-5deg)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        }
    }
}

/* ==========================================================================
   INCLUSIVE SECTION ANIMATIONS
   ========================================================================== */

class InclusiveSectionAnimations {
    constructor() {
        this.section = document.querySelector('.inclusive-section');
        this.icon = document.querySelector('.inclusive-icon');
        this.badges = document.querySelectorAll('.inclusive-badge');
        this.init();
    }
    
    init() {
        if (!this.section) return;
        
        this.animateIcon();
        this.animateBadges();
    }
    
    animateIcon() {
        if (!this.icon) return;
        
        setInterval(() => {
            this.icon.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.icon.style.transform = '';
            }, 300);
        }, 3000);
    }
    
    animateBadges() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.badges.forEach((badge, index) => {
                        setTimeout(() => {
                            badge.style.opacity = '1';
                            badge.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });
        
        this.badges.forEach(badge => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(20px)';
            badge.style.transition = 'all 0.5s ease';
        });
        
        if (this.section) {
            observer.observe(this.section);
        }
    }
}

/* ==========================================================================
   CTA BUTTON INTERACTIONS
   ========================================================================== */

class CTAButtonInteractions {
    constructor() {
        this.buttons = document.querySelectorAll('.cta-btn');
        this.init();
    }
    
    init() {
        if (this.buttons.length === 0) return;
        
        this.buttons.forEach(button => {
            this.addRippleEffect(button);
        });
    }
    
    addRippleEffect(button) {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

/* ==========================================================================
   PERFORMANCE OPTIMIZATION
   ========================================================================== */

class PerformanceOptimization {
    constructor() {
        this.init();
    }
    
    init() {
        this.reduceMotionCheck();
        this.handleVisibilityChange();
    }
    
    reduceMotionCheck() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.documentElement.classList.add('reduce-motion');
            
            // Disable AOS animations
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    disable: true
                });
            }
        }
    }
    
    handleVisibilityChange() {
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.documentElement.classList.add('page-hidden');
            } else {
                document.documentElement.classList.remove('page-hidden');
            }
        });
    }
}

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

const Utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
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
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

/* ==========================================================================
   INITIALIZE ALL COMPONENTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize main page controller
    window.aboutPage = new AboutPage();
    
    // Initialize component interactions
    window.founderCards = new FounderCardsInteractions();
    window.valueCards = new ValueCardsAnimations();
    window.inclusiveSection = new InclusiveSectionAnimations();
    window.ctaButtons = new CTAButtonInteractions();
    window.performance = new PerformanceOptimization();
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .cta-btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .reduce-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('All about page components initialized');
});

/* ==========================================================================
   SCROLL TO TOP
   ========================================================================== */

// Add scroll to top functionality
window.addEventListener('scroll', Utils.throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        if (scrollTop > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}, 100));

/* ==========================================================================
   EXPORT FOR MODULE SYSTEMS
   ========================================================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AboutPage,
        FounderCardsInteractions,
        ValueCardsAnimations,
        InclusiveSectionAnimations,
        CTAButtonInteractions,
        PerformanceOptimization,
        Utils
    };
}
