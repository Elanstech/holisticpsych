/* ==========================================================================
   HOLISTIC PSYCHOLOGICAL SERVICES - REDESIGNED JAVASCRIPT
   Modern, Sleek, Minimalistic Interactions
   ========================================================================== */

/* ==========================================================================
   1. Global Variables & Configuration
   ========================================================================== */

// Configuration object
const CONFIG = {
    animations: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 100
    },
    scroll: {
        offset: 100,
        threshold: 0.1
    },
    mobile: {
        breakpoint: 768
    }
};

// Global state
const STATE = {
    isScrolled: false,
    isMobileMenuOpen: false,
    currentSection: 'home',
    observers: new Map(),
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/* ==========================================================================
   2. Utility Functions
   ========================================================================== */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
const isMobile = () => window.innerWidth < CONFIG.mobile.breakpoint;

/**
 * Get element's offset top
 * @param {Element} element - Target element
 * @returns {number} Offset top value
 */
const getOffsetTop = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top + window.pageYOffset;
};

/**
 * Smooth scroll to element
 * @param {Element} target - Target element
 */
const smoothScrollTo = (target) => {
    const targetPosition = getOffsetTop(target) - 80;
    
    if (STATE.isReducedMotion) {
        window.scrollTo(0, targetPosition);
        return;
    }
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
};

/* ==========================================================================
   3. Animation Helpers
   ========================================================================== */

/**
 * Add animation class with delay
 * @param {Element} element - Target element
 * @param {string} className - Animation class name
 * @param {number} delay - Delay in milliseconds
 */
const animateElement = (element, className = 'fade-in', delay = 0) => {
    if (STATE.isReducedMotion) {
        element.classList.add('visible');
        return;
    }
    
    setTimeout(() => {
        element.classList.add(className);
        element.classList.add('visible');
    }, delay);
};

/**
 * Stagger animations for multiple elements
 * @param {NodeList} elements - Elements to animate
 * @param {string} className - Animation class name
 * @param {number} staggerDelay - Delay between elements
 */
const staggerAnimations = (elements, className = 'fade-in', staggerDelay = CONFIG.animations.stagger) => {
    elements.forEach((element, index) => {
        const delay = STATE.isReducedMotion ? 0 : index * staggerDelay;
        animateElement(element, className, delay);
    });
};

/* ==========================================================================
   4. Header & Navigation
   ========================================================================== */

/**
 * Initialize header functionality
 */
const initializeHeader = () => {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!header) return;
    
    // Handle scroll effects
    const handleScroll = throttle(() => {
        const scrolled = window.scrollY > 50;
        
        if (scrolled !== STATE.isScrolled) {
            STATE.isScrolled = scrolled;
            header.classList.toggle('scrolled', scrolled);
        }
        
        updateActiveNavigation();
    }, 16);
    
    // Handle mobile menu toggle
    const toggleMobileMenu = () => {
        STATE.isMobileMenuOpen = !STATE.isMobileMenuOpen;
        navMenu?.classList.toggle('active', STATE.isMobileMenuOpen);
        navToggle?.classList.toggle('active', STATE.isMobileMenuOpen);
        document.body.classList.toggle('menu-open', STATE.isMobileMenuOpen);
        
        // Update ARIA attributes
        navToggle?.setAttribute('aria-expanded', STATE.isMobileMenuOpen.toString());
    };
    
    // Close mobile menu
    const closeMobileMenu = () => {
        if (STATE.isMobileMenuOpen) {
            STATE.isMobileMenuOpen = false;
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
            document.body.classList.remove('menu-open');
            navToggle?.setAttribute('aria-expanded', 'false');
        }
    };
    
    // Handle navigation links
    const handleNavClick = (event, link) => {
        event.preventDefault();
        closeMobileMenu();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            smoothScrollTo(targetSection);
            updateActiveNavLink(link);
        }
    };
    
    // Update active navigation link
    const updateActiveNavLink = (activeLink) => {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink?.classList.add('active');
    };
    
    // Update navigation based on scroll position
    const updateActiveNavigation = () => {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = getOffsetTop(section) - CONFIG.scroll.offset;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.pageYOffset;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection && currentSection !== STATE.currentSection) {
            STATE.currentSection = currentSection;
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
            updateActiveNavLink(activeLink);
        }
    };
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    navToggle?.addEventListener('click', toggleMobileMenu);
    
    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavClick(e, link));
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (STATE.isMobileMenuOpen && 
            !navMenu?.contains(event.target) && 
            !navToggle?.contains(event.target)) {
            closeMobileMenu();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && STATE.isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Handle resize
    window.addEventListener('resize', debounce(() => {
        if (!isMobile() && STATE.isMobileMenuOpen) {
            closeMobileMenu();
        }
    }, 250));
    
    console.log('✅ Header initialized');
};

/* ==========================================================================
   5. Hero Section
   ========================================================================== */

/**
 * Initialize hero section
 */
const initializeHero = () => {
    const heroSection = document.querySelector('.hero');
    const logoContainer = document.querySelector('.hero-logo-container');
    const heroContent = document.querySelector('.hero-content');
    
    if (!heroSection) return;
    
    // Enhanced logo interactions
    if (logoContainer) {
        let isHovered = false;
        
        const handleMouseEnter = () => {
            if (!isHovered && !STATE.isReducedMotion) {
                isHovered = true;
                logoContainer.style.transform = 'scale(1.05) rotate(2deg)';
            }
        };
        
        const handleMouseLeave = () => {
            if (isHovered) {
                isHovered = false;
                logoContainer.style.transform = '';
            }
        };
        
        logoContainer.addEventListener('mouseenter', handleMouseEnter);
        logoContainer.addEventListener('mouseleave', handleMouseLeave);
        
        // Add subtle parallax effect
        const handleScroll = throttle(() => {
            if (!STATE.isReducedMotion) {
                const scrolled = window.pageYOffset;
                const parallaxValue = scrolled * 0.2;
                logoContainer.style.transform = `translateY(${parallaxValue}px)`;
            }
        }, 16);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    // Animate hero content on load
    if (heroContent && !STATE.isReducedMotion) {
        const elements = heroContent.querySelectorAll('.hero-title, .hero-subtitle, .hero-location, .hero-actions > *');
        staggerAnimations(elements, 'fade-in', 200);
    }
    
    console.log('✅ Hero section initialized');
};

/* ==========================================================================
   6. Scroll Animations
   ========================================================================== */

/**
 * Initialize scroll animations using Intersection Observer
 */
const initializeScrollAnimations = () => {
    // Configuration for different animation types
    const observerConfigs = [
        {
            selector: '.fade-in',
            className: 'visible',
            options: {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        },
        {
            selector: '.slide-left',
            className: 'visible',
            options: {
                threshold: 0.2,
                rootMargin: '0px 0px -30px 0px'
            }
        },
        {
            selector: '.slide-right',
            className: 'visible',
            options: {
                threshold: 0.2,
                rootMargin: '0px 0px -30px 0px'
            }
        }
    ];
    
    // Create observers
    observerConfigs.forEach(config => {
        const elements = document.querySelectorAll(config.selector);
        
        if (elements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    if (STATE.isReducedMotion) {
                        entry.target.classList.add(config.className);
                    } else {
                        // Add staggered delay for multiple elements
                        setTimeout(() => {
                            entry.target.classList.add(config.className);
                        }, index * 100);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, config.options);
        
        elements.forEach(element => {
            element.classList.add(config.selector.replace('.', ''));
            observer.observe(element);
        });
        
        STATE.observers.set(config.selector, observer);
    });
    
    // Special animations for specific sections
    initializeSectionAnimations();
    
    console.log('✅ Scroll animations initialized');
};

/**
 * Initialize specific section animations
 */
const initializeSectionAnimations = () => {
    // About section animations
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const valueItems = entry.target.querySelectorAll('.value-item');
                    const leaderProfiles = entry.target.querySelectorAll('.leader-profile');
                    
                    staggerAnimations(valueItems, 'fade-in', 150);
                    setTimeout(() => {
                        staggerAnimations(leaderProfiles, 'fade-in', 100);
                    }, 300);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(aboutSection);
    }
    
    // Services section animations
    const servicesSection = document.querySelector('.services');
    if (servicesSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const serviceCards = entry.target.querySelectorAll('.service-card');
                    staggerAnimations(serviceCards, 'fade-in', 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(servicesSection);
    }
    
    // Team section animations
    const teamSection = document.querySelector('.team');
    if (teamSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const teamCards = entry.target.querySelectorAll('.team-card');
                    staggerAnimations(teamCards, 'fade-in', 250);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(teamSection);
    }
    
    // Reviews section animations
    const reviewsSection = document.querySelector('.reviews');
    if (reviewsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const reviewCards = entry.target.querySelectorAll('.review-card');
                    const statItems = entry.target.querySelectorAll('.review-stats .stat-item');
                    
                    staggerAnimations(reviewCards, 'fade-in', 200);
                    setTimeout(() => {
                        staggerAnimations(statItems, 'fade-in', 150);
                        // Animate stat numbers
                        animateStatNumbers(statItems);
                    }, 600);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(reviewsSection);
    }
};

/**
 * Animate stat numbers with counting effect
 * @param {NodeList} statItems - Stat items to animate
 */
const animateStatNumbers = (statItems) => {
    if (STATE.isReducedMotion) return;
    
    statItems.forEach(item => {
        const numberElement = item.querySelector('.stat-number');
        if (!numberElement) return;
        
        const finalValue = numberElement.textContent;
        const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
        
        if (isNaN(numericValue)) return;
        
        let currentValue = 0;
        const increment = numericValue / 30; // 30 steps
        const suffix = finalValue.replace(numericValue.toString(), '');
        
        const updateCounter = () => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                numberElement.textContent = finalValue;
                return;
            }
            
            const displayValue = Math.floor(currentValue);
            numberElement.textContent = displayValue + suffix;
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    });
};

/* ==========================================================================
   7. Form Handling
   ========================================================================== */

/**
 * Initialize contact form
 */
const initializeContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    const submitButton = form.querySelector('.btn-submit');
    
    // Form validation
    const validateField = (field) => {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        removeFieldError(field);
        
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
        
        // Phone validation (optional but if provided, should be valid)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (cleanPhone.length > 0 && !phoneRegex.test(cleanPhone)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    };
    
    // Show field error
    const showFieldError = (field, message) => {
        const formGroup = field.closest('.form-group');
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
            animation: fadeInUp 0.3s ease;
        `;
        
        formGroup.appendChild(errorElement);
        field.style.borderColor = '#ef4444';
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement.id = `error-${field.name}`);
    };
    
    // Remove field error
    const removeFieldError = (field) => {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.style.borderColor = '';
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
    };
    
    // Validate entire form
    const validateForm = () => {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    };
    
    // Show form message
    const showFormMessage = (message, type = 'success') => {
        // Remove existing message
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        messageElement.textContent = message;
        
        const bgColor = type === 'success' ? 'var(--primary-teal)' : '#ef4444';
        messageElement.style.cssText = `
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            margin-bottom: 1.5rem;
            text-align: center;
            font-weight: 500;
            animation: fadeInUp 0.5s ease;
            box-shadow: var(--shadow-md);
        `;
        
        form.insertBefore(messageElement, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }
        }, 5000);
        
        // Scroll to message
        messageElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    };
    
    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            showFormMessage('Please correct the errors above.', 'error');
            return;
        }
        
        // Show loading state
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = `
            <span style="opacity: 0.8;">Sending...</span>
            <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        `;
        submitButton.disabled = true;
        
        // Add CSS for loading animation if not exists
        if (!document.querySelector('#loading-animation')) {
            const style = document.createElement('style');
            style.id = 'loading-animation';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showFormMessage(
                'Thank you for your message! We will contact you within 24 hours to discuss your needs and schedule a consultation.',
                'success'
            );
            
            // Reset form
            form.reset();
            
            // Clear any remaining errors
            inputs.forEach(input => removeFieldError(input));
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage(
                'We apologize, but there was an error sending your message. Please try again or call us directly at (646) 971-7325.',
                'error'
            );
        } finally {
            // Restore button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    };
    
    // Event listeners
    form.addEventListener('submit', handleSubmit);
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => removeFieldError(input));
        
        // Enhanced focus effects
        input.addEventListener('focus', (e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(64, 224, 208, 0.2)';
        });
        
        input.addEventListener('blur', (e) => {
            e.target.style.transform = '';
            e.target.style.boxShadow = '';
        });
    });
    
    console.log('✅ Contact form initialized');
};

/* ==========================================================================
   8. Enhanced Interactions
   ========================================================================== */

/**
 * Initialize enhanced card interactions
 */
const initializeCardInteractions = () => {
    // Service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        let isHovered = false;
        
        const handleMouseEnter = () => {
            if (!isHovered && !STATE.isReducedMotion) {
                isHovered = true;
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
                
                const features = card.querySelectorAll('.service-features li');
                features.forEach((feature, index) => {
                    setTimeout(() => {
                        feature.style.transform = 'translateX(5px)';
                    }, index * 50);
                });
            }
        };
        
        const handleMouseLeave = () => {
            if (isHovered) {
                isHovered = false;
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = '';
                }
                
                const features = card.querySelectorAll('.service-features li');
                features.forEach(feature => {
                    feature.style.transform = '';
                });
            }
        };
        
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
    });
    
    // Team cards
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!STATE.isReducedMotion) {
                const badge = card.querySelector('.experience-badge');
                if (badge) {
                    badge.style.transform = 'scale(1.1)';
                }
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const badge = card.querySelector('.experience-badge');
            if (badge) {
                badge.style.transform = '';
            }
        });
    });
    
    // Review cards
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!STATE.isReducedMotion) {
                const initial = card.querySelector('.client-initial');
                if (initial) {
                    initial.style.transform = 'scale(1.1)';
                    initial.style.background = 'var(--gradient-primary)';
                }
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const initial = card.querySelector('.client-initial');
            if (initial) {
                initial.style.transform = '';
                initial.style.background = '';
            }
        });
    });
    
    console.log('✅ Card interactions initialized');
};

/**
 * Initialize button ripple effects
 */
const initializeButtonEffects = () => {
    const buttons = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary, .service-btn, .btn-submit, .btn-cta-primary, .btn-cta-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (STATE.isReducedMotion) return;
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 1.5;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: 0;
                height: 0;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            // Add ripple animation if not exists
            if (!document.querySelector('#ripple-animation')) {
                const style = document.createElement('style');
                style.id = 'ripple-animation';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            width: ${size}px;
                            height: ${size}px;
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });
    
    console.log('✅ Button effects initialized');
};

/* ==========================================================================
   9. Accessibility Enhancements
   ========================================================================== */

/**
 * Initialize accessibility features
 */
const initializeAccessibility = () => {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 8px;
        background: var(--primary-teal);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 9999;
        font-weight: 600;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '8px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if not exists
    const main = document.querySelector('main') || document.querySelector('.main');
    if (main && !main.id) {
        main.id = 'main';
    }
    
    // Improve focus management for mobile menu
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    if (navMenu && navToggle) {
        navToggle.setAttribute('aria-controls', 'navMenu');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-labelledby', 'navToggle');
    }
    
    // Add proper ARIA labels
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (!section.getAttribute('aria-label') && !section.querySelector('h1, h2, h3')) {
            section.setAttribute('aria-label', `Section ${index + 1}`);
        }
    });
    
    // Announce dynamic content changes
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
    
    // Store reference for other functions to use
    window.announceToScreenReader = (message) => {
        liveRegion.textContent = message;
    };
    
    console.log('✅ Accessibility features initialized');
};

/* ==========================================================================
   10. Performance Optimizations
   ========================================================================== */

/**
 * Initialize performance optimizations
 */
const initializePerformanceOptimizations = () => {
    // Lazy load images
    const images = document.querySelectorAll('img[src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add fade-in effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    const preloadCriticalResources = () => {
        const criticalImages = [
            'images/logo.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    };
    
    // Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate any layout-dependent features
            if (STATE.isMobileMenuOpen && !isMobile()) {
                const navMenu = document.getElementById('navMenu');
                const navToggle = document.getElementById('navToggle');
                
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
                STATE.isMobileMenuOpen = false;
            }
        }, 250);
    });
    
    // Initialize critical resource preloading
    preloadCriticalResources();
    
    console.log('✅ Performance optimizations initialized');
};

/* ==========================================================================
   11. Error Handling
   ========================================================================== */

/**
 * Initialize error handling
 */
const initializeErrorHandling = () => {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('JavaScript Error:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
        
        // You could send this to an error reporting service
        // reportError(event);
    });
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        
        // You could send this to an error reporting service
        // reportError(event);
    });
    
    console.log('✅ Error handling initialized');
};

/* ==========================================================================
   12. Main Initialization
   ========================================================================== */

/**
 * Initialize all functionality when DOM is loaded
 */
const initializeApp = () => {
    console.log('🚀 Initializing Holistic Psychological Services website...');
    
    // Core functionality
    initializeHeader();
    initializeHero();
    initializeScrollAnimations();
    initializeContactForm();
    
    // Enhanced interactions
    initializeCardInteractions();
    initializeButtonEffects();
    
    // Accessibility & Performance
    initializeAccessibility();
    initializePerformanceOptimizations();
    initializeErrorHandling();
    
    // Mark app as initialized
    document.body.classList.add('app-initialized');
    
    console.log('✅ Holistic Psychological Services website initialized successfully!');
};

/**
 * Cleanup function for when page unloads
 */
const cleanup = () => {
    // Clear all observers
    STATE.observers.forEach(observer => {
        observer.disconnect();
    });
    STATE.observers.clear();
    
    // Remove event listeners if needed
    // (Most will be automatically cleaned up)
    
    console.log('🧹 Cleanup completed');
};

/* ==========================================================================
   13. Event Listeners & Bootstrap
   ========================================================================== */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM already loaded
    initializeApp();
}

// Cleanup when page unloads
window.addEventListener('beforeunload', cleanup);

// Handle reduced motion preference changes
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
mediaQuery.addEventListener('change', (e) => {
    STATE.isReducedMotion = e.matches;
    console.log(`Reduced motion: ${STATE.isReducedMotion ? 'enabled' : 'disabled'}`);
});

// Export for potential external use
window.HolisticPsychServices = {
    STATE,
    CONFIG,
    utils: {
        debounce,
        throttle,
        isMobile,
        smoothScrollTo
    },
    animations: {
        animateElement,
        staggerAnimations
    }
};

/* ==========================================================================
   14. Development Helpers (Remove in production)
   ========================================================================== */

// Development mode helpers
if (process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    // Add development console commands
    window.dev = {
        state: () => console.log('Current State:', STATE),
        config: () => console.log('Configuration:', CONFIG),
        observers: () => console.log('Active Observers:', STATE.observers),
        toggleReducedMotion: () => {
            STATE.isReducedMotion = !STATE.isReducedMotion;
            console.log(`Reduced motion: ${STATE.isReducedMotion ? 'enabled' : 'disabled'}`);
        }
    };
    
    console.log('🔧 Development mode active. Use window.dev for debugging.');
}
