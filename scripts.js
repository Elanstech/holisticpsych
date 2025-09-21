/* ==========================================================================
   HOLISTIC PSYCHOLOGICAL SERVICES - CLEAN JAVASCRIPT
   ========================================================================== */

// Global App Controller
class App {
    constructor() {
        this.isScrolled = false;
        this.scrollThreshold = 50;
        this.init();
    }
    
    init() {
        // Initialize all sections
        this.header = new Header();
        this.hero = new Hero();
        this.services = new ServicesCarousel();
        this.about = new ModernAboutSection();
        this.team = new Team();
        this.reviews = new Reviews();
        this.contact = new Contact();
        this.footer = new Footer();
        
        // Global scroll handler
        this.initScrollHandling();
    }
    
    initScrollHandling() {
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > this.scrollThreshold;
            
            // Update header state
            if (this.header) {
                this.header.handleScroll(scrolled);
            }
            
            // Back to top visibility
            if (backToTop) {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }
        });
        
        // Back to top click
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

/* ==========================================================================
   HEADER SECTION
   ========================================================================== */
class Header {
    constructor() {
        this.header = document.getElementById('header');
        this.mobileToggle = document.getElementById('mobileMenuToggle');
        this.scrollHamburger = document.getElementById('scrollHamburgerToggle');
        this.mobilePanel = document.getElementById('mobileMenuPanel');
        this.mobileOverlay = document.getElementById('mobileMenuOverlay');
        this.mobileClose = document.getElementById('mobileMenuClose');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateActiveNav();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Scroll hamburger
        if (this.scrollHamburger) {
            this.scrollHamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu
        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', () => this.closeMobileMenu());
        }
        
        // Overlay click
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
        }
        
        // Nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                const section = document.querySelector(target);
                
                if (section) {
                    // Close mobile menu if open
                    if (this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                    
                    // Smooth scroll
                    setTimeout(() => {
                        const offset = 100;
                        const top = section.offsetTop - offset;
                        window.scrollTo({
                            top: top,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
                
                // Update active state
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1200 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    handleScroll(scrolled) {
        if (!this.header) return;
        
        if (scrolled) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMenuOpen = true;
        document.body.style.overflow = 'hidden';
        
        if (this.mobileToggle) this.mobileToggle.classList.add('active');
        if (this.scrollHamburger) this.scrollHamburger.classList.add('active');
        if (this.mobileOverlay) this.mobileOverlay.classList.add('active');
        if (this.mobilePanel) this.mobilePanel.classList.add('active');
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        document.body.style.overflow = '';
        
        if (this.mobileToggle) this.mobileToggle.classList.remove('active');
        if (this.scrollHamburger) this.scrollHamburger.classList.remove('active');
        if (this.mobileOverlay) this.mobileOverlay.classList.remove('active');
        if (this.mobilePanel) this.mobilePanel.classList.remove('active');
    }
    
    updateActiveNav() {
        // Update active navigation on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

/* ==========================================================================
   HERO SECTION
   ========================================================================== */
class Hero {
    constructor() {
        this.backgrounds = document.querySelectorAll('.hero-bg-image');
        this.typewriter = document.getElementById('typewriterText');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.currentBg = 0;
        this.texts = [
            "Professional Mental Health Care in Manhattan",
            "Compassionate Therapy for Individuals & Families",
            "Expert Psychological Services with Proven Results",
            "Your Journey to Mental Wellness Starts Here"
        ];
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.init();
    }
    
    init() {
        // Start background rotation
        this.startBackgroundRotation();
        
        // Start typewriter
        if (this.typewriter) {
            this.startTypewriter();
        }
        
        // Scroll indicator
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.querySelector('#about, #services');
                if (aboutSection) {
                    const offset = 100;
                    const top = aboutSection.offsetTop - offset;
                    window.scrollTo({
                        top: top,
                        behavior: 'smooth'
                    });
                }
            });
        }
        
        // Logo animation
        const logoContainer = document.querySelector('.hero-logo-container');
        if (logoContainer) {
            logoContainer.addEventListener('mouseenter', () => {
                logoContainer.style.transform = 'scale(1.05) rotate(3deg)';
            });
            
            logoContainer.addEventListener('mouseleave', () => {
                logoContainer.style.transform = '';
            });
        }
    }
    
    startBackgroundRotation() {
        if (!this.backgrounds.length) return;
        
        // Set first background active
        this.backgrounds[0].classList.add('active');
        
        // Rotate backgrounds
        setInterval(() => {
            this.backgrounds[this.currentBg].classList.remove('active');
            this.currentBg = (this.currentBg + 1) % this.backgrounds.length;
            this.backgrounds[this.currentBg].classList.add('active');
        }, 6000);
    }
    
    startTypewriter() {
        const typeSpeed = 80;
        const deleteSpeed = 50;
        const pauseDuration = 2000;
        
        const type = () => {
            const currentText = this.texts[this.textIndex];
            
            if (!this.isDeleting && this.charIndex < currentText.length) {
                // Typing
                this.typewriter.textContent = currentText.substring(0, this.charIndex + 1);
                this.charIndex++;
                setTimeout(type, typeSpeed);
            } else if (this.isDeleting && this.charIndex > 0) {
                // Deleting
                this.typewriter.textContent = currentText.substring(0, this.charIndex - 1);
                this.charIndex--;
                setTimeout(type, deleteSpeed);
            } else if (!this.isDeleting && this.charIndex === currentText.length) {
                // Pause at end
                this.isDeleting = true;
                setTimeout(type, pauseDuration);
            } else if (this.isDeleting && this.charIndex === 0) {
                // Move to next text
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
                setTimeout(type, 500);
            }
        };
        
        // Start typing
        setTimeout(type, 1000);
    }
}

/* ==========================================================================
   SERVICES SECTION
   ========================================================================== */
class ServicesCarousel {
    constructor() {
        // DOM Elements
        this.section = document.querySelector('.services-carousel-section');
        this.track = document.querySelector('.carousel-track');
        this.cards = document.querySelectorAll('.service-carousel-card');
        this.prevBtn = document.querySelector('.carousel-nav-prev');
        this.nextBtn = document.querySelector('.carousel-nav-next');
        this.categoryTabs = document.querySelectorAll('.category-tab');
        this.progressBar = document.querySelector('.progress-bar');
        this.paginationContainer = document.querySelector('.carousel-pagination');
        
        // Carousel State
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.totalCards = this.cards.length;
        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        this.autoScrollInterval = null;
        this.autoScrollDelay = 4000;
        this.isHovering = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.currentTranslateX = 0;
        
        // Initialize
        this.init();
    }
    
    init() {
        if (!this.section) return;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup pagination
        this.createPaginationDots();
        
        // Setup auto scroll
        this.startAutoScroll();
        
        // Setup intersection observer for animations
        this.setupIntersectionObserver();
        
        // Initialize progress bar
        this.updateProgressBar();
        
        // Setup category filtering
        this.setupCategoryFilters();
        
        // Setup responsive behavior
        this.setupResponsive();
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.slidePrev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.slideNext());
        }
        
        // Track hover for auto-scroll pause
        if (this.track) {
            this.track.addEventListener('mouseenter', () => this.handleMouseEnter());
            this.track.addEventListener('mouseleave', () => this.handleMouseLeave());
            
            // Touch events for mobile swipe
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
            this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e));
            
            // Mouse drag events for desktop
            this.track.addEventListener('mousedown', (e) => this.handleDragStart(e));
            this.track.addEventListener('mousemove', (e) => this.handleDragMove(e));
            this.track.addEventListener('mouseup', (e) => this.handleDragEnd(e));
            this.track.addEventListener('mouseleave', (e) => this.handleDragEnd(e));
        }
        
        // Card interactions
        this.cards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                // Prevent link click if dragging
                if (Math.abs(this.dragStartX - e.clientX) > 5) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            
            // Animate cards on hover
            card.addEventListener('mouseenter', () => this.animateCardHover(card));
            card.addEventListener('mouseleave', () => this.resetCardHover(card));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isElementInViewport()) return;
            
            if (e.key === 'ArrowLeft') {
                this.slidePrev();
            } else if (e.key === 'ArrowRight') {
                this.slideNext();
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupCategoryFilters() {
        this.categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                
                // Update active tab
                this.categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Filter cards with animation
                this.filterByCategory(category);
            });
        });
    }
    
    filterByCategory(category) {
        // Reset to first slide
        this.currentIndex = 0;
        
        // Show/hide cards with animation
        this.cards.forEach((card, index) => {
            const cardCategory = card.dataset.category;
            const shouldShow = category === 'all' || cardCategory === category;
            
            if (shouldShow) {
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, index * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Update visible cards count and reset carousel
        setTimeout(() => {
            this.updateCarousel();
        }, 350);
    }
    
    createPaginationDots() {
        if (!this.paginationContainer) return;
        
        this.paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(this.totalCards / this.cardsPerView);
        
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'pagination-dot';
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.currentIndex = i * this.cardsPerView;
                this.updateCarousel();
            });
            
            this.paginationContainer.appendChild(dot);
        }
    }
    
    updatePagination() {
        const dots = this.paginationContainer.querySelectorAll('.pagination-dot');
        const currentPage = Math.floor(this.currentIndex / this.cardsPerView);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }
    
    slidePrev() {
        if (this.currentIndex > 0) {
            this.currentIndex = Math.max(0, this.currentIndex - this.cardsPerView);
            this.updateCarousel();
        } else {
            // Loop to end
            this.currentIndex = this.maxIndex;
            this.updateCarousel();
        }
        
        // Reset auto-scroll timer
        this.resetAutoScroll();
    }
    
    slideNext() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex = Math.min(this.maxIndex, this.currentIndex + this.cardsPerView);
            this.updateCarousel();
        } else {
            // Loop to beginning
            this.currentIndex = 0;
            this.updateCarousel();
        }
        
        // Reset auto-scroll timer
        this.resetAutoScroll();
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        // Calculate visible cards after filtering
        const visibleCards = Array.from(this.cards).filter(card => 
            card.style.display !== 'none'
        );
        
        // Update max index based on visible cards
        this.totalCards = visibleCards.length;
        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        
        // Ensure current index is valid
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
        
        // Calculate translation
        const cardWidth = this.cards[0]?.offsetWidth || 0;
        const gap = 30; // Gap between cards
        const translateX = -(this.currentIndex * (cardWidth + gap));
        
        // Apply smooth translation
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Update pagination
        this.updatePagination();
        
        // Update progress bar
        this.updateProgressBar();
        
        // Add entrance animation to visible cards
        this.animateVisibleCards();
    }
    
    animateVisibleCards() {
        const visibleStart = this.currentIndex;
        const visibleEnd = Math.min(visibleStart + this.cardsPerView, this.totalCards);
        
        this.cards.forEach((card, index) => {
            if (index >= visibleStart && index < visibleEnd) {
                card.classList.add('in-view');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, (index - visibleStart) * 100);
            } else {
                card.classList.remove('in-view');
            }
        });
    }
    
    updateNavigationButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = false; // Always enabled for infinite scroll
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = false; // Always enabled for infinite scroll
        }
    }
    
    updateProgressBar() {
        if (!this.progressBar) return;
        
        const progress = ((this.currentIndex + 1) / (this.maxIndex + 1)) * 100;
        this.progressBar.style.width = `${Math.min(100, Math.max(10, progress))}%`;
    }
    
    startAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
        }
        
        this.autoScrollInterval = setInterval(() => {
            if (!this.isHovering && !this.isDragging) {
                this.slideNext();
            }
        }, this.autoScrollDelay);
    }
    
    resetAutoScroll() {
        this.startAutoScroll();
    }
    
    handleMouseEnter() {
        this.isHovering = true;
    }
    
    handleMouseLeave() {
        this.isHovering = false;
    }
    
    // Touch handlers for mobile swipe
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchMove(e) {
        // Optional: Add drag visual feedback
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                this.slideNext();
            } else {
                // Swipe right - prev
                this.slidePrev();
            }
        }
    }
    
    // Mouse drag handlers for desktop
    handleDragStart(e) {
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.track.style.cursor = 'grabbing';
        this.track.style.transition = 'none';
    }
    
    handleDragMove(e) {
        if (!this.isDragging) return;
        
        const dragDistance = e.clientX - this.dragStartX;
        const cardWidth = this.cards[0]?.offsetWidth || 0;
        const currentTranslate = -(this.currentIndex * (cardWidth + 30));
        
        this.track.style.transform = `translateX(${currentTranslate + dragDistance}px)`;
    }
    
    handleDragEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.cursor = '';
        this.track.style.transition = '';
        
        const dragDistance = e.clientX - this.dragStartX;
        const threshold = 100;
        
        if (Math.abs(dragDistance) > threshold) {
            if (dragDistance > 0) {
                this.slidePrev();
            } else {
                this.slideNext();
            }
        } else {
            this.updateCarousel();
        }
    }
    
    animateCardHover(card) {
        // Add hover class for additional animations if needed
        card.classList.add('hovering');
    }
    
    resetCardHover(card) {
        card.classList.remove('hovering');
    }
    
    getCardsPerView() {
        const width = window.innerWidth;
        
        if (width > 1200) {
            return 3;
        } else if (width > 767) {
            return 2;
        } else {
            return 1;
        }
    }
    
    handleResize() {
        const newCardsPerView = this.getCardsPerView();
        
        if (newCardsPerView !== this.cardsPerView) {
            this.cardsPerView = newCardsPerView;
            this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            
            // Recreate pagination
            this.createPaginationDots();
            
            // Update carousel
            this.updateCarousel();
        }
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate section elements
                    this.animateSectionEntrance();
                    
                    // Start auto-scroll when visible
                    this.startAutoScroll();
                } else {
                    // Pause auto-scroll when not visible
                    if (this.autoScrollInterval) {
                        clearInterval(this.autoScrollInterval);
                    }
                }
            });
        }, options);
        
        if (this.section) {
            observer.observe(this.section);
        }
    }
    
    animateSectionEntrance() {
        // Animate header elements
        const header = this.section.querySelector('.carousel-section-header');
        if (header) {
            header.style.animation = 'fadeInUp 0.8s ease';
        }
        
        // Animate category tabs
        this.categoryTabs.forEach((tab, index) => {
            setTimeout(() => {
                tab.style.animation = 'fadeInUp 0.5s ease backwards';
            }, index * 50);
        });
        
        // Animate visible cards
        this.animateVisibleCards();
    }
    
    isElementInViewport() {
        if (!this.section) return false;
        
        const rect = this.section.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    setupResponsive() {
        // Add responsive class to section based on viewport
        const updateResponsiveClass = () => {
            const width = window.innerWidth;
            
            if (width <= 767) {
                this.section.classList.add('mobile-view');
                this.section.classList.remove('tablet-view', 'desktop-view');
            } else if (width <= 1200) {
                this.section.classList.add('tablet-view');
                this.section.classList.remove('mobile-view', 'desktop-view');
            } else {
                this.section.classList.add('desktop-view');
                this.section.classList.remove('mobile-view', 'tablet-view');
            }
        };
        
        updateResponsiveClass();
        window.addEventListener('resize', updateResponsiveClass);
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const servicesCarousel = new ServicesCarousel();
    
    // Store instance globally for debugging
    window.servicesCarousel = servicesCarousel;
    
    console.log('Services Carousel initialized');
});

/* ==========================================================================
   ABOUT SECTION
   ========================================================================== */
class ModernAboutSection {
    constructor() {
        // DOM Elements
        this.section = document.querySelector('.about-modern');
        this.header = document.querySelector('.about-header');
        this.welcomeCard = document.querySelector('.welcome-card');
        this.leaderCards = document.querySelectorAll('.leader-card');
        this.valueCards = document.querySelectorAll('.value-card');
        this.galleryImages = document.querySelectorAll('.gallery-grid img, .gallery-main img');
        this.ctaSection = document.querySelector('.about-cta');
        
        // Animation State
        this.isAnimated = {
            header: false,
            welcome: false,
            leaders: false,
            values: false,
            office: false,
            cta: false
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        if (!this.section) return;
        
        // Setup intersection observers for scroll animations
        this.setupIntersectionObservers();
        
        // Setup interactive elements
        this.setupInteractions();
        
        // Setup parallax effects
        this.setupParallaxEffects();
        
        // Setup counter animations
        this.setupCounterAnimations();
        
        // Setup image lazy loading
        this.setupImageLazyLoading();
        
        // Setup responsive behaviors
        this.setupResponsive();
    }
    
    setupIntersectionObservers() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe main sections
        const elementsToObserve = [
            this.header,
            this.welcomeCard,
            ...this.leaderCards,
            ...this.valueCards,
            document.querySelector('.office-preview'),
            this.ctaSection
        ];
        
        elementsToObserve.forEach(element => {
            if (element) {
                observer.observe(element);
            }
        });
    }
    
    animateElement(element) {
        // Header animation
        if (element === this.header && !this.isAnimated.header) {
            this.animateHeader();
            this.isAnimated.header = true;
        }
        
        // Welcome card animation
        if (element === this.welcomeCard && !this.isAnimated.welcome) {
            this.animateWelcomeCard();
            this.isAnimated.welcome = true;
        }
        
        // Leader cards animation
        if (element.classList.contains('leader-card')) {
            this.animateLeaderCard(element);
        }
        
        // Value cards animation
        if (element.classList.contains('value-card')) {
            this.animateValueCard(element);
        }
        
        // Office preview animation
        if (element.classList.contains('office-preview') && !this.isAnimated.office) {
            this.animateOfficePreview();
            this.isAnimated.office = true;
        }
        
        // CTA section animation
        if (element === this.ctaSection && !this.isAnimated.cta) {
            this.animateCTA();
            this.isAnimated.cta = true;
        }
    }
    
    animateHeader() {
        const badge = this.header.querySelector('.header-badge');
        const title = this.header.querySelector('.about-title');
        const subtitle = this.header.querySelector('.about-subtitle');
        
        // Stagger animations
        setTimeout(() => {
            if (badge) {
                badge.style.animation = 'fadeInUp 0.8s ease forwards, float 6s ease-in-out infinite 0.8s';
            }
        }, 100);
        
        setTimeout(() => {
            if (title) {
                const words = title.querySelectorAll('.title-line, .title-highlight');
                words.forEach((word, index) => {
                    word.style.opacity = '0';
                    word.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        word.style.transition = 'all 0.8s ease';
                        word.style.opacity = '1';
                        word.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
        }, 300);
        
        setTimeout(() => {
            if (subtitle) {
                subtitle.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        }, 600);
    }
    
    animateWelcomeCard() {
        const content = this.welcomeCard.querySelector('.welcome-content');
        const visual = this.welcomeCard.querySelector('.welcome-visual');
        const features = this.welcomeCard.querySelectorAll('.feature-item');
        
        // Animate main card
        this.welcomeCard.style.animation = 'fadeInUp 1s ease forwards';
        
        // Animate content
        setTimeout(() => {
            if (content) {
                content.style.animation = 'fadeIn 0.8s ease forwards';
            }
        }, 300);
        
        // Animate visual
        setTimeout(() => {
            if (visual) {
                visual.style.animation = 'slideInRight 0.8s ease forwards';
            }
        }, 500);
        
        // Animate features with stagger
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    feature.style.transition = 'all 0.5s ease';
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateX(0)';
                }, 100);
            }, 700 + (index * 100));
        });
    }
    
    animateLeaderCard(card) {
        const image = card.querySelector('.leader-image-wrapper');
        const content = card.querySelector('.leader-content');
        const stats = card.querySelectorAll('.stat-item');
        const tags = card.querySelectorAll('.specialty-tag');
        
        // Main card fade in
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
        
        // Animate image
        setTimeout(() => {
            if (image) {
                image.style.animation = 'fadeIn 0.8s ease forwards';
            }
        }, 300);
        
        // Animate content
        setTimeout(() => {
            if (content) {
                content.style.animation = 'fadeIn 0.8s ease forwards';
            }
        }, 500);
        
        // Animate stats with counter
        stats.forEach((stat, index) => {
            setTimeout(() => {
                const number = stat.querySelector('.stat-number');
                if (number) {
                    this.animateCounter(number);
                }
                stat.style.animation = 'scaleIn 0.5s ease forwards';
            }, 700 + (index * 100));
        });
        
        // Animate specialty tags
        tags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.opacity = '0';
                tag.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    tag.style.transition = 'all 0.3s ease';
                    tag.style.opacity = '1';
                    tag.style.transform = 'scale(1)';
                }, 50);
            }, 900 + (index * 50));
        });
    }
    
    animateValueCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, Math.random() * 300);
        
        // Animate icon
        const icon = card.querySelector('.value-icon');
        if (icon) {
            setTimeout(() => {
                icon.style.animation = 'bounceIn 0.8s ease';
            }, 300);
        }
    }
    
    animateOfficePreview() {
        const preview = document.querySelector('.office-preview');
        const images = preview.querySelectorAll('img');
        
        // Animate container
        preview.style.animation = 'fadeIn 1s ease forwards';
        
        // Animate images with stagger
        images.forEach((img, index) => {
            setTimeout(() => {
                img.style.opacity = '0';
                img.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    img.style.transition = 'all 0.6s ease';
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                }, 100);
            }, 300 + (index * 150));
        });
    }
    
    animateCTA() {
        const title = this.ctaSection.querySelector('.cta-title');
        const subtitle = this.ctaSection.querySelector('.cta-subtitle');
        const buttons = this.ctaSection.querySelectorAll('.cta-button');
        const stats = this.ctaSection.querySelectorAll('.cta-stat');
        
        // Animate background
        this.ctaSection.style.animation = 'slideInUp 1s ease forwards';
        
        // Animate text
        setTimeout(() => {
            if (title) {
                title.style.animation = 'fadeIn 0.8s ease forwards';
            }
            if (subtitle) {
                subtitle.style.animation = 'fadeIn 0.8s ease 0.2s forwards';
            }
        }, 300);
        
        // Animate buttons
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = '0';
                button.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    button.style.transition = 'all 0.5s ease';
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0)';
                }, 100);
            }, 600 + (index * 100));
        });
        
        // Animate stats with counter
        stats.forEach((stat, index) => {
            setTimeout(() => {
                const value = stat.querySelector('.stat-value');
                if (value) {
                    this.animateCounter(value);
                }
                stat.style.animation = 'fadeInUp 0.6s ease forwards';
            }, 800 + (index * 100));
        });
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const value = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.replace(/[0-9]/g, '');
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                element.textContent = value + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    }
    
    setupInteractions() {
        // Leader card interactions
        this.leaderCards.forEach(card => {
            const imageContainer = card.querySelector('.image-container');
            const overlay = card.querySelector('.image-overlay');
            const specialtyTags = card.querySelectorAll('.specialty-tag');
            
            // Image hover effect
            if (imageContainer) {
                imageContainer.addEventListener('mouseenter', () => {
                    if (overlay) {
                        overlay.style.opacity = '1';
                    }
                });
                
                imageContainer.addEventListener('mouseleave', () => {
                    if (overlay) {
                        overlay.style.opacity = '0';
                    }
                });
            }
            
            // Specialty tag hover effects
            specialtyTags.forEach(tag => {
                tag.addEventListener('mouseenter', () => {
                    tag.style.transform = 'translateY(-3px) scale(1.05)';
                    tag.style.boxShadow = '0 5px 15px rgba(0, 216, 132, 0.2)';
                });
                
                tag.addEventListener('mouseleave', () => {
                    tag.style.transform = '';
                    tag.style.boxShadow = '';
                });
            });
        });
        
        // Welcome features hover
        const features = document.querySelectorAll('.feature-item');
        features.forEach(feature => {
            feature.addEventListener('mouseenter', () => {
                const icon = feature.querySelector('i');
                if (icon) {
                    icon.style.animation = 'bounce 0.5s ease';
                    setTimeout(() => {
                        icon.style.animation = '';
                    }, 500);
                }
            });
        });
        
        // Gallery image interactions
        this.galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                this.openImageModal(img.src, img.alt);
            });
            
            img.style.cursor = 'pointer';
        });
        
        // CTA button ripple effect
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    openImageModal(src, alt) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close"><i class="ri-close-line"></i></button>
                <img src="${src}" alt="${alt}">
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;
        
        const overlay = modal.querySelector('.modal-overlay');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            animation: zoomIn 0.3s ease;
        `;
        
        const img = modal.querySelector('img');
        img.style.cssText = `
            width: 100%;
            height: auto;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -20px;
            right: -20px;
            width: 44px;
            height: 44px;
            background: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            color: #1f2937;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1;
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // ESC key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
    
    setupParallaxEffects() {
        if (window.innerWidth > 1024) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const sectionTop = this.section.offsetTop;
                const sectionHeight = this.section.offsetHeight;
                
                // Only apply parallax when section is in viewport
                if (scrolled > sectionTop - window.innerHeight && 
                    scrolled < sectionTop + sectionHeight) {
                    
                    // Parallax for decoration elements
                    const decorations = document.querySelectorAll('.decoration-circle, .visual-pattern');
                    decorations.forEach(decoration => {
                        const speed = 0.5;
                        const yPos = -(scrolled * speed);
                        decoration.style.transform = `translateY(${yPos}px)`;
                    });
                    
                    // Parallax for CTA particles
                    const particles = document.querySelectorAll('.cta-particle');
                    particles.forEach((particle, index) => {
                        const speed = 0.3 * (index + 1);
                        const yPos = -(scrolled * speed * 0.3);
                        particle.style.transform = `translate(${yPos}px, ${yPos}px)`;
                    });
                }
            });
        }
    }
    
    setupImageLazyLoading() {
        const images = this.section.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                        
                        // Add fade in animation
                        img.addEventListener('load', () => {
                            img.style.animation = 'fadeIn 0.5s ease';
                        });
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    setupResponsive() {
        const checkMobile = () => {
            const isMobile = window.innerWidth <= 767;
            
            if (isMobile) {
                // Simplify animations on mobile
                this.section.style.animation = 'none';
                
                // Remove parallax on mobile
                window.removeEventListener('scroll', this.setupParallaxEffects);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
    }
}

// CSS Animation Keyframes
const animationStyles = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(60px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// Add animation styles to document
if (!document.getElementById('about-animations')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'about-animations';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const modernAbout = new ModernAboutSection();
    
    // Store instance for debugging
    window.modernAbout = modernAbout;
    
    console.log('Modern About Section initialized');
});

/* ==========================================================================
   TEAM SECTION
   ========================================================================== */
class Team {
    constructor() {
        this.section = document.querySelector('.team');
        this.cards = document.querySelectorAll('.team-card');
        
        this.init();
    }
    
    init() {
        if (!this.section) return;
        
        // Animate on scroll
        this.initScrollAnimation();
        
        // Card hover effects
        this.initCardEffects();
    }
    
    initScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Animate cards
                    this.cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.1 });
        
        // Setup initial state
        this.section.style.opacity = '0';
        this.section.style.transform = 'translateY(30px)';
        this.section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        observer.observe(this.section);
    }
    
    initCardEffects() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const image = card.querySelector('.team-image img');
                if (image) {
                    image.style.transform = 'scale(1.1)';
                    image.style.transition = 'transform 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const image = card.querySelector('.team-image img');
                if (image) {
                    image.style.transform = '';
                }
            });
        });
    }
}

/* ==========================================================================
   REVIEWS SECTION
   ========================================================================== */
class Reviews {
    constructor() {
        this.section = document.querySelector('.reviews');
        this.cards = document.querySelectorAll('.review-card');
        
        this.init();
    }
    
    init() {
        if (!this.section) return;
        
        // Animate on scroll
        this.initScrollAnimation();
        
        // Card hover effects
        this.initCardEffects();
    }
    
    initScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Animate cards
                    this.cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                            
                            // Animate stars
                            const stars = card.querySelectorAll('.stars i');
                            stars.forEach((star, starIndex) => {
                                setTimeout(() => {
                                    star.style.transform = 'scale(1)';
                                }, starIndex * 100);
                            });
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.2 });
        
        // Setup initial state
        this.section.style.opacity = '0';
        this.section.style.transform = 'translateY(30px)';
        this.section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Hide stars initially
            const stars = card.querySelectorAll('.stars i');
            stars.forEach(star => {
                star.style.transform = 'scale(0)';
                star.style.transition = 'transform 0.3s ease';
            });
        });
        
        observer.observe(this.section);
    }
    
    initCardEffects() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const stars = card.querySelectorAll('.stars i');
                stars.forEach((star, index) => {
                    setTimeout(() => {
                        star.style.transform = 'scale(1.2) rotate(10deg)';
                    }, index * 50);
                });
            });
            
            card.addEventListener('mouseleave', () => {
                const stars = card.querySelectorAll('.stars i');
                stars.forEach(star => {
                    star.style.transform = 'scale(1)';
                });
            });
        });
    }
}

/* ==========================================================================
   CONTACT SECTION
   ========================================================================== */
class Contact {
    constructor() {
        this.section = document.querySelector('.contact');
        this.form = document.getElementById('contactForm');
        this.cards = document.querySelectorAll('.contact-card');
        
        this.init();
    }
    
    init() {
        if (!this.section) return;
        
        // Animate on scroll
        this.initScrollAnimation();
        
        // Form handling
        this.initForm();
        
        // Card effects
        this.initCardEffects();
    }
    
    initScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Animate cards
                    this.cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                    
                    // Animate form
                    if (this.form) {
                        setTimeout(() => {
                            this.form.style.opacity = '1';
                            this.form.style.transform = 'translateX(0)';
                        }, 300);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        // Setup initial state
        this.section.style.opacity = '0';
        this.section.style.transform = 'translateY(30px)';
        this.section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        if (this.form) {
            this.form.style.opacity = '0';
            this.form.style.transform = 'translateX(20px)';
            this.form.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }
        
        observer.observe(this.section);
    }
    
    initForm() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this.form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            console.log('Form submitted:', data);
            
            // Show success message
            this.showMessage('Thank you for your message! We will contact you within 24 hours.');
            
            // Reset form
            this.form.reset();
        });
        
        // Form field animations
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transform = 'translateY(-2px)';
                input.style.boxShadow = '0 4px 12px rgba(0, 216, 132, 0.2)';
            });
            
            input.addEventListener('blur', () => {
                input.style.transform = '';
                input.style.boxShadow = '';
            });
        });
    }
    
    initCardEffects() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('i');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }
    
    showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }
}

/* ==========================================================================
   FOOTER SECTION
   ========================================================================== */
class Footer {
    constructor() {
        this.footer = document.querySelector('.footer');
        
        this.init();
    }
    
    init() {
        if (!this.footer) return;
        
        // Add any footer-specific functionality here
        this.initScrollAnimation();
    }
    
    initScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        // Setup initial state
        this.footer.style.opacity = '0';
        this.footer.style.transform = 'translateY(20px)';
        this.footer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(this.footer);
    }
}

/* ==========================================================================
   INITIALIZE APP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    console.log('App initialized');
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            to {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
