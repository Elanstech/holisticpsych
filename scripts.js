/* ========================================
   HOLISTIC PSYCHOLOGICAL SERVICES - JS
   Manhattan Corporate Style with Enhanced Hero
   ======================================== */

/* ========================================
   GLOBAL VARIABLES
   ======================================== */
let currentHeroSlide = 0;
let currentServiceSlide = 0;
let heroSlideInterval;
let heroTotalSlides = 3;
let heroAutoplayDuration = 8000; // 8 seconds per slide
let heroTransitionDuration = 1000; // 1 second transition
let isHeroPaused = false;
let progressInterval;

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
    initializeScrollAnimations();
    initializeAccessibility();
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
   ENHANCED HERO SLIDESHOW
   ======================================== */
function initializeHeroSlideshow() {
    const heroSection = document.querySelector('.hero');
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-controls .indicator');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const progressBar = document.getElementById('progressBar');
    
    if (!heroSection || slides.length === 0) {
        console.warn('Hero section or slides not found');
        return;
    }
    
    // Update total slides count
    heroTotalSlides = slides.length;
    
    // Initialize first slide
    showHeroSlide(0);
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showHeroSlide(index);
            resetHeroAutoplay();
        });
        
        // Add keyboard support
        indicator.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showHeroSlide(index);
                resetHeroAutoplay();
            }
        });
    });
    
    // Add navigation button handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            previousHeroSlide();
            resetHeroAutoplay();
        });
        
        prevBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                previousHeroSlide();
                resetHeroAutoplay();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextHeroSlide();
            resetHeroAutoplay();
        });
        
        nextBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                nextHeroSlide();
                resetHeroAutoplay();
            }
        });
    }
    
    // Pause/resume autoplay on hover
    heroSection.addEventListener('mouseenter', pauseHeroAutoplay);
    heroSection.addEventListener('mouseleave', resumeHeroAutoplay);
    
    // Pause/resume autoplay on focus/blur for accessibility
    heroSection.addEventListener('focusin', pauseHeroAutoplay);
    heroSection.addEventListener('focusout', function(e) {
        // Only resume if focus is moving outside the hero section
        if (!heroSection.contains(e.relatedTarget)) {
            resumeHeroAutoplay();
        }
    });
    
    // Add touch/swipe support for mobile
    initializeHeroTouchSupport();
    
    // Add keyboard navigation
    initializeHeroKeyboardSupport();
    
    // Start autoplay
    startHeroAutoplay();
    
    // Add visibility change handler to pause when tab is not active
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            pauseHeroAutoplay();
        } else {
            resumeHeroAutoplay();
        }
    });
    
    console.log('✅ Hero slideshow initialized successfully');
}

function showHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-controls .indicator');
    
    if (index < 0 || index >= heroTotalSlides) {
        console.warn('Invalid slide index:', index);
        return;
    }
    
    // Hide all slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        
        // Add subtle animation stagger
        setTimeout(() => {
            if (i === index) {
                slide.classList.add('active');
                
                // Trigger content animations
                animateSlideContent(slide, i);
            }
        }, i === index ? 0 : 100);
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-pressed', 'true');
        } else {
            indicator.classList.remove('active');
            indicator.setAttribute('aria-pressed', 'false');
        }
    });
    
    // Update current slide
    currentHeroSlide = index;
    
    // Reset progress bar
    resetProgressBar();
    
    // Announce slide change for screen readers
    announceSlideChange(index);
}

function nextHeroSlide() {
    const nextIndex = (currentHeroSlide + 1) % heroTotalSlides;
    showHeroSlide(nextIndex);
}

function previousHeroSlide() {
    const prevIndex = currentHeroSlide === 0 ? heroTotalSlides - 1 : currentHeroSlide - 1;
    showHeroSlide(prevIndex);
}

function startHeroAutoplay() {
    if (heroSlideInterval) {
        clearInterval(heroSlideInterval);
    }
    
    heroSlideInterval = setInterval(() => {
        if (!isHeroPaused) {
            nextHeroSlide();
        }
    }, heroAutoplayDuration);
    
    // Start progress bar animation
    startProgressBar();
}

function pauseHeroAutoplay() {
    isHeroPaused = true;
    pauseProgressBar();
}

function resumeHeroAutoplay() {
    isHeroPaused = false;
    startProgressBar();
}

function resetHeroAutoplay() {
    pauseHeroAutoplay();
    setTimeout(() => {
        if (!isHeroPaused) {
            startHeroAutoplay();
        }
    }, 100);
}

function startProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    // Clear existing interval
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    
    let progress = 0;
    const increment = 100 / (heroAutoplayDuration / 50); // Update every 50ms
    
    progressInterval = setInterval(() => {
        if (!isHeroPaused) {
            progress += increment;
            progressBar.style.width = Math.min(progress, 100) + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }
    }, 50);
}

function pauseProgressBar() {
    if (progressInterval) {
        clearInterval(progressInterval);
    }
}

function resetProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    
    if (progressInterval) {
        clearInterval(progressInterval);
    }
}

function initializeHeroTouchSupport() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    const threshold = 50; // Minimum distance for swipe
    
    heroSection.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });
    
    heroSection.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        // Prevent vertical scrolling during horizontal swipe
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);
        
        if (deltaX > deltaY && deltaX > 20) {
            e.preventDefault();
        }
    }, { passive: false });
    
    heroSection.addEventListener('touchend', function() {
        if (!isDragging) return;
        
        const deltaX = startX - currentX;
        const deltaY = Math.abs(startY - currentY);
        
        // Only trigger swipe if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                // Swipe left - next slide
                nextHeroSlide();
            } else {
                // Swipe right - previous slide
                previousHeroSlide();
            }
            resetHeroAutoplay();
        }
        
        isDragging = false;
    }, { passive: true });
}

function initializeHeroKeyboardSupport() {
    document.addEventListener('keydown', function(e) {
        // Only handle keyboard events when hero is in focus or no other interactive element is focused
        const activeElement = document.activeElement;
        const isHeroFocused = document.querySelector('.hero').contains(activeElement);
        const isInteractiveElement = activeElement.tagName === 'INPUT' || 
                                   activeElement.tagName === 'TEXTAREA' || 
                                   activeElement.tagName === 'SELECT' ||
                                   activeElement.isContentEditable;
        
        if (!isHeroFocused && isInteractiveElement) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                previousHeroSlide();
                resetHeroAutoplay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextHeroSlide();
                resetHeroAutoplay();
                break;
            case ' ':
                if (!isInteractiveElement) {
                    e.preventDefault();
                    if (isHeroPaused) {
                        resumeHeroAutoplay();
                    } else {
                        pauseHeroAutoplay();
                    }
                }
                break;
            case '1':
            case '2':
            case '3':
                if (!isInteractiveElement) {
                    e.preventDefault();
                    const slideIndex = parseInt(e.key) - 1;
                    if (slideIndex < heroTotalSlides) {
                        showHeroSlide(slideIndex);
                        resetHeroAutoplay();
                    }
                }
                break;
        }
    });
}

function animateSlideContent(slide, slideIndex) {
    const content = slide.querySelector('.hero-content');
    if (!content) return;
    
    // Reset animations
    content.style.animation = 'none';
    content.offsetHeight; // Trigger reflow
    
    // Apply entrance animation based on slide index
    switch(slideIndex) {
        case 0:
            content.style.animation = 'slideUp 0.8s ease-out 0.3s both';
            break;
        case 1:
            content.style.animation = 'slideInLeft 0.8s ease-out 0.3s both';
            break;
        case 2:
            content.style.animation = 'slideInRight 0.8s ease-out 0.3s both';
            break;
        default:
            content.style.animation = 'fadeIn 0.8s ease-out 0.3s both';
    }
    
    // Animate individual elements with stagger
    const elements = content.querySelectorAll('.hero-title, .hero-subtitle, .hero-location, .hero-team, .hero-services, .hero-stats, .hero-actions');
    elements.forEach((element, index) => {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = `fadeIn 0.6s ease-out ${0.5 + (index * 0.1)}s both`;
    });
}

function announceSlideChange(slideIndex) {
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('hero-live-region');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'hero-live-region';
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
    }
    
    const slideNames = [
        'Welcome slide - Your Journey to Mental Wellness Begins Here',
        'Team slide - Expert Care from Licensed Professionals',
        'Services slide - Comprehensive Mental Health Services'
    ];
    
    liveRegion.textContent = `${slideNames[slideIndex] || `Slide ${slideIndex + 1}`}. Slide ${slideIndex + 1} of ${heroTotalSlides}.`;
}

/* ========================================
   FLOATING CONTACT BUTTON
   ======================================== */
function initializeFloatingContact() {
    const floatingContact = document.getElementById('floatingContact');
    const floatingBtn = document.getElementById('floatingBtn');
    const floatingMenu = document.getElementById('floatingMenu');
    
    if (!floatingContact || !floatingBtn || !floatingMenu) {
        console.warn('Floating contact elements not found');
        return;
    }
    
    let isOpen = false;
    
    // Toggle menu on button click
    floatingBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleFloatingMenu();
    });
    
    // Handle keyboard navigation
    floatingBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFloatingMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!floatingContact.contains(e.target) && isOpen) {
            closeFloatingMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            closeFloatingMenu();
        }
    });
    
    // Handle menu item clicks
    const menuItems = floatingMenu.querySelectorAll('.floating-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Close menu after click
            setTimeout(() => {
                closeFloatingMenu();
            }, 150);
        });
    });
    
    function toggleFloatingMenu() {
        if (isOpen) {
            closeFloatingMenu();
        } else {
            openFloatingMenu();
        }
    }
    
    function openFloatingMenu() {
        isOpen = true;
        floatingBtn.classList.add('active');
        floatingMenu.classList.add('open');
        floatingBtn.setAttribute('aria-expanded', 'true');
        
        // Focus management for accessibility
        const firstMenuItem = floatingMenu.querySelector('.floating-item');
        if (firstMenuItem) {
            setTimeout(() => {
                firstMenuItem.focus();
            }, 100);
        }
    }
    
    function closeFloatingMenu() {
        isOpen = false;
        floatingBtn.classList.remove('active');
        floatingMenu.classList.remove('open');
        floatingBtn.setAttribute('aria-expanded', 'false');
        
        // Reset menu item animations
        const menuItems = floatingMenu.querySelectorAll('.floating-item');
        menuItems.forEach(item => {
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = '';
        });
    }
    
    // Auto-hide when scrolling (optional)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (isOpen) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                closeFloatingMenu();
            }, 1000);
        }
    });
    
    console.log('✅ Floating contact button initialized successfully');
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

// Preload next slide image
function preloadNextSlideImage() {
    const nextIndex = (currentHeroSlide + 1) % heroTotalSlides;
    const nextSlide = document.querySelector(`[data-slide="${nextIndex}"]`);
    
    if (nextSlide) {
        const img = nextSlide.querySelector('.hero-background img');
        if (img && img.dataset.src) {
            const preloadImg = new Image();
            preloadImg.src = img.dataset.src;
        }
    }
}

/* ========================================
   RESIZE HANDLER
   ======================================== */
function handleHeroResize() {
    // Recalculate positions if needed
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Force layout recalculation
        heroSection.style.height = '100vh';
        heroSection.offsetHeight; // Trigger reflow
        
        // Update for mobile viewport height issues
        if (window.innerHeight < 600) {
            heroSection.style.minHeight = '100vh';
        }
    }
}

// Debounced resize handler
const debouncedHeroResize = debounce(handleHeroResize, 250);
window.addEventListener('resize', debouncedHeroResize);

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

/* ========================================
   CLEANUP ON PAGE UNLOAD
   ======================================== */
window.addEventListener('beforeunload', function() {
    if (heroSlideInterval) {
        clearInterval(heroSlideInterval);
    }
    if (progressInterval) {
        clearInterval(progressInterval);
    }
});

/* ========================================
   PUBLIC API
   ======================================== */
// Expose functions for external control if needed
window.HeroSlideshow = {
    next: nextHeroSlide,
    previous: previousHeroSlide,
    goTo: showHeroSlide,
    pause: pauseHeroAutoplay,
    resume: resumeHeroAutoplay,
    getCurrentSlide: () => currentHeroSlide,
    getTotalSlides: () => heroTotalSlides
};

/* ========================================
   FINAL INITIALIZATION
   ======================================== */
console.log('✅ Holistic Psychology Services website with enhanced hero loaded successfully');
