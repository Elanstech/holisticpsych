/* ========================================
   HOLISTIC PSYCHOLOGICAL SERVICES - COMPLETE JS
   Manhattan Corporate Style with All Sections
   ======================================== */

/* ========================================
   GLOBAL VARIABLES
   ======================================== */

// Hero Section Variables
let currentHeroSlide = 0;
let heroSlideInterval;
let heroTotalSlides = 3;
let heroAutoplayDuration = 8000; // 8 seconds per slide
let heroTransitionDuration = 1000; // 1 second transition
let isHeroPaused = false;
let progressInterval;

// Services Carousel Variables
let currentServiceSlide = 0;

// Reviews Section Variables
let currentTestimonial = 0;
let testimonialInterval;
let isTestimonialPaused = false;
let totalTestimonials = 0;
let isDesktop = window.innerWidth >= 1200;

/* ========================================
   DOM READY INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeHeroSlideshow();
    initializeFloatingContact();
    initializeServicesCarousel();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeMobileMenu();
    initializeScrollAnimations();
    initializeAccessibility();
    
    // Initialize new sections
    initializeAboutPreview();
    initializeReviewsSection();
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
                
                // Trigger stats counter animation for reviews section
                if (entry.target.classList.contains('review-stats')) {
                    animateStatsCounters();
                }
                
                // Trigger team count animation for about section
                if (entry.target.querySelector('.count-number')) {
                    animateAboutTeamCount();
                }
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll('.team-card, .service-card, .contact-item, .about-preview-text, .leadership-preview, .reviews-section, .instagram-section');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(element);
    });
}

/* ========================================
   ABOUT PREVIEW SECTION
   ======================================== */
function initializeAboutPreview() {
    initializeAboutScrollAnimations();
    initializeLeaderCardInteractions();
    initializeHighlightAnimations();
    initializeSpecialtyTagInteractions();
    initializeAboutButtonAnimations();
    initializeAboutAccessibility();
}

function initializeAboutScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animations for child elements
                const children = entry.target.querySelectorAll('.highlight-item, .leader-card, .specialty-tag');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll('.about-preview-text, .leadership-preview');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(element);
    });
    
    // Add CSS for animate-in class
    if (!document.querySelector('#about-animations-style')) {
        const style = document.createElement('style');
        style.id = 'about-animations-style';
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .highlight-item,
            .leader-card,
            .specialty-tag {
                transition: opacity 0.4s ease, transform 0.4s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeLeaderCardInteractions() {
    const leaderCards = document.querySelectorAll('.leader-card');
    
    leaderCards.forEach(card => {
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            // Add subtle scale to image
            const img = this.querySelector('.leader-image img');
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
            
            // Animate specialty tag
            const specialty = this.querySelector('.leader-specialty');
            if (specialty) {
                specialty.style.background = 'var(--primary-green)';
                specialty.style.color = 'var(--white)';
                specialty.style.borderColor = 'var(--primary-green)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset image scale
            const img = this.querySelector('.leader-image img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
            
            // Reset specialty tag
            const specialty = this.querySelector('.leader-specialty');
            if (specialty) {
                specialty.style.background = 'rgba(0, 216, 132, 0.1)';
                specialty.style.color = 'var(--primary-green)';
                specialty.style.borderColor = 'rgba(0, 216, 132, 0.2)';
            }
        });
        
        // Click interaction for potential future functionality
        card.addEventListener('click', function() {
            const leaderName = this.dataset.leader;
            
            // Add click animation
            this.style.transform = 'scale(0.98) translateY(-2px)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
            
            console.log(`Leader card clicked: ${leaderName}`);
        });
        
        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Learn more about ${card.querySelector('h4')?.textContent || 'team member'}`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

function initializeHighlightAnimations() {
    const highlights = document.querySelectorAll('.highlight-item');
    
    highlights.forEach((highlight, index) => {
        // Stagger initial animations
        highlight.style.animationDelay = `${index * 0.1}s`;
        
        // Enhanced hover interaction
        highlight.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.highlight-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.boxShadow = '0 6px 16px rgba(0, 216, 132, 0.3)';
            }
        });
        
        highlight.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.highlight-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.boxShadow = '0 4px 12px rgba(0, 216, 132, 0.2)';
            }
        });
    });
}

function initializeSpecialtyTagInteractions() {
    const specialtyTags = document.querySelectorAll('.specialty-tag');
    
    specialtyTags.forEach((tag, index) => {
        // Random animation delay for a more organic feel
        const delay = Math.random() * 0.5;
        tag.style.animationDelay = `${delay}s`;
        
        // Enhanced interactions
        tag.addEventListener('mouseenter', function() {
            // Create ripple effect
            createAboutRippleEffect(this);
        });
    });
}

function createAboutRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: 50%;
        top: 50%;
        margin-left: ${-size / 2}px;
        margin-top: ${-size / 2}px;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-animation-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function initializeAboutButtonAnimations() {
    const buttons = document.querySelectorAll('.about-learn-more, .about-view-team');
    
    buttons.forEach(button => {
        // Enhanced click animation
        button.addEventListener('click', function(e) {
            // Create expanding circle animation
            const circle = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            
            circle.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                width: 0;
                height: 0;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
                transform: translate(-50%, -50%);
                animation: button-click 0.5s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(circle);
            
            // Add button click animation if not exists
            if (!document.querySelector('#button-click-animation-style')) {
                const style = document.createElement('style');
                style.id = 'button-click-animation-style';
                style.textContent = `
                    @keyframes button-click {
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
                circle.remove();
            }, 500);
        });
    });
}

function initializeAboutAccessibility() {
    // Add focus management
    const focusableElements = document.querySelectorAll('.leader-card, .about-learn-more, .about-view-team');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-green)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Add ARIA live region for dynamic content updates
    if (!document.querySelector('#about-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'about-live-region';
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
}

function animateAboutTeamCount() {
    const countElement = document.querySelector('.count-number');
    if (!countElement) return;
    
    const targetCount = parseInt(countElement.textContent);
    const duration = 1000; // 1 second
    const startTime = performance.now();
    
    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.round(easeOut * targetCount);
        
        countElement.textContent = currentCount + '+';
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        }
    }
    
    // Start animation when element becomes visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(updateCount);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(countElement);
}

/* ========================================
   REVIEWS & INSTAGRAM SECTION
   ======================================== */
function initializeReviewsSection() {
    initializeTestimonialsCarousel();
    initializeInstagramSection();
    initializeReviewsScrollAnimations();
    initializeReviewsAccessibility();
    initializeResponsiveHandling();
    
    console.log('✅ Reviews & Instagram section initialized successfully');
}

function initializeTestimonialsCarousel() {
    const track = document.getElementById('testimonialsTrack');
    const cards = document.querySelectorAll('.testimonial-card');
    const indicators = document.getElementById('testimonialIndicators');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    
    if (!track || cards.length === 0) {
        console.warn('Testimonials elements not found');
        return;
    }
    
    totalTestimonials = cards.length;
    
    // Check if desktop layout (grid instead of carousel)
    checkDesktopLayout();
    
    if (!isDesktop) {
        // Generate indicators
        generateTestimonialIndicators();
        
        // Initialize carousel
        showTestimonial(0);
        
        // Add event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', previousTestimonial);
            prevBtn.addEventListener('keydown', handleTestimonialButtonKeydown);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextTestimonial);
            nextBtn.addEventListener('keydown', handleTestimonialButtonKeydown);
        }
        
        // Add touch/swipe support
        initializeTestimonialTouchSupport();
        
        // Add keyboard navigation
        initializeTestimonialKeyboardSupport();
        
        // Auto-play functionality
        startTestimonialAutoplay();
        
        // Pause/resume on hover
        const container = document.querySelector('.testimonials-container');
        if (container) {
            container.addEventListener('mouseenter', pauseTestimonialAutoplay);
            container.addEventListener('mouseleave', resumeTestimonialAutoplay);
            container.addEventListener('focusin', pauseTestimonialAutoplay);
            container.addEventListener('focusout', resumeTestimonialAutoplay);
        }
    }
    
    // Add visibility change handler
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            pauseTestimonialAutoplay();
        } else if (!isTestimonialPaused) {
            resumeTestimonialAutoplay();
        }
    });
}

function checkDesktopLayout() {
    isDesktop = window.innerWidth >= 1200;
    const controls = document.querySelector('.testimonials-controls');
    
    if (isDesktop) {
        // Hide controls on desktop
        if (controls) controls.style.display = 'none';
        stopTestimonialAutoplay();
    } else {
        // Show controls on mobile/tablet
        if (controls) controls.style.display = 'flex';
        if (!isTestimonialPaused) {
            startTestimonialAutoplay();
        }
    }
}

function generateTestimonialIndicators() {
    const indicators = document.getElementById('testimonialIndicators');
    if (!indicators) return;
    
    indicators.innerHTML = '';
    
    for (let i = 0; i < totalTestimonials; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'testimonial-indicator';
        indicator.setAttribute('data-slide', i);
        indicator.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        
        indicator.addEventListener('click', () => {
            showTestimonial(i);
            resetTestimonialAutoplay();
        });
        
        indicator.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showTestimonial(i);
                resetTestimonialAutoplay();
            }
        });
        
        indicators.appendChild(indicator);
    }
}

function showTestimonial(index) {
    if (isDesktop) return; // No carousel on desktop
    
    const track = document.getElementById('testimonialsTrack');
    const indicators = document.querySelectorAll('.testimonial-indicator');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    
    if (index < 0 || index >= totalTestimonials) return;
    
    // Move track
    const translateX = -index * 100;
    track.style.transform = `translateX(${translateX}%)`;
    
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
    
    // Update navigation buttons
    if (prevBtn) {
        prevBtn.disabled = index === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = index === totalTestimonials - 1;
    }
    
    currentTestimonial = index;
    
    // Announce change for screen readers
    announceTestimonialChange(index);
    
    // Add animation to current card
    const currentCard = document.querySelectorAll('.testimonial-card')[index];
    if (currentCard) {
        currentCard.classList.add('animate-in');
    }
}

function nextTestimonial() {
    if (currentTestimonial < totalTestimonials - 1) {
        showTestimonial(currentTestimonial + 1);
    } else {
        showTestimonial(0); // Loop to first
    }
}

function previousTestimonial() {
    if (currentTestimonial > 0) {
        showTestimonial(currentTestimonial - 1);
    } else {
        showTestimonial(totalTestimonials - 1); // Loop to last
    }
}

function startTestimonialAutoplay() {
    if (isDesktop) return;
    
    stopTestimonialAutoplay();
    testimonialInterval = setInterval(() => {
        if (!isTestimonialPaused) {
            nextTestimonial();
        }
    }, 5000); // 5 seconds per slide
}

function stopTestimonialAutoplay() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
    }
}

function pauseTestimonialAutoplay() {
    isTestimonialPaused = true;
}

function resumeTestimonialAutoplay() {
    isTestimonialPaused = false;
}

function resetTestimonialAutoplay() {
    stopTestimonialAutoplay();
    setTimeout(() => {
        if (!isTestimonialPaused) {
            startTestimonialAutoplay();
        }
    }, 1000);
}

function initializeTestimonialTouchSupport() {
    const container = document.querySelector('.testimonials-carousel');
    if (!container) return;
    
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    const threshold = 50;
    
    container.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        pauseTestimonialAutoplay();
    }, { passive: true });
    
    container.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);
        
        // Prevent vertical scrolling during horizontal swipe
        if (deltaX > deltaY && deltaX > 20) {
            e.preventDefault();
        }
    }, { passive: false });
    
    container.addEventListener('touchend', function() {
        if (!isDragging) return;
        
        const deltaX = startX - currentX;
        const deltaY = Math.abs(startY - currentY);
        
        if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                nextTestimonial();
            } else {
                previousTestimonial();
            }
            resetTestimonialAutoplay();
        }
        
        isDragging = false;
        setTimeout(() => {
            resumeTestimonialAutoplay();
        }, 100);
    }, { passive: true });
}

function initializeTestimonialKeyboardSupport() {
    document.addEventListener('keydown', function(e) {
        const focusedElement = document.activeElement;
        const isTestimonialFocused = document.querySelector('.testimonials-container')?.contains(focusedElement);
        
        if (!isTestimonialFocused) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                previousTestimonial();
                resetTestimonialAutoplay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextTestimonial();
                resetTestimonialAutoplay();
                break;
            case ' ':
                e.preventDefault();
                if (isTestimonialPaused) {
                    resumeTestimonialAutoplay();
                    startTestimonialAutoplay();
                } else {
                    pauseTestimonialAutoplay();
                }
                break;
        }
    });
}

function handleTestimonialButtonKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.target.click();
    }
}

function initializeInstagramSection() {
    const followBtn = document.querySelector('.instagram-follow-btn');
    const instagramIcon = document.querySelector('.instagram-icon');
    
    // Enhanced follow button interactions
    if (followBtn) {
        followBtn.addEventListener('click', function(e) {
            // Add click animation
            createInstagramClickAnimation(this, e);
            
            // Track click for analytics (optional)
            console.log('Instagram follow button clicked');
        });
    }
    
    // Animate Instagram icon on hover
    if (instagramIcon) {
        instagramIcon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        instagramIcon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // Initialize Elfsight widget observer
    initializeElfsightObserver();
}

function createInstagramClickAnimation(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        width: 0;
        height: 0;
        left: ${event.clientX - rect.left}px;
        top: ${event.clientY - rect.top}px;
        transform: translate(-50%, -50%);
        animation: ripple-expand 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Add animation if not exists
    if (!document.querySelector('#ripple-expand-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-expand-style';
        style.textContent = `
            @keyframes ripple-expand {
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
}

function initializeElfsightObserver() {
    // Observer to detect when Elfsight widget loads
    const instagramFeed = document.querySelector('.instagram-feed');
    if (!instagramFeed) return;
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList && node.classList.contains('elfsight-app')) {
                        // Widget loaded
                        console.log('✅ Instagram widget loaded');
                        
                        // Add custom styling or interactions here if needed
                        customizeElfsightWidget(node);
                    }
                });
            }
        });
    });
    
    observer.observe(instagramFeed, {
        childList: true,
        subtree: true
    });
}

function customizeElfsightWidget(widget) {
    // Add any custom styling or functionality to the Elfsight widget
    widget.style.borderRadius = 'var(--radius-lg)';
    widget.style.overflow = 'hidden';
    
    // Add loading animation
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'elfsight-loading';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <i class="ri-loader-4-line"></i>
        </div>
        <p>Loading Instagram feed...</p>
    `;
    
    // Add loading styles
    if (!document.querySelector('#elfsight-loading-style')) {
        const style = document.createElement('style');
        style.id = 'elfsight-loading-style';
        style.textContent = `
            .elfsight-loading {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--gray-50);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: var(--space-md);
                z-index: 10;
            }
            
            .loading-spinner i {
                font-size: 2rem;
                color: var(--primary-green);
                animation: spin 1s linear infinite;
            }
            
            .elfsight-loading p {
                color: var(--gray-600);
                font-size: 0.9rem;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    widget.parentNode.style.position = 'relative';
    widget.parentNode.appendChild(loadingOverlay);
    
    // Remove loading overlay after widget content loads
    setTimeout(() => {
        if (loadingOverlay.parentNode) {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.remove();
                }
            }, 300);
        }
    }, 2000);
}

function initializeReviewsScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animations for testimonial cards
                const cards = entry.target.querySelectorAll('.testimonial-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                });
                
                // Trigger stats counter animation
                if (entry.target.classList.contains('review-stats')) {
                    animateStatsCounters();
                }
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll('.reviews-section, .instagram-section, .review-stats');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(element);
    });
    
    // Add animate-in styles
    if (!document.querySelector('#scroll-animations-style')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations-style';
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

function animateStatsCounters() {
    const statNumbers = document.querySelectorAll('.review-stats .stat-number');
    
    statNumbers.forEach(statNumber => {
        const finalValue = statNumber.textContent;
        const isDecimal = finalValue.includes('.');
        const numericValue = parseFloat(finalValue);
        
        if (isNaN(numericValue)) return;
        
        let currentValue = 0;
        const increment = numericValue / 60; // 60 frames for smooth animation
        const duration = 1500;
        const startTime = performance.now();
        
        function updateCounter(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            currentValue = numericValue * easeOut;
            
            if (isDecimal) {
                statNumber.textContent = currentValue.toFixed(1);
            } else {
                statNumber.textContent = Math.round(currentValue) + '+';
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                statNumber.textContent = finalValue;
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

function initializeResponsiveHandling() {
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const wasDesktop = isDesktop;
            checkDesktopLayout();
            
            if (wasDesktop !== isDesktop) {
                // Layout changed, reinitialize
                if (isDesktop) {
                    // Switched to desktop
                    stopTestimonialAutoplay();
                    const track = document.getElementById('testimonialsTrack');
                    if (track) track.style.transform = 'none';
                } else {
                    // Switched to mobile/tablet
                    generateTestimonialIndicators();
                    showTestimonial(0);
                    startTestimonialAutoplay();
                }
            }
        }, 250);
    });
}

function initializeReviewsAccessibility() {
    // Add live region for announcements
    if (!document.querySelector('#reviews-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'reviews-live-region';
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
    
    // Add focus management
    const focusableElements = document.querySelectorAll('.testimonial-nav, .testimonial-indicator, .instagram-follow-btn');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-green)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

function announceTestimonialChange(index) {
    const liveRegion = document.getElementById('reviews-live-region');
    if (liveRegion) {
        liveRegion.textContent = `Showing testimonial ${index + 1} of ${totalTestimonials}`;
    }
}

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
   CLEANUP ON PAGE UNLOAD
   ======================================== */
window.addEventListener('beforeunload', function() {
    if (heroSlideInterval) {
        clearInterval(heroSlideInterval);
    }
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
});

/* ========================================
   PUBLIC APIS
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

window.AboutPreview = {
    animateTeamCount: animateAboutTeamCount
};

window.ReviewsSection = {
    showTestimonial,
    nextTestimonial,
    previousTestimonial,
    pauseAutoplay: pauseTestimonialAutoplay,
    resumeAutoplay: resumeTestimonialAutoplay,
    getCurrentTestimonial: () => currentTestimonial,
    getTotalTestimonials: () => totalTestimonials
};

/* ========================================
   FINAL INITIALIZATION
   ======================================== */
console.log('✅ Holistic Psychology Services complete website loaded successfully');
