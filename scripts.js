/* ========================================
   HOLISTIC PSYCHOLOGICAL SERVICES - JS
   Simple & Clean Functionality
   ======================================== */

/* ========================================
   GLOBAL VARIABLES
   ======================================== */
let currentHeroSlide = 0;
let currentServiceSlide = 0;
let heroSlideInterval;

/* ========================================
   DOM READY INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeHeroSlideshow();
    initializeServicesCarousel();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeMobileMenu();
});

/* ========================================
   HEADER FUNCTIONALITY
   ======================================== */
function initializeHeader() {
    const header = document.getElementById('header');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
        });
        
        // Close mobile menu when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('open');
            }
        });
    }
}

/* ========================================
   HERO SLIDESHOW
   ======================================== */
function initializeHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-controls .indicator');
    
    if (slides.length === 0) return;
    
    // Initialize first slide
    showHeroSlide(0);
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showHeroSlide(index);
            resetHeroAutoplay();
        });
    });
    
    // Start autoplay
    startHeroAutoplay();
    
    // Pause autoplay on hover
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', pauseHeroAutoplay);
        hero.addEventListener('mouseleave', startHeroAutoplay);
    }
}

function showHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-controls .indicator');
    
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Remove active from all indicators
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentHeroSlide = index;
    }
}

function nextHeroSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    const nextIndex = (currentHeroSlide + 1) % slides.length;
    showHeroSlide(nextIndex);
}

function startHeroAutoplay() {
    heroSlideInterval = setInterval(nextHeroSlide, 7000); // 7 seconds for 3 slides
}

function pauseHeroAutoplay() {
    if (heroSlideInterval) {
        clearInterval(heroSlideInterval);
        heroSlideInterval = null;
    }
}

function resetHeroAutoplay() {
    pauseHeroAutoplay();
    startHeroAutoplay();
}

/* ========================================
   SERVICES CAROUSEL
   ======================================== */
function initializeServicesCarousel() {
    const track = document.getElementById('servicesTrack');
    const cards = document.querySelectorAll('.service-card');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.getElementById('prevService');
    const nextBtn = document.getElementById('nextService');
    
    if (!track || cards.length === 0) return;
    
    // Initialize first slide
    showServiceSlide(0);
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showServiceSlide(index);
        });
    });
    
    // Add click handlers to navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const prevIndex = currentServiceSlide === 0 ? cards.length - 1 : currentServiceSlide - 1;
            showServiceSlide(prevIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const nextIndex = (currentServiceSlide + 1) % cards.length;
            showServiceSlide(nextIndex);
        });
    }
    
    // Touch/swipe support for mobile
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });
    
    track.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', function() {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next slide
                const nextIndex = (currentServiceSlide + 1) % cards.length;
                showServiceSlide(nextIndex);
            } else {
                // Swipe right - previous slide
                const prevIndex = currentServiceSlide === 0 ? cards.length - 1 : currentServiceSlide - 1;
                showServiceSlide(prevIndex);
            }
        }
        
        isDragging = false;
    }, { passive: true });
}

function showServiceSlide(index) {
    const track = document.getElementById('servicesTrack');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!track) return;
    
    // Move track
    const translateX = -index * 100;
    track.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    currentServiceSlide = index;
}

/* ========================================
   CONTACT FORM
   ======================================== */
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(form)) {
            submitForm(form);
        }
    });
    
    // Add input validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(input);
        });
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
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
    
    setFieldError(field, isValid ? '' : errorMessage);
    return isValid;
}

function setFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup.querySelector('.field-error');
    
    if (message) {
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
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

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '';
}

async function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate form submission (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showFormMessage(form, 'Thank you for your message! We will contact you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(form, 'Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
    } finally {
        // Restore button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function showFormMessage(form, message, type) {
    // Remove existing message
    const existingMessage = form.querySelector('.form-message');
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
        font-size: 0.9rem;
    `;
    
    form.insertBefore(messageElement, form.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

/* ========================================
   SMOOTH SCROLLING
   ======================================== */
function initializeSmoothScrolling() {
    // Smooth scrolling for all internal links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */
function debounce(func, wait) {
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

function throttle(func, limit) {
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

/* ========================================
   SCROLL ANIMATIONS (SIMPLE)
   ======================================== */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll('.team-card, .service-card, .contact-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(element);
    });
}

// Initialize scroll animations after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

/* ========================================
   PERFORMANCE OPTIMIZATIONS
   ======================================== */
// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/* ========================================
   ERROR HANDLING
   ======================================== */
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
});

/* ========================================
   ACCESSIBILITY ENHANCEMENTS
   ======================================== */
function initializeAccessibility() {
    // Add skip to content link
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

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

/* ========================================
   FINAL INITIALIZATION
   ======================================== */
console.log('✅ Holistic Psychology Services website loaded successfully');
