/* ========================================================================
   SERVICES PAGE - INTERACTIVE FUNCTIONALITY
   Holistic Psychological Services PLLC
   ======================================================================== */

'use strict';

class ServicesPage {
    constructor() {
        this.init();
    }

    init() {
        this.initHeader();
        this.initServiceNavigation();
        this.initSmoothScroll();
        this.initBackToTop();
        this.initScrollAnimations();
        this.initMobileMenu();
    }

    // =====================================================================
    // HEADER FUNCTIONALITY
    // =====================================================================
    initHeader() {
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // =====================================================================
    // SERVICE NAVIGATION & FILTERING
    // =====================================================================
    initServiceNavigation() {
        const navButtons = document.querySelectorAll('.service-nav-btn');
        const serviceCards = document.querySelectorAll('.service-detail-card');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetService = button.getAttribute('data-service');

                // Update active button
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter and animate cards
                this.filterServices(serviceCards, targetService);
            });
        });
    }

    filterServices(cards, category) {
        cards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');

            if (category === 'all' || cardCategory === category) {
                // Show card with animation
                card.classList.add('fade-out');
                
                setTimeout(() => {
                    card.classList.remove('hidden', 'fade-out');
                    card.classList.add('fade-in');
                    
                    setTimeout(() => {
                        card.classList.remove('fade-in');
                    }, 600);
                }, index * 100);
            } else {
                // Hide card
                card.classList.add('fade-out');
                setTimeout(() => {
                    card.classList.add('hidden');
                    card.classList.remove('fade-out');
                }, 400);
            }
        });
    }

    // =====================================================================
    // SMOOTH SCROLL
    // =====================================================================
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 120;
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

    // =====================================================================
    // BACK TO TOP BUTTON
    // =====================================================================
    initBackToTop() {
        const backToTopButton = document.getElementById('backToTop');

        if (!backToTopButton) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =====================================================================
    // SCROLL ANIMATIONS
    // =====================================================================
    initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe service cards
        const cards = document.querySelectorAll('.service-detail-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe feature items
        const features = document.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateY(20px)';
            feature.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
            observer.observe(feature);
        });

        // Observe process steps
        const steps = document.querySelectorAll('.process-step');
        steps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px)';
            step.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            observer.observe(step);
        });
    }

    // =====================================================================
    // MOBILE MENU
    // =====================================================================
    initMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const body = document.body;

        if (!menuToggle || !mobileNav) return;

        menuToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('active');
            
            if (isOpen) {
                mobileNav.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            } else {
                mobileNav.classList.add('active');
                menuToggle.classList.add('active');
                body.style.overflow = 'hidden';
            }
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
}

// =====================================================================
// PARALLAX EFFECT FOR CTA SECTION
// =====================================================================
function initParallax() {
    const ctaSection = document.querySelector('.services-cta-section');
    
    if (!ctaSection) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        const yPos = -(scrolled * parallaxSpeed);
        
        ctaSection.style.backgroundPosition = `center ${yPos}px`;
    });
}

// =====================================================================
// SERVICE CARD HOVER EFFECTS
// =====================================================================
function initHoverEffects() {
    const serviceCards = document.querySelectorAll('.service-detail-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// =====================================================================
// PROGRESS INDICATOR
// =====================================================================
function initProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #6d5da6, #8b7dc0);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// =====================================================================
// SERVICE NAVIGATION STICKY BEHAVIOR
// =====================================================================
function initStickyNav() {
    const servicesNav = document.querySelector('.services-navigation');
    const header = document.getElementById('header');
    
    if (!servicesNav || !header) return;

    let navOffset = servicesNav.offsetTop;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset >= navOffset - 80) {
            servicesNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            servicesNav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
}

// =====================================================================
// ACTIVE SECTION HIGHLIGHTING
// =====================================================================
function initActiveSectionHighlight() {
    const sections = document.querySelectorAll('.service-detail-card');
    const navButtons = document.querySelectorAll('.service-nav-btn');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('data-category');
            }
        });

        // Only update if not filtering
        const allButton = document.querySelector('[data-service="all"]');
        if (allButton && allButton.classList.contains('active')) {
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-service') === current) {
                    btn.classList.add('active');
                }
            });
        }
    });
}

// =====================================================================
// INITIALIZE ON PAGE LOAD
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main functionality
    new ServicesPage();
    
    // Initialize additional features
    initParallax();
    initHoverEffects();
    initProgressIndicator();
    initStickyNav();
    
    // Small delay for active section highlighting to avoid conflicts
    setTimeout(() => {
        initActiveSectionHighlight();
    }, 1000);

    // Log initialization
    console.log('Services page initialized successfully');
});

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

// Smooth scroll to element
function scrollToElement(elementId, offset = 120) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function for performance
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ServicesPage, scrollToElement, isInViewport, debounce };
}
