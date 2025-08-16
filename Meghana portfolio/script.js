// Performance optimized JavaScript with modern features

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Throttle function for performance
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Mobile Navigation
class Navigation {
    constructor() {
        this.hamburger = $('.hamburger');
        this.navMenu = $('.nav-menu');
        this.navLinks = $$('.nav-menu a');
        this.init();
    }

    init() {
        this.hamburger?.addEventListener('click', () => this.toggleMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Smooth scrolling with offset for fixed navbar
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = $(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Enhanced navbar with scroll effects
class NavbarEffects {
    constructor() {
        this.navbar = $('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', throttle(() => {
            this.updateNavbar();
            this.updateActiveLink();
        }, 16));
    }

    updateNavbar() {
        const scrollY = window.scrollY;
        if (scrollY > 100) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            this.navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.boxShadow = 'none';
        }
    }

    updateActiveLink() {
        const sections = $$('section[id]');
        const navLinks = $$('.nav-menu a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Animate stats counter
                    if (entry.target.classList.contains('stat')) {
                        this.animateCounter(entry.target);
                    }
                    
                    // Animate skill bars
                    if (entry.target.classList.contains('skill-item')) {
                        this.animateSkillBar(entry.target);
                    }
                }
            });
        }, this.options);

        // Observe elements
        $$('.project-card, .skill-category, .timeline-item, .stat').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    animateCounter(element) {
        const target = parseFloat(element.dataset.count) || 0;
        const h3 = element.querySelector('h3');
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            h3.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(2);
            if (target >= 10) h3.textContent += '+';
        }, 30);
    }

    animateSkillBar(element) {
        const level = element.dataset.level || 0;
        element.style.setProperty('--level', `${level}%`);
    }
}

// Enhanced contact form
class ContactForm {
    constructor() {
        this.form = $('.contact-form');
        this.init();
    }

    init() {
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input validation
        $$('.contact-form input, .contact-form textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        if (!value) {
            this.showError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !this.isValidEmail(value)) {
            this.showError(field, 'Please enter a valid email');
            isValid = false;
        }
        
        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showError(field, message) {
        field.style.borderColor = '#e74c3c';
        let errorEl = field.nextElementSibling;
        if (!errorEl || !errorEl.classList.contains('error-message')) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.style.color = '#e74c3c';
            errorEl.style.fontSize = '0.8rem';
            errorEl.style.marginTop = '0.25rem';
            field.parentNode.insertBefore(errorEl, field.nextSibling);
        }
        errorEl.textContent = message;
    }

    clearError(field) {
        field.style.borderColor = '#e9ecef';
        const errorEl = field.nextElementSibling;
        if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.remove();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const inputs = $$('.contact-form input, .contact-form textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            this.showSuccess();
            this.form.reset();
        }
    }

    showSuccess() {
        const button = $('.contact-form button');
        const originalText = button.textContent;
        
        button.textContent = 'Message Sent!';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
    }
}

// Typing effect for hero
class TypingEffect {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.i = 0;
    }

    start() {
        this.element.innerHTML = '';
        this.type();
    }

    type() {
        if (this.i < this.text.length) {
            this.element.innerHTML += this.text.charAt(this.i);
            this.i++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Scroll indicator
class ScrollIndicator {
    constructor() {
        this.indicator = $('.scroll-indicator');
        this.init();
    }

    init() {
        this.indicator?.addEventListener('click', () => {
            $('#about').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Parallax effect for hero background
class ParallaxEffect {
    constructor() {
        this.heroBg = $('.hero-bg');
        this.init();
    }

    init() {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            if (this.heroBg) {
                this.heroBg.style.transform = `translateY(${rate}px)`;
            }
        }, 16));
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    new SmoothScroll();
    new NavbarEffects();
    new AnimationObserver();
    new ContactForm();
    new ScrollIndicator();
    new ParallaxEffect();
    
    // Initialize typing effect
    setTimeout(() => {
        const heroSubtitle = $('.hero-subtitle');
        if (heroSubtitle) {
            const originalText = heroSubtitle.textContent;
            const typingEffect = new TypingEffect(heroSubtitle, originalText, 100);
            typingEffect.start();
        }
    }, 1000);
});

// Preloader (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});