/* ==========================================================================
   MODERN TEAM PAGE - PROFESSIONAL JAVASCRIPT
   Clean, Professional Interactions
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
                section.style.transition = 'all 0.4s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100 * index);
        });
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
    const ctaScroll = new CTAScrollHandler();
    
    // Animations
    const cardAnimations = new TeamCardAnimations();
    const statsCounter = new StatsCounter();
    const statusPulse = new StatusBadgePulse();
    const imageLazyLoader = new ImageLazyLoader();
    
    console.log('✨ Professional Team Page initialized successfully!');
});

/* ==========================================================================
   ACCESSIBILITY ENHANCEMENTS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.team-member-card');
    
    cards.forEach(card => {
        // Make cards focusable
        card.setAttribute('tabindex', '0');
        
        // Add keyboard support
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const viewBtn = card.querySelector('.view-profile-btn');
                if (viewBtn) {
                    viewBtn.click();
                }
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
        TeamCardAnimations,
        StatsCounter,
        CTAScrollHandler,
        StatusBadgePulse,
        ImageLazyLoader
    };
}
