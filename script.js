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
        whatsapp: '+91 9652960041',
        phone: '+91 9652960041',
        email: 'chappaHemanthk@gmail.com',
        address: 'Suchitra,Hyderabad city,Telangana 500055',
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

        // Update floating contact buttons
        const whatsappBtn = document.getElementById('floating-whatsapp-btn');
        const callBtn = document.getElementById('floating-call-btn');

        if (whatsappBtn) {
            whatsappBtn.href = `https://wa.me/${data.whatsapp.replace(/\D/g, '')}`;
        }
        if (callBtn) {
            callBtn.href = `tel:${data.phone}`;
        }

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

// MOBILE COMPATIBILITY IMPROVEMENTS
function initMobileCompatibility() {
    // Fix viewport height issues on mobile Safari
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Better mobile scrolling
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Improve mobile performance
    let ticking = false;
    function updateMobileOptimizations() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Mobile-specific optimizations can go here
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateMobileOptimizations, { passive: true });
    window.addEventListener('touchmove', updateMobileOptimizations, { passive: true });

    // Detect mobile devices for specific behaviors
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('is-mobile');
    }

    // Handle iOS Safari bottom bar
    if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
        document.body.classList.add('ios-safari');
    }
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

// MOBILE MENU FUNCTIONALITY
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileMenuToggle || !navOverlay || !mobileNav) return;

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isActive = mobileMenuToggle.classList.contains('active');

        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        navOverlay.classList.add('active');
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navOverlay.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking overlay
    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            // Small delay to allow menu to close before navigation
            setTimeout(() => {
                const sectionId = link.getAttribute('href').substring(1);
                showSection(sectionId);
                history.pushState(null, null, `#${sectionId}`);
            }, 300);
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuToggle.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Update mobile nav active state
    function updateMobileNavActive() {
        const currentSection = location.hash.substring(1) || 'home';
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Update on navigation changes
    window.addEventListener('hashchange', updateMobileNavActive);
    updateMobileNavActive();
}

// INITIALIZE EVERYTHING
document.addEventListener('DOMContentLoaded', () => {
    initMobileCompatibility();
    initNavigation();
    initCarousel();
    const storage = initLocalStorage();
    storage.updateUI();
    initAdmin();
    initKeyboardNavigation();
    initFAQ();
    initEnhancedUX();
    initMobileMenu();
});
