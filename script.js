// NAVIGATION SCRIPT
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const footer = document.getElementById('footer');

    function showSection(sectionId) {
        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Hide footer on admin page
        if (sectionId === 'admin') {
            footer.style.display = 'none';
        } else {
            footer.style.display = 'block';
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
            history.pushState(null, null, `#${sectionId}`);
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const sectionId = location.hash.substring(1) || 'home';
        showSection(sectionId);
    });

    // Handle initial load
    const initialSection = location.hash.substring(1) || 'home';
    showSection(initialSection);
}

// CAROUSEL SCRIPT
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    // Start auto slide
    startAutoSlide();
}

// LOCALSTORAGE MANAGEMENT
function initLocalStorage() {
    const defaultData = {
        whatsapp: '+1 (555) 012-3456',
        phone: '+1 (555) 012-3456',
        email: 'info@goodlookpouch.com',
        address: '123 Industrial Drive\nManufacturing City, State 12345',
        facebook: 'https://facebook.com/goodlookpouch',
        instagram: 'https://instagram.com/goodlookpouch',
        linkedin: 'https://linkedin.com/company/goodlookpouch',
        youtube: 'https://youtube.com/@goodlookpouch',
        footerMessage: 'Premium pouch manufacturing with zero setup costs and fast turnaround.',
        footerCopyright: '© 2026 GoodLook Pouch. All rights reserved.'
    };

    // Load data from localStorage or use defaults
    function loadData() {
        const data = {};
        Object.keys(defaultData).forEach(key => {
            data[key] = localStorage.getItem(key) || defaultData[key];
        });
        return data;
    }

    // Save data to localStorage
    function saveData(key, value) {
        localStorage.setItem(key, value);
    }

    // Update UI with loaded data
    function updateUI() {
        const data = loadData();

        // Update contact buttons
        document.getElementById('whatsapp-btn').href = `https://wa.me/${data.whatsapp.replace(/\D/g, '')}`;
        document.getElementById('call-btn').href = `tel:${data.phone}`;

        // Update contact page
        document.getElementById('contact-address').textContent = data.address;
        document.getElementById('contact-whatsapp').textContent = data.whatsapp;
        document.getElementById('contact-phone').textContent = data.phone;
        document.getElementById('contact-email').textContent = data.email;

        // Update footer
        document.getElementById('footer-message').textContent = data.footerMessage;
        document.getElementById('footer-address').innerHTML = data.address.replace('\n', '<br>');
        document.getElementById('footer-phone').textContent = data.phone;
        document.getElementById('footer-email').textContent = data.email;
        document.getElementById('footer-copyright').textContent = data.footerCopyright;

        // Update social links
        document.getElementById('footer-facebook').href = data.facebook;
        document.getElementById('footer-instagram').href = data.instagram;
        document.getElementById('footer-linkedin').href = data.linkedin;
        document.getElementById('footer-youtube').href = data.youtube;
    }

    // Initialize admin form with current data
    function initAdminForm() {
        const data = loadData();
        document.getElementById('admin-whatsapp').value = data.whatsapp;
        document.getElementById('admin-phone').value = data.phone;
        document.getElementById('admin-email').value = data.email;
        document.getElementById('admin-address').value = data.address;
        document.getElementById('admin-facebook').value = data.facebook;
        document.getElementById('admin-instagram').value = data.instagram;
        document.getElementById('admin-linkedin').value = data.linkedin;
        document.getElementById('admin-youtube').value = data.youtube;
        document.getElementById('admin-footer-message').value = data.footerMessage;
    }

    return {
        loadData,
        saveData,
        updateUI,
        initAdminForm
    };
}

// ADMIN SCRIPT
function initAdmin() {
    const loginForm = document.getElementById('login-form');
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');
    const saveBtn = document.getElementById('save-settings');
    const logoutBtn = document.getElementById('logout-btn');
    const storage = initLocalStorage();

    // Password is base64 encoded: "glp@2025" -> "Z2xwQDIwMjU="
    const correctPassword = 'Z2xwQDIwMjU=';

    // Check if admin is logged in
    function checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        if (isLoggedIn) {
            adminLogin.style.display = 'none';
            adminDashboard.classList.add('active');
            storage.initAdminForm();
        } else {
            adminLogin.style.display = 'block';
            adminDashboard.classList.remove('active');
        }
    }

    // Login handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = btoa(document.getElementById('password').value); // Encode password

        if (username === 'admin' && password === correctPassword) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            checkLoginStatus();
            // Clear form
            loginForm.reset();
        } else {
            alert('Invalid username or password');
        }
    });

    // Save settings
    saveBtn.addEventListener('click', () => {
        const data = {
            whatsapp: document.getElementById('admin-whatsapp').value,
            phone: document.getElementById('admin-phone').value,
            email: document.getElementById('admin-email').value,
            address: document.getElementById('admin-address').value,
            facebook: document.getElementById('admin-facebook').value,
            instagram: document.getElementById('admin-instagram').value,
            linkedin: document.getElementById('admin-linkedin').value,
            youtube: document.getElementById('admin-youtube').value,
            footerMessage: document.getElementById('admin-footer-message').value
        };

        // Save to localStorage
        Object.keys(data).forEach(key => {
            storage.saveData(key, data[key]);
        });

        // Update UI
        storage.updateUI();

        alert('Settings saved successfully!');
    });

    // Logout handler
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        checkLoginStatus();
        // Redirect to home
        window.location.hash = '#home';
    });

    // Initialize
    checkLoginStatus();
}

// KEYBOARD NAVIGATION
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape key to close admin or go home
        if (e.key === 'Escape') {
            const currentHash = location.hash.substring(1);
            if (currentHash === 'admin') {
                window.location.hash = '#home';
            }
        }

        // Tab navigation for carousel (when focused)
        const carousel = document.querySelector('.hero-carousel');
        if (document.activeElement.closest('.hero-carousel')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                document.querySelector('.carousel-prev').click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                document.querySelector('.carousel-next').click();
            }
        }
    });
}

// FAQ FUNCTIONALITY
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ENHANCED CUSTOMER EXPERIENCE FEATURES
function initEnhancedUX() {
    // Reading Progress Bar
    const progressBar = document.querySelector('.progress-bar');
    const readingProgress = document.querySelector('.reading-progress');

    function updateProgressBar() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (progressBar) progressBar.style.width = scrollPercent + '%';

        // Show/hide progress bar based on scroll position
        if (readingProgress) {
            if (scrollTop > 100) {
                readingProgress.classList.add('visible');
            } else {
                readingProgress.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();

    // Scroll to Top Button
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    function toggleScrollToTop() {
        if (scrollToTopBtn) {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    if (scrollToTopBtn) {
        window.addEventListener('scroll', toggleScrollToTop);
        scrollToTopBtn.addEventListener('click', scrollToTop);
    }

    // Interactive Tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'interactive-tooltip';
        tooltip.textContent = element.dataset.tooltip;
        document.body.appendChild(tooltip);

        element.addEventListener('mouseenter', (e) => {
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) + 'px';
            tooltip.style.top = rect.top - 40 + 'px';
            tooltip.classList.add('visible');
        });

        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });


    // Cookie Consent Banner
    const cookieConsent = document.querySelector('.cookie-consent');
    const cookieAccept = document.querySelector('.cookie-accept');
    const cookieDecline = document.querySelector('.cookie-decline');

    // Check if user has already made a choice
    if (cookieConsent && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieConsent.style.display = 'block';
        }, 2000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            if (cookieConsent) cookieConsent.style.display = 'none';
            showNotification('Cookies accepted! 🎉', 'success');
        });
    }

    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            if (cookieConsent) cookieConsent.style.display = 'none';
            showNotification('Only essential cookies will be used.', 'info');
        });
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">×</button>
        `;

        notificationContainer.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Enhanced button interactions
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            // Add loading state
            this.classList.add('loading');

            // Remove loading state after animation
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);

            // Show success message for demo
            if (this.classList.contains('cta-primary')) {
                setTimeout(() => {
                    showNotification('Thanks for your interest! Our team will contact you within 1 hour.', 'success');
                }, 500);
            }
        });
    });

    // Smart form validation (if forms exist)
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const email = this.value;
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (email && !isValid) {
                this.classList.add('invalid');
                showNotification('Please enter a valid email address.', 'error');
            } else {
                this.classList.remove('invalid');
            }
        });
    });

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-item, .process-step, .testimonial-card, .trust-stat').forEach(el => {
        observer.observe(el);
    });

    // Enhanced mobile touch feedback
    if ('ontouchstart' in window) {
        document.querySelectorAll('.cta-button, .feature-item, .process-step').forEach(el => {
            el.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });

            el.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }

    // Performance monitoring
    let lastScrollTime = 0;
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime > 16) { // Throttle to ~60fps
            // Update scroll-dependent elements
            lastScrollTime = now;
        }
    });

    // Welcome message
    setTimeout(() => {
        showNotification('👋 Welcome! Explore our premium packaging solutions.', 'info');
    }, 3000);
}

// INITIALIZE EVERYTHING
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCarousel();
    const storage = initLocalStorage();
    storage.updateUI();
    initAdmin();
    initKeyboardNavigation();
    initFAQ();
    initEnhancedUX();
});
