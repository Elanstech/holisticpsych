/* ==========================================================================
   TEAMS PAGE JAVASCRIPT
   Modal functionality for team member details
   ========================================================================== */

'use strict';

// Team Modal Handler
class TeamModal {
    constructor() {
        this.overlay = document.getElementById('modalOverlay');
        this.modals = document.querySelectorAll('.modal');
        this.teamCards = document.querySelectorAll('.team-card');
        this.closeButtons = document.querySelectorAll('.modal-close');
        
        this.init();
    }
    
    init() {
        // Bind click events to team cards
        this.teamCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const memberId = card.getAttribute('data-member');
                this.openModal(memberId);
            });
        });
        
        // Bind click events to close buttons
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
        
        // Prevent body scroll when modal is open
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const teamModal = new TeamModal();
    console.log('Team page initialized');
});

// Smooth scroll for CTA buttons
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtons = document.querySelectorAll('a[href^="#"]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const href = button.getAttribute('href');
            
            // Only handle anchor links (starting with #)
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
            }
        });
    });
});

// Animation on scroll for team cards
const observeTeamCards = () => {
    const cards = document.querySelectorAll('.team-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    observeTeamCards();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TeamModal };
}
