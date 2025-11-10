/* ==========================================================================
   ABOUT PAGE - JAVASCRIPT
   Holistic Psychological Services
   ========================================================================== */

'use strict';

/* ==========================================================================
   ABOUT PAGE 
   ========================================================================== */
class AboutPage {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Initialize interactive elements
        this.initInteractiveElements();
        
        // Initialize smooth scrolling
        this.initSmoothScroll();
        
        // Initialize counter animations
        this.initCounterAnimations();
        
        // Initialize timeline interactions
        this.initTimelineInteractions();
        
        console.log('About Page initialized successfully');
    }
    
    /* ===================================================================
       SCROLL ANIMATIONS
       =================================================================== */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all elements with data-animate attribute
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => observer.observe(el));
    }
    
    /* ===================================================================
       INTERACTIVE ELEMENTS
       =================================================================== */
    initInteractiveElements() {
        // Mission & Vision card interactions
        this.initMissionVisionCards();
        
        // Value card interactions
        this.initValueCards();
        
        // Founder card interactions
        this.initFounderCards();
        
        // Photo collage interactions
        this.initPhotoCollage();
    }
    
    initMissionVisionCards() {
        const mvCards = document.querySelectorAll('.mv-card');
        
        mvCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.mv-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(-5deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.mv-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }
    
    initValueCards() {
        const valueCards = document.querySelectorAll('.value-card');
        
        valueCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.value-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(-5deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.value-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }
    
    initFounderCards() {
        const founderCards = document.querySelectorAll('.founder-card');
        
        founderCards.forEach(card => {
            // Add parallax effect on mouse move
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                const image = card.querySelector('.founder-image');
                if (image) {
                    image.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const image = card.querySelector('.founder-image');
                if (image) {
                    image.style.transform = '';
                }
            });
            
            // Specialty tag interactions
            const specTags = card.querySelectorAll('.spec-tag');
            specTags.forEach(tag => {
                tag.addEventListener('mouseenter', () => {
                    tag.style.transform = 'translateY(-2px) scale(1.05)';
                });
                
                tag.addEventListener('mouseleave', () => {
                    tag.style.transform = '';
                });
            });
        });
    }
    
    initPhotoCollage() {
        const collageItems = document.querySelectorAll('.collage-item');
        
        collageItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const img = item.querySelector('.collage-image img');
                if (img) {
                    img.style.transform = 'scale(1.08) rotate(1deg)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const img = item.querySelector('.collage-image img');
                if (img) {
                    img.style.transform = '';
                }
            });
        });
    }
    
    /* ===================================================================
       SMOOTH SCROLL
       =================================================================== */
    initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's just "#"
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
    
    /* ===================================================================
       COUNTER ANIMATIONS
       =================================================================== */
    initCounterAnimations() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number, .stat-value');
                    
                    counters.forEach(counter => {
                        if (!counter.classList.contains('counted')) {
                            this.animateCounter(counter);
                            counter.classList.add('counted');
                        }
                    });
                }
            });
        }, observerOptions);
        
        // Observe hero stats
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            observer.observe(heroStats);
        }
        
        // Observe why choose stats
        const statsCards = document.querySelector('.stats-cards');
        if (statsCards) {
            observer.observe(statsCards);
        }
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const hasDot = text.includes('.');
        
        // Extract number
        let targetNumber;
        if (hasDot) {
            targetNumber = parseFloat(text.replace(/[^\d.]/g, ''));
        } else {
            targetNumber = parseInt(text.replace(/[^\d]/g, ''));
        }
        
        if (isNaN(targetNumber)) return;
        
        const duration = 2000;
        const steps = 60;
        const increment = targetNumber / steps;
        const stepDuration = duration / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            
            let display;
            if (hasDot) {
                display = current.toFixed(1);
            } else {
                display = Math.floor(current).toString();
            }
            
            if (hasPlus) display += '+';
            if (hasPercent) display += '%';
            
            element.textContent = display;
        }, stepDuration);
    }
    
    /* ===================================================================
       TIMELINE INTERACTIONS
       =================================================================== */
    initTimelineInteractions() {
        const timelineDots = document.querySelectorAll('.timeline-dot');
        
        timelineDots.forEach(dot => {
            dot.addEventListener('mouseenter', () => {
                const dotInner = dot.querySelector('.dot-inner');
                if (dotInner && !dot.classList.contains('active')) {
                    dotInner.style.transform = 'scale(1.3)';
                }
            });
            
            dot.addEventListener('mouseleave', () => {
                const dotInner = dot.querySelector('.dot-inner');
                if (dotInner && !dot.classList.contains('active')) {
                    dotInner.style.transform = '';
                }
            });
        });
        
        // Animate timeline on scroll
        this.initTimelineAnimation();
    }
    
    initTimelineAnimation() {
        const timeline = document.querySelector('.story-timeline');
        if (!timeline) return;
        
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const dots = entry.target.querySelectorAll('.timeline-dot');
                    
                    dots.forEach((dot, index) => {
                        setTimeout(() => {
                            dot.style.opacity = '0';
                            dot.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                dot.style.transition = 'all 0.5s ease';
                                dot.style.opacity = '1';
                                dot.style.transform = 'translateY(0)';
                            }, 50);
                        }, index * 200);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        observer.observe(timeline);
    }
}

/* ==========================================================================
   PARALLAX EFFECTS
   ========================================================================== */
class ParallaxEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Add subtle parallax to hero background
        this.initHeroParallax();
        
        // Add parallax to section elements
        this.initSectionParallax();
    }
    
    initHeroParallax() {
        const hero = document.querySelector('.about-hero');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const pattern = hero.querySelector('.hero-pattern');
                if (pattern) {
                    pattern.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
            }
        });
    }
    
    initSectionParallax() {
        const sections = document.querySelectorAll('.mission-vision-section, .our-story-section, .values-section');
        
        sections.forEach(section => {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrolled > sectionTop - window.innerHeight && 
                    scrolled < sectionTop + sectionHeight) {
                    
                    const offset = (scrolled - sectionTop) * 0.05;
                    
                    const cards = section.querySelectorAll('.mv-card, .value-card');
                    cards.forEach((card, index) => {
                        const direction = index % 2 === 0 ? 1 : -1;
                        card.style.transform = `translateY(${offset * direction}px)`;
                    });
                }
            });
        });
    }
}

/* ==========================================================================
   IMAGE LAZY LOADING
   ========================================================================== */
class ImageLazyLoad {
    constructor() {
        this.init();
    }
    
    init() {
        const images = document.querySelectorAll('img');
        
        const observerOptions = {
            threshold: 0,
            rootMargin: '50px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, observerOptions);
        
        images.forEach(img => {
            if (img.loading !== 'eager') {
                observer.observe(img);
            }
        });
    }
}

/* ==========================================================================
   TESTIMONIAL ROTATOR (for future expansion)
   ========================================================================== */
class TestimonialRotator {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        
        if (this.testimonials.length > 1) {
            this.init();
        }
    }
    
    init() {
        // Hide all except first
        this.testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
        
        this.startAutoplay();
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, 8000);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    next() {
        // Fade out current
        this.testimonials[this.currentIndex].style.opacity = '0';
        
        setTimeout(() => {
            this.testimonials[this.currentIndex].style.display = 'none';
            
            // Move to next
            this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
            
            // Fade in next
            this.testimonials[this.currentIndex].style.display = 'block';
            this.testimonials[this.currentIndex].style.opacity = '0';
            
            setTimeout(() => {
                this.testimonials[this.currentIndex].style.transition = 'opacity 0.5s ease';
                this.testimonials[this.currentIndex].style.opacity = '1';
            }, 50);
        }, 500);
    }
    
    destroy() {
        this.stopAutoplay();
    }
}

/* ==========================================================================
   PERFORMANCE OPTIMIZATION
   ========================================================================== */
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Debounce scroll events
        this.debounceScrollEvents();
        
        // Throttle resize events
        this.throttleResizeEvents();
        
        // Reduce motion for users who prefer it
        this.respectMotionPreferences();
    }
    
    debounceScrollEvents() {
        let scrollTimeout;
        const scrollElements = document.querySelectorAll('[data-scroll]');
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                scrollElements.forEach(el => {
                    const callback = el.dataset.scrollCallback;
                    if (typeof window[callback] === 'function') {
                        window[callback](el);
                    }
                });
            }, 100);
        });
    }
    
    throttleResizeEvents() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(() => {
                    resizeTimeout = null;
                    
                    // Trigger custom resize event
                    window.dispatchEvent(new Event('optimizedResize'));
                }, 250);
            }
        });
    }
    
    respectMotionPreferences() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
            
            // Disable animations
            const style = document.createElement('style');
            style.textContent = `
                .reduce-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */
const AboutUtils = {
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
    },
    
    // Get scroll percentage
    getScrollPercentage: () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return (scrollTop / scrollHeight) * 100;
    }
};

/* ==========================================================================
   EASTER EGGS (Optional Fun Features)
   ========================================================================== */
class EasterEggs {
    constructor() {
        this.init();
    }
    
    init() {
        // Add subtle interaction on logo clicks
        this.initLogoInteraction();
        
        // Add celebration animation on reaching end of page
        this.initEndOfPageCelebration();
    }
    
    initLogoInteraction() {
        const logos = document.querySelectorAll('.footer-logo-wrapper, .mobile-logo');
        let clickCount = 0;
        
        logos.forEach(logo => {
            logo.addEventListener('click', () => {
                clickCount++;
                
                if (clickCount === 5) {
                    this.showHiddenMessage();
                    clickCount = 0;
                }
            });
        });
    }
    
    showHiddenMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 2rem 3rem;
            background: linear-gradient(135deg, #00d884 0%, #0ea5e9 100%);
            color: white;
            border-radius: 1rem;
            font-size: 1.25rem;
            font-weight: 600;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 99999;
            animation: fadeIn 0.3s ease;
        `;
        message.textContent = '🎉 You found our secret! Thanks for exploring! 🎉';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
    
    initEndOfPageCelebration() {
        let celebrated = false;
        
        window.addEventListener('scroll', () => {
            const scrollPercentage = AboutUtils.getScrollPercentage();
            
            if (scrollPercentage >= 95 && !celebrated) {
                this.celebrate();
                celebrated = true;
            } else if (scrollPercentage < 90) {
                celebrated = false;
            }
        });
    }
    
    celebrate() {
        // Add confetti effect (simple version)
        for (let i = 0; i < 30; i++) {
            this.createConfetti();
        }
    }
    
    createConfetti() {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}%;
            width: 10px;
            height: 10px;
            background: ${['#00d884', '#0ea5e9', '#fbbf24', '#ef4444'][Math.floor(Math.random() * 4)]};
            opacity: 0.8;
            z-index: 99999;
            pointer-events: none;
            animation: confettiFall ${2 + Math.random() * 2}s linear;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

/* ==========================================================================
   INITIALIZE ON DOM READY
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main about page functionality
    window.aboutPage = new AboutPage();
    
    // Initialize parallax effects
    window.parallaxEffects = new ParallaxEffects();
    
    // Initialize image lazy loading
    window.imageLazyLoad = new ImageLazyLoad();
    
    // Initialize testimonial rotator
    window.testimonialRotator = new TestimonialRotator();
    
    // Initialize performance optimizations
    window.performanceOptimizer = new PerformanceOptimizer();
    
    // Initialize easter eggs (optional - can be removed)
    window.easterEggs = new EasterEggs();
    
    // Add confetti animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('About Page fully loaded and ready!');
});

/* ==========================================================================
   HANDLE PAGE VISIBILITY
   ========================================================================== */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        if (window.testimonialRotator) {
            window.testimonialRotator.stopAutoplay();
        }
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when page is visible
        if (window.testimonialRotator) {
            window.testimonialRotator.startAutoplay();
        }
        console.log('Page visible - resuming animations');
    }
});

/* ==========================================================================
   CLEANUP ON PAGE UNLOAD
   ========================================================================== */
window.addEventListener('beforeunload', () => {
    // Clean up any intervals or event listeners
    if (window.testimonialRotator) {
        window.testimonialRotator.destroy();
    }
    
    console.log('About Page cleanup complete');
});

/* ==========================================================================
   EXPORT FOR MODULE SYSTEMS (if needed)
   ========================================================================== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AboutPage,
        ParallaxEffects,
        ImageLazyLoad,
        TestimonialRotator,
        PerformanceOptimizer,
        AboutUtils
    };
}
