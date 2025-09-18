/* ========================================
   HOLISTIC PSYCHOLOGICAL SERVICES - REORGANIZED BY SECTION
   Manhattan Mental Health - Professional Experience
   Organized by Website Sections for Easy Maintenance
   ======================================== */

/* ========================================
   CONFIGURATION & GLOBAL STATE
   ======================================== */
const CONFIG = {
    // Animation settings
    animations: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 100
    },
    
    // Scroll settings
    scroll: {
        offset: 100,
        threshold: 0.1
    },
    
    // Breakpoints
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },
    
    // Hero settings
    hero: {
        typewriter: {
            texts: [
                "Professional Mental Health Care in the Heart of Manhattan",
                "Compassionate Therapy for Individuals, Couples & Families",
                "Expert Psychological Services with Dr. Kristie Doheny & Dr. Doug Uhlig",
                "Evidence-Based Treatment with a Holistic Approach"
            ],
            typeSpeed: 80,
            deleteSpeed: 50,
            pauseDuration: 2000,
            cursorBlinkSpeed: 1000
        },
        background: {
            transitionDuration: 6000,
            images: [
                'https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg',
                'images/hero1.png',
                'https://images.unsplash.com/photo-1680458842367-0d47f573ca2b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            ]
        },
        backgroundTransitionDuration: 5000,
        overlayOpacity: 0.4,
        zoomScale: 1.1
    },
    
    // FAB settings
    fab: {
        showDelay: 1000
    }
};

// Global state management
const STATE = {
    isScrolled: false,
    isMobileMenuOpen: false,
    currentSection: 'home',
    observers: new Map(),
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    hero: {
        typewriterIndex: 0,
        typewriterPosition: 0,
        isTyping: true,
        typewriterTimeout: null,
        backgroundIndex: 0,
        backgroundInterval: null,
        isInitialized: false
    },
    scrollPosition: 0,
    isInitialized: false
};

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static isMobile() {
        return window.innerWidth < CONFIG.breakpoints.mobile;
    }

    static isTablet() {
        return window.innerWidth < CONFIG.breakpoints.tablet;
    }

    static isDesktop() {
        return window.innerWidth >= CONFIG.breakpoints.desktop;
    }

    static getOffsetTop(element) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.pageYOffset;
    }

    static smoothScrollTo(target) {
        const targetPosition = Utils.getOffsetTop(target) - CONFIG.scroll.offset;
        
        if (STATE.isReducedMotion) {
            window.scrollTo(0, targetPosition);
            return;
        }
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    static smoothScrollToTop() {
        if (STATE.isReducedMotion) {
            window.scrollTo(0, 0);
            return;
        }
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    static announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    static animateElement(element, className = 'fade-in', delay = 0) {
        if (STATE.isReducedMotion) {
            element.classList.add('visible');
            return;
        }
        
        setTimeout(() => {
            element.classList.add(className);
            element.classList.add('visible');
        }, delay);
    }

    static staggerAnimations(elements, className = 'fade-in', staggerDelay = CONFIG.animations.stagger) {
        elements.forEach((element, index) => {
            const delay = STATE.isReducedMotion ? 0 : index * staggerDelay;
            Utils.animateElement(element, className, delay);
        });
    }
}

/* ========================================
   HEADER & NAVIGATION SYSTEM
   ======================================== */
class HeaderController {
    constructor() {
        this.header = document.getElementById('header');
        this.isScrolled = false;
        this.scrollThreshold = 50;
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        if (this.header) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.checkScrollPosition();
        console.log('Header controller initialized');
    }
    
    bindEvents() {
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 16));
        
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    handleScroll() {
        const scrolled = window.scrollY > this.scrollThreshold;
        STATE.scrollPosition = window.scrollY;
        
        if (scrolled !== this.isScrolled) {
            this.isScrolled = scrolled;
            this.header.classList.toggle('scrolled', scrolled);
        }
        
        this.updateActiveNavigation();
    }
    
    handleResize() {
        this.checkScrollPosition();
    }
    
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = Utils.getOffsetTop(section) - CONFIG.scroll.offset;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.pageYOffset;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection && currentSection !== STATE.currentSection) {
            STATE.currentSection = currentSection;
            
            this.navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                link.classList.toggle('active', linkHref === `#${currentSection}`);
            });
        }
    }
    
    checkScrollPosition() {
        this.handleScroll();
    }

    destroy() {
        console.log('Header controller destroyed');
    }
}

/* ========================================
   MOBILE MENU SYSTEM
   ======================================== */
class MobileMenuController {
    constructor() {
        this.isOpen = false;
        this.isAnimating = false;
        
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.menuPanel = document.getElementById('mobileMenuPanel');
        this.menuOverlay = document.getElementById('mobileMenuOverlay');
        this.menuClose = document.getElementById('mobileMenuClose');
        this.scrollHamburger = document.getElementById('scrollHamburgerToggle');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
        this.body = document.body;
        
        if (this.menuToggle || this.scrollHamburger) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.setupAccessibility();
        this.syncActiveStates();
        console.log('Mobile menu controller initialized');
    }
    
    bindEvents() {
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        if (this.scrollHamburger) {
            this.scrollHamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }
        
        if (this.menuClose) {
            this.menuClose.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e, link);
            });
        });
        
        this.desktopNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    Utils.smoothScrollTo(targetSection);
                    this.updateActiveStates(targetId);
                }
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        window.addEventListener('resize', () => {
            if (window.innerWidth > CONFIG.breakpoints.desktop && this.isOpen) {
                this.closeMenu();
            }
        });
        
        if (this.menuPanel) {
            this.menuPanel.addEventListener('touchmove', (e) => {
                e.stopPropagation();
            });
        }
        
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('touchmove', (e) => {
                e.preventDefault();
            });
        }
    }
    
    setupAccessibility() {
        if (this.menuToggle) {
            this.menuToggle.setAttribute('aria-expanded', 'false');
            this.menuToggle.setAttribute('aria-controls', 'mobileMenuPanel');
        }
        
        if (this.scrollHamburger) {
            this.scrollHamburger.setAttribute('aria-expanded', 'false');
            this.scrollHamburger.setAttribute('aria-controls', 'mobileMenuPanel');
        }
        
        if (this.menuPanel) {
            this.menuPanel.setAttribute('aria-labelledby', 'mobileMenuToggle');
            this.menuPanel.setAttribute('role', 'dialog');
            this.menuPanel.setAttribute('aria-modal', 'true');
        }
        
        this.setupFocusTrap();
    }
    
    setupFocusTrap() {
        if (!this.menuPanel) return;
        
        const focusableElements = this.menuPanel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        this.firstFocusable = focusableElements[0];
        this.lastFocusable = focusableElements[focusableElements.length - 1];
        
        this.menuPanel.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isOpen) {
                if (e.shiftKey) {
                    if (document.activeElement === this.firstFocusable) {
                        e.preventDefault();
                        this.lastFocusable?.focus();
                    }
                } else {
                    if (document.activeElement === this.lastFocusable) {
                        e.preventDefault();
                        this.firstFocusable?.focus();
                    }
                }
            }
        });
    }
    
    toggleMenu() {
        if (this.isAnimating) return;
        
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        if (this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = true;
        STATE.isMobileMenuOpen = true;
        
        this.body.classList.add('menu-open');
        this.body.style.overflow = 'hidden';
        
        if (this.menuToggle) {
            this.menuToggle.classList.add('active');
            this.menuToggle.setAttribute('aria-expanded', 'true');
        }
        
        if (this.scrollHamburger) {
            this.scrollHamburger.classList.add('active');
            this.scrollHamburger.setAttribute('aria-expanded', 'true');
        }
        
        if (this.menuOverlay) {
            this.menuOverlay.classList.add('active');
        }
        
        if (this.menuPanel) {
            requestAnimationFrame(() => {
                this.menuPanel.classList.add('active');
                
                this.mobileNavLinks.forEach((link, index) => {
                    link.style.animation = 'none';
                    link.offsetHeight;
                    link.style.animation = `slideInFromRight 0.5s ease forwards`;
                    link.style.animationDelay = `${0.1 + (index * 0.05)}s`;
                });
            });
        }
        
        setTimeout(() => {
            this.isAnimating = false;
            if (this.menuClose) {
                this.menuClose.focus();
            }
            Utils.announceToScreenReader('Mobile menu opened');
        }, 400);
    }
    
    closeMenu() {
        if (!this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = false;
        STATE.isMobileMenuOpen = false;
        
        if (this.menuToggle) {
            this.menuToggle.classList.remove('active');
            this.menuToggle.setAttribute('aria-expanded', 'false');
        }
        
        if (this.scrollHamburger) {
            this.scrollHamburger.classList.remove('active');
            this.scrollHamburger.setAttribute('aria-expanded', 'false');
        }
        
        if (this.menuPanel) {
            this.menuPanel.classList.remove('active');
        }
        
        setTimeout(() => {
            if (this.menuOverlay) {
                this.menuOverlay.classList.remove('active');
            }
        }, 100);
        
        setTimeout(() => {
            this.body.classList.remove('menu-open');
            this.body.style.overflow = '';
            this.isAnimating = false;
            
            if (this.menuToggle && Utils.isMobile()) {
                this.menuToggle.focus();
            } else if (this.scrollHamburger && Utils.isDesktop()) {
                this.scrollHamburger.focus();
            }
            Utils.announceToScreenReader('Mobile menu closed');
        }, 400);
    }
    
    handleNavClick(event, link) {
        event.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            this.updateActiveStates(targetId);
            this.closeMenu();
            
            setTimeout(() => {
                Utils.smoothScrollTo(targetSection);
            }, 200);
        }
    }
    
    updateActiveStates(activeHref) {
        this.mobileNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === activeHref);
        });
        
        this.desktopNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === activeHref);
        });
    }
    
    syncActiveStates() {
        const activeDesktopLink = document.querySelector('.desktop-nav .nav-link.active');
        if (activeDesktopLink) {
            const activeHref = activeDesktopLink.getAttribute('href');
            this.updateActiveStates(activeHref);
        }
    }

    destroy() {
        this.closeMenu();
        console.log('Mobile menu controller destroyed');
    }
}

/* ========================================
   HERO SECTION
   ======================================== */

// Typewriter Effect Controller
class HeroTypewriterController {
    constructor(element) {
        this.element = element;
        this.texts = CONFIG.hero.typewriter.texts;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isInitialized = false;
        
        if (this.element) {
            this.init();
        }
    }
    
    init() {
        if (!this.element || this.isInitialized) return;
        
        this.element.textContent = '';
        this.isInitialized = true;
        
        setTimeout(() => {
            this.typeText();
        }, 1000);
        
        console.log('Hero typewriter effect initialized');
    }
    
    typeText() {
        if (STATE.isReducedMotion) {
            this.element.textContent = this.texts[0];
            return;
        }
        
        const currentText = this.texts[this.currentTextIndex];
        
        if (!this.isDeleting) {
            if (this.currentCharIndex < currentText.length) {
                this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
                this.currentCharIndex++;
                
                STATE.hero.typewriterTimeout = setTimeout(() => {
                    this.typeText();
                }, this.getTypeSpeed());
            } else {
                STATE.hero.typewriterTimeout = setTimeout(() => {
                    this.isDeleting = true;
                    this.typeText();
                }, CONFIG.hero.typewriter.pauseDuration);
            }
        } else {
            if (this.currentCharIndex > 0) {
                this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
                
                STATE.hero.typewriterTimeout = setTimeout(() => {
                    this.typeText();
                }, CONFIG.hero.typewriter.deleteSpeed);
            } else {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                
                STATE.hero.typewriterTimeout = setTimeout(() => {
                    this.typeText();
                }, 500);
            }
        }
    }
    
    getTypeSpeed() {
        const baseSpeed = CONFIG.hero.typewriter.typeSpeed;
        const variance = baseSpeed * 0.3;
        return baseSpeed + (Math.random() * variance - variance / 2);
    }
    
    pause() {
        if (STATE.hero.typewriterTimeout) {
            clearTimeout(STATE.hero.typewriterTimeout);
            STATE.hero.typewriterTimeout = null;
        }
    }
    
    resume() {
        if (!STATE.hero.typewriterTimeout && this.isInitialized) {
            this.typeText();
        }
    }
    
    destroy() {
        this.pause();
        this.isInitialized = false;
    }
}

// Background Controller
class HeroBackgroundController {
    constructor() {
        this.backgroundImages = document.querySelectorAll('.hero-bg-image');
        this.currentIndex = 0;
        this.isInitialized = false;
        
        if (this.backgroundImages.length > 0) {
            this.init();
        }
    }
    
    async init() {
        if (!this.backgroundImages.length || this.isInitialized) return;
        
        try {
            await this.preloadImages();
            
            this.backgroundImages[0].classList.add('active');
            this.currentIndex = 0;
            
            if (!STATE.isReducedMotion) {
                this.startRotation();
            }
            
            this.isInitialized = true;
            console.log('Hero background controller initialized');
            
        } catch (error) {
            console.warn('Some hero background images failed to load:', error);
            this.isInitialized = true;
        }
    }
    
    async preloadImages() {
        const preloadPromises = CONFIG.hero.background.images.map(src => 
            this.preloadImage(src).catch(err => {
                console.warn(`Failed to preload hero image: ${src}`, err);
                return null;
            })
        );
        
        const results = await Promise.allSettled(preloadPromises);
        const loadedCount = results.filter(result => result.status === 'fulfilled').length;
        
        console.log(`Preloaded ${loadedCount}/${CONFIG.hero.background.images.length} hero background images`);
    }
    
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
    
    startRotation() {
        if (STATE.hero.backgroundInterval || STATE.isReducedMotion) return;
        
        STATE.hero.backgroundInterval = setInterval(() => {
            this.nextBackground();
        }, CONFIG.hero.background.transitionDuration);
        
        console.log('Hero background rotation started');
    }
    
    stopRotation() {
        if (STATE.hero.backgroundInterval) {
            clearInterval(STATE.hero.backgroundInterval);
            STATE.hero.backgroundInterval = null;
            console.log('Hero background rotation stopped');
        }
    }
    
    nextBackground() {
        if (!this.backgroundImages.length || STATE.isReducedMotion) return;
        
        this.backgroundImages[this.currentIndex].classList.remove('active');
        this.currentIndex = (this.currentIndex + 1) % this.backgroundImages.length;
        this.backgroundImages[this.currentIndex].classList.add('active');
        
        console.log(`Switched to hero background ${this.currentIndex + 1}`);
    }
    
    setBackground(index) {
        if (index < 0 || index >= this.backgroundImages.length) return;
        
        this.backgroundImages[this.currentIndex].classList.remove('active');
        this.currentIndex = index;
        this.backgroundImages[this.currentIndex].classList.add('active');
    }
    
    destroy() {
        this.stopRotation();
        this.isInitialized = false;
    }
}

// Logo Controller
class HeroLogoController {
    constructor() {
        this.logoContainer = document.querySelector('.hero-logo-container');
        this.logoImage = document.querySelector('.hero-logo');
        this.isInitialized = false;
        
        if (this.logoContainer && this.logoImage) {
            this.init();
        }
    }
    
    init() {
        this.setupLogoLoading();
        this.setupLogoInteractions();
        this.isInitialized = true;
        
        console.log('Hero logo controller initialized');
    }
    
    setupLogoLoading() {
        console.log('Loading hero logo...');
        
        const handleLogoSuccess = () => {
            console.log('Hero logo loaded successfully');
            this.logoImage.style.opacity = '1';
            
            if (!STATE.isReducedMotion) {
                this.logoContainer.style.animation = 'logoFloat 6s ease-in-out infinite';
            }
        };
        
        const handleLogoError = () => {
            console.warn('Hero logo failed to load, showing fallback');
            this.createFallbackLogo();
        };
        
        if (this.logoImage.complete) {
            if (this.logoImage.naturalHeight !== 0) {
                handleLogoSuccess();
            } else {
                handleLogoError();
            }
        } else {
            this.logoImage.addEventListener('load', handleLogoSuccess, { once: true });
            this.logoImage.addEventListener('error', handleLogoError, { once: true });
            
            setTimeout(() => {
                if (this.logoImage.naturalHeight === 0) {
                    handleLogoError();
                }
            }, 3000);
        }
    }
    
    createFallbackLogo() {
        const fallback = document.createElement('div');
        fallback.className = 'logo-fallback';
        fallback.style.cssText = `
            width: 100%;
            height: 100%;
            background: var(--gradient-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: var(--font-heading);
            font-size: clamp(1.5rem, 3vw, 2.5rem);
            font-weight: 700;
            text-align: center;
            line-height: 1.2;
            flex-direction: column;
        `;
        
        fallback.innerHTML = `
            <div>Holistic</div>
            <div style="font-size: 0.8em; margin: -0.2em 0;">Psychological</div>
            <div>Services</div>
        `;
        
        this.logoImage.style.display = 'none';
        this.logoContainer.appendChild(fallback);
    }
    
    setupLogoInteractions() {
        if (STATE.isReducedMotion) return;
        
        let isHovered = false;
        
        const handleMouseEnter = () => {
            if (!isHovered) {
                isHovered = true;
                this.logoContainer.style.transform = 'scale(1.05) rotate(3deg)';
                this.logoContainer.style.filter = 'brightness(1.1)';
            }
        };
        
        const handleMouseLeave = () => {
            if (isHovered) {
                isHovered = false;
                this.logoContainer.style.transform = '';
                this.logoContainer.style.filter = '';
            }
        };
        
        const handleClick = () => {
            this.logoContainer.style.animation = 'none';
            this.logoContainer.offsetHeight;
            this.logoContainer.style.animation = 'logoFloat 6s ease-in-out infinite';
            
            Utils.announceToScreenReader('Logo animation restarted');
        };
        
        this.logoContainer.addEventListener('mouseenter', handleMouseEnter);
        this.logoContainer.addEventListener('mouseleave', handleMouseLeave);
        this.logoContainer.addEventListener('click', handleClick);
        
        this.logoContainer.addEventListener('touchstart', handleMouseEnter, { passive: true });
        this.logoContainer.addEventListener('touchend', handleMouseLeave, { passive: true });
    }

    destroy() {
        this.isInitialized = false;
    }
}

// Scroll Indicator Controller
class HeroScrollIndicatorController {
    constructor() {
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (this.scrollIndicator) {
            this.init();
        }
    }
    
    init() {
        this.scrollIndicator.addEventListener('click', this.handleScrollClick.bind(this));
        this.setupScrollListening();
        
        console.log('Hero scroll indicator initialized');
    }
    
    handleScrollClick() {
        const nextSection = document.querySelector('#about') || 
                           document.querySelector('section:not(.hero)') ||
                           document.querySelector('main > *:not(.hero)');
        
        if (nextSection) {
            Utils.smoothScrollTo(nextSection);
            Utils.announceToScreenReader('Scrolled to next section');
        }
    }
    
    setupScrollListening() {
        const handleScroll = Utils.throttle(() => {
            const scrolled = window.pageYOffset > 100;
            
            if (this.scrollIndicator) {
                this.scrollIndicator.style.opacity = scrolled ? '0' : '1';
                this.scrollIndicator.style.visibility = scrolled ? 'hidden' : 'visible';
            }
        }, 16);
        
        window.addEventListener('scroll', handleScroll);
    }

    destroy() {
        // Clean up if needed
    }
}

// Main Hero Controller
class HeroController {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.controllers = {};
        this.isInitialized = false;
        
        if (this.heroSection) {
            this.init();
        }
    }
    
    async init() {
        if (this.isInitialized) return;
        
        console.log('Initializing Hero section...');
        
        try {
            this.controllers.background = new HeroBackgroundController();
            this.controllers.logo = new HeroLogoController();
            this.controllers.scrollIndicator = new HeroScrollIndicatorController();
            
            await this.initializeTypewriter();
            
            this.setupVisibilityHandling();
            this.setupMotionPreferences();
            
            this.isInitialized = true;
            STATE.hero.isInitialized = true;
            
            console.log('Hero section initialized successfully!');
            
        } catch (error) {
            console.error('Hero initialization failed:', error);
            this.handleInitializationError(error);
        }
    }
    
    async initializeTypewriter() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const typewriterElement = document.getElementById('typewriterText');
                if (typewriterElement) {
                    this.controllers.typewriter = new HeroTypewriterController(typewriterElement);
                }
                resolve();
            }, 1500);
        });
    }
    
    setupVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.controllers.background) {
                    this.controllers.background.stopRotation();
                }
                if (this.controllers.typewriter) {
                    this.controllers.typewriter.pause();
                }
                console.log('Hero animations paused (page hidden)');
            } else {
                if (this.controllers.background && !STATE.isReducedMotion) {
                    this.controllers.background.startRotation();
                }
                if (this.controllers.typewriter) {
                    this.controllers.typewriter.resume();
                }
                console.log('Hero animations resumed (page visible)');
            }
        });
    }
    
    setupMotionPreferences() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionChange = (e) => {
            STATE.isReducedMotion = e.matches;
            console.log(`Hero motion preference: ${STATE.isReducedMotion ? 'reduced' : 'normal'}`);
            
            if (STATE.isReducedMotion) {
                if (this.controllers.background) {
                    this.controllers.background.stopRotation();
                }
            } else {
                if (this.controllers.background) {
                    this.controllers.background.startRotation();
                }
            }
        };
        
        mediaQuery.addEventListener('change', handleMotionChange);
        handleMotionChange(mediaQuery);
    }
    
    handleInitializationError(error) {
        const typewriterElement = document.getElementById('typewriterText');
        if (typewriterElement) {
            typewriterElement.textContent = 'Professional Mental Health Care in Manhattan';
        }
        
        const glassPanel = document.querySelector('.glass-panel');
        if (glassPanel) {
            glassPanel.style.animation = 'none';
            glassPanel.style.opacity = '1';
            glassPanel.style.transform = 'none';
        }
        
        console.warn('Hero section loaded with reduced functionality due to error');
    }
    
    // Public API methods
    nextBackground() {
        if (this.controllers.background) {
            this.controllers.background.nextBackground();
        }
    }
    
    setBackground(index) {
        if (this.controllers.background) {
            this.controllers.background.setBackground(index);
        }
    }
    
    toggleBackgroundRotation() {
        if (!this.controllers.background) return;
        
        if (STATE.hero.backgroundInterval) {
            this.controllers.background.stopRotation();
        } else {
            this.controllers.background.startRotation();
        }
    }
    
    restartTypewriter() {
        if (this.controllers.typewriter) {
            this.controllers.typewriter.destroy();
            setTimeout(() => {
                const typewriterElement = document.getElementById('typewriterText');
                if (typewriterElement) {
                    this.controllers.typewriter = new HeroTypewriterController(typewriterElement);
                }
            }, 100);
        }
    }
    
    destroy() {
        if (STATE.hero.typewriterTimeout) {
            clearTimeout(STATE.hero.typewriterTimeout);
        }
        if (STATE.hero.backgroundInterval) {
            clearInterval(STATE.hero.backgroundInterval);
        }
        
        Object.values(this.controllers).forEach(controller => {
            if (controller.destroy) controller.destroy();
        });
        
        console.log('Hero section cleanup completed');
    }
}

/* ========================================
   ABOUT SECTION
   ======================================== */

class AboutSectionController {
    constructor() {
        // State management
        this.state = {
            isInitialized: false,
            isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            observers: new Map(),
            animatedElements: new Set(),
            currentBreakpoint: this.getCurrentBreakpoint()
        };
        
        this.init();
    }
   
    init() {
        if (this.state.isInitialized) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
        
        this.setupGlobalEvents();
    }

    initializeComponents() {
        try {
            console.log('Initializing About section...');
            
            // Initialize all functionality
            this.setupImageLoading();
            this.setupScrollAnimations();
            this.setupInteractions();
            this.setupResponsiveBehavior();
            this.setupAccessibility();
            
            // Mark as initialized
            this.state.isInitialized = true;
            
            // Add initialized class to section
            const aboutSection = document.querySelector('.about-preview');
            if (aboutSection) {
                aboutSection.classList.add('initialized');
            }
            
            console.log('About section initialized successfully!');
            
        } catch (error) {
            console.error('About section initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
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

    animateElement(element, animationClass = 'fade-in', delay = 0) {
        if (this.state.isReducedMotion) {
            element.classList.add('visible');
            return;
        }
        
        setTimeout(() => {
            element.classList.add(animationClass, 'visible');
        }, delay);
    }

    staggerAnimations(elements, animationClass = 'fade-in', staggerDelay = ABOUT_CONFIG.animations.stagger) {
        elements.forEach((element, index) => {
            const delay = this.state.isReducedMotion ? 0 : index * staggerDelay;
            this.animateElement(element, animationClass, delay);
        });
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width < 480) return 'xs';
        if (width < 768) return 'sm';
        if (width < 992) return 'md';
        if (width < 1200) return 'lg';
        return 'xl';
    }
   
    setupImageLoading() {
        const images = document.querySelectorAll('.about-preview img');
        
        images.forEach(img => {
            this.loadImage(img);
        });
        
        console.log('Image loading setup completed');
    }

    loadImage(img) {
        // Handle if image is already loaded
        if (img.complete && img.naturalHeight !== 0) {
            this.onImageLoad(img);
            return;
        }

        // Set initial state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';

        // Create a new image to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            this.onImageLoad(img);
        };
        
        imageLoader.onerror = () => {
            this.onImageError(img);
        };

        // Start loading
        imageLoader.src = img.src;
        
        // Fallback timeout
        setTimeout(() => {
            if (img.style.opacity === '0') {
                this.onImageError(img);
            }
        }, 5000);
    }

    onImageLoad(img) {
        img.style.opacity = '1';
        img.classList.add('loaded');
        
        // Add subtle animation
        if (!this.state.isReducedMotion) {
            img.style.transform = 'scale(1.02)';
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 300);
        }
    }

    onImageError(img) {
        console.warn('Failed to load image:', img.src);
        
        // Create fallback
        const container = img.closest('.image-container');
        if (container) {
            this.createImageFallback(container, img.alt);
        }
    }

    createImageFallback(container, altText) {
        const fallback = document.createElement('div');
        fallback.className = 'image-fallback';
        fallback.style.cssText = `
            width: 100%;
            height: 100%;
            background: var(--gradient-primary);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: var(--font-heading);
            font-weight: 700;
            text-align: center;
            padding: var(--space-lg);
        `;
        
        const icon = document.createElement('i');
        icon.className = 'ri-user-line';
        icon.style.cssText = `
            font-size: 3rem;
            margin-bottom: var(--space-md);
            opacity: 0.8;
        `;
        
        const text = document.createElement('div');
        text.textContent = altText || 'Professional Photo';
        text.style.fontSize = '0.875rem';
        
        fallback.appendChild(icon);
        fallback.appendChild(text);
        
        // Hide original image and show fallback
        const img = container.querySelector('img');
        if (img) {
            img.style.display = 'none';
        }
        
        container.appendChild(fallback);
        
        // Animate in
        fallback.style.opacity = '0';
        setTimeout(() => {
            fallback.style.opacity = '1';
        }, 100);
    }
   
    setupScrollAnimations() {
        const options = {
            threshold: ABOUT_CONFIG.scroll.threshold,
            rootMargin: ABOUT_CONFIG.scroll.rootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleElementInView(entry.target);
                }
            });
        }, options);

        // Observe main containers
        const aboutSection = document.querySelector('.about-preview');
        if (aboutSection) {
            observer.observe(aboutSection);
            this.state.observers.set('aboutSection', observer);
        }
        
        console.log('Scroll animations setup completed');
    }

    handleElementInView(element) {
        if (element.classList.contains('about-preview')) {
            this.animateAboutSection(element);
        }
    }

    animateAboutSection(section) {
        if (this.state.animatedElements.has('aboutSection')) return;
        this.state.animatedElements.add('aboutSection');

        // 1. Animate welcome section first
        const welcomeSection = section.querySelector('.welcome-team-section');
        if (welcomeSection) {
            this.animateElement(welcomeSection, 'fade-in', 0);
        }

        // 2. Animate leader cards with stagger
        const leaderCards = section.querySelectorAll('.leader-card');
        setTimeout(() => {
            this.staggerAnimations(leaderCards, 'slide-left', 200);
        }, 300);

        // 3. Animate CTA section last
        const ctaSection = section.querySelector('.about-cta');
        if (ctaSection) {
            setTimeout(() => {
                this.animateElement(ctaSection, 'fade-in', 0);
            }, 800);
        }

        this.announceToScreenReader('About section content loaded');
    }
   
    setupInteractions() {
        this.setupCardInteractions();
        this.setupButtonInteractions();
        
        console.log('Interactions setup completed');
    }

    setupCardInteractions() {
        // Leader card hover effects
        const leaderCards = document.querySelectorAll('.leader-card');
        leaderCards.forEach(card => {
            let isHovered = false;
            
            const handleMouseEnter = () => {
                if (!isHovered && !this.state.isReducedMotion) {
                    isHovered = true;
                    this.animateLeaderCardHover(card, true);
                }
            };
            
            const handleMouseLeave = () => {
                if (isHovered) {
                    isHovered = false;
                    this.animateLeaderCardHover(card, false);
                }
            };
            
            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);
            
            // Touch support
            card.addEventListener('touchstart', handleMouseEnter, { passive: true });
            card.addEventListener('touchend', handleMouseLeave, { passive: true });
        });

        // Philosophy item hover effects
        const philosophyItems = document.querySelectorAll('.philosophy-item');
        philosophyItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (!this.state.isReducedMotion) {
                    const icon = item.querySelector('i');
                    if (icon) {
                        icon.style.transform = 'scale(1.2) rotate(10deg)';
                    }
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });

        // Specialty tag hover effects
        const specialtyTags = document.querySelectorAll('.specialty-tag');
        specialtyTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                if (!this.state.isReducedMotion) {
                    const icon = tag.querySelector('i');
                    if (icon) {
                        icon.style.transform = 'scale(1.1)';
                    }
                }
            });
            
            tag.addEventListener('mouseleave', () => {
                const icon = tag.querySelector('i');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }

    animateLeaderCardHover(card, isEntering) {
        const image = card.querySelector('.image-container img');
        const experienceBadge = card.querySelector('.experience-badge');
        const specialtyTags = card.querySelectorAll('.specialty-tag');
        
        if (isEntering) {
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
            if (experienceBadge) {
                experienceBadge.style.transform = 'scale(1.1) rotate(-5deg)';
            }
            
            specialtyTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-2px)';
                }, index * 50);
            });
        } else {
            if (image) {
                image.style.transform = '';
            }
            if (experienceBadge) {
                experienceBadge.style.transform = '';
            }
            
            specialtyTags.forEach(tag => {
                tag.style.transform = '';
            });
        }
    }

    setupButtonInteractions() {
        const aboutButton = document.querySelector('.btn-about-full');
        if (!aboutButton) return;

        // Ripple effect
        aboutButton.addEventListener('click', (e) => {
            if (this.state.isReducedMotion) return;
            
            this.createRippleEffect(e, aboutButton);
        });

        // Icon animation
        aboutButton.addEventListener('mouseenter', () => {
            if (!this.state.isReducedMotion) {
                const icon = aboutButton.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(5px)';
                }
            }
        });

        aboutButton.addEventListener('mouseleave', () => {
            const icon = aboutButton.querySelector('i');
            if (icon) {
                icon.style.transform = '';
            }
        });
    }

    createRippleEffect(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: 0;
            height: 0;
            left: ${event.clientX - rect.left}px;
            top: ${event.clientY - rect.top}px;
            transform: translate(-50%, -50%);
            animation: aboutRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        // Add ripple animation if not exists
        if (!document.querySelector('#about-ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'about-ripple-animation';
            style.textContent = `
                @keyframes aboutRipple {
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
   
    setupAccessibility() {
        // Add keyboard navigation for interactive elements
        const interactiveElements = document.querySelectorAll(
            '.leader-card, .philosophy-item, .specialty-tag, .btn-about-full'
        );
        
        interactiveElements.forEach(element => {
            // Add tabindex for keyboard navigation
            if (!element.hasAttribute('tabindex') && !element.matches('a, button')) {
                element.setAttribute('tabindex', '0');
            }
            
            // Add keyboard event listeners
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (element.classList.contains('btn-about-full')) {
                        e.preventDefault();
                        element.click();
                    } else {
                        // Trigger hover effect for other elements
                        element.dispatchEvent(new Event('mouseenter'));
                        setTimeout(() => {
                            element.dispatchEvent(new Event('mouseleave'));
                        }, 2000);
                    }
                }
            });
        });

        // Add ARIA labels where needed
        const leaderCards = document.querySelectorAll('.leader-card');
        leaderCards.forEach((card, index) => {
            const doctorName = card.querySelector('h4')?.textContent;
            if (doctorName && !card.hasAttribute('aria-label')) {
                card.setAttribute('aria-label', `Learn more about ${doctorName}`);
            }
        });
        
        console.log('Accessibility setup completed');
    }
   
    setupResponsiveBehavior() {
        const handleResize = this.debounce(() => {
            const newBreakpoint = this.getCurrentBreakpoint();
            if (newBreakpoint !== this.state.currentBreakpoint) {
                this.state.currentBreakpoint = newBreakpoint;
                this.handleBreakpointChange();
            }
        }, 250);

        window.addEventListener('resize', handleResize);
        this.handleBreakpointChange();
        
        console.log('Responsive behavior setup completed');
    }

    handleBreakpointChange() {
        // Adjust animations based on screen size
        if (['xs', 'sm'].includes(this.state.currentBreakpoint)) {
            this.simplifyAnimations();
        } else {
            this.enableFullAnimations();
        }
    }

    simplifyAnimations() {
        const leaderCards = document.querySelectorAll('.leader-card');
        leaderCards.forEach(card => {
            card.style.transform = '';
            card.style.transition = 'box-shadow 0.3s ease';
        });
    }

    enableFullAnimations() {
        const leaderCards = document.querySelectorAll('.leader-card');
        leaderCards.forEach(card => {
            card.style.transition = '';
        });
    }
   
    setupGlobalEvents() {
        // Handle motion preference changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.state.isReducedMotion = e.matches;
            console.log(`About section motion preference: ${this.state.isReducedMotion ? 'reduced' : 'normal'}`);
        });

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Error handling
        window.addEventListener('error', (event) => {
            if (event.filename?.includes('about-section.js')) {
                console.error('About section error:', event.error);
            }
        });
    }

    handleInitializationError(error) {
        // Fallback: show content without animations
        const aboutSection = document.querySelector('.about-preview');
        if (aboutSection) {
            aboutSection.classList.add('fallback-mode');
            
            // Make all elements visible immediately
            const animatedElements = aboutSection.querySelectorAll('[class*="fade"], [class*="slide"]');
            animatedElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });

            // Handle images
            const images = aboutSection.querySelectorAll('img');
            images.forEach(img => {
                img.style.opacity = '1';
            });
        }
        
        console.warn('About section loaded with reduced functionality due to error');
    }

    pause() {
        console.log('About section paused (page hidden)');
    }

    resume() {
        console.log('About section resumed (page visible)');
    }

    getState() {
        return { ...this.state };
    }

    destroy() {
        // Cleanup observers
        this.state.observers.forEach(observer => {
            observer.disconnect();
        });
        this.state.observers.clear();
        
        console.log('About section cleanup completed');
    }
}

/* ========================================
   INITIALIZATION & GLOBAL EXPOSURE
   ======================================== */

// Initialize the about section
let aboutController;

function initializeAboutSection() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            aboutController = new AboutSectionController();
        });
    } else {
        aboutController = new AboutSectionController();
    }
}

// Start initialization
initializeAboutSection();

// Expose to global scope for debugging
window.AboutSection = {
    controller: aboutController,
    config: ABOUT_CONFIG
};

// Handle cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (aboutController) {
        aboutController.destroy();
    }
});

console.log('About section JavaScript loaded and ready');

/* ========================================
   SERVICES SECTION
   ======================================== */
class ServicesSectionController {
    constructor() {
        this.servicesSection = document.querySelector('.services');
        
        if (this.servicesSection) {
            this.init();
        }
    }
    
    init() {
        this.initializeAnimations();
        this.initializeInteractions();
        console.log('Services section initialized');
    }
    
    initializeAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const serviceCards = entry.target.querySelectorAll('.service-card');
                    const ctaSection = entry.target.querySelector('.services-cta');
                    
                    Utils.staggerAnimations(serviceCards, 'fade-in', 200);
                    
                    if (ctaSection) {
                        setTimeout(() => {
                            Utils.animateElement(ctaSection, 'fade-in', 0);
                        }, serviceCards.length * 200 + 400);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(this.servicesSection);
        STATE.observers.set('services', observer);
    }
    
    initializeInteractions() {
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
    }

    destroy() {
        const observer = STATE.observers.get('services');
        if (observer) {
            observer.disconnect();
            STATE.observers.delete('services');
        }
        console.log('Services section destroyed');
    }
}

/* ========================================
   TEAM SECTION
   ======================================== */
class TeamSectionController {
    constructor() {
        this.teamSection = document.querySelector('.team');
        
        if (this.teamSection) {
            this.init();
        }
    }
    
    init() {
        this.initializeAnimations();
        this.initializeInteractions();
        console.log('Team section initialized');
    }
    
    initializeAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const teamCards = entry.target.querySelectorAll('.team-card');
                    Utils.staggerAnimations(teamCards, 'fade-in', 250);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(this.teamSection);
        STATE.observers.set('team', observer);
    }
    
    initializeInteractions() {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    const badge = card.querySelector('.experience-badge');
                    const image = card.querySelector('.team-image');
                    const credentials = card.querySelectorAll('.credential');
                    
                    if (badge) {
                        badge.style.transform = 'scale(1.1) rotate(-5deg)';
                    }
                    if (image) {
                        image.style.transform = 'scale(1.05)';
                    }
                    
                    credentials.forEach((cred, index) => {
                        setTimeout(() => {
                            cred.style.transform = 'translateY(-2px)';
                        }, index * 100);
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const badge = card.querySelector('.experience-badge');
                const image = card.querySelector('.team-image');
                const credentials = card.querySelectorAll('.credential');
                
                if (badge) {
                    badge.style.transform = '';
                }
                if (image) {
                    image.style.transform = '';
                }
                
                credentials.forEach(cred => {
                    cred.style.transform = '';
                });
            });
        });
    }

    destroy() {
        const observer = STATE.observers.get('team');
        if (observer) {
            observer.disconnect();
            STATE.observers.delete('team');
        }
        console.log('Team section destroyed');
    }
}

/* ========================================
   REVIEWS SECTION
   ======================================== */
class ReviewsSectionController {
    constructor() {
        this.reviewsSection = document.querySelector('.reviews');
        
        if (this.reviewsSection) {
            this.init();
        }
    }
    
    init() {
        this.initializeAnimations();
        this.initializeInteractions();
        console.log('Reviews section initialized');
    }
    
    initializeAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const heroReview = entry.target.querySelector('.hero-review');
                    const reviewCards = entry.target.querySelectorAll('.review-card');
                    const statItems = entry.target.querySelectorAll('.review-stats .stat-item');
                    
                    if (heroReview) {
                        Utils.animateElement(heroReview, 'fade-in', 0);
                    }
                    
                    setTimeout(() => {
                        Utils.staggerAnimations(reviewCards, 'fade-in', 200);
                    }, 300);
                    
                    setTimeout(() => {
                        Utils.staggerAnimations(statItems, 'fade-in', 150);
                        setTimeout(() => {
                            this.animateStatNumbers(statItems);
                        }, 500);
                    }, 600 + (reviewCards.length * 200));
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(this.reviewsSection);
        STATE.observers.set('reviews', observer);
    }
    
    initializeInteractions() {
        const reviewCards = document.querySelectorAll('.review-card');
        
        reviewCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    const initial = card.querySelector('.client-initial');
                    const stars = card.querySelectorAll('.stars i');
                    
                    if (initial) {
                        initial.style.transform = 'scale(1.1) rotate(5deg)';
                        initial.style.background = 'var(--gradient-primary)';
                    }
                    
                    stars.forEach((star, index) => {
                        setTimeout(() => {
                            star.style.transform = 'scale(1.2)';
                        }, index * 50);
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const initial = card.querySelector('.client-initial');
                const stars = card.querySelectorAll('.stars i');
                
                if (initial) {
                    initial.style.transform = '';
                    initial.style.background = '';
                }
                
                stars.forEach(star => {
                    star.style.transform = '';
                });
            });
        });
    }
    
    animateStatNumbers(statItems) {
        if (STATE.isReducedMotion) return;
        
        statItems.forEach(item => {
            const numberElement = item.querySelector('.stat-number');
            if (!numberElement) return;
            
            const finalValue = numberElement.textContent;
            const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
            
            if (isNaN(numericValue)) return;
            
            let currentValue = 0;
            const increment = numericValue / 30;
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
    }

    destroy() {
        const observer = STATE.observers.get('reviews');
        if (observer) {
            observer.disconnect();
            STATE.observers.delete('reviews');
        }
        console.log('Reviews section destroyed');
    }
}

/* ========================================
   CONTACT SECTION
   ======================================== */
class ContactSectionController {
    constructor() {
        this.contactSection = document.querySelector('.contact');
        this.form = document.getElementById('contactForm');
        this.inputs = null;
        this.submitButton = null;
        
        if (this.contactSection) {
            this.init();
        }
    }
    
    init() {
        this.initializeAnimations();
        this.initializeInteractions();
        
        if (this.form) {
            this.initializeForm();
        }
        
        console.log('Contact section initialized');
    }
    
    initializeAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const contactCards = entry.target.querySelectorAll('.contact-card');
                    const formContainer = entry.target.querySelector('.contact-form-container');
                    
                    Utils.staggerAnimations(contactCards, 'slide-left', 150);
                    
                    if (formContainer) {
                        setTimeout(() => {
                            Utils.animateElement(formContainer, 'slide-right', 0);
                        }, 300);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(this.contactSection);
        STATE.observers.set('contact', observer);
    }
    
    initializeInteractions() {
        const contactCards = document.querySelectorAll('.contact-card');
        
        contactCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!STATE.isReducedMotion) {
                    const icon = card.querySelector('.card-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1.1) rotate(5deg)';
                    }
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.card-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }
    
    initializeForm() {
        this.inputs = this.form.querySelectorAll('input, select, textarea');
        this.submitButton = this.form.querySelector('.btn-submit');
        
        this.bindFormEvents();
        console.log('Contact form initialized');
    }
    
    bindFormEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.removeFieldError(input));
            
            input.addEventListener('focus', (e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 216, 132, 0.2)';
            });
            
            input.addEventListener('blur', (e) => {
                e.target.style.transform = '';
                e.target.style.boxShadow = '';
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        this.removeFieldError(field);
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (cleanPhone.length > 0 && !phoneRegex.test(cleanPhone)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
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
    }
    
    removeFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.style.borderColor = '';
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    showFormMessage(message, type = 'success') {
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        messageElement.textContent = message;
        
        const bgColor = type === 'success' ? 'var(--primary-green)' : '#ef4444';
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
        
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        Utils.announceToScreenReader(message);
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }
        }, 5000);
        
        messageElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            this.showFormMessage('Please correct the errors above.', 'error');
            return;
        }
        
        const originalText = this.submitButton.innerHTML;
        this.submitButton.innerHTML = `
            <span style="opacity: 0.8;">Sending...</span>
            <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin-left: 8px;"></div>
        `;
        this.submitButton.disabled = true;
        
        if (!document.querySelector('#contact-loading-animation')) {
            const style = document.createElement('style');
            style.id = 'contact-loading-animation';
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
            const formData = new FormData(this.form);
            const formObject = Object.fromEntries(formData);
            
            console.log('Contact form submitted:', formObject);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showFormMessage(
                'Thank you for your message! We will contact you within 24 hours to discuss your needs and schedule a consultation.',
                'success'
            );
            
            this.form.reset();
            
            this.inputs.forEach(input => this.removeFieldError(input));
            
            console.log('Contact form submitted successfully');
            
        } catch (error) {
            console.error('Contact form submission error:', error);
            this.showFormMessage(
                'We apologize, but there was an error sending your message. Please try again or call us directly at (646) 971-7325.',
                'error'
            );
        } finally {
            this.submitButton.innerHTML = originalText;
            this.submitButton.disabled = false;
        }
    }

    destroy() {
        const observer = STATE.observers.get('contact');
        if (observer) {
            observer.disconnect();
            STATE.observers.delete('contact');
        }
        console.log('Contact section destroyed');
    }
}

/* ========================================
   FLOATING ACTION BUTTONS
   ======================================== */
class FloatingActionsController {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTop');
        this.contactFab = document.getElementById('contactFab');
        this.contactOptions = document.getElementById('contactOptions');
        this.isContactFabOpen = false;
        
        if (this.backToTopBtn || this.contactFab) {
            this.init();
        }
    }
    
    init() {
        this.initializeBackToTop();
        this.initializeContactFAB();
        this.showFABs();
        
        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateBackToTopButton();
        }, 16));
        
        console.log('Floating actions controller initialized');
    }
    
    initializeBackToTop() {
        if (!this.backToTopBtn) return;
        
        this.backToTopBtn.addEventListener('click', () => {
            Utils.smoothScrollToTop();
            Utils.announceToScreenReader('Scrolled to top of page');
        });
        
        this.backToTopBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                Utils.smoothScrollToTop();
            }
        });
    }
    
    initializeContactFAB() {
        if (!this.contactFab || !this.contactOptions) return;
        
        const toggleContactOptions = () => {
            this.isContactFabOpen = !this.isContactFabOpen;
            STATE.isContactFabOpen = this.isContactFabOpen;
            
            this.contactFab.classList.toggle('active', this.isContactFabOpen);
            this.contactOptions.classList.toggle('active', this.isContactFabOpen);
            
            this.contactFab.setAttribute('aria-expanded', this.isContactFabOpen.toString());
            
            const message = this.isContactFabOpen ? 'Contact options opened' : 'Contact options closed';
            Utils.announceToScreenReader(message);
        };
        
        const closeContactOptions = () => {
            if (this.isContactFabOpen) {
                this.isContactFabOpen = false;
                STATE.isContactFabOpen = false;
                this.contactFab.classList.remove('active');
                this.contactOptions.classList.remove('active');
                this.contactFab.setAttribute('aria-expanded', 'false');
            }
        };
        
        this.contactFab.addEventListener('click', toggleContactOptions);
        
        this.contactFab.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleContactOptions();
            } else if (event.key === 'Escape') {
                closeContactOptions();
            }
        });
        
        document.addEventListener('click', (event) => {
            if (this.isContactFabOpen && 
                !this.contactFab.contains(event.target) && 
                !this.contactOptions.contains(event.target)) {
                closeContactOptions();
            }
        });
        
        const contactOptionLinks = this.contactOptions.querySelectorAll('.contact-option');
        contactOptionLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const optionType = link.classList.contains('phone') ? 'phone' :
                                  link.classList.contains('email') ? 'email' :
                                  link.classList.contains('instagram') ? 'instagram' :
                                  link.classList.contains('review') ? 'review' : 'unknown';
                
                console.log(`Contact option clicked: ${optionType}`);
                
                if (optionType !== 'review' && optionType !== 'instagram') {
                    setTimeout(closeContactOptions, 300);
                }
                
                const actionMessages = {
                    phone: 'Calling phone number',
                    email: 'Opening email client',
                    instagram: 'Opening Instagram page',
                    review: 'Opening Google reviews'
                };
                
                Utils.announceToScreenReader(actionMessages[optionType] || 'Contact option selected');
            });
        });
        
        this.contactFab.setAttribute('aria-expanded', 'false');
        this.contactFab.setAttribute('aria-haspopup', 'true');
    }
    
    updateBackToTopButton() {
        if (!this.backToTopBtn) return;
        
        const shouldShow = STATE.scrollPosition > 300;
        this.backToTopBtn.classList.toggle('visible', shouldShow);
    }
    
    showFABs() {
        setTimeout(() => {
            const floatingActions = document.querySelector('.floating-actions');
            if (floatingActions) {
                floatingActions.style.opacity = '1';
                floatingActions.style.visibility = 'visible';
            }
        }, CONFIG.fab.showDelay);
    }

    destroy() {
        console.log('Floating actions controller destroyed');
    }
}

/* ========================================
   INTERACTIVE ELEMENTS & BUTTON EFFECTS
   ======================================== */
class InteractiveElementsController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initializeButtonRippleEffects();
        console.log('Interactive elements controller initialized');
    }
    
    initializeButtonRippleEffects() {
        const buttons = document.querySelectorAll('.service-btn, .btn-cta-primary, .btn-cta-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (STATE.isReducedMotion) return;
                
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
                    animation: buttonRipple 0.6s ease-out;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                if (!document.querySelector('#button-ripple-animation')) {
                    const style = document.createElement('style');
                    style.id = 'button-ripple-animation';
                    style.textContent = `
                        @keyframes buttonRipple {
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
    }

    destroy() {
        console.log('Interactive elements controller destroyed');
    }
}

/* ========================================
   PERFORMANCE & ACCESSIBILITY
   ======================================== */
class PerformanceController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initializeLazyLoading();
        this.initializeAccessibility();
        this.initializeErrorHandling();
        this.initializePerformanceOptimizations();
        
        console.log('Performance controller initialized');
    }
    
    initializeLazyLoading() {
        const images = document.querySelectorAll('img[src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
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
                if (!img.classList.contains('hero-logo')) {
                    imageObserver.observe(img);
                }
            });
        }
    }
    
    initializeAccessibility() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 8px;
            background: var(--primary-green);
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
        
        const main = document.querySelector('main') || document.querySelector('.main');
        if (main && !main.id) {
            main.id = 'main';
        }
        
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            if (!section.getAttribute('aria-label') && !section.querySelector('h1, h2, h3')) {
                section.setAttribute('aria-label', `Section ${index + 1}`);
            }
        });
        
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
        
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
        };
    }
    
    initializeErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript Error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
        });
    }
    
    initializePerformanceOptimizations() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                console.log('Layout recalculated after resize');
            }, 250);
        });
        
        const criticalImages = ['logo copy.png'];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }

    destroy() {
        console.log('Performance controller destroyed');
    }
}

/* ========================================
   MAIN APPLICATION CONTROLLER
   ======================================== */
class HolisticPsychServicesApp {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
        
        this.setupGlobalEvents();
    }

    initializeComponents() {
        try {
            console.log('Initializing Holistic Psychological Services website...');
            
            this.components.set('performance', new PerformanceController());
            this.components.set('header', new HeaderController());
            this.components.set('mobileMenu', new MobileMenuController());
            this.components.set('hero', new HeroController());
            this.components.set('about', new AboutSectionController());
            this.components.set('services', new ServicesSectionController());
            this.components.set('team', new TeamSectionController());
            this.components.set('reviews', new ReviewsSectionController());
            this.components.set('contact', new ContactSectionController());
            this.components.set('floatingActions', new FloatingActionsController());
            this.components.set('interactiveElements', new InteractiveElementsController());
            
            document.body.classList.add('app-initialized');
            STATE.isInitialized = true;
            this.isInitialized = true;
            
            this.setupCleanup();
            this.handleMotionPreferenceChanges();
            
            window.holisticComponents = this.components;
            window.mobileMenu = this.components.get('mobileMenu');
            
            console.log('Holistic Psychological Services website initialized successfully!');
            
        } catch (error) {
            console.error('Component initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    handleInitializationError(error) {
        try {
            this.components.set('header', new HeaderController());
            this.components.set('mobileMenu', new MobileMenuController());
            
            console.warn('Fallback initialization completed');
        } catch (fallbackError) {
            console.error('Fallback initialization failed:', fallbackError);
        }
    }
    
    setupGlobalEvents() {
        window.addEventListener('resize', Utils.debounce(() => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                this.handleScreenSizeChange();
            }
        }, 250));

        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 500);
        });
    }

    handleScreenSizeChange() {
        const mobileMenu = this.components.get('mobileMenu');
        if (mobileMenu && !this.isMobile && mobileMenu.isOpen) {
            mobileMenu.closeMenu();
        }
        
        const floatingActions = this.components.get('floatingActions');
        if (floatingActions && floatingActions.isContactFabOpen) {
            floatingActions.closeContactOptions();
        }
    }
    
    setupCleanup() {
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    handleMotionPreferenceChanges() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            STATE.isReducedMotion = e.matches;
            console.log(`Motion preference: ${STATE.isReducedMotion ? 'reduced' : 'normal'}`);
            
            if (STATE.isReducedMotion) {
                const hero = this.components.get('hero');
                if (hero && hero.destroy) {
                    hero.destroy();
                }
            }
        });
    }
    
    pause() {
        const hero = this.components.get('hero');
        if (hero && hero.controllers && hero.controllers.background) {
            hero.controllers.background.stopRotation();
            console.log('App paused (page hidden)');
        }
    }
    
    resume() {
        const hero = this.components.get('hero');
        if (hero && hero.controllers && hero.controllers.background && !STATE.isReducedMotion) {
            hero.controllers.background.startRotation();
            console.log('App resumed (page visible)');
        }
    }
    
    cleanup() {
        const hero = this.components.get('hero');
        if (hero && hero.destroy) {
            hero.destroy();
        }
        
        STATE.observers.forEach(observer => {
            observer.disconnect();
        });
        STATE.observers.clear();
        
        this.components.forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
        
        console.log('App cleanup completed');
    }
    
    // Public API methods
    getComponent(name) {
        return this.components.get(name);
    }

    setHeroOverlayOpacity(opacity) {
        const hero = this.components.get('hero');
        if (hero && hero.setOverlayOpacity) {
            hero.setOverlayOpacity(opacity);
        }
    }
    
    toggleHeroBackgroundRotation() {
        const hero = this.components.get('hero');
        if (hero && hero.toggleBackgroundRotation) {
            hero.toggleBackgroundRotation();
        }
    }
    
    nextHeroBackground() {
        const hero = this.components.get('hero');
        if (hero && hero.nextBackground) {
            hero.nextBackground();
        }
    }
    
    getState() {
        return { ...STATE };
    }
    
    getConfig() {
        return { ...CONFIG };
    }

    destroy() {
        this.cleanup();
        console.log('HolisticPsychServicesApp destroyed');
    }
}

/* ========================================
   GLOBAL API & INITIALIZATION
   ======================================== */

// Global API
window.HolisticPsychServices = {
    STATE,
    CONFIG,
    Utils,
    
    app: null,
    
    smoothScrollTo: Utils.smoothScrollTo,
    smoothScrollToTop: Utils.smoothScrollToTop,
    announceToScreenReader: Utils.announceToScreenReader,
    
    animateElement: Utils.animateElement,
    staggerAnimations: Utils.staggerAnimations,
    
    isMobile: Utils.isMobile,
    isTablet: Utils.isTablet,
    isDesktop: Utils.isDesktop,
    
    debounce: Utils.debounce,
    throttle: Utils.throttle,
    
    heroAPI: {
        nextBackground: () => {
            if (window.holisticApp) {
                window.holisticApp.nextHeroBackground();
            }
        },
        
        toggleRotation: () => {
            if (window.holisticApp) {
                window.holisticApp.toggleHeroBackgroundRotation();
            }
        },
        
        restartTypewriter: () => {
            const hero = window.holisticApp?.getComponent('hero');
            if (hero && hero.restartTypewriter) {
                hero.restartTypewriter();
            }
        },
        
        setBackground: (index) => {
            const hero = window.holisticApp?.getComponent('hero');
            if (hero && hero.setBackground) {
                hero.setBackground(index);
            }
        }
    }
};

// Initialize app
function initializeApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.holisticApp = new HolisticPsychServicesApp();
        });
    } else {
        window.holisticApp = new HolisticPsychServicesApp();
    }
}

// Performance event handlers
window.addEventListener('focus', () => {
    if (window.holisticApp && !STATE.isReducedMotion) {
        window.holisticApp.resume();
    }
});

window.addEventListener('blur', () => {
    if (window.holisticApp) {
        window.holisticApp.pause();
    }
});

window.addEventListener('resize', Utils.debounce(() => {
    const wasMobile = STATE.isMobile;
    const isNowMobile = Utils.isMobile();
    
    if (wasMobile !== isNowMobile) {
        console.log(`Device type changed: ${isNowMobile ? 'mobile' : 'desktop'}`);
        
        if (!isNowMobile && STATE.isMobileMenuOpen && window.holisticApp) {
            const mobileMenu = window.holisticApp.getComponent('mobileMenu');
            if (mobileMenu && mobileMenu.closeMenu) {
                mobileMenu.closeMenu();
            }
        }
    }
    
    STATE.isMobile = isNowMobile;
}, 250));

// Development tools
if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1') {
    
    window.dev = {
        state: () => console.log('Current State:', STATE),
        config: () => console.log('Configuration:', CONFIG),
        observers: () => console.log('Active Observers:', STATE.observers),
        
        toggleReducedMotion: () => {
            STATE.isReducedMotion = !STATE.isReducedMotion;
            console.log(`Reduced motion: ${STATE.isReducedMotion ? 'enabled' : 'disabled'}`);
        },
        
        hero: {
            nextBackground: () => {
                if (window.holisticApp) {
                    window.holisticApp.nextHeroBackground();
                    console.log('Switched to next background');
                }
            },
            toggleRotation: () => {
                if (window.holisticApp) {
                    window.holisticApp.toggleHeroBackgroundRotation();
                    console.log('Toggled background rotation');
                }
            },
            restartTypewriter: () => {
                const hero = window.holisticApp?.getComponent('hero');
                if (hero && hero.restartTypewriter) {
                    hero.restartTypewriter();
                    console.log('Typewriter restarted');
                }
            }
        },
        
        components: {
            list: () => {
                if (window.holisticApp) {
                    console.log('Active components:', Array.from(window.holisticApp.components.keys()));
                }
            },
            get: (name) => {
                if (window.holisticApp) {
                    return window.holisticApp.getComponent(name);
                }
            }
        }
    };
    
    console.log('Development mode active. Use window.dev for debugging.');
}

// Start the application
initializeApp();

// Set reference to app instance when it's created
document.addEventListener('DOMContentLoaded', () => {
    if (window.holisticApp) {
        window.HolisticPsychServices.app = window.holisticApp;
    }
});

// Module exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HolisticPsychServicesApp,
        Utils,
        CONFIG,
        STATE
    };
}

if (typeof define === 'function' && define.amd) {
    define('holistic-psych-services', [], function() {
        return {
            HolisticPsychServicesApp,
            Utils,
            CONFIG,
            STATE
        };
    });
}

console.log('Holistic Psychological Services JavaScript loaded and ready');
