/* ========================================
   HOLISTIC PSYCHOLOGICAL SERVICES - JS
   Manhattan Mental Health & Wellness
   ======================================== */

/* ========================================
   PRELOADER CONTROLLER
   ======================================== */
class QuickShinePreloader {
    constructor() {
        this.preloader = document.getElementById('shinePreloader');
        this.progressCircle = document.getElementById('progressCircle');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.typingText = document.getElementById('typingText');
        this.particleField = document.getElementById('particleField');
        
        // Timing configuration (fast but visible)
        this.duration = 2500; // 2.5 seconds total
        this.minShowTime = 1200; // Minimum time to show preloader
        this.progressUpdateInterval = 50; // Update every 50ms for smooth animation
        
        // Text messages for typing effect
        this.messages = [
            'Creating your sanctuary...',
            'Preparing holistic care...',
            'Welcome to wellness...',
            'Nurturing your journey...'
        ];
        
        this.currentMessageIndex = 0;
        this.currentProgress = 0;
        this.startTime = Date.now();
        this.isComplete = false;
        this.particles = [];
        
        this.init();
    }
    
    init() {
        if (!this.preloader) return;
        
        this.setupProgressGradient();
        this.createParticles();
        this.startLoadingSequence();
        this.setupEventListeners();
        
        // Auto-hide based on page load and minimum time
        this.setupAutoHide();
    }
    
    setupProgressGradient() {
        // Create SVG gradient for progress circle
        if (this.progressCircle) {
            const svg = this.progressCircle.closest('svg');
            if (svg && !svg.querySelector('defs')) {
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                
                gradient.setAttribute('id', 'progressGradient');
                gradient.setAttribute('x1', '0%');
                gradient.setAttribute('y1', '0%');
                gradient.setAttribute('x2', '100%');
                gradient.setAttribute('y2', '100%');
                
                const stops = [
                    { offset: '0%', color: 'var(--primary-green)' },
                    { offset: '50%', color: 'var(--primary-blue)' },
                    { offset: '100%', color: 'var(--primary-purple)' }
                ];
                
                stops.forEach(stop => {
                    const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stopElement.setAttribute('offset', stop.offset);
                    stopElement.setAttribute('stop-color', stop.color);
                    gradient.appendChild(stopElement);
                });
                
                defs.appendChild(gradient);
                svg.appendChild(defs);
                
                this.progressCircle.setAttribute('stroke', 'url(#progressGradient)');
            }
        }
    }
    
    createParticles() {
        if (!this.particleField) return;
        
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: radial-gradient(circle, var(--primary-green), transparent);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                will-change: transform, opacity;
            `;
            
            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            this.particleField.appendChild(particle);
            this.particles.push({
                element: particle,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: Math.random() * 3000 + 1000, // 1-4 seconds
                birth: Date.now()
            });
        }
        
        this.animateParticles();
    }
    
    animateParticles() {
        const animate = () => {
            if (!this.isComplete) {
                this.particles.forEach(particle => {
                    const age = Date.now() - particle.birth;
                    const lifeRatio = age / particle.life;
                    
                    if (lifeRatio < 1) {
                        // Update position
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        
                        // Wrap around screen
                        if (particle.x < 0) particle.x = window.innerWidth;
                        if (particle.x > window.innerWidth) particle.x = 0;
                        if (particle.y < 0) particle.y = window.innerHeight;
                        if (particle.y > window.innerHeight) particle.y = 0;
                        
                        // Update opacity (fade in/out)
                        const opacity = Math.sin(lifeRatio * Math.PI) * 0.6;
                        
                        particle.element.style.left = particle.x + 'px';
                        particle.element.style.top = particle.y + 'px';
                        particle.element.style.opacity = opacity;
                    } else {
                        // Reset particle
                        particle.birth = Date.now();
                        particle.x = Math.random() * window.innerWidth;
                        particle.y = Math.random() * window.innerHeight;
                    }
                });
                
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    startLoadingSequence() {
        // Start typing animation
        this.startTypingAnimation();
        
        // Start progress animation
        this.animateProgress();
        
        // Trigger logo shine effects
        this.triggerLogoEffects();
    }
    
    startTypingAnimation() {
        if (!this.typingText) return;
        
        const typeMessage = (message, callback) => {
            let i = 0;
            this.typingText.textContent = '';
            
            const typeChar = () => {
                if (i < message.length) {
                    this.typingText.textContent += message.charAt(i);
                    i++;
                    setTimeout(typeChar, 40); // Fast typing
                } else if (callback) {
                    setTimeout(callback, 300); // Brief pause before next message
                }
            };
            
            typeChar();
        };
        
        const cycleMessages = () => {
            if (!this.isComplete) {
                const message = this.messages[this.currentMessageIndex];
                typeMessage(message, () => {
                    this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length;
                    setTimeout(cycleMessages, 200);
                });
            }
        };
        
        cycleMessages();
    }
    
    animateProgress() {
        const circumference = 2 * Math.PI * 54; // radius = 54
        
        const updateProgress = () => {
            const elapsed = Date.now() - this.startTime;
            const progress = Math.min((elapsed / this.duration) * 100, 100);
            
            this.currentProgress = progress;
            
            // Update circular progress
            if (this.progressCircle) {
                const offset = circumference - (progress / 100) * circumference;
                this.progressCircle.style.strokeDashoffset = offset;
            }
            
            // Update percentage text
            if (this.progressPercentage) {
                this.progressPercentage.textContent = Math.round(progress) + '%';
            }
            
            // Continue animation
            if (progress < 100 && !this.isComplete) {
                setTimeout(updateProgress, this.progressUpdateInterval);
            } else {
                this.onProgressComplete();
            }
        };
        
        updateProgress();
    }
    
    triggerLogoEffects() {
        const logo = document.querySelector('.showcase-logo');
        const logoShine = document.querySelector('.logo-shine');
        
        if (logo) {
            // Enhanced hover-like effect
            logo.style.transform = 'scale(1.05)';
            logo.style.filter = 'brightness(1.2) saturate(1.3)';
            
            setTimeout(() => {
                logo.style.transform = 'scale(1)';
                logo.style.filter = 'brightness(1) saturate(1)';
            }, 800);
        }
        
        // Trigger additional shine effects
        setTimeout(() => {
            if (logoShine) {
                logoShine.style.animationDuration = '1.5s';
            }
        }, 1000);
    }
    
    onProgressComplete() {
        // Small delay before hiding to show 100%
        setTimeout(() => {
            this.hidePreloader();
        }, 300);
    }
    
    setupEventListeners() {
        // Force hide on window load after minimum time
        window.addEventListener('load', () => {
            const elapsed = Date.now() - this.startTime;
            const remainingTime = Math.max(0, this.minShowTime - elapsed);
            
            setTimeout(() => {
                if (!this.isComplete) {
                    this.hidePreloader();
                }
            }, remainingTime);
        });
        
        // Hide on any click after minimum time (emergency exit)
        document.addEventListener('click', () => {
            const elapsed = Date.now() - this.startTime;
            if (elapsed > this.minShowTime && !this.isComplete) {
                this.hidePreloader();
            }
        });
        
        // Hide on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const elapsed = Date.now() - this.startTime;
                if (elapsed > this.minShowTime) {
                    this.hidePreloader();
                }
            }
        });
    }
    
    setupAutoHide() {
        // Fallback auto-hide after maximum duration
        setTimeout(() => {
            if (!this.isComplete) {
                this.hidePreloader();
            }
        }, this.duration + 500);
    }
    
    hidePreloader() {
        if (this.isComplete || !this.preloader) return;
        
        this.isComplete = true;
        
        // Trigger exit animation
        this.preloader.classList.add('exiting');
        
        // Advanced exit animation
        setTimeout(() => {
            this.preloader.classList.add('loaded');
            
            // Clean up after animation
            setTimeout(() => {
                this.cleanup();
            }, 800);
        }, 600);
        
        // Dispatch completion event
        document.dispatchEvent(new CustomEvent('preloaderComplete', {
            detail: { 
                duration: Date.now() - this.startTime,
                method: 'auto'
            }
        }));
    }
    
    forceHide() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        this.preloader.style.transition = 'all 0.5s ease';
        this.preloader.classList.add('loaded');
        
        setTimeout(() => {
            this.cleanup();
        }, 500);
        
        document.dispatchEvent(new CustomEvent('preloaderComplete', {
            detail: { 
                duration: Date.now() - this.startTime,
                method: 'forced'
            }
        }));
    }
    
    cleanup() {
        if (this.preloader) {
            this.preloader.style.display = 'none';
        }
        
        // Clear particles
        this.particles = [];
        
        // Remove any remaining event listeners
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeydown);
        
        console.log('✨ Shine Preloader completed successfully');
    }
    
    // Public API methods
    getProgress() {
        return this.currentProgress;
    }
    
    isCompleted() {
        return this.isComplete;
    }
    
    getRemainingTime() {
        const elapsed = Date.now() - this.startTime;
        return Math.max(0, this.duration - elapsed);
    }
}

class ParticleEnhancer {
    constructor(preloader) {
        this.preloader = preloader;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        
        this.init();
    }
    
    init() {
        // Create canvas for better particle performance
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        const particleField = document.getElementById('particleField');
        if (particleField) {
            particleField.appendChild(this.canvas);
        }
        
        window.addEventListener('resize', () => this.resizeCanvas());
        this.createParticles();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const count = 30;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                life: Math.random() * 200 + 100,
                age: 0,
                color: this.getRandomColor()
            });
        }
    }
    
    getRandomColor() {
        const colors = ['#00d884', '#0ea5e9', '#8b5cf6'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animate() {
        if (this.preloader.isCompleted()) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.age++;
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Calculate opacity
            const lifeRatio = particle.age / particle.life;
            const opacity = Math.sin(lifeRatio * Math.PI) * 0.6;
            
            // Draw particle
            this.ctx.globalAlpha = opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Reset particle if too old
            if (particle.age >= particle.life) {
                particle.age = 0;
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

let quickShinePreloader;
let particleEnhancer;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePreloader);
} else {
    initializePreloader();
}

function initializePreloader() {
    quickShinePreloader = new QuickShinePreloader();
    
    // Add enhanced particles for better visual effect
    setTimeout(() => {
        particleEnhancer = new ParticleEnhancer(quickShinePreloader);
    }, 100);
}

// Global API
window.QuickShinePreloader = {
    getInstance: () => quickShinePreloader,
    hide: () => quickShinePreloader?.forceHide(),
    getProgress: () => quickShinePreloader?.getProgress() || 0,
    isComplete: () => quickShinePreloader?.isCompleted() || false
};

// Quick access function to hide preloader
function hidePreloader() {
    if (quickShinePreloader) {
        quickShinePreloader.forceHide();
    }
}

// Performance monitoring
function getPreloaderPerformance() {
    if (quickShinePreloader) {
        return {
            progress: quickShinePreloader.getProgress(),
            isComplete: quickShinePreloader.isCompleted(),
            remainingTime: quickShinePreloader.getRemainingTime()
        };
    }
    return null;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        QuickShinePreloader,
        ParticleEnhancer,
        hidePreloader,
        getPreloaderPerformance
    };
}

/* ========================================
   HEADER CONTROLLER
   ======================================== */
class FloatingHeaderController {
    constructor() {
        this. = document.getElementById('floating');
        this.navCapsule = document.getElementById('navCapsule');
        this.navTrack = this.navCapsule?.querySelector('.nav-track');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.navIndicator = document.querySelector('.nav-indicator');
        this.mobileTrigger = document.getElementById('mobileTrigger');
        this.mobileOverlay = document.getElementById('mobileOverlay');
        this.mobileClose = document.getElementById('mobileClose');
        this.mobileLinks = document.querySelectorAll('.mobile-link');
        
        this.lastScrollY = 0;
        this.isScrollingDown = false;
        this.isMobileMenuOpen = false;
        this.activeNavIndex = 0;
        
        this.init();
    }
    
    init() {
        if (!this.) return;
        
        this.setupScrollBehavior();
        this.setupNavigationIndicator();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollSpy();
        this.setupGlowEffect();
        
        // Set initial nav indicator position
        this.updateNavIndicator(0);
    }
    
    setupScrollBehavior() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    handleScroll() {
        const currentScrollY = window.pageYOffset;
        
        // Add scrolled class for visual changes
        if (currentScrollY > 50) {
            this..classList.add('scrolled');
        } else {
            this..classList.remove('scrolled');
        }
        
        // Hide/show  on scroll (optional)
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
            // Scrolling down
            if (!this.isScrollingDown && !this.isMobileMenuOpen) {
                this.isScrollingDown = true;
                this..style.transform = 'translateX(-50%) translateY(-100px)';
                this..style.opacity = '0.7';
            }
        } else {
            // Scrolling up
            if (this.isScrollingDown) {
                this.isScrollingDown = false;
                this..style.transform = 'translateX(-50%) translateY(0)';
                this..style.opacity = '1';
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    setupNavigationIndicator() {
        if (!this.navDots.length || !this.navIndicator) return;
        
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active states
                this.navDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // Update indicator position
                this.updateNavIndicator(index);
                
                // Smooth scroll to section
                const target = dot.getAttribute('href');
                this.scrollToSection(target);
                
                this.activeNavIndex = index;
            });
            
            // Add hover effects
            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            dot.addEventListener('mouseleave', () => {
                dot.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    updateNavIndicator(index) {
        if (!this.navIndicator || !this.navTrack) return;
        
        const positions = [8, 60, 112, 164, 216]; // Position for each nav item
        const position = positions[index] || 8;
        
        this.navIndicator.style.left = position + 'px';
        this.navTrack.setAttribute('data-active', index);
        
        // Add a subtle animation
        this.navIndicator.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.navIndicator.style.transform = 'scale(1)';
        }, 200);
    }
    
    setupMobileMenu() {
        if (!this.mobileTrigger || !this.mobileOverlay) return;
        
        // Mobile trigger click
        this.mobileTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });
        
        // Mobile close button
        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
            });
        }
        
        // Mobile overlay click to close
        this.mobileOverlay.addEventListener('click', (e) => {
            if (e.target === this.mobileOverlay) {
                this.closeMobileMenu();
            }
        });
        
        // Mobile navigation links
        this.mobileLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                    this.closeMobileMenu();
                    
                    // Update desktop nav indicator
                    this.updateDesktopNavForMobile(href);
                }
            });
            
            // Staggered animation on menu open
            link.style.transitionDelay = (index * 0.1) + 's';
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Close on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMobileMenuOpen = true;
        this.mobileTrigger.classList.add('active');
        this.mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset  position when menu opens
        this..style.transform = 'translateX(-50%) translateY(0)';
        this..style.opacity = '1';
        this.isScrollingDown = false;
        
        // Animate mobile links
        this.mobileLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.transform = 'translateX(0)';
                link.style.opacity = '1';
            }, index * 100);
        });
    }
    
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        this.mobileTrigger.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset mobile links animation
        this.mobileLinks.forEach(link => {
            link.style.transform = 'translateX(50px)';
            link.style.opacity = '0';
            link.style.transitionDelay = '0s';
        });
    }
    
    setupSmoothScrolling() {
        // Handle all navigation links (both desktop and mobile)
        const allNavLinks = document.querySelectorAll('a[href^="#"]');
        
        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.length > 1) { // Not just "#"
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
    }
    
    scrollToSection(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const Height = this..offsetHeight + 20; // Add some offset
        const targetPosition = targetElement.offsetTop - Height;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-20% 0px -60% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    this.updateActiveNavFromSection(sectionId);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveNavFromSection(sectionId) {
        const navLink = document.querySelector(`.nav-dot[href="#${sectionId}"]`);
        if (!navLink) return;
        
        // Find the index of the active nav item
        const navIndex = Array.from(this.navDots).indexOf(navLink);
        if (navIndex !== -1 && navIndex !== this.activeNavIndex) {
            // Update active states
            this.navDots.forEach(dot => dot.classList.remove('active'));
            navLink.classList.add('active');
            
            // Update indicator
            this.updateNavIndicator(navIndex);
            this.activeNavIndex = navIndex;
        }
    }
    
    updateDesktopNavForMobile(href) {
        const navLink = document.querySelector(`.nav-dot[href="${href}"]`);
        if (navLink) {
            const navIndex = Array.from(this.navDots).indexOf(navLink);
            if (navIndex !== -1) {
                this.navDots.forEach(dot => dot.classList.remove('active'));
                navLink.classList.add('active');
                this.updateNavIndicator(navIndex);
                this.activeNavIndex = navIndex;
            }
        }
    }
    
    setupGlowEffect() {
        // Add subtle glow effect on hover
        if (this.) {
            let glowTimeout;
            
            this..addEventListener('mouseenter', () => {
                clearTimeout(glowTimeout);
                this..style.filter = 'drop-shadow(0 8px 32px rgba(34, 197, 94, 0.15))';
            });
            
            this..addEventListener('mouseleave', () => {
                glowTimeout = setTimeout(() => {
                    this..style.filter = '';
                }, 300);
            });
        }
        
        // Add ripple effect to CTA button
        const ctaButton = document.querySelector('.cta-floating');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                const ripple = ctaButton.querySelector('.cta-ripple');
                if (ripple) {
                    ripple.style.width = '0';
                    ripple.style.height = '0';
                    
                    setTimeout(() => {
                        ripple.style.width = '200px';
                        ripple.style.height = '200px';
                    }, 10);
                    
                    setTimeout(() => {
                        ripple.style.width = '0';
                        ripple.style.height = '0';
                    }, 600);
                }
            });
        }
        
        // Phone bubble glow effect
        const phoneBubble = document.querySelector('.phone-bubble');
        if (phoneBubble) {
            phoneBubble.addEventListener('mouseenter', () => {
                const glow = phoneBubble.querySelector('.bubble-glow');
                if (glow) {
                    glow.style.left = '-100%';
                    setTimeout(() => {
                        glow.style.left = '100%';
                    }, 50);
                }
            });
        }
    }
    
    // Public methods for external control
    show() {
        this..style.transform = 'translateX(-50%) translateY(0)';
        this..style.opacity = '1';
        this.isScrollingDown = false;
    }
    
    hide() {
        if (!this.isMobileMenuOpen) {
            this..style.transform = 'translateX(-50%) translateY(-100px)';
            this..style.opacity = '0.7';
            this.isScrollingDown = true;
        }
    }
    
    setActiveNav(index) {
        if (index >= 0 && index < this.navDots.length) {
            this.navDots.forEach(dot => dot.classList.remove('active'));
            this.navDots[index].classList.add('active');
            this.updateNavIndicator(index);
            this.activeNavIndex = index;
        }
    }
    
    destroy() {
        // Clean up event listeners if needed
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

/* ========================================
   INITIALIZATION
   ======================================== */

// Initialize when DOM is ready
let floatingController;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        floatingController = new FloatingController();
    });
} else {
    floatingController = new FloatingController();
}

// Make it globally accessible for debugging
window.FloatingController = FloatingController;
window.floatingController = floatingHeaderController;

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Smooth scroll utility
function smoothScrollTo(target, offset = 100) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Header visibility control
function toggleHeaderVisibility(show = true) {
    if (floatingHeaderController) {
        if (show) {
            floatingHeaderController.showHeader();
        } else {
            floatingHeaderController.hideHeader();
        }
    }
}

// Set active navigation programmatically
function setActiveNavigation(index) {
    if (floatingHeaderController) {
        floatingHeaderController.setActiveNav(index);
    }
}

/* ========================================
   EXPORT FOR MODULE SYSTEMS
   ======================================== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FloatingHeaderController,
        smoothScrollTo,
        toggleHeaderVisibility,
        setActiveNavigation
    };
}

/* ========================================
   HERO SLIDESHOW CONTROLLER
   ======================================== */
class HeroSlideshowController {
    constructor() {
        this.swiperContainer = document.querySelector('.hero-swiper');
        this.swiper = null;
        
        this.init();
    }
    
    init() {
        if (typeof Swiper !== 'undefined' && this.swiperContainer) {
            this.initSwiper();
        }
        
        this.setupFloatingAnimations();
    }
    
    initSwiper() {
        this.swiper = new Swiper('.hero-swiper', {
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            loop: true,
            speed: 1500,
            on: {
                slideChange: () => {
                    this.onSlideChange();
                }
            }
        });
    }
    
    onSlideChange() {
        // Add any slide change animations here
        if (typeof gsap !== 'undefined') {
            gsap.from('.hero-text', {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        }
    }
    
    setupFloatingAnimations() {
        const floatingLeaves = document.querySelectorAll('.floating-leaf');
        
        floatingLeaves.forEach((leaf, index) => {
            if (typeof gsap !== 'undefined') {
                gsap.to(leaf, {
                    y: -20,
                    x: 10,
                    rotation: 5,
                    duration: 3 + index,
                    ease: "power2.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: index * 0.5
                });
            }
        });
    }
}

/* ========================================
   SCROLL ANIMATIONS CONTROLLER
   ======================================== */
class ScrollAnimationsController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initAOS();
        this.setupCustomAnimations();
    }
    
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 0
            });
            
            // Refresh AOS on window resize
            window.addEventListener('resize', () => {
                AOS.refresh();
            });
        }
    }
    
    setupCustomAnimations() {
        // Intersection Observer for custom animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe animated elements
        const animatedElements = document.querySelectorAll('.info-card, .feature-item');
        animatedElements.forEach(el => observer.observe(el));
    }
    
    animateElement(element) {
        if (typeof gsap !== 'undefined') {
            gsap.from(element, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.2
            });
        } else {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
    }
}

/* ========================================
   UTILITIES
   ======================================== */
class UtilityFunctions {
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
    
    static smoothScrollTo(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    static getScrollPercent() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return (scrollTop / scrollHeight) * 100;
    }
    
    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

/* ========================================
   CONTACT FORM HANDLER
   ======================================== */
class ContactFormHandler {
    constructor() {
        this.phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        this.emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        
        this.init();
    }
    
    init() {
        this.setupPhoneTracking();
        this.setupEmailTracking();
    }
    
    setupPhoneTracking() {
        this.phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track phone clicks (for analytics)
                this.trackEvent('contact', 'phone_click', '(646) 971-7325');
            });
        });
    }
    
    setupEmailTracking() {
        this.emailLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track email clicks (for analytics)
                this.trackEvent('contact', 'email_click');
            });
        });
    }
    
    trackEvent(category, action, label = '') {
        // Google Analytics tracking (if implemented)
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        // Console log for development
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
    }
}

/* ========================================
   PERFORMANCE MONITOR
   ======================================== */
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        this.monitorPageLoad();
        this.monitorScrollPerformance();
    }
    
    monitorPageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                console.log(`Page loaded in ${loadTime}ms`);
                
                // Track in analytics if needed
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        name: 'page_load',
                        value: Math.round(loadTime)
                    });
                }
            }, 0);
        });
    }
    
    monitorScrollPerformance() {
        let scrollCount = 0;
        const throttledScroll = UtilityFunctions.throttle(() => {
            scrollCount++;
        }, 100);
        
        window.addEventListener('scroll', throttledScroll, { passive: true });
    }
}

/* ========================================
   MAIN APPLICATION
   ======================================== */
class HolisticPsychApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }
    
    initializeApp() {
        try {
            // Initialize preloader first
            this.components.preloader = new PreloaderController();
            
            // Initialize other components after preloader
            document.addEventListener('preloaderComplete', () => {
                this.initializeMainComponents();
            });
            
            // Fallback initialization
            setTimeout(() => {
                if (!this.isInitialized) {
                    this.initializeMainComponents();
                }
            }, 3000);
            
        } catch (error) {
            console.error('Error initializing app:', error);
            this.initializeFallback();
        }
    }
    
    initializeMainComponents() {
        if (this.isInitialized) return;
        
        try {
            this.components.header = new FloatingHeaderController();
            this.components.heroSlideshow = new HeroSlideshowController();
            this.components.scrollAnimations = new ScrollAnimationsController();
            this.components.contactForm = new ContactFormHandler();
            this.components.performanceMonitor = new PerformanceMonitor();
            
            this.isInitialized = true;
            console.log('✅ Holistic Psychology App initialized successfully');
            
            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('appInitialized', {
                detail: { components: this.components }
            }));
            
        } catch (error) {
            console.error('Error initializing main components:', error);
            this.initializeFallback();
        }
    }
    
    initializeFallback() {
        // Basic functionality without external libraries
        console.log('🔄 Initializing fallback functionality');
        
        // Basic mobile menu
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        
        if (mobileToggle && mobileNav) {
            mobileToggle.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
        
        // Basic smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Hide preloader
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.style.display = 'none';
            }
        }, 2000);
    }
    
    getComponent(name) {
        return this.components[name];
    }
}

/* ========================================
   INITIALIZATION
   ======================================== */

// Initialize the application
const app = new HolisticPsychApp();

// Make components globally accessible for debugging
window.HolisticApp = app;
window.UtilityFunctions = UtilityFunctions;

// Additional CSS animations for fallback
if (!window.CSS || !CSS.supports('animation', 'fadeInUp')) {
    const style = document.createElement('style');
    style.textContent = `
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
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
        
        .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-pulse {
            animation: pulse 2s infinite;
        }
        
        .animate-slideInRight {
            animation: slideInRight 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

/* ========================================
   EXPORT FOR MODULE SYSTEMS
   ======================================== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HolisticPsychApp,
        PreloaderController,
        HeaderController,
        HeroSlideshowController,
        ScrollAnimationsController,
        ContactFormHandler,
        UtilityFunctions
    };
}
