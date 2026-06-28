/* ============================================
   まちハロ - まちだハロウィンフェス
   JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCountdown();
    initScrollAnimations();
    initNavbar();
});

/* ========== Particle System (Bats & Stars) ========== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const PARTICLE_COUNT = 60;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.type = Math.random() < 0.3 ? 'bat' : 'star';
            this.size = this.type === 'bat'
                ? Math.random() * 12 + 8
                : Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * (this.type === 'bat' ? 1.2 : 0.15);
            this.speedY = this.type === 'bat'
                ? -(Math.random() * 0.5 + 0.2)
                : -(Math.random() * 0.1 + 0.02);
            this.opacity = Math.random() * 0.4 + 0.1;
            this.baseOpacity = this.opacity;
            this.twinkleSpeed = Math.random() * 0.03 + 0.01;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.wingPhase = Math.random() * Math.PI * 2;
            this.wingSpeed = Math.random() * 0.08 + 0.05;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.twinklePhase += this.twinkleSpeed;
            this.wingPhase += this.wingSpeed;

            if (this.type === 'star') {
                this.opacity = this.baseOpacity + Math.sin(this.twinklePhase) * 0.15;
            }

            if (this.type === 'bat') {
                this.x += Math.sin(this.twinklePhase) * 0.5;
            }

            // Wrap around
            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) {
                this.y = canvas.height + 20;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.globalAlpha = this.opacity;

            if (this.type === 'star') {
                // Draw twinkling star
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 2
                );
                gradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
                gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)');
                gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fill();

                // Star center
                ctx.fillStyle = '#FFFDE7';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Draw bat silhouette
                const wingFlap = Math.sin(this.wingPhase) * 0.4;
                const s = this.size;

                ctx.fillStyle = '#1A1A2E';
                ctx.save();
                ctx.translate(this.x, this.y);

                // Body
                ctx.beginPath();
                ctx.ellipse(0, 0, s * 0.25, s * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();

                // Left wing
                ctx.beginPath();
                ctx.moveTo(-s * 0.15, -s * 0.1);
                ctx.quadraticCurveTo(-s * 0.7, -s * (0.6 + wingFlap), -s * 1, -s * 0.15);
                ctx.quadraticCurveTo(-s * 0.6, s * 0.1, -s * 0.15, s * 0.1);
                ctx.fill();

                // Right wing
                ctx.beginPath();
                ctx.moveTo(s * 0.15, -s * 0.1);
                ctx.quadraticCurveTo(s * 0.7, -s * (0.6 + wingFlap), s * 1, -s * 0.15);
                ctx.quadraticCurveTo(s * 0.6, s * 0.1, s * 0.15, s * 0.1);
                ctx.fill();

                // Ears
                ctx.beginPath();
                ctx.moveTo(-s * 0.12, -s * 0.35);
                ctx.lineTo(-s * 0.2, -s * 0.6);
                ctx.lineTo(-s * 0.02, -s * 0.4);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(s * 0.12, -s * 0.35);
                ctx.lineTo(s * 0.2, -s * 0.6);
                ctx.lineTo(s * 0.02, -s * 0.4);
                ctx.fill();

                // Eyes
                ctx.fillStyle = '#FF6B35';
                ctx.beginPath();
                ctx.arc(-s * 0.08, -s * 0.15, s * 0.05, 0, Math.PI * 2);
                ctx.arc(s * 0.08, -s * 0.15, s * 0.05, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }

            ctx.globalAlpha = 1;
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            p.update();
            p.draw();
        }
        requestAnimationFrame(animate);
    }

    animate();
}

/* ========== Countdown Timer ========== */
function initCountdown() {
    // Target date: October 25, 2026 (Sunday) 10:00 AM JST
    const targetDate = new Date('2026-10-25T10:00:00+09:00');

    const daysEl = document.getElementById('moon-cd-days');

    if (!daysEl) return;

    function update() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            daysEl.textContent = '0';
            return;
        }

        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        // Animate number changes
        if (daysEl.textContent !== String(days)) {
            daysEl.style.transform = 'scale(1.15)';
            daysEl.textContent = days;
            setTimeout(() => {
                daysEl.style.transform = 'scale(1)';
            }, 150);
        }
    }

    update();
    setInterval(update, 1000 * 60); // Check every minute
}

/* ========== Scroll Animations ========== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-animate');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ========== Navbar ========== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('open');
        });

        // Close on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('open');
            }
        });
    }

    // Smooth scroll for anchor links
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = navbar.offsetHeight + 10;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });
}
