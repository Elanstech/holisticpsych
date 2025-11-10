/* ============================================ */
/* CONTACT PAGE - INTERACTIVE FEATURES */
/* ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ===== BACK TO TOP BUTTON =====
    initBackToTop();

    // ===== SCROLL ANIMATIONS =====
    initScrollAnimations();

    // ===== INFO CARDS INTERACTIONS =====
    initInfoCards();

    // ===== FAQ INTERACTIONS =====
    initFAQ();

    // ===== SMOOTH SCROLL =====
    initSmoothScroll();

    // ===== FORM ENHANCEMENTS =====
    initFormEnhancements();

    // ===== HERO ANIMATIONS =====
    initHeroAnimations();

});

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll(
        '.info-card, .form-card, .faq-item, .transport-card, .emergency-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animate-in class styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== INFO CARDS INTERACTIONS =====
function initInfoCards() {
    const infoCards = document.querySelectorAll('.info-card');

    infoCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            if (e.target.closest('a')) return; // Don't trigger for links

            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(102, 126, 234, 0.3)';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.left = e.offsetX + 'px';
            ripple.style.top = e.offsetY + 'px';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';

            card.style.position = 'relative';
            card.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });

        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            from {
                width: 20px;
                height: 20px;
                opacity: 1;
            }
            to {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== FAQ INTERACTIONS =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        // Make FAQ item clickable
        item.style.cursor = 'pointer';

        // Add click event
        item.addEventListener('click', function() {
            // Toggle active state
            const isActive = item.classList.contains('faq-active');

            // Remove active from all items
            faqItems.forEach(i => {
                i.classList.remove('faq-active');
                const ans = i.querySelector('.faq-answer');
                if (ans) {
                    ans.style.maxHeight = null;
                    ans.style.marginTop = '0';
                }
            });

            // Add active to clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('faq-active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.marginTop = '16px';
            }
        });
    });

    // Add FAQ active styles
    const style = document.createElement('style');
    style.textContent = `
        .faq-item.faq-active {
            border: 2px solid #667eea;
        }
        .faq-item .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, margin-top 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== FORM ENHANCEMENTS =====
function initFormEnhancements() {
    // Wait for Elfsight form to load
    setTimeout(function() {
        const formContainer = document.querySelector('.elfsight-form-wrapper');
        if (!formContainer) return;

        // Add loading state
        formContainer.classList.add('form-loading');

        // Remove loading state when form is visible
        const checkFormLoaded = setInterval(function() {
            const elfsightApp = formContainer.querySelector('[data-elfsight-app-lazy]');
            if (elfsightApp && elfsightApp.children.length > 0) {
                formContainer.classList.remove('form-loading');
                formContainer.classList.add('form-loaded');
                clearInterval(checkFormLoaded);

                // Add success animation
                formContainer.style.animation = 'fadeIn 0.6s ease-out';
            }
        }, 100);

        // Clear interval after 10 seconds
        setTimeout(() => clearInterval(checkFormLoaded), 10000);

    }, 1000);
}

// ===== HERO ANIMATIONS =====
function initHeroAnimations() {
    const hero = document.querySelector('.contact-hero');
    if (!hero) return;

    // Parallax effect on hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const pattern = hero.querySelector('.hero-background-pattern');
            if (pattern) {
                pattern.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }
    });

    // Mouse move parallax effect
    hero.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const pattern = hero.querySelector('.hero-background-pattern');
        if (pattern) {
            pattern.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        }
    });
}

// ===== UTILITY FUNCTIONS =====

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

// Throttle function for scroll events
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func(...args);
    };
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initAccessibility() {
    // Add focus visible styles
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // Add focus visible styles
    const style = document.createElement('style');
    style.textContent = `
        body:not(.keyboard-nav) *:focus {
            outline: none;
        }
        body.keyboard-nav *:focus {
            outline: 2px solid #667eea;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

// Initialize accessibility features
initAccessibility();

// ===== COPY TO CLIPBOARD =====
function initCopyToClipboard() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

    [...phoneLinks, ...emailLinks].forEach(link => {
        // Add copy icon
        const copyIcon = document.createElement('i');
        copyIcon.className = 'ri-file-copy-line';
        copyIcon.style.marginLeft = '8px';
        copyIcon.style.fontSize = '14px';
        copyIcon.style.opacity = '0.6';
        copyIcon.style.cursor = 'pointer';
        copyIcon.style.transition = 'opacity 0.2s';

        copyIcon.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
        });

        copyIcon.addEventListener('mouseleave', function() {
            this.style.opacity = '0.6';
        });

        copyIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const text = link.textContent.trim();
            navigator.clipboard.writeText(text).then(() => {
                // Show copied notification
                showNotification('Copied to clipboard!');
                copyIcon.className = 'ri-check-line';
                setTimeout(() => {
                    copyIcon.className = 'ri-file-copy-line';
                }, 2000);
            });
        });

        // Only add copy icon for email links in desktop view
        if (window.innerWidth > 768 && link.href.startsWith('mailto:')) {
            link.appendChild(copyIcon);
        }
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 30px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 16px 24px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
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
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize copy to clipboard after a delay
setTimeout(initCopyToClipboard, 1000);

// ===== LOADING ANIMATION =====
window.addEventListener('load', function() {
    // Hide any loading animations
    document.body.classList.add('page-loaded');

    // Trigger entrance animations
    const heroContent = document.querySelector('.hero-content-wrapper');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 0.8s ease-out';
    }
});

// ===== PERFORMANCE MONITORING =====
// Log page load time (for debugging)
window.addEventListener('load', function() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Contact page loaded in:', pageLoadTime + 'ms');
});

// ===== EXPORT FOR DEBUGGING =====
window.contactPageDebug = {
    version: '1.0.0',
    initBackToTop,
    initScrollAnimations,
    initInfoCards,
    initFAQ,
    initSmoothScroll,
    initFormEnhancements,
    initHeroAnimations
};

console.log('Contact page scripts initialized successfully! ✨');
