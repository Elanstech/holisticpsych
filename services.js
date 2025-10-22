// ========================================================================
// SERVICES PAGE - INTERACTIVE FUNCTIONALITY
// Smooth scrolling, active states, and animations
// ========================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ====================================================================
    // MOBILE MENU TOGGLE
    // ====================================================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }

    // ====================================================================
    // SERVICES NAVIGATION - SMOOTH SCROLLING
    // ====================================================================
    const serviceNavLinks = document.querySelectorAll('.service-nav-link');
    
    serviceNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            serviceNavLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate scroll position (accounting for sticky nav)
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const servicesNavHeight = document.querySelector('.services-navigation').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - servicesNavHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================================================
    // INTERSECTION OBSERVER - ACTIVE NAV ON SCROLL
    // ====================================================================
    const servicesSections = document.querySelectorAll('.service-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-150px 0px -40% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Update active nav link
                serviceNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        
                        // Scroll nav link into view if needed
                        link.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center'
                        });
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe all service sections
    servicesSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ====================================================================
    // STICKY NAVIGATION SCROLL EFFECT
    // ====================================================================
    const servicesNav = document.querySelector('.services-navigation');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 200) {
            servicesNav.classList.add('scrolled');
        } else {
            servicesNav.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // ====================================================================
    // ANIMATE SERVICE CARDS ON SCROLL
    // ====================================================================
    const serviceContents = document.querySelectorAll('.service-content');
    
    const cardObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, cardObserverOptions);
    
    serviceContents.forEach(card => {
        cardObserver.observe(card);
    });

    // ====================================================================
    // PROCESS STEPS ANIMATION
    // ====================================================================
    const processSteps = document.querySelectorAll('.process-step');
    
    const stepObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    });
    
    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-20px)';
        step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        stepObserver.observe(step);
    });

    // ====================================================================
    // FEATURE ITEMS STAGGER ANIMATION
    // ====================================================================
    const featureItems = document.querySelectorAll('.feature-item');
    
    const featureObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    });
    
    featureItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        featureObserver.observe(item);
    });

    // ====================================================================
    // SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // ====================================================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const servicesNavHeight = document.querySelector('.services-navigation')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navHeight - servicesNavHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================================================
    // BACK TO TOP FUNCTIONALITY (if exists)
    // ====================================================================
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ====================================================================
    // LAZY LOAD OPTIMIZATION
    // ====================================================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ====================================================================
    // PREVENT LAYOUT SHIFT
    // ====================================================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // ====================================================================
    // ACCESSIBILITY - FOCUS TRAP FOR MODALS (if any)
    // ====================================================================
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function trapFocus(element) {
        const focusables = element.querySelectorAll(focusableElements);
        const firstFocusable = focusables[0];
        const lastFocusable = focusables[focusables.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                element.classList.remove('active');
            }
        });
    }

    // ====================================================================
    // PERFORMANCE OPTIMIZATION - DEBOUNCE SCROLL
    // ====================================================================
    function debounce(func, wait = 10, immediate = true) {
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
    
    // Apply debounce to scroll-heavy functions if needed
    const debouncedScroll = debounce(function() {
        // Any heavy scroll operations can go here
    }, 20);
    
    window.addEventListener('scroll', debouncedScroll);

    // ====================================================================
    // CONSOLE MESSAGE
    // ====================================================================
    console.log('🧠 Services page loaded successfully');
    console.log('💜 Holistic Psychological Services PLLC');
    
});

// ========================================================================
// UTILITY FUNCTIONS
// ========================================================================

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

// Get scroll percentage
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (scrollTop / scrollHeight) * 100;
}
