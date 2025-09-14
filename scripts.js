/* ========================================
   HOLISTIC PSYCHOLOGICAL SERVICES - COMPLETE ENHANCED JS
   Manhattan Corporate Style with Enhanced Services Carousel
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

// About Section Variables
let aboutObserver;
let statsAnimated = false;
let aboutInitialized = false;

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
    initializeAboutSection();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeMobileMenu();
    initializeScrollAnimations();
    initializeAccessibility();
    initializeReviewsSection();
    
    // Initialize Enhanced Services Carousel (NEW)
    window.enhancedServicesCarousel = new EnhancedServicesCarousel();
    window.enhancedServiceCards = new EnhancedServiceCardInteractions();
    
    console.log('✅ All systems initialized successfully');
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
   MODERN HERO SLIDESHOW
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
    
    // Initialize floating contact
    initializeFloatingContact();
    
    console.log('✅ Modern Hero slideshow initialized successfully');
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
                animateHeroSlideContent(slide, i);
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
    announceHeroSlideChange(index);
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
        pauseHeroAutoplay();
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
        setTimeout(() => {
            resumeHeroAutoplay();
        }, 100);
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
                        startHeroAutoplay();
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

function animateHeroSlideContent(slide, slideIndex) {
    const content = slide.querySelector('.hero-content');
    if (!content) return;
    
    // Reset animations
    content.style.animation = 'none';
    content.offsetHeight; // Trigger reflow
    
    // Apply entrance animation
    content.style.animation = 'slideUp 0.8s ease-out 0.3s both';
    
    // Animate individual elements with stagger
    const elements = content.querySelectorAll('.hero-title, .hero-subtitle, .hero-location, .hero-badge, .modern-team-grid, .services-showcase, .stats-row, .hero-actions');
    elements.forEach((element, index) => {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = `slideUp 0.6s ease-out ${0.5 + (index * 0.1)}s both`;
    });
    
    // Special animations for specific slide elements
    if (slideIndex === 0) {
        // Circular logo animation
        const logo = slide.querySelector('.hero-logo-circular');
        if (logo) {
            logo.style.animation = 'none';
            logo.offsetHeight;
            logo.style.animation = 'slideUp 0.8s ease-out 0.2s both';
        }
    }
    
    if (slideIndex === 1) {
        // Team cards animation
        const teamCards = slide.querySelectorAll('.team-card-modern');
        teamCards.forEach((card, index) => {
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = `slideUp 0.6s ease-out ${0.7 + (index * 0.2)}s both`;
        });
    }
    
    if (slideIndex === 2) {
        // Service pills animation
        const servicePills = slide.querySelectorAll('.service-pill');
        servicePills.forEach((pill, index) => {
            pill.style.animation = 'none';
            pill.offsetHeight;
            pill.style.animation = `slideUp 0.6s ease-out ${0.7 + (index * 0.1)}s both`;
        });
        
        // Stats animation
        const stats = slide.querySelectorAll('.stat-modern');
        stats.forEach((stat, index) => {
            stat.style.animation = 'none';
            stat.offsetHeight;
            stat.style.animation = `slideUp 0.6s ease-out ${1.0 + (index * 0.1)}s both`;
        });
    }
}

function announceHeroSlideChange(slideIndex) {
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
        'Team slide - Meet Our Distinguished Team',
        'Services slide - Evidence-Based Mental Health Services'
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
   MODERN ABOUT SECTION
   ======================================== */
function initializeAboutSection() {
    if (aboutInitialized) return;
    
    initializeAOS();
    initializeAboutAnimations();
    initializeStatsCounter();
    initializeLeaderInteractions();
    initializeValueCardInteractions();
    initializePillHoverEffects();
    initializeButtonEffects();
    initializeAboutAccessibility();
    
    aboutInitialized = true;
    console.log('✅ Modern About Section initialized successfully');
}

function initializeAOS() {
    // Initialize AOS with custom settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 0,
            anchorPlacement: 'top-bottom'
        });
    } else {
        // Fallback animation system if AOS is not available
        initializeFallbackAnimations();
    }
}

function initializeFallbackAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delays
                const delay = index * 100;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay);
                
                aboutObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll(`
        .about-header,
        .content-card,
        .value-card,
        .leadership-card,
        .team-stats-card,
        .team-cta-card
    `);
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        aboutObserver.observe(element);
    });
    
    // Add CSS for animate-in class
    if (!document.querySelector('#about-fallback-animations')) {
        const style = document.createElement('style');
        style.id = 'about-fallback-animations';
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeAboutAnimations() {
    const aboutSection = document.querySelector('.about-modern');
    if (!aboutSection) return;
    
    // Floating shapes animation
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach((shape, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            shape.style.transform += ` translate(${randomX}px, ${randomY}px)`;
        }, 3000 + (index * 1000));
    });
    
    // Parallax effect for background elements
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        shapes.forEach((shape, index) => {
            const speed = 0.2 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 16));
}

function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateCounter(entry.target);
                statsAnimated = true;
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(statNumber => {
        counterObserver.observe(statNumber);
    });
}

function animateCounter(element) {
    const targetCount = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.round(easeOut * targetCount);
        
        element.textContent = currentCount;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetCount;
            
            // Add completion animation
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function initializeLeaderInteractions() {
    const leaderProfiles = document.querySelectorAll('.leader-profile');
    
    leaderProfiles.forEach(profile => {
        // Enhanced hover effects
        profile.addEventListener('mouseenter', function() {
            addLeaderHoverEffect(this);
        });
        
        profile.addEventListener('mouseleave', function() {
            removeLeaderHoverEffect(this);
        });
        
        // Click interactions
        profile.addEventListener('click', function() {
            handleLeaderClick(this);
        });
        
        // Keyboard accessibility
        profile.setAttribute('tabindex', '0');
        profile.setAttribute('role', 'button');
        profile.setAttribute('aria-label', `Learn more about ${profile.querySelector('h4')?.textContent || 'team member'}`);
        
        profile.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLeaderClick(this);
            }
        });
    });
}

function addLeaderHoverEffect(profile) {
    // Animate specialty tags
    const specialtyTags = profile.querySelectorAll('.specialty-tag');
    specialtyTags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.transform = 'translateY(-2px)';
            tag.style.boxShadow = '0 4px 12px rgba(0, 216, 132, 0.3)';
        }, index * 50);
    });
    
    // Animate image
    const image = profile.querySelector('.leader-image img');
    if (image) {
        image.style.filter = 'brightness(1.1) contrast(1.1)';
    }
    
    // Animate badge
    const badge = profile.querySelector('.leader-badge');
    if (badge) {
        badge.style.transform = 'scale(1.2) rotate(10deg)';
    }
}

function removeLeaderHoverEffect(profile) {
    // Reset specialty tags
    const specialtyTags = profile.querySelectorAll('.specialty-tag');
    specialtyTags.forEach(tag => {
        tag.style.transform = '';
        tag.style.boxShadow = '';
    });
    
    // Reset image
    const image = profile.querySelector('.leader-image img');
    if (image) {
        image.style.filter = '';
    }
    
    // Reset badge
    const badge = profile.querySelector('.leader-badge');
    if (badge) {
        badge.style.transform = '';
    }
}

function handleLeaderClick(profile) {
    const leaderName = profile.dataset.leader;
    
    // Add click animation
    profile.style.transform = 'scale(0.98)';
    setTimeout(() => {
        profile.style.transform = '';
    }, 150);
    
    // Create ripple effect
    createRippleEffect(profile);
    
    console.log(`Leader profile clicked: ${leaderName}`);
    
    // Announce for screen readers
    announceAboutAction(`Viewing profile for ${profile.querySelector('h4')?.textContent || 'team member'}`);
}

function initializeValueCardInteractions() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach((card, index) => {
        // Stagger initial animations
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Enhanced hover interactions
        card.addEventListener('mouseenter', function() {
            animateValueCardHover(this, true);
        });
        
        card.addEventListener('mouseleave', function() {
            animateValueCardHover(this, false);
        });
        
        // Click interactions
        card.addEventListener('click', function() {
            handleValueCardClick(this);
        });
        
        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Learn more about ${card.querySelector('h4')?.textContent || 'this value'}`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleValueCardClick(this);
            }
        });
    });
}

function animateValueCardHover(card, isHover) {
    const icon = card.querySelector('.value-icon');
    const content = card.querySelector('.value-content');
    
    if (isHover) {
        // Animate icon
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        // Animate content
        if (content) {
            content.style.transform = 'translateX(5px)';
        }
        
        // Add subtle glow effect
        card.style.boxShadow = '0 8px 32px rgba(0, 216, 132, 0.15), 0 0 0 1px rgba(0, 216, 132, 0.1)';
    } else {
        // Reset animations
        if (icon) {
            icon.style.transform = '';
        }
        
        if (content) {
            content.style.transform = '';
        }
        
        card.style.boxShadow = '';
    }
}

function handleValueCardClick(card) {
    // Add click animation
    card.style.transform = 'scale(0.98) translateX(8px)';
    setTimeout(() => {
        card.style.transform = '';
    }, 200);
    
    // Create pulse effect
    createPulseEffect(card);
    
    const valueTitle = card.querySelector('h4')?.textContent || 'value';
    console.log(`Value card clicked: ${valueTitle}`);
    
    // Announce for screen readers
    announceAboutAction(`Exploring our commitment to ${valueTitle}`);
}

function initializePillHoverEffects() {
    const pills = document.querySelectorAll('.pill');
    
    pills.forEach((pill, index) => {
        // Random animation delay for organic feel
        const delay = Math.random() * 0.5;
        pill.style.animationDelay = `${delay}s`;
        
        // Enhanced hover interactions
        pill.addEventListener('mouseenter', function() {
            createPillHoverEffect(this);
        });
        
        pill.addEventListener('mouseleave', function() {
            resetPillEffect(this);
        });
    });
}

function createPillHoverEffect(pill) {
    // Create expanding background effect
    const effect = document.createElement('span');
    effect.className = 'pill-hover-effect';
    effect.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--gradient-primary);
        border-radius: inherit;
        z-index: -1;
        transform: scale(0);
        transition: transform 0.3s ease;
    `;
    
    pill.style.position = 'relative';
    pill.appendChild(effect);
    
    // Trigger animation
    setTimeout(() => {
        effect.style.transform = 'scale(1)';
    }, 10);
}

function resetPillEffect(pill) {
    const effect = pill.querySelector('.pill-hover-effect');
    if (effect) {
        effect.style.transform = 'scale(0)';
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 300);
    }
}

function initializeButtonEffects() {
    const modernButtons = document.querySelectorAll('.btn-modern-primary, .btn-modern-secondary');
    
    modernButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            createButtonClickEffect(this, e);
        });
        
        button.addEventListener('mouseenter', function() {
            addButtonHoverEffect(this);
        });
        
        button.addEventListener('mouseleave', function() {
            removeButtonHoverEffect(this);
        });
    });
    
    // CTA Link effects
    const ctaLinks = document.querySelectorAll('.cta-link');
    ctaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            createButtonClickEffect(this, e);
        });
    });
}

function createButtonClickEffect(button, event) {
    // Create expanding circle animation
    const circle = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    
    circle.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        width: 0;
        height: 0;
        left: ${event.clientX - rect.left}px;
        top: ${event.clientY - rect.top}px;
        transform: translate(-50%, -50%);
        animation: button-click-effect 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(circle);
    
    // Add button click animation keyframes if not exists
    if (!document.querySelector('#button-click-effect-style')) {
        const style = document.createElement('style');
        style.id = 'button-click-effect-style';
        style.textContent = `
            @keyframes button-click-effect {
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
        if (circle.parentNode) {
            circle.remove();
        }
    }, 600);
}

function addButtonHoverEffect(button) {
    // Add subtle lift and glow
    button.style.transform = 'translateY(-2px)';
    
    if (button.classList.contains('btn-modern-primary')) {
        button.style.boxShadow = '0 12px 40px rgba(0, 216, 132, 0.4)';
    } else {
        button.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
    }
}

function removeButtonHoverEffect(button) {
    button.style.transform = '';
    button.style.boxShadow = '';
}

function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 216, 132, 0.3);
        transform: scale(0);
        animation: ripple-effect 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: 50%;
        top: 50%;
        margin-left: ${-size / 2}px;
        margin-top: ${-size / 2}px;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-effect-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-effect-style';
        style.textContent = `
            @keyframes ripple-effect {
                to {
                    transform: scale(2);
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

function createPulseEffect(element) {
    element.style.animation = 'pulse-effect 0.6s ease-out';
    
    // Add pulse animation if not exists
    if (!document.querySelector('#pulse-effect-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-effect-style';
        style.textContent = `
            @keyframes pulse-effect {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        element.style.animation = '';
    }, 600);
}

function initializeAboutAccessibility() {
    // Add focus management
    const focusableElements = document.querySelectorAll(`
        .value-card,
        .leader-profile,
        .btn-modern-primary,
        .btn-modern-secondary,
        .cta-link,
        .team-cta-card
    `);
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-green)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Add ARIA live region for dynamic announcements
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

function announceAboutAction(message) {
    const liveRegion = document.getElementById('about-live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
    }
}

/* ========================================
   ENHANCED SERVICES CAROUSEL CLASS
   ======================================== */

class EnhancedServicesCarousel {
    constructor() {
        this.track = document.getElementById('servicesTrackModern');
        this.cards = document.querySelectorAll('.service-card-modern');
        this.prevBtn = document.getElementById('servicesPrev');
        this.nextBtn = document.getElementById('servicesNext');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.indicatorsContainer = document.getElementById('indicatorsTrack');
        
        this.currentIndex = 0;
        this.visibleCards = 3; // Desktop default
        this.currentFilter = 'all';
        this.filteredCards = [...this.cards];
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 4000; // 4 seconds
        this.isPaused = false;
        this.hasUserInteracted = false;
        
        this.init();
    }
    
    init() {
        if (!this.track || this.cards.length === 0) {
            console.warn('Services carousel elements not found');
            return;
        }
        
        this.calculateVisibleCards();
        this.setupEventListeners();
        this.generateIndicators();
        this.updateCarousel();
        this.startAutoplay();
        this.setupIntersectionObserver();
        
        console.log('✅ Enhanced Services Carousel initialized');
    }
    
    calculateVisibleCards() {
        const containerWidth = window.innerWidth;
        
        if (containerWidth >= 1200) {
            this.visibleCards = 3; // Exactly 3 on desktop
        } else if (containerWidth >= 768) {
            this.visibleCards = 2;
        } else {
            this.visibleCards = 1;
        }
    }
    
    setupEventListeners() {
        // Enhanced filter tabs with rapid response
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleUserInteraction();
                const category = e.target.dataset.category;
                this.filterServices(category);
            });
            
            // Add keyboard support
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleUserInteraction();
                    const category = e.target.dataset.category;
                    this.filterServices(category);
                }
            });
        });
        
        // Navigation buttons with enhanced feedback
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.handleUserInteraction();
                this.goToPrevious();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.handleUserInteraction();
                this.goToNext();
            });
        }
        
        // Enhanced touch/swipe support
        this.setupTouchEvents();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Window resize handler with debouncing
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.calculateVisibleCards();
                this.updateCarousel();
                this.generateIndicators();
                this.updatePulseHint();
            }, 150);
        });
        
        // Pause/resume on hover and focus
        const carouselContainer = document.querySelector('.services-carousel-modern');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.pauseAutoplay());
            carouselContainer.addEventListener('mouseleave', () => this.resumeAutoplay());
            carouselContainer.addEventListener('focusin', () => this.pauseAutoplay());
            carouselContainer.addEventListener('focusout', () => this.resumeAutoplay());
        }
        
        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else if (!this.isPaused && !this.hasUserInteracted) {
                this.resumeAutoplay();
            }
        });
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!this.hasUserInteracted) {
                        this.startAutoplay();
                    }
                    this.updatePulseHint();
                } else {
                    this.pauseAutoplay();
                }
            });
        }, options);
        
        const carouselSection = document.querySelector('.services-modern');
        if (carouselSection) {
            this.observer.observe(carouselSection);
        }
    }
    
    handleUserInteraction() {
        this.hasUserInteracted = true;
        this.pauseAutoplay();
        this.removePulseHint();
        
        // Resume autoplay after 10 seconds of no interaction
        clearTimeout(this.userInteractionTimeout);
        this.userInteractionTimeout = setTimeout(() => {
            this.hasUserInteracted = false;
            this.resumeAutoplay();
            this.updatePulseHint();
        }, 10000);
    }
    
    filterServices(category) {
        if (this.isAnimating || this.currentFilter === category) return;
        
        this.currentFilter = category;
        this.currentIndex = 0;
        
        // Update active filter tab with smooth animation
        this.filterTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
                
                // Add feedback animation
                this.createTabFeedback(tab);
            }
        });
        
        // Smooth filter transition
        this.animateFilterTransition(category);
        this.announceFilterChange(category);
    }
    
    createTabFeedback(tab) {
        const feedback = document.createElement('div');
        feedback.className = 'tab-feedback';
        feedback.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--gradient-primary);
            border-radius: var(--radius-full);
            opacity: 0.2;
            transform: scale(1.2);
            animation: tabFeedback 0.3s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        tab.style.position = 'relative';
        tab.appendChild(feedback);
        
        // Add CSS animation if not exists
        if (!document.querySelector('#tab-feedback-animation')) {
            const style = document.createElement('style');
            style.id = 'tab-feedback-animation';
            style.textContent = `
                @keyframes tabFeedback {
                    0% { opacity: 0.2; transform: scale(1.2); }
                    50% { opacity: 0.4; transform: scale(1.1); }
                    100% { opacity: 0; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }
    
    animateFilterTransition(category) {
        this.isAnimating = true;
        
        // Quick fade out
        this.cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(15px)';
            }, index * 30);
        });
        
        setTimeout(() => {
            // Update filtered cards
            if (category === 'all') {
                this.filteredCards = [...this.cards];
            } else {
                this.filteredCards = [...this.cards].filter(card => 
                    card.dataset.category === category
                );
            }
            
            // Hide/show cards
            this.cards.forEach(card => {
                if (this.filteredCards.includes(card)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Quick fade in
            this.filteredCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 30);
            });
            
            // Update carousel
            this.generateIndicators();
            this.updateCarousel();
            this.updatePulseHint();
            this.isAnimating = false;
            
        }, this.cards.length * 30 + 100);
    }
    
    generateIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        
        const totalSlides = Math.ceil(this.filteredCards.length / this.visibleCards);
        
        if (totalSlides <= 1) {
            this.indicatorsContainer.style.display = 'none';
            return;
        }
        
        this.indicatorsContainer.style.display = 'flex';
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator-modern';
            indicator.setAttribute('aria-label', `Go to slide ${i + 1} of ${totalSlides}`);
            
            indicator.addEventListener('click', () => {
                this.handleUserInteraction();
                this.goToSlide(i * this.visibleCards);
            });
            
            this.indicatorsContainer.appendChild(indicator);
        }
        
        this.updateIndicators();
    }
    
    updateCarousel() {
        if (this.filteredCards.length === 0) return;
        
        const maxIndex = Math.max(0, this.filteredCards.length - this.visibleCards);
        this.currentIndex = Math.min(this.currentIndex, maxIndex);
        
        // Calculate transform with smooth easing
        const cardWidth = this.getCardWidth();
        const gap = 24;
        const totalCardWidth = cardWidth + gap;
        const translateX = -this.currentIndex * totalCardWidth;
        
        this.track.style.transform = `translateX(${translateX}px)`;
        
        this.updateNavigationButtons();
        this.updateIndicators();
        this.updatePulseHint();
        this.announceSlideChange();
    }
    
    getCardWidth() {
        if (this.visibleCards === 3) {
            return (this.track.parentElement.offsetWidth - 48) / 3; // 3 cards with gaps
        } else if (this.visibleCards === 2) {
            return 320;
        } else {
            return 280;
        }
    }
    
    updateNavigationButtons() {
        const maxIndex = Math.max(0, this.filteredCards.length - this.visibleCards);
        
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex <= 0;
            this.prevBtn.style.opacity = this.currentIndex <= 0 ? '0.4' : '1';
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= maxIndex;
            this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.4' : '1';
        }
    }
    
    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator-modern');
        const activeIndicatorIndex = Math.floor(this.currentIndex / this.visibleCards);
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndicatorIndex);
            indicator.setAttribute('aria-pressed', index === activeIndicatorIndex ? 'true' : 'false');
        });
    }
    
    updatePulseHint() {
        if (!this.nextBtn) return;
        
        const maxIndex = Math.max(0, this.filteredCards.length - this.visibleCards);
        const hasMoreContent = this.currentIndex < maxIndex;
        
        if (hasMoreContent && !this.hasUserInteracted && this.isInViewport()) {
            this.nextBtn.classList.add('pulse-hint');
        } else {
            this.nextBtn.classList.remove('pulse-hint');
        }
    }
    
    removePulseHint() {
        if (this.nextBtn) {
            this.nextBtn.classList.remove('pulse-hint');
        }
    }
    
    goToNext() {
        if (this.isAnimating) return;
        
        const maxIndex = Math.max(0, this.filteredCards.length - this.visibleCards);
        
        if (this.currentIndex < maxIndex) {
            this.currentIndex = Math.min(this.currentIndex + this.visibleCards, maxIndex);
        } else if (this.filteredCards.length > this.visibleCards) {
            // Loop to beginning
            this.currentIndex = 0;
        }
        
        this.updateCarousel();
        this.createNavFeedback(this.nextBtn);
    }
    
    goToPrevious() {
        if (this.isAnimating) return;
        
        if (this.currentIndex > 0) {
            this.currentIndex = Math.max(this.currentIndex - this.visibleCards, 0);
        } else {
            // Loop to end
            const maxIndex = Math.max(0, this.filteredCards.length - this.visibleCards);
            this.currentIndex = maxIndex;
        }
        
        this.updateCarousel();
        this.createNavFeedback(this.prevBtn);
    }
    
    goToSlide(index) {
        if (this.isAnimating) return;
        
        const maxIndex = Math.max(0, this.filteredCards.length - this.visibleCards);
        this.currentIndex = Math.min(Math.max(index, 0), maxIndex);
        
        this.updateCarousel();
    }
    
    createNavFeedback(button) {
        const ripple = button.querySelector('.nav-ripple');
        if (ripple) {
            ripple.style.width = '0';
            ripple.style.height = '0';
            
            setTimeout(() => {
                ripple.style.width = '120px';
                ripple.style.height = '120px';
            }, 10);
            
            setTimeout(() => {
                ripple.style.width = '0';
                ripple.style.height = '0';
            }, 600);
        }
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        const threshold = 50;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            this.handleUserInteraction();
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = Math.abs(currentX - startX);
            const deltaY = Math.abs(currentY - startY);
            
            if (deltaX > deltaY && deltaX > 20) {
                e.preventDefault();
            }
        }, { passive: false });
        
        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const deltaX = startX - endX;
            
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    this.goToNext();
                } else {
                    this.goToPrevious();
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            const isCarouselFocused = document.querySelector('.services-carousel-modern')?.contains(activeElement);
            
            if (!isCarouselFocused) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.handleUserInteraction();
                    this.goToPrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.handleUserInteraction();
                    this.goToNext();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.handleUserInteraction();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.handleUserInteraction();
                    const maxIndex = Math.max(0, this.filteredCards.length - this.visibleCards);
                    this.goToSlide(maxIndex);
                    break;
            }
        });
    }
    
    startAutoplay() {
        if (this.autoplayInterval || this.hasUserInteracted) return;
        if (this.filteredCards.length <= this.visibleCards) return;
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isPaused && this.isInViewport()) {
                this.goToNext();
            }
        }, this.autoplayDelay);
    }
    
    pauseAutoplay() {
        this.isPaused = true;
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resumeAutoplay() {
        this.isPaused = false;
        if (!this.hasUserInteracted && this.filteredCards.length > this.visibleCards) {
            this.startAutoplay();
        }
    }
    
    isInViewport() {
        const carousel = document.querySelector('.services-carousel-modern');
        if (!carousel) return false;
        
        const rect = carousel.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
    }
    
    announceFilterChange(category) {
        const liveRegion = this.getLiveRegion();
        const categoryNames = {
            'all': 'All Services',
            'individual': 'Individual Therapy',
            'family': 'Family and Legal Services',
            'specialized': 'Specialized Care'
        };
        
        liveRegion.textContent = `Showing ${categoryNames[category] || category} services. ${this.filteredCards.length} services available.`;
    }
    
    announceSlideChange() {
        const liveRegion = this.getLiveRegion();
        const totalSlides = Math.ceil(this.filteredCards.length / this.visibleCards);
        const currentSlide = Math.floor(this.currentIndex / this.visibleCards) + 1;
        
        if (totalSlides > 1) {
            liveRegion.textContent = `Viewing slide ${currentSlide} of ${totalSlides}`;
        }
    }
    
    getLiveRegion() {
        let liveRegion = document.getElementById('services-live-region');
        
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'services-live-region';
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
        
        return liveRegion;
    }
    
    destroy() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
        
        if (this.userInteractionTimeout) {
            clearTimeout(this.userInteractionTimeout);
        }
        
        if (this.observer) {
            this.observer.disconnect();
        }
        
        console.log('Enhanced Services carousel destroyed');
    }
}

/* ========================================
   ENHANCED CARD INTERACTIONS
   ======================================== */

class EnhancedServiceCardInteractions {
    constructor() {
        this.cards = document.querySelectorAll('.service-card-modern');
        this.init();
    }
    
    init() {
        this.setupCardInteractions();
        this.setupAccessibilityFeatures();
        this.setupAnimations();
    }
    
    setupCardInteractions() {
        this.cards.forEach((card, index) => {
            const learnMoreBtn = card.querySelector('.learn-more-btn');
            
            if (learnMoreBtn) {
                learnMoreBtn.addEventListener('click', (e) => {
                    this.handleLearnMoreClick(e, card);
                });
            }
            
            // Enhanced hover interactions
            card.addEventListener('mouseenter', () => {
                this.addCardHoverEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeCardHoverEffect(card);
            });
            
            // Focus management
            card.setAttribute('tabindex', '0');
            card.addEventListener('focus', () => {
                this.addCardFocusEffect(card);
            });
            
            card.addEventListener('blur', () => {
                this.removeCardFocusEffect(card);
            });
            
            // Entrance animations
            this.setupCardAnimation(card, index);
        });
    }
    
    handleLearnMoreClick(e, card) {
        const button = e.currentTarget;
        const serviceTitle = card.querySelector('.service-title').textContent;
        
        // Enhanced click feedback
        this.createEnhancedRipple(button, e);
        
        // Button state animation
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i><span>Loading...</span>';
        button.style.pointerEvents = 'none';
        
        // Add spinner animation if not exists
        if (!document.querySelector('#spinner-animation')) {
            const style = document.createElement('style');
            style.id = 'spinner-animation';
            style.textContent = `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.pointerEvents = 'auto';
        }, 1000);
        
        this.announceAction(`Loading more information about ${serviceTitle}`);
    }
    
    createEnhancedRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2.5;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
            width: 0;
            height: 0;
            left: ${event.clientX - rect.left}px;
            top: ${event.clientY - rect.top}px;
            transform: translate(-50%, -50%);
            animation: enhancedRipple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Add enhanced ripple animation
        if (!document.querySelector('#enhanced-ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'enhanced-ripple-animation';
            style.textContent = `
                @keyframes enhancedRipple {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 0.6;
                    }
                    50% {
                        width: ${size}px;
                        height: ${size}px;
                        opacity: 0.3;
                    }
                    100% {
                        width: ${size * 1.2}px;
                        height: ${size * 1.2}px;
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
        }, 800);
    }
    
    addCardHoverEffect(card) {
        const features = card.querySelectorAll('.service-features li');
        const icon = card.querySelector('.service-icon-modern');
        
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateX(10px)';
                feature.style.color = 'var(--gray-800)';
            }, index * 40);
        });
        
        if (icon) {
            icon.style.animation = 'float-icon 3s ease-in-out infinite';
        }
    }
    
    removeCardHoverEffect(card) {
        const features = card.querySelectorAll('.service-features li');
        const icon = card.querySelector('.service-icon-modern');
        
        features.forEach(feature => {
            feature.style.transform = '';
            feature.style.color = '';
        });
        
        if (icon) {
            icon.style.animation = '';
        }
    }
    
    addCardFocusEffect(card) {
        card.style.outline = '3px solid var(--primary-green)';
        card.style.outlineOffset = '4px';
        this.addCardHoverEffect(card);
    }
    
    removeCardFocusEffect(card) {
        card.style.outline = 'none';
        this.removeCardHoverEffect(card);
    }
    
    setupCardAnimation(card, index) {
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
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        observer.observe(card);
    }
    
    setupAccessibilityFeatures() {
        this.cards.forEach(card => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const learnMoreBtn = card.querySelector('.learn-more-btn');
                    if (learnMoreBtn) {
                        learnMoreBtn.click();
                    }
                }
            });
        });
    }
    
    setupAnimations() {
        if (!document.querySelector('#enhanced-card-animations')) {
            const style = document.createElement('style');
            style.id = 'enhanced-card-animations';
            style.textContent = `
                @keyframes float-icon {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg) scale(1); 
                    }
                    33% { 
                        transform: translateY(-3px) rotate(2deg) scale(1.02); 
                    }
                    66% { 
                        transform: translateY(-1px) rotate(-1deg) scale(1.01); 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    announceAction(message) {
        const liveRegion = document.getElementById('services-live-region') || 
                          document.createElement('div');
        
        if (!liveRegion.id) {
            liveRegion.id = 'services-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = message;
    }
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
                    animateReviewStatsCounters();
                }
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
                    animateReviewStatsCounters();
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

function animateReviewStatsCounters() {
    const statNumbers = document.querySelectorAll('.review-stats .stat-number');
    
    statNumbers.forEach(statNumber => {
        const finalValue = statNumber.textContent;
        const isDecimal = finalValue.includes('.');
        const numericValue = parseFloat(finalValue);
        
        if (isNaN(numericValue)) return;
        
        let currentValue = 0;
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

function handleAboutResize() {
    // Recalculate animations for responsive changes
    const aboutSection = document.querySelector('.about-modern');
    if (aboutSection) {
        // Reset any absolute positioned elements
        const floatingShapes = document.querySelectorAll('.floating-shape');
        floatingShapes.forEach(shape => {
            shape.style.transform = '';
        });
    }
}

// Debounced resize handlers
const debouncedHeroResize = debounce(handleHeroResize, 250);
const debouncedAboutResize = debounce(handleAboutResize, 250);

window.addEventListener('resize', debouncedHeroResize);
window.addEventListener('resize', debouncedAboutResize);

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
function cleanupSite() {
    if (heroSlideInterval) {
        clearInterval(heroSlideInterval);
    }
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
    if (aboutObserver) {
        aboutObserver.disconnect();
    }
    
    // Clean up enhanced services carousel
    if (window.enhancedServicesCarousel) {
        window.enhancedServicesCarousel.destroy();
    }
    
    // Clear any other intervals or timeouts
    statsAnimated = false;
    aboutInitialized = false;
}

window.addEventListener('beforeunload', cleanupSite);

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

window.AboutSection = {
    init: initializeAboutSection,
    animateStats: initializeStatsCounter,
    cleanup: () => {
        if (aboutObserver) {
            aboutObserver.disconnect();
        }
        statsAnimated = false;
        aboutInitialized = false;
    }
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

// Enhanced Services Carousel API
window.EnhancedServicesAPI = {
    next: () => window.enhancedServicesCarousel?.goToNext(),
    previous: () => window.enhancedServicesCarousel?.goToPrevious(),
    goToSlide: (index) => window.enhancedServicesCarousel?.goToSlide(index),
    filter: (category) => window.enhancedServicesCarousel?.filterServices(category),
    pauseAutoplay: () => window.enhancedServicesCarousel?.pauseAutoplay(),
    resumeAutoplay: () => window.enhancedServicesCarousel?.resumeAutoplay(),
    getCurrentIndex: () => window.enhancedServicesCarousel?.currentIndex || 0,
    getCurrentFilter: () => window.enhancedServicesCarousel?.currentFilter || 'all',
    getTotalCards: () => window.enhancedServicesCarousel?.filteredCards.length || 0
};

/* ========================================
   FINAL INITIALIZATION
   ======================================== */
console.log('✅ Holistic Psychology Services complete enhanced website loaded successfully');
