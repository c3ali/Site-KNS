document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initParticles();
    initScrollReveal();
    initCounters();
    initContactForm();
    initSectorTabs();
    initRefsCarousel();
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    navItems.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.isCyan = Math.random() > 0.6;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.isCyan
                ? `rgba(30, 77, 92, ${this.opacity})`
                : `rgba(244, 162, 97, ${this.opacity})`;
            ctx.fill();
        }
    }

    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.12;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(244, 162, 97, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            if (mouse.x && mouse.y) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const opacity = (1 - dist / 200) * 0.25;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(30, 77, 92, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.floor(target * eased);
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target;
                        }
                    }
                    requestAnimationFrame(update);
                });
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = `Envoi en cours...`;
        btn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                btn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Message envoyé !
                `;
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                form.reset();
            } else {
                btn.innerHTML = `Erreur, réessayez`;
                btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            }
        } catch {
            btn.innerHTML = `Erreur, réessayez`;
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}

function initSectorTabs() {
    const tabs = document.querySelectorAll('.sector-tab');
    const contents = document.querySelectorAll('.sector-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sector = tab.getAttribute('data-sector');

            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = document.getElementById('sector-' + sector);
            if (target) target.classList.add('active');
        });
    });
}

function initRefsCarousel() {
    const carousel = document.querySelector('.refs-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.refs-track');
    const cards = carousel.querySelectorAll('.ref-card');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    let currentIndex = 0;
    let visibleCards = 4;

    function updateVisibleCards() {
        if (window.innerWidth <= 480) {
            visibleCards = 1;
        } else if (window.innerWidth <= 768) {
            visibleCards = 2;
        } else if (window.innerWidth <= 1024) {
            visibleCards = 3;
        } else {
            visibleCards = 4;
        }
    }

    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 20;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= cards.length - visibleCards;
    }

    updateVisibleCards();
    updateCarousel();

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - visibleCards) {
            currentIndex++;
            updateCarousel();
        }
    });

    window.addEventListener('resize', () => {
        updateVisibleCards();
        currentIndex = Math.min(currentIndex, cards.length - visibleCards);
        updateCarousel();
    });
}