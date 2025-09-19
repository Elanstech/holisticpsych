/* ==========================================================================
   HOLISTIC PSYCHOLOGICAL SERVICES - JAVASCRIPT
   Professional Mental Health Services - Manhattan, NY
   ========================================================================== */

'use strict';

/* ==========================================================================
   GLOBAL VARIABLES AND CONFIGURATION
   ========================================================================== */
const config = {
    typewriterSpeed: 100,
    typewriterDelay: 2000,
    heroBackgroundInterval: 8000,
    carouselAutoplayInterval: 6000,
    teamCarouselInterval: 8000,
    scrollThreshold: 100,
    animationDelay: 100,
    transitionDuration: 300
};

let isPageLoaded = false;
let servicesCarouselActive = true;
let teamCarouselActive = true;
let heroBackgroundIndex = 0;
let servicesCurrentSlide = 0;
let teamCurrentSlide = 0;

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */
const utils = {
    // Debounce function for performance optimization
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Smooth scroll to element
    scrollToElement: function(element, offset = 0) {
        if (!element) return;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    // Check if element is in viewport
    isInViewport: function(element, threshold = 0.1) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -threshold * windowHeight &&
            rect.left >= -threshold * windowWidth &&
            rect.bottom <= windowHeight + threshold * windowHeight &&
            rect.right <= windowWidth + threshold * windowWidth
        );
    },

    // Add CSS class with animation support
    addClass: function(element, className, delay = 0) {
        if (!element) return;
        setTimeout(() => {
            element.classList.add(className);
        }, delay);
    },

    // Remove CSS class
    removeClass: function(element, className) {
        if (!element) return;
        element.classList.remove(className);
    },

    // Toggle CSS class
    toggleClass: function(element, className) {
        if (!element) return;
        element.classList.toggle(className);
    }
};

/* ==========================================================================
   PAGE INITIALIZATION
   ========================================================================== */
const pageInit = {
    init: function() {
        this.setupEventListeners();
        this.initializeComponents();
        this.handlePageLoad();
    },

    setupEventListeners: function() {
        // Window events
        window.addEventListener('load', this.handlePageLoad.bind(this));
        window.addEventListener('resize', utils.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('scroll', utils.debounce(this.handleScroll.bind(this), 10));

        // Document events
        document.addEventListener('DOMContentLoaded', this.handleDOMLoaded.bind(this));
        document.addEventListener('click', this.handleGlobalClick.bind(this));
    },

    initializeComponents: function() {
        headerNav.init();
        heroSection.init();
        servicesCarousel.init();
        teamCarousel.init();
        contactForm.init();
        floatingElements.init();
        scrollAnimations.init();
        mobileOptimizations.init();
    },

    handlePageLoad: function() {
        isPageLoaded = true;
        document.body.classList.add('page-loaded');
        this.preloadImages();
        this.initLazyLoading();
    },

    handleDOMLoaded: function() {
        document.body.classList.add('dom-loaded');
    },

    handleResize: function() {
        mobileOptimizations.handleResize();
        servicesCarousel.handleResize();
        teamCarousel.handleResize();
        headerNav.handleResize();
    },

    handleScroll: function() {
        headerNav.handleScroll();
        scrollAnimations.handleScroll();
        floatingElements.handleScroll();
    },

    handleGlobalClick: function(e) {
        // Close mobile menu if clicking outside
        if (!e.target.closest('.mobile-menu-panel') && !e.target.closest('.mobile-menu-toggle')) {
            headerNav.closeMobileMenu();
        }
        
        // Close contact options if clicking outside
        if (!e.target.closest('.contact-fab-container')) {
            floatingElements.closeContactOptions();
        }
    },

    preloadImages: function() {
        const images = [
            'logo copy.png',
            'https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg',
            'https://dougpsychassociates.com/doug.jpeg',
            'https://images.unsplash.com/photo-1594824804732-ca8db2fdc7c3',
            'https://southeastbehavioral.com/wp-content/uploads/2023/03/Adolescents-1.jpg',
            'https://i0.wp.com/davenportpsychology.com/wp-content/uploads/2021/10/individual-therapy.jpeg',
            'https://www.capitalpsychologyclinic.com/images/family-counselling.jpg',
            'https://hosparushealth.org/wp-content/uploads/2020/07/GettyImages-946927056_sm-1024x705.jpg'
        ];

        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    },

    initLazyLoading: function() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src;
                        img.classList.remove('loading');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                imageObserver.observe(img);
                img.classList.add('loading');
            });
        }
    }
};

/* ==========================================================================
   HEADER AND NAVIGATION
   ========================================================================== */
const headerNav = {
    elements: {},
    isScrolled: false,
    isMobileMenuOpen: false,

    init: function() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupNavigation();
    },

    cacheElements: function() {
        this.elements = {
            header: document.getElementById('header'),
            mobileMenuToggle: document.getElementById('mobileMenuToggle'),
            scrollHamburgerToggle: document.getElementById('scrollHamburgerToggle'),
            mobileMenuOverlay: document.getElementById('mobileMenuOverlay'),
            mobileMenuPanel: document.getElementById('mobileMenuPanel'),
            mobileMenuClose: document.getElementById('mobileMenuClose'),
            navLinks: document.querySelectorAll('.nav-link'),
            mobileNavLinks: document.querySelectorAll('.mobile-nav-link')
        };
    },

    setupEventListeners: function() {
        // Mobile menu toggles
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        if (this.elements.scrollHamburgerToggle) {
            this.elements.scrollHamburgerToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        if (this.elements.mobileMenuClose) {
            this.elements.mobileMenuClose.addEventListener('click', this.closeMobileMenu.bind(this));
        }

        if (this.elements.mobileMenuOverlay) {
            this.elements.mobileMenuOverlay.addEventListener('click', this.closeMobileMenu.bind(this));
        }

        // Navigation links
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        this.elements.mobileNavLinks.forEach(link => {
            link.addEventListener('click', this.handleMobileNavClick.bind(this));
        });
    },

    setupNavigation: function() {
        // Set active navigation based on current page
        const currentPage = window.location.pathname;
        this.updateActiveNav(currentPage);
    },

    handleScroll: function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldBeScrolled = scrollTop > config.scrollThreshold;

        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            utils.toggleClass(this.elements.header, 'scrolled');
        }

        // Update active section based on scroll position
        this.updateActiveSection();
    },

    handleResize: function() {
        // Close mobile menu on large screens
        if (window.innerWidth > 1200 && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    },

    toggleMobileMenu: function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    openMobileMenu: function() {
        this.isMobileMenuOpen = true;
        utils.addClass(this.elements.mobileMenuToggle, 'active');
        utils.addClass(this.elements.scrollHamburgerToggle, 'active');
        utils.addClass(this.elements.mobileMenuOverlay, 'active');
        utils.addClass(this.elements.mobileMenuPanel, 'active');
        document.body.style.overflow = 'hidden';
    },

    closeMobileMenu: function() {
        this.isMobileMenuOpen = false;
        utils.removeClass(this.elements.mobileMenuToggle, 'active');
        utils.removeClass(this.elements.scrollHamburgerToggle, 'active');
        utils.removeClass(this.elements.mobileMenuOverlay, 'active');
        utils.removeClass(this.elements.mobileMenuPanel, 'active');
        document.body.style.overflow = '';
    },

    handleNavClick: function(e) {
        const href = e.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                utils.scrollToElement(targetElement, 120);
                this.updateActiveNav(href);
            }
        }
    },

    handleMobileNavClick: function(e) {
        this.handleNavClick(e);
        this.closeMobileMenu();
    },

    updateActiveNav: function(activeHref) {
        // Update desktop nav
        this.elements.navLinks.forEach(link => {
            utils.removeClass(link, 'active');
            if (link.getAttribute('href') === activeHref) {
                utils.addClass(link, 'active');
            }
        });

        // Update mobile nav
        this.elements.mobileNavLinks.forEach(link => {
            utils.removeClass(link, 'active');
            if (link.getAttribute('href') === activeHref) {
                utils.addClass(link, 'active');
            }
        });
    },

    updateActiveSection: function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollTop = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                this.updateActiveNav(`#${sectionId}`);
            }
        });
    }
};

/* ==========================================================================
   HERO SECTION
   ========================================================================== */
const heroSection = {
    elements: {},
    typewriterTexts: [
        "Compassionate mental health care in Manhattan",
        "Your journey to wellness starts here",
        "Professional therapy for individuals and families",
        "Creating safe spaces for healing and growth"
    ],
    currentTextIndex: 0,
    currentCharIndex: 0,
    isTyping: true,

    init: function() {
        this.cacheElements();
        this.setupEventListeners();
        this.startTypewriterEffect();
        this.startBackgroundTransition();
        this.initScrollIndicator();
    },

    cacheElements: function() {
        this.elements = {
            typewriterText: document.getElementById('typewriterText'),
            heroBackgrounds: document.querySelectorAll('.hero-bg-image'),
            scrollIndicator: document.querySelector('.scroll-indicator'),
            heroLogoContainer: document.querySelector('.hero-logo-container')
        };
    },

    setupEventListeners: function() {
        if (this.elements.scrollIndicator) {
            this.elements.scrollIndicator.addEventListener('click', this.handleScrollClick.bind(this));
        }

        if (this.elements.heroLogoContainer) {
            this.elements.heroLogoContainer.addEventListener('click', this.handleLogoClick.bind(this));
        }
    },

    startTypewriterEffect: function() {
        if (!this.elements.typewriterText) return;

        const typeWriter = () => {
            const currentText = this.typewriterTexts[this.currentTextIndex];
            
            if (this.isTyping) {
                if (this.currentCharIndex < currentText.length) {
                    this.elements.typewriterText.textContent = currentText.substring(0, this.currentCharIndex + 1);
                    this.currentCharIndex++;
                    setTimeout(typeWriter, config.typewriterSpeed);
                } else {
                    this.isTyping = false;
                    setTimeout(typeWriter, config.typewriterDelay);
                }
            } else {
                if (this.currentCharIndex > 0) {
                    this.elements.typewriterText.textContent = currentText.substring(0, this.currentCharIndex - 1);
                    this.currentCharIndex--;
                    setTimeout(typeWriter, config.typewriterSpeed / 2);
                } else {
                    this.isTyping = true;
                    this.currentTextIndex = (this.currentTextIndex + 1) % this.typewriterTexts.length;
                    setTimeout(typeWriter, config.typewriterSpeed);
                }
            }
        };

        typeWriter();
    },

    startBackgroundTransition: function() {
        if (!this.elements.heroBackgrounds.length) return;

        setInterval(() => {
            // Remove active class from current background
            utils.removeClass(this.elements.heroBackgrounds[heroBackgroundIndex], 'active');
            
            // Move to next background
            heroBackgroundIndex = (heroBackgroundIndex + 1) % this.elements.heroBackgrounds.length;
            
            // Add active class to new background
            utils.addClass(this.elements.heroBackgrounds[heroBackgroundIndex], 'active');
        }, config.heroBackgroundInterval);
    },

    initScrollIndicator: function() {
        // Add entrance animation to scroll indicator
        if (this.elements.scrollIndicator) {
            setTimeout(() => {
                utils.addClass(this.elements.scrollIndicator, 'visible');
            }, 4000);
        }
    },

    handleScrollClick: function(e) {
        e.preventDefault();
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            utils.scrollToElement(aboutSection, 120);
        }
    },

    handleLogoClick: function(e) {
        e.preventDefault();
        // Add a subtle bounce animation
        utils.addClass(this.elements.heroLogoContainer, 'clicked');
        setTimeout(() => {
            utils.removeClass(this.elements.heroLogoContainer, 'clicked');
        }, 600);
    }
};

/* ==========================================================================
   SERVICES CAROUSEL
   ========================================================================== */
const servicesCarousel = {
    elements: {},
    totalSlides: 4,
    autoplayTimer: null,

    init: function() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupIndicators();
        this.startAutoplay();
        this.updateCarousel();
    },

    cacheElements: function() {
        this.elements = {
            track: document.getElementById('carouselTrack'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            prevMobile: document.getElementById('prevMobile'),
            nextMobile: document.getElementById('nextMobile'),
            indicators: document.querySelectorAll('.carousel-indicators .indicator'),
            cards: document.querySelectorAll('.service-carousel-card')
        };
    },

    setupEventListeners: function() {
        // Desktop navigation
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', this.previousSlide.bind(this));
        }
        
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', this.nextSlide.bind(this));
        }

        // Mobile navigation
        if (this.elements.prevMobile) {
            this.elements.prevMobile.addEventListener('click', this.previousSlide.bind(this));
        }
        
        if (this.elements.nextMobile) {
            this.elements.nextMobile.addEventListener('click', this.nextSlide.bind(this));
        }

        // Indicators
        this.elements.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch/swipe support
        if (this.elements.track) {
            this.setupTouchEvents();
        }

        // Pause autoplay on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', this.pauseAutoplay.bind(this));
            carouselContainer.addEventListener('mouseleave', this.resumeAutoplay.bind(this));
        }
    },

    setupTouchEvents: function() {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        let threshold = 150;
        let restraint = 100;

        this.elements.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        });

        this.elements.track.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        this.elements.track.addEventListener('touchend', (e) => {
            distX = e.changedTouches[0].pageX - startX;
            distY = e.changedTouches[0].pageY - startY;

            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    },

    setupIndicators: function() {
        this.updateIndicators();
    },

    previousSlide: function() {
        servicesCurrentSlide = servicesCurrentSlide > 0 ? servicesCurrentSlide - 1 : this.totalSlides - 1;
        this.updateCarousel();
        this.resetAutoplay();
    },

    nextSlide: function() {
        servicesCurrentSlide = (servicesCurrentSlide + 1) % this.totalSlides;
        this.updateCarousel();
        this.resetAutoplay();
    },

    goToSlide: function(index) {
        servicesCurrentSlide = index;
        this.updateCarousel();
        this.resetAutoplay();
    },

    updateCarousel: function() {
        if (!this.elements.track) return;

        const translateX = -servicesCurrentSlide * 25;
        this.elements.track.style.transform = `translateX(${translateX}%)`;
        this.updateIndicators();
    },

    updateIndicators: function() {
        this.elements.indicators.forEach((indicator, index) => {
            if (index === servicesCurrentSlide) {
                utils.addClass(indicator, 'active');
            } else {
                utils.removeClass(indicator, 'active');
            }
        });
    },

    startAutoplay: function() {
        if (!servicesCarouselActive) return;
        
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, config.carouselAutoplayInterval);
    },

    pauseAutoplay: function() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
        }
    },

    resumeAutoplay: function() {
        this.startAutoplay();
    },

    resetAutoplay: function() {
        this.pauseAutoplay();
        this.startAutoplay();
    },

    handleResize: function() {
        this.updateCarousel();
    }
};

/* ==========================================================================
   TEAM CAROUSEL
   ========================================================================== */
const teamCarousel = {
    elements: {},
    totalSlides: 6,
    autoplayTimer: null,

    init: function() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupIndicators();
        this.startAutoplay();
        this.updateCarousel();
        this.updateProgressBar();
    },

    cacheElements: function() {
        this.elements = {
            track: document.getElementById('teamCarouselTrack'),
            prevBtn: document.getElementById('teamPrevBtn'),
            nextBtn: document.getElementById('teamNextBtn'),
            indicators: document.querySelectorAll('.slide-indicators .indicator'),
            slides: document.querySelectorAll('.team-slide'),
            progressBar: document.getElementById('progressBar')
        };
    },

    setupEventListeners: function() {
        // Navigation buttons
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', this.previousSlide.bind(this));
        }
        
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', this.nextSlide.bind(this));
        }

        // Indicators
        this.elements.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch/swipe support
        if (this.elements.track) {
            this.setupTouchEvents();
        }

        // Pause autoplay on hover
        const teamCarouselMain = document.getElementById('teamCarousel');
        if (teamCarouselMain) {
            teamCarouselMain.addEventListener('mouseenter', this.pauseAutoplay.bind(this));
            teamCarouselMain.addEventListener('mouseleave', this.resumeAutoplay.bind(this));
        }

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    },

    setupTouchEvents: function() {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        let threshold = 100;
        let restraint = 100;

        this.elements.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        });

        this.elements.track.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        this.elements.track.addEventListener('touchend', (e) => {
            distX = e.changedTouches[0].pageX - startX;
            distY = e.changedTouches[0].pageY - startY;

            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    },

    setupIndicators: function() {
        this.updateIndicators();
    },

    handleKeyboard: function(e) {
        const teamSection = document.getElementById('team');
        if (!utils.isInViewport(teamSection, 0.3)) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.previousSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextSlide();
        }
    },

    previousSlide: function() {
        teamCurrentSlide = teamCurrentSlide > 0 ? teamCurrentSlide - 1 : this.totalSlides - 1;
        this.updateCarousel();
        this.resetAutoplay();
    },

    nextSlide: function() {
        teamCurrentSlide = (teamCurrentSlide + 1) % this.totalSlides;
        this.updateCarousel();
        this.resetAutoplay();
    },

    goToSlide: function(index) {
        teamCurrentSlide = index;
        this.updateCarousel();
        this.resetAutoplay();
    },

    updateCarousel: function() {
        if (!this.elements.track) return;

        const translateX = -teamCurrentSlide * 100;
        this.elements.track.style.transform = `translateX(${translateX}%)`;
        
        this.updateSlideStates();
        this.updateIndicators();
        this.updateProgressBar();
    },

    updateSlideStates: function() {
        this.elements.slides.forEach((slide, index) => {
            if (index === teamCurrentSlide) {
                utils.addClass(slide, 'active');
            } else {
                utils.removeClass(slide, 'active');
            }
        });
    },

    updateIndicators: function() {
        this.elements.indicators.forEach((indicator, index) => {
            if (index === teamCurrentSlide) {
                utils.addClass(indicator, 'active');
            } else {
                utils.removeClass(indicator, 'active');
            }
        });
    },

    updateProgressBar: function() {
        if (!this.elements.progressBar) return;
        
        const progressPercentage = ((teamCurrentSlide + 1) / this.totalSlides) * 100;
        this.elements.progressBar.style.width = `${progressPercentage}%`;
    },

    startAutoplay: function() {
        if (!teamCarouselActive) return;
        
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, config.teamCarouselInterval);
    },

    pauseAutoplay: function() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
        }
    },

    resumeAutoplay: function() {
        this.startAutoplay();
    },

    resetAutoplay: function() {
        this.pauseAutoplay();
        this.startAutoplay();
    },

    handleResize: function() {
        this.updateCarousel();
    }
};

/* ==========================================================================
   CONTACT FORM
   ========================================================================== */
const contactForm = {
    elements: {},
    isSubmitting: false,

    init: function() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupValidation();
    },

    cacheElements: function() {
        this.elements = {
            form: document.getElementById('contactForm'),
            nameField: document.getElementById('name'),
            emailField: document.getElementById('email'),
            phoneField: document.getElementById('phone'),
            serviceField: document.getElementById('service'),
            messageField: document.getElementById('message'),
            submitBtn: document.querySelector('.btn-submit')
        };
    },

    setupEventListeners: function() {
        if (this.elements.form) {
            this.elements.form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        // Real-time validation
        Object.values(this.elements).forEach(element => {
            if (element && element.tagName && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT')) {
                element.addEventListener('blur', this.validateField.bind(this));
                element.addEventListener('input', this.clearErrors.bind(this));
            }
        });
    },

    setupValidation: function() {
        // Add custom validation styles
        this.addValidationStyles();
    },

    addValidationStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .form-group.error input,
            .form-group.error textarea,
            .form-group.error select {
                border-color: #ef4444;
                background-color: #fef2f2;
            }
            
            .form-group.success input,
            .form-group.success textarea,
            .form-group.success select {
                border-color: var(--primary-green);
                background-color: #f0fdf4;
            }
            
            .error-message {
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            }
        `;
        document.head.appendChild(style);
    },

    validateField: function(e) {
        const field = e.target;
        const fieldContainer = field.closest('.form-group');
        const fieldName = field.name;
        const fieldValue = field.value.trim();

        this.clearFieldError(fieldContainer);

        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!fieldValue) {
                    isValid = false;
                    errorMessage = 'Name is required';
                } else if (fieldValue.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!fieldValue) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!emailRegex.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                if (fieldValue) {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    const cleanPhone = fieldValue.replace(/\D/g, '');
                    if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number';
                    }
                }
                break;

            case 'message':
                if (fieldValue && fieldValue.length > 1000) {
                    isValid = false;
                    errorMessage = 'Message must be less than 1000 characters';
                }
                break;
        }

        if (isValid) {
            utils.addClass(fieldContainer, 'success');
            utils.removeClass(fieldContainer, 'error');
        } else {
            utils.addClass(fieldContainer, 'error');
            utils.removeClass(fieldContainer, 'success');
            this.showFieldError(fieldContainer, errorMessage);
        }

        return isValid;
    },

    clearErrors: function(e) {
        const fieldContainer = e.target.closest('.form-group');
        this.clearFieldError(fieldContainer);
        utils.removeClass(fieldContainer, 'error');
        utils.removeClass(fieldContainer, 'success');
    },

    clearFieldError: function(fieldContainer) {
        const existingError = fieldContainer.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    },

    showFieldError: function(fieldContainer, message) {
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        fieldContainer.appendChild(errorElement);
    },

    validateForm: function() {
        let isValid = true;
        const requiredFields = [this.elements.nameField, this.elements.emailField];

        requiredFields.forEach(field => {
            if (field) {
                const fieldValid = this.validateField({ target: field });
                if (!fieldValid) {
                    isValid = false;
                }
            }
        });

        // Validate optional fields if they have values
        [this.elements.phoneField, this.elements.messageField].forEach(field => {
            if (field && field.value.trim()) {
                const fieldValid = this.validateField({ target: field });
                if (!fieldValid) {
                    isValid = false;
                }
            }
        });

        return isValid;
    },

    handleSubmit: function(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;

        if (!this.validateForm()) {
            this.showNotification('Please correct the errors above', 'error');
            return;
        }

        this.submitForm();
    },

    submitForm: function() {
        this.isSubmitting = true;
        this.updateSubmitButton(true);

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            this.handleSubmissionSuccess();
        }, 2000);
    },

    updateSubmitButton: function(isLoading) {
        if (!this.elements.submitBtn) return;

        if (isLoading) {
            this.elements.submitBtn.innerHTML = `
                <span>Sending...</span>
                <i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i>
            `;
            this.elements.submitBtn.disabled = true;
        } else {
            this.elements.submitBtn.innerHTML = `
                <span>Send Message</span>
                <i class="ri-send-plane-line"></i>
            `;
            this.elements.submitBtn.disabled = false;
        }
    },

    handleSubmissionSuccess: function() {
        this.isSubmitting = false;
        this.updateSubmitButton(false);
        this.showNotification('Thank you! Your message has been sent successfully.', 'success');
        this.resetForm();
    },

    handleSubmissionError: function() {
        this.isSubmitting = false;
        this.updateSubmitButton(false);
        this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    },

    resetForm: function() {
        if (this.elements.form) {
            this.elements.form.reset();
            
            // Clear validation states
            const formGroups = this.elements.form.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                utils.removeClass(group, 'success');
                utils.removeClass(group, 'error');
                this.clearFieldError(group);
            });
        }
    },

    showNotification: function(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="ri-close-line"></i>
            </button>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;

        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, var(--primary-green), var(--primary-blue))';
        } else {
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Set up close functionality
        const closeBtn = notification.querySelector('.notification-close');
        const closeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };

        closeBtn.addEventListener('click', closeNotification);

        // Auto close after 5 seconds
        setTimeout(closeNotification, 5000);
    }
};

/* ==========================================================================
   FLOATING ELEMENTS
   ========================================================================== */
const floatingElements = {
    elements: {},
    isContactOptionsOpen: false,

    init: function() {
        this.cacheElements();
        this.setupEventListeners();
    },

    cacheElements: function() {
        this.elements = {
            backToTop: document.getElementById('backToTop'),
            contactFab: document.getElementById('contactFab'),
            contactOptions: document.getElementById('contactOptions')
        };
    },

    setupEventListeners: function() {
        if (this.elements.backToTop) {
            this.elements.backToTop.addEventListener('click', this.scrollToTop.bind(this));
        }

        if (this.elements.contactFab) {
            this.elements.contactFab.addEventListener('click', this.toggleContactOptions.bind(this));
        }
    },

    handleScroll: function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldShowBackToTop = scrollTop > 500;

        if (this.elements.backToTop) {
            if (shouldShowBackToTop) {
                utils.addClass(this.elements.backToTop, 'visible');
            } else {
                utils.removeClass(this.elements.backToTop, 'visible');
            }
        }
    },

    scrollToTop: function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    toggleContactOptions: function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isContactOptionsOpen) {
            this.closeContactOptions();
        } else {
            this.openContactOptions();
        }
    },

    openContactOptions: function() {
        this.isContactOptionsOpen = true;
        utils.addClass(this.elements.contactFab, 'active');
        utils.addClass(this.elements.contactOptions, 'active');
    },

    closeContactOptions: function() {
        this.isContactOptionsOpen = false;
        utils.removeClass(this.elements.contactFab, 'active');
        utils.removeClass(this.elements.contactOptions, 'active');
    }
};

/* ==========================================================================
   SCROLL ANIMATIONS
   ========================================================================== */
const scrollAnimations = {
    elements: {},
    animatedElements: new Set(),

    init: function() {
        this.cacheElements();
        this.setupIntersectionObserver();
        this.handleScroll(); // Initial check
    },

    cacheElements: function() {
        this.elements = {
            fadeInElements: document.querySelectorAll('.fade-in'),
            slideLeftElements: document.querySelectorAll('.slide-left'),
            slideRightElements: document.querySelectorAll('.slide-right')
        };
    },

    setupIntersectionObserver: function() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animateElement(entry.target);
                        this.animatedElements.add(entry.target);
                    }
                });
            }, observerOptions);

            // Observe all animation elements
            [...this.elements.fadeInElements, ...this.elements.slideLeftElements, ...this.elements.slideRightElements].forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            this.fallbackAnimation();
        }
    },

    animateElement: function(element) {
        // Add a small delay for staggered animations
        const delay = this.getAnimationDelay(element);
        
        setTimeout(() => {
            utils.addClass(element, 'visible');
        }, delay);
    },

    getAnimationDelay: function(element) {
        // Calculate delay based on element position for staggered effect
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.pageYOffset;
        const viewportHeight = window.innerHeight;
        
        // Base delay increases with distance from top of viewport
        return Math.min(elementTop / viewportHeight * 100, 500);
    },

    fallbackAnimation: function() {
        // Simple fallback animation for older browsers
        const allElements = [...this.elements.fadeInElements, ...this.elements.slideLeftElements, ...this.elements.slideRightElements];
        
        allElements.forEach((element, index) => {
            setTimeout(() => {
                utils.addClass(element, 'visible');
            }, index * 100);
        });
    },

    handleScroll: function() {
        // Additional scroll-based animations can be added here
        this.handleParallaxEffects();
    },

    handleParallaxEffects: function() {
        const scrollTop = window.pageYOffset;
        
        // Subtle parallax for hero decorations
        const floatElements = document.querySelectorAll('.float-element');
        floatElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.02);
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
};

/* ==========================================================================
   MOBILE OPTIMIZATIONS
   ========================================================================== */
const mobileOptimizations = {
    isMobile: false,
    isTablet: false,
    
    init: function() {
        this.detectDevice();
        this.setupTouchOptimizations();
        this.setupViewportOptimizations();
        this.handleResize();
    },

    detectDevice: function() {
        this.isMobile = window.innerWidth <= 767;
        this.isTablet = window.innerWidth <= 991 && window.innerWidth > 767;
        
        // Update body classes
        document.body.classList.toggle('is-mobile', this.isMobile);
        document.body.classList.toggle('is-tablet', this.isTablet);
    },

    setupTouchOptimizations: function() {
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Optimize touch targets
            this.optimizeTouchTargets();
            
            // Prevent zoom on input focus for iOS
            this.preventZoomOnFocus();
        }
    },

    optimizeTouchTargets: function() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 767px) {
                button, .btn, .nav-link, .contact-option {
                    min-height: 44px;
                    min-width: 44px;
                }
                
                .carousel-nav, .control-btn {
                    width: 48px;
                    height: 48px;
                }
                
                .mobile-nav-btn {
                    width: 44px;
                    height: 44px;
                }
            }
        `;
        document.head.appendChild(style);
    },

    preventZoomOnFocus: function() {
        // Prevent zoom on input focus for iOS
        const addMaximumScaleToMetaViewport = () => {
            const viewportMetaElement = document.querySelector('meta[name=viewport]');
            if (viewportMetaElement) {
                const content = viewportMetaElement.getAttribute('content');
                if (!content.includes('maximum-scale')) {
                    viewportMetaElement.setAttribute('content', content + ', maximum-scale=1.0');
                }
            }
        };

        const disableMaximumScale = () => {
            const viewportMetaElement = document.querySelector('meta[name=viewport]');
            if (viewportMetaElement) {
                const content = viewportMetaElement.getAttribute('content');
                viewportMetaElement.setAttribute('content', content.replace(/, maximum-scale=1\.0/g, ''));
            }
        };

        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', addMaximumScaleToMetaViewport);
            input.addEventListener('blur', disableMaximumScale);
        });
    },

    setupViewportOptimizations: function() {
        // Fix viewport height issues on mobile
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', utils.debounce(setViewportHeight, 100));
        window.addEventListener('orientationchange', utils.debounce(setViewportHeight, 100));
    },

    handleResize: function() {
        this.detectDevice();
        this.optimizeCarouselsForMobile();
        this.adjustSpacingForMobile();
    },

    optimizeCarouselsForMobile: function() {
        if (this.isMobile) {
            // Disable autoplay on mobile for better performance
            servicesCarouselActive = false;
            teamCarouselActive = false;
            
            // Clear any existing timers
            if (servicesCarousel.autoplayTimer) {
                clearInterval(servicesCarousel.autoplayTimer);
            }
            if (teamCarousel.autoplayTimer) {
                clearInterval(teamCarousel.autoplayTimer);
            }
        } else {
            // Re-enable autoplay on larger screens
            servicesCarouselActive = true;
            teamCarouselActive = true;
            
            servicesCarousel.startAutoplay();
            teamCarousel.startAutoplay();
        }
    },

    adjustSpacingForMobile: function() {
        // Dynamic spacing adjustments can be added here
        if (this.isMobile) {
            document.body.classList.add('mobile-spacing');
        } else {
            document.body.classList.remove('mobile-spacing');
        }
    }
};

/* ==========================================================================
   PERFORMANCE MONITORING
   ========================================================================== */
const performanceMonitor = {
    init: function() {
        this.monitorPageLoad();
        this.optimizeImages();
        this.setupErrorHandling();
    },

    monitorPageLoad: function() {
        window.addEventListener('load', () => {
            // Monitor performance
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData && perfData.loadEventEnd > 5000) {
                    console.warn('Page load time is slow:', perfData.loadEventEnd, 'ms');
                }
            }
        });
    },

    optimizeImages: function() {
        // Add loading optimization for images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add error handling for broken images
            img.addEventListener('error', function() {
                console.warn('Failed to load image:', this.src);
                this.style.display = 'none';
            });
        });
    },

    setupErrorHandling: function() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }
};

/* ==========================================================================
   ACCESSIBILITY ENHANCEMENTS
   ========================================================================== */
const accessibilityEnhancements = {
    init: function() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIA();
        this.setupReducedMotion();
    },

    setupKeyboardNavigation: function() {
        // Tab navigation for carousels
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    },

    handleTabNavigation: function(e) {
        // Ensure focus is visible for keyboard users
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('keyboard-focus');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('keyboard-focus');
            });
        });
    },

    setupFocusManagement: function() {
        // Manage focus for modal elements
        const mobileMenuPanel = document.getElementById('mobileMenuPanel');
        if (mobileMenuPanel) {
            const focusableElements = mobileMenuPanel.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                mobileMenuPanel.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey && document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        } else if (!e.shiftKey && document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                });
            }
        }
    },

    setupARIA: function() {
        // Dynamic ARIA updates
        this.updateCarouselARIA();
        this.updateMenuARIA();
    },

    updateCarouselARIA: function() {
        // Update ARIA attributes for carousels
        const serviceSlides = document.querySelectorAll('.service-carousel-card');
        serviceSlides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== servicesCurrentSlide ? 'true' : 'false');
        });

        const teamSlides = document.querySelectorAll('.team-slide');
        teamSlides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== teamCurrentSlide ? 'true' : 'false');
        });
    },

    updateMenuARIA: function() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuPanel = document.getElementById('mobileMenuPanel');
        
        if (mobileMenuToggle && mobileMenuPanel) {
            const isOpen = mobileMenuPanel.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
            mobileMenuPanel.setAttribute('aria-hidden', (!isOpen).toString());
        }
    },

    setupReducedMotion: function() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
            
            // Disable autoplay for reduced motion
            servicesCarouselActive = false;
            teamCarouselActive = false;
        }
    }
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    pageInit.init();
    performanceMonitor.init();
    accessibilityEnhancements.init();
    
    // Add CSS for additional styles
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .keyboard-focus {
            outline: 2px solid var(--primary-green) !important;
            outline-offset: 2px !important;
        }
        
        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .mobile-spacing {
            --space-xs: 0.125rem;
            --space-sm: 0.25rem;
            --space-md: 0.5rem;
            --space-lg: 0.75rem;
            --space-xl: 1rem;
            --space-2xl: 1.5rem;
            --space-3xl: 2rem;
            --space-4xl: 3rem;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .hero-logo-container.clicked {
            animation: logoClickBounce 0.6s ease;
        }
        
        @keyframes logoClickBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .loading {
            opacity: 0.7;
            filter: blur(1px);
        }
        
        img {
            transition: opacity 0.3s ease, filter 0.3s ease;
        }
    `;
    document.head.appendChild(additionalStyles);
    
    console.log('Holistic Psychological Services website initialized successfully');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        pageInit,
        headerNav,
        heroSection,
        servicesCarousel,
        teamCarousel,
        contactForm,
        floatingElements,
        scrollAnimations,
        mobileOptimizations,
        utils
    };
}
