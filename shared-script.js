document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Intersection Observer for staggered section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.setProperty('--section-index', index);
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.legal-section');
    sections.forEach((section, index) => {
        section.style.setProperty('--section-index', index);
        sectionObserver.observe(section);
    });

    // Add hover effect to subsections
    const subsections = document.querySelectorAll('.subsection');
    subsections.forEach(subsection => {
        subsection.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        subsection.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Highlight active section in table of contents if exists
    const updateActiveSection = () => {
        const sections = document.querySelectorAll('.legal-section');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                section.style.borderLeftColor = 'var(--accent-color)';
            }
        });
    };

    // Throttled scroll handler for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveSection, 50);
    }, { passive: true });

    // Add focus styles for accessibility
    const focusableElements = document.querySelectorAll('a, button, input, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--accent-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });

    // Print functionality
    const createPrintButton = () => {
        const headerContent = document.querySelector('.header-content');
        if (headerContent && !document.querySelector('.print-button')) {
            const printButton = document.createElement('button');
            printButton.className = 'print-button';
            printButton.innerHTML = '🖨️ Print';
            printButton.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            `;
            
            printButton.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255, 255, 255, 0.3)';
                this.style.transform = 'translateY(-2px)';
            });
            
            printButton.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(255, 255, 255, 0.2)';
                this.style.transform = 'translateY(0)';
            });
            
            printButton.addEventListener('click', () => {
                window.print();
            });
            
            headerContent.style.position = 'relative';
            headerContent.appendChild(printButton);
        }
    };

    createPrintButton();

    // Enhance contact info interactivity
    const contactInfos = document.querySelectorAll('.contact-info');
    contactInfos.forEach(info => {
        info.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--accent-color)';
        });
        
        info.addEventListener('mouseleave', function() {
            this.style.borderColor = 'var(--border-color)';
        });
    });

    // Add smooth reveal animation for lists
    const listItems = document.querySelectorAll('.legal-section ul li');
    const listObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 50);
                listObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    listItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        listObserver.observe(item);
    });

    // Back to top functionality
    const createBackToTop = () => {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--accent-color);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px var(--shadow-medium);
            z-index: 1000;
        `;
        
        backToTop.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 6px 16px var(--shadow-medium)';
        });
        
        backToTop.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px var(--shadow-medium)';
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(backToTop);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        }, { passive: true });
    };

    createBackToTop();

    // Reading progress indicator
    const createProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--accent-color);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        }, { passive: true });
    };

    createProgressBar();

    // Print styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .back-link,
            .print-button,
            .back-to-top,
            .reading-progress,
            .legal-footer {
                display: none !important;
            }
            
            .legal-section {
                page-break-inside: avoid;
            }
            
            body {
                background: white;
            }
            
            .legal-header {
                background: white !important;
                color: black !important;
                border-bottom: 2px solid black;
            }
            
            .page-title {
                color: black !important;
            }
        }
    `;
    document.head.appendChild(printStyles);

    // Initialize complete
    console.log('Legal pages initialized with enhanced interactivity');
});
