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
        this.team = new TeamCarousel();
        this.reviews = new TestimonialsCarousel();
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
class TeamCarousel {
    constructor() {
        // DOM Elements
        this.section = document.querySelector('.team-carousel-section');
        this.track = document.querySelector('.team-carousel-track');
        this.cards = document.querySelectorAll('.team-member-card');
        this.prevBtn = document.querySelector('.team-nav-prev');
        this.nextBtn = document.querySelector('.team-nav-next');
        this.dots = document.querySelectorAll('.team-dot');
        this.progressFill = document.querySelector('.team-progress-fill');
        
        // Carousel State
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.totalCards = this.cards.length;
        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4500;
        this.isPlaying = true;
        this.isHovering = false;
        
        // Touch/Drag State
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.initialTranslate = 0;
        this.animationId = null;
        
        // Initialize
        this.init();
    }
    
    init() {
        if (!this.section) return;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup intersection observer
        this.setupIntersectionObserver();
        
        // Initialize carousel
        this.updateCarousel();
        
        // Start auto-play
        this.startAutoPlay();
        
        console.log('Team Carousel initialized successfully');
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.slidePrev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.slideNext());
        }
        
        // Pagination dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Hover pause
        if (this.track) {
            this.track.addEventListener('mouseenter', () => this.handleMouseEnter());
            this.track.addEventListener('mouseleave', () => this.handleMouseLeave());
        }
        
        // Touch/Mouse events
        this.setupTouchEvents();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Card interactions
        this.setupCardInteractions();
    }
    
    setupTouchEvents() {
        if (!this.track) return;
        
        // Mouse events
        this.track.addEventListener('mousedown', (e) => this.handleStart(e));
        this.track.addEventListener('mousemove', (e) => this.handleMove(e));
        this.track.addEventListener('mouseup', () => this.handleEnd());
        this.track.addEventListener('mouseleave', () => this.handleEnd());
        
        // Touch events
        this.track.addEventListener('touchstart', (e) => this.handleStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
        this.track.addEventListener('touchend', () => this.handleEnd());
        
        // Prevent context menu on long press
        this.track.addEventListener('contextmenu', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        });
    }
    
    setupKeyboardNavigation() {
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
    
    setupCardInteractions() {
        this.cards.forEach((card, index) => {
            // Prevent drag on images
            const images = card.querySelectorAll('img');
            images.forEach(img => {
                img.addEventListener('dragstart', (e) => e.preventDefault());
            });
            
            // Card click animation
            card.addEventListener('click', (e) => {
                // Don't trigger if dragging
                if (Math.abs(this.startX - this.currentX) > 5) {
                    e.preventDefault();
                    return;
                }
                
                // Add click animation
                this.animateCardClick(card);
            });
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => this.enhanceCardHover(card));
            card.addEventListener('mouseleave', () => this.resetCardHover(card));
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateEntrance();
                    this.startAutoPlay();
                } else {
                    this.pauseAutoPlay();
                }
            });
        }, observerOptions);
        
        if (this.section) {
            observer.observe(this.section);
        }
    }
    
    // Touch/Drag Handlers
    handleStart(e) {
        this.isDragging = true;
        this.startX = this.getClientX(e);
        this.currentX = this.startX;
        this.initialTranslate = this.getCurrentTranslate();
        
        this.track.style.cursor = 'grabbing';
        this.track.style.transition = 'none';
        
        this.pauseAutoPlay();
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = this.getClientX(e);
        const deltaX = this.currentX - this.startX;
        const newTranslate = this.initialTranslate + deltaX;
        
        this.track.style.transform = `translateX(${newTranslate}px)`;
    }
    
    handleEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.cursor = '';
        this.track.style.transition = '';
        
        const deltaX = this.currentX - this.startX;
        const threshold = 80;
        
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0 && this.currentIndex > 0) {
                this.slidePrev();
            } else if (deltaX < 0 && this.currentIndex < this.maxIndex) {
                this.slideNext();
            } else {
                this.updateCarousel();
            }
        } else {
            this.updateCarousel();
        }
        
        if (!this.isHovering) {
            this.startAutoPlay();
        }
    }
    
    getClientX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }
    
    getCurrentTranslate() {
        const style = window.getComputedStyle(this.track);
        const matrix = style.transform;
        
        if (matrix === 'none') return 0;
        
        const values = matrix.split('(')[1].split(')')[0].split(',');
        return parseInt(values[4]) || 0;
    }
    
    // Navigation Methods
    slidePrev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.maxIndex; // Loop to end
        }
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    slideNext() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop to beginning
        }
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        this.currentIndex = Math.min(index, this.maxIndex);
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        // Calculate translation
        const cardWidth = this.cards[0]?.offsetWidth || 0;
        const gap = 30; // Gap between cards
        const translateX = -(this.currentIndex * (cardWidth + gap));
        
        // Apply translation
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update pagination
        this.updatePagination();
        
        // Update progress bar
        this.updateProgressBar();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Animate visible cards
        this.animateVisibleCards();
    }
    
    updatePagination() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateProgressBar() {
        if (!this.progressFill) return;
        
        const progress = ((this.currentIndex + 1) / (this.maxIndex + 1)) * 100;
        this.progressFill.style.width = `${Math.min(100, Math.max(20, progress))}%`;
    }
    
    updateNavigationButtons() {
        // Enable all buttons for infinite scroll
        if (this.prevBtn) this.prevBtn.disabled = false;
        if (this.nextBtn) this.nextBtn.disabled = false;
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
    
    handleMouseEnter() {
        this.isHovering = true;
        this.pauseAutoPlay();
    }
    
    handleMouseLeave() {
        this.isHovering = false;
        if (this.isPlaying) {
            this.startAutoPlay();
        }
    }
    
    // Animation Methods
    animateEntrance() {
        // Animate header
        const header = this.section.querySelector('.team-section-header');
        if (header) {
            header.style.animation = 'teamFadeInUp 0.8s ease';
        }
        
        // Animate visible cards with stagger
        this.animateVisibleCards();
    }
    
    animateCardClick(card) {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
    
    enhanceCardHover(card) {
        const specialty = card.querySelectorAll('.team-specialty');
        specialty.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(-2px)';
            }, index * 50);
        });
    }
    
    resetCardHover(card) {
        const specialty = card.querySelectorAll('.team-specialty');
        specialty.forEach(tag => {
            tag.style.transform = '';
        });
    }
    
    // Responsive Methods
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
            
            this.updateCarousel();
        }
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
    
    // Cleanup
    destroy() {
        this.pauseAutoPlay();
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.setupKeyboardNavigation);
        
        console.log('Team Carousel destroyed');
    }
}

// Enhanced Card Interactions
class TeamCardEnhancer {
    constructor() {
        this.cards = document.querySelectorAll('.team-member-card');
        this.init();
    }
    
    init() {
        this.setupAdvancedInteractions();
    }
    
    setupAdvancedInteractions() {
        this.cards.forEach(card => {
            // Add ripple effect to learn more buttons
            const learnMoreBtn = card.querySelector('.team-learn-more');
            if (learnMoreBtn) {
                learnMoreBtn.addEventListener('click', (e) => {
                    this.createRipple(e, learnMoreBtn);
                });
            }
            
            // Add profile link interactions
            const profileLink = card.querySelector('.team-profile-link');
            if (profileLink) {
                profileLink.addEventListener('click', (e) => {
                    this.createRipple(e, profileLink);
                });
            }
            
            // Enhanced specialty tag interactions
            const specialties = card.querySelectorAll('.team-specialty');
            specialties.forEach(specialty => {
                specialty.addEventListener('mouseenter', () => {
                    specialty.style.transform = 'translateY(-3px) scale(1.05)';
                    specialty.style.boxShadow = '0 8px 20px rgba(0, 216, 132, 0.2)';
                });
                
                specialty.addEventListener('mouseleave', () => {
                    specialty.style.transform = '';
                    specialty.style.boxShadow = '';
                });
            });
        });
    }
    
    createRipple(event, element) {
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
            animation: teamRipple 0.6s ease-out;
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
}

// Add required CSS animations
const teamCarouselStyles = `
@keyframes teamRipple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.team-carousel-track {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.team-member-card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.team-photo {
    transition: transform 0.6s ease !important;
}

.team-image-overlay {
    transition: opacity 0.3s ease !important;
}

.team-overlay-content {
    transition: transform 0.3s ease !important;
}

.team-specialty {
    transition: all 0.3s ease !important;
}

.team-learn-more {
    transition: all 0.3s ease !important;
}

.team-nav-btn {
    transition: all 0.3s ease !important;
}

.team-dot {
    transition: all 0.3s ease !important;
}

.team-progress-fill {
    transition: width 0.5s ease !important;
}
`;

// Add styles if not already present
if (!document.getElementById('team-carousel-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'team-carousel-styles';
    styleSheet.textContent = teamCarouselStyles;
    document.head.appendChild(styleSheet);
}

// Initialize when ready
let teamCarouselInstance = null;
let teamCardEnhancer = null;

function initTeamCarousel() {
    if (!teamCarouselInstance && document.querySelector('.team-carousel-section')) {
        teamCarouselInstance = new TeamCarousel();
        teamCardEnhancer = new TeamCardEnhancer();
        
        // Store instances for debugging
        window.teamCarousel = teamCarouselInstance;
        window.teamCardEnhancer = teamCardEnhancer;
    }
}

// Multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamCarousel);
} else {
    initTeamCarousel();
}

// Backup initialization
setTimeout(initTeamCarousel, 100);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && teamCarouselInstance) {
        teamCarouselInstance.pauseAutoPlay();
    } else if (!document.hidden && teamCarouselInstance) {
        teamCarouselInstance.startAutoPlay();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (teamCarouselInstance) {
        teamCarouselInstance.destroy();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TeamCarousel, TeamCardEnhancer };
}

/* ==========================================================================
   REVIEWS SECTION
   ========================================================================== */
class TestimonialsCarousel {
    constructor() {
        // DOM Elements
        this.section = document.querySelector('.testimonials-instagram-section');
        this.track = document.querySelector('.testimonials-track');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.prevBtn = document.querySelector('.testimonials-nav-prev');
        this.nextBtn = document.querySelector('.testimonials-nav-next');
        this.dots = document.querySelectorAll('.testimonials-dot');
        this.trackContainer = document.querySelector('.testimonials-track-container');
        
        // Carousel State
        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.isPlaying = true;
        this.isHovering = false;
        
        // Touch/Drag State
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.threshold = 50;
        
        // Initialize
        this.init();
    }
    
    init() {
        if (!this.section || !this.track || this.totalCards === 0) return;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup intersection observer
        this.setupIntersectionObserver();
        
        // Initialize carousel
        this.updateCarousel();
        
        // Start auto-play
        this.startAutoPlay();
        
        // Setup star animations
        this.setupStarAnimations();
        
        console.log('Testimonials Carousel initialized successfully');
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.slidePrev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.slideNext());
        }
        
        // Pagination dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Hover pause
        if (this.trackContainer) {
            this.trackContainer.addEventListener('mouseenter', () => this.handleMouseEnter());
            this.trackContainer.addEventListener('mouseleave', () => this.handleMouseLeave());
        }
        
        // Touch/Swipe events
        this.setupTouchEvents();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Card interactions
        this.setupCardInteractions();
    }
    
    setupTouchEvents() {
        if (!this.trackContainer) return;
        
        // Touch events
        this.trackContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.trackContainer.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.trackContainer.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Mouse events for desktop dragging
        this.trackContainer.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.trackContainer.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.trackContainer.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.trackContainer.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Prevent context menu on long press
        this.trackContainer.addEventListener('contextmenu', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        });
    }
    
    setupKeyboardNavigation() {
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
    
    setupCardInteractions() {
        this.cards.forEach((card, index) => {
            // Prevent image dragging
            const images = card.querySelectorAll('img');
            images.forEach(img => {
                img.addEventListener('dragstart', (e) => e.preventDefault());
            });
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => this.enhanceCardHover(card));
            card.addEventListener('mouseleave', () => this.resetCardHover(card));
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateEntrance();
                    this.startAutoPlay();
                } else {
                    this.pauseAutoPlay();
                }
            });
        }, observerOptions);
        
        if (this.section) {
            observer.observe(this.section);
        }
    }
    
    setupStarAnimations() {
        this.cards.forEach(card => {
            const stars = card.querySelectorAll('.testimonial-stars i');
            stars.forEach((star, index) => {
                star.style.setProperty('--star-index', index);
            });
        });
    }
    
    // Touch Handlers
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
        
        this.startX = 0;
        this.currentX = 0;
        
        if (!this.isHovering) {
            this.startAutoPlay();
        }
    }
    
    // Mouse Drag Handlers
    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.trackContainer.style.cursor = 'grabbing';
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
        this.trackContainer.style.cursor = '';
        
        const diff = this.startX - this.currentX;
        
        if (Math.abs(diff) > this.threshold) {
            if (diff > 0) {
                this.slideNext();
            } else {
                this.slidePrev();
            }
        }
        
        this.startX = 0;
        this.currentX = 0;
        
        if (!this.isHovering) {
            this.startAutoPlay();
        }
    }
    
    // Navigation Methods
    slidePrev() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.totalCards - 1;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    slideNext() {
        this.currentIndex = this.currentIndex < this.totalCards - 1 ? this.currentIndex + 1 : 0;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        // Calculate translation
        const translateX = -(this.currentIndex * 100);
        
        // Apply translation
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update pagination
        this.updatePagination();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Animate current card
        this.animateCurrentCard();
    }
    
    updatePagination() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateNavigationButtons() {
        // Enable all buttons for infinite scroll
        if (this.prevBtn) this.prevBtn.disabled = false;
        if (this.nextBtn) this.nextBtn.disabled = false;
    }
    
    animateCurrentCard() {
        this.cards.forEach((card, index) => {
            if (index === this.currentIndex) {
                card.classList.add('active');
                
                // Animate stars in current card
                const stars = card.querySelectorAll('.testimonial-stars i');
                stars.forEach((star, starIndex) => {
                    setTimeout(() => {
                        star.style.animation = `testimonialStarGlow 2s ease-in-out infinite`;
                        star.style.animationDelay = `${starIndex * 0.1}s`;
                    }, 300);
                });
                
                // Animate text appearance
                const content = card.querySelector('.testimonial-content');
                if (content) {
                    content.style.animation = 'testimonialContentFadeIn 0.6s ease forwards';
                }
            } else {
                card.classList.remove('active');
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
    
    handleMouseEnter() {
        this.isHovering = true;
        this.pauseAutoPlay();
    }
    
    handleMouseLeave() {
        this.isHovering = false;
        if (this.isPlaying) {
            this.startAutoPlay();
        }
    }
    
    // Animation Methods
    animateEntrance() {
        // Animate section header
        const header = this.section.querySelector('.testimonials-section-header');
        if (header) {
            header.style.animation = 'testimonialsFadeInUp 0.8s ease';
        }
        
        // Animate carousel wrapper
        const wrapper = this.section.querySelector('.testimonials-carousel-wrapper');
        if (wrapper) {
            setTimeout(() => {
                wrapper.style.animation = 'testimonialsFadeInUp 0.8s ease';
            }, 200);
        }
        
        // Animate Instagram wrapper
        const instagramWrapper = this.section.querySelector('.instagram-wrapper');
        if (instagramWrapper) {
            setTimeout(() => {
                instagramWrapper.style.animation = 'testimonialsFadeInUp 0.8s ease';
            }, 400);
        }
        
        // Animate current card
        this.animateCurrentCard();
    }
    
    enhanceCardHover(card) {
        const author = card.querySelector('.testimonial-author');
        if (author) {
            author.style.transform = 'translateY(-2px)';
        }
        
        const verified = card.querySelector('.google-verified');
        if (verified) {
            verified.style.transform = 'scale(1.05)';
            verified.style.background = 'rgba(0, 216, 132, 0.1)';
        }
    }
    
    resetCardHover(card) {
        const author = card.querySelector('.testimonial-author');
        if (author) {
            author.style.transform = '';
        }
        
        const verified = card.querySelector('.google-verified');
        if (verified) {
            verified.style.transform = '';
            verified.style.background = '';
        }
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
    
    // Cleanup
    destroy() {
        this.pauseAutoPlay();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.setupKeyboardNavigation);
        
        console.log('Testimonials Carousel destroyed');
    }
}

// Instagram Feed Enhancer
class InstagramFeedEnhancer {
    constructor() {
        this.container = document.querySelector('.instagram-feed-container');
        this.followBtn = document.querySelector('.instagram-follow-btn');
        
        this.init();
    }
    
    init() {
        this.setupInstagramInteractions();
        this.monitorElfsightLoad();
    }
    
    setupInstagramInteractions() {
        // Enhanced follow button
        if (this.followBtn) {
            this.followBtn.addEventListener('click', (e) => {
                this.createRipple(e, this.followBtn);
            });
            
            this.followBtn.addEventListener('mouseenter', () => {
                this.followBtn.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            this.followBtn.addEventListener('mouseleave', () => {
                this.followBtn.style.transform = '';
            });
        }
    }
    
    monitorElfsightLoad() {
        // Monitor when Elfsight widget loads
        const checkElfsightLoad = () => {
            const elfsightWidget = document.querySelector('.elfsight-app-3e98e495-6739-43e0-8b40-1c3c1f597278');
            
            if (elfsightWidget && elfsightWidget.children.length > 0) {
                // Widget has loaded
                if (this.container) {
                    this.container.style.background = 'transparent';
                }
                
                // Add loaded class for additional styling
                elfsightWidget.classList.add('elfsight-loaded');
                
                console.log('Instagram feed loaded successfully');
            } else {
                // Check again in 500ms
                setTimeout(checkElfsightLoad, 500);
            }
        };
        
        // Start monitoring
        setTimeout(checkElfsightLoad, 1000);
    }
    
    createRipple(event, element) {
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
            animation: testimonialsRipple 0.6s ease-out;
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
}

// CTA Button Enhancer
class TestimonialsCTAEnhancer {
    constructor() {
        this.ctaButtons = document.querySelectorAll('.cta-btn');
        this.init();
    }
    
    init() {
        this.setupCTAInteractions();
    }
    
    setupCTAInteractions() {
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
            
            button.addEventListener('mouseenter', () => {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.style.animation = 'testimonialsIconBounce 0.5s ease';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
    }
    
    createRipple(event, element) {
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
            animation: testimonialsRipple 0.6s ease-out;
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
}

// Add required CSS animations
const testimonialsStyles = `
@keyframes testimonialsRipple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes testimonialContentFadeIn {
    from {
        opacity: 0.7;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes testimonialsIconBounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-3px) scale(1.1); }
}

.testimonials-track {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.testimonial-content {
    transition: all 0.3s ease !important;
}

.testimonials-nav-btn {
    transition: all 0.3s ease !important;
}

.testimonials-dot {
    transition: all 0.3s ease !important;
}

.instagram-follow-btn {
    transition: all 0.3s ease !important;
}

.cta-btn {
    transition: all 0.3s ease !important;
}

.google-verified {
    transition: all 0.3s ease !important;
}

.testimonial-author {
    transition: all 0.3s ease !important;
}

/* Elfsight widget enhancements */
.elfsight-loaded {
    animation: testimonialContentFadeIn 0.8s ease !important;
}
`;

// Add styles if not already present
if (!document.getElementById('testimonials-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'testimonials-styles';
    styleSheet.textContent = testimonialsStyles;
    document.head.appendChild(styleSheet);
}

// Initialize when ready
let testimonialsCarouselInstance = null;
let instagramEnhancerInstance = null;
let ctaEnhancerInstance = null;

function initTestimonialsSection() {
    if (!testimonialsCarouselInstance && document.querySelector('.testimonials-instagram-section')) {
        testimonialsCarouselInstance = new TestimonialsCarousel();
        instagramEnhancerInstance = new InstagramFeedEnhancer();
        ctaEnhancerInstance = new TestimonialsCTAEnhancer();
        
        // Store instances for debugging
        window.testimonialsCarousel = testimonialsCarouselInstance;
        window.instagramEnhancer = instagramEnhancerInstance;
        window.ctaEnhancer = ctaEnhancerInstance;
    }
}

// Multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialsSection);
} else {
    initTestimonialsSection();
}

// Backup initialization
setTimeout(initTestimonialsSection, 100);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && testimonialsCarouselInstance) {
        testimonialsCarouselInstance.pauseAutoPlay();
    } else if (!document.hidden && testimonialsCarouselInstance) {
        testimonialsCarouselInstance.startAutoPlay();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (testimonialsCarouselInstance) {
        testimonialsCarouselInstance.destroy();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestimonialsCarousel, InstagramFeedEnhancer, TestimonialsCTAEnhancer };
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
