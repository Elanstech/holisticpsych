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
        this.about = new CompactAboutSection();
        this.team = new TeamPreviewCarousel();
        this.reviews = new ElegantReviewsInstagramSection();
        this.contact = new HolisticContactSection();
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

class CompactAboutSection {
    constructor() {
        this.section = document.querySelector('.about-modern-compact');
        this.isInitialized = false;
        this.animatedElements = new Set();
        
        this.init();
    }
    
    init() {
        if (!this.section || this.isInitialized) return;
        
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Ensure images are loaded first
        this.preloadImages().then(() => {
            this.setupIntersectionObserver();
            this.setupInteractions();
            this.setupCounters();
            this.isInitialized = true;
            console.log('Compact About Section initialized successfully');
        });
    }
    
    preloadImages() {
        const images = this.section.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve); // Resolve even on error
                }
            });
        });
        
        return Promise.all(imagePromises);
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe elements
        const elementsToObserve = [
            '.about-header',
            '.welcome-card',
            '.leader-card-compact',
            '.value-card',
            '.about-cta'
        ];
        
        elementsToObserve.forEach(selector => {
            const elements = this.section.querySelectorAll(selector);
            elements.forEach(element => observer.observe(element));
        });
    }
    
    animateElement(element) {
        // Simple fade in animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Trigger animation
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        // Handle counters
        const counters = element.querySelectorAll('.stat-number, .stat-value');
        counters.forEach(counter => {
            setTimeout(() => this.animateCounter(counter), 300);
        });
    }
    
    animateCounter(element) {
        if (element.dataset.animated) return;
        
        const text = element.textContent;
        const numbers = text.match(/\d+/);
        if (!numbers) return;
        
        const finalValue = parseInt(numbers[0]);
        const suffix = text.replace(/\d+/, '');
        const duration = 1500;
        const steps = 60;
        const increment = finalValue / steps;
        
        let current = 0;
        let step = 0;
        
        element.dataset.animated = 'true';
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                element.textContent = finalValue + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    }
    
    setupInteractions() {
        // Leader card hover effects
        const leaderCards = this.section.querySelectorAll('.leader-card-compact');
        leaderCards.forEach(card => {
            const image = card.querySelector('.leader-image');
            const overlay = card.querySelector('.image-overlay');
            
            if (image && overlay) {
                card.addEventListener('mouseenter', () => {
                    overlay.style.opacity = '1';
                });
                
                card.addEventListener('mouseleave', () => {
                    overlay.style.opacity = '0';
                });
            }
        });
        
        // Feature item hover effects
        const features = this.section.querySelectorAll('.feature-item');
        features.forEach(feature => {
            feature.addEventListener('mouseenter', () => {
                const icon = feature.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            feature.addEventListener('mouseleave', () => {
                const icon = feature.querySelector('i');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
        
        // Specialty tag hover effects
        const tags = this.section.querySelectorAll('.specialty-tag');
        tags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-2px)';
                tag.style.boxShadow = '0 4px 12px rgba(0, 216, 132, 0.2)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
                tag.style.boxShadow = '';
            });
        });
        
        // CTA button effects
        const ctaButtons = this.section.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }
    
    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    setupCounters() {
        // Backup counter setup for any missed elements
        const allCounters = this.section.querySelectorAll('.stat-number, .stat-value');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    setTimeout(() => this.animateCounter(entry.target), 500);
                }
            });
        }, { threshold: 0.5 });
        
        allCounters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
}

// Add required CSS animations
const requiredStyles = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.leader-image {
    transition: transform 0.5s ease !important;
}

.image-overlay {
    transition: opacity 0.3s ease !important;
}

.feature-item i {
    transition: transform 0.3s ease !important;
}

.specialty-tag {
    transition: all 0.3s ease !important;
}

.value-icon {
    transition: all 0.3s ease !important;
}

.value-card:hover .value-icon {
    transform: scale(1.1) !important;
}

.visual-container {
    transition: transform 0.5s ease !important;
}

.welcome-card:hover .visual-container {
    transform: perspective(1000px) rotateY(0deg) !important;
}
`;

// Add styles if not already present
if (!document.getElementById('compact-about-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'compact-about-styles';
    styleSheet.textContent = requiredStyles;
    document.head.appendChild(styleSheet);
}

// Initialize when ready
let aboutInstance = null;

function initCompactAbout() {
    if (!aboutInstance && document.querySelector('.about-modern-compact')) {
        aboutInstance = new CompactAboutSection();
        window.compactAbout = aboutInstance; // For debugging
    }
}

// Multiple initialization methods to ensure it works
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompactAbout);
} else {
    initCompactAbout();
}

// Backup initialization
setTimeout(initCompactAbout, 100);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !aboutInstance) {
        initCompactAbout();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompactAboutSection;
}

/* ==========================================================================
   TEAM SECTION
   ========================================================================== */
class TeamPreviewCarousel {
    constructor() {
        // DOM Elements - Using unique selectors to avoid conflicts
        this.section = document.querySelector('.team-preview-section');
        this.slider = document.querySelector('.team-carousel-slider');
        this.slides = document.querySelectorAll('.team-member-slide');
        this.viewport = document.querySelector('.team-carousel-viewport');
        this.prevBtn = document.querySelector('.team-nav-prev');
        this.nextBtn = document.querySelector('.team-nav-next');
        this.progressFill = document.querySelector('.team-progress-fill');
        this.dotsContainer = document.querySelector('.team-carousel-dots');
        this.filterTabs = document.querySelectorAll('.team-filter-tab');
        this.ctaButtons = document.querySelectorAll('.team-cta-btn');
        this.joinApplyBtn = document.querySelector('.join-apply-btn');
        
        // Carousel State
        this.currentIndex = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.totalSlides = this.slides.length;
        this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        this.isAnimating = false;
        
        // Auto-play State
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.isAutoPlaying = true;
        this.isHovering = false;
        
        // Touch/Drag State
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.dragThreshold = 50;
        
        // Animation State
        this.animatedElements = new Set();
        this.statsAnimated = new Set();
        
        this.init();
    }
    
    init() {
        if (!this.section || !this.slider) {
            console.warn('Team Preview: Required elements not found');
            return;
        }
        
        // Setup all functionality
        this.setupEventListeners();
        this.setupFilterTabs();
        this.setupCarouselDots();
        this.setupIntersectionObserver();
        this.setupTouchEvents();
        this.setupButtonInteractions();
        this.updateCarousel();
        this.startAutoPlay();
        
        console.log('Team Preview Carousel initialized successfully');
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.goToPrevious());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.goToNext());
        }
        
        // Hover pause auto-play
        if (this.viewport) {
            this.viewport.addEventListener('mouseenter', () => this.handleMouseEnter());
            this.viewport.addEventListener('mouseleave', () => this.handleMouseLeave());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Prevent image dragging
        this.slides.forEach(slide => {
            const images = slide.querySelectorAll('img');
            images.forEach(img => {
                img.addEventListener('dragstart', (e) => e.preventDefault());
            });
        });
    }
    
    setupFilterTabs() {
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const filter = tab.dataset.filter;
                
                // Update active tab
                this.filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Filter slides
                this.filterSlides(filter);
                
                // Add ripple effect
                this.createRippleEffect(event, tab);
            });
        });
    }
    
    filterSlides(filter) {
        // Reset to first slide
        this.currentIndex = 0;
        
        // Show/hide slides with animation
        this.slides.forEach((slide, index) => {
            const category = slide.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                slide.style.display = '';
                slide.style.opacity = '0';
                slide.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    slide.style.opacity = '';
                    slide.style.transform = '';
                }, index * 100);
            } else {
                slide.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                slide.style.opacity = '0';
                slide.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    slide.style.display = 'none';
                }, 300);
            }
        });
        
        // Update carousel after filter
        setTimeout(() => {
            this.updateVisibleSlides();
            this.updateCarousel();
            this.setupCarouselDots();
        }, 400);
    }
    
    updateVisibleSlides() {
        const visibleSlides = Array.from(this.slides).filter(slide => 
            slide.style.display !== 'none'
        );
        this.totalSlides = visibleSlides.length;
        this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
    }
    
    setupCarouselDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        const totalPages = Math.ceil(this.totalSlides / this.slidesPerView);
        
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'team-carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.currentIndex = i * this.slidesPerView;
                this.updateCarousel();
                this.resetAutoPlay();
            });
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElementEntrance(entry.target);
                    this.animatedElements.add(entry.target);
                    
                    if (entry.target === this.section) {
                        this.startAutoPlay();
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });
        
        // Observe main elements
        const elementsToObserve = [
            '.team-preview-header',
            '.team-filter-tabs',
            '.team-preview-carousel',
            '.team-preview-cta'
        ];
        
        elementsToObserve.forEach(selector => {
            const element = this.section.querySelector(selector);
            if (element) observer.observe(element);
        });
        
        // Observe individual slides for counter animation
        this.slides.forEach(slide => {
            observer.observe(slide);
        });
        
        if (this.section) observer.observe(this.section);
    }
    
    animateElementEntrance(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        // Animate counters if this is a slide
        if (element.classList.contains('team-member-slide')) {
            const counters = element.querySelectorAll('.stat-value');
            counters.forEach(counter => {
                if (!this.statsAnimated.has(counter)) {
                    setTimeout(() => this.animateCounter(counter), 800);
                    this.statsAnimated.add(counter);
                }
            });
        }
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)(\D*)/);
        
        if (!match) return;
        
        const finalValue = parseInt(match[1]);
        const suffix = match[2];
        const duration = 1500;
        const steps = 50;
        const increment = finalValue / steps;
        
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                element.textContent = finalValue + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    }
    
    setupTouchEvents() {
        if (!this.viewport) return;
        
        // Touch events for mobile
        this.viewport.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.viewport.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.viewport.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Mouse drag events for desktop
        this.viewport.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.viewport.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.viewport.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.viewport.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
    }
    
    setupButtonInteractions() {
        // CTA button interactions
        this.ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.createRippleEffect(e, btn));
            
            btn.addEventListener('mouseenter', () => {
                const icons = btn.querySelectorAll('i');
                icons.forEach((icon, index) => {
                    setTimeout(() => {
                        icon.style.animation = 'teamPreviewIconBounce 0.5s ease';
                    }, index * 100);
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                const icons = btn.querySelectorAll('i');
                icons.forEach(icon => {
                    icon.style.animation = '';
                });
            });
        });
        
        // Join apply button interaction
        if (this.joinApplyBtn) {
            this.joinApplyBtn.addEventListener('click', (e) => {
                this.createRippleEffect(e, this.joinApplyBtn);
            });
        }
        
        // Profile link interactions
        const profileLinks = this.section.querySelectorAll('.member-profile-link');
        profileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.createRippleEffect(e, link);
            });
        });
        
        // Navigation button ripples
        [this.prevBtn, this.nextBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('mousedown', (e) => {
                    const ripple = btn.querySelector('.nav-ripple');
                    if (ripple) {
                        ripple.style.width = '60px';
                        ripple.style.height = '60px';
                        ripple.style.top = '50%';
                        ripple.style.left = '50%';
                    }
                });
                
                btn.addEventListener('mouseup', () => {
                    const ripple = btn.querySelector('.nav-ripple');
                    if (ripple) {
                        setTimeout(() => {
                            ripple.style.width = '0';
                            ripple.style.height = '0';
                        }, 150);
                    }
                });
            }
        });
    }
    
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: teamPreviewRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // Touch Event Handlers
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        this.pauseAutoPlay();
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.touches[0].clientX;
        const diff = this.startX - this.currentX;
        
        // Prevent vertical scrolling when swiping horizontally
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        const diff = this.startX - this.currentX;
        
        if (Math.abs(diff) > this.dragThreshold) {
            if (diff > 0) {
                this.goToNext();
            } else {
                this.goToPrevious();
            }
        }
        
        this.resetDragState();
    }
    
    // Mouse Drag Event Handlers
    handleMouseDown(e) {
        this.startX = e.clientX;
        this.isDragging = true;
        this.viewport.style.cursor = 'grabbing';
        this.pauseAutoPlay();
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.clientX;
    }
    
    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        const diff = this.startX - this.currentX;
        
        if (Math.abs(diff) > this.dragThreshold) {
            if (diff > 0) {
                this.goToNext();
            } else {
                this.goToPrevious();
            }
        }
        
        this.resetDragState();
    }
    
    resetDragState() {
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.viewport.style.cursor = '';
        
        if (!this.isHovering) {
            this.startAutoPlay();
        }
    }
    
    // Keyboard Event Handler
    handleKeyboard(e) {
        if (!this.isElementInViewport()) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.goToPrevious();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.goToNext();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoPlay();
                break;
        }
    }
    
    // Navigation Methods
    goToPrevious() {
        if (this.isAnimating) return;
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.maxIndex; // Loop to end
        }
        
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToNext() {
        if (this.isAnimating) return;
        
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop to beginning
        }
        
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        if (this.isAnimating) return;
        
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    updateCarousel() {
        if (!this.slider || this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Calculate translation
        const slideWidth = this.slides[0]?.offsetWidth || 0;
        const gap = 30;
        const translateX = -(this.currentIndex * (slideWidth + gap));
        
        // Apply translation
        this.slider.style.transform = `translateX(${translateX}px)`;
        
        // Update active states
        this.updateSlideStates();
        this.updateProgressBar();
        this.updateDots();
        this.updateNavigationButtons();
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    updateSlideStates() {
        const visibleStart = this.currentIndex;
        const visibleEnd = Math.min(visibleStart + this.slidesPerView, this.totalSlides);
        
        this.slides.forEach((slide, index) => {
            const isVisible = index >= visibleStart && index < visibleEnd;
            const isActive = index === this.currentIndex;
            
            slide.classList.toggle('active', isActive);
            
            // Animate counters for visible slides
            if (isVisible && !this.statsAnimated.has(slide)) {
                const counters = slide.querySelectorAll('.stat-value');
                counters.forEach(counter => {
                    setTimeout(() => this.animateCounter(counter), 600);
                });
                this.statsAnimated.add(slide);
            }
        });
    }
    
    updateProgressBar() {
        if (!this.progressFill) return;
        
        const progress = ((this.currentIndex + 1) / (this.maxIndex + 1)) * 100;
        this.progressFill.style.width = `${Math.min(100, Math.max(25, progress))}%`;
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.team-carousel-dot');
        const currentPage = Math.floor(this.currentIndex / this.slidesPerView);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }
    
    updateNavigationButtons() {
        // Always enable buttons for infinite scroll
        if (this.prevBtn) this.prevBtn.disabled = false;
        if (this.nextBtn) this.nextBtn.disabled = false;
    }
    
    // Auto-play Methods
    startAutoPlay() {
        if (!this.isAutoPlaying || this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            if (!this.isHovering && !this.isDragging) {
                this.goToNext();
            }
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        if (this.isAutoPlaying && !this.isHovering) {
            this.startAutoPlay();
        }
    }
    
    toggleAutoPlay() {
        this.isAutoPlaying = !this.isAutoPlaying;
        
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        } else {
            this.pauseAutoPlay();
        }
    }
    
    handleMouseEnter() {
        this.isHovering = true;
        this.pauseAutoPlay();
    }
    
    handleMouseLeave() {
        this.isHovering = false;
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
    }
    
    // Responsive Methods
    getSlidesPerView() {
        const width = window.innerWidth;
        
        if (width > 1200) return 3;
        if (width > 767) return 2;
        return 1;
    }
    
    handleResize() {
        const newSlidesPerView = this.getSlidesPerView();
        
        if (newSlidesPerView !== this.slidesPerView) {
            this.slidesPerView = newSlidesPerView;
            this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            
            this.setupCarouselDots();
            this.updateCarousel();
        }
    }
    
    // Utility Methods
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
    
    // Public API
    getCurrentSlide() {
        return this.currentIndex;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    setAutoPlayDelay(delay) {
        this.autoPlayDelay = delay;
        this.resetAutoPlay();
    }
    
    // Cleanup
    destroy() {
        this.pauseAutoPlay();
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeyboard);
        
        // Clear animated elements
        this.animatedElements.clear();
        this.statsAnimated.clear();
        
        console.log('Team Preview Carousel destroyed');
    }
}

// Add required CSS animations
const teamPreviewStyles = `
@keyframes teamPreviewRipple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes teamPreviewIconBounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-4px) scale(1.1); }
}

.team-carousel-slider {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.team-member-slide {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.team-nav-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.team-carousel-dot {
    transition: all 0.3s ease !important;
}

.team-progress-fill {
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.team-filter-tab {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.team-cta-btn {
    transition: all 0.3s ease !important;
}

.member-photo {
    transition: transform 0.5s ease !important;
}

.degree-badge {
    transition: all 0.3s ease !important;
}

.expertise-tag {
    transition: all 0.3s ease !important;
}

.member-profile-link {
    transition: all 0.3s ease !important;
}

.join-apply-btn {
    transition: all 0.3s ease !important;
}

.nav-ripple {
    transition: all 0.3s ease !important;
}
`;

// Add styles to head if not present
if (!document.getElementById('team-preview-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'team-preview-styles';
    styleSheet.textContent = teamPreviewStyles;
    document.head.appendChild(styleSheet);
}

// Initialize Team Preview Carousel
let teamPreviewInstance = null;

function initTeamPreview() {
    if (!teamPreviewInstance && document.querySelector('.team-preview-section')) {
        teamPreviewInstance = new TeamPreviewCarousel();
        
        // Store globally for debugging
        window.teamPreview = teamPreviewInstance;
        
        console.log('Team Preview Carousel initialized');
    }
}

// Multiple initialization methods to ensure it works
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamPreview);
} else {
    initTeamPreview();
}

// Backup initialization
setTimeout(initTeamPreview, 100);

// Page visibility change handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden && teamPreviewInstance) {
        teamPreviewInstance.pauseAutoPlay();
    } else if (!document.hidden && teamPreviewInstance && teamPreviewInstance.isAutoPlaying) {
        teamPreviewInstance.startAutoPlay();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (teamPreviewInstance) {
        teamPreviewInstance.destroy();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeamPreviewCarousel;
}

/* ==========================================================================
   REVIEWS SECTION
   ========================================================================== */

class ElegantReviewsInstagramSection {
    constructor() {
        // DOM Elements
        this.section = document.querySelector('.elegant-reviews-instagram-section');
        this.testimonialTrack = document.querySelector('.elegant-testimonials-track');
        this.testimonialCards = document.querySelectorAll('.elegant-testimonial-card');
        this.prevBtn = document.querySelector('.elegant-nav-prev');
        this.nextBtn = document.querySelector('.elegant-nav-next');
        this.indicators = document.querySelectorAll('.elegant-indicator');
        this.ctaButtons = document.querySelectorAll('.elegant-cta-btn');
        this.googleReviewsLink = document.querySelector('.elegant-google-reviews-link');
        this.instagramFollowBtn = document.querySelector('.elegant-instagram-follow-btn');
        this.instagramFeedContainer = document.querySelector('.elegant-instagram-feed-container');
        this.instagramLoading = document.querySelector('.elegant-instagram-loading');
        
        // Testimonials State
        this.currentIndex = 0;
        this.totalTestimonials = this.testimonialCards.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.isPlaying = true;
        this.isHovering = false;
        
        // Touch/Drag State
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.threshold = 50;
        
        // Animation State
        this.animatedElements = new Set();
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        if (!this.section || this.isInitialized) return;
        
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.setupIntersectionObserver();
        this.setupTestimonialsCarousel();
        this.setupInstagramFeed();
        this.setupButtonInteractions();
        this.setupAccessibility();
        this.setupStarAnimations();
        this.isInitialized = true;
        
        console.log('Elegant Reviews & Instagram Section initialized successfully');
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                    
                    // Start auto-play when section is visible
                    if (entry.target === this.section) {
                        this.startAutoPlay();
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });
        
        // Observe elements for animation
        const elementsToObserve = [
            '.elegant-section-header',
            '.elegant-testimonials-wrapper',
            '.elegant-instagram-wrapper',
            '.elegant-bottom-cta'
        ];
        
        elementsToObserve.forEach(selector => {
            const elements = this.section.querySelectorAll(selector);
            elements.forEach(element => observer.observe(element));
        });
        
        // Observe the main section
        if (this.section) {
            observer.observe(this.section);
        }
    }
    
    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        // Animate child elements with stagger
        const childElements = element.querySelectorAll('.elegant-testimonial-card, .elegant-highlight-item');
        childElements.forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '0';
                child.style.transform = 'translateX(-20px)';
                child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateX(0)';
                });
            }, index * 100);
        });
    }
    
    setupTestimonialsCarousel() {
        if (!this.testimonialTrack || this.totalTestimonials === 0) return;
        
        // Setup event listeners
        this.setupCarouselControls();
        this.setupTouchEvents();
        this.setupHoverPause();
        
        // Initialize carousel
        this.updateCarousel();
        this.updateIndicators();
    }
    
    setupCarouselControls() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.slidePrev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.slideNext());
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isElementInViewport()) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.slidePrev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.slideNext();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleAutoPlay();
                    break;
            }
        });
    }
    
    setupTouchEvents() {
        if (!this.testimonialTrack) return;
        
        // Touch events for mobile swipe
        this.testimonialTrack.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.testimonialTrack.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.testimonialTrack.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Mouse drag events for desktop
        this.testimonialTrack.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.testimonialTrack.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.testimonialTrack.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.testimonialTrack.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Prevent context menu
        this.testimonialTrack.addEventListener('contextmenu', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        });
    }
    
    setupHoverPause() {
        const testimonialsWrapper = document.querySelector('.elegant-testimonials-wrapper');
        if (!testimonialsWrapper) return;
        
        testimonialsWrapper.addEventListener('mouseenter', () => {
            this.isHovering = true;
            this.pauseAutoPlay();
        });
        
        testimonialsWrapper.addEventListener('mouseleave', () => {
            this.isHovering = false;
            if (this.isPlaying) {
                this.startAutoPlay();
            }
        });
    }
    
    // Touch/Mouse Event Handlers
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.pauseAutoPlay();
    }
    
    handleTouchMove(e) {
        if (!this.startX) return;
        
        this.currentX = e.touches[0].clientX;
        const diff = this.startX - this.currentX;
        
        // Prevent default if swiping horizontally
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        if (!this.startX) return;
        
        const diff = this.startX - this.currentX;
        
        if (Math.abs(diff) > this.threshold) {
            if (diff > 0) {
                this.slideNext();
            } else {
                this.slidePrev();
            }
        }
        
        this.resetTouch();
    }
    
    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.testimonialTrack.style.cursor = 'grabbing';
        this.pauseAutoPlay();
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.clientX;
    }
    
    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.testimonialTrack.style.cursor = '';
        
        const diff = this.startX - this.currentX;
        
        if (Math.abs(diff) > this.threshold) {
            if (diff > 0) {
                this.slideNext();
            } else {
                this.slidePrev();
            }
        }
        
        this.resetTouch();
    }
    
    resetTouch() {
        this.startX = 0;
        this.currentX = 0;
        
        if (!this.isHovering && this.isPlaying) {
            this.startAutoPlay();
        }
    }
    
    // Navigation Methods
    slidePrev() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.totalTestimonials - 1;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    slideNext() {
        this.currentIndex = this.currentIndex < this.totalTestimonials - 1 ? this.currentIndex + 1 : 0;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    updateCarousel() {
        if (!this.testimonialTrack) return;
        
        // Calculate translation
        const translateX = -(this.currentIndex * 100);
        
        // Apply translation with smooth transition
        this.testimonialTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        this.updateIndicators();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Animate current testimonial
        this.animateCurrentTestimonial();
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateNavigationButtons() {
        // Enable all buttons for infinite scroll
        if (this.prevBtn) this.prevBtn.disabled = false;
        if (this.nextBtn) this.nextBtn.disabled = false;
    }
    
    animateCurrentTestimonial() {
        this.testimonialCards.forEach((card, index) => {
            const content = card.querySelector('.elegant-testimonial-content');
            const stars = card.querySelectorAll('.elegant-rating-stars i');
            
            if (index === this.currentIndex) {
                // Animate current testimonial
                setTimeout(() => {
                    if (content) {
                        content.style.animation = 'elegantTestimonialFadeIn 0.6s ease forwards';
                    }
                    
                    // Animate stars
                    stars.forEach((star, starIndex) => {
                        star.style.setProperty('--star-index', starIndex);
                        star.style.animation = `elegantStarGlow 2s ease-in-out infinite`;
                        star.style.animationDelay = `${starIndex * 0.1}s`;
                    });
                }, 200);
            }
        });
    }
    
    // Auto-play Methods
    startAutoPlay() {
        if (!this.isPlaying || this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            if (!this.isHovering && !this.isDragging) {
                this.slideNext();
            }
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        if (!this.isHovering) {
            this.startAutoPlay();
        }
    }
    
    toggleAutoPlay() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.startAutoPlay();
        } else {
            this.pauseAutoPlay();
        }
    }
    
    setupInstagramFeed() {
        this.monitorElfsightLoad();
        this.setupInstagramInteractions();
    }
    
    monitorElfsightLoad() {
        const checkElfsightLoad = () => {
            const elfsightWidget = this.section.querySelector('.elfsight-app-3e98e495-6739-43e0-8b40-1c3c1f597278');
            
            if (elfsightWidget && elfsightWidget.children.length > 0) {
                // Widget has loaded
                if (this.instagramLoading) {
                    this.instagramLoading.style.opacity = '0';
                    this.instagramLoading.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        this.instagramLoading.style.display = 'none';
                    }, 300);
                }
                
                // Animate the loaded feed
                elfsightWidget.style.opacity = '0';
                elfsightWidget.style.transform = 'translateY(20px)';
                elfsightWidget.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                setTimeout(() => {
                    elfsightWidget.style.opacity = '1';
                    elfsightWidget.style.transform = 'translateY(0)';
                }, 100);
                
                console.log('Instagram feed loaded successfully');
            } else {
                // Check again in 500ms
                setTimeout(checkElfsightLoad, 500);
            }
        };
        
        // Start monitoring after a delay
        setTimeout(checkElfsightLoad, 1000);
    }
    
    setupInstagramInteractions() {
        // Instagram follow button
        if (this.instagramFollowBtn) {
            this.instagramFollowBtn.addEventListener('mouseenter', () => {
                this.instagramFollowBtn.style.transform = 'translateY(-2px) scale(1.05)';
                this.instagramFollowBtn.style.boxShadow = '0 15px 35px rgba(131, 58, 180, 0.4)';
            });
            
            this.instagramFollowBtn.addEventListener('mouseleave', () => {
                this.instagramFollowBtn.style.transform = '';
                this.instagramFollowBtn.style.boxShadow = '';
            });
            
            this.instagramFollowBtn.addEventListener('click', (e) => {
                this.createRippleEffect(e, this.instagramFollowBtn);
            });
        }
        
        // Instagram highlights
        const highlightItems = this.section.querySelectorAll('.elegant-highlight-item');
        highlightItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.animation = 'elegantIconBounce 0.6s ease';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
    }
    
    setupButtonInteractions() {
        // CTA buttons
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
            
            button.addEventListener('mouseenter', () => {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.style.animation = 'elegantIconBounce 0.6s ease';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
        
        // Google reviews link
        if (this.googleReviewsLink) {
            this.googleReviewsLink.addEventListener('mouseenter', () => {
                this.googleReviewsLink.style.transform = 'translateY(-2px)';
                const arrow = this.googleReviewsLink.querySelector('i[class*="external"]');
                if (arrow) {
                    arrow.style.transform = 'scale(1.2)';
                }
            });
            
            this.googleReviewsLink.addEventListener('mouseleave', () => {
                this.googleReviewsLink.style.transform = '';
                const arrow = this.googleReviewsLink.querySelector('i[class*="external"]');
                if (arrow) {
                    arrow.style.transform = '';
                }
            });
        }
    }
    
    setupStarAnimations() {
        // Set CSS custom properties for star animation delays
        this.testimonialCards.forEach(card => {
            const stars = card.querySelectorAll('.elegant-rating-stars i');
            stars.forEach((star, index) => {
                star.style.setProperty('--star-index', index);
            });
        });
    }
    
    setupAccessibility() {
        // Add ARIA labels and keyboard support
        this.indicators.forEach((indicator, index) => {
            indicator.setAttribute('role', 'button');
            indicator.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            indicator.setAttribute('tabindex', '0');
            
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                }
            });
        });
        
        // Navigation buttons accessibility
        if (this.prevBtn) {
            this.prevBtn.setAttribute('aria-label', 'Previous testimonial');
        }
        
        if (this.nextBtn) {
            this.nextBtn.setAttribute('aria-label', 'Next testimonial');
        }
    }
    
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: elegantRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
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
    
    // Public methods for external control
    getCurrentSlide() {
        return this.currentIndex;
    }
    
    getTotalSlides() {
        return this.totalTestimonials;
    }
    
    setAutoPlayDelay(delay) {
        this.autoPlayDelay = delay;
        this.resetAutoPlay();
    }
    
    // Cleanup method
    destroy() {
        this.pauseAutoPlay();
        this.animatedElements.clear();
        this.isInitialized = false;
        
        // Remove event listeners
        document.removeEventListener('keydown', this.setupCarouselControls);
        
        console.log('Elegant Reviews & Instagram Section destroyed');
    }
}

// Add required CSS animations
const elegantReviewsStyles = `
@keyframes elegantRipple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes elegantTestimonialFadeIn {
    from {
        opacity: 0.7;
        transform: translateY(10px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes elegantIconBounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-4px) scale(1.1); }
}

.elegant-testimonials-track {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.elegant-testimonial-content {
    transition: all 0.3s ease !important;
}

.elegant-nav-btn {
    transition: all 0.3s ease !important;
}

.elegant-indicator {
    transition: all 0.3s ease !important;
}

.elegant-cta-btn {
    transition: all 0.3s ease !important;
}

.elegant-instagram-follow-btn {
    transition: all 0.3s ease !important;
}

.elegant-google-reviews-link {
    transition: all 0.3s ease !important;
}

.elegant-highlight-item {
    transition: all 0.3s ease !important;
}

.elegant-highlight-item i {
    transition: all 0.3s ease !important;
}

.elegant-instagram-loading {
    transition: all 0.3s ease !important;
}

.elegant-testimonials-wrapper,
.elegant-instagram-wrapper {
    transition: all 0.4s ease !important;
}

.elegant-section-header,
.elegant-bottom-cta {
    transition: all 0.8s ease !important;
}
`;

// Add styles if not already present
if (!document.getElementById('elegant-reviews-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'elegant-reviews-styles';
    styleSheet.textContent = elegantReviewsStyles;
    document.head.appendChild(styleSheet);
}

// Initialize when ready
let elegantReviewsInstance = null;

function initElegantReviewsInstagram() {
    if (!elegantReviewsInstance && document.querySelector('.elegant-reviews-instagram-section')) {
        elegantReviewsInstance = new ElegantReviewsInstagramSection();
        
        // Store instance for debugging
        window.elegantReviewsInstagram = elegantReviewsInstance;
    }
}

// Multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initElegantReviewsInstagram);
} else {
    initElegantReviewsInstagram();
}

// Backup initialization
setTimeout(initElegantReviewsInstagram, 100);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && elegantReviewsInstance) {
        elegantReviewsInstance.pauseAutoPlay();
    } else if (!document.hidden && elegantReviewsInstance) {
        elegantReviewsInstance.startAutoPlay();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (elegantReviewsInstance) {
        elegantReviewsInstance.destroy();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElegantReviewsInstagramSection;
}

/* ==========================================================================
   CONTACT SECTION
   ========================================================================== */
class HolisticContactSection {
    constructor() {
        // DOM Elements
        this.section = document.querySelector('.holistic-contact-section');
        this.methodCards = document.querySelectorAll('.holistic-method-card');
        this.optionCards = document.querySelectorAll('.holistic-option-card');
        this.ctaButtons = document.querySelectorAll('.holistic-cta-button');
        this.optionButtons = document.querySelectorAll('.holistic-option-button');
        this.emergencyButton = document.querySelector('.holistic-emergency-button');
        
        // Animation state
        this.animatedElements = new Set();
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        if (!this.section || this.isInitialized) return;
        
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.setupIntersectionObserver();
        this.setupCardInteractions();
        this.setupButtonEffects();
        this.setupElfsightMonitoring();
        this.setupAccessibility();
        this.isInitialized = true;
        
        console.log('Holistic Contact Section initialized successfully');
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe elements for animation
        const elementsToObserve = [
            '.holistic-contact-header',
            '.holistic-info-wrapper',
            '.holistic-form-wrapper',
            '.holistic-contact-options',
            '.holistic-bottom-cta'
        ];
        
        elementsToObserve.forEach(selector => {
            const elements = this.section.querySelectorAll(selector);
            elements.forEach(element => observer.observe(element));
        });
    }
    
    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        // Animate child elements with stagger
        const childElements = element.querySelectorAll('.holistic-method-card, .holistic-option-card');
        childElements.forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '0';
                child.style.transform = 'translateX(-20px)';
                child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateX(0)';
                });
            }, index * 100);
        });
    }
    
    setupCardInteractions() {
        // Method cards hover effects
        this.methodCards.forEach(card => {
            const icon = card.querySelector('.holistic-method-icon');
            const link = card.querySelector('.holistic-method-link');
            
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.background = '#00d884';
                    icon.style.color = 'white';
                }
                
                if (link) {
                    link.style.gap = '10px';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (icon) {
                    icon.style.transform = '';
                    icon.style.background = '';
                    icon.style.color = '';
                }
                
                if (link) {
                    link.style.gap = '';
                }
            });
            
            // Click handler for entire card
            card.addEventListener('click', (e) => {
                if (link && !e.target.closest('a')) {
                    link.click();
                }
            });
        });
        
        // Option cards interactions
        this.optionCards.forEach(card => {
            const icon = card.querySelector('.holistic-option-icon');
            const button = card.querySelector('.holistic-option-button');
            
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(-5deg)';
                }
                
                this.animateCardElements(card);
            });
            
            card.addEventListener('mouseleave', () => {
                if (icon) {
                    icon.style.transform = '';
                }
                
                this.resetCardElements(card);
            });
            
            // Click handler for entire card
            card.addEventListener('click', (e) => {
                if (button && !e.target.closest('a')) {
                    button.click();
                }
            });
        });
    }
    
    animateCardElements(card) {
        const title = card.querySelector('.holistic-option-title');
        const desc = card.querySelector('.holistic-option-desc');
        
        if (title) {
            title.style.transform = 'translateY(-2px)';
            title.style.color = '#00d884';
        }
        
        if (desc) {
            desc.style.transform = 'translateY(-1px)';
        }
    }
    
    resetCardElements(card) {
        const title = card.querySelector('.holistic-option-title');
        const desc = card.querySelector('.holistic-option-desc');
        
        if (title) {
            title.style.transform = '';
            title.style.color = '';
        }
        
        if (desc) {
            desc.style.transform = '';
        }
    }
    
    setupButtonEffects() {
        // CTA buttons
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
            
            button.addEventListener('mouseenter', () => {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.style.animation = 'holisticIconBounce 0.6s ease';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
        
        // Option buttons
        this.optionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
            
            button.addEventListener('mouseenter', () => {
                const arrows = button.querySelectorAll('i[class*="arrow"]');
                arrows.forEach(arrow => {
                    arrow.style.transform = 'translateX(3px)';
                });
            });
            
            button.addEventListener('mouseleave', () => {
                const arrows = button.querySelectorAll('i[class*="arrow"]');
                arrows.forEach(arrow => {
                    arrow.style.transform = '';
                });
            });
        });
        
        // Emergency button special effects
        if (this.emergencyButton) {
            this.emergencyButton.addEventListener('mouseenter', () => {
                this.emergencyButton.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)';
            });
            
            this.emergencyButton.addEventListener('mouseleave', () => {
                this.emergencyButton.style.boxShadow = '';
            });
        }
    }
    
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: holisticRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    setupElfsightMonitoring() {
        // Monitor Elfsight widget loading
        const checkElfsightLoad = () => {
            const elfsightWidget = this.section.querySelector('.elfsight-app-b3fedd1c-0470-46b1-b970-3fcc261b0bbb');
            const container = this.section.querySelector('.holistic-elfsight-container');
            
            if (elfsightWidget && elfsightWidget.children.length > 0) {
                // Widget has loaded
                if (container) {
                    container.style.background = 'transparent';
                    container.style.minHeight = 'auto';
                }
                
                // Add loaded class for additional styling
                elfsightWidget.classList.add('holistic-elfsight-loaded');
                
                // Animate the loaded form
                setTimeout(() => {
                    elfsightWidget.style.opacity = '0';
                    elfsightWidget.style.transform = 'translateY(20px)';
                    elfsightWidget.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    requestAnimationFrame(() => {
                        elfsightWidget.style.opacity = '1';
                        elfsightWidget.style.transform = 'translateY(0)';
                    });
                }, 100);
                
                console.log('Contact form loaded successfully');
            } else {
                // Check again in 500ms
                setTimeout(checkElfsightLoad, 500);
            }
        };
        
        // Start monitoring after a delay
        setTimeout(checkElfsightLoad, 1000);
    }
    
    setupAccessibility() {
        // Add keyboard navigation for cards
        [...this.methodCards, ...this.optionCards].forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
            
            // Focus styles
            card.addEventListener('focus', () => {
                card.style.outline = '2px solid #00d884';
                card.style.outlineOffset = '2px';
            });
            
            card.addEventListener('blur', () => {
                card.style.outline = '';
                card.style.outlineOffset = '';
            });
        });
        
        // Enhanced focus states for buttons
        [...this.ctaButtons, ...this.optionButtons].forEach(button => {
            button.addEventListener('focus', () => {
                button.style.boxShadow = '0 0 0 3px rgba(0, 216, 132, 0.3)';
            });
            
            button.addEventListener('blur', () => {
                button.style.boxShadow = '';
            });
        });
    }
    
    // Public methods for external control
    animateSection() {
        if (this.section && !this.animatedElements.has(this.section)) {
            this.animateElement(this.section);
            this.animatedElements.add(this.section);
        }
    }
    
    resetAnimations() {
        this.animatedElements.clear();
        
        // Reset all animated elements
        const elements = this.section.querySelectorAll('[style*="opacity"], [style*="transform"]');
        elements.forEach(element => {
            element.style.opacity = '';
            element.style.transform = '';
            element.style.transition = '';
        });
    }
    
    // Cleanup method
    destroy() {
        // Remove event listeners and cleanup
        this.animatedElements.clear();
        this.isInitialized = false;
        
        console.log('Holistic Contact Section destroyed');
    }
}

// Add required CSS animations
const holisticContactStyles = `
@keyframes holisticIconBounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-3px) scale(1.1); }
}

.holistic-method-card {
    transition: all 0.3s ease !important;
}

.holistic-method-icon {
    transition: all 0.3s ease !important;
}

.holistic-method-link {
    transition: all 0.3s ease !important;
}

.holistic-option-card {
    transition: all 0.3s ease !important;
}

.holistic-option-icon {
    transition: all 0.3s ease !important;
}

.holistic-option-button {
    transition: all 0.3s ease !important;
}

.holistic-cta-button {
    transition: all 0.3s ease !important;
}

.holistic-emergency-button {
    transition: all 0.3s ease !important;
}

.holistic-option-title,
.holistic-option-desc {
    transition: all 0.3s ease !important;
}

.holistic-elfsight-loaded {
    animation: holisticFormFadeIn 0.8s ease !important;
}

@keyframes holisticFormFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Add styles if not already present
if (!document.getElementById('holistic-contact-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'holistic-contact-styles';
    styleSheet.textContent = holisticContactStyles;
    document.head.appendChild(styleSheet);
}

// Initialize when ready
let holisticContactInstance = null;

function initHolisticContact() {
    if (!holisticContactInstance && document.querySelector('.holistic-contact-section')) {
        holisticContactInstance = new HolisticContactSection();
        
        // Store instance for debugging
        window.holisticContact = holisticContactInstance;
    }
}

// Multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHolisticContact);
} else {
    initHolisticContact();
}

// Backup initialization
setTimeout(initHolisticContact, 100);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !holisticContactInstance) {
        initHolisticContact();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (holisticContactInstance) {
        holisticContactInstance.destroy();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HolisticContactSection;
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
