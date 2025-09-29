/* ==========================================================================
   HOLISTIC PSYCHOLOGICAL SERVICES - COMPLETE JAVASCRIPT
   Professional Mental Health Services - Manhattan, NY
   ========================================================================== */

'use strict';

/* ==========================================================================
   GLOBAL CONFIGURATION
   ========================================================================== */
const CONFIG = {
    heroBackgroundInterval: 8000,
    servicesAutoplayInterval: 6000,
    teamAutoplayInterval: 8000,
    scrollThreshold: 100,
    animationDelay: 150
};

/* ==========================================================================
   MAIN APP CONTROLLER
   ========================================================================== */
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
        this.team = new TeamSectionNew();
        this.contact = new ContactForm();
        this.footer = new Footer();
        
        // Global handlers
        this.initScrollHandling();
        this.initImageLoading();
    }
    
    initScrollHandling() {
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
    
    initImageLoading() {
        // Handle all images with loading states
        const images = document.querySelectorAll('img[loading="lazy"], img[loading="eager"]');
        
        images.forEach(img => {
            if (img.complete) {
                this.handleImageLoad(img);
            } else {
                img.addEventListener('load', () => this.handleImageLoad(img));
                img.addEventListener('error', () => this.handleImageError(img));
            }
        });
    }
    
    handleImageLoad(img) {
        img.classList.add('loaded');
        const loader = img.parentElement.querySelector('.image-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
    
    handleImageError(img) {
        console.warn('Failed to load image:', img.src);
        const loader = img.parentElement.querySelector('.image-loader');
        if (loader) {
            loader.style.display = 'none';
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
        
        if (this.scrollHamburger) {
            this.scrollHamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close buttons
        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', () => this.closeMobileMenu());
        }
        
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
        }
        
        // Nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.navigateTo(target);
                this.closeMobileMenu();
            });
        });
        
        // Update active nav on scroll
        window.addEventListener('scroll', () => this.updateActiveNav());
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.mobilePanel.classList.add('active');
        this.mobileOverlay.classList.add('active');
        this.mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        this.mobilePanel.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        this.mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
        this.isMenuOpen = false;
    }
    
    navigateTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    handleScroll(scrolled) {
        if (scrolled) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

/* ==========================================================================
   HERO SECTION
   ========================================================================== */
class Hero {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.backgrounds = document.querySelectorAll('.hero-bg-image');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        
        if (this.hero && this.backgrounds.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.startAutoplay();
        this.initLogoAnimation();
    }
    
    startAutoplay() {
        if (this.backgrounds.length <= 1) return;
        
        this.autoplayInterval = setInterval(() => {
            this.nextBackground();
        }, CONFIG.heroBackgroundInterval);
    }
    
    nextBackground() {
        this.backgrounds[this.currentIndex].classList.remove('active');
        this.currentIndex = (this.currentIndex + 1) % this.backgrounds.length;
        this.backgrounds[this.currentIndex].classList.add('active');
    }
    
    initLogoAnimation() {
        const logoContainer = document.querySelector('.hero-logo-container');
        if (logoContainer) {
            logoContainer.addEventListener('click', () => {
                logoContainer.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    logoContainer.style.transform = '';
                }, 200);
            });
        }
    }
    
    destroy() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

/* ==========================================================================
   SERVICES CAROUSEL
   ========================================================================== */

class ServicesCarousel {
    constructor() {
        this.carousel = document.querySelector('.carousel-slides');
        this.cards = Array.from(document.querySelectorAll('.service-card'));
        this.prevBtn = document.querySelector('.carousel-btn-prev');
        this.nextBtn = document.querySelector('.carousel-btn-next');
        this.pagination = document.getElementById('carouselDots');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.filteredCards = [...this.cards];
        this.currentFilter = 'all';
        this.autoplayInterval = null;
        this.isAutoplayPaused = false;
        
        // Touch/drag handling
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        
        this.init();
    }
    
    init() {
        this.createPagination();
        this.updateView();
        this.bindEvents();
        this.startAutoplay();
        
        // Handle window resize with debounce
        window.addEventListener('resize', this.debounce(() => {
            const newCardsPerView = this.getCardsPerView();
            if (newCardsPerView !== this.cardsPerView) {
                this.cardsPerView = newCardsPerView;
                this.currentIndex = Math.min(this.currentIndex, this.getMaxIndex());
                this.updateView();
                this.createPagination();
            }
        }, 200));
    }
    
    getCardsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1200) return 2;
        return 3;
    }
    
    getMaxIndex() {
        return Math.max(0, this.filteredCards.length - this.cardsPerView);
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => {
            this.prev();
            this.resetAutoplay();
        });
        
        this.nextBtn?.addEventListener('click', () => {
            this.next();
            this.resetAutoplay();
        });
        
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.applyFilter(filter);
                this.resetAutoplay();
            });
        });
        
        // Pause autoplay on hover
        const wrapper = document.querySelector('.carousel-wrapper');
        wrapper.addEventListener('mouseenter', () => {
            this.isAutoplayPaused = true;
        });
        
        wrapper.addEventListener('mouseleave', () => {
            this.isAutoplayPaused = false;
        });
        
        // Touch events
        this.carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.carousel.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Mouse drag
        this.carousel.addEventListener('mousedown', (e) => this.handleDragStart(e));
        this.carousel.addEventListener('mousemove', (e) => this.handleDragMove(e));
        this.carousel.addEventListener('mouseup', (e) => this.handleDragEnd(e));
        this.carousel.addEventListener('mouseleave', (e) => this.handleDragEnd(e));
        
        // Prevent context menu on long press
        this.carousel.addEventListener('contextmenu', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        });
        
        // Prevent default drag on images
        this.cards.forEach(card => {
            card.addEventListener('dragstart', (e) => e.preventDefault());
            
            // Prevent click during drag
            card.addEventListener('click', (e) => {
                if (this.isDragging) {
                    e.preventDefault();
                }
            });
        });
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.isDragging = true;
        this.startX = this.touchStartX;
        this.prevTranslate = -this.currentIndex * this.getSlideWidth();
        this.carousel.style.transition = 'none';
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        this.touchEndX = e.touches[0].clientX;
        const diff = this.touchEndX - this.startX;
        
        // Add resistance at edges
        const maxIndex = this.getMaxIndex();
        let resistance = 1;
        
        if (this.currentIndex === 0 && diff > 0) {
            resistance = 0.3;
        } else if (this.currentIndex === maxIndex && diff < 0) {
            resistance = 0.3;
        }
        
        this.currentTranslate = this.prevTranslate + (diff * resistance);
        this.carousel.style.transform = `translateX(${this.currentTranslate}px)`;
        
        // Prevent page scroll on horizontal swipe
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.carousel.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const movedBy = this.touchEndX - this.touchStartX;
        const threshold = 50;
        
        if (Math.abs(movedBy) > threshold) {
            if (movedBy > 0) {
                this.prev();
            } else {
                this.next();
            }
        } else {
            this.updateView();
        }
        
        this.resetAutoplay();
    }
    
    handleDragStart(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.prevTranslate = -this.currentIndex * this.getSlideWidth();
        this.carousel.style.cursor = 'grabbing';
        this.carousel.style.transition = 'none';
        this.carousel.style.userSelect = 'none';
        e.preventDefault();
    }
    
    handleDragMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const currentX = e.clientX;
        const diff = currentX - this.startX;
        
        // Add resistance at edges
        const maxIndex = this.getMaxIndex();
        let resistance = 1;
        
        if (this.currentIndex === 0 && diff > 0) {
            resistance = 0.3;
        } else if (this.currentIndex === maxIndex && diff < 0) {
            resistance = 0.3;
        }
        
        this.currentTranslate = this.prevTranslate + (diff * resistance);
        this.carousel.style.transform = `translateX(${this.currentTranslate}px)`;
    }
    
    handleDragEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.carousel.style.cursor = 'grab';
        this.carousel.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.carousel.style.userSelect = '';
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        const threshold = 50;
        
        if (Math.abs(movedBy) > threshold) {
            if (movedBy > 0) {
                this.prev();
            } else {
                this.next();
            }
        } else {
            this.updateView();
        }
        
        this.resetAutoplay();
    }
    
    getSlideWidth() {
        if (this.filteredCards.length === 0) return 0;
        
        // Get the first visible card
        const visibleCard = this.filteredCards.find(card => !card.classList.contains('hide'));
        if (!visibleCard) return 0;
        
        const cardWidth = visibleCard.offsetWidth;
        const gap = 24; // Must match CSS gap
        return cardWidth + gap;
    }
    
    applyFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Filter cards with staggered animation
        if (filter === 'all') {
            this.filteredCards = [...this.cards];
            this.cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                }, index * 40);
            });
        } else {
            this.filteredCards = this.cards.filter(card => 
                card.dataset.category === filter
            );
            
            this.cards.forEach((card, index) => {
                if (card.dataset.category === filter) {
                    setTimeout(() => {
                        card.classList.remove('hide');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    }, index * 40);
                } else {
                    card.classList.add('hide');
                }
            });
        }
        
        // Reset carousel position
        this.currentIndex = 0;
        setTimeout(() => {
            this.updateView();
            this.createPagination();
        }, 100);
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.getMaxIndex();
        }
        this.updateView();
    }
    
    next() {
        const maxIndex = this.getMaxIndex();
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateView();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateView();
    }
    
    updateView() {
        const slideWidth = this.getSlideWidth();
        const offset = -this.currentIndex * slideWidth;
        
        this.carousel.style.transform = `translateX(${offset}px)`;
        this.updatePagination();
    }
    
    createPagination() {
        if (!this.pagination) return;
        
        this.pagination.innerHTML = '';
        const visibleCards = this.filteredCards.filter(card => !card.classList.contains('hide'));
        const numDots = Math.max(1, visibleCards.length - this.cardsPerView + 1);
        
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoplay();
            });
            
            this.pagination.appendChild(dot);
        }
    }
    
    updatePagination() {
        if (!this.pagination) return;
        
        const dots = this.pagination.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            if (!this.isAutoplayPaused && !this.isDragging) {
                this.next();
            }
        }, 5000);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resetAutoplay() {
        this.startAutoplay();
    }
    
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// Initialize carousel
let servicesCarouselInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    servicesCarouselInstance = new ServicesCarousel();
    console.log('Services Carousel initialized successfully');
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (servicesCarouselInstance) {
        if (document.hidden) {
            servicesCarouselInstance.stopAutoplay();
        } else {
            servicesCarouselInstance.startAutoplay();
        }
    }
});

/* ==========================================================================
   TEAM CAROUSEL
   ========================================================================== */

class TeamSectionNew {
    constructor() {
        this.section = document.querySelector('.team-section-new');
        this.cards = document.querySelectorAll('.team-card-new');
        this.bookButtons = document.querySelectorAll('.book-session-btn');
        this.joinButton = document.querySelector('.join-apply-btn');
        this.ctaButton = document.querySelector('.cta-button-new');
        
        if (this.section) {
            this.init();
        }
    }
    
    init() {
        this.initScrollAnimations();
        this.initCardInteractions();
        this.initButtonAnimations();
        this.initParallaxEffect();
    }
    
    /**
     * Initialize scroll-based animations using Intersection Observer
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Trigger staggered animation for cards
                    if (entry.target.classList.contains('team-card-new')) {
                        const cards = Array.from(this.cards);
                        const index = cards.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);
        
        // Observe team cards
        this.cards.forEach(card => {
            observer.observe(card);
        });
        
        // Observe section header
        const header = document.querySelector('.team-header-new');
        if (header) {
            observer.observe(header);
        }
        
        // Observe CTA section
        const cta = document.querySelector('.team-bottom-cta');
        if (cta) {
            observer.observe(cta);
        }
    }
    
    /**
     * Initialize card hover and interaction effects
     */
    initCardInteractions() {
        this.cards.forEach(card => {
            // Mouse move parallax effect on images
            card.addEventListener('mousemove', (e) => {
                this.handleCardMouseMove(e, card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.handleCardMouseLeave(card);
            });
            
            // Click on card (excluding buttons) for smooth scroll to contact
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.book-session-btn') && 
                    !e.target.closest('.join-apply-btn') &&
                    !e.target.closest('.specialty-tag')) {
                    this.handleCardClick(card);
                }
            });
        });
    }
    
    /**
     * Handle mouse move for card parallax effect
     */
    handleCardMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const image = card.querySelector('.team-member-photo');
        if (image) {
            image.style.transform = `scale(1.08) translate(${deltaX * 5}px, ${deltaY * 5}px)`;
        }
    }
    
    /**
     * Reset card transforms on mouse leave
     */
    handleCardMouseLeave(card) {
        const image = card.querySelector('.team-member-photo');
        if (image) {
            image.style.transform = '';
        }
    }
    
    /**
     * Handle card click for quick interaction
     */
    handleCardClick(card) {
        // Add a subtle scale animation
        card.style.transform = 'scale(0.98) translateY(-8px)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    }
    
    /**
     * Initialize button animations and interactions
     */
    initButtonAnimations() {
        // Book session buttons
        this.bookButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleBookSession(button);
            });
        });
        
        // Join button
        if (this.joinButton) {
            this.joinButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.smoothScrollToContact();
            });
        }
        
        // CTA button
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.smoothScrollToContact();
            });
        }
        
        // Specialty tag interactions
        const specialtyTags = document.querySelectorAll('.specialty-tag');
        specialtyTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSpecialtyClick(tag);
            });
        });
    }
    
    /**
     * Handle book session button click
     */
    handleBookSession(button) {
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Show notification
        this.showNotification('Redirecting to booking...', 'info');
        
        // Smooth scroll to contact section
        setTimeout(() => {
            this.smoothScrollToContact();
        }, 300);
    }
    
    /**
     * Handle specialty tag click
     */
    handleSpecialtyClick(tag) {
        const specialty = tag.textContent;
        
        // Visual feedback
        tag.style.transform = 'scale(1.1)';
        setTimeout(() => {
            tag.style.transform = '';
        }, 200);
        
        // Show info notification
        this.showNotification(`Learn more about ${specialty}`, 'info');
    }
    
    /**
     * Smooth scroll to contact section
     */
    smoothScrollToContact() {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const headerOffset = 100;
            const elementPosition = contactSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * Initialize subtle parallax effect on scroll
     */
    initParallaxEffect() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    /**
     * Update parallax positions
     */
    updateParallax() {
        if (!this.section) return;
        
        const scrolled = window.pageYOffset;
        const sectionTop = this.section.offsetTop;
        const sectionHeight = this.section.offsetHeight;
        
        // Only apply parallax when section is in view
        if (scrolled > sectionTop - window.innerHeight && 
            scrolled < sectionTop + sectionHeight) {
            
            const offset = (scrolled - sectionTop) * 0.3;
            
            // Apply subtle movement to cards
            this.cards.forEach((card, index) => {
                const factor = index % 2 === 0 ? 1 : -1;
                card.style.transform = `translateY(${offset * factor * 0.05}px)`;
            });
        }
    }
    
    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existing = document.querySelector('.team-notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `team-notification team-notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '12px',
            backgroundColor: type === 'info' ? '#0ea5e9' : '#00d884',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '0.9375rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease',
            maxWidth: '320px'
        });
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    /**
     * Destroy and cleanup
     */
    destroy() {
        // Remove event listeners if needed
        console.log('Team section destroyed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const teamSectionNew = new TeamSectionNew();
    console.log('New team section initialized');
});

// Add notification animation styles
const teamNotificationStyles = document.createElement('style');
teamNotificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .team-card-new {
        cursor: pointer;
    }
    
    .team-card-new * {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(teamNotificationStyles);

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TeamSectionNew };
}

/* ==========================================================================
   CONTACT FORM
   ========================================================================== */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><i class="ri-loader-4-line"></i>';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showSuccess();
            this.form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    validateForm(data) {
        // Basic validation
        if (!data.name || !data.email || !data.message) {
            this.showError('Please fill in all required fields.');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showError('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }
    
    showSuccess() {
        this.showNotification('Thank you! Your message has been sent successfully.', 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '12px',
            backgroundColor: type === 'success' ? '#00d884' : '#ef4444',
            color: '#ffffff',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}

/* ==========================================================================
   FOOTER
   ========================================================================== */
class Footer {
    constructor() {
        this.footer = document.getElementById('footer');
        
        if (this.footer) {
            this.init();
        }
    }
    
    init() {
        this.updateCurrentYear();
        this.initSmoothScrolling();
    }
    
    updateCurrentYear() {
        const currentYear = new Date().getFullYear();
        const yearElements = document.querySelectorAll('.current-year');
        
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }
    
    initSmoothScrolling() {
        const footerLinks = this.footer.querySelectorAll('a[href^="#"]');
        
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */
const Utils = {
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: (func, limit) => {
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
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

/* ==========================================================================
   SCROLL ANIMATIONS
   ========================================================================== */
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        // Use Intersection Observer for better performance
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );
        
        this.elements.forEach(element => observer.observe(element));
    }
}

/* ==========================================================================
   INITIALIZE APP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    const scrollAnimations = new ScrollAnimations();
    
    console.log('Holistic Psychological Services website initialized');
    
    // Add notification animations to document
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when tab is visible
        console.log('Page visible - resuming animations');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    console.log('Cleaning up...');
});

/* ==========================================================================
   EXPORT FOR MODULE SYSTEMS
   ========================================================================== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, Header, Hero, ServicesCarousel, TeamCarousel, ContactForm, Footer, Utils };
}
