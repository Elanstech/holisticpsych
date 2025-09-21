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
        this.services = new Services();
        this.about = new About();
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
class Services {
    constructor() {
        this.section = document.querySelector('.services');
        this.cards = document.querySelectorAll('.service-card');
        
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
                        }, index * 100);
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
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(-5deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }
}

/* ==========================================================================
   ABOUT SECTION
   ========================================================================== */
class About {
    constructor() {
        this.section = document.querySelector('.about');
        this.philosophyItems = document.querySelectorAll('.philosophy-item');
        
        this.init();
    }
    
    init() {
        if (!this.section) return;
        
        // Animate on scroll
        this.initScrollAnimation();
        
        // Philosophy items effects
        this.initPhilosophyEffects();
    }
    
    initScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Animate philosophy items
                    this.philosophyItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.2 });
        
        // Setup initial state
        this.section.style.opacity = '0';
        this.section.style.transform = 'translateY(30px)';
        this.section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        this.philosophyItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        observer.observe(this.section);
    }
    
    initPhilosophyEffects() {
        this.philosophyItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }
}

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
