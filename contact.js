// ========================================

// MAIN APP INITIALIZATION

// ========================================

class ContactApp {

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

        // Initialize all components

        this.initScrollAnimations();

        this.initFAQ();

        this.initSmoothScroll();

        this.initBackToTop();

        this.initFormEnhancements();

        this.initContactCards();

        this.initMapInteraction();

 

        console.log('✨ Contact page initialized successfully');

    }

 

    // ========================================

    // SCROLL ANIMATIONS

    // ========================================

    initScrollAnimations() {

        const observerOptions = {

            threshold: 0.1,

            rootMargin: '0px 0px -50px 0px'

        };

 

        const observer = new IntersectionObserver((entries) => {

            entries.forEach((entry, index) => {

                if (entry.isIntersecting) {

                    // Add staggered animation delay

                    setTimeout(() => {

                        entry.target.classList.add('animate-in');

                    }, index * 100);

 

                    observer.unobserve(entry.target);

                }

            });

        }, observerOptions);

 

        // Observe all elements with data-animate attribute

        const animatedElements = document.querySelectorAll('[data-animate]');

        animatedElements.forEach(el => observer.observe(el));

    }

 

    // ========================================

    // FAQ ACCORDION

    // ========================================

    initFAQ() {

        const faqItems = document.querySelectorAll('.faq-item');

 

        faqItems.forEach(item => {

            const question = item.querySelector('.faq-question');

            const answer = item.querySelector('.faq-answer');

 

            question.addEventListener('click', () => {

                const isActive = item.classList.contains('active');

 

                // Close all FAQ items

                faqItems.forEach(faq => {

                    faq.classList.remove('active');

                    const ans = faq.querySelector('.faq-answer');

                    ans.style.maxHeight = null;

                });

 

                // Open clicked item if it wasn't active

                if (!isActive) {

                    item.classList.add('active');

                    answer.style.maxHeight = answer.scrollHeight + 'px';

                }

            });

        });

    }

 

    // ========================================

    // SMOOTH SCROLL

    // ========================================

    initSmoothScroll() {

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {

            anchor.addEventListener('click', (e) => {

                const href = anchor.getAttribute('href');

 

                // Skip if href is just "#"

                if (href === '#') return;

 

                const target = document.querySelector(href);

 

                if (target) {

                    e.preventDefault();

 

                    const headerOffset = 100;

                    const elementPosition = target.getBoundingClientRect().top;

                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

 

                    window.scrollTo({

                        top: offsetPosition,

                        behavior: 'smooth'

                    });

                }

            });

        });

    }

 

    // ========================================

    // BACK TO TOP BUTTON

    // ========================================

    initBackToTop() {

        const backToTopButton = document.getElementById('backToTop');

 

        if (!backToTopButton) return;

 

        // Show/hide button based on scroll position

        window.addEventListener('scroll', () => {

            if (window.pageYOffset > 300) {

                backToTopButton.classList.add('visible');

            } else {

                backToTopButton.classList.remove('visible');

            }

        });

 

        // Scroll to top on click

        backToTopButton.addEventListener('click', () => {

            window.scrollTo({

                top: 0,

                behavior: 'smooth'

            });

        });

    }

 

    // ========================================

    // FORM ENHANCEMENTS

    // ========================================

    initFormEnhancements() {

        // Add loading state handler for form

        const formContainer = document.querySelector('.elfsight-form-container');

 

        if (formContainer) {

            // Add a loading indicator

            const loadingIndicator = document.createElement('div');

            loadingIndicator.className = 'form-loading';

            loadingIndicator.innerHTML = `

                <div class="loading-spinner"></div>

                <p>Loading contact form...</p>

            `;

            formContainer.style.position = 'relative';

            formContainer.appendChild(loadingIndicator);

 

            // Remove loading indicator when Elfsight loads

            const checkFormLoaded = setInterval(() => {

                const elfsightWidget = formContainer.querySelector('[class*="elfsight-app"]');

                if (elfsightWidget && elfsightWidget.children.length > 0) {

                    loadingIndicator.style.opacity = '0';

                    setTimeout(() => loadingIndicator.remove(), 300);

                    clearInterval(checkFormLoaded);

                }

            }, 500);

 

            // Clear interval after 10 seconds to avoid memory leak

            setTimeout(() => {

                clearInterval(checkFormLoaded);

                if (loadingIndicator.parentNode) {

                    loadingIndicator.remove();

                }

            }, 10000);

        }

 

        // Add styles for loading indicator

        if (!document.getElementById('form-loading-styles')) {

            const style = document.createElement('style');

            style.id = 'form-loading-styles';

            style.textContent = `

                .form-loading {

                    position: absolute;

                    top: 0;

                    left: 0;

                    right: 0;

                    bottom: 0;

                    display: flex;

                    flex-direction: column;

                    align-items: center;

                    justify-content: center;

                    gap: 1rem;

                    background: rgba(255, 255, 255, 0.9);

                    backdrop-filter: blur(10px);

                    z-index: 10;

                    transition: opacity 0.3s ease;

                }

 

                .loading-spinner {

                    width: 48px;

                    height: 48px;

                    border: 4px solid rgba(0, 216, 132, 0.1);

                    border-top-color: #00d884;

                    border-radius: 50%;

                    animation: spin 1s linear infinite;

                }

 

                @keyframes spin {

                    to { transform: rotate(360deg); }

                }

 

                .form-loading p {

                    color: #6b7280;

                    font-size: 0.875rem;

                }

            `;

            document.head.appendChild(style);

        }

    }

 

    // ========================================

    // CONTACT CARDS INTERACTION

    // ========================================

    initContactCards() {

        const contactCards = document.querySelectorAll('.contact-card');

 

        contactCards.forEach(card => {

            // Add ripple effect on click

            card.addEventListener('click', (e) => {

                const ripple = document.createElement('div');

                ripple.className = 'ripple';

 

                const rect = card.getBoundingClientRect();

                const x = e.clientX - rect.left;

                const y = e.clientY - rect.top;

 

                ripple.style.left = x + 'px';

                ripple.style.top = y + 'px';

 

                card.appendChild(ripple);

 

                setTimeout(() => ripple.remove(), 600);

            });

 

            // Add tilt effect on mouse move

            card.addEventListener('mousemove', (e) => {

                const rect = card.getBoundingClientRect();

                const x = e.clientX - rect.left;

                const y = e.clientY - rect.top;

 

                const centerX = rect.width / 2;

                const centerY = rect.height / 2;

 

                const rotateX = (y - centerY) / 20;

                const rotateY = (centerX - x) / 20;

 

                card.style.transform = `

                    translateY(-12px)

                    rotateX(${rotateX}deg)

                    rotateY(${rotateY}deg)

                `;

            });

 

            card.addEventListener('mouseleave', () => {

                card.style.transform = '';

            });

        });

 

        // Add ripple styles

        if (!document.getElementById('ripple-styles')) {

            const style = document.createElement('style');

            style.id = 'ripple-styles';

            style.textContent = `

                .contact-card {

                    position: relative;

                    overflow: hidden;

                    transition: transform 0.3s ease;

                }

 

                .ripple {

                    position: absolute;

                    width: 100px;

                    height: 100px;

                    background: radial-gradient(circle, rgba(0, 216, 132, 0.4) 0%, transparent 70%);

                    border-radius: 50%;

                    transform: translate(-50%, -50%) scale(0);

                    animation: rippleEffect 0.6s ease-out;

                    pointer-events: none;

                }

 

                @keyframes rippleEffect {

                    to {

                        transform: translate(-50%, -50%) scale(4);

                        opacity: 0;

                    }

                }

            `;

            document.head.appendChild(style);

        }

    }

 

    // ========================================

    // MAP INTERACTION

    // ========================================

    initMapInteraction() {

        const mapPlaceholder = document.querySelector('.map-placeholder');

 

        if (mapPlaceholder) {

            // Add hover effect

            mapPlaceholder.addEventListener('mouseenter', () => {

                mapPlaceholder.style.transform = 'scale(1.02)';

                mapPlaceholder.style.transition = 'transform 0.3s ease';

            });

 

            mapPlaceholder.addEventListener('mouseleave', () => {

                mapPlaceholder.style.transform = 'scale(1)';

            });

        }

 

        // Enhance detail cards with hover sound effect (visual only)

        const detailCards = document.querySelectorAll('.detail-card');

        detailCards.forEach((card, index) => {

            card.style.transitionDelay = `${index * 50}ms`;

        });

    }

}

 

// ========================================

// UTILITY FUNCTIONS

// ========================================

 

/**

 * Debounce function to limit function calls

 */

function debounce(func, wait = 250) {

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

 

/**

 * Check if element is in viewport

 */

function isInViewport(element) {

    const rect = element.getBoundingClientRect();

    return (

        rect.top >= 0 &&

        rect.left >= 0 &&

        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&

        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );

}

 

/**

 * Add entrance animations to elements

 */

function animateOnScroll() {

    const elements = document.querySelectorAll('[data-animate]');

 

    elements.forEach(element => {

        if (isInViewport(element)) {

            element.classList.add('animate-in');

        }

    });

}

 

// ========================================

// ADDITIONAL FEATURES

// ========================================

 

/**

 * Track scroll depth for analytics

 */

class ScrollTracker {

    constructor() {

        this.milestones = [25, 50, 75, 100];

        this.triggered = new Set();

        this.init();

    }

 

    init() {

        window.addEventListener('scroll', debounce(() => {

            const scrollPercent = this.getScrollPercent();

            this.checkMilestones(scrollPercent);

        }, 100));

    }

 

    getScrollPercent() {

        const windowHeight = window.innerHeight;

        const documentHeight = document.documentElement.scrollHeight - windowHeight;

        const scrollTop = window.pageYOffset;

        return (scrollTop / documentHeight) * 100;

    }

 

    checkMilestones(scrollPercent) {

        this.milestones.forEach(milestone => {

            if (scrollPercent >= milestone && !this.triggered.has(milestone)) {

                this.triggered.add(milestone);

                console.log(`📊 User scrolled ${milestone}% of the page`);

                // You can send analytics here

            }

        });

    }

}

 

/**

 * Lazy load images and widgets

 */

class LazyLoader {

    constructor() {

        this.init();

    }

 

    init() {

        if ('IntersectionObserver' in window) {

            this.observeImages();

        } else {

            this.loadAllImages();

        }

    }

 

    observeImages() {

        const imageObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    this.loadImage(entry.target);

                    imageObserver.unobserve(entry.target);

                }

            });

        });

 

        document.querySelectorAll('img[data-src]').forEach(img => {

            imageObserver.observe(img);

        });

    }

 

    loadImage(img) {

        img.src = img.dataset.src;

        img.removeAttribute('data-src');

    }

 

    loadAllImages() {

        document.querySelectorAll('img[data-src]').forEach(img => {

            this.loadImage(img);

        });

    }

}

 

/**

 * Phone number click tracking

 */

function initPhoneTracking() {

    document.querySelectorAll('a[href^="tel:"]').forEach(link => {

        link.addEventListener('click', (e) => {

            const phoneNumber = link.href.replace('tel:', '');

            console.log('📞 Phone link clicked:', phoneNumber);

            // You can send analytics here

        });

    });

}

 

/**

 * Email click tracking

 */

function initEmailTracking() {

    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {

        link.addEventListener('click', (e) => {

            const email = link.href.replace('mailto:', '');

            console.log('📧 Email link clicked:', email);

            // You can send analytics here

        });

    });

}

 

/**

 * Emergency button tracking

 */

function initEmergencyTracking() {

    const emergencyLinks = document.querySelectorAll('.emergency-link');

    emergencyLinks.forEach(link => {

        link.addEventListener('click', () => {

            console.log('🚨 Emergency link clicked');

            // You can send analytics here

        });

    });

}

 

// ========================================

// PERFORMANCE OPTIMIZATION

// ========================================

 

/**

 * Preload critical resources

 */

function preloadCriticalResources() {

    // Preload hero images if any

    const heroImages = document.querySelectorAll('.hero-section img');

    heroImages.forEach(img => {

        const preloadLink = document.createElement('link');

        preloadLink.rel = 'preload';

        preloadLink.as = 'image';

        preloadLink.href = img.src;

        document.head.appendChild(preloadLink);

    });

}

 

/**

 * Optimize Elfsight widget loading

 */

function optimizeWidgetLoading() {

    // Delay widget initialization until user scrolls near them

    const widgets = document.querySelectorAll('[data-elfsight-app-lazy]');

 

    if (widgets.length > 0 && 'IntersectionObserver' in window) {

        const widgetObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    // Widget will auto-initialize when visible

                    widgetObserver.unobserve(entry.target);

                }

            });

        }, {

            rootMargin: '200px' // Start loading 200px before entering viewport

        });

 

        widgets.forEach(widget => widgetObserver.observe(widget));

    }

}

 

// ========================================

// INITIALIZE EVERYTHING

// ========================================

 

// Initialize the main app

const app = new ContactApp();

 

// Initialize additional features

document.addEventListener('DOMContentLoaded', () => {

    new ScrollTracker();

    new LazyLoader();

 

    initPhoneTracking();

    initEmailTracking();

    initEmergencyTracking();

 

    preloadCriticalResources();

    optimizeWidgetLoading();

});

 

// Handle window resize with debounce

window.addEventListener('resize', debounce(() => {

    console.log('🔄 Window resized');

    // Handle responsive adjustments here if needed

}, 250));

 

// Log page visibility changes

document.addEventListener('visibilitychange', () => {

    if (document.hidden) {

        console.log('👋 User left the page');

    } else {

        console.log('👀 User returned to the page');

    }

});

 

// Export for potential use in other scripts

if (typeof module !== 'undefined' && module.exports) {

    module.exports = { ContactApp, ScrollTracker, LazyLoader };

}

 

console.log('🎉 Contact page JavaScript fully loaded!');
