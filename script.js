/* ╔══════════════════════════════════════════════════════════════╗
   ║  NIRAV Institute – Interactive Scripts                       ║
   ║  Particles, Scroll Animations, Counters, FAQ, Navigation    ║
   ╚══════════════════════════════════════════════════════════════╝ */

(function () {
    'use strict';

    // ═══════════════════ PRELOADER ═══════════════════
    let preloaderDismissed = false;
    function hidePreloader() {
        if (preloaderDismissed) return;
        preloaderDismissed = true;
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            document.body.style.overflow = '';
            initParticles();
        }
    }

    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 800);
    } else {
        window.addEventListener('load', function () {
            setTimeout(hidePreloader, 1000);
        });
        // Safety fallback: maximum 2.5 seconds wait
        setTimeout(hidePreloader, 2500);
    }

    // ═══════════════════ NAVBAR ═══════════════════
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll behavior
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const currentScroll = window.scrollY;

        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;

        // WhatsApp FAB visibility
        const whatsappFab = document.getElementById('whatsappFab');
        if (whatsappFab) {
            if (currentScroll > 400) {
                whatsappFab.classList.add('visible');
            } else {
                whatsappFab.classList.remove('visible');
            }
        }

        // Back to top visibility
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (currentScroll > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Active nav link on scroll
        updateActiveNavLink();
    }, { passive: true });

    // Hamburger menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Close menu on link click
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Back to top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ═══════════════════ SCROLL REVEAL ANIMATIONS ═══════════════════
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    // ═══════════════════ COUNTER ANIMATION ═══════════════════
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
        counterObserver.observe(counter);
    });

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = easedProgress * target;

            if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    el.textContent = target.toFixed(1) + suffix;
                } else {
                    el.textContent = target + suffix;
                }
            }
        }

        requestAnimationFrame(update);
    }

    // ═══════════════════ COURSE TABS ═══════════════════
    const courseTabs = document.querySelectorAll('.course-tab');
    const coursePanels = document.querySelectorAll('.course-panel');

    courseTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Update tabs
            courseTabs.forEach(function (t) { t.classList.remove('active'); });
            this.classList.add('active');

            // Update panels
            coursePanels.forEach(function (panel) {
                panel.classList.remove('active');
            });

            var targetPanel = document.getElementById('panel-' + targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ═══════════════════ FAQ ACCORDION ═══════════════════
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function () {
                var isActive = item.classList.contains('active');

                // Close all
                faqItems.forEach(function (faq) {
                    faq.classList.remove('active');
                    var btn = faq.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });

                // Open clicked (if wasn't active)
                if (!isActive) {
                    item.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // ═══════════════════ ENQUIRY FORM ═══════════════════
    var enquiryForm = document.getElementById('enquiryForm');
    var formSuccess = document.getElementById('formSuccess');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            var name = document.getElementById('form-name');
            var phone = document.getElementById('form-phone');

            if (!name.value.trim()) {
                shakeElement(name.closest('.form-input-wrapper'));
                name.focus();
                return;
            }

            if (!phone.value.trim() || phone.value.trim().length < 10) {
                shakeElement(phone.closest('.form-input-wrapper'));
                phone.focus();
                return;
            }

            // Simulate form submission
            var submitBtn = enquiryForm.querySelector('.btn-submit');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Submitting...</span>';
            submitBtn.disabled = true;

            setTimeout(function () {
                enquiryForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.removeAttribute('hidden');
                    formSuccess.style.display = 'block';
                }
            }, 1500);
        });
    }

    function shakeElement(el) {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = 'shake 0.5s ease';
        el.style.borderColor = '#ef4444';

        setTimeout(function () {
            el.style.borderColor = '';
            el.style.animation = '';
        }, 1500);
    }

    // Add shake animation CSS dynamically
    var shakeStyle = document.createElement('style');
    shakeStyle.textContent = '@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }';
    document.head.appendChild(shakeStyle);

    // ═══════════════════ PARTICLE CANVAS ═══════════════════
    function initParticles() {
        var canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var particleCount = 50;
        var animationId;

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.isGold = Math.random() > 0.7;
        }

        Particle.prototype.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        };

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            if (this.isGold) {
                ctx.fillStyle = 'rgba(255, 184, 0, ' + this.opacity + ')';
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
            }
            ctx.fill();
        };

        // Create particles
        for (var i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        var opacity = (1 - distance / 120) * 0.1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(255, 184, 0, ' + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(function (p) {
                p.update();
                p.draw();
            });

            drawConnections();
            animationId = requestAnimationFrame(animate);
        }

        animate();

        // Pause when not visible
        var heroObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (!animationId) animate();
                } else {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            });
        }, { threshold: 0 });

        heroObserver.observe(canvas);
    }

    // ═══════════════════ SMOOTH SCROLL FOR CTA LINKS ═══════════════════
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
