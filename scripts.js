/* ==========================================================================
   HOLISTIC PSYCHOLOGICAL SERVICES - COMPREHENSIVE JAVASCRIPT
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
        this.team = new ModernTeamCarousel();
        this.reviews = new ElegantReviewsInstagramSection();
        this.contact = new HolisticContactSection();
        this.footer = new Footer();
        this.popupSystem = new PopupModalSystem();
        
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
   POPUP MODAL SYSTEM
   ========================================================================== */
class PopupModalSystem {
    constructor() {
        this.overlay = document.getElementById('popupOverlay');
        this.modal = document.getElementById('popupModal');
        this.content = document.getElementById('popupContent');
        this.closeBtn = document.getElementById('popupClose');
        this.isOpen = false;
        this.activePopup = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.createPopupContent();
    }
    
    bindEvents() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closePopup());
        }
        
        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.closePopup();
                }
            });
        }
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePopup();
            }
        });
        
        // Bind all popup triggers
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-popup]');
            if (trigger) {
                e.preventDefault();
                const popupType = trigger.getAttribute('data-popup');
                this.openPopup(popupType);
            }
        });
    }
    
    openPopup(type) {
        if (!this.overlay || !this.modal || !this.content) return;
        
        this.activePopup = type;
        this.isOpen = true;
        
        // Show loading state
        this.showLoading();
        
        // Show overlay
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Load content after a small delay for smooth animation
        setTimeout(() => {
            this.loadPopupContent(type);
        }, 200);
    }
    
    closePopup() {
        if (!this.overlay || !this.isOpen) return;
        
        this.isOpen = false;
        this.activePopup = null;
        
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear content after animation
        setTimeout(() => {
            if (this.content) {
                this.content.innerHTML = '';
            }
        }, 400);
    }
    
    showLoading() {
        if (!this.content) return;
        
        this.content.innerHTML = `
            <div class="popup-loading">
                <div class="popup-loading-spinner"></div>
                <p class="popup-loading-text">Loading...</p>
            </div>
        `;
    }
    
    loadPopupContent(type) {
        if (!this.content) return;
        
        const contentData = this.getPopupContent(type);
        if (!contentData) {
            this.closePopup();
            return;
        }
        
        this.content.innerHTML = contentData.html;
        this.content.className = `popup-content ${contentData.className || ''}`;
        
        // Bind any additional events for this popup
        this.bindPopupSpecificEvents(type);
    }
    
    bindPopupSpecificEvents(type) {
        // Handle phone number clicks
        const phoneLinks = this.content.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track phone click analytics if needed
                console.log('Phone number clicked from popup:', type);
            });
        });
        
        // Handle email clicks
        const emailLinks = this.content.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track email click analytics if needed
                console.log('Email clicked from popup:', type);
            });
        });
        
        // Handle form submissions if any
        const forms = this.content.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form, type);
            });
        });
    }
    
    handleFormSubmission(form, type) {
        // Handle form submission based on type
        console.log('Form submitted from popup:', type);
        
        // Show success message
        const formData = new FormData(form);
        this.showSuccessMessage(type);
    }
    
    showSuccessMessage(type) {
        if (!this.content) return;
        
        this.content.innerHTML = `
            <div class="popup-header">
                <div class="popup-icon">
                    <i class="ri-check-line"></i>
                </div>
                <h2 class="popup-title">Thank You!</h2>
                <p class="popup-subtitle">We've received your message and will get back to you within 24 hours.</p>
            </div>
            <div class="popup-body">
                <p>Our team at Holistic Psychological Services is committed to providing you with the best possible care. We look forward to helping you on your wellness journey.</p>
            </div>
            <div class="popup-actions">
                <button class="popup-btn popup-btn-primary" onclick="window.popupSystem.closePopup()">
                    <i class="ri-close-line"></i>
                    <span>Close</span>
                </button>
            </div>
        `;
    }
    
    getPopupContent(type) {
        const contentMap = {
            'consultation': {
                className: 'popup-content-consultation',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-calendar-check-line"></i>
                        </div>
                        <h2 class="popup-title">Schedule Your Consultation</h2>
                        <p class="popup-subtitle">Take the first step towards mental wellness</p>
                    </div>
                    <div class="popup-body">
                        <p>Ready to begin your journey to better mental health? Our experienced team is here to help you every step of the way.</p>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">What to Expect:</h4>
                            <ul>
                                <li>Confidential and compassionate consultation</li>
                                <li>Personalized treatment recommendations</li>
                                <li>Flexible scheduling options</li>
                                <li>Insurance and payment plan assistance</li>
                            </ul>
                        </div>
                        
                        <div class="popup-stats">
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">98%</span>
                                <span class="popup-stat-label">Client Satisfaction</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">15+</span>
                                <span class="popup-stat-label">Years Experience</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">5000+</span>
                                <span class="popup-stat-label">Lives Helped</span>
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-primary">
                            <i class="ri-phone-line"></i>
                            <span>Call (646) 971-7325</span>
                        </a>
                        <a href="mailto:info@holisticpsychservices.com" class="popup-btn popup-btn-secondary">
                            <i class="ri-mail-line"></i>
                            <span>Email Us</span>
                        </a>
                    </div>
                `
            },
            
            'profile-kristie': {
                className: 'popup-content-profile',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-user-heart-line"></i>
                        </div>
                        <h2 class="popup-title">Dr. Kristie Doheny, PsyD</h2>
                        <p class="popup-subtitle">Licensed Clinical Psychologist & Clinical Director</p>
                    </div>
                    <div class="popup-body">
                        <p><strong>Dr. Kristie Doheny</strong> is a licensed clinical psychologist with over 15 years of experience specializing in comprehensive psychological evaluations and treatment for children, adolescents, and families.</p>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Specializations:</h4>
                            <ul>
                                <li>Child and Adolescent Psychology</li>
                                <li>Family Therapy and Counseling</li>
                                <li>ADHD Assessment and Treatment</li>
                                <li>Learning Disabilities Evaluation</li>
                                <li>Behavioral and Emotional Disorders</li>
                                <li>Trauma-Informed Care</li>
                            </ul>
                        </div>
                        
                        <p>Dr. Doheny believes in creating a safe, nurturing environment where individuals and families can explore their challenges and develop effective coping strategies. Her holistic approach combines evidence-based treatments with compassionate care.</p>
                        
                        <div class="popup-stats">
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">15+</span>
                                <span class="popup-stat-label">Years Experience</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">5000+</span>
                                <span class="popup-stat-label">Families Helped</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">98%</span>
                                <span class="popup-stat-label">Success Rate</span>
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-primary">
                            <i class="ri-calendar-line"></i>
                            <span>Schedule with Dr. Doheny</span>
                        </a>
                        <button class="popup-btn popup-btn-secondary" onclick="window.popupSystem.openPopup('consultation')">
                            <i class="ri-question-line"></i>
                            <span>Learn More</span>
                        </button>
                    </div>
                `
            },
            
            'profile-doug': {
                className: 'popup-content-profile',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-heart-pulse-line"></i>
                        </div>
                        <h2 class="popup-title">Dr. Douglas Uhlig, PhD</h2>
                        <p class="popup-subtitle">Licensed Psychologist & Relationship Specialist</p>
                    </div>
                    <div class="popup-body">
                        <p><strong>Dr. Douglas Uhlig</strong> brings over 20 years of expertise in couples therapy and addiction recovery. His evidence-based approach combined with genuine compassion has helped countless individuals and couples rebuild their lives.</p>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Specializations:</h4>
                            <ul>
                                <li>Couples and Marriage Therapy</li>
                                <li>Addiction Recovery and Treatment</li>
                                <li>Trauma Recovery and PTSD</li>
                                <li>Anxiety and Depression Treatment</li>
                                <li>Relationship Counseling</li>
                                <li>Cognitive Behavioral Therapy (CBT)</li>
                            </ul>
                        </div>
                        
                        <p>Dr. Uhlig's approach focuses on creating a non-judgmental space where clients can explore their challenges and develop practical solutions. He specializes in helping couples rebuild connection and individuals overcome addiction.</p>
                        
                        <div class="popup-stats">
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">20+</span>
                                <span class="popup-stat-label">Years Experience</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">3000+</span>
                                <span class="popup-stat-label">Lives Transformed</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">95%</span>
                                <span class="popup-stat-label">Success Rate</span>
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-primary">
                            <i class="ri-calendar-line"></i>
                            <span>Schedule with Dr. Uhlig</span>
                        </a>
                        <button class="popup-btn popup-btn-secondary" onclick="window.popupSystem.openPopup('consultation')">
                            <i class="ri-question-line"></i>
                            <span>Learn More</span>
                        </button>
                    </div>
                `
            },
            
            'profile-liam': {
                className: 'popup-content-profile',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-user-smile-line"></i>
                        </div>
                        <h2 class="popup-title">Liam Miller, MHC-LP</h2>
                        <p class="popup-subtitle">Mental Health Counselor & Life Transition Specialist</p>
                    </div>
                    <div class="popup-body">
                        <p><strong>Liam Miller (he/him)</strong> believes you are the expert on your own life. He provides empathy, compassion, and unconditional positive regard to help you live authentically and navigate life's challenges.</p>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Specializations:</h4>
                            <ul>
                                <li>Life Transitions and Change</li>
                                <li>Anxiety and Depression Treatment</li>
                                <li>Personal Growth and Self-Discovery</li>
                                <li>Young Adult Counseling</li>
                                <li>Identity Exploration</li>
                                <li>Mindfulness-Based Therapy</li>
                            </ul>
                        </div>
                        
                        <p>Liam's person-centered approach creates a safe space where you can explore your authentic self without judgment. He specializes in helping individuals navigate major life transitions and develop healthy coping strategies.</p>
                        
                        <div class="popup-stats">
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">5+</span>
                                <span class="popup-stat-label">Years Experience</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">500+</span>
                                <span class="popup-stat-label">Clients Helped</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">96%</span>
                                <span class="popup-stat-label">Satisfaction Rate</span>
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-primary">
                            <i class="ri-calendar-line"></i>
                            <span>Schedule with Liam</span>
                        </a>
                        <button class="popup-btn popup-btn-secondary" onclick="window.popupSystem.openPopup('consultation')">
                            <i class="ri-question-line"></i>
                            <span>Learn More</span>
                        </button>
                    </div>
                `
            },
            
            'profile-kevin': {
                className: 'popup-content-profile',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-rainbow-line"></i>
                        </div>
                        <h2 class="popup-title">Kevin Montiel, LMSW</h2>
                        <p class="popup-subtitle">Licensed Master Social Worker & LGBTQIA+ Specialist</p>
                    </div>
                    <div class="popup-body">
                        <p><strong>Kevin Montiel (he/him)</strong> is a bilingual Licensed Master Social Worker specializing in LGBTQIA+ individuals and racial/ethnic minorities. He promotes value-driven living and authentic self-expression.</p>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Specializations:</h4>
                            <ul>
                                <li>LGBTQIA+ Affirming Therapy</li>
                                <li>Bilingual Therapy (English/Spanish)</li>
                                <li>Identity Development and Exploration</li>
                                <li>Cultural and Minority Stress</li>
                                <li>Coming Out Support</li>
                                <li>Family and Relationship Counseling</li>
                            </ul>
                        </div>
                        
                        <p>Kevin creates an inclusive, culturally sensitive environment where individuals can explore their identity and overcome challenges related to discrimination, family dynamics, and social pressures.</p>
                        
                        <div class="popup-stats">
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">7+</span>
                                <span class="popup-stat-label">Years Experience</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">800+</span>
                                <span class="popup-stat-label">Clients Served</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">97%</span>
                                <span class="popup-stat-label">Satisfaction Rate</span>
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-primary">
                            <i class="ri-calendar-line"></i>
                            <span>Schedule with Kevin</span>
                        </a>
                        <button class="popup-btn popup-btn-secondary" onclick="window.popupSystem.openPopup('consultation')">
                            <i class="ri-question-line"></i>
                            <span>Learn More</span>
                        </button>
                    </div>
                `
            },
            
            'service-depression': {
                className: 'popup-content-service',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-mental-health-line"></i>
                        </div>
                        <h2 class="popup-title">Depression & Mood Disorders</h2>
                        <p class="popup-subtitle">Evidence-based treatment for lasting relief</p>
                    </div>
                    <div class="popup-body">
                        <p>Our comprehensive approach to depression and mood disorders combines the latest evidence-based treatments with compassionate care to help you regain control of your emotional well-being.</p>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Treatment Approaches:</h4>
                            <ul>
                                <li>Cognitive Behavioral Therapy (CBT)</li>
                                <li>Dialectical Behavior Therapy (DBT)</li>
                                <li>Interpersonal Therapy (IPT)</li>
                                <li>Medication Management (when appropriate)</li>
                                <li>Mindfulness-Based Interventions</li>
                                <li>Family and Group Therapy Options</li>
                            </ul>
                        </div>
                        
                        <p>We treat major depression, bipolar disorder, seasonal affective disorder, and other mood-related challenges with personalized treatment plans designed for your unique needs.</p>
                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn popup-btn-primary" onclick="window.popupSystem.openPopup('consultation')">
                            <i class="ri-calendar-check-line"></i>
                            <span>Schedule Consultation</span>
                        </button>
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-secondary">
                            <i class="ri-phone-line"></i>
                            <span>Call Us</span>
                        </a>
                    </div>
                `
            },
            
            'service-anxiety': {
                className: 'popup-content-service',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-mind-map"></i>
                        </div>
                        <h2 class="popup-title">Anxiety Disorders</h2>
                        <p class="popup-subtitle">Comprehensive treatment for all types of anxiety</p>
                    </div>
                    <div class="popup-body">
                        <p>Our anxiety treatment program addresses generalized anxiety, panic disorders, social anxiety, and specific phobias using proven therapeutic techniques.</p>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Treatment Methods:</h4>
                            <ul>
                                <li>Exposure and Response Prevention Therapy</li>
                                <li>Cognitive Behavioral Therapy (CBT)</li>
                                <li>Mindfulness-Based Stress Reduction</li>
                                <li>Relaxation and Breathing Techniques</li>
                                <li>Systematic Desensitization</li>
                                <li>EMDR for Trauma-Related Anxiety</li>
                            </ul>
                        </div>
                        
                        <p>We help you understand your anxiety triggers, develop effective coping strategies, and gradually overcome the fears that limit your daily life.</p>
                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn popup-btn-primary" onclick="window.popupSystem.openPopup('consultation')">
                            <i class="ri-calendar-check-line"></i>
                            <span>Schedule Consultation</span>
                        </button>
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-secondary">
                            <i class="ri-phone-line"></i>
                            <span>Call Us</span>
                        </a>
                    </div>
                `
            },
            
            'team-portfolio': {
                className: 'popup-content-portfolio',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-team-line"></i>
                        </div>
                        <h2 class="popup-title">Our Complete Team</h2>
                        <p class="popup-subtitle">Meet all our mental health professionals</p>
                    </div>
                    <div class="popup-body">
                        <p>Our diverse team of licensed mental health professionals brings together decades of experience and specialized expertise to serve the Manhattan community.</p>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Our Team Includes:</h4>
                            <ul>
                                <li>Dr. Kristie Doheny - Clinical Psychologist & Director</li>
                                <li>Dr. Douglas Uhlig - Licensed Psychologist</li>
                                <li>Liam Miller - Mental Health Counselor</li>
                                <li>Kevin Montiel - Licensed Master Social Worker</li>
                                <li>Specialized Therapy Associates</li>
                                <li>Administrative Support Team</li>
                            </ul>
                        </div>
                        
                        <div class="popup-stats">
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">35+</span>
                                <span class="popup-stat-label">Combined Years</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">8000+</span>
                                <span class="popup-stat-label">Lives Helped</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">97%</span>
                                <span class="popup-stat-label">Client Satisfaction</span>
                            </div>
                        </div>
                        
                        <p>Each team member brings unique specializations and approaches, ensuring we can match you with the right therapist for your specific needs.</p>
                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn popup-btn-primary" onclick="window.popupSystem.openPopup('consultation')">
                            <i class="ri-user-search-line"></i>
                            <span>Find Your Match</span>
                        </button>
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-secondary">
                            <i class="ri-phone-line"></i>
                            <span>Speak to Our Team</span>
                        </a>
                    </div>
                `
            },
            
            'careers': {
                className: 'popup-content-consultation',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-briefcase-line"></i>
                        </div>
                        <h2 class="popup-title">Join Our Growing Practice</h2>
                        <p class="popup-subtitle">Career opportunities in Manhattan's premier mental health practice</p>
                    </div>
                    <div class="popup-body">
                        <p>We're expanding our team of compassionate mental health professionals. Join us in providing exceptional care to the Manhattan community.</p>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">What We Offer:</h4>
                            <ul>
                                <li>Competitive compensation packages</li>
                                <li>Comprehensive benefits including health insurance</li>
                                <li>Professional development opportunities</li>
                                <li>Collaborative and supportive environment</li>
                                <li>Flexible scheduling options</li>
                                <li>Manhattan office location with modern facilities</li>
                            </ul>
                        </div>
                        
                        <p>We're currently seeking licensed therapists, social workers, and mental health counselors who share our commitment to holistic, inclusive care.</p>
                        
                        <div class="popup-stats">
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">15+</span>
                                <span class="popup-stat-label">Years Established</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">100%</span>
                                <span class="popup-stat-label">Team Retention</span>
                            </div>
                            <div class="popup-stat-item">
                                <span class="popup-stat-number">5★</span>
                                <span class="popup-stat-label">Workplace Rating</span>
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <a href="mailto:careers@holisticpsychservices.com" class="popup-btn popup-btn-primary">
                            <i class="ri-mail-send-line"></i>
                            <span>Send Resume</span>
                        </a>
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-secondary">
                            <i class="ri-phone-line"></i>
                            <span>Call to Discuss</span>
                        </a>
                    </div>
                `
            },
            
            'virtual-sessions': {
                className: 'popup-content-service',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-video-chat-line"></i>
                        </div>
                        <h2 class="popup-title">Virtual Therapy Sessions</h2>
                        <p class="popup-subtitle">Professional therapy from the comfort of your home</p>
                    </div>
                    <div class="popup-body">
                        <p>Our secure, HIPAA-compliant virtual therapy platform allows you to receive the same high-quality care from anywhere in New York State.</p>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Virtual Session Benefits:</h4>
                            <ul>
                                <li>Same quality care as in-person sessions</li>
                                <li>No travel time or parking concerns</li>
                                <li>Comfortable, private environment</li>
                                <li>Flexible scheduling options</li>
                                <li>HIPAA-compliant security</li>
                                <li>Available throughout New York State</li>
                            </ul>
                        </div>
                        
                        <p>All our therapists are experienced in virtual care delivery and use evidence-based techniques adapted for online sessions.</p>
                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn popup-btn-primary" onclick="window.popupSystem.openPopup('consultation')">
                            <i class="ri-video-line"></i>
                            <span>Schedule Virtual Session</span>
                        </button>
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-secondary">
                            <i class="ri-question-line"></i>
                            <span>Learn More</span>
                        </a>
                    </div>
                `
            },
            
            'faq': {
                className: 'popup-content-portfolio',
                html: `
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="ri-question-answer-line"></i>
                        </div>
                        <h2 class="popup-title">Frequently Asked Questions</h2>
                        <p class="popup-subtitle">Common questions about our services</p>
                    </div>
                    <div class="popup-body">
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Insurance & Payment:</h4>
                            <ul>
                                <li>We accept most major insurance plans</li>
                                <li>Sliding scale fees available for self-pay</li>
                                <li>HSA/FSA accounts accepted</li>
                                <li>Payment plans can be arranged</li>
                            </ul>
                        </div>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Scheduling & Access:</h4>
                            <ul>
                                <li>Evening and weekend appointments available</li>
                                <li>Both in-person and virtual sessions offered</li>
                                <li>24-48 hour response time for new appointments</li>
                                <li>Crisis support resources available</li>
                            </ul>
                        </div>
                        
                        <div class="popup-highlight-box">
                            <h4 style="margin-bottom: 12px; color: white;">Treatment Approach:</h4>
                            <ul>
                                <li>Evidence-based therapeutic methods</li>
                                <li>Culturally sensitive and inclusive care</li>
                                <li>LGBTQ+ affirming practice</li>
                                <li>Holistic mind-body approach</li>
                            </ul>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn popup-btn-primary" onclick="window.popupSystem.openPopup('consultation')">
                            <i class="ri-calendar-check-line"></i>
                            <span>Get Started</span>
                        </button>
                        <a href="tel:(646)971-7325" class="popup-btn popup-btn-secondary">
                            <i class="ri-phone-line"></i>
                            <span>Ask Questions</span>
                        </a>
                    </div>
                `
            }
        };
        
        // Add more service popups
        const serviceTypes = ['service-trauma', 'service-behavioral', 'service-adhd', 'service-family', 'service-school', 'service-wellness', 'service-grief'];
        
        serviceTypes.forEach(type => {
            const serviceMap = {
                'service-trauma': {
                    icon: 'ri-shield-star-line',
                    title: 'PTSD & Trauma Recovery',
                    subtitle: 'Specialized trauma-informed care',
                    description: 'Our trauma recovery program uses specialized techniques including EMDR and trauma-focused CBT to help you heal from injury, illness, abuse, and loss-related trauma.',
                    methods: [
                        'Eye Movement Desensitization and Reprocessing (EMDR)',
                        'Trauma-Focused Cognitive Behavioral Therapy',
                        'Somatic Experiencing',
                        'Narrative Therapy',
                        'Mindfulness-Based Trauma Recovery',
                        'Group Trauma Recovery Sessions'
                    ]
                },
                'service-behavioral': {
                    icon: 'ri-user-settings-line',
                    title: 'Behavioral Health',
                    subtitle: 'Expert care for challenging behaviors',
                    description: 'We provide comprehensive behavioral health services for ODD, conduct disorders, and challenging behavioral patterns using evidence-based interventions.',
                    methods: [
                        'Applied Behavior Analysis (ABA)',
                        'Parent Management Training',
                        'Behavioral Modification Programs',
                        'Social Skills Training',
                        'Anger Management Therapy',
                        'Family Behavioral Intervention'
                    ]
                },
                'service-adhd': {
                    icon: 'ri-focus-2-line',
                    title: 'ADHD & Attention Disorders',
                    subtitle: 'Comprehensive assessment and treatment',
                    description: 'Our ADHD program provides thorough assessment and evidence-based treatment for attention deficit disorders across all age groups.',
                    methods: [
                        'Comprehensive ADHD Assessment',
                        'Cognitive Behavioral Therapy for ADHD',
                        'Executive Function Training',
                        'Medication Management Support',
                        'Academic and Workplace Accommodations',
                        'Family Education and Support'
                    ]
                },
                'service-family': {
                    icon: 'ri-home-heart-line',
                    title: 'Family Crisis Support',
                    subtitle: 'Supporting families through difficult times',
                    description: 'We help families navigate separation, divorce, and relationship challenges with compassionate family systems therapy and mediation services.',
                    methods: [
                        'Family Systems Therapy',
                        'Divorce and Separation Counseling',
                        'Child Custody Support',
                        'Blended Family Counseling',
                        'Family Mediation Services',
                        'Co-Parenting Support'
                    ]
                },
                'service-school': {
                    icon: 'ri-graduation-cap-line',
                    title: 'School & Learning Support',
                    subtitle: 'Helping students overcome academic challenges',
                    description: 'Our educational support services help students overcome academic challenges, school anxiety, and learning difficulties.',
                    methods: [
                        'Academic Coaching and Study Skills',
                        'School Anxiety Treatment',
                        'IEP and 504 Plan Support',
                        'Learning Disability Assessment',
                        'Test Anxiety Management',
                        'School Refusal Intervention'
                    ]
                },
                'service-wellness': {
                    icon: 'ri-moon-line',
                    title: 'Sleep & Eating Wellness',
                    subtitle: 'Specialized treatment for sleep and eating issues',
                    description: 'We provide comprehensive treatment for sleep disorders and eating-related challenges using holistic, evidence-based approaches.',
                    methods: [
                        'Sleep Hygiene Education',
                        'Cognitive Behavioral Therapy for Insomnia',
                        'Eating Disorder Treatment',
                        'Nutritional Counseling',
                        'Body Image Therapy',
                        'Mindful Eating Programs'
                    ]
                },
                'service-grief': {
                    icon: 'ri-heart-3-line',
                    title: 'Grief & Loss Counseling',
                    subtitle: 'Compassionate support for bereavement',
                    description: 'Our grief counseling services provide compassionate support for all forms of loss, helping you process grief and find meaning in your journey.',
                    methods: [
                        'Individual Grief Counseling',
                        'Complicated Grief Treatment',
                        'Bereavement Support Groups',
                        'Children\'s Grief Counseling',
                        'Pet Loss Support',
                        'Anniversary and Holiday Grief Support'
                    ]
                }
            };
            
            const service = serviceMap[type];
            if (service) {
                contentMap[type] = {
                    className: 'popup-content-service',
                    html: `
                        <div class="popup-header">
                            <div class="popup-icon">
                                <i class="${service.icon}"></i>
                            </div>
                            <h2 class="popup-title">${service.title}</h2>
                            <p class="popup-subtitle">${service.subtitle}</p>
                        </div>
                        <div class="popup-body">
                            <p>${service.description}</p>
                            
                            <div class="popup-highlight-box">
                                <h4 style="margin-bottom: 12px; color: white;">Treatment Methods:</h4>
                                <ul>
                                    ${service.methods.map(method => `<li>${method}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <p>Our personalized approach ensures that treatment is tailored to your unique needs and goals for optimal outcomes.</p>
                        </div>
                        <div class="popup-actions">
                            <button class="popup-btn popup-btn-primary" onclick="window.popupSystem.openPopup('consultation')">
                                <i class="ri-calendar-check-line"></i>
                                <span>Schedule Consultation</span>
                            </button>
                            <a href="tel:(646)971-7325" class="popup-btn popup-btn-secondary">
                                <i class="ri-phone-line"></i>
                                <span>Call Us</span>
                            </a>
                        </div>
                    `
                };
            }
        });
        
        return contentMap[type] || null;
    }
    
    createPopupContent() {
        // Add any additional content creation logic here if needed
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
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.setupKeyboardNavigation);
        
        console.log('Modern Team Carousel destroyed');
    }
}

/* ==========================================================================
   ELEGANT REVIEWS & INSTAGRAM SECTION
   ========================================================================== */
class ElegantReviewsInstagramSection {
    constructor() {
        // DOM Elements
        this.section = document.querySelector('.elegant-reviews-instagram-section');
        this.testimonialTrack = document.querySelector('.elegant-testimonials-track');
        this.testimonialCards = document.querySelectorAll('.elegant-testimonial-card');
        this.prevBtn = document.querySelector('.elegant-nav-prev');
        this.nextBtn = document.querySelector('.elegant-nav-next');
        this.indicators = document.querySelectorAll('.elegant-indicator');
        this.ctaButtons = document.querySelectorAll('.elegant-cta-btn');
        this.googleReviewsLink = document.querySelector('.elegant-google-reviews-link');
        this.instagramFollowBtn = document.querySelector('.elegant-instagram-follow-btn');
        this.instagramFeedContainer = document.querySelector('.elegant-instagram-feed-container');
        this.instagramLoading = document.querySelector('.elegant-instagram-loading');
        
        // Testimonials State
        this.currentIndex = 0;
        this.totalTestimonials = this.testimonialCards.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.isPlaying = true;
        this.isHovering = false;
        
        // Touch/Drag State
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.threshold = 50;
        
        // Animation State
        this.animatedElements = new Set();
        this.isInitialized = false;
        
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
        this.setupIntersectionObserver();
        this.setupTestimonialsCarousel();
        this.setupInstagramFeed();
        this.setupButtonInteractions();
        this.setupAccessibility();
        this.setupStarAnimations();
        this.isInitialized = true;
        
        console.log('Elegant Reviews & Instagram Section initialized successfully');
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                    
                    // Start auto-play when section is visible
                    if (entry.target === this.section) {
                        this.startAutoPlay();
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });
        
        // Observe elements for animation
        const elementsToObserve = [
            '.elegant-section-header',
            '.elegant-testimonials-wrapper',
            '.elegant-instagram-wrapper',
            '.elegant-bottom-cta'
        ];
        
        elementsToObserve.forEach(selector => {
            const elements = this.section.querySelectorAll(selector);
            elements.forEach(element => observer.observe(element));
        });
        
        // Observe the main section
        if (this.section) {
            observer.observe(this.section);
        }
    }
    
    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        // Animate child elements with stagger
        const childElements = element.querySelectorAll('.elegant-testimonial-card, .elegant-highlight-item');
        childElements.forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '0';
                child.style.transform = 'translateX(-20px)';
                child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateX(0)';
                });
            }, index * 100);
        });
    }
    
    setupTestimonialsCarousel() {
        if (!this.testimonialTrack || this.totalTestimonials === 0) return;
        
        // Setup event listeners
        this.setupCarouselControls();
        this.setupTouchEvents();
        this.setupHoverPause();
        
        // Initialize carousel
        this.updateCarousel();
        this.updateIndicators();
    }
    
    setupCarouselControls() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.slidePrev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.slideNext());
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
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
    
    setupTouchEvents() {
        if (!this.testimonialTrack) return;
        
        // Touch events for mobile swipe
        this.testimonialTrack.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.testimonialTrack.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.testimonialTrack.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Mouse drag events for desktop
        this.testimonialTrack.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.testimonialTrack.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.testimonialTrack.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.testimonialTrack.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Prevent context menu
        this.testimonialTrack.addEventListener('contextmenu', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        });
    }
    
    setupHoverPause() {
        const testimonialsWrapper = document.querySelector('.elegant-testimonials-wrapper');
        if (!testimonialsWrapper) return;
        
        testimonialsWrapper.addEventListener('mouseenter', () => {
            this.isHovering = true;
            this.pauseAutoPlay();
        });
        
        testimonialsWrapper.addEventListener('mouseleave', () => {
            this.isHovering = false;
            if (this.isPlaying) {
                this.startAutoPlay();
            }
        });
    }
    
    // Touch/Mouse Event Handlers
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
        
        this.resetTouch();
    }
    
    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.testimonialTrack.style.cursor = 'grabbing';
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
        this.testimonialTrack.style.cursor = '';
        
        const diff = this.startX - this.currentX;
        
        if (Math.abs(diff) > this.threshold) {
            if (diff > 0) {
                this.slideNext();
            } else {
                this.slidePrev();
            }
        }
        
        this.resetTouch();
    }
    
    resetTouch() {
        this.startX = 0;
        this.currentX = 0;
        
        if (!this.isHovering && this.isPlaying) {
            this.startAutoPlay();
        }
    }
    
    // Navigation Methods
    slidePrev() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.totalTestimonials - 1;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    slideNext() {
        this.currentIndex = this.currentIndex < this.totalTestimonials - 1 ? this.currentIndex + 1 : 0;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    updateCarousel() {
        if (!this.testimonialTrack) return;
        
        // Calculate translation
        const translateX = -(this.currentIndex * 100);
        
        // Apply translation with smooth transition
        this.testimonialTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        this.updateIndicators();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Animate current testimonial
        this.animateCurrentTestimonial();
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateNavigationButtons() {
        // Enable all buttons for infinite scroll
        if (this.prevBtn) this.prevBtn.disabled = false;
        if (this.nextBtn) this.nextBtn.disabled = false;
    }
    
    animateCurrentTestimonial() {
        this.testimonialCards.forEach((card, index) => {
            const content = card.querySelector('.elegant-testimonial-content');
            const stars = card.querySelectorAll('.elegant-rating-stars i');
            
            if (index === this.currentIndex) {
                // Animate current testimonial
                setTimeout(() => {
                    if (content) {
                        content.style.animation = 'elegantTestimonialFadeIn 0.6s ease forwards';
                    }
                    
                    // Animate stars
                    stars.forEach((star, starIndex) => {
                        star.style.setProperty('--star-index', starIndex);
                        star.style.animation = `elegantStarGlow 2s ease-in-out infinite`;
                        star.style.animationDelay = `${starIndex * 0.1}s`;
                    });
                }, 200);
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
    
    setupInstagramFeed() {
        this.monitorElfsightLoad();
        this.setupInstagramInteractions();
    }
    
    monitorElfsightLoad() {
        const checkElfsightLoad = () => {
            const elfsightWidget = this.section.querySelector('.elfsight-app-3e98e495-6739-43e0-8b40-1c3c1f597278');
            
            if (elfsightWidget && elfsightWidget.children.length > 0) {
                // Widget has loaded
                if (this.instagramLoading) {
                    this.instagramLoading.style.opacity = '0';
                    this.instagramLoading.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        this.instagramLoading.style.display = 'none';
                    }, 300);
                }
                
                // Animate the loaded feed
                elfsightWidget.style.opacity = '0';
                elfsightWidget.style.transform = 'translateY(20px)';
                elfsightWidget.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                setTimeout(() => {
                    elfsightWidget.style.opacity = '1';
                    elfsightWidget.style.transform = 'translateY(0)';
                }, 100);
                
                console.log('Instagram feed loaded successfully');
            } else {
                // Check again in 500ms
                setTimeout(checkElfsightLoad, 500);
            }
        };
        
        // Start monitoring after a delay
        setTimeout(checkElfsightLoad, 1000);
    }
    
    setupInstagramInteractions() {
        // Instagram follow button
        if (this.instagramFollowBtn) {
            this.instagramFollowBtn.addEventListener('mouseenter', () => {
                this.instagramFollowBtn.style.transform = 'translateY(-2px) scale(1.05)';
                this.instagramFollowBtn.style.boxShadow = '0 15px 35px rgba(131, 58, 180, 0.4)';
            });
            
            this.instagramFollowBtn.addEventListener('mouseleave', () => {
                this.instagramFollowBtn.style.transform = '';
                this.instagramFollowBtn.style.boxShadow = '';
            });
            
            this.instagramFollowBtn.addEventListener('click', (e) => {
                this.createRippleEffect(e, this.instagramFollowBtn);
            });
        }
        
        // Instagram highlights
        const highlightItems = this.section.querySelectorAll('.elegant-highlight-item');
        highlightItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.animation = 'elegantIconBounce 0.6s ease';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
    }
    
    setupButtonInteractions() {
        // CTA buttons
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
            
            button.addEventListener('mouseenter', () => {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.style.animation = 'elegantIconBounce 0.6s ease';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
        
        // Google reviews link
        if (this.googleReviewsLink) {
            this.googleReviewsLink.addEventListener('mouseenter', () => {
                this.googleReviewsLink.style.transform = 'translateY(-2px)';
                const arrow = this.googleReviewsLink.querySelector('i[class*="external"]');
                if (arrow) {
                    arrow.style.transform = 'scale(1.2)';
                }
            });
            
            this.googleReviewsLink.addEventListener('mouseleave', () => {
                this.googleReviewsLink.style.transform = '';
                const arrow = this.googleReviewsLink.querySelector('i[class*="external"]');
                if (arrow) {
                    arrow.style.transform = '';
                }
            });
        }
    }
    
    setupStarAnimations() {
        // Set CSS custom properties for star animation delays
        this.testimonialCards.forEach(card => {
            const stars = card.querySelectorAll('.elegant-rating-stars i');
            stars.forEach((star, index) => {
                star.style.setProperty('--star-index', index);
            });
        });
    }
    
    setupAccessibility() {
        // Add ARIA labels and keyboard support
        this.indicators.forEach((indicator, index) => {
            indicator.setAttribute('role', 'button');
            indicator.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            indicator.setAttribute('tabindex', '0');
            
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                }
            });
        });
        
        // Navigation buttons accessibility
        if (this.prevBtn) {
            this.prevBtn.setAttribute('aria-label', 'Previous testimonial');
        }
        
        if (this.nextBtn) {
            this.nextBtn.setAttribute('aria-label', 'Next testimonial');
        }
    }
    
    createRippleEffect(event, element) {
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
            animation: elegantRipple 0.6s ease-out;
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
    
    // Public methods for external control
    getCurrentSlide() {
        return this.currentIndex;
    }
    
    getTotalSlides() {
        return this.totalTestimonials;
    }
    
    setAutoPlayDelay(delay) {
        this.autoPlayDelay = delay;
        this.resetAutoPlay();
    }
    
    // Cleanup method
    destroy() {
        this.pauseAutoPlay();
        this.animatedElements.clear();
        this.isInitialized = false;
        
        // Remove event listeners
        document.removeEventListener('keydown', this.setupCarouselControls);
        
        console.log('Elegant Reviews & Instagram Section destroyed');
    }
}

/* ==========================================================================
   HOLISTIC CONTACT SECTION
   ========================================================================== */
class HolisticContactSection {
    constructor() {
        // DOM Elements
        this.section = document.querySelector('.holistic-contact-section');
        this.methodCards = document.querySelectorAll('.holistic-method-card');
        this.optionCards = document.querySelectorAll('.holistic-option-card');
        this.ctaButtons = document.querySelectorAll('.holistic-cta-button');
        this.optionButtons = document.querySelectorAll('.holistic-option-button');
        this.emergencyButton = document.querySelector('.holistic-emergency-button');
        
        // Animation state
        this.animatedElements = new Set();
        this.isInitialized = false;
        
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
        this.setupIntersectionObserver();
        this.setupCardInteractions();
        this.setupButtonEffects();
        this.setupElfsightMonitoring();
        this.setupAccessibility();
        this.isInitialized = true;
        
        console.log('Holistic Contact Section initialized successfully');
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
        
        // Observe elements for animation
        const elementsToObserve = [
            '.holistic-contact-header',
            '.holistic-info-wrapper',
            '.holistic-form-wrapper',
            '.holistic-contact-options',
            '.holistic-bottom-cta'
        ];
        
        elementsToObserve.forEach(selector => {
            const elements = this.section.querySelectorAll(selector);
            elements.forEach(element => observer.observe(element));
        });
    }
    
    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        // Animate child elements with stagger
        const childElements = element.querySelectorAll('.holistic-method-card, .holistic-option-card');
        childElements.forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '0';
                child.style.transform = 'translateX(-20px)';
                child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateX(0)';
                });
            }, index * 100);
        });
    }
    
    setupCardInteractions() {
        // Method cards hover effects
        this.methodCards.forEach(card => {
            const icon = card.querySelector('.holistic-method-icon');
            const link = card.querySelector('.holistic-method-link');
            
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.background = '#00d884';
                    icon.style.color = 'white';
                }
                
                if (link) {
                    link.style.gap = '10px';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (icon) {
                    icon.style.transform = '';
                    icon.style.background = '';
                    icon.style.color = '';
                }
                
                if (link) {
                    link.style.gap = '';
                }
            });
            
            // Click handler for entire card
            card.addEventListener('click', (e) => {
                if (link && !e.target.closest('a')) {
                    link.click();
                }
            });
        });
        
        // Option cards interactions
        this.optionCards.forEach(card => {
            const icon = card.querySelector('.holistic-option-icon');
            const button = card.querySelector('.holistic-option-button');
            
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(-5deg)';
                }
                
                this.animateCardElements(card);
            });
            
            card.addEventListener('mouseleave', () => {
                if (icon) {
                    icon.style.transform = '';
                }
                
                this.resetCardElements(card);
            });
            
            // Click handler for entire card
            card.addEventListener('click', (e) => {
                if (button && !e.target.closest('a')) {
                    button.click();
                }
            });
        });
    }
    
    animateCardElements(card) {
        const title = card.querySelector('.holistic-option-title');
        const desc = card.querySelector('.holistic-option-desc');
        
        if (title) {
            title.style.transform = 'translateY(-2px)';
            title.style.color = '#00d884';
        }
        
        if (desc) {
            desc.style.transform = 'translateY(-1px)';
        }
    }
    
    resetCardElements(card) {
        const title = card.querySelector('.holistic-option-title');
        const desc = card.querySelector('.holistic-option-desc');
        
        if (title) {
            title.style.transform = '';
            title.style.color = '';
        }
        
        if (desc) {
            desc.style.transform = '';
        }
    }
    
    setupButtonEffects() {
        // CTA buttons
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
            
            button.addEventListener('mouseenter', () => {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.style.animation = 'holisticIconBounce 0.6s ease';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
        
        // Option buttons
        this.optionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
            
            button.addEventListener('mouseenter', () => {
                const arrows = button.querySelectorAll('i[class*="arrow"]');
                arrows.forEach(arrow => {
                    arrow.style.transform = 'translateX(3px)';
                });
            });
            
            button.addEventListener('mouseleave', () => {
                const arrows = button.querySelectorAll('i[class*="arrow"]');
                arrows.forEach(arrow => {
                    arrow.style.transform = '';
                });
            });
        });
        
        // Emergency button special effects
        if (this.emergencyButton) {
            this.emergencyButton.addEventListener('mouseenter', () => {
                this.emergencyButton.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)';
            });
            
            this.emergencyButton.addEventListener('mouseleave', () => {
                this.emergencyButton.style.boxShadow = '';
            });
        }
    }
    
    createRippleEffect(event, element) {
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
            animation: holisticRipple 0.6s ease-out;
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
    
    setupElfsightMonitoring() {
        // Monitor Elfsight widget loading
        const checkElfsightLoad = () => {
            const elfsightWidget = this.section.querySelector('.elfsight-app-b3fedd1c-0470-46b1-b970-3fcc261b0bbb');
            const container = this.section.querySelector('.holistic-elfsight-container');
            
            if (elfsightWidget && elfsightWidget.children.length > 0) {
                // Widget has loaded
                if (container) {
                    container.style.background = 'transparent';
                    container.style.minHeight = 'auto';
                }
                
                // Add loaded class for additional styling
                elfsightWidget.classList.add('holistic-elfsight-loaded');
                
                // Animate the loaded form
                setTimeout(() => {
                    elfsightWidget.style.opacity = '0';
                    elfsightWidget.style.transform = 'translateY(20px)';
                    elfsightWidget.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    requestAnimationFrame(() => {
                        elfsightWidget.style.opacity = '1';
                        elfsightWidget.style.transform = 'translateY(0)';
                    });
                }, 100);
                
                console.log('Contact form loaded successfully');
            } else {
                // Check again in 500ms
                setTimeout(checkElfsightLoad, 500);
            }
        };
        
        // Start monitoring after a delay
        setTimeout(checkElfsightLoad, 1000);
    }
    
    setupAccessibility() {
        // Add keyboard navigation for cards
        [...this.methodCards, ...this.optionCards].forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
            
            // Focus styles
            card.addEventListener('focus', () => {
                card.style.outline = '2px solid #00d884';
                card.style.outlineOffset = '2px';
            });
            
            card.addEventListener('blur', () => {
                card.style.outline = '';
                card.style.outlineOffset = '';
            });
        });
        
        // Enhanced focus states for buttons
        [...this.ctaButtons, ...this.optionButtons].forEach(button => {
            button.addEventListener('focus', () => {
                button.style.boxShadow = '0 0 0 3px rgba(0, 216, 132, 0.3)';
            });
            
            button.addEventListener('blur', () => {
                button.style.boxShadow = '';
            });
        });
    }
    
    // Public methods for external control
    animateSection() {
        if (this.section && !this.animatedElements.has(this.section)) {
            this.animateElement(this.section);
            this.animatedElements.add(this.section);
        }
    }
    
    resetAnimations() {
        this.animatedElements.clear();
        
        // Reset all animated elements
        const elements = this.section.querySelectorAll('[style*="opacity"], [style*="transform"]');
        elements.forEach(element => {
            element.style.opacity = '';
            element.style.transform = '';
            element.style.transition = '';
        });
    }
    
    // Cleanup method
    destroy() {
        // Remove event listeners and cleanup
        this.animatedElements.clear();
        this.isInitialized = false;
        
        console.log('Holistic Contact Section destroyed');
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
    
    // Make popup system available globally
    window.popupSystem = app.popupSystem;
    
    console.log('Holistic Psychological Services app initialized successfully');
    
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
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes holisticRipple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes holisticIconBounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-3px) scale(1.1); }
        }
        
        @keyframes teamRipple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes teamIconBounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-3px) scale(1.1); }
        }
        
        @keyframes teamHeaderFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes elegantRipple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes elegantTestimonialFadeIn {
            from {
                opacity: 0.7;
                transform: translateY(10px) scale(0.98);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes elegantIconBounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-4px) scale(1.1); }
        }
        
        @keyframes elegantStarGlow {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Back to top button */
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #00d884, #0ea5e9);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            box-shadow: 0 8px 25px rgba(0, 216, 132, 0.3);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(0, 216, 132, 0.4);
        }
    `;
    document.head.appendChild(style);
});
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

/* ==========================================================================
   COMPACT ABOUT SECTION
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

/* ==========================================================================
   MODERN TEAM CAROUSEL
   ========================================================================== */
class ModernTeamCarousel {
    constructor() {
        // DOM Elements
        this.section = document.querySelector('.modern-team-section');
        this.slider = document.querySelector('.team-carousel-slider');
        this.cards = document.querySelectorAll('.modern-team-card');
        this.prevBtn = document.querySelector('.team-prev-btn');
        this.nextBtn = document.querySelector('.team-next-btn');
        this.dots = document.querySelectorAll('.team-dot');
        this.progressIndicator = document.querySelector('.team-progress-indicator');
        this.viewport = document.querySelector('.team-carousel-viewport');
        
        // Carousel State
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.totalCards = this.cards.length;
        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000;
        this.isPlaying = true;
        this.isHovering = false;
        
        // Touch/Drag State
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.threshold = 50;
        this.initialTranslate = 0;
        
        // Initialize
        this.init();
    }
    
    init() {
        if (!this.section || !this.slider || this.totalCards === 0) return;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup intersection observer
        this.setupIntersectionObserver();
        
        // Initialize carousel
        this.updateCarousel();
        
        // Start auto-play
        this.startAutoPlay();
        
        // Setup card interactions
        this.setupCardInteractions();
        
        console.log('Modern Team Carousel initialized successfully');
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
        if (this.viewport) {
            this.viewport.addEventListener('mouseenter', () => this.handleMouseEnter());
            this.viewport.addEventListener('mouseleave', () => this.handleMouseLeave());
        }
        
        // Touch/Swipe events
        this.setupTouchEvents();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupTouchEvents() {
        if (!this.viewport) return;
        
        // Touch events
        this.viewport.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.viewport.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.viewport.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Mouse events for desktop dragging
        this.viewport.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.viewport.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.viewport.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.viewport.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Prevent context menu on long press
        this.viewport.addEventListener('contextmenu', (e) => {
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
            
            // Card click handling
            card.addEventListener('click', (e) => {
                // Don't trigger if dragging
                if (Math.abs(this.startX - this.currentX) > 5) {
                    e.preventDefault();
                    return;
                }
            });
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => this.enhanceCardHover(card));
            card.addEventListener('mouseleave', () => this.resetCardHover(card));
            
            // Specialty item interactions
            const specialties = card.querySelectorAll('.specialty-item');
            specialties.forEach(specialty => {
                specialty.addEventListener('mouseenter', () => {
                    specialty.style.transform = 'translateY(-2px) scale(1.05)';
                    specialty.style.boxShadow = '0 6px 15px rgba(0, 216, 132, 0.2)';
                });
                
                specialty.addEventListener('mouseleave', () => {
                    specialty.style.transform = '';
                    specialty.style.boxShadow = '';
                });
            });
            
            // Profile button interactions
            const profileBtn = card.querySelector('.member-profile-btn, .join-team-btn');
            if (profileBtn) {
                profileBtn.addEventListener('click', (e) => {
                    this.createRipple(e, profileBtn);
                });
            }
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
        this.initialTranslate = this.getCurrentTranslate();
        this.viewport.style.cursor = 'grabbing';
        this.slider.style.transition = 'none';
        this.pauseAutoPlay();
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.clientX;
        const deltaX = this.currentX - this.startX;
        const newTranslate = this.initialTranslate + deltaX;
        
        this.slider.style.transform = `translateX(${newTranslate}px)`;
    }
    
    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.viewport.style.cursor = '';
        this.slider.style.transition = '';
        
        const diff = this.startX - this.currentX;
        
        if (Math.abs(diff) > this.threshold) {
            if (diff > 0) {
                this.slideNext();
            } else {
                this.slidePrev();
            }
        } else {
            this.updateCarousel();
        }
        
        this.startX = 0;
        this.currentX = 0;
        
        if (!this.isHovering) {
            this.startAutoPlay();
        }
    }
    
    getCurrentTranslate() {
        const style = window.getComputedStyle(this.slider);
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
        if (!this.slider) return;
        
        // Calculate translation
        const cardWidth = this.cards[0]?.offsetWidth || 0;
        const gap = 30; // Gap between cards
        const translateX = -(this.currentIndex * (cardWidth + gap));
        
        // Apply translation
        this.slider.style.transform = `translateX(${translateX}px)`;
        
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
        if (!this.progressIndicator) return;
        
        const progress = ((this.currentIndex + 1) / (this.maxIndex + 1)) * 100;
        this.progressIndicator.style.width = `${Math.min(100, Math.max(20, progress))}%`;
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
        const header = this.section.querySelector('.modern-team-header');
        if (header) {
            header.style.animation = 'teamHeaderFadeIn 0.8s ease';
        }
        
        // Animate controls
        const controls = this.section.querySelector('.team-carousel-controls');
        if (controls) {
            setTimeout(() => {
                controls.style.animation = 'teamHeaderFadeIn 0.8s ease';
            }, 200);
        }
        
        // Animate visible cards with stagger
        this.animateVisibleCards();
    }
    
    enhanceCardHover(card) {
        const photo = card.querySelector('.team-member-photo');
        if (photo) {
            photo.style.transform = 'scale(1.05)';
        }
        
        const status = card.querySelector('.team-member-status');
        if (status) {
            status.style.transform = 'scale(1.05)';
            status.style.background = 'rgba(0, 216, 132, 0.15)';
        }
        
        const badges = card.querySelectorAll('.title-badge');
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.style.transform = 'translateY(-2px) scale(1.05)';
            }, index * 50);
        });
    }
    
    resetCardHover(card) {
        const photo = card.querySelector('.team-member-photo');
        if (photo) {
            photo.style.transform = '';
        }
        
        const status = card.querySelector('.team-member-status');
        if (status) {
            status.style.transform = '';
            status.style.background = '';
        }
        
        const badges = card.querySelectorAll('.title-badge');
        badges.forEach(badge => {
            badge.style.transform = '';
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
    
    // Responsive Methods
    getCardsPerView() {
        const width = window.innerWidth;
        
        if (width > 1200) {
            return 3;
        } else if (width > 767) {
