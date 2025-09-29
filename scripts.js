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
        this.team = new TeamCarousel();
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
class TeamCarousel {
    constructor() {
        this.carousel = document.querySelector('.team-carousel');
        this.track = document.querySelector('.team-track');
        this.prevBtn = this.carousel?.querySelector('.prev-btn');
        this.nextBtn = this.carousel?.querySelector('.next-btn');
        this.dotsContainer = this.carousel?.querySelector('.carousel-dots');
        this.cards = this.track?.querySelectorAll('.team-member-card');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.isAutoplayPaused = false;
        
        if (this.carousel && this.track && this.cards.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.createDots();
        this.bindEvents();
        this.startAutoplay();
        this.updateView();
        this.initImageLoading();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        
        this.dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Pause autoplay on hover
        this.carousel.addEventListener('mouseenter', () => {
            this.isAutoplayPaused = true;
        });
        
        this.carousel.addEventListener('mouseleave', () => {
            this.isAutoplayPaused = false;
        });
        
        // Touch events for mobile
        let startX = 0;
        let currentX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });
    }
    
    initImageLoading() {
        const images = this.track.querySelectorAll('.member-image');
        
        images.forEach(img => {
            // Create a new image to preload
            const tempImg = new Image();
            
            tempImg.onload = () => {
                img.classList.add('loaded');
                const loader = img.parentElement.querySelector('.image-loader');
                if (loader) {
                    loader.style.display = 'none';
                }
            };
            
            tempImg.onerror = () => {
                console.warn('Failed to load team member image:', img.src);
                const loader = img.parentElement.querySelector('.image-loader');
                if (loader) {
                    loader.style.display = 'none';
                }
                // Keep the placeholder visible or show default avatar
                img.style.display = 'block';
            };
            
            // Start loading
            tempImg.src = img.src;
            
            // If image is already cached, it will load immediately
            if (tempImg.complete) {
                img.classList.add('loaded');
                const loader = img.parentElement.querySelector('.image-loader');
                if (loader) {
                    loader.style.display = 'none';
                }
            }
        });
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            if (!this.isAutoplayPaused) {
                this.next();
            }
        }, CONFIG.teamAutoplayInterval);
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.updateView();
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateView();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateView();
    }
    
    updateView() {
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 48; // 3xl spacing
        const offset = -(this.currentIndex * (cardWidth + gap));
        
        this.track.style.transform = `translateX(${offset}px)`;
        
        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
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
