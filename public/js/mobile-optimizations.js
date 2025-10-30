// Mobile-specific optimizations and enhancements
(function() {
    'use strict';

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Add mobile class to body for CSS targeting
    if (isMobile || isTouch) {
        document.body.classList.add('mobile-device');
    }

    // Optimize images for mobile
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for better performance
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add error handling for broken images
            img.addEventListener('error', function() {
                this.src = '/images/placeholder.png';
                this.alt = 'Image not available';
            });
        });
    }

    // Improve touch interactions
    function enhanceTouchInteractions() {
        // Add touch feedback to interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .nav-link, .card, .filter');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    // Optimize navbar for mobile
    function optimizeNavbar() {
        const navbar = document.querySelector('.navbar');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (!navbar || !navbarToggler || !navbarCollapse) return;

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 991 && 
                navbarCollapse.classList.contains('show') && 
                !navbar.contains(e.target)) {
                navbarToggler.click();
            }
        });

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 991 && navbarCollapse.classList.contains('show')) {
                    setTimeout(() => navbarToggler.click(), 100);
                }
            });
        });
    }

    // Optimize scroll behavior
    function optimizeScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Hide/show navbar on scroll (mobile only)
        if (isMobile) {
            let lastScrollTop = 0;
            const navbar = document.querySelector('.navbar');
            
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    navbar.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
            }, { passive: true });
        }
    }

    // Optimize form inputs for mobile
    function optimizeForms() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Prevent zoom on focus for iOS
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                input.addEventListener('focus', function() {
                    this.style.fontSize = '16px';
                });
            }
            
            // Add better touch targets
            input.style.minHeight = '44px';
        });
    }

    // Optimize card interactions
    function optimizeCards() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            // Add ripple effect on touch
            card.addEventListener('touchstart', function(e) {
                const ripple = document.createElement('div');
                ripple.classList.add('ripple');
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.touches[0].clientX - rect.left - size / 2;
                const y = e.touches[0].clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(177, 151, 252, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Add CSS for ripple animation
    function addRippleCSS() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .mobile-device .navbar {
                transition: transform 0.3s ease;
            }
            
            .mobile-device .btn,
            .mobile-device .nav-link,
            .mobile-device .card {
                transition: transform 0.1s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Performance optimization: Intersection Observer for lazy loading
    function setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Initialize all optimizations when DOM is ready
    function init() {
        optimizeImages();
        if (isTouch) {
            enhanceTouchInteractions();
            optimizeCards();
        }
        optimizeNavbar();
        optimizeScrolling();
        optimizeForms();
        addRippleCSS();
        setupIntersectionObserver();
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Recalculate viewport height for mobile browsers
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        }, 100);
    });

    // Set initial viewport height
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

})();