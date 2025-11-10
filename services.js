/* ==========================================================================
   SERVICES PAGE - JAVASCRIPT
   Holistic Psychological Services PLLC
   ========================================================================== */

'use strict';

/* ==========================================================================
   SERVICES PAGE CONTROLLER
   ========================================================================== */

class ServicesPage {
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
        this.initCategoryFiltering();
        this.initFAQAccordion();
        this.initProcessAccordion();
        this.initScrollEffects();
        this.initSmoothScrolling();
        this.initImageLazyLoading();
        console.log('Services page initialized successfully');
    }
    
    /* ==========================================================================
       CATEGORY FILTERING
       ========================================================================== */
    
    initCategoryFiltering() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const serviceCards = document.querySelectorAll('.service-card');
        
        if (tabButtons.length === 0 || serviceCards.length === 0) return;
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter cards with animation
                this.filterCards(serviceCards, category);
            });
        });
    }
    
    filterCards(cards, category) {
        cards.forEach((card, index) => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                // Show card with staggered animation
                card.style.display = 'flex';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                // Hide card
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 400);
            }
        });
    }
    
    /* ==========================================================================
       FAQ ACCORDION
       ========================================================================== */
    
    initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        if (faqItems.length === 0) return;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        });
    }
    
    /* ==========================================================================
       PROCESS ACCORDION
       ========================================================================== */
    
    initProcessAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        
        if (accordionItems.length === 0) return;
        
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items (single-open behavior)
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        });
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
       SMOOTH SCROLLING
       ========================================================================== */
    
    initSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#' || targetId === '#contact') {
                    // Let the default behavior handle navigation to contact page
                    return;
                }
                
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
}

/* ==========================================================================
   SERVICE CARDS INTERACTIONS
   ========================================================================== */

class ServiceCardsInteractions {
    constructor() {
        this.cards = document.querySelectorAll('.service-card');
        this.init();
    }
    
    init() {
        if (this.cards.length === 0) return;
        
        this.cards.forEach(card => {
            this.addHoverEffects(card);
            this.addScrollAnimation(card);
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
    
    highlightCard(card) {
        const tags = card.querySelectorAll('.tag');
        tags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(-2px)';
            }, index * 30);
        });
    }
    
    unhighlightCard(card) {
        const tags = card.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.style.transform = '';
        });
    }
    
    addScrollAnimation(card) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        observer.observe(card);
    }
}

/* ==========================================================================
   APPROACH CARDS ANIMATIONS
   ========================================================================== */

class ApproachCardsAnimations {
    constructor() {
        this.cards = document.querySelectorAll('.approach-card');
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
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        card.style.transition = 'all 0.6s ease';
        
        observer.observe(card);
    }
    
    animateIcon(card) {
        const icon = card.querySelector('.approach-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(-5deg)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        }
    }
}

/* ==========================================================================
   CTA BUTTON INTERACTIONS
   ========================================================================== */

class CTAButtonInteractions {
    constructor() {
        this.buttons = document.querySelectorAll('.cta-btn, .card-btn, .insurance-btn');
        this.init();
    }
    
    init() {
        if (this.buttons.length === 0) return;
        
        this.buttons.forEach(button => {
            this.addRippleEffect(button);
        });
    }
    
    addRippleEffect(button) {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

/* ==========================================================================
   SEARCH/FILTER ENHANCEMENT
   ========================================================================== */

class ServiceSearch {
    constructor() {
        this.cards = document.querySelectorAll('.service-card');
        this.init();
    }
    
    init() {
        // Could add a search bar if needed
        // For now, just setup the base functionality
        this.prepareCards();
    }
    
    prepareCards() {
        this.cards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
            const details = Array.from(card.querySelectorAll('.detail-item span'))
                .map(span => span.textContent.toLowerCase())
                .join(' ');
            
            // Store searchable text as data attribute
            card.dataset.searchText = `${title} ${description} ${details}`;
        });
    }
    
    search(query) {
        const searchTerm = query.toLowerCase().trim();
        
        this.cards.forEach(card => {
            const searchText = card.dataset.searchText || '';
            const matches = searchText.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                card.style.display = 'flex';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
            }
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
        this.lazyLoadBackgrounds();
    }
    
    reduceMotionCheck() {
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
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.documentElement.classList.add('page-hidden');
            } else {
                document.documentElement.classList.remove('page-hidden');
            }
        });
    }
    
    lazyLoadBackgrounds() {
        const elements = document.querySelectorAll('[data-bg]');
        
        if (elements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const bg = element.dataset.bg;
                    if (bg) {
                        element.style.backgroundImage = `url(${bg})`;
                        observer.unobserve(element);
                    }
                }
            });
        });
        
        elements.forEach(el => observer.observe(el));
    }
}

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

const Utils = {
    // Debounce function
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
    
    // Throttle function
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
    window.servicesPage = new ServicesPage();
    
    // Initialize component interactions
    window.serviceCards = new ServiceCardsInteractions();
    window.approachCards = new ApproachCardsAnimations();
    window.ctaButtons = new CTAButtonInteractions();
    window.serviceSearch = new ServiceSearch();
    window.performance = new PerformanceOptimization();
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .cta-btn,
        .card-btn,
        .insurance-btn {
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
        
        .page-hidden * {
            animation-play-state: paused !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('All services page components initialized');
});

/* ==========================================================================
   SCROLL TO TOP
   ========================================================================== */

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
        ServicesPage,
        ServiceCardsInteractions,
        ApproachCardsAnimations,
        CTAButtonInteractions,
        ServiceSearch,
        PerformanceOptimization,
        Utils
    };
}
