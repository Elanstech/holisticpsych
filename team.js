/* ==========================================================================
   MODERN TEAM PAGE - JAVASCRIPT
   Interactive functionality for team member cards and modals
   ========================================================================== */

'use strict';

/* ==========================================================================
   TEAM MODAL HANDLER
   ========================================================================== */
class ModernTeamModal {
    constructor() {
        this.overlay = document.getElementById('modalOverlay');
        this.modals = document.querySelectorAll('.modal');
        this.teamCards = document.querySelectorAll('.team-member-card');
        this.closeButtons = document.querySelectorAll('.modal-close');
        this.viewProfileButtons = document.querySelectorAll('.view-profile-btn');
        
        this.init();
    }
    
    init() {
        // Bind view profile button clicks
        this.viewProfileButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.team-member-card');
                const memberId = card.getAttribute('data-member');
                this.openModal(memberId);
            });
        });
        
        // Bind card clicks (fallback)
        this.teamCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking on book session button
                if (e.target.closest('.book-session-btn')) {
                    return;
                }
                
                const memberId = card.getAttribute('data-member');
                this.openModal(memberId);
            });
        });
        
        // Bind close button clicks
        this.closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeModal();
            });
        });
        
        // Close modal when clicking overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
        
        // Prevent modal content clicks from closing modal
        this.modals.forEach(modal => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });
    }
    
    openModal(memberId) {
        const modal = document.getElementById(`modal-${memberId}`);
        
        if (modal && this.overlay) {
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Show overlay and modal
            this.overlay.classList.add('active');
            modal.classList.add('active');
            
            // Scroll modal content to top
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollTop = 0;
            }
            
            // Add entrance animation
            this.animateModalEntrance(modal);
        }
    }
    
    closeModal() {
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Hide overlay and all modals
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        
        this.modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    animateModalEntrance(modal) {
        const sections = modal.querySelectorAll('.modal-section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.5s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
}

/* ==========================================================================
   BOOK SESSION HANDLER
   ========================================================================== */
class BookSessionHandler {
    constructor() {
        this.bookButtons = document.querySelectorAll('.book-session-btn');
        this.init();
    }
    
    init() {
        this.bookButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.scrollToContact();
            });
        });
    }
    
    scrollToContact() {
        // If on the same page, scroll to contact
        const contact = document.querySelector('#contact');
        if (contact) {
            const headerOffset = 100;
            const elementPosition = contact.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            // If not on same page, navigate to index.html#contact
            window.location.href = 'index.html#contact';
        }
    }
}

/* ==========================================================================
   CARD ANIMATIONS ON SCROLL
   ========================================================================== */
class TeamCardAnimations {
    constructor() {
        this.cards = document.querySelectorAll('.team-member-card');
        this.init();
    }
    
    init() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            this.observeCards();
        } else {
            // Fallback for older browsers
            this.cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    }
    
    observeCards() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.classList.add('animated');
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.cards.forEach(card => {
            // Set initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            
            observer.observe(card);
        });
    }
}

/* ==========================================================================
   HERO STATS COUNTER
   ========================================================================== */
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observeStats();
        }
    }
    
    observeStats() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.animateCounters();
                }
            });
        }, observerOptions);
        
        const statsContainer = document.querySelector('.hero-stats');
        if (statsContainer) {
            observer.observe(statsContainer);
        }
    }
    
    animateCounters() {
        this.stats.forEach(stat => {
            const text = stat.textContent;
            const isPlus = text.includes('+');
            const number = parseInt(text.replace(/[^\d]/g, ''));
            
            if (isNaN(number)) return;
            
            const duration = 2000;
            const steps = 60;
            const increment = number / steps;
            const stepDuration = duration / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                let display = Math.floor(current).toString();
                if (isPlus) display += '+';
                
                stat.textContent = display;
            }, stepDuration);
        });
    }
}

/* ==========================================================================
   SMOOTH SCROLL FOR CTA BUTTONS
   ========================================================================== */
class CTAScrollHandler {
    constructor() {
        this.ctaButtons = document.querySelectorAll('.cta-btn, .modal-btn');
        this.init();
    }
    
    init() {
        this.ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const href = btn.getAttribute('href');
                
                // Only handle anchor links
                if (href && href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
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
                } else if (href && href.includes('#')) {
                    // Handle links like "index.html#contact"
                    // Let browser navigate normally
                }
            });
        });
    }
}

/* ==========================================================================
   CREDENTIAL BADGE ANIMATIONS
   ========================================================================== */
class CredentialBadgeAnimations {
    constructor() {
        this.badges = document.querySelectorAll('.credential-badge, .expertise-tags .tag');
        this.init();
    }
    
    init() {
        this.badges.forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                this.animateBadge(badge);
            });
        });
    }
    
    animateBadge(badge) {
        badge.style.transform = 'translateY(-2px) scale(1.05)';
        setTimeout(() => {
            badge.style.transform = '';
        }, 300);
    }
}

/* ==========================================================================
   FLOATING ORB ANIMATIONS
   ========================================================================== */
class FloatingOrbAnimations {
    constructor() {
        this.orbs = document.querySelectorAll('.gradient-orb');
        this.init();
    }
    
    init() {
        // Add mouse parallax effect
        document.addEventListener('mousemove', (e) => {
            this.moveOrbs(e);
        });
    }
    
    moveOrbs(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        this.orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

/* ==========================================================================
   STATUS BADGE PULSE
   ========================================================================== */
class StatusBadgePulse {
    constructor() {
        this.badges = document.querySelectorAll('.status-badge');
        this.init();
    }
    
    init() {
        // Add random delay to pulse animation for each badge
        this.badges.forEach((badge, index) => {
            const dot = badge.querySelector('.status-dot');
            if (dot) {
                dot.style.animationDelay = `${index * 0.3}s`;
            }
        });
    }
}

/* ==========================================================================
   CARD TILT EFFECT (OPTIONAL - FOR EXTRA WOW FACTOR)
   ========================================================================== */
class CardTiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.team-member-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.tiltCard(card, e);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetCard(card);
            });
        });
    }
    
    tiltCard(card, e) {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;
        
        const rotateX = (mouseY / cardRect.height) * -10;
        const rotateY = (mouseX / cardRect.width) * 10;
        
        const cardInner = card.querySelector('.card-inner');
        if (cardInner) {
            cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    }
    
    resetCard(card) {
        const cardInner = card.querySelector('.card-inner');
        if (cardInner) {
            cardInner.style.transform = '';
        }
    }
}

/* ==========================================================================
   IMAGE LAZY LOADING
   ========================================================================== */
class ImageLazyLoader {
    constructor() {
        this.images = document.querySelectorAll('.member-image, .modal-image');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            this.images.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

/* ==========================================================================
   INITIALIZE ALL FEATURES
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    const teamModal = new ModernTeamModal();
    const bookSession = new BookSessionHandler();
    const ctaScroll = new CTAScrollHandler();
    
    // Animations
    const cardAnimations = new TeamCardAnimations();
    const statsCounter = new StatsCounter();
    const badgeAnimations = new CredentialBadgeAnimations();
    const orbAnimations = new FloatingOrbAnimations();
    const statusPulse = new StatusBadgePulse();
    
    // Optional effects (comment out if too much)
    const cardTilt = new CardTiltEffect();
    const imageLazyLoader = new ImageLazyLoader();
    
    console.log('🎉 Modern Team Page initialized successfully!');
});

/* ==========================================================================
   PERFORMANCE OPTIMIZATION
   ========================================================================== */

// Debounce function for performance
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

// Throttle function for performance
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

/* ==========================================================================
   ACCESSIBILITY ENHANCEMENTS
   ========================================================================== */

// Add keyboard navigation for cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.team-member-card');
    
    cards.forEach(card => {
        // Make cards focusable
        card.setAttribute('tabindex', '0');
        
        // Add keyboard support
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const memberId = card.getAttribute('data-member');
                const modal = new ModernTeamModal();
                modal.openModal(memberId);
            }
        });
    });
    
    // Add focus styles for accessibility
    const style = document.createElement('style');
    style.textContent = `
        .team-member-card:focus {
            outline: 3px solid var(--primary-green);
            outline-offset: 4px;
        }
        
        .view-profile-btn:focus,
        .book-session-btn:focus,
        .modal-close:focus,
        .cta-btn:focus {
            outline: 3px solid var(--primary-green);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
});

/* ==========================================================================
   EXPORT FOR MODULE SYSTEMS
   ========================================================================== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ModernTeamModal,
        BookSessionHandler,
        TeamCardAnimations,
        StatsCounter,
        CTAScrollHandler,
        CredentialBadgeAnimations,
        FloatingOrbAnimations,
        StatusBadgePulse,
        CardTiltEffect,
        ImageLazyLoader
    };
}
